"use client";

/**
 * components/TrustScore.tsx
 * ───────────────────────────────────────────────────────────
 * Trust Score display component for KasiLink worker profiles.
 *
 * KC Apprenticeship Phase 8, Task 75
 *
 * Shows the worker's trust level as:
 *   - Star rating (visual)
 *   - Percentage score
 *   - Level badge (New → Community Leader)
 *   - Optional breakdown tooltip
 * ───────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { Star, Shield, ChevronDown, ChevronUp } from "lucide-react";
import type { TrustResult } from "@/lib/trust-score";

interface TrustScoreProps {
  result: TrustResult;
  /** Show compact (badge only) or full (with breakdown) */
  variant?: "compact" | "full";
  className?: string;
}

const LEVEL_COLORS: Record<TrustResult["level"], string> = {
  new: "bg-outline/20 text-outline",
  starter: "bg-info/20 text-info",
  trusted: "bg-success/20 text-success",
  established: "bg-primary/20 text-primary",
  community_leader: "bg-warning/20 text-warning",
};

const LEVEL_ICONS: Record<TrustResult["level"], string> = {
  new: "🌱",
  starter: "⭐",
  trusted: "✅",
  established: "🏆",
  community_leader: "👑",
};

function StarRating({ stars }: { stars: number }) {
  const fullStars = Math.floor(stars);
  const hasHalf = stars % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5" aria-label={`${stars} out of 5 stars`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} size={14} className="fill-warning text-warning" />
      ))}
      {hasHalf && (
        <div className="relative" key="half">
          <Star size={14} className="text-outline/30" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
            <Star size={14} className="fill-warning text-warning" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} size={14} className="text-outline/30" />
      ))}
    </div>
  );
}

export default function TrustScore({
  result,
  variant = "compact",
  className = "",
}: TrustScoreProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${LEVEL_COLORS[result.level]}`}>
          {LEVEL_ICONS[result.level]} {result.label}
        </span>
        <StarRating stars={result.stars} />
      </div>
    );
  }

  return (
    <div className={`kasi-card ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-primary" />
          <h3 className="text-sm font-bold text-on-surface">Trust Score</h3>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${LEVEL_COLORS[result.level]}`}>
          {LEVEL_ICONS[result.level]} {result.label}
        </span>
      </div>

      {/* Score bar */}
      <div className="mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-2xl font-black text-on-surface">{result.score}</span>
          <span className="text-xs text-outline">/100</span>
        </div>
        <div className="h-2 w-full rounded-full bg-surface-container-high overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container transition-all duration-500"
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-2 mb-3">
        <StarRating stars={result.stars} />
        <span className="text-xs text-on-surface-variant">{result.stars}/5</span>
      </div>

      {/* Breakdown toggle */}
      <button
        type="button"
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
      >
        <span>Score breakdown</span>
        {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {showBreakdown && (
        <div className="mt-2 space-y-2 px-3">
          <BreakdownRow label="Completed gigs" score={result.breakdown.gigsScore} max={35} />
          <BreakdownRow label="Ratings" score={result.breakdown.ratingsScore} max={25} />
          <BreakdownRow label="Community vouches" score={result.breakdown.vouchesScore} max={15} />
          <BreakdownRow label="Profile completeness" score={result.breakdown.profileScore} max={15} />
          <BreakdownRow label="Time on platform" score={result.breakdown.tenureScore} max={10} />
        </div>
      )}
    </div>
  );
}

function BreakdownRow({ label, score, max }: { label: string; score: number; max: number }) {
  const pct = Math.round((score / 100) * max);
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-outline w-28 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
        <div
          className="h-full rounded-full bg-primary/60"
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-on-surface-variant w-6 text-right">{pct}</span>
    </div>
  );
}
