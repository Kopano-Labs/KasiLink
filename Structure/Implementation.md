# KasiLink Implementation Plan

**Domain:** kasilink.com (purchased)
**Target:** MVP End April 2026 | Community Mid May | Launch End May 2026
**Stack:** Next.js 16.2.1 | TypeScript | Tailwind CSS 4 | Clerk 7 | MongoDB Atlas | Vercel
**Design Source:** `/Structure` directory (68 files: HTML mockups, screenshots, design systems, architecture diagrams)

---

## Why This Exists

SA unemployment: 31.4%. Youth (15-24): 57%. 7.8 million unemployed. 80% in long-term structural trap. Township residents face transport costs, no networks, isolation from formal markets. Government programs (EPWP, PYEI) are temporary (<6 months), low pay, no progression. National job portals ignore kasi realities.

KasiLink solves the **proximity problem** - hyper-local gig matching within walking/taxi distance. No queues, no connections needed. Target: Gauteng townships first, then Cape Town, Durban.

High-demand sectors for seeding: Retail/FMCG (Shoprite, Boxer, Checkers), Construction (labourers, helpers), Healthcare (care aides, clinic admin), Logistics/Delivery (Sixty60, warehouse), Services (car wash, tutoring, repairs, cleaning).

---

## Current Codebase State (Audit Results)

### What Works
- Next.js 16.2.1 app shell with TypeScript + Tailwind CSS 4
- `components/JobCard.tsx` - renders a gig card (basic, unstyled for dark/light theme)
- `app/page.tsx` - fetches jobs from MongoDB, displays in grid
- `lib/jobs.ts` - `fetchJobs()` queries MongoDB `kasilink.jobs` collection
- `.env.local` has `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `MONGODB_URI`
- `app/globals.css` has basic Tailwind import + CSS variable scaffolding

### What's Broken
- **`lib/db.ts` is EMPTY** - `lib/jobs.ts` imports `clientPromise` from it but nothing is exported. App crashes at runtime.

### What's Empty (Stubs)
- `components/Navbar.tsx` - 0 lines
- `components/Footer.tsx` - 0 lines
- `components/ProfileCard.tsx` - 0 lines
- `app/profile/page.tsx` - 0 lines
- `lib/auth.config.ts` - 0 lines
- `lib/logger.ts` - 0 lines
- `lib/validation.ts` - 0 lines
- `tests/jobs.test.ts` - 0 lines
- `public/manifest.json` - 0 lines

### What Doesn't Exist
- `middleware.ts` (no Clerk route protection)
- `app/api/` directory (no API routes)
- `app/auth/` directory (no auth pages)
- `app/marketplace/` directory
- `app/chat/` directory
- `app/forum/` directory
- `public/Icons/` is empty (no icons)
- No theme provider, no dark/light toggle
- No PWA service worker

---

## Priority Classification

### CRITICAL (Blocks MVP - End April 2026)

---

#### C1: MongoDB Connection & Data Layer
**Why:** `lib/db.ts` is empty. `lib/jobs.ts` imports from it and crashes. Nothing works without this.

**Files to create/modify:**
- `lib/db.ts` - MongoDB client singleton using `mongodb` native driver

**Implementation:**
```
lib/db.ts:
- Import MongoClient from 'mongodb'
- Read MONGODB_URI from process.env
- Create singleton client with connection pooling
- Export clientPromise (cached in global for dev hot-reload)
- Database name: "kasilink"
```

**Collections to create in MongoDB Atlas:**
```
users {
  _id: ObjectId
  clerkId: string (indexed, unique)
  role: "seeker" | "provider" | "admin"
  name: string
  phone: string
  location: { type: "Point", coordinates: [lng, lat] }  // GeoJSON
  suburb: string
  township: string
  skills: string[]
  rating: number (default 0)
  totalGigs: number (default 0)
  verified: boolean (default false)
  createdAt: Date
  updatedAt: Date
}

gigs {
  _id: ObjectId
  providerId: string (clerkId, indexed)
  title: string
  description: string
  category: "retail" | "construction" | "healthcare" | "logistics" | "services" | "tutoring" | "other"
  subcategory: string
  location: { type: "Point", coordinates: [lng, lat] }  // GeoJSON 2dsphere index
  suburb: string
  township: string
  pay: { amount: number, type: "hourly" | "daily" | "fixed", currency: "ZAR" }
  duration: string  // "2 hours", "1 day", "ongoing"
  requirements: string[]
  slots: number (default 1)
  status: "open" | "assigned" | "in_progress" | "completed" | "cancelled"
  applicants: string[]  // clerkIds
  assignedTo: string[]  // clerkIds
  postedAt: Date
  startsAt: Date
  expiresAt: Date
}

applications {
  _id: ObjectId
  gigId: ObjectId (indexed)
  seekerId: string (clerkId, indexed)
  providerId: string (clerkId)
  status: "pending" | "accepted" | "rejected" | "withdrawn"
  message: string
  appliedAt: Date
  respondedAt: Date
}

