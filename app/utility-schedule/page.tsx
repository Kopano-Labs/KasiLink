"use client";

import { useEffect, useMemo, useState } from "react";

interface Schedule {
  _id: string;
  type: "power" | "water";
  title: string;
  description: string;
  suburb: string;
  zone: string;
  startTime: string;
  endTime: string;
  stage: number | null;
  status: "confirmed" | "estimated" | "cancelled";
  source: string;
}

function timeUntil(iso: string, now: number): string {
  const diff = new Date(iso).getTime() - now;
  if (diff <= 0) return "Now";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
}

function formatDay(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" });
}

function durationHours(start: string, end: string): string {
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / 3600000;
  return diff === 1 ? "1 hour" : `${diff.toFixed(1)} hours`;
}

export default function UtilitySchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [suburb, setSuburb] = useState("");
  const [type, setType] = useState("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const params = new URLSearchParams();
    if (suburb) params.set("suburb", suburb);
    if (type) params.set("type", type);
    fetch(`/api/utility-schedule?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setSchedules(d.schedules ?? []))
      .catch(() => setSchedules([]))
      .finally(() => setLoading(false));
  }, [suburb, type]);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(tick);
  }, []);

  const grouped = useMemo(() => {
    const nextGroups: Record<string, Schedule[]> = {};
    for (const s of schedules) {
      const day = formatDay(s.startTime);
      if (!nextGroups[day]) nextGroups[day] = [];
      nextGroups[day].push(s);
    }
    return nextGroups;
  }, [schedules]);

  const next = useMemo(
    () =>
      schedules.find((s) => new Date(s.startTime).getTime() > now) ?? null,
    [schedules, now],
  );

  return (
    <div className="container max-w-screen-lg pt-8 pb-12">
      {/* Hero */}
      <div className="kasi-card bg-primary/5 border-primary/20 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-on-surface-variant text-sm italic mb-1">
            {suburb || "Your Area"}
          </p>
          <h1 className="font-headline text-3xl font-extrabold mb-4">Utility Schedule</h1>
          {next ? (
            <div className="inline-flex items-center gap-3 bg-background/60 backdrop-blur-sm rounded-lg p-4">
              <span className="text-xl">
                {next.type === "power" ? "⚡" : "💧"}
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-on-surface-variant">
                  Next Outage In
                </p>
                <p className="text-2xl font-extrabold text-primary">
                  {timeUntil(next.startTime, now)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-on-surface-variant">No upcoming outages scheduled.</p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-headline font-bold text-xl flex items-center gap-2">
          Next 48 Hours
        </h2>
        <div className="flex gap-2 flex-wrap">
          <input
            className="kasi-input max-w-[180px]"
            placeholder="Filter by suburb"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
          />
          <button
            className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${
              type === "power"
                ? "bg-warning/20 text-warning border-warning"
                : "bg-surface-container text-on-surface-variant border-outline-variant"
            }`}
            onClick={() => setType(type === "power" ? "" : "power")}
          >
            ⚡ Power
          </button>
          <button
            className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${
              type === "water"
                ? "bg-primary/20 text-primary border-primary"
                : "bg-surface-container text-on-surface-variant border-outline-variant"
            }`}
            onClick={() => setType(type === "water" ? "" : "water")}
          >
            💧 Water
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-on-surface-variant text-center py-8">Loading schedule...</p>
      ) : schedules.length === 0 ? (
        <div className="kasi-card text-center">
          <p className="text-on-surface-variant">No utility outages scheduled for this area in the next 48 hours.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([day, items]) => (
            <div key={day}>
              <div className="border-b border-outline-variant pb-2 mb-4">
                <span className="font-bold text-on-surface-variant">{day}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((s) => (
                  <div
                    key={s._id}
                    className={`kasi-card border-l-4 ${
                      s.type === "power" ? "border-l-warning" : "border-l-primary"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                          s.type === "power" ? "bg-warning/10" : "bg-primary/10"
                        }`}>
                          {s.type === "power" ? "⚡" : "💧"}
                        </div>
                        <div>
                          <h3 className="font-bold">{s.title}</h3>
                          {s.description && (
                            <p className="text-sm text-on-surface-variant line-clamp-1">{s.description}</p>
                          )}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded shrink-0 ${
                        s.status === "confirmed"
                          ? "bg-error/10 text-error"
                          : "bg-surface-container text-on-surface-variant"
                      }`}>
                        {s.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className={`text-xl font-extrabold ${
                          s.type === "power" ? "text-warning" : "text-primary"
                        }`}>
                          {formatTime(s.startTime)} - {formatTime(s.endTime)}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          Duration: {durationHours(s.startTime, s.endTime)}
                          {s.stage && ` · Stage ${s.stage}`}
                          {s.zone && ` · ${s.zone}`}
                        </p>
                      </div>
                      <span className="text-xs text-outline">{s.suburb}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Providers */}
      <section className="mt-10">
        <h3 className="font-headline font-bold text-lg mb-4">Service Providers</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { name: "Eskom Direct", color: "bg-warning" },
            { name: "Joburg Water", color: "bg-primary" },
            { name: "City Power", color: "bg-outline" },
            { name: "Cape Town Water", color: "bg-primary" },
          ].map((p) => (
            <div key={p.name} className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full">
              <div className={`w-4 h-4 rounded-full ${p.color}`} />
              <span className="text-sm font-bold">{p.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
