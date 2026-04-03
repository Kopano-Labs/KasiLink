// POST /api/webhooks/clerk — sync Clerk users to MongoDB
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

interface ClerkEmailAddress { email_address: string }
interface ClerkPhoneNumber { phone_number: string }

interface ClerkUserPayload {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  email_addresses?: ClerkEmailAddress[];
  phone_numbers?: ClerkPhoneNumber[];
  image_url?: string;
}

interface WebhookEvent {
  type: string;
  data: ClerkUserPayload;
}

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Misconfigured" }, { status: 500 });
  }

  // Verify signature
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();
  let event: WebhookEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await connectDB();
  const { type, data } = event;

  if (type === "user.created" || type === "user.updated") {
    const phone = data.phone_numbers?.[0]?.phone_number ?? "";
    const displayName = [data.first_name, data.last_name].filter(Boolean).join(" ")
      || data.username
      || phone
      || "KasiLink User";

    await User.findOneAndUpdate(
      { clerkId: data.id },
      {
        $set: {
          clerkId: data.id,
          phone,
          displayName,
          avatarUrl: data.image_url,
          isActive: true,
          lastSeen: new Date(),
        },
        $setOnInsert: {
          role: "seeker",
          location: { type: "Point", coordinates: [28.0473, -26.2041] },
          skills: [],
          categories: [],
          isVerified: false,
          rating: { average: 0, count: 0 },
          completedGigs: 0,
        },
      },
      { upsert: true, new: true },
    );
  }

  if (type === "user.deleted") {
    await User.findOneAndUpdate({ clerkId: data.id }, { isActive: false });
  }

  return NextResponse.json({ received: true });
}
