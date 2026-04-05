---
title: Technical Specifications
created: 2026-04-05
updated: 2026-04-05
author: Robyn
tags:
  - mission
  - product-intent
  - strategy
  - pwa
  - township
  - planning
priority: critical
audience:
  - owner
  - lead
  - devs
  - reviewers
status: active
---

# KasiLink Technical Specifications

> **Mission anchor:** This is the source of truth for what KasiLink is, who it serves, and what the project must become.

## Quick Links

- [Structure Map](index.md)
- [Updates Hub](Updates/index.md)
- [Mission Companion](Details/technical-Specifications.md)

## Summary

KasiLink is a mobile-first Progressive Web App (PWA) that connects unemployed youth, job seekers, and small informal businesses in Gauteng with instant local gigs and services.

It focuses on work that township users actually need:
- car washes
- tutoring
- cleaning
- repairs
- deliveries
- handyman work
- solar installs
- and related local services

The product is built around smooth interactions, real-time matching, verified providers, and a community feed that celebrates township hustle and local talent.

## Why This Matters

South Africa’s youth unemployment remains critically high, and the informal economy powers daily life for millions. Generic job portals do not solve:
- locality
- trust
- speed
- affordability
- low data access
- load-shedding resilience

KasiLink exists to solve those problems directly.

## Core Value

<span style="color:#ea580c">Link the kasi hustle</span> - connect talent, create opportunity, build community.

## Problem Statement

In Gauteng’s townships, unemployed youth and job seekers face fragmented, unreliable job boards and high competition, while small informal businesses and households waste time searching for trustworthy local help.

Traditional platforms often:
- ignore the informal economy
- charge high fees
- require formal qualifications
- lack verification
- fail on mobile

This creates missed opportunities, economic leakage, and a cycle of unemployment.

## How We Solve It

KasiLink delivers one elegant platform built on:
- verified local talent
- instant matching
- community trust
- zero-commission-first economics
- mobile-first and data-light delivery

Providers get paid directly, seekers find work quickly, and the platform stays usable even during load-shedding.

## Mission Statement

To connect Gauteng’s talent with opportunity by providing instant, trustworthy local gigs, driving economic inclusion, ensuring accessibility for all, and celebrating the hustle and spirit of the kasi through meaningful, real-time connections.

## Differentiators

### Critical Differentiators

1. <span style="color:#dc2626">Hyper-local instant matching</span> - find gigs within 5 km using geospatial search.
2. <span style="color:#dc2626">Verified Kasi Trusted badges</span> - community ratings plus ID/photo verification.
3. <span style="color:#dc2626">Low-to-zero commission model</span> - keep earnings with the provider.
4. <span style="color:#dc2626">Offline-first PWA</span> - usable during load-shedding and low data.

### High Differentiators

5. <span style="color:#ea580c">Community Hustle feed</span> - stories, tips, and shout-outs.
6. <span style="color:#ea580c">One-tap booking and WhatsApp-ready shares</span> - instant confirmation flows.
7. <span style="color:#ea580c">Accessibility layer</span> - voice-friendly and large touch targets.

### Medium Differentiators

8. <span style="color:#ca8a04">Phase-1 focus on high-demand services</span> - car washes, tutoring, cleaning, repairs, deliveries, handyman, solar.
9. <span style="color:#ca8a04">Clerk organisations and team features</span> - support small business management.
10. <span style="color:#ca8a04">Scalability engine</span> - built for national rollout.

## Background

Project Overview: Full-stack Next.js + TypeScript platform that connects job seekers with verified local gigs while building a living network of township opportunity and hustle stories.

Purpose: Solve youth unemployment and informal economy fragmentation with one elegant, accurate, inclusive home for instant work, trust, and community.

## Scope

- Phase 1 MVP: Gauteng townships with instant gigs in high-demand categories
- Gig marketplace plus community hustle feed
- Clerk for auth, profiles, and small business organisations
- Future: payments, AI matching, national expansion

## Requirements

### Prioritised Use Cases

1. Job seeker: browse nearby gigs -> instant apply -> real-time chat -> get paid same day
2. Small business or household: post gig -> get matched -> review and pay directly
3. Youth or provider: build profile, earn badges, share success stories
4. Community: celebrate local talent and share opportunities

All flows should stay data-light and offline-capable.

## Architecture

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion for polish later

### Backend

- Next.js API routes
- MongoDB with Mongoose and geospatial support

### Auth

- Clerk, phone-first

### Database

- MongoDB Atlas with near-me geo data

### Deployment

- Vercel
- Docker-ready

### Real-time

- Clerk webhooks now
- Socket.io or Pusher later

## UI Direction

Vibrant township energy aesthetic:
- bright colours
- bold typography
- dark mode for night browsing
- subtle kasi motifs

Key motion patterns:
- animated gig cards with distance and pay
- instant match confirmation with progress animations
- hustle feed with parallax and reaction emojis
- fully responsive PWA install flow

## APIs

Clerk-protected routes:
- `POST /api/gigs`
- `GET /api/gigs/nearby?lat=...&lng=...`
- `POST /api/applications`
- `POST /api/stories`

## Metrics

- daily gigs posted and completed
- 30-day retention target: 50%+
- average time-to-first-gig under 30 minutes

## Compliance

- POPIA-ready via Clerk
- clear consent on sign-up

## Accessibility

- WCAG 2.2 AA
- large touch targets
- voice-over friendly

## Risks

- Low initial traction -> launch with CPUT students, local churches, and taxi associations
- Provider verification -> ratings plus manual approval and Kasi Trusted badges
- Scams -> in-app chat, photo verification, and community reporting

## Test Plan

- Jest and Playwright
- 50 real Gauteng users
- beta with the existing network

## Timeline

### Milestone 1 - MVP Core

- 3-4 weeks
- auth
- gig posting
- matching
- applications
- end of April 2026

### Milestone 2 - Polish + Feed

- 2 weeks
- animations
- PWA
- community stories
- mid May

### Milestone 3 - Launch

- 1 week
- Vercel
- Gauteng township marketing
- end of May 2026

## Closing View

KasiLink is a living blueprint for connecting talent, creating real opportunity, and changing lives in the kasi.

## Structure Link

[Go back to the Structure map](index.md)

