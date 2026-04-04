import { NextResponse } from "next/server";

const FALLBACK = {
  stage: 0,
  status: "Status unavailable",
  updatedAt: new Date().toISOString(),
};

export async function GET() {
  const apiKey = process.env.ESKOMSEPUSH_API_KEY;

  if (!apiKey) {
    return NextResponse.json(FALLBACK);
  }

  try {
    const res = await fetch("https://developer.sepush.co.za/business/2.0/status", {
      headers: { token: apiKey },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(FALLBACK);
    }

    const data = await res.json();
    const raw = data?.status?.eskom?.stage ?? "0";
    const stage = parseInt(String(raw), 10);
    const safeStage = Number.isNaN(stage) ? 0 : stage;

    return NextResponse.json({
      stage: safeStage,
      status: safeStage > 0 ? `Stage ${safeStage}` : "No Load Shedding",
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
