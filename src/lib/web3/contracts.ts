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
  // BNB Smart Chain Mainnet (live deployment — audited/remediated contracts)
  56: {
    factory: "0xb017eCCD18d374b5ee9461EF22052D298bAf1604",
    feeDistributor: "0xed8a1eEbC494e187b0Ade9D927724DfD18E52Dd0",
    creatorClaimVault: "0xbaB57d8ae5a01dB709c005Fc246082d53849874A",
  },
};

// BscScan explorer links (mainnet by default; testnet for chain 97).
export function explorerBase(chainId?: number): string {
  return chainId === 97 ? "https://testnet.bscscan.com" : "https://bscscan.com";
}
export function explorerTx(chainId: number | undefined, hash: string): string {
  return `${explorerBase(chainId)}/tx/${hash}`;
}
export function explorerAddress(chainId: number | undefined, addr: string): string {
  return `${explorerBase(chainId)}/address/${addr}`;
}

// PancakeSwap swap link for a graduated token.
export function pancakeSwapUrl(token: string): string {
  return `https://pancakeswap.finance/swap?outputCurrency=${token}&chain=bsc`;
}

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
    type: "function",
    name: "graduated",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "graduationReserve",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
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

export const CREATOR_VAULT_ABI = [
  {
    type: "function",
    name: "pendingRewards",
    stateMutability: "view",
    inputs: [{ name: "", type: "bytes32" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "claimCreatorRewards",
    stateMutability: "nonpayable",
    inputs: [
      { name: "sourceHash", type: "bytes32" },
      { name: "recipient", type: "address" },
      { name: "redditUsername", type: "string" },
    ],
    outputs: [],
  },
] as const;

export const FEE_BASIS_POINTS = 100n; // 1%

// Bonding-curve math, mirrored exactly from BondingCurveMarket.sol so the UI
// can quote/estimate locally without an RPC round-trip per keystroke.
const CURVE_INITIAL = 1_000_000_000n; // 1 gwei
const CURVE_MULT = 1_000_000_000n; // 1 gwei per token
const CURVE_SCALE = 1_000_000_000_000_000_000n; // 1e18

export function buyCost(supply: bigint, tokenAmount: bigint): bigint {
  const avg = CURVE_INITIAL + (CURVE_MULT * (supply + tokenAmount / 2n)) / CURVE_SCALE;
  return (tokenAmount * avg) / CURVE_SCALE;
}

export function sellRefund(supply: bigint, tokenAmount: bigint): bigint {
  if (tokenAmount > supply) return 0n;
  const avg = CURVE_INITIAL + (CURVE_MULT * (supply - tokenAmount / 2n)) / CURVE_SCALE;
  return (tokenAmount * avg) / CURVE_SCALE;
}

// Marginal price of one token at the given supply (in wei of BNB).
export function pricePerToken(supply: bigint): bigint {
  return buyCost(supply, CURVE_SCALE);
}

// Approx supply (wei) implied by a given BNB reserve (curve cost from 0).
export function supplyForReserve(reserveWei: bigint): bigint {
  if (reserveWei <= 0n) return 0n;
  let lo = 0n;
  let hi = (reserveWei * CURVE_SCALE) / CURVE_INITIAL + CURVE_SCALE;
  let best = 0n;
  for (let i = 0; i < 160 && lo <= hi; i++) {
    const mid = (lo + hi + 1n) / 2n;
    if (buyCost(0n, mid) <= reserveWei) {
      best = mid;
      lo = mid + 1n;
    } else {
      hi = mid - 1n;
    }
  }
  return best;
}

// Max tokens (wei) whose cost + 1% fee fits within budgetWei. Binary search.
export function tokensForBudget(supply: bigint, budgetWei: bigint): bigint {
  if (budgetWei <= 0n) return 0n;
  let lo = 0n;
  let hi = (budgetWei * CURVE_SCALE) / CURVE_INITIAL + CURVE_SCALE;
  let best = 0n;
  for (let i = 0; i < 140 && lo <= hi; i++) {
    const mid = (lo + hi + 1n) / 2n;
    const cost = buyCost(supply, mid);
    if (cost + cost / 100n <= budgetWei) {
      best = mid;
      lo = mid + 1n;
    } else {
      hi = mid - 1n;
    }
  }
  return best;
}
