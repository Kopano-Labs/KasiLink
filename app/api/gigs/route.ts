import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  createGig,
  listGigs,
  RouteError,
} from "@/features/gigs/service";
import {
  executeGovernedGigCreate,
  KpgsProgressiveGateError,
  KpgsProgressiveMutationError,
} from "@/lib/kpgs/progressive-update";

export async function GET(req: NextRequest) {
  try {
    const requestedProvider = req.nextUrl.searchParams.get("providerId");
    const { userId } = requestedProvider === "me" ? await auth() : { userId: null };
    const payload = await listGigs({
      searchParams: req.nextUrl.searchParams,
      currentUserId: userId,
    });
    return NextResponse.json(payload);
  } catch (err) {
    if (err instanceof RouteError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[GET /api/gigs]", err);
    return NextResponse.json(
      { error: "Failed to fetch gigs" },
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
    const progressiveUpdate = body?.progressive_update;

    // Compatibility law: existing clients that do not opt into the KPGS
    // progressive envelope retain the exact legacy create path. They receive no
    // fabricated governance receipt.
    if (progressiveUpdate === undefined) {
      const gig = await createGig({ userId, body });
      return NextResponse.json({ gig }, { status: 201 });
    }

    const { progressive_update: _progressiveUpdate, ...gigBody } = body;
    void _progressiveUpdate;

    const governed = await executeGovernedGigCreate(progressiveUpdate, () =>
      createGig({ userId, body: gigBody }),
    );

    return NextResponse.json(
      { gig: governed.result, kpgs: governed.receipt },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof KpgsProgressiveGateError) {
      return NextResponse.json(
        { error: err.message, kpgs: err.receipt },
        { status: err.status },
      );
    }
    if (err instanceof KpgsProgressiveMutationError) {
      if (err.cause instanceof RouteError) {
        return NextResponse.json(
          { error: err.cause.message, kpgs: err.receipt },
          { status: err.cause.status },
        );
      }
      console.error("[POST /api/gigs governed state update]", err.cause);
      return NextResponse.json(
        { error: "Failed to create gig", kpgs: err.receipt },
        { status: 500 },
      );
    }
    if (err instanceof RouteError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[POST /api/gigs]", err);
    return NextResponse.json(
      { error: "Failed to create gig" },
      { status: 500 },
    );
  }
}
