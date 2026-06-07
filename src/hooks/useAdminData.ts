"use client";

import { useQuery } from "@tanstack/react-query";

// Real admin data from the DB-backed APIs. Features without backing data yet
// (suspicious-launch scoring, duplicate detection, disputes, takedowns,
// on-chain event indexing, audit logs) return empty until those systems exist.

function useReportsQuery() {
  return useQuery<any[]>({
    queryKey: ["admin", "reports"],
    queryFn: async () => {
      const r = await fetch("/api/admin/reports");
      const d = await r.json();
      return d.success ? d.reports : [];
    },
  });
}

function useMarketsQuery() {
  return useQuery<any[]>({
    queryKey: ["admin", "markets"],
    queryFn: async () => {
      const r = await fetch("/api/admin/markets");
      const d = await r.json();
      return d.success ? d.markets : [];
    },
  });
}

function useClaimsQuery() {
  return useQuery<any[]>({
    queryKey: ["admin", "claims"],
    queryFn: async () => {
      const r = await fetch("/api/creator/claim");
      const d = await r.json();
      return d.success ? d.claims : [];
    },
  });
}

export function useAdminOverview() {
  const reports = useReportsQuery();
  const markets = useMarketsQuery();
  const claims = useClaimsQuery();
  const r = reports.data || [];
  const m = markets.data || [];
  const c = claims.data || [];
  return {
    openReports: r.filter((x) => x.status === "OPEN").length,
    pendingClaims: c.filter((x) => x.status === "PENDING").length,
    suspiciousLaunches: 0,
    hiddenMarkets: m.filter((x) => x.status === "HIDDEN").length,
    pausedMarkets: m.filter((x) => x.status === "FLAGGED").length,
    unprocessedEvents: 0,
    takedownRequests: 0,
    highRiskMarkets: m.filter((x) => (x.viralityScore || 0) < 20).length,
    isLoading: reports.isLoading || markets.isLoading || claims.isLoading,
  };
}

export function useAdminReports() {
  const q = useReportsQuery();
  const reports = (q.data || []).map((x: any) => ({
    id: x.id,
    market: x.marketId,
    ticker: "",
    source: "",
    reason: x.reason,
    reporterWallet: x.reporterWallet,
    reportCount: 1,
    severity: "—",
    status: x.status,
    date: x.createdAt,
  }));
  return { reports, isLoading: q.isLoading };
}

export function useAdminCreatorClaims() {
  const q = useClaimsQuery();
  const claims = (q.data || []).map((x: any) => ({
    id: x.id,
    market: x.sourceHash,
    sourcePost: "",
    redditUsernameHash: x.redditUsername,
    claimWallet: x.walletAddress,
    verificationMethod: "Reddit bio",
    claimAmount: parseFloat(x.amount) || 0,
    status: x.status,
    date: x.createdAt,
  }));
  return { claims, isLoading: q.isLoading };
}

export function useAdminHiddenMarkets() {
  const q = useMarketsQuery();
  const hidden = (q.data || [])
    .filter((m: any) => m.status === "HIDDEN")
    .map((m: any) => ({
      market: m.title,
      ticker: m.symbol,
      reason: "Hidden by moderator",
      hiddenBy: "Admin",
      date: m.createdAt,
      relatedId: m.marketAddress,
      status: "Hidden from frontend",
    }));
  return { hidden, isLoading: q.isLoading };
}

export function useAdminPausedMarkets() {
  const q = useMarketsQuery();
  const paused = (q.data || [])
    .filter((m: any) => m.status === "FLAGGED")
    .map((m: any) => ({
      market: m.title,
      tokenAddress: m.tokenAddress,
      contractAddress: m.marketAddress,
      pauseReason: "Flagged by moderator",
      pausedBy: "Admin",
      pauseTxHash: "",
      status: "Flagged",
      date: m.createdAt,
    }));
  return { paused, isLoading: q.isLoading };
}

// Features without backing data yet — return empty (no fake rows).
export function useAdminSuspiciousLaunches() {
  return { launches: [] as any[], isLoading: false };
}
export function useAdminDuplicatePosts() {
  return { duplicates: [] as any[], isLoading: false };
}
export function useAdminCreatorDisputes() {
  return { disputes: [] as any[], isLoading: false };
}
export function useAdminTakedownRequests() {
  return { requests: [] as any[], isLoading: false };
}
export function useAdminContractEvents() {
  return { events: [] as any[], isLoading: false };
}
export function useAdminAuditLogs() {
  return { logs: [] as any[], isLoading: false };
}

export function useAdminSettings() {
  return {
    sandboxAlphaStatus: true,
    maintenanceMode: false,
    autoHideThreshold: 50,
    suspiciousLaunchRiskThreshold: 80,
    duplicateDetectionStrictness: "High",
    isLoading: false,
  };
}
