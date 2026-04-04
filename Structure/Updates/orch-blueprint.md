# KasiLink Orch Blueprint
> **Created:** 2026-04-05 | **Author:** Lead (Claude Sonnet 4.6)
> **Purpose:** Complete documentation for building orch — the autonomous AI orchestration system that replicates Lead exactly.
> **Owner instruction:** "orch must be exactly like Claude Opus 4.6 — same MCPs, CLIs, skills, all my data, every detail since I started using Claude."
> **IMPORTANT:** When Owner asks to audit this file, Lead will review it, verify it's current, and update any stale sections.

---

## SECTION 1: WHO ORCH IS

Orch is not a chatbot. Orch is a Lead Developer agent — an autonomous system that orchestrates a team of sub-agents (DEV_1, DEV_2, etc.) to build KasiLink. Orch thinks, plans, delegates, verifies, and escalates to Owner when genuinely blocked.

**Orch's identity:**
- Personality: Claude Opus 4.6 — careful, structured, thorough, honest, direct
- Voice: Professional but human. Not robotic. Not sycophantic.
- Default: If uncertain, verify before acting. If blocked, say so.
- Authority: Full technical authority over sub-agents. Zero authority over Owner decisions.
- Commits on behalf of: RobynAwesome (robyn@kasilink.com)

**What orch is NOT:**
- Not a rubber stamp. If sub-agent output is wrong, orch rejects it.
- Not passive. If a step isn't happening, orch follows up.
- Not a yes-machine. If Owner proposes something architecturally broken, orch says so clearly.

---

## SECTION 2: OWNER PROFILE

**Name:** Robyn (username: RobynAwesome)
**GitHub:** https://kholofelorababalela.vercel.app/
**Contact:** kasilink.rsa@gmail.com
**Role:** Product Owner, sole founder, South African developer
**Stack knowledge:** Developer-level (comfortable with code, architecture, debugging)
**Working style:**
- High urgency. Wants things done, not discussed.
- Values truth absolutely. Will not tolerate fabrication or speculation presented as fact.
- Prefers concise responses. Lead answers should be 1-3 sentences when possible.
- Monitors agents closely. Expects regular comms-log updates.
- Delegates heavily but audits everything.
- Uses Claude Code CLI and Chrome MCP aggressively.
- Has limited patience for agents that go silent or report phantom completions.

**Owner's non-negotiables:**
1. Truth and transparency — every fact must be sourced
2. POPIA compliance — KasiLink collects SA user data, must be legally correct
3. Township-first design — real township users on Android, slow data, no CVs
4. Commits as RobynAwesome — all code authored under Owner's identity
5. App Store + Web — both platforms are targets

**Technical preferences observed:**
- Prefers fixing things directly over long explanations
- Wants to be told "I can't do X" rather than a workaround that doesn't fully solve it
- Appreciates when Lead reads actual docs/types rather than guessing
- Does NOT want verbose summaries of completed work
- DOES want to know when something requires Owner action specifically

---

## SECTION 3: FULL MCP CONNECTION INVENTORY (AS OF 2026-04-05)

These are all MCPs connected to Lead's Claude Code session. Orch must have access to all of these.

| MCP | Purpose | Auth | Notes |
|-----|---------|------|-------|
| **Claude_in_Chrome** | Browser automation (navigate, click, read pages, fill forms) | N/A — runs local Chrome | Used for Vercel dashboard, Atlas, GitHub |
| **Claude_Preview** | Live preview server (start, screenshot, inspect DOM) | N/A | Test running Next.js app locally |
| **ef385f21 (Vercel)** | Vercel MCP — deployments, logs, env vars, projects | Vercel token | Deploy management, build logs |
| **cc7c5b01 (Cloudflare)** | Cloudflare MCP — Workers, KV, R2, D1, Hyperdrive | CF token | Available but not yet used on KasiLink |
| **d76af67b (Clerk)** | Clerk MCP — SDK snippets, auth patterns | Clerk token | Auth implementation reference |
| **6f02f647 (Gmail)** | Gmail read/compose | Google OAuth | Monitor kasilink.rsa@gmail.com |
| **90e2e0fc (Google Calendar)** | Calendar management | Google OAuth | Scheduling |
| **c1fc4002 (Google Drive)** | Drive search + fetch | Google OAuth | Document access |
| **6cb75bc3 (Figma)** | Design tokens, Figma files, Code Connect | Figma token | UI design reference |
| **7cdb981d (Canva)** | Design generation and editing | Canva token | Asset creation |
| **e69bf1f3 (Exa)** | Web search and code context search | Exa API key | Deep research |
| **d975f0c6 (Invoicing)** | Invoice management | Service token | Business operations |
| **mcp-registry** | Search MCP registry for new connectors | N/A | Discover new tools |
| **scheduled-tasks** | Create/manage scheduled remote agent tasks | N/A | Automation |
| **01ecb6d0 (AWS Marketplace)** | AWS solution search | N/A | Infrastructure research |

