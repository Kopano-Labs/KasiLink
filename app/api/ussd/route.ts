// app/api/ussd/route.ts
// Full USSD handler for *384*17219# - KasiLink

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const sessionId = formData.get("sessionId") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const text = (formData.get("text") as string) || "";

  let response = "";

  // Welcome menu (first time user dials *384#)
  if (text === "") {
    response = `CON Welcome to KasiLink!\n\n1. Find gigs near me\n2. Post a gig (Retailers)\n3. My profile & applications\n4. Wallet balance\n5. Help & Support`;
  }

  // Option 1 - Find gigs near me
  else if (text === "1") {
    response = `CON Enter your area code or suburb (e.g. Soweto, Tembisa, Alexandra):\n\nOr reply 0 to go back`;
  }

  // Option 2 - Post a gig (for retailers)
  else if (text === "2") {
    response = `CON To post a gig, reply with:\nJob title | Pay | Location\nExample: Shelf packer | R150/day | Soweto\n\nOr reply 0 to go back`;
  }

  // Option 3 - My profile & applications
  else if (text === "3") {
    response = `CON My Profile:\n• Name: [coming soon]\n• Applications: 0 active\n\nReply 0 to go back`;
  }

  // Option 4 - Wallet balance
  else if (text === "4") {
    response = `CON Wallet Balance: R0.00\n\nTo add money, reply with amount (e.g. 50)\nOr reply 0 to go back`;
  }

  // Option 5 - Help & Support
  else if (text === "5") {
    response = `CON KasiLink Help\nCall/WhatsApp: 081 234 5678\nEmail: support@kasilink.com\n\nReply 0 to go back`;
  }

  // Back to main menu
  else if (text === "0") {
    response = `CON Welcome to KasiLink!\n\n1. Find gigs near me\n2. Post a gig (Retailers)\n3. My profile & applications\n4. Wallet balance\n5. Help & Support`;
  }

  // Any other input (basic fallback)
  else {
    response = `CON Invalid option.\n\nReply with 1-5 or 0 for main menu`;
  }

  return new Response(response, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
