import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";
import { calculateViralityScore } from "@/lib/virality";
import { generateSourceHash } from "@/lib/reddit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const {
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
      metadataUri,
    } = await req.json();

    if (!permalink || !title || !name || !symbol || !curatorWallet) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Reddit blocks server IPs, so the post is fetched in the browser and the
    // metadata is supplied here. We compute the canonical sourceHash server-side
    // from the permalink (so it can't be forged to dodge the duplicate check).
    const sourceHash = generateSourceHash(permalink);

    // Double check duplicate
    const existing = await Database.getMarketBySourceHash(sourceHash);
    if (existing) {
      return NextResponse.json({ error: "Market already exists for this post", marketAddress: existing.marketAddress }, { status: 400 });
    }

    // Placeholder addresses until on-chain deployment (Stage D) wires the real
    // factory-created token/market contract addresses.
    const hash = sourceHash.substring(2);
    const tokenAddress = "0x" + hash.substring(0, 40);
    const marketAddress = "0x" + hash.substring(20, 60);

    const up = parseInt(upvotes) || 0;
    const com = parseInt(comments) || 0;
    const viralityScore = calculateViralityScore({
      upvotes: up,
      comments: com,
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
      upvotes: up,
      comments: com
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
