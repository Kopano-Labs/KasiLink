import dotenv from "dotenv";
import { createXai } from "@ai-sdk/xai";
import { streamText } from "ai";

// Load .env.local
dotenv.config({ path: ".env.local" });

// Debug: Check if your key loaded
const apiKey = process.env.KasiLinkAI_XAI_API_KEY;
console.log("🔑 Debug:");
console.log("   KasiLinkAI_XAI_API_KEY exists?", !!apiKey);
console.log("   Key length:", apiKey ? apiKey.length : 0);

const xaiProvider = createXai({
  apiKey: apiKey, // ← this is the correct way
});

console.log("🤖 Grok is thinking...\n");

const result = streamText({
  model: xaiProvider("grok-4"),
  prompt: "Invent a new holiday and describe its traditions.",
});

for await (const textPart of result.textStream) {
  process.stdout.write(textPart);
}

console.log("\n\n✅ Test complete!");
