const CACHE_NAME = 'agridoc-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});

// Mock background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-farming-data') {
    console.log('Background sync: Data pushed to cloud');
  }
});
