# Current Alignment Notes

> Canonical route ownership and file placement rules for KasiLink.
> **Lead Developer:** Claude Opus 4.6 | **Effective:** 2026-04-04

Related documents:
- `Structure/Updates/Implementation.md` — Sprint plan and priorities
- `Structure/Updates/task-board.md` — Current assignments and status
- `Structure/Updates/delegation-protocol.md` — Multi-agent rules of engagement
- `Structure/Updates/comms-log.md` — Status updates (replaces changelog)

---

## File Placement Rules

1. App UI belongs under `app/`.
2. Route handlers belong under `app/api/**/route.ts`.
3. Do NOT create `page.tsx` files inside `app/api/**`.
4. Do NOT create stray root-level special files like `/page.tsx` or `/route.ts`.
5. Do NOT place UI or route handlers under `lib/` or `lib/models/`.
6. Prefer extending existing aligned routes before creating new parallel ones.
7. Run `npm run build` after any structural edits.

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
| `/api/load-shedding` | `app/api/load-shedding/route.ts` | NOT CREATED — assigned to DEV_1 |
| `/api/incidents` | `app/api/incidents/route.ts` | NOT CREATED — assigned to DEV_2 |
| `/incidents` | `app/incidents/page.tsx` | NOT CREATED — assigned to DEV_2 |

---

## Moves Already Made (Do Not Undo)

- Notifications API moved from `app/api/users/[id]/` to `app/api/notifications/route.ts`
- Provider detail UI at `app/verified/[id]/page.tsx`, NOT under `app/api/users/[id]/`
- Water outage UI at `app/water-outages/page.tsx`, NOT at repo root
- `/jobs` is a compatibility redirect to `/marketplace` — not a second marketplace

## Files Intentionally Removed (Treat Reappearance as Regression)

`page.tsx`, `route.ts`, `app/api/gigs/page.tsx`, `app/api/users/[id]/page.tsx`, `lib/page.tsx`, `lib/route.ts`, `lib/models/page.tsx`, `lib/models/route.ts`

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
