// GET  /api/gigs/[id] — public
// PUT  /api/gigs/[id] — update (provider only)
// DELETE /api/gigs/[id] — cancel (provider only)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Gig from "@/lib/models/Gig";
import mongoose from "mongoose";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid gig ID" }, { status: 400 });
    }
    await connectDB();
    const gig = await Gig.findById(id).lean();
    if (!gig) return NextResponse.json({ error: "Gig not found" }, { status: 404 });

    // Increment view count (fire-and-forget)
    Gig.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();

    return NextResponse.json({ gig });
  } catch (err) {
    console.error("[GET /api/gigs/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch gig" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const { id } = await ctx.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid gig ID" }, { status: 400 });
    }

    await connectDB();
    const gig = await Gig.findById(id);
    if (!gig) return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    if (gig.providerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const allowed = ["title","description","payDisplay","payAmount","payType",
      "startDate","endDate","isFlexible","requirements","slots",
      "isUrgent","expiresAt","status","loadshedding"];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gigAny = gig as any;
    for (const key of allowed) {
      if (body[key] !== undefined) gigAny[key] = body[key];
    }
    await gig.save();

    return NextResponse.json({ gig });
  } catch (err) {
    console.error("[PUT /api/gigs/[id]]", err);
    return NextResponse.json({ error: "Failed to update gig" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const { id } = await ctx.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid gig ID" }, { status: 400 });
    }

    await connectDB();
    const gig = await Gig.findById(id);
    if (!gig) return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    if (gig.providerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    gig.status = "cancelled";
    await gig.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/gigs/[id]]", err);
    return NextResponse.json({ error: "Failed to cancel gig" }, { status: 500 });
  }
}
