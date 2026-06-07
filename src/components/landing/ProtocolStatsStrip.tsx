"use client";

import React, { useEffect, useState } from "react";
import { Users, BarChart3, Coins } from "lucide-react";

export default function ProtocolStatsStrip() {
  const [stats, setStats] = useState({ markets: 0, volBnb: 0, curators: 0, rewardsBnb: 0 });
  const [bnbUsd, setBnbUsd] = useState(0);

  useEffect(() => {
    fetch("/api/market")
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) return;
        const ms: any[] = d.markets || [];
        const volBnb = ms.reduce((a, m) => a + (m.volume24h || 0), 0);
        const curators = new Set(ms.map((m) => (m.curatorWallet || "").toLowerCase()).filter(Boolean)).size;
        setStats({ markets: ms.length, volBnb, curators, rewardsBnb: volBnb * 0.01 * 0.3 });
      })
      .catch(() => {});
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd")
      .then((r) => r.json())
      .then((j) => { const p = Number(j?.binancecoin?.usd); if (p > 0) setBnbUsd(p); })
      .catch(() => {});
  }, []);

  const usd = (b: number) =>
    bnbUsd > 0 ? `$${(b * bnbUsd).toLocaleString("en-US", { maximumFractionDigits: 2 })}` : `${b.toFixed(2)} BNB`;

  return (
    <div className="w-full bg-[#FFFDFC] border-b border-[#F2D8C8] py-5">
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-4 lg:gap-8">
          <div className="flex w-[48%] md:w-auto items-center gap-3 rounded-2xl border border-[#F1DDD0] bg-white px-5 py-3 shadow-sm flex-1 justify-center md:justify-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFAB66]/10 text-[#FF6B1A]">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#161616]">{stats.markets}</div>
              <div className="text-[11px] font-bold text-[#8A817A] uppercase tracking-wider">Karma Markets</div>
            </div>
          </div>

          <div className="flex w-[48%] md:w-auto items-center gap-3 rounded-2xl border border-[#F1DDD0] bg-white px-5 py-3 shadow-sm flex-1 justify-center md:justify-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFAB66]/10 text-[#FF6B1A]">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#161616]">{usd(stats.volBnb)}</div>
              <div className="text-[11px] font-bold text-[#8A817A] uppercase tracking-wider">24H Volume</div>
            </div>
          </div>

          <div className="flex w-[48%] md:w-auto items-center gap-3 rounded-2xl border border-[#F1DDD0] bg-white px-5 py-3 shadow-sm flex-1 justify-center md:justify-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFAB66]/10 text-[#FF6B1A]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#161616]">{stats.curators.toLocaleString()}</div>
              <div className="text-[11px] font-bold text-[#8A817A] uppercase tracking-wider">Active Curators</div>
            </div>
          </div>

          <div className="flex w-[48%] md:w-auto items-center gap-3 rounded-2xl border border-[#F1DDD0] bg-white px-5 py-3 shadow-sm flex-1 justify-center md:justify-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3BA2F]/10">
              <img src="/brand/bnb-symbol.svg" alt="BNB" className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#161616]">{usd(stats.rewardsBnb)}</div>
              <div className="text-[11px] font-bold text-[#8A817A] uppercase tracking-wider">Creator Rewards</div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <span className="text-[11px] font-bold text-[#8A817A] bg-[#FFF1ED] px-2 py-1 rounded border border-[#F7C8BD]">Live Protocol Stats</span>
        </div>
      </div>
    </div>
  );
}
