/**
 * KarmaFi Reddit proxy — Cloudflare Worker.
 *
 * Reddit blocks datacenter IPs (e.g. Vercel) but not Cloudflare's edge, so we
 * proxy read-only Reddit post JSON through this worker. It only forwards
 * comment-listing paths, so it can't be abused as an open proxy.
 *
 * Deploy:
 *   1. https://dash.cloudflare.com  ->  Workers & Pages  ->  Create  ->  Worker
 *   2. Name it (e.g. "karmafi-reddit"), replace the default code with this file,
 *      and Deploy.
 *   3. Copy the worker URL (https://karmafi-reddit.<your-subdomain>.workers.dev)
 *      and set it as REDDIT_PROXY_URL in your env (local .env + Vercel).
 *
 * Our server then calls:  ${REDDIT_PROXY_URL}/r/<sub>/comments/<id>.json?...
 */
export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Only allow Reddit comment-listing paths.
    const allowed =
      /^\/r\/[^/]+\/comments\/[^/]+/.test(url.pathname) ||
      /^\/comments\/[^/]+/.test(url.pathname);
    if (!allowed) {
      return new Response(JSON.stringify({ error: "Path not allowed" }), {
        status: 403,
        headers: { "content-type": "application/json" },
      });
    }

    const target = "https://www.reddit.com" + url.pathname + url.search;

    let upstream;
    try {
      upstream = await fetch(target, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; KarmaFiBot/1.0; +https://karmafi.app)",
          Accept: "application/json",
        },
        cf: { cacheTtl: 60, cacheEverything: true },
      });
    } catch {
      return new Response(JSON.stringify({ error: "Upstream fetch failed" }), {
        status: 502,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*",
        "cache-control": "public, max-age=60",
      },
    });
  },
};
