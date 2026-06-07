"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useBalance, useSignMessage, useChainId } from "wagmi";
import { formatEther } from "viem";

export interface WalletContextType {
  walletAddress: string | null;
  isConnected: boolean;
  bnbBalance: number;
  reputation: number;
  tokenBalances: Record<string, number>; // tokenAddress -> balance (number of tokens)
  watchlist: string[]; // marketAddresses
  curatedMarkets: string[]; // sourceHashes they curated
  isSandboxMode: boolean;
  connect: (type?: string) => Promise<string>;
  disconnect: () => void;
  toggleWatchlist: (marketAddress: string) => Promise<boolean>;
  addCuratedMarket: (sourceHash: string) => void;
  updateBnbBalance: (amount: number) => void;
  updateTokenBalance: (tokenAddress: string, amount: number) => void;
  signMessage: (message: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected: wagmiIsConnected } = useAccount();
  const { connect: wagmiConnect, connectors } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { data: balanceData } = useBalance({ address });
  const { signMessageAsync } = useSignMessage();

  const [reputation, setReputation] = useState(50);
  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({});
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [curatedMarkets, setCuratedMarkets] = useState<string[]>([]);
  const chainId = useChainId();
  const isSandboxMode = chainId !== 56; // testnet/unknown = sandbox; mainnet = live

  const walletAddress = address ? address.toString() : null;
  const isConnected = wagmiIsConnected;
  // wagmi v3's useBalance returns { value: bigint, decimals } — no `.formatted`.
  const bnbBalance = balanceData?.value != null ? Number(formatEther(balanceData.value)) : 0;

  // Sync watchlist and balances from localStorage on mount
  useEffect(() => {
    const savedBalances = localStorage.getItem("karma_token_balances");
    const savedWatchlist = localStorage.getItem("karma_watchlist");
    const savedCurated = localStorage.getItem("karma_curated");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedBalances) setTokenBalances(JSON.parse(savedBalances));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedCurated) setCuratedMarkets(JSON.parse(savedCurated));
  }, []);

  const connect = async (_type: string = "Sandbox") => {
    try {
      const injectedConnector = connectors.find(c => c.type === 'injected');
      if (injectedConnector) {
        await wagmiConnect({ connector: injectedConnector });
        return injectedConnector.id;
      }
    } catch (e) {
      console.warn("Wallet connection failed", e);
    }
    return "";
  };

  const disconnect = () => {
    wagmiDisconnect();
  };

  const toggleWatchlist = async (marketAddress: string) => {
    if (!isConnected) return false;
    
    const index = watchlist.indexOf(marketAddress);
    const newWatchlist = [...watchlist];
    let isAdded = false;

    if (index === -1) {
      newWatchlist.push(marketAddress);
      isAdded = true;
    } else {
      newWatchlist.splice(index, 1);
    }

    setWatchlist(newWatchlist);
    localStorage.setItem("karma_watchlist", JSON.stringify(newWatchlist));

    return isAdded;
  };

  const addCuratedMarket = (sourceHash: string) => {
    const newCurated = [...curatedMarkets, sourceHash];
    setCuratedMarkets(newCurated);
    setReputation(prev => Math.min(prev + 10, 100)); // Increase reputation for curating
    localStorage.setItem("karma_curated", JSON.stringify(newCurated));
  };

  const updateBnbBalance = (_amount: number) => {
    // In a real dApp, you cannot manually update native balance, it's read-only.
    // Kept for backward compatibility with older components.
  };

  const updateTokenBalance = (tokenAddress: string, amount: number) => {
    const current = tokenBalances[tokenAddress] || 0;
    const nextBalances = {
      ...tokenBalances,
      [tokenAddress]: Math.max(current + amount, 0)
    };
    setTokenBalances(nextBalances);
    localStorage.setItem("karma_token_balances", JSON.stringify(nextBalances));
  };

  const signMessage = async (message: string) => {
    if (!isConnected) throw new Error("Wallet not connected");
    return await signMessageAsync({ message });
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnected,
        bnbBalance,
        reputation,
        tokenBalances,
        watchlist,
        curatedMarkets,
        isSandboxMode,
        connect,
        disconnect,
        toggleWatchlist,
        addCuratedMarket,
        updateBnbBalance,
        updateTokenBalance,
        signMessage
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
