// Mystic Tarot Service Worker - Advanced PWA
const VERSION = '2.0.0';
const CACHE_NAME = `mystic-tarot-v${VERSION}`;
const STATIC_CACHE = `mystic-tarot-static-v${VERSION}`;
const DYNAMIC_CACHE = `mystic-tarot-dynamic-v${VERSION}`;
const IMAGE_CACHE = `mystic-tarot-images-v${VERSION}`;
const FONT_CACHE = `mystic-tarot-fonts-v${VERSION}`;

// Cache size limits
const CACHE_LIMITS = {
  [DYNAMIC_CACHE]: 50,
  [IMAGE_CACHE]: 100,
  [FONT_CACHE]: 10
};

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// Helper: Trim cache to size limit
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    return trimCache(cacheName, maxItems);
  }
}

// Helper: Check if response is valid
function isValidResponse(response) {
  return response && response.status === 200 && response.type === 'basic';
}

// Helper: Get cache name for request
function getCacheNameForRequest(request) {
  const url = new URL(request.url);

  if (request.destination === 'image') return IMAGE_CACHE;
  if (request.destination === 'font') return FONT_CACHE;
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/i)) return IMAGE_CACHE;
  if (url.pathname.match(/\.(woff|woff2|ttf|eot)$/i)) return FONT_CACHE;

  return DYNAMIC_CACHE;
}

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing v' + VERSION);
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch(err => {
          console.error('[Service Worker] Failed to cache some assets:', err);
          // Continue even if some assets fail
        });
      })
      .then(() => {
        console.log('[Service Worker] Static assets cached');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating v' + VERSION);
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, FONT_CACHE];

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => !currentCaches.includes(name))
            .map(name => {
              console.log('[Service Worker] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - Advanced caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Cache-first strategy for static assets
  if (STATIC_ASSETS.some(asset => url.pathname === asset || url.pathname.endsWith(asset))) {
    event.respondWith(
      caches.match(request)
        .then(cached => cached || fetch(request))
    );
    return;
  }

  // Network-first for HTML (always try to get fresh content)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, clone);
            trimCache(DYNAMIC_CACHE, CACHE_LIMITS[DYNAMIC_CACHE]);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then(cached => {
            return cached || caches.match('/offline.html');
          });
        })
    );
    return;
  }

  // Stale-while-revalidate for dynamic content
  event.respondWith(
    caches.match(request)
      .then(cached => {
        const fetchPromise = fetch(request)
          .then(networkResponse => {
            if (isValidResponse(networkResponse)) {
              const cacheName = getCacheNameForRequest(request);
              const clone = networkResponse.clone();

              caches.open(cacheName).then(cache => {
                cache.put(request, clone);
                if (CACHE_LIMITS[cacheName]) {
                  trimCache(cacheName, CACHE_LIMITS[cacheName]);
                }
              });
            }
            return networkResponse;
          })
          .catch(err => {
            console.error('[Service Worker] Fetch failed:', err);
            if (cached) {
              return cached;
            }
            // Return offline fallback
            if (request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#1a0a2e" width="200" height="200"/><text fill="#d4af37" x="50%" y="50%" text-anchor="middle" dy=".3em">Offline</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });

        return cached || fetchPromise;
      })
  );
});

// Handle messages from the main app
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
    event.ports[0]?.postMessage({ success: true });
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: VERSION });
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    caches.open(DYNAMIC_CACHE)
      .then(cache => cache.addAll(urls))
      .then(() => event.ports[0]?.postMessage({ success: true }))
      .catch(err => event.ports[0]?.postMessage({ error: err.message }));
  }
});

// Background sync for saving readings (future enhancement)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-readings') {
    console.log('[Service Worker] Syncing readings...');
    // Future: sync readings to cloud storage
  }
});

// Push notifications (future enhancement)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Time for your daily tarot reading!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/index.html?tab=daily'
      },
      actions: [
        { action: 'open', title: 'Open App' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Mystic Tarot', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/index.html';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        // Check if app is already open
        for (const client of windowClients) {
          if (client.url.includes('index.html') && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

console.log('[Service Worker] Script loaded');
