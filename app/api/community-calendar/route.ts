import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import User from "@/lib/models/User";

const EventSchema = new mongoose.Schema(
  {
    organizerId: { type: String, required: true },
    organizerName: { type: String, required: true, maxlength: 80 },
    type: {
      type: String,
      required: true,
      enum: ["job_fair", "market", "meeting", "awareness", "social", "other"],
      default: "other",
    },
    title: { type: String, required: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 500 },
    suburb: { type: String, required: true, maxlength: 80 },
    date: { type: Date, required: true },
    time: { type: String, required: true, maxlength: 20 },
    cancelled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const CommunityEvent =
  mongoose.models.CommunityEvent ??
  mongoose.model("CommunityEvent", EventSchema);

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(/<[^>]*>/g, "").trim().slice(0, max);
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const suburb = searchParams.get("suburb") ?? "";
    const type = searchParams.get("type") ?? "";

    const filter: Record<string, unknown> = {
      cancelled: false,
      date: { $gte: new Date() },
    };
    if (suburb) filter.suburb = new RegExp(clean(suburb, 80), "i");
    if (type && type !== "all") filter.type = type;

    const events = await CommunityEvent.find(filter)
      .sort({ date: 1 })
      .limit(30)
      .lean();

    return NextResponse.json({ events });
  } catch (err) {
    console.error("[GET /api/community-calendar]", err);
    return NextResponse.json(
      { error: "Failed to fetch events" },
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
    const errors: Record<string, string> = {};

    const title = clean(body.title, 120);
    const description = clean(body.description, 500);
    const suburb = clean(body.suburb, 80);
    const organizerName = clean(body.organizerName, 80);
    const time = clean(body.time, 20);
    const VALID_TYPES = [
      "job_fair",
      "market",
      "meeting",
      "awareness",
      "social",
      "other",
    ];

    if (!title || title.length < 5) errors.title = "Title must be at least 5 characters";
    if (!description || description.length < 10) errors.description = "Description required";
    if (!suburb) errors.suburb = "Suburb is required";
    if (!organizerName) errors.organizerName = "Your name is required";
    if (!VALID_TYPES.includes(body.type)) errors.type = "Invalid event type";
    if (!body.date || Number.isNaN(new Date(body.date).getTime()))
      errors.date = "Valid date required";
    if (!time) errors.time = "Time is required (e.g. 10:00 AM)";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    await connectDB();
    const organizer = await User.findOne({ clerkId: userId }).lean();
    const event = await CommunityEvent.create({
      organizerId: userId,
      organizerName: organizerName || organizer?.displayName || "Anonymous",
      type: body.type,
      title,
      description,
      suburb,
      date: new Date(body.date),
      time,
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/community-calendar]", err);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}
