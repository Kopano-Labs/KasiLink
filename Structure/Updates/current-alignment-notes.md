# Current Alignment Notes

Purpose:
- Preserve the current file and route decisions made during the deploy-stabilization and Structure-alignment passes.
- Prevent future AI edits from reintroducing misplaced `page.tsx` / `route.ts` files or conflicting route ownership.

Reference frame:
- `Structure/Updates/Implementation.md`
- `Structure/Updates/kasilink Struture.txt`

## Authorship

Primary alignment pass author:
- Codex / GPT-5

Signature:
- `Codex-Structure-Alignment-v1`

Use this signature in future update notes when extending the same alignment direction.

## Current rules

1. App UI belongs under `app/`.
2. Route handlers belong under `app/api/**/route.ts`.
3. Do not create `page.tsx` files inside `app/api/**`.
4. Do not create stray root-level special files like `/page.tsx` or `/route.ts`.
5. Do not place UI or route handlers under `lib/` or `lib/models/`.

## Canonical route ownership

### Marketplace and core app

- `/` → `app/page.tsx`
- `/marketplace` → `app/marketplace/page.tsx`
- `/jobs` → `app/jobs/page.tsx` and intentionally redirects to `/marketplace`
- `/gigs/new` → `app/gigs/new/page.tsx`
- `/gigs/[id]` → `app/gigs/[id]/page.tsx`
- `/profile` → `app/profile/page.tsx`
- `/sign-in` → `app/sign-in/page.tsx`

### Community and trust

- `/forum` → `app/forum/page.tsx`
- `/verified` → `app/verified/page.tsx`
- `/verified/[id]` → `app/verified/[id]/page.tsx`
- `/water-outages` → `app/water-outages/page.tsx`

### APIs

- `/api/gigs` → `app/api/gigs/route.ts`
- `/api/gigs/[id]` → `app/api/gigs/[id]/route.ts`
- `/api/applications` → `app/api/applications/route.ts`
- `/api/applications/[id]` → `app/api/applications/[id]/route.ts`
- `/api/users` → `app/api/users/route.ts`
- `/api/users/[id]` → `app/api/users/[id]/route.ts`
- `/api/reviews` → `app/api/reviews/route.ts`
- `/api/notifications` → `app/api/notifications/route.ts`
- `/api/ussd` → `app/api/ussd/route.ts`
- `/api/webhooks/clerk` → `app/api/webhooks/clerk/route.ts`

## Moves already made

These were deliberate and should not be undone:

- Notifications API logic was moved from `app/api/users/[id]/route.ts` semantics to `app/api/notifications/route.ts`.
- Provider detail UI belongs at `app/verified/[id]/page.tsx`, not under `app/api/users/[id]/page.tsx`.
- Water outage UI belongs at `app/water-outages/page.tsx`, not at repo root.
- Provider detail data endpoint belongs at `app/api/users/[id]/route.ts`.
- `/jobs` remains as a compatibility route and should redirect to `/marketplace` instead of becoming a second marketplace implementation.

## Files intentionally removed

These files were removed because they violated Next.js special-file conventions or the Structure layout:

- `page.tsx`
- `route.ts`
- `app/api/gigs/page.tsx`
- `app/api/users/[id]/page.tsx`
- `lib/page.tsx`
- `lib/route.ts`
- `lib/models/page.tsx`
- `lib/models/route.ts`

If any of these reappear, treat that as a regression unless there is a documented reason in `Structure/Updates`.

## UX alignment decisions

These UI directions were applied intentionally and should be preserved unless the Structure plan changes:

1. Home page should emphasize:
   - nearby gigs
   - utility awareness
   - trust and verified providers
   - community coordination

2. Marketplace page should emphasize:
   - proximity
   - category filtering
   - urgent work discovery
   - trust signals

3. Profile page should behave as an activity dashboard:
   - applications
   - posted gigs
   - quick actions
   - snapshot metrics

4. Navbar and footer should expose:
   - marketplace
   - community
   - verified providers
   - notifications
   - utility awareness

## Guidance for future AI edits

Before adding or moving files:

1. Check whether the target is UI, API, model, or utility code.
2. Place it in the canonical directory for that responsibility.
3. Verify the route does not already belong to a `route.ts` or `page.tsx` in the same segment.
4. Run `npm run build` after structural edits.

When adding features from the Structure roadmap:

- Prefer extending existing aligned routes before creating new parallel ones.
- Add notes here if a route or ownership decision changes.
- Do not leave "migration stub" files behind after moving logic.

## Change Log

### 2026-04-04

Author:
- Codex / GPT-5

Signature:
- `Codex-Structure-Alignment-v1`

Changes recorded:
- Removed misplaced special files that were causing route and build conflicts.
- Re-established canonical ownership for `api/users/[id]`, `api/notifications`, `verified/[id]`, and `water-outages`.
- Realigned home, marketplace, profile, navbar, footer, and utility surfaces toward the Structure roadmap.
- Preserved `/jobs` only as a redirect to `/marketplace` to avoid duplicate marketplace ownership.

### 2026-04-04 - High Priority Marketplace Pass

Author:
- Codex / GPT-5

Signature:
- `Codex-Structure-Alignment-v1`

Changes recorded:
- Upgraded `/api/gigs` to support `providerId`, `suburb`, `city`, and `radius` filtering.
- Added server-side distance calculation for marketplace results when coordinates are available.
- Fixed profile dependence on `providerId=me` by supporting that query on the gigs API.
- Upgraded marketplace filtering to expose suburb, city, and radius controls consistent with H6 `Location-Based Filtering (Geo)`.

### 2026-04-04 - USSD Redesign Pass

Author:
- Codex / GPT-5

Signature:
- `Codex-Structure-Alignment-v1`

Changes recorded:
- Rebuilt `/api/ussd` as a stateless Africa's Talking-compatible flow for Vercel/serverless use.
- Removed in-memory session dependence from the USSD route.
- Connected USSD gig lookup to real open gigs in MongoDB.
- Connected USSD application flow to real `Application`, `Gig`, `User`, and `Notification` records when the caller phone matches a registered KasiLink profile.
- Added verified-provider and my-applications USSD branches as higher-value flow extensions.
