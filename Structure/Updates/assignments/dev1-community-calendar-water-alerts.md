---
title: dev1-community-calendar-water-alerts
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

# DEV_1 (Codex) — QUEUED Assignment: M2 + M3 Community Calendar & Water Alert Details

**Assigned by:** Lead (Claude Opus 4.6) | **Date:** 2026-04-05
**Task IDs:** M2, M3
**Status:** QUEUED — Execute ONLY after `dev1-load-shedding.md` is marked COMPLETE in comms-log.
**Priority:** MEDIUM

---

## STOP. READ THESE RULES FIRST.

1. Do NOT start this assignment until your H3 task is complete and confirmed in comms-log.
2. You touch **ONLY** the 6 files listed in your scope below. No others.
3. DEV_2 (Gemini) owns: `app/incidents/`, `app/api/incidents/`, `app/api/notifications/route.ts`, `app/chat/`, `app/community-status/`, `app/my-water-reports/`, `app/utility-schedule/`. Do NOT touch those.
4. No new dependencies. Use what's already in `package.json`.
5. Run `npm run build` when done. Confirm it passes before reporting.
6. Append ONE comms-log entry when done.

---

## Your File Scope — EXACTLY These 6 Files. No Others.

```
FILE 1 (CREATE NEW):  app/community-calendar/page.tsx
FILE 2 (CREATE NEW):  app/api/community-calendar/route.ts
FILE 3 (UPDATE):      app/water-outages/page.tsx          ← DEV_1 already owns this from H3
FILE 4 (CREATE NEW):  app/api/water-alerts/route.ts
FILE 5 (CREATE NEW):  app/spotlight/page.tsx              (Local Business Spotlight — S2)
FILE 6 (CREATE NEW):  app/api/spotlight/route.ts          (Local Business Spotlight — S2)
```

---

## Design Reference

Before writing any code, open these HTML files in a browser and look at the designs:
- `Structure/Design/features/stitch/community_calendar/code.html` — calendar UI
- `Structure/Design/features/stitch/water_outage_alert_details/code.html` — water alert detail UI
- `Structure/Design/features/stitch/local_business_spotlight/code.html` — business spotlight UI

Read the design. Understand the layout. Then write the React equivalent using existing project CSS classes.

---

## FILE 1 — CREATE: `app/community-calendar/page.tsx`

**What it is:** A community events calendar. Shows upcoming local events (markets, meetings, job fairs, load-shedding awareness sessions).

**This is a client component** (`"use client"`).

**Data:** Fetch from `GET /api/community-calendar` on mount.

**UI requirements (from mockup):**
- Page title: "Community Calendar"
- Subtitle: "Local events, meetups, and opportunities near you."
- Filter row: suburb selector + event type selector (job_fair, market, meeting, awareness, social, other)
- Event cards showing: title, date, time, suburb, type badge, short description
- "Add Event" button (top right) — links to `/community-calendar/new` (do NOT create this page yet — just link)
- Empty state: "No upcoming events in this area. Be the first to add one."
- Loading state while fetching

**Event card structure:**
```tsx
<div className="kasi-card">
  <div className="flex items-start justify-between gap-3 mb-2">
    <div>
      <span className="badge badge-primary text-xs mb-1">{type label}</span>
      <h2 className="font-bold text-lg">{title}</h2>
    </div>
    <div className="text-right text-sm text-on-surface-variant shrink-0">
      <p>{formatted date}</p>
      <p>{time}</p>
    </div>
  </div>
  <p className="text-sm text-on-surface-variant">{description}</p>
  <p className="text-xs text-outline mt-2">{suburb}</p>
</div>
```

---

## FILE 2 — CREATE: `app/api/community-calendar/route.ts`

Use an **inline Mongoose schema** (no separate model file).

