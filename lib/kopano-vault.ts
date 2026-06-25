/**
 * lib/kopano-vault.ts
 * ───────────────────────────────────────────────────────────
 * Kopano Vault — Offline-First IndexedDB Storage Layer
 *
 * Governance: Commandment 9 (Offline-First Mandate)
 *             Identic AI Flows Doctrine (sovereign data)
 *             80% Proximization (edge storage first)
 *
 * Stores:
 *   infrastructure_cache  — load-shedding schedules, water outages
 *   feedback_deltas       — Identic RLHF feedback (personal vault)
 *   gig_snapshots         — offline gig cache for zero-connectivity
 *   user_preferences      — theme, zone, language, notification prefs
 *   sync_queue            — outbound ops awaiting connectivity
 *
 * The vault writes locally first, syncs when connected.
 * Data survives load-shedding, network drops, and app restarts.
 * ───────────────────────────────────────────────────────────
 */

const DB_NAME = "kopano_vault";
const DB_VERSION = 1;

export interface LoadSheddingSlot {
  start: string;    // "14:00"
  end: string;      // "16:30"
  stage: number;    // 1-8
  date: string;     // "2026-05-19"
}

export interface InfrastructureEntry {
  id: string;              // e.g. "loadshedding:zone-11" or "water:khayelitsha"
  type: "loadshedding" | "water";
  zone: string;            // e.g. "11" or "khayelitsha"
  schedule: LoadSheddingSlot[];
  stage: number;           // current national stage
  updatedAt: string;       // ISO timestamp from source
  cachedAt: number;        // Date.now() when cached
  expiresAt: number;       // Date.now() + TTL
  source: string;          // e.g. "eskomsepush" or "coct-api"
}

export interface FeedbackDelta {
  id: string;              // crypto.randomUUID()
  gigId: string;
  userId: string;
  feedback: string;        // raw user feedback text
  language: string;        // e.g. "zu", "xh", "en", "af"
  declineReason?: "infrastructure" | "personal" | "mismatch";
  moralAffirmation?: boolean;
  createdAt: number;
  synced: boolean;
}

export interface SyncQueueItem {
  id: string;
  operation: "POST" | "PUT" | "DELETE";
  endpoint: string;
  payload: string;         // JSON stringified
  createdAt: number;
  retryCount: number;
  maxRetries: number;
}

/**
 * Open (or create) the Kopano Vault database.
 * Safe to call multiple times — returns cached promise.
 */
let dbPromise: Promise<IDBDatabase> | null = null;

export function openVault(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB not available — server-side or unsupported browser"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Infrastructure cache — load-shedding + water schedules
      if (!db.objectStoreNames.contains("infrastructure_cache")) {
        const store = db.createObjectStore("infrastructure_cache", { keyPath: "id" });
        store.createIndex("by_type", "type", { unique: false });
        store.createIndex("by_zone", "zone", { unique: false });
        store.createIndex("by_expires", "expiresAt", { unique: false });
      }

      // Feedback deltas — Identic RLHF personal vault
      if (!db.objectStoreNames.contains("feedback_deltas")) {
        const store = db.createObjectStore("feedback_deltas", { keyPath: "id" });
        store.createIndex("by_gig", "gigId", { unique: false });
        store.createIndex("by_synced", "synced", { unique: false });
      }

      // Gig snapshots — offline gig cache
      if (!db.objectStoreNames.contains("gig_snapshots")) {
        db.createObjectStore("gig_snapshots", { keyPath: "_id" });
      }

      // User preferences
      if (!db.objectStoreNames.contains("user_preferences")) {
        db.createObjectStore("user_preferences", { keyPath: "key" });
      }

      // Sync queue — outbound ops pending connectivity
      if (!db.objectStoreNames.contains("sync_queue")) {
        const store = db.createObjectStore("sync_queue", { keyPath: "id" });
        store.createIndex("by_created", "createdAt", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      dbPromise = null;
      reject(request.error);
    };
  });

  return dbPromise;
}

/* ─── Generic helpers ─── */

async function tx(
  storeName: string,
  mode: IDBTransactionMode,
): Promise<IDBObjectStore> {
  const db = await openVault();
  return db.transaction(storeName, mode).objectStore(storeName);
}

async function put<T>(storeName: string, value: T): Promise<void> {
  const store = await tx(storeName, "readwrite");
  return new Promise((resolve, reject) => {
    const req = store.put(value);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function get<T>(storeName: string, key: string): Promise<T | undefined> {
  const store = await tx(storeName, "readonly");
  return new Promise((resolve, reject) => {
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error);
  });
}

async function getAll<T>(storeName: string): Promise<T[]> {
  const store = await tx(storeName, "readonly");
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });
}

