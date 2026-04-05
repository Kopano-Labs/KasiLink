---
title: delegation-2026-04-05
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

# KasiLink Delegation Brief — 2026-04-05
> Lead handoff. Token conservation mode. Devs operate independently for ~1hr.

---

## CURRENT STATE (facts only)

- **kasilink.com** — LIVE, 45 routes, build passing
- **MongoDB** — FIXED (new password KasiLink2026Prod, Atlas + Vercel updated)
- **Seed data** — DONE (10 gigs, 5 forum posts, 3 calendar events, 2 water alerts)
- **Google OAuth (Clerk)** — DONE (custom credentials saved, dev instance)
- **Seed endpoint** — DELETED (committed 3b0da33)
- **Clerk** — Still on DEV keys (pk_test_). Switch to pk_live_ is PENDING — Owner action required
- **USSD** — Domain bug fixed (kasi-link.com → kasilink.com), committed 4f33fbc

---

## DEV_1 ASSIGNMENT — Step 4: Info Archive Integration

**Read first:** `Structure/Information/archive-index.md`

**Task:** Create 4 static content files that pull meaning from the government PDFs:

| File to create | Source PDFs to draw from |
|----------------|--------------------------|
| `Structure/Information/FAQ/faq-gigs.md` | employment-and-labour.pdf, local-government.pdf |
| `Structure/Information/FAQ/faq-water.md` | water-and-sanitation.pdf, civic-services.pdf |
| `Structure/Information/FAQ/faq-safety.md` | government-programmes_projects-and-campaigns.pdf |
| `Structure/Information/Service/service-directory.md` | cooperative-Governance-and-Traditional-Affairs.pdf, the-Presidency.pdf |

**Format for each FAQ file:**
```md
# [Topic] — KasiLink Info
> Source: [PDF name] | Relevant to: [feature names]

## Q: [question a township resident would ask]
**A:** [plain-language answer, 2-3 sentences max]

## Q: ...
```

**Rules:**
- Plain language. Township resident audience, not government bureaucrat
- 5–8 Q&As per file
- No hallucination — only use what's in the PDFs
- Files go in `Structure/Information/` NOT in `app/`
- No commits until Lead reviews

---

## DEV_2 ASSIGNMENT — Step 5: POPIA Compliance Page

**Task:** Create `/app/terms/page.tsx` — the footer already links to `/terms` but the page is 404.

**Requirements:**
- Match the style of `/app/privacy/page.tsx` exactly (read it first)
- Sections required: Introduction, Data We Collect, How We Use It, Your Rights (POPIA), Contact
- Use `kasilink.rsa@gmail.com` as the contact email
- Static page, no DB calls, no auth required
- Must pass `npm run build` before reporting done

**What NOT to do (from dev-education.md):**
- Do NOT create a `route.ts` in the same directory
- Do NOT add `page.tsx` anywhere inside `app/api/`
- Do NOT invent content — use POPIA Act language (Protection of Personal Information Act, 2013)
- Do NOT commit until Lead reviews

---

## BOTH DEVS — The 7 Commandments (non-negotiable)

1. Read the file before editing it
2. Run `npm run build` before reporting done
3. No phantom completions — show the actual output
4. Files go where they belong (docs in Structure/, code in app/)
5. Ask before creating new directories
6. No stray `.tsx`/`.ts` files outside `app/`, `lib/`, `components/`
7. Report blockers immediately, do not improvise around them

---

## WHAT LEAD WILL CHECK ON RETURN

- Did DEV_1 files exist and contain real content (not placeholders)?
- Does DEV_2's `/terms` page render on prod without 404?
- Does `npm run build` still pass?
- Were any files committed without review? (violation)
- Git log: are commit messages descriptive?

---

## DO NOT TOUCH (off-limits this session)

- `app/api/` — no new routes
- `middleware.ts` — auth config
- `lib/db.ts` — just fixed, leave it
- Any Clerk env vars — Owner action only
- `package.json` / `package-lock.json` — no new dependencies without Lead approval
