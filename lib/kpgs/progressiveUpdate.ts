import { createHash } from "node:crypto";

export const KPGS_PROGRESSIVE_UPDATE_SOURCE = Object.freeze({
  repository: "RobynAwesome/Introduction-to-MCP",
  commit: "70f40324978ee8c3c1a8a77a29e6ac84c7f6bf3a",
  contract: "kpgs.progressive-update.v1",
  chain: "APU -> Progressive Update -> #NB -> bounded CRUD -> SWFUS",
});

export type KpgsStageStatus =
  | "PASS"
  | "READY"
  | "HOLD"
  | "REJECT"
  | "NOT_REACHED";

export type KpgsStage = {
  status: KpgsStageStatus;
  detail: string;
};

export type KpgsProgressiveReceipt = {
  schema: "kasilink.kpgs.progressive-gig-create.v1";
  updateId: string | null;
  canonicalSource: typeof KPGS_PROGRESSIVE_UPDATE_SOURCE;
  canonical: false;
  authorityEffect: "none";
  transportGrantsAuthority: false;
  outcome: "LEGACY" | "HOLD" | "REJECT" | "READY" | "APPLIED";
  code: string;
  stages: {
    telemetry: KpgsStage;
    classification: KpgsStage;
    routing: KpgsStage;
    protocolSelection: KpgsStage;
    invariantAudit: KpgsStage;
    pocFocCheck: KpgsStage;
    stateUpdate: KpgsStage;
    distribution: KpgsStage;
  };
  resourceRef: string | null;
  replay: boolean;
};

type GovernedPreflight = {
  mode: "governed";
  admittedToServerProof: boolean;
  httpStatus: number;
  receipt: KpgsProgressiveReceipt;
};

export type GigCreatePreflight =
  | { mode: "legacy" }
  | GovernedPreflight;

const ADMITTED_STATE_CLASSES = new Set([
  "non_authoritative",
  "derived_projection",
  "pending_proposal",
]);

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function stage(status: KpgsStageStatus, detail: string): KpgsStage {
  return { status, detail };
}

function emptyReceipt(updateId: string | null): KpgsProgressiveReceipt {
  return {
    schema: "kasilink.kpgs.progressive-gig-create.v1",
    updateId,
    canonicalSource: KPGS_PROGRESSIVE_UPDATE_SOURCE,
    canonical: false,
    authorityEffect: "none",
    transportGrantsAuthority: false,
    outcome: "READY",
    code: "KPGS_PREFLIGHT",
    stages: {
      telemetry: stage("NOT_REACHED", "No telemetry admitted yet."),
      classification: stage("NOT_REACHED", "Classification not reached."),
      routing: stage("NOT_REACHED", "Routing not reached."),
      protocolSelection: stage("NOT_REACHED", "Protocol selection not reached."),
      invariantAudit: stage("NOT_REACHED", "Invariant audit not reached."),
      pocFocCheck: stage("NOT_REACHED", "POC/FOC proof check not reached."),
      stateUpdate: stage("NOT_REACHED", "State update not reached."),
      distribution: stage("NOT_REACHED", "SWFUS distribution not reached."),
    },
    resourceRef: null,
    replay: false,
  };
}

function stop(
  receipt: KpgsProgressiveReceipt,
  stageName: keyof KpgsProgressiveReceipt["stages"],
  status: "HOLD" | "REJECT",
  code: string,
  detail: string,
  httpStatus: number,
): GovernedPreflight {
  receipt.stages[stageName] = stage(status, detail);
  receipt.outcome = status;
  receipt.code = code;
  return {
    mode: "governed",
    admittedToServerProof: false,
    httpStatus,
    receipt,
  };
}

/**
 * Evaluates only client intent and canonical routing/invariant fields.
 * POC evidence is deliberately NOT trusted from the client. The proof stage
 * remains READY until server-side auth/profile/input validation has executed.
 */
