import React from "react";
import type { Metadata } from "next";
import {
  StaticPageLayout,
  PageHero,
  PageSection,
  CalloutCard,
  TableOfContents,
} from "@/components/shared/StaticPageLayout";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "KarmaFi Smart Contracts | BNB Chain Attention Markets",
  description:
    "Explore KarmaFi’s planned smart contract architecture for attention markets, bonding curves, fee distribution, and creator claim vaults.",
};

export default function SmartContractsPage() {
  const tocItems = [
    { id: "overview", label: "1. Contract Overview" },
    { id: "status", label: "2. Contract Status" },
    { id: "fees", label: "3. Fee Distribution" },
    { id: "security", label: "4. Security Notes" },
    { id: "developers", label: "5. Developer Links" },
  ];

  return (
    <StaticPageLayout>
      <PageHero
        eyebrow="Protocol Architecture"
        heading="Smart Contracts"
        subheading="KarmaFi’s smart contract layer powers Karma Market creation, attention token trading, fee distribution, curator rewards, and Creator Claim Vaults on BNB Chain."
      />

      <div className="mx-auto max-w-[1120px] px-6 pt-16">
        <div className="flex flex-col lg:flex-row gap-12 relative items-start">
          <TableOfContents items={tocItems} />

          <div className="flex-1 max-w-[800px]">
            <PageSection id="overview" title="1. Contract Overview">
              <div className="space-y-4 mt-6">
                <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-primary)] p-5 shadow-sm">
                  <h4 className="text-[16px] font-bold text-[var(--text-primary)] mb-2 m-0 font-mono">KarmaFiFactory</h4>
                  <p className="text-[14.5px] text-[var(--text-muted)] m-0">Creates new Karma Markets and prevents duplicate source launches.</p>
                </div>
                <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-primary)] p-5 shadow-sm">
                  <h4 className="text-[16px] font-bold text-[var(--text-primary)] mb-2 m-0 font-mono">AttentionToken</h4>
                  <p className="text-[14.5px] text-[var(--text-muted)] m-0">BEP-20 compatible attention market token.</p>
                </div>
                <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-primary)] p-5 shadow-sm">
                  <h4 className="text-[16px] font-bold text-[var(--text-primary)] mb-2 m-0 font-mono">BondingCurveMarket</h4>
                  <p className="text-[14.5px] text-[var(--text-muted)] m-0">Handles buy/sell mechanics, quotes, fees, and slippage protection.</p>
                </div>
                <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-primary)] p-5 shadow-sm">
                  <h4 className="text-[16px] font-bold text-[var(--text-primary)] mb-2 m-0 font-mono">FeeDistributor</h4>
                  <p className="text-[14.5px] text-[var(--text-muted)] m-0">Splits protocol fees between creator vault, curator rewards, treasury, liquidity reserve, and moderation/safety fund.</p>
                </div>
                <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-primary)] p-5 shadow-sm">
                  <h4 className="text-[16px] font-bold text-[var(--text-primary)] mb-2 m-0 font-mono">CreatorClaimVault</h4>
                  <p className="text-[14.5px] text-[var(--text-muted)] m-0">Stores and releases reserved creator rewards after verification.</p>
                </div>
                <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-primary)] p-5 shadow-sm">
                  <h4 className="text-[16px] font-bold text-[var(--text-primary)] mb-2 m-0 font-mono">MarketRegistry</h4>
                  <p className="text-[14.5px] text-[var(--text-muted)] m-0">Stores market metadata, source hashes, token addresses, and market status.</p>
                </div>
              </div>
            </PageSection>

            <PageSection id="status" title="2. Contract Status">
              <div className="overflow-x-auto mt-6">
                <table className="w-full text-left border-collapse min-w-[700px] text-[14.5px]">
                  <thead>
                    <tr className="border-b-2 border-[var(--text-primary)] bg-[var(--surface-secondary)]">
                      <th className="py-3 px-4 font-bold text-[var(--text-primary)]">Contract</th>
                      <th className="py-3 px-4 font-bold text-[var(--text-primary)]">Status</th>
                      <th className="py-3 px-4 font-bold text-[var(--text-primary)]">Network</th>
                      <th className="py-3 px-4 font-bold text-[var(--text-primary)]">Address</th>
                      <th className="py-3 px-4 font-bold text-[var(--text-primary)]">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="font-medium text-[var(--text-secondary)]">
                    {[
                      "KarmaFiFactory",
                      "AttentionToken",
                      "BondingCurveMarket",
                      "FeeDistributor",
                      "CreatorClaimVault",
                    ].map((contract, i) => (
                      <tr key={contract} className={`border-b border-[var(--border-subtle)] ${i % 2 === 0 ? "bg-[var(--surface-primary)]" : "bg-[var(--surface-tertiary)]"}`}>
                        <td className="py-3 px-4 font-bold text-[var(--text-primary)] font-mono text-[13.5px]">{contract}</td>
                        <td className="py-3 px-4">Planned / Testnet</td>
                        <td className="py-3 px-4">BNB Testnet</td>
                        <td className="py-3 px-4 text-[var(--text-muted)] italic">Coming soon</td>
                        <td className="py-3 px-4 text-[#E9500E]">Unaudited</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </PageSection>

            <PageSection id="fees" title="3. Fee Distribution">
              <div className="overflow-x-auto mt-6">
                <table className="w-full text-left border-collapse min-w-[400px] text-[15px]">
                  <tbody className="font-medium text-[var(--text-secondary)]">
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-primary)]">
                      <td className="py-3 px-4 font-bold text-[var(--text-primary)]">Creator Vault</td>
                      <td className="py-3 px-4 text-[#19C37D] font-bold">30%</td>
                    </tr>
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-tertiary)]">
                      <td className="py-3 px-4 font-bold text-[var(--text-primary)]">Curator Share</td>
                      <td className="py-3 px-4 text-[#FF6B1A] font-bold">25%</td>
                    </tr>
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-primary)]">
                      <td className="py-3 px-4 font-bold text-[var(--text-primary)]">Protocol Treasury</td>
                      <td className="py-3 px-4">25%</td>
                    </tr>
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-tertiary)]">
                      <td className="py-3 px-4 font-bold text-[var(--text-primary)]">Liquidity Reserve</td>
                      <td className="py-3 px-4">15%</td>
                    </tr>
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-primary)]">
                      <td className="py-3 px-4 font-bold text-[var(--text-primary)]">Safety & Moderation</td>
                      <td className="py-3 px-4">5%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[14px] text-[var(--text-muted)] italic mt-4">
                Note: Exact fee parameters may change during Alpha.
              </p>
            </PageSection>

            <PageSection id="security" title="4. Security Notes">
              <ul>
                <li>Contracts are experimental until audited.</li>
                <li>Do not interact with unofficial contract addresses.</li>
                <li>Verify contract addresses from this page only.</li>
                <li>Use testnet while in Alpha.</li>
                <li>Mainnet contracts will be published after audit/review.</li>
              </ul>

              <CalloutCard
                title={<><AlertTriangle className="h-5 w-5" /> Experimental Risk Warning</>}
                type="warning"
              >
                KarmaFi smart contracts are experimental and may be unaudited during Alpha. Users should only interact with official links and understand the risks of bugs or vulnerabilities.
              </CalloutCard>
            </PageSection>

            <PageSection id="developers" title="5. Developer Links">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-primary)] p-5 shadow-sm text-center">
                  <h4 className="text-[16px] font-bold text-[var(--text-primary)] m-0">GitHub</h4>
                  <p className="text-[14px] text-[var(--text-muted)] mt-1 m-0">Coming soon</p>
                </div>
                <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-primary)] p-5 shadow-sm text-center">
                  <h4 className="text-[16px] font-bold text-[var(--text-primary)] m-0">Testnet Explorer</h4>
                  <p className="text-[14px] text-[var(--text-muted)] mt-1 m-0">Coming soon</p>
                </div>
                <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-primary)] p-5 shadow-sm text-center">
                  <h4 className="text-[16px] font-bold text-[var(--text-primary)] m-0">Audit Report</h4>
                  <p className="text-[14px] text-[var(--text-muted)] mt-1 m-0">Coming soon</p>
                </div>
                <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-primary)] p-5 shadow-sm text-center">
                  <h4 className="text-[16px] font-bold text-[var(--text-primary)] m-0">Deployment Docs</h4>
                  <p className="text-[14px] text-[var(--text-muted)] mt-1 m-0">Coming soon</p>
                </div>
              </div>
            </PageSection>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
}
