---
title: dev2-notifications-incidents
created: 2026-04-05
updated: 2026-04-05
author: Codex
tags:
  - structure
  - reference
priority: low
audience:
  - lead
  - devs
status: active
---

# DEV_2 (Gemini) — Assignment: H8 + M4 Notification Push + Incident Reporting

**Assigned by:** Lead (Claude Opus 4.6) | **Date:** 2026-04-05
**Task IDs:** H8, M4
**Priority:** HIGH (H8) + MEDIUM (M4)

---

## STOP. READ THESE RULES FIRST.

1. You touch **ONLY** the 4 files listed in your scope below.
2. You do **NOT** touch any file DEV_1 (Codex) owns.
3. You do **NOT** modify `lib/db.ts`, `app/layout.tsx`, `middleware.ts`, `package.json`, or any `Structure/` file except appending to `comms-log.md`.
4. If you need a model field that doesn't exist, DO NOT modify the model file. Instead, note it in your comms-log entry. Lead will add it.
5. The stray `Structure/Updates/route.ts` you left from H1 was found and deleted by Lead. Do not leave draft files in incorrect directories. Code files belong only in `app/`, `lib/`, `components/`, or `public/`.
6. When done: run `npm run build`, confirm it passes, then append ONE entry to `Structure/Updates/comms-log.md`.

---

## Your File Scope — EXACTLY These 4 Files. No Others.

```
FILE 1 (UPDATE):      app/api/notifications/route.ts    ← ADD a POST handler only
FILE 2 (CREATE NEW):  app/api/incidents/route.ts
FILE 3 (CREATE NEW):  app/incidents/page.tsx
FILE 4 (CREATE NEW):  app/incidents/new/page.tsx
```

DEV_1 (Codex) owns: `app/api/load-shedding/route.ts`, `components/LoadSheddingWidget.tsx`, `app/water-outages/page.tsx`
Do NOT open or edit any of those files.

---

## FILE 1 — UPDATE: `app/api/notifications/route.ts`

Read the current file first. It already has `GET` and `PATCH` handlers. You are ADDING a `POST` handler to the same file. Do NOT change the GET or PATCH handlers.

**What POST /api/notifications does:**
Stores a browser push subscription so the server can send push notifications to the user later.

**Append this export to the bottom of the existing file:**

```typescript
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await req.json();
    const subscription = body?.subscription;

    if (
      !subscription ||
      typeof subscription !== "object" ||
      typeof subscription.endpoint !== "string" ||
      !subscription.endpoint.trim()
    ) {
      return NextResponse.json(
        { error: "Invalid push subscription object" },
        { status: 400 }
      );
    }

    await connectDB();

    // Store the push subscription JSON string on the user record.
    // Uses { strict: false } in the update options to allow saving
    // a field that may not yet be declared on the User schema.
    await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: { pushSubscription: JSON.stringify(subscription) } },
      { upsert: false }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/notifications]", err);
    return NextResponse.json(
      { error: "Failed to save push subscription" },
      { status: 500 }
    );
  }
}
```

**Imports to add at the top of the EXISTING file** (only if not already there):
```typescript
import { NextRequest } from "next/server";   // may already be imported
import User from "@/lib/models/User";
```

**Check:** The existing file imports `NextResponse`, `auth`, `connectDB`, `Notification`. Make sure you don't duplicate those imports.

---

## FILE 2 — CREATE NEW: `app/api/incidents/route.ts`

Create the directory `app/api/incidents/` and then create `route.ts` inside it.

This API handles community incident reports (safety alerts, load-shedding events, water outages, etc.).

