import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, marketAddress } = await req.json();
    if (!walletAddress || !marketAddress) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const user = await Database.getUserByWallet(walletAddress);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAdded = await Database.toggleWatchlist(user.id, marketAddress);
    return NextResponse.json({ success: true, isAdded });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to toggle watchlist" }, { status: 500 });
  }
}
