import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "karmafi_db.json");

// Helper to calculate mock candles
export interface PriceCandle {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Trade {
  id: string;
  marketId: string;
  traderWallet: string;
  type: "BUY" | "SELL";
  bnbAmount: string;
  tokenAmount: string;
  price: string;
  txHash: string;
  createdAt: string;
}

export interface Market {
  id: string;
  sourceHash: string;
  tokenAddress: string;
  marketAddress: string;
  creatorWallet: string | null;
  curatorWallet: string;
  metadataUri: string;
  status: "ACTIVE" | "HIDDEN" | "FLAGGED";
  viralityScore: number;
  marketCap: number;
  volume24h: number;
  holdersCount: number;
  createdAt: string;
  name: string;
  symbol: string;
  redditPostId: string;
  subreddit: string;
  author: string;
  title: string;
  permalink: string;
  thumbnail: string | null;
  upvotes: number;
  comments: number;
}

export interface RedditPost {
  id: string;
  redditPostId: string;
  subreddit: string;
  author: string;
  title: string;
  permalink: string;
  thumbnail: string | null;
  createdUtc: number;
  upvotes: number;
  comments: number;
  sourceHash: string;
}

export interface CreatorClaim {
  id: string;
  sourceHash: string;
  redditUsername: string;
  walletAddress: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  proofReference: string;
  claimedAt: string | null;
  createdAt: string;
  amount: string;
}

export interface ModerationReport {
  id: string;
  marketId: string;
  reporterWallet: string;
  reason: string;
  details: string;
  status: "OPEN" | "RESOLVED" | "DISMISSED";
  adminNotes: string | null;
  createdAt: string;
}

export interface DatabaseState {
  users: Array<{
    id: string;
    walletAddress: string;
    username: string | null;
    avatar: string | null;
    reputationScore: number;
    role: "USER" | "ADMIN";
    createdAt: string;
  }>;
  redditPosts: RedditPost[];
  markets: Market[];
  trades: Trade[];
  candles: Record<string, PriceCandle[]>; // marketId -> candles
  claims: CreatorClaim[];
  reports: ModerationReport[];
  watchlist: Array<{ userId: string; marketId: string }>;
}

const initialPosts: RedditPost[] = [
  {
    id: "post-1",
    redditPostId: "1aw5n2v",
    subreddit: "r/technology",
    author: "u/silicon_future",
    title: "BNB Chain announces Greenfield mainnet expansion for decentralized metadata storage",
    permalink: "https://reddit.com/r/technology/comments/1aw5n2v/bnb_greenfield/",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&auto=format&fit=crop&q=60",
    createdUtc: Math.floor(Date.now() / 1000) - 86400,
    upvotes: 4210,
    comments: 245,
    sourceHash: "0x1a85b9b8b0e77d853b8b0e77d853b8b0e77d853b8b0e77d853b8b0e77d853b8b"
  },
  {
    id: "post-2",
    redditPostId: "1ax3k8p",
    subreddit: "r/gaming",
    author: "u/pixel_master",
    title: "This indie developer built an entire MMO inside a single Smart Contract",
    permalink: "https://reddit.com/r/gaming/comments/1ax3k8p/mmo_smart_contract/",
    thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=120&auto=format&fit=crop&q=60",
    createdUtc: Math.floor(Date.now() / 1000) - 43200,
    upvotes: 8940,
    comments: 612,
    sourceHash: "0x2b85b9b8b0e77d853b8b0e77d853b8b0e77d853b8b0e77d853b8b0e77d853b8b"
  },
  {
    id: "post-3",
    redditPostId: "1ay4r8q",
    subreddit: "r/wallstreetbets",
    author: "u/deep_fucking_karma",
    title: "Is social attention the new asset class? The math behind viral trading velocity",
    permalink: "https://reddit.com/r/wallstreetbets/comments/1ay4r8q/attention_trading/",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&auto=format&fit=crop&q=60",
    createdUtc: Math.floor(Date.now() / 1000) - 7200,
    upvotes: 12450,
    comments: 1104,
    sourceHash: "0x3b85b9b8b0e77d853b8b0e77d853b8b0e77d853b8b0e77d853b8b0e77d853b8b"
  }
];

const initialMarkets: Market[] = [
  {
    id: "market-1",
    sourceHash: "0x1a85b9b8b0e77d853b8b0e77d853b8b0e77d853b8b0e77d853b8b0e77d853b8b",
    tokenAddress: "0x9E973Cc4b7b25E123f1A2b3c4D5E6F7890123456",
    marketAddress: "0x1A2b3c4D5E6F7890123456789012345678901234",
    creatorWallet: null,
    curatorWallet: "0x89223A449b25E123f1A2b3c4D5E6F7890123456",
    metadataUri: "ipfs://QmMockGreenfield",
    status: "ACTIVE",
    viralityScore: 78,
    marketCap: 15.42, // In BNB
    volume24h: 3.25,
    holdersCount: 42,
    createdAt: new Date(Date.now() - 86400 * 1000).toISOString(),
    name: "Greenfield Expansion Token",
    symbol: "GREENFIELD",
    redditPostId: "1aw5n2v",
    subreddit: "r/technology",
    author: "u/silicon_future",
    title: "BNB Chain announces Greenfield mainnet expansion for decentralized metadata storage",
    permalink: "https://reddit.com/r/technology/comments/1aw5n2v/bnb_greenfield/",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&auto=format&fit=crop&q=60",
    upvotes: 4210,
    comments: 245
  },
  {
    id: "market-2",
    sourceHash: "0x2b85b9b8b0e77d853b8b0e77d853b8b0e77d853b8b0e77d853b8b0e77d853b8b",
    tokenAddress: "0xA1b2C3d4E5f67890123456789012345678901234",
    marketAddress: "0x2A3b4c5D6E7F8901234567890123456789012345",
    creatorWallet: "0x1111111111111111111111111111111111111111", // Pre-claimed creator wallet
    curatorWallet: "0x9E973Cc4b7b25E123f1A2b3c4D5E6F7890123456",
    metadataUri: "ipfs://QmMockGaming",
    status: "ACTIVE",
    viralityScore: 92,
    marketCap: 45.8,
    volume24h: 12.8,
    holdersCount: 118,
    createdAt: new Date(Date.now() - 43200 * 1000).toISOString(),
    name: "Indie MMO Token",
    symbol: "INDIE",
    redditPostId: "1ax3k8p",
    subreddit: "r/gaming",
    author: "u/pixel_master",
    title: "This indie developer built an entire MMO inside a single Smart Contract",
    permalink: "https://reddit.com/r/gaming/comments/1ax3k8p/mmo_smart_contract/",
    thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=120&auto=format&fit=crop&q=60",
    upvotes: 8940,
    comments: 612
  }
];

// Generate 20 mock price candles
const generateMockCandles = (basePrice: number): PriceCandle[] => {
  const candles: PriceCandle[] = [];
  let currentPrice = basePrice;
  const now = Date.now();
  for (let i = 20; i >= 0; i--) {
    const change = (Math.random() - 0.45) * currentPrice * 0.1;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * currentPrice * 0.05;
    const low = Math.min(open, close) - Math.random() * currentPrice * 0.05;
    const volume = Math.random() * 5 + 0.1;

    candles.push({
      timestamp: new Date(now - i * 3600 * 1000).toISOString(),
      open: parseFloat(open.toFixed(6)),
      high: parseFloat(high.toFixed(6)),
      low: parseFloat(low.toFixed(6)),
      close: parseFloat(close.toFixed(6)),
      volume: parseFloat(volume.toFixed(2))
    });
    currentPrice = close;
  }
  return candles;
};

const defaultCandles: Record<string, PriceCandle[]> = {
  "market-1": generateMockCandles(0.0015),
  "market-2": generateMockCandles(0.0032)
};

const initialTrades: Trade[] = [
  {
    id: "trade-1",
    marketId: "market-1",
    traderWallet: "0x5555555555555555555555555555555555555555",
    type: "BUY",
    bnbAmount: "1.5",
    tokenAmount: "1000",
    price: "0.0015",
    txHash: "0x1111111111111111111111111111111111111111111111111111111111111111",
    createdAt: new Date(Date.now() - 3600 * 4000).toISOString()
  },
  {
    id: "trade-2",
    marketId: "market-2",
    traderWallet: "0x6666666666666666666666666666666666666666",
    type: "BUY",
    bnbAmount: "3.2",
    tokenAmount: "1000",
    price: "0.0032",
    txHash: "0x2222222222222222222222222222222222222222222222222222222222222222",
    createdAt: new Date(Date.now() - 3600 * 2000).toISOString()
  }
];

const initialClaims: CreatorClaim[] = [
  {
    id: "claim-1",
    sourceHash: "0x2b85b9b8b0e77d853b8b0e77d853b8b0e77d853b8b0e77d853b8b0e77d853b8b",
    redditUsername: "u/pixel_master",
    walletAddress: "0x1111111111111111111111111111111111111111",
    status: "APPROVED",
    proofReference: "reddit_sig_verification_12345",
    claimedAt: new Date(Date.now() - 86400 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 86400 * 2000).toISOString(),
    amount: "1.25"
  }
];

export class Database {
  private static loadState(): DatabaseState {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Failed to load local DB state:", e);
    }
    
