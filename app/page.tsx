import Link from "next/link";
import connectDB from "@/lib/db";
import Gig from "@/lib/models/Gig";
import LoadSheddingWidget from "@/components/LoadSheddingWidget";
import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";

export const dynamic = "force-dynamic";

async function getRecentGigs() {
  try {
    await connectDB();
    const gigs = await Gig.find({ status: "open" })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // Prevent Next.js serialization crash with Mongoose ObjectId
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return gigs.map((gig: any) => ({
      ...gig,
      _id: gig._id.toString(),
    }));
  } catch {
    return [];
  }
}

// ──────────────────────────────────────────────────────────────
// Grok AI Chat Modal (floating widget)
// ──────────────────────────────────────────────────────────────
function GrokChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: "/api/grok", // ← NEW PATH (does not touch your real chat)
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearChat = () => setMessages([]);

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
              onClick={clearChat}
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
                  {m.content}
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
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
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

// ──────────────────────────────────────────────────────────────
// Main HomePage (your original code + Grok button)
// ──────────────────────────────────────────────────────────────
export default async function HomePage() {
  const gigs = await getRecentGigs();

  const signals = [
    {
      title: "Utility-aware job search",
      description:
        "Track load-shedding and outages so workers and providers can plan around disruptions.",
      href: "/water-outages",
      cta: "View utility alerts",
    },
    {
      title: "Trusted local providers",
      description:
        "Verified profiles and community reviews reduce risk before anyone accepts a job or booking.",
      href: "/verified",
      cta: "Browse verified providers",
    },
    {
      title: "Neighbourhood coordination",
      description:
        "Forum updates help communities share safety notes, local demand, and service disruptions.",
      href: "/forum",
      cta: "Open community board",
    },
  ];

  return (
    <div className="pb-12">
      {/* === YOUR ORIGINAL HOMEPAGE (100% unchanged) === */}
      {/* Hero */}
      <section className="bg-gradient-to-br from-surface-variant to-background border-b border-outline-variant/30 py-12">
        <div className="container text-center max-w-screen-sm mx-auto">
          <span className="inline-block mb-4 px-3 py-1 rounded-full bg-primary-container text-primary text-xs font-semibold tracking-wider uppercase">
            South Africa&apos;s Township Platform
          </span>
          <h1 className="text-4xl md:text-5xl tracking-tight mb-4 font-headline font-black">
            Local gigs.
            <br />
            <span className="text-primary">Near you.</span> Right now.
          </h1>
          <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">
            KasiLink is a township-first work network built around proximity,
            trust, and real-time local conditions. Find work, post urgent jobs,
            and coordinate without the usual distance and admin overhead.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/marketplace" className="btn btn-primary btn-lg">
              Find Gigs Near Me
            </Link>
            <Link href="/gigs/new" className="btn btn-outline btn-lg">
              Post a Gig
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-outline-variant/30 bg-surface-container-low">
        <div className="container">
          <div className="flex justify-center gap-10 py-5 flex-wrap">
            {[
              { value: "31.4%", label: "SA Unemployment" },
              { value: "57%", label: "Youth Without Work" },
              { value: "5km", label: "Average Gig Distance" },
              { value: "0", label: "CV Required" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-primary font-headline">
                  {value}
                </div>
                <div className="text-xs text-on-surface-variant mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Load-shedding notice */}
      <div className="container pt-6">
        <LoadSheddingWidget />
      </div>

      <section className="container pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {signals.map((signal) => (
            <div key={signal.title} className="kasi-card flex flex-col">
              <h2 className="font-headline text-xl font-bold mb-2">
                {signal.title}
              </h2>
              <p className="text-sm text-on-surface-variant mb-4">
                {signal.description}
              </p>
              <Link href={signal.href} className="text-sm text-primary mt-auto">
                {signal.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Gigs */}
      <section className="container pt-10">
        <div className="flex justify-between items-baseline mb-6">
          <h2 className="font-headline font-bold text-2xl">Latest Gigs</h2>
          <Link
            href="/marketplace"
            className="text-sm text-primary hover:underline"
          >
            See all →
          </Link>
        </div>

        {gigs.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <p className="mb-4">No gigs yet — be the first to post one.</p>
            <Link href="/gigs/new" className="btn btn-primary">
              Post a Gig
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {gigs.map((gig: any) => (
              <Link
                key={gig._id}
                href={`/gigs/${gig._id}`}
                className="no-underline block"
              >
                <div className="kasi-card h-full cursor-pointer hover:border-primary transition-colors flex flex-col">
                  {gig.isUrgent && (
                    <span className="badge badge-danger mb-2 inline-block self-start">
                      Urgent
                    </span>
                  )}
                  <div className="flex gap-2 mb-2.5">
                    <span className="badge badge-primary">
                      {gig.category.replace("_", " ")}
                    </span>
                    {gig.isProviderVerified && (
                      <span className="badge badge-success">✓</span>
                    )}
                  </div>
                  <h3 className="text-base font-bold mb-1.5">{gig.title}</h3>
                  <p className="text-sm text-on-surface-variant line-clamp-2 mb-3">
                    {gig.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="font-bold text-primary">
                      {gig.payDisplay}
                    </span>
                    <span className="text-xs text-outline">
                      📍 {gig.location?.suburb || "Local"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="container pt-12">
        <div className="flex justify-between items-end mb-8 flex-wrap gap-3">
          <div>
            <h2 className="font-headline font-bold text-2xl">
              Core Marketplace Loop
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Structure priority: gig posting, browse, apply, verify,
              coordinate.
            </p>
          </div>
          <Link
            href="/profile"
            className="text-sm text-primary hover:underline"
          >
            Open my dashboard
          </Link>
        </div>
        <h3 className="text-center mb-8 font-headline font-bold text-2xl">
          How KasiLink Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {[
            {
              icon: "📱",
              step: "1",
              title: "Sign up with your phone",
              desc: "No email needed. Just your SA number (+27).",
            },
            {
              icon: "📍",
              step: "2",
              title: "Find gigs near you",
              desc: "Browse by category or let us show nearby opportunities.",
            },
            {
              icon: "💬",
              step: "3",
              title: "Chat & coordinate",
              desc: "Message providers directly. No middleman.",
            },
            {
              icon: "✅",
              step: "4",
              title: "Get paid",
              desc: "Complete the gig and build your verified reputation.",
            },
          ].map(({ icon, step, title, desc }) => (
            <div
              key={step}
              className="kasi-card text-center flex flex-col items-center"
            >
              <div className="text-3xl mb-3">{icon}</div>
              <div className="text-xs text-primary font-semibold mb-2">
                STEP {step}
              </div>
              <h3 className="text-base font-bold mb-2">{title}</h3>
              <p className="text-sm text-on-surface-variant">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-container border-t border-outline-variant/30 mt-12">
        <div className="container text-center py-12">
          <h2 className="font-headline font-bold text-2xl mb-4 text-on-primary-container">
            Ready to start?
          </h2>
          <p className="text-on-surface-variant mb-6">
            Join thousands of South Africans finding work in their
            neighbourhood.
          </p>
          <Link href="/sign-in" className="btn btn-primary btn-lg">
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Grok AI floating button & modal */}
      <GrokChatModal />
    </div>
  );
}
