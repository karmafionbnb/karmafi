import React from "react";
import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";

export default function CuratorsAndCreators() {
  const leaders = [
    { rank: 1, name: "0xKarmaLord", earnings: "24.5 BNB" },
    { rank: 2, name: "AlphaSeeker", earnings: "17.3 BNB" },
    { rank: 3, name: "RedditWhale", earnings: "13.8 BNB" },
  ];

  return (
    <section className="w-full bg-[#FFFDFB] py-16 border-b border-[#F2D8C8]">
      <div className="mx-auto max-w-[1080px] px-6">
        
        <div className="text-center mb-12">
          <h2 className="text-[28px] md:text-[36px] font-extrabold tracking-tight text-[#161616] mb-3">
            Curators <span className="text-[#FF6B1A]">earn</span>. Creators <span className="text-[#FF6B1A]">claim</span>.
          </h2>
          <p className="text-[16px] font-medium text-[#5F5B57] max-w-[700px] mx-auto">
            KarmaFi rewards early discovery while reserving a creator vault for original Reddit posters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Curator Rewards */}
          <div className="flex flex-col rounded-[24px] border border-[#F1DDD0] bg-white p-6 md:p-8 shadow-[0_16px_40px_rgba(22,22,22,0.04)]">
            <h3 className="text-[20px] font-extrabold text-[#161616] mb-4">Curator Rewards</h3>
            <ul className="flex flex-col gap-3 text-[15px] font-medium text-[#5F5B57] mb-8">
              <li className="flex items-start gap-3">
                <div className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-[#FF6B1A]" />
                Curators launch markets around early Reddit momentum.
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-[#FF6B1A]" />
                Curators earn a share of trading fees.
              </li>
            </ul>
            <div className="mt-auto">
              <Link
                href="/launch"
                className="inline-flex h-[44px] items-center justify-center rounded-full bg-[#161616] px-6 text-[14.5px] font-extrabold text-white shadow-sm hover:bg-[#333] transition-colors group"
              >
                Start Curating
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Creator Claim Vault */}
          <div className="flex flex-col rounded-[24px] border border-[#F1DDD0] bg-gradient-to-br from-[#FFF1ED] to-[#FFFAF5] p-6 md:p-8 shadow-[0_16px_40px_rgba(255,107,26,0.06)]">
            <h3 className="text-[20px] font-extrabold text-[#161616] mb-4">Creator Claim Vault</h3>
            <ul className="flex flex-col gap-3 text-[15px] font-medium text-[#5F5B57] mb-8">
              <li className="flex items-start gap-3">
                <div className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-[#E9500E]" />
                Original Reddit posters can verify ownership.
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-[#E9500E]" />
                Connect wallet.
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-[#E9500E]" />
                Claim reserved creator rewards.
              </li>
            </ul>
            <div className="mt-auto">
              <Link
                href="/creator-claim"
                className="inline-flex h-[44px] items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] px-6 text-[14.5px] font-extrabold text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform group"
              >
                Claim Creator Vault
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>

        {/* Mini Leaderboard */}
        <div className="mt-12 mx-auto max-w-[600px] rounded-[24px] border border-[#F1DDD0] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1ED] text-[#FF6B1A]">
              <Trophy className="h-5 w-5" />
            </div>
            <h3 className="text-[17px] font-extrabold text-[#161616]">Top Curators</h3>
          </div>

          <div className="flex flex-col gap-3">
            {leaders.map((leader) => (
              <div key={leader.rank} className="flex items-center justify-between rounded-xl border border-[#F1DDD0] bg-white p-3 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold ${
                    leader.rank === 1 ? 'bg-[#FF6B1A] text-white shadow-md' :
                    leader.rank === 2 ? 'bg-[#FFAB66] text-white' :
                    leader.rank === 3 ? 'bg-[#F3BA2F] text-white' :
                    'bg-[#F2D8C8] text-[#5F5B57]'
                  }`}>
                    #{leader.rank}
                  </div>
                  <span className="font-extrabold text-[#161616] text-[15px]">{leader.name}</span>
                </div>
                <span className="font-black text-[#19C37D] bg-[#19C37D]/10 px-3 py-1 rounded-lg text-[14px]">
                  +{leader.earnings}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
