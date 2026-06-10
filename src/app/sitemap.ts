import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://karmafi.app";
  const now = new Date();

  const staticPages = [
    { url: base, priority: 1.0, changeFrequency: "daily" as const },
    { url: `${base}/feed`, priority: 0.9, changeFrequency: "hourly" as const },
    { url: `${base}/launch`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${base}/leaderboard`, priority: 0.8, changeFrequency: "hourly" as const },
    { url: `${base}/portfolio`, priority: 0.7, changeFrequency: "daily" as const },
    { url: `${base}/whitepaper`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${base}/docs`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${base}/bnb-chain`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${base}/creator-claim`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${base}/smart-contracts`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${base}/terms`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${base}/privacy`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${base}/disclaimer`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${base}/risk-disclaimer`, priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return staticPages.map((page) => ({
    ...page,
    lastModified: now,
  }));
}
