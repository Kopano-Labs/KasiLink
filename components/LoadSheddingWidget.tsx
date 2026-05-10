"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function LoadSheddingWidget() {
  const [stage, setStage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const FETCH_MS = 8000;

    const fetchStage = async () => {
      setLoading(true);
      const ac = new AbortController();
      const timeoutId = setTimeout(() => ac.abort(), FETCH_MS);
      try {
        const tryJson = async (url: string) => {
          const r = await fetch(url, { signal: ac.signal });
          const data = await r.json().catch(() => ({}));
          return { ok: r.ok, data };
        };

        let { ok, data } = await tryJson("/api/orch/loadshedding?area_id=default");
        if (!ok) {
          ({ ok, data } = await tryJson("/api/load-shedding"));
        }
        if (ok && typeof data.stage === "number") {
          setStage(data.stage);
        } else if (ok) {
          setStage(0);
        } else {
          setStage(null);
        }
      } catch {
        setStage(null);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };
    fetchStage();
  }, []);

  return (
    <div className="kasi-card bg-surface-container-low border-outline-variant/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-3xl" title="Load-Shedding Aware">
          Power
        </span>
        <div>
          <h3 className="font-bold text-on-background leading-tight">
            Eskom Status
          </h3>
          <p className="text-sm text-on-surface-variant">
            Regional utility watch for job seekers and providers
          </p>
        </div>
      </div>

      <div className="flex flex-col md:items-end gap-2">
        <div className="text-right">
          {loading ? (
            <span className="text-sm text-outline animate-pulse font-medium">
              Checking...
            </span>
          ) : stage === null ? (
            <span className="badge badge-secondary text-base py-1.5 px-3">
              Status unavailable
            </span>
          ) : (
            <span
              className={`badge ${stage > 0 ? "badge-danger" : "badge-success"} text-base py-1.5 px-3`}
            >
              {stage > 0 ? `Stage ${stage}` : "No active cuts"}
            </span>
          )}
        </div>
        <div className="flex gap-2 flex-wrap md:justify-end">
          <Link href="/water-outages" className="btn btn-outline btn-sm">
            Water Alerts
          </Link>
          <Link href="/forum" className="btn btn-secondary btn-sm">
            Community Updates
          </Link>
        </div>
        <p className="text-[10px] text-[#4595C0] font-semibold tracking-wide mt-1">
          Powered by Kopano Context
        </p>
      </div>
    </div>
  );
}
