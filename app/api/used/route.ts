import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  
  const sessionId = formData.get('sessionId');
  const serviceCode = formData.get('serviceCode');
  const phoneNumber = formData.get('phoneNumber');
  const text = (formData.get('text') as string) || '';   // what the user typed

  // Basic menu for now (we will expand this later)
  let response = '';

  if (text === '') {
    // First screen when user dials *384#
    response = `CON Welcome to KasiLink!\n\n1. Find gigs near me\n2. Post a gig (for retailers)\n3. My profile & applications\n4. Wallet balance\n5. Help`;
  } else {
    // TODO: Add full menu logic here later
    response = `END Thank you! This feature is being built. Reply with your number to get notified when it's live.`;
  }

  return new Response(response, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}