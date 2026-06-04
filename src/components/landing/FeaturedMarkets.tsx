import React from "react";
import Link from "next/link";
import { ArrowRight, Flame, BarChart3, Clock, CheckCircle2, TrendingUp } from "lucide-react";

export default function FeaturedMarkets() {
  const markets = [
    {
      id: "wsb-nvda",
      title: "NVIDIA earnings leak shows 300% YoY growth? Post gaining massive traction.",
      excerpt: "Retail traders are rallying behind this unverified leak ahead of the closing bell.",
      subreddit: "r/wallstreetbets",
      ticker: "K-NVDA",
      score: 98,
      price: "$0.042",
      change: "+45%",
      volume: "1,240 BNB",
      marketCap: "$840k",
      holders: "3,492",
      time: "2 hours ago",
      creatorClaimed: true,
    },
    {
      id: "crypto-cz",
      title: "CZ spotted in Dubai airport, Binance moves 2B USDT. Major announcement incoming?",
      excerpt: "On-chain sleuths noticed massive wallet movements coinciding with the sighting.",
      subreddit: "r/CryptoCurrency",
      ticker: "K-CZDU",
      score: 82,
      price: "$0.018",
      change: "+12%",
      volume: "450 BNB",
      marketCap: "$320k",
      holders: "1,204",
      time: "4 hours ago",
      creatorClaimed: false,
    },
    {
      id: "tech-openai",
      title: "OpenAI 'Q-Star' model details leaked by former researcher. AGI closer than expected.",
      excerpt: "A former alignment team member posted a long thread detailing the new architecture.",
      subreddit: "r/technology",
      ticker: "K-QSTAR",
      score: 94,
      price: "$0.028",
      change: "+28%",
      volume: "890 BNB",
      marketCap: "$560k",
      holders: "2,155",
      time: "1 hour ago",
      creatorClaimed: true,
    },
  ];

  return (
    <section className="w-full py-16 bg-[#FFFAF5] border-y border-[#F2D8C8]">
      <div className="mx-auto max-w-[1080px] px-6">
        
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-[28px] md:text-[36px] font-[900] tracking-tight text-[#161616] mb-2">
              Featured Markets
            </h2>
            <p className="text-[16px] text-[#5F5B57] font-medium max-w-xl">
              The hottest Reddit attention markets trading right now.
            </p>
          </div>
          <Link
            href="/feed"
            className="group flex items-center gap-2 rounded-full border border-[#F2D8C8] bg-white px-6 py-3 text-sm font-bold text-[#161616] shadow-sm hover:border-[#FF6B1A] transition-all"
          >
            View All Markets
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {markets.map((market) => (
            <Link
              key={market.id}
              href={`/market/${market.id}`}
              className="group relative flex h-full flex-col rounded-[24px] border border-[#E8D4C8] bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6B1A] hover:shadow-[0_20px_40px_rgba(255,107,26,0.12)] overflow-hidden"
            >
              {/* Subtle top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF6B1A]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              {/* Subtle hover glow inside */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFAB66]/0 to-[#FF6B1A]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#FFFDFC] border border-[#F1DDD0] px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-[#161616] uppercase">
                    {market.subreddit}
                  </span>
                  <div className="flex items-center gap-1 rounded-md bg-[#FFF1ED] px-2.5 py-1 text-[11px] font-extrabold text-[#FF6B1A] uppercase">
                    <Flame className="h-3 w-3" /> Score {market.score}
                  </div>
                </div>
                {market.creatorClaimed ? (
                  <div className="flex items-center gap-1 rounded-md bg-[#19C37D]/10 px-2 py-1 text-[10px] font-extrabold text-[#19C37D] uppercase tracking-wide">
                    <CheckCircle2 className="h-3 w-3" /> Claimed
                  </div>
                ) : (
                  <div className="flex items-center gap-1 rounded-md bg-[#8A817A]/10 px-2 py-1 text-[10px] font-extrabold text-[#8A817A] uppercase tracking-wide">
                    Unclaimed
                  </div>
                )}
              </div>

              <div className="relative z-10 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded bg-[#F3BA2F]/15 px-2 py-0.5 text-[12px] font-bold text-[#D89F12]">
                    ${market.ticker}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#8A817A]">
                    <Clock className="h-3 w-3" /> {market.time}
                  </div>
                </div>
                <h3 className="text-[18px] font-extrabold text-[#161616] leading-snug group-hover:text-[#FF6B1A] transition-colors line-clamp-2 mb-2">
                  {market.title}
                </h3>
                <p className="text-[14px] text-[#5F5B57] font-medium leading-relaxed line-clamp-2">
                  {market.excerpt}
                </p>
              </div>

              {/* Sparkline & Main Price */}
              <div className="relative z-10 flex items-end justify-between border-t border-[#F2D8C8] pt-5 mt-auto mb-5">
                <div>
                  <div className="text-[11px] font-bold text-[#8A817A] uppercase tracking-wider mb-1">Current Price</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[24px] font-black text-[#161616] leading-none">{market.price}</span>
                    <span className="text-[13px] font-bold text-[#19C37D]">{market.change}</span>
                  </div>
                </div>
                <div className="h-8 w-24 opacity-60">
                  <svg viewBox="0 0 100 30" className="h-full w-full overflow-visible">
                    <path d="M0 25 C20 20, 30 28, 40 15 C50 5, 60 20, 80 10 C90 5, 95 2, 100 0" fill="none" stroke="#19C37D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M0 25 C20 20, 30 28, 40 15 C50 5, 60 20, 80 10 C90 5, 95 2, 100 0 L100 30 L0 30 Z" fill="url(#gradient-green)" className="opacity-20" />
                    <defs>
                      <linearGradient id="gradient-green" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#19C37D" stopOpacity="1" />
                        <stop offset="100%" stopColor="#19C37D" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="relative z-10 grid grid-cols-3 gap-2 bg-[#FFFDFB] rounded-xl p-3 border border-[#F2D8C8] mb-5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider mb-0.5">Mkt Cap</span>
                  <span className="text-[13px] font-bold text-[#161616]">{market.marketCap}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider mb-0.5">24h Vol</span>
                  <span className="text-[13px] font-bold text-[#161616]">{market.volume}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider mb-0.5">Holders</span>
                  <span className="text-[13px] font-bold text-[#161616]">{market.holders}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="relative z-10 w-full mt-auto">
                <button className="w-full flex h-[40px] items-center justify-center rounded-xl bg-[#FFF1ED] text-[14px] font-bold text-[#FF6B1A] transition-colors group-hover:bg-[#FF6B1A] group-hover:text-white">
                  Trade Market
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
