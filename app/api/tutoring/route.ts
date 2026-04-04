// app/api/tutoring/route.ts
// GET  /api/tutoring — list tutoring sessions (filtered by user or public browse)
// POST /api/tutoring — create a tutoring session request (auth required)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

const TutoringSessionSchema = new mongoose.Schema(
  {
    tutorId: { type: String, required: true },
    tutorName: { type: String, required: true, maxlength: 60 },
    studentId: { type: String, default: null },
    studentName: { type: String, default: null, maxlength: 60 },
    subject: { type: String, required: true, maxlength: 80 },
    grade: { type: String, required: true, maxlength: 30 },
    date: { type: Date, required: true },
    duration: { type: Number, required: true, min: 30, max: 480 },
    location: {
      type: String,
      enum: ["online", "physical"],
      default: "online",
    },
    meetingLink: { type: String, default: null, maxlength: 200 },
    suburb: { type: String, required: true, maxlength: 80 },
    notes: { type: String, default: "", maxlength: 500 },
    status: {
      type: String,
      enum: ["open", "pending", "confirmed", "completed", "cancelled"],
      default: "open",
    },
    reference: { type: String, unique: true },
  },
  { timestamps: true },
);

TutoringSessionSchema.index({ status: 1, date: 1 });
TutoringSessionSchema.index({ tutorId: 1, date: -1 });
TutoringSessionSchema.index({ studentId: 1, date: -1 });

const TutoringSession =
  mongoose.models.TutoringSession ??
  mongoose.model("TutoringSession", TutoringSessionSchema);

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, "").trim().slice(0, max);
}

function generateRef(): string {
  return "KL-" + Math.floor(10000 + Math.random() * 90000).toString();
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const subject = searchParams.get("subject") ?? "";
    const suburb = searchParams.get("suburb") ?? "";
    const mine = searchParams.get("mine") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = 20;

    const filter: Record<string, unknown> = {};

    if (mine) {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
      }
      filter.$or = [{ tutorId: userId }, { studentId: userId }];
    } else {
      filter.status = "open";
    }

    if (subject) {
      filter.subject = new RegExp(
        clean(subject, 80).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );
    }
    if (suburb) {
      filter.suburb = new RegExp(
        clean(suburb, 80).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );
    }

    const [sessions, total] = await Promise.all([
      TutoringSession.find(filter)
        .sort({ date: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      TutoringSession.countDocuments(filter),
    ]);

    return NextResponse.json({
      sessions,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("[GET /api/tutoring]", err);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
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

    const subject = clean(body.subject, 80);
    const grade = clean(body.grade, 30);
    const suburb = clean(body.suburb, 80);
    const tutorName = clean(body.tutorName, 60);
    const notes = clean(body.notes ?? "", 500);
    const meetingLink = clean(body.meetingLink ?? "", 200);
    const duration = parseInt(body.duration, 10);
    const date = new Date(body.date);

    if (!subject) errors.subject = "Subject is required";
    if (!grade) errors.grade = "Grade is required";
    if (!suburb) errors.suburb = "Suburb is required";
    if (!tutorName) errors.tutorName = "Tutor name is required";
    if (isNaN(duration) || duration < 30 || duration > 480)
      errors.duration = "Duration must be 30–480 minutes";
    if (isNaN(date.getTime())) errors.date = "Valid date is required";
    if (!["online", "physical"].includes(body.location))
      errors.location = "Location must be online or physical";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    await connectDB();

    const session = await TutoringSession.create({
      tutorId: userId,
      tutorName,
      subject,
      grade,
      date,
      duration,
      location: body.location,
      meetingLink: body.location === "online" ? meetingLink : null,
      suburb,
      notes,
      reference: generateRef(),
    });

    return NextResponse.json({ session }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/tutoring]", err);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
  }
}
