"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useWallet } from "@/context/wallet";
import { 
  LayoutDashboard, Flag, ShieldAlert, Copy, FileBadge, 
  Scale, EyeOff, PauseCircle, Activity, FileText, Settings2, 
  Menu, X, RefreshCw
} from "lucide-react";

// Admin wallets come from NEXT_PUBLIC_ADMIN_WALLETS (comma-separated). Defaults
// to the treasury wallet so the owner has access out of the box.
const ADMIN_ALLOWLIST = (
  process.env.NEXT_PUBLIC_ADMIN_WALLETS || "0xDe9300B6968334fD86CB50d5dB131EAC256Af199"
)
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { walletAddress, isConnected, connect, isSandboxMode } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const isAdmin = isConnected && !!walletAddress && ADMIN_ALLOWLIST.includes(walletAddress.toLowerCase());

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[24px] p-8 border border-[#F2D8C8] shadow-sm text-center">
          <ShieldAlert className="h-12 w-12 text-[#FF6B1A] mx-auto mb-4" />
          <h2 className="text-[24px] font-black text-[#161616] mb-2">Admin Access Required</h2>
          <p className="text-[14px] text-[#5F5B57] mb-6">Connect your authorized admin wallet to access the KarmaFi moderation console.</p>
          <button 
            onClick={() => connect()}
            className="w-full h-12 rounded-full bg-[#FF6B1A] text-white font-bold hover:bg-[#E9500E] transition-colors"
          >
            Connect Admin Wallet
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[24px] p-8 border border-[#F2D8C8] shadow-sm text-center">
          <X className="h-12 w-12 text-[#EF4444] mx-auto mb-4" />
          <h2 className="text-[24px] font-black text-[#161616] mb-2">Access Denied</h2>
          <p className="text-[14px] text-[#5F5B57] mb-6">The connected wallet is not authorized to view the admin dashboard.</p>
          <p className="text-[12px] font-mono bg-[#FFFAF5] p-2 rounded-lg border border-[#E8D4C8] text-[#5F5B57] break-all">
            {walletAddress}
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "reports", label: "Reports", icon: Flag },
    { id: "suspicious-launches", label: "Suspicious Launches", icon: ShieldAlert },
    { id: "duplicate-posts", label: "Duplicate Posts", icon: Copy },
    { id: "creator-claims", label: "Creator Claims", icon: FileBadge },
    { id: "creator-disputes", label: "Creator Disputes", icon: Scale },
    { id: "takedown-requests", label: "Takedown Requests", icon: Scale },
    { id: "hidden-markets", label: "Hidden Markets", icon: EyeOff },
    { id: "paused-markets", label: "Paused Markets", icon: PauseCircle },
    { id: "contract-events", label: "Contract Events", icon: Activity },
    { id: "audit-logs", label: "Audit Logs", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings2 },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-[#F2D8C8] p-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -ml-2 text-[#161616]">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
          <span className="font-black text-[#161616] text-[18px]">KarmaFi Admin</span>
        </div>
        <div className="bg-[#FF6B1A]/10 text-[#FF6B1A] px-3 py-1 rounded-full text-[12px] font-bold">
          Super Admin
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-[#F2D8C8] flex flex-col z-30 transition-transform
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6 border-b border-[#F2D8C8] hidden md:block">
          <Link href="/admin" className="text-[20px] font-black text-[#161616] tracking-tight">
            KarmaFi <span className="text-[#FF6B1A]">Admin</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <Link 
                key={item.id}
                href={`/admin?tab=${item.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive 
                    ? "bg-[#FFFAF5] text-[#FF6B1A] font-bold" 
                    : "text-[#5F5B57] font-medium hover:bg-[#F2D8C8]/30 hover:text-[#161616]"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-[#FF6B1A]" : "text-[#8A817A]"}`} />
                <span className="text-[14px]">{item.label}</span>
              </Link>
            )
          })}
        </div>
        
        <div className="p-4 border-t border-[#F2D8C8] bg-[#FFFAF5]">
          <Link href="/" className="w-full block text-center py-2.5 rounded-xl border border-[#E8D4C8] text-[13px] font-bold text-[#161616] hover:bg-white transition-colors">
            Exit to Public App
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-[#F2D8C8] h-[72px] px-8 hidden md:flex items-center justify-between shrink-0">
          <h1 className="text-[20px] font-black text-[#161616] capitalize">
            {activeTab.replace("-", " ")}
          </h1>
          <div className="flex items-center gap-4">
            {isSandboxMode && (
              <span className="bg-[#EF4444] text-white px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider">
                Sandbox Network
              </span>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFFAF5] rounded-full border border-[#E8D4C8]">
              <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
              <span className="text-[12px] font-bold text-[#161616]">Super Admin</span>
            </div>
            <div className="px-4 py-1.5 bg-white border border-[#F2D8C8] rounded-full text-[13px] font-mono text-[#5F5B57]">
              {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
            </div>
            <button className="p-2 text-[#8A817A] hover:text-[#FF6B1A] transition-colors rounded-full hover:bg-[#FFFAF5]">
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[#161616]/50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7]" />}>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </Suspense>
  );
}