    // Seed initial state
    const state: DatabaseState = {
      users: [
        {
          id: "admin-1",
          walletAddress: "0x7777777777777777777777777777777777777777",
          username: "admin",
          avatar: null,
          reputationScore: 100,
          role: "ADMIN",
          createdAt: new Date().toISOString()
        }
      ],
      redditPosts: initialPosts,
      markets: initialMarkets,
      trades: initialTrades,
      candles: defaultCandles,
      claims: initialClaims,
      reports: [],
      watchlist: []
    };
    
    Database.saveState(state);
    return state;
  }

  private static saveState(state: DatabaseState) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to save local DB state:", e);
    }
  }

  public static getMarkets(): Market[] {
    const state = this.loadState();
    return state.markets.filter(m => m.status !== "HIDDEN");
  }

  public static getAllMarketsIncludingHidden(): Market[] {
    const state = this.loadState();
    return state.markets;
  }

  public static getMarketByAddress(address: string): Market | null {
    const state = this.loadState();
    return state.markets.find(m => m.marketAddress.toLowerCase() === address.toLowerCase() || m.tokenAddress.toLowerCase() === address.toLowerCase()) || null;
  }

  public static getMarketBySourceHash(hash: string): Market | null {
    const state = this.loadState();
    return state.markets.find(m => m.sourceHash === hash) || null;
  }

  public static createMarket(market: Market): void {
    const state = this.loadState();
    state.markets.push(market);
    // Initialize empty candles
    state.candles[market.id] = generateMockCandles(0.001);
    this.saveState(state);
  }

  public static updateMarket(address: string, updates: Partial<Market>): void {
    const state = this.loadState();
    const idx = state.markets.findIndex(m => m.marketAddress.toLowerCase() === address.toLowerCase() || m.tokenAddress.toLowerCase() === address.toLowerCase());
    if (idx !== -1) {
      state.markets[idx] = { ...state.markets[idx], ...updates };
      this.saveState(state);
    }
  }

  public static getTrades(marketId: string): Trade[] {
    const state = this.loadState();
    return state.trades.filter(t => t.marketId === marketId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public static addTrade(trade: Trade): void {
    const state = this.loadState();
    state.trades.push(trade);
    
    // Add candle tick or update latest candle close/high/low
    const marketCandles = state.candles[trade.marketId] || [];
    const newPrice = parseFloat(trade.price);
    if (marketCandles.length > 0) {
      const latest = marketCandles[marketCandles.length - 1];
      latest.close = newPrice;
      if (newPrice > latest.high) latest.high = newPrice;
      if (newPrice < latest.low) latest.low = newPrice;
      latest.volume += parseFloat(trade.bnbAmount);
    }
    
    this.saveState(state);
  }

  public static getCandles(marketId: string): PriceCandle[] {
    const state = this.loadState();
    return state.candles[marketId] || [];
  }

  public static getClaims(): CreatorClaim[] {
    const state = this.loadState();
    return state.claims;
  }

  public static createClaim(claim: CreatorClaim): void {
    const state = this.loadState();
    state.claims.push(claim);
    this.saveState(state);
  }

  public static updateClaimStatus(sourceHash: string, status: "PENDING" | "APPROVED" | "REJECTED", walletAddress: string): void {
    const state = this.loadState();
    const idx = state.claims.findIndex(c => c.sourceHash === sourceHash);
    if (idx !== -1) {
      state.claims[idx].status = status;
      state.claims[idx].walletAddress = walletAddress;
      if (status === "APPROVED") {
        state.claims[idx].claimedAt = new Date().toISOString();
        // Update creator wallet on market if exists
        const marketIdx = state.markets.findIndex(m => m.sourceHash === sourceHash);
        if (marketIdx !== -1) {
          state.markets[marketIdx].creatorWallet = walletAddress;
        }
      }
      this.saveState(state);
    }
  }

  public static getReports(): ModerationReport[] {
    const state = this.loadState();
    return state.reports;
  }

  public static createReport(report: ModerationReport): void {
    const state = this.loadState();
    state.reports.push(report);
    this.saveState(state);
  }

  public static resolveReport(id: string, action: "RESOLVE" | "DISMISS", notes: string): void {
    const state = this.loadState();
    const idx = state.reports.findIndex(r => r.id === id);
    if (idx !== -1) {
      state.reports[idx].status = action === "RESOLVE" ? "RESOLVED" : "DISMISSED";
      state.reports[idx].adminNotes = notes;
      this.saveState(state);
    }
  }

  public static getWatchlist(userId: string): string[] {
    const state = this.loadState();
    return state.watchlist.filter(w => w.userId === userId).map(w => w.marketId);
  }

  public static toggleWatchlist(userId: string, marketId: string): boolean {
    const state = this.loadState();
    const idx = state.watchlist.findIndex(w => w.userId === userId && w.marketId === marketId);
    let added = false;
    if (idx === -1) {
      state.watchlist.push({ userId, marketId });
      added = true;
    } else {
      state.watchlist.splice(idx, 1);
    }
    this.saveState(state);
    return added;
  }

  public static getUserByWallet(wallet: string): DatabaseState["users"][0] | null {
    const state = this.loadState();
    return state.users.find(u => u.walletAddress.toLowerCase() === wallet.toLowerCase()) || null;
  }

  public static createUser(wallet: string): DatabaseState["users"][0] {
    const state = this.loadState();
    const existing = state.users.find(u => u.walletAddress.toLowerCase() === wallet.toLowerCase());
    if (existing) return existing;
    
    const newUser = {
      id: "user-" + Math.random().toString(36).substr(2, 9),
      walletAddress: wallet,
      username: `curator_${wallet.substr(2, 6)}`,
      avatar: null,
      reputationScore: 50,
      role: "USER" as const,
      createdAt: new Date().toISOString()
    };
    state.users.push(newUser);
    this.saveState(state);
    return newUser;
  }
}