reviews {
  _id: ObjectId
  gigId: ObjectId
  reviewerId: string (clerkId)
  revieweeId: string (clerkId)
  rating: number (1-5)
  comment: string
  createdAt: Date
}
```

**Indexes to create:**
```
gigs: { location: "2dsphere" }  // geospatial queries
gigs: { category: 1, status: 1 }
gigs: { providerId: 1 }
gigs: { postedAt: -1 }
users: { clerkId: 1 } unique
users: { location: "2dsphere" }
applications: { gigId: 1, seekerId: 1 } unique
```

**Dependencies to install:** `mongodb` (native driver, NOT mongoose - already used in lib/jobs.ts pattern)

---

#### C2: Design System Tokens + Global Styles
**Why:** `globals.css` has only basic scaffolding. Two complete themes designed in `/Structure` but not implemented. Every component depends on these tokens.

**Files to modify:**
- `app/globals.css` - complete design system

**Design System (from Structure mockups):**
```
DARK THEME (default):
  --background:        #000f1e
  --surface:           #001526
  --surface-container: #002139
  --surface-high:      #002843
  --on-surface:        #d4e8ff
  --primary:           #a5dbff
  --primary-dim:       #75c1ee
  --primary-container: #83cffd
  --on-primary-container: #004561
  --secondary:         #ffabef
  --secondary-container: #4a0047
  --tertiary:          #ffe3f7
  --tertiary-container: #ffcef4
  --error:             #ff716c
  --outline:           #577899
  --outline-variant:   rgba(87, 120, 153, 0.3)

LIGHT THEME (Ubuntu Pulse):
  --background:        #fffef5
  --surface:           #f5f3e0
  --surface-container: #ebe8d0
  --on-surface:        #1a1a00
  --primary:           #f1e259
  --primary-dim:       #ffd415
  --secondary:         #d1a10a
  --tertiary:          #adac00
  --error:             #ba1a1a
  --outline:           #807040

TYPOGRAPHY:
  --font-headline: 'Source Serif 4', serif
  --font-body:     'DM Sans', 'Public Sans', sans-serif
  --font-label:    'Lexend', sans-serif

BORDER RADIUS:
  --radius-sm: 0.25rem
  --radius-md: 0.5rem
  --radius-lg: 0.75rem
  --radius-xl: 1rem
  --radius-full: 9999px
```

**Tailwind theme config** (via `@theme inline` in globals.css for Tailwind v4):
```
Map all CSS variables to Tailwind tokens:
  --color-primary: var(--primary)
  --color-secondary: var(--secondary)
  --color-surface: var(--surface)
  etc.
```

**Google Fonts to load in layout.tsx:**
- Source Serif 4 (headlines)
- DM Sans (body)
- Lexend (labels/buttons)

**Utility classes to define:**
```css
.glass-panel { backdrop-filter: blur(12px); background: rgba(0,15,30,0.8); }
.message-shadow { box-shadow: 0 1px 0.5px rgba(0,0,0,0.13); }
.grid-pattern { background-image: radial-gradient(circle, var(--outline) 1px, transparent 1px); }
.no-scrollbar::-webkit-scrollbar { display: none; }
```

---

#### C3: Navbar + Footer + Layout Shell
**Why:** Empty stubs. Users cannot navigate between pages. The layout lacks Clerk provider wrapping.

**Files to modify:**
- `app/layout.tsx` - wrap with ClerkProvider, add fonts, add Navbar/Footer
- `components/Navbar.tsx` - full implementation
- `components/Footer.tsx` - full implementation

**Navbar (from mockup - `dark-Mode/stitch/home_feed_dark_mode/code.html`):**
```
Structure:
  <header> fixed top-0, h-16, bg-slate-950/95 backdrop-blur, z-50
    Left:   location_on icon + "KasiLink" (Source Serif 4 headline)
    Right:  notifications icon (bell) + user avatar (Clerk <UserButton />)

Mobile bottom nav (fixed bottom-0, h-20, bg-slate-950/95 backdrop-blur):
  5 tabs:
    - Home     (home icon)        → /
    - Gigs     (work icon)        → /marketplace
    - Post     (add_circle icon)  → /gigs/new  (FAB style, larger, primary colored)
    - Chat     (chat icon)        → /chat
    - Profile  (person icon)      → /profile

  Active state:  bg-sky-500/10 text-sky-400
  Inactive:      text-slate-500 hover:text-sky-300
```

**Footer (minimal for MVP):**
```
Desktop only (hidden on mobile where bottom nav shows):
  Links: About, Privacy, Terms, Contact
  "Made in Kasi" tagline
