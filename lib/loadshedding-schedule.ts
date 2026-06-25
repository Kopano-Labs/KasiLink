/**
 * lib/loadshedding-schedule.ts
 * ───────────────────────────────────────────────────────────
 * Load-Shedding Schedule Service
 *
 * Governance: Task 7 — Eskom × KasiLink Predictive Scheduling
 *             Commandment 9 (Offline-First)
 *             80% Proximization (edge decision first)
 *
 * This module:
 *   1. Fetches zone-specific schedules from EskomSePush API
 *   2. Caches them in the Kopano Vault (IndexedDB)
 *   3. Provides conflict-checking against gig time windows
 *   4. Returns structured warnings without blocking free will
 *
 * The system NEVER blocks a match. It WARNS. The human decides.
 * ───────────────────────────────────────────────────────────
 */

import {
  type LoadSheddingSlot,
  type InfrastructureEntry,
  getLoadSheddingForZone,
  cacheInfrastructure,
  isInfraExpired,
} from "./kopano-vault";

/* ─── Types ─── */

export interface PowerConflict {
  hasConflict: boolean;
  stage: number;
  conflictingSlots: LoadSheddingSlot[];
  severity: "none" | "low" | "moderate" | "high" | "critical";
  message: string;
  safeWindows: string[];
  isStale: boolean;         // true if cache is expired (still usable, but flagged)
}

export interface ZoneScheduleResponse {
  zone: string;
  stage: number;
  schedule: LoadSheddingSlot[];
  updatedAt: string;
  source: string;
}

/* ─── Constants ─── */

// Power-dependent gig categories — these get warnings during outages
const POWER_DEPENDENT_CATEGORIES = new Set([
  "repairs",
  "solar",
  "handyman",
  "construction",
  "retail",
  "healthcare",
]);

// Categories that can operate without power
const POWER_INDEPENDENT_CATEGORIES = new Set([
  "car_wash",
  "cleaning",
  "delivery",
  "tutoring",    // in-person tutoring can work without power
  "logistics",
]);

/* ─── Severity Calculation ─── */

function calculateSeverity(
  stage: number,
  conflictCount: number,
  isPowerDependent: boolean,
): PowerConflict["severity"] {
  if (stage === 0 || conflictCount === 0) return "none";
  if (!isPowerDependent) return "low"; // warn but not critical

  if (stage >= 5) return "critical";
  if (stage >= 4) return "high";
  if (stage >= 3 || conflictCount >= 2) return "moderate";
  return "low";
}

/* ─── Human-Readable Messages ─── */

function buildMessage(
  severity: PowerConflict["severity"],
  stage: number,
  slots: LoadSheddingSlot[],
  category: string,
): string {
  if (severity === "none") return "No power disruptions expected.";

  const isPowerDep = POWER_DEPENDENT_CATEGORIES.has(category);
  const slotTimes = slots.map((s) => `${s.start}–${s.end}`).join(", ");

  switch (severity) {
    case "critical":
      return `⚠️ Stage ${stage} load-shedding during this gig (${slotTimes}). Power-dependent work (${category}) is high-risk. Do you have backup power?`;
    case "high":
      return `⚡ Stage ${stage} outage overlaps with gig time (${slotTimes}). Consider rescheduling ${isPowerDep ? "or securing backup power" : ""}.`;
    case "moderate":
      return `🔌 Stage ${stage} cuts scheduled (${slotTimes}). Plan tools/equipment accordingly.`;
    case "low":
      return `ℹ️ Stage ${stage} load-shedding is active but shouldn't heavily impact this type of work.`;
    default:
      return "";
  }
}

/* ─── Safe Window Calculator ─── */

function calculateSafeWindows(
  schedule: LoadSheddingSlot[],
  date: string,
): string[] {
  const daySlots = schedule.filter((s) => s.date === date);
  if (daySlots.length === 0) return ["All day"];

  // Parse slot times into minutes-from-midnight
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  // Sort by start time
  const sorted = daySlots
    .map((s) => ({ start: toMinutes(s.start), end: toMinutes(s.end) }))
    .sort((a, b) => a.start - b.start);

  const windows: string[] = [];
  const workDay = { start: 6 * 60, end: 20 * 60 }; // 06:00 - 20:00

  let cursor = workDay.start;
  for (const slot of sorted) {
    if (cursor < slot.start && slot.start > workDay.start) {
      const from = `${String(Math.floor(cursor / 60)).padStart(2, "0")}:${String(cursor % 60).padStart(2, "0")}`;
      const to = `${String(Math.floor(slot.start / 60)).padStart(2, "0")}:${String(slot.start % 60).padStart(2, "0")}`;
      windows.push(`${from}–${to}`);
    }
    cursor = Math.max(cursor, slot.end);
  }

  // After last slot until end of work day
  if (cursor < workDay.end) {
    const from = `${String(Math.floor(cursor / 60)).padStart(2, "0")}:${String(cursor % 60).padStart(2, "0")}`;
    windows.push(`${from}–20:00`);
  }

  return windows.length > 0 ? windows : ["No safe windows — consider rescheduling"];
}

