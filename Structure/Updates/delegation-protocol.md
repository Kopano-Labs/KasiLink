---
title: Delegation Protocol
created: 2026-04-04
updated: 2026-04-05
author: Lead
tags:
  - delegation
  - workflow
  - rules
  - agents
  - communication
priority: critical
audience:
  - lead
  - devs
  - owner
status: active
---

# Delegation Protocol

> Rules of engagement for multi-agent development on KasiLink.
> All developers (human or AI) must read this before touching code.

---

## Roles

| Role      | Identity        | Responsibility                                                                          |
| --------- | --------------- | --------------------------------------------------------------------------------------- |
| **Owner** | Human (rkhol)   | Final authority. Reviews comms-log. Approves structural changes.                        |
| **Lead**  | Claude Opus 4.6 | Architecture, code review, shared infrastructure, delegation, all structural decisions. |
| **Dev 2** | Any AI agent    | Executes assigned feature slice. Scoped file access only.                               |
| **Dev 3** | Any AI agent    | Executes assigned feature slice. Scoped file access only.                               |

---

## Rules

### What Dev 2 / Dev 3 CAN do:

1. Edit files explicitly listed in their assignment scope
2. Create NEW files within their assigned directories only
3. Read any file in the codebase (read-only exploration is always allowed)
4. Add entries to `Structure/Updates/comms-log.md` (append only, newest first)
5. Run `npm run build` and `npm run dev` to verify their work

### What Dev 2 / Dev 3 CANNOT do:

1. Edit files outside their assigned scope
2. Touch shared infrastructure without Lead approval:
   - `lib/db.ts` — database connection
   - `lib/validation.ts` — shared validators
   - `lib/auth.config.ts` — auth configuration
   - `app/layout.tsx` — root layout
   - `middleware.ts` — route middleware
   - `tailwind.config.ts` — design tokens
   - `next.config.ts` — framework config
   - `package.json` — dependencies
   - Any file in `Structure/` (except comms-log append)
3. Delete existing files
4. Modify existing API route signatures (breaking changes)
5. Install new dependencies without Lead approval
6. Rewrite or edit past comms-log entries
7. Push to git or deploy without Owner approval

### What the Lead does:

1. Writes and updates task-board assignments
2. Reviews all code from Dev 2/Dev 3 before merge
3. Owns all shared infrastructure changes
4. Resolves conflicts between Dev 2 and Dev 3 scopes
5. Updates alignment-notes when routes or ownership changes
6. Reports to Owner via comms-log

---

## Task Assignment Format

When the Lead assigns work, it follows this template:

```
TASK: [ID from task-board] — [Short description]
SCOPE: [Exact file list — these are the ONLY files you can edit]
OBJECTIVE: [What the feature should do when complete]
CONSTRAINTS:
  - [Specific technical requirements]
  - [What NOT to do]
DONE-WHEN:
  - [Acceptance criteria 1]
  - [Acceptance criteria 2]
  - [npm run build passes]
REPORT: Add a comms-log entry when done
```

---

## Example Assignment: Dev 2 — Chat Backend

```
TASK: H1 + GAP-3 + GAP-4 — In-app messaging system
SCOPE:
  - lib/models/Conversation.ts (rebuild from stub)
  - lib/models/Message.ts (rebuild from stub)
  - app/api/chat/route.ts (create)
  - app/api/messages/route.ts (create)
  - app/chat/page.tsx (create)
OBJECTIVE: Gig participants can send messages within a conversation tied to a gig application.
CONSTRAINTS:
  - Use existing MongoDB connection from lib/db.ts (do not modify db.ts)
  - Use existing auth pattern from other API routes (auth() from @clerk/nextjs)
  - Follow existing validation pattern from lib/validation.ts
  - Do NOT create a real-time WebSocket layer yet — polling is fine for MVP
  - Messages must reference a Conversation, which references a Gig
DONE-WHEN:
  - Conversation model has: participants[], gigId, createdAt, lastMessageAt
  - Message model has: conversationId, senderId, content, createdAt, readAt
  - GET /api/chat returns user's conversations
  - POST /api/chat creates a conversation
  - GET /api/messages?conversationId=X returns messages
  - POST /api/messages sends a message
  - app/chat/page.tsx shows conversation list and message thread
  - npm run build passes
REPORT: Add a comms-log entry when done
```

---

## Onboarding a New Agent

When a new AI agent joins as Dev 2 or Dev 3, give them exactly 4 things:

1. **This file** (`delegation-protocol.md`) — so they know the rules
2. **Their assignment** (from task-board.md or direct instruction) — so they know their scope
3. **The file list** they're allowed to edit — explicit paths
4. **The comms-log format** — so they report correctly

They do NOT need:

- Full codebase context (they can read files as needed)
- The alignment-notes changelog history
- Access to other dev's assignments
- Knowledge of the full Implementation.md roadmap

---

## Conflict Resolution

If Dev 2 and Dev 3 need to edit the same file:

1. STOP. Do not edit.
2. Add a comms-log entry flagging the conflict.
3. Lead resolves by either: splitting the file, sequencing the edits, or taking the edit themselves.

---

## Communication

- **Status updates:** [comms-log.md](comms-log.md) (append only)
- **Task status:** [task-board.md](task-board.md) (Lead updates only)
- **Route rules:** [current-alignment-notes.md](current-alignment-notes.md) (Lead updates only)
- **Sprint plan:** [master-todo.md](master-todo.md) (reference only, do not modify)

## Workflow

[index.md](index.md) -> [technical-Specifications.md](../technical-Specifications.md) -> [master-todo.md](master-todo.md) -> [delegation-protocol.md](delegation-protocol.md) -> [current-alignment-notes.md](current-alignment-notes.md) -> [task-board.md](task-board.md) -> [comms-log.md](comms-log.md) -> [dev-tracker.md](dev-tracker.md) -> [next-improvements.md](next-improvements.md)

---

## Chain of Command — NON-NEGOTIABLE

```
Owner
  └── Lead (Claude Opus 4.6)
        ├── DEV_1 (Codex)
        └── DEV_2 (Gemini)
```

**DEV_1 and DEV_2 NEVER contact the Owner directly. Ever.**

- All instructions come from Lead via comms-log
- All questions go to Lead via comms-log
- All completion reports go to Lead via comms-log
- If a dev is unclear on scope: STOP, write a blocker in comms-log, wait for Lead
- Lead reads dev reports and writes directives back in comms-log
- Owner reads comms-log to monitor — Owner does NOT write instructions to devs

**If a dev contacts the Owner directly, that is a protocol violation.** The next assignment will be withheld until the violation is acknowledged in comms-log.

**Lead responsibility:** After every dev completion report, Lead MUST write a review + next directive in comms-log within the same session. Silence from Lead is a failure of command, not a dev problem.
