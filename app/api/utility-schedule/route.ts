// app/api/utility-schedule/route.ts
// GET  /api/utility-schedule — list upcoming utility outages (public)
// POST /api/utility-schedule — add a scheduled outage (auth required)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

const UtilityScheduleSchema = new mongoose.Schema(
  {
    reporterId: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["power", "water"],
    },
    title: { type: String, required: true, maxlength: 120 },
    description: { type: String, default: "", maxlength: 500 },
    suburb: { type: String, required: true, maxlength: 80 },
    zone: { type: String, default: "", maxlength: 40 },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    stage: { type: Number, default: null, min: 1, max: 8 },
    status: {
      type: String,
      enum: ["confirmed", "estimated", "cancelled"],
      default: "estimated",
    },
    source: { type: String, default: "community", maxlength: 60 },
  },
  { timestamps: true },
);

UtilityScheduleSchema.index({ suburb: 1, startTime: 1 });
UtilityScheduleSchema.index({ type: 1, startTime: 1 });

const UtilitySchedule =
  mongoose.models.UtilitySchedule ??
  mongoose.model("UtilitySchedule", UtilityScheduleSchema);

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
    const hours = Math.min(168, Math.max(1, parseInt(searchParams.get("hours") ?? "48", 10)));

    const now = new Date();
    const cutoff = new Date(now.getTime() + hours * 60 * 60 * 1000);

    const filter: Record<string, unknown> = {
      status: { $ne: "cancelled" },
      endTime: { $gte: now },
      startTime: { $lte: cutoff },
    };

    if (suburb) {
      filter.suburb = new RegExp(
        clean(suburb, 80).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );
    }
    if (type && ["power", "water"].includes(type)) {
      filter.type = type;
    }

    const schedules = await UtilitySchedule.find(filter)
      .sort({ startTime: 1 })
      .limit(30)
      .lean();

    return NextResponse.json({ schedules });
  } catch (err) {
    console.error("[GET /api/utility-schedule]", err);
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
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
    const description = clean(body.description ?? "", 500);
    const suburb = clean(body.suburb, 80);
    const zone = clean(body.zone ?? "", 40);
    const source = clean(body.source ?? "community", 60);
    const startTime = new Date(body.startTime);
    const endTime = new Date(body.endTime);

    if (!title || title.length < 5) errors.title = "Title must be at least 5 characters";
    if (!suburb) errors.suburb = "Suburb is required";
    if (!["power", "water"].includes(body.type)) errors.type = "Type must be power or water";
    if (isNaN(startTime.getTime())) errors.startTime = "Valid start time required";
    if (isNaN(endTime.getTime())) errors.endTime = "Valid end time required";
    if (startTime >= endTime) errors.endTime = "End time must be after start time";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    await connectDB();
    const schedule = await UtilitySchedule.create({
      reporterId: userId,
      type: body.type,
      title,
      description,
      suburb,
      zone,
      startTime,
      endTime,
      stage: body.type === "power" && body.stage ? Math.min(8, Math.max(1, parseInt(body.stage, 10))) : null,
      status: ["confirmed", "estimated"].includes(body.status) ? body.status : "estimated",
      source,
    });

    return NextResponse.json({ schedule }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/utility-schedule]", err);
    return NextResponse.json(
      { error: "Failed to create schedule" },
      { status: 500 },
    );
  }
}
