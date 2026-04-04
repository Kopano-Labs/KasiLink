"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface CommunityEvent {
  _id: string;
  type: "job_fair" | "market" | "meeting" | "awareness" | "social" | "other";
  title: string;
  description: string;
  suburb: string;
  date: string;
  time: string;
}

const TYPE_LABELS: Record<CommunityEvent["type"], string> = {
  job_fair: "Job Fair",
  market: "Market",
  meeting: "Meeting",
  awareness: "Awareness",
  social: "Social",
  other: "Other",
};

export default function CommunityCalendarPage() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [suburb, setSuburb] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams();
    if (suburb) params.set("suburb", suburb);
    if (type && type !== "all") params.set("type", type);

    fetch(`/api/community-calendar?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setEvents(data.events ?? []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [suburb, type]);

  const filteredSuburbs = useMemo(
    () => ["All", ...new Set(events.map((event) => event.suburb))],
    [events],
  );

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Community Calendar</h1>
          <p className="text-on-surface-variant">
            Local events, meetups, and opportunities near you.
          </p>
        </div>
        <Link href="/community-calendar/new" className="btn btn-primary btn-sm">
          Add Event
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <select
          className="kasi-input max-w-[220px]"
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
        >
          <option value="">All suburbs</option>
          {filteredSuburbs
            .filter((value) => value !== "All")
            .map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
        </select>
        <select
          className="kasi-input max-w-[220px]"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="all">All types</option>
          <option value="job_fair">Job Fair</option>
          <option value="market">Market</option>
          <option value="meeting">Meeting</option>
          <option value="awareness">Awareness</option>
          <option value="social">Social</option>
          <option value="other">Other</option>
        </select>
      </div>

      {loading ? (
        <div className="kasi-card py-10 text-center text-on-surface-variant">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="kasi-card py-10 text-center text-on-surface-variant">
          No upcoming events in this area. Be the first to add one.
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event._id} className="kasi-card">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <span className="badge badge-primary mb-1 text-xs">
                    {TYPE_LABELS[event.type]}
                  </span>
                  <h2 className="text-lg font-bold">{event.title}</h2>
                </div>
                <div className="shrink-0 text-right text-sm text-on-surface-variant">
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                  <p>{event.time}</p>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant">{event.description}</p>
              <p className="mt-2 text-xs text-outline">{event.suburb}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
