/**
 * lib/ussd-session.ts
 * ───────────────────────────────────────────────────────────
 * USSD Session Manager for KasiLink.
 *
 * KC Apprenticeship Phase 6, Task 52
 *
 * Manages stateless USSD sessions using session IDs
 * from the USSD gateway (Africa's Talking or similar).
 *
 * USSD menu tree:
 *   1. Browse gigs (by suburb)
 *   2. My applications
 *   3. Load-shedding status
 *   4. My profile
 *   0. Exit
 *
 * Each response is max 160 chars (USSD limit).
 * ───────────────────────────────────────────────────────────
 */

/* ─── Types ─── */

export interface USSDRequest {
  sessionId: string;
  serviceCode: string;
  phoneNumber: string;
  text: string;  // User input chain, e.g. "1*2*3"
}

export interface USSDResponse {
  /** CON = continue session, END = close session */
  type: "CON" | "END";
  message: string;
}

export interface USSDMenuState {
  level: number;
  selections: string[];
}

/* ─── Constants ─── */

const MAX_MESSAGE_LENGTH = 160;
const MENU_SEPARATOR = "*";

/* ─── Menu Definitions ─── */

const MAIN_MENU = [
  "Welcome to KasiLink",
  "1. Browse gigs",
  "2. My applications",
  "3. Load-shedding",
  "4. My profile",
  "0. Exit",
].join("\n");

const SUBURB_MENU = [
  "Select suburb:",
  "1. Khayelitsha",
  "2. Mitchells Plain",
  "3. Gugulethu",
  "4. Langa",
  "5. Nyanga",
  "6. Soweto",
  "7. Alexandra",
  "0. Back",
].join("\n");

const SUBURB_MAP: Record<string, string> = {
  "1": "Khayelitsha",
  "2": "Mitchells Plain",
  "3": "Gugulethu",
  "4": "Langa",
  "5": "Nyanga",
  "6": "Soweto",
  "7": "Alexandra",
};

/* ─── Session Parser ─── */

/**
 * Parse USSD input text into menu state.
 * Input comes as "*"-separated selections, e.g. "1*2*3"
 */
export function parseUSSDInput(text: string): USSDMenuState {
  const selections = text ? text.split(MENU_SEPARATOR) : [];
  return {
    level: selections.length,
    selections,
  };
}

/**
 * Truncate message to USSD character limit.
 */
export function truncateUSSD(message: string): string {
  if (message.length <= MAX_MESSAGE_LENGTH) return message;
  return message.slice(0, MAX_MESSAGE_LENGTH - 3) + "...";
}

/* ─── Menu Router ─── */

/**
 * Process a USSD request and return the appropriate response.
 * This is a pure function — no database calls.
 * Database calls happen in the API route that calls this.
 */
export function routeUSSDMenu(state: USSDMenuState): {
  response: USSDResponse;
  action?: {
    type: "browse_gigs" | "my_applications" | "loadshedding" | "profile" | "apply";
    suburb?: string;
    gigIndex?: number;
  };
} {
  const { level, selections } = state;

  // Level 0: Main menu
  if (level === 0) {
    return { response: { type: "CON", message: MAIN_MENU } };
  }

  const firstChoice = selections[0];

  // Exit
  if (firstChoice === "0") {
    return {
      response: {
        type: "END",
        message: "Sharp! Visit kasilink.com for more.\nStay safe. 🤝",
      },
    };
  }

  // Option 1: Browse gigs
  if (firstChoice === "1") {
    if (level === 1) {
      return { response: { type: "CON", message: SUBURB_MENU } };
    }

    const suburbChoice = selections[1];
    if (suburbChoice === "0") {
      return { response: { type: "CON", message: MAIN_MENU } };
    }

    const suburb = SUBURB_MAP[suburbChoice];
    if (!suburb) {
      return {
        response: { type: "CON", message: "Invalid choice.\n" + SUBURB_MENU },
      };
    }

    if (level === 2) {
      // Return action to fetch gigs — API route handles DB
      return {
        response: { type: "CON", message: `Loading gigs in ${suburb}...` },
        action: { type: "browse_gigs", suburb },
      };
    }

    if (level === 3) {
      const gigIndex = parseInt(selections[2], 10) - 1;
      if (isNaN(gigIndex) || gigIndex < 0) {
        return {
          response: { type: "CON", message: "Invalid choice. Enter gig number:" },
        };
      }
      return {
        response: { type: "CON", message: "Apply? 1=Yes 0=Back" },
        action: { type: "browse_gigs", suburb, gigIndex },
      };
    }

    if (level === 4 && selections[3] === "1") {
      const gigIndex = parseInt(selections[2], 10) - 1;
      return {
        response: { type: "END", message: "Application sent! We'll SMS you." },
        action: { type: "apply", suburb, gigIndex },
      };
    }
  }

  // Option 2: My applications
  if (firstChoice === "2") {
    return {
      response: { type: "CON", message: "Loading your applications..." },
      action: { type: "my_applications" },
    };
  }

  // Option 3: Load-shedding
  if (firstChoice === "3") {
    return {
      response: { type: "CON", message: "Checking load-shedding..." },
      action: { type: "loadshedding" },
    };
  }

  // Option 4: Profile
  if (firstChoice === "4") {
    return {
      response: { type: "CON", message: "Loading profile..." },
      action: { type: "profile" },
    };
  }

  // Invalid
  return {
    response: { type: "CON", message: "Invalid choice.\n" + MAIN_MENU },
  };
}

/**
 * Format a list of gigs for USSD display.
 * Each gig: "1. Title - R150/day"
 */
export function formatGigsForUSSD(
  gigs: Array<{ title: string; payDisplay: string }>,
  maxItems = 5,
): string {
  if (gigs.length === 0) return "No gigs available.\n0. Back";

  const lines = gigs.slice(0, maxItems).map(
    (g, i) => `${i + 1}. ${g.title.slice(0, 30)} - ${g.payDisplay}`,
  );
  lines.push("0. Back");

  return truncateUSSD(lines.join("\n"));
}

/**
 * Format load-shedding status for USSD.
 */
export function formatLoadSheddingForUSSD(stage: number): string {
  if (stage === 0) return "No load-shedding! 🎉\n0. Back";
  return [
    `⚡ Stage ${stage} active`,
    stage >= 4 ? "Power-dependent gigs affected" : "Low impact expected",
    "Plan gigs around outages",
    "0. Back",
  ].join("\n");
}
