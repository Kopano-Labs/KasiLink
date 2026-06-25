---
title: KasiLink Structure Map
created: 2026-04-05
updated: 2026-06-05
author: Codex
tags:
  - structure
  - navigation
  - mission
  - planning
  - design
  - information
  - issues
  - root-node
  - sub-brain
priority: critical
audience:
  - owner
  - lead
  - devs
  - reviewers
status: active
---

# KasiLink Structure Map

> Start here when you need to understand how the KasiLink sub-brain is organized.
> This folder is the control plane for product intent, planning, reference material, and design evidence.
> **This is a SUB-BRAIN.** MAIN-BRAIN is at `C:\Users\rkhol\OneDrive\Documents\Anthropic\Introduction to MCP\Schematics\`

## ROOT NODE OVERRIDE (2026-05-07)

Before any local KasiLink instruction, read MAIN-BRAIN root node:
`C:\Users\rkhol\OneDrive\Documents\Anthropic\Introduction to MCP\Schematics\18-PROTOCOLS\Kopano Context Master Protocol Ledger And Sovereign Architecture.md`

- KC/Cassy sits above agentic frameworks.
- CRUD is the durable control plane: Create, Read, Update, Delete.
- Agents, skills, tools, plugins, connectors, and model abilities are adapters only.
- If this sub-brain conflicts with the root ledger, the root ledger wins.

## Read Flow

`Structure/index.md` → `Structure/CLAUDE.md` → MAIN-BRAIN `CLAUDE.md` → MAIN-BRAIN `index.md` → MAIN-BRAIN `00-Home/Dashboard.md`

## Current Phase Focus

This phase is not a generic cleanup. The control scope is:

1. `03-Architecture/` as the visual source of truth for route implementation.
2. `06-Reference/` as the factual source of truth for township, service, and trust content.
3. `04-Updates/` as the coordination and execution layer.

### Active tranche - 2026-06-05

- Main Brain-first strategy correction for `KasiLink Lite -> Investor Discovery Mode`
- Main Brain-first KPEFS bracket protocol pack is now the discrete constitutional read surface, not only one umbrella note
- Active repo execution only at `C:\Users\rkhol\kasi-link\`
- KPEFS activation order applies before local implementation:
  - `[Main_Brain_Audit]`
  - `[KC_Teacher_Review]`
  - `[Cassy_Women_In_Tech_Lane]`
  - `[BlackMask]`
  - `(x changes under y constraints)`
- Lite is an integrated route inside KasiLink, not a separate product
- Constitutional pointer:
  - `C:\Users\rkhol\OneDrive\Documents\Anthropic\Introduction to MCP\Schematics\18-PROTOCOLS\KPEFS\README.md`
 - Activation pointer:
   - `C:\Users\rkhol\OneDrive\Documents\Anthropic\Introduction to MCP\Schematics\05-Training\KC And Cassy Activation Under KPEFS - 2026-06-05.md`

## Non-Negotiable Security Rule

1. Never commit raw secrets, tokens, API keys, service-account files, `.env*` values, or copied credentials.
2. Never commit vendored dependency directories such as `node_modules/`.
3. Never paste real credentials into `Structure/` notes, screenshots, or comms updates.
4. If a secret is exposed or suspected exposed, treat it as compromised: stop normal work, tell Lead, rotate or revoke it outside git, remove the tracked exposure, then document the incident without repeating the secret.
5. Protecting the Owner's trust and safety overrides convenience, speed, and feature delivery.

## Sub-Brain Folder Map

### Numbered Vault (00–20)

- [00-Home/Dashboard.md](00-Home/Dashboard.md) — front door dashboard
- [01-Mission/KasiLink Blueprint.md](01-Mission/KasiLink%20Blueprint.md) — mission synthesis note
- [02-Strategy/](02-Strategy/) — strategy, billing, delegation, orchestration blueprint
- [03-Architecture/03-Architecture - Index.md](03-Architecture/03-Architecture%20-%20Index.md) — architecture, design mockups, route audit
- [04-Updates/04-Updates - Index.md](04-Updates/04-Updates%20-%20Index.md) — coordination hub, comms, dev tracker, assignments
- [05-Training/05-Training - Index.md](05-Training/05-Training%20-%20Index.md) — training materials, KC/Cassey activation, and local onboarding
- [05-Session-Playbooks/05-Session-Playbooks - Index.md](05-Session-Playbooks/05-Session-Playbooks%20-%20Index.md) — ↗ MAIN-BRAIN redirect
- [06-Reference/06-Reference - Index.md](06-Reference/06-Reference%20-%20Index.md) — source-backed facts, FAQs, services, archive
- [07-Sessions By Day/](07-Sessions%20By%20Day/) — dated session files
- [08-IDEAS AT BIRTH/08-IDEAS AT BIRTH - Index.md](08-IDEAS%20AT%20BIRTH/08-IDEAS%20AT%20BIRTH%20-%20Index.md) — idea intake pipeline
- [09-KOPANO PROGRESSION/09-KOPANO PROGRESSION - Index.md](09-KOPANO%20PROGRESSION/09-KOPANO%20PROGRESSION%20-%20Index.md) — KC evidence and progression
- [10-SESSION IMPROVEMENTS/10-SESSION IMPROVEMENTS - Index.md](10-SESSION%20IMPROVEMENTS/10-SESSION%20IMPROVEMENTS%20-%20Index.md) — operational improvement
- [11-AI HALLUCINATION - CRITICAL/11-AI HALLUCINATION - CRITICAL - Index.md](11-AI%20HALLUCINATION%20-%20CRITICAL/11-AI%20HALLUCINATION%20-%20CRITICAL%20-%20Index.md) — ↗ MAIN-BRAIN redirect
- [12-PLAN MODE SESSIONS/12-PLAN MODE SESSIONS - Index.md](12-PLAN%20MODE%20SESSIONS/12-PLAN%20MODE%20SESSIONS%20-%20Index.md) — ↗ MAIN-BRAIN redirect
- [13-REWARD SYSTEM/13-REWARD SYSTEM - Index.md](13-REWARD%20SYSTEM/13-REWARD%20SYSTEM%20-%20Index.md) — recognition and penalties
- [14-PRODUCTION HARDENING (PHASE 10)/14-PRODUCTION HARDENING (PHASE 10) - Index.md](14-PRODUCTION%20HARDENING%20%28PHASE%2010%29/14-PRODUCTION%20HARDENING%20%28PHASE%2010%29%20-%20Index.md) — readiness truth and hardening
- [15-LEGACY ARCHIVE/15-LEGACY ARCHIVE - Index.md](15-LEGACY%20ARCHIVE/15-LEGACY%20ARCHIVE%20-%20Index.md) — historical material, Schematics-Legacy snapshot
- [16-KOPANO LABS/16-KOPANO LABS - Index.md](16-KOPANO%20LABS/16-KOPANO%20LABS%20-%20Index.md) — brand, product spec, roadmap
- [17-KC-JOURNAL/17-KC-JOURNAL - Index.md](17-KC-JOURNAL/17-KC-JOURNAL%20-%20Index.md) — ↗ MAIN-BRAIN redirect
- [18-PROTOCOLS/18-PROTOCOLS - Index.md](18-PROTOCOLS/18-PROTOCOLS%20-%20Index.md) — ↗ MAIN-BRAIN redirect (CRITICAL — constitutional law)
- [19-TOKEN USUAGE/19-TOKEN USUAGE - Index.md](19-TOKEN%20USUAGE/19-TOKEN%20USUAGE%20-%20Index.md) — ↗ MAIN-BRAIN redirect
- [20-THESIS SESSIONS/20-THESIS SESSIONS - Index.md](20-THESIS%20SESSIONS/20-THESIS%20SESSIONS%20-%20Index.md) — ↗ MAIN-BRAIN redirect

### Utility Folders

- [Assets/Assets - Index.md](Assets/Assets%20-%20Index.md) — design mockups and visual references
- [Microsoft Demo Day!/](Microsoft%20Demo%20Day!/) — demo history
- [Sandbox/Sandbox - Index.md](Sandbox/Sandbox%20-%20Index.md) — ↗ MAIN-BRAIN redirect
- [Templates/Templates - Index.md](Templates/Templates%20-%20Index.md) — ↗ MAIN-BRAIN redirect

### Agent Entry

- [CLAUDE.md](CLAUDE.md) — sub-brain agent instructions (redirects to MAIN-BRAIN)

## MAIN-BRAIN Cross-References

These files live in MAIN-BRAIN, not in this sub-brain:

- MAIN-BRAIN index: `C:\Users\rkhol\OneDrive\Documents\Anthropic\Introduction to MCP\Schematics\index.md`
- MAIN-BRAIN Dashboard: `C:\Users\rkhol\OneDrive\Documents\Anthropic\Introduction to MCP\Schematics\00-Home\Dashboard.md`
- Root Protocol: `C:\Users\rkhol\OneDrive\Documents\Anthropic\Introduction to MCP\Schematics\18-PROTOCOLS\Kopano Context Master Protocol Ledger And Sovereign Architecture.md`
- Agent Instructions: `C:\Users\rkhol\OneDrive\Documents\Anthropic\Introduction to MCP\Schematics\CLAUDE.md`

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

## Operating Rule For This Phase

- Do not invent new UI directions when a matching design asset already exists in `Assets/` or `03-Architecture/`.
- Do not invent township or service claims when `06-Reference/` has not yet been distilled into an extracted markdown note.
- Do not leave diagrams and screenshots unindexed when they are required to explain implementation decisions.