```typescript
// app/api/incidents/route.ts
// GET  /api/incidents — list recent incidents (public)
// POST /api/incidents — report a new incident (auth required)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

// Inline schema — no separate model file needed for MVP
const IncidentSchema = new mongoose.Schema(
  {
    reporterId: { type: String, required: true },      // Clerk user ID
    reporterName: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["safety", "load_shedding", "water_outage", "road", "other"],
    },
    title: { type: String, required: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 1000 },
    suburb: { type: String, required: true, maxlength: 80 },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Incident =
  mongoose.models.Incident ??
  mongoose.model("Incident", IncidentSchema);

// ---- Sanitize helper (inline — do not import from lib/validation for this field set) ----
function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, "").trim().slice(0, max);
}

// ---- GET /api/incidents ----
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const suburb = searchParams.get("suburb") ?? "";
    const type = searchParams.get("type") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = 20;

    const filter: Record<string, unknown> = { resolved: false };
    if (suburb) filter.suburb = new RegExp(clean(suburb, 80), "i");
    if (type) filter.type = type;

    const [incidents, total] = await Promise.all([
      Incident.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Incident.countDocuments(filter),
    ]);

    return NextResponse.json({ incidents, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("[GET /api/incidents]", err);
    return NextResponse.json({ error: "Failed to fetch incidents" }, { status: 500 });
  }
}

// ---- POST /api/incidents ----
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await req.json();

    // Validate required fields
    const errors: Record<string, string> = {};
    const title = clean(body.title, 120);
    const description = clean(body.description, 1000);
    const suburb = clean(body.suburb, 80);
    const reporterName = clean(body.reporterName, 60);
    const VALID_TYPES = ["safety", "load_shedding", "water_outage", "road", "other"];
    const VALID_SEVERITIES = ["low", "medium", "high"];

    if (!title || title.length < 5) errors.title = "Title must be at least 5 characters";
    if (!description || description.length < 10) errors.description = "Description must be at least 10 characters";
    if (!suburb) errors.suburb = "Suburb is required";
    if (!reporterName) errors.reporterName = "Reporter name is required";
    if (!VALID_TYPES.includes(body.type)) errors.type = "Invalid incident type";
    if (body.severity && !VALID_SEVERITIES.includes(body.severity)) errors.severity = "Invalid severity";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    await connectDB();

    const incident = await Incident.create({
      reporterId: userId,
      reporterName,
      type: body.type,
      title,
      description,
      suburb,
      severity: VALID_SEVERITIES.includes(body.severity) ? body.severity : "medium",
    });

    return NextResponse.json({ incident }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/incidents]", err);
    return NextResponse.json({ error: "Failed to report incident" }, { status: 500 });
  }
}
```

---

## FILE 3 — CREATE NEW: `app/incidents/page.tsx`

Create the directory `app/incidents/` and then create `page.tsx` inside it.

This is the public incidents listing page. It is a client component.

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Incident {
  _id: string;
  type: string;
  title: string;
  description: string;
  suburb: string;
  severity: "low" | "medium" | "high";
  reporterName: string;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  safety: "Safety",
  load_shedding: "Load Shedding",
  water_outage: "Water Outage",
  road: "Road",
  other: "Other",
};

