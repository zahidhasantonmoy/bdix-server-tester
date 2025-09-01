// public/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('bdix-tester-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/favicon.ico',
        '/favicon.svg',
        '/manifest.json',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});