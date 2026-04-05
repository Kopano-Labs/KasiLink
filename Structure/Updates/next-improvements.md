# Next Improvements

> **Author:** Codex
> **Created:** 2026-04-05 01:45
> **Updated:** 2026-04-05 01:50
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
- [ ] Add a source label for the water-alert count

### [x] `/gigs/new`
> Extracted suburb-to-city inference into a helper.

- [x] Helper centralizes city mapping
- [ ] Move the suburb list into a shared constant if it grows

### [x] `/marketplace`
> Added clearer empty-state guidance.

- [x] Empty state now tells users how to loosen filters
- [ ] Reduce filter density if the UI starts feeling crowded

### [ ] `/profile` and `/chat`
> Still open. These pages work, but the JSX is cramped and should be split later.

- [ ] Split list/detail concerns into smaller components
- [ ] Keep existing behavior intact
- [ ] Reduce maintenance risk without changing UX

## Notes

- This file is intentionally compact and reads like an audit log.
- Completed items stay checked so the team can see what changed.
- Open items stay unchecked until the follow-up work lands.
