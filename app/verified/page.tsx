"use client";

import { useEffect, useMemo, useState } from "react";
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

const PAGE_SIZE = 8;

export default function VerifiedProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/users?verified=true&page=${page}&limit=${PAGE_SIZE}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setProviders(data.providers || []);
        setHasMore(Boolean(data.hasMore));
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch verified providers", err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [page]);

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

  const metrics = useMemo(
    () => [
      { label: "Page", value: page },
      { label: "Showing", value: visibleProviders.length },
      { label: "Trust", value: "Live" },
    ],
    [page, visibleProviders.length],
  );

  return (
    <div className="container mx-auto max-w-4xl pt-8 pb-12">
      <div className="mb-8 text-center">
        <span className="mb-3 inline-block rounded-full bg-success-container px-3 py-1 text-xs font-semibold uppercase tracking-wider text-success">
          Trust & Safety
        </span>
        <h1 className="mb-3 font-headline text-3xl font-bold md:text-4xl">
          Verified Providers
        </h1>
        <p className="mx-auto max-w-xl text-base text-on-surface-variant">
          Book with confidence. These KasiLink providers have been vetted and
          consistently deliver high-quality gigs to the community.
        </p>
      </div>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric.label} className="kasi-card text-center">
            <div className="text-xs uppercase tracking-wider text-outline">
              {metric.label}
            </div>
            <div className="mt-2 text-2xl font-bold">{metric.value}</div>
          </article>
        ))}
      </section>

      <div className="mx-auto mb-8 flex max-w-xl gap-3">
        <input
          type="search"
          className="kasi-input flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or category..."
        />
        <button
          className="btn btn-primary px-6"
          onClick={() => {
            setQuery("");
            setActiveCategory("All");
            setPage(1);
          }}
        >
          Reset
        </button>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              setPage(1);
            }}
            className={`badge transition-colors ${
              activeCategory === category ? "badge-primary" : "badge-secondary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-on-surface-variant">
          Loading verified providers...
        </div>
      ) : visibleProviders.length === 0 ? (
        <div className="kasi-card py-12 text-center text-on-surface-variant">
          <p>No verified providers found for this filter.</p>
          <p className="mt-2 text-xs text-outline">
            Try a broader search or switch back to All.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleProviders.map((provider) => (
            <div
              key={provider.clerkId}
              className="kasi-card flex flex-col transition-colors hover:border-primary"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-lg font-bold text-primary">
                    {provider.displayName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="flex items-center gap-1 text-lg font-bold leading-tight">
                      {provider.displayName}
                      <span className="text-sm text-success" title="Verified">
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
              <div className="mb-4 flex items-center gap-2">
                <span className="text-warning">★</span>
                <span className="text-sm font-bold">
                  {provider.rating.toFixed(1)}
                </span>
                <span className="text-xs text-outline">
                  ({provider.reviewCount} reviews)
                </span>
                <span className="badge badge-success ml-auto">Verified</span>
              </div>
              <div className="mt-auto flex gap-2 border-t border-outline-variant/30 pt-3">
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

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setPage((current) => Math.max(current - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-xs text-outline">Page {page}</span>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setPage((current) => current + 1)}
          disabled={!hasMore}
        >
          Next
        </button>
      </div>
    </div>
  );
}
