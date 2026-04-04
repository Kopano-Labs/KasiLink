"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────
interface Gig {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: { suburb: string; city: string; coordinates: [number, number] };
  payDisplay: string;
  payType: string;
  isProviderVerified: boolean;
  providerName: string;
  isUrgent: boolean;
  applicationCount: number;
  slots: number;
  createdAt: string;
  distance?: number;
}

// ── Constants ──────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "", label: "All" },
  { value: "car_wash", label: "Car Wash" },
  { value: "cleaning", label: "Cleaning" },
  { value: "tutoring", label: "Tutoring" },
  { value: "repairs", label: "Repairs" },
  { value: "delivery", label: "Delivery" },
  { value: "handyman", label: "Handyman" },
  { value: "retail", label: "Retail" },
  { value: "construction", label: "Construction" },
  { value: "healthcare", label: "Healthcare" },
  { value: "other", label: "Other" },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── GigCard ────────────────────────────────────────────────────────
function GigCard({ gig }: { gig: Gig }) {
  return (
    <Link href={`/gigs/${gig._id}`} className="no-underline block">
      <article className="kasi-card cursor-pointer relative h-full flex flex-col">
        {gig.isUrgent && (
          <span className="badge badge-danger absolute top-4 right-4">
            Urgent
          </span>
        )}

        {/* Category + verified */}
        <div className="flex items-center gap-2 mb-2.5">
          <span className="badge badge-primary">
            {gig.category.replace("_", " ")}
          </span>
          {gig.isProviderVerified && (
            <span className="badge badge-success">✓ Verified</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold mb-1.5 text-on-background">
          {gig.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-on-surface-variant mb-3 line-clamp-2">
          {gig.description}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 text-xs text-outline mt-auto">
          <span>
            📍 {gig.location.suburb}, {gig.location.city}
          </span>
          {gig.distance !== undefined && (
            <span>
              🛤{" "}
              {gig.distance < 1
                ? `${Math.round(gig.distance * 1000)}m`
                : `${gig.distance.toFixed(1)}km`}{" "}
              away
            </span>
          )}
          <span>👤 {gig.providerName}</span>
          <span>⏱ {timeAgo(gig.createdAt)}</span>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-outline-variant/30">
          <span className="font-bold text-lg text-primary">
            {gig.payDisplay}
          </span>
          <span className="text-xs text-outline">
            {gig.applicationCount} applied · {gig.slots} slot
            {gig.slots !== 1 ? "s" : ""}
          </span>
        </div>
      </article>
    </Link>
  );
}

// ── Inner page (uses useSearchParams — must be inside Suspense) ────
function MarketplaceInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Ask for location once
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => {}, // silently ignore
        { timeout: 5000 },
      );
    }
  }, []);

  const fetchGigs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (category) params.set("category", category);
      if (userCoords) {
        params.set("lat", String(userCoords.lat));
        params.set("lng", String(userCoords.lng));
      }
      params.set("page", String(page));
      params.set("limit", "20");

      const res = await fetch(`/api/gigs?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setGigs(data.gigs ?? []);
      setTotal(data.pagination?.total ?? 0);
    } catch {
      setGigs([]);
    } finally {
      setLoading(false);
    }
  }, [query, category, userCoords, page]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  // Sync URL params
  const applyFilter = (newQ: string, newCat: string) => {
    const params = new URLSearchParams();
    if (newQ) params.set("q", newQ);
    if (newCat) params.set("category", newCat);
    router.replace(`/marketplace?${params.toString()}`, { scroll: false });
    setPage(1);
  };

  return (
    <div className="container pt-8 pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-headline text-3xl font-bold">
          Find your next hustle
        </h1>
        <p className="text-on-surface-variant text-sm">
          {userCoords ? "Showing gigs near you" : "Gigs in Gauteng"} · {total}{" "}
          {userCoords ? "Showing gigs near you" : "Gigs in South Africa"} ·{" "}
          {total} available
        </p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-5">
        <input
          type="search"
          className="kasi-input flex-1"
          placeholder="Search gigs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") applyFilter(query, category);
          }}
        />
        <button
          className="btn btn-primary"
          onClick={() => applyFilter(query, category)}
        >
          Search
        </button>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setCategory(cat.value);
              applyFilter(query, cat.value);
            }}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm cursor-pointer whitespace-nowrap transition-all border ${
              category === cat.value
                ? "border-primary bg-primary-container text-primary"
                : "border-outline-variant bg-transparent text-on-surface-variant"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gig grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="kasi-card skeleton h-[180px]" />
          ))}
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          <p className="text-xl mb-3">😕 No gigs found</p>
          <p>Try a different category or search term</p>
          <Link href="/gigs/new" className="btn btn-primary mt-5">
            Post the first gig
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-3 mt-8">
          <button
            className="btn btn-secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Previous
          </button>
          <span className="p-3 text-on-surface-variant text-sm">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <button
            className="btn btn-secondary"
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Shell with Suspense (required for useSearchParams in Next.js) ──
export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="container pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="kasi-card skeleton h-[180px]" />
            ))}
          </div>
        </div>
      }
    >
      <MarketplaceInner />
    </Suspense>
  );
}
