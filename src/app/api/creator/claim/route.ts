import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";
import { verifyWalletSignature } from "@/lib/web3/auth";

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

    // Verify the request is signed by the payout wallet (proves the submitter
    // controls it — payouts can't be redirected to someone else's address).
    // The client signs with the bare username (no "u/" prefix).
    const expectedMessage = `Claim rewards for Reddit post ${sourceHash} as user ${redditUsername.replace(/^u\//, "")} to wallet ${walletAddress}`;
    const sigOk = await verifyWalletSignature(expectedMessage, signature, walletAddress);
    if (!sigOk) {
      return NextResponse.json({ error: "Invalid wallet signature." }, { status: 401 });
    }

    // SECURITY: Reddit ownership is verified in the browser (the server can't
    // reach Reddit), which a direct API call could bypass. So claims are NOT
    // auto-paid. They're recorded as PENDING and a platform admin releases the
    // on-chain vault funds after review (see /api/admin/creator-claim).
    const claim = {
      id: "claim-" + Math.random().toString(36).substr(2, 9),
      sourceHash,
      redditUsername: `u/${cleanRedditUsername}`,
      walletAddress,
      status: "PENDING" as const,
      proofReference: signature,
      claimedAt: null,
      createdAt: new Date().toISOString(),
      amount: "0",
    };

    await Database.createClaim(claim);

    return NextResponse.json({
      success: true,
      claim,
      note: "Your claim was submitted and verified. A moderator will review and release your accrued rewards on-chain.",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to process creator claim" }, { status: 500 });
  }
}
