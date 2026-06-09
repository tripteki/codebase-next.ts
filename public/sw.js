"use strict";

const CACHE_NAME = "codebase-shell-v1";
const PRECACHE_URLS = [
    "/",
    "/manifest.webmanifest",
    "/manifest/icon-192x192.png",
    "/manifest/icon-384x384.png",
    "/manifest/icon-512x512.png",
];

self.addEventListener ("install", (event) =>
{
    event.waitUntil ((
        async () =>
        {
            const cache = await caches.open (CACHE_NAME);

            await cache.addAll (PRECACHE_URLS);
            await self.skipWaiting ();
        }
    ) ());
});

self.addEventListener ("activate", (event) =>
{
    event.waitUntil ((
        async () =>
        {
            const cacheNames = await caches.keys ();

            await Promise.all (cacheNames.map ((cacheName) =>
            {
                if (cacheName !== CACHE_NAME)
                {
                    return caches.delete (cacheName);
                }

                return Promise.resolve ();
            }));

            await self.clients.claim ();
        }
    ) ());
});

self.addEventListener ("fetch", (event) =>
{
    if (event.request.method !== "GET")
    {
        return;
    }

    const requestUrl = new URL (event.request.url);

    if (requestUrl.pathname.startsWith ("/api/"))
    {
        return;
    }

    event.respondWith ((
        async () =>
        {
            const cachedResponse = await caches.match (event.request);

            if (cachedResponse)
            {
                return cachedResponse;
            }

            try
            {
                const networkResponse = await fetch (event.request);

                if (networkResponse.ok && requestUrl.origin === self.location.origin)
                {
                    const cache = await caches.open (CACHE_NAME);

                    await cache.put (event.request, networkResponse.clone ());
                }

                return networkResponse;
            }
            catch
            {
                const fallback = await caches.match ("/");

                if (fallback)
                {
                    return fallback;
                }

                throw new Error ("Offline");
            }
        }
    ) ());
});
