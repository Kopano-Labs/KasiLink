// app/api/notifications/route.ts
// GET   — fetch current user's notifications
// PATCH — mark all as read
// POST  — save browser push subscription (H8)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Notification from "@/lib/models/Notification";
import User from "@/lib/models/User";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    await connectDB();
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return NextResponse.json({ notifications });
  } catch (err) {
    console.error("[GET /api/notifications]", err);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

export async function PATCH() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    await connectDB();
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/notifications]", err);
    return NextResponse.json(
      { error: "Failed to update notifications" },
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
    const subscription = body?.subscription;

    if (
      !subscription ||
      typeof subscription !== "object" ||
      typeof subscription.endpoint !== "string" ||
      !subscription.endpoint.trim()
    ) {
      return NextResponse.json(
        { error: "Invalid push subscription object" },
        { status: 400 },
      );
    }

    await connectDB();
    await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: { pushSubscription: JSON.stringify(subscription) } },
      { upsert: false },
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/notifications]", err);
    return NextResponse.json(
      { error: "Failed to save push subscription" },
      { status: 500 },
    );
  }
}
