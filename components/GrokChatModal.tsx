"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

export default function GrokChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/grok" }),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage({ text: inputValue });
    setInputValue("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-3 px-6 py-4 z-50 hover:scale-105"
      >
        <span className="text-3xl">🦾</span>
        <div>
          <div className="font-semibold text-lg leading-none">Ask Grok</div>
          <div className="text-xs opacity-75">KasiLink AI</div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-950 rounded-3xl w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🦾</span>
            <div>
              <h2 className="font-bold text-xl">Grok AI</h2>
              <p className="text-xs text-gray-400">
                Powered by xAI • Gigs, load-shedding, Kasi tips
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMessages([])}
              className="px-4 py-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-950">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">👋</div>
              <p className="text-xl text-gray-300">Hi, I&apos;m Grok!</p>
              <p className="text-gray-400 mt-2 max-w-xs">
                Ask me about local gigs, load shedding, business ideas, or
                anything in Kasi.
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    m.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  {m.parts
                    ?.filter((p) => p.type === "text")
                    .map((p, i) => <span key={i}>{p.type === "text" ? p.text : ""}</span>)}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-2xl px-5 py-3 flex items-center gap-2">
                Grok is thinking
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-gray-800 bg-gray-950"
        >
          <div className="flex gap-3">
            <input
              type="text"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 px-8 rounded-2xl font-medium transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
