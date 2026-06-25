"use client";

/**
 * components/OfflineBanner.tsx
 * ───────────────────────────────────────────────────────────
 * Offline status indicator for KasiLink PWA.
 *
 * KC Apprenticeship Phase 3, Task 26
 *
 * Shows a persistent banner when the user loses connectivity.
 * Automatically hides when back online.
 * Township-first: users on 3G/EDGE expect this.
 * ───────────────────────────────────────────────────────────
 */

import { useState, useEffect } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsOffline(!navigator.onLine);

    const goOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
    };

    const goOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      // Show "back online" briefly
      setTimeout(() => setJustReconnected(false), 3000);
    };

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!isOffline && !justReconnected) return null;

  return (
    <div
      className={`fixed top-[4.1rem] left-0 right-0 z-[199] px-4 py-2 text-center text-sm font-medium transition-all duration-300 ${
        isOffline
          ? "bg-warning/90 text-on-warning"
          : "bg-success/90 text-on-success"
      }`}
      role="status"
      aria-live="polite"
    >
      {isOffline ? (
        <span className="inline-flex items-center gap-2">
          <WifiOff size={14} />
          <span>You&apos;re offline — cached data is still available</span>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold hover:bg-white/30 transition-colors"
          >
            <RefreshCw size={10} />
            Retry
          </button>
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          ✓ Back online — syncing your data
        </span>
      )}
    </div>
  );
}
