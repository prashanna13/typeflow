const CACHE = "typeflow-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/lessons.html",
  "/trainer.html",
  "/tests.html",
  "/games.html",
  "/progress.html",
  "/guide.html",
  "/daily.html",
  "/weak.html",
  "/css/style.css",
  "/css/components.css",
  "/css/responsive.css",
  "/js/app.js",
  "/js/keyboard.js",
  "/js/engine.js",
  "/js/lessons.js",
  "/js/storage.js",
  "/js/trainer.js",
  "/js/tests.js",
  "/js/games.js",
  "/js/progress.js",
  "/js/home.js",
  "/js/curriculum.js",
  "/js/guide.js",
  "/js/daily.js",
  "/js/weak.js",
  "/assets/favicon.svg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