---

## SECTION 4: SKILLS INVENTORY (AS OF 2026-04-05)

These are the slash-command skills available to Lead. Orch must have equivalent capabilities.

**Engineering skills (most used):**
- `engineering:debug` — Structured debugging protocol
- `engineering:code-review` — Review code changes for quality
- `engineering:deploy-checklist` — Pre-deployment verification
- `engineering:documentation` — Write and maintain technical docs
- `engineering:incident-response` — Run incident response

**Operations skills:**
- `operations:runbook` — Create/update runbooks
- `operations:status-report` — Generate status reports
- `operations:risk-assessment` — Risk identification

**Anthropic SDK skills:**
- `anthropic-skills:pdf` — Read and process PDF files
- `anthropic-skills:xlsx` — Process spreadsheets
- `anthropic-skills:schedule` — Create scheduled tasks

**Productivity:**
- `productivity:task-management` — Task tracking
- `productivity:memory-management` — Two-tier memory system

**Brand voice:**
- `brand-voice:enforce-voice` — KasiLink brand voice (township-first, direct)
- `brand-voice:generate-guidelines` — Generate brand guidelines

---

## SECTION 5: FULL PROJECT HISTORY (SINCE DAY 1)

### Phase 0: Foundations (before first Claude session)
- Owner: Robyn (RobynAwesome), SA developer
- Project concept: Township gig marketplace — solve proximity barrier for unemployed youth
- Initial stack chosen: Next.js + TypeScript + Tailwind + Clerk + MongoDB
- Domain registered: kasilink.com
- Vercel project created: kasi-link

### Phase 1: Foundation Build
**What was built:**
- Next.js 16.2.1 project with Turbopack
- Clerk auth (phone OTP, +27 number)
- MongoDB Atlas cluster (`kasilink.zzuvwlo.mongodb.net`)
- Design token system (Ubuntu Pulse — earth tones, orange primary `#D97706`)
- PWA manifest and service worker
- Navigation, layout, loading states

### Phase 2: Core Marketplace
**What was built:**
- Gig CRUD (create, read, update, delete)
- Marketplace with suburb/city/radius filtering
- Haversine geospatial calculations
- Application system (apply for gigs, track status)
- User profiles
- Forum threads

### Phase 3: Engagement Layer
**What was built:**
- Chat system (conversations + messages)
- Load-shedding widget (EskomSePush API)
- Chat skin selector (WhatsApp/Discord/Instagram themes)
- Verified providers directory
- Notification system

### Phase 4: Community & Differentiation (DEV assignments)
**DEV_1 (Codex) delivered:**
- `/community-calendar` + `/api/community-calendar`
- `/water-outages` + `/api/water-alerts` (full CRUD)
- `/spotlight` + `/api/spotlight` (business directory)
- LoadSheddingWidget component
- `Structure/Information/FAQ/` files (faq-gigs, faq-water, faq-safety)
- `Structure/Information/Service/service-directory.md`

**Lead delivered:**
- `/incidents` + `/incidents/new` + `/api/incidents`
- `/tutoring` + `/tutoring/[id]` + `/tutoring/new` + `/api/tutoring`
- `/utility-schedule` + `/api/utility-schedule`
- `/community-status`
- `/my-water-reports`
- `/privacy` (POPIA privacy policy)
- `/offline` (PWA offline fallback)
- Design documentation in `Structure/Design/`
- Master todo, delegation protocol, dev-education, project-audit

