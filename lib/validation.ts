// lib/validation.ts
// Shared validation + sanitisation utilities for KasiLink API routes

// ----------------------------------------------------------------
// Sanitization Utilities
// ----------------------------------------------------------------
/**
 * Sanitise — strip HTML tags and trim whitespace
 * Used before storing user-supplied text to prevent XSS in rendered output
 */
export function sanitize(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/&[a-z]+;/gi, " ") // strip HTML entities
    .trim()
    .slice(0, 500); // hard cap — matches Application.message maxlength
}

// ----------------------------------------------------------------
// validateApplication
// Called in POST /api/applications before hitting the DB
// ----------------------------------------------------------------
export interface ApplicationPayload {
  gigId?: unknown;
  message?: unknown;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateApplication(
  body: ApplicationPayload,
): ValidationResult {
  const errors: Record<string, string> = {};

  // gigId
  if (!body.gigId || typeof body.gigId !== "string" || !body.gigId.trim()) {
    errors.gigId = "gigId is required";
  }

  // message
  if (!body.message || typeof body.message !== "string") {
    errors.message = "A cover message is required";
  } else {
    const cleaned = sanitize(body.message);
    if (cleaned.length < 10) {
      errors.message = "Message must be at least 10 characters";
    }
    if (cleaned.length > 500) {
      errors.message = "Message must be 500 characters or fewer";
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// ----------------------------------------------------------------
// validateGig (used when you add server-side validation to POST /api/gigs)
// ----------------------------------------------------------------
export interface GigPayload {
  title?: unknown;
  description?: unknown;
  category?: unknown;
  payDisplay?: unknown;
  location?: { coordinates?: unknown };
}

const VALID_CATEGORIES = [
  "car_wash",
  "cleaning",
  "tutoring",
  "repairs",
  "delivery",
  "handyman",
  "solar",
  "retail",
  "construction",
  "healthcare",
  "logistics",
  "other",
] as const;

export function validateGig(body: GigPayload): ValidationResult {
  const errors: Record<string, string> = {};

  if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
    errors.title = "Title is required";
  } else if (body.title.trim().length > 120) {
    errors.title = "Title must be 120 characters or fewer";
  }

  if (
    !body.description ||
    typeof body.description !== "string" ||
    !body.description.trim()
  ) {
    errors.description = "Description is required";
  } else if (body.description.trim().length > 1000) {
    errors.description = "Description must be 1000 characters or fewer";
  }

  if (
    !body.category ||
    !VALID_CATEGORIES.includes(
      body.category as (typeof VALID_CATEGORIES)[number],
    )
  ) {
    errors.category = `Category must be one of: ${VALID_CATEGORIES.join(", ")}`;
  }

  if (
    !body.payDisplay ||
    typeof body.payDisplay !== "string" ||
    !body.payDisplay.trim()
  ) {
    errors.payDisplay =
      "Pay display is required (e.g. 'R150/hr' or 'Negotiable')";
  }

  if (
    !body.location?.coordinates ||
    !Array.isArray(body.location.coordinates) ||
    body.location.coordinates.length !== 2
  ) {
    errors.location = "location.coordinates must be [longitude, latitude]";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// ----------------------------------------------------------------
// validateMessage (used for Task H1 In-App Chat)
// ----------------------------------------------------------------
export interface MessagePayload {
  conversationId?: unknown;
  text?: unknown;
}

export function validateMessage(body: MessagePayload): ValidationResult {
  const errors: Record<string, string> = {};

  if (!body.conversationId || typeof body.conversationId !== "string") {
    errors.conversationId = "conversationId is required";
  }

  if (!body.text || typeof body.text !== "string" || !body.text.trim()) {
    errors.text = "Message text is required";
  } else if (body.text.trim().length > 1000) {
    errors.text = "Message must be 1000 characters or fewer";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// ----------------------------------------------------------------
// validateForumPost (used for Task H2 Community Forum)
// ----------------------------------------------------------------
export interface ForumPostPayload {
  title?: unknown;
  content?: unknown;
  category?: unknown;
}

export function validateForumPost(body: ForumPostPayload): ValidationResult {
  const errors: Record<string, string> = {};

  if (!body.title || typeof body.title !== "string" || !body.title.trim())
    errors.title = "Title is required";
  if (!body.content || typeof body.content !== "string" || !body.content.trim())
    errors.content = "Content is required";

  const validCategories = [
    "general",
    "safety",
    "load-shedding",
    "success_stories",
  ];
  if (
    !body.category ||
    typeof body.category !== "string" ||
    !validCategories.includes(body.category)
  ) {
    errors.category = "Invalid category selected";
  }

  if (typeof body.content === "string" && sanitize(body.content).length > 2000) {
    errors.content = "Content must be 2000 characters or fewer";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
