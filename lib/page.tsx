"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface ForumPost {
  _id: string;
  title: string;
  content: string;
  authorName: string;
  category: string;
  upvotes: number;
  createdAt: string;
}

const CATEGORIES = [
  { id: "all", label: "All Posts" },
  { id: "safety", label: "Safety Tips" },
  { id: "load-shedding", label: "Load-Shedding" },
  { id: "success_stories", label: "Success Stories" },
];

export default function ForumPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [category, setCategory] = useState("all");
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "general",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [category]);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch(`/api/forum?category=${category}`);
      const data = await res.json();
      if (data.posts) setPosts(data.posts);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignedIn) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to post. Ensure all fields are valid.");
        return;
      }

      setForm({ title: "", content: "", category: "general" });
      setShowForm(false);
      fetchPosts();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container pt-8 pb-12 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold mb-2">
            Community Forum
          </h1>
          <p className="text-on-surface-variant text-sm">
            The heartbeat of KasiLink. Share tips, coordinate, and connect.
          </p>
        </div>
        {isLoaded && isSignedIn && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? "Cancel" : "+ New Post"}
          </button>
        )}
      </div>

      {/* Create Post Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="kasi-card mb-8 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <h2 className="font-headline text-xl font-bold">
            Create a Discussion
          </h2>
          {error && <div className="alert alert-danger">{error}</div>}

          <input
            type="text"
            className="kasi-input"
            placeholder="Post Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            maxLength={120}
          />
          <textarea
            className="kasi-input"
            rows={4}
            placeholder="What's on your mind?"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />
          <select
            className="kasi-input"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="general">General Discussion</option>
            <option value="safety">Safety Tips</option>
            <option value="load-shedding">Load-Shedding</option>
            <option value="success_stories">Success Stories</option>
          </select>

          <button
            type="submit"
            className="btn btn-primary self-end"
            disabled={submitting}
          >
            {submitting ? "Posting..." : "Submit Post"}
          </button>
        </form>
      )}

      {/* Categories Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer whitespace-nowrap transition-all border ${
              category === cat.id
                ? "border-primary bg-primary-container text-primary"
                : "border-outline-variant bg-transparent text-on-surface-variant hover:bg-surface-variant"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="text-center text-on-surface-variant py-12">
          Loading discussions...
        </div>
      ) : posts.length === 0 ? (
        <div className="kasi-card text-center text-on-surface-variant py-12">
          <p className="mb-4">No posts found in this category.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div key={post._id} className="kasi-card flex flex-col gap-2">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-bold text-lg text-on-background leading-tight">
                  {post.title}
                </h3>
                <span className="badge badge-secondary shrink-0">
                  {post.category.replace("_", " ")}
                </span>
              </div>
              <p className="text-on-surface-variant text-sm whitespace-pre-wrap mt-1">
                {post.content}
              </p>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-outline-variant/20 text-xs text-outline">
                <span>
                  Posted by{" "}
                  <strong className="text-on-surface-variant">
                    {post.authorName}
                  </strong>
                </span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
