"use client";

/**
 * components/PowerWarningBadge.tsx
 * ───────────────────────────────────────────────────────────
 * [POWER WARNING] Badge for Gig Cards
 *
 * Task 7: Eskom × KasiLink Predictive Scheduling
 * Governance: Free Will Primitive — warns, never blocks.
 *
 * Shows when a gig's time window overlaps with cached
 * load-shedding schedule. Provides:
 *   - Visual severity indicator (badge color)
 *   - Conflict message with affected time slots
 *   - Safe alternative windows
 *   - Stale-data indicator when cache is expired
 * ───────────────────────────────────────────────────────────
 */

import { useState, useEffect } from "react";
import { Zap, AlertTriangle, ShieldAlert, Clock, ChevronDown, ChevronUp } from "lucide-react";
import {
  checkGigPowerConflict,
  getSeverityClass,
  type PowerConflict,
} from "@/lib/loadshedding-schedule";

interface PowerWarningBadgeProps {
  zone: string;
  gigStart: Date | string;
  gigEnd?: Date | string;
  category: string;
  /** Compact mode — just the badge, no expanded detail */
  compact?: boolean;
}

export default function PowerWarningBadge({
  zone,
  gigStart,
  gigEnd,
  category,
  compact = false,
}: PowerWarningBadgeProps) {
  const [conflict, setConflict] = useState<PowerConflict | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      setLoading(true);
      try {
        const result = await checkGigPowerConflict(zone, gigStart, gigEnd, category);
        if (!cancelled) setConflict(result);
      } catch {
        // Silent fail — offline-first
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    check();
    return () => { cancelled = true; };
  }, [zone, gigStart, gigEnd, category]);

  // Nothing to show
  if (loading || !conflict || !conflict.hasConflict) return null;

  const severityClass = getSeverityClass(conflict.severity);
  const Icon = conflict.severity === "critical" ? ShieldAlert
    : conflict.severity === "high" ? AlertTriangle
    : Zap;

  // Compact badge only
  if (compact) {
    return (
      <span
        className={`ls-badge ${severityClass}`}
        title={conflict.message}
        role="status"
        aria-label={`Power warning: ${conflict.message}`}
      >
        <Icon size={12} />
        <span>Stage {conflict.stage}</span>
        {conflict.isStale && (
          <span className="text-[9px] opacity-70">(cached)</span>
        )}
      </span>
    );
  }

  // Full warning panel
  return (
    <div
      className={`rounded-xl border p-3 transition-all ${
        conflict.severity === "critical" || conflict.severity === "high"
          ? "border-error/40 bg-error/5"
          : conflict.severity === "moderate"
            ? "border-warning/40 bg-warning/5"
            : "border-info/30 bg-info/5"
      }`}
      role="alert"
      aria-live="polite"
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full gap-2 text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <Icon
            size={14}
            className={
              conflict.severity === "critical" || conflict.severity === "high"
                ? "text-error"
                : conflict.severity === "moderate"
                  ? "text-warning"
                  : "text-info"
            }
          />
          <span className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">
            Power Warning
          </span>
          <span className={`ls-badge ${severityClass} text-[10px]`}>
            Stage {conflict.stage}
          </span>
          {conflict.isStale && (
            <span className="text-[9px] text-outline italic">(cached)</span>
          )}
        </div>
        {expanded ? <ChevronUp size={14} className="text-outline" /> : <ChevronDown size={14} className="text-outline" />}
      </button>

      {/* Message */}
      <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
        {conflict.message}
      </p>

      {/* Expanded detail */}
      {expanded && (
        <div className="mt-3 space-y-3 animate-in slide-in-from-top-1">
          {/* Conflicting slots */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1.5 flex items-center gap-1">
              <Clock size={10} />
              Affected outage windows
            </p>
            <div className="flex flex-wrap gap-1.5">
              {conflict.conflictingSlots.map((slot, i) => (
                <span
                  key={`${slot.start}-${i}`}
                  className={`ls-badge ${severityClass} text-[10px]`}
                >
                  {slot.start}–{slot.end}
                </span>
              ))}
            </div>
          </div>

          {/* Safe windows */}
          {conflict.safeWindows.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1.5 flex items-center gap-1">
                <Zap size={10} />
                Power-safe windows today
              </p>
              <div className="flex flex-wrap gap-1.5">
                {conflict.safeWindows.map((window) => (
                  <span
                    key={window}
                    className="rounded-lg bg-success/10 border border-success/20 px-2 py-0.5 text-[10px] font-semibold text-success"
                  >
                    {window}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Free will notice */}
          <p className="text-[10px] text-outline italic leading-relaxed">
            This is a warning, not a block. You decide whether to proceed.
            Declining due to load-shedding will NOT affect your trust score.
          </p>

          {/* Kopano Context tag */}
          <span className="text-[9px] font-bold uppercase tracking-widest text-primary/60">
            Powered by Kopano Context — Offline-First Infrastructure
          </span>
        </div>
      )}
    </div>
  );
}
