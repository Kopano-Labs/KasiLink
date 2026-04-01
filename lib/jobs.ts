// lib/jobs.ts
import clientPromise from "@/lib/db";

export async function fetchJobs() {
  const client = await clientPromise;
  const db = client.db("kasilink");
  const jobs = await db
    .collection("jobs")
    .find({})
    .sort({ postedAt: -1 })
    .toArray();

  return jobs.map((job) => ({
    _id: job._id,
    title: job.title,
    description: job.description,
    category: job.category,
    location: job.location,
    postedAt: job.postedAt,
    pay: job.pay,
  }));
}
