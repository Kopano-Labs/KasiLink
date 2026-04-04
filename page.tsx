"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Provider {
  clerkId: string;
  displayName: string;
  category: string;
  rating: number;
  reviewCount: number;
  location: string;
}

export default function VerifiedProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder for fetching verified providers dynamically.
    setTimeout(() => {
      setProviders([
        {
          clerkId: "1",
          displayName: "Sipho's Plumbing",
          category: "repairs",
          rating: 4.8,
          reviewCount: 12,
          location: "Soweto",
        },
        {
          clerkId: "2",
          displayName: "Thandi Cleans",
          category: "cleaning",
          rating: 5.0,
          reviewCount: 34,
          location: "Tembisa",
        },
        {
          clerkId: "3",
          displayName: "Kagiso Tutors",
          category: "tutoring",
          rating: 4.9,
          reviewCount: 8,
          location: "Alexandra",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container pt-8 pb-12 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-success-container text-success font-semibold text-xs tracking-wider uppercase">
          Trust & Safety
        </span>
        <h1 className="font-headline text-3xl md:text-4xl font-bold mb-3">
          Verified Providers
        </h1>
        <p className="text-on-surface-variant text-base max-w-xl mx-auto">
          Book with confidence. These KasiLink providers have been vetted and
          consistently deliver high-quality gigs to the community.
        </p>
      </div>

      {/* Search & Filter - MVP Layout */}
      <div className="flex gap-3 mb-8 max-w-xl mx-auto">
        <input
          type="search"
          className="kasi-input flex-1"
          placeholder="Search by name or category..."
        />
        <button className="btn btn-primary px-6">Search</button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">
          Loading verified providers...
        </div>
      ) : providers.length === 0 ? (
        <div className="kasi-card text-center text-on-surface-variant py-12">
          <p>No verified providers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.map((provider) => (
            <div
              key={provider.clerkId}
              className="kasi-card flex flex-col hover:border-primary transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-lg">
                    {provider.displayName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight flex items-center gap-1">
                      {provider.displayName}{" "}
                      <span className="text-success text-sm" title="Verified">
                        ✓
                      </span>
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      {provider.location}
                    </p>
                  </div>
                </div>
                <span className="badge badge-secondary capitalize">
                  {provider.category}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-warning">★</span>
                <span className="font-bold text-sm">
                  {provider.rating.toFixed(1)}
                </span>
                <span className="text-xs text-outline">
                  ({provider.reviewCount} reviews)
                </span>
              </div>
              <div className="mt-auto pt-3 border-t border-outline-variant/30 flex gap-2">
                <button className="btn btn-outline btn-sm flex-1">
                  View Profile
                </button>
                <Link
                  href={`/chat`}
                  className="btn btn-primary btn-sm flex-1 text-center"
                >
                  Message
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
