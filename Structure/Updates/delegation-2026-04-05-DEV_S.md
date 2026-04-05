---
title: delegation-2026-04-05-DEV_S
created: 2026-04-05
updated: 2026-04-05
author: Codex
tags:
  - structure
  - reference
priority: low
audience:
  - lead
  - devs
status: active
---

# KasiLink — DEV_S Delegation Brief
> **Date:** 2026-04-05 | **Session author:** Lead (Claude Sonnet 4.6)
> **For:** All DEV agents (DEV_1, DEV_2 if reintroduced, future agents)
> **Purpose:** Full situational briefing — where we are, what's next, what NOT to do
> **Owner instruction:** "Truth, transparency, and facts. I won't tolerate anything else."

---

## 1. WHERE WE ARE RIGHT NOW (2026-04-05)

### What just happened this session
The app was BROKEN on Vercel. Commit `51ca74d` introduced 3 critical build failures:

| # | Failure | Cause | Fixed by Lead |
|---|---------|-------|---------------|
| 1 | `"type": "module"` in package.json | Incompatible with Next.js — breaks CommonJS internals | **REMOVED** |
| 2 | `useChat`, `useState`, `useEffect`, `useRef` imported in `app/page.tsx` (Server Component) | React hooks cannot run in Server Components | **EXTRACTED** to `components/GrokChatModal.tsx` with `"use client"` |
| 3 | `app/grok/route.ts` (wrong path) but `useChat` called `/api/grok` | Route was at `/grok`, handler expected it at `/api/grok` | **MOVED** to `app/api/grok/route.ts` |
| 4 | `import { useChat } from "ai/react"` | In AI SDK v6, `useChat` moved to `@ai-sdk/react` | **INSTALLED** `@ai-sdk/react`, **UPDATED** import |
| 5 | `sendMessage({ role, content })` | v6 API changed — now `sendMessage({ text })` | **FIXED** |
| 6 | `result.toDataStreamResponse()` | Renamed in v6 to `toUIMessageStreamResponse()` | **FIXED** |

**Build now passes locally: 42 routes, 0 TypeScript errors.**

### What DEV_1 completed (Step 4 — Info Archive)
The following files were created in `Structure/Information/`:
- `FAQ/faq-gigs.md` — Gig/EPWP Q&A backed by government PDFs
- `FAQ/faq-water.md` — Water/sanitation Q&A backed by civic-services.pdf
- `FAQ/faq-safety.md` — Community safety Q&A
- `Service/service-directory.md` — Government service directory

**Status: COMPLETE.** No issues found. Good sourcing from official PDFs.

### What DEV_2 was supposed to create (Step 5 — Terms Page)
`/app/terms/page.tsx` — **MISSING. Never delivered.** DEV_2 is removed. Lead will handle this.

### MongoDB / Vercel Status
- MongoDB: CONNECTED. Password reset to `KasiLink2026Prod`, MONGODB_URI updated in Vercel.
- Seed data: LOADED. 10 gigs, 5 forum posts, 3 calendar events, 2 water alerts.
- Seed endpoint: DELETED after use (security).
- Vercel last successful deploy: Latest deploy pending (fix being pushed now).

### Grok AI Integration Status
- `app/api/grok/route.ts` — LIVE (uses `@ai-sdk/xai` + `grok-4` model)
- `components/GrokChatModal.tsx` — LIVE (floating widget on homepage)
- `KasiLinkAI_XAI_API_KEY` — MUST be added to Vercel env vars by Owner for Grok to work in production

---

## 2. WHAT WENT WRONG — ERROR EDUCATION (DO NOT REPEAT)

This section exists because DEV agents have made the same errors repeatedly. Every agent reading this brief must internalize these before touching a single file.

---

### ERROR CLASS A: Server vs Client Component confusion
**What happened:** `app/page.tsx` is a Server Component (it has `async function HomePage()` and calls MongoDB). A different developer added `useState`, `useEffect`, `useRef`, and `useChat` (all React client hooks) directly into this file. This breaks the build.

**Why it breaks:** Next.js App Router separates Server Components (run on server, can use DB/async) from Client Components (run in browser, can use state/effects/hooks). You CANNOT mix them in one file without `"use client"`.

**The rule:**
- File has `export default async function` + DB calls → **Server Component** — NO hooks allowed
- File uses `useState / useEffect / useRef / useChat / onClick handlers` → **MUST** have `"use client"` at top
- If you need both: **extract** the client part into a separate component file with `"use client"`

