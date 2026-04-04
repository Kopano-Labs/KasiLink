"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

interface Review {
  _id: string;
  seekerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface ProviderProfile {
  clerkId: string;
  displayName: string;
  category: string;
  rating: number;
  reviewCount: number;
  verified?: boolean;
  verifiedAt?: string | null;
  location: string;
  about: string;
}

export default function VerifiedProviderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      fetch(`/api/users/${id}`).then((res) => res.json()),
      fetch(`/api/reviews?providerId=${id}`).then((res) => res.json()),
    ])
      .then(([providerData, reviewData]) => {
        if (!active) return;
        setProvider(providerData.provider ?? null);
        setReviews(reviewData.reviews ?? []);
      })
      .catch((err) => console.error("Failed to fetch provider profile", err))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container pt-8 pb-12 text-center text-on-surface-variant">
        Loading provider profile...
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container pt-8 pb-12 text-center text-on-surface-variant">
        Provider not found.
      </div>
    );
  }

  return (
    <div className="container pt-8 pb-12 max-w-3xl mx-auto">
      <Link
        href="/verified"
        className="text-sm text-primary hover:underline mb-6 inline-block"
      >
        Back to Directory
      </Link>

      <div className="kasi-card mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-4xl">
            {provider.displayName.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="font-headline text-3xl font-bold">
                {provider.displayName}
              </h1>
              <span className="badge badge-success shrink-0">
                {provider.verified === false ? "Unverified" : "Verified"}
              </span>
            </div>
            <p className="text-on-surface-variant text-base mb-3">
              {provider.category} · {provider.location}
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-warning text-lg">★</span>
              <span className="font-bold">{provider.rating.toFixed(1)}</span>
              <span className="text-sm text-outline">
                ({provider.reviewCount} community reviews)
              </span>
              {provider.verifiedAt && (
                <span className="text-xs text-outline">
                  Verified {new Date(provider.verifiedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <Link href="/chat" className="btn btn-primary">
                Message Provider
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-outline-variant/30">
          <h2 className="font-bold text-lg mb-2">About</h2>
          <p className="text-on-surface-variant">{provider.about}</p>
        </div>
      </div>

      <h2 className="font-headline text-2xl font-bold mb-4">
        Community Reviews
      </h2>
      <div className="kasi-card mb-4">
        <p className="text-sm text-on-surface-variant">
          Reviews are tied to real gigs and roll into the provider&apos;s trust
          summary after each submission.
        </p>
      </div>
      {reviews.length === 0 ? (
        <div className="kasi-card text-center text-on-surface-variant py-8">
          No reviews available yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div key={review._id} className="kasi-card flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-bold text-sm">
                    {review.seekerName.charAt(0)}
                  </div>
                  <span className="font-bold">{review.seekerName}</span>
                </div>
                <div className="flex items-center gap-1 text-warning">
                  <span>★</span>
                  <span className="text-sm font-bold text-on-background">
                    {review.rating}
                  </span>
                </div>
              </div>
              {review.comment && (
                <p className="text-on-surface-variant text-sm mt-1">
                  {review.comment}
                </p>
              )}
              <span className="text-xs text-outline mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
