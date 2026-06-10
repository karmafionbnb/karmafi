"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, CheckCircle2, AlertTriangle, Loader2, Wallet, ArrowRight, Check, Search } from "lucide-react";
import { useWallet } from "@/context/wallet";
import { fetchRedditUserAbout } from "@/lib/reddit-client";

export default function CreatorClaim() {
  const { isConnected, connect, walletAddress, signMessage } = useWallet();

  const [step, setStep] = useState(1); // 1: connect wallet, 2: paste market address, 3: reddit oauth login, 4: submit claim, 5: success
  const [marketAddress, setMarketAddress] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<any | null>(null);
  
  // Simulated OAuth state
  const [redditUsername, setRedditUsername] = useState("");
  const [isVerifyingReddit, setIsVerifyingReddit] = useState(false);
  
  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimResult, setClaimResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Market picker
  const [marketList, setMarketList] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [marketSearch, setMarketSearch] = useState("");

  useEffect(() => {
    if (step !== 2 || marketList.length > 0) return;
    setLoadingList(true);
    fetch("/api/market?sort=new")
      .then((r) => r.json())
      .then((d) => { if (d.success) setMarketList(d.markets); })
      .catch(() => {})
      .finally(() => setLoadingList(false));
  }, [step, marketList.length]);

  const filteredMarkets = marketList.filter((m) => {
    if (!marketSearch) return true;
    const q = marketSearch.toLowerCase();
    return (
      (m.title || "").toLowerCase().includes(q) ||
      (m.symbol || "").toLowerCase().includes(q) ||
      (m.subreddit || "").toLowerCase().includes(q) ||
      (m.author || "").toLowerCase().includes(q) ||
      (m.marketAddress || "").toLowerCase().includes(q)
    );
  });

  const selectMarketFromList = (m: any) => {
    setErrorMsg("");
    if (m.creatorWallet) {
      setErrorMsg("Creator rewards have already been claimed for this market.");
      return;
    }
    setSelectedMarket(m);
    setMarketAddress(m.marketAddress);
    setStep(3);
  };

  const handleFetchMarket = async () => {
    if (!marketAddress) return;
    setErrorMsg("");

    try {
      const res = await fetch(`/api/market/${marketAddress}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Market not found");
      }

      if (data.market.creatorWallet) {
        throw new Error("Creator rewards have already been claimed for this market.");
      }

      setSelectedMarket(data.market);
      setStep(3); // proceed to oauth
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to find active market.");
    }
  };

  // Unique, deterministic verification code for this claimer + market.
  const verifyCode = selectedMarket
    ? `KARMA-${((walletAddress || "0000").slice(2, 6) + selectedMarket.sourceHash.slice(2, 6)).toUpperCase()}`
    : "";

  const handleRedditAuth = async () => {
    if (!selectedMarket) return;
    setIsVerifyingReddit(true);
    setErrorMsg("");

    const targetUser = selectedMarket.author.replace(/^u\//, "");
    try {
      // Read the post author's public Reddit bio and confirm it contains the
      // code. Only the account owner can edit that bio, so this proves control.
      const profile = await fetchRedditUserAbout(targetUser);
      if (!profile.bio.toUpperCase().includes(verifyCode)) {
        throw new Error(
          `Couldn't find the code in u/${targetUser}'s Reddit bio yet. Add "${verifyCode}" to your profile bio, save, then try again (Reddit can take a few seconds).`
        );
      }
      setRedditUsername(targetUser);
      setStep(4);
    } catch (e: any) {
      setErrorMsg(e.message || "Verification failed.");
    } finally {
      setIsVerifyingReddit(false);
    }
  };

  const handleExecuteClaim = async () => {
    if (!selectedMarket || !redditUsername || !walletAddress) return;
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // 1. Sign verify message to authorize wallet linkage
      const message = `Claim rewards for Reddit post ${selectedMarket.sourceHash} as user ${redditUsername} to wallet ${walletAddress}`;
      const signature = await signMessage(message);

      // 2. Submit to claim API
      const res = await fetch("/api/creator/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceHash: selectedMarket.sourceHash,
          redditUsername: `u/${redditUsername}`,
          walletAddress,
          signature
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to execute claim in Creator vault");
      }

      setClaimResult(data.claim);
      setStep(5); // success page
    } catch (e: any) {
      setErrorMsg(e.message || "Claim execution failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-tertiary)] relative overflow-hidden">
      {/* Background glowing orb */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#19C37D]/10 via-[#FF6B1A]/5 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <Navbar />

      <main className="mx-auto w-full max-w-3xl px-6 py-16 flex-1 relative z-10">
        
        {/* Header Area */}
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--tint-success)] to-[var(--tint-success-strong)] mb-6 shadow-sm">
            <ShieldCheck className="h-8 w-8 text-[#19C37D]" />
          </div>
          <h1 className="text-[40px] md:text-[48px] font-[900] text-[var(--text-primary)] leading-tight tracking-tight mb-4">
            Creator Claim Vault
          </h1>
          <p className="text-[16px] md:text-[18px] text-[var(--text-secondary)] font-medium max-w-xl mx-auto">
            Securely authenticate your Reddit account to claim accrued trading fees for attention markets launched from your posts.
          </p>
        </div>

        <div className="rounded-[32px] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative">
          
          {/* Stepper indicators */}
          <div className="flex items-center justify-between mb-10 px-2 sm:px-6 relative">
            <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-[var(--border-subtle)] -z-10 -translate-y-1/2" />
            <div className="absolute top-1/2 left-8 h-[2px] bg-[#19C37D] -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${((step - 1) / 3) * (100 - 16)}%` }} />
            
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex flex-col items-center gap-2 bg-[var(--surface-primary)] px-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-colors ${
                  step > s ? "bg-[#19C37D] text-white" :
                  step === s ? "bg-[#FF6B1A] text-white shadow-md shadow-[#FF6B1A]/20" :
                  "bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
                }`}>
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
                  step >= s ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                }`}>
                  {s === 1 ? "Wallet" : s === 2 ? "Market" : s === 3 ? "Reddit" : "Claim"}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Wallet Connection */}
          {step === 1 && (
            <div className="text-center py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-[24px] bg-[var(--tint-orange)] mb-6">
                <Wallet className="h-10 w-10 text-[#FF6B1A]" />
              </div>
              <h2 className="text-2xl font-black text-[var(--text-primary)] mb-3">Connect Wallet to Begin</h2>
              <p className="text-sm font-medium text-[var(--text-secondary)] max-w-sm mx-auto mb-8 leading-relaxed">
                Accrued vault rewards are sent directly to your BNB Chain wallet. Connect to begin signature verification.
              </p>
              {isConnected ? (
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] px-10 text-[15px] font-extrabold text-white shadow-[0_4px_14px_rgba(255,107,26,0.3)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Continue to Step 2
                </button>
              ) : (
                <button
                  onClick={() => connect()}
                  className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] px-8 text-[15px] font-extrabold text-white shadow-[0_4px_14px_rgba(255,107,26,0.3)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          )}

          {/* Step 2: Select Market */}
          {step === 2 && (
            <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-1">
                <h2 className="text-2xl font-black text-[var(--text-primary)] mb-3">Select Your Market</h2>
                <p className="text-sm font-medium text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                  Pick the attention market created from your Reddit post — no need to find a contract address.
                </p>
              </div>

              {/* Search the market list */}
              <div className="relative">
                <Search className="absolute left-4 top-[18px] h-5 w-5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={marketSearch}
                  onChange={(e) => setMarketSearch(e.target.value)}
                  placeholder="Search by post title, symbol, subreddit, or author..."
                  className="w-full h-14 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-secondary)] pl-12 pr-4 text-[15px] font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#FF6B1A] focus:bg-[var(--surface-primary)] focus:outline-none transition-colors shadow-sm"
                />
              </div>

              {/* Clickable market list */}
              <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1">
                {loadingList && (
                  <div className="flex items-center justify-center py-10 text-[#FF6B1A]">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}
                {!loadingList && filteredMarkets.length === 0 && (
                  <p className="text-center text-sm font-medium text-[var(--text-muted)] py-8">
                    {marketList.length === 0 ? "No markets exist yet." : "No markets match your search."}
                  </p>
                )}
                {!loadingList && filteredMarkets.map((m) => {
                  const claimed = !!m.creatorWallet;
                  return (
                    <button
                      key={m.marketAddress}
                      onClick={() => selectMarketFromList(m)}
                      disabled={claimed}
                      className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-colors ${
                        claimed
                          ? "border-[var(--border-subtle)] bg-[var(--surface-tertiary)] opacity-60 cursor-not-allowed"
                          : "border-[var(--border-subtle)] bg-[var(--surface-primary)] hover:border-[#FF6B1A] hover:bg-[var(--surface-secondary)]"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B1A] mb-0.5">
                          {m.subreddit} · ${m.symbol}
                        </div>
                        <div className="text-sm font-bold text-[var(--text-primary)] truncate">{m.title}</div>
                        <div className="text-[11px] font-medium text-[var(--text-muted)] mt-0.5">
                          by {m.author} · <span className="font-mono">{(m.marketAddress || "").slice(0, 8)}…{(m.marketAddress || "").slice(-6)}</span>
                        </div>
                      </div>
                      {claimed ? (
                        <span className="shrink-0 rounded-full bg-[var(--surface-secondary)] border border-[var(--border-subtle)] px-3 py-1 text-[10px] font-extrabold text-[var(--text-muted)] uppercase">
                          Claimed
                        </span>
                      ) : (
                        <ArrowRight className="h-5 w-5 shrink-0 text-[#FF6B1A]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Manual address fallback */}
              <details className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)] p-4">
                <summary className="cursor-pointer text-sm font-bold text-[var(--text-secondary)]">
                  Or paste a contract address manually
                </summary>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <input
                    type="text"
                    value={marketAddress}
                    onChange={(e) => setMarketAddress(e.target.value)}
                    placeholder="0x..."
                    className="flex-1 h-12 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-primary)] px-4 text-[14px] font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#FF6B1A] focus:outline-none transition-colors"
                  />
                  <button
                    onClick={handleFetchMarket}
                    disabled={!marketAddress}
                    className="h-12 shrink-0 rounded-full bg-gradient-to-r from-[var(--ink-solid)] to-[var(--ink-solid-2)] px-6 text-[13px] font-extrabold text-white transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Verify Market
                  </button>
                </div>
              </details>

              {errorMsg && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  {errorMsg}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Reddit OAuth Login */}
          {step === 3 && selectedMarket && (
            <div className="text-center py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[var(--tint-orange)] border-4 border-white shadow-md mb-6 overflow-hidden p-4">
                <svg viewBox="0 0 24 24" fill="#FF4500" className="w-full h-full">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .88.169 1.188.452 1.229-.894 2.943-1.474 4.846-1.545l.891-4.173 3.013.626a1.25 1.25 0 0 1 1.29-1.106zm-7.618 9.07c-.822 0-1.488.666-1.488 1.488 0 .822.666 1.488 1.488 1.488.822 0 1.488-.666 1.488-1.488 0-.822-.666-1.488-1.488-1.488zm5.244 0c-.822 0-1.488.666-1.488 1.488 0 .822.666 1.488 1.488 1.488.822 0 1.488-.666 1.488-1.488 0-.822-.666-1.488-1.488-1.488zm-5.068 3.84c.83.6 2.03.882 3.454.882 1.424 0 2.624-.282 3.454-.882a.333.333 0 1 1 .389.54c-1.026.744-2.42 1.053-3.843 1.053-1.424 0-2.817-.309-3.843-1.053a.333.333 0 1 1 .389-.54z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-[var(--text-primary)] mb-3">Verify You Own the Reddit Account</h2>
              <p className="text-sm font-medium text-[var(--text-secondary)] max-w-md mx-auto mb-6 leading-relaxed">
                This market is from a post by <span className="font-bold text-[var(--text-primary)]">u/{selectedMarket.author.replace(/^u\//, "")}</span>. Prove you control that account by adding a code to its Reddit bio.
              </p>

              <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-secondary)] p-5 text-left mb-6">
                <ol className="text-sm text-[var(--text-secondary)] font-medium flex flex-col gap-3 list-decimal pl-5">
                  <li>
                    Log into Reddit as <span className="font-bold text-[var(--text-primary)]">u/{selectedMarket.author.replace(/^u\//, "")}</span> and open{" "}
                    <a href={`https://www.reddit.com/settings/profile`} target="_blank" rel="noopener noreferrer" className="text-[#FF6B1A] font-bold underline">profile settings</a>.
                  </li>
                  <li>
                    Add this code anywhere in your <span className="font-bold text-[var(--text-primary)]">bio / About</span> and save:
                    <div className="mt-2 flex items-center gap-2">
                      <code className="rounded-lg bg-[var(--surface-primary)] border border-[var(--border-subtle)] px-3 py-2 text-[15px] font-black text-[var(--text-primary)] tracking-wider select-all">{verifyCode}</code>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(verifyCode)}
                        className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-primary)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[#FF6B1A] hover:border-[#FF6B1A] transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </li>
                  <li>Come back and click <span className="font-bold text-[var(--text-primary)]">Verify</span> below. You can remove the code afterwards.</li>
                </ol>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 text-left mb-6">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <button
                onClick={handleRedditAuth}
                disabled={isVerifyingReddit}
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#FF4500] hover:bg-[#E03D00] text-white px-10 text-[15px] font-extrabold transition-all shadow-[0_4px_14px_rgba(255,69,0,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              >
                {isVerifyingReddit ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Checking your Reddit bio...
                  </>
                ) : (
                  <>Verify Reddit Ownership</>
                )}
              </button>
            </div>
          )}

          {/* Step 4: Confirm & Claim */}
          {step === 4 && selectedMarket && (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">Confirm & Claim</h2>
                <p className="text-sm font-medium text-[var(--text-secondary)]">Review your payout linkage details below.</p>
              </div>
              
              <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6 shadow-sm flex flex-col gap-5">
                <div className="flex items-center justify-between p-4 rounded-[16px] bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Reddit Creator</span>
                  <span className="text-[15px] font-black text-[var(--text-primary)]">u/{redditUsername}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-[16px] bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">BNB Payout Wallet</span>
                  <span className="text-sm font-bold text-[var(--text-primary)]">{walletAddress ? `${walletAddress.substring(0, 10)}...${walletAddress.substring(walletAddress.length - 8)}` : ""}</span>
                </div>
                
                <div className="flex items-center justify-between p-5 rounded-[16px] bg-gradient-to-br from-[var(--tint-success)] to-[var(--tint-success-strong)] border border-[#19C37D]/20 shadow-sm mt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#19C37D]">Estimated Claim Amount</span>
                  <span className="text-[20px] font-black text-[#19C37D]">
                    {(selectedMarket.marketCap * 0.05).toFixed(4)} BNB
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <button
                onClick={handleExecuteClaim}
                disabled={isSubmitting}
                className="w-full h-14 rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] text-[15px] font-extrabold text-white shadow-[0_4px_14px_rgba(255,107,26,0.3)] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Signing & Claiming rewards...
                  </>
                ) : (
                  "Sign Message & Claim Rewards"
                )}
              </button>
            </div>
          )}

          {/* Step 5: Success Payout */}
          {step === 5 && claimResult && (
            <div className="text-center py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-[var(--tint-success)] mb-6 shadow-[0_4px_20px_rgba(25,195,125,0.2)]">
                <CheckCircle2 className="h-12 w-12 text-[#19C37D]" />
              </div>
              <h2 className="text-[28px] font-black text-[var(--text-primary)] mb-3">Claim Submitted</h2>
              <p className="text-[15px] font-medium text-[var(--text-secondary)] max-w-md mx-auto mb-10 leading-relaxed">
                Your Reddit ownership was verified and your claim is recorded. A moderator will review it and release your accrued trading-fee rewards on-chain to your wallet.
              </p>

              <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6 text-left mb-10 shadow-sm flex flex-col gap-4 relative">
                <div className="absolute -left-3 -right-3 top-1/2 h-[2px] border-t-2 border-dashed border-[var(--border-subtle)]" />

                <div className="flex justify-between items-center z-10 bg-[var(--surface-primary)] pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Status</span>
                  <span className="text-[15px] font-black text-[#FF6B1A]">Pending review</span>
                </div>
                <div className="flex justify-between items-center z-10 bg-[var(--surface-primary)] pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Signature</span>
                  <span className="text-xs font-bold text-[var(--text-primary)] font-mono">{String(claimResult.proofReference).slice(0, 18)}…</span>
                </div>
              </div>

              <Link
                href="/portfolio"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] px-10 text-[15px] font-extrabold text-white shadow-[0_4px_14px_rgba(255,107,26,0.3)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Go to Portfolio
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
