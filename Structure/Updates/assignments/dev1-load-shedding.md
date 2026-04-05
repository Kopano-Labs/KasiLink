---
title: dev1-load-shedding
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

# DEV_1 (Codex) — Assignment: H3 Load-Shedding Real Data

**Assigned by:** Lead (Claude Opus 4.6) | **Date:** 2026-04-05
**Task ID:** H3
**Priority:** HIGH — MVP feature

---

## STOP. READ THESE RULES FIRST.

1. You touch **ONLY** the 3 files listed in your scope below.
2. You do **NOT** touch any file DEV_2 (Gemini) owns.
3. You do **NOT** modify `lib/db.ts`, `app/layout.tsx`, `middleware.ts`, `package.json`, or any `Structure/` file except appending to `comms-log.md`.
4. If you create a file that is not on your scope list, you have violated the protocol.
5. When done: run `npm run build`, confirm it passes, then append ONE entry to `Structure/Updates/comms-log.md`.

---

## Your File Scope — EXACTLY These 3 Files. No Others.

```
FILE 1 (CREATE NEW):  app/api/load-shedding/route.ts
FILE 2 (UPDATE):      components/LoadSheddingWidget.tsx
FILE 3 (UPDATE):      app/water-outages/page.tsx
```

DEV_2 (Gemini) owns: `app/api/notifications/route.ts`, `app/api/incidents/route.ts`, `app/incidents/page.tsx`, `app/incidents/new/page.tsx`
Do NOT open or edit any of those files.

---

## FILE 1 — CREATE: `app/api/load-shedding/route.ts`

This is a brand new file. Create the directory `app/api/load-shedding/` first, then create `route.ts` inside it.

This file is a server-side proxy to the EskomSePush API. It runs server-side so the API key is never exposed to the browser.

### Exact implementation to write:

```typescript
// app/api/load-shedding/route.ts
// GET /api/load-shedding — returns current Eskom load-shedding stage
// Server-side proxy to EskomSePush API (key never exposed to browser)

import { NextResponse } from "next/server";

const FALLBACK = {
  stage: 0,
  status: "Status unavailable",
  updatedAt: new Date().toISOString(),
};

export async function GET() {
  const apiKey = process.env.ESKOMSEPUSH_API_KEY;

  if (!apiKey) {
    return NextResponse.json(FALLBACK);
  }

  try {
    const res = await fetch(
      "https://developer.sepush.co.za/business/2.0/status",
      {
        headers: { token: apiKey },
        next: { revalidate: 300 }, // cache 5 minutes server-side
      }
    );

    if (!res.ok) {
      return NextResponse.json(FALLBACK);
    }

    const data = await res.json();
    const raw = data?.status?.eskom?.stage ?? "0";
    const stage = parseInt(String(raw), 10);
    const safeStage = isNaN(stage) ? 0 : stage;

    return NextResponse.json({
      stage: safeStage,
      status: safeStage > 0 ? `Stage ${safeStage}` : "No Load Shedding",
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
```

**Rules for this file:**
- No auth required (this is a public status endpoint)
- Always returns valid JSON — never throws to the caller
- `next: { revalidate: 300 }` on the fetch call caches at the CDN level for 5 min

---

## FILE 2 — UPDATE: `components/LoadSheddingWidget.tsx`

Read the current file first before editing. You will ONLY replace the `useEffect` body. Do NOT change any JSX, className, Link, or return statement.

### Current `useEffect` to REPLACE (lines ~10–19):

```typescript
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
```

### Replace it with EXACTLY this:

```typescript
useEffect(() => {
  const fetchStage = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/load-shedding");
      if (res.ok) {
        const data = await res.json();
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
```

That is the only change to this file. Nothing else.

---

## FILE 3 — UPDATE: `app/water-outages/page.tsx`

Read the current file first. Then make these additions:

**Step 1:** If the file does not already have `"use client"` at the top, add it as the very first line.

**Step 2:** Add these imports at the top (after `"use client"`, before existing imports):
```typescript
import { useState, useEffect } from "react";
```
If `useState` or `useEffect` are already imported, skip adding them.

**Step 3:** Inside the component function (before the return statement), add this state and effect:
```typescript
const [loadStage, setLoadStage] = useState<number>(0);
const [loadStatus, setLoadStatus] = useState<string>("Checking...");

useEffect(() => {
  const fetchStage = async () => {
    try {
      const res = await fetch("/api/load-shedding");
      if (res.ok) {
        const data = await res.json();
        setLoadStage(data.stage ?? 0);
        setLoadStatus(data.status ?? "Unknown");
      }
    } catch {
      setLoadStatus("Status unavailable");
    }
  };
  fetchStage();
  const id = setInterval(fetchStage, 5 * 60 * 1000); // refresh every 5 min
  return () => clearInterval(id);
}, []);
```

**Step 4:** Add this status banner as the FIRST element inside the return statement (before any existing content):
```tsx
<div className={`kasi-card mb-6 border-2 ${loadStage > 0 ? "border-error bg-error-container/20" : "border-primary bg-primary-container/20"}`}>
  <div className="flex items-center gap-3">
    <span className="text-2xl">{loadStage > 0 ? "⚡" : "✅"}</span>
    <div>
      <p className="font-bold text-lg">{loadStatus}</p>
      <p className="text-sm text-on-surface-variant">Live Eskom status — updates every 5 minutes</p>
    </div>
  </div>
</div>
```

**Do NOT remove or change any existing content** on this page. Only add the above.

---

## Environment Variable Required

For real data to work, `.env.local` needs:
```
ESKOMSEPUSH_API_KEY=your_key_here
```

Free key: https://eskomsepush.gumroad.com/l/api

If no key is set, the widget and page will show "Status unavailable" — this is intentional and acceptable for testing.

---

## Done When

- [ ] `app/api/load-shedding/route.ts` exists and returns `{ stage, status, updatedAt }`
- [ ] `components/LoadSheddingWidget.tsx` fetches from `/api/load-shedding` (no more setTimeout/hardcoded Stage 2)
- [ ] `app/water-outages/page.tsx` shows a live status banner at the top, auto-refreshes every 5 min
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] You have NOT touched any of DEV_2's files

---

## Comms Log Entry Format (append to `Structure/Updates/comms-log.md`)

```
### YYYY-MM-DD | DEV_1 (Codex) | H3 COMPLETE

**Tasks:** H3
**Summary:** [what you built — 2-3 sentences max]
**EskomSePush tested:** [Yes with real key / No, using fallback]
**Build:** Passes
**Blockers:** None / [describe any]
**Next:** Lead review
```
