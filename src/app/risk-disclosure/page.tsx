import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RiskDisclosure() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="rounded-3xl border border-brand-border bg-[var(--surface-primary)] p-8 shadow-sm text-xs text-brand-muted leading-relaxed flex flex-col gap-6">
          <h1 className="text-2xl font-extrabold text-brand-charcoal">Risk Disclosure</h1>
          <p className="text-sm font-semibold text-brand-charcoal">Last Updated: June 2, 2026</p>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-brand-charcoal">1. High Volatility & Loss of Capital</h2>
            <p>
              Trading attention tokens involves extreme volatility and high speculative risk. Values fluctuate mathematically based on bonding curve mechanics and trading velocity. Prices can drop to zero instantly if public trading interest or social momentum declines.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-brand-charcoal">2. No Underlying Assets</h2>
            <p>
              Tokens issued on KarmaFi do not represent equity, debt, shares, utility, or right to buy/sell assets of any corporate entity, including Reddit, Inc. They do not represent ownership of the social post contents. They are speculative synthetic indicators tracking social momentum.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-brand-charcoal">3. Smart Contract and Network Risk</h2>
            <p>
              The platform utilizes automated smart contracts on BNB Smart Chain. Smart contracts are subject to bugs, gas price spikes, network congestion, and exploits. KarmaFi has no control over decentralized blockchain networks or individual transaction speeds.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-brand-charcoal">4. Creator Opt-Out and Moderation Rules</h2>
            <p>
              Markets are subject to moderation reports. A pool can be flagged or hidden from the interface if it contains illegal, infringing, doxxing, or abusive content. Furthermore, original Reddit posters have the right to request deletion or creator opt-out, which will hide the market visibility.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
