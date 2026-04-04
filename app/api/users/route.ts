import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const isVerified = searchParams.get("verified") === "true";

    const filter = isVerified ? { isVerified: true } : {};
    const users = await User.find(filter).sort({ createdAt: -1 }).limit(50).lean();

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

    return NextResponse.json({ providers });
  } catch (err) {
    console.error("[GET /api/users]", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
