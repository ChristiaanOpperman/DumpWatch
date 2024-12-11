// /* eslint-disable no-restricted-globals */
// // Set a cache name
// const CACHE_NAME = 'dumpwatch-cache-v1';

// // List of files to cache
// const FILES_TO_CACHE = [
//     '/',
//     '/index.html',
//     '/static/js/bundle.js',
//     '/static/js/0.chunk.js',
//     '/static/js/main.chunk.js',
//     '/static/css/main.css',
//     '/manifest.json',
//     '/favicon.ico',
// ];

// // Install event - cache assets
// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => {
//             console.log('[Service Worker] Caching app shell');
//             return cache.addAll(FILES_TO_CACHE);
//         })
//     );
//     self.skipWaiting();
// });

// // Activate event - clear old caches
// self.addEventListener('activate', (event) => {
//     event.waitUntil(
//         caches.keys().then((cacheNames) => {
//             return Promise.all(
//                 cacheNames.map((cacheName) => {
//                     if (cacheName !== CACHE_NAME) {
//                         console.log('[Service Worker] Deleting old cache:', cacheName);
//                         return caches.delete(cacheName);
//                     }
//                 })
//             );
//         })
//     );
//     self.clients.claim();
// });

// // Fetch event - serve cached content when offline
// self.addEventListener('fetch', (event) => {
//     if (event.request.method !== 'GET') return;

//     event.respondWith(
//         caches.match(event.request).then((response) => {
//             if (response) {
//                 console.log('[Service Worker] Serving from cache:', event.request.url);
//                 return response;
//             }

//             console.log('[Service Worker] Fetching from network:', event.request.url);
//             return fetch(event.request).then((networkResponse) => {
//                 if (!networkResponse || networkResponse.status !== 200) {
//                     return networkResponse;
//                 }

//                 return caches.open(CACHE_NAME).then((cache) => {
//                     cache.put(event.request, networkResponse.clone());
//                     return networkResponse;
//                 });
//             });
//         })
//     );
// });