/* ─── Core: Check Gig Against Schedule ─── */

/**
 * Check if a gig's time window conflicts with cached load-shedding.
 *
 * Free will preserved: returns a WARNING, never blocks the match.
 * The worker decides. An infrastructure-conflict decline does NOT
 * penalize their trust score.
 */
export async function checkGigPowerConflict(
  zone: string,
  gigStart: Date | string,
  gigEnd: Date | string | undefined,
  category: string,
): Promise<PowerConflict> {
  const NO_CONFLICT: PowerConflict = {
    hasConflict: false,
    stage: 0,
    conflictingSlots: [],
    severity: "none",
    message: "No power disruptions expected.",
    safeWindows: [],
    isStale: false,
  };

  try {
    const cached = await getLoadSheddingForZone(zone);
    if (!cached) return NO_CONFLICT;

    const stale = isInfraExpired(cached);
    const start = new Date(gigStart);
    const end = gigEnd ? new Date(gigEnd) : new Date(start.getTime() + 2 * 60 * 60 * 1000); // default 2h
    const gigDate = start.toISOString().split("T")[0];

    // Find overlapping slots
    const conflicts = cached.schedule.filter((slot) => {
      if (slot.date !== gigDate) return false;

      const slotStart = parseTime(slot.start, start);
      const slotEnd = parseTime(slot.end, start);
      return slotStart < end && slotEnd > start;
    });

    if (conflicts.length === 0) {
      return { ...NO_CONFLICT, isStale: stale };
    }

    const isPowerDep = POWER_DEPENDENT_CATEGORIES.has(category);
    const severity = calculateSeverity(cached.stage, conflicts.length, isPowerDep);

    return {
      hasConflict: true,
      stage: cached.stage,
      conflictingSlots: conflicts,
      severity,
      message: buildMessage(severity, cached.stage, conflicts, category),
      safeWindows: calculateSafeWindows(cached.schedule, gigDate),
      isStale: stale,
    };
  } catch {
    // Offline-first: if vault read fails, don't crash — just return no data
    return NO_CONFLICT;
  }
}

/* ─── Fetch & Cache Zone Schedule ─── */

/**
 * Fetch zone schedule from the KasiLink API and cache it locally.
 * Call this on app load (while online) or via background sync.
 */
export async function refreshZoneSchedule(
  zone: string,
): Promise<ZoneScheduleResponse | null> {
  try {
    const res = await fetch(`/api/load-shedding/schedule?zone=${encodeURIComponent(zone)}`);
    if (!res.ok) return null;

    const data: ZoneScheduleResponse = await res.json();

    await cacheInfrastructure({
      id: `loadshedding:zone-${zone}`,
      type: "loadshedding",
      zone,
      schedule: data.schedule,
      stage: data.stage,
      updatedAt: data.updatedAt,
      source: data.source,
    });

    return data;
  } catch {
    // Network failure — offline-first: use stale cache, don't crash
    return null;
  }
}

/* ─── Helpers ─── */

function parseTime(timeStr: string, referenceDate: Date): Date {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date(referenceDate);
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * Check if a gig category is power-dependent.
 * Used by UI components to decide warning severity.
 */
export function isPowerDependentCategory(category: string): boolean {
  return POWER_DEPENDENT_CATEGORIES.has(category);
}

/**
 * Get the stage-specific color token from the design system.
 */
export function getStageColor(stage: number): string {
  if (stage <= 0) return "var(--ls-none)";
  if (stage >= 6) return "var(--ls-stage-6)";
  return `var(--ls-stage-${stage})`;
}

/**
 * Get the CSS class for load-shedding severity badges.
 */
export function getSeverityClass(severity: PowerConflict["severity"]): string {
  switch (severity) {
    case "critical": return "ls-stage-6";
    case "high": return "ls-stage-5";
    case "moderate": return "ls-stage-3";
    case "low": return "ls-stage-2";
    default: return "ls-none";
  }
}
