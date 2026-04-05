"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface StatusData {
  powerStage: number;
  powerStatus: string;
  waterAlerts: number;
  activeIncidents: number;
  lastUpdated: string;
}

export default function CommunityStatusPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [lsRes, incRes, waterRes] = await Promise.all([
          fetch("/api/load-shedding").then((r) => r.json()).catch(() => null),
          fetch("/api/incidents?limit=1").then((r) => r.json()).catch(() => null),
          fetch("/api/water-alerts?limit=1").then((r) => r.json()).catch(() => null),
        ]);

        setData({
          powerStage: lsRes?.stage ?? 0,
          powerStatus: lsRes?.status ?? "Status unavailable",
          waterAlerts: waterRes?.total ?? waterRes?.alerts?.length ?? 0,
          activeIncidents: incRes?.total ?? 0,
          lastUpdated: new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }),
        });
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container max-w-screen-lg pt-8 pb-12">
        <p className="text-on-surface-variant text-center py-12">Loading community status...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-lg pt-8 pb-12">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight">Community Status</h1>
        <p className="text-on-surface-variant font-medium mt-1">
          Live updates for your local neighborhood
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Power Status — Large Card */}
        <div className="md:col-span-8 kasi-card relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                Utility Status
              </span>
              <h2 className="text-3xl font-extrabold mt-4">Current Power Status</h2>
              <p className={`text-xl font-medium flex items-center gap-2 mt-2 ${
                (data?.powerStage ?? 0) > 0 ? "text-error" : "text-success"
              }`}>
                ⚡ {data?.powerStage && data.powerStage > 0
                  ? `Load-shedding Stage ${data.powerStage}`
                  : "No load-shedding"}
              </p>
              <p className="text-on-surface-variant mt-4 max-w-sm">
                {data?.powerStatus ?? "Status unavailable"}
              </p>
            </div>
            {(data?.powerStage ?? 0) >= 4 && (
              <div className="bg-error/10 text-error px-4 py-2 rounded-full font-bold text-sm">
                High Alert
              </div>
            )}
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-outline">
            🕐 Updated {data?.lastUpdated}
          </div>
        </div>

        {/* Quick Stats — Side Card */}
        <div className="md:col-span-4 kasi-card bg-primary/5 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mt-2">Quick Stats</h3>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-outline">
              Source: live utility and incident feeds
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Active Incidents</span>
                <span className="font-bold">{data?.activeIncidents ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Water Alerts</span>
                <span className="font-bold">{data?.waterAlerts ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Power Stage</span>
                <span className="font-bold">{data?.powerStage ?? 0}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-outline-variant/30">
            <div className="flex justify-between text-sm font-bold">
              <span>Community Safety</span>
              <span>{(data?.activeIncidents ?? 0) < 3 ? "94%" : "72%"}</span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full mt-2">
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: (data?.activeIncidents ?? 0) < 3 ? "94%" : "72%" }}
              />
            </div>
          </div>
        </div>

        {/* Water Alerts */}
        <div className="md:col-span-6 kasi-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg">
              💧
            </div>
            <div>
              <h3 className="font-bold text-xl">Water Alerts</h3>
              <p className="text-on-surface-variant text-sm">Recent water issues</p>
            </div>
          </div>
          <p className="text-on-surface-variant mb-4">
            Check the water outages page for the latest updates on pipe bursts, low pressure, and scheduled maintenance.
          </p>
          <Link href="/water-outages" className="btn btn-primary btn-sm">
            View Water Alerts
          </Link>
        </div>

        {/* Safety Incidents */}
        <div className="md:col-span-6 kasi-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-lg">
              🚨
            </div>
            <div>
              <h3 className="font-bold text-xl">Safety Incidents</h3>
              <p className="text-on-surface-variant text-sm">{data?.activeIncidents ?? 0} active</p>
            </div>
          </div>
          <p className="text-on-surface-variant mb-4">
            Community-reported safety concerns, road issues, and other incidents in your area.
          </p>
          <Link href="/incidents" className="btn btn-primary btn-sm">
            View Incidents
          </Link>
        </div>

        {/* Utility Schedule Link */}
        <div className="md:col-span-12 kasi-card bg-on-background text-background relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold">Utility Schedule</h3>
              <p className="text-sm opacity-80">See all upcoming power and water outages in a timeline view.</p>
            </div>
            <Link href="/utility-schedule" className="btn btn-primary btn-sm shrink-0">
              View Schedule
            </Link>
          </div>
        </div>
      </div>

      {/* Service Providers */}
      <section className="mt-10">
        <h3 className="font-headline font-bold text-lg mb-4">Emergency Contacts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: "Eskom Helpline", number: "0860 037 566", icon: "⚡" },
            { name: "Joburg Water", number: "011 688 1400", icon: "💧" },
            { name: "SAPS Emergency", number: "10111", icon: "🚔" },
          ].map((c) => (
            <div key={c.name} className="kasi-card flex items-center gap-3">
              <span className="text-xl">{c.icon}</span>
              <div>
                <p className="font-bold text-sm">{c.name}</p>
                <a href={`tel:${c.number.replace(/\s/g, "")}`} className="text-primary text-sm font-mono">
                  {c.number}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
