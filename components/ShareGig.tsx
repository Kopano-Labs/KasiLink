"use client";

/**
 * components/ShareGig.tsx
 * ───────────────────────────────────────────────────────────
 * Web Share API integration for KasiLink gig listings.
 *
 * KC Apprenticeship Phase 15, Task 143
 *
 * Uses native share on mobile (WhatsApp, SMS, etc.)
 * Falls back to copy-to-clipboard on desktop.
 *
 * Township reality: WhatsApp sharing is the primary
 * discovery channel. This button makes it frictionless.
 * ───────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

interface ShareGigProps {
  gigId: string;
  gigTitle: string;
  gigPay?: string;
  suburb?: string;
  className?: string;
}

export default function ShareGig({
  gigId,
  gigTitle,
  gigPay,
  suburb,
  className = "",
}: ShareGigProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://kasilink.com/gigs/${gigId}`;
  const shareText = [
    `💼 ${gigTitle}`,
    gigPay ? `💰 ${gigPay}` : null,
    suburb ? `📍 ${suburb}` : null,
    "",
    "Find it on KasiLink:",
    shareUrl,
  ]
    .filter(Boolean)
    .join("\n");

  async function handleShare() {
    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: gigTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled or share failed — fall through to clipboard
        if ((err as Error).name === "AbortError") return;
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort: select text in a textarea
      const textarea = document.createElement("textarea");
      textarea.value = shareText;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
        copied
          ? "bg-success/20 text-success"
          : "bg-surface-container-high text-on-surface-variant hover:bg-primary-container hover:text-primary"
      } ${className}`}
      aria-label={`Share "${gigTitle}"`}
    >
      {copied ? (
        <>
          <Check size={13} />
          Copied!
        </>
      ) : (
        <>
          <Share2 size={13} />
          Share
        </>
      )}
    </button>
  );
}
