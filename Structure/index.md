---
title: KasiLink Structure Map
created: 2026-04-05
updated: 2026-04-05
author: Codex
tags:
  - structure
  - navigation
  - mission
  - planning
  - design
  - information
  - issues
priority: critical
audience:
  - owner
  - lead
  - devs
  - reviewers
status: active
---

# KasiLink Structure Map

> Start here when you need to understand how the project is organized.
> This folder is the control plane for product intent, planning, reference material, and design evidence.

## Read Flow

`Structure/index.md` -> `Structure/technical-Specifications.md` -> `Structure/Updates/index.md` -> `Structure/Information/index.md` -> `Structure/Design/index.md` -> `Structure/Details/index.md` -> `Structure/Issues/index.md`

## Folder Map

- [technical-Specifications.md](technical-Specifications.md) - mission, product intent, and feature vision.
- [Updates/index.md](Updates/index.md) - active planning, coordination, billing, and execution control.
- [Information/index.md](Information/index.md) - source-backed facts, FAQs, services, and archive references.
- [Design/index.md](Design/index.md) - mockups, screenshots, and design references for implementation.
- [Details/index.md](Details/index.md) - supporting reference material and clarifications.
- [Issues/index.md](Issues/index.md) - smoke tests, QA issues, and follow-up tracking.
- [Obsidian/index.md](Obsidian/index.md) - second-brain vault layout and templates.

## Color Filters

- <span style="color:#dc2626">Critical</span> - blocks core product flow, launch, or trust.
- <span style="color:#ea580c">High</span> - important for the core experience and user adoption.
- <span style="color:#ca8a04">Medium</span> - differentiates the product or fills a major gap.
- <span style="color:#16a34a">Low</span> - polish, optional expansion, or post-launch work.

## Extra Filters

Use these tags when deciding where a file belongs:

- `Mission` - directly supports the product vision.
- `Execution` - active build or coordination work.
- `Reference` - factual material or source content.
- `Design` - mockups, visual specs, or UI direction.
- `QA` - tests, regressions, or verification notes.
- `Archive` - useful history that should stay readable but not drive current work.
- `Billing` - pricing, plans, plan gating, payment architecture.
- `Compliance` - POPIA, privacy, legal, or policy material.
- `Operations` - logging, monitoring, deployment, or system processes.
- `Obsidian` - local second-brain sync and note templates.
