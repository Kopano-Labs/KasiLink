"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Eyebrow } from "@/components/ui/PagePrimitives";
import { formatRelativeTime } from "@/lib/format";
import PowerWarningBadge from "@/components/PowerWarningBadge";
import InfraDeclineModal from "@/components/InfraDeclineModal";

interface Gig {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: { suburb: string; city: string };
  payDisplay: string;
  isProviderVerified: boolean;
  providerName: string;
  providerId: string;
  isUrgent: boolean;
  slots: number;
  applicationCount: number;
  startDate?: string;
  endDate?: string;
  loadshedding?: { aware: boolean; stage?: number };
  createdAt: string;
}

export default function GigDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { isLoaded, isSignedIn } = useUser();
  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [appStatus, setAppStatus] = useState<string | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/gigs/${id}/view`)
      .then((res) => res.json())
      .then((data) => setGig(data.gig || null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignedIn) return;
    setApplying(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gigId: id, message: message || "I am interested in this gig." }),
      });
      if (res.ok) setAppStatus("Success! Application submitted.");
      else setAppStatus("Failed to apply. You may have already applied.");
    } catch {
      setAppStatus("Network error occurred.");
    } finally {
      setApplying(false);
    }
  }

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignedIn || !gig) return;
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gigId: id, providerId: gig.providerId, rating, comment: reviewComment }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviewStatus("Review posted successfully.");
        setReviewComment("");
      } else {
        setReviewStatus(data.error || "Failed to submit review.");
      }
    } catch {
      setReviewStatus("Network error occurred.");
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) {
    return (
      <div className="pb-12">
        <section className="container page-shell">
          <div className="space-y-4">
            <div className="kasi-card skeleton h-10 w-48" />
            <div className="kasi-card skeleton h-64" />
          </div>
        </section>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="container pt-8 pb-12 text-center">
        <p className="text-on-surface-variant mb-4">Gig not found.</p>
        <Link href="/marketplace" className="btn btn-primary">Back to marketplace</Link>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <section className="container page-shell">
        <div className="mb-6">
          <Link href="/marketplace" className="text-sm text-primary hover:underline">
            ← Back to marketplace
          </Link>
        </div>

        <div className="page-hero animate-fade-in">
          <div className="page-hero-grid">
            <div className="page-hero-copy">
              <div className="flex flex-wrap gap-2 mb-3">
                <Eyebrow>{gig.category.replace("_", " ")}</Eyebrow>
                {gig.isUrgent && <span className="badge badge-danger">Urgent</span>}
                {gig.isProviderVerified && <span className="badge badge-success">Verified provider</span>}
              </div>
              <h1 className="page-hero-title mt-2 font-headline font-black text-on-background">
                {gig.title}
              </h1>
              <p className="mt-2 text-sm text-outline">
                Posted by {gig.providerName} · {gig.location?.suburb}, {gig.location?.city} · {formatRelativeTime(gig.createdAt)}
              </p>
              <p className="page-hero-description mt-4">{gig.description}</p>
            </div>

            <aside className="page-hero-aside">
              <div className="kasi-card">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline">Pay</p>
                <p className="mt-2 text-3xl font-black text-primary">{gig.payDisplay}</p>
                <div className="mt-4 border-t border-outline-variant/30 pt-4 flex justify-between text-sm">
                  <div>
                    <p className="text-outline text-xs uppercase tracking-wide">Applied</p>
                    <p className="font-bold text-on-background">{gig.applicationCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-outline text-xs uppercase tracking-wide">Slots</p>
                    <p className="font-bold text-on-background">{gig.slots}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-outline text-xs uppercase tracking-wide">Open</p>
                    <p className={`font-bold ${gig.slots - gig.applicationCount > 0 ? "text-success" : "text-danger"}`}>
                      {Math.max(0, gig.slots - gig.applicationCount)}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="container pb-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Apply form */}
          <div className="kasi-card">
            {!isLoaded || !isSignedIn ? (
              <div className="text-center py-8">
                <p className="text-on-surface-variant mb-4">Sign in to apply for this gig.</p>
                <Link href="/sign-in" className="btn btn-primary">Sign in</Link>
              </div>
            ) : appStatus ? (
              <div className={`alert ${appStatus.includes("Success") ? "alert-success" : "alert-danger"}`}>
                {appStatus}
              </div>
            ) : (
              <>
                <h2 className="font-headline text-xl font-bold mb-4">Apply for this gig</h2>
                <form onSubmit={handleApply} className="flex flex-col gap-4">
                  <div className="form-group">
                    <label className="label" htmlFor="apply-message">Why are you a good fit?</label>
                    <textarea
                      id="apply-message"
                      className="kasi-input"
                      rows={3}
                      placeholder="Optional — but a direct message increases your chances."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={applying}
                  >
                    {applying ? "Submitting…" : "Submit application"}
                  </button>
                </form>
              </>
            )}

            {isLoaded && isSignedIn && (
              <div className="mt-8 border-t border-outline-variant/30 pt-6">
                <h3 className="font-bold mb-4">Rate this provider</h3>
                {reviewStatus && (
                  <div className={`alert mb-4 ${reviewStatus.includes("Success") || reviewStatus.includes("posted") ? "alert-success" : "alert-danger"}`}>
                    {reviewStatus}
                  </div>
                )}
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  <div className="form-group">
                    <label className="label" htmlFor="rating">Rating</label>
                    <select
                      id="rating"
                      className="kasi-input"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      {[5, 4, 3, 2, 1].map((num) => (
                        <option key={num} value={num}>{num} star{num !== 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label" htmlFor="review-comment">Experience</label>
                    <textarea
                      id="review-comment"
                      className="kasi-input"
                      rows={2}
                      placeholder="How was working with this provider?"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-outline"
                    disabled={submittingReview}
                  >
                    {submittingReview ? "Submitting…" : "Submit review"}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            <div className="surface-band">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline mb-3">
                About the provider
              </p>
              <p className="font-semibold text-on-background">{gig.providerName}</p>
              {gig.isProviderVerified && (
                <span className="badge badge-success mt-2 inline-block">Verified</span>
              )}
              <p className="mt-3 text-sm text-on-surface-variant">
                {gig.location?.suburb}, {gig.location?.city}
              </p>
            </div>

            {/* Task 7: Power Warning — Eskom × KasiLink Predictive Scheduling */}
            {gig.startDate && gig.location?.suburb && (
              <PowerWarningBadge
                zone={gig.location.suburb}
                gigStart={gig.startDate}
                gigEnd={gig.endDate}
                category={gig.category}
              />
            )}

            {/* Load-shedding stage from provider */}
            {gig.loadshedding?.aware && gig.loadshedding.stage != null && gig.loadshedding.stage > 0 && (
              <div className="surface-band">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline mb-2">
                  Provider&apos;s load-shedding note
                </p>
                <span className={`ls-badge ls-stage-${Math.min(gig.loadshedding.stage, 6)}`}>
                  Stage {gig.loadshedding.stage} expected
                </span>
                <p className="text-xs text-on-surface-variant mt-2">
                  The provider has flagged expected load-shedding during this gig.
                </p>
              </div>
            )}

            <div className="surface-band">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline mb-3">
                Before you apply
              </p>
              <div className="space-y-2 text-sm text-on-surface-variant">
                <p>Read the description in full — especially location and timing.</p>
                <p>Only apply if you can genuinely commit to the gig.</p>
                <p>Check verified status as a trust signal before meeting in person.</p>
              </div>
            </div>

            {/* Infrastructure decline — no trust penalty */}
            {isSignedIn && (
              <button
                type="button"
                onClick={() => setShowDeclineModal(true)}
                className="btn btn-ghost text-xs text-on-surface-variant"
              >
                Can&apos;t do this gig due to infrastructure?
              </button>
            )}

            <Link href="/marketplace" className="btn btn-outline text-center">
              ← More gigs nearby
            </Link>
          </aside>
        </div>
      </section>

      {/* Infrastructure Decline Modal */}
      {gig && (
        <InfraDeclineModal
          isOpen={showDeclineModal}
          onClose={() => setShowDeclineModal(false)}
          onConfirm={(reason, feedback) => {
            console.log("[Identic RLHF] Infrastructure decline:", { reason, feedback, gigId: id });
            setShowDeclineModal(false);
          }}
          gigId={id}
          gigTitle={gig.title}
          userId="" // Clerk ID injected at runtime
          conflictType="loadshedding"
        />
      )}
    </div>
  );
}
