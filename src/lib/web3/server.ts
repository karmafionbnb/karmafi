import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { bsc, bscTestnet } from "viem/chains";
import { CONTRACTS } from "./contracts";

// Server-side chain selection. Defaults to testnet (97) until mainnet is set
// via CHAIN_ID=56 (or NEXT_PUBLIC_CHAIN_ENV=mainnet).
export function getServerChainId(): number {
  if (process.env.CHAIN_ID) return Number(process.env.CHAIN_ID);
  return process.env.NEXT_PUBLIC_CHAIN_ENV === "mainnet" ? 56 : 97;
}

export function getServerWeb3() {
  const chainId = getServerChainId();
  const chain = chainId === 56 ? bsc : bscTestnet;
  const rpc =
    chainId === 56
      ? process.env.NEXT_PUBLIC_BNB_MAINNET_RPC_URL || "https://bsc-dataseed.binance.org"
      : process.env.NEXT_PUBLIC_BNB_TESTNET_RPC_URL ||
        "https://data-seed-prebsc-1-s1.binance.org:8545";

  const publicClient = createPublicClient({ chain, transport: http(rpc) });

  const pkRaw = process.env.PRIVATE_KEY;
  const account = pkRaw
    ? privateKeyToAccount((pkRaw.startsWith("0x") ? pkRaw : `0x${pkRaw}`) as `0x${string}`)
    : undefined;
  const walletClient = account
    ? createWalletClient({ account, chain, transport: http(rpc) })
    : undefined;

  const contracts = CONTRACTS[chainId];
  return { chainId, chain, publicClient, walletClient, account, contracts };
}
