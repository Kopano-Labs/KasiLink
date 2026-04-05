"use client";

import { useEffect, useState } from "react";
import { getOrchDashboard } from "@/lib/orch-client";

type DashboardState = {
  ai?: string;
  status?: string;
  features?: string[];
};

export default function OrchDashboard() {
  const [data, setData] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getOrchDashboard()
      .then((payload) => mounted && setData(payload))
      .catch(() => mounted && setData({ status: "Orch unavailable" }))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="kasi-card border-outline-variant/30 bg-gradient-to-br from-surface-container-low to-surface-container">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold">
            Orch intelligence layer
          </p>
          <h2 className="font-headline text-2xl font-black mt-2">
            AI transparency dashboard
          </h2>
          <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">
            KasiLink uses Orch as the reasoning engine for matching, scheduling,
            and moderation while the product stays focused on township work.
          </p>
        </div>
        <div className="badge badge-primary">
          {loading ? "Loading..." : data?.status ?? "Ready"}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          "Gig matching",
          "Sentiment scoring",
          "Forecasting",
          "Load-shedding checks",
        ].map((item) => (
          <div key={item} className="rounded-xl border border-outline-variant/30 bg-background/50 px-4 py-3 text-sm">
            {item}
          </div>
        ))}
      </div>

      {data?.features?.length ? (
        <p className="mt-4 text-sm text-on-surface-variant">
          Active signals: {data.features.join(", ")}
        </p>
      ) : null}
    </section>
  );
}
