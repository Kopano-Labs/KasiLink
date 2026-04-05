---
title: dev2-chat-skins-utility-community-status
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

# DEV_2 (Gemini) — QUEUED Assignment: M1 + M5 + S1 + S3 Chat Skins, Utility Schedule, Community Status, My Water Reports

**Assigned by:** Lead (Claude Opus 4.6) | **Date:** 2026-04-05
**Task IDs:** M1, M5, S1, S3
**Status:** QUEUED — Execute ONLY after `dev2-notifications-incidents.md` is marked COMPLETE in comms-log.
**Priority:** MEDIUM

---

## STOP. READ THESE RULES FIRST.

1. Do NOT start this assignment until your H8+M4 task is complete and confirmed in comms-log.
2. You touch **ONLY** the files listed in your scope below. No others.
3. DEV_1 (Codex) owns: `app/community-calendar/`, `app/api/community-calendar/`, `app/water-outages/page.tsx`, `app/api/water-alerts/`, `app/spotlight/`, `app/api/spotlight/`, `app/api/load-shedding/`, `components/LoadSheddingWidget.tsx`. Do NOT touch those.
4. No new npm dependencies. Use what's in `package.json`.
5. Run `npm run build` when done. Confirm it passes before reporting.
6. No draft files in `Structure/`. Code only in `app/`, `lib/`, `components/`, `public/`.
7. Append ONE comms-log entry when done.

---

## Your File Scope — EXACTLY These Files. No Others.

```
M1 — Chameleon Chat Skins:
  FILE 1 (UPDATE):      app/chat/page.tsx                ← add skin selector UI
  FILE 2 (CREATE NEW):  components/chat/WhatsAppSkin.tsx
  FILE 3 (CREATE NEW):  components/chat/DiscordSkin.tsx
  FILE 4 (CREATE NEW):  components/chat/InstagramSkin.tsx

M5 — Utility Schedule:
  FILE 5 (CREATE NEW):  app/utility-schedule/page.tsx
  FILE 6 (CREATE NEW):  app/api/utility-schedule/route.ts

S1 — Community Status:
  FILE 7 (CREATE NEW):  app/community-status/page.tsx
  FILE 8 (CREATE NEW):  app/api/community-status/route.ts

S3 — My Water Reports:
  FILE 9 (CREATE NEW):  app/my-water-reports/page.tsx
```

---

## Design References — READ THESE FIRST

Open these HTML files in a browser before writing any React:
- `Structure/Design/chat/stitch/premium_chat_selector/code.html` — skin picker UI
- `Structure/Design/chat/stitch/chat_whatsapp_skin/code.html` — WhatsApp skin
- `Structure/Design/chat/stitch/chat_discord_skin/code.html` — Discord skin
- `Structure/Design/chat/stitch/chat_instagram_skin/code.html` — Instagram skin
- `Structure/Design/sub-features/stitch/stitch/utility_schedule/code.html` — utility schedule UI
- `Structure/Design/sub-features/stitch/stitch/community_status/code.html` — community status UI
- `Structure/Design/features/stitch/my_water_reports/code.html` — water reports UI

---

## M1: Chameleon Chat Skins

### FILE 1 — UPDATE: `app/chat/page.tsx`

Read the current chat page first. Add a **skin selector** at the top of the chat interface.

**Add this state at the top of the component:**
```typescript
const [skin, setSkin] = useState<"default" | "whatsapp" | "discord" | "instagram">("default");
```

**Add this skin selector bar** above the grid/layout of conversations and messages:
```tsx
<div className="mb-4 flex gap-2 flex-wrap items-center">
  <span className="text-sm text-on-surface-variant font-medium mr-2">Chat Style:</span>
  {(["default", "whatsapp", "discord", "instagram"] as const).map((s) => (
    <button
      key={s}
      type="button"
      onClick={() => setSkin(s)}
      className={`btn btn-sm capitalize ${skin === s ? "btn-primary" : "btn-outline"}`}
    >
      {s === "default" ? "Standard" : s === "whatsapp" ? "WhatsApp" : s === "discord" ? "Discord" : "Instagram"}
    </button>
  ))}
</div>
```

**Replace the message thread section** (the `<section>` with the message list and input) with a conditional render:
```tsx
{skin === "whatsapp" && selectedConversationId && (
  <WhatsAppSkin
    conversationId={selectedConversationId}
    gigTitle={selectedConversation?.gigTitle ?? ""}
  />
)}
{skin === "discord" && selectedConversationId && (
  <DiscordSkin
    conversationId={selectedConversationId}
    gigTitle={selectedConversation?.gigTitle ?? ""}
  />
)}
{skin === "instagram" && selectedConversationId && (
  <InstagramSkin
    conversationId={selectedConversationId}
    gigTitle={selectedConversation?.gigTitle ?? ""}
  />
)}
{skin === "default" && (
  // Keep the existing default message thread JSX here — do NOT remove it
  <section className="kasi-card flex min-h-[70vh] flex-col">
    {/* existing message thread JSX unchanged */}
  </section>
)}
```

