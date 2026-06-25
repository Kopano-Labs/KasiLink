/**
 * lib/matching.ts
 * ───────────────────────────────────────────────────────────
 * Gig Matching Algorithm for KasiLink
 *
 * KC Apprenticeship Phase 11, Tasks 101-104
 *
 * Multi-factor matching:
 *   1. Skills match (category + specific skills)
 *   2. Proximity (distance from worker to gig)
 *   3. Availability (worker schedule vs gig timing)
 *   4. Load-shedding awareness (Task 7 integration)
 *   5. Trust score bonus (established workers rank higher)
 *
 * Returns a sorted list of match scores for ranking.
 * ───────────────────────────────────────────────────────────
 */

import { distanceKm } from "./geo";

/* ─── Types ─── */

export interface WorkerProfile {
  id: string;
  categories: string[];
  skills: string[];
  location: { coordinates: [number, number] }; // [lng, lat]
  trustScore: number;           // 0–100
  completedGigs: number;
  isVerified: boolean;
  loadSheddingZone?: string;
}

export interface GigListing {
  id: string;
  category: string;
  title: string;
  description: string;
  requirements: string[];
  location: { coordinates: [number, number] }; // [lng, lat]
  suburb: string;
  startDate?: Date;
  endDate?: Date;
  isUrgent: boolean;
  loadshedding?: { aware: boolean; stage?: number };
}

export interface MatchResult {
  gigId: string;
  workerId: string;
  totalScore: number;           // 0–100
  breakdown: {
    skillsMatch: number;        // 0–30
    proximityScore: number;     // 0–25
    trustBonus: number;         // 0–20
    urgencyBonus: number;       // 0–10
    verifiedBonus: number;      // 0–10
    infraWarning: boolean;      // flag, not a score deduction
  };
  distanceKm: number;
  infraWarning: boolean;
}

/* ─── Constants ─── */

const MAX_DISTANCE_KM = 30;       // Max distance for matching
const IDEAL_DISTANCE_KM = 5;      // Below this = full proximity score

/* ─── Scoring Functions ─── */

/**
 * Skills match: how well does the worker fit the gig?
 * Max 30 points.
 */
function scoreSkills(worker: WorkerProfile, gig: GigListing): number {
  let score = 0;

  // Category match (primary signal)
  if (worker.categories.includes(gig.category)) {
    score += 15;
  }

  // Skills match against requirements
  if (gig.requirements.length > 0 && worker.skills.length > 0) {
    const workerSkillsLower = worker.skills.map((s) => s.toLowerCase());
    const matched = gig.requirements.filter((req) =>
      workerSkillsLower.some((skill) => skill.includes(req.toLowerCase()) || req.toLowerCase().includes(skill)),
    );
    const matchRatio = matched.length / gig.requirements.length;
    score += Math.round(matchRatio * 10);
  } else if (worker.categories.includes(gig.category)) {
    // No specific requirements — category match counts more
    score += 5;
  }

  // Keyword match in title/description
  const gigText = `${gig.title} ${gig.description}`.toLowerCase();
  const keywordHits = worker.skills.filter((s) => gigText.includes(s.toLowerCase()));
  score += Math.min(5, keywordHits.length * 2);

  return Math.min(30, score);
}

/**
 * Proximity score: how close is the worker to the gig?
 * Max 25 points.
 * Township-first: shorter distance = much better (transport costs, taxi routes).
 */
function scoreProximity(worker: WorkerProfile, gig: GigListing): { score: number; distance: number } {
  const [wLng, wLat] = worker.location.coordinates;
  const [gLng, gLat] = gig.location.coordinates;

  const distance = distanceKm(wLat, wLng, gLat, gLng);

  if (distance > MAX_DISTANCE_KM) {
    return { score: 0, distance };
  }

  if (distance <= IDEAL_DISTANCE_KM) {
    return { score: 25, distance };
  }

  // Linear decay from IDEAL to MAX
  const ratio = 1 - (distance - IDEAL_DISTANCE_KM) / (MAX_DISTANCE_KM - IDEAL_DISTANCE_KM);
  return { score: Math.round(ratio * 25), distance };
}

/**
 * Trust bonus: established workers get a boost.
 * Max 20 points.
 */
function scoreTrust(worker: WorkerProfile): number {
  return Math.round((worker.trustScore / 100) * 20);
}

/**
 * Urgency bonus for urgent gigs.
 * Max 10 points — workers who match urgent gigs get priority visibility.
 */
function scoreUrgency(gig: GigListing): number {
  return gig.isUrgent ? 10 : 0;
}

/**
 * Verified worker bonus.
 * Max 10 points.
 */
function scoreVerified(worker: WorkerProfile): number {
  return worker.isVerified ? 10 : 0;
}

/* ─── Main Matching Function ─── */

/**
 * Calculate match score between a worker and a gig.
 *
 * Returns a MatchResult with total score (0-100) and breakdown.
 * Infrastructure warnings are flagged but DO NOT reduce the score
 * (Free Will Primitive — the worker decides).
 */
export function calculateMatch(
  worker: WorkerProfile,
  gig: GigListing,
): MatchResult {
  const skillsMatch = scoreSkills(worker, gig);
  const { score: proximityScore, distance } = scoreProximity(worker, gig);
  const trustBonus = scoreTrust(worker);
  const urgencyBonus = scoreUrgency(gig);
  const verifiedBonus = scoreVerified(worker);

  // Infrastructure warning — flag only, no score penalty
  const infraWarning = !!(
    gig.loadshedding?.aware &&
    gig.loadshedding.stage &&
    gig.loadshedding.stage > 0
  );

  const totalScore = Math.min(
    100,
    skillsMatch + proximityScore + trustBonus + urgencyBonus + verifiedBonus,
  );

  return {
    gigId: gig.id,
    workerId: worker.id,
    totalScore,
    breakdown: {
      skillsMatch,
      proximityScore,
      trustBonus,
      urgencyBonus,
      verifiedBonus,
      infraWarning,
    },
    distanceKm: Math.round(distance * 10) / 10,
    infraWarning,
  };
}

/**
 * Rank multiple gigs for a single worker.
 * Returns sorted by totalScore descending.
 */
export function rankGigsForWorker(
  worker: WorkerProfile,
  gigs: GigListing[],
): MatchResult[] {
  return gigs
    .map((gig) => calculateMatch(worker, gig))
    .filter((m) => m.totalScore > 0)
    .sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * Rank multiple workers for a single gig.
 * Returns sorted by totalScore descending.
 */
export function rankWorkersForGig(
  workers: WorkerProfile[],
  gig: GigListing,
): MatchResult[] {
  return workers
    .map((worker) => calculateMatch(worker, gig))
    .filter((m) => m.totalScore > 0)
    .sort((a, b) => b.totalScore - a.totalScore);
}
