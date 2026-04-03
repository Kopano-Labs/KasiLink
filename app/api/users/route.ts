// app/api/users/route.ts
// GET /api/users — search/browse users (providers/seekers near a location)
// Used by: provider discovery, verified providers directory (H7)

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const lat = parseFloat(searchParams.get("lat") ?? "");
    const lng = parseFloat(searchParams.get("lng") ?? "");
    const radius = parseFloat(searchParams.get("radius") ?? "10"); // km
    const role = searchParams.get("role"); // "seeker" | "provider" | "both"
    const verifiedOnly = searchParams.get("verified") === "true";
    const q = searchParams.get("q");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { isActive: true };

    if (role) filter.role = role;
    if (verifiedOnly) filter.isVerified = true;

    if (!isNaN(lat) && !isNaN(lng)) {
      filter.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: radius * 1000,
        },
      };
    }

    if (q && q.trim()) {
      filter.$text = { $search: q.trim() };
    }

    // Never return phone numbers in list view
    const projection = { phone: 0, clerkId: 0, __v: 0 };

    const [users, total] = await Promise.all([
      User.find(filter, projection)
        .sort(q ? { score: { $meta: "textScore" } } : { "rating.average": -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/users]", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
