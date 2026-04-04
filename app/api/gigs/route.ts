// app/api/gigs/route.ts
// GET  /api/gigs — list gigs (public, with filters)
// POST /api/gigs — create a gig (protected)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Gig from "@/lib/models/Gig";
import User from "@/lib/models/User";
import { distanceKm } from "@/lib/geo";

// ----------------------------------------------------------------
// GET — list gigs with optional filters
// Query params:
//   lat, lng, radius (km) — proximity filter
//   category             — gig category
//   suburb, city         — text location filters
//   providerId           — poster filter, supports "me" for signed-in provider
//   status               — default "open"
//   q                    — text search
//   page, limit          — pagination
// ----------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const lat = parseFloat(searchParams.get("lat") ?? "");
    const lng = parseFloat(searchParams.get("lng") ?? "");
    const radius = parseFloat(searchParams.get("radius") ?? "10"); // km
    const category = searchParams.get("category");
    const suburb = searchParams.get("suburb")?.trim();
    const city = searchParams.get("city")?.trim();
    const providerIdParam = searchParams.get("providerId");
    const status = searchParams.get("status");
    const q = searchParams.get("q");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
    const skip = (page - 1) * limit;

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (status) {
      filter.status = status;
    } else if (!providerIdParam) {
      filter.status = "open";
    }

    if (category) filter.category = category;

    if (suburb) {
      filter["location.suburb"] = new RegExp(`^${suburb}$`, "i");
    }

    if (city) {
      filter["location.city"] = new RegExp(`^${city}$`, "i");
    }

    if (providerIdParam) {
      if (providerIdParam === "me") {
        const { userId } = await auth();
        if (!userId) {
          return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }
        filter.providerId = userId;
      } else {
        filter.providerId = providerIdParam;
      }
    }

    // Geo-proximity with bounds checking (requires 2dsphere index)
    if (
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    ) {
      filter.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: radius * 1000, // convert km to meters
        },
      };
    }

    // Text search
    if (q && q.trim()) {
      filter.$text = { $search: q.trim() };
    }

    // Don't return expired gigs
    filter.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ];

    const [gigs, total] = await Promise.all([
      Gig.find(filter)
        .sort(q ? { score: { $meta: "textScore" } } : { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Gig.countDocuments(filter),
    ]);

    const gigsWithDistance = gigs.map((gig) => {
      if (
        !isNaN(lat) &&
        !isNaN(lng) &&
        Array.isArray(gig.location?.coordinates) &&
        gig.location.coordinates.length === 2
      ) {
        const [gigLng, gigLat] = gig.location.coordinates;
        return {
          ...gig,
          distance: distanceKm(lat, lng, gigLat, gigLng),
        };
      }

      return gig;
    });

    return NextResponse.json({
      gigs: gigsWithDistance,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/gigs]", err);
    return NextResponse.json(
      { error: "Failed to fetch gigs" },
      { status: 500 },
    );
  }
}

// ----------------------------------------------------------------
// POST — create a new gig (auth required)
// ----------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    await connectDB();

    // Load provider profile
    const provider = await User.findOne({ clerkId: userId });
    if (!provider) {
      return NextResponse.json(
        { error: "Profile not found. Please complete your profile first." },
        { status: 404 },
      );
    }

    const body = await req.json();

    // Basic validation
    const required = [
      "title",
      "description",
      "category",
      "payDisplay",
      "location",
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    if (
      !body.location.coordinates ||
      !Array.isArray(body.location.coordinates) ||
      body.location.coordinates.length !== 2
    ) {
      return NextResponse.json(
        { error: "location.coordinates must be [longitude, latitude]" },
        { status: 400 },
      );
    }

    const gig = await Gig.create({
      title: body.title.trim(),
      description: body.description.trim(),
      category: body.category,
      status: "open",

      providerId: userId,
      providerName: provider.displayName,
      providerPhone: provider.phone,
      isProviderVerified: provider.isVerified,

      location: {
        type: "Point",
        coordinates: body.location.coordinates, // [lng, lat]
        address: body.location.address,
        suburb:
          body.location.suburb ?? provider.location.suburb ?? "Johannesburg",
        city: body.location.city ?? provider.location.city ?? "Johannesburg",
      },

      payType: body.payType ?? "negotiable",
      payAmount: body.payAmount,
      payDisplay: body.payDisplay.trim(),

      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      isFlexible: body.isFlexible ?? true,

      requirements: body.requirements ?? [],
      slots: body.slots ?? 1,

      loadshedding: {
        aware: body.loadshedding?.aware ?? false,
        stage: body.loadshedding?.stage,
      },

      isUrgent: body.isUrgent ?? false,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    });

    return NextResponse.json({ gig }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/gigs]", err);
    return NextResponse.json(
      { error: "Failed to create gig" },
      { status: 500 },
    );
  }
}
