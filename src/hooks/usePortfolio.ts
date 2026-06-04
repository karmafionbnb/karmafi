export function usePortfolioSummary() {
  return {
    totalValue: 12450.50,
    totalValueBnb: 45.2,
    openPositionsCount: 12,
    claimableRewards: 150.25,
    marketsCreated: 3,
    reputationScore: 85,
    isLoading: false,
  };
}

export function usePortfolioHoldings() {
  const holdings = [
    {
      id: "1",
      marketAddress: "0x123...",
      marketSymbol: "DOGE_MOON",
      marketName: "Will Dogecoin hit $1 in 2026?",
      tokenType: "YES",
      quantity: 500,
      avgEntryPrice: 0.15,
      currentPrice: 0.22,
      totalValue: 110,
      unrealizedPnl: 35,
      unrealizedPnlPercent: 46.67,
      change24h: 5.2
    },
    {
      id: "2",
      marketAddress: "0x456...",
      marketSymbol: "BTC_100K",
      marketName: "Bitcoin to $100k before July?",
      tokenType: "NO",
      quantity: 1000,
      avgEntryPrice: 0.40,
      currentPrice: 0.35,
      totalValue: 350,
      unrealizedPnl: -50,
      unrealizedPnlPercent: -12.5,
      change24h: -2.1
    },
    {
      id: "3",
      marketAddress: "0x789...",
      marketSymbol: "AI_REG",
      marketName: "US AI Regulation passed in 2026?",
      tokenType: "YES",
      quantity: 200,
      avgEntryPrice: 0.80,
      currentPrice: 0.95,
      totalValue: 190,
      unrealizedPnl: 30,
      unrealizedPnlPercent: 18.75,
      change24h: 12.4
    }
  ];
  return { holdings, isLoading: false };
}

export function usePortfolioPnl() {
  const pnlHistory = [
    { date: "May 1", value: 10000 },
    { date: "May 5", value: 10200 },
    { date: "May 10", value: 9800 },
    { date: "May 15", value: 10500 },
    { date: "May 20", value: 11200 },
    { date: "May 25", value: 10900 },
    { date: "May 30", value: 12450 }
  ];
  
  return {
    history: pnlHistory,
    realizedPnl: 1250,
    unrealizedPnl: 15,
    feesPaid: 45,
    rewardsEarned: 150,
    netPnl: 1370,
    isLoading: false
  };
}

export function useCreatedMarkets() {
  const markets = [
    {
      id: "m1",
      name: "Will GPT-5 release in 2026?",
      symbol: "GPT5_2026",
      liquidity: 45000,
      volume24h: 12000,
      status: "ACTIVE",
      feesEarned: 120,
      createdAt: "2026-05-10T10:00:00Z"
    }
  ];
  return { markets, isLoading: false };
}

export function useCuratedMarkets() {
  const curated = [
    {
      id: "c1",
      sourceHash: "0xabc...",
      platform: "Reddit",
      title: "r/wallstreetbets sentiment on GME",
      viralityScore: 92,
      marketsLinked: 2,
      curationRewards: 45.5,
      status: "VERIFIED"
    }
  ];
  return { curated, isLoading: false };
}

export function usePortfolioRewards() {
  const rewards = [
    {
      id: "r1",
      type: "TRADING_FEE_REBATE",
      amount: 25.5,
      token: "KARMA",
      status: "CLAIMABLE",
      date: "2026-06-01T12:00:00Z"
    },
    {
      id: "r2",
      type: "CURATION_REWARD",
      amount: 124.75,
      token: "KARMA",
      status: "CLAIMABLE",
      date: "2026-06-02T08:30:00Z"
    },
    {
      id: "r3",
      type: "MARKET_CREATION_FEE",
      amount: 50.0,
      token: "BNB",
      status: "CLAIMED",
      date: "2026-05-20T15:45:00Z"
    }
  ];
  return { rewards, isLoading: false };
}

export function usePortfolioTransactions() {
  const transactions = [
    {
      id: "tx1",
      hash: "0xdef123...",
      type: "BUY",
      market: "DOGE_MOON",
      tokenType: "YES",
      amount: 500,
      price: 0.15,
      totalValue: 75,
      date: "2026-06-01T14:20:00Z",
      status: "CONFIRMED"
    },
    {
      id: "tx2",
      hash: "0xdef456...",
      type: "SELL",
      market: "BTC_100K",
      tokenType: "NO",
      amount: 200,
      price: 0.45,
      totalValue: 90,
      date: "2026-05-28T09:15:00Z",
      status: "CONFIRMED"
    }
  ];
  return { transactions, isLoading: false };
}

export function usePortfolioWatchlist() {
  const watchlist = [
    {
      id: "w1",
      marketAddress: "0x999...",
      symbol: "ETH_ETF",
      name: "Will ETH ETF be approved by August?",
      currentYesPrice: 0.65,
      currentNoPrice: 0.35,
      volume24h: 150000,
      liquidity: 500000,
      change24h: 15.5
    }
  ];
  return { watchlist, isLoading: false };
}

export function useCreatorClaims() {
  const claims = [
    {
      id: "cl1",
      redditUsername: "u/deepfuckingvalue",
      marketSymbol: "GME_SQUEEZE",
      status: "PENDING_VERIFICATION",
      claimAmount: 5000,
      dateSubmitted: "2026-06-02T10:00:00Z"
    }
  ];
  return { claims, isLoading: false };
}
