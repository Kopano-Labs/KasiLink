# KasiLink

KasiLink is a mobile-first Progressive Web App (PWA) for South African township communities. It connects job seekers and informal businesses through local gigs, verified provider profiles, utility-aware planning (load-shedding and water outages), and lightweight in-app communication.

## What Problem This Solves

KasiLink is designed around township realities:

- local, short-distance work opportunities
- trust and verification before accepting work
- utility disruptions that affect planning and delivery
- fast access from low-end mobile devices via PWA support

## Core Features

- Gig marketplace with proximity and category filtering
- Create, browse, and apply for local gigs
- Verified provider directory and profile pages
- Community forum and community status reporting
- Utility-aware surfaces:
  - live load-shedding status endpoint integration
  - community-reported water alerts and utility schedules
- In-app chat conversations linked to gigs
- Notifications center (read/unread + push subscription persistence)
- Tutoring listings and local business spotlight pages
- PWA behavior with offline page and service worker registration

## Tech Stack

- Framework: Next.js 16 (App Router) + React 19 + TypeScript
- Styling: Tailwind CSS 4
- Auth: Clerk
- Database: MongoDB Atlas + Mongoose
- AI: Vercel AI SDK + xAI provider (`grok-4`) on `/api/grok`
- Telemetry: optional Braintrust tracing hooks

## Project Architecture

- UI routes are in `app/**/page.tsx` (marketplace, forum, profile, chat, utilities, tutoring, verified, etc.)
- API routes are in `app/api/**/route.ts`
- Data models are in `lib/models/*`
- Shared server utilities are in `lib/*` (`db`, validation, geo helpers, orchestration client)
- Middleware-like protection uses Clerk route matching in `proxy.ts`

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- MongoDB Atlas database
- Clerk application (for auth keys + webhook secret)

### 1) Install dependencies

```bash
npm install
```

### 2) Create local env file

```bash
cp .env.example .env.local
```

Then fill in at least the required variables in `.env.local`.

### 3) Run development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

### Required for baseline app

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend auth key |
| `CLERK_SECRET_KEY` | Clerk backend auth key |
| `CLERK_WEBHOOK_SECRET` | Verifies Clerk webhook signatures |
| `MONGODB_URI` | MongoDB Atlas connection string |

### Optional integrations

| Variable | Purpose |
| --- | --- |
| `KasiLinkAI_XAI_API_KEY` | Enables `/api/grok` AI chat route |
| `ESKOMSEPUSH_API_KEY` | Enables live load-shedding status fetch |
| `ORCH_BASE_URL` | Backend orchestration proxy target |
| `NEXT_PUBLIC_ORCH_BASE_URL` | Client-visible fallback orchestration base URL |
| `BRAINTRUST_API_KEY` / `NEXT_PUBLIC_BRAINTRUST_API_KEY` | Braintrust tracing |
| `BRAINTRUST_PROJECT_ID` | Braintrust project routing |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics instrumentation |

## Clerk Webhook Setup

Configure Clerk to send user lifecycle events to:

`/api/webhooks/clerk`

This route syncs Clerk users into MongoDB and keeps user state updated (`user.created`, `user.updated`, `user.deleted`).

## Seed Demo Data (Optional)

The project includes `scripts/seed.ts` for realistic South African sample data (gigs, forum posts, calendar events, water alerts).

```bash
npx tsx scripts/seed.ts
```

Notes:

- This script reads `MONGODB_URI` from `.env.local`.
- It refreshes seed-owned records and can be run repeatedly.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## API Surface (High-Level)

Representative endpoints:

- `/api/gigs` and `/api/gigs/[id]`
- `/api/applications` and `/api/applications/[id]`
- `/api/chat`, `/api/messages`, `/api/notifications`
- `/api/forum` and `/api/forum/[id]`
- `/api/users` and `/api/users/[id]`
- `/api/water-alerts`, `/api/utility-schedule`, `/api/load-shedding`
- `/api/spotlight`, `/api/tutoring`, `/api/incidents`
- `/api/orch/[...path]` (auth-forwarding proxy to orchestration backend)
- `/api/grok` (AI chat stream)

## Project Structure

```text
app/                # Next.js App Router pages + API routes
components/         # UI components (chat skins, profile, nav, widgets)
lib/                # DB, models, validation, logging, integrations
public/             # Static assets + PWA manifest/service worker assets
scripts/            # Seed and maintenance scripts
styles/             # Global styles and design tokens
tests/              # Validation/unit tests
Structure/          # Product/design/architecture working docs
```

## License

This project is licensed under the MIT License. See `LICENSE`.
