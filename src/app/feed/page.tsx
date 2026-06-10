"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Flame, ShieldCheck, ChevronDown, Award, TrendingUp, RefreshCw, Search,
  ArrowRight
} from "lucide-react";
import { useWallet } from "@/context/wallet";
import { parseEther, formatEther } from "viem";
import { pricePerToken, supplyForReserve, explorerAddress } from "@/lib/web3/contracts";
import { useChainId } from "wagmi";

// We will fetch real markets from the API instead of using MOCK_MARKETS

function fmtUsd(usd: number): string {
  if (!usd || usd <= 0) return "$0.00";
  if (usd >= 1) return `$${usd.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  if (usd >= 0.01) return `$${usd.toFixed(4)}`;
  return `$${usd.toLocaleString("en-US", { maximumFractionDigits: 8 })}`;
}

// Derive a token's BNB price from its accumulated BNB reserve (market cap).
function priceFromMarketCapBnb(marketCapBnb: number): number {
  try {
    const reserveWei = parseEther(String(marketCapBnb || 0));
    const supply = supplyForReserve(reserveWei);
    return Number(formatEther(pricePerToken(supply)));
  } catch {
    return 0;
  }
}

function FeedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chainId = useChainId();
  const initialSearch = searchParams.get("search") || "";
  const [quickUrl, setQuickUrl] = useState("");

  const { isConnected, connect, toggleWatchlist, watchlist, updateBnbBalance, updateTokenBalance } = useWallet();
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("hot"); // hot, new, rising, top
  const [selectedSubreddit, setSelectedSubreddit] = useState<string | null>(null);
  const [searchText, setSearchText] = useState(initialSearch);
  const [sortOption, setSortOption] = useState("volume");

  // Quick swap modals / indicators
  const [swapMarket, setSwapMarket] = useState<any | null>(null);
  const [swapAmount, setSwapAmount] = useState("0.1");
  const [isSwapping, setIsSwapping] = useState(false);

  const [bnbUsd, setBnbUsd] = useState(0);
  const [summary, setSummary] = useState({
    totalMarkets: 0,
    volumeBnb: 0,
    curators: 0,
    creatorVaultBnb: 0,
    holders: 0,
    rising: [] as { symbol: string; virality: number; marketAddress: string }[],
    topCurators: [] as { wallet: string; vol: number }[],
  });

  // Live BNB/USD (CoinGecko, Binance fallback)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd");
        const j = await r.json();
        const p = Number(j?.binancecoin?.usd);
        if (!cancelled && p > 0) { setBnbUsd(p); return; }
        throw new Error("no price");
      } catch {
        try {
          const r2 = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT");
          const j2 = await r2.json();
          const p2 = Number(j2?.price);
          if (!cancelled && p2 > 0) setBnbUsd(p2);
        } catch { /* keep 0 -> BNB fallback */ }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const usd = (bnb: number) => (bnbUsd > 0 ? fmtUsd(bnb * bnbUsd) : `${(bnb || 0).toFixed(4)} BNB`);

  const fetchMarkets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/market?sort=${sortOption}&search=${encodeURIComponent(searchText)}`);
      const data = await res.json();
      const full: any[] = data.success ? data.markets : [];

      // Protocol-wide stats from the real market set.
      const curatorVol: Record<string, number> = {};
      let volumeBnb = 0;
      let holders = 0;
      for (const m of full) {
        volumeBnb += m.volume24h || 0;
        holders += m.holdersCount || 0;
        const w = (m.curatorWallet || "").toLowerCase();
        if (w) curatorVol[w] = (curatorVol[w] || 0) + (m.volume24h || 0);
      }
      setSummary({
        totalMarkets: full.length,
        volumeBnb,
        curators: Object.keys(curatorVol).length,
        creatorVaultBnb: volumeBnb * 0.01 * 0.3, // 30% of the 1% trading fee
        holders,
        rising: [...full]
          .sort((a, b) => (b.viralityScore || 0) - (a.viralityScore || 0))
          .slice(0, 5)
          .map((m) => ({ symbol: m.symbol, virality: m.viralityScore || 0, marketAddress: m.marketAddress || "" })),
        topCurators: Object.entries(curatorVol)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([wallet, vol]) => ({ wallet, vol })),
      });

      let list = full;
      if (selectedSubreddit) {
        list = list.filter((m: any) => m.subreddit.toLowerCase() === selectedSubreddit.toLowerCase());
      }

      // Map DB fields to UI fields (price derived from the on-chain curve)
      list = list.map((m: any) => ({
        ...m,
        timeAgo: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "Just now",
        excerpt: `Trending discussion on ${m.subreddit}`,
        priceBnb: priceFromMarketCapBnb(m.marketCap),
        creatorClaimed: !!m.creatorWallet,
        holders: m.holdersCount || 0
      }));

      setMarkets(list);
    } catch (e) {
      console.error("Failed to load feed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, [activeTab, selectedSubreddit, searchText, sortOption]);

  const handleQuickSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!swapMarket || !isConnected) return;
    setIsSwapping(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulating network
      const numericBnb = parseFloat(swapAmount);
      const tokenPrice = swapMarket.price || 0.001;
      const tokensOut = numericBnb / tokenPrice;

      updateBnbBalance(-numericBnb);
      updateTokenBalance(swapMarket.tokenAddress, tokensOut);
      
      fetchMarkets();
      setSwapMarket(null);
    } catch (e) {
      console.error("Swap execution failed", e);
    } finally {
      setIsSwapping(false);
    }
  };

  const subreddits = [
    { name: "r/all", value: null, color: "bg-gray-400" },
    { name: "r/technology", value: "r/technology", color: "bg-blue-400" },
    { name: "r/gaming", value: "r/gaming", color: "bg-purple-400" },
    { name: "r/wallstreetbets", value: "r/wallstreetbets", color: "bg-green-400" },
    { name: "r/cryptocurrency", value: "r/cryptocurrency", color: "bg-yellow-400" },
    { name: "r/science", value: "r/science", color: "bg-teal-400" },
    { name: "r/startups", value: "r/startups", color: "bg-orange-400" },
    { name: "r/artificial", value: "r/artificial", color: "bg-cyan-400" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-tertiary)]">
      <Navbar />

      {/* Page Header */}
      <div className="bg-[var(--surface-primary)] border-b border-[var(--border-subtle)]">
        <div className="mx-auto max-w-[1320px] px-6 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-[40px] md:text-[48px] font-[900] text-[var(--text-primary)] leading-tight tracking-tight">
                Explore Karma Markets
              </h1>
              <p className="mt-2 text-[16px] md:text-[18px] text-[var(--text-secondary)] max-w-2xl font-medium">
                Discover live Reddit attention markets, track rising momentum, and trade social signals before the crowd arrives.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <form
                onSubmit={(e) => { e.preventDefault(); if (quickUrl.trim()) router.push(`/launch?url=${encodeURIComponent(quickUrl.trim())}`); }}
                className="hidden md:flex relative w-64"
              >
                <input
                  type="text"
                  value={quickUrl}
                  onChange={(e) => setQuickUrl(e.target.value)}
                  placeholder="Paste Reddit URL..."
                  className="w-full h-12 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-secondary)] pl-4 pr-10 text-sm font-medium focus:border-[#FF6B1A] focus:outline-none placeholder:text-[var(--text-muted)]"
                />
                <button type="submit" className="absolute right-2 top-2 h-8 w-8 flex items-center justify-center rounded-full bg-[var(--ink-solid)] text-white hover:bg-[#FF6B1A] transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
              <Link
                href="/launch"
                className="flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] px-6 text-[15px] font-extrabold text-white shadow-[0_4px_14px_rgba(255,107,26,0.3)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Launch Market
              </Link>
            </div>
          </div>
          
          {/* Header Stats Row */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)] p-5 shadow-sm">
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Total Markets</div>
              <div className="text-2xl font-black text-[var(--text-primary)]">{summary.totalMarkets}</div>
            </div>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)] p-5 shadow-sm">
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">24h Volume</div>
              <div className="text-2xl font-black text-[var(--text-primary)]">{usd(summary.volumeBnb)}</div>
            </div>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)] p-5 shadow-sm">
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Active Curators</div>
              <div className="text-2xl font-black text-[var(--text-primary)]">{summary.curators.toLocaleString()}</div>
            </div>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)] p-5 shadow-sm">
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Creator Vault Paid</div>
              <div className="text-2xl font-black text-[var(--text-primary)]">{usd(summary.creatorVaultBnb)}</div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1320px] px-6 py-10 flex-1 min-h-[800px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-6 sticky top-24 h-max">
            
            {/* Attention Categories */}
            <div className="rounded-[22px] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Attention Categories</h3>
              <div className="flex flex-col gap-1.5">
                {subreddits.map((sub, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSubreddit(sub.value)}
                    className={`flex items-center justify-between w-full text-left rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                      (selectedSubreddit === sub.value)
                        ? "bg-[var(--tint-orange)] text-[#FF6B1A]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`h-2 w-2 rounded-full ${sub.color}`} />
                      {sub.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Market Filters */}
            <div className="rounded-[22px] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Filters</h3>
              <div className="flex flex-col gap-1.5">
                {["Hot", "New", "Rising", "Top", "Creator Claimed", "High Volume", "BNB Ecosystem"].map((filter, i) => (
                  <label key={i} className="flex items-center gap-3 px-2 py-1.5 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-[var(--border-subtle)] text-[#FF6B1A] focus:ring-[#FF6B1A]/20" />
                    <span className="text-sm font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{filter}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ecosystem Stats */}
            <div className="rounded-[22px] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Ecosystem</h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)] font-bold">BNB RPC Status</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-[var(--tint-success)] px-2.5 py-1 text-[11px] font-extrabold text-[#19C37D]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#19C37D] animate-pulse" />
                    Connected
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)] font-bold">Active Holders</span>
                  <span className="font-extrabold text-[var(--text-primary)]">{summary.holders.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
          </aside>

          {/* CENTER FEED */}
          <section className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto bg-[var(--surface-primary)] rounded-full p-1 border border-[var(--border-subtle)] shadow-sm">
                {["Hot", "New", "Rising", "Top"].map((tab) => {
                  const isActive = activeTab === tab.toLowerCase();
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] text-white shadow-sm"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-56">
                  <input
                    type="text"
                    placeholder="Search markets..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full rounded-full border border-[var(--border-subtle)] bg-[var(--surface-primary)] pl-10 pr-4 py-2.5 text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#FF6B1A] focus:outline-none shadow-sm"
                  />
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
                </div>
                
                <div className="relative shrink-0">
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="appearance-none rounded-full border border-[var(--border-subtle)] bg-[var(--surface-primary)] pl-4 pr-10 py-2.5 text-sm font-bold text-[var(--text-primary)] focus:border-[#FF6B1A] focus:outline-none shadow-sm cursor-pointer"
                  >
                    <option value="volume">Volume</option>
                    <option value="virality">Virality</option>
                    <option value="marketCap">Market Cap</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-3.5 h-3.5 w-3.5 text-[var(--text-secondary)] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Markets List */}
            <div className="flex flex-col gap-5">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-secondary)] p-6 animate-pulse h-64" />
                ))
              ) : markets.length === 0 ? (
                (() => {
                  const isFiltered = !!searchText.trim() || !!selectedSubreddit;
                  return (
                    <div className="flex flex-col items-center justify-center rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-primary)] py-20 px-6 text-center shadow-sm">
                      <div className="h-16 w-16 mb-4 rounded-full bg-[var(--tint-orange)] flex items-center justify-center text-[#FF6B1A]">
                        <Search className="h-8 w-8" />
                      </div>
                      {isFiltered ? (
                        <>
                          <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">No markets match your filter</h3>
                          <p className="text-sm font-medium text-[var(--text-secondary)] max-w-sm mb-8 leading-relaxed">
                            Try clearing your search or selecting a different category.
                          </p>
                          <button
                            onClick={() => { setSearchText(""); setSelectedSubreddit(null); }}
                            className="flex h-12 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-primary)] px-8 text-sm font-extrabold text-[var(--text-primary)] hover:border-[#FF6B1A] hover:text-[#FF6B1A] transition-colors"
                          >
                            Clear Filters
                          </button>
                        </>
                      ) : (
                        <>
                          <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">No live markets yet</h3>
                          <p className="text-sm font-medium text-[var(--text-secondary)] max-w-sm mb-8 leading-relaxed">
                            Paste a Reddit post URL and launch the first Karma Market on BNB Chain to start trading attention.
                          </p>
                          <Link
                            href="/launch"
                            className="flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] px-8 text-sm font-extrabold text-white shadow-md hover:scale-[1.02] transition-transform"
                          >
                            Launch First Market
                          </Link>
                        </>
                      )}
                    </div>
                  );
                })()
              ) : (
                markets.map((m) => (
                  <article
                    key={m.id}
                    className="group relative rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(255,107,26,0.1)] hover:border-[#FF6B1A]/50 transition-all duration-300"
                  >
                    {/* Top orange accent line */}
                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B1A]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Top Row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[var(--surface-secondary)] border border-[var(--border-subtle)] px-3 py-1 text-xs font-black text-[var(--text-primary)]">
                          {m.subreddit}
                        </span>
                        <span className="text-xs font-medium text-[var(--text-muted)]">• {m.timeAgo}</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full bg-[var(--tint-orange)] px-2.5 py-1 text-xs font-black text-[#FF6B1A]">
                        <Flame className="h-3.5 w-3.5" /> 
                        Virality {m.viralityScore}
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="mb-5">
                      <Link href={`/market/${m.marketAddress}`} className="block">
                        <h2 className="text-[20px] font-black text-[var(--text-primary)] leading-snug mb-2 group-hover:text-[#FF6B1A] transition-colors">
                          {m.title}
                        </h2>
                      </Link>
                      <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed mb-3">
                        {m.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-bold text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                          <span className="h-4 w-4 rounded-full bg-[#F3BA2F] flex items-center justify-center text-white text-[8px]">K</span>
                          <span className="text-[var(--text-primary)]">${m.symbol}</span>
                        </span>
                        <span>Curated by <a href={explorerAddress(chainId, m.curatorWallet)} target="_blank" rel="noopener noreferrer" className="text-[#FF6B1A] hover:underline">{m.curatorWallet}</a></span>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-4 border-t border-[var(--border-subtle)]">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Price</div>
                        <div className="text-sm font-black text-[var(--text-primary)]">{usd(m.priceBnb)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Market Cap</div>
                        <div className="text-sm font-black text-[var(--text-primary)]">{usd(m.marketCap)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">24h Volume</div>
                        <div className="text-sm font-black text-[var(--text-primary)]">{usd(m.volume24h)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Holders</div>
                        <div className="text-sm font-black text-[var(--text-primary)]">{m.holders}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Virality</div>
                        <div className="text-sm font-black text-[#19C37D]">{m.viralityScore ?? 0}</div>
                      </div>
                    </div>

                    {/* Action Area */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3">
                        {m.creatorClaimed ? (
                          <span className="flex items-center gap-1.5 rounded-full bg-[var(--tint-success)] px-2.5 py-1 text-[11px] font-extrabold text-[#19C37D]">
                            <ShieldCheck className="h-3.5 w-3.5" /> Creator Claimed
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 rounded-full bg-[var(--surface-secondary)] border border-[var(--border-subtle)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--text-muted)]">
                            Creator Unclaimed
                          </span>
                        )}
                        {/* Mini sparkline placeholder */}
                        <div className="hidden sm:flex h-6 w-16 items-center">
                          <svg className="w-full h-full text-[#19C37D]" viewBox="0 0 100 30" preserveAspectRatio="none">
                            <polyline fill="none" stroke="currentColor" strokeWidth="2" points="0,25 20,20 40,22 60,10 80,15 100,5" />
                          </svg>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/market/${m.marketAddress}`}
                          className="rounded-full bg-[var(--surface-secondary)] border border-[var(--border-subtle)] px-4 py-2 text-xs font-bold text-[var(--text-secondary)] hover:border-[#FF6B1A] hover:text-[#FF6B1A] transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          href={`/market/${m.marketAddress}`}
                          className="rounded-full bg-[var(--ink-solid)] px-5 py-2 text-xs font-extrabold text-white hover:bg-[#FF6B1A] transition-colors shadow-sm"
                        >
                          Buy
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-6 sticky top-24 h-max">
            
            {/* Creator Claim Vault */}
            <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#FF6B1A] to-[#E9500E] p-6 text-white shadow-lg shadow-[#FF6B1A]/20">
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                <Award className="h-24 w-24" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-black mb-2">Original Reddit poster?</h3>
                <p className="text-xs font-medium text-white/90 leading-relaxed mb-5">
                  Did your post create an attention market? Claim your creator vault and receive your reserved fee share.
                </p>
                <Link
                  href="/creator-claim"
                  className="block w-full text-center rounded-xl bg-[var(--surface-primary)] py-2.5 text-sm font-extrabold text-[#FF6B1A] hover:bg-[var(--tint-orange)] transition-colors shadow-sm"
                >
                  Authenticate & Claim
                </Link>
              </div>
            </div>

            {/* Rising Attention */}
            <div className="rounded-[22px] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4 flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-[#FF6B1A]" /> Rising Attention
              </h3>
              <div className="flex flex-col gap-3">
                {summary.rising.length === 0 && (
                  <span className="text-xs text-[var(--text-muted)]">No markets yet.</span>
                )}
                {summary.rising.map((item, i) => (
                  <Link key={i} href={item.marketAddress ? `/market/${item.marketAddress}` : "/feed"} className="flex items-center justify-between group">
                    <span className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#FF6B1A] transition-colors">${item.symbol}</span>
                    <span className="text-xs font-black text-[#19C37D]">Virality {item.virality}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Curators */}
            <div className="rounded-[22px] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4 flex items-center gap-2">
                <Award className="h-3.5 w-3.5 text-[#FF6B1A]" /> Top Curators
              </h3>
              <div className="flex flex-col gap-3">
                {summary.topCurators.length === 0 && (
                  <span className="text-xs text-[var(--text-muted)]">No curators yet.</span>
                )}
                {summary.topCurators.map((curator, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[var(--tint-orange)] to-[var(--border-subtle)] flex items-center justify-center text-[10px] font-black text-[#FF6B1A]">
                      {i + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[var(--text-primary)] leading-tight font-mono">{curator.wallet.slice(0, 6)}…{curator.wallet.slice(-4)}</span>
                      <span className="text-[10px] font-bold text-[var(--text-muted)]">{usd(curator.vol)} Vol</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* Quick Swap Dialog Modal */}
      {swapMarket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink-solid)]/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[28px] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 border-b border-[var(--border-subtle)] pb-4">
              <h3 className="text-lg font-black text-[var(--text-primary)]">Buy Attention Tokens</h3>
              <button onClick={() => setSwapMarket(null)} className="h-8 w-8 rounded-full bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] hover:text-[var(--text-primary)] font-bold flex items-center justify-center transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleQuickSwap} className="flex flex-col gap-5">
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Target Post</span>
                <p className="text-sm font-bold text-[var(--text-primary)] truncate mt-1">{swapMarket.title}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">Send Amount (BNB)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)] px-4 py-3 text-base font-bold text-[var(--text-primary)] focus:border-[#FF6B1A] focus:outline-none"
                  />
                  <span className="absolute right-4 top-3.5 text-sm font-black text-[var(--text-secondary)]">BNB</span>
                </div>
              </div>

              <div className="rounded-2xl bg-[var(--surface-secondary)] p-4 border border-[var(--border-subtle)] text-sm leading-relaxed text-[var(--text-secondary)]">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Price per token:</span>
                  <span className="font-black text-[var(--text-primary)]">
                    {swapMarket.price} BNB
                  </span>
                </div>
                <div className="flex justify-between border-t border-[var(--border-subtle)] pt-2">
                  <span className="font-medium">Est. Tokens Received:</span>
                  <span className="font-black text-[#FF6B1A]">
                    {(parseFloat(swapAmount) / swapMarket.price).toFixed(2)} {swapMarket.symbol}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSwapping}
                className="w-full rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] py-3.5 text-[15px] font-extrabold text-white shadow-[0_4px_14px_rgba(255,107,26,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isSwapping ? "Executing Trade..." : "Confirm Swap"}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function Feed() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-tertiary)] text-[#FF6B1A]">
        <RefreshCw className="animate-spin h-8 w-8" />
      </div>
    }>
      <FeedContent />
    </Suspense>
  );
}
