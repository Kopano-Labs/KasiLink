<<<<<<< ours
# KasiLink — Clerk Billing Plans

> Configured in Clerk Dashboard → Configure → Billing → Subscription Plans  
> Last updated: 2026-04-03

---

## Plans Overview

| Plan             | Plan Key           | Trial   | Monthly | Annually | Monthly (ZAR ~) |
| ---------------- | ------------------ | ------- | ------- | -------- | --------------- |
| Kasi Link Free   | `free`             | —       | —       | —        | Free            |
| Kasi Link Plus   | `kasi_link_plus`   | 3 days  | $4.65   | $36.00   | ~R87            |
| Retailer Pro     | `retailer_pro`     | 7 days  | $7.00   | $72.00   | ~R131           |
| Retailer Premium | `retailer_premium` | 14 days | $14.66  | $156.00  | ~R275           |

> ⚠️ Confirm live ZAR rates before launch. Consider native ZAR pricing once Clerk supports it.

---

## Plan Descriptions

### Kasi Link Free

- **Always free** — entry-level for job seekers
- Core job browsing and application features
- No trial required

### Kasi Link Plus (`kasi_link_plus`)

- **$4.65/month** or **$36.00/year** — 3-day free trial
- Enhanced job seeker features (priority listings, alerts, profile boost)
- Target user: active job seeker wanting an edge

### Retailer Pro (`retailer_pro`)

- **$7.00/month** or **$72.00/year** — 7-day free trial
- For small retailers/employers posting gigs
- Target user: spaza shop, salon, small kasi business

### Retailer Premium (`retailer_premium`)

- **$14.66/month** or **$156.00/year** — 14-day free trial
- High-volume hiring, featured listings, analytics
- Target user: Shoprite, Boxer, Slay60, larger township employers

---

## Gating Features by Plan in Code

```ts
// Server-side (Next.js App Router)
import { currentUser } from "@clerk/nextjs/server";

const user = await currentUser();
const plan = (user?.publicMetadata?.plan as string) || "free";

if (plan === "retailer_pro" || plan === "retailer_premium") {
  // show employer dashboard
}
```

```tsx
// Client-side
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

---

## Stripe Integration (via Clerk Billing)

> Clerk uses Stripe under the hood. API version: `2025-12-15.clover`

### Required ENV vars

```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_URL=https://kasilink.co.za
```

### Key files to create

```
app/
  api/
    billing/
      create-checkout/route.ts   ← initiates Stripe checkout
      create-portal/route.ts     ← manages existing subscription
    webhooks/
      stripe/route.ts            ← syncs plan back to Clerk metadata
```

### Webhook Events to Handle

| Event                           | Action                                           |
| ------------------------------- | ------------------------------------------------ |
| `checkout.session.completed`    | Set `user.publicMetadata.plan` to purchased plan |
| `customer.subscription.deleted` | Reset `user.publicMetadata.plan` to `free`       |

---

## Pricing Table UI

Add to your `/pricing` page:

```tsx
import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <main>
      <h1>Choose your KasiLink plan</h1>
      <**PricingTable** />
    </main>
  );
}
```

---

## Notes

- SMS OTP (C1) works on all plans — it's an auth feature, not a billing feature
- Free tier must be genuinely useful for township job seeker adoption
- Consider a **WhatsApp notification** feature as a Plus differentiator (SA users prefer WhatsApp over email)
- Retailer plans should gate: gig posting, applicant management, featured listings
=======
# KasiLink — Clerk Billing Plans

> Configured in Clerk Dashboard → Configure → Billing → Subscription Plans  
> Last updated: 2026-04-03

---

## Plans Overview

| Plan             | Plan Key           | Trial   | Monthly | Annually | Monthly (ZAR ~) |
| ---------------- | ------------------ | ------- | ------- | -------- | --------------- |
| Kasi Link Free   | `free`             | —       | —       | —        | Free            |
| Kasi Link Plus   | `kasi_link_plus`   | 3 days  | $4.65   | $36.00   | ~R87            |
| Retailer Pro     | `retailer_pro`     | 7 days  | $7.00   | $72.00   | ~R131           |
| Retailer Premium | `retailer_premium` | 14 days | $14.66  | $156.00  | ~R275           |

> ⚠️ Confirm live ZAR rates before launch. Consider native ZAR pricing once Clerk supports it.

---

## Plan Descriptions

### Kasi Link Free

- **Always free** — entry-level for job seekers
- Core job browsing and application features
- No trial required

### Kasi Link Plus (`kasi_link_plus`)

- **$4.65/month** or **$36.00/year** — 3-day free trial
- Enhanced job seeker features (priority listings, alerts, profile boost)
- Target user: active job seeker wanting an edge

### Retailer Pro (`retailer_pro`)

- **$7.00/month** or **$72.00/year** — 7-day free trial
- For small retailers/employers posting gigs
- Target user: spaza shop, salon, small kasi business

### Retailer Premium (`retailer_premium`)

- **$14.66/month** or **$156.00/year** — 14-day free trial
- High-volume hiring, featured listings, analytics
- Target user: Shoprite, Boxer, Slay60, larger township employers

---

## Gating Features by Plan in Code

```ts
// Server-side (Next.js App Router)
import { currentUser } from "@clerk/nextjs/server";

const user = await currentUser();
const plan = (user?.publicMetadata?.plan as string) || "free";

if (plan === "retailer_pro" || plan === "retailer_premium") {
  // show employer dashboard
}
```

```tsx
// Client-side
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

---

## Stripe Integration (via Clerk Billing)

> Clerk uses Stripe under the hood. API version: `2025-12-15.clover`

### Required ENV vars

```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_URL=https://kasilink.co.za
```

### Key files to create

```
app/
  api/
    billing/
      create-checkout/route.ts   ← initiates Stripe checkout
      create-portal/route.ts     ← manages existing subscription
    webhooks/
      stripe/route.ts            ← syncs plan back to Clerk metadata
```

### Webhook Events to Handle

| Event                           | Action                                           |
| ------------------------------- | ------------------------------------------------ |
| `checkout.session.completed`    | Set `user.publicMetadata.plan` to purchased plan |
| `customer.subscription.deleted` | Reset `user.publicMetadata.plan` to `free`       |

---

## Pricing Table UI

Add to your `/pricing` page:

```tsx
import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <main>
      <h1>Choose your KasiLink plan</h1>
      <**PricingTable** />
    </main>
  );
}
```

---

## Notes

- SMS OTP (C1) works on all plans — it's an auth feature, not a billing feature
- Free tier must be genuinely useful for township job seeker adoption
- Consider a **WhatsApp notification** feature as a Plus differentiator (SA users prefer WhatsApp over email)
- Retailer plans should gate: gig posting, applicant management, featured listings
>>>>>>> theirs
