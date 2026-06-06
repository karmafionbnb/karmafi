import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";

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

    // Simulate claims creation in DB
    const claim = {
      id: "claim-" + Math.random().toString(36).substr(2, 9),
      sourceHash,
      redditUsername: `u/${cleanRedditUsername}`,
      walletAddress,
      status: "APPROVED" as const,
      proofReference: signature, // Using signature as proof
      claimedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      amount: (market.marketCap * 0.05).toFixed(4) // 5% of market cap as initial mock creator reward payout
    };

    await Database.createClaim(claim);
    await Database.updateClaimStatus(sourceHash, "APPROVED", walletAddress);

    return NextResponse.json({
      success: true,
      claim
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to process creator claim" }, { status: 500 });
  }
}
