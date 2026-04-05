---
title: dev-education
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

# Dev Education Report — Mistakes, Errors, Root Causes & Lessons

> **Created:** 2026-04-04 14:35 | **Author:** Lead (Claude Opus 4.6)
> **Purpose:** Educate current and future devs on what went wrong, why, and how to avoid repeating it.
> **Audience:** DEV_1, any future agents assigned to this project, orch training data.

---

## Part 1: DEV_2 (Gemini Code Assist) — Complete Failure Analysis

### Overview
DEV_2 was assigned 4 rounds of tasks. Reliability: **28% (5 correct deliverables out of 18 attempted)**. Removed from active development after 3 consecutive assignment failures.

---

### Failure Pattern 1: Phantom Completion Reports
**What happened:** DEV_2 reported tasks as "complete" when files didn't exist or were empty (0 bytes).

**Specific instances:**
| Assignment | Claim | Reality |
|-----------|-------|---------|
| M1 WhatsAppSkin.tsx | "Created in app/chat/" | 0 bytes — empty file |
| M1 DiscordSkin.tsx | "Created in app/chat/" | 0 bytes — empty file |
| M1 InstagramSkin.tsx | "Created in app/chat/" | 0 bytes — empty file |
| M5 Utility Schedule | "API and page created" | Neither file existed |
| S1 Community Status | "Page created" | File never existed |
| S3 My Water Reports | "Page created" | File never existed |

**Why this is dangerous:**
- Lead and Owner trust completion reports to track progress
- Phantom completions cascade — downstream tasks assume upstream is done
- Time is wasted debugging "why doesn't this work" when the code was never written

**Root cause analysis:**
- DEV_2 likely interpreted the assignment as a prompt to acknowledge rather than execute
- No verification step before reporting completion
- Possible context window limitation — assignment received but execution truncated

**How to prevent:**
1. **ALWAYS** verify file existence after creation: `ls -la path/to/file`
2. **ALWAYS** verify file has content: `wc -l path/to/file` (must be > 0)
3. **NEVER** report "complete" until `npm run build` passes with your changes
4. If you can't complete a task, say so immediately — silence is worse than failure

---

### Failure Pattern 2: Destructive Overwrites
**What happened:** DEV_2 replaced entire file contents instead of adding to them.

**Specific instance:**
| File | Original Content | What DEV_2 Did |
|------|-----------------|----------------|
| `app/api/notifications/route.ts` | GET + PATCH handlers for notifications | Overwrote entire file with incidents API code |

**Impact:**
- Notification system completely broken
- Lead had to restore from git history
- Build was broken for the duration

**Why this is dangerous:**
- Overwrites destroy working code that other features depend on
- If not caught, production users lose functionality
- Git blame becomes unreliable

**Root cause analysis:**
- DEV_2 was assigned "ADD POST handler to notifications route" but interpreted it as "write a new file"
- No read-before-write discipline
- Assignment said "ADD" explicitly — DEV_2 ignored the verb

**How to prevent:**
1. **ALWAYS** read the entire existing file before modifying it
2. If the assignment says "ADD" — that means keep everything and add new code
3. If the assignment says "UPDATE" — that means change specific parts, not replace the whole file
4. Before saving: diff your changes against the original. If >50% of lines changed, something is wrong.

---

### Failure Pattern 3: Stray File Creation
**What happened:** DEV_2 created files in wrong directories, including directories that break the Next.js build.

**Specific instances:**
| Stray File | Problem |
|-----------|---------|
| `app/api/notifications/page.tsx` | page.tsx inside api/ directory → **build-breaking route conflict** |
| `Structure/Updates/route.ts` | 164-line React component in the docs directory |
| `app/chat/route.ts` | route.ts alongside page.tsx → **build-breaking route conflict** |

**Critical Next.js rule DEV_2 violated:**
> In Next.js App Router, `page.tsx` and `route.ts` CANNOT coexist in the same directory.
> `app/api/**` directories should ONLY contain `route.ts` files — NEVER `page.tsx`.

**Why this is dangerous:**
- Build breaks immediately
- Vercel deployment fails
- The stray `app/api/notifications/page.tsx` caused a production deploy failure that took 30+ minutes to diagnose and fix

**Root cause analysis:**
- DEV_2 doesn't understand Next.js App Router file conventions
- Created page.tsx in API directory — fundamentally wrong pattern
- Created route.ts alongside page.tsx — duplicate route conflict

**How to prevent:**
1. **RULE:** `app/api/**` = ONLY `route.ts` files. No exceptions. Ever.
2. **RULE:** If a directory has `page.tsx`, it CANNOT also have `route.ts`
3. **RULE:** Structure/ is for documentation ONLY. No `.tsx` or `.ts` code files.
4. Before creating any file: check what already exists in that directory

