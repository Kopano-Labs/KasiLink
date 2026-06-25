import { describe, it, expect } from "vitest";
import {
  GIG_TEMPLATES,
  getTemplatesByCategory,
  getTemplateById,
  getTemplateCategories,
} from "@/lib/gig-templates";

describe("GIG_TEMPLATES", () => {
  it("has at least 10 templates", () => {
    expect(GIG_TEMPLATES.length).toBeGreaterThanOrEqual(10);
  });

  it("all templates have required fields", () => {
    for (const t of GIG_TEMPLATES) {
      expect(t.id).toBeTruthy();
      expect(t.category).toBeTruthy();
      expect(t.title).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(t.defaultPay).toBeTruthy();
      expect(t.icon).toBeTruthy();
      expect(typeof t.isPowerDependent).toBe("boolean");
    }
  });

  it("all template IDs are unique", () => {
    const ids = GIG_TEMPLATES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getTemplatesByCategory", () => {
  it("returns templates for car_wash", () => {
    const templates = getTemplatesByCategory("car_wash");
    expect(templates.length).toBeGreaterThan(0);
    for (const t of templates) {
      expect(t.category).toBe("car_wash");
    }
  });

  it("returns empty for unknown category", () => {
    expect(getTemplatesByCategory("nonexistent")).toEqual([]);
  });
});

describe("getTemplateById", () => {
  it("finds a known template", () => {
    const t = getTemplateById("car-wash-basic");
    expect(t).toBeDefined();
    expect(t?.title).toContain("Car wash");
  });

  it("returns undefined for unknown ID", () => {
    expect(getTemplateById("nonexistent")).toBeUndefined();
  });
});

describe("getTemplateCategories", () => {
  it("returns unique categories", () => {
    const cats = getTemplateCategories();
    expect(cats.length).toBeGreaterThan(0);
    expect(new Set(cats).size).toBe(cats.length);
  });

  it("includes car_wash and cleaning", () => {
    const cats = getTemplateCategories();
    expect(cats).toContain("car_wash");
    expect(cats).toContain("cleaning");
  });
});
