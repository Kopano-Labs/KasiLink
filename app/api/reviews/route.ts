import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Review from "@/lib/models/Review";
import User from "@/lib/models/User";
import { sanitize } from "@/lib/validation";

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
    return NextResponse.json({ reviews });
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

    await connectDB();
    const seeker = await User.findOne({ clerkId: userId });
    if (!seeker) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const review = await Review.create({
      gigId,
      providerId,
      seekerId: userId,
      seekerName: seeker.displayName || "Anonymous",
      rating,
      comment: sanitize(comment),
    });

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
