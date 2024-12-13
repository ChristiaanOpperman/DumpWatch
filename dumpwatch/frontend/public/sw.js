/* eslint-disable no-restricted-globals */
// Set a cache name
const CACHE_NAME = 'dumpwatch-cache-v1';

// List of files to cache
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/offline.html', // Add offline page here
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


// 5️⃣ Offline Fallback Page

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request).catch(() => {
            console.log('[Service Worker] Serving offline page');
            return caches.match('/offline.html');
        })
    );
});

// 6️⃣ Cache Versioning
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});


// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                console.log('[Service Worker] Serving from cache:', event.request.url);
                return response;
            }

            console.log('[Service Worker] Fetching from network:', event.request.url);
            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200) {
                    return networkResponse;
                }

                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
    );
});

// 1️⃣ Dynamic Caching for API Requests
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Cache API requests like `/get-reports` and `/get-comments-by-reportId/:id`
    if (url.pathname.startsWith('/get-reports') || url.pathname.startsWith('/get-comments-by-reportId')) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return fetch(event.request)
                    .then((response) => {
                        if (response && response.status === 200) {
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    })
                    .catch(() => {
                        console.log('[Service Worker] Serving API from cache:', event.request.url);
                        return caches.match(event.request);
                    });
            })
        );
        return;
    }

    // Serve static files from cache (this already exists in your code)
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                console.log('[Service Worker] Serving from cache:', event.request.url);
                return response;
            }

            console.log('[Service Worker] Fetching from network:', event.request.url);
            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200) {
                    return networkResponse;
                }

                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
    );
});

// 2️⃣ Cache Images Dynamically
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Cache images from /uploads/ folder
    if (url.pathname.startsWith('/uploads/')) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log('[Service Worker] Serving cached image:', event.request.url);
                        return cachedResponse;
                    }

                    return fetch(event.request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }
});


// 3️⃣ Background Sync for Pending Uploads
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-uploads') {
        event.waitUntil(
            caches.open(CACHE_NAME).then(async (cache) => {
                const requests = await cache.keys();
                requests.forEach(async (request) => {
                    if (request.url.includes('/create-report')) {
                        const response = await cache.match(request);
                        if (response) {
                            fetch(request, {
                                method: 'POST',
                                body: await response.blob()
                            }).then(() => {
                                console.log('[Service Worker] Report uploaded successfully.');
                                cache.delete(request);
                            }).catch((err) => {
                                console.error('[Service Worker] Failed to re-upload report:', err);
                            });
                        }
                    }
                });
            })
        );
    }
});

// 4️⃣ Push Notifications
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

self.addEventListener('controllerchange', () => {
    alert('New version of the app is available. Please refresh the page.');
});