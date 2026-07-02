import React from "react";

export default function ChainTrustBar() {
  return (
    <section className="w-full border-b border-[var(--border-subtle)] bg-[var(--surface-secondary)]">
      <div className="mx-auto flex max-w-[1080px] items-center justify-center gap-8 px-6 py-4 sm:gap-14">
        {/* BNB Chain — Live */}
        <div className="flex items-center gap-2.5">
          <img src="/brand/bnb-symbol.svg" alt="BNB Chain" className="h-5 w-5" />
          <span className="text-[13.5px] font-extrabold text-[var(--text-primary)]">BNB Chain</span>
          <span className="flex items-center gap-1.5 rounded-full bg-[#19C37D]/10 px-2.5 py-0.5">
            <span className="live-pulse h-1.5 w-1.5 rounded-full bg-[#19C37D]" aria-hidden="true" />
            <span className="text-[11px] font-black uppercase tracking-wide text-[#0F9D63]">Live</span>
          </span>
        </div>

        <span className="h-5 w-px bg-[var(--border-strong)]" aria-hidden="true" />

        {/* Solana — Coming Soon */}
        <div className="flex items-center gap-2.5" style={{ opacity: 0.85 }}>
          <img src="/brand/solana-logo.svg" alt="Solana" className="h-[18px] w-[18px]" />
          <span className="text-[13.5px] font-extrabold text-[var(--text-primary)]">Solana</span>
          <span className="rounded-full bg-[var(--surface-peach)] px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide text-[#FF6B1A]">
            Coming Soon
          </span>
        </div>
      </div>
    </section>
  );
}
