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

export default function InstagramSkin({ conversationId, gigTitle }: SkinProps) {
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
    <div className="flex flex-col min-h-[70vh] bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 font-sans">
      <div className="bg-white text-black p-4 flex items-center border-b border-gray-200 z-10 relative">
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]"></div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px] mr-3 flex-shrink-0">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-black text-sm">
            {gigTitle.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="font-bold text-sm leading-tight">{gigTitle}</h2>
          <span className="text-[10px] text-gray-500">Active now</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
        {loading ? (
          <div className="text-center text-gray-400 py-4">Loading...</div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderId === user?.id;
            return (
              <div
                key={m._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 text-sm shadow-sm ${isMe ? "bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-2xl rounded-tr-sm" : "bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm"}`}
                >
                  <p className="break-words">{m.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>
      <div className="bg-white p-3 border-t border-gray-100">
        <form
          onSubmit={handleSend}
          className="flex gap-2 items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-transparent text-black focus:outline-none placeholder-gray-400 text-sm"
            placeholder="Message..."
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="text-blue-500 font-semibold text-sm disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
