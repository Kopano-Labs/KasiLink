---
title: Tailwind v4 Global CSS Regression - 2026-04-06
created: 2026-04-06
updated: 2026-04-06
author: Codex
tags:
  - issues
  - regression
  - qa
  - bug
  - layout
  - tailwind
  - obsidian
priority: critical
audience:
  - owner
  - lead
  - devs
status: resolved
---

# Tailwind v4 Global CSS Regression - 2026-04-06

> Root cause audit for the "unstyled app" failure. This note is the searchable regression record for Obsidian and future implementation reviews.

## Impact

- Every page rendered effectively unstyled.
- Custom Tailwind utility classes for KasiLink tokens were not generated.
- Forum and form surfaces also lost custom helper classes that existed only in CSS.

## Root Cause

### Bug 1 - Wrong import path in `app/layout.tsx`

`app/layout.tsx` imported `@/styles/globals.css`, which was empty.

Result:
- The real design system in `app/globals.css` never loaded.
- The app booted with almost no project styling applied.

Fix:
- Import `./globals.css` from `app/layout.tsx`.

### Bug 2 - Tailwind CSS 4 entrypoint mismatch

The stylesheet still used:

- `@tailwind base;`
- `@tailwind components;`
- `@tailwind utilities;`

That syntax is for Tailwind v3. This project runs `tailwindcss@4` with `@tailwindcss/postcss@4`.

Fix:
- Replace the v3 directives with `@import "tailwindcss";`.

### Bug 3 - Theme tokens defined in the wrong place for v4

Custom tokens such as `primary`, `surface-container-low`, `on-surface-variant`, and related semantic colors were defined in `tailwind.config.ts`.

In Tailwind CSS 4, that file is not the source of truth for theme utility generation.

Result:
- Classes like `bg-primary`
- `text-on-surface-variant`
- `border-outline-variant/30`

did not generate CSS.

Fix:
- Move all design tokens into an `@theme { ... }` block inside `app/globals.css`.

## Additional Fixes Applied During Audit

- Added missing `.badge-secondary` class used by `/forum`.
- Added missing semantic tokens: `--color-success`, `--color-warning`, `--color-danger`.
- Added missing `.btn-secondary` class.
- Added missing `.label` class used by form layouts.
- Moved the Google Fonts `@import` above all other rules to satisfy CSS import ordering rules.

## Current Canonical Rules

1. Global app styling must load from `app/globals.css` via `app/layout.tsx`.
2. Tailwind CSS 4 entry must be `@import "tailwindcss";`.
3. KasiLink theme tokens must live in `app/globals.css` inside `@theme`.
4. `tailwind.config.ts` is reference/editor support only unless Tailwind changes again.
5. Theme model stays: dark defaults, `[data-theme="light"]` overrides for Ubuntu Pulse.

## Files Verified

- `app/layout.tsx`
- `app/globals.css`
- `styles/globals.css`
- `tailwind.config.ts`
- `package.json`
- `postcss.config.mjs`
