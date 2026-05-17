const CACHE = 'gym-tracker-v1';
const SHELL = [
  '/Briscolone/gym-tracker.html',
  '/Briscolone/gym-manifest.json',
  '/Briscolone/gym-icon-192.png',
  '/Briscolone/gym-icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Always go network-first for Google APIs
  if (url.hostname.includes('googleapis.com') || url.hostname.includes('google.com')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Cache-first for app shell
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
