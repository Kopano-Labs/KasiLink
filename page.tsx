// ALERT: This file was accidentally created in the root directory!
// Please move this file to: c:\Users\rkhol\kasi-link\app\applications\page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

interface Application {
  _id: string;
  gigTitle: string;
  gigId: string;
  status: string;
  createdAt: string;
}

export default function ApplicationsPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => setApplications(data.applications || []))
      .finally(() => setLoading(false));
  }, [isSignedIn]);

  if (isLoaded && !isSignedIn) {
    return (
      <div className="container pt-8 pb-12 text-center">
        <h1 className="mb-6 font-headline text-3xl font-bold">Applications</h1>
        <p className="text-on-surface-variant mb-4">
          Please sign in to view your applications.
        </p>
        <Link href="/sign-in" className="btn btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container pt-8 pb-12">
      <h1 className="mb-6 font-headline text-3xl font-bold">My Applications</h1>
      {loading ? (
        <div className="text-center text-on-surface-variant py-12">
          Loading...
        </div>
      ) : applications.length === 0 ? (
        <div className="kasi-card text-center text-on-surface-variant py-12">
          <p className="mb-4">You haven&apos;t applied to any gigs yet.</p>
          <Link href="/marketplace" className="btn btn-primary">
            Browse Gigs
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="kasi-card flex justify-between items-center flex-wrap gap-4 hover:border-primary transition-colors"
            >
              <div>
                <Link
                  href={`/gigs/${app.gigId}`}
                  className="font-bold text-lg text-on-background hover:underline mb-1 inline-block"
                >
                  {app.gigTitle}
                </Link>
                <p className="text-xs text-outline">
                  Applied on: {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="badge badge-secondary capitalize">
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
