/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-globals */
const CACHE_VERSION = 'v2'; // Update this when you make changes to your app
const CACHE_NAME = `dumpwatch-cache-${CACHE_VERSION}`;

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/offline.html',
    '/static/js/bundle.js',
    '/static/js/0.chunk.js',
    '/static/js/main.chunk.js',
    '/static/css/main.css',
    '/manifest.json',
    '/favicon.ico',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching app shell');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName.startsWith('dumpwatch-cache-')) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
    self.clients.claim();
    self.clients.matchAll().then((clients) => {
        clients.forEach(client => client.navigate(client.url));
    });
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    // Check if request is for an image
    if (event.request.destination === 'image') {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;
                return fetch(event.request)
                    .then((networkResponse) =>
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        })
                    )
                    .catch(() => caches.match('/offline.html'));
            })
        );
        return;
    }

    // General caching strategy for other requests
    // event.respondWith(
    //     caches.match(event.request).then((cachedResponse) => {
    //         if (cachedResponse) {
    //             // Optionally notify user if offline
    //             if (!navigator.onLine) {
    //                 self.clients.matchAll().then(clients => {
    //                     clients.forEach(client => client.postMessage({ type: 'offline-alert' }));
    //                 });
    //             }
    //             return cachedResponse;
    //         }

    //         return fetch(event.request).then((networkResponse) =>
    //             caches.open(CACHE_NAME).then((cache) => {
    //                 // Cache certain API calls or dynamic content if needed
    //                 if (
    //                     event.request.url.includes('/uploads/') ||
    //                     event.request.url.includes('/get-reports') ||
    //                     event.request.url.includes('/get-comments-by-reportId')
    //                 ) {
    //                     cache.put(event.request, networkResponse.clone());
    //                 }
    //                 return networkResponse;
    //             })
    //         ).catch(() => caches.match('/offline.html'));
    //     })
    // );
});

self.addEventListener('push', (event) => {
    let data;
    try {
        data = event.data ? event.data.json() : {};
    } catch (error) {
        console.error('[Service Worker] Failed to parse push event data:', error);
        data = {};
    }

    const title = data.title || 'New Notification';
    const body = data.body || 'You have a new message';
    const icon = '/favicon.ico';

    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
        })
    );
});

self.addEventListener('controllerchange', () => {
    console.log('[Service Worker] New version available. Refreshing...');
    window.location.reload();
});