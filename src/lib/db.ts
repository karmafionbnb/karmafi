import { prisma } from "./prisma";

// Shared shapes (mirror the Prisma models; dates serialize to ISO strings over
// the wire via NextResponse.json).
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

function adminWallets(): string[] {
  return (process.env.ADMIN_WALLETS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export class Database {
  // ---- Markets ----
  static async getMarkets() {
    return prisma.market.findMany({
      where: { status: { not: "HIDDEN" } },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getAllMarketsIncludingHidden() {
    return prisma.market.findMany({ orderBy: { createdAt: "desc" } });
  }

  static async getMarketByAddress(address: string) {
    return prisma.market.findFirst({
      where: {
        OR: [
          { marketAddress: { equals: address, mode: "insensitive" } },
          { tokenAddress: { equals: address, mode: "insensitive" } },
        ],
      },
    });
  }

  static async getMarketBySourceHash(hash: string) {
    return prisma.market.findUnique({ where: { sourceHash: hash } });
  }

  static async createMarket(market: Market) {
    const created = await prisma.market.create({
      data: {
        id: market.id,
        sourceHash: market.sourceHash,
        tokenAddress: market.tokenAddress,
        marketAddress: market.marketAddress,
        creatorWallet: market.creatorWallet,
        curatorWallet: market.curatorWallet,
        metadataUri: market.metadataUri,
        status: market.status,
        viralityScore: market.viralityScore,
        marketCap: market.marketCap,
        volume24h: market.volume24h,
        holdersCount: market.holdersCount,
        createdAt: market.createdAt ? new Date(market.createdAt) : undefined,
        name: market.name,
        symbol: market.symbol,
        redditPostId: market.redditPostId,
        subreddit: market.subreddit,
        author: market.author,
        title: market.title,
        permalink: market.permalink,
        thumbnail: market.thumbnail,
        upvotes: market.upvotes,
        comments: market.comments,
      },
    });

    // Seed an initial candle so the price chart renders before the first trade.
    const basePrice = 0.0001;
    await prisma.candle.create({
      data: {
        marketId: created.id,
        timestamp: new Date(),
        open: basePrice,
        high: basePrice,
        low: basePrice,
        close: basePrice,
        volume: 0,
      },
    });

    return created;
  }

  static async updateMarket(address: string, updates: Partial<Market>) {
    const market = await this.getMarketByAddress(address);
    if (!market) return;
    const data: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(updates)) {
      if (k === "id" || k === "createdAt") continue;
      data[k] = v;
    }
    await prisma.market.update({ where: { id: market.id }, data });
  }

  // ---- Trades & candles ----
  static async getTrades(marketId: string) {
    return prisma.trade.findMany({
      where: { marketId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getAllTrades() {
    return prisma.trade.findMany({ orderBy: { createdAt: "desc" } });
  }

  static async getTradesByWallet(wallet: string) {
    return prisma.trade.findMany({
      where: { traderWallet: { equals: wallet, mode: "insensitive" } },
      orderBy: { createdAt: "desc" },
    });
  }

  static async addTrade(trade: Trade) {
    await prisma.trade.create({
      data: {
        id: trade.id,
        marketId: trade.marketId,
        traderWallet: trade.traderWallet,
        type: trade.type,
        bnbAmount: trade.bnbAmount,
        tokenAmount: trade.tokenAmount,
        price: trade.price,
        txHash: trade.txHash,
        createdAt: trade.createdAt ? new Date(trade.createdAt) : undefined,
      },
    });

    const newPrice = parseFloat(trade.price);
    const volume = parseFloat(trade.bnbAmount) || 0;
    const latest = await prisma.candle.findFirst({
      where: { marketId: trade.marketId },
      orderBy: { timestamp: "desc" },
    });

    if (latest) {
      await prisma.candle.update({
        where: { id: latest.id },
        data: {
          close: newPrice,
          high: Math.max(latest.high, newPrice),
          low: Math.min(latest.low, newPrice),
          volume: latest.volume + volume,
        },
      });
    } else {
      await prisma.candle.create({
        data: {
          marketId: trade.marketId,
          timestamp: new Date(),
          open: newPrice,
          high: newPrice,
          low: newPrice,
          close: newPrice,
          volume,
        },
      });
    }
  }

  static async getCandles(marketId: string) {
    return prisma.candle.findMany({
      where: { marketId },
      orderBy: { timestamp: "asc" },
    });
  }

  // ---- Creator claims ----
  static async getClaims() {
    return prisma.creatorClaim.findMany({ orderBy: { createdAt: "desc" } });
  }

  static async createClaim(claim: CreatorClaim) {
    return prisma.creatorClaim.upsert({
      where: { sourceHash: claim.sourceHash },
      update: {
        redditUsername: claim.redditUsername,
        walletAddress: claim.walletAddress,
        status: claim.status,
        proofReference: claim.proofReference,
        claimedAt: claim.claimedAt ? new Date(claim.claimedAt) : null,
        amount: claim.amount,
      },
      create: {
        id: claim.id,
        sourceHash: claim.sourceHash,
        redditUsername: claim.redditUsername,
        walletAddress: claim.walletAddress,
        status: claim.status,
        proofReference: claim.proofReference,
        claimedAt: claim.claimedAt ? new Date(claim.claimedAt) : null,
        amount: claim.amount,
      },
    });
  }

  static async updateClaimStatus(
    sourceHash: string,
    status: "PENDING" | "APPROVED" | "REJECTED",
    walletAddress: string
  ) {
    const claim = await prisma.creatorClaim.findUnique({ where: { sourceHash } });
    if (!claim) return;
    await prisma.creatorClaim.update({
      where: { sourceHash },
      data: {
        status,
        walletAddress,
        claimedAt: status === "APPROVED" ? new Date() : claim.claimedAt,
      },
    });
    if (status === "APPROVED") {
      await prisma.market.updateMany({
        where: { sourceHash },
        data: { creatorWallet: walletAddress },
      });
    }
  }

  // ---- Moderation ----
  static async getReports() {
    return prisma.moderationReport.findMany({ orderBy: { createdAt: "desc" } });
  }

  static async createReport(report: ModerationReport) {
    return prisma.moderationReport.create({
      data: {
        id: report.id,
        marketId: report.marketId,
        reporterWallet: report.reporterWallet,
        reason: report.reason,
        details: report.details,
        status: report.status,
        adminNotes: report.adminNotes,
      },
    });
  }

  static async resolveReport(
    id: string,
    action: "RESOLVE" | "DISMISS",
    notes: string
  ) {
    await prisma.moderationReport.update({
      where: { id },
      data: {
        status: action === "RESOLVE" ? "RESOLVED" : "DISMISSED",
        adminNotes: notes,
      },
    });
  }

  // ---- Watchlist ----
  static async getWatchlist(userId: string) {
    const rows = await prisma.watchlist.findMany({ where: { userId } });
    return rows.map((w) => w.marketId);
  }

  static async toggleWatchlist(userId: string, marketId: string) {
    const existing = await prisma.watchlist.findUnique({
      where: { userId_marketId: { userId, marketId } },
    });
    if (existing) {
      await prisma.watchlist.delete({ where: { id: existing.id } });
      return false;
    }
    await prisma.watchlist.create({ data: { userId, marketId } });
    return true;
  }

  // ---- Users ----
  static async getUserByWallet(wallet: string) {
    return prisma.user.findUnique({ where: { walletAddress: wallet.toLowerCase() } });
  }

  static async createUser(wallet: string) {
    const walletAddress = wallet.toLowerCase();
    const role = adminWallets().includes(walletAddress) ? "ADMIN" : "USER";
    return prisma.user.upsert({
      where: { walletAddress },
      update: { role },
      create: {
        walletAddress,
        username: `curator_${walletAddress.substring(2, 8)}`,
        reputationScore: 50,
        role,
      },
    });
  }
}