**Add imports at the top of chat/page.tsx:**
```typescript
import WhatsAppSkin from "@/components/chat/WhatsAppSkin";
import DiscordSkin from "@/components/chat/DiscordSkin";
import InstagramSkin from "@/components/chat/InstagramSkin";
```

### FILES 2, 3, 4 — Skin Components

Each skin component receives: `conversationId: string`, `gigTitle: string`

Each skin component:
1. Fetches messages from `GET /api/messages?conversationId={conversationId}` on mount
2. Polls every 10 seconds (same as the default skin)
3. Sends messages via `POST /api/messages` with `{ conversationId, text }`
4. Uses `useUser()` from `@clerk/nextjs` to identify the current user's messages

**Props interface for all three skins:**
```typescript
interface SkinProps {
  conversationId: string;
  gigTitle: string;
}
```

**WhatsApp skin** (`components/chat/WhatsAppSkin.tsx`):
- Dark green header: `bg-[#075E54]` with white text showing gigTitle
- Message bubbles: sent = `bg-[#dcf8c6] text-black rounded-2xl rounded-tr-sm`, received = `bg-white text-black rounded-2xl rounded-tl-sm`
- Light green background: `bg-[#e5ddd5]`
- Input bar at bottom: grey input + send button styled green `bg-[#25D366]`

**Discord skin** (`components/chat/DiscordSkin.tsx`):
- Dark background: `bg-[#36393f]`
- Channel header: `bg-[#2f3136]` showing `# {gigTitle.toLowerCase().replace(/\s+/g, "-")}`
- Messages: no bubbles — full-width rows, avatar placeholder (colored circle with initial), username in grey, message text in `text-[#dcddde]`
- Input at bottom: `bg-[#40444b]` rounded, white text, blue send button `bg-[#5865F2]`

**Instagram skin** (`components/chat/InstagramSkin.tsx`):
- White/light background
- Header: gradient border-bottom, showing gigTitle in bold with a colored avatar placeholder
- Sent bubbles: purple-blue gradient `bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-2xl rounded-tr-sm`
- Received bubbles: `bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm`
- Input: minimal, grey rounded, with send icon button

**All three skins must:**
- Handle the empty state (no messages yet)
- Handle loading state
- Allow sending a message (textarea + button)
- Show the current user's messages on the right, other's on the left

---

## M5: Utility Schedule — FILE 5 + FILE 6

### FILE 5 — CREATE: `app/utility-schedule/page.tsx`

**Read:** `Structure/Design/sub-features/stitch/stitch/utility_schedule/code.html`

Client component. Shows load-shedding and water utility schedules by suburb.

**UI:**
- Title: "Utility Schedule"
- Subtitle: "Your suburb's load-shedding and water schedule."
- Suburb selector (dropdown — same SUBURBS list used in gig posting: Khayelitsha, Soweto, etc.)
- On suburb select → fetch `GET /api/utility-schedule?suburb={suburb}`
- Display schedule in a table/list: time slot, date, type (electricity/water), status (scheduled/active/completed)
- Empty state: "No schedule data for this suburb. Check back later."
- Auto-refresh every 10 minutes

### FILE 6 — CREATE: `app/api/utility-schedule/route.ts`

