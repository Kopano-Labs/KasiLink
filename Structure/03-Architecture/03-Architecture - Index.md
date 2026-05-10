---
title: KasiLink Design Library
created: 2026-04-05
updated: 2026-04-11
author: Codex
tags:
  - design
  - ui
  - themes
  - mockups
  - motion
priority: high
audience:
  - lead
  - devs
  - owner
status: active
---

# KasiLink Design Library

> Visual references, interaction concepts, and implementation guides for the UI layer.
> Use this folder when you need to build or refine screens, components, motion, or theme direction.

## What Lives Here

- Theme systems for dark/light modes.
- Feature-specific mockups.
- Chat skin concepts.
- Backend and orchestration diagrams.
- Supporting design notes and explanation files.

## April 11 Audit

- Strength: the folder contains real implementation-grade assets, not vague moodboards.
- Strength: core product surfaces already have matching stitch references in both light and dark directions.
- Gap: there is no single route inventory that says which screen file governs which app route.
- Gap: the folder mixes source-of-truth screens with exploratory explanations, but the priority level of each file is not made explicit.
- Gap: implementation status is not tracked per reference, which makes it too easy to claim alignment without verifying the live route.

## Best Fit

- `app/*` pages that need to match a mockup.
- `components/*` UI that should follow a specific design language.
- `tailwind.config.ts` and theme decisions.
- New features that need to stay visually aligned with the KasiLink direction.

## File Map

- `backend-Framework/` - orchestration and backend flow diagrams.
- `chat/` - chat skin design references.
- `dark-Mode/` - dark theme mockups.
- `features/` - feature screens like calendar, spotlight, water, privacy, verified provider views.
- `light-Mode/` - Ubuntu Pulse light theme mockups.
- `sub-features/` - supporting utility and status screens.
- `tutoring/` - tutoring design references.
- `explation-of-designs/` - explanation pages and design rationale.

## Priority Screen Map

- [route-audit-matrix.md](route-audit-matrix.md) - current route-to-design audit status for the active phase.
- `light-Mode/stitch/kasilink_home_feed_ubuntu_pulse/` - primary public homepage reference.
- `light-Mode/stitch/kasilink_marketplace_ubuntu_pulse/` - primary `/marketplace` reference.
- `light-Mode/stitch/kasilink_forum_ubuntu_pulse/` - primary `/forum` reference.
- `features/stitch/verified_provider_search_results/` - primary `/verified` reference.
- `features/stitch/water_outage_alert_details/` - primary `/water-outages` reference.
- `sub-features/stitch/stitch/community_status/` - primary `/community-status` reference.
- `sub-features/stitch/stitch/utility_schedule/` - primary `/utility-schedule` reference.
- `features/stitch/community_calendar/` - primary `/community-calendar` reference.
- `features/stitch/local_business_spotlight/` - primary `/spotlight` reference.
- `tutoring/` - primary `/tutoring` reference.

## Execution Rule

For route work in this phase:

1. Find the matching stitch asset first.
2. Confirm whether the live route already matches it, partially matches it, or diverges.
3. Record the gap in the current execution note before claiming the route is complete.

## Color Filters

- <span style="color:#dc2626">Critical</span> - core UI evidence that affects a launch-blocking screen.
- <span style="color:#ea580c">High</span> - important screen reference for shipped product areas.
- <span style="color:#ca8a04">Medium</span> - differentiator or future feature reference.
- <span style="color:#16a34a">Low</span> - design polish, variations, or supporting system notes.

## Extra Filters

- `Theme` - light/dark/Ubuntu Pulse references.
- `Motion` - animation and interaction direction.
- `Component` - reusable UI pieces.
- `Flow` - step-by-step user journeys.
- `Architecture` - backend or orchestration diagrams.
- `Archive` - saved design evidence or explanatory notes.
