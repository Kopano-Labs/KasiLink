"use client";

/**
 * components/InfraDeclineModal.tsx
 * ───────────────────────────────────────────────────────────
 * Infrastructure Conflict Decline Modal
 *
 * Task 7: Eskom × KasiLink Predictive Scheduling
 * Governance: Outlier Protocol — dissent is learned from,
 *             never suppressed. Infrastructure declines
 *             do NOT penalize the worker's trust score.
 *
 * When a worker declines a gig because of load-shedding or
 * water outage, this modal:
 *   1. Records the decline reason as "infrastructure"
 *   2. Stores the feedback delta in the personal vault
 *   3. Does NOT reduce their trust/rating score
 *   4. Teaches the matching algorithm to be infrastructure-aware
 * ───────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { ShieldAlert, Zap, Droplets, X, CheckCircle } from "lucide-react";
import { saveFeedback } from "@/lib/kopano-vault";

interface InfraDeclineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, feedback: string) => void;
  gigId: string;
  gigTitle: string;
  userId: string;
  conflictType: "loadshedding" | "water" | "transport" | "other";
  conflictDetails?: string;
}

const DECLINE_REASONS = [
  {
    id: "no_power",
    icon: Zap,
    label: "No power for this work",
    detail: "Load-shedding prevents me from doing power-dependent work",
  },
  {
    id: "no_water",
    icon: Droplets,
    label: "No water supply",
    detail: "Water outage prevents me from completing this gig",
  },
  {
    id: "transport_disrupted",
    icon: ShieldAlert,
    label: "Transport disrupted",
    detail: "Taxi routes or public transport affected by infrastructure issues",
  },
  {
    id: "backup_unavailable",
    icon: Zap,
    label: "No backup power available",
    detail: "I could do this work but I don't have generator/inverter/solar",
  },
] as const;

export default function InfraDeclineModal({
  isOpen,
  onClose,
  onConfirm,
  gigId,
  gigTitle,
  userId,
  conflictType,
  conflictDetails,
}: InfraDeclineModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit() {
    if (!selectedReason) return;
    setSubmitting(true);

    try {
      // Save to personal vault (Identic RLHF — non-extractable feedback)
      await saveFeedback({
        gigId,
        userId,
        feedback: `Infrastructure decline: ${selectedReason}. ${additionalNotes}`.trim(),
        language: "en", // TODO: detect from user preference
        declineReason: "infrastructure",
      });

      setSubmitted(true);

      // Callback to parent
      const reason = DECLINE_REASONS.find((r) => r.id === selectedReason);
      onConfirm(
        selectedReason,
        `${reason?.detail || selectedReason}${additionalNotes ? ` — ${additionalNotes}` : ""}`,
      );

      // Auto-close after brief confirmation
      setTimeout(() => {
        setSubmitted(false);
        setSelectedReason("");
        setAdditionalNotes("");
        onClose();
      }, 1500);
    } catch {
      // Offline-first: even if vault write fails, still close the modal
      onConfirm(selectedReason, additionalNotes);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Decline gig due to infrastructure"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-outline-variant/30 bg-surface p-5 shadow-2xl">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-outline hover:text-on-surface-variant transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {submitted ? (
          /* ─── Success State ─── */
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle size={40} className="text-success" />
            <h3 className="text-lg font-bold text-on-surface">
              Decline recorded
            </h3>
            <p className="text-sm text-on-surface-variant">
              Your trust score is <strong>not affected</strong>. This feedback
              helps KasiLink match smarter around infrastructure.
            </p>
          </div>
        ) : (
          <>
            {/* ─── Header ─── */}
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert size={18} className="text-warning" />
              <h3 className="text-lg font-bold text-on-surface">
                Infrastructure Conflict
              </h3>
            </div>

            <p className="text-sm text-on-surface-variant mb-4">
              Declining &quot;{gigTitle}&quot; due to{" "}
              {conflictType === "loadshedding"
                ? "load-shedding"
                : conflictType === "water"
                  ? "water outage"
                  : "infrastructure issues"}
              .
            </p>

            {conflictDetails && (
              <div className="rounded-lg bg-warning/5 border border-warning/20 px-3 py-2 mb-4">
                <p className="text-xs text-on-surface-variant">
                  {conflictDetails}
                </p>
              </div>
            )}

            {/* ─── Reason Selection ─── */}
            <div className="space-y-2 mb-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-outline">
                Select reason
              </p>
              {DECLINE_REASONS.map((reason) => {
                const IconComponent = reason.icon;
                const isSelected = selectedReason === reason.id;
                return (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => setSelectedReason(reason.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-outline-variant/30 hover:border-outline-variant/60 bg-surface-container-low"
                    }`}
                  >
                    <IconComponent
                      size={16}
                      className={isSelected ? "text-primary" : "text-outline"}
                    />
                    <div>
                      <p className={`text-sm font-medium ${isSelected ? "text-primary" : "text-on-surface"}`}>
                        {reason.label}
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        {reason.detail}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ─── Optional Notes ─── */}
            <div className="mb-4">
              <label htmlFor="infra-notes" className="label">
                Additional notes (optional)
              </label>
              <textarea
                id="infra-notes"
                className="kasi-input"
                rows={2}
                placeholder="e.g. My area has been off since 10am..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                maxLength={300}
              />
            </div>

            {/* ─── Trust Score Notice ─── */}
            <div className="rounded-lg bg-success/5 border border-success/20 px-3 py-2 mb-4">
              <p className="text-xs text-success font-medium flex items-center gap-1.5">
                <CheckCircle size={12} />
                Your trust score will NOT be affected by this decline.
              </p>
              <p className="text-[10px] text-on-surface-variant mt-1">
                Infrastructure conflicts are logged separately from personal
                declines. The system learns from this to make better matches.
              </p>
            </div>

            {/* ─── Actions ─── */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedReason || submitting}
                className="btn btn-primary flex-1"
              >
                {submitting ? "Saving..." : "Decline — No Penalty"}
              </button>
            </div>

            {/* ─── Kopano Context ─── */}
            <p className="text-center text-[9px] font-bold uppercase tracking-widest text-primary/40 mt-3">
              Kopano Context — Sovereign Feedback Vault
            </p>
          </>
        )}
      </div>
    </div>
  );
}
