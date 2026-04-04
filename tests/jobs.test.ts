import test from "node:test";
import assert from "node:assert/strict";
import {
  sanitize,
  validateApplication,
  validateGig,
  validateMessage,
  validateForumPost,
} from "@/lib/validation";

test("sanitizes html and truncates long strings", () => {
  const value = sanitize("<b>Hello</b> &amp; welcome " + "a".repeat(600));
  assert.equal(value, "Hello   welcome " + "a".repeat(485));
});

test("rejects incomplete application payloads", () => {
  const result = validateApplication({ gigId: "", message: "short" });
  assert.equal(result.valid, false);
  assert.ok(result.errors.gigId);
  assert.ok(result.errors.message);
});

test("accepts a minimal valid gig payload", () => {
  const result = validateGig({
    title: "Car wash helper",
    description: "Help wash cars in the morning shift.",
    category: "car_wash",
    payDisplay: "R150/day",
    location: { coordinates: [28.0473, -26.2041] },
  });
  assert.equal(result.valid, true);
});

test("rejects empty message and forum payloads", () => {
  assert.equal(
    validateMessage({ conversationId: "abc", text: " " }).valid,
    false,
  );
  assert.equal(
    validateForumPost({ title: "", content: "", category: "general" }).valid,
    false,
  );
});
