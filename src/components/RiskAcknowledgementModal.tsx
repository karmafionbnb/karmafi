"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, ShieldOff, Scale, Wallet } from "lucide-react";

const RISK_ACK_VERSION = "v1";
const STORAGE_KEY = `karmafi_risk_acknowledged_${RISK_ACK_VERSION}`;

export default function RiskAcknowledgementModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Exclude routes
  const excludedRoutes = ["/terms", "/privacy", "/risk-disclaimer", "/disclaimer", "/admin"];
  const isExcluded = excludedRoutes.some(route => pathname?.startsWith(route));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const hasAcknowledged = localStorage.getItem(STORAGE_KEY);
    if (!hasAcknowledged && !isExcluded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true);
    }
  }, [pathname, isExcluded]);

  // Listen for manual open event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("karmafi-open-risk-modal", handleOpen);
    return () => window.removeEventListener("karmafi-open-risk-modal", handleOpen);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    localStorage.setItem("karmafi_risk_acknowledged_at", new Date().toISOString());
    setIsOpen(false);
  };

  if (!isMounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#161616]/40 backdrop-blur-[2px]" />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-[640px] bg-[#FFFAF5] rounded-[28px] border border-[#F2D8C8] shadow-[0_24px_48px_-12px_rgba(255,107,26,0.15)] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-[#F2D8C8] shrink-0 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-[#FF6B1A]/10 blur-[40px] rounded-full pointer-events-none" />
          <h2 className="relative text-[24px] md:text-[28px] font-black text-[#161616] tracking-tight">
            Before you continue
          </h2>
          <p className="relative mt-2 text-[14.5px] font-medium text-[#5F5B57] max-w-[480px] mx-auto leading-relaxed">
            KarmaFi is an experimental attention market platform. Please review and accept the risks before using the site.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex gap-4">
              <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#FFF1ED] text-[#FF6B1A] border border-[#FFAB66]/30">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-[15px] font-black text-[#161616] mb-1">Speculative Markets</h4>
                <p className="text-[13.5px] text-[#5F5B57] font-medium leading-relaxed">
                  Karma Markets are volatile and may lose all value.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#FFF1ED] text-[#FF6B1A] border border-[#FFAB66]/30">
                <ShieldOff className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-[15px] font-black text-[#161616] mb-1">No Ownership Rights</h4>
                <p className="text-[13.5px] text-[#5F5B57] font-medium leading-relaxed">
                  Karma Markets do not represent ownership, copyright, licensing, endorsement, or affiliation with Reddit or the original poster.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#FFF1ED] text-[#FF6B1A] border border-[#FFAB66]/30">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-[15px] font-black text-[#161616] mb-1">Independent Protocol</h4>
                <p className="text-[13.5px] text-[#5F5B57] font-medium leading-relaxed">
                  KarmaFi is unaffiliated with Reddit and is not endorsed by BNB Chain.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#FFF1ED] text-[#FF6B1A] border border-[#FFAB66]/30">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-[15px] font-black text-[#161616] mb-1">Wallet & Contract Risk</h4>
                <p className="text-[13.5px] text-[#5F5B57] font-medium leading-relaxed">
                  Blockchain transactions are irreversible. Use KarmaFi only if you understand the risks.
                </p>
              </div>
            </div>

          </div>

          <div className="p-4 bg-white rounded-[16px] border border-[#F2D8C8]">
            <p className="text-[13.5px] text-[#5F5B57] font-medium leading-relaxed text-center">
              By continuing, you acknowledge that KarmaFi is experimental, markets are speculative, and you are responsible for your own decisions.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 md:p-8 pt-0 shrink-0 flex flex-col items-center gap-4">
          <button 
            onClick={handleAccept}
            className="w-full md:w-auto min-w-[240px] h-[48px] bg-gradient-to-b from-[#FF8A1F] to-[#E9500E] border border-[#E9500E] text-white rounded-full text-[15px] font-extrabold shadow-[0_8px_16px_rgba(255,107,26,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            I understand, continue
          </button>
          
          <div className="flex items-center gap-4 text-[13px] font-bold">
            <Link href="/risk-disclaimer" onClick={() => setIsOpen(false)} className="text-[#8A817A] hover:text-[#FF6B1A] transition-colors">
              Read Risk Disclaimer
            </Link>
            <span className="text-[#E8D4C8]">•</span>
            <Link href="/terms" onClick={() => setIsOpen(false)} className="text-[#8A817A] hover:text-[#FF6B1A] transition-colors">
              Terms of Service
            </Link>
          </div>
          
          <p className="text-[12px] text-[#8A817A] font-medium">
            You can review these disclosures anytime from the footer.
          </p>
        </div>

      </div>
    </div>
  );
}
