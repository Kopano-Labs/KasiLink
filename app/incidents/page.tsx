"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Incident {
  _id: string;
  type: string;
  title: string;
  description: string;
  suburb: string;
  severity: "low" | "medium" | "high";
  reporterName: string;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  safety: "Safety",
  load_shedding: "Load Shedding",
  water_outage: "Water Outage",
  road: "Road",
  other: "Other",
};

const SEVERITY_CLASSES: Record<string, string> = {
  high: "badge-danger",
  medium: "badge-warning",
  low: "badge-success",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [suburb, setSuburb] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (suburb) params.set("suburb", suburb);
    if (type) params.set("type", type);
    setLoading(true);
    fetch(`/api/incidents?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setIncidents(d.incidents ?? []))
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false));
  }, [suburb, type]);

  return (
    <div className="container max-w-screen-md pt-8 pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-3xl font-bold">Community Incidents</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Safety alerts, utility outages, and road issues reported by the community.
          </p>
        </div>
        <Link href="/incidents/new" className="btn btn-primary btn-sm">
          Report Incident
        </Link>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          className="kasi-input max-w-[180px]"
          placeholder="Filter by suburb"
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
        />
        <select
          className="kasi-input max-w-[200px]"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All types</option>
          {Object.entries(TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-on-surface-variant text-center py-8">Loading incidents...</p>
      ) : incidents.length === 0 ? (
        <div className="kasi-card text-center">
          <p className="text-on-surface-variant mb-3">No active incidents in this area.</p>
          <Link href="/incidents/new" className="btn btn-primary btn-sm">Report One</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {incidents.map((incident) => (
            <div key={incident._id} className="kasi-card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wide">
                    {TYPE_LABELS[incident.type] ?? incident.type}
                  </span>
                  <h2 className="font-bold text-lg">{incident.title}</h2>
                </div>
                <span className={`badge ${SEVERITY_CLASSES[incident.severity] ?? "badge-success"} shrink-0`}>
                  {incident.severity}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant mb-3 line-clamp-3">
                {incident.description}
              </p>
              <div className="flex gap-3 text-xs text-outline flex-wrap">
                <span>{incident.suburb}</span>
                <span>·</span>
                <span>Reported by {incident.reporterName}</span>
                <span>·</span>
                <span>{timeAgo(incident.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
