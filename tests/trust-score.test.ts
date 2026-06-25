import { describe, it, expect } from "vitest";
import { calculateTrustScore, type TrustInput } from "@/lib/trust-score";

const BASE_INPUT: TrustInput = {
  completedGigs: 0,
  ratingAverage: 0,
  ratingCount: 0,
  vouchCount: 0,
  isVerified: false,
  hasPhone: false,
  hasBio: false,
  hasAvatar: false,
  skillsCount: 0,
  daysOnPlatform: 0,
  infraDeclines: 0,
  personalDeclines: 0,
};

describe("calculateTrustScore", () => {
  it("returns zero for a brand new user", () => {
    const result = calculateTrustScore(BASE_INPUT);
    expect(result.score).toBe(0);
    expect(result.level).toBe("new");
    expect(result.stars).toBe(0);
  });

  it("increases score with completed gigs", () => {
    const result = calculateTrustScore({ ...BASE_INPUT, completedGigs: 10 });
    expect(result.score).toBeGreaterThan(0);
    expect(result.breakdown.gigsScore).toBeGreaterThan(0);
  });

  it("increases score with good ratings", () => {
    const result = calculateTrustScore({
      ...BASE_INPUT,
      ratingAverage: 4.5,
      ratingCount: 10,
    });
    expect(result.score).toBeGreaterThan(0);
    expect(result.breakdown.ratingsScore).toBeGreaterThan(0);
  });

  it("single rating has low impact", () => {
    const singleReview = calculateTrustScore({
      ...BASE_INPUT,
      ratingAverage: 5,
      ratingCount: 1,
    });
    const manyReviews = calculateTrustScore({
      ...BASE_INPUT,
      ratingAverage: 5,
      ratingCount: 20,
    });
    expect(manyReviews.breakdown.ratingsScore).toBeGreaterThan(
      singleReview.breakdown.ratingsScore,
    );
  });

  it("increases score with vouches", () => {
    const result = calculateTrustScore({ ...BASE_INPUT, vouchCount: 5 });
    expect(result.breakdown.vouchesScore).toBeGreaterThan(0);
  });

  it("profile completeness boosts score", () => {
    const result = calculateTrustScore({
      ...BASE_INPUT,
      hasPhone: true,
      hasBio: true,
      hasAvatar: true,
      isVerified: true,
      skillsCount: 3,
    });
    expect(result.breakdown.profileScore).toBe(96);
  });

  it("tenure increases score over time", () => {
    const oneMonth = calculateTrustScore({ ...BASE_INPUT, daysOnPlatform: 30 });
    const oneYear = calculateTrustScore({ ...BASE_INPUT, daysOnPlatform: 365 });
    expect(oneYear.breakdown.tenureScore).toBeGreaterThan(
      oneMonth.breakdown.tenureScore,
    );
  });

  it("infrastructure declines do NOT affect score", () => {
    const noDeclines = calculateTrustScore({
      ...BASE_INPUT,
      completedGigs: 20,
      ratingAverage: 4.5,
      ratingCount: 10,
    });
    const withInfraDeclines = calculateTrustScore({
      ...BASE_INPUT,
      completedGigs: 20,
      ratingAverage: 4.5,
      ratingCount: 10,
      infraDeclines: 50, // 50 infrastructure declines — SHOULD NOT AFFECT SCORE
    });
    expect(withInfraDeclines.score).toBe(noDeclines.score);
  });

  it("personal declines mildly reduce gig score", () => {
    const noDeclines = calculateTrustScore({
      ...BASE_INPUT,
      completedGigs: 20,
    });
    const withDeclines = calculateTrustScore({
      ...BASE_INPUT,
      completedGigs: 20,
      personalDeclines: 5,
    });
    expect(withDeclines.breakdown.gigsScore).toBeLessThan(
      noDeclines.breakdown.gigsScore,
    );
  });

  it("returns correct level labels", () => {
    // Community leader: score >= 80
    const leader = calculateTrustScore({
      ...BASE_INPUT,
      completedGigs: 100,
      ratingAverage: 4.8,
      ratingCount: 50,
      vouchCount: 20,
      hasPhone: true,
      hasBio: true,
      hasAvatar: true,
      isVerified: true,
      skillsCount: 5,
      daysOnPlatform: 365,
    });
    expect(leader.level).toBe("community_leader");
    expect(leader.label).toBe("Community Leader");
  });

  it("score never exceeds 100", () => {
    const maxed = calculateTrustScore({
      ...BASE_INPUT,
      completedGigs: 10000,
      ratingAverage: 5,
      ratingCount: 1000,
      vouchCount: 500,
      hasPhone: true,
      hasBio: true,
      hasAvatar: true,
      isVerified: true,
      skillsCount: 20,
      daysOnPlatform: 3650,
    });
    expect(maxed.score).toBeLessThanOrEqual(100);
  });

  it("score never goes below 0", () => {
    const worst = calculateTrustScore({
      ...BASE_INPUT,
      personalDeclines: 1000,
    });
    expect(worst.score).toBeGreaterThanOrEqual(0);
  });

  it("stars have half-star precision", () => {
    const result = calculateTrustScore({
      ...BASE_INPUT,
      completedGigs: 5,
      ratingAverage: 3,
      ratingCount: 3,
    });
    // Stars should be a multiple of 0.5
    expect(result.stars % 0.5).toBe(0);
  });
});