const SEVERITY_BADGE: Record<string, string> = {
  high: "badge-danger",
  medium: "badge-warning",
  low: "badge-success",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [suburb, setSuburb] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (suburb) params.set("suburb", suburb);
    if (type) params.set("type", type);

    setLoading(true);
    fetch(`/api/incidents?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setIncidents(data.incidents ?? []))
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false));
  }, [suburb, type]);

  return (
    <div className="container max-w-screen-md pt-8 pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-3xl font-bold">Community Incidents</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Safety alerts, utility outages, and road issues reported by the community.
          </p>
        </div>
        <Link href="/incidents/new" className="btn btn-primary btn-sm">
          Report Incident
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          className="kasi-input max-w-[180px]"
          placeholder="Filter by suburb"
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
        />
        <select
          className="kasi-input max-w-[180px]"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All types</option>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-on-surface-variant text-center py-8">Loading incidents...</p>
      ) : incidents.length === 0 ? (
        <div className="kasi-card text-center">
          <p className="text-on-surface-variant mb-3">No active incidents in this area.</p>
          <Link href="/incidents/new" className="btn btn-primary btn-sm">
            Report One
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {incidents.map((incident) => (
            <div key={incident._id} className="kasi-card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wide">
                    {TYPE_LABELS[incident.type] ?? incident.type}
                  </span>
                  <h2 className="font-bold text-lg">{incident.title}</h2>
                </div>
                <span className={`badge ${SEVERITY_BADGE[incident.severity] ?? "badge-success"} shrink-0`}>
                  {incident.severity}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant mb-3 line-clamp-3">
                {incident.description}
              </p>
              <div className="flex gap-3 text-xs text-outline flex-wrap">
                <span>{incident.suburb}</span>
                <span>·</span>
                <span>Reported by {incident.reporterName}</span>
                <span>·</span>
                <span>{timeAgo(incident.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## FILE 4 — CREATE NEW: `app/incidents/new/page.tsx`

Create the directory `app/incidents/new/` and then create `page.tsx` inside it.

This is the incident reporting form. It is a client component that requires auth.

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const INCIDENT_TYPES = [
  { value: "safety", label: "Safety Concern" },
  { value: "load_shedding", label: "Load Shedding Alert" },
  { value: "water_outage", label: "Water Outage" },
  { value: "road", label: "Road Problem" },
  { value: "other", label: "Other" },
];

const SUBURBS = [
  "Khayelitsha", "Mitchells Plain", "Gugulethu", "Langa", "Nyanga",
  "Philippi", "Delft", "Mfuleni", "Crossroads", "Soweto", "Alexandra",
  "Tembisa", "Cape Town CBD", "Bellville", "Johannesburg CBD",
];

export default function ReportIncidentPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  const [form, setForm] = useState({
    type: "",
    title: "",
    description: "",
    suburb: "",
    severity: "medium",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const errs: Record<string, string> = {};
    if (!form.type) errs.type = "Select an incident type";
    if (form.title.trim().length < 5) errs.title = "At least 5 characters";
    if (form.description.trim().length < 10) errs.description = "At least 10 characters";
    if (!form.suburb) errs.suburb = "Select your suburb";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          reporterName: user?.fullName ?? user?.firstName ?? "Anonymous",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors(data.errors ?? { general: data.error ?? "Failed to report" });
        return;
      }

      router.push("/incidents");
    } catch {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container max-w-screen-sm pt-8 pb-12">
      <h1 className="font-headline text-3xl font-bold mb-2">Report an Incident</h1>
      <p className="text-on-surface-variant text-sm mb-8">
        Alert the community about safety issues, outages, or road problems.
      </p>

      {errors.general && (
        <div className="alert alert-danger mb-5">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="form-group">
          <label className="label" htmlFor="type">Incident Type *</label>
          <select
            id="type"
            className={`kasi-input ${errors.type ? "border-error" : ""}`}
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
          >
            <option value="">Select type...</option>
            {INCIDENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {errors.type && <span className="error-text">{errors.type}</span>}
        </div>

        <div className="form-group">
          <label className="label" htmlFor="suburb">Suburb / Township *</label>
          <select
            id="suburb"
            className={`kasi-input ${errors.suburb ? "border-error" : ""}`}
            value={form.suburb}
            onChange={(e) => set("suburb", e.target.value)}
          >
            <option value="">Select suburb...</option>
            {SUBURBS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.suburb && <span className="error-text">{errors.suburb}</span>}
        </div>

        <div className="form-group">
          <label className="label" htmlFor="title">Title *</label>
          <input
            id="title"
            className={`kasi-input ${errors.title ? "border-error" : ""}`}
            placeholder="e.g. Water off in Section B since 6am"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="label" htmlFor="description">Description *</label>
          <textarea
            id="description"
            className={`kasi-input ${errors.description ? "border-error" : ""}`}
            rows={4}
            placeholder="Describe what is happening, where exactly, and how people are affected."
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label className="label" htmlFor="severity">Severity</label>
          <select
            id="severity"
            className="kasi-input"
            value={form.severity}
            onChange={(e) => set("severity", e.target.value)}
          >
            <option value="low">Low — Minor issue, not urgent</option>
            <option value="medium">Medium — Affects daily life</option>
            <option value="high">High — Dangerous or widespread</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary btn-lg mt-2"
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
```

---

## Done When

- [ ] `app/api/notifications/route.ts` has a new `POST` handler — GET and PATCH are unchanged
- [ ] `app/api/incidents/route.ts` exists with GET + POST handlers
- [ ] `app/incidents/page.tsx` shows incident list with suburb + type filters
- [ ] `app/incidents/new/page.tsx` shows report form, auth-gated, submits to API
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] No files left in wrong directories (no stray `.ts` files in `Structure/`)
- [ ] You have NOT touched any of DEV_1's files

---

## Comms Log Entry Format (append to `Structure/Updates/comms-log.md`)

```
### YYYY-MM-DD | DEV_2 (Gemini) | H8+M4 COMPLETE

**Tasks:** H8, M4
**Summary:** [what you built — 2-3 sentences max]
**Build:** Passes
**Blockers:** None / [describe any — e.g. User schema missing pushSubscription field]
**Next:** Lead review
```
