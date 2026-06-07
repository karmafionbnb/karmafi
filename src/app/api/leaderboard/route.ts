import { NextResponse } from "next/server";
import { Database } from "@/lib/db";

export const dynamic = "force-dynamic";

// Aggregate real leaderboard data from markets + trades.
export async function GET() {
  try {
    const markets = await Database.getMarkets();
    const trades = await Database.getAllTrades();

    // Curators: grouped by curator wallet across markets they launched.
    const byCurator: Record<string, { wallet: string; marketsLaunched: number; volumeBnb: number }> = {};
    for (const m of markets) {
      const w = (m.curatorWallet || "").toLowerCase();
      if (!w) continue;
      if (!byCurator[w]) byCurator[w] = { wallet: m.curatorWallet, marketsLaunched: 0, volumeBnb: 0 };
      byCurator[w].marketsLaunched += 1;
      byCurator[w].volumeBnb += m.volume24h || 0;
    }
    const curators = Object.values(byCurator)
      .map((c) => ({ ...c, earnedBnb: c.volumeBnb * 0.01 * 0.25 })) // 25% of the 1% fee
      .sort((a, b) => b.earnedBnb - a.earnedBnb)
      .slice(0, 10);

    // Traders: grouped by trader wallet across all trades.
    const byTrader: Record<string, { wallet: string; trades: number; volumeBnb: number; netBnb: number }> = {};
    for (const t of trades) {
      const w = t.traderWallet.toLowerCase();
      if (!byTrader[w]) byTrader[w] = { wallet: t.traderWallet, trades: 0, volumeBnb: 0, netBnb: 0 };
      const bnb = parseFloat(t.bnbAmount) || 0;
      byTrader[w].trades += 1;
      byTrader[w].volumeBnb += bnb;
      byTrader[w].netBnb += t.type === "SELL" ? bnb : -bnb; // realized BNB flow proxy
    }
    const traders = Object.values(byTrader)
      .sort((a, b) => b.volumeBnb - a.volumeBnb)
      .slice(0, 10);

    const topMarkets = [...markets]
      .sort((a, b) => (b.viralityScore || 0) - (a.viralityScore || 0))
      .slice(0, 8);

    return NextResponse.json({ success: true, curators, traders, markets: topMarkets });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to build leaderboard" }, { status: 500 });
  }
}
