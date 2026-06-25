"use client";

/**
 * components/VaultHealthIndicator.tsx
 * ───────────────────────────────────────────────────────────
 * Kopano Vault health status indicator.
 *
 * KC Apprenticeship Phase 3, Task 30
 *
 * Shows the state of the local IndexedDB vault:
 *   - Number of cached infrastructure entries
 *   - Unsynced feedback deltas
 *   - Pending sync operations
 *   - Online/offline status
 *
 * Used in profile/settings to give users transparency
 * over their sovereign data store.
 * ───────────────────────────────────────────────────────────
 */

import { useState, useEffect } from "react";
import { Database, Cloud, CloudOff, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { vaultHealthCheck } from "@/lib/kopano-vault";

interface VaultHealth {
  ok: boolean;
  stores: string[];
  infraCount: number;
  unsyncedFeedback: number;
  pendingSyncOps: number;
}

export default function VaultHealthIndicator() {
  const [health, setHealth] = useState<VaultHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const result = await vaultHealthCheck();
      setHealth(result);
    } catch {
      setHealth({ ok: false, stores: [], infraCount: 0, unsyncedFeedback: 0, pendingSyncOps: 0 });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    refresh();

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return (
    <div className="kasi-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-primary" />
          <h3 className="text-sm font-bold text-on-surface">Kopano Vault</h3>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="btn btn-ghost btn-sm p-1"
          aria-label="Refresh vault status"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-3 w-3/4 bg-surface-container-high rounded animate-pulse" />
          <div className="h-3 w-1/2 bg-surface-container-high rounded animate-pulse" />
        </div>
      ) : health ? (
        <div className="space-y-3">
          {/* Vault status */}
          <div className="flex items-center gap-2">
            {health.ok ? (
              <CheckCircle size={14} className="text-success" />
            ) : (
              <AlertCircle size={14} className="text-error" />
            )}
            <span className="text-xs text-on-surface-variant">
              {health.ok ? "Vault operational" : "Vault unavailable"}
            </span>
          </div>

          {/* Connectivity */}
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Cloud size={14} className="text-success" />
            ) : (
              <CloudOff size={14} className="text-warning" />
            )}
            <span className="text-xs text-on-surface-variant">
              {isOnline ? "Connected" : "Offline — using cached data"}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-outline-variant/30">
            <div className="text-center">
              <p className="text-lg font-bold text-on-surface">{health.infraCount}</p>
              <p className="text-[10px] text-outline uppercase tracking-wider">Cached zones</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-on-surface">{health.unsyncedFeedback}</p>
              <p className="text-[10px] text-outline uppercase tracking-wider">Unsynced</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-on-surface">{health.pendingSyncOps}</p>
              <p className="text-[10px] text-outline uppercase tracking-wider">Pending</p>
            </div>
          </div>

          {/* Stores */}
          {health.stores.length > 0 && (
            <div className="pt-2 border-t border-outline-variant/30">
              <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">
                Data stores
              </p>
              <div className="flex flex-wrap gap-1">
                {health.stores.map((store) => (
                  <span
                    key={store}
                    className="rounded-md bg-surface-container-high px-2 py-0.5 text-[10px] text-on-surface-variant"
                  >
                    {store}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Kopano Context tag */}
          <p className="text-[9px] font-bold uppercase tracking-widest text-primary/40 pt-1">
            Sovereign data · Offline-first · Your device
          </p>
        </div>
      ) : null}
    </div>
  );
}
