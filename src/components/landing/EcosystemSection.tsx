import React from "react";

function FutureGlyph({ shape }: { shape: "diamond" | "circle" | "triangle" }) {
  const common = "h-4 w-4 text-[var(--text-muted)]";
  if (shape === "diamond")
    return (
      <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
        <path d="M12 2l6 10-6 4-6-4 6-10zm0 20l6-8-6 4-6-4 6 8z" opacity="0.9" />
      </svg>
    );
  if (shape === "triangle")
    return (
      <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
        <path d="M12 3l9 16H3L12 3z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

export default function EcosystemSection() {
  return (
    <section className="w-full bg-[var(--surface-tertiary)] py-16 border-b border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="relative overflow-hidden rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface-primary)] p-8 md:p-12 shadow-sm">
          {/* Soft warm glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#FFAB66]/25 to-transparent blur-3xl" />

          <div className="relative text-center mb-10">
            <h2 className="text-[28px] md:text-[36px] font-extrabold leading-tight tracking-tight text-[var(--text-primary)]">
              One protocol.
              <br className="hidden sm:block" /> Multiple ecosystems.
            </h2>
            <p className="mt-3 text-[16px] font-medium text-[var(--text-secondary)]">
              Trade Reddit attention from the blockchain you already use.
            </p>
          </div>

          {/* Active + upcoming chains */}
          <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* BNB Chain — Live */}
            <div className="flex items-center justify-between rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-secondary)] px-6 py-5">
              <div className="flex items-center gap-3.5">
                <img src="/brand/bnb-symbol.svg" alt="BNB Chain" className="h-8 w-8" />
                <span className="text-[16px] font-extrabold text-[var(--text-primary)]">BNB Chain</span>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-[#19C37D]/10 px-3 py-1">
                <span className="live-pulse h-1.5 w-1.5 rounded-full bg-[#19C37D]" aria-hidden="true" />
                <span className="text-[12px] font-black uppercase tracking-wide text-[#0F9D63]">Live</span>
              </span>
            </div>

            {/* Solana — Coming Soon */}
            <div className="relative flex items-center justify-between overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-secondary)] px-6 py-5">
              <span className="sol-breathe pointer-events-none absolute -left-6 top-1/2 -z-0 h-20 w-20 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(153,69,255,0.35),rgba(20,241,149,0.2),transparent_70%)]" aria-hidden="true" />
              <div className="relative flex items-center gap-3.5">
                <img src="/brand/solana-logo.svg" alt="Solana" className="h-7 w-7" />
                <span className="text-[16px] font-extrabold text-[var(--text-primary)]">Solana</span>
              </div>
              <span className="relative rounded-full bg-[var(--surface-peach)] px-3 py-1 text-[12px] font-black uppercase tracking-wide text-[#FF6B1A]">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Future ecosystems — faint, blurred, non-interactive */}
          <div className="relative mt-8 flex flex-col items-center gap-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Future ecosystems
            </span>
            <div
              className="flex flex-wrap items-center justify-center gap-3 opacity-45 blur-[1.5px] select-none"
              aria-hidden="true"
            >
              {[
                { name: "Base", shape: "circle" as const },
                { name: "Ethereum", shape: "diamond" as const },
                { name: "Avalanche", shape: "triangle" as const },
              ].map((c) => (
                <div
                  key={c.name}
                  className="flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-secondary)] px-4 py-2"
                >
                  <FutureGlyph shape={c.shape} />
                  <span className="text-[13.5px] font-bold text-[var(--text-muted)]">{c.name}</span>
                  <span className="rounded-full bg-[var(--surface-tertiary)] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[var(--text-muted)]">
                    Future
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
