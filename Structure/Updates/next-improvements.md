# Next Improvements

> **Author:** Codex
> **Created:** 2026-04-05 01:45
> **Updated:** 2026-04-05 01:45
> **Source:** `Structure/Issues/qa-smoke-test-todo.md`
> **Purpose:** Track the next cleanup and product-improvement steps after the smoke-test sweep.

## Priority 1: `/forum`

- Fix the `handlePost` indentation and syntax area.
- Add better validation feedback before posting.
- Confirm the page still posts and paginates after cleanup.

## Priority 2: `/utility-schedule`

- Remove the render-time `Date.now()` dependency from `next` selection.
- Move time-sensitive calculations into effect state or memoized data.
- Confirm the grouped schedule cards still render correctly.

## Priority 3: `/community-status`

- Replace the hardcoded `waterAlerts: 0` with live data.
- Keep the dashboard summary aligned with the data source.

## Priority 4: `/gigs/new`

- Extract suburb/city mapping into a shared helper.
- Make the location logic easier to maintain.

## Priority 5: `/marketplace`

- Reduce filter complexity where possible.
- Add clearer empty-state messaging.

## Priority 6: Cramped Pages

- Split the profile and chat pages into smaller components later.
- Keep existing behavior, but reduce maintenance risk.

## Notes

- This list comes directly from the smoke-test route review.
- The order reflects the highest-value cleanup work first.
- Update this file as improvements are completed or reprioritized.

## Completed Today

- Forum submit validation tightened.
- Utility schedule now derives next outage from stable state instead of render-time `Date.now()`.
- Community status now reads live water-alert counts.
- Gig posting now uses a shared city helper instead of inline city inference logic.
- Marketplace empty-state guidance is clearer.

## Still Open

- Split the profile and chat pages into smaller components later.
- Keep the overall behavior, but reduce maintenance risk where the JSX is still cramped.
