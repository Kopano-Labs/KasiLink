// app/api/applications/[id]/route.ts
// GET    /api/applications/[id] — fetch single application (seeker or provider)
// PATCH  /api/applications/[id] — update status (provider reviews, seeker withdraws)
// DELETE /api/applications/[id] — hard withdraw (seeker only, while pending)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Application from "@/lib/models/Application";
import Gig from "@/lib/models/Gig";
import User from "@/lib/models/User";
import mongoose from "mongoose";

type RouteContext = { params: Promise<{ id: string }> };

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ----------------------------------------------------------------
// GET — fetch a single application
// Accessible by: the seeker who applied OR the provider who posted the gig
// ----------------------------------------------------------------
export async function GET(_req: NextRequest, ctx: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { id } = await ctx.params;
    if (!isValidId(id)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 },
      );
    }

    await connectDB();

    const application = await Application.findById(id).lean();
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    // Only the seeker or the provider can view this application
    if (application.seekerId !== userId && application.providerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ application });
  } catch (err) {
    console.error("[GET /api/applications/[id]]", err);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 },
    );
  }
}

// ----------------------------------------------------------------
// PATCH — update application status
//
// Provider can move:   pending → shortlisted | accepted | rejected
// Seeker can move:     pending | shortlisted  → withdrawn
//
// When a provider accepts:
//   - Gig status moves to "assigned"
//   - Gig.seekerId / seekerName are set
//   - All other pending applications for this gig are auto-rejected
// ----------------------------------------------------------------
export async function PATCH(req: NextRequest, ctx: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { id } = await ctx.params;
    if (!isValidId(id)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 },
      );
    }

    await connectDB();

    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    const body = await req.json();
    const { status, reviewNote } = body;

    const isProvider = application.providerId === userId;
    const isSeeker = application.seekerId === userId;

    if (!isProvider && !isSeeker) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // --- Provider transitions ---
    if (isProvider) {
      const providerAllowed: Record<string, string[]> = {
        pending: ["shortlisted", "accepted", "rejected"],
        shortlisted: ["accepted", "rejected"],
        accepted: [], // locked once accepted
        rejected: [], // locked
        withdrawn: [], // seeker withdrew — provider can't act
      };

      const allowed = providerAllowed[application.status] ?? [];
      if (!allowed.includes(status)) {
        return NextResponse.json(
          { error: `Cannot move from "${application.status}" to "${status}"` },
          { status: 422 },
        );
      }

      application.status = status;
      application.reviewedAt = new Date();
      if (reviewNote) application.reviewNote = String(reviewNote).slice(0, 200);

      // Acceptance side-effects
      if (status === "accepted") {
        // Load seeker profile for denormalised fields on Gig
        const seeker = await User.findOne({
          clerkId: application.seekerId,
        }).lean();

        await Promise.all([
          // Assign the gig
          Gig.findByIdAndUpdate(application.gigId, {
            status: "assigned",
            seekerId: application.seekerId,
            seekerName: seeker?.displayName ?? application.seekerName,
          }),
          // Auto-reject all other pending/shortlisted applications for this gig
          Application.updateMany(
            {
              gigId: application.gigId,
              _id: { $ne: application._id },
              status: { $in: ["pending", "shortlisted"] },
            },
            {
              status: "rejected",
              reviewedAt: new Date(),
              reviewNote: "Another applicant was selected",
            },
          ),
        ]);
      }
    }

    // --- Seeker transitions ---
    if (isSeeker && !isProvider) {
      const seekerAllowed: Record<string, string[]> = {
        pending: ["withdrawn"],
        shortlisted: ["withdrawn"],
        accepted: [], // can't withdraw after acceptance (must contact provider)
        rejected: [],
        withdrawn: [],
      };

      const allowed = seekerAllowed[application.status] ?? [];
      if (!allowed.includes(status)) {
        return NextResponse.json(
          { error: `Cannot move from "${application.status}" to "${status}"` },
          { status: 422 },
        );
      }

      application.status = status;

      // Decrement applicationCount on the gig
      await Gig.findByIdAndUpdate(application.gigId, {
        $inc: { applicationCount: -1 },
      });
    }

    await application.save();

    return NextResponse.json({ application });
  } catch (err) {
    console.error("[PATCH /api/applications/[id]]", err);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 },
    );
  }
}

// ----------------------------------------------------------------
// DELETE — hard delete (seeker withdraws while still pending)
// Use PATCH → "withdrawn" for soft withdrawal.
// DELETE is for cleanup: removes the document entirely.
// Only allowed while status === "pending" (not yet reviewed).
// ----------------------------------------------------------------
export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { id } = await ctx.params;
    if (!isValidId(id)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 },
      );
    }

    await connectDB();

    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    if (application.seekerId !== userId) {
      return NextResponse.json(
        { error: "Forbidden — only the applicant can delete" },
        { status: 403 },
      );
    }

    if (application.status !== "pending") {
      return NextResponse.json(
        {
          error:
            "You can only delete a pending application. Use PATCH to withdraw after shortlisting.",
        },
        { status: 422 },
      );
    }

    await Promise.all([
      application.deleteOne(),
      Gig.findByIdAndUpdate(application.gigId, {
        $inc: { applicationCount: -1 },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/applications/[id]]", err);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 },
    );
  }
}
