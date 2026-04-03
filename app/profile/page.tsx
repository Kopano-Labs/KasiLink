"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Application {
  _id: string;
  gigTitle: string;
  status: string;
  createdAt: string;
  gigId: string;
}

interface Gig {
  _id: string;
  title: string;
  status: string;
  applicationCount: number;
  createdAt: string;
}

const STATUS_COLOURS: Record<string, string> = {
  open: "badge-success", assigned: "badge-primary", in_progress: "badge-primary",
  completed: "badge-success", cancelled: "badge-danger",
  pending: "badge-secondary", accepted: "badge-success",
  rejected: "badge-danger", withdrawn: "badge-danger", shortlisted: "badge-primary",
};

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [postedGigs, setPostedGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isSignedIn) return;
    Promise.all([
      fetch("/api/applications?role=seeker").then((r) => r.json()),
      fetch("/api/gigs?providerId=me&limit=20").then((r) => r.json()),
    ]).then(([appData, gigData]) => {
      setApplications(appData.applications ?? []);
      setPostedGigs(gigData.gigs ?? []);
    }).finally(() => setLoading(false));
  }, [isSignedIn]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div className="container" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-12)" }}>

      {/* Profile header */}
      <div className="kasi-card" style={{ display: "flex", gap: "var(--space-5)", alignItems: "center", marginBottom: "var(--space-8)", flexWrap: "wrap" }}>
        {user.imageUrl && (
          <img src={user.imageUrl} alt={user.fullName ?? "Avatar"}
            style={{ width: 72, height: 72, borderRadius: "var(--radius-full)", objectFit: "cover" }} />
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ marginBottom: 4 }}>{user.fullName ?? user.username ?? "Your Profile"}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>
            {user.primaryPhoneNumber?.phoneNumber ?? user.primaryEmailAddress?.emailAddress ?? ""}
          </p>
          <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)", flexWrap: "wrap" }}>
            <span className="badge badge-primary">KasiLink Member</span>
          </div>
        </div>
        <Link href="/gigs/new" className="btn btn-primary">+ Post a Gig</Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "var(--space-10)", color: "var(--text-secondary)" }}>
          Loading your activity…
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-8)" }}>

          {/* My Applications */}
          <section>
            <h2 style={{ marginBottom: "var(--space-4)" }}>My Applications ({applications.length})</h2>
            {applications.length === 0 ? (
              <div className="kasi-card" style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                <p style={{ marginBottom: "var(--space-4)" }}>No applications yet.</p>
                <Link href="/marketplace" className="btn btn-primary">Browse Gigs</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {applications.map((app) => (
                  <div key={app._id} className="kasi-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-3)" }}>
                    <div>
                      <Link href={`/gigs/${app.gigId}`} style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {app.gigTitle}
                      </Link>
                      <p style={{ fontSize: "var(--font-size-xs)", color: "var(--text-tertiary)", marginTop: 2 }}>
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`badge ${STATUS_COLOURS[app.status] ?? "badge-secondary"}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* My Posted Gigs */}
          <section>
            <h2 style={{ marginBottom: "var(--space-4)" }}>My Posted Gigs ({postedGigs.length})</h2>
            {postedGigs.length === 0 ? (
              <div className="kasi-card" style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                <p style={{ marginBottom: "var(--space-4)" }}>You haven&apos;t posted any gigs yet.</p>
                <Link href="/gigs/new" className="btn btn-primary">Post a Gig</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {postedGigs.map((gig) => (
                  <div key={gig._id} className="kasi-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-3)" }}>
                    <div>
                      <Link href={`/gigs/${gig._id}`} style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {gig.title}
                      </Link>
                      <p style={{ fontSize: "var(--font-size-xs)", color: "var(--text-tertiary)", marginTop: 2 }}>
                        {gig.applicationCount} applicant{gig.applicationCount !== 1 ? "s" : ""} · Posted {new Date(gig.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`badge ${STATUS_COLOURS[gig.status] ?? "badge-secondary"}`}>
                      {gig.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      )}
    </div>
  );
}
