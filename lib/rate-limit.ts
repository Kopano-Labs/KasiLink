/**
 * lib/rate-limit.ts
 * ───────────────────────────────────────────────────────────
 * Simple in-memory rate limiter for KasiLink API routes.
 *
 * KC Apprenticeship Phase 2, Task 11
 *
 * Uses a sliding window counter per IP/key.
 * Production note: For multi-instance deployments (Vercel
 * serverless), consider Redis-backed rate limiting. This
 * in-memory approach works for single-instance and protects
 * against casual abuse.
 * ───────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 60 seconds
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

export interface RateLimitConfig {
  /** Max requests per window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
  /** Custom key extractor (defaults to IP) */
  keyFn?: (req: NextRequest) => string;
}

/** Default configs for different route types */
export const RATE_LIMITS = {
  /** Standard API read — 60 req/min */
  read: { limit: 60, windowMs: 60_000 },
  /** Write/mutation — 20 req/min */
  write: { limit: 20, windowMs: 60_000 },
  /** Auth-related — 10 req/min */
  auth: { limit: 10, windowMs: 60_000 },
  /** Heavy operations (search, export) — 10 req/min */
  heavy: { limit: 10, windowMs: 60_000 },
  /** USSD — 30 req/min per session */
  ussd: { limit: 30, windowMs: 60_000 },
} as const;

/**
 * Extract client identifier from request.
 * Uses X-Forwarded-For (Vercel), falls back to X-Real-IP.
 */
function getClientKey(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/**
 * Check rate limit for a request.
 * Returns null if allowed, or a NextResponse if blocked.
 */
export function checkRateLimit(
  req: NextRequest,
  config: RateLimitConfig = RATE_LIMITS.read,
): NextResponse | null {
  cleanup();

  const key = config.keyFn
    ? config.keyFn(req)
    : `${getClientKey(req)}:${req.nextUrl.pathname}`;

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // New window
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return null;
  }

  if (entry.count >= config.limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      {
        error: "Too many requests",
        message: "Please wait before making more requests.",
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(config.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(entry.resetAt / 1000)),
        },
      },
    );
  }

  entry.count++;
  return null;
}

/**
 * Add rate limit headers to a successful response.
 */
export function addRateLimitHeaders(
  response: NextResponse,
  req: NextRequest,
  config: RateLimitConfig = RATE_LIMITS.read,
): NextResponse {
  const key = config.keyFn
    ? config.keyFn(req)
    : `${getClientKey(req)}:${req.nextUrl.pathname}`;

  const entry = store.get(key);
  if (entry) {
    response.headers.set("X-RateLimit-Limit", String(config.limit));
    response.headers.set(
      "X-RateLimit-Remaining",
      String(Math.max(0, config.limit - entry.count)),
    );
    response.headers.set(
      "X-RateLimit-Reset",
      String(Math.ceil(entry.resetAt / 1000)),
    );
  }

  return response;
}
