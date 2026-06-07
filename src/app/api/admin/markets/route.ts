import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";
import { isAdminRequest } from "@/lib/web3/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const markets = await Database.getAllMarketsIncludingHidden();
    return NextResponse.json({ success: true, markets });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch markets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { marketAddress, status } = body;

    if (!(await isAdminRequest(body))) {
      return NextResponse.json({ error: "Admin authorization required." }, { status: 401 });
    }
    if (!marketAddress || !status) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    if (!["ACTIVE", "HIDDEN", "FLAGGED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    await Database.updateMarket(marketAddress, { status });
    return NextResponse.json({ success: true, updatedStatus: status });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update market status" }, { status: 500 });
  }
}
