import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import ForumPost from "@/lib/models/ForumPost";
import User from "@/lib/models/User";
import { sanitize, validateForumPost } from "@/lib/validation";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category");
    const q = searchParams.get("q");
    const limit = Math.min(
      Number(searchParams.get("limit") ?? 20) || 20,
      50,
    );

    const filter: Record<string, unknown> = {};
    if (category && category !== "all") filter.category = category;
    if (q && q.trim()) {
      const needle = new RegExp(escapeRegex(q.trim()), "i");
      filter.$or = [{ title: needle }, { content: needle }];
    }

    const posts = await ForumPost.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ posts });
  } catch (err) {
    console.error("[GET /api/forum]", err);
    return NextResponse.json(
      { error: "Failed to fetch forum posts" },
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
    const validation = validateForumPost(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Invalid forum payload", details: validation.errors },
        { status: 400 },
      );
    }

    await connectDB();
    const author = await User.findOne({ clerkId: userId });
    const authorName = author?.displayName || "Anonymous";

    const post = await ForumPost.create({
      title: sanitize(body.title).slice(0, 150),
      content: sanitize(body.content).slice(0, 2000),
      authorId: userId,
      authorName,
      category: body.category,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/forum]", err);
    return NextResponse.json(
      { error: "Failed to create forum post" },
      { status: 500 },
    );
  }
}