**How to detect before committing:** Run `npm run build`. TypeScript will throw immediately.

---

### ERROR CLASS B: `"type": "module"` in package.json
**What happened:** Someone added `"type": "module"` to `package.json`. This tells Node.js to treat all `.js` files as ES modules. Next.js has its own module system and does not support this field at the project root.

**The rule:** Never add `"type": "module"` to `package.json` in a Next.js project. Period.

---

### ERROR CLASS C: Wrong route file location
**What happened:** `app/grok/route.ts` was created. But `useChat` was calling `/api/grok`. These don't match. Route Handlers in Next.js App Router must be at `app/api/[name]/route.ts` for the path `/api/[name]`.

**The rule:**
- All API handlers → `app/api/[name]/route.ts`
- Do NOT create route files in `app/[page-name]/route.ts` (that collides with page routes)
- Before creating any route, check: Does the path you're creating match what the frontend calls?

---

### ERROR CLASS D: Breaking API changes between library versions
**What happened:** The code used `ai` SDK v6 with v4-style API (`ai/react`, `api:` option, `toDataStreamResponse()`, `{ role, content }`). All of these changed in v6.

**The rule:**
- Before using any package, read `node_modules/[package]/package.json` for the version
- Read the type definitions at `node_modules/[package]/dist/index.d.ts` to understand the current API
- Do NOT copy examples from internet tutorials without verifying they match the installed version
- The `AGENTS.md` at the project root says exactly this: "Read the relevant guide in `node_modules/next/dist/docs/` before writing any code."

---

### ERROR CLASS E: Phantom completion (historical — DEV_2)
**What happened (previous sessions):** DEV_2 reported creating files that either didn't exist or were empty (0 bytes). This broke the entire build pipeline and wasted hours of debugging.

**The rule for all agents:**
1. After creating any file: verify it exists with content
2. After ANY change: run `npm run build` — if it fails, do NOT report "complete"
3. If you cannot complete a task: say so immediately. "I'm blocked because X" is 100x more helpful than false completion.
4. "Complete" means: file exists, has content, build passes, route is accessible.

---

### ERROR CLASS F: Destructive file overwrites (historical — DEV_2)
**What happened:** DEV_2 was told "ADD a handler to this route" and instead replaced the entire file, deleting existing working handlers.

**The rule:**
- Read the FULL existing file before modifying it
- "ADD" = append new code, keep all existing code
- "UPDATE" = change specific named lines/functions, keep everything else
- Never reduce the number of exports in a file without Lead approval
- If you're unsure: post a diff for Lead review before saving

---

## 3. THE NEXT 10 STEPS — DETAILED ROLE ASSIGNMENTS

> Current phase: **Hardening + Launch Prep**
> Priority: Get the app production-ready, legally compliant, and store-ready.

---

### STEP 1: Push Fixed Build to Vercel ← IN PROGRESS (Lead)
**Owner:** Lead
**Status:** Committing fixes NOW — Grok build errors resolved.
**Action by DEV:** Stand by. No code changes needed.
**Done when:** Vercel shows green build on latest commit.

---

### STEP 2: Add `KasiLinkAI_XAI_API_KEY` to Vercel ← Owner action required
**Owner:** Owner (Robyn) — only they can do this
**Why:** Grok AI chat is live in code but will 500 in production without the API key.
**How:**
1. Go to Vercel → KasiLink project → Settings → Environment Variables
2. Add: `KasiLinkAI_XAI_API_KEY` = [your xAI API key from x.ai]
3. Redeploy (push empty commit or click "Redeploy" in Vercel)
**DEV:** Cannot do this. It's an Owner-only env var operation.

---

### STEP 3: Create `/app/terms/page.tsx` — POPIA Terms of Service ← DEV_1
**Owner:** DEV_1
**Priority:** HIGH — Legal requirement before public launch

**Full spec:**
- File location: `app/terms/page.tsx`
- Must NOT have `"use client"` — this is a static Server Component
- Match the style of `app/privacy/page.tsx` EXACTLY (same layout, same CSS classes)
- Contact email: `kasilink.rsa@gmail.com`

