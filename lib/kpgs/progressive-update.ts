export const KPGS_PROGRESSIVE_UPDATE_SCHEMA = "kpgs.progressive-update.v1" as const;
export const KPGS_SWFUS_RECEIPT_SCHEMA = "kpgs.swfus.receipt.v1" as const;
export const KPGS_BOUNDARY_MARKER = "#NB" as const;

export const KPGS_CANONICAL_SOURCE = Object.freeze({
  repository: "RobynAwesome/Introduction-to-MCP",
  sha: "70f40324978ee8c3c1a8a77a29e6ac84c7f6bf3a",
  contractPath: "governance/kpgs-vnext/progressive-updates/README.md",
  schemaPath:
    "governance/kpgs-vnext/progressive-updates/progressive-update.schema.json",
  runtimePath: "kopano-core/kopano/swfus_engine.py",
});

export const KPGS_SWFUS_STAGE_ORDER = Object.freeze([
  "TELEMETRY",
  "CLASSIFICATION",
  "ROUTING",
  "PROTOCOL_SELECTION",
  "INVARIANT_AUDIT",
  "POC_FOC_CHECK",
  "STATE_UPDATE",
  "DISTRIBUTION",
] as const);

export type KpgsStageName = (typeof KPGS_SWFUS_STAGE_ORDER)[number];
export type KpgsStageStatus = "PASS" | "HOLD" | "REJECT" | "NOT_REACHED";
export type KpgsDisposition = "APPLIED" | "HELD" | "REJECTED";
export type KpgsStateClass =
  | "non_authoritative"
  | "derived_projection"
  | "pending_proposal";

export type KpgsProgressiveUpdate = {
  schema: typeof KPGS_PROGRESSIVE_UPDATE_SCHEMA;
  update_id: string;
  node_id: string;
  operation: "CREATE";
  lane: string;
  context_route: string;
  protocol: string;
  idempotency_key: string;
  apu_status: "GREEN" | "YELLOW" | "RED" | "UNSPECIFIED";
  poc_validated: boolean;
  foc_detected: boolean;
  invariant_passed: boolean;
  authority_effect: "none";
  state_class: KpgsStateClass;
  evidence_refs: string[];
  correlation_id?: string;
  source?: string;
  boundary_marker: typeof KPGS_BOUNDARY_MARKER;
  canonical_source_sha: string;
};

export type KpgsStageReceipt = {
  stage: KpgsStageName;
  status: KpgsStageStatus;
  reason: string;
};

export type KpgsSwfusReceipt = {
  schema: typeof KPGS_SWFUS_RECEIPT_SCHEMA;
  receipt_id: string;
  update_id: string;
  node_id: string;
  operation: "CREATE";
  disposition: KpgsDisposition;
  stages: KpgsStageReceipt[];
  synchronized: false;
  canonical_authority_changed: false;
  state_digest: null;
  evidence_refs: string[];
  correlation_id: string;
  boundary_marker: typeof KPGS_BOUNDARY_MARKER;
  replayed: false;
  created_at: string;
  canonical_source_sha: string;
};

type ValidatedUpdate = KpgsProgressiveUpdate & {
  correlation_id: string;
  source: string;
};

type GateOutcome = {
  update: ValidatedUpdate | null;
  receipt: KpgsSwfusReceipt;
};

export class KpgsProgressiveGateError extends Error {
  readonly status: number;
  readonly receipt: KpgsSwfusReceipt;

  constructor(status: number, message: string, receipt: KpgsSwfusReceipt) {
    super(message);
    this.name = "KpgsProgressiveGateError";
    this.status = status;
    this.receipt = receipt;
  }
}

export class KpgsProgressiveMutationError extends Error {
  readonly cause: unknown;
  readonly receipt: KpgsSwfusReceipt;

  constructor(cause: unknown, receipt: KpgsSwfusReceipt) {
    super("Governed gig CREATE failed during bounded state update.");
    this.name = "KpgsProgressiveMutationError";
    this.cause = cause;
    this.receipt = receipt;
  }
}

