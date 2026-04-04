import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema(
  {
    ownerId: { type: String, required: true },
    ownerName: { type: String, required: true, maxlength: 80 },
    businessName: { type: String, required: true, maxlength: 120 },
    category: {
      type: String,
      required: true,
      enum: [
        "retail",
        "food",
        "services",
        "construction",
        "healthcare",
        "education",
        "other",
      ],
      default: "other",
    },
    description: { type: String, required: true, maxlength: 500 },
    suburb: { type: String, required: true, maxlength: 80 },
    phone: { type: String, required: true, maxlength: 20 },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const SpotlightBusiness =
  mongoose.models.SpotlightBusiness ??
  mongoose.model("SpotlightBusiness", BusinessSchema);

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(/<[^>]*>/g, "").trim().slice(0, max);
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const suburb = searchParams.get("suburb") ?? "";
    const category = searchParams.get("category") ?? "";

    const filter: Record<string, unknown> = {};
    if (suburb) filter.suburb = new RegExp(clean(suburb, 80), "i");
    if (category && category !== "all") filter.category = category;

    const businesses = await SpotlightBusiness.find(filter)
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return NextResponse.json({ businesses });
  } catch (err) {
    console.error("[GET /api/spotlight]", err);
    return NextResponse.json(
      { error: "Failed to fetch businesses" },
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

    const businessName = clean(body.businessName, 120);
    const description = clean(body.description, 500);
    const suburb = clean(body.suburb, 80);
    const phone = clean(body.phone, 20);
    const ownerName = clean(body.ownerName, 80);
    const VALID_CATEGORIES = [
      "retail",
      "food",
      "services",
      "construction",
      "healthcare",
      "education",
      "other",
    ];

    if (!businessName) errors.businessName = "Business name is required";
    if (!description || description.length < 10)
      errors.description = "Description is required";
    if (!suburb) errors.suburb = "Suburb is required";
    if (!phone) errors.phone = "Phone number is required";
    if (!ownerName) errors.ownerName = "Owner name is required";
    if (!VALID_CATEGORIES.includes(body.category)) errors.category = "Invalid category";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    await connectDB();
    const business = await SpotlightBusiness.create({
      ownerId: userId,
      ownerName,
      businessName,
      category: body.category,
      description,
      suburb,
      phone,
      verified: false,
    });

    return NextResponse.json({ business }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/spotlight]", err);
    return NextResponse.json(
      { error: "Failed to create business listing" },
      { status: 500 },
    );
  }
}