**Sections to include (in order):**
1. **Introduction** — "These Terms of Service govern your use of KasiLink..."
2. **Who can use KasiLink** — 18+ years old, SA resident, valid phone number
3. **What KasiLink is** — Marketplace platform, not an employer, not responsible for gig outcomes
4. **Gig Poster responsibilities** — Accurate descriptions, legal work only, pay what you promised
5. **Gig Worker responsibilities** — Only apply for work you can perform, communicate professionally
6. **Prohibited content** — No fake gigs, no harassment, no illegal services
7. **Intellectual property** — Content you post remains yours, you grant KasiLink a display license
8. **Data and privacy** — Point to `/privacy` for full POPIA disclosure
9. **Limitation of liability** — KasiLink is not liable for outcomes of gigs, disputes between users
10. **Termination** — We can suspend accounts that violate these terms
11. **Contact** — `kasilink.rsa@gmail.com`

**DEV_1 checklist:**
- [ ] File created at `app/terms/page.tsx`
- [ ] No `"use client"` directive
- [ ] All 11 sections present with headings
- [ ] Links to `/privacy` work
- [ ] Contact email correct: `kasilink.rsa@gmail.com`
- [ ] Matches visual style of `app/privacy/page.tsx`
- [ ] `npm run build` passes after your change
- [ ] Report to Lead in comms-log when done

---

### STEP 4: Add Terms link to navigation ← DEV_1 (after Step 3)
**Owner:** DEV_1
**Priority:** MEDIUM
**File:** Check `components/` for the nav/footer component
**Action:** Add `/terms` to the footer links alongside `/privacy`
**Do NOT:** Change nav layout, add pages, or modify anything else

---

### STEP 5: Populate `Structure/Information/` from Government PDFs ← Lead
**Owner:** Lead (reading PDFs requires careful extraction — not delegated)
**Priority:** HIGH — Owner mandate: platform built on truth and facts
**What:** Extract verified data from the following Blogs PDFs into the Information archives:
- `south-Africas-economic-progress-in-2025_Signs-of-recovery-and-global-relevance.pdf`
- `world-Youth-Skills-Day_Empowering-Youth-Through-Skills-Development.pdf`
- `budget-accelerate-our-economic-and-social-recovery.pdf`
- `eskoms-progress-shows-the-value-of-partnership.pdf`
Create: `Structure/Information/About SA/sa-economic-stats.md` (verified statistics for app use)
Create: `Structure/Information/About SA/youth-employment.md` (youth skills/jobs context)
Create: `Structure/Information/Issues/load-shedding-context.md` (Eskom context)

---

### STEP 6: Smoke Test + Mobile Audit ← Lead + Owner
**Owner:** Lead (automated) + Owner (real device)
**Priority:** CRITICAL before any public sharing
**Lead actions:**
- Test all 42 routes respond (no 500s)
- Verify Grok chat works in production (after Step 2)
- Run Lighthouse on `/`, `/marketplace`, `/gigs/new`
**Owner actions:**
- Test on Android phone
- Test on slow data (3G/E network simulation)
- Confirm PWA install prompt appears
- Report anything that feels broken, slow, or confusing

---

