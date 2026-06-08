"use client";

import React from "react";
import { useConnect } from "wagmi";
import { X } from "lucide-react";

export default function WalletModal({ onClose }: { onClose: () => void }) {
  const { connectors, connect, isPending, error } = useConnect();

  // EIP-6963 discovery exposes each installed wallet as its own connector.
  // If any named wallet was discovered, hide the generic "injected" entry to
  // avoid a confusing duplicate; dedupe the rest by name.
  const hasNamedInjected = connectors.some((c) => c.type === "injected" && c.id !== "injected");
  const seen = new Set<string>();
  const list = connectors.filter((c) => {
    if (c.id === "injected" && hasNamedInjected) return false;
    const key = (c.name || c.id).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#161616]/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[24px] border border-[#F2D8C8] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-[#161616]">Connect a Wallet</h3>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-[#FFFAF5] text-[#5F5B57] hover:bg-[#F2D8C8] hover:text-[#161616] flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {list.length === 0 && (
            <p className="text-sm font-medium text-[#8A817A] py-4 text-center">
              No wallets detected. Install MetaMask, or use WalletConnect from a mobile wallet.
            </p>
          )}
          {list.map((c) => (
            <button
              key={c.uid}
              onClick={() => connect({ connector: c }, { onSuccess: onClose })}
              disabled={isPending}
              className="flex items-center gap-3 rounded-2xl border border-[#F2D8C8] bg-white p-4 text-left hover:border-[#FF6B1A] hover:bg-[#FFFAF5] transition-colors disabled:opacity-60"
            >
              {c.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.icon} alt="" className="h-7 w-7 rounded-md" />
              ) : (
                <div className="h-7 w-7 rounded-md bg-[#FFF1ED] flex items-center justify-center text-[#FF6B1A] font-black text-xs">
                  {(c.name || "?").charAt(0)}
                </div>
              )}
              <span className="text-[15px] font-bold text-[#161616]">{c.name}</span>
            </button>
          ))}
        </div>

        {error && (
          <p className="text-xs font-bold text-red-600 mt-3">
            {error.message?.includes("rejected") ? "Connection request rejected." : error.message}
          </p>
        )}

        <p className="text-[11px] text-[#8A817A] mt-4 text-center">
          By connecting, you agree to the Terms & Risk Disclaimer.
        </p>
      </div>
    </div>
  );
}
