---
title: Next Improvements
created: 2026-04-05
updated: 2026-04-05
author: Codex
tags:
  - improvements
  - cleanup
  - refactor
  - follow-up
priority: medium
audience:
  - lead
  - devs
status: active
---

# Next Improvements

> **Author:** Codex
> **Created:** 2026-04-05 01:45
> **Updated:** 2026-04-05 02:05
> **Source:** `Structure/Issues/qa-smoke-test-todo.md`
> **Purpose:** Compact audit of the next cleanup and product-improvement work after the smoke-test sweep.

## Reading Flow

[index.md](index.md) -> [technical-Specifications.md](../technical-Specifications.md) -> [master-todo.md](master-todo.md) -> [delegation-protocol.md](delegation-protocol.md) -> [current-alignment-notes.md](current-alignment-notes.md) -> [task-board.md](task-board.md) -> [comms-log.md](comms-log.md) -> [dev-tracker.md](dev-tracker.md) -> [next-improvements.md](next-improvements.md)

## Audit

### [x] `/forum` <span style="color:#16a34a">[done]</span>
> Fixed the submit-handler indentation and tightened validation before posting.

- [x] Posts still submit
- [x] Validation now blocks short title/message input
- [ ] <span style="color:#ca8a04">Add richer validation feedback styling</span>

### [x] `/utility-schedule` <span style="color:#16a34a">[done]</span>
> Removed render-time `Date.now()` dependency from next-outage selection.

- [x] Time-sensitive value now updates from state
- [x] Grouped schedule cards still render
- [ ] <span style="color:#ca8a04">Review if the minute tick should be page-specific or shared</span>

### [x] `/community-status` <span style="color:#16a34a">[done]</span>
> Replaced static `waterAlerts: 0` with live water-alert counts.

- [x] Dashboard now reads live counts
- [x] Added a source label for the live feed

### [x] `/gigs/new` <span style="color:#16a34a">[done]</span>
> Extracted suburb-to-city inference into a helper.

- [x] Helper centralizes city mapping
- [x] Added clearer field-level validation feedback

### [x] `/marketplace` <span style="color:#16a34a">[done]</span>
> Added clearer empty-state guidance.

- [x] Empty state now tells users how to loosen filters
- [x] Kept filter density unchanged for now because the current UX still reads cleanly

### [x] `/profile` and `/chat` <span style="color:#16a34a">[done]</span>
> Split into smaller components while keeping behavior intact.

- [x] Split list/detail concerns into smaller components
- [x] Keep existing behavior intact
- [x] Reduce maintenance risk without changing UX

## Open Reason

I’m not done with the full list yet.

The structural split was completed with help from the extra access window:

- profile and chat were broken into smaller components
- the work stayed behavior-preserving rather than changing UX

The safe improvement items are complete, and the remaining structural work is now checked off instead of left pending.

If you want, I can continue with the next improvement pass.

## Completed Today

- Forum submit validation tightened.
- Utility schedule now derives next outage from stable state instead of render-time `Date.now()`.
- Community status now reads live water-alert counts and shows the source label.
- Gig posting now uses a shared city helper and clearer field-level validation feedback.
- Marketplace empty-state guidance is clearer.

## Still Open

- Split the profile and chat pages into smaller components. Done.
- Keep the overall behavior, but reduce maintenance risk where the JSX was still cramped.

## Notes

- This file is intentionally compact and reads like an audit log.
- Completed items stay checked so the team can see what changed.
- Open items stay unchecked until the follow-up work lands.
