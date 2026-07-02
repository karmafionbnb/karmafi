"use client";

import React, { useState } from "react";

export default function EcosystemRow() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="flex items-center gap-4">
        <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Built on
        </span>

        {/* BNB Chain — highlighted, live */}
        <div className="relative flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-primary)] px-3.5 py-1.5 shadow-sm">
          <img src="/brand/bnb-symbol.svg" alt="BNB Chain" className="h-4 w-4" />
          <span className="text-[13px] font-extrabold text-[var(--text-primary)]">BNB Chain</span>
          <span className="live-pulse ml-0.5 h-1.5 w-1.5 rounded-full bg-[#19C37D]" aria-hidden="true" />
        </div>

        <span className="text-[var(--text-muted)]/50 text-[13px]">•</span>

        {/* Solana — muted, coming soon */}
        <div
          className="relative flex cursor-default items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-primary)] px-3.5 py-1.5 shadow-sm transition-all duration-500"
          style={{
            opacity: hovered ? 1 : 0.72,
            transform: hovered ? "scale(1.04)" : "scale(1)",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Breathing glow */}
          <span
            className="sol-breathe pointer-events-none absolute -inset-1 -z-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(153,69,255,0.35),rgba(20,241,149,0.18),transparent_70%)]"
            aria-hidden="true"
          />
          <img
            src="/brand/solana-logo.svg"
            alt="Solana"
            className="h-3.5 w-3.5 transition-transform duration-500"
            style={{ filter: hovered ? "saturate(1)" : "saturate(0.85)" }}
          />
          <span className="text-[13px] font-extrabold text-[var(--text-primary)]">Solana</span>
          <span className="rounded-full bg-[var(--surface-peach)] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#FF6B1A]">
            Soon
          </span>

          {/* Hover reveal */}
          <div
            className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] z-20 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[var(--border-soft)] bg-[var(--surface-primary)] px-3 py-1.5 text-[12px] font-semibold text-[var(--text-secondary)] shadow-md transition-all duration-300"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translate(-50%, 0)" : "translate(-50%, -4px)",
            }}
          >
            Native Solana support coming soon.
          </div>
        </div>
      </div>
    </div>
  );
}
