import React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import Logo from "@/components/Logo";
import FadeIn from "@/components/ui/FadeIn";

export default function FinalCTASection() {
  return (
    <section className="w-full bg-[#FFFDFB] py-12">
      <div className="mx-auto max-w-[1200px] px-6">
        
        <FadeIn delay={0.1}>
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#FF984D] via-[#FF6B1A] to-[#D9450A] py-10 px-8 md:py-12 md:px-16 text-center shadow-[0_32px_64px_rgba(255,107,26,0.25)] border border-[#FFAB66]/30">
            
            {/* Soft Inner Glow & Rich Depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.25),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.1),transparent_50%)]" />

            {/* Floating UI elements (decorative) */}
            <div className="absolute top-8 left-12 opacity-30 hidden md:block animate-pulse duration-3000">
              <div className="h-16 w-16 rounded-2xl bg-white/40 backdrop-blur-md rotate-[-12deg] border border-white/50 shadow-xl" />
            </div>
            <div className="absolute bottom-8 right-12 opacity-30 hidden md:block animate-pulse duration-4000">
              <div className="h-24 w-24 rounded-full bg-white/30 backdrop-blur-md rotate-[15deg] border border-white/40 shadow-xl" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              
              <div className="mb-5 relative">
                <div className="absolute inset-0 bg-white/30 blur-xl rounded-full" />
                <Logo className="relative h-12 w-12 rounded-2xl shadow-2xl bg-white p-1.5 border border-white/50" />
              </div>
              
              <h2 className="text-[28px] md:text-[36px] font-black tracking-tight text-white mb-3 leading-tight max-w-[800px]">
                Ready to launch your first Karma Market?
              </h2>
              
              <p className="text-[16px] md:text-[18px] font-medium text-white/90 mb-6 max-w-[600px]">
                Find a Reddit post with momentum, launch it on BNB Chain, and let the market price the attention.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                <Link
                  href="/launch"
                  className="w-full sm:w-auto flex h-[52px] items-center justify-center rounded-full bg-white px-8 text-[15.5px] font-black text-[#E9500E] shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] hover:scale-[1.03] active:scale-[0.98] transition-all"
                >
                  Launch a Karma Market
                </Link>
                <Link
                  href="/feed"
                  className="w-full sm:w-auto flex h-[52px] items-center justify-center rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-sm px-8 text-[15.5px] font-bold text-white hover:bg-white/20 hover:border-white/60 transition-all shadow-lg"
                >
                  Explore Markets
                  <Compass className="ml-2.5 h-5 w-5 opacity-90" />
                </Link>
              </div>

              <Link href="/whitepaper" className="mt-6 text-[14px] font-bold text-white/80 hover:text-white underline decoration-white/30 hover:decoration-white transition-all underline-offset-4">
                Read Whitepaper
              </Link>

            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
