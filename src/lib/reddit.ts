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

const REDDIT_REGEX =
  /https?:\/\/(?:www\.|old\.|new\.|np\.)?reddit\.com\/r\/([a-zA-Z0-9_]+)\/comments\/([a-zA-Z0-9]+)(?:\/([a-zA-Z0-9_]*))?/;

const USER_AGENT =
  process.env.REDDIT_USER_AGENT || "web:karmafi:v1.0 (attention markets)";

const MODERATION_TRIGGER_WORDS = [
  "hatespeech",
  "minor",
  "doxx",
  "csam",
  "gore",
];

export function parseRedditUrl(url: string): { subreddit: string; postId: string } {
  const match = url.match(REDDIT_REGEX);
  if (!match) {
    throw new Error(
      "Invalid Reddit post URL. Please paste a valid Reddit comment thread link."
    );
  }
  return { subreddit: match[1], postId: match[2] };
}

export function generateSourceHash(permalink: string): string {
  // Normalize to a canonical reddit.com permalink so the same post always
  // hashes identically regardless of the domain/query the user pasted.
  let path = permalink;
  try {
    if (/^https?:\/\//.test(permalink)) {
      path = new URL(permalink).pathname;
    }
  } catch {
    /* fall back to raw string */
  }
  const clean = ("https://www.reddit.com" + path.split("?")[0]).replace(/\/$/, "");
  return "0x" + crypto.createHash("sha256").update(clean).digest("hex");
}

// ---- Reddit OAuth (application-only) token caching ----
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAppToken(): Promise<string | null> {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token;
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": USER_AGENT,
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Reddit auth failed (${res.status}). Check REDDIT_CLIENT_ID/SECRET.`);
  }
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return cachedToken.token;
}

interface RedditPostData {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  ups?: number;
  score?: number;
  num_comments?: number;
  thumbnail?: string;
  created_utc?: number;
  over_18?: boolean;
  permalink?: string;
  removed_by_category?: string | null;
}

async function fetchPostListing(
  subreddit: string,
  postId: string
): Promise<RedditPostData> {
  const token = await getAppToken();
  const path = `/r/${subreddit}/comments/${postId}.json?raw_json=1&limit=1`;

  // Order of preference:
  //   1. REDDIT_PROXY_URL (e.g. a Cloudflare Worker on a non-blocked IP)
  //   2. authenticated OAuth (if app credentials are configured)
  //   3. public Reddit hosts (work from residential IPs, blocked on most clouds)
  const attempts: Array<{ url: string; auth: boolean }> = [];
  const proxy = process.env.REDDIT_PROXY_URL?.replace(/\/$/, "");
  if (proxy) attempts.push({ url: `${proxy}${path}`, auth: false });
  if (token) attempts.push({ url: `https://oauth.reddit.com${path}`, auth: true });
  attempts.push({ url: `https://www.reddit.com${path}`, auth: false });
  attempts.push({ url: `https://old.reddit.com${path}`, auth: false });
  attempts.push({ url: `https://api.reddit.com/comments/${postId}.json?raw_json=1&limit=1`, auth: false });

  let lastStatus = 0;
  let blocked = false;
  for (const attempt of attempts) {
    let res: Response;
    try {
      res = await fetch(attempt.url, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json",
          ...(attempt.auth && token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });
    } catch {
      continue; // network error on this host, try next
    }

    lastStatus = res.status;
    if (res.status === 403 || res.status === 429) {
      blocked = true;
      continue; // host blocked us; try the next one
    }
    if (res.status === 404) {
      throw new Error("Reddit post not found. It may have been removed or made private.");
    }
    if (!res.ok) continue;

    let data: Array<{ data?: { children?: Array<{ data?: RedditPostData }> } }>;
    try {
      data = await res.json();
    } catch {
      continue; // non-JSON (e.g. an HTML block page); try next
    }
    const post = data?.[0]?.data?.children?.[0]?.data;
    if (post && post.title) return post;
  }

  if (blocked) {
    throw new Error(
      "Reddit is rate-limiting requests from the server. Add REDDIT_CLIENT_ID/REDDIT_CLIENT_SECRET in your environment for reliable authenticated access."
    );
  }
  throw new Error(`Failed to fetch Reddit post (last status ${lastStatus || "network error"}).`);
}

