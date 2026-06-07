import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Download, Compass, AlertTriangle, Layers, BookOpen, Flame, CheckCircle2, FileText, Zap, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "KarmaFi Whitepaper | BNB Chain Attention Markets",
  description: "Read the KarmaFi whitepaper: Reddit attention markets, curator rewards, creator claim vaults, bonding curves, and BNB Chain infrastructure.",
  openGraph: {
    title: "KarmaFi Whitepaper | BNB Chain Attention Markets",
    description: "KarmaFi is a BNB Chain attention market protocol for Reddit momentum, curator rewards, creator claim vaults, and speculative social trading.",
    url: "/whitepaper",
  },
};

export default function WhitepaperPage() {
  const tocItems = [
    { id: "abstract", label: "1. Abstract" },
    { id: "problem", label: "2. Problem" },
    { id: "solution", label: "3. Solution" },
    { id: "how-it-works", label: "4. How KarmaFi Works" },
    { id: "market-architecture", label: "5. Market Architecture" },
    { id: "curator-economy", label: "6. Curator Economy" },
    { id: "creator-vault", label: "7. Creator Claim Vault" },
    { id: "bnb-chain", label: "8. BNB Chain Infrastructure" },
    { id: "fee-model", label: "9. Fee Model" },
    { id: "virality-score", label: "10. Virality Score" },
    { id: "risk-compliance", label: "11. Risk & Compliance" },
    { id: "roadmap", label: "12. Roadmap" },
    { id: "disclaimer", label: "13. Disclaimer" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFDFC]">
      <Navbar />

      {/* Whitepaper Hero */}
      <section className="w-full bg-[#FFFAF5] pt-16 pb-20 border-b border-[#F2D8C8]">
        <div className="mx-auto max-w-[1180px] px-6">
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto">
            <span className="mb-4 rounded-full bg-[#FFF1ED] border border-[#F1DDD0] px-4 py-1.5 text-[13px] font-extrabold tracking-wide text-[#FF6B1A] uppercase">
              KarmaFi Protocol
            </span>
            <h1 className="text-[40px] md:text-[52px] font-black tracking-tight text-[#161616] mb-6 leading-tight">
              KarmaFi Whitepaper
            </h1>
            <p className="text-[18px] md:text-[20px] font-medium text-[#5F5B57] leading-relaxed mb-8">
              A BNB Chain attention market protocol for discovering, launching, and trading Reddit momentum before it reaches the crowd.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <span className="rounded-lg bg-white border border-[#E8D4C8] px-3.5 py-1.5 text-[13.5px] font-bold text-[#161616] shadow-sm">BNB Chain Native</span>
              <span className="rounded-lg bg-white border border-[#E8D4C8] px-3.5 py-1.5 text-[13.5px] font-bold text-[#161616] shadow-sm">Attention Markets</span>
              <span className="rounded-lg bg-white border border-[#E8D4C8] px-3.5 py-1.5 text-[13.5px] font-bold text-[#161616] shadow-sm">Creator Claim Vault</span>
              <span className="rounded-lg bg-white border border-[#E8D4C8] px-3.5 py-1.5 text-[13.5px] font-bold text-[#161616] shadow-sm">Curator Rewards</span>
              <span className="rounded-lg bg-[#FFF1ED] border border-[#FFAB66]/30 px-3.5 py-1.5 text-[13.5px] font-extrabold text-[#FF6B1A] shadow-sm">Alpha V1</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link
                href="/launch"
                className="w-full sm:w-auto flex h-[50px] items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] px-8 text-[15.5px] font-extrabold text-white shadow-[0_8px_20px_rgba(255,107,26,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                Launch KarmaFi
              </Link>
              <Link
                href="/feed"
                className="w-full sm:w-auto flex h-[50px] items-center justify-center rounded-full bg-white border border-[#E8D4C8] px-8 text-[15.5px] font-bold text-[#161616] shadow-sm hover:border-[#FF6B1A] hover:text-[#FF6B1A] transition-colors"
              >
                Explore Markets
                <Compass className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#download"
                className="w-full sm:w-auto flex h-[50px] items-center justify-center rounded-full bg-white border border-[#E8D4C8] px-8 text-[15.5px] font-bold text-[#8A817A] shadow-sm hover:bg-[#F9F7F5] transition-colors"
              >
                Download PDF
                <Download className="ml-2 h-4 w-4" />
              </a>
              {/* TODO: connect to hosted whitepaper PDF when available. */}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="w-full py-16">
        <div className="mx-auto max-w-[1180px] px-6">
          <div className="flex flex-col lg:flex-row gap-12 relative items-start">
            
            {/* Sticky Sidebar (TOC) */}
            <aside className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-[100px]">
              <div className="rounded-[24px] bg-[#FFFAF5] border border-[#F2D8C8] p-6 shadow-sm">
                <h3 className="text-[14px] font-black uppercase tracking-widest text-[#161616] mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#FF6B1A]" /> Contents
                </h3>
                <nav className="flex flex-col gap-2">
                  {tocItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="text-[14.5px] font-medium text-[#5F5B57] hover:text-[#FF6B1A] transition-colors py-1"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Whitepaper Content */}
            <div className="flex-1 max-w-[800px] prose prose-lg prose-headings:text-[#161616] prose-headings:font-black prose-p:text-[#5F5B57] prose-p:font-medium prose-p:leading-relaxed prose-a:text-[#FF6B1A] prose-a:no-underline hover:prose-a:underline">
              
              <div id="abstract" className="scroll-mt-[100px] mb-16">
                <h2 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#161616] mb-6 pb-4 border-b border-[#F2D8C8]">
                  1. Abstract
                </h2>
                <p className="text-[17px] leading-relaxed text-[#5F5B57] mb-6">
                  KarmaFi introduces BNB Chain attention markets around Reddit post momentum. The protocol allows curators to identify fast-growing Reddit posts, launch a Karma Market, and allow traders to price social attention through market participation. Original Reddit posters can verify ownership and claim reserved creator rewards through the Creator Claim Vault.
                </p>
                <div className="rounded-2xl bg-[#FFFDFB] border border-[#E8D4C8] p-6 shadow-sm">
                  <p className="text-[15px] font-semibold text-[#161616] m-0">
                    <span className="text-[#FF6B1A] font-black mr-2">Clarification:</span>
                    KarmaFi does not tokenize ownership of Reddit content. It creates speculative attention markets based on public momentum signals.
                  </p>
                </div>
              </div>

              <div id="problem" className="scroll-mt-[100px] mb-16">
                <h2 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#161616] mb-6 pb-4 border-b border-[#F2D8C8]">
                  2. Problem
                </h2>
                <ul className="space-y-3 text-[17px] text-[#5F5B57] font-medium mb-8 list-disc pl-6">
                  <li>Viral internet attention is discovered late.</li>
                  <li>Early curators rarely capture value.</li>
                  <li>Original posters often do not benefit from secondary attention.</li>
                  <li>Existing meme markets lack source attribution and creator alignment.</li>
                  <li>Social momentum is fragmented across platforms.</li>
                  <li>BNB Chain lacks a dedicated Reddit-native attention market layer.</li>
                </ul>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#FFFDFB] border border-[#E8D4C8] p-5 shadow-sm">
                    <h4 className="text-[16px] font-bold text-[#161616] mb-2">Late Discovery</h4>
                    <p className="text-[14px] text-[#8A817A] m-0">By the time a trend reaches mainstream crypto, the early momentum phase is already over.</p>
                  </div>
                  <div className="rounded-xl bg-[#FFFDFB] border border-[#E8D4C8] p-5 shadow-sm">
                    <h4 className="text-[16px] font-bold text-[#161616] mb-2">No Curator Incentives</h4>
                    <p className="text-[14px] text-[#8A817A] m-0">Trend spotters have no direct way to monetize their ability to predict virality.</p>
                  </div>
                  <div className="rounded-xl bg-[#FFFDFB] border border-[#E8D4C8] p-5 shadow-sm">
                    <h4 className="text-[16px] font-bold text-[#161616] mb-2">Creator Value Leakage</h4>
                    <p className="text-[14px] text-[#8A817A] m-0">Original creators generate the attention but are excluded from the financial upside.</p>
                  </div>
                  <div className="rounded-xl bg-[#FFFDFB] border border-[#E8D4C8] p-5 shadow-sm">
                    <h4 className="text-[16px] font-bold text-[#161616] mb-2">Weak Source Attribution</h4>
                    <p className="text-[14px] text-[#8A817A] m-0">Most speculative assets detach completely from their source material and origin.</p>
                  </div>
                </div>
              </div>

              <div id="solution" className="scroll-mt-[100px] mb-16">
                <h2 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#161616] mb-6 pb-4 border-b border-[#F2D8C8]">
                  3. Solution
                </h2>
                <p className="text-[17px] leading-relaxed text-[#5F5B57] mb-6">
                  KarmaFi creates a structured attention market layer. Users can:
                </p>
                <ul className="space-y-2 text-[17px] text-[#5F5B57] font-medium mb-8 list-disc pl-6">
                  <li>Paste a Reddit post URL.</li>
                  <li>Launch a Karma Market.</li>
                  <li>Trade momentum.</li>
                  <li>Earn as a curator.</li>
                  <li>Claim rewards as original creator.</li>
                </ul>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-[#FFFAF5] rounded-2xl border border-[#F2D8C8]">
                  <div className="text-center"><span className="font-bold text-[#161616]">Reddit Post</span></div>
                  <ArrowRight className="hidden sm:block text-[#FF6B1A]" />
                  <div className="text-center"><span className="font-bold text-[#161616]">Karma Market</span></div>
                  <ArrowRight className="hidden sm:block text-[#FF6B1A]" />
                  <div className="text-center"><span className="font-bold text-[#161616]">BNB Chain Trading</span></div>
                  <ArrowRight className="hidden sm:block text-[#FF6B1A]" />
                  <div className="text-center"><span className="font-bold text-[#19C37D]">Creator/Curator Rewards</span></div>
                </div>
              </div>

              <div id="how-it-works" className="scroll-mt-[100px] mb-16">
                <h2 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#161616] mb-6 pb-4 border-b border-[#F2D8C8]">
                  4. How KarmaFi Works
                </h2>
                <div className="space-y-4">
                  {[
                    { step: 1, title: "Discover Reddit Momentum", desc: "Find a post that is starting to gain traction." },
                    { step: 2, title: "Paste Reddit URL", desc: "Input the URL into the KarmaFi launch interface." },
                    { step: 3, title: "Fetch and verify post metadata", desc: "The protocol automatically indexes the post." },
                    { step: 4, title: "Launch Karma Market on BNB Chain", desc: "Deploy the market via smart contract." },
                    { step: 5, title: "Trade attention through bonding curve", desc: "Buy and sell using BNB for instant liquidity." },
                    { step: 6, title: "Creator can claim reserved rewards", desc: "Original author verifies ownership and claims." }
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[#E8D4C8] shadow-sm">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF1ED] text-[#FF6B1A] font-black text-sm">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="text-[16px] font-bold text-[#161616] mb-1 m-0">{item.title}</h4>
                        <p className="text-[14.5px] text-[#8A817A] m-0">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div id="market-architecture" className="scroll-mt-[100px] mb-16">
                <h2 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#161616] mb-6 pb-4 border-b border-[#F2D8C8]">
                  5. Market Architecture
                </h2>
                <p className="text-[17px] leading-relaxed text-[#5F5B57] mb-6">
                  The protocol is composed of the following core components:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {["Karma Market", "Attention Token", "Source Metadata", "Bonding Curve", "Fee Distributor", "Creator Claim Vault", "Curator Module", "Market Registry"].map(comp => (
                    <div key={comp} className="bg-white border border-[#E8D4C8] rounded-lg p-3 text-center shadow-sm">
                      <span className="text-[13px] font-bold text-[#161616]">{comp}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-[#FFF1ED] border border-[#FFAB66]/30 p-6 shadow-sm">
                  <h4 className="flex items-center gap-2 text-[16px] font-bold text-[#E9500E] mb-2 m-0">
                    <AlertTriangle className="h-5 w-5" /> Important Clarification
                  </h4>
                  <p className="text-[15px] font-medium text-[#D9450A] m-0">
                    A Karma Market represents speculative exposure to attention around a source post. It does not represent ownership of the post, its copyright, or endorsement from the original poster.
                  </p>
                </div>
              </div>

              <div id="curator-economy" className="scroll-mt-[100px] mb-16">
                <h2 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#161616] mb-6 pb-4 border-b border-[#F2D8C8]">
                  6. Curator Economy
                </h2>
                <p className="text-[17px] leading-relaxed text-[#5F5B57] mb-6">
                  Curators are users who discover Reddit posts early and launch markets.
                </p>
                <ul className="space-y-2 text-[17px] text-[#5F5B57] font-medium mb-8 list-disc pl-6">
                  <li>Launch market early.</li>
                  <li>Earn a share of trading fees.</li>
                  <li>Build reputation.</li>
                  <li>Appear on leaderboard.</li>
                  <li>Higher reputation can unlock more launches or lower friction.</li>
                </ul>
                <div className="bg-[#FFFDFB] border-l-4 border-[#FF6B1A] pl-4 py-2">
                  <p className="text-[15px] italic text-[#5F5B57] m-0">
                    <span className="font-bold not-italic text-[#161616]">Example:</span> A curator finds a fast-growing Reddit post, launches a Karma Market, and earns a percentage of trading fees as volume increases.
                  </p>
                </div>
              </div>

              <div id="creator-vault" className="scroll-mt-[100px] mb-16">
                <h2 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#161616] mb-6 pb-4 border-b border-[#F2D8C8]">
                  7. Creator Claim Vault
                </h2>
                <p className="text-[17px] leading-relaxed text-[#5F5B57] mb-6">
                  The Creator Claim Vault reserves a portion of protocol fees for the original Reddit poster.
                </p>
                <ol className="space-y-2 text-[17px] text-[#5F5B57] font-medium mb-6 list-decimal pl-6">
                  <li>Original poster visits Creator Claim page.</li>
                  <li>Authenticates Reddit account.</li>
                  <li>Connects BNB wallet.</li>
                  <li>Verifies ownership of the source post.</li>
                  <li>Claims reserved rewards.</li>
                </ol>
                <p className="text-[15px] font-bold text-[#161616] mb-6">
                  If creator does not claim immediately, creator rewards remain reserved according to protocol rules.
                </p>
                <div className="rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] p-6 shadow-sm">
                  <h4 className="flex items-center gap-2 text-[16px] font-bold text-[#16A34A] mb-2 m-0">
                    <CheckCircle2 className="h-5 w-5" /> Alignment Callout
                  </h4>
                  <p className="text-[15px] font-medium text-[#15803D] m-0">
                    The Creator Claim Vault is designed to align the protocol with original internet creators instead of extracting value from them.
                  </p>
                </div>
              </div>

              <div id="bnb-chain" className="scroll-mt-[100px] mb-16">
                <h2 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#161616] mb-6 pb-4 border-b border-[#F2D8C8]">
                  8. BNB Chain Infrastructure
                </h2>
                <div className="flex items-center gap-4 mb-6">
                  <img src="/brand/bnb-chain-logo.svg" alt="BNB Chain" className="h-10" />
                </div>
                <p className="text-[17px] leading-relaxed text-[#5F5B57] mb-6">
                  KarmaFi is powered by BNB Chain infrastructure for the following reasons:
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2 text-[15px] font-bold text-[#161616]"><Zap className="h-4 w-4 text-[#F3BA2F]" /> Low-cost transactions</div>
                  <div className="flex items-center gap-2 text-[15px] font-bold text-[#161616]"><Layers className="h-4 w-4 text-[#F3BA2F]" /> EVM-compatible infrastructure</div>
                  <div className="flex items-center gap-2 text-[15px] font-bold text-[#161616]"><FileText className="h-4 w-4 text-[#F3BA2F]" /> BEP-20 attention markets</div>
                  <div className="flex items-center gap-2 text-[15px] font-bold text-[#161616]"><Flame className="h-4 w-4 text-[#F3BA2F]" /> Fast market creation</div>
                </div>
                <p className="text-[15px] text-[#8A817A] italic">
                  * Built on BNB Chain. BNB Chain Native. Powered by BNB Chain infrastructure.
                </p>
              </div>

              <div id="fee-model" className="scroll-mt-[100px] mb-16">
                <h2 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#161616] mb-6 pb-4 border-b border-[#F2D8C8]">
                  9. Fee Model
                </h2>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b-2 border-[#161616]">
                        <th className="py-3 px-4 font-bold text-[#161616] bg-[#FFFFAF5]">Recipient</th>
                        <th className="py-3 px-4 font-bold text-[#161616] bg-[#FFFFAF5]">Share</th>
                        <th className="py-3 px-4 font-bold text-[#161616] bg-[#FFFFAF5]">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="text-[15px] text-[#5F5B57] font-medium">
                      <tr className="border-b border-[#F2D8C8] bg-white">
                        <td className="py-3 px-4 font-bold text-[#161616]">Creator Vault</td>
                        <td className="py-3 px-4 text-[#19C37D] font-bold">30%</td>
                        <td className="py-3 px-4">Rewards original posters.</td>
                      </tr>
                      <tr className="border-b border-[#F2D8C8] bg-[#FFFDFB]">
                        <td className="py-3 px-4 font-bold text-[#161616]">Curator Share</td>
                        <td className="py-3 px-4 text-[#FF6B1A] font-bold">25%</td>
                        <td className="py-3 px-4">Rewards early discovery.</td>
                      </tr>
                      <tr className="border-b border-[#F2D8C8] bg-white">
                        <td className="py-3 px-4 font-bold text-[#161616]">Protocol Treasury</td>
                        <td className="py-3 px-4">25%</td>
                        <td className="py-3 px-4">Funds development.</td>
                      </tr>
                      <tr className="border-b border-[#F2D8C8] bg-[#FFFDFB]">
                        <td className="py-3 px-4 font-bold text-[#161616]">Liquidity / Reserve</td>
                        <td className="py-3 px-4">15%</td>
                        <td className="py-3 px-4">Supports market health.</td>
                      </tr>
                      <tr className="border-b border-[#F2D8C8] bg-white">
                        <td className="py-3 px-4 font-bold text-[#161616]">Safety & Moderation</td>
                        <td className="py-3 px-4">5%</td>
                        <td className="py-3 px-4">Supports review and takedown processes.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[14px] text-[#8A817A] italic">
                  Note: Exact fee parameters may evolve during Alpha.
                </p>
              </div>

              <div id="virality-score" className="scroll-mt-[100px] mb-16">
                <h2 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#161616] mb-6 pb-4 border-b border-[#F2D8C8]">
                  10. Virality Score
                </h2>
                <p className="text-[17px] leading-relaxed text-[#5F5B57] mb-6">
                  The Virality Score is a dynamic metric used to measure social momentum. It incorporates multiple real-time inputs.
                </p>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-left border-collapse min-w-[300px]">
                    <tbody className="text-[15px] font-medium">
                      <tr className="border-b border-[#F2D8C8]"><td className="py-2 px-4 text-[#5F5B57]">Upvote Velocity</td><td className="py-2 px-4 font-bold text-[#161616]">25%</td></tr>
                      <tr className="border-b border-[#F2D8C8]"><td className="py-2 px-4 text-[#5F5B57]">Comment Velocity</td><td className="py-2 px-4 font-bold text-[#161616]">20%</td></tr>
                      <tr className="border-b border-[#F2D8C8]"><td className="py-2 px-4 text-[#5F5B57]">Market Volume</td><td className="py-2 px-4 font-bold text-[#161616]">20%</td></tr>
                      <tr className="border-b border-[#F2D8C8]"><td className="py-2 px-4 text-[#5F5B57]">Holder Growth</td><td className="py-2 px-4 font-bold text-[#161616]">15%</td></tr>
                      <tr className="border-b border-[#F2D8C8]"><td className="py-2 px-4 text-[#5F5B57]">Creator Verification</td><td className="py-2 px-4 font-bold text-[#19C37D]">10%</td></tr>
                      <tr className="border-b border-[#F2D8C8]"><td className="py-2 px-4 text-[#5F5B57]">Risk Penalty</td><td className="py-2 px-4 font-bold text-[#E9500E]">-10% to -40%</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[15px] font-bold text-[#161616]">
                  Virality Score is not financial advice. It is a discovery signal.
                </p>
              </div>

              <div id="risk-compliance" className="scroll-mt-[100px] mb-16">
                <h2 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#161616] mb-6 pb-4 border-b border-[#F2D8C8]">
                  11. Risk & Compliance
                </h2>
                <div className="rounded-2xl border-2 border-[#E9500E]/20 bg-gradient-to-br from-[#FFF1ED] to-[#FFFAF5] p-8 shadow-sm relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="mb-4 text-[20px] font-extrabold text-[#161616] flex items-center gap-2">
                      <AlertTriangle className="h-6 w-6 text-[#E9500E]" /> Risk Disclosure
                    </h3>
                    <ul className="space-y-2 text-[15px] font-medium leading-relaxed text-[#D9450A] list-disc pl-6 m-0">
                      <li>Markets are highly speculative.</li>
                      <li>Tokens may go to zero.</li>
                      <li>Karma Markets do not represent ownership of Reddit posts.</li>
                      <li>KarmaFi is unaffiliated with Reddit.</li>
                      <li>KarmaFi is not endorsed by BNB Chain.</li>
                      <li>Market creation may be subject to moderation.</li>
                      <li>Content may be hidden from the frontend if flagged.</li>
                      <li>Creator claims require verification.</li>
                      <li>Users are responsible for their own trading decisions.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div id="roadmap" className="scroll-mt-[100px] mb-16">
                <h2 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#161616] mb-6 pb-4 border-b border-[#F2D8C8]">
                  12. Roadmap
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="bg-white border border-[#E8D4C8] rounded-2xl p-6 shadow-sm">
                    <h4 className="text-[13px] font-black uppercase tracking-widest text-[#FF6B1A] mb-2 m-0">Phase 1</h4>
                    <h3 className="text-[20px] font-black text-[#161616] mb-4 m-0">Alpha</h3>
                    <ul className="text-[14.5px] text-[#5F5B57] font-medium space-y-1.5 list-disc pl-4 m-0">
                      <li>Landing page</li>
                      <li>Explore markets</li>
                      <li>Launch flow</li>
                      <li>BNB testnet deployment</li>
                      <li>Mock/sample markets</li>
                      <li>Creator Claim Vault prototype</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-[#E8D4C8] rounded-2xl p-6 shadow-sm">
                    <h4 className="text-[13px] font-black uppercase tracking-widest text-[#8A817A] mb-2 m-0">Phase 2</h4>
                    <h3 className="text-[20px] font-black text-[#161616] mb-4 m-0">Protocol Beta</h3>
                    <ul className="text-[14.5px] text-[#5F5B57] font-medium space-y-1.5 list-disc pl-4 m-0">
                      <li>Real Reddit metadata integration</li>
                      <li>Wallet-based market launches</li>
                      <li>Bonding curve trading</li>
                      <li>Curator rewards</li>
                      <li>Creator verification flow</li>
                      <li>Market detail pages</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-[#E8D4C8] rounded-2xl p-6 shadow-sm">
                    <h4 className="text-[13px] font-black uppercase tracking-widest text-[#8A817A] mb-2 m-0">Phase 3</h4>
                    <h3 className="text-[20px] font-black text-[#161616] mb-4 m-0">Mainnet Launch</h3>
                    <ul className="text-[14.5px] text-[#5F5B57] font-medium space-y-1.5 list-disc pl-4 m-0">
                      <li>BNB Chain mainnet</li>
                      <li>Smart contract audit</li>
                      <li>Improved moderation</li>
                      <li>Portfolio dashboard</li>
                      <li>Real creator claims</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-[#E8D4C8] rounded-2xl p-6 shadow-sm">
                    <h4 className="text-[13px] font-black uppercase tracking-widest text-[#8A817A] mb-2 m-0">Phase 4</h4>
                    <h3 className="text-[20px] font-black text-[#161616] mb-4 m-0">Ecosystem Expansion</h3>
                    <ul className="text-[14.5px] text-[#5F5B57] font-medium space-y-1.5 list-disc pl-4 m-0">
                      <li>PancakeSwap liquidity routing</li>
                      <li>Advanced virality oracle</li>
                      <li>Cross-platform attention sources</li>
                      <li>Curator reputation system</li>
                      <li>API and bots</li>
                    </ul>
                  </div>

                </div>
              </div>

              <div id="disclaimer" className="scroll-mt-[100px] mb-16">
                <h2 className="text-[28px] md:text-[32px] font-black tracking-tight text-[#161616] mb-6 pb-4 border-b border-[#F2D8C8]">
                  13. Disclaimer
                </h2>
                <p className="text-[15px] leading-relaxed text-[#5F5B57]">
                  KarmaFi is an experimental attention market protocol. Karma Markets are speculative and volatile. They do not represent ownership, copyright, licensing, endorsement, sponsorship, or affiliation with Reddit, the original poster, or any third party. Users should conduct their own research and only participate with funds they can afford to lose.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
