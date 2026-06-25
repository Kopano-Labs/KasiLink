/**
 * app/robots.ts
 * KC Apprenticeship Phase 13, Task 123
 *
 * robots.txt for KasiLink.
 * Allows all crawlers, blocks API and auth routes.
 */

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/sign-in/",
          "/admin/",
          "/chat/",
          "/profile/",
          "/gigs/new/",
        ],
      },
    ],
    sitemap: "https://kasilink.com/sitemap.xml",
  };
}
