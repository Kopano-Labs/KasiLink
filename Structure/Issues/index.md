---
title: KasiLink Issues
created: 2026-04-05
updated: 2026-04-06
author: Codex
tags:
  - issues
  - qa
  - bugs
  - regressions
  - smoke-test
priority: high
audience:
  - lead
  - devs
  - owner
status: active
---

# KasiLink Issues

> QA, smoke-test notes, bug tracking, and follow-up planning for the project.

## What Lives Here

- Smoke-test trackers.
- Route-by-route verification notes.
- Known issues and regressions.
- Follow-up action lists that should be fixed later.

## Best Fit

- Anything that describes a problem, regression, or missing verification.
- Any page or flow that needs a pass/fail record.

## Color Filters

- <span style="color:#dc2626">Critical</span> - broken route, build failure, data loss, or security issue.
- <span style="color:#ea580c">High</span> - major UX failure or auth/data issue.
- <span style="color:#ca8a04">Medium</span> - usability, clarity, or consistency issue.
- <span style="color:#16a34a">Low</span> - polish issue or small improvement.

## Extra Filters

- `QA` - test result or verification note.
- `Bug` - concrete defect.
- `Regression` - something that used to work and no longer does.
- `Mobile` - 375px or Android-specific issue.
- `Auth` - sign-in or protected route issue.
- `Data` - missing or stale information.
- `Layout` - overflow, spacing, or responsive breakage.

## Current Notes

- [tailwind-v4-global-css-regression-2026-04-06.md](tailwind-v4-global-css-regression-2026-04-06.md) - resolved root cause audit for the unstyled app and Tailwind CSS 4 token migration.
