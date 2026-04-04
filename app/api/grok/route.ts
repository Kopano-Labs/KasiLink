import { createXai } from "@ai-sdk/xai";
import { streamText } from "ai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const xaiProvider = createXai({
  apiKey: process.env.KasiLinkAI_XAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const result = streamText({
    model: xaiProvider("grok-4"),
    messages,
    temperature: 0.7,
  });

  return result.toDataStreamResponse();
}