Inline schema. GET is public, POST is auth-gated (for admins adding schedules — for MVP just build the endpoint, it won't be used yet).

```typescript
// Fields for UtilitySchedule:
// suburb: String (required)
// type: enum ["electricity", "water"] (required)
// startTime: Date (required)
// endTime: Date (required)
// stage: Number (for electricity — Eskom stage 0-8, default 0)
// status: enum ["scheduled", "active", "completed", "cancelled"] (default "scheduled")
// notes: String (optional, maxlength 200)
```

GET: public, filter by `suburb` (exact match, case-insensitive), filter by `type` (optional), sort by `startTime` ASC, limit 20, only show entries where `endTime >= now`

POST: auth required, validate `suburb`, `type`, `startTime`, `endTime`, return 201 on success.

---

## S1: Community Status — FILE 7 + FILE 8

### FILE 7 — CREATE: `app/community-status/page.tsx`

**Read:** `Structure/Design/sub-features/stitch/stitch/community_status/code.html`

Client component. A real-time overview of the township's status — power, water, safety, internet.

**UI:**
- Title: "Community Status"
- Subtitle: "Live status for your area."
- Suburb selector
- Status grid (4 cards):
  1. **Power** — fetches from `GET /api/load-shedding` (DEV_1's route — read only, do NOT modify that file)
  2. **Water** — fetches from `GET /api/water-alerts?suburb={suburb}` (count of active alerts)
  3. **Safety** — fetches from `GET /api/incidents?type=safety&suburb={suburb}` (count of active incidents)
  4. **Internet** — static card for now: "Community report unavailable" with a placeholder
- Each card: icon + status label (green "All Clear" / yellow "Watch" / red "Active Issues")
- Quick links at bottom: to /water-outages, /incidents, /forum

### FILE 8 — CREATE: `app/api/community-status/route.ts`

GET endpoint that aggregates status into one response:

```typescript
// GET /api/community-status?suburb={suburb}
// Returns aggregated status for a suburb
// Calls: Incident model (safety count), WaterAlert model (water count)
// Reads Eskom stage from process.env or a simple in-memory cache

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

// Reference existing models by name — do NOT re-import their schema files
// (DEV_1 may not have created them in the same file scope)
// Use mongoose.models to check if they exist

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const suburb = searchParams.get("suburb") ?? "";

  await connectDB();

  const filter: Record<string, unknown> = { resolved: false };
  if (suburb) filter.suburb = new RegExp(suburb.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  // Count safety incidents
  let safetyCount = 0;
  try {
    const Incident = mongoose.models.Incident;
    if (Incident) {
      safetyCount = await Incident.countDocuments({ ...filter, type: "safety" });
    }
  } catch { safetyCount = 0; }

  // Count water alerts
  let waterCount = 0;
  try {
    const WaterAlert = mongoose.models.WaterAlert;
    if (WaterAlert) {
      waterCount = await WaterAlert.countDocuments(filter);
    }
  } catch { waterCount = 0; }

  return NextResponse.json({
    suburb: suburb || "All areas",
    safety: { count: safetyCount, status: safetyCount === 0 ? "clear" : safetyCount < 3 ? "watch" : "active" },
    water: { count: waterCount, status: waterCount === 0 ? "clear" : "active" },
    power: { status: "check", note: "See /api/load-shedding for live stage" },
    updatedAt: new Date().toISOString(),
  });
}
```

---

## S3: My Water Reports — FILE 9

### FILE 9 — CREATE: `app/my-water-reports/page.tsx`

**Read:** `Structure/Design/features/stitch/my_water_reports/code.html`

Auth-required client component. Shows the current user's submitted water outage reports.

**What it does:**
- Redirects to `/sign-in` if not authenticated
- Fetches `GET /api/water-alerts` (filter by current user — the API already returns all, you filter by `reporterId === userId` on the client side)
- Shows a list of the user's reports with title, suburb, status (resolved/active), date submitted
- Empty state: "You haven't reported any outages yet." with a link to `/water-outages`
- "Mark as Resolved" button on each card: calls `PATCH /api/water-alerts/{id}/resolve`

**Note on PATCH endpoint:** Do NOT create a separate route file for this. For MVP, the "Mark as Resolved" button can call the DEV_1-owned water-alerts API only if DEV_1 adds a PATCH handler. Instead, for now, show the button but have it show a toast: "Contact the community to mark this resolved." — this avoids needing to create a new file.

Actually: just fetch the user's reports and display them. Skip the "Mark as Resolved" action for MVP. Keep it display-only.

---

## Done When

- [ ] `app/chat/page.tsx` — skin selector added, 3 skin components render when selected
- [ ] `components/chat/WhatsAppSkin.tsx` — functional WhatsApp-style chat
- [ ] `components/chat/DiscordSkin.tsx` — functional Discord-style chat
- [ ] `components/chat/InstagramSkin.tsx` — functional Instagram-style chat
- [ ] `app/utility-schedule/page.tsx` — shows schedule by suburb
- [ ] `app/api/utility-schedule/route.ts` — GET + POST
- [ ] `app/community-status/page.tsx` — 4-card status grid
- [ ] `app/api/community-status/route.ts` — aggregated GET
- [ ] `app/my-water-reports/page.tsx` — user's own reports list
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] No draft or stray files outside `app/`, `lib/`, `components/`

---

## Comms Log Entry (append to `Structure/Updates/comms-log.md`)

```
### YYYY-MM-DD | DEV_2 (Gemini) | M1+M5+S1+S3 COMPLETE

**Tasks:** M1, M5, S1, S3
**Summary:** [what you built — 3-4 sentences]
**Build:** Passes
**Blockers:** None / [describe any]
**Next:** Lead review
```
