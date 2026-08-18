import { describe, expect, it } from "vitest";
import {
  governedGigPayloadHash,
  KPGS_PROGRESSIVE_UPDATE_SOURCE,
  markGigStateApplied,
  markReplayProofPassed,
  markServerProofPassed,
  preflightGigCreate,
} from "../lib/kpgs/progressiveUpdate";

function governedBody(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    title: "Help paint a room",
    description: "Two hours of indoor painting help needed.",
    category: "handyman",
    payDisplay: "R200",
    location: {
      type: "Point",
      coordinates: [18.52, -33.91],
      suburb: "Century City",
      city: "Cape Town",
    },
    kpgs: {
      update_id: "gig-create-001",
      domain: "KasiLink.com",
      lane: "gigs",
      protocol: KPGS_PROGRESSIVE_UPDATE_SOURCE.contract,
      canonical_source_sha: KPGS_PROGRESSIVE_UPDATE_SOURCE.commit,
      apu_state: "GREEN",
      boundary_marker: "#NB",
      crud_intent: "CREATE",
      state_class: "pending_proposal",
      authority_effect: "none",
      foc_asserted: false,
      ...overrides,
    },
  };
}

describe("KasiLink canonical progressive Gig CREATE adapter", () => {
  it("keeps requests with no kpgs property on the legacy path without inventing a receipt", () => {
    const result = preflightGigCreate({ title: "legacy" });
    expect(result).toEqual({ mode: "legacy" });
  });

  it("does not let a malformed kpgs envelope downgrade into the legacy mutation lane", () => {
    for (const kpgs of [null, [], "GREEN", 7]) {
      const result = preflightGigCreate({ title: "not legacy", kpgs });
      expect(result.mode).toBe("governed");
      if (result.mode !== "governed") throw new Error("expected governed result");
      expect(result.admittedToServerProof).toBe(false);
      expect(result.receipt.code).toBe("INVALID_KPGS_ENVELOPE");
      expect(result.receipt.stages.telemetry.status).toBe("REJECT");
      expect(result.receipt.stages.stateUpdate.status).toBe("NOT_REACHED");
      expect(result.receipt.stages.distribution.status).toBe("NOT_REACHED");
    }
  });

  it("pins the canonical Introduction-to-MCP source and contract", () => {
    expect(KPGS_PROGRESSIVE_UPDATE_SOURCE).toEqual({
      repository: "RobynAwesome/Introduction-to-MCP",
      commit: "70f40324978ee8c3c1a8a77a29e6ac84c7f6bf3a",
      contract: "kpgs.progressive-update.v1",
      chain: "APU -> Progressive Update -> #NB -> bounded CRUD -> SWFUS",
    });
  });

  it("rejects APU RED before the state-update stage", () => {
    const result = preflightGigCreate(governedBody({ apu_state: "RED" }));
    expect(result.mode).toBe("governed");
    if (result.mode !== "governed") throw new Error("expected governed result");
    expect(result.admittedToServerProof).toBe(false);
    expect(result.receipt.code).toBe("APU_RED");
    expect(result.receipt.stages.invariantAudit.status).toBe("REJECT");
    expect(result.receipt.stages.stateUpdate.status).toBe("NOT_REACHED");
    expect(result.receipt.stages.distribution.status).toBe("NOT_REACHED");
  });

  it("holds APU YELLOW before mutation", () => {
    const result = preflightGigCreate(governedBody({ apu_state: "YELLOW" }));
    expect(result.mode).toBe("governed");
    if (result.mode !== "governed") throw new Error("expected governed result");
    expect(result.receipt.code).toBe("APU_NOT_GREEN");
    expect(result.receipt.outcome).toBe("HOLD");
    expect(result.receipt.stages.stateUpdate.status).toBe("NOT_REACHED");
  });

  it("requires the literal #NB boundary marker rather than a truthy alias", () => {
    const missing = preflightGigCreate(governedBody({ boundary_marker: "NB" }));
    expect(missing.mode).toBe("governed");
    if (missing.mode !== "governed") throw new Error("expected governed result");
    expect(missing.receipt.code).toBe("NB_BOUNDARY_REQUIRED");
    expect(missing.receipt.outcome).toBe("HOLD");

    const aliasOnly = governedBody({ boundary_marker: undefined, nb_boundary: true });
    const aliasResult = preflightGigCreate(aliasOnly);
    expect(aliasResult.mode).toBe("governed");
    if (aliasResult.mode !== "governed") throw new Error("expected governed result");
    expect(aliasResult.receipt.code).toBe("NB_BOUNDARY_REQUIRED");
  });

  it("rejects authoritative state and non-none authority effects", () => {
    const truth = preflightGigCreate(
      governedBody({ state_class: "constitutional_truth" }),
    );
    expect(truth.mode).toBe("governed");
    if (truth.mode !== "governed") throw new Error("expected governed result");
    expect(truth.receipt.code).toBe("AUTHORITATIVE_STATE_FORBIDDEN");

    const authority = preflightGigCreate(
      governedBody({ authority_effect: "grant" }),
    );
    expect(authority.mode).toBe("governed");
    if (authority.mode !== "governed") throw new Error("expected governed result");
    expect(authority.receipt.code).toBe("AUTHORITY_EFFECT_FORBIDDEN");
  });

  it("rejects explicit FOC before persistence", () => {
    const result = preflightGigCreate(governedBody({ foc_asserted: true }));
    expect(result.mode).toBe("governed");
    if (result.mode !== "governed") throw new Error("expected governed result");
    expect(result.receipt.code).toBe("FOC_ASSERTED");
    expect(result.receipt.stages.pocFocCheck.status).toBe("REJECT");
    expect(result.receipt.stages.stateUpdate.status).toBe("NOT_REACHED");
  });

  it("does not trust client POC and waits for server-side evidence", () => {
    const result = preflightGigCreate(
      governedBody({ poc_evidence_refs: ["client://self-asserted"] }),
    );
    expect(result.mode).toBe("governed");
    if (result.mode !== "governed") throw new Error("expected governed result");
    expect(result.admittedToServerProof).toBe(true);
    expect(result.receipt.code).toBe("SERVER_PROOF_REQUIRED");
    expect(result.receipt.evidenceRefs).toEqual([]);
    expect(result.receipt.stages.pocFocCheck.status).toBe("READY");
    expect(result.receipt.stages.stateUpdate.status).toBe("NOT_REACHED");
  });

  it("advances fresh server proof before state update and never fabricates SWFUS distribution", () => {
    const result = preflightGigCreate(governedBody());
    if (result.mode !== "governed") throw new Error("expected governed result");

    const proven = markServerProofPassed(result.receipt);
    expect(proven.stages.pocFocCheck.status).toBe("PASS");
    expect(proven.stages.stateUpdate.status).toBe("READY");
    expect(proven.stages.distribution.status).toBe("NOT_REACHED");
    expect(proven.evidenceRefs).toEqual([
      "runtime://clerk/authenticated",
      "runtime://kasilink/provider-profile/validated",
      "runtime://kasilink/gig-input-location/validated",
    ]);

    const applied = markGigStateApplied(proven, "kasilink://gigs/abc123", false);
    expect(applied.stages.stateUpdate.status).toBe("PASS");
    expect(applied.stages.distribution.status).toBe("NOT_REACHED");
    expect(applied.transportGrantsAuthority).toBe(false);
    expect(applied.canonical).toBe(false);
    expect(applied.authorityEffect).toBe("none");
  });

  it("uses stored governed identity + owner + payload hash as replay evidence without claiming fresh validation", () => {
    const result = preflightGigCreate(governedBody());
    if (result.mode !== "governed") throw new Error("expected governed result");

    const replay = markReplayProofPassed(result.receipt);
    expect(replay.code).toBe("REPLAY_STATE_READY");
    expect(replay.stages.pocFocCheck.status).toBe("PASS");
    expect(replay.stages.pocFocCheck.detail).toContain("exact replay eligibility");
    expect(replay.evidenceRefs).toEqual([
      "runtime://clerk/authenticated",
      "mongo://gigs/kpgsProgressive.updateId",
      "runtime://kasilink/idempotency-owner-payload-match",
    ]);
    expect(replay.evidenceRefs).not.toContain(
      "runtime://kasilink/provider-profile/validated",
    );
  });

  it("produces stable payload hashes independent of governance-envelope metadata", () => {
    const first = governedBody({ update_id: "first" });
    const replayEnvelope = governedBody({ update_id: "second", apu_state: "YELLOW" });

    expect(governedGigPayloadHash(first, "user_1")).toBe(
      governedGigPayloadHash(replayEnvelope, "user_1"),
    );

    const changed = {
      ...governedBody(),
      title: "Different governed content",
    };
    expect(governedGigPayloadHash(first, "user_1")).not.toBe(
      governedGigPayloadHash(changed, "user_1"),
    );
  });

  it("preserves the canonical eight-stage receipt order", () => {
    const result = preflightGigCreate(governedBody());
    if (result.mode !== "governed") throw new Error("expected governed result");
    expect(Object.keys(result.receipt.stages)).toEqual([
      "telemetry",
      "classification",
      "routing",
      "protocolSelection",
      "invariantAudit",
      "pocFocCheck",
      "stateUpdate",
      "distribution",
    ]);
  });
});
