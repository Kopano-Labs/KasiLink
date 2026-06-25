import { describe, it, expect } from "vitest";
import { calculateMatch, rankGigsForWorker, rankWorkersForGig, type WorkerProfile, type GigListing } from "@/lib/matching";

const KHAYELITSHA: [number, number] = [18.6840, -34.0350];
const MITCHELLS_PLAIN: [number, number] = [18.6181, -34.0534];
const SOWETO: [number, number] = [27.8585, -26.2678]; // Far from CT

const baseWorker: WorkerProfile = {
  id: "w1",
  categories: ["car_wash", "cleaning"],
  skills: ["car wash", "pressure wash", "detail"],
  location: { coordinates: KHAYELITSHA },
  trustScore: 60,
  completedGigs: 15,
  isVerified: true,
  loadSheddingZone: "11",
};

const nearbyGig: GigListing = {
  id: "g1",
  category: "car_wash",
  title: "Car wash helper needed in Mitchells Plain",
  description: "Help wash and detail cars at the weekend market.",
  requirements: ["car wash", "detail"],
  location: { coordinates: MITCHELLS_PLAIN },
  suburb: "Mitchells Plain",
  isUrgent: false,
};

const farGig: GigListing = {
  id: "g2",
  category: "car_wash",
  title: "Car wash in Soweto",
  description: "Need help at the car wash stand.",
  requirements: ["car wash"],
  location: { coordinates: SOWETO },
  suburb: "Soweto",
  isUrgent: false,
};

const urgentGig: GigListing = {
  id: "g3",
  category: "cleaning",
  title: "Urgent deep clean needed",
  description: "Office deep clean tonight.",
  requirements: ["cleaning", "deep clean"],
  location: { coordinates: KHAYELITSHA },
  suburb: "Khayelitsha",
  isUrgent: true,
};

const unmatchedGig: GigListing = {
  id: "g4",
  category: "solar",
  title: "Solar panel installation",
  description: "Install solar panels on rooftop.",
  requirements: ["solar", "electrical", "roofing"],
  location: { coordinates: KHAYELITSHA },
  suburb: "Khayelitsha",
  isUrgent: false,
};

describe("calculateMatch", () => {
  it("scores high for nearby category+skills match", () => {
    const result = calculateMatch(baseWorker, nearbyGig);
    expect(result.totalScore).toBeGreaterThan(50);
    expect(result.breakdown.skillsMatch).toBeGreaterThan(0);
    expect(result.breakdown.proximityScore).toBeGreaterThan(0);
    expect(result.distanceKm).toBeLessThan(10);
  });

  it("scores zero proximity for distant gigs", () => {
    const result = calculateMatch(baseWorker, farGig);
    expect(result.breakdown.proximityScore).toBe(0);
    expect(result.distanceKm).toBeGreaterThan(100);
  });

  it("gives urgency bonus for urgent gigs", () => {
    const result = calculateMatch(baseWorker, urgentGig);
    expect(result.breakdown.urgencyBonus).toBe(10);
  });

  it("gives verified bonus for verified workers", () => {
    const result = calculateMatch(baseWorker, nearbyGig);
    expect(result.breakdown.verifiedBonus).toBe(10);
  });

  it("gives zero verified bonus for unverified workers", () => {
    const unverified = { ...baseWorker, isVerified: false };
    const result = calculateMatch(unverified, nearbyGig);
    expect(result.breakdown.verifiedBonus).toBe(0);
  });

  it("gives low skills score for non-matching category", () => {
    const result = calculateMatch(baseWorker, unmatchedGig);
    expect(result.breakdown.skillsMatch).toBeLessThan(10);
  });

  it("flags infrastructure warning but does NOT reduce score", () => {
    const gigWithLS: GigListing = {
      ...nearbyGig,
      loadshedding: { aware: true, stage: 4 },
    };
    const withWarning = calculateMatch(baseWorker, gigWithLS);
    const without = calculateMatch(baseWorker, nearbyGig);

    expect(withWarning.infraWarning).toBe(true);
    expect(without.infraWarning).toBe(false);
    // Score should be IDENTICAL — infra warning is advisory only
    expect(withWarning.totalScore).toBe(without.totalScore);
  });

  it("score never exceeds 100", () => {
    const superWorker: WorkerProfile = {
      ...baseWorker,
      trustScore: 100,
      isVerified: true,
    };
    const superGig: GigListing = {
      ...nearbyGig,
      isUrgent: true,
    };
    const result = calculateMatch(superWorker, superGig);
    expect(result.totalScore).toBeLessThanOrEqual(100);
  });
});

describe("rankGigsForWorker", () => {
  it("returns gigs sorted by score descending", () => {
    const results = rankGigsForWorker(baseWorker, [nearbyGig, farGig, urgentGig, unmatchedGig]);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].totalScore).toBeGreaterThanOrEqual(results[i].totalScore);
    }
  });

  it("excludes zero-score matches", () => {
    const results = rankGigsForWorker(baseWorker, [farGig]);
    // Far gig has skills match but zero proximity — may still have some score from skills/trust
    // But if total is 0, it should be filtered
    for (const r of results) {
      expect(r.totalScore).toBeGreaterThan(0);
    }
  });
});

describe("rankWorkersForGig", () => {
  it("ranks verified, high-trust workers higher", () => {
    const lowTrust: WorkerProfile = {
      ...baseWorker,
      id: "w2",
      trustScore: 10,
      isVerified: false,
    };
    const results = rankWorkersForGig([baseWorker, lowTrust], nearbyGig);
    expect(results[0].workerId).toBe("w1"); // high trust + verified
  });
});
