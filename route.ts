import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Gig from "@/lib/models/Gig";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const gig = await Gig.findById(id).lean();
    if (!gig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    }

    return NextResponse.json({ gig });
  } catch (err) {
    console.error("[GET /api/gigs/:id/view]", err);
    return NextResponse.json(
      { error: "Failed to fetch gig details" },
      { status: 500 },
    );
  }
}
