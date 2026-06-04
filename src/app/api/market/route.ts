import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const sort = searchParams.get("sort") || "hot";
    const search = searchParams.get("search") || "";

    let markets = Database.getMarkets();

    // 1. Search filter
    if (search) {
      const q = search.toLowerCase();
      markets = markets.filter(
        m =>
          m.name.toLowerCase().includes(q) ||
          m.symbol.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.subreddit.toLowerCase().includes(q)
      );
    }

    // 2. Sort sorting logic
    if (sort === "new") {
      markets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === "top") {
      markets.sort((a, b) => b.marketCap - a.marketCap);
    } else if (sort === "volume") {
      markets.sort((a, b) => b.volume24h - a.volume24h);
    } else if (sort === "rising") {
      markets.sort((a, b) => b.viralityScore - a.viralityScore);
    } else {
      // Hot: combined metric of virality + volume + marketcap
      markets.sort((a, b) => {
        const scoreA = a.viralityScore * 0.7 + a.volume24h * 10 + a.marketCap;
        const scoreB = b.viralityScore * 0.7 + b.volume24h * 10 + b.marketCap;
        return scoreB - scoreA;
      });
    }

    return NextResponse.json({ success: true, markets });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch markets" }, { status: 500 });
  }
}
