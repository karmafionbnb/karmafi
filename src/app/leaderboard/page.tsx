"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, Award, Flame, ArrowRight, TrendingUp, Medal, Sparkles } from "lucide-react";

// --- MOCK DATA ---
const MOCK_MARKETS = [
  {
    id: "m1",
    marketAddress: "0xMarket1",
    subreddit: "r/wallstreetbets",
    timeAgo: "2 hours ago",
    curatorWallet: "0xKarmaLord",
    title: "NVIDIA earnings leak shows 300% YoY growth? Post gaining massive traction.",
    excerpt: "Traders are piling into the thread as speculation spreads across finance subs.",
    symbol: "NVIDKARMA",
    price: 0.042,
    marketCap: 245.5,
    volume24h: 1240,
    holders: 3492,
    viralityScore: 98,
    change24h: "+45%",
    creatorClaimed: false,
    tokenAddress: "0xToken1",
  },
  {
    id: "m3",
    marketAddress: "0xMarket3",
    subreddit: "r/technology",
    timeAgo: "5 hours ago",
    curatorWallet: "RedditWhale",
    title: "OpenAI Q-Star model details leaked by former researcher. AGI closer than expected.",
    excerpt: "AI Reddit threads are accelerating as developers debate the technical claims.",
    symbol: "QSTAR",
    price: 0.028,
    marketCap: 890,
    volume24h: 1490,
    holders: 5204,
    viralityScore: 94,
    change24h: "+28%",
    creatorClaimed: true,
    tokenAddress: "0xToken3",
  },
  {
    id: "m5",
    marketAddress: "0xMarket5",
    subreddit: "r/startups",
    timeAgo: "1 day ago",
    curatorWallet: "LaunchHunter",
    title: "Solo founder reaches $100k MRR after viral Reddit launch post.",
    excerpt: "Startup Reddit is breaking down the growth loop and acquisition strategy.",
    symbol: "MRR100K",
    price: 0.036,
    marketCap: 334,
    volume24h: 610,
    holders: 1409,
    viralityScore: 87,
    change24h: "+22%",
    creatorClaimed: true,
    tokenAddress: "0xToken5",
  },
  {
    id: "m2",
    marketAddress: "0xMarket2",
    subreddit: "r/cryptocurrency",
    timeAgo: "4 hours ago",
    curatorWallet: "AlphaSeeker",
    title: "CZ spotted in Dubai airport, Binance moves 28 BUSD. Major announcement incoming?",
    excerpt: "Crypto Reddit is debating whether this signals a major BNB ecosystem catalyst.",
    symbol: "CZPULSE",
    price: 0.018,
    marketCap: 450,
    volume24h: 890,
    holders: 1832,
    viralityScore: 82,
    change24h: "+17%",
    creatorClaimed: false,
    tokenAddress: "0xToken2",
  }
];

