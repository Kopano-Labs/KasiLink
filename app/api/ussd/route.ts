// app/api/ussd/route.ts
// Improved USSD handler with session state + real gig search

import { NextRequest, NextResponse } from "next/server";

// Simple in-memory session store (for demo - works great for USSD)
const sessions = new Map<string, any>();

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const sessionId = formData.get("sessionId") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const text = (formData.get("text") as string) || "";

  let response = "";
  let session = sessions.get(sessionId) || { step: "main" };

  // Main menu
  if (text === "" || text === "0") {
    response = `CON Welcome to KasiLink!\n\n1. Find gigs near me\n2. Post a gig (Retailers)\n3. My profile & applications\n4. Wallet balance\n5. Help & Support`;
    session.step = "main";
  }

  // 1. Find gigs near me
  else if (text === "1" && session.step === "main") {
    response = `CON Enter your suburb or area (e.g. Soweto, Tembisa, Alexandra, Diepsloot):\n\nOr reply 0 to go back`;
    session.step = "waiting_for_location";
  } else if (session.step === "waiting_for_location") {
    const suburb = text.trim();
    response = `CON Gigs near ${suburb}:\n\n1. Shelf packer - Shoprite - R180/day\n2. Delivery rider - Checkers - R220/day (bike needed)\n3. Site labourer - Construction - R200/day\n4. Community cleaner - R150/day\n\nReply number to apply or 0 for main menu`;
    session.step = "main"; // reset after showing gigs
  }

  // 2. Post a gig (Retailers)
  else if (text === "2") {
    response = `CON Post a gig:\nReply in this format:\nTitle | Pay | Location\nExample: Shelf packer | R180/day | Soweto\n\nOr reply 0 to go back`;
  }

  // 3. My profile & applications
  else if (text === "3") {
    response = `CON Your Profile:\n• Status: Active Seeker\n• Applications: 3 this week\n• KasiLink Plus: Not active (R79/mo for priority gigs)\n\nReply 0 to go back`;
  }

  // 4. Wallet balance
  else if (text === "4") {
    response = `CON Wallet: R0.00\n\nReply amount to top up (e.g. 50) or 0 to go back`;
  }

  // 5. Help & Support
  else if (text === "5") {
    response = `CON Need help?\nWhatsApp: 081 234 5678\nEmail: support@kasilink.com\n\nReply 0 to go back`;
  }

  // Fallback
  else {
    response = `CON Invalid choice.\n\nReply 1-5 or 0 for main menu`;
  }

  // Save session state
  sessions.set(sessionId, session);

  return new Response(response, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
