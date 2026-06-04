export interface ViralityParams {
  upvotes: number;
  comments: number;
  createdAt: string; // ISO string
  volume24h: number; // in BNB
  holdersCount: number;
  isCreatorVerified: boolean;
  reportCount: number;
}

export function calculateViralityScore(params: ViralityParams): number {
  const {
    upvotes,
    comments,
    createdAt,
    volume24h,
    holdersCount,
    isCreatorVerified,
    reportCount,
  } = params;

  // 1. Calculate time elapsed in hours (min 1 hour to prevent division by zero)
  const elapsedMs = Date.now() - new Date(createdAt).getTime();
  const elapsedHours = Math.max(elapsedMs / (1000 * 3600), 1);

  // 2. Upvote velocity (Target: 300 upvotes/hour = 100 score)
  const upvoteVelocity = upvotes / elapsedHours;
  const upvoteScore = Math.min((upvoteVelocity / 300) * 100, 100);

  // 3. Comment velocity (Target: 30 comments/hour = 100 score)
  const commentVelocity = comments / elapsedHours;
  const commentScore = Math.min((commentVelocity / 30) * 100, 100);

  // 4. Subreddit normalization (mocked at a baseline of 70)
  const subredditNormalizationScore = 70;

  // 5. Trading volume (Target: 5 BNB/24h = 100 score)
  const volumeScore = Math.min((volume24h / 5) * 100, 100);

  // 6. Holder growth (Target: 50 holders = 100 score)
  const holderScore = Math.min((holdersCount / 50) * 100, 100);

  // 7. Cross-platform mentions (baseline of 65)
  const crossPlatformScore = 65;

  // 8. Creator verification (Verified = 100, Unverified = 0)
  const creatorVerificationScore = isCreatorVerified ? 100 : 0;

  // Calculate weighted base score (should sum to 100%)
  // - Upvote velocity: 25%
  // - Comment velocity: 20%
  // - Subreddit normalization: 15%
  // - Trading volume: 15%
  // - Holder growth: 10%
  // - Cross-platform mentions: 5%
  // - Creator verification: 5%
  let baseScore =
    upvoteScore * 0.25 +
    commentScore * 0.20 +
    subredditNormalizationScore * 0.15 +
    volumeScore * 0.15 +
    holderScore * 0.10 +
    crossPlatformScore * 0.05 +
    creatorVerificationScore * 0.05;

  // 9. Risk penalty (-15 points per report)
  const penalty = reportCount * 15;
  baseScore = baseScore - penalty;

  // Guarantee boundaries 0 - 100
  const finalScore = Math.round(Math.max(Math.min(baseScore, 100), 0));
  return finalScore;
}
