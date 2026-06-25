import { NextRequest, NextResponse } from "next/server";
import { getLiteRecommendations } from "@/lib/lite-investor-discovery";

export function GET(request: NextRequest) {
  const limit = Number.parseInt(request.nextUrl.searchParams.get("limit") ?? "6", 10);
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 12) : 6;

  return NextResponse.json({
    recommendations: getLiteRecommendations(safeLimit),
  });
}
