import { NextResponse } from "next/server";
import { getLiteBusinesses } from "@/lib/lite-investor-discovery";

export function GET() {
  return NextResponse.json({
    businesses: getLiteBusinesses(),
  });
}
