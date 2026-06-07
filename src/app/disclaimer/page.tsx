import React from "react";
import type { Metadata } from "next";
import {
  StaticPageLayout,
  PageHero,
  PageSection,
  TableOfContents,
} from "@/components/shared/StaticPageLayout";

export const metadata: Metadata = {
  title: "KarmaFi Disclaimer",
  description:
    "Read the KarmaFi general disclaimer about Reddit affiliation, BNB Chain affiliation, market risks, and platform limitations.",
};

export default function DisclaimerPage() {
  const tocItems = [
    { id: "reddit-affiliation", label: "1. No Reddit Affiliation" },
    { id: "bnb-affiliation", label: "2. No BNB Chain Endorsement" },
    { id: "no-ownership", label: "3. No Ownership of Source Content" },
    { id: "no-advice", label: "4. No Investment Advice" },
    { id: "experimental", label: "5. Experimental Protocol" },
    { id: "third-party", label: "6. Third-Party Services" },
    { id: "responsibility", label: "7. User Responsibility" },
  ];

  const currentDate = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <StaticPageLayout>
      <PageHero
        eyebrow="Legal"
        heading="Disclaimer"
        subheading="Important notices regarding KarmaFi's operational status and platform affiliations."
      />

      <div className="mx-auto max-w-[1120px] px-6 pt-16">
        <div className="flex flex-col lg:flex-row gap-12 relative items-start">
          <TableOfContents items={tocItems} />

          <div className="flex-1 max-w-[800px]">
            <p className="text-[14px] text-[#8A817A] italic mb-10">Last updated: {currentDate}</p>

            <PageSection id="reddit-affiliation" title="1. No Reddit Affiliation">
              <p>KarmaFi is not affiliated with, endorsed by, sponsored by, or connected to Reddit. Any Reddit-related references are used exclusively to identify public post sources and social momentum metrics.</p>
            </PageSection>

            <PageSection id="bnb-affiliation" title="2. No BNB Chain Endorsement">
              <p>KarmaFi may be built on BNB Chain infrastructure, but it is not endorsed by, sponsored by, or officially affiliated with BNB Chain unless explicitly stated by official BNB Chain sources.</p>
            </PageSection>

            <PageSection id="no-ownership" title="3. No Ownership of Source Content">
              <p>Karma Markets do not represent ownership, copyright, licensing, or control of any Reddit post or third-party content. They are independent derivative attention markets.</p>
            </PageSection>

            <PageSection id="no-advice" title="4. No Investment Advice">
              <p>Information on the KarmaFi platform, including market trends, virality scores, and pricing data, is for informational and experimental product purposes only and should not be construed as financial advice.</p>
            </PageSection>

            <PageSection id="experimental" title="5. Experimental Protocol">
              <p>KarmaFi is an experimental software protocol that may currently be in Alpha or Beta. Features may change, fail, pause, or be removed without notice.</p>
            </PageSection>

            <PageSection id="third-party" title="6. Third-Party Services">
              <p>Web3 wallets, RPC providers, Reddit APIs, blockchain explorers, and infrastructure providers are third-party services outside of KarmaFi’s direct control. KarmaFi is not responsible for outages or issues originating from these services.</p>
            </PageSection>

            <PageSection id="responsibility" title="7. User Responsibility">
              <p>Users are entirely responsible for their own decisions, wallet security, transaction approvals, and compliance with local laws and regulations.</p>
            </PageSection>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
}
