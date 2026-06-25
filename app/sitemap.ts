/**
 * app/sitemap.ts
 * KC Apprenticeship Phase 13, Task 122
 *
 * Dynamic sitemap for KasiLink.
 * Generates sitemap.xml from known routes.
 */

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kasilink.com";
  const now = new Date();

  // Static pages
  const staticPages = [
    { path: "/", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/marketplace", priority: 0.9, changeFrequency: "hourly" as const },
    { path: "/forum", priority: 0.7, changeFrequency: "daily" as const },
    { path: "/spotlight", priority: 0.6, changeFrequency: "weekly" as const },
    { path: "/community-calendar", priority: 0.5, changeFrequency: "weekly" as const },
    { path: "/water-outages", priority: 0.6, changeFrequency: "daily" as const },
    { path: "/utility-schedule", priority: 0.6, changeFrequency: "daily" as const },
    { path: "/incidents", priority: 0.5, changeFrequency: "daily" as const },
    { path: "/tutoring", priority: 0.5, changeFrequency: "weekly" as const },
    { path: "/resources", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/verified", priority: 0.5, changeFrequency: "weekly" as const },
    { path: "/studio", priority: 0.6, changeFrequency: "weekly" as const },
    { path: "/sign-in", priority: 0.3, changeFrequency: "monthly" as const },
  ];

  return staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
