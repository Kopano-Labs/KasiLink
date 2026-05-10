---
title: 14-PRODUCTION HARDENING — Phase 10 Checklist
created: 2026-04-11
updated: 2026-04-11
author: Lead (Claude Sonnet 4.6)
tags: [production, hardening, phase10, demo-day, launch]
status: ACTIVE
audience: ALL AGENTS + OWNER
---

# 14-PRODUCTION HARDENING — Phase 10

> KasiLink passed Demo Day 2026-04-11. 🎉
> This folder tracks everything needed to go from "demo-ready" to "launch-ready".

---

## Demo Day Result — 2026-04-11

**STATUS: PASSED** ✅
**Next milestone:** Public launch — end April 2026

---

## Hardening Checklist

### Critical (must pass before public launch)

| # | Task | Status | Owner |
|---|------|--------|-------|
| H1 | Switch Clerk to production keys (`pk_live_` / `sk_live_`) | ✅ Done — already live | Owner |
| H2 | Add `KasiLinkAI_XAI_API_KEY` to Vercel env vars (Grok) | ✅ Done — pushed 2026-04-11 | Lead |
| H3 | Add Google OAuth redirect URI to Google Cloud Console | ⏳ Pending | Owner |
| H4 | MongoDB Atlas IP whitelist — add Vercel iad1 IPs or 0.0.0.0/0 | ⏳ Pending | Owner |
| H5 | Production smoke test — all 17 pages on kasilink.com | ⏳ Checklist in H5-smoke-test.md — run after deploy | Lead + Owner |
| H6 | Fix 3 TypeScript errors in test files (`RequestInit` type conflict) | ✅ Done — 2026-04-11 | Lead |
| H7 | Fix lint warning in terms page (unused SectionHeading import) | ✅ Done | Lead |

### High Priority

| # | Task | Status | Owner |
|---|------|--------|-------|
| H8 | EskomSePush API key — get from esp.info developer portal | ⏳ Blocked (Owner) | Owner |
| H9 | Real content seeding — 20+ SA-authentic gigs in MongoDB | ⏳ Pending | Lead |
| H10 | Vercel Analytics — enable in Vercel dashboard (zero config) | ⏳ Pending | Owner |
| H11 | UptimeRobot monitor on kasilink.com | ✅ /api/health endpoint live — Owner registers on uptimerobot.com (see H11-uptimerobot.md) | Lead |
| H12 | App Store metadata prep (icons, screenshots, description) | ✅ Draft complete — H12-appstore-metadata.md | Lead |

### Medium

| # | Task | Status | Owner |
|---|------|--------|-------|
| H13 | Lighthouse audit — all pages target 90+ performance | 🔄 Font optimized (next/font, no CLS) — run audit post-deploy | Lead |
| H14 | PWA install test on Android Chrome | ⏳ Pending | Owner |
| H15 | 3G simulation test (township network reality) | ⏳ Pending | Lead |
| H16 | Kopano Labs planning — next product phase | 🔄 Starting | Lead + Owner |

---

## What Changed at Demo Day

- Homepage: full bento grid UI/UX overhaul ✅
- All 10 dynamic pages: loading skeletons ✅
- Offline page: township-aware redesign ✅
- Schematics 2nd Brain: fully populated ✅
- KC Intern-Dev: activated, training folder live ✅
- Build: PASSING, lint: clean ✅

---

## Known Issues (post-Demo Day)

| Issue | Severity | Notes |
|-------|---------|-------|
| Test file TypeScript errors (3 files) | Low | Tests pass at runtime, TS strict mode disagrees on RequestInit type |
| LoadSheddingWidget shows mock data | Medium | Needs EskomSePush API key from Owner |
| Clerk in test mode | Critical | Must switch to prod keys before public launch |
