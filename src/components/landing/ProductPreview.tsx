import React from "react";
import { TrendingUp, Flame, ArrowUpRight } from "lucide-react";

export default function ProductPreview() {
  return (
    <div className="relative w-full z-10">
      
      {/* Container - Modern White App Window */}
      <div className="relative w-full overflow-hidden rounded-[24px] lg:rounded-[32px] border border-[#F2D8C8] bg-white shadow-[0_40px_80px_-20px_rgba(255,107,26,0.15),0_10px_30px_-10px_rgba(0,0,0,0.05)] ring-1 ring-black/5 transform-gpu">
        
        {/* Fake Browser / App Header */}
        <div className="flex h-10 lg:h-12 items-center gap-2 border-b border-[#F2D8C8] bg-[#FFFAF5] px-4 lg:px-6">
          <div className="flex gap-2">
            <div className="h-2.5 w-2.5 lg:h-3 lg:w-3 rounded-full bg-[#FF5F56]" />
            <div className="h-2.5 w-2.5 lg:h-3 lg:w-3 rounded-full bg-[#FFBD2E]" />
            <div className="h-2.5 w-2.5 lg:h-3 lg:w-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="ml-4 flex h-6 lg:h-8 flex-1 items-center justify-center rounded-md bg-white border border-[#F2D8C8] text-[10px] lg:text-xs font-medium text-[#8A817A] max-w-sm">
            <span className="flex items-center gap-1.5"><Flame className="h-3 w-3 text-[#FF6B1A]" /> karmafi.app/explore</span>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="flex flex-col lg:flex-row h-auto lg:h-[580px] bg-[#FFFCF8]">
          
          {/* Left Sidebar - Communities (Hidden on small mobile) */}
          <div className="hidden sm:flex lg:w-[200px] flex-col border-r border-[#F2D8C8] bg-white p-4">
            <h3 className="text-[10px] lg:text-xs font-bold text-[#8A817A] uppercase tracking-wider mb-4">Top Communities</h3>
            <div className="flex flex-col gap-2">
              {[
                { name: "r/wallstreetbets", active: true },
                { name: "r/CryptoCurrency", active: false },
                { name: "r/technology", active: false },
                { name: "r/MachineLearning", active: false }
              ].map((sub, i) => (
                <div key={i} className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[12px] lg:text-sm font-bold cursor-pointer transition-colors ${sub.active ? 'bg-[#FFF1ED] text-[#FF6B1A]' : 'text-[#5F5B57] hover:bg-[#FFFAF5] hover:text-[#161616]'}`}>
                  <span className="truncate">{sub.name}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 rounded-xl border border-[#F2D8C8] bg-[#FFFAF5] p-3">
              <div className="text-[11px] lg:text-xs font-bold text-[#161616] mb-1">Portfolio</div>
              <div className="text-lg lg:text-xl font-black text-[#FF6B1A]">24.5 BNB</div>
              <div className="flex items-center gap-1 text-[10px] lg:text-xs font-bold text-[#19C37D] mt-1">
                <TrendingUp className="h-3 w-3" /> +12.4% today
              </div>
            </div>
          </div>

          {/* Center Feed - Market Cards */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 no-scrollbar">
            <div className="flex items-center justify-between mb-4 lg:mb-5">
              <h2 className="text-lg lg:text-xl font-extrabold text-[#161616]">Trending Markets</h2>
              <div className="flex gap-2">
                <button className="rounded-full bg-[#FF6B1A] px-3 py-1 lg:px-4 lg:py-1.5 text-[11px] lg:text-xs font-bold text-white shadow-sm">Hot</button>
                <button className="rounded-full bg-white border border-[#F2D8C8] px-3 py-1 lg:px-4 lg:py-1.5 text-[11px] lg:text-xs font-bold text-[#5F5B57] hidden sm:block">New</button>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:gap-4">
              
              {/* Market Card 1 */}
              <div className="rounded-xl lg:rounded-2xl border border-[#FFAB66] bg-white p-4 lg:p-5 shadow-[0_4px_12px_rgba(255,107,26,0.08)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#FF6B1A]/5 blur-[40px] rounded-full pointer-events-none" />
                <div className="flex items-start justify-between relative">
                  <div className="flex items-center gap-2 mb-2 lg:mb-3">
                    <span className="rounded bg-[#FFFAF5] border border-[#F2D8C8] px-2 py-0.5 text-[10px] lg:text-xs font-bold text-[#5F5B57]">r/wallstreetbets</span>
                    <span className="text-[10px] lg:text-xs text-[#8A817A] font-medium hidden sm:inline">• 2h ago</span>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-[#FFF1ED] px-2 py-1 text-[10px] lg:text-xs font-bold text-[#FF6B1A] border border-[#FFAB66]/30">
                    <Flame className="h-3 w-3" /> Viral Score 98
                  </div>
                </div>
                <h3 className="text-[15px] lg:text-lg font-bold text-[#161616] mb-2 leading-tight relative pr-4">NVIDIA earnings leak shows 300% YoY growth?</h3>
                <div className="mt-3 lg:mt-4 flex flex-wrap gap-x-4 gap-y-3 lg:gap-6 border-t border-[#F2D8C8] pt-3 lg:pt-4 relative">
                  <div>
                    <div className="text-[10px] lg:text-xs font-medium text-[#8A817A] mb-0.5">Price</div>
                    <div className="text-sm lg:text-lg font-black text-[#161616] flex items-center gap-1 lg:gap-2">
                      $0.042 <span className="text-[10px] lg:text-xs font-bold text-[#19C37D]">+45%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] lg:text-xs font-medium text-[#8A817A] mb-0.5">24h Vol</div>
                    <div className="text-sm lg:text-lg font-black text-[#161616]">1,240 BNB</div>
                  </div>
                  <div className="ml-auto self-center">
                    <button className="rounded-full bg-[#161616] hover:bg-[#FF6B1A] transition-colors px-4 lg:px-6 py-1.5 lg:py-2 text-[12px] lg:text-sm font-bold text-white shadow-sm flex items-center gap-1.5">
                      Trade <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Market Card 2 */}
              <div className="rounded-xl lg:rounded-2xl border border-[#F2D8C8] bg-white p-4 lg:p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-2 lg:mb-3">
                    <span className="rounded bg-[#FFFAF5] border border-[#F2D8C8] px-2 py-0.5 text-[10px] lg:text-xs font-bold text-[#5F5B57]">r/CryptoCurrency</span>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-[#FFF1ED] px-2 py-1 text-[10px] lg:text-xs font-bold text-[#FF6B1A] border border-[#FFAB66]/30">
                    <Flame className="h-3 w-3" /> Viral Score 82
                  </div>
                </div>
                <h3 className="text-[15px] lg:text-lg font-bold text-[#161616] mb-2 leading-tight pr-4">CZ spotted in Dubai airport, Binance moves 28 BUSD</h3>
                <div className="mt-3 lg:mt-4 flex flex-wrap gap-x-4 gap-y-3 lg:gap-6 border-t border-[#F2D8C8] pt-3 lg:pt-4">
                  <div>
                    <div className="text-[10px] lg:text-xs font-medium text-[#8A817A] mb-0.5">Price</div>
                    <div className="text-sm lg:text-lg font-black text-[#161616] flex items-center gap-1 lg:gap-2">
                      $0.018 <span className="text-[10px] lg:text-xs font-bold text-[#19C37D]">+12%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] lg:text-xs font-medium text-[#8A817A] mb-0.5">24h Vol</div>
                    <div className="text-sm lg:text-lg font-black text-[#161616]">450 BNB</div>
                  </div>
                  <div className="ml-auto self-center">
                    <button className="rounded-full bg-[#161616] hover:bg-[#FF6B1A] transition-colors px-4 lg:px-6 py-1.5 lg:py-2 text-[12px] lg:text-sm font-bold text-white shadow-sm flex items-center gap-1.5">
                      Trade <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Market Card 3 (Hidden on mobile to save space) */}
              <div className="hidden lg:block rounded-2xl border border-[#F2D8C8] bg-white p-5 shadow-sm opacity-60">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="rounded bg-[#FFFAF5] border border-[#F2D8C8] px-2 py-0.5 text-xs font-bold text-[#5F5B57]">r/MachineLearning</span>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-[#FFF1ED] px-2 py-1 text-xs font-bold text-[#FF6B1A] border border-[#FFAB66]/30">
                    <Flame className="h-3 w-3" /> Viral Score 76
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#161616] mb-2 leading-tight pr-4">OpenAI Q-Star model details leaked by former researcher</h3>
                <div className="mt-4 flex flex-wrap gap-6 border-t border-[#F2D8C8] pt-4">
                  <div>
                    <div className="text-xs font-medium text-[#8A817A] mb-0.5">Price</div>
                    <div className="text-lg font-black text-[#161616] flex items-center gap-2">
                      $0.009 <span className="text-xs font-bold text-[#FF5F56]">-4%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#8A817A] mb-0.5">24h Vol</div>
                    <div className="text-lg font-black text-[#161616]">125 BNB</div>
                  </div>
                  <div className="ml-auto self-center">
                    <button className="rounded-full bg-[#161616] transition-colors px-6 py-2 text-sm font-bold text-white shadow-sm flex items-center gap-1.5">
                      Trade <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Sidebar - Trending/Curators (Hidden on small mobile) */}
          <div className="hidden lg:flex w-[240px] flex-col border-l border-[#F2D8C8] bg-white p-4">
            
            <div className="mb-6 rounded-xl bg-gradient-to-br from-[#FF6B1A] to-[#E9500E] p-4 text-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-white/10 blur-[20px] rounded-full pointer-events-none" />
              <h4 className="text-[15px] font-black mb-1 relative">Creator Claim Vault</h4>
              <p className="text-[11px] font-medium text-white/90 mb-3 relative leading-snug">
                Did someone launch a market on your post? Claim your 30% fee share.
              </p>
              <button className="w-full rounded-lg bg-white py-1.5 text-[12px] font-bold text-[#FF6B1A] hover:bg-[#FFF1ED] transition-colors relative">
                Check Eligibility
              </button>
            </div>

            <h3 className="text-xs font-bold text-[#8A817A] uppercase tracking-wider mb-4">Top Curators</h3>
            <div className="flex flex-col gap-3">
              {[
                { name: "0xKarmaLord", profit: "+45.2 BNB" },
                { name: "AlphaSeeker", profit: "+28.7 BNB" },
                { name: "RedditWhale", profit: "+19.1 BNB" },
                { name: "MemeHunter", profit: "+12.4 BNB" },
              ].map((curator, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-[#FFF1ED] flex items-center justify-center text-[11px] font-bold text-[#FF6B1A] border border-[#FFAB66]/30">
                    {i + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#161616]">{curator.name}</span>
                    <span className="text-[11px] font-medium text-[#19C37D]">{curator.profit}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
