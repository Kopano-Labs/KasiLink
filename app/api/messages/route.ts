import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Conversation from "@/lib/models/Conversation";
import Message from "@/lib/models/Message";
import Notification from "@/lib/models/Notification";
import User from "@/lib/models/User";
import { sanitize, validateMessage } from "@/lib/validation";

async function loadConversation(conversationId: string) {
  await connectDB();
  return Conversation.findById(conversationId);
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const conversationId = searchParams.get("conversationId");
    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 },
      );
    }

    const conversation = await loadConversation(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    if (!conversation.participants.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Message.updateMany(
      { conversationId, senderId: { $ne: userId }, readAt: null },
      { readAt: new Date() },
    );

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(100)
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
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await req.json();
    const validation = validateMessage(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Invalid message payload", details: validation.errors },
        { status: 400 },
      );
    }

    const conversationId = String(body.conversationId ?? "").trim();
    const conversation = await loadConversation(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    if (!conversation.participants.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const sender = await User.findOne({ clerkId: userId });
    if (!sender) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const text = sanitize(body.text).slice(0, 1000);
    const message = await Message.create({
      conversationId: conversation._id,
      senderId: userId,
      senderName: sender.displayName || "Anonymous",
      text,
    });

    conversation.lastMessageAt = new Date();
    conversation.lastMessageText = text.slice(0, 100);
    await conversation.save();

    const otherParticipant = conversation.participants.find(
      (participant) => participant !== userId,
    );
    if (otherParticipant) {
      await Notification.create({
        userId: otherParticipant,
        type: "message",
        title: "New message received",
        message: `${sender.displayName || "Someone"} sent you a message`,
        link: "/chat",
      });
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/messages]", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
