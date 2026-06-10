"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWallet } from "@/context/wallet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Wallet, PieChart, TrendingUp, History, Star, AlertCircle, 
  RefreshCw, CheckCircle2, Copy, Shield, ChevronRight, Activity
} from "lucide-react";
import { 
  usePortfolioSummary, 
  usePortfolioHoldings, 
  usePortfolioPnl, 
  useCreatedMarkets, 
  useCuratedMarkets, 
  usePortfolioRewards, 
  usePortfolioTransactions, 
  usePortfolioWatchlist, 
  useCreatorClaims 
} from "@/hooks/usePortfolio";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const TABS = [
  { id: "holdings", label: "Holdings", icon: PieChart },
  { id: "pnl", label: "PnL", icon: TrendingUp },
  { id: "created", label: "Created Markets", icon: Shield },
  { id: "curated", label: "Curated", icon: Star },
  { id: "rewards", label: "Rewards", icon: Wallet },
  { id: "transactions", label: "History", icon: History },
  { id: "watchlist", label: "Watchlist", icon: Activity },
  { id: "claims", label: "Creator Claims", icon: CheckCircle2 }
];

function PortfolioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isConnected, walletAddress, connect, isSandboxMode } = useWallet();
  const summary = usePortfolioSummary();
  
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "holdings");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && TABS.some(t => t.id === tab)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/portfolio?tab=${tabId}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[var(--surface-secondary)] pt-12 pb-24 flex items-center justify-center px-4">
        <div className="w-full max-w-[480px] rounded-[28px] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-10 text-center shadow-[0_8px_30px_rgba(232,212,200,0.4)]">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--surface-peach)] text-[#FF6B1A] mb-6">
            <Wallet className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-black text-[var(--text-primary)] mb-3">Your Portfolio</h1>
          <p className="text-[var(--text-muted)] text-[15px] mb-8 leading-relaxed">
            Connect your wallet to track your holdings, claim rewards, and monitor your curated markets.
          </p>
          <button 
            onClick={() => connect()}
            className="w-full h-[52px] rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(255,107,26,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-secondary)] pb-24">
      {/* Network Warning Banner */}
      {!isSandboxMode && (
        <div className="w-full bg-[var(--surface-peach)] border-b border-[#FFAB66]/30 py-2.5 px-4 text-center">
          <p className="text-[13px] font-bold text-[#FF6B1A] flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Please ensure you are connected to BNB Chain to view real data.
          </p>
        </div>
      )}

      <div className="mx-auto w-full max-w-[1180px] px-6 pt-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h1 className="text-[32px] font-black text-[var(--text-primary)] tracking-tight mb-4">Portfolio</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-[var(--surface-primary)] border border-[var(--border-strong)] px-3 py-1.5 shadow-sm">
                <div className="h-2 w-2 rounded-full bg-[#22C55E]"></div>
                <span className="text-[13px] font-bold text-[var(--text-secondary)]">
                  {walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress.length - 4)}
                </span>
                <button onClick={copyAddress} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-[#F3BA2F]/10 border border-[#F3BA2F]/20 px-3 py-1.5">
                <img src="/brand/bnb-chain-logo.svg" alt="BNB" className="h-3.5 w-3.5" />
                <span className="text-[13px] font-bold text-[var(--text-gold)]">BNB Chain</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 h-[40px] px-5 rounded-full bg-[var(--surface-primary)] border border-[var(--border-strong)] text-[14px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-mid)] shadow-sm transition-all"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="rounded-[22px] bg-[var(--surface-primary)] border border-[var(--border-subtle)] p-6 shadow-sm">
            <p className="text-[13px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Total Value</p>
            <h3 className="text-[28px] font-black text-[var(--text-primary)] leading-none mb-1">${summary.totalValue.toLocaleString()}</h3>
            <p className="text-[13px] font-medium text-[var(--text-secondary)]">{summary.totalValueBnb.toFixed(2)} BNB</p>
          </div>
          <div className="rounded-[22px] bg-[var(--surface-primary)] border border-[var(--border-subtle)] p-6 shadow-sm">
            <p className="text-[13px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Open Positions</p>
            <h3 className="text-[28px] font-black text-[var(--text-primary)] leading-none mb-1">{summary.openPositionsCount}</h3>
            <p className="text-[13px] font-medium text-[var(--text-secondary)]">Markets active</p>
          </div>
          <div className="rounded-[22px] bg-[var(--surface-primary)] border border-[var(--border-subtle)] p-6 shadow-sm">
            <p className="text-[13px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Claimable Rewards</p>
            <h3 className="text-[28px] font-black text-[#FF6B1A] leading-none mb-1">${summary.claimableRewards.toLocaleString()}</h3>
            <p className="text-[13px] font-medium text-[var(--text-secondary)]">Fees & Curation</p>
          </div>
          <div className="rounded-[22px] bg-[var(--surface-primary)] border border-[var(--border-subtle)] p-6 shadow-sm">
            <p className="text-[13px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Reputation</p>
            <h3 className="text-[28px] font-black text-[var(--text-primary)] leading-none mb-1">{summary.reputationScore}</h3>
            <p className="text-[13px] font-medium text-[var(--text-secondary)]">Top 5% of Curators</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto pb-4 mb-6 scrollbar-hide border-b border-[var(--border-strong)]">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-full text-[14px] font-bold transition-all ${
                  isActive 
                    ? "bg-[var(--surface-peach)] text-[#FF6B1A]" 
                    : "text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]/30 hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Rendering */}
        <div className="min-h-[400px]">
          {activeTab === "holdings" && <HoldingsTab />}
          {activeTab === "pnl" && <PnlTab />}
          {activeTab === "created" && <CreatedMarketsTab />}
          {activeTab === "curated" && <CuratedMarketsTab />}
          {activeTab === "rewards" && <RewardsTab />}
          {activeTab === "transactions" && <TransactionsTab />}
          {activeTab === "watchlist" && <WatchlistTab />}
          {activeTab === "claims" && <CreatorClaimsTab />}
        </div>
      </div>
    </div>
  );
}

