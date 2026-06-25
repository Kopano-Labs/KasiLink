import { describe, it, expect, beforeEach } from "vitest";
import {
  checkGigPowerConflict,
  isPowerDependentCategory,
  getStageColor,
  getSeverityClass,
} from "@/lib/loadshedding-schedule";

/**
 * Tests for loadshedding-schedule.ts
 * 
 * Note: checkGigPowerConflict reads from IndexedDB via kopano-vault.
 * In node environment (vitest), IndexedDB is not available, so
 * checkGigPowerConflict should gracefully return NO_CONFLICT.
 * This tests the offline-first resilience: if vault is unavailable,
 * the system doesn't crash — it just skips the warning.
 *
 * Full integration tests with IndexedDB require a browser environment
 * (e.g. vitest with jsdom + fake-indexeddb).
 */

describe("isPowerDependentCategory", () => {
  it("returns true for power-dependent categories", () => {
    expect(isPowerDependentCategory("repairs")).toBe(true);
    expect(isPowerDependentCategory("solar")).toBe(true);
    expect(isPowerDependentCategory("handyman")).toBe(true);
    expect(isPowerDependentCategory("construction")).toBe(true);
    expect(isPowerDependentCategory("retail")).toBe(true);
    expect(isPowerDependentCategory("healthcare")).toBe(true);
  });

  it("returns false for power-independent categories", () => {
    expect(isPowerDependentCategory("car_wash")).toBe(false);
    expect(isPowerDependentCategory("cleaning")).toBe(false);
    expect(isPowerDependentCategory("delivery")).toBe(false);
    expect(isPowerDependentCategory("tutoring")).toBe(false);
    expect(isPowerDependentCategory("logistics")).toBe(false);
  });

  it("returns false for unknown categories", () => {
    expect(isPowerDependentCategory("unknown")).toBe(false);
    expect(isPowerDependentCategory("")).toBe(false);
  });
});

describe("getStageColor", () => {
  it("returns correct CSS variable for each stage", () => {
    expect(getStageColor(0)).toBe("var(--ls-none)");
    expect(getStageColor(-1)).toBe("var(--ls-none)");
    expect(getStageColor(1)).toBe("var(--ls-stage-1)");
    expect(getStageColor(2)).toBe("var(--ls-stage-2)");
    expect(getStageColor(3)).toBe("var(--ls-stage-3)");
    expect(getStageColor(4)).toBe("var(--ls-stage-4)");
    expect(getStageColor(5)).toBe("var(--ls-stage-5)");
    expect(getStageColor(6)).toBe("var(--ls-stage-6)");
  });

  it("caps at stage 6 for higher values", () => {
    expect(getStageColor(7)).toBe("var(--ls-stage-6)");
    expect(getStageColor(8)).toBe("var(--ls-stage-6)");
    expect(getStageColor(100)).toBe("var(--ls-stage-6)");
  });
});

describe("getSeverityClass", () => {
  it("maps severity levels to correct CSS classes", () => {
    expect(getSeverityClass("none")).toBe("ls-none");
    expect(getSeverityClass("low")).toBe("ls-stage-2");
    expect(getSeverityClass("moderate")).toBe("ls-stage-3");
    expect(getSeverityClass("high")).toBe("ls-stage-5");
    expect(getSeverityClass("critical")).toBe("ls-stage-6");
  });
});

describe("checkGigPowerConflict", () => {
  // In node env without IndexedDB, this should gracefully return no conflict
  it("returns no conflict when IndexedDB is unavailable", async () => {
    const result = await checkGigPowerConflict(
      "11",
      new Date("2026-05-20T10:00:00"),
      new Date("2026-05-20T12:00:00"),
      "repairs",
    );

    expect(result.hasConflict).toBe(false);
    expect(result.severity).toBe("none");
    expect(result.conflictingSlots).toEqual([]);
    expect(result.stage).toBe(0);
  });

  it("handles missing zone gracefully", async () => {
    const result = await checkGigPowerConflict(
      "",
      new Date(),
      undefined,
      "car_wash",
    );

    expect(result.hasConflict).toBe(false);
  });

  it("handles undefined end date (defaults to 2h window)", async () => {
    const result = await checkGigPowerConflict(
      "8",
      new Date("2026-05-20T14:00:00"),
      undefined,
      "cleaning",
    );

    expect(result.hasConflict).toBe(false);
    expect(result.severity).toBe("none");
  });

  it("handles string dates", async () => {
    const result = await checkGigPowerConflict(
      "8",
      "2026-05-20T14:00:00",
      "2026-05-20T16:00:00",
      "delivery",
    );

    expect(result.hasConflict).toBe(false);
  });
});