```

**Layout.tsx changes:**
```tsx
import { ClerkProvider } from '@clerk/nextjs'
// Wrap children with ClerkProvider
// Import and add Source Serif 4, DM Sans, Lexend fonts
// Add <Navbar /> above {children}
// Add padding: pt-20 pb-24 (account for fixed nav bars)
// Add <html> dark class for default dark mode
```

---

#### C4: Clerk Auth Flow (Phone-first OTP)
**Why:** No auth = no users. Phone-first is essential - 95%+ of township users have phones but many lack email. Design mockup exists.

**Files to create/modify:**
- `middleware.ts` - Clerk route protection
- `app/auth/sign-in/[[...sign-in]]/page.tsx` - custom sign-in page
- `app/auth/sign-up/[[...sign-up]]/page.tsx` - custom sign-up page
- `app/api/webhooks/clerk/route.ts` - sync Clerk users to MongoDB
- `.env.local` - add sign-in/sign-up URL env vars

**Middleware (route protection):**
```
Public routes (no auth required):
  /
  /marketplace
  /auth/sign-in
  /auth/sign-up
  /api/webhooks/clerk

Protected routes (auth required):
  /profile
  /gigs/new
  /chat
  /api/gigs (POST, PUT, DELETE)
  /api/applications
```

**Sign-in page (from `Structure/dark-Mode/stitch/auth_dark_mode/code.html`):**
```
Layout:
  - Centered card (max-w-md) with glass-panel styling
  - Top: Stage indicator (load-shedding status placeholder)
  - KasiLink logo + "Welcome back" headline (Source Serif 4)
  - Subtitle: "Securely access your township network and local opportunities"
  - Clerk <SignIn /> component with appearance customization:
    - Phone-first (phoneNumber strategy primary)
    - +27 country prefix default
    - Social: Google, WhatsApp
    - Colors mapped to design tokens
  - Footer: "New here? Create account" link
  - Background: grid-pattern with gradient blobs
```

**Clerk webhook (user sync to MongoDB):**
```
POST /api/webhooks/clerk
  On user.created:
    Insert into users collection: { clerkId, name, phone, role: "seeker", ... }
  On user.updated:
    Update users collection matching clerkId
  On user.deleted:
    Mark user inactive (soft delete)
  Verify webhook signature via Clerk SDK
```

**Env vars to add:**
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/profile
CLERK_WEBHOOK_SECRET=whsec_...
```

---

#### C5: API Routes - Gig CRUD + Users
**Why:** No API routes exist. The marketplace loop (post, browse, apply) requires server endpoints.

**Files to create:**
```
app/api/gigs/route.ts           → GET (list/search), POST (create)
app/api/gigs/[id]/route.ts      → GET (single), PUT (update), DELETE
app/api/users/route.ts           → GET (current user profile)
app/api/users/[id]/route.ts     → GET (public profile), PUT (update own)
app/api/applications/route.ts    → GET (list), POST (apply)
app/api/applications/[id]/route.ts → PUT (accept/reject), DELETE (withdraw)
```

**GET /api/gigs (marketplace query):**
```
Query params:
  ?category=retail
  ?search=car+wash
  ?lat=-26.2&lng=28.0&radius=5  (km, uses MongoDB $geoNear)
  ?status=open
  ?sort=newest|nearest|pay_high
  ?page=1&limit=20

Response: { gigs: [...], total: number, page: number }

Implementation:
  - Parse query params
  - Build MongoDB aggregation pipeline
  - If lat/lng provided: use $geoNear as first stage (2dsphere index)
  - Filter by status, category
  - Text search on title/description if search param
  - Sort + paginate
  - Return serialized results
```

**POST /api/gigs (create gig):**
```
Auth: Required (Clerk userId from auth())
Body: { title, description, category, location, pay, duration, requirements, slots, startsAt }
Validation:
  - title: required, 5-100 chars
  - description: required, 10-500 chars
  - category: must be valid enum
  - pay.amount: required, > 0
  - location: required, valid coordinates
Logic:
  - Get clerkId from auth()
  - Verify user exists in users collection
  - Set status: "open", postedAt: new Date()
  - Insert into gigs collection
  - Return created gig
```

**POST /api/applications (apply to gig):**
```
Auth: Required
Body: { gigId, message }
Validation:
  - Cannot apply to own gig
  - Cannot apply twice (unique index)
  - Gig must be status: "open"
  - Gig slots not full
Logic:
  - Insert application with status: "pending"
  - Push seekerId into gig.applicants array
  - Return application
```

**PUT /api/applications/[id] (accept/reject):**
```
Auth: Required (must be gig provider)
Body: { status: "accepted" | "rejected" }
Logic:
  - If accepted: push seekerId to gig.assignedTo, update gig status if slots filled
  - If rejected: remove from applicants
```

---

#### C6: Home Feed Page
**Why:** `app/page.tsx` currently duplicates the jobs page. Needs to be the landing experience per mockup.

**Files to modify:**
- `app/page.tsx` - complete rewrite

