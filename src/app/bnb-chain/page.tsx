import React from "react";
import type { Metadata } from "next";
import {
  StaticPageLayout,
  PageHero,
  PageSection,
  InfoCard,
} from "@/components/shared/StaticPageLayout";

export const metadata: Metadata = {
  title: "KarmaFi on BNB Chain | BNB Attention Markets",
  description:
    "KarmaFi is built on BNB Chain for low-cost attention markets, BEP-20 market tokens, curator incentives, and creator rewards.",
};

export default function BNBChainPage() {
  return (
    <StaticPageLayout>
      <PageHero
        eyebrow="BNB Chain Native"
        heading="Built for BNB Chain attention markets"
        subheading="KarmaFi uses BNB Chain infrastructure for fast, low-cost market creation, BEP-20 attention tokens, curator rewards, and creator claim vaults."
      >
        <div className="flex items-center gap-4 mt-2">
          {/* TODO: Replace with official BNB Chain brand asset before production. */}
          <img
            src="/brand/bnb-chain-logo.svg"
            alt="BNB Chain"
            className="h-10 opacity-90"
          />
        </div>
      </PageHero>

      <div className="mx-auto max-w-[1120px] px-6 pt-16">
        <div className="max-w-[800px] mx-auto">
          <PageSection title="1. Why BNB Chain?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <InfoCard
                title="Low-cost transactions"
                description="Launch markets and trade attention with minimal gas fees."
              />
              <InfoCard
                title="EVM compatibility"
                description="Familiar wallet experiences and robust smart contract support."
              />
              <InfoCard
                title="BEP-20 attention markets"
                description="Standardized token contracts for seamless ecosystem integration."
              />
              <InfoCard
                title="Fast user onboarding"
                description="Quick block times enable instant market pricing."
              />
              <InfoCard
                title="Retail-friendly ecosystem"
                description="A highly active user base accustomed to exploring new protocols."
              />
              <InfoCard
                title="Future liquidity routing"
                description="Pathways to connect with massive DEX liquidity."
              />
            </div>
          </PageSection>

          <PageSection title="2. How KarmaFi Uses BNB Chain">
            <ul>
              <li><strong>Market creation:</strong> Curators deploy new BEP-20 contracts on-chain for every Reddit post.</li>
              <li><strong>Attention token contracts:</strong> Standardized tokens that interact with the bonding curve.</li>
              <li><strong>Fee distribution:</strong> Smart contracts seamlessly route fees to curators, treasury, and liquidity reserves.</li>
              <li><strong>Creator reward vaults:</strong> Escrow contracts that hold funds securely until verified by the original creator.</li>
              <li><strong>Curator rewards:</strong> Automated fee sharing for users who spot trends early.</li>
              <li><strong>On-chain transparency:</strong> Every trade, launch, and claim is verifiable on the BNB Chain explorer.</li>
            </ul>
          </PageSection>

          <PageSection title="3. Network Status">
            <div className="rounded-xl border border-[#E8D4C8] bg-white p-6 shadow-sm mt-6">
              <ul className="space-y-4 m-0 p-0 list-none text-[15px] font-medium text-[#5F5B57]">
                <li className="flex justify-between border-b border-[#F2D8C8] pb-4">
                  <span className="text-[#8A817A]">Network</span>
                  <span className="text-[#161616] font-bold">BNB Smart Chain / Testnet</span>
                </li>
                <li className="flex justify-between border-b border-[#F2D8C8] pb-4">
                  <span className="text-[#8A817A]">Chain ID</span>
                  <span className="text-[#161616] font-bold">Based on Environment</span>
                </li>
                <li className="flex justify-between border-b border-[#F2D8C8] pb-4">
                  <span className="text-[#8A817A]">RPC Status</span>
                  <span className="text-[#19C37D] font-bold flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#19C37D]"></span> Connected
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#8A817A]">Wallet Support</span>
                  <span className="text-[#161616] font-bold text-right">MetaMask, Trust Wallet,<br/>WalletConnect</span>
                </li>
              </ul>
            </div>
          </PageSection>

          <PageSection title="4. Future BNB Ecosystem Integrations">
            <p>
              As KarmaFi matures, the protocol aims to integrate deeper into the BNB ecosystem:
            </p>
            <ul>
              <li><strong>PancakeSwap liquidity routing:</strong> Seamlessly migrating mature markets to PancakeSwap AMM pools.</li>
              <li><strong>opBNB support:</strong> Exploring Layer 2 solutions for even lower costs and higher throughput.</li>
              <li><strong>BNB Greenfield metadata snapshots:</strong> Decentralized storage for virality metrics and market history.</li>
              <li><strong>Advanced analytics:</strong> Tooling for deep insights into attention flows.</li>
              <li><strong>Creator vault expansion:</strong> Enhanced claim mechanisms for cross-platform creators.</li>
            </ul>
          </PageSection>

          <div className="mt-12 text-center text-[13px] text-[#8A817A] italic border-t border-[#F2D8C8] pt-8">
            KarmaFi is independently built and is not endorsed by or officially affiliated with BNB Chain.
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
}
