---
title: dev1-chat-skins
created: 2026-04-05
updated: 2026-04-05
author: Codex
tags:
  - structure
  - reference
priority: low
audience:
  - lead
  - devs
status: active
---

# DEV_1 (Codex) — Assignment: M1 Chameleon Chat Skins

**Assigned by:** Lead (Claude Opus 4.6) | **Date:** 2026-04-04
**Task IDs:** M1
**Status:** ACTIVE — Start immediately after reading this.
**Priority:** MEDIUM

---

## STOP. READ THESE RULES FIRST.

1. You touch **ONLY** the 4 files listed in your scope below. No others.
2. These are COMPONENT files inside `components/chat-skins/`. NOT inside `app/chat/`.
3. The existing `app/chat/page.tsx` is NOT yours. Do NOT modify it.
4. No new dependencies. Use Tailwind only.
5. Run `npm run build` when done. Confirm it passes before reporting.
6. Append ONE comms-log entry when done with a checklist of what you built.

---

## Your File Scope — EXACTLY These 4 Files. No Others.

```
FILE 1 (CREATE NEW):  components/chat-skins/WhatsAppSkin.tsx
FILE 2 (CREATE NEW):  components/chat-skins/DiscordSkin.tsx
FILE 3 (CREATE NEW):  components/chat-skins/InstagramSkin.tsx
FILE 4 (CREATE NEW):  components/chat-skins/SkinSelector.tsx
```

---

## Design Reference

Read these mockups before coding:
- `Structure/Design/chat/stitch/chat_whatsapp_skin/code.html`
- `Structure/Design/chat/stitch/chat_discord_skin/code.html`
- `Structure/Design/chat/stitch/chat_instagram_skin/code.html`
- `Structure/Design/chat/stitch/premium_chat_selector/code.html`

---

## What Each File Does

### FILE 1: `components/chat-skins/WhatsAppSkin.tsx`

A React component that renders a chat message list with WhatsApp-style theming.

**Props:**
```typescript
interface ChatSkinProps {
  messages: { id: string; text: string; senderId: string; senderName: string; createdAt: string; }[];
  currentUserId: string;
}
```

**Styling:**
- Green sent bubbles (`bg-[#DCF8C6]` light / `bg-[#025C4C]` dark), white received bubbles
- Rounded corners: `rounded-2xl rounded-br-none` for sent, `rounded-bl-none` for received
- Delivery ticks (double checkmark unicode ✓✓) on sent messages
- Timestamp below each message (HH:MM format)
- WhatsApp-green header bar with chat title

### FILE 2: `components/chat-skins/DiscordSkin.tsx`

Same `ChatSkinProps` interface.

**Styling:**
- Discord dark theme: `bg-[#36393F]` message area, `bg-[#2F3136]` sidebar feel
- Messages NOT in bubbles — Discord-style: avatar circle + name + message vertically
- Username in bold with role color (`text-[#5865F2]`)
- Compact spacing between messages from same sender
- Timestamp inline with username

### FILE 3: `components/chat-skins/InstagramSkin.tsx`

Same `ChatSkinProps` interface.

**Styling:**
- Instagram gradient accent: `from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]` on sent bubbles
- Received: light gray `bg-surface-container`
- Pill-shaped bubbles: `rounded-full px-4 py-2`
- Minimal timestamps (only on hover or every 5th message)
- Clean white/dark background

### FILE 4: `components/chat-skins/SkinSelector.tsx`

A component that lets users pick which skin to use.

**Props:**
```typescript
interface SkinSelectorProps {
  activeSkin: "whatsapp" | "discord" | "instagram" | "default";
  onSkinChange: (skin: "whatsapp" | "discord" | "instagram" | "default") => void;
}
```

**UI:**
- Grid of 4 cards (3 skins + "Default KasiLink")
- Each card: colored header strip, skin name, short description, "Select" / "Active" button
- Active skin has primary border highlight and "Active" badge
- Based on `Structure/Design/chat/stitch/premium_chat_selector/code.html`

---

## DONE-WHEN Checklist

- [ ] `components/chat-skins/WhatsAppSkin.tsx` — exports `WhatsAppSkin` component with correct props
- [ ] `components/chat-skins/DiscordSkin.tsx` — exports `DiscordSkin` component with correct props
- [ ] `components/chat-skins/InstagramSkin.tsx` — exports `InstagramSkin` component with correct props
- [ ] `components/chat-skins/SkinSelector.tsx` — exports `SkinSelector` component with correct props
- [ ] All components use `"use client"` directive
- [ ] `npm run build` passes
- [ ] Comms-log entry posted with checklist ticked

---

## REPORT FORMAT

When done, append to `Structure/Updates/comms-log.md`:

```
### [DATE] | DEV_1 (Codex) | M1 COMPLETE

**Tasks:** M1

**Checklist:**
- [x] WhatsAppSkin.tsx
- [x] DiscordSkin.tsx
- [x] InstagramSkin.tsx
- [x] SkinSelector.tsx
- [x] Build passes

**Blockers:** None / [describe]
**Next:** Lead review
```
