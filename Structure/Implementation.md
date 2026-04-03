\*\*\*\*\*\*# KasiLink Implementation Plan

**Domain:** kasilink.com
**Target:** MVP Launch End April 2026 | Community Features Mid May | Full Launch End May 2026
**Stack:** Next.js 16.2.1 | TypeScript | Tailwind CSS 4 | Clerk Auth | MongoDB Atlas | Vercel

---

## Context

South Africa's unemployment rate sits at 31.4% with youth (15-24) at ~57%. 7.8 million people are unemployed, with 80% trapped in long-term structural unemployment. Township residents face transport barriers, lack of networks, and isolation from formal job markets. Government programs (EPWP, PYEI) provide only temporary relief with no progression pathway. KasiLink solves the proximity problem - connecting township job seekers with nearby retailers and gig providers, eliminating the #1 barrier: distance.

The codebase is ~30% scaffolded. Extensive design mockups exist in `/Structure` (dark mode, light mode, chat skins, features, backend architecture). Only the JobCard component and basic jobs page are functional. Everything else is stubbed or missing entirely.

---

## Priority Classification

### CRITICAL (Blocks MVP - Must ship by End April 2026)

| #   | Task                                             | Files                                              | Why Critical                                                                                                                                                  |
| --- | ------------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1  | **Clerk Auth Flow (Phone-first OTP)**            | `app/auth/`, `lib/auth.config.ts`, `middleware.ts` | No users without auth. Phone-first is essential - township users may not have email. Design mockups exist in `Structure/dark-Mode` and `Structure/light-Mode` |
| C2  | \*\*MongoD\*\*\*\*# KasiLink Implementation Plan |

**Domain:** kasilink.com
**Target:** MVP Launch End April 2026 | Community Features Mid May | Full Launch End May 2026
**Stack:** Next.js 16.2.1 | TypeScript | Tailwind CSS 4 | Clerk Auth | MongoDB Atlas | Vercel

---

## Context

South Africa's unemployment rate sits at 31.4% with youth (15-24) at ~57%. 7.8 million people are unemployed, with 80% trapped in long-term structural unemployment. Township residents face transport barriers, lack of networks, and isolation from formal job markets. Government programs (EPWP, PYEI) provide only temporary relief with no progression pathway. KasiLink solves the proximity problem - connecting township job seekers with nearby retailers and gig providers, eliminating the #1 barrier: distance.

The codebase is ~30% scaffolded. Extensive design mockups exist in `/Structure` (dark mode, light mode, chat skins, features, backend architecture). Only the JobCard component and basic jobs page are functional. Everything else is stubbed or missing entirely.

---

## Priority Classification

### CRITICAL (Blocks MVP - Must ship by End April 2026)

