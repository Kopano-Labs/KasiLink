---
title: KasiLink Billing Plan
created: 2026-04-05
updated: 2026-04-05
author: Codex
tags:
  - billing
  - pricing
  - payments
  - subscriptions
  - security
  - commerce
priority: critical
audience:
  - lead
  - owner
  - devs
status: active
---

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

KasiLink should not assume Stripe as the primary South Africa billing rail.
Stripe’s public availability docs show South Africa only in an extended-network context, while Paystack and Yoco explicitly support South African merchants and payment channels. The billing layer should therefore be built as a provider-agnostic orchestration layer that can plug into whichever processor is actually approved for the business setup.

### Recommended architecture

- Build a local `lib/payments/` abstraction for checkout, subscription, portal, webhook handling, and plan sync.
- Keep the provider adapter isolated so Stripe, Paystack, Yoco, or another SA-approved provider can be swapped without rewriting the app.
- Store plan state in Clerk metadata, but never trust the client to set plan entitlements.
- Use signed webhooks to confirm payment completion before enabling paid features.
- Prefer hosted checkout or hosted payment pages over raw card handling inside KasiLink.
- Treat payment failures, retries, refunds, and subscription cancellation as first-class flows.

### Planned routes

- `app/api/billing/create-checkout/route.ts`
- `app/api/billing/create-portal/route.ts`
- `app/api/billing/webhook/route.ts`

### Webhook responsibilities

- Verify signature before accepting the event.
- Map payment intent / subscription state to `user.publicMetadata.plan`.
- Idempotently ignore duplicate webhook deliveries.
- Log success and failure through the shared logger.

### Security baseline

- Keep card data off KasiLink servers wherever possible.
- Require HTTPS, signature verification, idempotency keys, and server-side entitlement checks.
- Rate-limit billing endpoints.
- Record audit events for plan changes, cancellations, and failed payments.
- Add CSRF protection for any browser-initiated billing action that touches authenticated state.

### Provider notes

- Stripe: useful only if the account structure and regional availability are confirmed for the business.
- Paystack: explicitly supports South Africa and local payment channels.
- Yoco: South Africa-focused merchant tooling and card processing.

### What not to do

- Do not hard-code Stripe as the only option.
- Do not process raw card data in KasiLink.
- Do not trust client-side plan flags.
- Do not wire billing directly into user-facing UI without a server-side verification step.

## Required Env Vars

```env
PAYMENTS_PROVIDER=paystack|yoco|stripe
PAYMENTS_SECRET_KEY=...
PAYMENTS_WEBHOOK_SECRET=...
NEXT_PUBLIC_URL=https://kasilink.co.za
```

## Product Rules

- Phone OTP stays free across all plans.
- The free tier must remain genuinely useful.
- Paid tiers should improve posting, alerts, and employer tooling.
- Billing must support township affordability, not generic SaaS pricing only.

## Workflow

[index.md](index.md) -> [technical-Specifications.md](../technical-Specifications.md) -> [master-todo.md](master-todo.md) -> [billing-plan.md](billing-plan.md) -> [current-alignment-notes.md](current-alignment-notes.md) -> [task-board.md](task-board.md) -> [comms-log.md](comms-log.md) -> [dev-tracker.md](dev-tracker.md) -> [next-improvements.md](next-improvements.md) -> [reference-notes.md](reference-notes.md)
