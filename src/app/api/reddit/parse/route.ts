import { NextRequest, NextResponse } from "next/server";
import { getAiTokenSuggestions, generateSourceHash } from "@/lib/reddit";
import { Database } from "@/lib/db";

export const dynamic = "force-dynamic";

const MODERATION_TRIGGER_WORDS = ["hatespeech", "minor", "doxx", "csam", "gore"];

// Receives Reddit post data fetched client-side (browser/JSONP), since Reddit
// blocks server/datacenter IPs. Computes the canonical sourceHash, applies
// moderation, checks for duplicates, and returns token suggestions.
export async function POST(req: NextRequest) {
  try {
    const { post } = await req.json();

    if (!post || !post.permalink || !post.title) {
      return NextResponse.json(
        { error: "Missing Reddit post data. Please paste a valid post URL." },
        { status: 400 }
      );
    }

    if (post.nsfw) {
      return NextResponse.json(
        { error: "Moderation block: NSFW posts cannot be used to launch a market." },
        { status: 400 }
      );
    }
    if (post.removed) {
      return NextResponse.json(
        { error: "This Reddit post has been removed and cannot be used." },
        { status: 400 }
      );
    }
    const haystack = `${post.title} ${post.subreddit || ""}`.toLowerCase();
    for (const word of MODERATION_TRIGGER_WORDS) {
      if (haystack.includes(word)) {
        return NextResponse.json(
          { error: `Moderation block: this post violates platform safety guidelines (flagged: ${word}).` },
          { status: 400 }
        );
      }
    }

    const sourceHash = generateSourceHash(post.permalink);
    const existing = await Database.getMarketBySourceHash(sourceHash);
    const suggestions = getAiTokenSuggestions(post.title, post.subreddit || "");

    return NextResponse.json({
      success: true,
      metadata: {
        redditPostId: post.redditPostId || "unknown",
        subreddit: post.subreddit || "r/all",
        author: post.author || "unknown",
        title: post.title,
        permalink: post.permalink,
        thumbnail: post.thumbnail ?? null,
        upvotes: Number(post.upvotes) || 0,
        comments: Number(post.comments) || 0,
        nsfw: Boolean(post.nsfw),
        sourceHash,
      },
      isLaunched: existing !== null,
      existingMarketAddress: existing?.marketAddress || null,
      suggestions,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to process Reddit post" }, { status: 500 });
  }
}
