"use client";

import { useState, useEffect } from "react";

export default function LoadSheddingWidget() {
  const [stage, setStage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetching real Eskom/EskomSePush API data
    const fetchStage = async () => {
      setLoading(true);
      setTimeout(() => {
        setStage(2); // Using Stage 2 as a placeholder
        setLoading(false);
      }, 1500);
    };
    fetchStage();
  }, []);

  return (
    <div className="kasi-card bg-surface-container-low border-outline-variant/30 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-3xl" title="Load-Shedding Aware">
          ⚡
        </span>
        <div>
          <h3 className="font-bold text-on-background leading-tight">
            Eskom Status
          </h3>
          <p className="text-sm text-on-surface-variant">Cape Town Region</p>
        </div>
      </div>
      <div className="text-right">
        {loading ? (
          <span className="text-sm text-outline animate-pulse font-medium">
            Checking...
          </span>
        ) : (
          <span
            className={`badge ${stage && stage > 0 ? "badge-danger" : "badge-success"} text-base py-1.5 px-3`}
          >
            Stage {stage}
          </span>
        )}
      </div>
    </div>
  );
}
