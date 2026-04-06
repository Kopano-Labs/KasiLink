import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

const WaterAlertSchema = new mongoose.Schema(
  {
    reporterId: { type: String, required: true },
    title: { type: String, required: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 500 },
    suburb: { type: String, required: true, maxlength: 80 },
    type: {
      type: String,
      enum: ["water_outage", "load_shedding", "both"],
      default: "water_outage",
    },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const WaterAlert =
  mongoose.models.WaterAlert ?? mongoose.model("WaterAlert", WaterAlertSchema);

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(/<[^>]*>/g, "").trim().slice(0, max);
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const suburb = searchParams.get("suburb") ?? "";
    const mine = searchParams.get("mine") === "true";

    const filter: Record<string, unknown> = { resolved: false };
    if (suburb) filter.suburb = new RegExp(clean(suburb, 80), "i");

    if (mine) {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
      }
      filter.reporterId = userId;
    }

    const [alerts, total] = await Promise.all([
      WaterAlert.find(filter).sort({ createdAt: -1 }).limit(20).lean(),
      WaterAlert.countDocuments(filter),
    ]);

    return NextResponse.json({ alerts, total });
  } catch (err) {
    console.error("[GET /api/water-alerts]", err);
    return NextResponse.json(
      { error: "Failed to fetch water alerts" },
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
    const VALID_TYPES = ["water_outage", "load_shedding", "both"];

    if (!title || title.length < 5) errors.title = "Title required (min 5 chars)";
    if (!description || description.length < 10)
      errors.description = "Description required";
    if (!suburb) errors.suburb = "Suburb required";
    if (!VALID_TYPES.includes(body.type)) errors.type = "Invalid type";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    await connectDB();
    const alert = await WaterAlert.create({
      reporterId: userId,
      title,
      description,
      suburb,
      type: body.type ?? "water_outage",
    });

    return NextResponse.json({ alert }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/water-alerts]", err);
    return NextResponse.json(
      { error: "Failed to report outage" },
      { status: 500 },
    );
  }
}
