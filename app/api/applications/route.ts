// GET  /api/applications — list applications (seeker's own or provider's gig)
// POST /api/applications — apply to a gig
// Scaffolded successfully per KasiLink Implementation Plan

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Application from "@/lib/models/Application";
import Gig from "@/lib/models/Gig";
import User from "@/lib/models/User";
import Notification from "@/lib/models/Notification";
import { validateApplication, sanitize } from "@/lib/validation";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    await connectDB();
    const { searchParams } = req.nextUrl;
    const role = searchParams.get("role") ?? "seeker"; // "seeker" | "provider"

    const filter =
      role === "provider" ? { providerId: userId } : { seekerId: userId };

    const applications = await Application.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ applications });
  } catch (err) {
    console.error("[GET /api/applications]", err);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const body = await req.json();
    const { valid, errors } = validateApplication(body);
    if (!valid) return NextResponse.json({ errors }, { status: 422 });

    if (!mongoose.Types.ObjectId.isValid(body.gigId as string)) {
      return NextResponse.json({ error: "Invalid gig ID" }, { status: 400 });
    }

    await connectDB();

    // Load gig
    const gig = await Gig.findById(body.gigId);
    if (!gig)
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    if (gig.status !== "open") {
      return NextResponse.json(
        { error: "This gig is no longer accepting applications" },
        { status: 409 },
      );
    }
    if (gig.providerId === userId) {
      return NextResponse.json(
        { error: "You cannot apply to your own gig" },
        { status: 409 },
      );
    }

    // Load seeker
    const seeker = await User.findOne({ clerkId: userId });
    if (!seeker) {
      return NextResponse.json(
        { error: "Complete your profile before applying" },
        { status: 404 },
      );
    }

    // Create application (unique index prevents duplicates)
    const application = await Application.create({
      gigId: gig._id,
      gigTitle: gig.title,
      seekerId: userId,
      seekerName: seeker.displayName,
      seekerPhone: seeker.phone,
      providerId: gig.providerId,
      providerName: gig.providerName,
      message: sanitize(body.message),
      status: "pending",
    });

    // Increment application count
    await Gig.findByIdAndUpdate(gig._id, { $inc: { applicationCount: 1 } });

    // Create a Notification for the Gig Provider
    await Notification.create({
      userId: gig.providerId,
      type: "application",
      title: "New Application received",
      message: `${seeker.displayName} applied to your gig: ${gig.title}`,
      link: `/gigs/${gig._id}`,
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (err: unknown) {
    // Duplicate key = already applied
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { error: "You have already applied to this gig" },
        { status: 409 },
      );
    }
    console.error("[POST /api/applications]", err);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 },
    );
  }
}
