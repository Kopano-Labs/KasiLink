"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";

interface Conversation {
  _id: string;
  gigId: string;
  participants: string[];
  lastMessageAt: string;
}

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const fetchConversations = useCallback(async () => {
    if (!isSignedIn) return;
    const res = await fetch("/api/chat");
    if (res.ok) {
      const data = await res.json();
      setConversations(data.conversations || []);
    }
  }, [isSignedIn]);

  const fetchMessages = useCallback(async () => {
    if (!activeConv) return;
    const res = await fetch(`/api/messages?conversationId=${activeConv._id}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages || []);
    }
  }, [activeConv]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Polling for MVP
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeConv) return;

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: activeConv._id,
        text: text.trim(),
      }),
    });

    if (res.ok) {
      setText("");
      fetchMessages();
    }
  };

  if (!isLoaded) return <div className="p-8 text-center">Loading...</div>;
  if (!isSignedIn)
    return (
      <div className="p-8 text-center">Please sign in to view messages.</div>
    );

  return (
    <div className="container max-w-5xl mx-auto pt-8 pb-12 flex flex-col md:flex-row gap-6 h-[80vh]">
      <div className="w-full md:w-1/3 kasi-card flex flex-col overflow-y-auto">
        <h2 className="font-headline text-xl font-bold mb-4">Messages</h2>
        {conversations.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            No conversations yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {conversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => setActiveConv(conv)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  activeConv?._id === conv._id
                    ? "bg-primary-container text-primary font-bold"
                    : "hover:bg-surface-variant"
                }`}
              >
                <div className="text-sm font-bold">
                  Gig ID: {conv.gigId.slice(-6)}
                </div>
                <div className="text-xs text-outline mt-1">
                  {new Date(conv.lastMessageAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full md:w-2/3 kasi-card flex flex-col h-full relative">
        {activeConv ? (
          <>
            <div className="border-b border-outline-variant/30 pb-3 mb-4">
              <h3 className="font-bold">
                Chat for Gig: {activeConv.gigId.slice(-6)}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4 pr-2">
              {messages.map((msg) => {
                const isMe = msg.senderId === user.id;
                return (
                  <div
                    key={msg._id}
                    className={`flex flex-col max-w-[80%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
                  >
                    <div
                      className={`p-3 rounded-xl text-sm ${isMe ? "bg-primary text-on-primary rounded-br-none" : "bg-surface-variant text-on-surface-variant rounded-bl-none"}`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>
            <form onSubmit={sendMessage} className="flex gap-2 mt-auto pt-2">
              <input
                type="text"
                className="kasi-input flex-1"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={1000}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!text.trim()}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
