# Next Improvements

> **Author:** Codex
> **Created:** 2026-04-05 01:45
> **Updated:** 2026-04-05 01:55
> **Source:** `Structure/Issues/qa-smoke-test-todo.md`
> **Purpose:** Compact audit of the next cleanup and product-improvement work after the smoke-test sweep.

## Audit

### [x] `/forum`
> Fixed the submit-handler indentation and tightened validation before posting.

- [x] Posts still submit
- [x] Validation now blocks short title/message input
- [ ] Add richer validation feedback styling

### [x] `/utility-schedule`
> Removed render-time `Date.now()` dependency from next-outage selection.

- [x] Time-sensitive value now updates from state
- [x] Grouped schedule cards still render
- [ ] Review if the minute tick should be page-specific or shared

### [x] `/community-status`
> Replaced static `waterAlerts: 0` with live water-alert counts.

- [x] Dashboard now reads live counts
- [x] Added a source label for the live feed

### [x] `/gigs/new`
> Extracted suburb-to-city inference into a helper.

- [x] Helper centralizes city mapping
- [x] Added clearer field-level validation feedback

### [x] `/marketplace`
> Added clearer empty-state guidance.

- [x] Empty state now tells users how to loosen filters
- [x] Kept filter density unchanged for now because the current UX still reads cleanly

### [ ] `/profile` and `/chat`
> Still open. These pages work, but the JSX is cramped and should be split later.

- [ ] Split list/detail concerns into smaller components
- [ ] Keep existing behavior intact
- [ ] Reduce maintenance risk without changing UX

## Completed Today

- Forum submit validation tightened.
- Utility schedule now derives next outage from stable state instead of render-time `Date.now()`.
- Community status now reads live water-alert counts and shows the source label.
- Gig posting now uses a shared city helper and clearer field-level validation feedback.
- Marketplace empty-state guidance is clearer.

## Still Open

- Split the profile and chat pages into smaller components later.
- Keep the overall behavior, but reduce maintenance risk where the JSX is still cramped.

## Notes

- This file is intentionally compact and reads like an audit log.
- Completed items stay checked so the team can see what changed.
- Open items stay unchecked until the follow-up work lands.
