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
  verified?: boolean;
}

export default function VerifiedProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch("/api/users?verified=true")
      .then((res) => res.json())
      .then((data) => setProviders(data.providers || []))
      .catch((err) => console.error("Failed to fetch verified providers", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(providers.map((p) => p.category))];
  const visibleProviders = providers.filter((provider) => {
    const matchesQuery =
      !query ||
      provider.displayName.toLowerCase().includes(query.toLowerCase()) ||
      provider.category.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || provider.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

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

      <div className="flex gap-3 mb-8 max-w-xl mx-auto">
        <input
          type="search"
          className="kasi-input flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or category..."
        />
        <button
          className="btn btn-primary px-6"
          onClick={() => setActiveCategory("All")}
        >
          Reset
        </button>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`badge transition-colors ${
              activeCategory === category
                ? "badge-primary"
                : "badge-secondary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">
          Loading verified providers...
          <div className="mt-3 text-xs text-outline">
            Fetching live trust signals from the user directory.
          </div>
        </div>
      ) : visibleProviders.length === 0 ? (
        <div className="kasi-card text-center text-on-surface-variant py-12">
          <p>No verified providers found for this filter.</p>
          <p className="mt-2 text-xs text-outline">
            Try a broader search or switch back to All.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleProviders.map((provider) => (
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
                <span className="badge badge-success ml-auto">Verified</span>
              </div>
              <div className="mt-auto pt-3 border-t border-outline-variant/30 flex gap-2">
                <Link
                  href={`/verified/${provider.clerkId}`}
                  className="btn btn-outline btn-sm flex-1 text-center"
                >
                  View Profile
                </Link>
                <Link
                  href="/chat"
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
