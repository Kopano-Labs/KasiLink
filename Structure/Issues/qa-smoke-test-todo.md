# QA Smoke Test TODO

> **Author:** Codex
> **Created:** 2026-04-05 01:10
> **Updated:** 2026-04-05 01:10
> **Source:** `Structure/Updates/master-todo.md`
> **Purpose:** Track the production smoke test and mobile checks before wider sharing.
> **Implementation note:** This file mirrors the master TODO smoke-test matrix and is meant to be updated as each page is verified.
> **Status:** QA started

## TODO

| Route | Status | Timestamp | Notes |
|---|---|---|---|
| `/` (Home) | ⬜ Pending | — | Loads, stats, gig cards render |
| `/sign-in` | ⬜ Pending | — | Phone OTP flow works with `+27` |
| `/marketplace` | ⬜ Pending | — | Gigs list, filters, geo sorting |
| `/gigs/new` | ⬜ Pending | — | Auth-gated, form submits, gig appears in marketplace |
| `/chat` | ⬜ Pending | — | Conversations load, skin selector works |
| `/forum` | ⬜ Pending | — | Threads list, can create post |
| `/community-calendar` | ⬜ Pending | — | Events load |
| `/water-outages` | ⬜ Pending | — | Alerts display, load-shedding widget |
| `/incidents` | ⬜ Pending | — | List loads, can report new incidents |
| `/tutoring` | ⬜ Pending | — | Sessions list, create form |
| `/utility-schedule` | ⬜ Pending | — | Schedules grouped by day |
| `/spotlight` | ⬜ Pending | — | Business cards render |
| `/community-status` | ⬜ Pending | — | Dashboard aggregates data |
| `/my-water-reports` | ⬜ Pending | — | Auth-gated, personal reports |
| `/verified` | ⬜ Pending | — | Provider directory loads |
| `/profile` | ⬜ Pending | — | User data displays |
| `/privacy` | ⬜ Pending | — | Static content renders |

## Implementation

- [ ] Update each row to `🟢 Passed` or `🔴 Failed`
- [ ] Fill in the verification timestamp for each route
- [ ] Capture screenshots or console notes for any failing route
- [ ] Keep the file as a single source of truth for smoke-test progress

## Issues

- [ ] Note any route that 500s, 404s, renders empty, or misbehaves on mobile
- [ ] Note any auth gate failure on `/sign-in`, `/gigs/new`, `/chat`, or `/my-water-reports`
- [ ] Note any layout overflow at 375px viewport
- [ ] Note any missing data on dashboard, provider, or community pages

## Mobile Checks

- [ ] Navigation stays responsive at 375px width
- [ ] Cards do not overflow on small screens
- [ ] Bottom bar remains visible on mobile
- [ ] PWA install prompt appears

## Notes

- This checklist matches the current master TODO smoke-test matrix.
- Add any route-specific bugs or regressions here as they are found.
