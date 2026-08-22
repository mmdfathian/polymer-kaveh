/**
 * Service Worker - Stale-While-Revalidate Strategy
 * Version: 2026-08-22-01
 * Scope: / (GitHub Pages root)
 */

const CACHE_NAME = 'polymer-kaveh-v20260822-04';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './projects.html',
  './about.html',
  './calculator.html',
  './assets/style.css',
  './assets/app.js',
  './assets/calculator.js',
  './images/logo.svg',
  './data/content.json',
];

// Patterns that should use Network First (fresh data)
const NETWORK_FIRST_PATTERNS = [
  /\/data\/content\.json$/,
];

// Patterns that should use Cache First (static assets)
const CACHE_FIRST_PATTERNS = [
  /\.(?:css|js|woff2?|svg|png|jpg|jpeg|webp|avif|ico)$/,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch((err) => {
            console.warn('[SW] precache skipped:', url, err);
          })
        )
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

function isNetworkFirst(url) {
  return NETWORK_FIRST_PATTERNS.some((pattern) => pattern.test(url));
}

function isCacheFirst(url) {
  return CACHE_FIRST_PATTERNS.some((pattern) => pattern.test(url));
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cachedResponse); // Offline fallback

  return cachedResponse || fetchPromise;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) return cachedResponse;

  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin or GitHub Pages subpath
  if (url.origin !== location.origin) return;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension, etc.
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  let handler;
  if (isNetworkFirst(url.pathname)) {
    handler = networkFirst;
  } else if (isCacheFirst(url.pathname)) {
    handler = cacheFirst;
  } else {
    handler = staleWhileRevalidate;
  }

  event.respondWith(handler(request));
});

// Listen for skipWaiting message from client
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});