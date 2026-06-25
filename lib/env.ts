/**
 * lib/env.ts
 * ───────────────────────────────────────────────────────────
 * Environment variable validation for KasiLink.
 *
 * KC Apprenticeship Phase 14, Task 137
 *
 * Validates all required env vars at import time.
 * Fails fast with clear error messages instead of
 * cryptic runtime crashes deep in API routes.
 * ───────────────────────────────────────────────────────────
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[KasiLink] Missing required environment variable: ${name}\n` +
      `Check your .env.local file or Vercel environment settings.`,
    );
  }
  return value;
}

function optional(name: string, fallback: string = ""): string {
  return process.env[name] ?? fallback;
}

/**
 * Validated environment configuration.
 * Import this instead of reading process.env directly.
 *
 * @example
 * import { env } from "@/lib/env";
 * const db = await connect(env.MONGODB_URI);
 */
export const env = {
  // Database
  MONGODB_URI: required("MONGODB_URI"),

  // Auth (Clerk)
  CLERK_SECRET_KEY: required("CLERK_SECRET_KEY"),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: required("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),

  // Optional integrations
  ESKOMSEPUSH_API_KEY: optional("ESKOMSEPUSH_API_KEY"),
  XAI_API_KEY: optional("XAI_API_KEY"),
  OPENAI_API_KEY: optional("OPENAI_API_KEY"),

  // Analytics (optional)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: optional("NEXT_PUBLIC_GA_MEASUREMENT_ID"),

  // App config
  NODE_ENV: optional("NODE_ENV", "development"),
  NEXT_PUBLIC_APP_URL: optional("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),

  // Feature flags
  ENABLE_USSD: optional("ENABLE_USSD", "false") === "true",
  ENABLE_PUSH_NOTIFICATIONS: optional("ENABLE_PUSH_NOTIFICATIONS", "false") === "true",

  // Derived
  get isDev() { return this.NODE_ENV === "development"; },
  get isProd() { return this.NODE_ENV === "production"; },
  get hasEskom() { return !!this.ESKOMSEPUSH_API_KEY; },
} as const;
