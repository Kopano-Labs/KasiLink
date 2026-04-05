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

const CITY_OPTIONS = ["", "Johannesburg", "Cape Town"];
const RADIUS_OPTIONS = ["5", "10", "25", "50"];

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
  const [suburb, setSuburb] = useState(searchParams.get("suburb") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [radius, setRadius] = useState(searchParams.get("radius") ?? "10");
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
      if (suburb) params.set("suburb", suburb);
      if (city) params.set("city", city);
      if (radius) params.set("radius", radius);
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
  }, [query, category, suburb, city, radius, userCoords, page]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  // Sync URL params
  const applyFilter = (
    newQ: string,
    newCat: string,
    newSuburb: string,
    newCity: string,
    newRadius: string,
  ) => {
    const params = new URLSearchParams();
    if (newQ) params.set("q", newQ);
    if (newCat) params.set("category", newCat);
    if (newSuburb) params.set("suburb", newSuburb);
    if (newCity) params.set("city", newCity);
    if (newRadius) params.set("radius", newRadius);
    router.replace(`/marketplace?${params.toString()}`, { scroll: false });
    setPage(1);
  };

  return (
    <div className="container pt-8 pb-12">
      <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="mb-2 font-headline text-3xl font-bold">
            Find your next hustle
          </h1>
          <p className="text-on-surface-variant text-sm">
            {userCoords ? "Showing gigs near you" : "Gigs in South Africa"} ·{" "}
            {total} available
          </p>
        </div>
        <div className="kasi-card bg-surface-container-low min-w-[260px]">
          <p className="text-xs uppercase tracking-wider text-outline mb-1">
            Marketplace Goals
          </p>
          <p className="text-sm text-on-surface-variant">
            Browse by category, react to urgent work, and keep travel distance low.
          </p>
        </div>
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
            if (e.key === "Enter")
              applyFilter(query, category, suburb, city, radius);
          }}
        />
        <button
          className="btn btn-primary"
          onClick={() => applyFilter(query, category, suburb, city, radius)}
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr_0.7fr] gap-3 mb-5">
        <input
          type="text"
          className="kasi-input"
          placeholder="Filter by suburb or township"
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
          onBlur={() => applyFilter(query, category, suburb, city, radius)}
        />
        <select
          className="kasi-input"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            applyFilter(query, category, suburb, e.target.value, radius);
          }}
        >
          <option value="">All cities</option>
          {CITY_OPTIONS.filter(Boolean).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          className="kasi-input"
          value={radius}
          onChange={(e) => {
            setRadius(e.target.value);
            applyFilter(query, category, suburb, city, e.target.value);
          }}
        >
          {RADIUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option} km radius
            </option>
          ))}
        </select>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setCategory(cat.value);
              applyFilter(query, cat.value, suburb, city, radius);
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <div className="kasi-card bg-surface-container-low">
          <p className="text-xs uppercase tracking-wider text-outline mb-1">
            Search
          </p>
          <p className="text-sm text-on-surface-variant">
            Search by work type, suburb, or employer signal.
          </p>
        </div>
        <div className="kasi-card bg-surface-container-low">
          <p className="text-xs uppercase tracking-wider text-outline mb-1">
            Distance
          </p>
          <p className="text-sm text-on-surface-variant">
            Prioritize jobs that reduce transport cost and time.
          </p>
        </div>
        <div className="kasi-card bg-surface-container-low">
          <p className="text-xs uppercase tracking-wider text-outline mb-1">
            Trust
          </p>
          <p className="text-sm text-on-surface-variant">
            Verified providers and reviews are visible before you engage.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {suburb && (
          <span className="badge badge-secondary">Suburb: {suburb}</span>
        )}
        {city && <span className="badge badge-secondary">City: {city}</span>}
        {userCoords && (
          <span className="badge badge-primary">Nearby within {radius} km</span>
        )}
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
          <p className="mt-2 text-xs text-outline">
            If this keeps happening, loosen the suburb or radius filter first.
          </p>
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
