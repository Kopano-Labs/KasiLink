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

export default function DiscordSkin({ conversationId, gigTitle }: SkinProps) {
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
    <div className="flex flex-col min-h-[70vh] bg-[#36393f] rounded-xl overflow-hidden shadow-lg border border-[#202225] font-sans">
      <div className="bg-[#2f3136] text-white p-4 flex items-center shadow-sm z-10 border-b border-[#202225]">
        <span className="text-[#8e9297] text-2xl mr-2 font-light">#</span>
        <h2 className="font-bold text-base text-white">
          {gigTitle.toLowerCase().replace(/\s+/g, "-")}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto py-4 space-y-1">
        {loading ? (
          <div className="text-center text-[#dcddde] py-4">Loading...</div>
        ) : (
          messages.map((m) => (
            <div
              key={m._id}
              className="flex px-4 py-1 hover:bg-[#32353b] group transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#5865F2] flex-shrink-0 flex items-center justify-center text-white font-bold mr-4 mt-0.5">
                {m.senderName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline">
                  <span className="font-medium text-white mr-2 text-sm">
                    {m.senderName}
                  </span>
                  <span className="text-xs text-[#72767d]">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-[#dcddde] break-words">{m.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
      <div className="p-4 bg-[#36393f]">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 rounded-lg px-4 py-2.5 text-[#dcddde] bg-[#40444b] focus:outline-none placeholder-[#72767d]"
            placeholder={`Message #${gigTitle.toLowerCase().replace(/\s+/g, "-")}`}
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="px-4 py-2 rounded-lg bg-[#5865F2] text-white font-medium hover:bg-[#4752c4] disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
