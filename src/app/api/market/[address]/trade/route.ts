import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";
import { calculateViralityScore } from "@/lib/virality";

interface RouteParams {
  params: Promise<{
    address: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { address } = await params;
    const { traderWallet, type, bnbAmount, tokenAmount, price, txHash: realTxHash } = await req.json();

    if (!address || !traderWallet || !type || !bnbAmount || !tokenAmount || !price) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const market = await Database.getMarketByAddress(address);
    if (!market) {
      return NextResponse.json({ error: "Market not found" }, { status: 404 });
    }

    // 1. Save the real on-chain trade.
    const txHash = realTxHash || ("0x" + "0".repeat(64));
    const tradeData = {
      id: "trade-" + Math.random().toString(36).substr(2, 9),
      marketId: market.id,
      traderWallet,
      type: type as "BUY" | "SELL",
      bnbAmount: bnbAmount.toString(),
      tokenAmount: tokenAmount.toString(),
      price: price.toString(),
      txHash,
      createdAt: new Date().toISOString()
    };

    await Database.addTrade(tradeData);

    // 2. Recalculate stats from real recorded trades.
    let newMarketCap = market.marketCap;
    if (type === "BUY") {
      newMarketCap += parseFloat(bnbAmount);
    } else {
      newMarketCap = Math.max(market.marketCap - parseFloat(bnbAmount), 0);
    }

    const newVolume = market.volume24h + parseFloat(bnbAmount);

    // Holders = distinct wallets that have traded this market (real proxy).
    const allTrades = await Database.getTrades(market.id);
    const newHolders = new Set(allTrades.map((t) => t.traderWallet.toLowerCase())).size;

    // Recalculate virality score
    const newVirality = calculateViralityScore({
      upvotes: market.upvotes,
      comments: market.comments,
      createdAt: market.createdAt,
      volume24h: newVolume,
      holdersCount: newHolders,
      isCreatorVerified: market.creatorWallet !== null,
      reportCount: 0 // Mock report count for recalculation
    });

    await Database.updateMarket(market.marketAddress, {
      marketCap: parseFloat(newMarketCap.toFixed(4)),
      volume24h: parseFloat(newVolume.toFixed(4)),
      holdersCount: newHolders,
      viralityScore: newVirality
    });

    return NextResponse.json({
      success: true,
      trade: tradeData,
      updatedMarket: {
        marketCap: newMarketCap,
        volume24h: newVolume,
        holdersCount: newHolders,
        viralityScore: newVirality
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to record trade" }, { status: 500 });
  }
}
