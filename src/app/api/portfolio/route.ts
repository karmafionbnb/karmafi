import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";

export const dynamic = "force-dynamic";

// Real portfolio data for a wallet, from the DB. On-chain token balances are
// read client-side (the browser can reach the BNB RPC and the user's wallet).
export async function GET(req: NextRequest) {
  try {
    const wallet = (req.nextUrl.searchParams.get("wallet") || "").toLowerCase();
    if (!wallet) {
      return NextResponse.json({ error: "Missing wallet" }, { status: 400 });
    }

    const markets = await Database.getMarkets();
    const created = markets.filter((m) => (m.curatorWallet || "").toLowerCase() === wallet);
    const trades = await Database.getTradesByWallet(wallet);
    const claims = (await Database.getClaims()).filter(
      (c) => (c.walletAddress || "").toLowerCase() === wallet
    );

    return NextResponse.json({ success: true, markets, created, trades, claims });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to load portfolio" }, { status: 500 });
  }
}
