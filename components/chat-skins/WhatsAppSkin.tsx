"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

interface SkinProps {
  conversationId: string;
  gigTitle: string;
}

export default function WhatsAppSkin({ conversationId, gigTitle }: SkinProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMsgs = async () => {
      try {
        const res = await fetch(
          `/api/messages?conversationId=${conversationId}`,
        );
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMsgs();
    const interval = setInterval(fetchMsgs, 10000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msgText = text;
    setText("");
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, text: msgText }),
    });
    const res = await fetch(`/api/messages?conversationId=${conversationId}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages || []);
    }
  };

  return (
    <div className="flex flex-col min-h-[70vh] bg-[#e5ddd5] rounded-xl overflow-hidden shadow-lg border border-outline-variant/30 font-sans">
      <div className="bg-[#075E54] text-white p-4 flex items-center shadow-md z-10">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3 font-bold text-lg">
          {gigTitle.charAt(0).toUpperCase()}
        </div>
        <h2 className="font-bold text-lg leading-tight">{gigTitle}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-center text-black/50 py-4">Loading...</div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderId === user?.id;
            return (
              <div
                key={m._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-2 px-3 shadow-sm text-black ${isMe ? "bg-[#dcf8c6] rounded-2xl rounded-tr-sm" : "bg-white rounded-2xl rounded-tl-sm"}`}
                >
                  {!isMe && (
                    <div className="text-xs font-bold text-[#075E54] mb-1">
                      {m.senderName}
                    </div>
                  )}
                  <p className="text-sm break-words leading-snug">{m.text}</p>
                  <div className="text-[10px] text-right text-gray-500 mt-1">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>
      <div className="bg-[#f0f0f0] p-3">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 rounded-full px-4 py-2 text-black bg-white focus:outline-none border-none"
            placeholder="Type a message"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center disabled:opacity-50 transition-opacity"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
