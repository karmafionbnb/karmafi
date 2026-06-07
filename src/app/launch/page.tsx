"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Flame, ShieldAlert, CheckCircle, HelpCircle, Loader2, ArrowRight, Wallet, AlertTriangle, Link as LinkIcon, Info, Copy, MessageSquare } from "lucide-react";
import { useWallet } from "@/context/wallet";
import { fetchRedditPostClient } from "@/lib/reddit-client";
import { useWriteContract, usePublicClient, useChainId } from "wagmi";
import { parseEventLogs } from "viem";
import { getContracts, FACTORY_ABI } from "@/lib/web3/contracts";

function LaunchContent() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url") || "";

  const { isConnected, connect, walletAddress, addCuratedMarket } = useWallet();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const chainId = useChainId();

  // Wizard steps
  const [redditUrl, setRedditUrl] = useState(urlParam);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [redditPost, setRedditPost] = useState<any | null>(null);
  
  // Suggested tokens parameters (editable)
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDesc, setTokenDesc] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // Disclaimers and submit
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchedAddresses, setLaunchedAddresses] = useState<{ token: string; market: string } | null>(null);
  
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedMarket, setCopiedMarket] = useState(false);

  // Trigger auto-fetch if URL was passed in search params
  useEffect(() => {
    if (urlParam) {
      handleFetchMetadata(urlParam);
    }
  }, [urlParam]);

  async function handleFetchMetadata(urlStr: string) {
    if (!urlStr) return;
    setErrorMsg("");
    setLoadingMetadata(true);
    setRedditPost(null);

    try {
      // Reddit blocks server IPs, so fetch the post in the browser (JSONP),
      // then send the data to our API for hashing/moderation/suggestions.
      const post = await fetchRedditPostClient(urlStr);

      const res = await fetch("/api/reddit/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to parse Reddit post.");
      }

      setRedditPost(data.metadata);
      setTokenName(data.suggestions.name);
      setTokenSymbol(data.suggestions.symbol);
      setTokenDesc(data.suggestions.description);
    } catch (e: any) {
      setErrorMsg(e.message || "An error occurred parsing this link.");
    } finally {
      setLoadingMetadata(false);
    }
  }

  const handleLaunchMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setErrorMsg("Please connect your wallet first.");
      return;
    }
    if (!acceptedDisclaimer) {
      setErrorMsg("You must review and accept the speculative attention disclaimer.");
      return;
    }

    const contracts = getContracts(chainId);
    if (!contracts) {
      setErrorMsg(
        `KarmaFi isn't deployed on the network your wallet is connected to (chain ${chainId}). Switch to BNB ${chainId === 56 ? "Mainnet" : "Testnet"}.`
      );
      return;
    }

    setIsLaunching(true);
    setErrorMsg("");

    try {
      const metadataUri = "ipfs://QmMockMetadataHash";

      // 1. Create the market on-chain — the curator's wallet signs and pays gas.
      const txHash = await writeContractAsync({
        address: contracts.factory,
        abi: FACTORY_ABI,
        functionName: "createMarket",
        args: [
          redditPost.sourceHash as `0x${string}`,
          metadataUri,
          tokenName,
          tokenSymbol,
          walletAddress as `0x${string}`,
        ],
      });

      // 2. Wait for confirmation and read the real token/market addresses from
      //    the MarketCreated event.
      if (!publicClient) throw new Error("No network client available — reconnect your wallet.");
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      const events = parseEventLogs({
        abi: FACTORY_ABI,
        eventName: "MarketCreated",
        logs: receipt.logs,
      });
      const created = events[0] as unknown as
        | { args: { tokenAddress: string; marketAddress: string } }
        | undefined;
      if (!created) {
        throw new Error("Market was created on-chain, but the event couldn't be read. Check the transaction on BscScan.");
      }
      const onchainToken = created.args.tokenAddress;
      const onchainMarket = created.args.marketAddress;

      // 3. Record the market (with its real on-chain addresses) in the backend.
      const res = await fetch("/api/market/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          redditPostId: redditPost.redditPostId,
          subreddit: redditPost.subreddit,
          author: redditPost.author,
          title: redditPost.title,
          permalink: redditPost.permalink,
          thumbnail: redditPost.thumbnail,
          upvotes: redditPost.upvotes,
          comments: redditPost.comments,
          name: tokenName,
          symbol: tokenSymbol,
          curatorWallet: walletAddress,
          metadataUri,
          tokenAddress: onchainToken,
          marketAddress: onchainMarket,
          txHash,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Market created on-chain but failed to register.");
      }

      setLaunchedAddresses({ token: onchainToken, market: onchainMarket });

      // Add to curated markets list
      addCuratedMarket(redditPost.sourceHash);
    } catch (e: any) {
      const msg = e?.shortMessage || e?.message || "Failed to launch attention market.";
      setErrorMsg(
        /user rejected|denied/i.test(msg) ? "Transaction rejected in your wallet." : msg
      );
    } finally {
      setIsLaunching(false);
    }
  };

  const copyToClipboard = (text: string, type: 'token' | 'market') => {
    navigator.clipboard.writeText(text);
    if (type === 'token') {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    } else {
      setCopiedMarket(true);
      setTimeout(() => setCopiedMarket(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF8] relative overflow-hidden">
      {/* Background glowing orb */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#FF6B1A]/10 via-[#E9500E]/5 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <Navbar />

      <main className="mx-auto w-full max-w-3xl px-6 py-16 flex-1 relative z-10">
        
        {/* Header Area */}
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FFF4EA] to-[#F2D8C8] mb-6 shadow-sm">
            <Flame className="h-8 w-8 text-[#FF6B1A]" />
          </div>
          <h1 className="text-[40px] md:text-[48px] font-[900] text-[#161616] leading-tight tracking-tight mb-4">
            Launch a Karma Market
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#5F5B57] font-medium max-w-xl mx-auto">
            Spot organic social velocity and launch a custom BEP-20 bonding curve directly from a Reddit post.
          </p>
        </div>

        <div className="rounded-[32px] border border-[#F2D8C8] bg-white p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          {!isConnected ? (
            <div className="text-center py-10">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#FFF4EA] mb-6">
                <Wallet className="h-10 w-10 text-[#FF6B1A]" />
              </div>
              <h2 className="text-2xl font-black text-[#161616] mb-3">Wallet Connection Required</h2>
              <p className="text-sm font-medium text-[#5F5B57] max-w-sm mx-auto mb-8 leading-relaxed">
                Curating attention markets on BNB Chain requires signing and wallet verification. Connect to continue.
              </p>
              <button
                onClick={() => connect("Sandbox")}
                className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] px-8 text-[15px] font-extrabold text-white shadow-[0_4px_14px_rgba(255,107,26,0.3)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Connect Sandbox Wallet
              </button>
            </div>
          ) : launchedAddresses ? (
            // Success step
            <div className="text-center py-6">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-[#E5F9F1] mb-6 shadow-[0_4px_20px_rgba(25,195,125,0.2)]">
                <CheckCircle className="h-12 w-12 text-[#19C37D]" />
              </div>
              <h2 className="text-[28px] font-black text-[#161616] mb-3">Market Deployed!</h2>
              <p className="text-[15px] font-medium text-[#5F5B57] max-w-md mx-auto mb-10 leading-relaxed">
                Your market contracts have been successfully initialized on the BNB Smart Chain. You have been registered as the Curator!
              </p>

              <div className="rounded-[24px] border border-[#F2D8C8] bg-[#FFFAF5] p-6 text-left mb-10 flex flex-col gap-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8A817A]">Token Address (BEP-20)</span>
                    <button 
                      onClick={() => copyToClipboard(launchedAddresses.token, 'token')}
                      className="text-[#FF6B1A] flex items-center gap-1.5 text-xs font-bold hover:text-[#E9500E] transition-colors"
                    >
                      {copiedToken ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedToken ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="bg-white rounded-xl border border-[#F2D8C8] p-3 text-[13px] font-bold text-[#161616] break-all font-mono">
                    {launchedAddresses.token}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8A817A]">Bonding Curve Market Address</span>
                    <button 
                      onClick={() => copyToClipboard(launchedAddresses.market, 'market')}
                      className="text-[#FF6B1A] flex items-center gap-1.5 text-xs font-bold hover:text-[#E9500E] transition-colors"
                    >
                      {copiedMarket ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedMarket ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="bg-white rounded-xl border border-[#F2D8C8] p-3 text-[13px] font-bold text-[#161616] break-all font-mono">
                    {launchedAddresses.market}
                  </div>
                </div>
              </div>

              <Link
                href={`/market/${launchedAddresses.market}`}
                className="inline-flex w-full md:w-auto h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] px-10 text-[15px] font-extrabold text-white shadow-[0_4px_14px_rgba(255,107,26,0.3)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                View Trading Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            // Form Steps
            <div className="flex flex-col gap-8">
              {/* Paste Reddit URL */}
              {!redditPost && (
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#161616] mb-3">Reddit Post URL</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <LinkIcon className="absolute left-4 top-[18px] h-5 w-5 text-[#8A817A]" />
                        <input
                          type="text"
                          value={redditUrl}
                          onChange={(e) => setRedditUrl(e.target.value)}
                          placeholder="https://www.reddit.com/r/technology/comments/..."
                          className="w-full h-14 rounded-full border border-[#F2D8C8] bg-[#FFFAF5] pl-12 pr-4 text-[15px] font-medium text-[#161616] placeholder:text-[#8A817A] focus:border-[#FF6B1A] focus:bg-white focus:outline-none transition-colors shadow-sm"
                        />
                      </div>
                      <button
                        onClick={() => handleFetchMetadata(redditUrl)}
                        disabled={loadingMetadata || !redditUrl}
                        className="h-14 shrink-0 rounded-full bg-gradient-to-r from-[#161616] to-[#2a2a2a] px-8 text-[14px] font-extrabold text-white transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {loadingMetadata ? (
                          <>
                            <Loader2 className="animate-spin h-4 w-4" />
                            Fetching...
                          </>
                        ) : (
                          "Fetch Info"
                        )}
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  <div className="rounded-[24px] border border-[#F2D8C8] bg-[#FFFAF5] p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Info className="h-5 w-5 text-[#FF6B1A]" />
                      <h3 className="font-black text-[#161616]">Guidelines</h3>
                    </div>
                    <ul className="list-disc pl-5 flex flex-col gap-2 text-[14px] font-medium text-[#5F5B57]">
                      <li>Must be a public post (not deleted, archived, or locked).</li>
                      <li>Post content will be moderated for hate speech and doxxing.</li>
                      <li>Duplicate launches for the same post are blocked by the smart contract factory.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Configure and Preview */}
              {redditPost && (
                <form onSubmit={handleLaunchMarket} className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  {/* Post Preview box */}
                  <div className="rounded-[24px] border border-[#F2D8C8] bg-white p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6B1A]" />
                    <div className="flex items-center gap-2 mb-3">
                      <span className="rounded-full bg-[#FFF4EA] px-2.5 py-1 text-[11px] font-black text-[#FF6B1A] uppercase tracking-wider">
                        {redditPost.subreddit}
                      </span>
                      <span className="text-xs font-bold text-[#8A817A]">
                        Posted by {redditPost.author}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-[#161616] leading-snug mb-3">
                      {redditPost.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-extrabold text-[#5F5B57]">
                      <span className="flex items-center gap-1.5">
                        <Flame className="h-4 w-4 text-[#FF6B1A]" /> {redditPost.upvotes} Upvotes
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4 text-[#8A817A]" /> {redditPost.comments} Comments
                      </span>
                    </div>
                  </div>

                  {/* Token Customizations */}
                  <div className="flex flex-col gap-5">
                    <h3 className="text-lg font-black text-[#161616]">Market Configuration</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-[#161616] mb-2">Token Name</label>
                        <input
                          type="text"
                          value={tokenName}
                          onChange={(e) => setTokenName(e.target.value)}
                          className="w-full h-12 rounded-xl border border-[#F2D8C8] bg-[#FFFAF5] px-4 text-sm font-bold text-[#161616] focus:border-[#FF6B1A] focus:bg-white focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#161616] mb-2">Token Ticker / Symbol</label>
                        <div className="relative">
                          <span className="absolute left-4 top-[14px] text-sm font-black text-[#8A817A]">$</span>
                          <input
                            type="text"
                            value={tokenSymbol}
                            onChange={(e) => setTokenSymbol(e.target.value)}
                            className="w-full h-12 rounded-xl border border-[#F2D8C8] bg-[#FFFAF5] pl-8 pr-4 text-sm font-bold text-[#161616] uppercase focus:border-[#FF6B1A] focus:bg-white focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#161616] mb-2">Suggested Description</label>
                      <textarea
                        value={tokenDesc}
                        onChange={(e) => setTokenDesc(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-[#F2D8C8] bg-[#FFFAF5] p-4 text-sm font-medium text-[#161616] focus:border-[#FF6B1A] focus:bg-white focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Disclosures & Terms check */}
                  <div className="rounded-[20px] border border-[#F2D8C8] bg-[#FFF4EA] p-5 flex gap-4 text-left items-start">
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        id="disclaimer-check"
                        checked={acceptedDisclaimer}
                        onChange={(e) => setAcceptedDisclaimer(e.target.checked)}
                        className="h-5 w-5 rounded border-[#F2D8C8] text-[#FF6B1A] focus:ring-[#FF6B1A]/20 cursor-pointer"
                      />
                    </div>
                    <label htmlFor="disclaimer-check" className="cursor-pointer">
                      <span className="text-sm font-black text-[#FF6B1A] block mb-1 flex items-center gap-1.5">
                        <ShieldAlert className="h-4 w-4" /> Speculative Risk Agreement
                      </span>
                      <span className="text-[13px] font-medium text-[#5F5B57] leading-relaxed block">
                        I acknowledge that this market is launched purely for public speculative purposes around attention momentum. It does not represent copyright, license, endorsement, or partnership with Reddit, Inc. or the author. I accept all smart contract fees and risks.
                      </span>
                    </label>
                  </div>

                  {errorMsg && (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#F2D8C8]">
                    <button
                      type="button"
                      onClick={() => setRedditPost(null)}
                      className="h-14 sm:w-32 rounded-full border border-[#F2D8C8] bg-white text-[15px] font-extrabold text-[#5F5B57] hover:border-[#FF6B1A] hover:text-[#FF6B1A] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLaunching || !acceptedDisclaimer}
                      className="flex-1 h-14 rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] text-[15px] font-extrabold text-white shadow-[0_4px_14px_rgba(255,107,26,0.3)] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isLaunching ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" />
                          Deploying on BNB Chain...
                        </>
                      ) : (
                        "Confirm & Deploy Market"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Launch() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FFFCF8] text-[#FF6B1A]">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    }>
      <LaunchContent />
    </Suspense>
  );
}
