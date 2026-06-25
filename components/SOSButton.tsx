"use client";

/**
 * components/SOSButton.tsx
 * ───────────────────────────────────────────────────────────
 * Emergency safety button for KasiLink workers.
 *
 * KC Apprenticeship Phase 15, Task 149
 *
 * Safety-first: Workers going to unfamiliar locations
 * need a quick way to:
 *   1. Share their location with a trusted contact
 *   2. Call emergency services (10111 SAPS)
 *   3. Log the incident for platform safety
 *
 * This component floats in the bottom corner during
 * active gig engagement.
 * ───────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { AlertTriangle, Phone, MapPin, X, Shield } from "lucide-react";

interface SOSButtonProps {
  /** Worker's current gig ID, if on a gig */
  gigId?: string;
  /** Worker's name for emergency message */
  workerName?: string;
}

export default function SOSButton({ gigId, workerName }: SOSButtonProps) {
  const [expanded, setExpanded] = useState(false);
  const [locationSent, setLocationSent] = useState(false);

  async function shareLocation() {
    if (!navigator.geolocation) {
      alert("Location not available on this device.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://maps.google.com/maps?q=${latitude},${longitude}`;
        const message = [
          `🆘 EMERGENCY — ${workerName || "KasiLink Worker"}`,
          `📍 Location: ${mapsUrl}`,
          gigId ? `💼 Gig ID: ${gigId}` : "",
          `⏰ Time: ${new Date().toLocaleString("en-ZA")}`,
          "",
          "This is an automated safety alert from KasiLink.",
        ]
          .filter(Boolean)
          .join("\n");

        // Try native share (WhatsApp, SMS)
        if (navigator.share) {
          try {
            await navigator.share({
              title: "🆘 Emergency Location",
              text: message,
            });
            setLocationSent(true);
            return;
          } catch {
            // Fall through to clipboard
          }
        }

        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(message);
          setLocationSent(true);
          alert("Location copied to clipboard. Send it to your emergency contact.");
        } catch {
          // Last resort: open SMS
          window.open(`sms:?body=${encodeURIComponent(message)}`);
        }
      },
      () => {
        alert("Could not get your location. Please share it manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="fixed bottom-24 right-4 z-[300] flex h-12 w-12 items-center justify-center rounded-full bg-error shadow-lg shadow-error/30 text-white transition-transform hover:scale-110 active:scale-95 md:bottom-8"
        aria-label="Emergency SOS"
      >
        <Shield size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 z-[300] w-72 rounded-2xl border border-error/30 bg-surface-container p-4 shadow-2xl md:bottom-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-error">
          <AlertTriangle size={18} />
          <span className="text-sm font-bold">Emergency</span>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="btn btn-ghost btn-sm p-1"
          aria-label="Close SOS panel"
        >
          <X size={14} />
        </button>
      </div>

      <div className="space-y-2">
        {/* Call SAPS */}
        <a
          href="tel:10111"
          className="flex w-full items-center gap-3 rounded-xl bg-error/10 px-4 py-3 text-sm font-semibold text-error transition-colors hover:bg-error/20"
        >
          <Phone size={16} />
          Call SAPS — 10111
        </a>

        {/* Share Location */}
        <button
          type="button"
          onClick={shareLocation}
          disabled={locationSent}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
            locationSent
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning hover:bg-warning/20"
          }`}
        >
          <MapPin size={16} />
          {locationSent ? "Location shared ✓" : "Share my location"}
        </button>

        {/* Ambulance */}
        <a
          href="tel:10177"
          className="flex w-full items-center gap-3 rounded-xl bg-surface-container-high px-4 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-highest"
        >
          <Phone size={16} />
          Ambulance — 10177
        </a>
      </div>

      <p className="mt-3 text-[10px] text-outline text-center">
        Your safety comes first. KasiLink stands with you.
      </p>
    </div>
  );
}
