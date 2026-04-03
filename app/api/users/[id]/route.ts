// app/api/users/[id]/route.ts
// GET   /api/users/[id] — public profile (by MongoDB _id or Clerk ID)
// PATCH /api/users/[id] — update own profile (auth required, own record only)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import mongoose from "mongoose";

type RouteContext = { params: Promise<{ id: string }> };

// Fields safe to return publicly (exclude phone from public view)
const PUBLIC_PROJECTION = {
  clerkId: 0,
  phone: 0,
  __v: 0,
};

// Fields a user is allowed to update on their own profile
const ALLOWED_UPDATE_FIELDS = [
  "displayName",
  "bio",
  "role",
  "location",
  "skills",
  "categories",
  "avatarUrl",
] as const;

// ----------------------------------------------------------------
// GET — public profile
// Accepts either MongoDB ObjectId or Clerk user ID as [id]
// ----------------------------------------------------------------
export async function GET(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    await connectDB();

    const user = mongoose.Types.ObjectId.isValid(id)
      ? await User.findById(id, PUBLIC_PROJECTION).lean()
      : await User.findOne({ clerkId: id }, PUBLIC_PROJECTION).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("[GET /api/users/[id]]", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

// ----------------------------------------------------------------
// PATCH — update own profile
// Users can only edit their own record (matched by clerkId)
// ----------------------------------------------------------------
export async function PATCH(req: NextRequest, ctx: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { id } = await ctx.params;
    await connectDB();

    // Load user — support lookup by ObjectId or clerkId
    const user = mongoose.Types.ObjectId.isValid(id)
      ? await User.findById(id)
      : await User.findOne({ clerkId: id });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only the owner can update
    if (user.clerkId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (body[field] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (user as any)[field] = body[field];
      }
    }

    // Validate location coordinates if provided
    if (body.location?.coordinates) {
      const coords = body.location.coordinates;
      if (
        !Array.isArray(coords) ||
        coords.length !== 2 ||
        typeof coords[0] !== "number" ||
        typeof coords[1] !== "number"
      ) {
        return NextResponse.json(
          { error: "location.coordinates must be [longitude, latitude]" },
          { status: 400 },
        );
      }
    }

    user.lastSeen = new Date();
    await user.save();

    // Return without sensitive fields
    const { clerkId: _clerkId, __v, ...safe } = user.toObject();

    return NextResponse.json({ user: safe });
  } catch (err) {
    console.error("[PATCH /api/users/[id]]", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
