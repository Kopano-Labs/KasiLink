// ALERT: This file was accidentally created in the lib/models directory!
// Please move this file to: c:\Users\rkhol\kasi-link\app\forum\page.tsx
"use client";

import { useState } from "react";

export default function ForumPage() {
  const [category, setCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Posts" },
    { id: "safety", label: "Safety Tips" },
    { id: "load-shedding", label: "Load-Shedding" },
    { id: "success_stories", label: "Success Stories" },
  ];

  return (
    <div className="container pt-8 pb-12">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold mb-2">
            Community Forum
          </h1>
          <p className="text-on-surface-variant text-sm">
            The heartbeat of KasiLink. Share tips, coordinate, and connect.
          </p>
        </div>
        <button className="btn btn-primary">+ New Post</button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm cursor-pointer whitespace-nowrap transition-all border ${
              category === cat.id
                ? "border-primary bg-primary-container text-primary"
                : "border-outline-variant bg-transparent text-on-surface-variant"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts Placeholder */}
      <div className="kasi-card text-center text-on-surface-variant py-12">
        <p className="mb-4">No posts found in this category.</p>
        <button className="btn btn-outline">Be the first to post</button>
      </div>
    </div>
  );
}