export function preflightGigCreate(body: unknown): GigCreatePreflight {
  const bodyRecord = asRecord(body);
  const kpgs = asRecord(bodyRecord?.kpgs);
  if (!kpgs) return { mode: "legacy" };

  const updateId = typeof kpgs.update_id === "string" ? kpgs.update_id.trim() : "";
  const receipt = emptyReceipt(updateId || null);

  if (!updateId || updateId.length > 200) {
    return stop(
      receipt,
      "telemetry",
      "REJECT",
      "INVALID_UPDATE_ID",
      "Governed requests require a stable update_id of 1-200 characters.",
      400,
    );
  }
  receipt.stages.telemetry = stage("PASS", "Governed update identity admitted.");

  const stateClass = kpgs.state_class;
  const authorityEffect = kpgs.authority_effect;
  if (stateClass === "constitutional_truth") {
    return stop(
      receipt,
      "classification",
      "REJECT",
      "AUTHORITATIVE_STATE_FORBIDDEN",
      "KasiLink's SWFUS adapter cannot create constitutional truth.",
      403,
    );
  }
  if (typeof stateClass !== "string" || !ADMITTED_STATE_CLASSES.has(stateClass)) {
    return stop(
      receipt,
      "classification",
      "REJECT",
      "INVALID_STATE_CLASS",
      "state_class must be a canonical non-authoritative projection class.",
      400,
    );
  }
  if (authorityEffect !== "none") {
    return stop(
      receipt,
      "classification",
      "REJECT",
      "AUTHORITY_EFFECT_FORBIDDEN",
      "Domain adapters may not grant authority through SWFUS transport.",
      403,
    );
  }
  receipt.stages.classification = stage(
    "PASS",
    `Admitted non-authoritative state class: ${stateClass}.`,
  );

  if (kpgs.domain !== "KasiLink.com" || kpgs.lane !== "gigs") {
    return stop(
      receipt,
      "routing",
      "REJECT",
      "ROUTING_SCOPE_MISMATCH",
      "Governed gig creation is scoped to KasiLink.com / gigs.",
      403,
    );
  }
  receipt.stages.routing = stage("PASS", "Routed to KasiLink.com / gigs.");

  if (
    kpgs.protocol !== KPGS_PROGRESSIVE_UPDATE_SOURCE.contract ||
    kpgs.canonical_source_sha !== KPGS_PROGRESSIVE_UPDATE_SOURCE.commit
  ) {
    return stop(
      receipt,
      "protocolSelection",
      "REJECT",
      "CANONICAL_PROTOCOL_MISMATCH",
      "Progressive update protocol or pinned Introduction-to-MCP source SHA does not match.",
      409,
    );
  }
  receipt.stages.protocolSelection = stage(
    "PASS",
    "Pinned canonical kpgs.progressive-update.v1 selected.",
  );

  if (kpgs.crud_intent !== "CREATE") {
    return stop(
      receipt,
      "invariantAudit",
      "REJECT",
      "CRUD_SCOPE_MISMATCH",
      "This adapter is bounded to CREATE for the gig pilot.",
      400,
    );
  }
  if (kpgs.nb_boundary !== true) {
    return stop(
      receipt,
      "invariantAudit",
      "HOLD",
      "NB_BOUNDARY_REQUIRED",
      "#NB must be explicit before a mutating CRUD stage can continue.",
      422,
    );
  }

  const apuState = kpgs.apu_state;
  if (apuState === "RED") {
    return stop(
      receipt,
      "invariantAudit",
      "REJECT",
      "APU_RED",
      "APU RED rejects mutation before state update.",
      403,
    );
  }
  if (apuState !== "GREEN") {
    return stop(
      receipt,
      "invariantAudit",
      "HOLD",
      "APU_NOT_GREEN",
      "Mutating CRUD requires APU GREEN; YELLOW/unspecified remains HOLD.",
      422,
    );
  }
  receipt.stages.invariantAudit = stage(
    "PASS",
    "#NB present; CREATE bounded; APU GREEN; authority remains none.",
  );

  if (kpgs.foc_asserted === true) {
    return stop(
      receipt,
      "pocFocCheck",
      "REJECT",
      "FOC_ASSERTED",
      "Explicit FOC cannot cross the mutation membrane.",
      403,
    );
  }

  receipt.stages.pocFocCheck = stage(
    "READY",
    "Awaiting server-side Clerk auth, provider-profile and gig-input validation evidence. Client-supplied POC is not trusted.",
  );
  receipt.outcome = "READY";
  receipt.code = "SERVER_PROOF_REQUIRED";

  return {
    mode: "governed",
    admittedToServerProof: true,
    httpStatus: 200,
    receipt,
  };
}

export function markServerProofPassed(
  receipt: KpgsProgressiveReceipt,
): KpgsProgressiveReceipt {
  return {
    ...receipt,
    outcome: "READY",
    code: "STATE_UPDATE_READY",
    stages: {
      ...receipt.stages,
      pocFocCheck: stage(
        "PASS",
        "Server-side Clerk authentication, provider-profile lookup and gig-input/location validation passed.",
      ),
      stateUpdate: stage("READY", "Bounded Gig CREATE is admitted to persistence."),
      distribution: stage("NOT_REACHED", "SWFUS distribution has not executed."),
    },
  };
}

export function markGigStateApplied(
  receipt: KpgsProgressiveReceipt,
  resourceRef: string,
  replay: boolean,
): KpgsProgressiveReceipt {
  return {
    ...receipt,
    outcome: "APPLIED",
    code: replay ? "IDEMPOTENT_REPLAY" : "STATE_UPDATE_APPLIED",
    resourceRef,
    replay,
    stages: {
      ...receipt.stages,
      stateUpdate: stage(
        "PASS",
        replay
          ? "Existing governed Gig CREATE returned; mutation was not rerun."
          : "Bounded Gig CREATE persisted after proof gates passed.",
      ),
      distribution: stage(
        "NOT_REACHED",
        "No downstream SWFUS transport sink executed; persistence is not represented as synchronization.",
      ),
    },
  };
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableJson(item)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function governedGigPayloadHash(body: unknown, userId: string): string {
  const record = asRecord(body) ?? {};
  const { kpgs: _governanceEnvelope, ...gigPayload } = record;
  return createHash("sha256")
    .update(stableJson({ userId, gigPayload }))
    .digest("hex");
}
