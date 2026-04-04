// app/api/incidents/route.ts
// GET  /api/incidents — list active community incidents (public)
// POST /api/incidents — report a new incident (auth required)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

const IncidentSchema = new mongoose.Schema(
  {
    reporterId: { type: String, required: true },
    reporterName: { type: String, required: true, maxlength: 60 },
    type: {
      type: String,
      required: true,
      enum: ["safety", "load_shedding", "water_outage", "road", "other"],
    },
    title: { type: String, required: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 1000 },
    suburb: { type: String, required: true, maxlength: 80 },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

IncidentSchema.index({ suburb: 1, resolved: 1, createdAt: -1 });

const Incident =
  mongoose.models.Incident ?? mongoose.model("Incident", IncidentSchema);

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, "").trim().slice(0, max);
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const suburb = searchParams.get("suburb") ?? "";
    const type = searchParams.get("type") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = 20;

    const filter: Record<string, unknown> = { resolved: false };
    if (suburb) {
      filter.suburb = new RegExp(
        clean(suburb, 80).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );
    }
    if (type) filter.type = type;

    const [incidents, total] = await Promise.all([
      Incident.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Incident.countDocuments(filter),
    ]);

    return NextResponse.json({
      incidents,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("[GET /api/incidents]", err);
    return NextResponse.json(
      { error: "Failed to fetch incidents" },
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
    const description = clean(body.description, 1000);
    const suburb = clean(body.suburb, 80);
    const reporterName = clean(body.reporterName, 60);
    const VALID_TYPES = ["safety", "load_shedding", "water_outage", "road", "other"];
    const VALID_SEVERITIES = ["low", "medium", "high"];

    if (!title || title.length < 5) errors.title = "Title must be at least 5 characters";
    if (!description || description.length < 10) errors.description = "Description must be at least 10 characters";
    if (!suburb) errors.suburb = "Suburb is required";
    if (!reporterName) errors.reporterName = "Reporter name is required";
    if (!VALID_TYPES.includes(body.type)) errors.type = "Invalid incident type";
    if (body.severity && !VALID_SEVERITIES.includes(body.severity)) errors.severity = "Invalid severity";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    await connectDB();

    const incident = await Incident.create({
      reporterId: userId,
      reporterName,
      type: body.type,
      title,
      description,
      suburb,
      severity: VALID_SEVERITIES.includes(body.severity) ? body.severity : "medium",
    });

    return NextResponse.json({ incident }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/incidents]", err);
    return NextResponse.json(
      { error: "Failed to report incident" },
      { status: 500 },
    );
  }
}