**Layout (from `Structure/dark-Mode/stitch/home_feed_dark_mode/code.html`):**
```
Sections (top to bottom):
1. SYSTEM STATUS CARD
   - Load-shedding stage indicator (pulsing dot + "Stage X Active")
   - Error-colored (red) background when active
   - Next slot time display
   - "View Schedule" link

2. HORIZONTAL ALERTS SCROLL
   - Cards: min-w-[280px], overflow-x-auto, gap-4
   - Alert types: community patrol, clinic queue, safety update
   - Each card: icon + title + description + action button
   - glass-panel styling

3. LOCAL HERO SECTION
   - Success story card (16:10 aspect ratio with image)
   - Gradient overlay with text
   - "Success Story" badge
   - Community member name + story snippet

4. NEARBY GIGS GRID
   - Section header: "Available Near You" + "See All" link (→ /marketplace)
   - Grid: 1 col mobile, 2 col md
   - Each gig card: icon + title + distance + rating stars + pay
   - "View Gig" button
   - Max 4-6 gigs shown (nearest, newest)

5. COMMUNITY HIGHLIGHTS
   - Latest forum posts preview (2-3 items)
   - "Join the conversation" CTA → /forum
```

**Data fetching:**
```
Server component (async):
  - Fetch 6 nearest open gigs (from /api/gigs?sort=nearest&limit=6)
  - Fetch latest 3 forum posts (from /api/posts?limit=3)
  - Load-shedding status: placeholder/static for MVP (API integration later)
```

---

#### C7: Marketplace Page (Browse + Filter + Search)
**Why:** Core feature - seekers find gigs here. Without it, no marketplace.

**Files to create:**
- `app/marketplace/page.tsx`
- `components/GigCard.tsx` (enhanced version of JobCard)
- `components/SearchBar.tsx`
- `components/CategoryChips.tsx`

**Layout (from `Structure/dark-Mode/stitch/marketplace_dark_mode/code.html`):**
```
1. HEADER
   - "Find your next hustle" (Source Serif 4, headline)
   - Subtitle with location context

2. SEARCH BAR + FILTER
   - Search input: bg-surface-container, rounded-full, search icon left
   - Filter button: square, filter_list icon → opens filter sheet

3. CATEGORY CHIPS (horizontal scroll)
   - All | Retail | Construction | Healthcare | Delivery | Services | Tutoring
   - Active: bg-primary text-on-primary-container
   - Inactive: bg-surface-container text-on-surface border border-outline-variant

4. GIGS GRID
   - 1 col mobile, 2 col md
   - Featured gigs (larger cards with images at top, h-48)
   - Standard gigs (compact cards)
   - Each card:
     - Image (if available) with hover scale-110 transition
     - Price badge: bg-slate-950/80 backdrop-blur, top-right overlay
     - Category tag: colored per category
     - Title (font-headline)
     - Distance: distance icon + "2.3 km"
     - Rating: star icons (filled yellow) + count
     - "View Gig" button: bg-primary text-on-primary-container rounded-full
   - Promotion banner: full-width gradient card for premium features

5. PAGINATION / INFINITE SCROLL
   - Load more button or intersection observer
```

**GigCard.tsx props:**
```typescript
interface GigCardProps {
  _id: string
  title: string
  description: string
  category: string
  location: { suburb: string, township: string }
  distance?: number  // km, from geo query
  pay: { amount: number, type: string, currency: string }
  rating: number
  totalApplicants: number
  slots: number
  postedAt: Date
  featured?: boolean
}
```

**Client-side interactivity:**
```
- Category chip selection → re-fetches with ?category=X
- Search input (debounced 300ms) → re-fetches with ?search=X
- URL params synced with state (shareable URLs)
- Geolocation API: request user position → pass lat/lng for distance sorting
```

---

#### C8: Gig Posting Flow (Provider Side)
**Why:** Two-sided marketplace. Providers must post gigs or seekers have nothing to browse.

**Files to create:**
- `app/gigs/new/page.tsx` - gig posting form
- `app/gigs/[id]/page.tsx` - gig detail + apply
- `lib/validation.ts` - form validation schemas

**Gig posting form:**
```
Protected route (auth required, role check)

Form fields:
  - Title (text, required, 5-100 chars)
  - Category (select dropdown: retail, construction, healthcare, logistics, services, tutoring, other)
  - Description (textarea, required, 10-500 chars)
  - Location (text input for suburb/township + optional map pin)
  - Pay amount (number input, ZAR)
  - Pay type (radio: per hour / per day / fixed)
  - Duration (text: "2 hours", "full day", "ongoing")
  - Requirements (tag input, optional)
  - Number of slots (number, default 1)
  - Start date/time (datetime picker)

Submit: POST /api/gigs
Success: redirect to /gigs/[id]
```

**Gig detail page (`app/gigs/[id]/page.tsx`):**
```
Fetch gig by ID from MongoDB
Display:
  - Full gig details (title, description, category, pay, location, requirements)
  - Provider info card (name, rating, total gigs, verified badge)
  - Distance from user (if geolocation available)
  - "Apply Now" button (if seeker, not own gig, not already applied)
  - Application form: textarea for message
  - List of applicants (if provider viewing own gig)
  - Accept/Reject buttons per applicant (provider only)
  - Status badge (open/assigned/in_progress/completed)
```

