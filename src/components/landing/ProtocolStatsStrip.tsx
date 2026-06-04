import React from "react";
import { Users, BarChart3, Coins } from "lucide-react";

export default function ProtocolStatsStrip() {
  return (
    <div className="w-full bg-[#FFFDFC] border-b border-[#F2D8C8] py-5">
      <div className="mx-auto max-w-[1080px] px-6">
        
        <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-4 lg:gap-8">
          
          {/* Stat 1 */}
          <div className="flex w-[48%] md:w-auto items-center gap-3 rounded-2xl border border-[#F1DDD0] bg-white px-5 py-3 shadow-sm flex-1 justify-center md:justify-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFAB66]/10 text-[#FF6B1A]">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#161616]">128+</div>
              <div className="text-[11px] font-bold text-[#8A817A] uppercase tracking-wider">Karma Markets</div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex w-[48%] md:w-auto items-center gap-3 rounded-2xl border border-[#F1DDD0] bg-white px-5 py-3 shadow-sm flex-1 justify-center md:justify-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFAB66]/10 text-[#FF6B1A]">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#161616]">742.5 BNB</div>
              <div className="text-[11px] font-bold text-[#8A817A] uppercase tracking-wider">24H Volume</div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex w-[48%] md:w-auto items-center gap-3 rounded-2xl border border-[#F1DDD0] bg-white px-5 py-3 shadow-sm flex-1 justify-center md:justify-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFAB66]/10 text-[#FF6B1A]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#161616]">3,492</div>
              <div className="text-[11px] font-bold text-[#8A817A] uppercase tracking-wider">Active Curators</div>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex w-[48%] md:w-auto items-center gap-3 rounded-2xl border border-[#F1DDD0] bg-white px-5 py-3 shadow-sm flex-1 justify-center md:justify-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3BA2F]/10">
              <img src="/brand/bnb-symbol.svg" alt="BNB" className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold text-[#161616]">89.4 BNB</div>
              <div className="text-[11px] font-bold text-[#8A817A] uppercase tracking-wider">Creator Rewards</div>
            </div>
          </div>

        </div>

        <div className="mt-4 text-center">
          <span className="text-[11px] font-bold text-[#8A817A] bg-[#FFF1ED] px-2 py-1 rounded border border-[#F7C8BD]">Sandbox Environment Stats</span>
        </div>

      </div>
    </div>
  );
}
