import { NextResponse } from "next/server";
import type { StewardLaneSnapshot } from "@/lib/kopano-steward";

function getSnapshotUrl(): string | null {
  const direct = process.env.KOPANO_STEWARD_SNAPSHOT_URL?.trim();
  if (direct) return direct;
  const base = process.env.KOPANO_API_BASE?.replace(/\/$/, "");
  if (base) return `${base}/api/kc/phu/steward-lane/kasilink-snapshot`;
  return null;
}

function fallbackSnapshot(): StewardLaneSnapshot {
  const now = new Date().toISOString().slice(0, 16).replace("T", " ");

  return {
    schema: "kasilink_steward_lane_v2",
    active: true,
    cf_operator: "LD-LPM",
    dispatch_pin:
      "@LD-LPM → Cassy: Stress ideas under Bracket + BlackMask + BlackMass. KC Save|Watch only.",
    actors: [
      { id: "kc", display: "KC", role: "review_ledger", mode: "Save | Watch only" },
      { id: "cassy", display: "Cassy", role: "teaching_lane", mode: "BlackMask + submit" },
      { id: "cassey", display: "Cassey", role: "teacher", mode: "Approve → KC opinion" },
      { id: "ld_lpm", display: "LD", role: "lpm_operator", mode: "LPH:witness" },
    ],
    kpefs_vector: "V4_DIASPORA",
    lite_path: "/lite",
    latest_comms: [
      {
        id: "comms-ld-lpm-fallback",
        ts: now,
        tranche: "LD-LPM operate — local fallback (set KOPANO_STEWARD_SNAPSHOT_URL)",
        operator: "LD-LPM",
        dispatch: "@LD-LPM → LD: Operate as LPM under bracket protocol.",
        verdict: "WATCH",
        bracket: "[LPM_PROTOCOL]",
        body:
          "Steward dock on fallback seed. Point KOPANO_STEWARD_SNAPSHOT_URL at kopano-core for live Main Brain comms.",
      },
    ],
  };
}

export async function GET() {
  const snapshotUrl = getSnapshotUrl();
  if (snapshotUrl) {
    try {
      const res = await fetch(snapshotUrl, {
        next: { revalidate: 30 },
      });
      if (res.ok) {
        const data = (await res.json()) as StewardLaneSnapshot;
        if (data?.schema?.startsWith("kasilink_steward")) {
          return NextResponse.json(data);
        }
      }
    } catch {
      /* fall through to local fallback */
    }
  }

  return NextResponse.json(fallbackSnapshot());
}
