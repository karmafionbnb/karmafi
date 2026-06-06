import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";

interface RouteParams {
  params: Promise<{
    address: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { address } = await params;
    if (!address) {
      return NextResponse.json({ error: "Missing address" }, { status: 400 });
    }

    const market = await Database.getMarketByAddress(address);
    if (!market) {
      return NextResponse.json({ error: "Market not found" }, { status: 404 });
    }

    const trades = await Database.getTrades(market.id);
    const candles = await Database.getCandles(market.id);

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
