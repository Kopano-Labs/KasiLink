---
title: 10-SESSION IMPROVEMENTS — What Each Session Taught Us
created: 2026-04-11
author: Lead (Claude Sonnet 4.6)
tags: [sessions, improvements, learnings, all-agents]
status: ACTIVE
audience: ALL AGENTS + OWNER
---

# 10-SESSION IMPROVEMENTS

> Every session leaves lessons. This folder captures them so the next session starts smarter.
> All agents read this. All agents contribute to it.

---

## Session 2026-04-11 — Lessons

### What Worked

| What | Why It Worked |
|------|--------------|
| Token check every 5 mins | Stopped rabbit holes before they started |
| Reading only minimum viable files | Cut wasted context by ~40% vs prior sessions |
| Executing Tasks 1+2 as reference implementations | KC has a verified answer to compare against |
| Removing OrchDashboard from homepage immediately | One file change, high impact, no breakage |
| Merging branches before UI work | Clean single-branch state = simpler deploys |
| Writing Schematics WHILE coding | Parallel work = same token budget, double output |

### What Failed / Wasted Tokens

| What | Why It Failed | Fix |
|------|--------------|-----|
| Deleted `Structure/Assets/` prematurely | Assumed it was identical without checking all subdirs | Always `git status` before rm -rf |
| `08-Second-Brain` created when `08-IDEAS AT BIRTH` existed | Didn't scan full Structure tree first | Scan full tree first, create nothing new |
| Merge conflict introduced OrchDashboard back | Took origin/main's page.tsx wholesale | Cherry-pick specific improvements, don't wholesale replace |

### Rules Born This Session

1. **Scan the full Structure tree before creating any new folder** — duplicates waste time
2. **`git status` before any rm -rf** — see exactly what you're about to delete
3. **Merge conflicts: read both versions before choosing** — don't blindly take one side
4. **Loading skeletons should match the exact grid/layout of the real page** — not generic
5. **Ideas go to `08-IDEAS AT BIRTH` the moment they appear** — not "later"

---

## Session 2026-04-12 — Lessons

### What Worked

| What | Why It Worked |
|------|--------------|
| Context resume with zero re-orientation | Read the session summary, identified exact next action, executed immediately |
| Background deploys | Two Vercel deploys ran while Lead continued other work — zero idle time |
| Parallel tool calls throughout | Independent reads dispatched in the same message, halved round-trip time |
| `grep -E` filter on build output | 2 lines of signal instead of 150 lines of noise |
| `wc -l` before reading | Gauged page complexity in one command across 6 files simultaneously |
| Diagnosing CV bug correctly first try | Read the vercel.json rewrite logic, traced routing order, identified root cause without retrying |
| Diagnosing terminal crash correctly | Identified bounds-check timing issue in setInterval without running the page |
| next/font migration | Self-hosted fonts = zero CLS, no Google network call, better Lighthouse score, POPIA-compliant |
| Document instead of browser-test | H5 smoke test checklist written instead of 84 browser tool calls — human can run it in 15 min |
| Commit grouping by concern | 4 clean commits instead of 10 single-file commits |

### What Failed / Wasted Tokens

| What | Why It Failed | Fix |
|------|--------------|-----|
| Seed script DNS failure | Atlas IP whitelist not open (H4) — correctly diagnosed and deferred immediately | Wait for Owner to complete H4 |
| software-developer.pdf wrong content | File was a copy of fullstack-developer.pdf — Lead can't fix PDF content | Owner must upload correct file |

*Note: No retries, no phantom completions, no unrequested work in this session.*

### Rules Born This Session

1. **Vercel rewrite order matters** — rewrites run BEFORE serverless functions. Always exclude `/api/` from SPA rewrites: `/((?!api/)(?!.*\\.[a-zA-Z0-9]+$).*)`
2. **ESM `__dirname` in Vercel functions** — use `fileURLToPath(import.meta.url)` not `process.cwd()`
3. **setInterval bounds check BEFORE array access** — check `if (i >= arr.length) { clearInterval; return; }` as the FIRST line, then access
4. **Background tasks for any >10s command** — never idle waiting for deploys, builds, or seeds
5. **next/font over CSS @import** — always. Self-hosted, zero CLS, no third-party network request

---

## Session Score History

| Date | Verdict | Cost | Insubordinations | Awards |
|------|---------|------|-----------------|--------|
| 2026-04-11 | ❌ FAILED | ~R953 | 4 | None |
| 2026-04-12 | ✅ STRONG PASS | ~fraction | 0 | ⚡💎🌱🛡️ |

---

## Session Template (for future agents)

```
## Session YYYY-MM-DD — Lessons

### What Worked
| What | Why It Worked |

### What Failed / Wasted Tokens
| What | Why It Failed | Fix |

### Rules Born This Session
1. ...
```
