import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();
    const user = await User.findOne({ clerkId: id })
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const provider = {
      clerkId: user.clerkId,
      displayName: user.displayName,
      category: user.categories?.[0] || "General",
      rating: user.rating?.average ?? 0,
      reviewCount: user.rating?.count ?? 0,
      verified: user.isVerified,
      verifiedAt: user.verifiedAt ?? null,
      location: user.location?.suburb
        ? `${user.location.suburb}, ${user.location.city}`
        : "South Africa",
      about: user.bio || "No provider bio available yet.",
    };

    return NextResponse.json({ provider });
  } catch (err) {
    console.error("[GET /api/users/[id]]", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
