import crypto from "crypto";

export interface RedditMetadata {
  redditPostId: string;
  subreddit: string;
  author: string;
  title: string;
  permalink: string;
  thumbnail: string | null;
  createdUtc: number;
  upvotes: number;
  comments: number;
  nsfw: boolean;
  sourceHash: string;
}

export interface TokenSuggestions {
  name: string;
  symbol: string;
  description: string;
}

const REDDIT_REGEX = /https?:\/\/(?:www\.|old\.|new\.)?reddit\.com\/r\/([a-zA-Z0-9_]+)\/comments\/([a-zA-Z0-9]+)(?:\/([a-zA-Z0-9_]*))?/;

export function parseRedditUrl(url: string): { subreddit: string; postId: string } {
  const match = url.match(REDDIT_REGEX);
  if (!match) {
    throw new Error("Invalid Reddit post URL. Please paste a valid Reddit comment thread link.");
  }
  return {
    subreddit: match[1],
    postId: match[2]
  };
}

export function generateSourceHash(permalink: string): string {
  const cleanUrl = permalink.split("?")[0].replace(/\/$/, "");
  return "0x" + crypto.createHash("sha256").update(cleanUrl).digest("hex");
}

export function fetchRedditMetadataMock(url: string): RedditMetadata {
  const { subreddit, postId } = parseRedditUrl(url);

  // Generate deterministic but realistic values based on URL text
  const cleanUrl = url.split("?")[0].replace(/\/$/, "");
  const hash = generateSourceHash(cleanUrl);
  
  // Choose author and title details based on url keywords
  let title = "Fascinating breakthrough in distributed coordination technology";
  let author = "u/tech_explorer";
  let upvotes = 1200 + Math.floor(Math.random() * 5000);
  let comments = 120 + Math.floor(Math.random() * 600);
  let thumbnail = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&auto=format&fit=crop&q=60";
  const nsfw = false;

  if (url.includes("gaming") || url.includes("mmo") || url.includes("pixel")) {
    title = "Why traditional server architectures are holding back multiplayer gaming";
    author = "u/pixel_architect";
    upvotes = 3200;
    comments = 450;
    thumbnail = "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=120&auto=format&fit=crop&q=60";
  } else if (url.includes("wsb") || url.includes("wallstreet") || url.includes("stocks")) {
    title = "Is retail option trading volume setting a permanent new floor for market volatility?";
    author = "u/options_oracle";
    upvotes = 15200;
    comments = 1840;
    thumbnail = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&auto=format&fit=crop&q=60";
  } else if (url.includes("science") || url.includes("quantum") || url.includes("phys")) {
    title = "Researchers demonstrate room-temperature coherence in silicon quantum dots";
    author = "u/quantum_quantum";
    upvotes = 7800;
    comments = 512;
    thumbnail = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=120&auto=format&fit=crop&q=60";
  } else if (url.includes("blockchain") || url.includes("bnb") || url.includes("crypto")) {
    title = "BNB Chain core devs outline vision for gasless transactions in the next upgrades";
    author = "u/bnb_builder";
    upvotes = 4900;
    comments = 325;
    thumbnail = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&auto=format&fit=crop&q=60";
  }

  // Basic moderation validation (Simulated check)
  const moderationTriggerWords = ["nsfw", "hatespeech", "minor", "doxx", "scam", "illegal", "exploit"];
  for (const word of moderationTriggerWords) {
    if (url.toLowerCase().includes(word) || title.toLowerCase().includes(word)) {
      throw new Error(`Moderation block: This post violates platform safety guidelines (contains flags for ${word}).`);
    }
  }

  return {
    redditPostId: postId,
    subreddit: `r/${subreddit}`,
    author,
    title,
    permalink: cleanUrl,
    thumbnail,
    createdUtc: Math.floor(Date.now() / 1000) - 3600 * 5,
    upvotes,
    comments,
    nsfw,
    sourceHash: hash
  };
}

export function getAiTokenSuggestions(title: string, subreddit: string): TokenSuggestions {
  // Clean up title for token names
  const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, "");
  const words = cleanTitle.split(/\s+/).filter(w => w.length > 2);

  let name = "Attention Token";
  let symbol = "ATTN";
  
  if (words.length > 0) {
    // Generate clean suggestions based on subreddits
    if (subreddit.toLowerCase().includes("gaming")) {
      name = `${words[0]} Game Signal`;
      symbol = words[0].substring(0, 4).toUpperCase() + "G";
    } else if (subreddit.toLowerCase().includes("technology") || subreddit.toLowerCase().includes("tech")) {
      name = `${words[0]} Tech Momentum`;
      symbol = words[0].substring(0, 4).toUpperCase() + "T";
    } else if (subreddit.toLowerCase().includes("wallstreetbets") || subreddit.toLowerCase().includes("wsb")) {
      name = `${words[0]} WSB Alpha`;
      symbol = words[0].substring(0, 4).toUpperCase() + "W";
    } else {
      name = `${words[0]} Viral Karma`;
      symbol = words[0].substring(0, 4).toUpperCase() + "K";
    }
  }

  // Clean symbol to 3-8 characters
  symbol = symbol.replace(/[^A-Z]/g, "");
  if (symbol.length < 3) symbol = symbol + "KM";
  symbol = symbol.substring(0, 6);

  // Filter against sensitive keywords
  const blockedTokens = ["REDDIT", "SNOO", "ELON", "TRUMP", "TESLA", "APPLE", "GOOGLE", "BINANCE", "BNB"];
  if (blockedTokens.includes(symbol)) {
    symbol = "VIRAL";
  }

  return {
    name: `${name} Market`,
    symbol,
    description: `A decentralized attention market token tracking the social virality and organic attention of the thread "${title}" on ${subreddit}.`
  };
}
