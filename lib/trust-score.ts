/**
 * lib/trust-score.ts
 * ───────────────────────────────────────────────────────────
 * Trust Score Calculation for KasiLink Workers
 *
 * KC Apprenticeship Phase 8, Task 74
 * Governance: Outlier Protocol — infrastructure declines
 *             do NOT affect trust score.
 *
 * Factors:
 *   - Completed gigs (heaviest weight)
 *   - Review average rating
 *   - Community vouches
 *   - Profile completeness
 *   - Verification status
 *   - Time on platform
 *
 * Score: 0–100 (displayed as percentage or 5-star)
 * ───────────────────────────────────────────────────────────
 */

export interface TrustInput {
  completedGigs: number;
  ratingAverage: number;      // 0–5
  ratingCount: number;
  vouchCount: number;
  isVerified: boolean;
  hasPhone: boolean;
  hasBio: boolean;
  hasAvatar: boolean;
  skillsCount: number;
  daysOnPlatform: number;
  // Infrastructure declines — NOT counted against trust
  infraDeclines: number;
  // Personal declines — mild factor
  personalDeclines: number;
}

export interface TrustResult {
  score: number;          // 0–100
  stars: number;          // 0–5 (half-star granularity)
  level: "new" | "starter" | "trusted" | "established" | "community_leader";
  label: string;
  breakdown: {
    gigsScore: number;
    ratingsScore: number;
    vouchesScore: number;
    profileScore: number;
    tenureScore: number;
  };
}

/* ─── Weights ─── */

const WEIGHTS = {
  gigs: 0.35,        // 35% — the most important signal
  ratings: 0.25,     // 25% — peer quality feedback
  vouches: 0.15,     // 15% — community endorsement
  profile: 0.15,     // 15% — completeness signals commitment
  tenure: 0.10,      // 10% — time on platform
} as const;

/* ─── Scoring Functions ─── */

function gigsScore(completed: number, personalDeclines: number): number {
  // Completed gigs: logarithmic curve (diminishing returns after 50)
  const completionScore = Math.min(100, Math.log2(completed + 1) * 17.5);
  // Mild penalty for personal (not infra!) declines
  const declinePenalty = personalDeclines > 0
    ? Math.min(15, personalDeclines * 2)
    : 0;
  return Math.max(0, completionScore - declinePenalty);
}

function ratingsScore(average: number, count: number): number {
  if (count === 0) return 0;
  // Weighted by count — 1 review is less trustworthy than 20
  const countMultiplier = Math.min(1, Math.log2(count + 1) / 4.5);
  return (average / 5) * 100 * countMultiplier;
}

function vouchesScore(count: number): number {
  // Logarithmic — diminishing returns after 10 vouches
  return Math.min(100, Math.log2(count + 1) * 28);
}

function profileScore(input: TrustInput): number {
  let score = 0;
  if (input.hasPhone) score += 25;
  if (input.hasBio) score += 25;
  if (input.hasAvatar) score += 20;
  if (input.isVerified) score += 20;
  if (input.skillsCount > 0) score += Math.min(10, input.skillsCount * 2);
  return Math.min(100, score);
}

function tenureScore(days: number): number {
  // 30 days = 50%, 180 days = 90%, 365 days = 100%
  return Math.min(100, (days / 365) * 100);
}

/* ─── Level Mapping ─── */

function getLevel(score: number): TrustResult["level"] {
  if (score >= 80) return "community_leader";
  if (score >= 60) return "established";
  if (score >= 40) return "trusted";
  if (score >= 20) return "starter";
  return "new";
}

function getLabel(level: TrustResult["level"]): string {
  switch (level) {
    case "community_leader": return "Community Leader";
    case "established": return "Established";
    case "trusted": return "Trusted";
    case "starter": return "Starter";
    case "new": return "New";
  }
}

/* ─── Main Calculator ─── */

export function calculateTrustScore(input: TrustInput): TrustResult {
  const breakdown = {
    gigsScore: gigsScore(input.completedGigs, input.personalDeclines),
    ratingsScore: ratingsScore(input.ratingAverage, input.ratingCount),
    vouchesScore: vouchesScore(input.vouchCount),
    profileScore: profileScore(input),
    tenureScore: tenureScore(input.daysOnPlatform),
  };

  const rawScore =
    breakdown.gigsScore * WEIGHTS.gigs +
    breakdown.ratingsScore * WEIGHTS.ratings +
    breakdown.vouchesScore * WEIGHTS.vouches +
    breakdown.profileScore * WEIGHTS.profile +
    breakdown.tenureScore * WEIGHTS.tenure;

  const score = Math.round(Math.min(100, Math.max(0, rawScore)));
  const stars = Math.round((score / 100) * 5 * 2) / 2; // half-star precision
  const level = getLevel(score);

  return {
    score,
    stars,
    level,
    label: getLabel(level),
    breakdown,
  };
}

/**
 * NOTE: infraDeclines are intentionally NOT used in the score calculation.
 * This is a deliberate architectural decision from the Outlier Protocol:
 * "Dissent is learned from, never suppressed."
 *
 * If a worker declines a gig because Eskom killed the power, that's
 * not the worker's fault. The platform adapts, not the human.
 */
