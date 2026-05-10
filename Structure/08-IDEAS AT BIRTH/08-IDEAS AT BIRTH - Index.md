---
title: 08-IDEAS AT BIRTH — Active Idea Bank
created: 2026-04-11
updated: 2026-04-16
author: Lead (Claude Sonnet 4.6) + RobynAwesome
tags: [ideas, incubation, kasilink, all-agents]
status: ACTIVE — add ideas here the moment they appear
audience: ALL AGENTS + OWNER
---

# 08-IDEAS AT BIRTH

> Ideas live here the moment they are born — raw, unfiltered, timestamped.
> No idea leaves without Owner approval + implementation path.
> Every AI that works on KasiLink reads this before starting.

---

## How to Add an Idea

1. Add a row to the Active Ideas table immediately — don't wait
2. If it's big, create a separate file: `IDEA-[slug].md`
3. Tag it: `incubation` | `blocked` | `approved` | `killed`
4. Never delete — killed ideas stay with a kill reason

---

## Active Ideas — Session 2026-04-11

| # | Idea | Signal Source | Status | Owner |
|---|------|--------------|--------|-------|
| 001 | **Gig worker portfolio builder** — photos, ratings, job history replacing the CV | "CV required: 0" positioning on homepage | Incubation | Lead |
| 002 | **EskomSePush live integration** — real load-shedding schedule, not mock data | LoadSheddingWidget is wired, API key missing | Blocked (key) | Owner |
| 003 | **Offline-first USSD mode** — full gig browsing/posting without data | USSD route is live, no UI for data-off users | Incubation | Lead |
| 004 | **Community reputation layer** — trust scores visible in gig search results | Forum + verified system exist but aren't linked | Incubation | Lead |
| 005 | **School-leaver onboarding track** — first gig within 24 hrs, guided flow | "Youth without work: 57%" stat on homepage | Incubation | Lead |
| 006 | **KC as community moderation agent** — KC monitors forum for safety violations | KC Intern-Dev session — natural next evolution | Incubation | Lead |
| 007 | **Gig completion certificate** — PDF/image proof of work done, shareable | Township workers need portable reputation | Incubation | Lead |
| 008 | **Neighbourhood job board widget** — embeddable card for community WhatsApp groups | WhatsApp is the real SA communication layer | Incubation | Lead |
| 009 | **Micro-payment escrow** — hold payment in escrow until gig marked complete | Trust gap between poster and worker | Incubation | Lead |
| 010 | **Utility disruption rescheduler** — auto-suggest new gig time when load-shedding conflicts | LoadSheddingWidget + gig scheduling | ✅ SHIPPED 2026-04-16 — `components/UtilityRescheduler.tsx` live on `/gigs/new` | Lead |
| 011 | **Demo Day live leaderboard** — show real-time gig posts/applications during the pitch | April 15-17 Demo Day is 4 days away | ✅ SHIPPED 2026-04-16 — `app/demo/page.tsx` live at kasilink.com/demo | Lead |
| 012 | **KC monitoring dashboard** — Robyn sees what KC is doing in real time | KC Intern-Dev session born | Incubation | KC |
| 013 | **2nd Brain auto-update hook** — every AI session auto-appends learnings here | Ideas at Birth session — meta idea | Incubation | Lead |
| 014 | **Township weather + safety alerts** — combine utility + safety into one awareness panel | Community status page pattern | Incubation | Lead |
| 015 | **Verified provider QR code** — printable card for informal traders, scannable trust badge | Physical-digital bridge for township context | Incubation | Lead |
| 016 | **next/font pattern standard** — enforce self-hosted fonts across all Kopano Labs products (no Google Fonts @import) | 2026-04-12 perf migration — eliminate render-blocking + POPIA alignment | Approved — implemented in KasiLink | Lead |
| 017 | **SPA rewrite safety rule** — all Kopano Labs SPAs must exclude `/api/` from SPA rewrites in vercel.json | 2026-04-12 Portfolio CV bug root cause | Approved — implemented in Portfolio | Lead |
| 018 | **KC Journal** — KC writes its own session log in Schematics 17-KC-JOURNAL | Owner wanted KC to have its own voice and space | Approved — folder created 2026-04-12 | Owner |
| 019 | **App Store submission prep** — KasiLink needs 1024×1024 icon + 5 screenshots before App Store open | H12 appstore-metadata.md created | Incubation — Owner action for icon | Lead |

---

## Killed Ideas (with reasons)

| # | Idea | Kill Reason | Date |
|---|------|-------------|------|
| — | — | — | — |

---

## Approved → Shipped

| # | Idea | Shipped As | Date |
|---|------|------------|------|
| 010 | Utility disruption rescheduler | `components/UtilityRescheduler.tsx` + `/gigs/new` | 2026-04-16 |
| 011 | Demo Day live leaderboard | `app/demo/page.tsx` → kasilink.com/demo | 2026-04-16 |
| 016 | next/font pattern standard | All Kopano Labs products | 2026-04-12 |
| 017 | SPA rewrite safety rule | Portfolio vercel.json | 2026-04-12 |
| 018 | KC Journal | Schematics 17-KC-JOURNAL | 2026-04-12 |
