"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

interface Gig {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: { suburb: string; city: string };
  payDisplay: string;
  isProviderVerified: boolean;
  providerName: string;
  isUrgent: boolean;
  slots: number;
  applicationCount: number;
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
        body: JSON.stringify({
          gigId: id,
          message: message || "I am interested in this gig.",
        }),
      });
      if (res.ok) setAppStatus("Success! Application submitted.");
      else setAppStatus("Failed to apply. You may have already applied.");
    } catch {
      setAppStatus("Network error occurred.");
    } finally {
      setApplying(false);
    }
  }

  if (loading)
    return (
      <div className="container pt-8 pb-12 text-center text-on-surface-variant">
        Loading gig details...
      </div>
    );
  if (!gig)
    return (
      <div className="container pt-8 pb-12 text-center text-on-surface-variant">
        Gig not found.
      </div>
    );

  return (
    <div className="container pt-8 pb-12 max-w-2xl mx-auto">
      <Link
        href="/marketplace"
        className="text-sm text-primary hover:underline mb-6 inline-block"
      >
        ← Back to Gigs
      </Link>

      <div className="kasi-card">
        <div className="flex gap-2 mb-3">
          {gig.isUrgent && <span className="badge badge-danger">Urgent</span>}
          <span className="badge badge-primary">
            {gig.category.replace("_", " ")}
          </span>
        </div>

        <h1 className="font-headline text-3xl font-bold mb-2">{gig.title}</h1>
        <p className="text-on-surface-variant text-sm mb-6">
          Posted by {gig.providerName} {gig.isProviderVerified && "✓"} ·{" "}
          {gig.location?.suburb}
        </p>

        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 mb-6 flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-xs text-outline mb-1">Pay</p>
            <p className="font-bold text-xl text-primary">{gig.payDisplay}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-outline mb-1">Applicants</p>
            <p className="font-bold text-xl">
              {gig.applicationCount} / {gig.slots}
            </p>
          </div>
        </div>

        <div className="mb-8 whitespace-pre-wrap text-on-background">
          {gig.description}
        </div>

        {!isLoaded || !isSignedIn ? (
          <div className="alert bg-surface-variant text-on-surface text-center">
            <p className="mb-3">Please sign in to apply for this gig.</p>
            <Link href="/sign-in" className="btn btn-primary">
              Sign In
            </Link>
          </div>
        ) : appStatus ? (
          <div
            className={`alert ${appStatus.includes("Success") ? "badge-success text-success-container" : "alert-danger"}`}
          >
            {appStatus}
          </div>
        ) : (
          <form
            onSubmit={handleApply}
            className="border-t border-outline-variant/30 pt-6 mt-4"
          >
            <h3 className="font-bold mb-3">Apply for this gig</h3>
            <textarea
              className="kasi-input mb-3"
              rows={3}
              placeholder="Why are you a good fit? (Optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={applying}
            >
              {applying ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
