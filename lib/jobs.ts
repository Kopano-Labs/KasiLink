// lib/jobs.ts — legacy helper, delegates to Mongoose Gig model
import connectDB from "@/lib/db";
import Gig from "@/lib/models/Gig";

export async function fetchJobs() {
  await connectDB();
  const gigs = await Gig.find({ status: "open" })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return gigs.map((g) => ({
    _id: g._id,
    title: g.title,
    description: g.description,
    category: g.category,
    location: g.location,
    postedAt: g.createdAt,
    pay: g.payDisplay,
  }));
}
