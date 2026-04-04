// KasiLink Service Worker
// Caches app shell for offline use. Township users have expensive data.
const CACHE_VERSION = "kasilink-v1";
const APP_SHELL = [
  "/",
  "/marketplace",
  "/forum",
  "/verified",
  "/offline",
];

// Install: cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for API, cache-first for static assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, cross-origin, and Clerk auth requests
  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/webhooks") ||
    url.pathname.startsWith("/_next/webpack")
  ) {
    return;
  }

  // API routes: network-first, fall through to cache, then return null
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          // Cache successful API responses for offline reads (5 min TTL handled by next: revalidate)
          if (res.ok && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
          }
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets (_next/static): cache-first — they're content-hashed, safe forever
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((cached) => cached ?? fetch(request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
        return res;
      }))
    );
    return;
  }

  // Pages: network-first, fall back to cache, then offline page
  event.respondWith(
    fetch(request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
        return res;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached ?? caches.match("/offline"))
      )
  );
});

// Push notifications
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title ?? "KasiLink", {
      body: data.message ?? "You have a new notification",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { link: data.link ?? "/" },
      tag: data.type ?? "general",
    })
  );
});

// Notification click: open the app at the right page
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = event.notification.data?.link ?? "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      const existing = windowClients.find((c) => c.url.includes(self.location.origin));
      if (existing) {
        existing.focus();
        existing.navigate(link);
      } else {
        clients.openWindow(link);
      }
    })
  );
});