| #   | Task                                            | Files                                                              | Why Critical                                                                                                                                                  |
| --- | ----------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1  | **Clerk Auth Flow (Phone-first OTP)**           | `app/auth/`, `lib/auth.config.ts`, `middleware.ts`                 | No users without auth. Phone-first is essential - township users may not have email. Design mockups exist in `Structure/dark-Mode` and `Structure/light-Mode` |
| C2  | **MongoDB Connection & Data Layer**             | `lib/db.ts`, `lib/models/`                                         | Empty stub. Every feature depends on this. Need User, Gig, Application schemas                                                                                |
| C3  | **API Routes - Gig CRUD**                       | `app/api/gigs/`, `app/api/users/`                                  | Core marketplace loop: post gig, browse, apply. Without this, no product                                                                                      |
| C4  | **Home Feed Page**                              | `app/page.tsx`                                                     | Currently shows jobs list. Needs: load-shedding widget, nearby gigs, community highlights per design mockups                                                  |
| C5  | **Marketplace Page (Browse + Filter + Search)** | `app/marketplace/page.tsx`                                         | Job seekers need to find gigs by location, category, pay. Mockups exist for both themes                                                                       |
| C6  | **Gig Posting Flow (Provider Side)**            | `app/gigs/new/page.tsx`, `lib/validation.ts`                       | Providers must post gigs or there's nothing to browse. Two-sided marketplace - supply side is critical                                                        |
| C7  | **User Profile (Seeker + Provider)**            | `app/profile/page.tsx`, `components/ProfileCard.tsx`               | Empty stub. Users need profiles to apply/post. Ties to Clerk user sync                                                                                        |
| C8  | **Navbar + Footer + Layout Shell**              | `components/Navbar.tsx`, `components/Footer.tsx`, `app/layout.tsx` | Empty stubs. App has no navigation. Users can't move between pages                                                                                            |
| C9  | **Global Styles + Design System Tokens**        | `styles/globals.css`, `tailwind theme`                             | Empty. Two themes defined in Structure (dark: #4595c0 primary, light/Ubuntu Pulse: #f1e259 primary). Need base tokens                                         |
| C10 | **PWA Manifest + Service Worker**               | `public/manifest.json`, `next.config.ts`                           | Empty manifest. Township users need offline capability and installability. Data costs matter                                                                  |

### HIGH (Core experience - Must ship by Mid May 2026)

| #   | Task                                      | Files                                        | Why High                                                                                                               |
| --- | ----------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| H1  | **In-App Chat (Basic)**                   | `app/chat/`, `lib/realtime/`                 | Gig coordination requires messaging. Start with basic chat before premium skins. Mockups in `Structure/chat/`          |
| H2  | **Community Forum (Community Heartbeat)** | `app/forum/page.tsx`                         | Safety tips, load-shedding coordination, success stories. Designed in both themes. Drives retention + trust            |
| H3  | **Load-Shedding Status Widget**           | `components/LoadSheddingWidget.tsx`          | SA-specific killer feature. Appears on home feed, chat, forum. Differentiator from generic job boards                  |
| H4  | **Gig Application Workflow**              | `app/api/applications/`, `app/gigs/[id]/`    | Seeker applies -> Provider reviews -> Assigns -> Tracks. The lifecycle diagram exists in `Structure/backend-Framework` |
| H5  | **Dark/Light Mode Toggle**                | Theme system, `components/ThemeProvider.tsx` | Both themes fully designed. Ubuntu Pulse (light) + Dark mode. User choice                                              |
| H6  | **Location-Based Filtering (Geo)**        | `lib/geo.ts`, MongoDB geospatial             | The entire value prop is "gigs near you." Without geo, KasiLink is just another job board                              |
| H7  | **Verified Provider System**              | `app/verified/`, badges, directory           | Trust is the #1 barrier in townships. Mockups exist: Verified Posters Directory, Profile, Search Results               |
| H8  | **Notification System**                   | `app/api/notifications/`                     | Gig alerts, application updates, safety alerts. Essential for engagement                                               |

### MEDIUM (Differentiation - Target End May 2026)

| #   | Task                                 | Why                                                                                           |
| --- | ------------------------------------ | --------------------------------------------------------------------------------------------- |
| M1  | **Chameleon Chat Skins (Premium)**   | WhatsApp/Discord/Instagram skins. Revenue via Kasi Gold. Fully designed in `Structure/chat/`  |
| M2  | **Community Calendar**               | Local events. Mockup exists in `Structure/features/`                                          |
| M3  | **Water Outage Alerts**              | Utility tracking. Mockup exists                                                               |
| M4  | **Incident Reporting**               | Safety feature. Mockup in `Structure/sub-features/`                                           |
| M5  | **Utility Schedule Tracker**         | Load-shedding + water schedules                                                               |
| M6  | **Tutoring Interface**               | Education/mentoring vertical. Mockup in `Structure/tutoring/`                                 |
| M7  | **Agent Orchestration (AI Backend)** | Gemini/Grok/Claude adapters for smart matching. Architecture in `Structure/backend-Framework` |

### LOW (Post-Launch Polish)

| #   | Task                               | Why                                                     |
| --- | ---------------------------------- | ------------------------------------------------------- |
| L1  | **Local Business Spotlight**       | Business profiles/directory                             |
| L2  | **Privacy Policy Pages**           | Legal compliance (can use template initially)           |
| L3  | **Audit Logger**                   | `lib/logger.ts` - admin tooling                         |
| L4  | **Admin Dashboard**                | System moderation, global alerts                        |
| L5  | **WhatsApp/Slack/Discord Bridges** | External messaging integration                          |
| L6  | **Analytics + Metrics Dashboard**  | Track DAU, gigs completed, viral coefficient            |
| L7  | **Test Suite**                     | `tests/jobs.test.ts` is empty. Add after MVP stabilizes |

---

## Execution Order (Sprint Plan)

### Sprint 1: Foundation (Week 1 - Apr 3-10)

> Get the app navigable and authenticated

1. **C9** - Design system tokens + global styles (both themes)
2. **C8** - Navbar + Footer + layout shell
3. **C1** - Clerk auth flow (phone OTP, +27 prefix)
4. **C2** - MongoDB connection + User/Gig/Application schemas
5. **C10** - PWA manifest (basic, iterate later)

### Sprint 2: Core Marketplace (Week 2 - Apr 10-17)

> The gig posting and browsing loop

6. **C3** - API routes (gig CRUD + user endpoints)
7. **C6** - Gig posting flow (provider side)
8. **C5** - Marketplace page (browse, filter, search)
9. **C4** - Home feed (nearby gigs, alerts placeholder)
10. **C7** - User profile (seeker + provider views)

### Sprint 3: Engagement Layer (Week 3 - Apr 17-24)

> Make it sticky and trustworthy

11. **H4** - Gig application workflow (apply -> review -> assign)
12. **H6** - Location-based filtering (MongoDB geospatial)
13. **H3** - Load-shedding status widget
14. **H1** - Basic in-app chat
15. **H5** - Dark/light mode toggle

### Sprint 4: Community + Trust (Week 4 - Apr 24 - May 7)

> Community features that differentiate

16. **H2** - Community forum
17. **H7** - Verified provider system + badges
18. **H8** - Notification system
19. **M4** - Incident reporting
20. **M5** - Utility schedule tracker

### Sprint 5: Premium + Polish (May 7-21)

> Revenue features and launch prep

21. **M1** - Chameleon chat skins (Kasi Gold)
22. **M2** - Community calendar
23. **M3** - Water outage alerts
24. **M6** - Tutoring interface
25. Deploy to Vercel + kasilink.com domain config

### Post-Launch: Iterate (May 21+)

- L1-L7 based on user feedback
- M7 (AI agent orchestration) when scale demands it
- WhatsApp sharing for viral growth

---

## Domain Setup (kasilink.com)

1. Point kasilink.com DNS to Vercel (A record: 76.76.21.21, CNAME: cname.vercel-dns.com)
2. Configure domain in Vercel project settings
3. Update Clerk production instance with kasilink.com
4. Set `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and related env vars for production
5. Update `manifest.json` with kasilink.com URLs

---

## High-Demand Sector Targeting (Content Strategy)

Priority gig categories to seed the marketplace (based on SA labour data):

| Sector                 | Example Gigs                                   | Target Employers                       |
| ---------------------- | ---------------------------------------------- | -------------------------------------- |
| **Retail/FMCG**        | Shelf packing, till ops, stock control, promos | Shoprite, Boxer, Checkers, PnP         |
| **Construction**       | Labourer, site assistant, painter, helper      | Local contractors, housing projects    |
| **Healthcare**         | Care aide, pharmacy assistant, clinic admin    | Local clinics, pharmacies              |
| **Logistics/Delivery** | Courier, warehouse helper, packer              | Sixty60, local delivery hubs           |
| **Services**           | Car wash, tutoring, repairs, cleaning          | Individual providers, small businesses |

---

## Key Design References in /Structure

| Screen      | Dark Mode                       | Light Mode                       | Notes                                          |
| ----------- | ------------------------------- | -------------------------------- | ---------------------------------------------- |
| Auth        | `dark-Mode/stitch/auth/`        | `light-Mode/stitch/auth/`        | Phone-first, +27, OTP, load-shedding indicator |
| Home Feed   | `dark-Mode/stitch/home-feed/`   | `light-Mode/stitch/home-feed/`   | Nearby gigs, alerts, community                 |
| Marketplace | `dark-Mode/stitch/marketplace/` | `light-Mode/stitch/marketplace/` | Filters, cards, map view                       |
| Forum       | `dark-Mode/stitch/forum/`       | `light-Mode/stitch/forum/`       | Community Heartbeat                            |
| Chat        | `chat/stitch/`                  | -                                | WhatsApp, Discord, Instagram skins             |
| Features    | `features/stitch/`              | -                                | Calendar, water, verified providers            |
| Backend     | `backend-Framework/stitch/`     | -                                | Architecture diagrams                          |

---

## Verification Plan

After each sprint:

1. `npm run build` - Ensure no TypeScript/build errors
2. `npm run dev` - Manual smoke test of new pages
3. Test auth flow end-to-end (sign up, sign in, protected routes)
4. Test gig CRUD (create, read, update, delete) via API + UI
5. Test on mobile viewport (375px) - PWA installability
6. Lighthouse audit (Performance, Accessibility, PWA scores)
7. Pre-launch: Deploy preview to Vercel, test kasilink.com DNS resolution
   B Connection & Data Layer** | `lib/db.ts`, `lib/models/` | Empty stub. Every feature depends on this. Need User, Gig, Application schemas |
   | C3 | **API Routes - Gig CRUD** | `app/api/gigs/`, `app/api/users/` | Core marketplace loop: post gig, browse, apply. Without this, no product |
   | C4 | **Home Feed Page** | `app/page.tsx` | Currently shows jobs list. Needs: load-shedding widget, nearby gigs, community highlights per design mockups  
    |
   | C5 | **Marketplace Page (Browse + Filter + Search)** | `app/marketplace/page.tsx` | Job seekers need to find gigs by location, category, pay. Mockups exist for both themes |
   | C6 | **Gig Posting Flow (Provider Side)** | `app/gigs/new/page.tsx`, `lib/validation.ts` | Providers must post gigs or there's nothing to browse. Two-sided marketplace - supply side is critical |
   | C7 | **User Profile (Seeker + Provider)** | `app/profile/page.tsx`, `components/ProfileCard.tsx` | Empty stub. Users need profiles to apply/post. Ties to Clerk user sync |
   | C8 | **Navbar + Footer + Layout Shell** | `components/Navbar.tsx`, `components/Footer.tsx`, `app/layout.tsx` | Empty stubs. App has no navigation. Users can't move between pages |
   | C9 | **Global Styles + Design System Tokens** | `styles/globals.css`, `tailwind theme` | Empty. Two themes defined in Structure (dark: #4595c0 primary, light/Ubuntu Pulse: #f1e259 primary). Need base tokens |
   | C10 | **PWA Manifest + Service Worker\*\* | `public/manifest.json`, `next.config.ts` | Empty manifest. Township users need offline capability and installability. Data costs matter |

### HIGH (Core experience - Must ship by Mid May 2026)

| #   | Task                                      | Files                                        | Why High                                                                                                               |
| --- | ----------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| H1  | **In-App Chat (Basic)**                   | `app/chat/`, `lib/realtime/`                 | Gig coordination requires messaging. Start with basic chat before premium skins. Mockups in `Structure/chat/`          |
| H2  | **Community Forum (Community Heartbeat)** | `app/forum/page.tsx`                         | Safety tips, load-shedding coordination, success stories. Designed in both themes. Drives retention + trust            |
| H3  | **Load-Shedding Status Widget**           | `components/LoadSheddingWidget.tsx`          | SA-specific killer feature. Appears on home feed, chat, forum. Differentiator from generic job boards                  |
| H4  | **Gig Application Workflow**              | `app/api/applications/`, `app/gigs/[id]/`    | Seeker applies -> Provider reviews -> Assigns -> Tracks. The lifecycle diagram exists in `Structure/backend-Framework` |
| H5  | **Dark/Light Mode Toggle**                | Theme system, `components/ThemeProvider.tsx` | Both themes fully designed. Ubuntu Pulse (light) + Dark mode. User choice                                              |
| H6  | **Location-Based Filtering (Geo)**        | `lib/geo.ts`, MongoDB geospatial             | The entire value prop is "gigs near you." Without geo, KasiLink is just another job board                              |
| H7  | **Verified Provider System**              | `app/verified/`, badges, directory           | Trust is the #1 barrier in townships. Mockups exist: Verified Posters Directory, Profile, Search Results               |
| H8  | **Notification System**                   | `app/api/notifications/`                     | Gig alerts, application updates, safety alerts. Essential for engagement                                               |

### MEDIUM (Differentiation - Target End May 2026)

| #   | Task                                 | Why                                                                                           |
| --- | ------------------------------------ | --------------------------------------------------------------------------------------------- |
| M1  | **Chameleon Chat Skins (Premium)**   | WhatsApp/Discord/Instagram skins. Revenue via Kasi Gold. Fully designed in `Structure/chat/`  |
| M2  | **Community Calendar**               | Local events. Mockup exists in `Structure/features/`                                          |
| M3  | **Water Outage Alerts**              | Utility tracking. Mockup exists                                                               |
| M4  | **Incident Reporting**               | Safety feature. Mockup in `Structure/sub-features/`                                           |
| M5  | **Utility Schedule Tracker**         | Load-shedding + water schedules                                                               |
| M6  | **Tutoring Interface**               | Education/mentoring vertical. Mockup in `Structure/tutoring/`                                 |
| M7  | **Agent Orchestration (AI Backend)** | Gemini/Grok/Claude adapters for smart matching. Architecture in `Structure/backend-Framework` |

### LOW (Post-Launch Polish)

| #   | Task                               | Why                                                     |
| --- | ---------------------------------- | ------------------------------------------------------- |
| L1  | **Local Business Spotlight**       | Business profiles/directory                             |
| L2  | **Privacy Policy Pages**           | Legal compliance (can use template initially)           |
| L3  | **Audit Logger**                   | `lib/logger.ts` - admin tooling                         |
| L4  | **Admin Dashboard**                | System moderation, global alerts                        |
| L5  | **WhatsApp/Slack/Discord Bridges** | External messaging integration                          |
| L6  | **Analytics + Metrics Dashboard**  | Track DAU, gigs completed, viral coefficient            |
| L7  | **Test Suite**                     | `tests/jobs.test.ts` is empty. Add after MVP stabilizes |

---

## Execution Order (Sprint Plan)

### Sprint 1: Foundation (Week 1 - Apr 3-10)

> Get the app navigable and authenticated

1. **C9** - Design system tokens + global styles (both themes)
2. **C8** - Navbar + Footer + layout shell
3. **C1** - Clerk auth flow (phone OTP, +27 prefix)
4. **C2** - MongoDB connection + User/Gig/Application schemas
5. **C10** - PWA manifest (basic, iterate later)

### Sprint 2: Core Marketplace (Week 2 - Apr 10-17)

> The gig posting and browsing loop

6. **C3** - API routes (gig CRUD + user endpoints)
7. **C6** - Gig posting flow (provider side)
8. **C5** - Marketplace page (browse, filter, search)
9. **C4** - Home feed (nearby gigs, alerts placeholder)
10. **C7** - User profile (seeker + provider views)

### Sprint 3: Engagement Layer (Week 3 - Apr 17-24)

> Make it sticky and trustworthy

11. **H4** - Gig application workflow (apply -> review -> assign)
12. **H6** - Location-based filtering (MongoDB geospatial)
13. **H3** - Load-shedding status widget
14. **H1** - Basic in-app chat
15. **H5** - Dark/light mode toggle

### Sprint 4: Community + Trust (Week 4 - Apr 24 - May 7)

> Community features that differentiate

16. **H2** - Community forum
17. **H7** - Verified provider system + badges
18. **H8** - Notification system
19. **M4** - Incident reporting
20. **M5** - Utility schedule tracker

### Sprint 5: Premium + Polish (May 7-21)

> Revenue features and launch prep

21. **M1** - Chameleon chat skins (Kasi Gold)
22. **M2** - Community calendar
23. **M3** - Water outage alerts
24. **M6** - Tutoring interface
25. Deploy to Vercel + kasilink.com domain config

### Post-Launch: Iterate (May 21+)

- L1-L7 based on user feedback
- M7 (AI agent orchestration) when scale demands it
- WhatsApp sharing for viral growth

---

## Domain Setup (kasilink.com)

1. Point kasilink.com DNS to Vercel (A record: 76.76.21.21, CNAME: cname.vercel-dns.com)
2. Configure domain in Vercel project settings
3. Update Clerk production instance with kasilink.com
4. Set `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and related env vars for production
5. Update `manifest.json` with kasilink.com URLs

---

## High-Demand Sector Targeting (Content Strategy)

Priority gig categories to seed the marketplace (based on SA labour data):

| Sector                 | Example Gigs                                   | Target Employers                       |
| ---------------------- | ---------------------------------------------- | -------------------------------------- |
| **Retail/FMCG**        | Shelf packing, till ops, stock control, promos | Shoprite, Boxer, Checkers, PnP         |
| **Construction**       | Labourer, site assistant, painter, helper      | Local contractors, housing projects    |
| **Healthcare**         | Care aide, pharmacy assistant, clinic admin    | Local clinics, pharmacies              |
| **Logistics/Delivery** | Courier, warehouse helper, packer              | Sixty60, local delivery hubs           |
| **Services**           | Car wash, tutoring, repairs, cleaning          | Individual providers, small businesses |

---

## Key Design References in /Structure

| Screen      | Dark Mode                       | Light Mode                       | Notes                                          |
| ----------- | ------------------------------- | -------------------------------- | ---------------------------------------------- |
| Auth        | `dark-Mode/stitch/auth/`        | `light-Mode/stitch/auth/`        | Phone-first, +27, OTP, load-shedding indicator |
| Home Feed   | `dark-Mode/stitch/home-feed/`   | `light-Mode/stitch/home-feed/`   | Nearby gigs, alerts, community                 |
| Marketplace | `dark-Mode/stitch/marketplace/` | `light-Mode/stitch/marketplace/` | Filters, cards, map view                       |
| Forum       | `dark-Mode/stitch/forum/`       | `light-Mode/stitch/forum/`       | Community Heartbeat                            |
| Chat        | `chat/stitch/`                  | -                                | WhatsApp, Discord, Instagram skins             |
| Features    | `features/stitch/`              | -                                | Calendar, water, verified providers            |
| Backend     | `backend-Framework/stitch/`     | -                                | Architecture diagrams                          |

---

## Verification Plan

After each sprint:

1. `npm run build` - Ensure no TypeScript/build errors
2. `npm run dev` - Manual smoke test of new pages
3. Test auth flow end-to-end (sign up, sign in, protected routes)
4. Test gig CRUD (create, read, update, delete) via API + UI
5. Test on mobile viewport (375px) - PWA installability
6. Lighthouse audit (Performance, Accessibility, PWA scores)
7. Pre-launch: Deploy preview to Vercel, test kasilink.com DNS resolution
   \*\*
