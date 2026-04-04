import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Application from "@/lib/models/Application";
import Gig from "@/lib/models/Gig";
import Review from "@/lib/models/Review";
import User from "@/lib/models/User";
import { sanitize } from "@/lib/validation";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const REVIEW_WINDOW_MS = 10 * 60 * 1000;
const REVIEW_LIMIT = 3;
const reviewRateLimit = new Map<string, RateLimitEntry>();

function getRateLimitKey(userId: string, gigId: string) {
  return `${userId}:${gigId}`;
}

function checkReviewRateLimit(userId: string, gigId: string) {
  const now = Date.now();
  const key = getRateLimitKey(userId, gigId);
  const current = reviewRateLimit.get(key);

  if (!current || current.resetAt <= now) {
    reviewRateLimit.set(key, { count: 1, resetAt: now + REVIEW_WINDOW_MS });
    return { allowed: true as const };
  }

  if (current.count >= REVIEW_LIMIT) {
    return {
      allowed: false as const,
      retryAfterMs: current.resetAt - now,
    };
  }

  reviewRateLimit.set(key, {
    count: current.count + 1,
    resetAt: current.resetAt,
  });

  return { allowed: true as const };
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const providerId = searchParams.get("providerId");

    if (!providerId) {
      return NextResponse.json(
        { error: "Missing providerId" },
        { status: 400 },
      );
    }

    const reviews = await Review.find({ providerId })
      .sort({ createdAt: -1 })
      .lean();
    const summary = await Review.aggregate([
      { $match: { providerId } },
      {
        $group: {
          _id: "$providerId",
          average: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json({
      reviews,
      summary: summary[0] ?? { average: 0, count: 0 },
    });
  } catch (err) {
    console.error("[GET /api/reviews]", err);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await req.json();
    const { gigId, providerId, rating, comment } = body;

    if (!gigId || !providerId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Invalid review payload" },
        { status: 400 },
      );
    }

    if (typeof comment === "string" && comment.length > 500) {
      return NextResponse.json(
        { error: "Review comment must be 500 characters or fewer" },
        { status: 400 },
      );
    }

    await connectDB();
    const seeker = await User.findOne({ clerkId: userId });
    if (!seeker) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const gig = await Gig.findById(gigId).lean();
    if (!gig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    }

    if (gig.providerId !== providerId) {
      return NextResponse.json(
        { error: "Review target does not match gig provider" },
        { status: 400 },
      );
    }

    const application = await Application.findOne({
      gigId,
      seekerId: userId,
    }).lean();
    if (!application) {
      return NextResponse.json(
        { error: "You can only review gigs you applied for" },
        { status: 403 },
      );
    }

    const limit = checkReviewRateLimit(userId, String(gigId));
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many review attempts. Please wait and try again." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)),
          },
        },
      );
    }

    const review = await Review.create({
      gigId,
      providerId,
      seekerId: userId,
      seekerName: seeker.displayName || "Anonymous",
      rating,
      comment: sanitize(comment),
    });

    const reviewStats = await Review.aggregate([
      { $match: { providerId } },
      {
        $group: {
          _id: "$providerId",
          average: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = reviewStats[0] ?? { average: rating, count: 1 };
    await User.updateOne(
      { clerkId: providerId },
      {
        $set: {
          "rating.average": Number(summary.average.toFixed(1)),
          "rating.count": summary.count,
        },
      },
    );

    return NextResponse.json({ review }, { status: 201 });
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { error: "You have already reviewed this gig." },
        { status: 409 },
      );
    }

    console.error("[POST /api/reviews]", err);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 },
    );
  }
}
