import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();
    if (!walletAddress) {
      return NextResponse.json({ error: "Missing walletAddress parameter" }, { status: 400 });
    }

    const user = await Database.createUser(walletAddress);
    return NextResponse.json({ success: true, user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to sync user" }, { status: 500 });
  }
}
