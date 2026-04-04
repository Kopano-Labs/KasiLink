"use client";

import { useState, useEffect } from "react";

interface Outage {
  id: number;
  suburb: string;
  status: "dry" | "low_pressure" | "restored";
  reportedAt: string;
  reports: number;
}

interface WaterAlert {
  _id: string;
  title: string;
  description: string;
  suburb: string;
  createdAt: string;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function WaterOutagePage() {
  const [outages, setOutages] = useState<Outage[]>([
    {
      id: 1,
      suburb: "Khayelitsha Zone 2",
      status: "dry",
      reportedAt: "10 mins ago",
      reports: 14,
    },
    {
      id: 2,
      suburb: "Soweto (Orlando West)",
      status: "low_pressure",
      reportedAt: "1 hour ago",
      reports: 5,
    },
    {
      id: 3,
      suburb: "Tembisa",
      status: "restored",
      reportedAt: "2 hours ago",
      reports: 0,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ suburb: "", issue: "dry" });
  const [loadStage, setLoadStage] = useState<number>(0);
  const [loadStatus, setLoadStatus] = useState<string>("Checking...");
  const [alerts, setAlerts] = useState<WaterAlert[]>([]);
  const [alertSuburb, setAlertSuburb] = useState("");
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  useEffect(() => {
    const fetchStage = async () => {
      try {
        const res = await fetch("/api/load-shedding");
        if (res.ok) {
          const data = await res.json();
          setLoadStage(data.stage ?? 0);
          setLoadStatus(data.status ?? "Unknown");
        }
      } catch {
        setLoadStatus("Status unavailable");
      }
    };
    fetchStage();
    const id = setInterval(fetchStage, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (alertSuburb) params.set("suburb", alertSuburb);
    fetch(`/api/water-alerts?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setAlerts(data.alerts ?? []))
      .catch(() => setAlerts([]))
      .finally(() => setLoadingAlerts(false));
  }, [alertSuburb]);

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.suburb) return;

    setOutages([
      {
        id: Date.now(),
        suburb: form.suburb,
        status: form.issue as "dry" | "low_pressure",
        reportedAt: "Just now",
        reports: 1,
      },
      ...outages,
    ]);

    setForm({ suburb: "", issue: "dry" });
    setShowForm(false);
  };

  return (
    <div className="container pt-8 pb-12 max-w-3xl mx-auto">
      <div
        className={`kasi-card mb-6 border-2 ${loadStage > 0 ? "border-error bg-error-container/20" : "border-primary bg-primary-container/20"}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{loadStage > 0 ? "⚡" : "✅"}</span>
          <div>
            <p className="font-bold text-lg">{loadStatus}</p>
            <p className="text-sm text-on-surface-variant">
              Live Eskom status — updates every 5 minutes
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <span className="inline-block mb-2 px-3 py-1 rounded-full bg-danger/20 text-danger font-semibold text-xs tracking-wider uppercase">
            Live Tracker
          </span>
          <h1 className="font-headline text-3xl font-bold mb-2">
            Water Outage Alerts
          </h1>
          <p className="text-on-surface-variant text-sm">
            Community-reported dry taps and low pressure zones.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-danger"
        >
          {showForm ? "Cancel" : "Report Dry Tap"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleReport}
          className="kasi-card mb-8 animate-in fade-in slide-in-from-top-4 border-danger/50 bg-danger/5"
        >
          <h2 className="font-bold text-lg mb-4 text-danger">
            Report an Outage
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="label">Location / Suburb</label>
              <input
                type="text"
                className="kasi-input"
                placeholder="e.g. Khayelitsha Site C"
                value={form.suburb}
                onChange={(e) => setForm({ ...form, suburb: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Issue Type</label>
              <select
                className="kasi-input"
                value={form.issue}
                onChange={(e) => setForm({ ...form, issue: e.target.value })}
              >
                <option value="dry">Completely Dry Taps</option>
                <option value="low_pressure">Very Low Pressure</option>
              </select>
            </div>
            <button type="submit" className="btn btn-danger self-end mt-2">
              Submit Report
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {outages.map((outage) => (
          <div
            key={outage.id}
            className="kasi-card flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl shrink-0 mt-1">
                {outage.status === "dry"
                  ? "Dry"
                  : outage.status === "low_pressure"
                    ? "Low"
                    : "OK"}
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-background">
                  {outage.suburb}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      outage.status === "dry"
                        ? "bg-danger text-on-danger"
                        : outage.status === "low_pressure"
                          ? "bg-warning text-black"
                          : "bg-success text-on-success"
                    }`}
                  >
                    {outage.status === "dry"
                      ? "Dry Taps"
                      : outage.status === "low_pressure"
                        ? "Low Pressure"
                        : "Restored"}
                  </span>
                  <span className="text-xs text-outline">
                    {outage.reportedAt}
                  </span>
                </div>
              </div>
            </div>

            {outage.status !== "restored" && (
              <div className="flex items-center gap-2 md:self-end bg-surface-variant px-3 py-2 rounded-lg shrink-0">
                <span className="text-sm font-bold text-danger">
                  {outage.reports}
                </span>
                <span className="text-xs text-on-surface-variant">reports</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Scheduled Outages Section */}
      <section className="mt-10">
        <h2 className="font-headline text-2xl font-bold mb-4">
          Scheduled Outages
        </h2>
        <p className="text-on-surface-variant text-sm mb-4">
          Water and electricity outages reported by the community. Filter by
          suburb to see your area.
        </p>
        <div className="flex gap-3 mb-4 flex-wrap">
          <input
            className="kasi-input max-w-[180px]"
            placeholder="Filter by suburb"
            value={alertSuburb}
            onChange={(e) => setAlertSuburb(e.target.value)}
          />
        </div>
        {loadingAlerts ? (
          <p className="text-on-surface-variant">Loading outage reports...</p>
        ) : alerts.length === 0 ? (
          <div className="kasi-card text-center">
            <p className="text-on-surface-variant">
              No reported outages in this area.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {alerts.map((alert) => (
              <div key={alert._id} className="kasi-card border-l-4 border-error">
                <h3 className="font-bold">{alert.title}</h3>
                <p className="text-sm text-on-surface-variant mt-1">
                  {alert.description}
                </p>
                <p className="text-xs text-outline mt-2">
                  {alert.suburb} · {timeAgo(alert.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