**Validation (`lib/validation.ts`):**
```typescript
// Simple validation functions (no external lib needed for MVP)
export function validateGig(data: unknown): { valid: boolean, errors: Record<string, string> }
export function validateApplication(data: unknown): { valid: boolean, errors: Record<string, string> }
export function sanitizeInput(text: string): string  // strip HTML, trim
```

---

#### C9: User Profile (Seeker + Provider)
**Why:** Empty stub. Users need profiles to apply for gigs and to be discovered.

**Files to modify/create:**
- `app/profile/page.tsx` - own profile dashboard
- `app/profile/edit/page.tsx` - edit profile form
- `app/profile/[id]/page.tsx` - public profile view
- `components/ProfileCard.tsx` - reusable profile display

**Own profile dashboard:**
```
Protected route (auth required)

Sections:
  - Profile header: avatar (Clerk), name, role badge, location, rating stars
  - Stats row: total gigs | rating | member since
  - Skills tags (editable)
  - "Edit Profile" button

  IF SEEKER:
    - "My Applications" list (pending, accepted, rejected)
    - Each application: gig title, status badge, applied date, provider name
    - Link to gig detail

  IF PROVIDER:
    - "My Posted Gigs" list (open, assigned, completed)
    - Each gig: title, applicants count, status, posted date
    - Link to gig detail / manage applicants
    - "Post New Gig" CTA button
```

**Edit profile form:**
```
Fields:
  - Name (from Clerk, may be read-only)
  - Role toggle: Seeker / Provider (can be both? or switch?)
  - Township / Suburb (text inputs)
  - Skills (tag input with suggestions: cleaning, driving, cooking, tutoring, plumbing, painting, packing, etc.)
  - Bio (textarea, optional)

Submit: PUT /api/users/me
```

**ProfileCard.tsx:**
```
Compact card for embedding in gig details, forum posts, etc.
Props: name, avatar, role, rating, totalGigs, verified, township
```

---

#### C10: PWA Manifest + Installability
**Why:** Township users need installability (home screen icon), offline awareness, and low data usage. Empty manifest.

**Files to modify/create:**
- `public/manifest.json`
- `app/layout.tsx` - add manifest link + meta tags
- `next.config.ts` - PWA headers

**manifest.json:**
```json
{
  "name": "KasiLink",
  "short_name": "KasiLink",
  "description": "Find local gigs and services in your kasi",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000f1e",
  "theme_color": "#a5dbff",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Meta tags for layout.tsx:**
```html
<meta name="theme-color" content="#000f1e" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="manifest" href="/manifest.json" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
```

**Icons needed:** Generate 192x192 and 512x512 PNG icons (KasiLink logo - link icon in primary blue on dark bg)

---

### HIGH (Core Experience - Mid May 2026)

---

#### H1: Location-Based Filtering (Geospatial)
**Why:** The entire value prop is "gigs near you." Without geo, KasiLink is just another job board. 57% youth unemployment + transport costs = proximity is everything.

**Implementation:**
```
1. MongoDB 2dsphere index on gigs.location (already in C1 schema)
2. Browser Geolocation API: navigator.geolocation.getCurrentPosition()
   - Prompt user on first visit
   - Cache in localStorage
   - Fallback: manual township/suburb entry
3. API: GET /api/gigs?lat=X&lng=X&radius=5
   - MongoDB $geoNear aggregation stage
   - Returns gigs sorted by distance, includes distance field
4. UI: distance badge on each GigCard ("1.2 km away")
5. Suburb/township predefined list for manual selection:
   Soweto, Alexandra, Tembisa, Katlehong, Diepsloot, Ivory Park,
   Orange Farm, Soshanguve, Mamelodi, Thembisa, etc.
```

---

#### H2: Gig Application Workflow
**Why:** The complete lifecycle (apply → review → assign → track → complete → review) is what makes this a marketplace, not just a listings board.

**Flow (from `Structure/backend-Framework/stitch/gig_posting_life_cycle/code.html`):**
```
Step 1: Provider Posts Gig → status: "open"
Step 2: Seeker Discovers & Applies → application: "pending", gig: applicants[]
Step 3: Provider Reviews & Assigns → application: "accepted"/"rejected", gig: assignedTo[]
Step 4: Real-time Chat Coordination → (H3: Chat, later sprint)
Step 5: Gig Execution → gig status: "in_progress"
Step 6: Completion & Review → gig status: "completed", reviews created

Status transitions:
  Gig: open → assigned → in_progress → completed | cancelled
  Application: pending → accepted | rejected | withdrawn
```

**UI additions:**
```
Gig detail page:
  - Provider view: applicant list with accept/reject buttons
  - Seeker view: application status tracker (pending/accepted/rejected)
  - Both: "Mark as Complete" button when in_progress
  - Post-completion: rating + review form (1-5 stars + comment)
```

---

#### H3: In-App Chat (Basic)
**Why:** Gig coordination requires direct messaging between provider and seeker after application is accepted.

**Files to create:**
```
app/chat/page.tsx           → conversation list
app/chat/[id]/page.tsx      → individual chat
app/api/messages/route.ts   → GET messages, POST send
```

**MVP approach (polling, not WebSocket):**
```
Messages collection:
  { senderId, receiverId, gigId, content, sentAt, read: boolean }

