"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MyWaterReportsPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isSignedIn || !user) return;
    fetch(`/api/water-alerts`)
      .then((res) => res.json())
      .then((data) => {
        const myReports = (data.alerts || []).filter(
          (a: any) => a.reporterId === user.id,
        );
        setReports(myReports);
      })
      .finally(() => setLoading(false));
  }, [isSignedIn, user]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div className="container max-w-screen-md pt-8 pb-12">
      <h1 className="font-headline text-3xl font-bold mb-2">
        My Water Reports
      </h1>
      <p className="text-on-surface-variant text-sm mb-8">
        Outages you have reported to the community.
      </p>
      {loading ? (
        <div className="py-10 text-center text-on-surface-variant">
          Loading reports...
        </div>
      ) : reports.length === 0 ? (
        <div className="kasi-card text-center py-10 text-on-surface-variant">
          <p className="mb-4">You haven&apos;t reported any outages yet.</p>
          <Link href="/water-outages" className="btn btn-primary">
            Report an Outage
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <div
              key={report._id}
              className={`kasi-card border-l-4 ${report.resolved ? "border-success" : "border-warning"} flex justify-between`}
            >
              <div className="flex flex-col">
                <h3 className="font-bold text-lg">{report.title}</h3>
                <p className="text-sm text-on-surface-variant line-clamp-2 mt-1">
                  {report.description}
                </p>
                <div className="mt-3 text-xs text-outline flex gap-2">
                  <span>📍 {report.suburb}</span>
                  <span>·</span>
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span
                  className={`badge ${report.resolved ? "badge-success" : "badge-warning"}`}
                >
                  {report.resolved ? "Resolved" : "Active"}
                </span>
                <button
                  className="btn btn-outline btn-sm text-xs mt-auto"
                  onClick={() =>
                    alert("Contact the community to mark this resolved.")
                  }
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
