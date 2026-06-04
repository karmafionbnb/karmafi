// TODO: Replace all mock admin data with backend API calls (e.g., GET /api/admin/reports)
// TODO: Enforce server-side RBAC before production.

export function useAdminOverview() {
  return {
    openReports: 24,
    pendingClaims: 9,
    suspiciousLaunches: 12,
    hiddenMarkets: 5,
    pausedMarkets: 2,
    unprocessedEvents: 17,
    takedownRequests: 4,
    highRiskMarkets: 8,
    isLoading: false,
  };
}

export function useAdminReports() {
  const reports = [
    {
      id: "R-101",
      market: "Will GPT-5 release in 2026?",
      ticker: "GPT5_2026",
      source: "r/artificial",
      reason: "Spam",
      reporterWallet: "0x111...222",
      reportCount: 3,
      severity: "Low",
      status: "New",
      date: "2026-06-03T10:00:00Z",
    },
    {
      id: "R-102",
      market: "Super Bowl LXI Winner?",
      ticker: "SB_LXI",
      source: "r/nfl",
      reason: "Scam / fraud",
      reporterWallet: "0x333...444",
      reportCount: 15,
      severity: "Critical",
      status: "Under Review",
      date: "2026-06-02T15:30:00Z",
    },
  ];
  return { reports, isLoading: false };
}

export function useAdminSuspiciousLaunches() {
  const launches = [
    {
      id: "L-201",
      market: "Doge to $1?",
      ticker: "DOGE_1",
      curatorWallet: "0x999...000",
      source: "r/dogecoin",
      launchTime: "2026-06-03T09:15:00Z",
      riskScore: 85,
      riskReasons: ["New wallet", "High wash trading"],
      status: "Auto-flagged",
    },
    {
      id: "L-202",
      market: "Election 2026",
      ticker: "ELEC_26",
      curatorWallet: "0xAAA...BBB",
      source: "r/politics",
      launchTime: "2026-06-03T08:00:00Z",
      riskScore: 45,
      riskReasons: ["Similar to existing"],
      status: "Under Review",
    }
  ];
  return { launches, isLoading: false };
}

export function useAdminDuplicatePosts() {
  const duplicates = [
    {
      id: "D-301",
      redditPostId: "t3_xyz123",
      sourceHash: "0xabcdef...",
      existingMarket: "GME Short Squeeze",
      attemptedMarket: "GME Squeeze 2.0",
      similarityScore: 98,
      status: "Duplicate Blocked",
      date: "2026-06-03T11:00:00Z"
    }
  ];
  return { duplicates, isLoading: false };
}

export function useAdminCreatorClaims() {
  const claims = [
    {
      id: "C-401",
      market: "Reddit IPO Performance",
      sourcePost: "r/wallstreetbets",
      redditUsernameHash: "user_a1b2c3",
      claimWallet: "0x777...888",
      verificationMethod: "OAuth",
      claimAmount: 1250.50,
      status: "Pending Verification",
      date: "2026-06-02T14:20:00Z"
    }
  ];
  return { claims, isLoading: false };
}

export function useAdminCreatorDisputes() {
  const disputes = [
    {
      id: "D-501",
      market: "AI Legislation",
      claimantWallet: "0x555...666",
      disputeType: "Multiple users claiming",
      priority: "High",
      status: "Open",
      date: "2026-06-01T10:00:00Z",
      assignedAdmin: "Admin_1"
    }
  ];
  return { disputes, isLoading: false };
}

export function useAdminTakedownRequests() {
  const requests = [
    {
      id: "TR-601",
      market: "NSFW Token",
      requesterType: "Internal moderator",
      reason: "NSFW or minors",
      evidence: "Screenshot linked",
      priority: "Critical",
      status: "Action Taken",
      date: "2026-06-01T09:00:00Z"
    }
  ];
  return { requests, isLoading: false };
}

export function useAdminHiddenMarkets() {
  const hidden = [
    {
      market: "Scam Token X",
      ticker: "SCAM_X",
      reason: "Fraudulent",
      hiddenBy: "Admin_2",
      date: "2026-05-28T16:00:00Z",
      relatedId: "R-099",
      status: "Hidden from frontend"
    }
  ];
  return { hidden, isLoading: false };
}

export function useAdminPausedMarkets() {
  const paused = [
    {
      market: "Exploit Token",
      tokenAddress: "0xabc...",
      contractAddress: "0xdef...",
      pauseReason: "Contract vulnerability",
      pausedBy: "SuperAdmin_1",
      pauseTxHash: "0x123456789...",
      status: "Paused",
      date: "2026-05-20T12:00:00Z"
    }
  ];
  return { paused, isLoading: false };
}

export function useAdminContractEvents() {
  const events = [
    {
      id: "E-801",
      eventType: "MarketCreated",
      contract: "0x123...",
      market: "ETH_ETF",
      txHash: "0x99999999...",
      blockNumber: 34567890,
      status: "Processed",
      processedAt: "2026-06-03T11:05:00Z"
    },
    {
      id: "E-802",
      eventType: "CreatorRewardAssigned",
      contract: "0x456...",
      market: "GME_SQUEEZE",
      txHash: "0x88888888...",
      blockNumber: 34567900,
      status: "Failed",
      processedAt: "2026-06-03T11:10:00Z"
    }
  ];
  return { events, isLoading: false };
}

export function useAdminAuditLogs() {
  const logs = [
    {
      id: "AL-901",
      admin: "0xAdmin...1",
      role: "Moderator",
      actionType: "Market hidden",
      targetType: "Market",
      targetId: "0x123...",
      previousState: "Visible",
      newState: "Hidden",
      reason: "Confirmed scam",
      timestamp: "2026-06-03T11:30:00Z"
    }
  ];
  return { logs, isLoading: false };
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
