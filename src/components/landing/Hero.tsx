import React from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, MessageSquare, CheckCircle2 } from "lucide-react";
import ProductPreview from "./ProductPreview";
import FadeIn from "@/components/ui/FadeIn";

export default function Hero() {
  return (
    <section className="relative w-full pt-20 pb-10 md:pt-24 md:pb-12 overflow-hidden bg-[#FFFDFC] -mt-[72px]">
      
      {/* Exact Match Background from Screenshot */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Base Gradient: White to warm peach to WhatIsKarmaFi background */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, #FFFDFC 0%, #FFF5EE 40%, #FFE8DA 70%, #FFFDFB 100%)'
          }}
        />
        
        {/* Ribbed/Curtain Pattern */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(90deg, rgba(255,107,26,0.02) 0px, rgba(255,107,26,0.12) 40px, rgba(255,107,26,0.02) 80px)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 15%, black 40%, black 75%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 15%, black 40%, black 75%, transparent 100%)'
          }}
        />
        
        {/* Central Glow to highlight headline/content */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-white/40 blur-[100px] rounded-full pointer-events-none" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 text-center z-10 flex flex-col items-center">
        
        {/* Badges Inspired by Restonreddit */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col items-center gap-3 mb-6 mt-8">
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-[#F1DDD0] bg-white/60 backdrop-blur-sm px-4 py-2 text-[13px] font-bold text-[#161616] shadow-sm">
                <img src="/brand/bnb-symbol.svg" alt="BNB" className="h-4 w-4" />
                BNB Chain Native
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[#F1DDD0] bg-white/60 backdrop-blur-sm px-4 py-2 text-[13px] font-bold text-[#161616] shadow-sm">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-[#19C37D] text-white">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                </div>
                Creator Claim Vault
              </div>
            </div>
            
            {/* Trust Pill */}
            <div className="flex items-center gap-2 rounded-full border border-[#F1DDD0] bg-white/60 backdrop-blur-sm px-4 py-1.5 text-[12px] font-bold text-[#5F5B57] shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
              <div className="flex -space-x-2">
                <div className="h-5 w-5 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[9px]">👨‍💻</div>
                <div className="h-5 w-5 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-[9px]">👩‍🎨</div>
                <div className="h-5 w-5 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center text-[9px]">🚀</div>
              </div>
              <span className="ml-1">Trusted by early curators & creators</span>
            </div>
          </div>
        </FadeIn>

        {/* Headline */}
        <FadeIn delay={0.2}>
          <h1 className="mx-auto max-w-[980px] text-[36px] leading-[1.05] tracking-[-0.03em] md:text-[52px] lg:text-[64px] font-[900] text-[#161616] mb-4">
            Trade{" "}
            <span className="inline-flex relative -top-1 mx-1 h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFAB66] to-[#E9500E] shadow-[0_8px_16px_rgba(255,107,26,0.4),inset_0_2px_4px_rgba(255,255,255,0.5)] border border-[#FF8A1F]">
              <TrendingUp className="h-5 w-5 md:h-7 md:w-7 text-white" strokeWidth={3} />
            </span>{" "}
            Reddit attention <br className="hidden md:block" />
            before it goes{" "}
            <span className="inline-flex relative -top-1 mx-1 h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFAB66] to-[#E9500E] shadow-[0_8px_16px_rgba(255,107,26,0.4),inset_0_2px_4px_rgba(255,255,255,0.5)] border border-[#FF8A1F]">
              <MessageSquare className="h-5 w-5 md:h-7 md:w-7 text-white" strokeWidth={3} />
            </span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A1F] to-[#E9500E]">viral</span>.
          </h1>
        </FadeIn>

        {/* Subheadline */}
        <FadeIn delay={0.3}>
          <p className="mx-auto max-w-[640px] text-[16px] md:text-[17px] leading-[1.6] text-[#5F5B57] font-medium mb-6">
            KarmaFi helps curators discover Reddit momentum early and launch BNB Chain attention markets at the right time, every time.
          </p>
        </FadeIn>

        {/* CTAs */}
        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link
              href="/launch"
              className="group flex h-[48px] items-center justify-center rounded-full bg-gradient-to-b from-[#FF8A1F] to-[#E9500E] px-8 text-[16px] font-extrabold text-white shadow-[0_12px_24px_rgba(255,107,26,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] border border-[#E9500E]"
            >
              Launch a Karma Market
              <div className="ml-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
            <Link
              href="/feed"
              className="flex h-[48px] items-center justify-center rounded-full bg-white border border-[#F2D8C8] px-8 text-[16px] font-bold text-[#161616] shadow-sm hover:border-[#FF6B1A] hover:text-[#FF6B1A] transition-colors"
            >
              Explore Markets
            </Link>
          </div>
        </FadeIn>

        {/* 2-Column Trust Bullets */}
        <FadeIn delay={0.5}>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-3 text-[14px] font-bold text-[#5F5B57] mb-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#161616] text-white">
                <CheckCircle2 className="h-3 w-3" />
              </div>
              No More Posts Lost In The Void
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#161616] text-white">
                <CheckCircle2 className="h-3 w-3" />
              </div>
              Launch At Peak Momentum
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#161616] text-white">
                <CheckCircle2 className="h-3 w-3" />
              </div>
              BNB Chain Native
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#161616] text-white">
                <CheckCircle2 className="h-3 w-3" />
              </div>
              Built For Curators & Creators
            </div>
          </div>
        </FadeIn>
        
        {/* Product Preview Card anchored inside Hero */}
        <FadeIn delay={0.6}>
          <div className="w-full max-w-[1020px] mx-auto z-20">
            <ProductPreview />
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
