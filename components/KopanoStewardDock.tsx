"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { CfCommsEntry, VerdictToken, StewardLaneSnapshot } from "@/lib/kopano-steward";

interface KopanoStewardDockProps {
  onAskKC?: (prefill?: string) => void;
}

const KC_QUICK = [
  "Gigs near Khayelitsha today",
  "Load-shedding stage here?",
  "Post urgent work — steps?",
  "Open Lite investor scan",
];

const VERDICT_CLASS: Record<VerdictToken, string> = {
  SAVE: "verdict-save",
  WATCH: "verdict-watch",
  SHIP: "verdict-ship",
  HOLD: "verdict-hold",
  ACTIVE: "verdict-ship",
};

function CommsRow({ entry }: { entry: CfCommsEntry }) {
  return (
    <article className="cf-comms-row">
      <div className="cf-comms-row-head">
        <span className="cf-comms-ts">{entry.ts}</span>
        <span className={`cf-verdict ${VERDICT_CLASS[entry.verdict]}`}>
          {entry.verdict}
        </span>
      </div>
      <p className="cf-comms-tranche">{entry.tranche}</p>
      <p className="cf-comms-dispatch">{entry.dispatch}</p>
      <p className="cf-comms-bracket">{entry.bracket}</p>
      <p className="cf-comms-body">{entry.body}</p>
    </article>
  );
}

export default function KopanoStewardDock({ onAskKC }: KopanoStewardDockProps) {
  const [snapshot, setSnapshot] = useState<StewardLaneSnapshot | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSnapshot() {
      try {
        const res = await fetch("/api/kc/phu/steward-lane/status");
        if (res.ok) {
          const data = await res.json();
          setSnapshot(data);
        }
      } catch (error) {
        console.error("Failed to fetch steward lane status", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSnapshot();
  }, []);

  const fireKC = (message: string) => {
    window.dispatchEvent(new CustomEvent("kc:open", { detail: { message } }));
    onAskKC?.(message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    fireKC(input.trim());
    setInput("");
  };

  if (loading || !snapshot) {
    return (
      <div className="kopano-steward-dock flex items-center justify-center p-8">
        <div className="text-sm text-on-surface-variant animate-pulse">
          Connecting to Steward Lane...
        </div>
      </div>
    );
  }

  return (
    <div className="kopano-steward-dock">
      <header className="kopano-steward-head">
        <div className="kopano-steward-title">
          <span className="cf-seat">CF</span>
          <div>
            <p className="kopano-steward-label">Kopano command surface</p>
            <p className="kopano-steward-pin">{snapshot.dispatch_pin}</p>
          </div>
        </div>
        <div className="kopano-steward-meta">
          <span className="cf-vector">{snapshot.kpefs_vector}</span>
          <Link href={snapshot.lite_path} className="cf-lite-link">
            Lite scan →
          </Link>
        </div>
      </header>

      <div className="steward-triad">
        {snapshot.actors.map((actor) => (
          <div key={actor.id} className={`steward-actor steward-actor--${actor.id}`}>
            <span className="steward-actor-id">{actor.display}</span>
            <span className="steward-actor-role">{actor.role}</span>
            <span className="steward-actor-mode">{actor.mode}</span>
          </div>
        ))}
      </div>

      <div className="cf-comms-feed">
        {snapshot.latest_comms.map((entry) => (
          <CommsRow key={entry.id} entry={entry} />
        ))}
      </div>

      <div className="kc-ask-lane">
        <div className="kc-ask-label">
          <span className="kc-ask-badge">KC</span>
          <span>Ask KC — ledger intelligence (Save | Watch)</span>
        </div>
        <form onSubmit={handleSubmit} className="kc-ask-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Gigs, utilities, trust signals near you…"
            className="kc-ask-input"
            aria-label="Ask KC"
          />
          <button type="submit" className="btn btn-primary btn-sm" disabled={!input.trim()}>
            Ask
          </button>
        </form>
        <div className="kc-ask-chips">
          {KC_QUICK.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="kc-ask-chip"
              onClick={() => fireKC(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

