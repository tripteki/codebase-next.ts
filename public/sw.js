"use strict";

const CACHE_NAME = "codebase-shell-v3";
const PRECACHE_URLS = [
    "/",
    "/admin/auth/login",
    "/manifest.webmanifest",
    "/manifest/icon-192x192.png",
    "/manifest/icon-512x512.png",
];

const PWA_OFFLINE_SHELL_EXCLUDED_PREFIXES = [
    "/api",
    "/admin",
    "/auth",
    "/notifications",
];

const PWA_SW_ASSET_PATH_PATTERNS = [
    /^\/sw\.js$/,
    /^\/workbox-.*\.js$/,
    /^\/manifest\.webmanifest$/,
    /^\/api\/pwa\/manifest$/,
];

function isPwaNavigationDenied (pathname) {
    if (PWA_SW_ASSET_PATH_PATTERNS.some ((pattern) => pattern.test (pathname))) {
        return true;
    }

    return PWA_OFFLINE_SHELL_EXCLUDED_PREFIXES.some ((prefix) =>
        pathname === prefix || pathname.startsWith (`${prefix}/`)
    );
}

self.addEventListener ("push", (event) => {
    if (! event.data) {
        return;
    }

    let data = {};

    try {
        data = event.data.json ();
    } catch {
        data = {};
    }

    const title = String (data.title ?? "Notification");
    const body = String (data.body ?? "");

    event.waitUntil (
        self.registration.showNotification (title, {
            body,
            icon: String (data.icon ?? "/manifest/icon-512x512.png"),
            badge: String (data.badge ?? "/manifest/icon-192x192.png"),
            data: data.data ?? data,
        })
    );
});

self.addEventListener ("notificationclick", (event) => {
    event.notification.close ();

    const data = event.notification.data ?? {};
    const url = String (data.url ?? data.action ?? "/");
    const targetHref = new URL (url, self.location.origin).href;

    event.waitUntil (
        self.clients
            .matchAll ({ type: "window", includeUncontrolled: true, })
            .then ((clientList) => {
                for (const client of clientList) {
                    if (client.url === targetHref && "focus" in client) {
                        return client.focus ();
                    }
                }

                if (self.clients.openWindow) {
                    return self.clients.openWindow (targetHref);
                }
            })
    );
});

self.addEventListener ("install", (event) => {
    event.waitUntil (
        (async () => {
            const cache = await caches.open (CACHE_NAME);

            await cache.addAll (PRECACHE_URLS);
            await self.skipWaiting ();
        })()
    );
});

self.addEventListener ("activate", (event) => {
    event.waitUntil (
        (async () => {
            const cacheNames = await caches.keys ();

            await Promise.all (
                cacheNames.map ((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete (cacheName);
                    }

                    return Promise.resolve ();
                })
            );

            await self.clients.claim ();
        })()
    );
});

self.addEventListener ("fetch", (event) => {
    if (event.request.method !== "GET") {
        return;
    }

    const requestUrl = new URL (event.request.url);

    if (requestUrl.origin !== self.location.origin) {
        return;
    }

    if (
        event.request.mode === "navigate" &&
        isPwaNavigationDenied (requestUrl.pathname)
    ) {
        return;
    }

    if (requestUrl.pathname.startsWith ("/api/")) {
        return;
    }

    if (
        requestUrl.pathname.startsWith ("/_next/") ||
        requestUrl.pathname.startsWith ("/manifest/") ||
        requestUrl.pathname === "/favicon.ico"
    ) {
        return;
    }

    event.respondWith (
        (async () => {
            const cachedResponse = await caches.match (event.request);

            if (cachedResponse) {
                return cachedResponse;
            }

            try {
                const networkResponse = await fetch (event.request);

                if (networkResponse.ok) {
                    const cache = await caches.open (CACHE_NAME);

                    await cache.put (event.request, networkResponse.clone ());
                }

                return networkResponse;
            } catch {
                if (event.request.mode === "navigate") {
                    const fallback = await caches.match ("/");

                    if (fallback) {
                        return fallback;
                    }
                }

                throw new Error ("Offline");
            }
        })()
    );
});
