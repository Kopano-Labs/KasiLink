"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const discussionTopics = [
  {
    title: "Local hustle tips",
    description:
      "Share what is working in your area, from pricing to finding repeat clients.",
  },
  {
    title: "Safety and scam alerts",
    description:
      "Post community warnings and practical checks before taking a gig.",
  },
  {
    title: "Tools, training, and referrals",
    description:
      "Exchange referrals, short courses, and resources that help people earn.",
  },
];

interface ForumPostData {
  _id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  createdAt: string;
}

function ForumInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn } = useUser();

  const [posts, setPosts] = useState<ForumPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const limit = 10;

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(
    searchParams.get("category") ?? "all",
  );

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const [postError, setPostError] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (category && category !== "all") params.set("category", category);
      params.set("page", String(page));
      params.set("limit", String(limit));

      const res = await fetch(`/api/forum?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPosts(data.posts ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [query, category, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category && category !== "all") params.set("category", category);
    params.set("page", "1");
    router.replace(`/forum?${params.toString()}`, { scroll: false });
    setPage(1);
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError("");
    if (!isSignedIn) {
      setPostError("You must be signed in to post.");
      return;
    }

    if (newTitle.trim().length < 5) {
      setPostError("Title must be at least 5 characters.");
      return;
    }

    if (newContent.trim().length < 20) {
      setPostError("Message must be at least 20 characters.");
      return;
    }

    setIsPosting(true);
    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          category: newCategory,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create post");
      }

      setNewTitle("");
      setNewContent("");
      setNewCategory("general");
      setPage(1);
      fetchPosts();
    } catch (err: unknown) {
      setPostError(
        err instanceof Error ? err.message : "Failed to create post",
      );
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="container pt-8 pb-12 max-w-5xl mx-auto">
      <section className="mb-8 text-center">
        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-primary-container text-primary text-xs font-semibold tracking-wider uppercase">
          Community
        </span>
        <h1 className="font-headline text-3xl md:text-4xl font-bold mb-3">
          KasiLink Community
        </h1>
        <p className="text-on-surface-variant text-base max-w-2xl mx-auto">
          A shared space for neighbours, job seekers, and providers to swap
          advice, opportunities, and local updates.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {discussionTopics.map((topic) => (
          <article key={topic.title} className="kasi-card">
            <h2 className="font-bold text-lg mb-2">{topic.title}</h2>
            <p className="text-sm text-on-surface-variant">
              {topic.description}
            </p>
          </article>
        ))}
      </section>

      <section className="kasi-card text-center mb-8 border-primary/20">
        <h2 className="font-headline text-2xl font-bold mb-3">
          Trusted Community Space
        </h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto mb-6">
          Review safety notes and find trusted individuals before taking on a
          gig.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/marketplace" className="btn btn-primary">
            Browse Gigs
          </Link>
          <Link href="/verified" className="btn btn-outline">
            View Verified Providers
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="search"
              placeholder="Search threads..."
              className="kasi-input flex-1"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
            <select
              className="kasi-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Topics</option>
              <option value="general">General</option>
              <option value="safety">Safety Alerts</option>
              <option value="load-shedding">Load-Shedding</option>
              <option value="success_stories">Success Stories</option>
            </select>
            <button className="btn btn-primary" onClick={applyFilters}>
              Search
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10 text-on-surface-variant">
              Loading threads...
            </div>
          ) : posts.length === 0 ? (
            <div className="kasi-card text-center py-10 text-on-surface-variant">
              No threads found. Start the conversation!
            </div>
          ) : (
            <div className="flex flex-col gap-4 mb-8">
              {posts.map((post) => (
                <article key={post._id} className="kasi-card">
                  <div className="flex justify-between items-start mb-2">
                    <span className="badge badge-secondary capitalize">
                      {post.category.replace("-", " ")}
                    </span>
                    <span className="text-xs text-outline">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">{post.title}</h3>
                  <p className="text-on-surface-variant text-sm mb-4 whitespace-pre-wrap break-words">
                    {post.content}
                  </p>
                  <div className="text-xs text-outline font-semibold">
                    Posted by {post.authorName}
                  </div>
                </article>
              ))}
            </div>
          )}

          {total > limit && (
            <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl">
              <button
                className="btn btn-outline btn-sm"
                disabled={page <= 1}
                onClick={() => {
                  setPage((p) => p - 1);
                  window.scrollTo(0, 0);
                }}
              >
                ← Previous
              </button>
              <span className="text-sm text-on-surface-variant">
                Page {page} of {Math.ceil(total / limit)}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={page >= Math.ceil(total / limit)}
                onClick={() => {
                  setPage((p) => p + 1);
                  window.scrollTo(0, 0);
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>

        <aside>
          <div className="kasi-card sticky top-20">
            <h3 className="font-bold font-headline text-lg mb-4">
              Start a Thread
            </h3>
            <form onSubmit={handlePost} className="flex flex-col gap-4">
              {postError && (
                <div className="text-danger text-sm font-semibold">
                  {postError}
                </div>
              )}
              <div>
                <label className="label">Category</label>
                <select
                  className="kasi-input"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="general">General</option>
                  <option value="safety">Safety Alerts</option>
                  <option value="load-shedding">Load-Shedding</option>
                  <option value="success_stories">Success Stories</option>
                </select>
              </div>
              <div>
                <label className="label">Title</label>
                <input
                  type="text"
                  className="kasi-input"
                  required
                  maxLength={150}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea
                  className="kasi-input"
                  rows={5}
                  required
                  maxLength={2000}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isPosting || !isSignedIn}
              >
                {isPosting
                  ? "Posting..."
                  : isSignedIn
                    ? "Post Thread"
                    : "Sign In to Post"}
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function ForumPage() {
  return (
    <Suspense
      fallback={
        <div className="container pt-8 text-center">Loading community...</div>
      }
    >
      <ForumInner />
    </Suspense>
  );
}
