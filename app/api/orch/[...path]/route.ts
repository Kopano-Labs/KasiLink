import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const ORCH_BASE_URL =
  process.env.ORCH_BASE_URL ?? process.env.NEXT_PUBLIC_ORCH_BASE_URL;

async function forward(req: NextRequest, path: string[]) {
  const base = ORCH_BASE_URL;
  if (!base) {
    return NextResponse.json(
      { error: "ORCH_BASE_URL is not configured" },
      { status: 503 },
    );
  }

  const url = new URL(path.join("/"), base.endsWith("/") ? base : `${base}/`);
  url.search = req.nextUrl.search;

  const body =
    req.method === "GET" || req.method === "HEAD" ? undefined : await req.text();
  const authResult = await auth();
  const token = authResult.getToken ? await authResult.getToken() : null;

  const response = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": req.headers.get("content-type") ?? "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  }

  return new NextResponse(await response.text(), {
    status: response.status,
    headers: { "content-type": contentType || "text/plain" },
  });
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  return forward(req, path);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  return forward(req, path);
}
