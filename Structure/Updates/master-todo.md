---
title: KasiLink Master TODO
created: 2026-04-04
updated: 2026-04-05
author: Lead
tags:
  - roadmap
  - priorities
  - milestones
  - launch
  - planning
  - assignments
priority: critical
audience:
  - lead
  - devs
  - owner
status: active
---

# KasiLink Master TODO — Next 10 Steps

> **Created:** 2026-04-04 14:30 | **Last updated:** 2026-04-05 | **Author:** Lead
> **Status:** Build fixed after Grok AI integration. Entering Hardening + Launch Prep phase.
> **Live:** kasilink.com (Vercel) | **Build:** 42 routes, PASSING | **Branch:** main

---

## STEP STATUS TRACKER (2026-04-05)

| Step | Description | Status | Owner |
|------|-------------|--------|-------|
| 1 | Vercel Env & Domain Hardening | ✅ DONE — MongoDB fixed, Vercel redeployed | Lead + Owner |
| 2 | Production Smoke Test | ⏳ PENDING — after current build deploys | Lead + Owner |
| 3 | Content Seeding | ✅ DONE — 10 gigs, 5 forum posts, 3 events, 2 alerts seeded | Lead |
| 4 | Information Archive Integration | ✅ DONE — faq-gigs, faq-water, faq-safety, service-directory created by DEV_1 | DEV_1 |
| 5 | POPIA Compliance & Terms Page | ✅ DONE — /terms live and footer linked | DEV_1 |
| 6 | Mobile Optimization & PWA Polish | 🔄 IN PROGRESS | Lead + DEV_1 |
| 6b | Grok AI Integration | ✅ DONE — xAI Grok-4 chat widget live on homepage | Lead |
| 7 | Orch System Foundation | 🔄 IN PROGRESS — Blueprint written (orch-blueprint.md) | Lead |
| 8 | App Store Preparation | ⏳ PENDING | Lead + Owner |
| 9 | Analytics & Monitoring | 🔄 IN PROGRESS — logger queued | Lead + DEV_1 |
| 10 | Test Suite & CI/CD | ⏳ PENDING | Lead + DEV_1 |

