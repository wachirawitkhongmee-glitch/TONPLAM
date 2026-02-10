const CACHE_NAME = "lifefix-offline-v1";

const OFFLINE_FILES = [
  "./",
  "problems.html",
  "detail.html",
  "solve.html",
  "category.html",
  "style.css",
  "manifest.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
