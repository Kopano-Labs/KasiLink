/**
 * lib/analytics.ts
 * ───────────────────────────────────────────────────────────
 * Custom event tracking for KasiLink.
 *
 * KC Apprenticeship Phase 9, Tasks 81-82
 *
 * Sends custom events to Google Analytics and/or
 * Vercel Analytics. Designed to be lightweight and
 * non-blocking — township connections can't afford
 * analytics overhead.
 * ───────────────────────────────────────────────────────────
 */

/* ─── Types ─── */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
}

/* ─── Core ─── */

/**
 * Track a custom event.
 * Non-blocking — never throws, never blocks the UI thread.
 */
export function trackEvent(event: AnalyticsEvent): void {
  try {
    // Google Analytics (gtag)
    if (typeof window !== "undefined" && "gtag" in window) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag(
        "event",
        event.name,
        event.properties || {},
      );
    }

    // Vercel Analytics custom events
    if (typeof window !== "undefined" && "va" in window) {
      (window as unknown as { va: (...args: unknown[]) => void }).va(
        "event",
        { name: event.name, ...event.properties },
      );
    }

    // Dev logging
    if (process.env.NODE_ENV === "development") {
      console.log(`[Analytics] ${event.name}`, event.properties || {});
    }
  } catch {
    // Never let analytics break the app
  }
}

/* ─── Pre-built Events ─── */

/** Worker viewed a gig listing */
export function trackGigView(gigId: string, category: string, suburb: string): void {
  trackEvent({
    name: "gig_view",
    properties: { gig_id: gigId, category, suburb },
  });
}

/** Worker applied for a gig */
export function trackGigApply(gigId: string, category: string, suburb: string): void {
  trackEvent({
    name: "gig_apply",
    properties: { gig_id: gigId, category, suburb },
  });
}

/** Worker declined due to infrastructure */
export function trackInfraDecline(
  gigId: string,
  reason: string,
  conflictType: string,
): void {
  trackEvent({
    name: "infra_decline",
    properties: { gig_id: gigId, reason, conflict_type: conflictType },
  });
}

/** Power warning was shown to worker */
export function trackPowerWarningShown(
  gigId: string,
  severity: string,
  stage: number,
): void {
  trackEvent({
    name: "power_warning_shown",
    properties: { gig_id: gigId, severity, stage },
  });
}

/** Worker expanded power warning to see details */
export function trackPowerWarningExpanded(gigId: string): void {
  trackEvent({
    name: "power_warning_expanded",
    properties: { gig_id: gigId },
  });
}

/** Load-shedding stage changed */
export function trackLoadSheddingStageChange(
  stage: number,
  previousStage: number,
): void {
  trackEvent({
    name: "loadshedding_stage_change",
    properties: { stage, previous_stage: previousStage },
  });
}

/** Gig was shared via ShareGig component */
export function trackGigShare(gigId: string, method: string): void {
  trackEvent({
    name: "gig_share",
    properties: { gig_id: gigId, method },
  });
}

/** Language was changed */
export function trackLanguageChange(from: string, to: string): void {
  trackEvent({
    name: "language_change",
    properties: { from_locale: from, to_locale: to },
  });
}

/** SOS button was activated */
export function trackSOSActivated(gigId?: string): void {
  trackEvent({
    name: "sos_activated",
    properties: { gig_id: gigId || "none" },
  });
}

/** Worker went offline */
export function trackOfflineEvent(): void {
  trackEvent({ name: "user_went_offline" });
}

/** Worker came back online */
export function trackOnlineEvent(): void {
  trackEvent({ name: "user_came_online" });
}

/** Vault sync completed */
export function trackVaultSync(itemsSynced: number): void {
  trackEvent({
    name: "vault_sync",
    properties: { items_synced: itemsSynced },
  });
}
