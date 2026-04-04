import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import ForumPost from "@/lib/models/ForumPost";

async function loadPost(id: string) {
  await connectDB();
  return ForumPost.findById(id);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { id } = await params;
    const post = await loadPost(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    post.upvotes += 1;
    await post.save();

    return NextResponse.json({ post });
  } catch (err) {
    console.error("[PATCH /api/forum/[id]]", err);
    return NextResponse.json(
      { error: "Failed to upvote post" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { id } = await params;
    const post = await loadPost(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const reason = String(body.reason ?? "community").slice(0, 80);

    post.flags += 1;
    await post.save();

    return NextResponse.json({
      post,
      flag: {
        reason,
        postId: id,
      },
    });
  } catch (err) {
    console.error("[POST /api/forum/[id]]", err);
    return NextResponse.json(
      { error: "Failed to flag post" },
      { status: 500 },
    );
  }
}
