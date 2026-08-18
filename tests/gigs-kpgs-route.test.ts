import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { KPGS_CANONICAL_SOURCE } from "@/lib/kpgs/progressive-update";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));

vi.mock("@/features/gigs/service", () => ({
  RouteError: class RouteError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  },
  listGigs: vi.fn(),
  createGig: vi.fn(),
}));

function request(body: unknown) {
  return new NextRequest("http://localhost/api/gigs", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

function gigBody() {
  return {
    title: "Car wash helper",
    description: "Wash cars in Soweto morning shift.",
    category: "car_wash",
    payDisplay: "R150/day",
    location: { coordinates: [28.0473, -26.2041] },
  };
}

function progressive(overrides: Record<string, unknown> = {}) {
  return {
    schema: "kpgs.progressive-update.v1",
    update_id: "gig:create:route-001",
    node_id: "gig:proposal:route-001",
    operation: "CREATE",
    lane: "kasilink.gigs",
    context_route: "kasilink.api.gigs",
    protocol: "KPGS-vNext/APU-CRUD-SWFUS",
    idempotency_key: "gig:create:route-001",
    apu_status: "GREEN",
    poc_validated: true,
    foc_detected: false,
    invariant_passed: true,
    authority_effect: "none",
    state_class: "pending_proposal",
    evidence_refs: ["client-form-valid:route-001"],
    boundary_marker: "#NB",
    canonical_source_sha: KPGS_CANONICAL_SOURCE.sha,
    ...overrides,
  };
}

describe("POST /api/gigs KPGS progressive opt-in", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValue({ userId: "user_abc" } as never);
  });

  it("keeps legacy POST compatible and emits no governance receipt", async () => {
    const { createGig } = await import("@/features/gigs/service");
    vi.mocked(createGig).mockResolvedValueOnce({ _id: "legacy", title: "Legacy" } as never);

    const { POST } = await import("@/app/api/gigs/route");
    const res = await POST(request(gigBody()));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.gig._id).toBe("legacy");
    expect(json.kpgs).toBeUndefined();
    expect(createGig).toHaveBeenCalledOnce();
  });

  it("RED/FOC is rejected before createGig is reachable", async () => {
    const { createGig } = await import("@/features/gigs/service");
    const { POST } = await import("@/app/api/gigs/route");
    const res = await POST(
      request({
        ...gigBody(),
        progressive_update: progressive({ apu_status: "RED", foc_detected: true }),
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(422);
    expect(createGig).not.toHaveBeenCalled();
    expect(json.kpgs.disposition).toBe("REJECTED");
    expect(
      json.kpgs.stages.find(
        (item: { stage: string }) => item.stage === "STATE_UPDATE",
      ).status,
    ).toBe("NOT_REACHED");
  });

  it("YELLOW is held before createGig is reachable", async () => {
    const { createGig } = await import("@/features/gigs/service");
    const { POST } = await import("@/app/api/gigs/route");
    const res = await POST(
      request({ ...gigBody(), progressive_update: progressive({ apu_status: "YELLOW" }) }),
    );
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(createGig).not.toHaveBeenCalled();
    expect(json.kpgs.disposition).toBe("HELD");
  });

  it("GREEN proof reaches createGig and returns local APPLIED receipt without fake SWFUS distribution", async () => {
    const { createGig } = await import("@/features/gigs/service");
    vi.mocked(createGig).mockResolvedValueOnce({ _id: "governed", title: "Governed" } as never);

    const { POST } = await import("@/app/api/gigs/route");
    const res = await POST(
      request({ ...gigBody(), progressive_update: progressive() }),
    );
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(createGig).toHaveBeenCalledOnce();
    const calledBody = vi.mocked(createGig).mock.calls[0]?.[0]?.body;
    expect(calledBody.progressive_update).toBeUndefined();
    expect(json.gig._id).toBe("governed");
    expect(json.kpgs.disposition).toBe("APPLIED");
    expect(json.kpgs.synchronized).toBe(false);
    expect(
      json.kpgs.stages.find(
        (item: { stage: string }) => item.stage === "DISTRIBUTION",
      ).status,
    ).toBe("NOT_REACHED");
  });
});