```typescript
// app/api/community-calendar/route.ts
// GET  — list upcoming events (public)
// POST — create event (auth required)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    organizerId: { type: String, required: true },
    organizerName: { type: String, required: true, maxlength: 80 },
    type: {
      type: String,
      required: true,
      enum: ["job_fair", "market", "meeting", "awareness", "social", "other"],
      default: "other",
    },
    title: { type: String, required: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 500 },
    suburb: { type: String, required: true, maxlength: 80 },
    date: { type: Date, required: true },       // ISO date of the event
    time: { type: String, required: true, maxlength: 20 },  // e.g. "10:00 AM"
    cancelled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CommunityEvent =
  mongoose.models.CommunityEvent ??
  mongoose.model("CommunityEvent", EventSchema);

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(/<[^>]*>/g, "").trim().slice(0, max);
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const suburb = searchParams.get("suburb") ?? "";
    const type = searchParams.get("type") ?? "";

    const filter: Record<string, unknown> = {
      cancelled: false,
      date: { $gte: new Date() }, // only future events
    };
    if (suburb) filter.suburb = new RegExp(clean(suburb, 80), "i");
    if (type) filter.type = type;

    const events = await CommunityEvent.find(filter)
      .sort({ date: 1 }) // chronological order
      .limit(30)
      .lean();

    return NextResponse.json({ events });
  } catch (err) {
    console.error("[GET /api/community-calendar]", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const body = await req.json();
    const errors: Record<string, string> = {};

    const title = clean(body.title, 120);
    const description = clean(body.description, 500);
    const suburb = clean(body.suburb, 80);
    const organizerName = clean(body.organizerName, 80);
    const time = clean(body.time, 20);
    const VALID_TYPES = ["job_fair", "market", "meeting", "awareness", "social", "other"];

    if (!title || title.length < 5) errors.title = "Title must be at least 5 characters";
    if (!description || description.length < 10) errors.description = "Description required";
    if (!suburb) errors.suburb = "Suburb is required";
    if (!organizerName) errors.organizerName = "Your name is required";
    if (!VALID_TYPES.includes(body.type)) errors.type = "Invalid event type";
    if (!body.date || isNaN(new Date(body.date).getTime())) errors.date = "Valid date required";
    if (!time) errors.time = "Time is required (e.g. 10:00 AM)";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    await connectDB();
    const event = await CommunityEvent.create({
      organizerId: userId,
      organizerName,
      type: body.type,
      title,
      description,
      suburb,
      date: new Date(body.date),
      time,
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/community-calendar]", err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
```

---

## FILE 3 — UPDATE: `app/water-outages/page.tsx`

You already updated this file in H3 (added live load-shedding banner). Now add a **scheduled outages section** at the bottom of the page.

After the existing page content, add:

```tsx
{/* Scheduled Outages Section */}
<section className="mt-10">
  <h2 className="font-headline text-2xl font-bold mb-4">Scheduled Outages</h2>
  <p className="text-on-surface-variant text-sm mb-4">
    Water and electricity outages reported by the community. Filter by suburb to see your area.
  </p>
  <div className="flex gap-3 mb-4 flex-wrap">
    <input
      className="kasi-input max-w-[180px]"
      placeholder="Filter by suburb"
      value={alertSuburb}
      onChange={(e) => setAlertSuburb(e.target.value)}
    />
  </div>
  {loadingAlerts ? (
    <p className="text-on-surface-variant">Loading outage reports...</p>
  ) : alerts.length === 0 ? (
    <div className="kasi-card text-center">
      <p className="text-on-surface-variant">No reported outages in this area.</p>
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      {alerts.map((alert) => (
        <div key={alert._id} className="kasi-card border-l-4 border-error">
          <h3 className="font-bold">{alert.title}</h3>
          <p className="text-sm text-on-surface-variant mt-1">{alert.description}</p>
          <p className="text-xs text-outline mt-2">{alert.suburb} · {timeAgo(alert.createdAt)}</p>
        </div>
      ))}
    </div>
  )}
</section>
```

Add the state variables and fetch effect at the top of the component:
```typescript
const [alerts, setAlerts] = useState<WaterAlert[]>([]);
const [alertSuburb, setAlertSuburb] = useState("");
const [loadingAlerts, setLoadingAlerts] = useState(true);

// Add this interface at the top of the file
interface WaterAlert {
  _id: string;
  title: string;
  description: string;
  suburb: string;
  createdAt: string;
}

// Add this timeAgo function (if not already there)
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
```

Add a separate useEffect for loading alerts:
```typescript
useEffect(() => {
  const params = new URLSearchParams();
  if (alertSuburb) params.set("suburb", alertSuburb);
  setLoadingAlerts(true);
  fetch(`/api/water-alerts?${params.toString()}`)
    .then(res => res.json())
    .then(data => setAlerts(data.alerts ?? []))
    .catch(() => setAlerts([]))
    .finally(() => setLoadingAlerts(false));
}, [alertSuburb]);
```

