export type OrchGigProvider = {
  id?: string;
  name?: string;
  skills?: string[];
  verified?: boolean;
  distance_km?: number;
  reliability?: number;
  available?: boolean;
  [key: string]: unknown;
};

const ORCH_BASE_URL =
  process.env.ORCH_BASE_URL ?? process.env.NEXT_PUBLIC_ORCH_BASE_URL ?? "";

async function requestOrch(path: string, init?: RequestInit) {
  const res = await fetch(`/api/orch/${path.replace(/^\/+/, "")}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Orch request failed: ${res.status}`);
  }
  return res.json();
}

export async function matchGigWithOrch(payload: {
  description: string;
  location: string;
  category: string;
  skills: string[];
  providers: OrchGigProvider[];
}) {
  return requestOrch("match", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getOrchLoadShedding(areaId: string, startTime?: string) {
  const params = new URLSearchParams({ area_id: areaId });
  if (startTime) params.set("start_time", startTime);
  const res = await fetch(`/api/orch/loadshedding?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to load shedding status: ${res.status}`);
  return res.json();
}

export async function getOrchDashboard() {
  return requestOrch("dashboard");
}

export async function sendOrchNotification(payload: {
  recipient: string;
  message?: string;
  gig_data?: Record<string, unknown>;
  booking_data?: Record<string, unknown>;
}) {
  return requestOrch("notify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function hasOrchBridge() {
  return Boolean(ORCH_BASE_URL);
}
