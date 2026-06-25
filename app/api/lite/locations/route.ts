import { NextResponse } from "next/server";
import { getLiteLocations, getLiteOverview } from "@/lib/lite-investor-discovery";

export function GET() {
  return NextResponse.json({
    summary: getLiteOverview(),
    locations: getLiteLocations(),
  });
}
