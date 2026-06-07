import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";
import { getServerWeb3 } from "@/lib/web3/server";
import { CREATOR_VAULT_ABI } from "@/lib/web3/contracts";
import { formatEther } from "viem";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const claims = await Database.getClaims();
    return NextResponse.json({ success: true, claims });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch claims" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sourceHash, redditUsername, walletAddress, signature } = await req.json();

    if (!sourceHash || !redditUsername || !walletAddress || !signature) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const market = await Database.getMarketBySourceHash(sourceHash);
    if (!market) {
      return NextResponse.json({ error: "No market exists for this Reddit post" }, { status: 404 });
    }

    if (market.creatorWallet) {
      return NextResponse.json({ error: "Creator rewards have already been claimed for this market" }, { status: 400 });
    }

    // Verify username hash or author username match (simulated verify for MVP)
    const cleanRedditUsername = redditUsername.toLowerCase().replace(/^u\//, "");
    const cleanPostAuthor = market.author.toLowerCase().replace(/^u\//, "");
    
    if (cleanRedditUsername !== cleanPostAuthor) {
      return NextResponse.json({ error: "The authenticated Reddit user does not match the original poster of the thread" }, { status: 403 });
    }

    // Pay out accrued creator rewards on-chain from the CreatorClaimVault.
    // The vault's claim is owner-only, so the platform's owner key (server)
    // releases the funds to the verified creator's wallet.
    let payoutAmount = "0";
    let payoutTx: string | null = null;
    let payoutNote: string | undefined;
    try {
      const { publicClient, walletClient, account, contracts } = getServerWeb3();
      if (contracts?.creatorClaimVault && walletClient && account) {
        const vault = contracts.creatorClaimVault;
        const pending = (await publicClient.readContract({
          address: vault,
          abi: CREATOR_VAULT_ABI,
          functionName: "pendingRewards",
          args: [sourceHash as `0x${string}`],
        })) as bigint;

        if (pending > 0n) {
          payoutTx = await walletClient.writeContract({
            address: vault,
            abi: CREATOR_VAULT_ABI,
            functionName: "claimCreatorRewards",
            args: [sourceHash as `0x${string}`, walletAddress as `0x${string}`, `u/${cleanRedditUsername}`],
          });
          await publicClient.waitForTransactionReceipt({ hash: payoutTx as `0x${string}` });
          payoutAmount = formatEther(pending);
        } else {
          payoutNote = "Verified. No trading-fee rewards have accrued yet — they'll be claimable here as your market trades.";
        }
      } else {
        payoutNote = "Verified and recorded. On-chain vault payout isn't configured on the server yet.";
      }
    } catch (e: any) {
      // Don't fail the whole claim if the on-chain transfer hiccups; record the
      // verified link and surface the issue.
      payoutNote = `Verified, but the on-chain payout failed: ${e?.shortMessage || e?.message || "unknown error"}. It can be retried.`;
    }

    const claim = {
      id: "claim-" + Math.random().toString(36).substr(2, 9),
      sourceHash,
      redditUsername: `u/${cleanRedditUsername}`,
      walletAddress,
      status: "APPROVED" as const,
      proofReference: payoutTx || signature,
      claimedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      amount: payoutAmount,
    };

    await Database.createClaim(claim);
    await Database.updateClaimStatus(sourceHash, "APPROVED", walletAddress);

    return NextResponse.json({
      success: true,
      claim,
      payoutTx,
      note: payoutNote,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to process creator claim" }, { status: 500 });
  }
}
