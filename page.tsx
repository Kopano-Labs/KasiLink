"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

interface Message {
  _id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export default function ChatRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/chat/messages?conversationId=${id}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []));
  }, [id, user]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: id, text }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setText("");
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container pt-8 pb-12 flex flex-col h-[calc(100dvh-6rem)] max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-headline text-xl font-bold">Conversation</h1>
        <Link href="/chat" className="btn btn-outline btn-sm">
          ← Back
        </Link>
      </div>

      <div className="kasi-card flex-1 flex flex-col overflow-hidden p-0 rounded-xl border border-outline-variant/30">
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-surface-container-lowest">
          {messages.length === 0 ? (
            <div className="m-auto text-on-surface-variant text-sm">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.senderId === user?.id;
              return (
                <div
                  key={m._id}
                  className={`max-w-[80%] p-3 rounded-2xl ${isMe ? "bg-primary text-on-primary self-end rounded-br-sm" : "bg-surface-variant text-on-surface self-start rounded-bl-sm"}`}
                >
                  <p className="text-sm">{m.text}</p>
                  <span
                    className={`text-[10px] block mt-1 ${isMe ? "text-primary-container/80" : "text-on-surface-variant/70"}`}
                  >
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })
          )}
        </div>
        <form
          onSubmit={sendMessage}
          className="p-3 bg-surface-container-low border-t border-outline-variant/30 flex gap-2"
        >
          <input
            type="text"
            className="kasi-input flex-1 bg-surface-container-lowest rounded-full px-4"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={sending}
          />
          <button
            type="submit"
            className="btn btn-primary rounded-full px-6"
            disabled={!text.trim() || sending}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
