---
title: KasiLink Obsidian Vault Guide
created: 2026-04-05
updated: 2026-04-06
author: Codex
tags:
  - obsidian
  - vault
  - second-brain
  - structure
  - knowledge-base
priority: high
audience:
  - owner
  - lead
  - devs
status: active
---

# KasiLink Obsidian Vault Guide

> Use this note to mirror the repo into Obsidian as a second brain.

## Vault Goal

Keep the repo-backed knowledge base readable in Obsidian without duplicating content or losing the structure you already built in `Structure/`.

## Recommended Vault Layout

```text
KasiLink Vault/
├── 00-Inbox/
├── 01-Mission/
├── 02-Updates/
├── 03-Information/
├── 04-Design/
├── 05-Issues/
├── 06-Details/
├── 99-Archive/
└── Templates/
```

## Folder Mapping

- `00-Inbox/` - quick capture for new thoughts before sorting.
- `01-Mission/` - mirror `Structure/technical-Specifications.md`.
- `02-Updates/` - mirror the canonical planning and status docs.
- `03-Information/` - mirror source-backed facts and archive indexes.
- `04-Design/` - mirror design references and mockups.
- `05-Issues/` - mirror QA and smoke-test records.
- `06-Details/` - mirror clarifications and supporting context.
- `99-Archive/` - old notes that are still useful but no longer active.
- `Templates/` - note templates and daily note formats.

## Read Flow

`01-Mission` -> `02-Updates` -> `03-Information` -> `04-Design` -> `05-Issues` -> `06-Details`

## What to Link

- Link the mission note to the roadmap note.
- Link roadmap items to the relevant information and design notes.
- Link each issue note back to the feature or file it affects.
- Link billing notes to the payment architecture and product rules.

## Priority Mirror Notes

- Mirror resolved high-impact regressions into `05-Issues/` even after the code fix lands.
- Current example: `Structure/Issues/tailwind-v4-global-css-regression-2026-04-06.md`.
- Mirror canonical implementation rules from `Structure/Updates/current-alignment-notes.md` when they prevent repeat failures.

## Tags to Use

- `#mission`
- `#roadmap`
- `#billing`
- `#design`
- `#qa`
- `#source`
- `#archive`
- `#owner-action`
- `#lead-action`
- `#dev-action`

## Suggested Note Types

- Mission note
- Daily log
- Feature spec
- Issue tracker
- Decision note
- Source note
- Design reference
- Archive note

## Sync Rule

If a note matters to the repo, the repo copy is canonical. Obsidian should mirror it, not replace it.
