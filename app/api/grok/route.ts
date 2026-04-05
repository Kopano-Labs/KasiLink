import { createXai } from "@ai-sdk/xai";
import { NextRequest } from "next/server";
import { braintrustAI, braintrustLogger } from "@/lib/braintrust";

export const runtime = "nodejs";

const xaiProvider = createXai({
  apiKey: process.env.KasiLinkAI_XAI_API_KEY!,
});

const { streamText } = braintrustAI;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const result = braintrustLogger
    ? braintrustLogger.traced(
        () =>
          streamText({
            model: xaiProvider("grok-4"),
            messages,
            temperature: 0.7,
          }),
        {
          name: "api.grok",
          type: "task",
          event: {
            input: {
              type: "chat",
              messages,
            },
            metadata: {
              route: "/api/grok",
              messageCount: Array.isArray(messages) ? messages.length : 0,
            },
          },
        },
      )
    : streamText({
        model: xaiProvider("grok-4"),
        messages,
        temperature: 0.7,
      });

  return result.toUIMessageStreamResponse();
}
