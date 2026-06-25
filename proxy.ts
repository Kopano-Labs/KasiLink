import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/profile(.*)",
  "/gigs/new(.*)",
  "/chat(.*)",
  "/incidents/new(.*)",
  "/tutoring/new(.*)",
  "/community-calendar/new(.*)",
  "/spotlight/new(.*)",
  "/my-water-reports(.*)",
]);

const protectedProxy = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect({
      unauthenticatedUrl: new URL("/sign-in", req.url).toString(),
    });
  }
});

// Next.js 16: export named "proxy" (middleware.ts is deprecated)
export function proxy(req: NextRequest, event: NextFetchEvent) {
  const host = req.headers.get("host") ?? "";

  if (host.startsWith("127.0.0.1") || host.startsWith("localhost")) {
    return NextResponse.next();
  }

  return protectedProxy(req, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
