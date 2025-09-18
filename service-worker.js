self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("todo-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/manifest.json",
        "/style.css",
        "/script.js",
        "/assets/book-192.png",
        "/assets/book-512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
