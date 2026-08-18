"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Zap, MapPin, Clock, Users, TrendingUp, ExternalLink, RefreshCw } from "lucide-react";

interface Gig {
  _id: string;
  title: string;
  category: string;
  payDisplay: string;
  isUrgent: boolean;
  applicationCount: number;
  createdAt: string;
  location?: { suburb?: string; city?: string };
}

interface Stats {
  total: number;
  urgent: number;
  suburbs: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  car_wash: "Car Wash", cleaning: "Cleaning", tutoring: "Tutoring",
  repairs: "Repairs", delivery: "Delivery", handyman: "Handyman",
  solar: "Solar / Electricity", retail: "Retail / Shop",
  construction: "Construction", healthcare: "Healthcare",
  logistics: "Logistics", other: "Other",
};

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function DemoLeaderboard() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, urgent: 0, suburbs: 0 });
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [pulse, setPulse] = useState(false);
  const [newGigIds, setNewGigIds] = useState<Set<string>>(new Set());
  const gigsRef = useRef<Gig[]>([]);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchGigs = useCallback(async () => {
    try {
      const res = await fetch("/api/gigs?limit=12&status=open");
      if (!res.ok) return;
      const data = await res.json();
      const fetched: Gig[] = data.gigs ?? [];

      // Compare against the latest committed feed without forcing a state update
      // solely to expose previous values to the polling callback.
      const prevIds = new Set(gigsRef.current.map((g) => g._id));
      const fresh = new Set(fetched.filter((g) => !prevIds.has(g._id)).map((g) => g._id));
      if (fresh.size > 0) {
        setPulse(true);
        setNewGigIds(fresh);
        if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
        pulseTimerRef.current = setTimeout(() => {
          setPulse(false);
          setNewGigIds(new Set());
          pulseTimerRef.current = null;
        }, 3000);
      }

      gigsRef.current = fetched;
      setGigs(fetched);
      setStats({
        total: data.total ?? fetched.length,
        urgent: fetched.filter((g) => g.isUrgent).length,
        suburbs: new Set(fetched.map((g) => g.location?.suburb).filter(Boolean)).size,
      });
      setLastRefresh(new Date());
    } catch {
      // silent — leaderboard is best-effort
    }
  }, []);

  useEffect(() => {
    // Polling is an external-system subscription. Defer the first request to the
    // timer callback so the effect itself never synchronously cascades state.
    const initialId = window.setTimeout(() => void fetchGigs(), 0);
    const intervalId = window.setInterval(() => void fetchGigs(), 12000);

    return () => {
      window.clearTimeout(initialId);
      window.clearInterval(intervalId);
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, [fetchGigs]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#4595C0] shadow-[0_0_24px_rgba(69,149,192,0.5)]">
            <Zap size={18} fill="white" className="text-white" />
          </div>
          <div>
            <span className="block text-xl font-black tracking-tight">
              Kasi<span className="text-[#4595C0]">Link</span>
            </span>
            <span className="block text-[9px] uppercase tracking-[0.25em] text-white/40">
              Live Gig Feed · Cape Town 2.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">Intelligence by</p>
            <a
              href="https://github.com/RobynAwesome/Introduction-to-MCP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#4595C0] hover:underline"
            >
              Kopano Context <ExternalLink size={9} />
            </a>
          </div>
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <RefreshCw size={11} className={pulse ? "animate-spin text-[#4595C0]" : ""} />
            {lastRefresh.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
        </div>
      </header>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-px bg-white/5 border-b border-white/10">
        {[
          { icon: <TrendingUp size={14} />, label: "Live gigs", value: stats.total },
          { icon: <Clock size={14} />, label: "Urgent now", value: stats.urgent },
          { icon: <MapPin size={14} />, label: "Active suburbs", value: stats.suburbs },
        ].map((s) => (
          <div key={s.label} className="bg-[#050505] px-8 py-5 flex items-center gap-3">
            <span className="text-[#4595C0]">{s.icon}</span>
            <div>
              <p className="text-3xl font-black leading-none tabular-nums">{s.value}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gig grid */}
      <div className="flex-1 p-8">
        {gigs.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-white/20 text-sm">
            Connecting to live feed…
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {gigs.map((gig, i) => {
              const isNew = newGigIds.has(gig._id);
              return (
                <div
                  key={gig._id}
                  className={`rounded-2xl border p-4 transition-all duration-700 ${
                    isNew
                      ? "border-[#4595C0] bg-[#4595C0]/10 shadow-[0_0_20px_rgba(69,149,192,0.3)]"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-bold leading-snug line-clamp-2">{gig.title}</p>
                    {gig.isUrgent && (
                      <span className="shrink-0 rounded-md bg-red-500/20 border border-red-500/40 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-red-400">
                        Urgent
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-white/40">
                    {gig.location?.suburb && (
                      <span className="flex items-center gap-1">
                        <MapPin size={9} />
                        {gig.location.suburb}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={9} />
                      {timeAgo(gig.createdAt)}
                    </span>
                    {gig.applicationCount > 0 && (
                      <span className="flex items-center gap-1 text-[#4595C0]">
                        <Users size={9} />
                        {gig.applicationCount} applied
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded-lg bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-widest text-white/50">
                      {CATEGORY_LABELS[gig.category] ?? gig.category}
                    </span>
                    <span className="text-xs font-bold text-[#4595C0]">{gig.payDisplay}</span>
                  </div>

                  {isNew && (
                    <div className="mt-2 text-[9px] font-black uppercase tracking-widest text-[#4595C0] animate-pulse">
                      ● Just posted
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-4 flex items-center justify-between">
        <p className="text-[10px] text-white/20">
          A Kopano Labs product · kasilink.com
        </p>
        <p className="text-[10px] text-white/20">
          Auto-refreshes every 12 seconds · No CV required · Works on any phone
        </p>
      </footer>
    </div>
  );
}
