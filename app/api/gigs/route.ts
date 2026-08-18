import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  createGig,
  createGovernedGig,
  listGigs,
  RouteError,
} from "@/features/gigs/service";
import { preflightGigCreate } from "@/lib/kpgs/progressiveUpdate";

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
    const preflight = preflightGigCreate(body);

    // Compatibility lane: current clients keep their existing behavior while the
    // PWA is progressively migrated. We do not fabricate a governance receipt for it.
    if (preflight.mode === "legacy") {
      const gig = await createGig({ userId, body });
      return NextResponse.json({ gig }, { status: 201 });
    }

    if (!preflight.admittedToServerProof) {
      return NextResponse.json(
        {
          error: preflight.receipt.code,
          kpgs: { receipt: preflight.receipt },
        },
        { status: preflight.httpStatus },
      );
    }

    const result = await createGovernedGig({
      userId,
      body,
      preflightReceipt: preflight.receipt,
    });

    return NextResponse.json(
      {
        gig: result.gig,
        kpgs: {
          replay: result.replay,
          receipt: result.receipt,
        },
      },
      { status: result.replay ? 200 : 201 },
    );
  } catch (err) {
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
