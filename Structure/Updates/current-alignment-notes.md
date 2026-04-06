---
title: Current Alignment Notes
created: 2026-04-04
updated: 2026-04-06
author: Lead
tags:
  - alignment
  - file-ownership
  - routing
  - mission
  - structure
priority: critical
audience:
  - lead
  - devs
  - owner
status: active
---

# Current Alignment Notes

> Canonical mission alignment, file ownership, and structure rules for KasiLink.
> **Lead Developer:** Claude Opus 4.6 | **Effective:** 2026-04-04
> **Mission anchor:** [Structure/technical-Specifications.md](../technical-Specifications.md)

Related documents:
- [technical-Specifications.md](../technical-Specifications.md) — mission and product intent
- [../index.md](../index.md) — structure map for the whole repository
- [index.md](index.md) — single navigation layer for the Updates folder
- [master-todo.md](master-todo.md) — priority roadmap and step ownership
- [billing-plan.md](billing-plan.md) — billing and plan structure
- [task-board.md](task-board.md) — current assignments and status
- [delegation-protocol.md](delegation-protocol.md) — multi-agent rules of engagement
- [comms-log.md](comms-log.md) — status updates and Lead decisions
- [dev-tracker.md](dev-tracker.md) — dev-level progress ledger
- [next-improvements.md](next-improvements.md) — completed follow-ups and remaining structural work

---

## File Placement Rules

1. App UI belongs under `app/`.
2. Route handlers belong under `app/api/**/route.ts`.
3. Do NOT create `page.tsx` files inside `app/api/**`.
4. Do NOT create stray root-level special files like `/page.tsx` or `/route.ts`.
5. Do NOT place UI or route handlers under `lib/` or `lib/models/`.
6. Prefer extending existing aligned routes before creating new parallel ones.
7. Run `npm run build` after any structural edits.
8. If a file already exists in `Structure/Updates/`, treat it as coordination or planning only.

## Styling Alignment Rules

1. The only canonical global stylesheet is `app/globals.css`.
2. `app/layout.tsx` must import `./globals.css`, not `@/styles/globals.css`.
3. Tailwind CSS 4 entry syntax is `@import "tailwindcss";` only.
4. Theme tokens that must produce utilities belong in `app/globals.css` inside `@theme { ... }`.
5. Do not treat `tailwind.config.ts` as the source of truth for custom colors in Tailwind CSS 4.
6. Put Google Fonts `@import` rules before all other CSS rules.
7. Keep dark theme values as defaults and light theme values in `[data-theme="light"]` overrides unless the theme model is intentionally redesigned.

---

## Canonical Route Ownership

### Pages

| Route | File | Status |
|-------|------|--------|
| `/` | `app/page.tsx` | DONE |
| `/marketplace` | `app/marketplace/page.tsx` | DONE |
| `/jobs` | `app/jobs/page.tsx` | DONE (redirects to /marketplace) |
| `/gigs/new` | `app/gigs/new/page.tsx` | DONE |
| `/gigs/[id]` | `app/gigs/[id]/page.tsx` | DONE |
| `/profile` | `app/profile/page.tsx` | DONE |
| `/sign-in` | `app/sign-in/page.tsx` | DONE |
| `/forum` | `app/forum/page.tsx` | DONE |
| `/verified` | `app/verified/page.tsx` | DONE |
| `/verified/[id]` | `app/verified/[id]/page.tsx` | DONE |
| `/water-outages` | `app/water-outages/page.tsx` | DONE |
| `/chat` | `app/chat/page.tsx` | DONE |
| `/community-calendar` | `app/community-calendar/page.tsx` | DONE |
| `/spotlight` | `app/spotlight/page.tsx` | DONE |
| `/community-status` | `app/community-status/page.tsx` | DONE |
| `/my-water-reports` | `app/my-water-reports/page.tsx` | DONE |
| `/privacy` | `app/privacy/page.tsx` | DONE |
| `/terms` | `app/terms/page.tsx` | DONE |

### API Routes

