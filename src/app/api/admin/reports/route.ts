import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/db";

// Fetch all reports
export async function GET() {
  try {
    const reports = Database.getReports();
    return NextResponse.json({ success: true, reports });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch reports" }, { status: 500 });
  }
}

// Create or update report
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, reason, details, reporterWallet, marketId, adminNotes } = body;

    // Resolve or dismiss an existing report
    if (action === "RESOLVE" || action === "DISMISS") {
      if (!id) {
        return NextResponse.json({ error: "Missing report ID" }, { status: 400 });
      }
      Database.resolveReport(id, action, adminNotes || "Actioned by admin");
      return NextResponse.json({ success: true });
    }

    // Submit new report
    if (!marketId || !reporterWallet || !reason) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const report = {
      id: "report-" + Math.random().toString(36).substr(2, 9),
      marketId,
      reporterWallet,
      reason,
      details: details || "",
      status: "OPEN" as const,
      adminNotes: null,
      createdAt: new Date().toISOString()
    };

    Database.createReport(report);

    // Increase risk warning on market (decrease virality score)
    const market = Database.getMarketByAddress(marketId);
    if (market) {
      const activeReports = Database.getReports().filter(r => r.marketId === market.id && r.status === "OPEN").length;
      // Recalculate virality score to apply penalty
      Database.updateMarket(market.marketAddress, {
        viralityScore: Math.max(market.viralityScore - activeReports * 10, 0)
      });
    }

    return NextResponse.json({ success: true, report });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to action report" }, { status: 500 });
  }
}
