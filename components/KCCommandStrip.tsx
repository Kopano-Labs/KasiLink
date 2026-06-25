"use client";

import { useState } from "react";

interface KCCommandStripProps {
  onOpen?: (prefill?: string) => void;
}

const QUICK_PROMPTS = [
  "Find me domestic work in Soweto",
  "Load-shedding stage near me today?",
  "How do I post an urgent gig?",
  "Plumbing work in Khayelitsha",
];

export default function KCCommandStrip({ onOpen }: KCCommandStripProps) {
  const [input, setInput] = useState("");

  const fire = (message: string) => {
    window.dispatchEvent(new CustomEvent("kc:open", { detail: { message } }));
    onOpen?.(message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    fire(input.trim());
    setInput("");
  };

  return (
    <div className="w-full bg-[#0d1b2a] border border-[#4595C0]/30 rounded-2xl p-5 shadow-lg shadow-[#4595C0]/5">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4595C0] text-white font-black text-xs">
          KC
        </div>
        <span className="text-sm font-semibold text-white">Kopano Context</span>
        <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4595C0]">
          Ledger route · Save | Watch
        </span>
      </div>
      <p className="mb-3 text-xs leading-6 text-slate-300">
        Ask the cold review lane first. Cassy explains and the agent mesh executes in the steward dock.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask KC: gigs near me, load-shedding stage, suburb tips..."
          className="flex-1 bg-[#111827] border border-[#4595C0]/25 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4595C0] transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-[#4595C0] hover:bg-[#3a80a8] disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          Ask
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mt-3">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => fire(p)}
            className="text-xs text-[#4595C0] border border-[#4595C0]/30 rounded-full px-3 py-1 hover:bg-[#4595C0]/10 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
