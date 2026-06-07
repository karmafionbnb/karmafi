"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, Clock, CheckCircle2 } from "lucide-react";
import { parseEther, formatEther } from "viem";
import { pricePerToken, supplyForReserve } from "@/lib/web3/contracts";

function priceBnbFromMarketCap(marketCapBnb: number): number {
  try {
    return Number(formatEther(pricePerToken(supplyForReserve(parseEther(String(marketCapBnb || 0))))));
  } catch {
    return 0;
  }
}

export default function FeaturedMarkets() {
  const [markets, setMarkets] = useState<any[]>([]);
  const [bnbUsd, setBnbUsd] = useState(0);

  useEffect(() => {
    fetch("/api/market?sort=hot")
      .then((r) => r.json())
      .then((d) => { if (d.success) setMarkets((d.markets || []).slice(0, 3)); })
      .catch(() => {});
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd")
      .then((r) => r.json())
      .then((j) => { const p = Number(j?.binancecoin?.usd); if (p > 0) setBnbUsd(p); })
      .catch(() => {});
  }, []);

  const usd = (b: number) =>
    bnbUsd > 0 ? `$${(b * bnbUsd).toLocaleString("en-US", { maximumFractionDigits: 2 })}` : `${(b || 0).toFixed(4)} BNB`;

  return (
    <section className="w-full py-16 bg-[#FFFAF5] border-y border-[#F2D8C8]">
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-[28px] md:text-[36px] font-[900] tracking-tight text-[#161616] mb-2">Featured Markets</h2>
            <p className="text-[16px] text-[#5F5B57] font-medium max-w-xl">The hottest Reddit attention markets trading right now.</p>
          </div>
          <Link href="/feed" className="group flex items-center gap-2 rounded-full border border-[#F2D8C8] bg-white px-6 py-3 text-sm font-bold text-[#161616] shadow-sm hover:border-[#FF6B1A] transition-all">
            View All Markets
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {markets.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#E8D4C8] bg-white p-12 text-center">
            <p className="text-[15px] font-medium text-[#5F5B57]">No markets yet — <Link href="/launch" className="text-[#FF6B1A] font-bold underline">launch the first one</Link>.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {markets.map((m) => {
              const priceBnb = priceBnbFromMarketCap(m.marketCap || 0);
              return (
                <Link
                  key={m.marketAddress}
                  href={`/market/${m.marketAddress}`}
                  className="group relative flex h-full flex-col rounded-[24px] border border-[#E8D4C8] bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6B1A] hover:shadow-[0_20px_40px_rgba(255,107,26,0.12)] overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF6B1A]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-[#FFFDFC] border border-[#F1DDD0] px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-[#161616] uppercase">{m.subreddit}</span>
                      <div className="flex items-center gap-1 rounded-md bg-[#FFF1ED] px-2.5 py-1 text-[11px] font-extrabold text-[#FF6B1A] uppercase">
                        <Flame className="h-3 w-3" /> Score {m.viralityScore}
                      </div>
                    </div>
                    {m.creatorWallet ? (
                      <div className="flex items-center gap-1 rounded-md bg-[#19C37D]/10 px-2 py-1 text-[10px] font-extrabold text-[#19C37D] uppercase tracking-wide">
                        <CheckCircle2 className="h-3 w-3" /> Claimed
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 rounded-md bg-[#8A817A]/10 px-2 py-1 text-[10px] font-extrabold text-[#8A817A] uppercase tracking-wide">Unclaimed</div>
                    )}
                  </div>

                  <div className="relative z-10 mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded bg-[#F3BA2F]/15 px-2 py-0.5 text-[12px] font-bold text-[#D89F12]">${m.symbol}</span>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#8A817A]">
                        <Clock className="h-3 w-3" /> {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ""}
                      </div>
                    </div>
                    <h3 className="text-[18px] font-extrabold text-[#161616] leading-snug group-hover:text-[#FF6B1A] transition-colors line-clamp-2 mb-2">{m.title}</h3>
                    <p className="text-[14px] text-[#5F5B57] font-medium leading-relaxed line-clamp-2">Trending discussion on {m.subreddit}.</p>
                  </div>

                  <div className="relative z-10 flex items-end justify-between border-t border-[#F2D8C8] pt-5 mt-auto mb-5">
                    <div>
                      <div className="text-[11px] font-bold text-[#8A817A] uppercase tracking-wider mb-1">Current Price</div>
                      <span className="text-[24px] font-black text-[#161616] leading-none">{usd(priceBnb)}</span>
                    </div>
                  </div>

                  <div className="relative z-10 grid grid-cols-3 gap-2 bg-[#FFFDFB] rounded-xl p-3 border border-[#F2D8C8] mb-5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider mb-0.5">Mkt Cap</span>
                      <span className="text-[13px] font-bold text-[#161616]">{usd(m.marketCap || 0)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider mb-0.5">24h Vol</span>
                      <span className="text-[13px] font-bold text-[#161616]">{usd(m.volume24h || 0)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#8A817A] uppercase tracking-wider mb-0.5">Holders</span>
                      <span className="text-[13px] font-bold text-[#161616]">{m.holdersCount || 0}</span>
                    </div>
                  </div>

                  <div className="relative z-10 w-full mt-auto">
                    <span className="w-full flex h-[40px] items-center justify-center rounded-xl bg-[#FFF1ED] text-[14px] font-bold text-[#FF6B1A] transition-colors group-hover:bg-[#FF6B1A] group-hover:text-white">
                      Trade Market
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