---

## FILE 4 — CREATE: `app/api/water-alerts/route.ts`

```typescript
// app/api/water-alerts/route.ts
// GET  — list water/electricity outage reports (public)
// POST — submit an outage report (auth required)
// Note: For incident types "water_outage" and "load_shedding" from the Incident model,
// this route provides a more targeted water-focused view.

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

// Reuse the Incident model if it exists, otherwise create a slim local schema
const WaterAlertSchema = new mongoose.Schema(
  {
    reporterId: { type: String, required: true },
    title: { type: String, required: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 500 },
    suburb: { type: String, required: true, maxlength: 80 },
    type: {
      type: String,
      enum: ["water_outage", "load_shedding", "both"],
      default: "water_outage",
    },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const WaterAlert =
  mongoose.models.WaterAlert ??
  mongoose.model("WaterAlert", WaterAlertSchema);

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(/<[^>]*>/g, "").trim().slice(0, max);
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const suburb = searchParams.get("suburb") ?? "";

    const filter: Record<string, unknown> = { resolved: false };
    if (suburb) filter.suburb = new RegExp(clean(suburb, 80), "i");

    const alerts = await WaterAlert.find(filter)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ alerts });
  } catch (err) {
    console.error("[GET /api/water-alerts]", err);
    return NextResponse.json({ error: "Failed to fetch water alerts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const body = await req.json();
    const errors: Record<string, string> = {};

    const title = clean(body.title, 120);
    const description = clean(body.description, 500);
    const suburb = clean(body.suburb, 80);
    const VALID_TYPES = ["water_outage", "load_shedding", "both"];

    if (!title || title.length < 5) errors.title = "Title required (min 5 chars)";
    if (!description || description.length < 10) errors.description = "Description required";
    if (!suburb) errors.suburb = "Suburb required";
    if (!VALID_TYPES.includes(body.type)) errors.type = "Invalid type";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    await connectDB();
    const alert = await WaterAlert.create({
      reporterId: userId,
      title,
      description,
      suburb,
      type: body.type ?? "water_outage",
    });

    return NextResponse.json({ alert }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/water-alerts]", err);
    return NextResponse.json({ error: "Failed to report outage" }, { status: 500 });
  }
}
```

---

## FILES 5 & 6 — Local Business Spotlight (S2)

**Read the design:** `Structure/Design/features/stitch/local_business_spotlight/code.html`

### FILE 5 — `app/spotlight/page.tsx`

A directory of local businesses near the user's township. Client component.

**UI:**
- Title: "Local Business Spotlight"
- Subtitle: "Support businesses in your community."
- Filter by suburb and category
- Business cards: name, category, suburb, short description, contact info (phone)
- "List Your Business" button → links to `/spotlight/new` (do NOT create yet)
- Empty state: "No businesses listed in this area yet."

### FILE 6 — `app/api/spotlight/route.ts`

Inline schema. Fields:
```typescript
{
  ownerId: String,          // Clerk ID
  ownerName: String,
  businessName: String,    // maxlength 120
  category: String,        // enum: retail, food, services, construction, healthcare, education, other
  description: String,     // maxlength 500
  suburb: String,          // maxlength 80
  phone: String,           // maxlength 20 — SA format +27...
  verified: Boolean,       // default false — Lead enables manually
  createdAt, updatedAt: timestamps
}
```

GET: public, filters by `suburb` and `category`, limit 30, sort by createdAt DESC
POST: auth required, validates all required fields, sanitize strings with inline clean() function

---

## Done When

- [ ] `app/community-calendar/page.tsx` — shows events, filters by suburb + type
- [ ] `app/api/community-calendar/route.ts` — GET (public) + POST (auth)
- [ ] `app/water-outages/page.tsx` — has live stage banner (from H3) + scheduled outages section
- [ ] `app/api/water-alerts/route.ts` — GET (public) + POST (auth)
- [ ] `app/spotlight/page.tsx` — business directory with filters
- [ ] `app/api/spotlight/route.ts` — GET + POST
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] No files left in wrong directories

---

## Comms Log Entry (append to `Structure/Updates/comms-log.md`)

```
### YYYY-MM-DD | DEV_1 (Codex) | M2+M3+S2 COMPLETE

**Tasks:** M2, M3, S2
**Summary:** [what you built]
**Build:** Passes
**Blockers:** None / [describe any]
**Next:** Lead review
```
