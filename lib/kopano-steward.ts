/**
 * Kopano steward lane + CF comms seed — mirrors Schematics dispatch/comms-log shape.
 * Live fetch can replace this when kopano-core bridge URL is configured.
 */

export type VerdictToken = "SAVE" | "WATCH" | "SHIP" | "HOLD" | "ACTIVE";

export interface StewardActor {
  id: string;
  display: string;
  role: string;
  mode: string;
}

export interface CfCommsEntry {
  id: string;
  ts: string;
  tranche: string;
  operator: string;
  dispatch: string;
  verdict: VerdictToken;
  bracket: string;
  body: string;
}

export interface StewardLaneSnapshot {
  schema: string;
  active: boolean;
  cf_operator: string;
  dispatch_pin: string;
  actors: StewardActor[];
  latest_comms: CfCommsEntry[];
  kpefs_vector: string;
  lite_path: string;
}

