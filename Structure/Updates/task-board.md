---
title: Task Board
created: 2026-04-04
updated: 2026-04-05
author: Lead
tags:
  - tasks
  - assignments
  - status
  - tracking
priority: critical
audience:
  - lead
  - devs
status: active
---

# Task Board

> Sprint tracker for KasiLink MVP. Lead updates this. Dev 2/3 reference their assignments here.
> Status: `DONE` | `IN-PROGRESS` | `NOT-STARTED` | `BLOCKED` | `DEFERRED`

**MVP Deadline:** End April 2026 | **Current Date:** 2026-04-04

---

## Critical (MVP Blockers)

| ID | Task | Owner | Status | Notes |
|----|------|-------|--------|-------|
| C1 | Clerk Auth (Phone OTP) | — | DONE | +27 phone-first, Clerk webhooks wired |
| C2 | MongoDB Connection & Models | — | DONE | 8 models: User, Gig, Application, Review, Notification, ForumPost, Conversation*, Message* |
| C3 | API Routes (Gig CRUD) | — | DONE | 11 routes live, filtering, geo, pagination |
| C4 | Home Feed Page | — | DONE | Nearby gigs, stats, trust signals |
| C5 | Marketplace Page | — | DONE | Browse, filter, suburb/city/radius, geo sorting |
| C6 | Gig Posting Flow | — | DONE | Full form at /gigs/new with validation |
| C7 | User Profile | — | DONE | Activity dashboard, applications, posted gigs |
| C8 | Navbar + Footer + Layout | — | DONE | Responsive nav, mobile bottom bar |
| C9 | Design System Tokens | — | DONE | Both themes in tailwind.config.ts |
| C10 | PWA Manifest + Service Worker | Lead | DONE | manifest.json complete, sw.js written, SW registration component added to layout |

*Conversation and Message models are 1-line stubs — see GAP-3, GAP-4

---

## High Priority (Core Experience)

| ID | Task | Owner | Status | Notes |
|----|------|-------|--------|-------|
| H1 | In-App Chat (Basic) | DEV_2 (Gemini) | DONE | Models, API, UI complete. Stray Structure/Updates/route.ts removed by Lead. |
| H2 | Community Forum | — | DONE | Live threads, pagination, posting, trust guidance |
| H3 | Load-Shedding Widget (Real Data) | DEV_1 (Codex) | DONE | Approved by Lead. Proxy route, widget, water-outages banner. |
| H4 | Gig Application Workflow | — | DONE | Apply, review, assign flow complete |
| H5 | Dark/Light Mode Toggle | — | DONE | ThemeProvider working |
| H6 | Location-Based Filtering (Geo) | — | DONE | Haversine + MongoDB geospatial |
| H7 | Verified Provider System | — | DONE | Directory, profiles, badges, live ratings |
| H8 | Notification Delivery | Lead (recovered) | DONE | DEV_2 overwrote notifications route with incidents code. Lead restored GET/PATCH/POST. |

---

## Medium (Differentiation) — Source: Structure/Design/

| ID | Task | Owner | Status | Design Mockup | Notes |
|----|------|-------|--------|---------------|-------|
| M1 | Chameleon Chat Skins (Premium) | DEV_1 + Lead | DONE | `Structure/Design/chat/stitch/` | DEV_1 built 3 skins + integrated into chat page. Lead built SkinSelector. |
| M2 | Community Calendar | DEV_1 (Codex) | DONE | `Structure/Design/features/stitch/community_calendar/` | Approved by Lead. |
| M3 | Water Outage Alert Details | DEV_1 (Codex) | DONE | `Structure/Design/features/stitch/water_outage_alert_details/` | Approved by Lead. Bundled with M2. |
| M4 | Incident Reporting | Lead (recovered) | DONE | — | DEV_2 failed. Lead created all files. |
| M5 | Utility Schedule Tracker | Lead | DONE | `Structure/Design/sub-features/stitch/stitch/utility_schedule/` | API + bento-style UI. 43 routes. |
| M6 | Tutoring Interface | Lead | DONE | `Structure/Design/tutoring/` | API, list, detail, create form. 42 routes. |
| M7 | Agent Orchestration (AI) | — | DEFERRED | `Structure/Design/backend-Framework/stitch/agent_orchestration_flow/` | Post-launch |

## Structure Features Not Yet in Task Board

| ID | Task | Owner | Status | Design Mockup | Notes |
|----|------|-------|--------|---------------|-------|
| S1 | Community Status Page | Lead | DONE | `Structure/Design/sub-features/stitch/stitch/community_status/` | DEV_2 removed. Lead will build. |
| S2 | Local Business Spotlight | DEV_1 (Codex) | DONE | `Structure/Design/features/stitch/local_business_spotlight/` | Approved by Lead. |
| S3 | My Water Reports | Lead | DONE | `Structure/Design/features/stitch/my_water_reports/` | DEV_2 removed. Lead will build. |
| S4 | Privacy Policy Page | Lead | DONE | `Structure/Design/features/stitch/privacy_policy_ubuntu_pulse/` | Built by Lead. `/privacy` live. |

---

## GAP (Discovered Issues — not in original Implementation.md)

| ID | Task | Owner | Status | Notes |
|----|------|-------|--------|-------|
| GAP-1 | Fix hardcoded geocoding | Lead | DONE | Suburb→coords lookup table added to /gigs/new/page.tsx, city auto-detected |
| GAP-2 | USSD route cleanup | — | DONE | Stale typo route at app/api/used/ removed |
| GAP-3 | Rebuild Conversation model | Dev 2 | NOT-STARTED | Currently 1-line stub in lib/models/Conversation.ts |
| GAP-4 | Rebuild Message model | Dev 2 | NOT-STARTED | Currently 1-line stub in lib/models/Message.ts |
| GAP-5 | Test suite | Lead | DEFERRED | tests/ empty, add after MVP stabilizes |
| GAP-6 | Logger implementation | Lead | DEFERRED | lib/logger.ts is empty |

---

## Assignment Summary

| Role | Assigned Tasks | File Scope |
|------|---------------|------------|
| **Lead (Claude Opus)** | Architecture, reviews, shared infra, M1, M5, M6, S1, S3, S4 | All shared infra + DEV_2's forfeited scope |
| **DEV_1 (Codex)** | H3, M2, M3, S2 — all DONE | Awaiting next assignment from Lead |
| **DEV_2 (Gemini)** | REMOVED from active dev | 3 consecutive assignment failures. Empty files, build breaks, false reports. |

## Workflow

[index.md](index.md) -> [technical-Specifications.md](../technical-Specifications.md) -> [master-todo.md](master-todo.md) -> [delegation-protocol.md](delegation-protocol.md) -> [current-alignment-notes.md](current-alignment-notes.md) -> [task-board.md](task-board.md) -> [comms-log.md](comms-log.md) -> [dev-tracker.md](dev-tracker.md) -> [next-improvements.md](next-improvements.md)
