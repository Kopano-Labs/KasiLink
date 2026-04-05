"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ApplicationsSection from "@/components/profile/ApplicationsSection";
import PostedGigsSection from "@/components/profile/PostedGigsSection";

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
      <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-8">
        <div>
          <div className="kasi-card mb-8 flex flex-wrap items-center gap-5">
            {user.imageUrl && (
              <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full">
                <Image
                  src={user.imageUrl}
                  alt={user.fullName ?? "Avatar"}
                  fill
                  className="object-cover"
                />
              </div>
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
              <div className="mt-3 flex flex-wrap gap-2">
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
              <ApplicationsSection applications={applications} />
              <PostedGigsSection postedGigs={postedGigs} />
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          <div className="kasi-card bg-surface-container-low">
            <p className="text-xs uppercase tracking-wider text-outline mb-2">
              Dashboard Focus
            </p>
            <h2 className="font-headline text-xl font-bold mb-2">
              Work, applications, and trust signals
            </h2>
            <p className="text-sm text-on-surface-variant">
              This page tracks the two-sided marketplace loop from the Structure
              plan: apply for work, post gigs, and manage activity from one place.
            </p>
          </div>

          <div className="kasi-card">
            <h3 className="font-bold mb-3">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <Link href="/marketplace" className="btn btn-outline">
                Browse Marketplace
              </Link>
              <Link href="/verified" className="btn btn-outline">
                Review Providers
              </Link>
              <Link href="/forum" className="btn btn-outline">
                Open Community Board
              </Link>
            </div>
          </div>

          <div className="kasi-card">
            <h3 className="font-bold mb-3">Status Snapshot</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface-container-low p-3">
                <div className="text-xs text-outline mb-1">Applications</div>
                <div className="text-2xl font-headline font-bold">
                  {applications.length}
                </div>
              </div>
              <div className="rounded-xl bg-surface-container-low p-3">
                <div className="text-xs text-outline mb-1">Posted gigs</div>
                <div className="text-2xl font-headline font-bold">
                  {postedGigs.length}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