// --- Tab Components ---

function HoldingsTab() {
  const { holdings } = usePortfolioHoldings();
  
  return (
    <div className="rounded-[28px] bg-[var(--surface-primary)] border border-[var(--border-subtle)] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-secondary)]/50">
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Position</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Qty</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Avg Entry</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Current</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Value</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Unrealized PnL</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Action</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((pos) => {
              const isProfit = pos.unrealizedPnl >= 0;
              return (
                <tr key={pos.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--surface-secondary)]/50 transition-colors">
                  <td className="px-6 py-5">
                    <p className="text-[14px] font-bold text-[var(--text-primary)] max-w-[200px] truncate">{pos.marketName}</p>
                    <p className="text-[12px] text-[var(--text-muted)] mt-0.5">{pos.marketSymbol}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-block px-2.5 py-1 rounded-[6px] text-[12px] font-black uppercase ${
                      pos.tokenType === "YES" ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#EF4444]/10 text-[#EF4444]"
                    }`}>
                      {pos.tokenType}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[14px] font-medium text-[var(--text-primary)]">{pos.quantity}</td>
                  <td className="px-6 py-5 text-[14px] font-medium text-[var(--text-secondary)]">${pos.avgEntryPrice.toFixed(2)}</td>
                  <td className="px-6 py-5 text-[14px] font-medium text-[var(--text-secondary)]">${pos.currentPrice.toFixed(2)}</td>
                  <td className="px-6 py-5 text-[15px] font-black text-[var(--text-primary)]">${pos.totalValue.toFixed(2)}</td>
                  <td className="px-6 py-5">
                    <p className={`text-[14px] font-bold ${isProfit ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                      {isProfit ? `+$${pos.unrealizedPnl.toFixed(2)}` : `-$${Math.abs(pos.unrealizedPnl).toFixed(2)}`}
                    </p>
                    <p className={`text-[12px] font-medium ${isProfit ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                      {isProfit ? "+" : ""}{pos.unrealizedPnlPercent.toFixed(2)}%
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <button className="h-8 px-4 rounded-full bg-[var(--surface-peach)] text-[#FF6B1A] text-[13px] font-bold hover:bg-[#FF6B1A] hover:text-white transition-colors">
                      Trade
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PnlTab() {
  const { history, realizedPnl, unrealizedPnl, feesPaid, rewardsEarned, netPnl } = usePortfolioPnl();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="rounded-[20px] bg-[var(--surface-primary)] border border-[var(--border-subtle)] p-5">
          <p className="text-[12px] font-bold text-[var(--text-muted)] uppercase mb-1">Net PnL</p>
          <h4 className={`text-[20px] font-black ${netPnl >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
            {netPnl >= 0 ? `+$${netPnl}` : `-$${Math.abs(netPnl)}`}
          </h4>
        </div>
        <div className="rounded-[20px] bg-[var(--surface-primary)] border border-[var(--border-subtle)] p-5">
          <p className="text-[12px] font-bold text-[var(--text-muted)] uppercase mb-1">Realized</p>
          <h4 className="text-[20px] font-black text-[var(--text-primary)]">${realizedPnl}</h4>
        </div>
        <div className="rounded-[20px] bg-[var(--surface-primary)] border border-[var(--border-subtle)] p-5">
          <p className="text-[12px] font-bold text-[var(--text-muted)] uppercase mb-1">Unrealized</p>
          <h4 className="text-[20px] font-black text-[var(--text-primary)]">${unrealizedPnl}</h4>
        </div>
        <div className="rounded-[20px] bg-[var(--surface-primary)] border border-[var(--border-subtle)] p-5">
          <p className="text-[12px] font-bold text-[var(--text-muted)] uppercase mb-1">Fees Paid</p>
          <h4 className="text-[20px] font-black text-[#EF4444]">-${feesPaid}</h4>
        </div>
        <div className="rounded-[20px] bg-[var(--surface-primary)] border border-[var(--border-subtle)] p-5">
          <p className="text-[12px] font-bold text-[var(--text-muted)] uppercase mb-1">Rewards</p>
          <h4 className="text-[20px] font-black text-[#22C55E]">+${rewardsEarned}</h4>
        </div>
      </div>

      <div className="rounded-[28px] bg-[var(--surface-primary)] border border-[var(--border-subtle)] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[18px] font-black text-[var(--text-primary)]">Performance History</h3>
          <div className="flex bg-[var(--surface-secondary)] rounded-lg p-1 border border-[var(--border-subtle)]">
            {["1W", "1M", "ALL"].map(t => (
              <button key={t} className={`px-4 py-1.5 rounded-md text-[13px] font-bold ${t === "1M" ? "bg-[var(--surface-primary)] text-[#FF6B1A] shadow-sm" : "text-[var(--text-muted)]"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} dx={-10} tickFormatter={(val) => `$${val}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                itemStyle={{ color: 'var(--text-primary)', fontWeight: 800 }}
              />
              <Line type="monotone" dataKey="value" stroke="#FF6B1A" strokeWidth={3} dot={{r: 4, fill: "#FF6B1A", strokeWidth: 2, stroke: "var(--surface-primary)"}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function CreatedMarketsTab() {
  const { markets } = useCreatedMarkets();
  return (
    <div className="rounded-[28px] bg-[var(--surface-primary)] border border-[var(--border-subtle)] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[var(--border-subtle)] flex justify-between items-center">
        <h3 className="text-[18px] font-black text-[var(--text-primary)]">My Created Markets</h3>
        <button className="h-9 px-4 rounded-full bg-[#FF6B1A] text-white text-[13px] font-bold hover:bg-[#E9500E] transition-colors">
          Launch New
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-secondary)]/50">
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Market Name</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Liquidity</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Volume (24h)</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Fees Earned</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Status</th>
            </tr>
          </thead>
          <tbody>
            {markets.map(m => (
              <tr key={m.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--surface-secondary)]/50 transition-colors">
                <td className="px-6 py-5">
                  <p className="text-[14px] font-bold text-[var(--text-primary)] max-w-[200px] truncate">{m.name}</p>
                  <p className="text-[12px] text-[var(--text-muted)] mt-0.5">{m.symbol}</p>
                </td>
                <td className="px-6 py-5 text-[14px] font-medium text-[var(--text-primary)]">${m.liquidity.toLocaleString()}</td>
                <td className="px-6 py-5 text-[14px] font-medium text-[var(--text-primary)]">${m.volume24h.toLocaleString()}</td>
                <td className="px-6 py-5 text-[15px] font-black text-[#22C55E]">+${m.feesEarned.toFixed(2)}</td>
                <td className="px-6 py-5">
                  <span className="inline-block px-2.5 py-1 rounded-[6px] text-[12px] font-black uppercase bg-[#22C55E]/10 text-[#22C55E]">
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CuratedMarketsTab() {
  const { curated } = useCuratedMarkets();
  return (
    <div className="rounded-[28px] bg-[var(--surface-primary)] border border-[var(--border-subtle)] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-secondary)]/50">
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Source</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Virality</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Linked Markets</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Rewards</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Status</th>
            </tr>
          </thead>
          <tbody>
            {curated.map(c => (
              <tr key={c.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--surface-secondary)]/50 transition-colors">
                <td className="px-6 py-5">
                  <p className="text-[14px] font-bold text-[var(--text-primary)] max-w-[200px] truncate">{c.title}</p>
                  <p className="text-[12px] text-[#FF4500] mt-0.5">{c.platform}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF6B1A]" style={{width: `${c.viralityScore}%`}}></div>
                    </div>
                    <span className="text-[13px] font-bold text-[var(--text-primary)]">{c.viralityScore}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-[14px] font-medium text-[var(--text-primary)]">{c.marketsLinked}</td>
                <td className="px-6 py-5 text-[15px] font-black text-[#22C55E]">+${c.curationRewards.toFixed(2)}</td>
                <td className="px-6 py-5">
                  <span className="inline-block px-2.5 py-1 rounded-[6px] text-[12px] font-black uppercase bg-[#22C55E]/10 text-[#22C55E]">
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RewardsTab() {
  const { rewards } = usePortfolioRewards();
  return (
    <div className="rounded-[28px] bg-[var(--surface-primary)] border border-[var(--border-subtle)] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-secondary)]/50">
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Date</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Type</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Amount</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Status</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Action</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map(r => (
              <tr key={r.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--surface-secondary)]/50 transition-colors">
                <td className="px-6 py-5 text-[14px] font-medium text-[var(--text-secondary)]">
                  {new Date(r.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-5 text-[14px] font-bold text-[var(--text-primary)]">{r.type.replace(/_/g, ' ')}</td>
                <td className="px-6 py-5 text-[15px] font-black text-[var(--text-primary)]">{r.amount.toFixed(2)} {r.token}</td>
                <td className="px-6 py-5">
                  <span className={`inline-block px-2.5 py-1 rounded-[6px] text-[12px] font-black uppercase ${
                    r.status === "CLAIMABLE" ? "bg-[#FF6B1A]/10 text-[#FF6B1A]" : "bg-[var(--text-muted)]/10 text-[var(--text-muted)]"
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  {r.status === "CLAIMABLE" ? (
                    <button className="h-8 px-4 rounded-full bg-[#FF6B1A] text-white text-[13px] font-bold hover:bg-[#E9500E] transition-colors">
                      Claim
                    </button>
                  ) : (
                    <span className="text-[13px] text-[var(--text-muted)] px-2">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TransactionsTab() {
  const { transactions } = usePortfolioTransactions();
  return (
    <div className="rounded-[28px] bg-[var(--surface-primary)] border border-[var(--border-subtle)] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-secondary)]/50">
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Date</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Action</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Market</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Amount</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Value</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Link</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--surface-secondary)]/50 transition-colors">
                <td className="px-6 py-5 text-[14px] font-medium text-[var(--text-secondary)]">
                  {new Date(t.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-block px-2.5 py-1 rounded-[6px] text-[12px] font-black uppercase ${
                    t.type === "BUY" ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#EF4444]/10 text-[#EF4444]"
                  }`}>
                    {t.type} {t.tokenType}
                  </span>
                </td>
                <td className="px-6 py-5 text-[14px] font-bold text-[var(--text-primary)]">{t.market}</td>
                <td className="px-6 py-5 text-[14px] font-medium text-[var(--text-primary)]">{t.amount} @ ${t.price.toFixed(2)}</td>
                <td className="px-6 py-5 text-[15px] font-black text-[var(--text-primary)]">${t.totalValue.toFixed(2)}</td>
                <td className="px-6 py-5">
                  <a href={`https://testnet.bscscan.com/tx/${t.hash}`} target="_blank" rel="noreferrer" className="text-[13px] font-bold text-[#FF6B1A] hover:underline">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WatchlistTab() {
  const { watchlist } = usePortfolioWatchlist();
  return (
    <div className="rounded-[28px] bg-[var(--surface-primary)] border border-[var(--border-subtle)] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-secondary)]/50">
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Market Name</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">YES Price</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">NO Price</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">24h Change</th>
              <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Action</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map(w => (
              <tr key={w.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--surface-secondary)]/50 transition-colors">
                <td className="px-6 py-5">
                  <p className="text-[14px] font-bold text-[var(--text-primary)] max-w-[250px] truncate">{w.name}</p>
                  <p className="text-[12px] text-[var(--text-muted)] mt-0.5">{w.symbol}</p>
                </td>
                <td className="px-6 py-5 text-[14px] font-bold text-[#22C55E]">${w.currentYesPrice.toFixed(2)}</td>
                <td className="px-6 py-5 text-[14px] font-bold text-[#EF4444]">${w.currentNoPrice.toFixed(2)}</td>
                <td className="px-6 py-5">
                  <span className={`text-[14px] font-bold ${w.change24h >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                    {w.change24h >= 0 ? "+" : ""}{w.change24h}%
                  </span>
                </td>
                <td className="px-6 py-5">
                  <button className="h-8 px-4 rounded-full bg-[var(--surface-peach)] text-[#FF6B1A] text-[13px] font-bold hover:bg-[#FF6B1A] hover:text-white transition-colors">
                    Trade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreatorClaimsTab() {
  const { claims } = useCreatorClaims();
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-gradient-to-r from-[var(--surface-secondary)] to-[var(--surface-peach)] border border-[#FFAB66]/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <h3 className="text-[20px] font-black text-[var(--text-primary)] mb-2">Are you a creator?</h3>
          <p className="text-[14px] text-[var(--text-secondary)] max-w-[400px]">
            If a market was created about your Reddit post, you can claim the creator fee vault. Verify your Reddit account to withdraw funds.
          </p>
        </div>
        <button className="shrink-0 h-[44px] px-6 rounded-full bg-[#FF6B1A] text-white text-[14px] font-bold shadow-md hover:bg-[#E9500E] hover:-translate-y-0.5 transition-all">
          Verify Reddit Account
        </button>
      </div>

      <div className="rounded-[28px] bg-[var(--surface-primary)] border border-[var(--border-subtle)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-secondary)]/50">
                <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Date</th>
                <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Reddit Username</th>
                <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Market</th>
                <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Claim Amount</th>
                <th className="px-6 py-4 text-[12px] font-black uppercase tracking-wider text-[var(--text-muted)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {claims.map(c => (
                <tr key={c.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--surface-secondary)]/50 transition-colors">
                  <td className="px-6 py-5 text-[14px] font-medium text-[var(--text-secondary)]">
                    {new Date(c.dateSubmitted).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 text-[14px] font-bold text-[#FF4500]">{c.redditUsername}</td>
                  <td className="px-6 py-5 text-[14px] font-bold text-[var(--text-primary)]">{c.marketSymbol}</td>
                  <td className="px-6 py-5 text-[15px] font-black text-[var(--text-primary)]">${c.claimAmount.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <span className="inline-block px-2.5 py-1 rounded-[6px] text-[12px] font-black uppercase bg-[#F3BA2F]/10 text-[var(--text-gold)]">
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen bg-[var(--surface-secondary)] pt-12 pb-24 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 border-4 border-[var(--border-subtle)] border-t-[#FF6B1A] rounded-full animate-spin mb-4"></div>
            <p className="text-[14px] font-bold text-[var(--text-muted)]">Loading Portfolio...</p>
          </div>
        </div>
      }>
        <PortfolioContent />
      </Suspense>
      <Footer />
    </>
  );
}
