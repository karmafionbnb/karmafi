"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/context/wallet";
import Logo from "@/components/Logo";
import { 
  LogOut, Menu, X as CloseIcon, ArrowRight, ChevronDown, 
  MessageSquare, Send, Code, FileText, Code2, Coins, Share2, 
  ShieldCheck, ShieldAlert, FileQuestion, BookOpen, Scale, HelpCircle, Mail, Globe,
  ExternalLink
} from "lucide-react";

// --- Configuration ---
const NEXT_PUBLIC_X_URL = "#"; // TODO: Replace with official KarmaFi X link.
const NEXT_PUBLIC_TELEGRAM_URL = "#"; // TODO: Replace with official KarmaFi Telegram link.
const NEXT_PUBLIC_GITHUB_URL = "#"; // TODO: Replace with official KarmaFi GitHub link.

const mainLinks = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/feed" },
  { name: "Launch", href: "/launch" },
  { name: "Portfolio", href: "/portfolio" },
];

const protocolLinks = {
  column1: [
    { name: "Whitepaper", href: "/whitepaper", icon: FileText, desc: "Read the KarmaFi protocol overview and attention market model." },
    { name: "Smart Contracts", href: "/smart-contracts", icon: Code2, desc: "View contract architecture, fee distribution, and deployment status." },
    { name: "Tokenomics", href: "/whitepaper#fee-model", icon: Coins, desc: "Understand fee splits, curator rewards, and creator vault mechanics." },
  ],
  column2: [
    { name: "BNB Chain", href: "/bnb-chain", icon: Globe, desc: "Learn how KarmaFi is built on BNB Chain infrastructure." },
    { name: "Creator Claim Vault", href: "/creator-claim", icon: ShieldCheck, desc: "Verify creator ownership and claim reserved rewards." },
  ]
};

const resourcesLinks = {
  column1: [
    { name: "Documentation", href: "/docs", icon: BookOpen, desc: "Practical guide to using KarmaFi." },
    { name: "FAQ", href: "/#faq", icon: HelpCircle, desc: "Answers to common product questions." },
    { name: "Launch Guide", href: "/docs#launching-a-market", icon: ArrowRight, desc: "Learn how to launch your first Karma Market." },
  ],
  column2: [
    { name: "Terms of Service", href: "/terms", icon: FileText, desc: "Terms for using KarmaFi." },
    { name: "Privacy Policy", href: "/privacy", icon: ShieldCheck, desc: "How KarmaFi handles wallet, verification, and usage data." },
    { name: "Disclaimer", href: "/disclaimer", icon: Scale, desc: "General product and affiliation disclaimer." },
    { name: "Risk Disclaimer", href: "/risk-disclaimer", icon: ShieldAlert, desc: "Full risk disclosure for Karma Markets." },
  ]
};

const communityLinks = [
  { name: "Follow on X", href: NEXT_PUBLIC_X_URL, icon: MessageSquare, desc: "Follow KarmaFi updates.", external: true },
  { name: "Join Telegram", href: NEXT_PUBLIC_TELEGRAM_URL, icon: Send, desc: "Join the curator community.", external: true },
  { name: "GitHub", href: NEXT_PUBLIC_GITHUB_URL, icon: Code, desc: "View open-source resources when available.", external: true },
  { name: "Docs", href: "/docs", icon: BookOpen, desc: "Read protocol and product documentation." },
  { name: "Contact", href: "mailto:support@karmafi.xyz", icon: Mail, desc: "Reach the KarmaFi team.", external: true },
];

// --- Components ---

type MenuItem = { name: string; href: string; icon?: React.ElementType; desc?: string; external?: boolean };

