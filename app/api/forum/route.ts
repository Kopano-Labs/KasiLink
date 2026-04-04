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
    const page = Math.max(Number(searchParams.get("page") ?? 1) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit") ?? 20) || 20, 1),
      50,
    );
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (category && category !== "all") filter.category = category;
    if (q && q.trim()) {
      const needle = new RegExp(escapeRegex(q.trim()), "i");
      filter.$or = [{ title: needle }, { content: needle }];
    }

    const [posts, total] = await Promise.all([
      ForumPost.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ForumPost.countDocuments(filter),
    ]);

    return NextResponse.json({
      posts,
      page,
      limit,
      total,
      hasMore: skip + posts.length < total,
    });
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

    const sanitizedTitle = sanitize(body.title);
    const sanitizedContent = sanitize(body.content);

    if (sanitizedTitle.length > 150) {
      return NextResponse.json(
        { error: "Title must be 150 characters or fewer" },
        { status: 400 },
      );
    }
    if (sanitizedContent.length > 2000) {
      return NextResponse.json(
        { error: "Content must be 2000 characters or fewer" },
        { status: 400 },
      );
    }

    const post = await ForumPost.create({
      title: sanitizedTitle,
      content: sanitizedContent,
      authorId: userId,
      authorName,
      category: body.category,
      upvotes: 0,
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
