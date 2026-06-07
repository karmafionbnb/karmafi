// Deployed KarmaFi contract addresses per chain + the ABIs the frontend needs.
// Testnet (97) addresses are the live Remix deployment. Mainnet (56) is filled
// in via env once deployed.

export type Address = `0x${string}`;

interface ChainContracts {
  factory: Address;
  feeDistributor: Address;
  creatorClaimVault: Address;
}

const ZERO = "0x0000000000000000000000000000000000000000" as Address;

export const CONTRACTS: Record<number, ChainContracts> = {
  // BNB Smart Chain Testnet
  97: {
    factory: "0x8D018F5Ecd8dBb35f963350A86Da0d1EeCAdcAB7",
    feeDistributor: "0xc73565a7e42d8590a90e377A2233615Db14555Fa",
    creatorClaimVault: "0x2A02ad60B749f2979a22Ef992cDd0783866FCF73",
  },
  // BNB Smart Chain Mainnet (set after mainnet deploy)
  56: {
    factory: (process.env.NEXT_PUBLIC_FACTORY_ADDRESS_BSC as Address) || ZERO,
    feeDistributor: (process.env.NEXT_PUBLIC_FEE_DISTRIBUTOR_BSC as Address) || ZERO,
    creatorClaimVault: (process.env.NEXT_PUBLIC_CREATOR_VAULT_BSC as Address) || ZERO,
  },
};

export function getContracts(chainId?: number): ChainContracts | null {
  if (!chainId) return null;
  const c = CONTRACTS[chainId];
  if (!c || c.factory === ZERO) return null;
  return c;
}

export const FACTORY_ABI = [
  {
    type: "function",
    name: "createMarket",
    stateMutability: "nonpayable",
    inputs: [
      { name: "sourceHash", type: "bytes32" },
      { name: "metadataURI", type: "string" },
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "curator", type: "address" },
    ],
    outputs: [
      { name: "tokenAddress", type: "address" },
      { name: "marketAddress", type: "address" },
    ],
  },
  {
    type: "function",
    name: "getMarketByHash",
    stateMutability: "view",
    inputs: [{ name: "", type: "bytes32" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "event",
    name: "MarketCreated",
    inputs: [
      { name: "sourceHash", type: "bytes32", indexed: true },
      { name: "tokenAddress", type: "address", indexed: true },
      { name: "marketAddress", type: "address", indexed: true },
      { name: "curator", type: "address", indexed: false },
      { name: "name", type: "string", indexed: false },
      { name: "symbol", type: "string", indexed: false },
    ],
  },
] as const;

export const BONDING_CURVE_ABI = [
  {
    type: "function",
    name: "buy",
    stateMutability: "payable",
    inputs: [
      { name: "tokenAmount", type: "uint256" },
      { name: "minTokensOut", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "sell",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokenAmount", type: "uint256" },
      { name: "minBNBOut", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getBuyQuote",
    stateMutability: "view",
    inputs: [
      { name: "currentSupply", type: "uint256" },
      { name: "tokenAmount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getSellQuote",
    stateMutability: "view",
    inputs: [
      { name: "currentSupply", type: "uint256" },
      { name: "tokenAmount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "tokenAddress",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "event",
    name: "TokenTraded",
    inputs: [
      { name: "trader", type: "address", indexed: true },
      { name: "isBuy", type: "bool", indexed: true },
      { name: "bnbAmount", type: "uint256", indexed: false },
      { name: "tokenAmount", type: "uint256", indexed: false },
      { name: "currentPrice", type: "uint256", indexed: false },
      { name: "currentSupply", type: "uint256", indexed: false },
    ],
  },
] as const;

export const ATTENTION_TOKEN_ABI = [
  {
    type: "function",
    name: "totalSupply",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

export const FEE_BASIS_POINTS = 100n; // 1%
