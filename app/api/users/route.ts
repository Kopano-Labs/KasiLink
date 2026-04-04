import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const isVerified = searchParams.get("verified") === "true";
    const page = Math.max(Number(searchParams.get("page") ?? 1) || 1, 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 12) || 12, 1), 24);
    const skip = (page - 1) * limit;

    const filter = isVerified ? { isVerified: true } : {};
    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ "rating.average": -1, "rating.count": -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    // Map to expected Provider interface format
    const providers = users.map((u) => ({
      clerkId: u.clerkId,
      displayName: u.displayName,
      category: u.categories?.[0] || "General",
      rating: u.rating?.average ?? 0,
      reviewCount: u.rating?.count ?? 0,
      location: u.location?.suburb
        ? `${u.location.suburb}, ${u.location.city}`
        : "South Africa",
      verified: u.isVerified,
    }));

    return NextResponse.json({
      providers,
      page,
      limit,
      total,
      hasMore: skip + providers.length < total,
    });
  } catch (err) {
    console.error("[GET /api/users]", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
