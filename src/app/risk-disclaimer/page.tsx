import React from "react";
import type { Metadata } from "next";
import {
  StaticPageLayout,
  PageHero,
  PageSection,
  TableOfContents,
} from "@/components/shared/StaticPageLayout";

export const metadata: Metadata = {
  title: "KarmaFi Risk Disclaimer",
  description:
    "Understand the risks of using KarmaFi, including speculative markets, volatility, smart contract risk, creator claim risk, and blockchain transaction risk.",
};

export default function RiskDisclaimerPage() {
  const tocItems = [
    { id: "speculative", label: "1. Speculative Market Risk" },
    { id: "no-ownership", label: "2. No Ownership Rights" },
    { id: "blockchain", label: "3. Blockchain Risk" },
    { id: "smart-contract", label: "4. Smart Contract Risk" },
    { id: "liquidity", label: "5. Liquidity Risk" },
    { id: "creator-claim", label: "6. Creator Claim Risk" },
    { id: "moderation", label: "7. Moderation Risk" },
    { id: "metadata", label: "8. Oracle / Metadata Risk" },
    { id: "regulatory", label: "9. Regulatory Risk" },
    { id: "no-advice", label: "10. No Financial Advice" },
  ];

  const currentDate = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <StaticPageLayout>
      <PageHero
        eyebrow="Risk Disclosure"
        heading="Risk Disclaimer"
        subheading="Karma Markets are experimental, speculative, and volatile. Understand the risks before participating."
      />

      <div className="mx-auto max-w-[1120px] px-6 pt-16">
        <div className="flex flex-col lg:flex-row gap-12 relative items-start">
          <TableOfContents items={tocItems} />

          <div className="flex-1 max-w-[800px]">
            <p className="text-[14px] text-[#8A817A] italic mb-10">Last updated: {currentDate}</p>

            <PageSection id="speculative" title="1. Speculative Market Risk">
              <p>Karma Markets may gain or lose value rapidly based on attention flows and trading activity. Tokens may become completely worthless. Never trade with funds you cannot afford to lose.</p>
            </PageSection>

            <PageSection id="no-ownership" title="2. No Ownership Rights">
              <p>Karma Markets do not grant ownership, copyright, licensing, endorsement, sponsorship, or affiliation with Reddit or original posters. They are purely speculative instruments indexing public metrics.</p>
            </PageSection>

            <PageSection id="blockchain" title="3. Blockchain Risk">
              <p>Transactions on the BNB Chain are irreversible. Wallet security, private key management, and transaction authorization are entirely the user’s responsibility.</p>
            </PageSection>

            <PageSection id="smart-contract" title="4. Smart Contract Risk">
              <p>Smart contracts may contain bugs, vulnerabilities, or unexpected behavior, especially during the Sandbox Alpha and Beta phases. Interacting with these contracts carries a risk of total loss of funds.</p>
            </PageSection>

            <PageSection id="liquidity" title="5. Liquidity Risk">
              <p>Due to the nature of bonding curves and emerging markets, users may be unable to sell positions at their expected prices or may experience significant slippage.</p>
            </PageSection>

            <PageSection id="creator-claim" title="6. Creator Claim Risk">
              <p>Creator claims may be delayed, rejected, disputed, or require additional verification. Holding a claimable balance does not guarantee immediate distribution.</p>
            </PageSection>

            <PageSection id="moderation" title="7. Moderation Risk">
              <p>Markets may be hidden or restricted from the KarmaFi frontend if they violate content, legal, or safety policies. This can severely impact market visibility and liquidity.</p>
            </PageSection>

            <PageSection id="metadata" title="8. Oracle / Metadata Risk">
              <p>Reddit post metadata, virality scores, or market signals may be delayed, incomplete, inaccurate, or manipulated by third parties. Trading decisions should not rely solely on these signals.</p>
            </PageSection>

            <PageSection id="regulatory" title="9. Regulatory Risk">
              <p>Digital assets and speculative attention markets may be subject to varying legal restrictions depending on your local jurisdiction. Users are responsible for their own compliance.</p>
            </PageSection>

            <PageSection id="no-advice" title="10. No Financial Advice">
              <p>KarmaFi does not provide financial, legal, tax, or investment advice. The platform provides software tools for market creation and interaction.</p>
            </PageSection>

            <div className="rounded-2xl border-2 border-[#E9500E]/20 bg-[#FFF1ED] p-6 mt-10">
              <p className="text-[16px] font-bold text-[#E9500E] text-center m-0">
                Warning: Use KarmaFi only if you fully understand and accept these risks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
}
