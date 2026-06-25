import { describe, it, expect } from "vitest";
import {
  parseUSSDInput,
  truncateUSSD,
  routeUSSDMenu,
  formatGigsForUSSD,
  formatLoadSheddingForUSSD,
} from "@/lib/ussd-session";

describe("parseUSSDInput", () => {
  it("returns level 0 for empty input", () => {
    const state = parseUSSDInput("");
    expect(state.level).toBe(0);
    expect(state.selections).toEqual([]);
  });

  it("parses single selection", () => {
    const state = parseUSSDInput("1");
    expect(state.level).toBe(1);
    expect(state.selections).toEqual(["1"]);
  });

  it("parses chained selections", () => {
    const state = parseUSSDInput("1*2*3");
    expect(state.level).toBe(3);
    expect(state.selections).toEqual(["1", "2", "3"]);
  });
});

describe("truncateUSSD", () => {
  it("preserves short messages", () => {
    expect(truncateUSSD("Hello")).toBe("Hello");
  });

  it("truncates long messages to 160 chars", () => {
    const long = "x".repeat(200);
    const result = truncateUSSD(long);
    expect(result.length).toBeLessThanOrEqual(160);
    expect(result.endsWith("...")).toBe(true);
  });
});

describe("routeUSSDMenu", () => {
  it("shows main menu at level 0", () => {
    const { response } = routeUSSDMenu({ level: 0, selections: [] });
    expect(response.type).toBe("CON");
    expect(response.message).toContain("KasiLink");
    expect(response.message).toContain("Browse gigs");
  });

  it("exits on 0", () => {
    const { response } = routeUSSDMenu({ level: 1, selections: ["0"] });
    expect(response.type).toBe("END");
    expect(response.message).toContain("Sharp");
  });

  it("shows suburb menu for option 1", () => {
    const { response } = routeUSSDMenu({ level: 1, selections: ["1"] });
    expect(response.type).toBe("CON");
    expect(response.message).toContain("Khayelitsha");
    expect(response.message).toContain("Soweto");
  });

  it("returns browse action for suburb selection", () => {
    const { action } = routeUSSDMenu({ level: 2, selections: ["1", "1"] });
    expect(action?.type).toBe("browse_gigs");
    expect(action?.suburb).toBe("Khayelitsha");
  });

  it("returns my_applications action for option 2", () => {
    const { action } = routeUSSDMenu({ level: 1, selections: ["2"] });
    expect(action?.type).toBe("my_applications");
  });

  it("returns loadshedding action for option 3", () => {
    const { action } = routeUSSDMenu({ level: 1, selections: ["3"] });
    expect(action?.type).toBe("loadshedding");
  });

  it("returns profile action for option 4", () => {
    const { action } = routeUSSDMenu({ level: 1, selections: ["4"] });
    expect(action?.type).toBe("profile");
  });

  it("handles invalid main menu choice", () => {
    const { response } = routeUSSDMenu({ level: 1, selections: ["9"] });
    expect(response.type).toBe("CON");
    expect(response.message).toContain("Invalid");
  });

  it("handles invalid suburb choice", () => {
    const { response } = routeUSSDMenu({ level: 2, selections: ["1", "99"] });
    expect(response.type).toBe("CON");
    expect(response.message).toContain("Invalid");
  });
});

describe("formatGigsForUSSD", () => {
  it("formats gig list", () => {
    const gigs = [
      { title: "Car wash helper", payDisplay: "R150/day" },
      { title: "Delivery driver", payDisplay: "R200/trip" },
    ];
    const result = formatGigsForUSSD(gigs);
    expect(result).toContain("1. Car wash helper");
    expect(result).toContain("R150/day");
    expect(result).toContain("0. Back");
  });

  it("shows no gigs message", () => {
    const result = formatGigsForUSSD([]);
    expect(result).toContain("No gigs");
  });

  it("limits to maxItems", () => {
    const gigs = Array.from({ length: 10 }, (_, i) => ({
      title: `Gig ${i + 1}`,
      payDisplay: "R100",
    }));
    const result = formatGigsForUSSD(gigs, 3);
    expect(result).toContain("1. Gig 1");
    expect(result).toContain("3. Gig 3");
    expect(result).not.toContain("4. Gig 4");
  });
});

describe("formatLoadSheddingForUSSD", () => {
  it("shows celebration for stage 0", () => {
    expect(formatLoadSheddingForUSSD(0)).toContain("No load-shedding");
  });

  it("shows stage info for active stage", () => {
    const result = formatLoadSheddingForUSSD(4);
    expect(result).toContain("Stage 4");
    expect(result).toContain("Power-dependent");
  });

  it("shows low impact for lower stages", () => {
    const result = formatLoadSheddingForUSSD(2);
    expect(result).toContain("Low impact");
  });
});
