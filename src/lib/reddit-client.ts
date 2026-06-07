// Browser-only Reddit fetch via JSONP.
//
// Reddit blocks unauthenticated requests from datacenter IPs (Vercel,
// Cloudflare, proxies) but serves browsers on residential IPs. CORS blocks a
// normal cross-origin fetch, but Reddit's legacy ?jsonp= param returns the
// JSON wrapped in a callback, loadable via a <script> tag. So we fetch the
// post data in the visitor's browser and post it to our API.

const REDDIT_REGEX =
  /https?:\/\/(?:www\.|old\.|new\.|np\.)?reddit\.com\/r\/([a-zA-Z0-9_]+)\/comments\/([a-zA-Z0-9]+)/;

export interface ClientRedditPost {
  redditPostId: string;
  subreddit: string;
  author: string;
  title: string;
  permalink: string;
  thumbnail: string | null;
  upvotes: number;
  comments: number;
  nsfw: boolean;
  removed: boolean;
}

// Fetch a Reddit user's public profile (for ownership verification: the user
// puts a code in their bio, we read it here via JSONP — only the account owner
// can edit that bio).
export function fetchRedditUserAbout(username: string): Promise<{ name: string; bio: string }> {
  const u = username.replace(/^\/?u\//, "").trim();
  if (!u) return Promise.reject(new Error("Missing Reddit username."));
  return new Promise((resolve, reject) => {
    const cb = "kf_user_" + Math.random().toString(36).slice(2);
    const w = window as unknown as Record<string, unknown>;
    let done = false;
    const script = document.createElement("script");
    const cleanup = () => {
      try { delete w[cb]; } catch { w[cb] = undefined; }
      if (script.parentNode) script.parentNode.removeChild(script);
    };
    w[cb] = (data: unknown) => {
      done = true;
      try {
        const d = (data as { data?: Record<string, any> })?.data;
        if (!d || !d.name) {
          cleanup();
          reject(new Error("Reddit user not found."));
          return;
        }
        const sub = (d.subreddit || {}) as Record<string, string>;
        const bio = sub.public_description || sub.description || d.description || "";
        resolve({ name: d.name as string, bio: String(bio) });
      } catch (e) {
        reject(e as Error);
      }
      cleanup();
    };
    script.src = `https://www.reddit.com/user/${encodeURIComponent(u)}/about.json?jsonp=${cb}`;
    script.onerror = () => { if (!done) { cleanup(); reject(new Error("Could not reach Reddit. Try again.")); } };
    document.head.appendChild(script);
    setTimeout(() => { if (!done) { cleanup(); reject(new Error("Timed out verifying. Try again.")); } }, 12000);
  });
}

export function fetchRedditPostClient(url: string): Promise<ClientRedditPost> {
  const m = url.match(REDDIT_REGEX);
  if (!m) {
    return Promise.reject(
      new Error("Invalid Reddit post URL. Paste a full comment thread link.")
    );
  }
  const subreddit = m[1];
  const postId = m[2];

  return new Promise<ClientRedditPost>((resolve, reject) => {
    const cb = "kf_jsonp_" + Math.random().toString(36).slice(2);
    const w = window as unknown as Record<string, unknown>;
    let done = false;
    const script = document.createElement("script");

    const cleanup = () => {
      try {
        delete w[cb];
      } catch {
        w[cb] = undefined;
      }
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    w[cb] = (data: unknown) => {
      done = true;
      try {
        const d = data as
          | Array<{ data?: { children?: Array<{ data?: Record<string, unknown> }> } }>
          | { data?: { children?: Array<{ data?: Record<string, unknown> }> } };
        const arr = Array.isArray(d) ? d[0] : d;
        const post = arr?.data?.children?.[0]?.data as
          | Record<string, unknown>
          | undefined;
        if (!post || !post.title) {
          cleanup();
          reject(new Error("Could not read this Reddit post (it may be private or removed)."));
          return;
        }
        const thumb =
          typeof post.thumbnail === "string" && post.thumbnail.startsWith("http")
            ? (post.thumbnail as string)
            : null;
        resolve({
          redditPostId: (post.id as string) || postId,
          subreddit: "r/" + String(post.subreddit || subreddit).replace(/^r\//, ""),
          author: "u/" + String(post.author || "unknown").replace(/^u\//, ""),
          title: post.title as string,
          permalink: post.permalink
            ? ("https://www.reddit.com" + (post.permalink as string)).replace(/\/$/, "")
            : url.split("?")[0].replace(/\/$/, ""),
          thumbnail: thumb,
          upvotes: (post.ups as number) ?? (post.score as number) ?? 0,
          comments: (post.num_comments as number) ?? 0,
          nsfw: Boolean(post.over_18),
          removed: Boolean(post.removed_by_category),
        });
      } catch (e) {
        reject(e as Error);
      }
      cleanup();
    };

    script.src = `https://www.reddit.com/r/${subreddit}/comments/${postId}/.json?raw_json=1&limit=1&jsonp=${cb}`;
    script.onerror = () => {
      if (!done) {
        cleanup();
        reject(new Error("Reddit request was blocked or the post is unavailable."));
      }
    };
    document.head.appendChild(script);

    setTimeout(() => {
      if (!done) {
        cleanup();
        reject(new Error("Timed out fetching the Reddit post. Try again."));
      }
    }, 12000);
  });
}
