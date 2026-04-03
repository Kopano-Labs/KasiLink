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
    <Link
      href={`/gigs/${gig._id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <article
        className="kasi-card"
        style={{ cursor: "pointer", position: "relative" }}
      >
        {gig.isUrgent && (
          <span
            className="badge badge-danger"
            style={{ position: "absolute", top: 16, right: 16 }}
          >
            Urgent
          </span>
        )}

        {/* Category + verified */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span className="badge badge-primary">{gig.category.replace("_", " ")}</span>
          {gig.isProviderVerified && (
            <span className="badge badge-success">✓ Verified</span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: "var(--font-size-lg)", marginBottom: 6, color: "var(--text-primary)" }}>
          {gig.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: "var(--font-size-sm)",
          color: "var(--text-secondary)",
          marginBottom: 12,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {gig.description}
        </p>

        {/* Meta row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: "var(--font-size-xs)", color: "var(--text-tertiary)" }}>
          <span>📍 {gig.location.suburb}, {gig.location.city}</span>
          {gig.distance !== undefined && (
            <span>🛤 {gig.distance < 1 ? `${Math.round(gig.distance * 1000)}m` : `${gig.distance.toFixed(1)}km`} away</span>
          )}
          <span>👤 {gig.providerName}</span>
          <span>⏱ {timeAgo(gig.createdAt)}</span>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginTop: 16, paddingTop: 12,
          borderTop: "1px solid var(--border-subtle)",
        }}>
          <span style={{ fontWeight: 700, fontSize: "var(--font-size-lg)", color: "var(--primary)" }}>
            {gig.payDisplay}
          </span>
          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-tertiary)" }}>
            {gig.applicationCount} applied · {gig.slots} slot{gig.slots !== 1 ? "s" : ""}
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
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Ask for location once
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
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

  useEffect(() => { fetchGigs(); }, [fetchGigs]);

  // Sync URL params
  const applyFilter = (newQ: string, newCat: string) => {
    const params = new URLSearchParams();
    if (newQ) params.set("q", newQ);
    if (newCat) params.set("category", newCat);
    router.replace(`/marketplace?${params.toString()}`, { scroll: false });
    setPage(1);
  };

  return (
    <div className="container" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-12)" }}>

      {/* Header */}
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ marginBottom: "var(--space-2)" }}>Find your next hustle</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>
          {userCoords ? "Showing gigs near you" : "Gigs in Gauteng"} · {total} available
        </p>
      </div>

      {/* Search bar */}
      <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
        <input
          type="search"
          className="input"
          placeholder="Search gigs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") applyFilter(query, category); }}
          style={{ flex: 1 }}
        />
        <button
          className="btn btn-primary"
          onClick={() => applyFilter(query, category)}
        >
          Search
        </button>
      </div>

      {/* Category chips */}
      <div
        style={{
          display: "flex", gap: "var(--space-2)", overflowX: "auto",
          paddingBottom: "var(--space-2)", marginBottom: "var(--space-6)",
        }}
        className="no-scrollbar"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => { setCategory(cat.value); applyFilter(query, cat.value); }}
            style={{
              flexShrink: 0,
              padding: "6px 16px",
              borderRadius: "var(--radius-full)",
              border: `1px solid ${category === cat.value ? "var(--primary)" : "var(--border-default)"}`,
              background: category === cat.value ? "var(--primary-subtle)" : "transparent",
              color: category === cat.value ? "var(--primary)" : "var(--text-secondary)",
              fontSize: "var(--font-size-sm)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all var(--transition-fast)",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gig grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-4)" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="kasi-card skeleton" style={{ height: 180 }} />
          ))}
        </div>
      ) : gigs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--space-12) 0", color: "var(--text-secondary)" }}>
          <p style={{ fontSize: "var(--font-size-xl)", marginBottom: "var(--space-3)" }}>😕 No gigs found</p>
          <p>Try a different category or search term</p>
          <Link href="/gigs/new" className="btn btn-primary" style={{ marginTop: "var(--space-5)" }}>
            Post the first gig
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-4)" }}>
          {gigs.map((gig) => <GigCard key={gig._id} gig={gig} />)}
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-3)", marginTop: "var(--space-8)" }}>
          <button
            className="btn btn-secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Previous
          </button>
          <span style={{ padding: "var(--space-3)", color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>
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
    <Suspense fallback={
      <div className="container" style={{ paddingTop: "var(--space-8)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-4)" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="kasi-card skeleton" style={{ height: 180 }} />
          ))}
        </div>
      </div>
    }>
      <MarketplaceInner />
    </Suspense>
  );
}
