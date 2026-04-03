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
  open: "badge-success",
  assigned: "badge-primary",
  in_progress: "badge-primary",
  completed: "badge-success",
  cancelled: "badge-danger",
  pending: "badge-secondary",
  accepted: "badge-success",
  rejected: "badge-danger",
  withdrawn: "badge-danger",
  shortlisted: "badge-primary",
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
    ])
      .then(([appData, gigData]) => {
        setApplications(appData.applications ?? []);
        setPostedGigs(gigData.gigs ?? []);
      })
      .finally(() => setLoading(false));
  }, [isSignedIn]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div className="container pt-8 pb-12">
      {/* Profile header */}
      <div className="kasi-card flex gap-5 items-center mb-8 flex-wrap">
        {user.imageUrl && (
          <img
            src={user.imageUrl}
            alt={user.fullName ?? "Avatar"}
            className="w-[72px] h-[72px] rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <h1 className="mb-1">
            {user.fullName ?? user.username ?? "Your Profile"}
          </h1>
          <p className="text-on-surface-variant text-sm">
            {user.primaryPhoneNumber?.phoneNumber ??
              user.primaryEmailAddress?.emailAddress ??
              ""}
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="badge badge-primary">KasiLink Member</span>
          </div>
        </div>
        <Link href="/gigs/new" className="btn btn-primary">
          + Post a Gig
        </Link>
      </div>

      {loading ? (
        <div className="text-center p-10 text-on-surface-variant">
          Loading your activity…
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {/* My Applications */}
          <section>
            <h2 className="mb-4 font-headline text-xl">
              My Applications ({applications.length})
            </h2>
            {applications.length === 0 ? (
              <div className="kasi-card text-center text-on-surface-variant">
                <p className="mb-4">No applications yet.</p>
                <Link href="/marketplace" className="btn btn-primary">
                  Browse Gigs
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="kasi-card flex justify-between items-center flex-wrap gap-3"
                  >
                    <div>
                      <Link
                        href={`/gigs/${app.gigId}`}
                        className="font-semibold text-on-background hover:underline"
                      >
                        {app.gigTitle}
                      </Link>
                      <p className="text-xs text-outline mt-0.5">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`badge ${STATUS_COLOURS[app.status] ?? "badge-secondary"}`}
                    >
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* My Posted Gigs */}
          <section>
            <h2 className="mb-4 font-headline text-xl">
              My Posted Gigs ({postedGigs.length})
            </h2>
            {postedGigs.length === 0 ? (
              <div className="kasi-card text-center text-on-surface-variant">
                <p className="mb-4">You haven&apos;t posted any gigs yet.</p>
                <Link href="/gigs/new" className="btn btn-primary">
                  Post a Gig
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {postedGigs.map((gig) => (
                  <div
                    key={gig._id}
                    className="kasi-card flex justify-between items-center flex-wrap gap-3"
                  >
                    <div>
                      <Link
                        href={`/gigs/${gig._id}`}
                        className="font-semibold text-on-background hover:underline"
                      >
                        {gig.title}
                      </Link>
                      <p className="text-xs text-outline mt-0.5">
                        {gig.applicationCount} applicant
                        {gig.applicationCount !== 1 ? "s" : ""} · Posted{" "}
                        {new Date(gig.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`badge ${STATUS_COLOURS[gig.status] ?? "badge-secondary"}`}
                    >
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
