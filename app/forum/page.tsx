"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

interface ForumPost {
  _id: string;
  title: string;
  content: string;
  authorName: string;
  category: "general" | "safety" | "load-shedding" | "success_stories";
  upvotes: number;
  createdAt: string;
}

const trustGuidelines = [
  "Confirm pay, timing, and location before meeting.",
  "Use verified profiles when you can, especially for first-time jobs.",
  "Report suspicious listings or unsafe behavior through the community flow.",
];

export default function ForumPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ForumPost["category"]>("general");

  useEffect(() => {
    fetch("/api/forum")
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => setError("Failed to load forum threads."))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(
    () => [
      { label: "Threads", value: posts.length },
      {
        label: "Categories",
        value: new Set(posts.map((post) => post.category)).size || 1,
      },
      { label: "Safety focus", value: "Live" },
    ],
    [posts],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignedIn) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create thread.");
        return;
      }

      setPosts((current) => [data.post, ...current]);
      setTitle("");
      setContent("");
      setCategory("general");
    } catch {
      setError("Network error occurred.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto max-w-5xl pt-8 pb-12">
      <section className="mb-8 text-center">
        <span className="inline-block mb-3 rounded-full bg-primary-container px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Community
        </span>
        <h1 className="mb-3 font-headline text-3xl font-bold md:text-4xl">
          KasiLink Community
        </h1>
        <p className="mx-auto max-w-2xl text-base text-on-surface-variant">
          A shared space for neighbours, job seekers, and providers to swap
          advice, opportunities, and local updates.
        </p>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.label} className="kasi-card">
            <div className="text-xs uppercase tracking-wider text-outline">
              {stat.label}
            </div>
            <div className="mt-2 text-2xl font-bold">{stat.value}</div>
          </article>
        ))}
      </section>

      <section className="kasi-card mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="mb-2 font-headline text-xl font-bold">
              Community trust rules
            </h2>
            <p className="text-sm text-on-surface-variant">
              Simple checks that keep local work exchanges safer and reduce
              avoidable disputes.
            </p>
          </div>
          <Link href="/verified" className="btn btn-outline">
            Browse verified providers
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {trustGuidelines.map((item) => (
            <div key={item} className="rounded-xl bg-surface-container-low p-4">
              <p className="text-sm text-on-surface-variant">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="kasi-card">
          <h2 className="mb-4 font-headline text-2xl font-bold">
            Start a thread
          </h2>
          {!isLoaded || !isSignedIn ? (
            <div className="alert bg-surface-variant text-on-surface text-center">
              <p className="mb-3">Sign in to post in the community.</p>
              <Link href="/sign-in" className="btn btn-primary">
                Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {error && <div className="alert alert-danger">{error}</div>}
              <input
                className="kasi-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Thread title"
                maxLength={150}
              />
              <textarea
                className="kasi-input min-h-32"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share advice, warnings, or questions..."
                maxLength={2000}
              />
              <select
                className="kasi-input"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as ForumPost["category"])
                }
              >
                <option value="general">General</option>
                <option value="safety">Safety</option>
                <option value="load-shedding">Load-shedding</option>
                <option value="success_stories">Success stories</option>
              </select>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Posting..." : "Post thread"}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          <section className="kasi-card text-center">
            <h2 className="mb-3 font-headline text-2xl font-bold">
              Live community threads
            </h2>
            <p className="text-sm text-on-surface-variant">
              Thread list is pulled from MongoDB and ordered by current community
              signal.
            </p>
          </section>

          {loading ? (
            <div className="kasi-card py-10 text-center text-on-surface-variant">
              Loading forum threads...
            </div>
          ) : posts.length === 0 ? (
            <div className="kasi-card py-10 text-center text-on-surface-variant">
              No threads yet. Start the first conversation.
            </div>
          ) : (
            posts.map((post) => (
              <article key={post._id} className="kasi-card">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="badge badge-primary capitalize">
                    {post.category.replace("_", " ")}
                  </span>
                  <span className="text-xs text-outline">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="mb-2 font-bold text-lg">{post.title}</h3>
                <p className="mb-4 text-sm text-on-surface-variant">
                  {post.content}
                </p>
                <div className="flex items-center justify-between text-xs text-outline">
                  <span>By {post.authorName}</span>
                  <span>{post.upvotes} upvotes</span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
