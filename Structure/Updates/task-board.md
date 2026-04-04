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
| H1 | In-App Chat (Basic) | Dev 2 | NOT-STARTED | Models are stubs. Need full Conversation + Message + UI |
| H2 | Community Forum | — | DONE | Live threads, pagination, posting, trust guidance |
| H3 | Load-Shedding Widget (Real Data) | Dev 3 | NOT-STARTED | Component exists, needs real API data source |
| H4 | Gig Application Workflow | — | DONE | Apply, review, assign flow complete |
| H5 | Dark/Light Mode Toggle | — | DONE | ThemeProvider working |
| H6 | Location-Based Filtering (Geo) | — | DONE | Haversine + MongoDB geospatial |
| H7 | Verified Provider System | — | DONE | Directory, profiles, badges, live ratings |
| H8 | Notification Delivery | Dev 3 | NOT-STARTED | Model + API exist, no push/browser notification delivery |

---

## Medium (Differentiation)

| ID | Task | Owner | Status | Notes |
|----|------|-------|--------|-------|
| M1 | Chameleon Chat Skins | — | DEFERRED | After H1 chat is built |
| M2 | Community Calendar | — | NOT-STARTED | Mockup in Structure/features/ |
| M3 | Water Outage Alerts | — | PARTIAL | Page exists, no real data |
| M4 | Incident Reporting | — | NOT-STARTED | Mockup in Structure/sub-features/ |
| M5 | Utility Schedule Tracker | — | NOT-STARTED | |
| M6 | Tutoring Interface | — | NOT-STARTED | Mockup in Structure/tutoring/ |
| M7 | Agent Orchestration (AI) | — | DEFERRED | Post-launch, AgentOrchestrationFlow.tsx is UI mockup only |

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
| **Lead** | C10, GAP-1, architecture reviews, code control | All shared infra + any unassigned files |
| **Dev 2** | H1, GAP-3, GAP-4 | `lib/models/Conversation.ts`, `lib/models/Message.ts`, `app/api/chat/route.ts`, `app/api/messages/route.ts`, `app/chat/page.tsx` |
| **Dev 3** | H3, H8 | `components/LoadSheddingWidget.tsx`, `app/api/notifications/route.ts`, `app/water-outages/page.tsx` |
