import React from "react";
import { Zap, Coins, Gift, TrendingUp, Layers } from "lucide-react";

export default function BNBChainSection() {
  return (
    <section className="w-full bg-[var(--surface-tertiary)] py-16 border-b border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1080px] px-6">
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Text */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-[28px] md:text-[36px] font-extrabold tracking-tight text-[var(--text-primary)] mb-5 leading-tight">
              Built for <span className="text-[#FF6B1A]">BNB Chain</span> attention markets
            </h2>
            <p className="text-[16px] font-medium leading-relaxed text-[var(--text-secondary)] mb-8 max-w-[600px] mx-auto lg:mx-0">
              KarmaFi uses BNB Chain for fast, low-cost market creation, BEP-20 attention tokens, curator rewards, and creator claim vaults.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              <div className="flex items-center gap-2.5 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-strong)] px-5 py-2.5 text-[14.5px] font-bold text-[var(--text-primary)] shadow-sm">
                <Zap className="h-4 w-4 text-[#FF6B1A]" /> Low-cost trading
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-strong)] px-5 py-2.5 text-[14.5px] font-bold text-[var(--text-primary)] shadow-sm">
                <Coins className="h-4 w-4 text-[#FF6B1A]" /> BEP-20 attention markets
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-strong)] px-5 py-2.5 text-[14.5px] font-bold text-[var(--text-primary)] shadow-sm">
                <Gift className="h-4 w-4 text-[#FF6B1A]" /> Creator rewards
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-strong)] px-5 py-2.5 text-[14.5px] font-bold text-[var(--text-primary)] shadow-sm">
                <TrendingUp className="h-4 w-4 text-[#FF6B1A]" /> Curator incentives
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-strong)] px-5 py-2.5 text-[14.5px] font-bold text-[var(--text-primary)] shadow-sm">
                <Layers className="h-4 w-4 text-[#FF6B1A]" /> Future liquidity routing
              </div>
            </div>

            <div className="mt-8">
              <a href="/whitepaper" className="inline-flex items-center text-[15px] font-bold text-[#FF6B1A] hover:text-[#E9500E] hover:underline underline-offset-4 transition-all">
                Read the protocol whitepaper &rarr;
              </a>
            </div>
          </div>

          {/* Right Visual */}
          <div className="flex-1 w-full flex justify-center">
            <div className="relative w-full max-w-[480px]">
              {/* Premium Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F3BA2F]/30 to-[#FF6B1A]/20 blur-2xl opacity-60 rounded-full pointer-events-none transform -translate-y-4" />
              
              {/* Outer decorative ring */}
              <div className="absolute inset-0 rounded-[40px] border border-[#F3BA2F]/40 bg-gradient-to-br from-[#F3BA2F]/10 to-transparent transform rotate-2" />
              
              {/* Inner card */}
              <div className="relative rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface-primary)] p-12 shadow-[0_24px_48px_rgba(243,186,47,0.12)] flex flex-col items-center justify-center min-h-[340px]">
                
                <img src="/brand/bnb-chain-logo.svg" alt="BNB Chain Native" className="h-16 md:h-20 mb-10 transform transition-transform hover:scale-105 duration-500" />
                
                <div className="flex items-center gap-2.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-6 py-2.5 text-[14.5px] font-extrabold text-[var(--text-primary)] shadow-sm">
                  <img src="/brand/bnb-symbol.svg" alt="BNB" className="h-5 w-5" />
                  Built on BNB Chain
                </div>

                {/* Decorative connection lines */}
                <svg className="absolute -z-10 w-full h-full inset-0 opacity-15" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M50 50 L10 10 M50 50 L90 10 M50 50 L10 90 M50 50 L90 90" stroke="#F3BA2F" strokeWidth="2.5" strokeDasharray="4 6" />
                </svg>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
