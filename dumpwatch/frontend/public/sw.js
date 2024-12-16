/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'dumpwatch-cache-v1';

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

// Activate event - remove old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => 
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

// Unified fetch event - handles static files, images, and API requests
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log('[Service Worker] Serving from cache:', event.request.url);
                return cachedResponse;
            }

            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200) {
                    console.log('[Service Worker] Fetch failed, serving offline page');
                    return caches.match('/offline.html');
                }

                return caches.open(CACHE_NAME).then((cache) => {
                    if (url.pathname.startsWith('/uploads/') || url.pathname.startsWith('/get-reports') || url.pathname.startsWith('/get-comments-by-reportId')) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                });
            }).catch(() => caches.match('/offline.html'));
        })
    );
});

// Push notification event
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
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

// Alert user when a new service worker is activated
self.addEventListener('controllerchange', () => {
    alert('New version of the app is available. Please refresh the page.');
});
