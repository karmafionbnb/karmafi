"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Link as LinkIcon, MessageCircle, Flame } from "lucide-react";

function XLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--surface-secondary)] py-12 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1080px] px-6">
        
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
          
          {/* Brand Column */}
          <div className="flex flex-col items-start md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5 group">
              <Logo className="h-9 w-9 shadow-md rounded-[10px] transition-transform duration-300 group-hover:scale-105" />
              <span className="text-[22px] font-black tracking-tight text-[var(--text-primary)]">
                Karma<span className="text-[#FF6B1A]">Fi</span>
              </span>
            </Link>
            <p className="text-[14.5px] font-medium text-[var(--text-secondary)] max-w-[260px] mb-8 leading-relaxed">
              The first attention market on BNB Chain. Trade Reddit momentum before it goes viral.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://x.com/KarmafiBNB" target="_blank" rel="noopener noreferrer" aria-label="KarmaFi on X (Twitter)" className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-primary)] text-[var(--text-muted)] shadow-sm transition-all hover:border-[#FF6B1A] hover:text-[#FF6B1A] hover:shadow-md hover:-translate-y-0.5">
                <XLogo className="h-4 w-4" />
              </a>
              <a href="https://github.com/karmafionbnb/karmafi" target="_blank" rel="noopener noreferrer" aria-label="KarmaFi on GitHub" className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-primary)] text-[var(--text-muted)] shadow-sm transition-all hover:border-[#FF6B1A] hover:text-[#FF6B1A] hover:shadow-md hover:-translate-y-0.5">
                <LinkIcon className="h-4 w-4" />
              </a>
              <a href="https://t.me/jessekarmafi" target="_blank" rel="noopener noreferrer" aria-label="KarmaFi on Telegram" className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-primary)] text-[var(--text-muted)] shadow-sm transition-all hover:border-[#FF6B1A] hover:text-[#FF6B1A] hover:shadow-md hover:-translate-y-0.5">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="flex flex-col gap-8">
            {/* Product Links */}
            <div>
              <h4 className="text-[14px] font-black tracking-wider text-[var(--text-primary)] uppercase mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/feed" className="text-[14.5px] font-medium text-[var(--text-secondary)] hover:text-[#FF6B1A] transition-colors">Explore Markets</Link></li>
                <li><Link href="/portfolio" className="text-[14.5px] font-medium text-[var(--text-secondary)] hover:text-[#FF6B1A] transition-colors">Portfolio</Link></li>
                <li><Link href="/launch" className="text-[14.5px] font-medium text-[var(--text-secondary)] hover:text-[#FF6B1A] transition-colors">Launch Market</Link></li>
                <li><Link href="/leaderboard" className="text-[14.5px] font-medium text-[var(--text-secondary)] hover:text-[#FF6B1A] transition-colors">Leaderboard</Link></li>
                <li><Link href="/creator-claim" className="text-[14.5px] font-medium text-[var(--text-secondary)] hover:text-[#FF6B1A] transition-colors">Creator Claim Vault</Link></li>
              </ul>
            </div>
          </div>

          {/* Protocol Column */}
          <div className="flex flex-col gap-8">
            {/* Protocol Links */}
            <div>
              <h4 className="text-[14px] font-black tracking-wider text-[var(--text-primary)] uppercase mb-4">Protocol</h4>
              <ul className="space-y-3">
                <li><Link href="/whitepaper" className="text-[14.5px] font-medium text-[var(--text-secondary)] hover:text-[#FF6B1A] transition-colors">Whitepaper</Link></li>
                <li><Link href="/docs" className="text-[14.5px] font-medium text-[var(--text-secondary)] hover:text-[#FF6B1A] transition-colors">Documentation</Link></li>
                <li><Link href="/bnb-chain" className="text-[14.5px] font-medium text-[var(--text-secondary)] hover:text-[#FF6B1A] transition-colors">BNB Chain</Link></li>
                <li><Link href="/smart-contracts" className="text-[14.5px] font-medium text-[var(--text-secondary)] hover:text-[#FF6B1A] transition-colors">Smart Contracts</Link></li>
                <li><Link href="/whitepaper#fee-model" className="text-[14.5px] font-medium text-[var(--text-secondary)] hover:text-[#FF6B1A] transition-colors">Tokenomics</Link></li>
              </ul>
            </div>
          </div>

          {/* Legal & Risk Column */}
          <div className="flex flex-col gap-8">
            {/* Legal & Risk */}
            <div>
              <h4 className="text-[14px] font-black tracking-wider text-[var(--text-primary)] uppercase mb-4">Legal & Risk</h4>
              <ul className="space-y-3">
                <li><Link href="/terms" className="text-[14.5px] font-medium text-[var(--text-secondary)] hover:text-[#FF6B1A] transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-[14.5px] font-medium text-[var(--text-secondary)] hover:text-[#FF6B1A] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/risk-disclaimer" className="text-[14.5px] font-medium text-[var(--text-secondary)] hover:text-[#FF6B1A] transition-colors">Risk Disclaimer</Link></li>
                <li><Link href="/disclaimer" className="text-[14.5px] font-medium text-[var(--text-secondary)] hover:text-[#FF6B1A] transition-colors">Disclaimer</Link></li>
                <li><button onClick={() => window.dispatchEvent(new Event('karmafi-open-risk-modal'))} className="text-[14.5px] font-medium text-[var(--text-secondary)] hover:text-[#FF6B1A] transition-colors cursor-pointer">Risk Notice</button></li>
              </ul>
              <span className="mt-6 block rounded-md bg-[var(--surface-peach)] border border-[#FFAB66]/30 px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-[#FF6B1A] w-fit shadow-sm">
                ALPHA V1
              </span>
            </div>
          </div>

        </div>

        {/* Small Risk Footnote */}
        <div className="mt-12 text-center border-t border-[var(--border-strong)] pt-8">
          <p className="text-[12px] font-medium text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
            KarmaFi is experimental. Markets are speculative and may lose value. Karma Markets do not represent ownership or affiliation with Reddit or the original poster.{' '}
            <Link href="/risk-disclaimer" className="font-bold hover:text-[#FF6B1A] transition-colors">Read Risk Disclaimer.</Link>
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t border-[var(--border-strong)] pt-8 md:flex-row gap-6">
          <p className="text-[14px] font-medium text-[var(--text-muted)]">
            © {new Date().getFullYear()} KarmaFi. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-[14px] font-bold text-[var(--text-secondary)] bg-[var(--surface-primary)] border border-[var(--border-strong)] rounded-full px-4 py-1.5 shadow-sm">
            <span>Built on</span>
            <img src="/brand/bnb-chain-logo.svg" alt="BNB Chain" className="h-5 drop-shadow-sm" />
          </div>
        </div>

      </div>
    </footer>
  );
}