function MegaMenuCard({ columns }: { columns: { col1Title: string; col1: MenuItem[]; col2Title: string; col2: MenuItem[] } }) {
  return (
    <div className="absolute top-[100%] left-1/2 -translate-x-1/2 pt-4 w-[680px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      <div className="bg-white rounded-[24px] border border-[#F2D8C8] shadow-premium p-6 grid grid-cols-2 gap-8 relative overflow-hidden">
        {/* Subtle decorative background blur */}
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#FF6B1A]/5 blur-[60px] rounded-full pointer-events-none" />
        
        <div className="relative">
          <h4 className="text-[12px] font-black tracking-wider text-[#8A817A] uppercase mb-4 px-2">{columns.col1Title}</h4>
          <div className="space-y-1">
            {columns.col1.map((link) => (
              <Link key={link.name} href={link.href} className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#FFFFAF5] transition-colors group/item">
                <div className="mt-0.5 shrink-0 h-9 w-9 flex items-center justify-center bg-[#FFF1ED] text-[#FF6B1A] rounded-[10px] group-hover/item:bg-[#FF6B1A] group-hover/item:text-white transition-colors">
                  <link.icon className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-[14px] font-bold text-[#161616] mb-0.5 group-hover/item:text-[#FF6B1A] transition-colors">{link.name}</h5>
                  <p className="text-[12px] font-medium text-[#8A817A] leading-relaxed">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="relative">
          <h4 className="text-[12px] font-black tracking-wider text-[#8A817A] uppercase mb-4 px-2">{columns.col2Title}</h4>
          <div className="space-y-1">
            {columns.col2.map((link) => (
              <Link key={link.name} href={link.href} className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#FFFFAF5] transition-colors group/item">
                <div className="mt-0.5 shrink-0 h-9 w-9 flex items-center justify-center bg-[#FFF1ED] text-[#FF6B1A] rounded-[10px] group-hover/item:bg-[#FF6B1A] group-hover/item:text-white transition-colors">
                  <link.icon className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-[14px] font-bold text-[#161616] mb-0.5 group-hover/item:text-[#FF6B1A] transition-colors">{link.name}</h5>
                  <p className="text-[12px] font-medium text-[#8A817A] leading-relaxed">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CommunityDropdown() {
  return (
    <div className="absolute top-[100%] right-0 pt-4 w-[320px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      <div className="bg-white rounded-[24px] border border-[#F2D8C8] shadow-premium p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-[#FF6B1A]/5 blur-[40px] rounded-full pointer-events-none" />
        <div className="space-y-1 relative">
          {communityLinks.map((link) => {
            const Comp = link.external ? "a" : Link;
            const props = link.external ? { href: link.href, target: "_blank", rel: "noopener noreferrer" } : { href: link.href };
            return (
              <Comp key={link.name} {...props} className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#FFFFAF5] transition-colors group/item">
                <div className="mt-0.5 shrink-0 h-9 w-9 flex items-center justify-center bg-[#FFF1ED] text-[#FF6B1A] rounded-[10px] group-hover/item:bg-[#FF6B1A] group-hover/item:text-white transition-colors">
                  <link.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h5 className="text-[14px] font-bold text-[#161616] mb-0.5 group-hover/item:text-[#FF6B1A] transition-colors flex items-center gap-1.5">
                    {link.name}
                    {link.external && <ExternalLink className="h-3 w-3 opacity-50" />}
                  </h5>
                  <p className="text-[12px] font-medium text-[#8A817A] leading-relaxed">{link.desc}</p>
                </div>
              </Comp>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { walletAddress, isConnected, bnbBalance, connect, disconnect } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>(null);

  const handleConnect = async () => {
    await connect();
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isProtocolActive = ["/whitepaper", "/smart-contracts", "/tokenomics", "/bnb-chain", "/creator-claim"].some(r => pathname?.startsWith(r));
  const isResourcesActive = ["/docs", "/terms", "/privacy", "/risk-disclaimer", "/disclaimer", "/faq"].some(r => pathname?.startsWith(r));

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled || pathname !== '/' 
        ? "bg-[#FFFDFC]/90 backdrop-blur-md border-b border-[#F2D8C8]/60 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.02)]" 
        : "bg-transparent border-transparent"
    }`}>
      <div className="mx-auto w-full px-4 md:px-8 xl:px-14">
        <div className="flex h-[72px] items-center justify-between">
          
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 mr-8">
            <Logo className="h-9 w-9 shadow-md shadow-brand-orange/20 rounded-[10px] transition-transform duration-300 group-hover:scale-105" />
            <span className="text-[22px] font-extrabold tracking-tight text-[#161616] hidden sm:block">
              Karma<span className="text-[#FF6B1A]">Fi</span>
            </span>
          </Link>

          {/* Center: Main Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 lg:gap-2 xl:gap-6 h-full flex-1">
            {/* Flat Links */}
            {mainLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-full text-[14.5px] font-bold transition-all duration-200 ${
                    isActive
                      ? "text-[#FF6B1A] bg-[#FFF1ED]"
                      : "text-[#161616] hover:text-[#FF6B1A] hover:bg-[#FFFAF5]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Protocol Dropdown */}
            <div className="relative group h-full flex items-center">
              <button className={`px-3 py-2 rounded-full flex items-center gap-1.5 text-[14.5px] font-bold transition-all duration-200 ${
                isProtocolActive ? "text-[#FF6B1A] bg-[#FFF1ED]" : "text-[#161616] group-hover:text-[#FF6B1A] group-hover:bg-[#FFFAF5]"
              }`}>
                Protocol <ChevronDown className="h-4 w-4 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <MegaMenuCard columns={{ col1Title: "Protocol", col1: protocolLinks.column1, col2Title: "Infrastructure", col2: protocolLinks.column2 }} />
            </div>

            {/* Resources Dropdown */}
            <div className="relative group h-full flex items-center">
              <button className={`px-3 py-2 rounded-full flex items-center gap-1.5 text-[14.5px] font-bold transition-all duration-200 ${
                isResourcesActive ? "text-[#FF6B1A] bg-[#FFF1ED]" : "text-[#161616] group-hover:text-[#FF6B1A] group-hover:bg-[#FFFAF5]"
              }`}>
                Resources <ChevronDown className="h-4 w-4 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <MegaMenuCard columns={{ col1Title: "Learn", col1: resourcesLinks.column1, col2Title: "Legal & Safety", col2: resourcesLinks.column2 }} />
            </div>
            
            {/* Community Dropdown (Visible mainly on smaller desktop where icons hide) */}
            <div className="relative group h-full flex items-center xl:hidden">
              <button className={`px-3 py-2 rounded-full flex items-center gap-1.5 text-[14.5px] font-bold transition-all duration-200 text-[#161616] group-hover:text-[#FF6B1A] group-hover:bg-[#FFFAF5]`}>
                Community <ChevronDown className="h-4 w-4 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <CommunityDropdown />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            
            {/* Social Icons (Visible only on very wide screens to save space) */}
            <div className="hidden xl:flex items-center gap-1.5 mr-2">
              <a href={NEXT_PUBLIC_X_URL} target="_blank" rel="noopener noreferrer" aria-label="Follow KarmaFi on X" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFAF5] border border-[#F2D8C8] text-[#8A817A] hover:border-[#FF6B1A] hover:text-[#FF6B1A] transition-colors">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            {/* Wallet Button */}
            {isConnected ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white border border-[#F2D8C8] rounded-full h-[40px] pl-4 pr-1 shadow-sm">
                  <span className="text-[13.5px] font-extrabold text-[#161616] mr-3">{bnbBalance.toFixed(2)} BNB</span>
                  <div className="h-4 w-px bg-[#F2D8C8] mr-3" />
                  <span className="text-[13.5px] font-bold text-[#5F5B57] mr-2">{walletAddress?.substring(0, 6)}...</span>
                  <button
                    onClick={disconnect}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#FFF1ED] text-[#8A817A] hover:text-[#FF6B1A] transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="h-[40px] rounded-full bg-white border border-[#F2D8C8] px-5 text-[14.5px] font-bold text-[#161616] hover:border-[#FF6B1A] hover:text-[#FF6B1A] shadow-sm transition-all"
              >
                Connect Wallet
              </button>
            )}
            
            <Link
              href="/launch"
              className="flex items-center gap-2 h-[40px] rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] px-6 text-[14.5px] font-extrabold text-white shadow-[0_8px_20px_rgba(255,107,26,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Launch Market
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            {isConnected ? (
              <div className="flex items-center bg-white border border-[#F2D8C8] rounded-full h-[36px] px-3 shadow-sm">
                <span className="text-[13px] font-bold text-[#5F5B57]">{walletAddress?.substring(0, 6)}...</span>
              </div>
            ) : (
              <button onClick={handleConnect} className="h-[36px] rounded-full bg-white border border-[#F2D8C8] px-4 text-[13px] font-bold text-[#161616] shadow-sm">
                Connect
              </button>
            )}
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[#F2D8C8] bg-white text-[#161616] shadow-sm"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Slide in from right) */}
      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-[#161616]/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        
        {/* Drawer */}
        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-[360px] bg-[#FFFFAF5] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          <div className="flex items-center justify-between p-5 border-b border-[#F2D8C8]">
            <span className="text-[18px] font-extrabold tracking-tight text-[#161616]">
              Karma<span className="text-[#FF6B1A]">Fi</span>
            </span>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFFAF5] text-[#8A817A] hover:text-[#161616] transition-colors"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 pb-24">
            
            {/* Main Links */}
            <div className="flex flex-col gap-1 mb-6">
              {mainLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 text-[16px] font-bold transition-colors ${
                      isActive ? "bg-[#FFF1ED] text-[#FF6B1A]" : "text-[#161616] hover:bg-[#FFFAF5]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="h-px w-full bg-[#F2D8C8] mb-6" />

            {/* Protocol Accordion */}
            <div className="mb-4">
              <button 
                onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'protocol' ? null : 'protocol')}
                className="w-full flex items-center justify-between px-4 py-3 text-[16px] font-bold text-[#161616] hover:bg-[#FFFAF5] rounded-xl transition-colors"
              >
                Protocol
                <ChevronDown className={`h-5 w-5 text-[#8A817A] transition-transform ${mobileExpandedGroup === 'protocol' ? 'rotate-180' : ''}`} />
              </button>
              {mobileExpandedGroup === 'protocol' && (
                <div className="pl-4 pr-2 py-2 flex flex-col gap-1">
                  {[...protocolLinks.column1, ...protocolLinks.column2].map(link => (
                    <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFFFAF5]">
                      <link.icon className="h-5 w-5 text-[#FF6B1A]" />
                      <span className="text-[15px] font-bold text-[#5F5B57]">{link.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Resources Accordion */}
            <div className="mb-4">
              <button 
                onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'resources' ? null : 'resources')}
                className="w-full flex items-center justify-between px-4 py-3 text-[16px] font-bold text-[#161616] hover:bg-[#FFFAF5] rounded-xl transition-colors"
              >
                Resources
                <ChevronDown className={`h-5 w-5 text-[#8A817A] transition-transform ${mobileExpandedGroup === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              {mobileExpandedGroup === 'resources' && (
                <div className="pl-4 pr-2 py-2 flex flex-col gap-1">
                  {[...resourcesLinks.column1, ...resourcesLinks.column2].map(link => (
                    <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFFFAF5]">
                      <link.icon className="h-5 w-5 text-[#FF6B1A]" />
                      <span className="text-[15px] font-bold text-[#5F5B57]">{link.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Community Accordion */}
            <div className="mb-6">
              <button 
                onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'community' ? null : 'community')}
                className="w-full flex items-center justify-between px-4 py-3 text-[16px] font-bold text-[#161616] hover:bg-[#FFFAF5] rounded-xl transition-colors"
              >
                Community
                <ChevronDown className={`h-5 w-5 text-[#8A817A] transition-transform ${mobileExpandedGroup === 'community' ? 'rotate-180' : ''}`} />
              </button>
              {mobileExpandedGroup === 'community' && (
                <div className="pl-4 pr-2 py-2 flex flex-col gap-1">
                  {communityLinks.map(link => (
                    <a key={link.name} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFFFAF5]">
                      <link.icon className="h-5 w-5 text-[#FF6B1A]" />
                      <span className="text-[15px] font-bold text-[#5F5B57]">{link.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Bottom Actions */}
          <div className="absolute bottom-0 left-0 w-full p-5 bg-white border-t border-[#F2D8C8] flex flex-col gap-3">
            {isConnected ? (
              <button onClick={() => { disconnect(); setMobileMenuOpen(false); }} className="w-full rounded-xl bg-[#FFFFAF5] border border-[#F2D8C8] py-3.5 text-center font-extrabold text-[#161616]">
                Disconnect Wallet
              </button>
            ) : (
              <button onClick={handleConnect} className="w-full rounded-xl bg-[#FFFFAF5] border border-[#F2D8C8] py-3.5 text-center font-extrabold text-[#161616]">
                Connect Wallet
              </button>
            )}
            <Link
              href="/launch"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] py-3.5 text-center font-extrabold text-white shadow-md shadow-brand-orange/20"
            >
              Launch Market
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}
