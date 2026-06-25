/**
 * lib/api-error.ts
 * ───────────────────────────────────────────────────────────
 * Consistent API error response builder for KasiLink.
 *
 * KC Apprenticeship Phase 2, Task 18
 *
 * Every API route should use these helpers instead of
 * ad-hoc NextResponse.json({ error: ... }) calls.
 * ───────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";

export interface ApiErrorBody {
  error: string;
  message: string;
  code?: string;
  details?: Record<string, string>;
}

export interface ApiSuccessBody<T = unknown> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    hasMore?: boolean;
  };
}

/* ─── Error Responses ─── */

export function badRequest(
  message: string,
  details?: Record<string, string>,
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    { error: "Bad Request", message, code: "BAD_REQUEST", details },
    { status: 400 },
  );
}

export function unauthorized(
  message = "Authentication required",
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    { error: "Unauthorized", message, code: "UNAUTHORIZED" },
    { status: 401 },
  );
}

export function forbidden(
  message = "You do not have permission to perform this action",
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    { error: "Forbidden", message, code: "FORBIDDEN" },
    { status: 403 },
  );
}

export function notFound(
  message = "Resource not found",
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    { error: "Not Found", message, code: "NOT_FOUND" },
    { status: 404 },
  );
}

export function conflict(
  message: string,
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    { error: "Conflict", message, code: "CONFLICT" },
    { status: 409 },
  );
}

export function tooManyRequests(
  retryAfterSeconds: number,
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    {
      error: "Too Many Requests",
      message: "Please wait before making more requests.",
      code: "RATE_LIMITED",
    },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    },
  );
}

export function internalError(
  message = "An unexpected error occurred",
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    { error: "Internal Server Error", message, code: "INTERNAL_ERROR" },
    { status: 500 },
  );
}

export function serviceUnavailable(
  message = "Service temporarily unavailable",
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    { error: "Service Unavailable", message, code: "SERVICE_UNAVAILABLE" },
    { status: 503 },
  );
}

/* ─── Success Responses ─── */

export function success<T>(
  data: T,
  meta?: ApiSuccessBody["meta"],
): NextResponse<ApiSuccessBody<T>> {
  return NextResponse.json({ data, meta });
}

export function created<T>(
  data: T,
): NextResponse<ApiSuccessBody<T>> {
  return NextResponse.json({ data }, { status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}
