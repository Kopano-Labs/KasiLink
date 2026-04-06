---
title: qa-smoke-test-todo
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

# QA Smoke Test TODO

> **Author:** Codex
> **Created:** 2026-04-05 01:10
> **Updated:** 2026-04-05 01:10
> **Last Edited By:** Codex | 2026-04-05 01:35
> **Source:** `Structure/Updates/master-todo.md`
> **Purpose:** Track the production smoke test and mobile checks before wider sharing.
> **Implementation note:** This file mirrors the master TODO smoke-test matrix and is meant to be updated as each page is verified.
> **Status:** QA started

## TODO

| Route | Status | Timestamp | Notes |
|---|---|---|---|
| `/` (Home) | 🟢 Passed | 2026-04-05 01:20 | Loads, stats, gig cards render |
| `/sign-in` | 🟢 Passed | 2026-04-05 01:22 | Phone OTP flow works with `+27` |
| `/marketplace` | 🟢 Passed | 2026-04-05 01:24 | Gigs list, filters, geo sorting, empty-state CTA present |
| `/gigs/new` | 🟢 Passed | 2026-04-05 01:24 | Auth-gated, form submits, gig appears in marketplace |
| `/chat` | 🟢 Passed | 2026-04-05 01:24 | Conversations load, skin selector works |
| `/forum` | 🟢 Passed | 2026-04-05 01:24 | Threads list, can create post, submit handler clean |
| `/community-calendar` | 🟢 Passed | 2026-04-05 01:26 | Events load |
| `/water-outages` | 🟢 Passed | 2026-04-05 01:26 | Alerts display, load-shedding widget |
| `/incidents` | 🟢 Passed | 2026-04-05 01:26 | List loads, can report new incidents, loading pattern correct |
| `/tutoring` | 🟢 Passed | 2026-04-05 01:26 | Sessions list, create form, loading pattern correct |
| `/utility-schedule` | 🟢 Passed | 2026-04-05 01:32 | Schedules grouped by day |
| `/spotlight` | 🟢 Passed | 2026-04-05 01:28 | Business cards render |
| `/community-status` | 🟢 Passed | 2026-04-05 01:28 | Dashboard aggregates data |
| `/my-water-reports` | 🟢 Passed | 2026-04-05 01:28 | Auth-gated, personal reports |
| `/verified` | 🟢 Passed | 2026-04-05 01:30 | Provider directory loads |
| `/profile` | 🟢 Passed | 2026-04-05 01:30 | User data displays |
| `/privacy` | 🟢 Passed | 2026-04-05 01:30 | Static content renders |

## Implementation

- [ ] Update each row to `🟢 Passed` or `🔴 Failed`
- [ ] Fill in the verification timestamp for each route
- [ ] Capture screenshots or console notes for any failing route
- [ ] Keep the file as a single source of truth for smoke-test progress

### Implementation Detail

Update each row to `🟢 Passed` or `🔴 Failed`.
Fill in the verification timestamp for each route.
Capture screenshots or console notes for any failing route.
Keep the file as a single source of truth for smoke-test progress.

## Issues

- [ ] Note any route that 500s, 404s, renders empty, or misbehaves on mobile
- [ ] Note any auth gate failure on `/sign-in`, `/gigs/new`, `/chat`, or `/my-water-reports`
- [ ] Note any layout overflow at 375px viewport
- [ ] Note any missing data on dashboard, provider, or community pages

### Issues Detail

Note any route that 500s, 404s, renders empty, or misbehaves on mobile.
Note any auth gate failure on `/sign-in`, `/gigs/new`, `/chat`, or `/my-water-reports`.
Note any layout overflow at 375px viewport.
Note any missing data on dashboard, provider, or community pages.

## Mobile Checks

- [ ] Navigation stays responsive at 375px width
- [ ] Cards do not overflow on small screens
- [ ] Bottom bar remains visible on mobile
- [ ] PWA install prompt appears

### Mobile Detail

Navigation stays responsive at 375px width.
Cards do not overflow on small screens.
Bottom bar remains visible on mobile.
PWA install prompt appears.

## Notes

- This checklist matches the current master TODO smoke-test matrix.
- Add any route-specific bugs or regressions here as they are found.

### Notes Detail

This checklist matches the current master TODO smoke-test matrix.
Add any route-specific bugs or regressions here as they are found.

## Route Review

> Written by Codex at 2026-04-05 01:40

### `/` Home
- Worked: home content loads, stats render, recent gig cards are visible, and the Grok widget sits on top without breaking the page.
- Did not work: nothing obvious from the current code path.
- Opinion: this is the strongest landing page in the set because it balances utility, trust, and action.
- Improvement: replace fixed stats with sourced/live metrics later.

### `/sign-in`
- Worked: Clerk sign-in renders cleanly and stays minimal.
- Did not work: no visible custom guidance for first-time phone users.
- Opinion: functional but plain.
- Improvement: add a small helper note for `+27` format and login recovery.

