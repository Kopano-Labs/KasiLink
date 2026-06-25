"use client";

/**
 * hooks/useKopanoVault.ts
 * ───────────────────────────────────────────────────────────
 * React hook for Kopano Vault initialization and status.
 *
 * On mount:
 *   1. Opens the IndexedDB vault
 *   2. Loads the user's preferred zone from preferences
 *   3. Refreshes the load-shedding schedule if online + stale
 *   4. Exposes vault status for UI indicators
 *
 * Governance: Commandment 9 (Offline-First)
 *             Writes locally first, syncs when connected.
 * ───────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  openVault,
  getPreference,
  setPreference,
  getLoadSheddingForZone,
  isInfraExpired,
  type InfrastructureEntry,
} from "@/lib/kopano-vault";
import { refreshZoneSchedule } from "@/lib/loadshedding-schedule";

interface VaultState {
  ready: boolean;
  zone: string;
  schedule: InfrastructureEntry | null;
  isStale: boolean;
  isOnline: boolean;
  lastRefresh: number | null;
  error: string | null;
}

export function useKopanoVault(defaultZone = "8") {
  const [state, setState] = useState<VaultState>({
    ready: false,
    zone: defaultZone,
    schedule: null,
    isStale: false,
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    lastRefresh: null,
    error: null,
  });

  const initRef = useRef(false);

  // Track online/offline
  useEffect(() => {
    const onOnline = () => setState((s) => ({ ...s, isOnline: true }));
    const onOffline = () => setState((s) => ({ ...s, isOnline: false }));

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // Initialize vault
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    async function init() {
      try {
        await openVault();

        // Load user's zone preference
        const savedZone = await getPreference<string>("loadshedding_zone");
        const zone = savedZone || defaultZone;

        // Load cached schedule
        const cached = await getLoadSheddingForZone(zone);
        const stale = cached ? isInfraExpired(cached) : true;

        setState((s) => ({
          ...s,
          ready: true,
          zone,
          schedule: cached,
          isStale: stale,
          lastRefresh: cached?.cachedAt ?? null,
        }));

        // If online and stale, refresh in background
        if (navigator.onLine && stale) {
          const fresh = await refreshZoneSchedule(zone);
          if (fresh) {
            const updated = await getLoadSheddingForZone(zone);
            setState((s) => ({
              ...s,
              schedule: updated,
              isStale: false,
              lastRefresh: Date.now(),
            }));
          }
        }
      } catch (err) {
        setState((s) => ({
          ...s,
          ready: true, // still "ready" — vault failure shouldn't block UI
          error: err instanceof Error ? err.message : "Vault init failed",
        }));
      }
    }

    init();
  }, [defaultZone]);

  // Manual refresh
  const refreshSchedule = useCallback(async () => {
    if (!navigator.onLine) return;

    const fresh = await refreshZoneSchedule(state.zone);
    if (fresh) {
      const updated = await getLoadSheddingForZone(state.zone);
      setState((s) => ({
        ...s,
        schedule: updated,
        isStale: false,
        lastRefresh: Date.now(),
      }));
    }
  }, [state.zone]);

  // Change zone
  const setZone = useCallback(async (newZone: string) => {
    await setPreference("loadshedding_zone", newZone);
    const cached = await getLoadSheddingForZone(newZone);
    const stale = cached ? isInfraExpired(cached) : true;

    setState((s) => ({
      ...s,
      zone: newZone,
      schedule: cached,
      isStale: stale,
    }));

    // Refresh if online
    if (navigator.onLine && stale) {
      const fresh = await refreshZoneSchedule(newZone);
      if (fresh) {
        const updated = await getLoadSheddingForZone(newZone);
        setState((s) => ({
          ...s,
          schedule: updated,
          isStale: false,
          lastRefresh: Date.now(),
        }));
      }
    }
  }, []);

  return {
    ...state,
    refreshSchedule,
    setZone,
  };
}
