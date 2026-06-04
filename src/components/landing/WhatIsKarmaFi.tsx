import React from "react";
import { TrendingUp, Activity, ShieldCheck } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

export default function WhatIsKarmaFi() {
  return (
    <section className="w-full bg-[#FFFDFB] py-16 border-b border-[#F2D8C8]">
      <div className="mx-auto max-w-[1080px] px-6">
        
        <FadeIn delay={0.1}>
          <div className="text-center mb-12">
            <h2 className="text-[28px] md:text-[36px] font-extrabold tracking-tight text-[#161616]">
              What is KarmaFi?
            </h2>
            <p className="mt-3 text-[16px] font-medium text-[#5F5B57]">
              KarmaFi turns Reddit momentum into BNB Chain attention markets.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <FadeIn delay={0.2}>
            <div className="flex flex-col items-start rounded-3xl border border-[#F1DDD0] bg-white p-6 shadow-sm hover:shadow-md transition-shadow h-full">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFAB66]/20 text-[#FF6B1A]">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-[17px] font-bold text-[#161616]">Reddit Momentum</h3>
              <p className="text-[14.5px] font-medium leading-relaxed text-[#5F5B57]">
                Curators discover fast-moving Reddit posts before they become mainstream.
              </p>
            </div>
          </FadeIn>

          {/* Card 2 */}
          <FadeIn delay={0.3}>
            <div className="flex flex-col items-start rounded-3xl border border-[#F1DDD0] bg-white p-6 shadow-sm hover:shadow-md transition-shadow h-full">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3BA2F]/20 text-[#D89F12]">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-[17px] font-bold text-[#161616]">BNB Attention Markets</h3>
              <p className="text-[14.5px] font-medium leading-relaxed text-[#5F5B57]">
                Each post can become a tradable Karma Market powered by BNB Chain.
              </p>
            </div>
          </FadeIn>

          {/* Card 3 */}
          <FadeIn delay={0.4}>
            <div className="flex flex-col items-start rounded-3xl border border-[#F1DDD0] bg-white p-6 shadow-sm hover:shadow-md transition-shadow h-full">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9500E]/10 text-[#E9500E]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-[17px] font-bold text-[#161616]">Curator & Creator Rewards</h3>
              <p className="text-[14.5px] font-medium leading-relaxed text-[#5F5B57]">
                Early curators earn market fees, while original posters can claim their creator vault.
              </p>
            </div>
          </FadeIn>

        </div>

      </div>
    </section>
  );
}