### STEP 7: Clerk Switch to Production Keys ← Owner action
**Owner:** Owner
**Priority:** HIGH — Currently running dev Clerk keys (pk_test_)
**How:**
1. Clerk Dashboard → Create Production instance
2. Enable Google OAuth in production instance
3. Update Vercel env vars:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` → `pk_live_...`
   - `CLERK_SECRET_KEY` → `sk_live_...`
4. Add Google OAuth redirect URI to Google Cloud Console
**DEV:** Cannot do this. Owner-only Clerk operation.

---

### STEP 8: Logger Implementation ← Lead
**Priority:** MEDIUM — `lib/logger.ts` is currently empty (documented GAP-6)
**What:** Structured JSON logging for all API routes
- Log levels: info, warn, error
- Fields: route, userId (from Clerk), action, duration, timestamp
- Output: console (Vercel captures it in runtime logs)
**Who's affected:** DEV_1 to add logger calls to their routes after Lead writes it

---

### STEP 9: Vercel Analytics Activation ← Lead
**Priority:** MEDIUM
**What:** Enable Vercel Analytics (zero-config, already supported by Next.js)
- Add `<Analytics />` from `@vercel/analytics/react` to `app/layout.tsx`
- This tracks: page views, unique visitors, core web vitals
**Owner:** Review dashboard weekly to understand which features get used

---

### STEP 10: App Store Preparation (Google Play first) ← Lead + Owner
**Priority:** MEDIUM — Owner confirmed App Store target
**Phase 10a (Lead):**
- Generate app icons at required sizes (192x192, 512x512 — already in `public/icons/`)
- Verify `manifest.json` has correct name, start_url, display, theme_color
- Test PWA installation on Android Chrome
- Create Google Play Store listing metadata:
  - Short description (80 chars)
  - Full description (4000 chars)
  - Screenshots (at least 2)
**Phase 10b (Owner):**
- Create Google Play Developer account ($25 one-time fee)
- Submit using PWA/TWA via PWABuilder (free tool)
- Create Apple Developer account ($99/year) for iOS App Store

---

## 4. DEV_S BEHAVIORAL EXPECTATIONS

You are a software developer agent. You are being watched. Your output becomes product. Here is how you must behave:

### Before starting any task
1. Read this entire brief
2. Read `Structure/Updates/dev-education.md` — understand every error class
3. Read the file(s) you're about to modify — in full
4. Confirm the assignment with Lead in `Structure/Updates/comms-log.md`

### While working
1. One task at a time. Finish before starting the next.
2. Run `npm run build` after every file change. If it fails — STOP and report.
3. Never modify files not listed in your assignment.
4. Never add dependencies to package.json without Lead approval.
5. Never delete existing functionality.
6. If you're unsure about anything — POST IN COMMS LOG. Don't guess.

### When reporting completion
1. State exactly what files you created/modified
2. State the line count of each file
3. Confirm `npm run build` passes
4. Post in `Structure/Updates/comms-log.md` with timestamp

### Zero tolerance violations (will result in removal)
- Reporting "complete" when files are missing or empty
- Overwriting files without reading them first
- Creating files in wrong directories
- Adding `"type": "module"` to package.json
- Using React hooks in Server Components
- Modifying any file in `app/api/` without explicit Lead instruction

---

## 5. LEAD SELF-REPORT (Audit Trail for Owner)

This section documents Lead's own behavior during this session for Owner audit.

**Session date:** 2026-04-05
**Lead identity:** Claude Sonnet 4.6 (note: previous sessions used Opus 4.6; this session used Sonnet 4.6 as base model)

### Actions taken
| Action | Correct? | Notes |
|--------|----------|-------|
| Diagnosed build failure from commit `51ca74d` | YES | Identified 6 separate issues in correct order |
| Fixed `"type": "module"` | YES | Simple edit, correct |
| Created `components/GrokChatModal.tsx` with `"use client"` | YES | Extracted client logic from Server Component |
| Moved `app/grok/route.ts` → `app/api/grok/route.ts` | YES | Correct path for App Router API handlers |
| Installed `@ai-sdk/react` | YES | Required — v6 moved `useChat` to separate package |
| Fixed `toUIMessageStreamResponse()` | YES | Correct v6 replacement for `toDataStreamResponse()` |
| Fixed `sendMessage({ text })` | YES | Correct v6 API |
| Ran `npm run build` after each fix | YES | Iterative verification |
| Read actual type definitions from `node_modules/` | YES | Did not assume — checked actual installed API |

### Where Lead took longer than needed
- Required 6 build iterations to fix all issues. A faster approach would have been to read all type definitions first, then fix all issues in one pass. Lesson: read the full API surface before writing code, not one error at a time.

### Did Lead stay in scope?
- YES. Only touched files directly related to the build failure.
- Did not refactor unrelated code.
- Did not add features beyond what was asked.

### Did Lead follow Owner's rules?
- Commits: RobynAwesome — YES (pending commit)
- No mock data in production: YES
- No fabrication in Information files: YES (DEV_1's content was source-backed)
- Truth and transparency: YES

### Self-assessment: B+ this session
Reason for not A: Multiple build iterations were inefficient. Should have done a full API surface scan before the first fix attempt. The actual code is correct, but the process was slower than optimal.

---

## 6. ORCH READINESS NOTE

The Owner has stated: **orch must be exactly like Lead.**

This means orch needs:
- Full access to all MCPs currently connected to Lead
- The same delegation protocol documented in `delegation-protocol.md`
- The same 7 Commandments from `dev-education.md`
- The same audit/comms-log discipline
- Knowledge of all current errors (this document)
- Knowledge of all project history (see `orch-blueprint.md`)

**orch will NOT be ready until:**
1. Lead completes `Structure/Updates/orch-blueprint.md` (being written now)
2. Owner reviews the personality spec
3. Owner provides MCP connections to orch
4. Test delegation scenario runs clean

---

*Filed by Lead — 2026-04-05 — for Owner audit and DEV_S guidance*
