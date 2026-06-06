import { NextRequest, NextResponse } from "next/server";
import { fetchRedditMetadata, getAiTokenSuggestions, generateSourceHash } from "@/lib/reddit";
import { Database } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    // 1. Parse URL & fetch live Reddit metadata
    const metadata = await fetchRedditMetadata(url);
    const sourceHash = metadata.sourceHash || generateSourceHash(metadata.permalink);

    // 2. Check duplicate launch
    const existingMarket = await Database.getMarketBySourceHash(sourceHash);
    const isLaunched = existingMarket !== null;

    // 3. AI Token recommendations
    const suggestions = getAiTokenSuggestions(metadata.title, metadata.subreddit);

    return NextResponse.json({
      success: true,
      metadata: {
        ...metadata,
        sourceHash
      },
      isLaunched,
      existingMarketAddress: existingMarket?.marketAddress || null,
      suggestions
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to parse Reddit URL" }, { status: 500 });
  }
}
