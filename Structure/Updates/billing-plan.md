# KasiLink Billing Plan

> Canonical billing reference for user plans, gating, and subscription logic.
> Last updated: 2026-04-05

## Purpose

This file defines how KasiLink billing should work for real users. It is not a throwaway planning note. It should remain visible in the Updates layer because it affects product access, pricing, and monetization.

## Plans Overview

| Plan | Plan Key | Trial | Monthly | Annually | Monthly (ZAR ~) |
| --- | --- | --- | --- | --- | --- |
| Kasi Link Free | `free` | — | — | — | Free |
| Kasi Link Plus | `kasi_link_plus` | 3 days | $4.65 | $36.00 | ~R87 |
| Retailer Pro | `retailer_pro` | 7 days | $7.00 | $72.00 | ~R131 |
| Retailer Premium | `retailer_premium` | 14 days | $14.66 | $156.00 | ~R275 |

> Confirm live ZAR rates before launch. Native ZAR pricing is preferred if supported by the billing provider.

## Plan Descriptions

### Kasi Link Free

- Always free
- Entry-level for job seekers
- Core browsing and application features

### Kasi Link Plus

- $4.65/month or $36.00/year
- 3-day free trial
- Enhanced seeker features such as priority listings, alerts, and profile boost

### Retailer Pro

- $7.00/month or $72.00/year
- 7-day free trial
- For small retailers and employers posting gigs

### Retailer Premium

- $14.66/month or $156.00/year
- 14-day free trial
- For high-volume hiring, featured listings, and analytics

## Gating Pattern

```ts
import { currentUser } from "@clerk/nextjs/server";

const user = await currentUser();
const plan = (user?.publicMetadata?.plan as string) || "free";

if (plan === "retailer_pro" || plan === "retailer_premium") {
  // show employer dashboard
}
```

```tsx
"use client";
import { useUser } from "@clerk/nextjs";

export function PremiumFeature() {
  const { user } = useUser();
  const plan = user?.publicMetadata?.plan as string;

  if (plan !== "retailer_premium") {
    return <UpgradePrompt />;
  }
  return <PremiumContent />;
}
```

## Billing Integration Notes

- Clerk uses Stripe under the hood.
- Planned routes:
  - `app/api/billing/create-checkout/route.ts`
  - `app/api/billing/create-portal/route.ts`
  - `app/api/webhooks/stripe/route.ts`
- Webhooks should sync `user.publicMetadata.plan`.

## Required Env Vars

```env
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_URL=https://kasilink.co.za
```

## Product Rules

- Phone OTP stays free across all plans.
- The free tier must remain genuinely useful.
- Paid tiers should improve posting, alerts, and employer tooling.
- Billing must support township affordability, not generic SaaS pricing only.

## Workflow

[index.md](index.md) -> [technical-Specifications.md](../technical-Specifications.md) -> [master-todo.md](master-todo.md) -> [billing-plan.md](billing-plan.md) -> [current-alignment-notes.md](current-alignment-notes.md) -> [task-board.md](task-board.md) -> [comms-log.md](comms-log.md) -> [dev-tracker.md](dev-tracker.md) -> [next-improvements.md](next-improvements.md) -> [reference-notes.md](reference-notes.md)

