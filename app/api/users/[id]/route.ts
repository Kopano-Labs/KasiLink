// app/api/users/[id]/route.ts
// GET   /api/users/[id] — public profile (by MongoDB _id or Clerk ID)
// PATCH /api/users/[id] — update own profile (auth required, own record only)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import mongoose from "mongoose";

// The context for dynamic routes in Next.js App Router
type RouteContext = {
  params: {
    id: string;
  };
};

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
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;
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
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { id } = params;
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
    const updatePayload: { [key: string]: unknown } = {};

    // Build a payload object with only the allowed fields
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (body[field] !== undefined) {
        updatePayload[field] = body[field];
      }
    }

    // Validate location coordinates if provided
    if (updatePayload.location) {
      const location = updatePayload.location as { coordinates?: unknown };
      const coords = location.coordinates;
      if (
        coords &&
        (!Array.isArray(coords) ||
          coords.length !== 2 ||
          !coords.every((c) => typeof c === "number"))
      ) {
        return NextResponse.json(
          { error: "location.coordinates must be [longitude, latitude]" },
          { status: 400 },
        );
      }
    }

    // Apply updates using Mongoose's .set() for better change tracking
    user.set(updatePayload);
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
