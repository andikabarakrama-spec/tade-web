// TADE Service Worker (Smart PWA Caching & Offline Resilience)
const CACHE_NAME = 'tade-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/mascot/asy/ASY_MASTER.png',
  '/assets/mascot/asy/ASY_MASTER.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[TADE SW] Pre-cache error:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests and http/https schemes
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  // Network First with Cache Fallback for HTML/Navigation, Stale While Revalidate for static assets
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch((err) => {
          // If offline and requested an image, return cached fallback if any
          return cachedResponse;
        });
    })
  );
});

// Push notification listeners for PWA & FCM integration
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { body: event.data.text() };
    }
  }

  const title = data.title || (data.notification && data.notification.title) || 'TADE - TK Asy Syifa Tanggul';
  const body = data.body || (data.notification && data.notification.body) || 'Informasi penting baru dari sekolah.';
  const icon = data.icon || (data.notification && data.notification.icon) || '/assets/mascot/asy/ASY_MASTER.png';
  const badge = '/assets/mascot/asy/ASY_MASTER.png';
  const tag = data.tag || (data.data && data.data.category) || 'tade-push-notification';

  const options = {
    body,
    icon,
    badge,
    tag,
    vibrate: [200, 100, 200],
    data: {
      url: data.click_action || data.url || (data.data && data.data.url) || '/',
      tab: data.tab || (data.data && data.data.tab) || 'w1',
      category: data.category || (data.data && data.data.category) || 'pengumuman'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          if (event.notification.data && event.notification.data.tab) {
            client.postMessage({
              type: 'TADE_NOTIFICATION_CLICK',
              tab: event.notification.data.tab,
              category: event.notification.data.category
            });
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

