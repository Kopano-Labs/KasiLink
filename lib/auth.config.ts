// lib/auth.config.ts
// Clerk configuration constants and helpers

// SA phone prefix
export const SA_PHONE_PREFIX = "+27";

// Clerk appearance config — used in SignIn/SignUp components
// Matches both dark and light KasiLink themes (Tailwind config)
export const clerkAppearance = {
  variables: {
    // Dark theme defaults (overridden by data-theme="light")
    colorBackground: "#1a2332",
    colorInputBackground: "#161b22",
    colorInputText: "#e6edf3",
    colorText: "#e6edf3",
    colorTextSecondary: "#8b949e",
    colorPrimary: "#4595c0",
    colorDanger: "#ef4444",
    borderRadius: "0.75rem",
    fontFamily: '"Ubuntu", "Segoe UI", system-ui, sans-serif',
    fontSize: "16px",
  },
  elements: {
    // Card wrapper
    card: {
      background: "#1a2332",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    },
    // Header
    headerTitle: {
      fontWeight: "700",
      fontSize: "1.5rem",
    },
    // Primary button
    formButtonPrimary: {
      background: "#4595c0",
      color: "#ffffff",
      fontWeight: "500",
      borderRadius: "0.75rem",
      "&:hover": {
        background: "#6ab0d8",
      },
    },
    // Inputs
    formFieldInput: {
      background: "#161b22",
      borderColor: "rgba(255,255,255,0.12)",
      color: "#e6edf3",
      borderRadius: "0.75rem",
    },
    // Phone number field
    phoneNumberField: {
      background: "#161b22",
    },
    // Footer links
    footerActionLink: {
      color: "#4595c0",
    },
  },
};

// Clerk public routes (no auth required)
export const publicRoutes = [
  "/",
  "/marketplace",
  "/marketplace/(.*)",
  "/gigs/(.*)", // view-only; posting is protected
  "/forum",
  "/forum/(.*)",
  "/verified",
  "/sign-in",
  "/sign-up",
  "/api/gigs/list",
  "/api/gigs/(.*)/view",
];

// Helper: format local SA number to E.164
// e.g. "0821234567" -> "+27821234567"
export function formatSAPhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("27") && digits.length === 11) {
    return `+${digits}`;
  }
  if (digits.startsWith("0") && digits.length === 10) {
    return `+27${digits.slice(1)}`;
  }
  // Already in correct format
  if (digits.length === 9) {
    return `+27${digits}`;
  }
  return `+${digits}`;
}

// Validate SA phone number
export function isValidSAPhone(phone: string): boolean {
  const e164 = formatSAPhone(phone);
  // SA mobile: +27 6x/7x/8x xxxxxxx (9 digits after +27)
  return /^\+27[678]\d{8}$/.test(e164);
}
