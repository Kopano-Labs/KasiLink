"use client";

import Link from "next/link";

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

export default function PostedGigsSection({ postedGigs }: { postedGigs: Gig[] }) {
  return (
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
              <span className={`badge ${STATUS_COLOURS[gig.status] ?? "badge-secondary"}`}>
                {gig.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
