// app/api/tutoring/[id]/route.ts
// GET /api/tutoring/:id — fetch a single tutoring session

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

const TutoringSessionSchema = new mongoose.Schema(
  {
    tutorId: { type: String, required: true },
    tutorName: { type: String, required: true, maxlength: 60 },
    studentId: { type: String, default: null },
    studentName: { type: String, default: null, maxlength: 60 },
    subject: { type: String, required: true, maxlength: 80 },
    grade: { type: String, required: true, maxlength: 30 },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    location: { type: String, enum: ["online", "physical"], default: "online" },
    meetingLink: { type: String, default: null },
    suburb: { type: String, required: true, maxlength: 80 },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["open", "pending", "confirmed", "completed", "cancelled"],
      default: "open",
    },
    reference: { type: String, unique: true },
  },
  { timestamps: true },
);

const TutoringSession =
  mongoose.models.TutoringSession ??
  mongoose.model("TutoringSession", TutoringSessionSchema);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await connectDB();
    const session = await TutoringSession.findById(id).lean();

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ session });
  } catch (err) {
    console.error("[GET /api/tutoring/:id]", err);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 },
    );
  }
}
