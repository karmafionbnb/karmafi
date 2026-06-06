import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";
import { calculateViralityScore } from "@/lib/virality";
import { fetchRedditMetadata } from "@/lib/reddit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { permalink, name, symbol, curatorWallet, metadataUri } = await req.json();

    if (!permalink || !name || !symbol || !curatorWallet) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Re-verify the post against Reddit server-side. Never trust client-supplied
    // title/upvotes/author/sourceHash — derive the authoritative values here so
    // markets can't be launched with spoofed stats or for removed/NSFW posts.
    let meta;
    try {
      meta = await fetchRedditMetadata(permalink);
    } catch (e: any) {
      return NextResponse.json(
        { error: e.message || "Could not verify the Reddit post." },
        { status: 400 }
      );
    }
    const sourceHash = meta.sourceHash;

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

    // Calculate initial virality score from verified Reddit stats
    const viralityScore = calculateViralityScore({
      upvotes: meta.upvotes,
      comments: meta.comments,
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
      redditPostId: meta.redditPostId,
      subreddit: meta.subreddit,
      author: meta.author,
      title: meta.title,
      permalink: meta.permalink,
      thumbnail: meta.thumbnail,
      upvotes: meta.upvotes,
      comments: meta.comments
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
