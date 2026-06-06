import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { marketAddress, status } = await req.json();

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
