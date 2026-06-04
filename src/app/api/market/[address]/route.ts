import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";

interface RouteParams {
  params: Promise<{
    address: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { address } = await params;
    if (!address) {
      return NextResponse.json({ error: "Missing address" }, { status: 400 });
    }

    const market = Database.getMarketByAddress(address);
    if (!market) {
      return NextResponse.json({ error: "Market not found" }, { status: 404 });
    }

    const trades = Database.getTrades(market.id);
    const candles = Database.getCandles(market.id);

    return NextResponse.json({
      success: true,
      market,
      trades,
      candles
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch market details" }, { status: 500 });
  }
}