function stage(
  stageName: KpgsStageName,
  status: KpgsStageStatus,
  reason: string,
): KpgsStageReceipt {
  return { stage: stageName, status, reason };
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string.`);
  }
  return value.trim();
}

function evidenceRefs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item, index) => requiredString(item, `evidence_refs[${index}]`)))];
}

function completeStages(stages: KpgsStageReceipt[]): KpgsStageReceipt[] {
  const seen = new Set(stages.map((item) => item.stage));
  for (const stageName of KPGS_SWFUS_STAGE_ORDER) {
    if (!seen.has(stageName)) {
      stages.push(
        stage(
          stageName,
          "NOT_REACHED",
          "prior governance gate stopped progression",
        ),
      );
    }
  }
  return stages;
}

function receipt(
  raw: Record<string, unknown>,
  disposition: KpgsDisposition,
  stages: KpgsStageReceipt[],
): KpgsSwfusReceipt {
  const updateId = typeof raw.update_id === "string" ? raw.update_id : "unknown";
  const nodeId = typeof raw.node_id === "string" ? raw.node_id : "unknown";
  const correlationId =
    typeof raw.correlation_id === "string" && raw.correlation_id.trim()
      ? raw.correlation_id.trim()
      : updateId;
  const refs = evidenceRefs(raw.evidence_refs);

  return {
    schema: KPGS_SWFUS_RECEIPT_SCHEMA,
    receipt_id: `kasigig:${updateId}:${disposition.toLowerCase()}`,
    update_id: updateId,
    node_id: nodeId,
    operation: "CREATE",
    disposition,
    stages: completeStages(stages),
    synchronized: false,
    canonical_authority_changed: false,
    state_digest: null,
    evidence_refs: refs,
    correlation_id: correlationId,
    boundary_marker: KPGS_BOUNDARY_MARKER,
    replayed: false,
    created_at: new Date().toISOString(),
    canonical_source_sha: KPGS_CANONICAL_SOURCE.sha,
  };
}

function reject(
  raw: Record<string, unknown>,
  stages: KpgsStageReceipt[],
  reason: string,
): never {
  stages.push(stage("POC_FOC_CHECK", "REJECT", reason));
  throw new KpgsProgressiveGateError(
    422,
    reason,
    receipt(raw, "REJECTED", stages),
  );
}

function hold(
  raw: Record<string, unknown>,
  stages: KpgsStageReceipt[],
  reason: string,
): never {
  stages.push(stage("POC_FOC_CHECK", "HOLD", reason));
  throw new KpgsProgressiveGateError(409, reason, receipt(raw, "HELD", stages));
}

export function validateGigCreateProgressiveUpdate(
  value: unknown,
): GateOutcome {
  const raw =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  if (!raw) {
    const fallback: Record<string, unknown> = {};
    const stages = [
      stage("TELEMETRY", "REJECT", "progressive update envelope is missing"),
    ];
    throw new KpgsProgressiveGateError(
      422,
      "Governed gig CREATE requires a progressive update envelope.",
      receipt(fallback, "REJECTED", stages),
    );
  }

  const stages: KpgsStageReceipt[] = [];

  try {
    requiredString(raw.update_id, "update_id");
    requiredString(raw.node_id, "node_id");
    requiredString(raw.idempotency_key, "idempotency_key");
    stages.push(stage("TELEMETRY", "PASS", "update identity accepted"));
  } catch (error) {
    stages.push(
      stage(
        "TELEMETRY",
        "REJECT",
        error instanceof Error ? error.message : "invalid update identity",
      ),
    );
    throw new KpgsProgressiveGateError(
      422,
      "Invalid progressive update identity.",
      receipt(raw, "REJECTED", stages),
    );
  }

  const schema = raw.schema;
  const operation =
    typeof raw.operation === "string" ? raw.operation.toUpperCase() : "";
  const apuStatus =
    typeof raw.apu_status === "string" ? raw.apu_status.toUpperCase() : "UNSPECIFIED";
  const stateClass = raw.state_class;
  stages.push(
    stage(
      "CLASSIFICATION",
      "PASS",
      `operation=${operation || "unknown"}; apu=${apuStatus}`,
    ),
  );

  const lane = requiredString(raw.lane, "lane");
  const contextRoute = requiredString(raw.context_route, "context_route");
  stages.push(stage("ROUTING", "PASS", `lane=${lane}; route=${contextRoute}`));

  const protocol = requiredString(raw.protocol, "protocol");
  stages.push(stage("PROTOCOL_SELECTION", "PASS", `protocol=${protocol}`));

  const invariantFailures: string[] = [];
  if (schema !== KPGS_PROGRESSIVE_UPDATE_SCHEMA) {
    invariantFailures.push(`schema must equal ${KPGS_PROGRESSIVE_UPDATE_SCHEMA}`);
  }
  if (raw.canonical_source_sha !== KPGS_CANONICAL_SOURCE.sha) {
    invariantFailures.push("canonical_source_sha does not match pinned KPGS authority");
  }
  if (operation !== "CREATE") invariantFailures.push("operation must equal CREATE");
  if (raw.boundary_marker !== KPGS_BOUNDARY_MARKER) {
    invariantFailures.push("#NB boundary marker is required");
  }
  if (raw.authority_effect !== "none") {
    invariantFailures.push("authority_effect must remain none");
  }
  if (
    stateClass !== "non_authoritative" &&
    stateClass !== "derived_projection" &&
    stateClass !== "pending_proposal"
  ) {
    invariantFailures.push("state_class is not admitted for progressive mutation");
  }
  if (raw.invariant_passed !== true) {
    invariantFailures.push("invariant audit must pass before mutation");
  }

  if (invariantFailures.length > 0) {
    stages.push(
      stage("INVARIANT_AUDIT", "REJECT", invariantFailures.join("; ")),
    );
    throw new KpgsProgressiveGateError(
      422,
      "Progressive update invariant audit failed.",
      receipt(raw, "REJECTED", stages),
    );
  }
  stages.push(
    stage("INVARIANT_AUDIT", "PASS", "bounded mutation invariants preserved"),
  );

  if (apuStatus === "RED" || raw.foc_detected === true) {
    return reject(raw, stages, "FOC/RED progressive update cannot reach gig persistence");
  }
  if (apuStatus === "YELLOW") {
    return hold(raw, stages, "APU YELLOW requires review before gig persistence");
  }
  if (apuStatus !== "GREEN") {
    return hold(raw, stages, "Gig CREATE requires APU GREEN before mutation");
  }

  const refs = evidenceRefs(raw.evidence_refs);
  if (raw.poc_validated !== true || refs.length === 0) {
    return hold(raw, stages, "Gig CREATE requires POC validation evidence");
  }
  stages.push(
    stage("POC_FOC_CHECK", "PASS", "POC evidence admitted; FOC absent"),
  );

  const update: ValidatedUpdate = {
    schema: KPGS_PROGRESSIVE_UPDATE_SCHEMA,
    update_id: requiredString(raw.update_id, "update_id"),
    node_id: requiredString(raw.node_id, "node_id"),
    operation: "CREATE",
    lane,
    context_route: contextRoute,
    protocol,
    idempotency_key: requiredString(raw.idempotency_key, "idempotency_key"),
    apu_status: "GREEN",
    poc_validated: true,
    foc_detected: false,
    invariant_passed: true,
    authority_effect: "none",
    state_class: stateClass as KpgsStateClass,
    evidence_refs: refs,
    correlation_id:
      typeof raw.correlation_id === "string" && raw.correlation_id.trim()
        ? raw.correlation_id.trim()
        : requiredString(raw.update_id, "update_id"),
    source:
      typeof raw.source === "string" && raw.source.trim()
        ? raw.source.trim()
        : "kasilink-gig-create",
    boundary_marker: KPGS_BOUNDARY_MARKER,
    canonical_source_sha: KPGS_CANONICAL_SOURCE.sha,
  };

  return {
    update,
    receipt: receipt(raw, "APPLIED", stages),
  };
}

export async function executeGovernedGigCreate<T>(
  envelope: unknown,
  mutate: () => Promise<T>,
): Promise<{ result: T; receipt: KpgsSwfusReceipt }> {
  const { update, receipt: admittedReceipt } =
    validateGigCreateProgressiveUpdate(envelope);
  if (!update) {
    throw new Error("Validated progressive update unexpectedly missing.");
  }

  const stages = admittedReceipt.stages.filter(
    (item) => item.stage !== "STATE_UPDATE" && item.stage !== "DISTRIBUTION",
  );

  try {
    const result = await mutate();
    stages.push(
      stage("STATE_UPDATE", "PASS", "bounded Gig.create consequence completed"),
    );
    stages.push(
      stage(
        "DISTRIBUTION",
        "NOT_REACHED",
        "no governed SWFUS distribution sink is configured for the gig pilot",
      ),
    );
    return { result, receipt: receipt(update, "APPLIED", stages) };
  } catch (error) {
    stages.push(
      stage(
        "STATE_UPDATE",
        "REJECT",
        "gig persistence did not complete; no state-update proof emitted",
      ),
    );
    stages.push(
      stage(
        "DISTRIBUTION",
        "NOT_REACHED",
        "state update failed before distribution",
      ),
    );
    throw new KpgsProgressiveMutationError(
      error,
      receipt(update, "REJECTED", stages),
    );
  }
}
