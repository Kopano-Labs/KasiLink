"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function LoadSheddingWidget() {
  const [stage, setStage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStage = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/orch/loadshedding?area_id=default");
        const fallback = await fetch("/api/load-shedding");
        const response = res.ok ? res : fallback;
        const data = await response.json();
        if (response.ok) {
          setStage(typeof data.stage === "number" ? data.stage : 0);
        } else {
          setStage(0);
        }
      } catch {
        setStage(0);
      } finally {
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
          ) : (
            <span
              className={`badge ${stage && stage > 0 ? "badge-danger" : "badge-success"} text-base py-1.5 px-3`}
            >
              {stage && stage > 0 ? `Stage ${stage}` : "No active cuts"}
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
      </div>
    </div>
  );
}
