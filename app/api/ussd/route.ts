// app/api/ussd/route.ts
// OPTIMIZED & FAST USSD Gig Search Flow for KasiLink

import { NextRequest } from "next/server";

const sessions = new Map<string, any>();

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const sessionId = formData.get("sessionId") as string;
  const text = (formData.get("text") as string) || "";

  let response = "";
  let session = sessions.get(sessionId) || { step: "main" };

  // ==================== MAIN MENU ====================
  if (text === "" || text === "0") {
    response = `CON Welcome to KasiLink!\n\n1. Find gigs near me\n2. Post a gig (Retailers)\n3. My profile & applications\n4. Wallet balance\n5. Help & Support`;
    session.step = "main";
  }

  // ==================== 1. FIND GIGS ====================
  else if (text === "1" && session.step === "main") {
    response = `CON Enter your suburb/area:\n(e.g. Soweto, Tembisa, Alexandra, Diepsloot, Orlando)`;
    session.step = "waiting_for_suburb";
  }

  // User enters suburb → show high-demand gigs
  else if (session.step === "waiting_for_suburb") {
    const suburb = text.trim() || "your area";

    response = `CON Gigs near ${suburb} (High demand today):\n\n1. Shelf packer - Shoprite - R180/day\n2. Delivery rider - Checkers - R220/day\n3. Site labourer - Construction - R200/day\n4. Community cleaner - R150/day\n5. Care assistant - Clinic - R170/day\n\nReply number to apply\n6. See more gigs\n0. Back to menu`;

    session.step = "showing_gigs";
    session.suburb = suburb;
  }

  // User selects a gig to apply
  else if (
    session.step === "showing_gigs" &&
    ["1", "2", "3", "4", "5"].includes(text)
  ) {
    const gigList = [
      "Shelf packer - Shoprite - R180/day",
      "Delivery rider - Checkers - R220/day",
      "Site labourer - Construction - R200/day",
      "Community cleaner - R150/day",
      "Care assistant - Clinic - R170/day",
    ];
    const selectedGig = gigList[parseInt(text) - 1];

    response = `CON Apply for:\n${selectedGig}\n\nReply YES to confirm application\nOr 0 to go back`;
    session.step = "confirm_apply";
    session.selectedGig = selectedGig;
  }

  // Confirm application
  else if (session.step === "confirm_apply" && text.toUpperCase() === "YES") {
    response = `CON ✅ Application sent for ${session.selectedGig}!\n\nYou will be notified if accepted.\n\nKasiLink Plus (R79/mo) gives you priority matching & instant alerts.\n\n1. Find more gigs\n0. Main menu`;
    session.step = "main";
  }

  // See more gigs
  else if (session.step === "showing_gigs" && text === "6") {
    response = `CON More gigs near ${session.suburb}:\n\n1. Bike courier - Uber Eats - R250/day\n2. Handyman - Repairs - R190/day\n3. Tutor - After school - R160/day\n4. Security guard - R210/day\n\nReply number to apply\n0. Back to menu`;
    session.step = "showing_more_gigs";
  }

  // Apply from "more gigs"
  else if (
    session.step === "showing_more_gigs" &&
    ["1", "2", "3", "4"].includes(text)
  ) {
    const moreGigs = [
      "Bike courier - Uber Eats - R250/day",
      "Handyman - Repairs - R190/day",
      "Tutor - After school - R160/day",
      "Security guard - R210/day",
    ];
    const selected = moreGigs[parseInt(text) - 1];

    response = `CON Apply for:\n${selected}\n\nReply YES to confirm\nOr 0 to go back`;
    session.step = "confirm_apply";
    session.selectedGig = selected;
  }

  // Fallback
  else {
    response = `CON Invalid option.\n\nReply 1-5 or 0 for main menu`;
  }

  sessions.set(sessionId, session);

  return new Response(response, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
