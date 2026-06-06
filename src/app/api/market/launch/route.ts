import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";
import { calculateViralityScore } from "@/lib/virality";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const {
      sourceHash,
      redditPostId,
      subreddit,
      author,
      title,
      permalink,
      thumbnail,
      upvotes,
      comments,
      name,
      symbol,
      curatorWallet,
      metadataUri
    } = await req.json();

    if (!sourceHash || !name || !symbol || !curatorWallet) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Double check duplicate
    const existing = await Database.getMarketBySourceHash(sourceHash);
    if (existing) {
      return NextResponse.json({ error: "Market already exists for this post", marketAddress: existing.marketAddress }, { status: 400 });
    }

    // Generate simulated smart contract addresses for MVP
    const hash = sourceHash.substring(2);
    const tokenAddress = "0x" + hash.substring(0, 40);
    const marketAddress = "0x" + hash.substring(20, 60);

    // Calculate initial virality score
    const viralityScore = calculateViralityScore({
      upvotes: parseInt(upvotes || 0),
      comments: parseInt(comments || 0),
      createdAt: new Date().toISOString(),
      volume24h: 0,
      holdersCount: 1,
      isCreatorVerified: false,
      reportCount: 0
    });

    const marketData = {
      id: "market-" + Math.random().toString(36).substr(2, 9),
      sourceHash,
      tokenAddress,
      marketAddress,
      creatorWallet: null,
      curatorWallet,
      metadataUri: metadataUri || "ipfs://QmDefaultMetadataUri",
      status: "ACTIVE" as const,
      viralityScore,
      marketCap: 0.1, // Initial bonding curve market cap in BNB
      volume24h: 0,
      holdersCount: 1,
      createdAt: new Date().toISOString(),
      name,
      symbol,
      redditPostId: redditPostId || "unknown",
      subreddit: subreddit || "r/all",
      author: author || "unknown",
      title,
      permalink,
      thumbnail: thumbnail || null,
      upvotes: parseInt(upvotes || 0),
      comments: parseInt(comments || 0)
    };

    await Database.createMarket(marketData);

    return NextResponse.json({
      success: true,
      tokenAddress,
      marketAddress,
      marketId: marketData.id
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to launch market" }, { status: 500 });
  }
}