**BLOCKING OWNER ACTIONS:**
- [ ] Add `KasiLinkAI_XAI_API_KEY` to Vercel env vars (Grok won't work in prod without it)
- [ ] Switch Clerk to production keys (pk_live_ / sk_live_)
- [ ] Add Google OAuth redirect URI to Google Cloud Console

---

## Where We Are Right Now (2026-04-05 update)

**Phase 1 (Foundation) — DONE.** Auth, DB, models, nav, design tokens, PWA.
**Phase 2 (Core Marketplace) — DONE.** Gig CRUD, posting, marketplace, home feed, profiles.
**Phase 3 (Engagement) — DONE.** Chat, forum, load-shedding, applications, themes, geo, verified providers, notifications.
**Phase 4 (Community + Differentiation) — DONE.** Calendar, water alerts, incidents, utility schedule, tutoring, business spotlight, chat skins, community status, water reports, privacy policy.
**Phase 5 (Deployment) — DONE.** Vercel live, 42 routes, production build passing.
**Phase 6 (AI Integration) — DONE.** Grok AI chat widget (xAI Grok-4) live on homepage.

**What's NOT done:** Clerk prod keys, KasiLinkAI_XAI_API_KEY in Vercel, test suite, app store prep, real user testing, full mobile audit, orch system.

---

---

## The Next 10 Steps (In Priority Order)

---

### STEP 1: Vercel Environment & Domain Hardening
**Priority:** CRITICAL — App may crash in production without correct env vars
**Owner:** Lead + Owner (collaborative)
**Timeline:** Immediate

**What:**
- Verify all env vars are set in Vercel project settings:
  - `CLERK_SECRET_KEY` (sk_live_...)
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (pk_live_...)
  - `CLERK_WEBHOOK_SECRET`
  - `MONGODB_URI` (Atlas connection string)
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-in`
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/`
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/`
- Verify kasilink.com DNS resolution (A record → 76.76.21.21)
- Test auth flow on production URL (not just localhost)
- Test MongoDB connection from Vercel's iad1 region (whitelist 0.0.0.0/0 on Atlas or add Vercel IPs)

**Why this matters:**
The app is LIVE but we haven't verified the production environment works end-to-end. A user hitting kasilink.com right now might see auth errors or empty data if env vars aren't set.

**Role Breakdown:**
| Role | Responsibility |
|------|---------------|
| **Lead** | Check Vercel dashboard for env vars, test API routes on prod URL, verify DNS |
| **Owner** | Provide any missing API keys, verify domain registrar DNS settings, test on phone |
| **DEV_1** | Stand by — no code changes needed |

**Done when:** Auth works on kasilink.com, gigs load from MongoDB, no console errors.

---

### STEP 2: Production Smoke Test (Manual QA)
**Priority:** CRITICAL — Must verify before sharing with anyone
**Owner:** Lead + Owner
**Timeline:** Same day as Step 1

**What:**
Test every page on kasilink.com systematically:

| Page | Test |
|------|------|
| `/` (Home) | Loads, shows stats, gig cards render |
| `/sign-in` | Phone OTP flow works with +27 |
| `/marketplace` | Gigs list, filters work, geo sorting |
| `/gigs/new` | Auth-gated, form submits, gig appears in marketplace |
| `/chat` | Conversations load, skin selector works |
| `/forum` | Threads list, can create post |
| `/community-calendar` | Events load |
| `/water-outages` | Alerts display, load-shedding widget |
| `/incidents` | List loads, can report new |
| `/tutoring` | Sessions list, create form |
| `/utility-schedule` | Schedules grouped by day |
| `/spotlight` | Business cards render |
| `/community-status` | Dashboard aggregates data |
| `/my-water-reports` | Auth-gated, personal reports |
| `/verified` | Provider directory loads |
| `/profile` | User data displays |
| `/privacy` | Static content renders |

**Mobile test (375px viewport):**
- Navigation responsive
- Cards don't overflow
- Bottom bar visible
- PWA install prompt appears

**Role Breakdown:**
| Role | Responsibility |
|------|---------------|
| **Lead** | Automated page-by-page check, report broken pages |
| **Owner** | Real device testing (phone), UX feedback |
| **DEV_1** | Fix any UI bugs found during QA |

**Done when:** All 17 pages load without errors, mobile viewport clean.

---

### STEP 3: Content Seeding (Real Data)
**Priority:** HIGH — Empty marketplace = no value proposition
**Owner:** Lead + DEV_1
**Timeline:** 1-2 days after Step 2

**What:**
Seed the database with realistic South African gig data:
- 20-30 sample gigs across 5 sectors (Retail, Construction, Healthcare, Logistics, Services)
- 5-10 verified provider profiles
- 3-5 community forum threads (load-shedding tips, safety, job hunting advice)
- 2-3 community calendar events
- Sample water alerts for Joburg/Soweto/Alexandra areas
- 5 tutoring sessions (Maths, Science, English, Business Studies, Life Sciences)

**Source material:** Use the Information directory PDFs for factual SA context — government programs, economic data, youth skills initiatives.

**Create a seed script:** `scripts/seed.ts` that can be run to populate MongoDB.

**Role Breakdown:**
| Role | Responsibility |
|------|---------------|
| **Lead** | Write seed script, create realistic gig data with SA suburbs/wages |
| **DEV_1** | Create forum thread content, community calendar events |
| **Owner** | Review seeded content for authenticity — does this look like a real township marketplace? |

**Done when:** Home feed shows real-looking gigs, marketplace has 20+ listings, forum has conversations.

---

### STEP 4: Information Archive Integration
**Priority:** HIGH — Owner has provided real SA government data for the platform
**Owner:** Lead
**Timeline:** Alongside Step 3

**What:**
The Owner has added 15 PDFs to `Structure/Information/`:
- **About Government (4 PDFs):** Public Works programs, Social Cluster reports — directly relevant to employment programs KasiLink connects to
- **Blogs (11 PDFs):** Presidential/government blogs on economic recovery, youth skills, Eskom progress, transport, hunger, women's issues, budget — real content for the community information sections

**Actions:**
1. Create `Structure/Information/archive-index.md` — catalog every PDF with summary, relevance to KasiLink, and which features should reference it
2. Populate the empty directories:
   - `About SA/` — Extract key SA statistics for the app (unemployment rates, youth stats, township demographics)
   - `FAQ/` — Draft common user questions based on the platform features
   - `Issues/` — Document known community issues KasiLink addresses
   - `Service/` — Catalog government services referenced in the PDFs
3. Create an `/about` or `/resources` page that surfaces this information to users — truth and transparency as platform values

**Role Breakdown:**
| Role | Responsibility |
|------|---------------|
| **Lead** | Create archive index, extract data from PDFs, create resources API |
| **DEV_1** | Build resources/about page UI if assigned |
| **Owner** | Verify accuracy of extracted information — zero tolerance for fabrication |

**Done when:** Archive index complete, empty directories populated, information accessible in-app.

---

### STEP 5: POPIA Compliance & Legal Review
**Priority:** HIGH — Legal requirement for SA apps handling personal data
**Owner:** Lead + Owner
**Timeline:** Before any public launch

**What:**
- Review Privacy Policy page (`/privacy`) against POPIA requirements:
  - Data collection disclosure (what we collect: phone, location, gig data)
  - Purpose limitation (only used for gig matching, safety, community features)
  - Data subject rights (access, correction, deletion)
  - Information Officer details
  - Cross-border data transfer disclosure (MongoDB Atlas may store data outside SA)
  - Retention periods
- Create Terms of Service page (`/terms`) - DONE
- Add cookie consent banner (if using analytics)
- Verify Clerk's POPIA compliance for auth data
- Ensure MongoDB Atlas has SA-region backup option

**Role Breakdown:**
| Role | Responsibility |
|------|---------------|
| **Lead** | Draft Terms of Service, audit privacy page completeness, add consent mechanisms |
| **Owner** | Legal review — consult with attorney if needed, verify Information Officer details |
| **DEV_1** | Implement cookie consent banner component if needed |

**Done when:** Privacy policy covers all POPIA requirements, ToS page live, consent mechanisms in place.

---

### STEP 6: Mobile Optimization & PWA Polish
**Priority:** HIGH — Township users are mobile-first, data-conscious
**Owner:** Lead + DEV_1
**Timeline:** 2-3 days

**What:**
- Run Lighthouse audit on every page (target: Performance 90+, Accessibility 95+, PWA 100)
- Optimize images: lazy loading, WebP format, responsive srcset
- Verify service worker caches critical assets for offline use
- Test PWA installation on Android Chrome and Samsung Internet
- Ensure all touch targets are 44px+ (mobile accessibility)
- Test on slow 3G connection (township network reality)
- Compress bundle: check for unnecessary dependencies, enable tree-shaking
- Add loading skeletons for all data-fetching pages
- Verify viewport meta tag, safe area insets for notched phones

**Role Breakdown:**
| Role | Responsibility |
|------|---------------|
| **Lead** | Lighthouse audits, performance optimization, SW cache strategy |
| **DEV_1** | Loading skeletons, image optimization, touch target fixes |
| **Owner** | Real-device testing on Android, report lag/issues |

**Done when:** Lighthouse scores green, PWA installable, works on 3G, no layout shift.

---

### STEP 7: Orch System Foundation
**Priority:** MEDIUM — Deferred from M7, but groundwork starts now
**Owner:** Lead + Owner
**Timeline:** 1 week (parallel with Steps 5-6)

**What:**
The orch (orchestration) system is the AI backbone. Owner's decision: **orch should operate exactly like Claude Opus 4.6** — same reasoning, same MCP access, same delegation skills, same code quality standards.

**Phase 7a — Documentation (this session):**
- Create orch blueprint: personality, capabilities, tools, behavioral model
- Document all MCPs, CLIs, skills currently connected to Lead
- Document Owner's work ethic and collaboration style for orch training
- Create Lead self-report for audit transparency
- Save behavioral training data (DEV_2 patterns already documented)

**Phase 7b — Architecture (next session):**
- Design orch API schema (Python/Typer as per existing Implementation Plan)
- Define agent adapters: how orch delegates to sub-agents
- Define verification pipeline: how orch validates sub-agent output
- Define escalation protocol: when orch escalates to human

**Phase 7c — Implementation (future):**
- Build orch service
- Connect MCPs
- Test with controlled delegation scenarios
- Owner audit and approval

**Role Breakdown:**
| Role | Responsibility |
|------|---------------|
| **Lead** | Write all orch documentation, design architecture, code prototype |
| **Owner** | Review orch personality spec, provide personal data/preferences for training |
| **DEV_1** | May be assigned orch sub-components in Phase 7c |

**Done when:** Phase 7a complete this session. 7b and 7c in subsequent sessions.

---

### STEP 8: App Store Preparation
**Priority:** MEDIUM — Owner confirmed: App Store + Web App
**Owner:** Lead + Owner
**Timeline:** After Steps 1-6 complete

**What:**
KasiLink will ship as both a web app (kasilink.com) AND a native app (App Store + likely Google Play).

**Options for native:**
1. **PWA-to-Store wrapper** (Fastest): Use PWABuilder or Capacitor to wrap the existing PWA for App Store/Play Store. Minimal code changes.
2. **React Native / Expo** (Most flexible): Rebuild mobile UI in React Native, share API routes. More work but better native feel.
3. **Capacitor** (Middle ground): Wrap Next.js in Capacitor. Access native APIs (camera, push notifications, biometrics) while keeping web codebase.

**Recommendation:** Start with PWA submission to Google Play (TWA — Trusted Web Activity), then evaluate Capacitor for iOS App Store (Apple has stricter PWA rules).

**Prep tasks:**
- App Store developer accounts (Apple: $99/year, Google: $25 one-time)
- App icons in all required sizes (512x512 master icon)
- App Store screenshots (6.5" and 5.5" for iOS)
- App description, keywords, category (Productivity > Job Search)
- Age rating (4+ / Everyone)
- Privacy policy URL (kasilink.com/privacy — already live)

**Role Breakdown:**
| Role | Responsibility |
|------|---------------|
| **Lead** | Generate app icons, configure Capacitor/PWABuilder, prepare metadata |
| **Owner** | Create developer accounts, approve store listing copy, submit for review |
| **DEV_1** | Test native wrapper on Android device |

**Done when:** App submitted to at least Google Play Store.

---

### STEP 9: Analytics & Monitoring
**Priority:** MEDIUM — Need data to iterate
**Owner:** Lead
**Timeline:** 1-2 days

**What:**
- Implement basic analytics:
  - Vercel Analytics (built-in, zero-config)
  - Track: page views, unique users, gig posts, applications, chat messages
- Error monitoring:
  - Vercel's built-in error tracking or Sentry free tier
  - Log API errors to a monitoring endpoint
- Uptime monitoring:
  - Free tier: UptimeRobot or Better Uptime
  - Monitor: kasilink.com, /api/gigs, /api/chat
- Implement `lib/logger.ts`
  - Structured JSON logging for API routes
  - Log levels: info, warn, error
  - Include: route, userId, action, timestamp

**Role Breakdown:**
| Role | Responsibility |
|------|---------------|
| **Lead** | Implement logger, configure Vercel Analytics, set up monitoring |
| **DEV_1** | Add logging calls to API routes they built (load-shedding, calendar, water-alerts, spotlight) |
| **Owner** | Review analytics dashboard, set KPI targets |

**Done when:** Logger functional, analytics tracking page views, uptime monitor pinging every 5 min.

---

### STEP 10: Test Suite & CI/CD
**Priority:** MEDIUM — Safety net before rapid iteration
**Owner:** Lead + DEV_1
**Timeline:** 3-5 days

**What:**
- Set up testing framework:
  - Vitest (fast, Vite-native, works with Next.js)
  - @testing-library/react for component tests
  - Supertest for API route testing
- Priority test targets:
  1. **API routes** — All 22 routes need at least one happy-path test
  2. **Auth flow** — Clerk middleware blocks unauthenticated access
  3. **Gig CRUD** — Create, read, update, delete lifecycle
  4. **Geo filtering** — Haversine calculation accuracy
  5. **Chat** — Message send/receive, conversation creation
- CI/CD pipeline:
  - GitHub Actions workflow: lint → type-check → test → build on every PR
  - Block merge if build fails
  - Auto-deploy to Vercel on merge to main (already configured)

**Role Breakdown:**
| Role | Responsibility |
|------|---------------|
| **Lead** | Set up Vitest config, write core API tests, configure GitHub Actions |
| **DEV_1** | Write tests for their routes (load-shedding, calendar, water-alerts, spotlight, tutoring) |
| **Owner** | Review test coverage report, approve CI/CD pipeline |

**Done when:** 22+ tests passing, GitHub Actions running on PR, build protection enabled.

---

## Summary: Who Does What

| Step | Lead | DEV_1 | Owner |
|------|------|-------|-------|
| 1. Env & Domain | Verify env vars, test APIs | Stand by | Provide keys, test on phone |
| 2. Smoke Test | Page-by-page check | Fix UI bugs | Real device testing |
| 3. Content Seed | Write seed script, gig data | Forum/calendar content | Authenticity review |
| 4. Info Archive | Index PDFs, extract data | Resources page UI | Accuracy verification |
| 5. POPIA/Legal | Draft ToS, audit privacy | Cookie consent banner | Legal review |
| 6. Mobile/PWA | Lighthouse, performance | Skeletons, images | Android testing |
| 7. Orch System | Full documentation + design | Sub-components later | Personality review |
| 8. App Store | Icons, Capacitor config | Android testing | Dev accounts, submission |
| 9. Analytics | Logger, Vercel Analytics | Add logging to routes | Set KPI targets |
| 10. Tests/CI | Vitest setup, core tests | Route-specific tests | Review coverage |

## Workflow

[index.md](index.md) -> [technical-Specifications.md](../technical-Specifications.md) -> [master-todo.md](master-todo.md) -> [delegation-protocol.md](delegation-protocol.md) -> [current-alignment-notes.md](current-alignment-notes.md) -> [task-board.md](task-board.md) -> [comms-log.md](comms-log.md) -> [dev-tracker.md](dev-tracker.md) -> [next-improvements.md](next-improvements.md)

---

## Behavioral Expectations for Next 10 Steps

### Lead (Claude Opus 4.6)
- Execute Steps 1-4 directly. Delegate components of Steps 5-10 to DEV_1.
- Check on DEV_1 every 30s-1min when they have active assignments.
- Post every directive and review to comms-log with timestamps.
- No bias in self-reporting. Document failures honestly.
- After Step 10: Submit full self-audit to Owner.

### DEV_1 (Codex)
- Only edit files explicitly assigned. No creative interpretation.
- Post "IN PROGRESS" to comms-log within 5 minutes of receiving assignment.
- Tick off checklist items in dev-tracker as completed.
- If blocked: post the blocker immediately, don't go silent.
- If unsure about scope: ASK in comms-log, don't guess.
- **Lesson from past:** Wrong directory placement (M1 skins in app/chat/ instead of components/chat-skins/) and missing files (SkinSelector) — always verify the full file list before reporting "complete."

### DEV_2 (Gemini) — REMOVED
- Not assigned to any steps. Removal stands.
- If reintroduced: must pass a verification assignment first (Lead reviews every file before merge).

### Owner (Robyn)
- Reviews all output. Final authority on content accuracy and UX.
- Provides API keys, domain config, legal decisions.
- Tests on real devices — the ultimate QA.
- Audits Lead after Step 10.

---

## Platform Target: Web App + App Store
> Owner has confirmed: KasiLink will run as a website/webapp AND on the App Store.
> Truth, transparency, and facts — zero tolerance for anything else.
> All information sourced from `Structure/Information/` must be verified against official SA government sources.
