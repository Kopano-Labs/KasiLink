"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface WaterReport {
  _id: string;
  title: string;
  description: string;
  suburb: string;
  type: string;
  status: "pending" | "in_progress" | "resolved" | "dismissed";
  createdAt: string;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-warning/10", text: "text-warning", label: "Under Review" },
  in_progress: { bg: "bg-primary/10", text: "text-primary", label: "In Progress" },
  resolved: { bg: "bg-success/10", text: "text-success", label: "Resolved" },
  dismissed: { bg: "bg-outline/10", text: "text-outline", label: "Dismissed" },
};

export default function MyWaterReportsPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [reports, setReports] = useState<WaterReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }
    if (!isSignedIn) return;

    fetch("/api/water-alerts?mine=true")
      .then((r) => r.json())
      .then((d) => setReports(d.alerts ?? d.waterAlerts ?? []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn, router]);

  const filtered = filter === "all"
    ? reports
    : reports.filter((r) => r.status === filter);

  if (isLoaded && !isSignedIn) return null;

  return (
    <div className="container max-w-screen-md pt-8 pb-12">
      <div className="mb-6">
        <h1 className="font-headline text-3xl font-extrabold tracking-tight">My Water Reports</h1>
        <p className="text-on-surface-variant font-medium mt-1">
          Track your submitted issues and their progress.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-4">
        {[
          { id: "all", label: "All Reports" },
          { id: "in_progress", label: "In Progress" },
          { id: "resolved", label: "Resolved" },
          { id: "pending", label: "Under Review" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              filter === f.id
                ? "bg-primary/10 text-primary border border-primary"
                : "bg-surface-container text-on-surface-variant border border-outline-variant"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-on-surface-variant text-center py-8">Loading your reports...</p>
      ) : filtered.length === 0 ? (
        <div className="kasi-card text-center py-8">
          <p className="text-on-surface-variant mb-3">
            {filter === "all"
              ? "You haven't submitted any water reports yet."
              : `No ${filter.replace("_", " ")} reports.`}
          </p>
          <Link href="/water-outages" className="btn btn-primary btn-sm">
            Report a Water Issue
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((report) => {
            const style = STATUS_STYLES[report.status] ?? STATUS_STYLES.pending;
            return (
              <div
                key={report._id}
                className="kasi-card flex items-center justify-between hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${style.bg} flex items-center justify-center text-lg`}>
                    💧
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{report.title}</h3>
                    <p className="text-on-surface-variant text-sm">
                      {report.suburb} · {new Date(report.createdAt).toLocaleDateString("en-ZA", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span className={`${style.bg} ${style.text} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0`}>
                  {style.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
