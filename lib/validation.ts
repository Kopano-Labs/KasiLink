// lib/validation.ts — lightweight validation, no external deps

export type ValidationResult = { valid: boolean; errors: Record<string, string> };

export function sanitize(text: string): string {
  return text.replace(/<[^>]*>/g, "").replace(/[<>'"]/g, "").trim();
}

export function validateGig(data: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title || typeof data.title !== "string" || data.title.trim().length < 5)
    errors.title = "Title must be at least 5 characters";
  else if (data.title.trim().length > 120)
    errors.title = "Title must be under 120 characters";

  if (!data.description || typeof data.description !== "string" || data.description.trim().length < 10)
    errors.description = "Description must be at least 10 characters";
  else if (data.description.trim().length > 1000)
    errors.description = "Description must be under 1000 characters";

  const validCategories = ["car_wash","cleaning","tutoring","repairs","delivery",
    "handyman","solar","retail","construction","healthcare","logistics","other"];
  if (!data.category || !validCategories.includes(data.category as string))
    errors.category = "Please select a valid category";

  if (!data.payDisplay || typeof data.payDisplay !== "string" || !data.payDisplay.trim())
    errors.payDisplay = "Pay description is required (e.g. R150/day or Negotiable)";

  if (!data.location || typeof data.location !== "object")
    errors.location = "Location is required";

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateApplication(data: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.gigId || typeof data.gigId !== "string")
    errors.gigId = "Gig ID is required";

  if (!data.message || typeof data.message !== "string" || data.message.trim().length < 10)
    errors.message = "Please write at least 10 characters in your message";
  else if (data.message.trim().length > 500)
    errors.message = "Message must be under 500 characters";

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateSAPhone(phone: string): boolean {
  return /^\+27[6-8][0-9]{8}$/.test(phone.replace(/\s/g, ""));
}
