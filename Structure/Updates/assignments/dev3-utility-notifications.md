---
title: dev3-utility-notifications
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

# Dev 3 Assignment — H3 + H8: Load-Shedding Data & Notification Delivery

**Assigned by:** Lead (Claude Opus 4.6) | **Date:** 2026-04-04
**Task IDs:** H3, H8
**Deadline:** Before MVP launch (end April 2026)

Read `Structure/Updates/delegation-protocol.md` before starting.

---

## Your Scope — ONLY These Files

You may ONLY edit or create:

```
components/LoadSheddingWidget.tsx      ← wire real data
app/api/load-shedding/route.ts         ← create new (data proxy)
app/api/notifications/route.ts         ← add POST for browser push
app/water-outages/page.tsx             ← wire real data
```

Do NOT touch anything else, including `lib/db.ts`, `app/layout.tsx`, or any other model.

---

## Context You Need

**Auth pattern:**
```typescript
import { auth } from "@clerk/nextjs/server";
const { userId } = await auth();
if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
```

**DB pattern:**
```typescript
import connectDB from "@/lib/db";
await connectDB();
```

**Existing Notification model** (`lib/models/Notification.ts`):
```typescript
interface INotification {
  userId: string;    // Clerk user ID
  type: "application" | "message" | "system" | "gig_update";
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
}
```
The model, GET, and PATCH routes for `/api/notifications` already exist. You are ADDING a POST route for push subscriptions.

**Existing Widget** (`components/LoadSheddingWidget.tsx`):
- Currently uses `setTimeout` with hardcoded Stage 2 as a placeholder
- Has the UI shell ready — you're replacing the data-fetching logic only
- Keep all existing JSX/CSS unchanged; only swap the `useEffect` internals

---

## Task 1 — Create `app/api/load-shedding/route.ts`

This is a **server-side proxy** to the EskomSePush API. We proxy it server-side so we don't expose API keys to the browser.

### GET /api/load-shedding

```
Response: {
  stage: number,          // 0 = no shedding, 1-8 = stage
  status: string,         // human-readable: "No Load Shedding" | "Stage 2" etc
  updatedAt: string       // ISO timestamp
}
```

**Implementation:**
```typescript
// EskomSePush free tier: https://eskomsepush.gumroad.com/l/api
// Key is stored as ESKOMSEPUSH_API_KEY in .env.local
// If key is missing or request fails, return a safe fallback

const apiKey = process.env.ESKOMSEPUSH_API_KEY;

if (!apiKey) {
  // Fallback when no key configured — return stage 0 (no shedding)
  return NextResponse.json({ stage: 0, status: "Status unavailable", updatedAt: new Date().toISOString() });
}

const res = await fetch("https://developer.sepush.co.za/business/2.0/status", {
  headers: { "token": apiKey },
  next: { revalidate: 300 }, // cache for 5 minutes
});

if (!res.ok) {
  return NextResponse.json({ stage: 0, status: "Status unavailable", updatedAt: new Date().toISOString() });
}

const data = await res.json();
// EskomSePush returns data.status.eskom.stage (string)
const stage = parseInt(data?.status?.eskom?.stage ?? "0", 10);
return NextResponse.json({
  stage: isNaN(stage) ? 0 : stage,
  status: stage > 0 ? `Stage ${stage}` : "No Load Shedding",
  updatedAt: new Date().toISOString(),
});
```

**Rules:**
- Always return a valid JSON response — never let this route throw to the caller
- Cache with `next: { revalidate: 300 }` on the fetch call
- Wrap entire handler in try/catch; catch returns the fallback

---

## Task 2 — Update `components/LoadSheddingWidget.tsx`

Replace the `useEffect` placeholder with a real fetch to `/api/load-shedding`.

**Current broken code:**
```typescript
useEffect(() => {
  const fetchStage = async () => {
    setLoading(true);
    setTimeout(() => {
      setStage(2); // placeholder
      setLoading(false);
    }, 1500);
  };
  fetchStage();
}, []);
```

**Replace with:**
```typescript
useEffect(() => {
  const fetchStage = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/load-shedding");
      if (res.ok) {
        const data = await res.json();
        setStage(data.stage ?? 0);
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

Do NOT change any JSX, className, or Link elements — only the useEffect.

---

## Task 3 — Update `app/water-outages/page.tsx`

Read the current file first. Then:
- Add a `useState` for load-shedding data
- On mount, fetch from `/api/load-shedding`
- Display current stage prominently at the top of the page
- Add an auto-refresh every 5 minutes: `setInterval(() => fetchStage(), 5 * 60 * 1000)`
- Clear the interval on unmount: return `() => clearInterval(intervalId)` from useEffect

Keep all existing content on the page. Only ADD the live stage display at the top.

---

## Task 4 — Add POST to `app/api/notifications/route.ts`

**This adds browser push notification subscription storage.** The GET and PATCH handlers are already written — append a POST handler to the same file.

### POST /api/notifications/subscribe

```
Body: {
  subscription: {
    endpoint: string,
    keys: { p256dh: string, auth: string }
  }
}
```

**What this does:**
- Receives the browser's PushSubscription object
- Saves it to MongoDB on the User document so we can send pushes later
- For MVP, just store the subscription endpoint on the User record

**Implementation approach:**
```typescript
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json();
  const { subscription } = body;

  if (!subscription?.endpoint) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  await connectDB();
  // Store subscription endpoint on User (import User from @/lib/models/User)
  await User.findOneAndUpdate(
    { clerkId: userId },
    { pushSubscription: JSON.stringify(subscription) },
    { upsert: false }
  );

  return NextResponse.json({ success: true });
}
```

**You MUST import User** — add this import at the top of the existing file:
```typescript
import User from "@/lib/models/User";
```

**Important:** The `pushSubscription` field may not exist on the User schema yet. Check `lib/models/User.ts` — if the field isn't there, you need to request Lead to add it to the schema, or use `{ strict: false }` on the update. Do NOT modify `lib/models/User.ts` yourself (it's outside your scope). Instead, note it in your comms-log entry and the Lead will add the field.

---

## Done When

- [ ] `GET /api/load-shedding` returns real stage data from EskomSePush (or safe fallback)
- [ ] Widget shows real stage instead of hardcoded "Stage 2"
- [ ] Widget shows "Status unavailable" gracefully when API key missing
- [ ] Water outages page shows live stage at top with 5-minute auto-refresh
- [ ] `POST /api/notifications/subscribe` stores push subscription
- [ ] `npm run build` passes with no TypeScript errors

---

## Environment Variable Needed

Add this to your `.env.local` for local testing:
```
ESKOMSEPUSH_API_KEY=your_key_here
```

Get a free key at: https://eskomsepush.gumroad.com/l/api

Note in your comms-log whether you were able to test with a real key or used fallback mode.

---

## Report

When done, add an entry to `Structure/Updates/comms-log.md`:
```
### YYYY-MM-DD | Dev 3 | H3+H8 COMPLETE

**Tasks:** H3, H8
**Summary:** [what you built]
**EskomSePush:** [tested with real key / fallback only]
**Blockers:** [any issues — e.g. User schema missing pushSubscription field]
**Next:** Lead review
```