export async function fetchRedditMetadata(url: string): Promise<RedditMetadata> {
  const { subreddit, postId } = parseRedditUrl(url);
  const post = await fetchPostListing(subreddit, postId);

  const permalink = post.permalink
    ? `https://www.reddit.com${post.permalink}`.replace(/\/$/, "")
    : url.split("?")[0].replace(/\/$/, "");
  const sourceHash = generateSourceHash(permalink);
  const nsfw = Boolean(post.over_18);

  // Moderation: block NSFW and disallowed content from launching markets.
  if (nsfw) {
    throw new Error("Moderation block: NSFW posts cannot be used to launch a market.");
  }
  const haystack = `${post.title} ${subreddit}`.toLowerCase();
  for (const word of MODERATION_TRIGGER_WORDS) {
    if (haystack.includes(word)) {
      throw new Error(
        `Moderation block: this post violates platform safety guidelines (flagged: ${word}).`
      );
    }
  }
  if (post.removed_by_category) {
    throw new Error("This Reddit post has been removed and cannot be used.");
  }

  // Reddit returns thumbnail as "self"/"default"/"nsfw" sentinels when there's
  // no real image; normalize those to null.
  const thumb =
    post.thumbnail && post.thumbnail.startsWith("http") ? post.thumbnail : null;

  return {
    redditPostId: post.id || postId,
    subreddit: `r/${(post.subreddit || subreddit).replace(/^r\//, "")}`,
    author: `u/${(post.author || "unknown").replace(/^u\//, "")}`,
    title: post.title,
    permalink,
    thumbnail: thumb,
    createdUtc: Math.floor(post.created_utc || Date.now() / 1000),
    upvotes: post.ups ?? post.score ?? 0,
    comments: post.num_comments ?? 0,
    nsfw,
    sourceHash,
  };
}

export function getAiTokenSuggestions(
  title: string,
  subreddit: string
): TokenSuggestions {
  // Clean up title for token names
  const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, "");
  const words = cleanTitle.split(/\s+/).filter((w) => w.length > 2);

  let name = "Attention Token";
  let symbol = "ATTN";

  if (words.length > 0) {
    const sub = subreddit.toLowerCase();
    if (sub.includes("gaming")) {
      name = `${words[0]} Game Signal`;
      symbol = words[0].substring(0, 4).toUpperCase() + "G";
    } else if (sub.includes("technology") || sub.includes("tech")) {
      name = `${words[0]} Tech Momentum`;
      symbol = words[0].substring(0, 4).toUpperCase() + "T";
    } else if (sub.includes("wallstreetbets") || sub.includes("wsb")) {
      name = `${words[0]} WSB Alpha`;
      symbol = words[0].substring(0, 4).toUpperCase() + "W";
    } else {
      name = `${words[0]} Viral Karma`;
      symbol = words[0].substring(0, 4).toUpperCase() + "K";
    }
  }

  symbol = symbol.replace(/[^A-Z]/g, "");
  if (symbol.length < 3) symbol = symbol + "KM";
  symbol = symbol.substring(0, 6);

  const blockedTokens = ["REDDIT", "SNOO", "ELON", "TRUMP", "TESLA", "APPLE", "GOOGLE", "BINANCE", "BNB"];
  if (blockedTokens.includes(symbol)) symbol = "VIRAL";

  return {
    name: `${name} Market`,
    symbol,
    description: `A decentralized attention market token tracking the social virality and organic attention of the thread "${title}" on ${subreddit}.`,
  };
}