| Route | File | Status |
|-------|------|--------|
| `/api/gigs` | `app/api/gigs/route.ts` | DONE |
| `/api/gigs/[id]` | `app/api/gigs/[id]/route.ts` | DONE |
| `/api/applications` | `app/api/applications/route.ts` | DONE |
| `/api/applications/[id]` | `app/api/applications/[id]/route.ts` | DONE |
| `/api/users` | `app/api/users/route.ts` | DONE |
| `/api/users/[id]` | `app/api/users/[id]/route.ts` | DONE |
| `/api/reviews` | `app/api/reviews/route.ts` | DONE |
| `/api/notifications` | `app/api/notifications/route.ts` | DONE |
| `/api/forum` | `app/api/forum/route.ts` | DONE |
| `/api/ussd` | `app/api/ussd/route.ts` | DONE |
| `/api/webhooks/clerk` | `app/api/webhooks/clerk/route.ts` | DONE |
| `/api/chat` | `app/api/chat/route.ts` | DONE |
| `/api/messages` | `app/api/messages/route.ts` | DONE |
| `/api/load-shedding` | `app/api/load-shedding/route.ts` | DEV_1 in progress |
| `/api/incidents` | `app/api/incidents/route.ts` | DONE |
| `/api/community-calendar` | `app/api/community-calendar/route.ts` | DONE |
| `/api/water-alerts` | `app/api/water-alerts/route.ts` | DONE |
| `/api/spotlight` | `app/api/spotlight/route.ts` | DONE |
| `/api/utility-schedule` | `app/api/utility-schedule/route.ts` | DONE |
| `/api/community-status` | `app/api/community-status/route.ts` | DONE |
| `/api/community-events` | `app/api/community-events/route.ts` | ALIASED / consolidated |
| `/api/business-spotlight` | `app/api/business-spotlight/route.ts` | ALIASED / consolidated |

### Pages

| Route | File | Status |
|-------|------|--------|
| `/incidents` | `app/incidents/page.tsx` | DEV_2 in progress |
| `/incidents/new` | `app/incidents/new/page.tsx` | DEV_2 in progress |
| `/community-calendar` | `app/community-calendar/page.tsx` | DONE |
| `/water-outages` | `app/water-outages/page.tsx` | DONE |
| `/spotlight` | `app/spotlight/page.tsx` | DONE |
| `/utility-schedule` | `app/utility-schedule/page.tsx` | DONE |
| `/community-status` | `app/community-status/page.tsx` | DONE |
| `/my-water-reports` | `app/my-water-reports/page.tsx` | DONE |

---

## Moves Already Made (Do Not Undo)

- Notifications API lives at `app/api/notifications/route.ts`
- Provider detail UI lives at `app/verified/[id]/page.tsx`, not under `app/api/users/[id]/`
- Water outage UI lives at `app/water-outages/page.tsx`, not at repo root
- `/jobs` is a compatibility redirect to `/marketplace`, not a second marketplace

## Files Intentionally Removed (Treat Reappearance as Regression)

`page.tsx`, `route.ts`, `app/api/gigs/page.tsx`, `app/api/users/[id]/page.tsx`, `lib/page.tsx`, `lib/route.ts`, `lib/models/page.tsx`, `lib/models/route.ts`, `app/api/notifications/page.tsx`, `Structure/Updates/route.ts`

**Pattern:** Any `page.tsx` inside `app/api/**` is always wrong. Any code file (`.ts`, `.tsx`) inside `Structure/` is always wrong.

---

## Mission Alignment

The technical specification says KasiLink is a township-first, mobile-first PWA for gigs, trust, community, and utility awareness. That means:

- Community and trust features are not optional extras.
- Mobile and low-data experience matter as much as marketplace functionality.
- The `Structure/Information/` archive should feed user-facing content and trust context.
- The updates layer exists to keep execution aligned, not to become the product itself.

When there is tension between speed and clarity, keep the mission clear and the file ownership strict.

---

## UX Alignment

1. **Home:** Nearby gigs, utility awareness, trust signals, community coordination
2. **Marketplace:** Proximity, category filtering, urgent work, trust signals
3. **Profile:** Activity dashboard — applications, posted gigs, quick actions, metrics
4. **Forum:** Live threads, trust guidance, verified-provider link, community safety
5. **Navbar/Footer:** Marketplace, community, verified providers, notifications, utility awareness

---

## Guidance for AI Editors

Before adding or moving files:
1. Check whether the target is UI, API, model, or utility code.
2. Place it in the canonical directory for that responsibility.
3. Verify the route does not already belong to a `route.ts` or `page.tsx` in the same segment.
4. Read `delegation-protocol.md` — if you are Dev 2/3, you may only edit files in your assigned scope.
5. Add status updates to `comms-log.md`, not to this file.

## Reading Flow

`../index.md` -> `technical-Specifications.md` -> `Updates/index.md` -> `master-todo.md` -> `billing-plan.md` -> `delegation-protocol.md` -> `current-alignment-notes.md` -> `task-board.md` -> `comms-log.md` -> `dev-tracker.md` -> `next-improvements.md` -> `reference-notes.md`
