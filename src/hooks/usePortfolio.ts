"use client";

import { useAccount, usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { formatEther } from "viem";
import { ATTENTION_TOKEN_ABI, pricePerToken } from "@/lib/web3/contracts";

type Addr = `0x${string}`;

interface PortfolioApi {
  markets: any[];
  created: any[];
  trades: any[];
  claims: any[];
}

interface Position {
  market: any;
  quantity: number;
  currentPriceBnb: number;
  totalValueBnb: number;
  avgEntryBnb: number;
}

// Shared base: one portfolio fetch + one BNB/USD fetch + on-chain holdings,
// deduped across all the tab hooks via React Query.
function useBase() {
  const { address } = useAccount();
  const wallet = address ? address.toLowerCase() : undefined;
  const publicClient = usePublicClient();

  const portfolioQ = useQuery<PortfolioApi>({
    queryKey: ["portfolio", wallet],
    enabled: !!wallet,
    queryFn: async () => {
      const r = await fetch(`/api/portfolio?wallet=${wallet}`);
      const d = await r.json();
      if (!d.success) throw new Error(d.error || "Failed to load portfolio");
      return { markets: d.markets, created: d.created, trades: d.trades, claims: d.claims };
    },
  });

  const bnbUsdQ = useQuery<number>({
    queryKey: ["bnbusd"],
    staleTime: 60_000,
    queryFn: async () => {
      try {
        const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd");
        const j = await r.json();
        const p = Number(j?.binancecoin?.usd);
        if (p > 0) return p;
      } catch { /* fall through */ }
      const r2 = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT");
      const j2 = await r2.json();
      return Number(j2?.price) || 0;
    },
  });

  const data = portfolioQ.data;
  const bnbUsd = bnbUsdQ.data || 0;

  const holdingsQ = useQuery<Position[]>({
    queryKey: ["holdings", wallet, data?.markets?.length],
    enabled: !!wallet && !!publicClient && !!data?.markets,
    queryFn: async () => {
      const positions: Position[] = [];
      // Average entry price per market from the user's own BUY trades.
      const buys: Record<string, { bnb: number; tok: number }> = {};
      for (const t of data!.trades) {
        if (t.type !== "BUY") continue;
        const b = buys[t.marketId] || { bnb: 0, tok: 0 };
        b.bnb += parseFloat(t.bnbAmount) || 0;
        b.tok += parseFloat(t.tokenAmount) || 0;
        buys[t.marketId] = b;
      }
      for (const m of data!.markets) {
        try {
          const token = m.tokenAddress as Addr;
          const [supply, bal] = await Promise.all([
            publicClient!.readContract({ address: token, abi: ATTENTION_TOKEN_ABI, functionName: "totalSupply" }) as Promise<bigint>,
            publicClient!.readContract({ address: token, abi: ATTENTION_TOKEN_ABI, functionName: "balanceOf", args: [wallet as Addr] }) as Promise<bigint>,
          ]);
          const quantity = Number(formatEther(bal));
          if (quantity <= 0) continue;
          const currentPriceBnb = Number(formatEther(pricePerToken(supply)));
          const b = buys[m.id];
          const avgEntryBnb = b && b.tok > 0 ? b.bnb / b.tok : currentPriceBnb;
          positions.push({ market: m, quantity, currentPriceBnb, totalValueBnb: quantity * currentPriceBnb, avgEntryBnb });
        } catch { /* wrong chain / missing token -> skip */ }
      }
      return positions;
    },
  });

  return {
    wallet,
    data,
    bnbUsd,
    positions: holdingsQ.data || [],
    isLoading: portfolioQ.isLoading || holdingsQ.isLoading,
  };
}

export function usePortfolioSummary() {
  const { data, positions, bnbUsd, isLoading } = useBase();
  const totalValueBnb = positions.reduce((s, p) => s + p.totalValueBnb, 0);
  const claimableBnb = (data?.claims || []).reduce((s: number, c: any) => s + (parseFloat(c.amount) || 0), 0);
  return {
    totalValue: totalValueBnb * (bnbUsd || 0),
    totalValueBnb,
    openPositionsCount: positions.length,
    claimableRewards: claimableBnb * (bnbUsd || 0),
    marketsCreated: data?.created?.length || 0,
    reputationScore: 50,
    isLoading,
  };
}

export function usePortfolioHoldings() {
  const { positions, bnbUsd, isLoading } = useBase();
  const holdings = positions.map((p, i) => {
    const unrealizedBnb = (p.currentPriceBnb - p.avgEntryBnb) * p.quantity;
    const pct = p.avgEntryBnb > 0 ? ((p.currentPriceBnb - p.avgEntryBnb) / p.avgEntryBnb) * 100 : 0;
    return {
      id: String(i),
      marketAddress: p.market.marketAddress,
      marketSymbol: p.market.symbol,
      marketName: p.market.title,
      tokenType: p.market.symbol,
      quantity: p.quantity,
      avgEntryPrice: p.avgEntryBnb * (bnbUsd || 0),
      currentPrice: p.currentPriceBnb * (bnbUsd || 0),
      totalValue: p.totalValueBnb * (bnbUsd || 0),
      unrealizedPnl: unrealizedBnb * (bnbUsd || 0),
      unrealizedPnlPercent: pct,
      change24h: 0,
    };
  });
  return { holdings, isLoading };
}

export function usePortfolioPnl() {
  const { data, positions, bnbUsd } = useBase();
  const unrealizedBnb = positions.reduce((s, p) => s + (p.currentPriceBnb - p.avgEntryBnb) * p.quantity, 0);
  // Realized BNB flow from recorded trades (sells in, buys out).
  let realizedBnb = 0;
  let feesBnb = 0;
  for (const t of data?.trades || []) {
    const bnb = parseFloat(t.bnbAmount) || 0;
    realizedBnb += t.type === "SELL" ? bnb : -bnb;
    feesBnb += bnb * 0.01;
  }
  const rewardsBnb = (data?.claims || []).reduce((s: number, c: any) => s + (parseFloat(c.amount) || 0), 0);
  const u = bnbUsd || 0;
  return {
    history: [],
    realizedPnl: realizedBnb * u,
    unrealizedPnl: unrealizedBnb * u,
    feesPaid: feesBnb * u,
    rewardsEarned: rewardsBnb * u,
    netPnl: (realizedBnb + unrealizedBnb + rewardsBnb) * u,
    isLoading: false,
  };
}

export function useCreatedMarkets() {
  const { data, bnbUsd, isLoading } = useBase();
  const markets = (data?.created || []).map((m: any) => ({
    id: m.id,
    name: m.title,
    symbol: m.symbol,
    liquidity: (m.marketCap || 0) * (bnbUsd || 0),
    volume24h: (m.volume24h || 0) * (bnbUsd || 0),
    status: m.status,
    feesEarned: (m.volume24h || 0) * 0.01 * 0.25 * (bnbUsd || 0),
    createdAt: m.createdAt,
  }));
  return { markets, isLoading };
}

export function useCuratedMarkets() {
  const { data, bnbUsd, isLoading } = useBase();
  const curated = (data?.created || []).map((m: any) => ({
    id: m.id,
    sourceHash: m.sourceHash,
    platform: "Reddit",
    title: m.title,
    viralityScore: m.viralityScore || 0,
    marketsLinked: 1,
    curationRewards: (m.volume24h || 0) * 0.01 * 0.25 * (bnbUsd || 0),
    status: m.creatorWallet ? "CREATOR CLAIMED" : "ACTIVE",
  }));
  return { curated, isLoading };
}

export function usePortfolioRewards() {
  const { data, bnbUsd, isLoading } = useBase();
  const rewards = (data?.claims || []).map((c: any, i: number) => ({
    id: c.id || String(i),
    type: "CREATOR_VAULT",
    amount: (parseFloat(c.amount) || 0) * (bnbUsd || 0),
    token: "USD",
    status: parseFloat(c.amount) > 0 ? "CLAIMED" : "PENDING",
    date: c.claimedAt || c.createdAt,
  }));
  return { rewards, isLoading };
}

export function usePortfolioTransactions() {
  const { data, bnbUsd, isLoading } = useBase();
  const transactions = (data?.trades || []).map((t: any) => {
    const market = (data?.markets || []).find((m: any) => m.id === t.marketId);
    return {
      id: t.id,
      hash: t.txHash,
      type: t.type,
      market: market?.symbol || "—",
      tokenType: market?.symbol || "",
      amount: parseFloat(t.tokenAmount) || 0,
      price: (parseFloat(t.price) || 0) * (bnbUsd || 0),
      totalValue: (parseFloat(t.bnbAmount) || 0) * (bnbUsd || 0),
      date: t.createdAt,
      status: "CONFIRMED",
    };
  });
  return { transactions, isLoading };
}

export function usePortfolioWatchlist() {
  // Watchlist is tracked client-side in the wallet context; surfaced there.
  return { watchlist: [] as any[], isLoading: false };
}

export function useCreatorClaims() {
  const { data, bnbUsd, isLoading } = useBase();
  const claims = (data?.claims || []).map((c: any, i: number) => {
    const market = (data?.markets || []).find((m: any) => m.sourceHash === c.sourceHash);
    return {
      id: c.id || String(i),
      redditUsername: c.redditUsername,
      marketSymbol: market?.symbol || "—",
      status: c.status === "APPROVED" ? "VERIFIED" : c.status,
      claimAmount: (parseFloat(c.amount) || 0) * (bnbUsd || 0),
      dateSubmitted: c.createdAt,
    };
  });
  return { claims, isLoading };
}
