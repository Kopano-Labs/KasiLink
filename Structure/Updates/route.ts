import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Message from "@/lib/models/Message";
import Conversation from "@/lib/models/Conversation";
import { validateMessage, sanitize } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const { searchParams } = req.nextUrl;
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Missing conversationId" },
        { status: 400 },
      );
    }

    await connectDB();

    const conv = await Conversation.findById(conversationId);
    if (!conv || !conv.participants.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("[GET /api/messages]", err);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const body = await req.json();
    const { valid, errors } = validateMessage(body);
    if (!valid) return NextResponse.json({ errors }, { status: 400 });

    await connectDB();

    const conv = await Conversation.findById(body.conversationId);
    if (!conv || !conv.participants.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const message = await Message.create({
      conversationId: conv._id,
      senderId: userId,
      content: sanitize(body.text),
      readAt: null,
    });

    conv.lastMessageAt = new Date();
    await conv.save();

    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/messages]", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