Chat list page:
  - List of conversations grouped by gig
  - Each item: other person's name + gig title + last message preview + unread count
  - Sorted by most recent message

Chat view (from Structure/chat/stitch/chat_whatsapp_skin/code.html):
  - Trust layer header: gig title + status + verified badge
  - Message bubbles:
    - Outgoing: bg-on-primary-container, rounded-xl rounded-tr-none, right-aligned
    - Incoming: bg-surface-container-highest, rounded-xl rounded-tl-none, left-aligned
    - Max-width: 85%
    - Timestamp below each message
  - Input area: bg-surface-container rounded-full, send button
  - Poll for new messages every 5s (upgrade to WebSocket/SSE in M1)
```

---

#### H4: Community Forum (Community Heartbeat)
**Why:** Safety tips, load-shedding coordination, success stories. Builds trust and retention. Designed in both themes.

**Files to create:**
```
app/forum/page.tsx
app/api/posts/route.ts
app/api/posts/[id]/route.ts
components/ForumPost.tsx
```

**Forum (from `Structure/dark-Mode/stitch/forum_dark_mode/code.html`):**
```
Posts collection:
  { authorId, title, content, category: "story"|"safety"|"loadshedding"|"general",
    imageUrl?, likes: number, likedBy: string[], comments: [...], createdAt }

