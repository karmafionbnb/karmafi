import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";
import { isAdminRequest } from "@/lib/web3/auth";
import { getServerWeb3 } from "@/lib/web3/server";
import { CREATOR_VAULT_ABI } from "@/lib/web3/contracts";
import { formatEther } from "viem";

export const dynamic = "force-dynamic";

// Admin-only: review a PENDING creator claim and release accrued vault rewards
// on-chain to the verified creator's wallet. Gated by an admin wallet signature.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sourceHash, action } = body;

    if (!(await isAdminRequest(body))) {
      return NextResponse.json({ error: "Admin authorization required." }, { status: 401 });
    }
    if (!sourceHash) {
      return NextResponse.json({ error: "Missing sourceHash" }, { status: 400 });
    }

    const claims = await Database.getClaims();
    const claim = claims.find((c) => c.sourceHash === sourceHash);
    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    if (action === "REJECT") {
      await Database.updateClaimStatus(sourceHash, "REJECTED", claim.walletAddress);
      return NextResponse.json({ success: true, status: "REJECTED" });
    }

    // Approve + pay out.
    const { publicClient, walletClient, account, contracts } = getServerWeb3();
    if (!contracts?.creatorClaimVault || !walletClient || !account) {
      return NextResponse.json({ error: "Server payout wallet not configured (set PRIVATE_KEY)." }, { status: 500 });
    }

    const vault = contracts.creatorClaimVault;
    const pending = (await publicClient.readContract({
      address: vault,
      abi: CREATOR_VAULT_ABI,
      functionName: "pendingRewards",
      args: [sourceHash as `0x${string}`],
    })) as bigint;

    let payoutTx: string | null = null;
    if (pending > 0n) {
      payoutTx = await walletClient.writeContract({
        address: vault,
        abi: CREATOR_VAULT_ABI,
        functionName: "claimCreatorRewards",
        args: [sourceHash as `0x${string}`, claim.walletAddress as `0x${string}`, claim.redditUsername],
      });
      await publicClient.waitForTransactionReceipt({ hash: payoutTx as `0x${string}` });
    }

    await Database.updateClaimStatus(sourceHash, "APPROVED", claim.walletAddress);

    return NextResponse.json({
      success: true,
      status: "APPROVED",
      paidBnb: formatEther(pending),
      payoutTx,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.shortMessage || e?.message || "Failed to process claim" }, { status: 500 });
  }
}
