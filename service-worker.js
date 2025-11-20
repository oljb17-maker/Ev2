const CACHE_NAME = "evlogbook-cache-v1";
const URLS_TO_CACHE = [
  ".",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

// Instalación: cachea archivos básicos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

// Activación: limpia caches viejos si cambias versión
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

// Fetch: responde desde cache cuando se pueda
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return (
        resp ||
        fetch(event.request).catch(() =>
          // Si estás offline y falla, intenta devolver index.html
          caches.match("index.html")
        )
      );
    })
  );
});