import React from "react";
import { AlertTriangle, AlertCircle } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

export default function RiskDisclosure() {
  return (
    <section className="w-full py-12 bg-[var(--surface-tertiary)]">
      <div className="mx-auto max-w-[900px] px-6">
        <FadeIn delay={0.1}>
          <div className="rounded-[24px] border-2 border-[#E9500E]/20 bg-gradient-to-br from-[var(--surface-peach)] to-[var(--surface-secondary)] p-6 md:p-8 shadow-sm relative overflow-hidden">
            
            <div className="absolute -top-10 -right-10 text-[#E9500E]/5">
              <AlertCircle className="h-48 w-48" />
            </div>

            <div className="relative z-10 flex items-start gap-5 flex-col md:flex-row">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#E9500E] text-white shadow-md">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 text-[20px] font-extrabold text-[var(--text-primary)]">Risk Disclosure & Disclaimer</h3>
                <p className="text-[14.5px] font-medium leading-relaxed text-[var(--text-secondary)] mb-5 max-w-[700px]">
                  KarmaFi is an experimental social trading protocol on BNB Chain. Trading social attention involves extreme volatility and a high risk of capital loss. Attention markets are inherently unpredictable and are not traditional financial assets. Do not trade with funds you cannot afford to lose. This platform does not offer financial advice.
                  <br /><br />
                  <a href="/whitepaper" className="font-bold text-[#E9500E] hover:underline underline-offset-4">Read full whitepaper &rarr;</a>
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="inline-flex items-center rounded-lg bg-[var(--surface-primary)] border border-[var(--border-soft)] px-3 py-1.5 text-[13px] font-bold text-[#E9500E]">
                    Highly Speculative
                  </span>
                  <span className="inline-flex items-center rounded-lg bg-[var(--surface-primary)] border border-[var(--border-soft)] px-3 py-1.5 text-[13px] font-bold text-[#E9500E]">
                    Extreme Volatility
                  </span>
                  <span className="inline-flex items-center rounded-lg bg-[var(--surface-primary)] border border-[var(--border-soft)] px-3 py-1.5 text-[13px] font-bold text-[#E9500E]">
                    Unaffiliated with Reddit
                  </span>
                  <span className="inline-flex items-center rounded-lg bg-[var(--surface-primary)] border border-[var(--border-soft)] px-3 py-1.5 text-[13px] font-bold text-[#E9500E]">
                    No Ownership Rights
                  </span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