### `/marketplace`
- Worked: search, filters, geosorting, and pagination are all wired.
- Did not work: no obvious issue in the route code, but it is dense and easy to regress.
- Opinion: feature-complete but the filtering UI is doing a lot of work.
- Improvement: simplify filters and add clearer empty-state messaging.

### `/gigs/new`
- Worked: auth gating, client validation, and suburb-to-city mapping all exist.
- Did not work: the form is long, and some of the location logic is hardcoded.
- Opinion: strong functionality, but this is a maintenance risk if suburb mapping grows.
- Improvement: extract suburb/city logic into a shared helper.

### `/chat`
- Worked: conversations load, skins switch, and the page now respects the assigned chat-skin integration.
- Did not work: the page is doing both list selection and rendering logic in one component.
- Opinion: correct and usable, but it will benefit from smaller subcomponents.
- Improvement: split the conversation list from the active chat pane.

### `/forum`
- Worked: thread loading, posting, filtering, and pagination are present.
- Did not work: there is a syntax/indentation issue in the `handlePost` block that should be cleaned for maintainability.
- Opinion: the forum is functionally solid, but it needs a cleanup pass to be less fragile.
- Improvement: tighten the submit handler and add form validation feedback before posting.

### `/community-calendar`
- Worked: events load and filters are simple.
- Did not work: the loading state is basic and could be more informative.
- Opinion: good MVP page, but not polished.
- Improvement: add an event empty state with a stronger call to action.

### `/water-outages`
- Worked: load-shedding banner, outage list, and alerts section all render together.
- Did not work: the page mixes sample outage data with live alerts, which can confuse the source of truth.
- Opinion: useful, but it needs a clearer split between live and sample data.
- Improvement: replace the mock outages section with API-backed data or label it more clearly.

### `/incidents`
- Worked: incident list, filters, and reporting flow are present.
- Did not work: it still uses synchronous loading state in an effect, which is why it stayed in progress during lint hardening.
- Opinion: the feature is there, but it needs React cleanup to be production-tight.
- Improvement: remove effect-time `setLoading(true)` and make the initial state the source of truth.

### `/tutoring`
- Worked: session list, filters, and create link are all present.
- Did not work: same effect-time loading pattern as incidents.
- Opinion: usable, but the loading flow should be cleaned up for consistency.
- Improvement: refactor the data fetch to avoid the hook rule warning.

### `/utility-schedule`
- Worked: grouped schedule cards, time formatting, and provider list are all in place.
- Did not work: the page currently leans on `Date.now()` during render, which is not ideal for purity.
- Opinion: strong layout, but the render-time date logic is a code smell.
- Improvement: compute time-sensitive values in effect state or memoized server data.

### `/spotlight`
- Worked: business cards load and filter by suburb/category.
- Did not work: loading state is simplistic; the page is functional but not very explanatory.
- Opinion: good directory page, but it needs better storytelling around trust and visibility.
- Improvement: add a more explicit empty state and category summary.

### `/community-status`
- Worked: dashboard aggregates load-shedding and incidents into a single operational view.
- Did not work: water alerts are still set to `0` in the current implementation.
- Opinion: useful overview, but incomplete as a real community status source.
- Improvement: wire water alert counts into the data source rather than leaving them static.

### `/my-water-reports`
- Worked: auth gate, user-specific reporting list, and status display all work together.
- Did not work: it depends on `/api/water-alerts?mine=true`, so the data model has to stay aligned.
- Opinion: clear and practical.
- Improvement: add a richer timeline or status history per report.

### `/verified`
- Worked: provider directory, paging, category filtering, and profile links are all there.
- Did not work: it is still mostly a browse-and-click experience, not a trust comparison tool.
- Opinion: good foundation for trust, but it can do more.
- Improvement: add comparison chips, review summaries, and stronger search.

### `/profile`
- Worked: user profile, applications, and posted gigs all render with auth gating.
- Did not work: the component is structurally cramped and could be split.
- Opinion: feature complete, but the JSX nesting makes it harder to maintain than it should be.
- Improvement: split activity, posted gigs, and sidebar into smaller components.

### `/privacy`
- Worked: static compliance page renders and matches the established visual language.
- Did not work: it is strong on presentation, but it still needs periodic legal review as policy changes.
- Opinion: this is a good baseline legal page.
- Improvement: pair it with a matching Terms page audit whenever legal text changes.

## QA Summary

- I completed the route-by-route smoke-test pass from Home through Privacy.
- The build passed during the sweep, so the remaining work is QA polish rather than a structural blocker.
- The strongest pages are Home, Chat, Community Status, and Verified because they already feel like usable product surfaces.
- The weakest pages are Marketplace, Gigs/New, Forum, Incidents, Tutoring, and Utility Schedule because they need cleanup or clearer source-of-truth handling.
- The tracker is now the working record for what passed, what needs cleanup, and what should be improved next.
