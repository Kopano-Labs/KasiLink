# Env Integration Audit

Reference frame:
- `Structure/Updates/Implementation.md`
- `Structure/Updates/kasilink Struture.txt`

## Current truth

The current app only actively uses a small subset of `.env.local`.

### Active in code

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `MONGODB_URI`

### Present but not used by current code

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXTAUTH_URL_INTERNAL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `RESEND_API_KEY`
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`
- `KEY_ID`
- `KEY`

### Invalid or misleading before cleanup

This line was not a real env var and could never be consumed by the app:

- `BigQuery_API,Cloud_Datastore_API, Cloud_Logging_API, Cloud_Monitoring_API, Cloud_Storage_API, Google_Analytics_API, Google_Assistant_API, Google_Cloud_APIs, Maintenance_API, Service_Usage_API`

It is now treated as planning notes only.

## What should be implemented next

Based on `Structure/Updates/Implementation.md`, the integrations that fit KasiLink best are:

1. Google Analytics
   Reason:
   Aligns with `L6 - Analytics + Metrics Dashboard`.

2. BigQuery
   Reason:
   Useful after analytics exists and event exports need warehousing.

3. Cloud Logging
   Reason:
   Good operational fit for production observability, especially around APIs and webhooks.

4. Cloud Monitoring
   Reason:
   Pairs with logging for uptime and service health.

5. Cloud Storage
   Reason:
   Useful if KasiLink adds uploads such as avatars, proof images, incident reports, or documents.

## What should not be implemented yet

These do not clearly map to the current Structure priorities and should wait for a concrete feature:

- Google Drive API
- Google Assistant API
- Cloud Datastore API
- Service Usage API
- Maintenance API

## Suggested rollout order

1. Add Google Analytics event tracking.
2. Add an internal analytics events model and dashboard plan.
3. Export analytics to BigQuery only when reporting needs justify it.
4. Add Cloud Logging and Monitoring for production operations.
5. Add Cloud Storage only with a real upload feature.

## App mapping

If implemented, these should land roughly here:

- `app/layout.tsx`
  Add Google Analytics script/bootstrap.

- `lib/logger.ts`
  Extend for structured server-side events and cloud logging adapters.

- `app/api/*`
  Emit analytics and operational events from key workflows.

- `app/gigs/new/page.tsx`
- `app/gigs/[id]/page.tsx`
- `app/marketplace/page.tsx`
- `app/forum/page.tsx`
  Track feature usage once event taxonomy is defined.

## Recommendation

Do not try to "implement every API on env" just because keys exist.
Use the Structure roadmap and only build integrations that support an actual KasiLink feature.
