import { describe, expect, it } from "vitest";
import {
  getLiteLocationById,
  getLiteLocations,
  getLiteOverview,
  getLiteRecommendations,
  searchLiteOpportunities,
} from "@/lib/lite-investor-discovery";

describe("lite investor discovery service", () => {
  it("returns ranked recommendations in descending score order", () => {
    const recommendations = getLiteRecommendations(4);

    expect(recommendations).toHaveLength(4);
    expect(recommendations[0].opportunity_score).toBeGreaterThanOrEqual(
      recommendations[1].opportunity_score,
    );
    expect(recommendations[1].opportunity_score).toBeGreaterThanOrEqual(
      recommendations[2].opportunity_score,
    );
  });

  it("aggregates location totals for cards", () => {
    const locations = getLiteLocations();
    const khayelitsha = locations.find((location) => location.name === "Khayelitsha");

    expect(locations).toHaveLength(8);
    expect(khayelitsha).toBeDefined();
    expect(khayelitsha?.total_opportunities).toBeGreaterThan(0);
    expect(khayelitsha?.total_funding_needed).toBeGreaterThan(0);
  });

  it("searches by township, category, and business content", () => {
    expect(searchLiteOpportunities("Soweto").length).toBeGreaterThan(0);
    expect(searchLiteOpportunities("repair").length).toBeGreaterThan(0);
    expect(searchLiteOpportunities("Homework Hub")[0]?.location).toBe("Mitchells Plain");
  });

  it("returns a detail view for a location", () => {
    const result = getLiteLocationById(2);

    expect(result).not.toBeNull();
    expect(result?.location.name).toBe("Khayelitsha");
    expect(result?.businesses[0]?.business_name).toBe("Khayelitsha Mobile Repair Kiosk");
  });

  it("computes the top-line Lite overview", () => {
    const overview = getLiteOverview();

    expect(overview.totalLocations).toBe(8);
    expect(overview.totalOpportunities).toBe(8);
    expect(overview.totalJobsPossible).toBeGreaterThan(0);
    expect(overview.totalFundingNeeded).toBeGreaterThan(0);
  });
});
