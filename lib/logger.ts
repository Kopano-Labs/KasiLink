/**
 * lib/logger.ts
 * Structured logging for KasiLink API routes.
 * KC Apprenticeship Phase 9, Task 86 — Enhanced
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

type LogExtras = Record<string, unknown>;

const LOG_LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
const MIN_LEVEL: LogLevel = process.env.NODE_ENV === "production" ? "info" : "debug";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

function write(level: LogLevel, entry: LogExtras) {
  if (!shouldLog(level)) return;

  const line = JSON.stringify({
    level,
    timestamp: new Date().toISOString(),
    ...entry,
  });

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}

/** Original log function — backwards compatible */
export function log(
  level: LogLevel,
  route: string,
  action: string,
  extras: LogExtras = {},
): void {
  write(level, { route, action, ...extras });
}

/**
 * Create a contextual logger for a specific module.
 *
 * @example
 * const logger = createLogger("api/gigs");
 * logger.info("Fetching gigs", { suburb: "Khayelitsha" });
 * logger.error("DB failed", { error: err.message });
 */
export function createLogger(context: string) {
  return {
    debug: (message: string, data?: LogExtras) =>
      write("debug", { context, message, ...data }),
    info: (message: string, data?: LogExtras) =>
      write("info", { context, message, ...data }),
    warn: (message: string, data?: LogExtras) =>
      write("warn", { context, message, ...data }),
    error: (message: string, data?: LogExtras) =>
      write("error", { context, message, ...data }),
  };
}

/** Default logger */
export const logger = createLogger("kasilink");

