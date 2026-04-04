import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Conversation from "@/lib/models/Conversation";
import Gig from "@/lib/models/Gig";
import Notification from "@/lib/models/Notification";

function normalizeParticipants(userId: string, providerId: string) {
  return [userId, providerId].sort();
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    await connectDB();
    const conversations = await Conversation.find({
      participants: userId,
    })
      .sort({ lastMessageAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ conversations });
  } catch (err) {
    console.error("[GET /api/chat]", err);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
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
    const gigId = String(body.gigId ?? "").trim();
    if (!gigId) {
      return NextResponse.json({ error: "gigId is required" }, { status: 400 });
    }

    await connectDB();
    const gig = await Gig.findById(gigId).lean();
    if (!gig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    }

    const participants = normalizeParticipants(userId, gig.providerId);
    const existing = await Conversation.findOne({
      gigId: gig._id,
      participants: { $all: participants },
    }).lean();
    if (existing) {
      return NextResponse.json({ conversation: existing }, { status: 200 });
    }

    const conversation = await Conversation.create({
      gigId: gig._id,
      gigTitle: gig.title,
      participants,
      lastMessageAt: new Date(),
      lastMessageText: "",
    });

    await Notification.create({
      userId: gig.providerId,
      type: "message",
      title: "New chat started",
      message: `A new chat started about ${gig.title}`,
      link: "/chat",
    });

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/chat]", err);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 },
    );
  }
}
