import { NextResponse, NextRequest } from "next/server";

/**
 * GET /api/load-shedding/schedule?zone=11&days=7
 *
 * Returns zone-specific load-shedding schedule for the next N days.
 * Sources: EskomSePush API (area_schedule endpoint)
 *
 * Task 7: Eskom × KasiLink Predictive Scheduling
 * Governance: Commandment 9 (Offline-First) — frontend caches this
 *             in IndexedDB via Kopano Vault
 *
 * Query params:
 *   zone  — Eskom zone ID or area ID (required)
 *   days  — number of days to fetch (default 7, max 14)
 */

// Cape Town area IDs for common zones (EskomSePush format)
const ZONE_TO_AREA: Record<string, string> = {
  // Cape Town zones
  "1": "capetown-1-khayelitsha",
  "2": "capetown-2-mitchellsplain",
  "3": "capetown-3-gugulethu",
  "4": "capetown-4-philippi",
  "5": "capetown-5-nyanga",
  "6": "capetown-6-langa",
  "7": "capetown-7-delft",
  "8": "capetown-8-bellville",
  "9": "capetown-9-parow",
  "10": "capetown-10-goodwood",
  "11": "capetown-11-elsiesriver",
  "12": "capetown-12-athlone",
  "13": "capetown-13-claremont",
  "14": "capetown-14-wynberg",
  "15": "capetown-15-simonstown",
  "16": "capetown-16-fishhoek",
  // Johannesburg zones
  "jhb-1": "johannesburg-1-soweto",
  "jhb-2": "johannesburg-2-alexandra",
  "jhb-3": "johannesburg-3-sandton",
  "jhb-4": "johannesburg-4-cbd",
  // Pass-through for full area IDs
};

// Generate a 7-day schedule from stage-based typical patterns
function generateScheduleFromStage(
  stage: number,
  days: number,
): { start: string; end: string; stage: number; date: string }[] {
  const schedule: { start: string; end: string; stage: number; date: string }[] = [];

  if (stage <= 0) return schedule;

  // Typical 2.5h rotation patterns per stage
  const STAGE_PATTERNS: Record<number, [string, string][]> = {
    1: [["06:00", "08:30"], ["14:00", "16:30"]],
    2: [["06:00", "08:30"], ["10:00", "12:30"], ["18:00", "20:30"]],
    3: [["02:00", "04:30"], ["06:00", "08:30"], ["14:00", "16:30"], ["18:00", "20:30"]],
    4: [["02:00", "04:30"], ["06:00", "08:30"], ["10:00", "12:30"], ["14:00", "16:30"], ["18:00", "20:30"], ["22:00", "00:30"]],
    5: [["00:00", "02:30"], ["04:00", "06:30"], ["08:00", "10:30"], ["12:00", "14:30"], ["16:00", "18:30"], ["20:00", "22:30"]],
    6: [["00:00", "04:30"], ["06:00", "10:30"], ["12:00", "16:30"], ["18:00", "22:30"]],
  };

  const pattern = STAGE_PATTERNS[Math.min(stage, 6)] || STAGE_PATTERNS[4];
  const today = new Date();

  for (let d = 0; d < days; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = date.toISOString().split("T")[0];

    for (const [start, end] of pattern) {
      schedule.push({ start, end, stage, date: dateStr });
    }
  }

  return schedule;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const zone = searchParams.get("zone") || "default";
  const days = Math.min(parseInt(searchParams.get("days") || "7", 10), 14);

  const apiKey = process.env.ESKOMSEPUSH_API_KEY;

  // Resolve zone to EskomSePush area ID
  const areaId = ZONE_TO_AREA[zone] || zone;

  // Try EskomSePush area schedule API
  if (apiKey) {
    try {
      const res = await fetch(
        `https://developer.sepush.co.za/business/2.0/area?id=${encodeURIComponent(areaId)}`,
        {
          headers: { token: apiKey },
          next: { revalidate: 3600 }, // cache 1 hour server-side
        },
      );

      if (res.ok) {
        const data = await res.json();
        const events = data?.events || [];
        const schedule = events.map(
          (event: { start: string; end: string; note: string }) => {
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);
            const stageMatch = event.note?.match(/stage\s*(\d)/i);
            return {
              start: `${String(startDate.getHours()).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(2, "0")}`,
              end: `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`,
              stage: stageMatch ? parseInt(stageMatch[1], 10) : 0,
              date: startDate.toISOString().split("T")[0],
            };
          },
        );

        // Get current stage
        const statusRes = await fetch(
          "https://developer.sepush.co.za/business/2.0/status",
          {
            headers: { token: apiKey },
            next: { revalidate: 300 },
          },
        );
        const statusData = statusRes.ok ? await statusRes.json() : {};
        const currentStage = parseInt(
          String(statusData?.status?.eskom?.stage ?? "0"),
          10,
        );

        return NextResponse.json({
          zone,
          stage: Number.isNaN(currentStage) ? 0 : currentStage,
          schedule,
          updatedAt: new Date().toISOString(),
          source: "eskomsepush",
        });
      }
    } catch {
      // Fall through to generated schedule
    }
  }

  // Fallback: generate schedule from current national stage
  try {
    const stageRes = await fetch(
      `${request.nextUrl.origin}/api/load-shedding`,
      { next: { revalidate: 300 } },
    );
    const stageData = stageRes.ok
      ? await stageRes.json()
      : { stage: 0 };

    const stage = stageData.stage ?? 0;

    return NextResponse.json({
      zone,
      stage,
      schedule: generateScheduleFromStage(stage, days),
      updatedAt: new Date().toISOString(),
      source: "generated-from-national-stage",
    });
  } catch {
    return NextResponse.json({
      zone,
      stage: 0,
      schedule: [],
      updatedAt: new Date().toISOString(),
      source: "fallback",
    });
  }
}
