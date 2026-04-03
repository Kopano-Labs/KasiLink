import { Metadata } from "next";
import { fetchJobs } from "@/lib/jobs";
import JobCard from "@/components/JobCard";

export const metadata: Metadata = {
  title: "KasiLink | Jobs",
  description: "Browse local gigs and services instantly.",
};

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const jobs = await fetchJobs();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Available Gigs</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-600">
          No jobs available right now. Check back soon!
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map((job) => (
            <JobCard
              key={job._id.toString()}
              title={job.title}
              description={job.description}
              category={job.category}
              location={job.location}
              postedAt={job.postedAt}
              pay={job.pay}
            />
          ))}
        </div>
      )}
    </main>
  );
}
