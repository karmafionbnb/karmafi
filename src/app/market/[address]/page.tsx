"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Flame, MessageSquare, ExternalLink, ShieldCheck, RefreshCw, AlertTriangle, Coins, TrendingUp, Info } from "lucide-react";
import { useWallet } from "@/context/wallet";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useWriteContract, usePublicClient, useChainId } from "wagmi";
import { parseEther, formatEther } from "viem";
import { BONDING_CURVE_ABI, ATTENTION_TOKEN_ABI, getContracts, buyCost, sellRefund, pricePerToken, tokensForBudget } from "@/lib/web3/contracts";
import { toast } from "@/lib/toast";

interface MarketPageProps {
  params: Promise<{
    address: string;
  }>;
}

// Token prices are tiny fractions of BNB early on. Always show BNB, as a plain
// decimal (never scientific notation), with enough digits to be meaningful.
function formatPrice(bnb: number): string {
  if (!bnb || bnb <= 0) return "0 BNB";
  if (bnb >= 0.0001) return `${bnb.toFixed(6)} BNB`;
  return `${bnb.toLocaleString("en-US", { maximumFractionDigits: 12 })} BNB`;
}

function formatUsd(usd: number): string {
  if (!usd || usd <= 0) return "$0.00";
  if (usd >= 1) return `$${usd.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  if (usd >= 0.01) return `$${usd.toFixed(4)}`;
  return `$${usd.toLocaleString("en-US", { maximumFractionDigits: 8 })}`;
}

export default function MarketDetail({ params }: MarketPageProps) {
  const { address } = use(params);
  const { isConnected, connect, walletAddress, bnbBalance, updateBnbBalance, updateTokenBalance, tokenBalances } = useWallet();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const chainId = useChainId();

  const [loading, setLoading] = useState(true);
  const [market, setMarket] = useState<Record<string, unknown> | null>(null);
  const [trades, setTrades] = useState<Record<string, unknown>[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [candles, setCandles] = useState<Record<string, unknown>[]>([]);
  const [chartData, setChartData] = useState<Record<string, unknown>[]>([]);

  // Swap Form State
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [inputAmount, setInputAmount] = useState("0.1");
  const [estOut, setEstOut] = useState("0.00");
  const [slippage, setSlippage] = useState("1.0");
  const [isExecuting, setIsExecuting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Report Form State
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Live on-chain state
  const [onSupply, setOnSupply] = useState<bigint>(0n);
  const [onPrice, setOnPrice] = useState(0); // BNB per token (marginal)
  const [onUserBal, setOnUserBal] = useState(0); // user's token balance
  const [onReserve, setOnReserve] = useState(0); // BNB locked in the curve
  const [bnbUsd, setBnbUsd] = useState(0); // live BNB price in USD

  // Live BNB/USD rate (CoinGecko, with a Binance fallback).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd");
        const j = await r.json();
        const p = Number(j?.binancecoin?.usd);
        if (!cancelled && p > 0) { setBnbUsd(p); return; }
        throw new Error("no price");
      } catch {
        try {
          const r2 = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT");
          const j2 = await r2.json();
          const p2 = Number(j2?.price);
          if (!cancelled && p2 > 0) setBnbUsd(p2);
        } catch {
          /* leave at 0 -> falls back to BNB display */
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Price label: USD when we have a rate, otherwise BNB.
  const priceLabel = (bnb: number) => (bnbUsd > 0 ? formatUsd(bnb * bnbUsd) : formatPrice(bnb));

  const fetchDetails = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/market/${address}`);
      const data = await res.json();
      if (data.success) {
        setMarket(data.market);
        setTrades(data.trades);
        setCandles(data.candles);
      }
    } catch (e) {
      console.error("Failed to load market detail", e);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // Read live state straight from the bonding curve + token contracts.
  const loadChainState = React.useCallback(async () => {
    if (!market || !publicClient) return;
    const tokenAddr = market.tokenAddress as `0x${string}` | undefined;
    const marketAddr = market.marketAddress as `0x${string}` | undefined;
    if (!tokenAddr || !marketAddr || !tokenAddr.startsWith("0x")) return;
    try {
      const supply = (await publicClient.readContract({
        address: tokenAddr,
        abi: ATTENTION_TOKEN_ABI,
        functionName: "totalSupply",
      })) as bigint;
      setOnSupply(supply);
      setOnPrice(Number(formatEther(pricePerToken(supply))));

      const reserve = await publicClient.getBalance({ address: marketAddr });
      setOnReserve(Number(formatEther(reserve)));

      if (walletAddress) {
        const bal = (await publicClient.readContract({
          address: tokenAddr,
          abi: ATTENTION_TOKEN_ABI,
          functionName: "balanceOf",
          args: [walletAddress as `0x${string}`],
        })) as bigint;
        setOnUserBal(Number(formatEther(bal)));
      } else {
        setOnUserBal(0);
      }
    } catch (e) {
      console.error("Failed to read on-chain market state", e);
    }
  }, [market, publicClient, walletAddress]);

  useEffect(() => {
    loadChainState();
  }, [loadChainState]);

  // Build the price chart from real recorded trades (oldest -> newest). With no
  // trades yet, show a flat line at the current on-chain price.
  useEffect(() => {
    const mult = bnbUsd > 0 ? bnbUsd : 1; // chart in USD when rate is known
    const asc = [...trades].reverse();
    let series = asc.map((t) => ({
      time: new Date(t.createdAt as string).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      price: (parseFloat(t.price as string) || 0) * mult,
    }));
    if (series.length === 0) {
      const p = (onPrice || 0) * mult;
      series = [{ time: "", price: p }, { time: "now", price: p }];
    } else if (series.length === 1) {
      series = [{ time: "", price: series[0].price }, ...series];
    }
    setChartData(series);
  }, [trades, onPrice, bnbUsd]);

  // Recalculate output quotes
  useEffect(() => {
    if (!market) return;
    const amount = parseFloat(inputAmount || "0");
    if (isNaN(amount) || amount <= 0) {
      setEstOut("0.00");
      return;
    }

    try {
      if (tradeType === "BUY") {
        // Tokens this BNB budget buys, from the real curve.
        const tokens = tokensForBudget(onSupply, parseEther(inputAmount));
        setEstOut(Number(formatEther(tokens)).toFixed(2));
      } else {
        // BNB refunded for selling this many tokens, minus 1% fee.
        const refund = sellRefund(onSupply, parseEther(inputAmount));
        const net = refund - refund / 100n;
        setEstOut(Number(formatEther(net)).toFixed(6));
      }
    } catch {
      setEstOut("0.00");
    }
  }, [inputAmount, tradeType, onSupply]);

  const handleTradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!market || !isConnected) return;
    setErrorMessage("");
    setSuccessMessage("");

    const amount = parseFloat(inputAmount);
    if (!amount || amount <= 0) {
      setErrorMessage("Enter a valid amount.");
      return;
    }
    if (!getContracts(chainId)) {
      setErrorMessage(`KarmaFi isn't deployed on chain ${chainId}. Switch your wallet to the right BNB network.`);
      return;
    }

    setIsExecuting(true);
    try {
      if (!publicClient) throw new Error("No network client — reconnect your wallet.");
      const marketAddr = market.marketAddress as `0x${string}`;
      const tokenAddr = market.tokenAddress as `0x${string}`;
      const ONE = parseEther("1");

      // Current on-chain token supply drives the bonding-curve price.
      const supply = (await publicClient.readContract({
        address: tokenAddr,
        abi: ATTENTION_TOKEN_ABI,
        functionName: "totalSupply",
      })) as bigint;

      const slipBps = BigInt(Math.round((parseFloat(slippage || "1") || 1) * 100));
      let recordBnb: number;
      let recordTokens: number;
      let txHash: `0x${string}`;

      if (tradeType === "BUY") {
        // Input is a BNB budget. The bonding curve is non-linear, so we
        // replicate its cost formula locally and binary-search for the most
        // tokens whose cost+1%fee fits the budget, then send the full budget
        // (the contract mints the tokens and refunds any excess).
        const budgetWei = parseEther(inputAmount);
        const best = tokensForBudget(supply, budgetWei);
        if (best <= 0n) throw new Error("Amount too small to buy any tokens at the current price.");

        const cost = buyCost(supply, best);
        const total = cost + cost / 100n;
        txHash = await writeContractAsync({
          address: marketAddr,
          abi: BONDING_CURVE_ABI,
          functionName: "buy",
          args: [best, 0n],
          value: budgetWei,
        });
        recordTokens = Number(formatEther(best));
        recordBnb = Number(formatEther(total));
      } else {
        // Input is a token amount to sell.
        let tokenWei = parseEther(inputAmount);
        const bal = (await publicClient.readContract({
          address: tokenAddr,
          abi: ATTENTION_TOKEN_ABI,
          functionName: "balanceOf",
          args: [walletAddress as `0x${string}`],
        })) as bigint;
        if (bal <= 0n) {
          throw new Error(`You don't hold any ${market.symbol} to sell.`);
        }
        // Clamp to the real balance so MAX (and over-entry) can't exceed holdings.
        if (tokenWei > bal) tokenWei = bal;
        const refund = (await publicClient.readContract({
          address: marketAddr,
          abi: BONDING_CURVE_ABI,
          functionName: "getSellQuote",
          args: [supply, tokenWei],
        })) as bigint;
        const net = refund - refund / 100n;
        const minOut = (net * (10000n - slipBps)) / 10000n;

        txHash = await writeContractAsync({
          address: marketAddr,
          abi: BONDING_CURVE_ABI,
          functionName: "sell",
          args: [tokenWei, minOut],
        });
        recordTokens = Number(formatEther(tokenWei));
        recordBnb = Number(formatEther(net));
      }

      await publicClient.waitForTransactionReceipt({ hash: txHash });

      // Record the (real) trade so the trade list, chart and stats update.
      const price = recordTokens > 0 ? recordBnb / recordTokens : 0;
      await fetch(`/api/market/${market.marketAddress}/trade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          traderWallet: walletAddress,
          type: tradeType,
          bnbAmount: recordBnb,
          tokenAmount: recordTokens,
          price,
          txHash,
        }),
      }).catch(() => {});

      const okMsg =
        tradeType === "BUY"
          ? `Bought ~${recordTokens.toFixed(2)} ${market.symbol} for ${recordBnb.toFixed(4)} BNB!`
          : `Sold ${recordTokens.toFixed(2)} ${market.symbol} for ~${recordBnb.toFixed(4)} BNB!`;
      setSuccessMessage(okMsg);
      toast.success(okMsg);
      setInputAmount(tradeType === "BUY" ? "0.1" : "10.0");
      await fetchDetails();
      await loadChainState();
    } catch (e: unknown) {
      const err = e as { shortMessage?: string; message?: string };
      const raw = err?.shortMessage || err?.message || "Failed to execute transaction.";
      const msg = /user rejected|denied|user denied/i.test(raw) ? "Transaction rejected in your wallet." : raw;
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!market || !reportReason) return;

    try {
      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketId: market.id,
          reporterWallet: walletAddress || "0xAnonymousReporter",
          reason: reportReason,
          details: reportDetails
        })
      });

      if (res.ok) {
        setReportSubmitted(true);
        setTimeout(() => {
          setShowReport(false);
          setReportSubmitted(false);
          setReportReason("");
          setReportDetails("");
        }, 3000);
      }
    } catch (e) {
      console.error("Failed to submit report", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFFCF8]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-[#FF6B1A]">
          <RefreshCw className="animate-spin h-8 w-8" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!market) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFFCF8]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-[#FF6B1A] mb-4 opacity-80" />
          <h2 className="text-xl font-black text-[#161616] mb-2">Market Not Found</h2>
          <p className="text-sm font-medium text-[#5F5B57] mb-6">The contract address you provided does not match any registered attention market.</p>
          <Link href="/feed" className="rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] px-6 py-2.5 text-sm font-extrabold text-white shadow-sm hover:scale-[1.02] transition-transform">
            Return to Feed
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentTokenPrice = onPrice > 0 ? onPrice : (market.marketCap > 0 ? (market.marketCap / 1000) : 0.001);
  const userTokenBalance = onUserBal;
  const isCreatorClaimed = !!market?.creatorWallet;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF8]">
      <Navbar />

      {/* Main Container */}
      <main className="mx-auto max-w-[1320px] px-6 py-10 flex-1 w-full">
        
        {/* Risk Disclaimer Alert bar */}
        <div className="mb-6 rounded-[20px] border border-[#F2D8C8] bg-[#FFFAF5] p-4 text-[11px] text-[#5F5B57] flex gap-3 items-start leading-relaxed shadow-sm">
          <div className="mt-0.5 rounded-full bg-[#FFF4EA] p-1 text-[#FF6B1A]">
            <Info className="h-4 w-4 shrink-0" />
          </div>
          <div>
            <strong className="text-[#161616] font-extrabold block mb-0.5">KarmaFi Specification Disclaimer:</strong>
            This market is an unaffiliated attention market based on publicly available social momentum. It does not represent ownership, copyright, endorsement, sponsorship, partnership, or affiliation with Reddit or the original poster. Trading Karma Markets is highly speculative and risky. Prices may be volatile and can go to zero.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left / Main Panel */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Post Header Card */}
            <div className="rounded-[24px] border border-[#F2D8C8] bg-white p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden">
              <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B1A]/40 to-transparent opacity-50" />
              <div className="flex items-center justify-between gap-2 mb-5">
                <span className="rounded-full bg-[#FFFAF5] border border-[#F2D8C8] px-3.5 py-1.5 text-[11px] font-black text-[#161616]">
                  {market.subreddit}
                </span>
                <span className="text-[11px] font-medium text-[#8A817A]">
                  Originally posted by <strong className="text-[#161616]">{market.author}</strong>
                </span>
              </div>
              <h1 className="text-[24px] md:text-[28px] font-black text-[#161616] mb-5 leading-tight tracking-tight hover:text-[#FF6B1A] transition-colors">
                {market.title}
              </h1>
              <div className="flex items-center gap-3">
                <a
                  href={market.permalink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#F2D8C8] bg-[#FFFAF5] px-4 py-2 text-xs font-bold text-[#5F5B57] hover:border-[#FF6B1A] hover:text-[#FF6B1A] transition-colors shadow-sm"
                >
                  View Original Post
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Price Chart */}
            <div className="rounded-[24px] border border-[#F2D8C8] bg-white p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-8 border-b border-[#F2D8C8] pb-6">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#8A817A]">Price Chart</h3>
                  <div className="flex items-end gap-3 mt-1">
                    <p className="text-[28px] font-black text-[#161616] leading-none">{priceLabel(currentTokenPrice)}</p>
                    <span className="text-xs font-black text-[#161616] mb-1">${market.symbol}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="flex items-center gap-1.5 rounded-full bg-[#E5F9F1] px-3 py-1.5 text-xs font-extrabold text-[#19C37D]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    +12.4% (1h)
                  </span>
                </div>
              </div>
              <div className="h-[300px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6B1A" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#FF6B1A" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" stroke="#8A817A" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#8A817A" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} dx={-10} orientation="right" />
                      <Tooltip contentStyle={{ background: '#FFF', borderRadius: '16px', border: '1px solid #F2D8C8', fontSize: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} itemStyle={{ color: '#FF6B1A', fontWeight: 800 }} />
                      <Area type="monotone" dataKey="price" stroke="#FF6B1A" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center rounded-[16px] bg-[#FFFAF5] border border-dashed border-[#F2D8C8] text-xs font-medium text-[#8A817A]">
                    No historical price ticks recorded yet.
                  </div>
                )}
              </div>
            </div>

            {/* Historical Trades */}
            <div className="rounded-[24px] border border-[#F2D8C8] bg-white p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A817A] mb-6 border-b border-[#F2D8C8] pb-4">Historical Trades</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px] border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-[#F2D8C8] text-[#8A817A] font-bold">
                      <th className="pb-4 font-bold text-xs uppercase tracking-wider">Trader</th>
                      <th className="pb-4 font-bold text-xs uppercase tracking-wider">Action</th>
                      <th className="pb-4 text-right font-bold text-xs uppercase tracking-wider">BNB</th>
                      <th className="pb-4 text-right font-bold text-xs uppercase tracking-wider">Tokens</th>
                      <th className="pb-4 text-right font-bold text-xs uppercase tracking-wider">Price</th>
                      <th className="pb-4 text-right font-bold text-xs uppercase tracking-wider">Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((t, idx) => (
                      <tr key={idx} className="border-b border-[#F2D8C8]/40 hover:bg-[#FFFAF5] transition-colors group">
                        <td className="py-4 font-extrabold text-[#161616]">
                          {t.traderWallet.substring(0, 6)}...{t.traderWallet.substring(t.traderWallet.length - 4)}
                        </td>
                        <td className="py-4">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-black tracking-wider ${
                            t.type === "BUY" ? "bg-[#E5F9F1] text-[#19C37D]" : "bg-[#FFEBEB] text-[#FF453A]"
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="py-4 text-right font-black text-[#161616]">{parseFloat(t.bnbAmount).toFixed(3)}</td>
                        <td className="py-4 text-right font-bold text-[#5F5B57]">{parseFloat(t.tokenAmount).toFixed(2)}</td>
                        <td className="py-4 text-right font-medium text-[#8A817A]">{priceLabel(parseFloat(t.price))}</td>
                        <td className="py-4 text-right font-medium text-[#8A817A]">
                          <a href="#" className="hover:text-[#FF6B1A] transition-colors">{t.txHash.substring(0, 8)}...</a>
                        </td>
                      </tr>
                    ))}
                    {trades.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-sm font-medium text-[#8A817A]">No trades recorded. Be the first to trade!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right / Swap & Stats Panel */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Swap widget */}
            <div className="rounded-[24px] border border-[#F2D8C8] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex rounded-full bg-[#FFFAF5] p-1 border border-[#F2D8C8] mb-6">
                <button
                  onClick={() => { setTradeType("BUY"); setInputAmount("0.1"); }}
                  className={`flex-1 rounded-full py-2.5 text-xs font-black transition-all duration-200 ${
                    tradeType === "BUY" ? "bg-white text-[#FF6B1A] shadow-sm border border-[#F2D8C8]" : "text-[#8A817A] hover:text-[#161616] border border-transparent"
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => { setTradeType("SELL"); setInputAmount("10.0"); }}
                  className={`flex-1 rounded-full py-2.5 text-xs font-black transition-all duration-200 ${
                    tradeType === "SELL" ? "bg-white text-[#FF6B1A] shadow-sm border border-[#F2D8C8]" : "text-[#8A817A] hover:text-[#161616] border border-transparent"
                  }`}
                >
                  Sell
                </button>
              </div>

              <form onSubmit={handleTradeSubmit} className="flex flex-col gap-5">
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-[#8A817A] uppercase tracking-wider mb-2">
                    <label>{tradeType === "BUY" ? "Pay Amount" : "Sell Tokens"}</label>
                    {isConnected && (
                      <span className="text-[#5F5B57] flex items-center gap-2 normal-case">
                        Bal: {tradeType === "BUY" ? `${bnbBalance.toFixed(4)} BNB` : `${userTokenBalance.toFixed(2)} ${market.symbol}`}
                        <button
                          type="button"
                          onClick={() => {
                            if (tradeType === "BUY") {
                              const max = Math.max(bnbBalance - 0.001, 0); // leave a little for gas
                              setInputAmount(max > 0 ? String(max) : "0");
                            } else {
                              setInputAmount(userTokenBalance > 0 ? String(userTokenBalance) : "0");
                            }
                          }}
                          className="rounded-md bg-[#FFF1ED] border border-[#F2D8C8] px-2 py-0.5 text-[10px] font-extrabold text-[#FF6B1A] hover:bg-[#FF6B1A] hover:text-white transition-colors"
                        >
                          MAX
                        </button>
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                      className="w-full rounded-[16px] border border-[#F2D8C8] bg-[#FFFAF5] px-4 py-3.5 text-[15px] font-black text-[#161616] focus:border-[#FF6B1A] focus:outline-none focus:bg-white transition-colors"
                    />
                    <span className="absolute right-4 top-4 text-sm font-black text-[#161616]">
                      {tradeType === "BUY" ? "BNB" : market.symbol}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8A817A] uppercase tracking-wider mb-2">Est. Receive (Slippage included)</label>
                  <div className="rounded-[16px] border border-[#F2D8C8] bg-[#FFFAF5] px-4 py-3.5 text-[15px] font-black text-[#161616] flex justify-between items-center">
                    <span>{estOut}</span>
                    <span className="text-sm text-[#5F5B57]">{tradeType === "BUY" ? market.symbol : "BNB"}</span>
                  </div>
                </div>

                {/* Slippage Settings */}
                <div className="flex items-center justify-between text-[11px] mb-2 border-t border-[#F2D8C8] pt-4">
                  <span className="text-[#8A817A] font-bold uppercase tracking-wider">Max Slippage</span>
                  <div className="flex gap-1.5">
                    {["0.5", "1.0", "3.0"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSlippage(s)}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black border transition-colors ${
                          slippage === s
                            ? "border-[#FF6B1A] text-[#FF6B1A] bg-[#FFF4EA]"
                            : "border-[#F2D8C8] text-[#8A817A] hover:bg-[#FFFAF5]"
                        }`}
                      >
                        {s}%
                      </button>
                    ))}
                  </div>
                </div>

                {errorMessage && (
                  <div className="rounded-[12px] border border-[#FF453A]/20 bg-[#FFEBEB] p-3 text-[11px] font-bold text-[#FF453A]">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="rounded-[12px] border border-[#19C37D]/20 bg-[#E5F9F1] p-3 text-[11px] font-bold text-[#19C37D]">
                    {successMessage}
                  </div>
                )}

                {isConnected ? (
                  <button
                    type="submit"
                    disabled={isExecuting}
                    className="w-full rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E9500E] py-4 text-[14px] font-extrabold text-white shadow-[0_4px_14px_rgba(255,107,26,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 mt-2"
                  >
                    {isExecuting ? "Executing Trade..." : `Execute ${tradeType}`}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => connect()}
                    className="w-full rounded-full bg-[#161616] py-4 text-[14px] font-extrabold text-white shadow-sm hover:bg-[#2c2c2c] transition-all mt-2"
                  >
                    Connect Wallet to Trade
                  </button>
                )}
              </form>
            </div>

            {/* Creator Claim Box */}
            <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#FF6B1A] to-[#E9500E] p-6 text-white shadow-lg shadow-[#FF6B1A]/20">
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                <ShieldCheck className="h-24 w-24" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-black tracking-tight text-white">Original Reddit Creator?</h3>
                </div>
                <p className="text-[11px] font-medium text-white/90 leading-relaxed mb-5">
                  This attention market accumulates a reserved 30% of all trading fee volume. If you are the author (<strong>{market.author}</strong>), connect with Reddit to claim.
                </p>
                
                {isCreatorClaimed ? (
                  <div className="rounded-[16px] bg-white/10 backdrop-blur-sm border border-white/20 p-3 text-[11px] text-white font-extrabold flex items-center gap-2">
                    <CheckCircleMock />
                    Rewards claimed by {market.creatorWallet.substring(0, 6)}...
                  </div>
                ) : (
                  <Link
                    href="/creator-claim"
                    className="block w-full text-center rounded-full bg-white py-3 text-xs font-extrabold text-[#FF6B1A] hover:bg-[#FFF4EA] transition-colors shadow-sm"
                  >
                    Authenticate & Claim Rewards
                  </Link>
                )}
              </div>
            </div>

            {/* Token/Market Info */}
            <div className="rounded-[24px] border border-[#F2D8C8] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4 text-xs font-medium text-[#5F5B57]">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-2 border-b border-[#F2D8C8] pb-3">Market Metrics</h3>
              
              <div className="flex justify-between items-center py-1">
                <span>Token Name</span>
                <span className="text-[#161616] font-black">{market.name}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Symbol</span>
                <span className="text-[#161616] font-black">${market.symbol}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Liquidity (on-chain)</span>
                <span className="text-[#161616] font-black">{priceLabel(onReserve > 0 ? onReserve : (market.marketCap as number))}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>24h Trading Volume</span>
                <span className="text-[#161616] font-black">{priceLabel(market.volume24h as number)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Holders</span>
                <span className="text-[#161616] font-black">{market.holdersCount}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Curator Wallet</span>
                <span className="text-[#FF6B1A] font-extrabold">
                  {market.curatorWallet.substring(0, 6)}...{market.curatorWallet.substring(market.curatorWallet.length - 4)}
                </span>
              </div>
            </div>

            {/* Moderation section */}
            <div className="text-center mt-2">
              {!showReport ? (
                <button
                  onClick={() => setShowReport(true)}
                  className="text-[11px] font-bold text-[#8A817A] hover:text-[#FF453A] underline underline-offset-2 transition-colors"
                >
                  Report this Attention Market
                </button>
              ) : (
                <form onSubmit={handleReportSubmit} className="rounded-[20px] border border-[#F2D8C8] bg-white p-5 text-left flex flex-col gap-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                  <h4 className="text-xs font-black text-[#161616] border-b border-[#F2D8C8] pb-2">Report Content</h4>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Reason</label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full rounded-[12px] border border-[#F2D8C8] bg-[#FFFAF5] p-2.5 text-xs font-bold text-[#161616] focus:outline-none focus:border-[#FF6B1A]"
                      required
                    >
                      <option value="">Select a reason...</option>
                      <option value="scam">Scam / Fraudulent link</option>
                      <option value="nsfw">NSFW / Graphic Media</option>
                      <option value="abuse">Hate Speech / Abuse</option>
                      <option value="copyright">Copyright Infringement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8A817A] mb-1.5">Details</label>
                    <textarea
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      rows={2}
                      className="w-full rounded-[12px] border border-[#F2D8C8] bg-[#FFFAF5] p-2.5 text-xs font-medium text-[#161616] focus:outline-none focus:border-[#FF6B1A]"
                      placeholder="Provide additional details..."
                    />
                  </div>

                  {reportSubmitted && (
                    <div className="text-[11px] text-[#19C37D] font-bold rounded-[8px] bg-[#E5F9F1] p-2">Report submitted. Moderation pending.</div>
                  )}

                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setShowReport(false)}
                      className="flex-1 rounded-full border border-[#F2D8C8] bg-[#FFFAF5] py-2 text-[11px] font-extrabold text-[#5F5B57] hover:bg-[#F2D8C8] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-full bg-[#FFEBEB] text-[#FF453A] py-2 text-[11px] font-extrabold hover:bg-[#FF453A] hover:text-white transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function CheckCircleMock() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}