export default function Leaderboard() {
  const [curators, setCurators] = useState<Record<string, unknown>[]>([]);
  const [traders, setTraders] = useState<Record<string, unknown>[]>([]);
  const [markets, setMarkets] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    // Generate/fetch mock leaderboard stats
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurators([
      { rank: 1, wallet: "0x89223A449b25E123f1A2b3c4D5E6F7890123456", name: "KarmaLord.bnb", reputation: 98, marketsLaunched: 12, earned: "8.45 BNB" },
      { rank: 2, wallet: "0x3A449b25E123f1A2b3c4D5E6F789012345678922", name: "AlphaSeeker", reputation: 85, marketsLaunched: 8, earned: "4.20 BNB" },
      { rank: 3, wallet: "0x9E973Cc4b7b25E123f1A2b3c4D5E6F7890123456", name: "RedditWhale", reputation: 74, marketsLaunched: 5, earned: "2.10 BNB" },
      { rank: 4, wallet: "0x5E6F789012345678901234567890123456789012", name: "ChainScout", reputation: 62, marketsLaunched: 3, earned: "1.05 BNB" },
      { rank: 5, wallet: "0x1A2B3C4D5E6F7890123456789012345678901234", name: "LaunchHunter", reputation: 55, marketsLaunched: 2, earned: "0.80 BNB" }
    ]);

    setTraders([
      { rank: 1, wallet: "0x5555555555555555555555555555555555555555", name: "DegenKing", volume: "45.80 BNB", trades: 34, pnl: "+12.45 BNB", winRate: "76%" },
      { rank: 2, wallet: "0x6666666666666666666666666666666666666666", name: "YieldFarmer", volume: "28.50 BNB", trades: 21, pnl: "+6.80 BNB", winRate: "62%" },
      { rank: 3, wallet: "0x89223A449b25E123f1A2b3c4D5E6F7890123456", name: "KarmaLord.bnb", volume: "18.20 BNB", trades: 14, pnl: "+2.15 BNB", winRate: "58%" },
      { rank: 4, wallet: "0x7777777777777777777777777777777777777777", name: "MemeSniper", volume: "12.40 BNB", trades: 45, pnl: "+1.90 BNB", winRate: "42%" },
      { rank: 5, wallet: "0x8888888888888888888888888888888888888888", name: "TrendCatcher", volume: "8.90 BNB", trades: 11, pnl: "+0.85 BNB", winRate: "65%" }
    ]);

    fetch("/api/market?sort=rising")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.markets && data.markets.length > 0) {
          setMarkets(data.markets.slice(0, 4));
        } else {
          setMarkets(MOCK_MARKETS);
        }
      })
      .catch(e => {
        console.error(e);
        setMarkets(MOCK_MARKETS);
      });
  }, []);

  const getRankBadge = (rank: number) => {
    switch(rank) {
      case 1:
        return <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-white font-black shadow-sm"><Medal className="h-4 w-4" /></div>;
      case 2:
        return <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-black shadow-sm"><Medal className="h-4 w-4" /></div>;
      case 3:
        return <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-black shadow-sm"><Medal className="h-4 w-4" /></div>;
      default:
        return <div className="h-8 w-8 rounded-full bg-[#FFFAF5] border border-[#F2D8C8] flex items-center justify-center text-[#5F5B57] font-black">{rank}</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF8] relative overflow-hidden">
      {/* Background glowing orb */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-[#FF6B1A]/10 via-[#E9500E]/5 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <Navbar />

      <main className="mx-auto w-full max-w-[1320px] px-6 py-16 flex-1 relative z-10">
        
        {/* Header Area */}
        <div className="text-center mb-16">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FFF4EA] to-[#F2D8C8] mb-6 shadow-sm relative">
            <Trophy className="h-8 w-8 text-[#FF6B1A]" />
            <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-[#E9500E]" />
          </div>
          <h1 className="text-[40px] md:text-[48px] font-[900] text-[#161616] leading-tight tracking-tight mb-4">
            Leaderboards
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#5F5B57] font-medium max-w-xl mx-auto">
            Top performing early curators, elite traders, and the most viral attention markets on BNB Chain.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Top Curators */}
          <div className="rounded-[32px] border border-[#F2D8C8] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-black text-[#161616] mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF4EA] text-[#FF6B1A]">
                <Award className="h-5 w-5" />
              </div>
              Top Curators
            </h2>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#8A817A] border-b border-[#F2D8C8]">
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center">Rank</div>
                  <div>Curator</div>
                </div>
                <div className="text-right">Fee Earned</div>
              </div>
              
              {curators.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-[20px] hover:bg-[#FFFAF5] border border-transparent hover:border-[#F2D8C8] transition-all group">
                  <div className="flex items-center gap-4">
                    {getRankBadge(c.rank)}
                    <div className="flex flex-col">
                      <span className="text-[15px] font-black text-[#161616] group-hover:text-[#FF6B1A] transition-colors">{c.name}</span>
                      <span className="text-xs font-medium text-[#8A817A]">{c.wallet.substring(0, 6)}...{c.wallet.substring(c.wallet.length - 4)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[15px] font-black text-[#19C37D]">{c.earned}</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#8A817A] mt-1">
                      <Flame className="h-3 w-3 text-[#FF6B1A]" /> Rep {c.reputation} • {c.marketsLaunched} Markets
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Traders */}
          <div className="rounded-[32px] border border-[#F2D8C8] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-black text-[#161616] mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF4EA] text-[#FF6B1A]">
                <TrendingUp className="h-5 w-5" />
              </div>
              Top Traders
            </h2>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#8A817A] border-b border-[#F2D8C8]">
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center">Rank</div>
                  <div>Trader</div>
                </div>
                <div className="text-right">PnL</div>
              </div>
              
              {traders.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-[20px] hover:bg-[#FFFAF5] border border-transparent hover:border-[#F2D8C8] transition-all group">
                  <div className="flex items-center gap-4">
                    {getRankBadge(t.rank)}
                    <div className="flex flex-col">
                      <span className="text-[15px] font-black text-[#161616] group-hover:text-[#FF6B1A] transition-colors">{t.name}</span>
                      <span className="text-xs font-medium text-[#8A817A]">{t.wallet.substring(0, 6)}...{t.wallet.substring(t.wallet.length - 4)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[15px] font-black text-[#19C37D]">{t.pnl}</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#8A817A] mt-1">
                      Win Rate {t.winRate} • Vol {t.volume}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* High Virality pools row */}
        <div className="rounded-[32px] border border-[#F2D8C8] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-[#161616] flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF4EA] text-[#FF6B1A]">
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
                className="group relative rounded-[24px] border border-[#F2D8C8] bg-[#FFFAF5] p-6 hover:shadow-[0_8px_24px_rgba(255,107,26,0.12)] hover:border-[#FF6B1A]/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-white border border-[#F2D8C8] px-2.5 py-1 text-[10px] font-black text-[#161616]">
                    {m.subreddit}
                  </span>
                  <div className="flex items-center gap-1.5 rounded-full bg-[#FFF4EA] px-2.5 py-1 text-xs font-black text-[#FF6B1A]">
                    <Flame className="h-3.5 w-3.5 fill-[#FF6B1A]" /> 
                    {m.viralityScore}
                  </div>
                </div>
                
                <h3 className="text-[15px] font-black text-[#161616] leading-snug mb-4 line-clamp-2 group-hover:text-[#FF6B1A] transition-colors">
                  {m.title}
                </h3>
                
                <div className="flex items-center gap-4 text-xs font-bold text-[#8A817A] border-t border-[#F2D8C8] pt-4">
                  <span className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase">Symbol</span>
                    <span className="text-[#161616]">${m.symbol}</span>
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase">Market Cap</span>
                    <span className="text-[#161616]">{m.marketCap} BNB</span>
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
