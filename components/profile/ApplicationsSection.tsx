"use client";

import Link from "next/link";

interface Application {
  _id: string;
  gigTitle: string;
  status: string;
  createdAt: string;
  gigId: string;
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

export default function ApplicationsSection({
  applications,
}: {
  applications: Application[];
}) {
  return (
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
              <span className={`badge ${STATUS_COLOURS[app.status] ?? "badge-secondary"}`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
