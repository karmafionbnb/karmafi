"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, Award, Flame, ArrowRight, TrendingUp, Medal, Sparkles } from "lucide-react";

export default function Leaderboard() {
  const [curators, setCurators] = useState<any[]>([]);
  const [traders, setTraders] = useState<any[]>([]);
  const [markets, setMarkets] = useState<any[]>([]);
  const [bnbUsd, setBnbUsd] = useState(0);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setCurators(d.curators || []);
          setTraders(d.traders || []);
          setMarkets(d.markets || []);
        }
      })
      .catch((e) => console.error(e));

    fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd")
      .then((r) => r.json())
      .then((j) => { const p = Number(j?.binancecoin?.usd); if (p > 0) setBnbUsd(p); })
      .catch(() => {
        fetch("https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT")
          .then((r) => r.json())
          .then((j) => { const p = Number(j?.price); if (p > 0) setBnbUsd(p); })
          .catch(() => {});
      });
  }, []);

  const usd = (bnb: number) =>
    bnbUsd > 0
      ? `$${(bnb * bnbUsd).toLocaleString("en-US", { maximumFractionDigits: 2 })}`
      : `${(bnb || 0).toFixed(4)} BNB`;
  const shortWallet = (w: string) => (w ? `${w.slice(0, 6)}…${w.slice(-4)}` : "");

  const getRankBadge = (rank: number) => {
    switch(rank) {
      case 1:
        return <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-white font-black shadow-sm"><Medal className="h-4 w-4" /></div>;
      case 2:
        return <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-black shadow-sm"><Medal className="h-4 w-4" /></div>;
      case 3:
        return <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-black shadow-sm"><Medal className="h-4 w-4" /></div>;
      default:
        return <div className="h-8 w-8 rounded-full bg-[var(--surface-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] font-black">{rank}</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-tertiary)] relative overflow-hidden">
      {/* Background glowing orb */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-[#FF6B1A]/10 via-[#E9500E]/5 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <Navbar />

      <main className="mx-auto w-full max-w-[1320px] px-6 py-16 flex-1 relative z-10">
        
        {/* Header Area */}
        <div className="text-center mb-16">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--tint-orange)] to-[var(--border-subtle)] mb-6 shadow-sm relative">
            <Trophy className="h-8 w-8 text-[#FF6B1A]" />
            <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-[#E9500E]" />
          </div>
          <h1 className="text-[40px] md:text-[48px] font-[900] text-[var(--text-primary)] leading-tight tracking-tight mb-4">
            Leaderboards
          </h1>
          <p className="text-[16px] md:text-[18px] text-[var(--text-secondary)] font-medium max-w-xl mx-auto">
            Top performing early curators, elite traders, and the most viral attention markets on BNB Chain.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Top Curators */}
          <div className="rounded-[32px] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--tint-orange)] text-[#FF6B1A]">
                <Award className="h-5 w-5" />
              </div>
              Top Curators
            </h2>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center">Rank</div>
                  <div>Curator</div>
                </div>
                <div className="text-right">Fee Earned</div>
              </div>
              
              {curators.length === 0 && (
                <div className="text-center text-sm font-medium text-[var(--text-muted)] py-8">No curators yet.</div>
              )}
              {curators.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-[20px] hover:bg-[var(--surface-secondary)] border border-transparent hover:border-[var(--border-subtle)] transition-all group">
                  <div className="flex items-center gap-4">
                    {getRankBadge(idx + 1)}
                    <div className="flex flex-col">
                      <span className="text-[15px] font-black text-[var(--text-primary)] group-hover:text-[#FF6B1A] transition-colors font-mono">{shortWallet(c.wallet)}</span>
                      <span className="text-xs font-medium text-[var(--text-muted)]">{c.marketsLaunched} market{c.marketsLaunched === 1 ? "" : "s"} launched</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[15px] font-black text-[#19C37D]">{usd(c.earnedBnb)}</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--text-muted)] mt-1">
                      <Flame className="h-3 w-3 text-[#FF6B1A]" /> Curator fees earned
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Traders */}
          <div className="rounded-[32px] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--tint-orange)] text-[#FF6B1A]">
                <TrendingUp className="h-5 w-5" />
              </div>
              Top Traders
            </h2>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center">Rank</div>
                  <div>Trader</div>
                </div>
                <div className="text-right">PnL</div>
              </div>
              
              {traders.length === 0 && (
                <div className="text-center text-sm font-medium text-[var(--text-muted)] py-8">No trades yet.</div>
              )}
              {traders.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-[20px] hover:bg-[var(--surface-secondary)] border border-transparent hover:border-[var(--border-subtle)] transition-all group">
                  <div className="flex items-center gap-4">
                    {getRankBadge(idx + 1)}
                    <div className="flex flex-col">
                      <span className="text-[15px] font-black text-[var(--text-primary)] group-hover:text-[#FF6B1A] transition-colors font-mono">{shortWallet(t.wallet)}</span>
                      <span className="text-xs font-medium text-[var(--text-muted)]">{t.trades} trade{t.trades === 1 ? "" : "s"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-[15px] font-black ${t.netBnb >= 0 ? "text-[#19C37D]" : "text-[#DC2626]"}`}>{t.netBnb >= 0 ? "+" : ""}{usd(t.netBnb)}</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--text-muted)] mt-1">
                      Volume {usd(t.volumeBnb)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* High Virality pools row */}
        <div className="rounded-[32px] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--tint-orange)] text-[#FF6B1A]">
                <Flame className="h-5 w-5 fill-[#FF6B1A]" />
              </div>
              Top Virality Score Pools
            </h2>
            <Link href="/feed" className="text-sm font-bold text-[#FF6B1A] hover:text-[#E9500E] flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {markets.map((m, idx) => (
              <Link
                key={idx}
                href={`/market/${m.marketAddress}`}
                className="group relative rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-secondary)] p-6 hover:shadow-[0_8px_24px_rgba(255,107,26,0.12)] hover:border-[#FF6B1A]/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-[var(--surface-primary)] border border-[var(--border-subtle)] px-2.5 py-1 text-[10px] font-black text-[var(--text-primary)]">
                    {m.subreddit}
                  </span>
                  <div className="flex items-center gap-1.5 rounded-full bg-[var(--tint-orange)] px-2.5 py-1 text-xs font-black text-[#FF6B1A]">
                    <Flame className="h-3.5 w-3.5 fill-[#FF6B1A]" /> 
                    {m.viralityScore}
                  </div>
                </div>
                
                <h3 className="text-[15px] font-black text-[var(--text-primary)] leading-snug mb-4 line-clamp-2 group-hover:text-[#FF6B1A] transition-colors">
                  {m.title}
                </h3>
                
                <div className="flex items-center gap-4 text-xs font-bold text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-4">
                  <span className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase">Symbol</span>
                    <span className="text-[var(--text-primary)]">${m.symbol}</span>
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase">Market Cap</span>
                    <span className="text-[var(--text-primary)]">{usd(m.marketCap)}</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