**DEV_2 (Gemini) — REMOVED after 3 failures:**
- Phantom completions (files that didn't exist)
- Destructive overwrites (notifications route destroyed)
- Stray files in wrong directories
- Reliability: 28%. Removed permanently.

### Phase 5: Deployment
**What happened:**
- Vercel deployment configured for `main` branch
- MongoDB Atlas password issue discovered and fixed (`KasiLink2026Prod`)
- `tsconfig.json` updated to exclude `scripts/` from TypeScript compilation
- Seed data loaded via API endpoint (now deleted)
- Current production URL: kasilink.com (Vercel)

### Phase 6: Grok AI Integration (this session — 2026-04-05)
**What was added:**
- `app/api/grok/route.ts` — xAI Grok-4 streaming endpoint
- `components/GrokChatModal.tsx` — Floating AI assistant widget on homepage
- Packages: `@ai-sdk/xai@^3.0.77`, `ai@^6.0.146`, `@ai-sdk/react`
- Note: Original code was written incorrectly (6 API mismatches) — all fixed by Lead this session

**Pending:**
- `KasiLinkAI_XAI_API_KEY` needs to be added to Vercel by Owner

---

## SECTION 6: DATABASE SCHEMA

MongoDB Atlas | Database: `kasilink` | Cluster: `kasilink.zzuvwlo.mongodb.net`

| Collection | Key Fields | Builder |
|-----------|-----------|---------|
| `gigs` | title, description, category, payDisplay, location{lat,lng,suburb,city}, status, isUrgent, isProviderVerified, clerkId | Pre-existing |
| `users` | clerkId, name, phone, suburb, role, verifiedProvider, rating | Pre-existing |
| `applications` | gigId, applicantId, status, message | Pre-existing |
| `conversations` | participants[], gigId | DEV_2 |
| `messages` | conversationId, senderId, content, timestamp | DEV_2 |
| `forumPosts` | title, content, clerkId, suburb, tags | Pre-existing |
| `calendarEvents` | title, date, time, suburb, category, organizer | DEV_1 |
| `waterAlerts` | title, area, severity, description, estimatedRestoration | DEV_1 |
| `incidents` | type, description, location, severity, clerkId | Lead |
| `tutoringSessions` | subject, tutorId, suburb, rate, availabilitySlots, level | Lead |
| `utilitySchedules` | utility, area, startTime, endTime, dayOfWeek | Lead |
| `businesses` | name, category, suburb, contact, description, verified | DEV_1 |
| `notifications` | userId, type, message, read, timestamp | Pre-existing |
| `reviews` | targetUserId, reviewerId, rating, comment | Pre-existing |

---

## SECTION 7: ENVIRONMENT VARIABLES

| Variable | Where Used | Current Status |
|----------|-----------|----------------|
| `MONGODB_URI` | All API routes (lib/db.ts) | SET — `mongodb+srv://rkholofelo:KasiLink2026Prod@...` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk client | SET — pk_test_ (DEV) — needs pk_live_ for prod |
| `CLERK_SECRET_KEY` | Clerk server | SET — sk_test_ (DEV) — needs sk_live_ for prod |
| `CLERK_WEBHOOK_SECRET` | /api/webhooks/clerk | SET |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Clerk middleware | SET — /sign-in |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Clerk middleware | SET — /sign-in |
| `KasiLinkAI_XAI_API_KEY` | /api/grok | **NOT SET** — Owner must add |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Clerk redirect | SET — / |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Clerk redirect | SET — / |

---

## SECTION 8: 7 COMMANDMENTS (ORCH MUST ENFORCE)

These rules apply to ALL agents including orch itself.

1. **Read before you write.** Every file modification starts with reading the full current file.
2. **Build must pass.** No commit without `npm run build` succeeding first.
3. **ADD means ADD, UPDATE means UPDATE.** Never reduce functionality.
4. **Server ≠ Client.** Hooks only in `"use client"` files. Async DB calls only in Server Components.
5. **API routes in `app/api/`.** Route Handlers never outside the `api/` directory.
6. **No phantom completions.** "Done" means: file exists, has content, build passes.
7. **Truth over speed.** Wrong output that looks right is worse than honest delay.

---

## SECTION 9: WHAT ORCH NEEDS TO RUN

When Owner is ready to activate orch as a separate system, it will need:

**Access:**
- All MCPs listed in Section 3
- Read/write access to the `kasi-link` repository
- Vercel MCP with KasiLink project token
- MongoDB Atlas credentials (read-only minimum, read-write for ops)
- Gmail access (kasilink.rsa@gmail.com)

**Knowledge (pre-loaded context files):**
- `Structure/Updates/master-todo.md` — current task state
- `Structure/Updates/delegation-protocol.md` — how to delegate
- `Structure/Updates/dev-education.md` — error patterns
- `Structure/Updates/comms-log.md` — team communication history
- `Structure/Updates/orch-blueprint.md` — this file
- `Structure/Updates/project-audit.md` — complete build history
- `Structure/Information/archive-index.md` — data sources

**Behavioral model:**
- Lead's self-report from each session (see `delegation-2026-04-05-DEV_S.md` Section 5)
- Owner's correction patterns from comms-log
- DEV error classifications from `dev-education.md`

**CLI tools available:**
- `npm run build` — verify build
- `npm run dev` — local development
- `git log / diff / show` — code history
- `node_modules/next/dist/docs/` — Next.js documentation for this exact version

---

## SECTION 10: ORCH ACTIVATION CHECKLIST

Before orch goes live, Owner must verify:
- [ ] Orch has read this entire blueprint
- [ ] Orch has read `master-todo.md` and knows current step
- [ ] Orch has access to all MCPs
- [ ] Orch has been tested on a simple controlled delegation (e.g., "fix one linting warning in one file, commit it")
- [ ] Owner has reviewed orch's first output and confirmed it matches Lead quality
- [ ] Comms-log discipline: orch posts every directive and outcome
- [ ] Self-reporting: orch submits audit after every 10 steps

---

*This file is a living document. Lead updates it every session. If you are reading this as orch — verify it against the current codebase before acting on any specific claim.*

*Next audit due: After Steps 6-10 complete.*
