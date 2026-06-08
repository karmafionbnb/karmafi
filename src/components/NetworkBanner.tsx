"use client";

import React from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { AlertTriangle } from "lucide-react";

const SUPPORTED = [56, 97]; // BNB Mainnet + Testnet

export default function NetworkBanner() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || SUPPORTED.includes(chainId)) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[120] bg-[#DC2626] text-white px-4 py-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px] font-bold shadow-md">
      <span className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        Wrong network — KarmaFi runs on BNB Smart Chain.
      </span>
      <button
        onClick={() => switchChain({ chainId: 56 })}
        disabled={isPending}
        className="rounded-full bg-white text-[#DC2626] px-3 py-1 text-[12px] font-extrabold hover:bg-white/90 transition-colors disabled:opacity-70"
      >
        {isPending ? "Switching…" : "Switch to BNB Chain"}
      </button>
    </div>
  );
}
