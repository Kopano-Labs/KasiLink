import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import ForumPost from "@/lib/models/ForumPost";
import User from "@/lib/models/User";
import { validateForumPost, sanitize } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category") || "all";

    const filter = category !== "all" ? { category } : {};
    const posts = await ForumPost.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ posts });
  } catch (err) {
    console.error("[GET /api/forum]", err);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
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
    const { valid, errors } = validateForumPost(body);
    if (!valid) return NextResponse.json({ errors }, { status: 422 });

    await connectDB();
    const user = await User.findOne({ clerkId: userId });
    if (!user)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const post = await ForumPost.create({
      title: sanitize(body.title),
      content: sanitize(body.content),
      category: body.category,
      authorId: userId,
      authorName: user.displayName,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/forum]", err);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
