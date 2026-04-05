---
title: dev2-chat
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

# Dev 2 Assignment — H1: In-App Chat System

**Assigned by:** Lead (Claude Opus 4.6) | **Date:** 2026-04-04
**Task IDs:** H1, GAP-3, GAP-4
**Deadline:** Before MVP launch (end April 2026)

Read `Structure/Updates/delegation-protocol.md` before starting.

---

## Your Scope — ONLY These Files

You may ONLY edit or create:

```
lib/models/Conversation.ts        ← rebuild from stub
lib/models/Message.ts             ← rebuild from stub
app/api/chat/route.ts             ← create new
app/api/messages/route.ts         ← create new
app/chat/page.tsx                 ← create new
```

Do NOT touch anything else. If you need to import a shared util, import it — don't modify it.

---

## Context You Need

**Auth pattern** — every protected API route does this:
```typescript
import { auth } from "@clerk/nextjs/server";
const { userId } = await auth();
if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
```

**DB pattern** — every API route that hits the DB does this:
```typescript
import connectDB from "@/lib/db";
await connectDB();
```

**Validation** — `lib/validation.ts` already has `validateMessage` ready to use:
```typescript
import { validateMessage, sanitize } from "@/lib/validation";
// validateMessage checks: conversationId (string), text (string, max 1000 chars)
// sanitize() strips HTML + trims
```

**Existing models to reference** for pattern consistency:
- `lib/models/Application.ts` — how fields, indexes, and Mongoose model guard (`mongoose.models.X ?? mongoose.model(...)`) are done
- `lib/models/Notification.ts` — simple schema with userId (Clerk ID as string), timestamps

---

## Task 1 — Rebuild `lib/models/Conversation.ts`

The file currently has 1 line (stub). Replace entirely.

**Schema requirements:**
```typescript
interface IConversation {
  gigId: mongoose.Types.ObjectId;   // which gig this chat is about
  gigTitle: string;                  // denormalized for display
  participants: string[];            // array of Clerk user IDs (exactly 2: seeker + provider)
  lastMessageAt: Date;               // updated on every new message — for sort order
  lastMessageText: string;           // preview text, max 100 chars
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes required:**
- `{ participants: 1 }` — for fetching "my conversations"
- `{ gigId: 1, participants: 1 }` unique — one conversation per gig per pair
- Sort by `lastMessageAt: -1` will be common

**Model guard pattern** (same as every other model):
```typescript
const Conversation: Model<IConversation> =
  mongoose.models.Conversation ??
  mongoose.model<IConversation>("Conversation", ConversationSchema);
```

---

## Task 2 — Rebuild `lib/models/Message.ts`

**Schema requirements:**
```typescript
interface IMessage {
  conversationId: mongoose.Types.ObjectId;  // ref: "Conversation"
  senderId: string;                          // Clerk user ID
  senderName: string;                        // denormalized for display
  text: string;                              // sanitized content, max 1000 chars
  readAt?: Date;                             // null = unread
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes required:**
- `{ conversationId: 1, createdAt: 1 }` — for loading message thread oldest-first

---

## Task 3 — Create `app/api/chat/route.ts`

This route manages **conversations** (not messages).

### GET /api/chat
Returns the current user's conversations, sorted by most recent message first.

```
Response: { conversations: [{
  _id, gigId, gigTitle, participants, lastMessageAt, lastMessageText, createdAt
}] }
```

- Auth required
- Filter: `{ participants: userId }`
- Sort: `{ lastMessageAt: -1 }`
- Limit: 20
- Use `.lean()` for performance

### POST /api/chat
Creates a new conversation for a gig between seeker and provider.

```
Body: { gigId: string }
Response 201: { conversation: {...} }
```

- Auth required
- Load the Gig to get `providerId` and `gigTitle`. If gig not found → 404.
- Current user becomes the seeker (they're starting the chat)
- Participants: `[userId, gig.providerId]`
- If a conversation already exists for this gigId + these participants → return it (idempotent, 200)
- Create `Notification` for the other participant (type: `"message"`, link: `/chat`)
- Import Gig from `@/lib/models/Gig` and Notification from `@/lib/models/Notification`

---

## Task 4 — Create `app/api/messages/route.ts`

### GET /api/messages?conversationId=X
Returns all messages in a conversation, oldest first.

```
Response: { messages: [{
  _id, conversationId, senderId, senderName, text, readAt, createdAt
}] }
```

- Auth required
- Verify current user is a participant in the conversation — 403 if not
- Sort: `{ createdAt: 1 }` (oldest first = natural chat order)
- Limit: 100 messages
- Mark unread messages as read: `Message.updateMany({ conversationId, senderId: { $ne: userId }, readAt: null }, { readAt: new Date() })`

### POST /api/messages
Sends a message to a conversation.

```
Body: { conversationId: string, text: string }
Response 201: { message: {...} }
```

- Auth required
- Use `validateMessage(body)` from `@/lib/validation`
- Verify current user is a participant — 403 if not
- Sanitize text with `sanitize(body.text)` before saving
- Load current user from DB to get `senderName` (User model, find by `clerkId: userId`)
- After creating the message, update the Conversation: `{ lastMessageAt: new Date(), lastMessageText: text.slice(0, 100) }`
- Create a Notification for the OTHER participant (type: `"message"`, link: `/chat`)

---

## Task 5 — Create `app/chat/page.tsx`

**This is a client component** (`"use client"` at top).

**Layout — two panels (stack on mobile, side-by-side on desktop):**
1. **Left panel (or top on mobile):** Conversation list
2. **Right panel (or bottom on mobile):** Message thread for selected conversation

**Conversation list:**
- `useEffect` → `GET /api/chat` on mount
- Show: gigTitle, lastMessageText, lastMessageAt (formatted as "2h ago" or date)
- Click → sets `selectedConversationId` state
- Loading state while fetching

**Message thread:**
- When `selectedConversationId` changes → `GET /api/messages?conversationId=X`
- Show messages in order, current user's messages on the right, other's on the left
- Use `useUser()` from `@clerk/nextjs` to get current userId for alignment
- Input at the bottom: textarea + send button
- On send: `POST /api/messages` with `{ conversationId, text }`
- After successful send: add message to local state (optimistic update) + clear input
- Poll every 10 seconds for new messages (simple `setInterval` in useEffect)

**No-conversations empty state:**
- Message: "No conversations yet. Start a chat from a gig you've applied to."
- Link to `/marketplace`

**Use existing CSS classes** already in the project:
- `kasi-card`, `kasi-input`, `btn btn-primary`, `btn btn-sm`
- `container`, `max-w-screen-sm`, `text-on-surface-variant`

---

## Done When

- [ ] `lib/models/Conversation.ts` — full schema, indexes, model guard
- [ ] `lib/models/Message.ts` — full schema, indexes, model guard
- [ ] `GET /api/chat` — returns user's conversations
- [ ] `POST /api/chat` — creates/returns conversation for a gig (idempotent)
- [ ] `GET /api/messages?conversationId=X` — returns messages, marks as read
- [ ] `POST /api/messages` — sends message, updates conversation, creates notification
- [ ] `app/chat/page.tsx` — conversation list + message thread, polling, empty states
- [ ] `npm run build` passes with no TypeScript errors

---

## Report

When done, add an entry to `Structure/Updates/comms-log.md`:
```
### YYYY-MM-DD | Dev 2 | H1 COMPLETE

**Tasks:** H1, GAP-3, GAP-4
**Summary:** [what you built]
**Blockers:** [any issues]
**Next:** Lead review
```
