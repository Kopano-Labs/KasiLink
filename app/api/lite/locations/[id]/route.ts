import { NextRequest, NextResponse } from "next/server";
import { getLiteLocationById } from "@/lib/lite-investor-discovery";

export function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return context.params.then(({ id }) => {
    const numericId = Number.parseInt(id, 10);

    if (!Number.isFinite(numericId)) {
      return NextResponse.json({ error: "Invalid location id" }, { status: 400 });
    }

    const result = getLiteLocationById(numericId);

    if (!result) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  });
}
