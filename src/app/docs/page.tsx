import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Compass, AlertTriangle } from "lucide-react";
import {
  StaticPageLayout,
  PageHero,
  PageSection,
  TableOfContents,
  CalloutCard,
} from "@/components/shared/StaticPageLayout";

export const metadata: Metadata = {
  title: "KarmaFi Documentation | Attention Markets on BNB Chain",
  description:
    "Learn how KarmaFi works, including Karma Markets, Reddit momentum, curator rewards, Creator Claim Vaults, and BNB Chain infrastructure.",
};

export default function DocsPage() {
  const tocItems = [
    { id: "getting-started", label: "1. Getting Started" },
    { id: "what-is-karma-market", label: "2. What is a Karma Market?" },
    { id: "launching", label: "3. Launching a Market" },
    { id: "trading", label: "4. Trading a Market" },
    { id: "curator-rewards", label: "5. Curator Rewards" },
    { id: "creator-vault", label: "6. Creator Claim Vault" },
    { id: "bnb-setup", label: "7. BNB Chain Setup" },
    { id: "faq", label: "8. FAQ" },
  ];

  return (
    <StaticPageLayout>
      <PageHero
        eyebrow="KarmaFi Docs"
        heading="Documentation"
        subheading="A practical guide to using KarmaFi, launching Karma Markets, trading Reddit momentum, and claiming rewards."
      >
        <Link
          href="/launch"
          className="flex h-[50px] items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] px-8 text-[15.5px] font-extrabold text-white shadow-[0_8px_20px_rgba(255,107,26,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          Launch Market
        </Link>
        <Link
          href="/feed"
          className="flex h-[50px] items-center justify-center rounded-full bg-[var(--surface-primary)] border border-[var(--border-strong)] px-8 text-[15.5px] font-bold text-[var(--text-primary)] shadow-sm hover:border-[#FF6B1A] hover:text-[#FF6B1A] transition-colors"
        >
          Explore Markets
          <Compass className="ml-2 h-4 w-4" />
        </Link>
        <Link
          href="/whitepaper"
          className="flex h-[50px] items-center justify-center rounded-full bg-[var(--surface-primary)] border border-[var(--border-strong)] px-8 text-[15.5px] font-bold text-[var(--text-muted)] shadow-sm hover:bg-[var(--surface-tertiary)] transition-colors"
        >
          Read Whitepaper
        </Link>
      </PageHero>

      <div className="mx-auto max-w-[1120px] px-6 pt-16">
        <div className="flex flex-col lg:flex-row gap-12 relative items-start">
          <TableOfContents items={tocItems} />

          <div className="flex-1 max-w-[800px]">
            <PageSection id="getting-started" title="1. Getting Started">
              <p>
                KarmaFi is a platform for creating and trading speculative
                markets around the momentum of Reddit posts. To get started:
              </p>
              <ul>
                <li><strong>Connect Wallet:</strong> Use MetaMask, Trust Wallet, or WalletConnect on BNB Chain.</li>
                <li><strong>Explore Markets:</strong> Browse currently active attention markets.</li>
                <li><strong>Paste Reddit URL:</strong> Find a fast-growing Reddit post and bring it to KarmaFi.</li>
                <li><strong>Launch Karma Market:</strong> Be the first to deploy the market on-chain.</li>
                <li><strong>Trade Attention:</strong> Buy and sell exposure using the bonding curve.</li>
                <li><strong>Claim Rewards:</strong> Original Reddit posters can verify ownership and claim reserved rewards.</li>
              </ul>
            </PageSection>

            <PageSection id="what-is-karma-market" title="2. What is a Karma Market?">
              <p>
                A Karma Market is a speculative attention market around a Reddit
                post’s public momentum. It is represented by a BEP-20 token on the
                BNB Chain.
              </p>
              <CalloutCard
                title={
                  <>
                    <AlertTriangle className="h-5 w-5" /> Important
                  </>
                }
                type="warning"
              >
                <p>
                  It does <strong>not</strong> represent ownership, copyright,
                  endorsement, or affiliation with Reddit or the original poster.
                  It is purely an index of social momentum.
                </p>
              </CalloutCard>
            </PageSection>

            <PageSection id="launching" title="3. Launching a Market">
              <ol>
                <li><strong>Paste Reddit post URL:</strong> Enter the link into the KarmaFi launch interface.</li>
                <li><strong>Preview metadata:</strong> KarmaFi automatically fetches the post title, subreddit, upvotes, and comments.</li>
                <li><strong>Review market details:</strong> Confirm the ticker and market structure.</li>
                <li><strong>Confirm launch:</strong> Approve the transaction in your wallet.</li>
                <li><strong>Market goes live:</strong> The market is now deployed on BNB Chain and open for trading.</li>
              </ol>
            </PageSection>

            <PageSection id="trading" title="4. Trading a Market">
              <p>
                Users can buy and sell exposure to attention momentum using BNB.
                Pricing uses <strong>bonding curve mechanics</strong>, ensuring
                instant liquidity and continuous price discovery.
              </p>
              <ul>
                <li>Markets are highly volatile.</li>
                <li>Prices can increase rapidly during viral momentum, but can also collapse.</li>
                <li>Trade only what you can afford to lose.</li>
              </ul>
            </PageSection>

            <PageSection id="curator-rewards" title="5. Curator Rewards">
              <p>
                Curators are the trend-spotters who discover posts early and
                launch the markets. As an incentive for finding high-quality
                momentum:
              </p>
              <ul>
                <li>Curators launch markets before the crowd.</li>
                <li>They may earn a share of trading fees generated by the market.</li>
                <li>Curators build on-chain reputation based on their success rate.</li>
              </ul>
            </PageSection>

            <PageSection id="creator-vault" title="6. Creator Claim Vault">
              <p>
                KarmaFi aligns with internet creators instead of extracting from
                them. A portion of protocol fees is reserved for the original
                Reddit poster in the Creator Claim Vault.
              </p>
              <ul>
                <li>Original Reddit posters can verify ownership of their account.</li>
                <li>Connect a BNB Chain wallet.</li>
                <li>Claim reserved creator rewards securely.</li>
                <li>Claims require verification to prevent fraud.</li>
              </ul>
            </PageSection>

            <PageSection id="bnb-setup" title="7. BNB Chain Setup">
              <p>
                KarmaFi operates natively on the BNB Chain ecosystem for speed and
                low fees.
              </p>
              <ul>
                <li><strong>Supported network:</strong> BNB Smart Chain (or Testnet depending on environment).</li>
                <li><strong>Wallets:</strong> MetaMask, Trust Wallet, Binance Web3 Wallet, WalletConnect.</li>
              </ul>
              <p>
                If your wallet is not configured for BNB Chain, it will typically
                prompt you to add the network automatically upon connection.
              </p>
            </PageSection>

            <PageSection id="faq" title="8. FAQ">
              <div className="space-y-6">
                <div>
                  <h4 className="text-[18px] font-bold text-[var(--text-primary)] mb-2">Do I need a wallet?</h4>
                  <p className="text-[15px] text-[var(--text-secondary)]">Yes, you need a Web3 wallet (like MetaMask) connected to BNB Chain.</p>
                </div>
                <div>
                  <h4 className="text-[18px] font-bold text-[var(--text-primary)] mb-2">Do I need BNB for gas?</h4>
                  <p className="text-[15px] text-[var(--text-secondary)]">Yes, all transactions on the BNB Chain require a small amount of BNB to cover network fees (gas).</p>
                </div>
                <div>
                  <h4 className="text-[18px] font-bold text-[var(--text-primary)] mb-2">Can any Reddit post be used?</h4>
                  <p className="text-[15px] text-[var(--text-secondary)]">Most public Reddit posts can be used, though KarmaFi moderation policies prohibit certain content (e.g., illegal activity, hate speech, doxxing).</p>
                </div>
                <div>
                  <h4 className="text-[18px] font-bold text-[var(--text-primary)] mb-2">What happens if a post is deleted?</h4>
                  <p className="text-[15px] text-[var(--text-secondary)]">The Karma Market continues to exist on-chain, but the underlying momentum signals (upvotes/comments) will cease updating.</p>
                </div>
                <div>
                  <h4 className="text-[18px] font-bold text-[var(--text-primary)] mb-2">Can creators opt out?</h4>
                  <p className="text-[15px] text-[var(--text-secondary)]">Original creators can verify their identity and request their market be hidden from the KarmaFi frontend.</p>
                </div>
                <div>
                  <h4 className="text-[18px] font-bold text-[var(--text-primary)] mb-2">Are markets risky?</h4>
                  <p className="text-[15px] text-[var(--text-secondary)]">Yes. Attention markets are highly speculative and volatile. You may lose your entire investment.</p>
                </div>
              </div>
            </PageSection>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
}
