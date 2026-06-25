import { NextRequest, NextResponse } from "next/server";
import { searchLiteOpportunities } from "@/lib/lite-investor-discovery";

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";

  return NextResponse.json({
    q: query,
    results: searchLiteOpportunities(query),
  });
}
