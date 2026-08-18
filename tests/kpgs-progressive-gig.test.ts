import { describe, expect, it, vi } from "vitest";
import {
  executeGovernedGigCreate,
  KPGS_BOUNDARY_MARKER,
  KPGS_CANONICAL_SOURCE,
  KPGS_SWFUS_STAGE_ORDER,
  KpgsProgressiveGateError,
  KpgsProgressiveMutationError,
  validateGigCreateProgressiveUpdate,
} from "@/lib/kpgs/progressive-update";

function envelope(overrides: Record<string, unknown> = {}) {
  return {
    schema: "kpgs.progressive-update.v1",
    update_id: "gig:create:test-001",
    node_id: "gig:proposal:test-001",
    operation: "CREATE",
    lane: "kasilink.gigs",
    context_route: "kasilink.api.gigs",
    protocol: "KPGS-vNext/APU-CRUD-SWFUS",
    idempotency_key: "gig:create:test-001",
    apu_status: "GREEN",
    poc_validated: true,
    foc_detected: false,
    invariant_passed: true,
    authority_effect: "none",
    state_class: "pending_proposal",
    evidence_refs: ["client-form-valid:test-001"],
    correlation_id: "gig:create:test-001",
    source: "kasilink-test",
    boundary_marker: KPGS_BOUNDARY_MARKER,
    canonical_source_sha: KPGS_CANONICAL_SOURCE.sha,
    ...overrides,
  };
}

describe("KasiLink canonical gig CREATE adapter", () => {
  it("pins the exact Introduction-to-MCP authority SHA", () => {
    expect(KPGS_CANONICAL_SOURCE.repository).toBe(
      "RobynAwesome/Introduction-to-MCP",
    );
    expect(KPGS_CANONICAL_SOURCE.sha).toBe(
      "70f40324978ee8c3c1a8a77a29e6ac84c7f6bf3a",
    );
  });

  it("GREEN + POC + #NB reaches bounded state update but not distribution", async () => {
    const mutate = vi.fn().mockResolvedValue({ _id: "gig_1" });
    const result = await executeGovernedGigCreate(envelope(), mutate);

    expect(mutate).toHaveBeenCalledOnce();
    expect(result.result).toEqual({ _id: "gig_1" });
    expect(result.receipt.disposition).toBe("APPLIED");
    expect(result.receipt.synchronized).toBe(false);
    expect(result.receipt.canonical_authority_changed).toBe(false);
    expect(result.receipt.stages.map((item) => item.stage)).toEqual(
      KPGS_SWFUS_STAGE_ORDER,
    );
    expect(
      result.receipt.stages.find((item) => item.stage === "STATE_UPDATE")?.status,
    ).toBe("PASS");
    expect(
      result.receipt.stages.find((item) => item.stage === "DISTRIBUTION")?.status,
    ).toBe("NOT_REACHED");
  });

  it("RED cannot invoke createGig", async () => {
    const mutate = vi.fn();
    await expect(
      executeGovernedGigCreate(envelope({ apu_status: "RED" }), mutate),
    ).rejects.toMatchObject({
      name: "KpgsProgressiveGateError",
      status: 422,
    });
    expect(mutate).not.toHaveBeenCalled();
  });

  it("FOC cannot invoke createGig", async () => {
    const mutate = vi.fn();
    await expect(
      executeGovernedGigCreate(envelope({ foc_detected: true }), mutate),
    ).rejects.toBeInstanceOf(KpgsProgressiveGateError);
    expect(mutate).not.toHaveBeenCalled();
  });

  it("YELLOW holds before state update and fills later stages as NOT_REACHED", () => {
    try {
      validateGigCreateProgressiveUpdate(envelope({ apu_status: "YELLOW" }));
      throw new Error("expected gate to hold");
    } catch (error) {
      expect(error).toBeInstanceOf(KpgsProgressiveGateError);
      const gate = error as KpgsProgressiveGateError;
      expect(gate.status).toBe(409);
      expect(gate.receipt.disposition).toBe("HELD");
      expect(
        gate.receipt.stages.find((item) => item.stage === "POC_FOC_CHECK")
          ?.status,
      ).toBe("HOLD");
      expect(
        gate.receipt.stages.find((item) => item.stage === "STATE_UPDATE")
          ?.status,
      ).toBe("NOT_REACHED");
      expect(
        gate.receipt.stages.find((item) => item.stage === "DISTRIBUTION")
          ?.status,
      ).toBe("NOT_REACHED");
    }
  });

  it("missing POC evidence holds before createGig", async () => {
    const mutate = vi.fn();
    await expect(
      executeGovernedGigCreate(
        envelope({ poc_validated: false, evidence_refs: [] }),
        mutate,
      ),
    ).rejects.toMatchObject({ status: 409 });
    expect(mutate).not.toHaveBeenCalled();
  });

  it("constitutional/authoritative state and authority widening fail closed", () => {
    expect(() =>
      validateGigCreateProgressiveUpdate(
        envelope({ state_class: "constitutional_truth" }),
      ),
    ).toThrow(KpgsProgressiveGateError);
    expect(() =>
      validateGigCreateProgressiveUpdate(
        envelope({ authority_effect: "canonical" }),
      ),
    ).toThrow(KpgsProgressiveGateError);
  });

  it("wrong #NB or stale canonical source SHA fails invariant audit", () => {
    for (const candidate of [
      envelope({ boundary_marker: "NB" }),
      envelope({ canonical_source_sha: "deadbeef" }),
    ]) {
      try {
        validateGigCreateProgressiveUpdate(candidate);
        throw new Error("expected invariant rejection");
      } catch (error) {
        expect(error).toBeInstanceOf(KpgsProgressiveGateError);
        const gate = error as KpgsProgressiveGateError;
        expect(gate.status).toBe(422);
        expect(
          gate.receipt.stages.find((item) => item.stage === "INVARIANT_AUDIT")
            ?.status,
        ).toBe("REJECT");
        expect(
          gate.receipt.stages.find((item) => item.stage === "STATE_UPDATE")
            ?.status,
        ).toBe("NOT_REACHED");
      }
    }
  });

  it("mutation failure yields a rejected state-update receipt and never claims distribution", async () => {
    const failure = new Error("database write failed");
    try {
      await executeGovernedGigCreate(envelope(), async () => {
        throw failure;
      });
      throw new Error("expected mutation failure");
    } catch (error) {
      expect(error).toBeInstanceOf(KpgsProgressiveMutationError);
      const mutation = error as KpgsProgressiveMutationError;
      expect(mutation.cause).toBe(failure);
      expect(mutation.receipt.disposition).toBe("REJECTED");
      expect(
        mutation.receipt.stages.find((item) => item.stage === "STATE_UPDATE")
          ?.status,
      ).toBe("REJECT");
      expect(
        mutation.receipt.stages.find((item) => item.stage === "DISTRIBUTION")
          ?.status,
      ).toBe("NOT_REACHED");
    }
  });
});
