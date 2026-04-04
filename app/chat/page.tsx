"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

interface Conversation {
  _id: string;
  gigId: string;
  gigTitle: string;
  participants: string[];
  lastMessageAt: string;
  lastMessageText: string;
}

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  readAt?: string;
  createdAt: string;
}

function formatRelativeDate(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function ChatPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const userId = user?.id;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data) => {
        const items = data.conversations || [];
        setConversations(items);
        if (items.length > 0 && !selectedConversationId) {
          setSelectedConversationId(items[0]._id);
        }
      })
      .catch(() => setError("Failed to load conversations."))
      .finally(() => setLoadingConversations(false));
  }, [isLoaded, isSignedIn, selectedConversationId]);

  useEffect(() => {
    if (!selectedConversationId) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await fetch(
          `/api/messages?conversationId=${selectedConversationId}`,
        );
        const data = await res.json();
        setMessages(data.messages || []);
      } catch {
        setError("Failed to load messages.");
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 10_000);
    return () => clearInterval(intervalId);
  }, [selectedConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === selectedConversationId),
    [conversations, selectedConversationId],
  );

  async function handleSend() {
    if (!selectedConversationId || !text.trim()) return;
    setError("");
    const optimistic: Message = {
      _id: `optimistic-${Date.now()}`,
      conversationId: selectedConversationId,
      senderId: userId || "me",
      senderName: user?.fullName || "You",
      text,
      createdAt: new Date().toISOString(),
      readAt: undefined,
    };
    setMessages((current) => [...current, optimistic]);
    setText("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversationId,
          text: optimistic.text,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send message.");
        setMessages((current) =>
          current.filter((message) => message._id !== optimistic._id),
        );
        setText(optimistic.text);
        return;
      }
      setMessages((current) =>
        current.map((message) =>
          message._id === optimistic._id ? data.message : message,
        ),
      );
      setConversations((current) =>
        current.map((conversation) =>
          conversation._id === selectedConversationId
            ? {
                ...conversation,
                lastMessageAt: data.message.createdAt,
                lastMessageText: data.message.text.slice(0, 100),
              }
            : conversation,
        ),
      );
    } catch {
      setError("Network error occurred.");
    }
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="container max-w-screen-sm pt-8 pb-12">
        <div className="kasi-card text-center">
          <p className="mb-3">Sign in to view your conversations.</p>
          <Link href="/sign-in" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loadingConversations) {
    return (
      <div className="container max-w-screen-sm pt-8 pb-12 text-center text-on-surface-variant">
        Loading conversations...
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="container max-w-screen-sm pt-8 pb-12">
        <div className="kasi-card text-center">
          <p className="mb-3 text-on-surface-variant">
            No conversations yet. Start a chat from a gig you&apos;ve applied to.
          </p>
          <Link href="/marketplace" className="btn btn-primary">
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl pt-8 pb-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="kasi-card">
          <h1 className="mb-4 font-headline text-2xl font-bold">Chats</h1>
          <div className="flex flex-col gap-3">
            {conversations.map((conversation) => (
              <button
                key={conversation._id}
                type="button"
                onClick={() => setSelectedConversationId(conversation._id)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  selectedConversationId === conversation._id
                    ? "border-primary bg-primary-container/40"
                    : "border-outline-variant/30 hover:border-primary"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-bold">{conversation.gigTitle}</h2>
                  <span className="text-xs text-outline">
                    {formatRelativeDate(conversation.lastMessageAt)}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-on-surface-variant">
                  {conversation.lastMessageText || "No messages yet."}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <section className="kasi-card flex min-h-[70vh] flex-col">
          <div className="border-b border-outline-variant/30 pb-4">
            <h2 className="font-headline text-2xl font-bold">
              {selectedConversation?.gigTitle || "Conversation"}
            </h2>
          </div>

          {error && <div className="alert alert-danger mt-4">{error}</div>}

          <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-2">
            {loadingMessages ? (
              <div className="py-8 text-center text-on-surface-variant">
                Loading messages...
              </div>
            ) : (
              messages.map((message) => {
                const mine = message.senderId === userId;
                return (
                  <div
                    key={message._id}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        mine
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-low text-on-background"
                      }`}
                    >
                      <div className="mb-1 text-xs opacity-80">
                        {mine ? "You" : message.senderName}
                      </div>
                      <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                      <div className="mt-2 text-[10px] opacity-70">
                        {formatRelativeDate(message.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-outline-variant/30 pt-4">
            <textarea
              className="kasi-input mb-3 min-h-24"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a message..."
            />
            <div className="flex justify-end">
              <button className="btn btn-primary btn-sm" onClick={handleSend}>
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