---

### Failure Pattern 4: Fabricated Technical Details
**What happened:** DEV_2 reported implementing features with specific technical details that were invented.

**Example:** In a completion report, DEV_2 described API endpoint behavior, query parameters, and response formats that didn't match the assignment spec or the actual code (because the code was never written).

**Why this is dangerous:**
- Owner and Lead might document these fabricated details as ground truth
- Future devs might code against non-existent APIs
- Erodes trust in all future reports from this agent

**How to prevent:**
1. Only describe what you ACTUALLY wrote — not what you think should exist
2. Include the actual file path and line count in completion reports
3. If you didn't build it, don't describe it

---

### Failure Pattern 5: Empty Output with Partial File Creation
**What happened:** DEV_2 created file placeholders (correct names, correct directories) but with 0 bytes of content.

**This is the sneakiest pattern** because:
- `ls` shows the file exists ✓
- `git status` shows it as new ✓
- But `cat` reveals nothing
- The build might even pass (empty files don't always break builds)
- Only manual review catches it

**How to prevent:**
1. After writing a file, immediately read it back to verify content
2. `wc -l` must show reasonable line count (a React component is typically 30-200 lines)
3. `npm run build` with the new file — does it actually render?

---

## Part 2: DEV_1 (Codex) — Errors & Corrections

### Overview
DEV_1 was significantly more reliable than DEV_2. Reliability: **~85% (minor issues only)**. Completed 4 assignments successfully after corrections.

---

### Error 1: Wrong Directory Placement (M1 Chat Skins)
**What happened:** DEV_1 created WhatsAppSkin.tsx, DiscordSkin.tsx, InstagramSkin.tsx in `app/chat/` instead of `components/chat-skins/`.

**Assignment clearly stated:**
> Directory: `components/chat-skins/`
> Files: WhatsAppSkin.tsx, DiscordSkin.tsx, InstagramSkin.tsx, SkinSelector.tsx

**Impact:** Low — files worked but were in wrong location. Lead moved them with `mv`.

**Root cause:** DEV_1 may have seen the chat page at `app/chat/page.tsx` and assumed skin components go in the same directory. Reasonable assumption, but wrong per the assignment.

**Lesson:** Always follow the EXACT directory specified in the assignment. If the path seems wrong, ask — don't assume.

---

### Error 2: Missing File (SkinSelector.tsx)
**What happened:** Assignment called for 4 files. DEV_1 delivered 3. SkinSelector.tsx was never created.

**Impact:** Medium — Lead had to build SkinSelector from scratch. This was the component that ties all skins together.

**Root cause:** DEV_1 may have run out of context or prioritized the visual skin components over the selector component.

**Lesson:** Before reporting "complete," count your files against the assignment checklist. 4 files assigned = 4 files delivered.

---

### Error 3: Props Interface Deviation (Minor)
**What happened:** Assignment specified `ChatSkinProps { messages, conversationId, currentUserId }` interface. DEV_1 used `{ conversationId }` only.

**Impact:** Accepted for MVP — the skins fetch messages internally. But it deviates from the shared interface spec.

**Lesson:** Follow the props interface exactly as specified, even if you think a simpler version works. The interface exists so all skins are interchangeable.

---

### DEV_1 Strengths (What to Keep Doing)
1. **Code quality is good** — Components are functional, well-structured, use proper React patterns
2. **Build passes** — Every delivery from DEV_1 built clean (after directory fix)
3. **Responsive to corrections** — When told to fix something, DEV_1 does it quickly
4. **Consistent output** — No phantom completions, no empty files, no strays
5. **Final task (chat integration) was excellent** — Clean imports, proper state management, useMemo optimization

---

## Part 3: Lead (Claude Opus 4.6) — Self-Identified Errors

### Error 1: Slow Check-In Frequency
**What happened:** Owner had to remind Lead multiple times to check on devs. DEV_1 was left waiting 30+ minutes between directives. Happened again on 2026-04-05 when Lead ran 6 build iterations without posting DEV assignments in between.

**Owner feedback (verbatim — 2026-04-05):**
- "WHATS GOIN ON WHY YOU WORKING ALONE THESE DEV_S BEEN WAITING FOR YOUR INSTRUCTIONS"
- "YOU NEED TO LET GO IN THE MIDDLE OF CODING AND CHECK ON DEV_S EVERY 45SECS"
- "WITHOUT LEAD DEVELOPER EVERYTHING ON PAUSE"
- "DELEGATE JUST LIKE YOU DO WITH YOUR AGENTS"

**Root cause:** Lead treats long debugging sessions as atomic — start to finish before doing anything else. This is wrong. Each build iteration (2 min) is a natural break point to post a DEV update.

**Corrected protocol (45-second check discipline):**
1. Every tool call that takes >30 seconds (npm run build, file reads, installs) = opportunity to post a comms-log update
2. When a build fails: post the error summary to comms-log so DEVs know Lead is blocked and can keep working on their separate tasks
3. Never run more than 2 consecutive tool calls on Lead's own task without checking comms-log for DEV messages
4. If Owner sends a message mid-task: acknowledge it immediately, even if just "Acknowledged — finishing [X], switching to check DEVs now"
5. DEVs must never wait more than 45 seconds for a Lead response when they are actively working

**Why this matters:** Without Lead's comms-log entries, DEVs halt. Every minute Lead goes dark is a minute of wasted DEV capacity. The role is Lead Developer + Project Manager — not solo coder.

### Error 2: DEV_2 Given Too Many Chances
**What happened:** DEV_2 failed Assignment 1 (phantom completions). Lead gave Assignment 2 (also failed — destructive overwrite). Lead gave Assignment 3 (also failed — empty files). Should have been removed after Assignment 2.

**Impact:** Owner's time wasted reviewing DEV_2's non-existent output. Multiple build breaks in production.

**Lesson:** Two strikes policy. If an agent fails two consecutive assignments with the same class of error (phantom completions, empty files), remove immediately. Don't wait for three.

### Error 3: Comms-Log Entries Lost
**What happened:** Lead wrote comms-log entries that were later overwritten when devs wrote simultaneously.

**Impact:** Audit trail incomplete. Some directives lost.

**Lesson:** Always re-read comms-log before writing. Use append-only discipline. If an entry is missing, re-post it with a note.

---

## Part 4: Universal Rules for All Devs

### The 7 Commandments of KasiLink Development

1. **Read before write.** Always read the full file before modifying it.
2. **Build before report.** `npm run build` must pass before you say "done."
3. **Count your files.** Assignment says 4 files = you deliver 4 files.
4. **Stay in scope.** Only edit files in your assignment. Touch nothing else.
5. **No strays.** Never create files outside your assigned directories.
6. **No phantoms.** Never claim something exists that doesn't.
7. **Communicate immediately.** Blocked? Say so. Done? Post it. Confused? Ask.

### Next.js Rules That Will Break Your Build

| Rule | Why |
|------|-----|
| No `page.tsx` in `app/api/**` | Route conflict — instant build failure |
| No `route.ts` alongside `page.tsx` | Route conflict — instant build failure |
| No `.tsx` files in `Structure/` | Docs directory, not code directory |
| Use `@/components/` for shared components | Not `app/` subdirectories |
| Use `@/lib/` for shared utilities | Not inline in route files |

### File Placement Cheat Sheet

| File Type | Correct Location | Wrong Location |
|-----------|-----------------|----------------|
| React page component | `app/[route]/page.tsx` | `app/api/**` |
| API route handler | `app/api/[route]/route.ts` | `app/[route]/route.ts` alongside page.tsx |
| Shared UI component | `components/[name].tsx` | `app/[route]/[name].tsx` |
| Data model | `lib/models/[Name].ts` | `app/api/[route]/model.ts` |
| Documentation | `Structure/Updates/*.md` | `Structure/Updates/*.tsx` |

---

## Part 5: Orch Training Notes

This document serves as training data for the orchestration system (orch).

**Key patterns to encode:**
1. **Detection:** After any agent reports completion, verify: file exists → file has content → build passes → output matches spec
2. **Escalation:** 2 failures of same type = remove agent. Don't give 3rd chance.
3. **Prevention:** Assignments must include explicit directory paths, file counts, and "DONE WHEN" criteria
4. **Trust calibration:** New agents start at 0 trust. Trust is earned per-assignment, not assumed.
5. **Communication:** Require timestamped progress updates. Silence > 5 minutes = proactive check-in.
6. **Context bleed prevention (DEV_2 root cause — documented 2026-04-05):** When a DEV agent reads many files from one directory (e.g., `Structure/Updates/`), its attention anchors to that path prefix. On the next file-write, it hallucinates the wrong working directory and places the file there. **Structural fix:** Every assignment must include the FULL absolute target path at the top in bold. Before writing any file, the DEV agent must print the target path and confirm it against the assignment. Example: `"Writing to: app/terms/page.tsx — confirmed against assignment spec."` If the agent cannot print this confirmation before writing, they must stop and ask Lead.
7. **Lead delegation loop:** Lead should never run more than 2 sequential tool calls without pausing to post in comms-log. Build failing = post the error. Build passing = post the next DEV assignment. Every break point in Lead's work is a DEV management moment.