Page layout:
  - "Community Heartbeat" headline
  - Filter chips: All Stories | Safety Tips | Load-shedding (horizontal scroll)
  - Alert card (pinned): Stage X coordination, "Join Patrol" button, participant count
  - Feed:
    - Post card: avatar + name + timestamp
    - Content text
    - Image (16:9, optional)
    - "Success Story" badge (if tagged)
    - Engagement: heart (favorite), comment (chat_bubble), share (WhatsApp)
    - WhatsApp share: bg-[#25D366]/10 text-[#25D366]
  - FAB: "New Post" button
```

---

#### H5: Load-Shedding Status Widget
**Why:** SA-specific differentiator. Appears on home feed, chat, forum. Shows real awareness of kasi life.

**Implementation:**
```
components/LoadSheddingWidget.tsx

MVP approach:
  - Static/configurable stage display (manual update or simple API)
  - Future: integrate EskomSePush API or similar

Display:
  - Pulsing red dot + "Stage X Active" text
  - Next scheduled slot time
  - "View Schedule" expandable
  - Error-colored when active (bg-error/10 border-error)
  - Appears: home feed (top), chat trust layer, forum alert card
```

---

#### H6: Dark/Light Mode Toggle
**Why:** Both themes fully designed. Ubuntu Pulse (light) is distinct identity. User preference matters.

**Files to create:**
- `components/ThemeProvider.tsx` - context + localStorage persistence
- Theme toggle button in Navbar

**Implementation:**
```
- ThemeProvider wraps app in layout.tsx
- Reads preference from localStorage, falls back to system preference
- Toggles 'dark' class on <html>
- All CSS variables switch via :root vs .dark :root
- Toggle button: palette icon in navbar (from mockup)
- Persist choice in localStorage('kasilink-theme')
```

---

#### H7: Verified Provider System
**Why:** Trust is the #1 barrier in townships. "Depend on who u know" per social media sentiment. Verification combats this.

**Implementation:**
```
User model: verified: boolean, verifiedAt: Date

MVP verification criteria:
  - Completed 5+ gigs
  - Average rating >= 4.0
  - Phone verified (via Clerk)
  - Auto-verified when criteria met (cron or on-review-submit check)

UI elements:
  - verified icon (blue checkmark) on ProfileCard, GigCard, chat
  - "Verified Provider" badge styling: bg-primary/10 text-primary
  - Verified Providers directory page (from Structure/features): /verified
  - Filter marketplace by verified only
```

---

#### H8: Notification System
**Why:** Users need to know when someone applies, gets accepted, or when safety alerts fire.

**Implementation (MVP - in-app only):**
```
Notifications collection:
  { userId, type, title, message, link, read: boolean, createdAt }

Types:
  - "application_received" (provider gets notified)
  - "application_accepted" / "application_rejected" (seeker)
  - "gig_completed" (both parties)
  - "new_review" (reviewee)
  - "safety_alert" (all users in area)

API: GET /api/notifications (paginated, sorted by createdAt desc)
     PUT /api/notifications/[id] (mark read)

UI: Bell icon in navbar with unread count badge
    Dropdown/page showing notification list
```

---

### MEDIUM (Differentiation - End May 2026)

| # | Task | Detail |
|---|------|--------|
| M1 | **Chameleon Chat Skins** | Premium feature. 3 skins (WhatsApp, Discord, Instagram) fully designed in `Structure/chat/`. Skin selector UI exists. Revenue via "Kasi Gold" subscription. Requires theme context per chat view. |
| M2 | **Community Calendar** | Local events, markets, job fairs. Mockup in `Structure/features/`. Calendar view with event cards. CRUD API for events. |
| M3 | **Water Outage Alerts** | Utility disruption tracking. Mockup exists. Similar pattern to load-shedding widget. Report + view outages by area. |
| M4 | **Incident Reporting** | Safety: report crimes, emergencies, suspicious activity. Mockup in `Structure/sub-features/`. Location-tagged, anonymous option. |
| M5 | **Utility Schedule Tracker** | Combined load-shedding + water schedule view. Mockup exists. Calendar/timeline UI. |
| M6 | **Tutoring Interface** | Education vertical. Session booking, tutor profiles, subject matching. Mockup in `Structure/tutoring/`. Extends gig model with education-specific fields. |
| M7 | **Agent Orchestration** | AI-powered gig matching. Architecture in `Structure/backend-Framework/`. Gemini/Grok/Claude adapters. Only implement when scale demands smarter matching. |

### LOW (Post-Launch)

| # | Task | Detail |
|---|------|--------|
| L1 | **Local Business Spotlight** | Business profiles/directory. Mockup exists. |
| L2 | **Privacy Policy Pages** | Legal compliance. Template-based. POPIA (SA data protection) considerations. |
| L3 | **Audit Logger** | `lib/logger.ts` - track API calls, user actions for admin. |
| L4 | **Admin Dashboard** | System moderation, user management, global alerts. User tier: Admin from architecture diagram. |
| L5 | **WhatsApp/Slack/Discord Bridges** | External messaging integration. Architecture exists in `Structure/backend-Framework/`. |
| L6 | **Analytics Dashboard** | Track DAU (target 5k month 1), gigs completed (target 1k/month), viral coefficient. |
| L7 | **Test Suite** | Unit + integration tests. `tests/jobs.test.ts` is empty. Add after MVP stabilizes. |

---

## Execution Order (Sprint Plan)

### Sprint 1: Foundation (Apr 3-10)
> Goal: App is navigable, authenticated, and connected to data

| Order | Task | Depends On | Deliverable |
|-------|------|-----------|-------------|
| 1 | **C1** MongoDB connection + schemas | - | `lib/db.ts` exports working clientPromise, collections created with indexes |
| 2 | **C2** Design system tokens | - | `globals.css` with full dark/light token set, utility classes, fonts loaded |
| 3 | **C3** Navbar + Footer + Layout | C2 | Fixed top nav, bottom mobile nav, ClerkProvider wrapping, page padding |
| 4 | **C4** Clerk auth flow | C1, C3 | Sign-in/sign-up pages, middleware, webhook syncing users to MongoDB |
| 5 | **C10** PWA manifest | C2 | Installable PWA with icons, theme color, standalone display |

**Sprint 1 verification:**
- `npm run build` passes
- Visit `/auth/sign-in` → see styled login page with phone input
- Sign up → user appears in MongoDB `users` collection
- Bottom nav visible on mobile viewport (375px)
- Can install as PWA on Android Chrome

---

### Sprint 2: Core Marketplace (Apr 10-17)
> Goal: Complete post-browse-apply loop working end-to-end

| Order | Task | Depends On | Deliverable |
|-------|------|-----------|-------------|
| 6 | **C5** API routes (gig CRUD + users) | C1, C4 | All endpoints functional, auth-protected where needed |
| 7 | **C8** Gig posting form | C5 | Provider can create gig via form, saved to MongoDB |
| 8 | **C7** Marketplace page | C5 | Browse gigs with category filter, search, distance display |
| 9 | **C6** Home feed | C5 | Landing page with nearby gigs, alerts placeholder, success story |
| 10 | **C9** User profile | C5, C4 | View own profile, edit, see applications/posted gigs |

**Sprint 2 verification:**
- Create gig as provider → appears in marketplace
- Search/filter gigs by category
- View gig detail page with full info
- Profile shows posted gigs (provider) or applications (seeker)
- Home feed loads with nearest gigs

---

### Sprint 3: Engagement Layer (Apr 17-24)
> Goal: Full gig lifecycle + location + chat

| Order | Task | Depends On | Deliverable |
|-------|------|-----------|-------------|
| 11 | **H2** Gig application workflow | C5 | Apply, accept/reject, status tracking, completion, reviews |
| 12 | **H1** Location-based filtering | C5, C7 | Geolocation prompt, distance sorting, radius filter |
| 13 | **H5** Load-shedding widget | C2 | Component on home feed + forum, stage display |
| 14 | **H3** Basic in-app chat | C4, H2 | Message after application accepted, polling-based |
| 15 | **H6** Dark/light mode toggle | C2 | ThemeProvider, toggle in navbar, localStorage persistence |

**Sprint 3 verification:**
- Apply to gig → provider sees applicant → accept → chat unlocked
- Location permission → gigs sorted by distance with km badge
- Complete gig → review prompt → rating saved
- Toggle theme → all pages render correctly in both modes
- Load-shedding widget displays on home feed

---

### Sprint 4: Community + Trust (Apr 24 - May 7)
> Goal: Community features and trust layer

| Order | Task | Depends On | Deliverable |
|-------|------|-----------|-------------|
| 16 | **H4** Community forum | C4, C2 | Forum page with posts, filters, engagement, WhatsApp share |
| 17 | **H7** Verified provider system | H2 | Auto-verification, badge display, verified filter |
| 18 | **H8** Notification system | C4 | In-app notifications, bell icon with unread count |
| 19 | **M4** Incident reporting | C4, H1 | Report form, location-tagged, anonymous option |
| 20 | **M5** Utility schedule tracker | H5 | Combined schedule view for load-shedding + water |

**Sprint 4 verification:**
- Post to forum → appears in feed → like/comment/share
- Complete 5 gigs with 4+ rating → verified badge appears
- Apply to gig → provider gets notification
- Report incident → pinned on community feed

---

### Sprint 5: Premium + Deploy (May 7-21)
> Goal: Revenue features + production deployment to kasilink.com

| Order | Task | Depends On | Deliverable |
|-------|------|-----------|-------------|
| 21 | **M1** Chameleon chat skins | H3 | Skin selector, 3 themes, Kasi Gold gate |
| 22 | **M2** Community calendar | H4 | Event CRUD, calendar view |
| 23 | **M3** Water outage alerts | M5 | Report + view water disruptions |
| 24 | **M6** Tutoring interface | C5 | Session booking, tutor profiles |
| 25 | **Deploy** kasilink.com | All | Vercel production, DNS, Clerk prod instance |

---

## Domain Setup (kasilink.com)

```
1. DNS Configuration (at domain registrar):
   A Record:     @  →  76.76.21.21
   CNAME Record: www → cname.vercel-dns.com

2. Vercel Project Settings:
   - Add kasilink.com as production domain
   - Add www.kasilink.com as redirect → kasilink.com
   - SSL auto-provisioned by Vercel

3. Clerk Production:
   - Create production instance in Clerk dashboard
   - Set allowed origins: https://kasilink.com
   - Update env vars with production keys

4. Environment Variables (Vercel):
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   MONGODB_URI=mongodb+srv://...
   CLERK_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up

5. MongoDB Atlas:
   - Whitelist Vercel IP ranges (or 0.0.0.0/0 with strong auth)
   - Create production database: kasilink
   - Create indexes per C1 specification
```

---

## Sector Seeding Strategy

To bootstrap a two-sided marketplace, seed these gig categories (based on SA labour demand data):

| Priority | Sector | Seed Gigs | Target Suburbs |
|----------|--------|-----------|---------------|
| 1 | **Retail/FMCG** | Shelf packing (R150/day), till assistance (R120/day), stock counting (R200/day), promo staff (R180/day) | Near Shoprite/Boxer/Checkers in Soweto, Alex, Tembisa |
| 2 | **Services** | Car wash (R80/car), house cleaning (R250/day), garden service (R200/day), cooking (R150/event) | Residential areas adjacent to townships |
| 3 | **Construction** | Painting helper (R200/day), site cleanup (R150/day), brick carrying (R180/day) | Active construction zones in Gauteng |
| 4 | **Logistics** | Last-mile delivery (R25/trip), warehouse packing (R160/day) | Near malls, distribution centres |
| 5 | **Healthcare** | Clinic admin support (R180/day), elderly care (R200/day) | Near public clinics, retirement facilities |

**Launch marketing angle:** "57% youth unemployment? Find gigs 5 km away today. No CV needed."

---

## Dependencies to Install

```bash
npm install mongodb                    # Database driver (already used in lib/jobs.ts pattern)
npm install svix                       # Clerk webhook verification
```

All other dependencies (Clerk, Next.js, React, Tailwind) are already in package.json.

---

## Key Design References

| Screen | Mockup Location | Key Elements |
|--------|----------------|-------------|
| Auth | `Structure/dark-Mode/stitch/auth_dark_mode/` | Glass panel, +27 phone input, OTP, grid pattern bg |
| Home Feed | `Structure/dark-Mode/stitch/home_feed_dark_mode/` | Status card, horizontal alerts, gig grid, bottom nav |
| Marketplace | `Structure/dark-Mode/stitch/marketplace_dark_mode/` | Search bar, category chips, gig cards with images, price badges |
| Forum | `Structure/dark-Mode/stitch/forum_dark_mode/` | Filter chips, alert card, post feed, engagement buttons |
| Chat | `Structure/chat/stitch/chat_whatsapp_skin/` | Trust layer header, message bubbles, input area |
| Gig Lifecycle | `Structure/backend-Framework/stitch/gig_posting_life_cycle/` | 6-step flow: post → discover → review → chat → execute → complete |
| User Tiers | `Structure/backend-Framework/stitch/user_tier_flowchart/` | Seeker/Provider/Admin swimlanes, core layer modules |
| Verified Providers | `Structure/features/stitch/verified_posters_directory/` | Directory, profiles, search results |
| Light Theme | `Structure/light-Mode/stitch/*/` | All screens in Ubuntu Pulse yellow theme |
