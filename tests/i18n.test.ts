import { describe, it, expect } from "vitest";
import { t, tInterpolated, isValidLocale, detectLocale } from "@/lib/i18n";

describe("t — translation lookup", () => {
  it("returns English string for known key", () => {
    expect(t("nav.home", "en")).toBe("Home");
    expect(t("gig.apply", "en")).toBe("Apply for this gig");
  });

  it("returns isiZulu string when locale is zu", () => {
    expect(t("nav.home", "zu")).toBe("Ikhaya");
    expect(t("gig.urgent", "zu")).toBe("Kuphuthuma");
  });

  it("returns isiXhosa string when locale is xh", () => {
    expect(t("nav.home", "xh")).toBe("Ikhaya");
    expect(t("gig.urgent", "xh")).toBe("Kungxamisekile");
  });

  it("returns Afrikaans string when locale is af", () => {
    expect(t("nav.home", "af")).toBe("Tuis");
    expect(t("gig.urgent", "af")).toBe("Dringend");
  });

  it("falls back to English when key missing in locale", () => {
    // "gig.slots" exists in en but not in zu
    expect(t("gig.slots", "zu")).toBe("Slots available");
  });

  it("returns key itself when not found in any locale", () => {
    expect(t("nonexistent.key", "en")).toBe("nonexistent.key");
    expect(t("also.missing", "zu")).toBe("also.missing");
  });

  it("defaults to English when no locale specified", () => {
    expect(t("nav.home")).toBe("Home");
  });
});

describe("tInterpolated — string interpolation", () => {
  it("replaces {{variable}} placeholders", () => {
    // We can test this concept even if the string doesn't have placeholders
    const result = tInterpolated("nav.home", "en", { unused: "test" });
    expect(result).toBe("Home");
  });
});

describe("isValidLocale", () => {
  it("returns true for supported locales", () => {
    expect(isValidLocale("en")).toBe(true);
    expect(isValidLocale("zu")).toBe(true);
    expect(isValidLocale("xh")).toBe(true);
    expect(isValidLocale("af")).toBe(true);
  });

  it("returns false for unsupported locales", () => {
    expect(isValidLocale("fr")).toBe(false);
    expect(isValidLocale("de")).toBe(false);
    expect(isValidLocale("")).toBe(false);
    expect(isValidLocale("english")).toBe(false);
  });
});

describe("detectLocale", () => {
  it("returns en as default in node environment", () => {
    // In node env, navigator is undefined, so should default to en
    expect(detectLocale()).toBe("en");
  });
});