async function remove(storeName: string, key: string): Promise<void> {
  const store = await tx(storeName, "readwrite");
  return new Promise((resolve, reject) => {
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/* ─── Infrastructure Cache API ─── */

const INFRA_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function cacheInfrastructure(
  entry: Omit<InfrastructureEntry, "cachedAt" | "expiresAt">,
): Promise<void> {
  const now = Date.now();
  await put<InfrastructureEntry>("infrastructure_cache", {
    ...entry,
    cachedAt: now,
    expiresAt: now + INFRA_TTL_MS,
  });
}

export async function getInfrastructure(
  id: string,
): Promise<InfrastructureEntry | null> {
  const entry = await get<InfrastructureEntry>("infrastructure_cache", id);
  if (!entry) return null;
  // Return even if expired — offline-first principle: stale > nothing
  return entry;
}

export async function getLoadSheddingForZone(
  zone: string,
): Promise<InfrastructureEntry | null> {
  return getInfrastructure(`loadshedding:zone-${zone}`);
}

export function isInfraExpired(entry: InfrastructureEntry): boolean {
  return Date.now() > entry.expiresAt;
}

/* ─── Feedback Delta API (Identic RLHF) ─── */

export async function saveFeedback(
  delta: Omit<FeedbackDelta, "id" | "createdAt" | "synced">,
): Promise<string> {
  const id = crypto.randomUUID();
  await put<FeedbackDelta>("feedback_deltas", {
    ...delta,
    id,
    createdAt: Date.now(),
    synced: false,
  });
  return id;
}

export async function getUnsyncedFeedback(): Promise<FeedbackDelta[]> {
  const all = await getAll<FeedbackDelta>("feedback_deltas");
  return all.filter((d) => !d.synced);
}

export async function markFeedbackSynced(id: string): Promise<void> {
  const delta = await get<FeedbackDelta>("feedback_deltas", id);
  if (delta) {
    await put<FeedbackDelta>("feedback_deltas", { ...delta, synced: true });
  }
}

/* ─── Sync Queue API ─── */

export async function enqueueSync(
  operation: SyncQueueItem["operation"],
  endpoint: string,
  payload: unknown,
): Promise<string> {
  const id = crypto.randomUUID();
  await put<SyncQueueItem>("sync_queue", {
    id,
    operation,
    endpoint,
    payload: JSON.stringify(payload),
    createdAt: Date.now(),
    retryCount: 0,
    maxRetries: 5,
  });
  return id;
}

export async function drainSyncQueue(): Promise<SyncQueueItem[]> {
  const all = await getAll<SyncQueueItem>("sync_queue");
  return all.sort((a, b) => a.createdAt - b.createdAt);
}

export async function removeSyncItem(id: string): Promise<void> {
  await remove("sync_queue", id);
}

/* ─── User Preferences API ─── */

export async function setPreference(
  key: string,
  value: unknown,
): Promise<void> {
  await put("user_preferences", { key, value, updatedAt: Date.now() });
}

export async function getPreference<T>(key: string): Promise<T | undefined> {
  const entry = await get<{ key: string; value: T }>(
    "user_preferences",
    key,
  );
  return entry?.value;
}

/* ─── Gig Snapshot API (offline cache) ─── */

export async function cacheGig(gig: Record<string, unknown>): Promise<void> {
  await put("gig_snapshots", gig);
}

export async function getCachedGigs(): Promise<Record<string, unknown>[]> {
  return getAll("gig_snapshots");
}

/* ─── Vault Health Check ─── */

export async function vaultHealthCheck(): Promise<{
  ok: boolean;
  stores: string[];
  infraCount: number;
  unsyncedFeedback: number;
  pendingSyncOps: number;
}> {
  try {
    const db = await openVault();
    const stores = Array.from(db.objectStoreNames);
    const infra = await getAll("infrastructure_cache");
    const unsynced = await getUnsyncedFeedback();
    const queue = await drainSyncQueue();

    return {
      ok: true,
      stores,
      infraCount: infra.length,
      unsyncedFeedback: unsynced.length,
      pendingSyncOps: queue.length,
    };
  } catch {
    return {
      ok: false,
      stores: [],
      infraCount: 0,
      unsyncedFeedback: 0,
      pendingSyncOps: 0,
    };
  }
}
