// TADE Firebase Cloud Messaging & Push Notification Service Worker
// Version: 9.7.1 Go-Live

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Firebase Configuration for TADE Messaging
const firebaseConfig = {
  apiKey: "AIzaSyBcJfKc5C8Xb3fFSaV7pkGp26CE6pF1Bgg",
  authDomain: "big-smithy-kskkt.firebaseapp.com",
  projectId: "big-smithy-kskkt",
  storageBucket: "big-smithy-kskkt.firebasestorage.app",
  messagingSenderId: "991468550333",
  appId: "1:991468550333:web:e643b594e9c3e266da5fd4"
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[TADE FCM SW] Received background message: ', payload);
    const notificationTitle = payload.notification?.title || payload.data?.title || 'TADE - TK Asy Syifa';
    const notificationOptions = {
      body: payload.notification?.body || payload.data?.body || 'Anda menerima pesan penting baru dari sekolah.',
      icon: payload.notification?.icon || '/assets/mascot/asy/ASY_MASTER.png',
      badge: '/assets/mascot/asy/ASY_MASTER.png',
      tag: payload.data?.category || 'tade-general-notification',
      data: {
        url: payload.data?.click_action || payload.data?.url || '/',
        tab: payload.data?.tab || 'w1',
        timestamp: new Date().toISOString(),
        category: payload.data?.category || 'pengumuman'
      },
      vibrate: [200, 100, 200],
      requireInteraction: false
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (e) {
  console.warn('[TADE FCM SW] Compat init fallback, handling standard push events directly:', e);
}

// Fallback generic push listener for raw Web Push / VAPID payloads
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { body: event.data.text() };
    }
  }

  const title = data.title || data.notification?.title || 'TADE - TK Asy Syifa Tanggul';
  const body = data.body || data.notification?.body || 'Informasi terbaru dari ekosistem sekolah.';
  const icon = data.icon || data.notification?.icon || '/assets/mascot/asy/ASY_MASTER.png';
  const badge = '/assets/mascot/asy/ASY_MASTER.png';
  const tag = data.tag || data.data?.category || 'tade-notification';

  const options = {
    body: body,
    icon: icon,
    badge: badge,
    tag: tag,
    vibrate: [150, 80, 150],
    data: {
      url: data.click_action || data.url || data.data?.url || '/',
      tab: data.tab || data.data?.tab || 'w1',
      category: data.category || data.data?.category || 'pengumuman'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click Handler: Focus existing TADE instance or open new window
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
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
      // If not open, open standalone window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
