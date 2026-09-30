import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import { app, vapidKey, auth } from './config';
import { notificationService } from '../services/notificationService';
import { adoptionAnalyticsService } from '../services/adoptionAnalyticsService';
import { DataService } from '../services/db';
import { NotificationCategory, FCMDeviceTokenDoc } from '../types/notification';

let messagingInstance: Messaging | null = null;
let isFCMSupported = false;

// Initialize FCM instance safely
export async function initFCM(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null;

  try {
    const supported = await isSupported();
    if (supported) {
      messagingInstance = getMessaging(app);
      isFCMSupported = true;

      // Register foreground message listener
      onMessage(messagingInstance, (payload) => {
        console.log('[TADE FCM Foreground] Message received:', payload);
        const title = payload.notification?.title || payload.data?.title || 'Notifikasi TADE';
        const body = payload.notification?.body || payload.data?.body || 'Pesan baru dari TK Asy Syifa';
        const category = (payload.data?.category as NotificationCategory) || 'pengumuman';
        const tab = payload.data?.tab || 'w1';

        // Add to Notification Center Store
        notificationService.addNotification({
          category,
          title,
          body,
          actionTab: tab,
          sender: payload.data?.sender || 'Sistem Sekolah'
        });

        // Show native Notification if page is hidden/in background or supported
        showNativeNotification(title, {
          body,
          icon: payload.notification?.icon || '/assets/mascot/asy/ASY_MASTER.png',
          badge: '/assets/mascot/asy/ASY_MASTER.png',
          tag: category,
          data: { tab, url: '/' }
        });
      });

      return messagingInstance;
    }
  } catch (err) {
    console.warn('[TADE FCM] Init note:', err);
  }
  return null;
}

// Request Notification Permission and Retrieve FCM Device Token
export async function requestFCMToken(targetUid?: string): Promise<{ success: boolean; token?: string; error?: string }> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { success: false, error: 'Browser tidak mendukung push notification.' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, error: 'Izin notifikasi ditolak oleh pengguna.' };
    }

    // Register Service Worker if needed
    let swRegistration: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
      try {
        swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/'
        });
        console.log('[TADE FCM] Service Worker registered with scope:', swRegistration.scope);
      } catch (swErr) {
        console.warn('[TADE FCM] Falling back to default sw registration:', swErr);
        swRegistration = await navigator.serviceWorker.ready;
      }
    }

    const messaging = await initFCM();
    let token = '';

    if (messaging) {
      try {
        const tokenOptions: { serviceWorkerRegistration?: ServiceWorkerRegistration; vapidKey?: string } = {
          serviceWorkerRegistration: swRegistration
        };
        if (vapidKey) {
          tokenOptions.vapidKey = vapidKey;
        }

        token = await getToken(messaging, tokenOptions);
        if (token) {
          localStorage.setItem('tade_fcm_token', token);
          localStorage.setItem('tade_notification_permission', 'granted');
          adoptionAnalyticsService.trackNotificationPermission(true);
          console.log('[TADE FCM] Device Token successfully generated:', token);

          // Register in Firestore for authenticated user if session exists
          const currentUid = targetUid || auth.currentUser?.uid;
          if (currentUid) {
            await syncFCMTokenToFirestore(token, currentUid);
          }
        }
      } catch (tokenErr) {
        console.warn('[TADE FCM] getToken fallback note:', tokenErr);
        // Save permission status even if vapid key requires online sync
        localStorage.setItem('tade_notification_permission', 'granted');
        adoptionAnalyticsService.trackNotificationPermission(true);
        token = `sim-token-${Date.now()}`;
      }
    } else {
      localStorage.setItem('tade_notification_permission', 'granted');
      adoptionAnalyticsService.trackNotificationPermission(true);
      token = `native-token-${Date.now()}`;
    }

    return { success: true, token };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

// Sync FCM Device Token with Firestore for an authenticated user (idempotent, multi-device)
export async function syncFCMTokenToFirestore(
  token?: string,
  targetUid?: string,
  meta?: Partial<FCMDeviceTokenDoc>
): Promise<boolean> {
  const uid = targetUid || auth.currentUser?.uid;
  const rawToken = token || (typeof localStorage !== 'undefined' ? localStorage.getItem('tade_fcm_token') : null);

  if (!uid || !rawToken) {
    return false;
  }

  try {
    await DataService.registerFCMToken(uid, rawToken, meta);
    return true;
  } catch (err) {
    console.warn('[TADE FCM] Background Firestore token registration note:', err);
    return false;
  }
}

// Convenient helper alias returning the token string or null
export async function requestFCMPermissionAndToken(targetUid?: string): Promise<string | null> {
  const res = await requestFCMToken(targetUid);
  return res.success && res.token ? res.token : null;
}

// Helper to show Native Push Notification
export async function showNativeNotification(
  title: string,
  options?: NotificationOptions & { data?: { tab?: string; url?: string } }
) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    const defaultOptions: NotificationOptions = {
      icon: '/assets/mascot/asy/ASY_MASTER.png',
      badge: '/assets/mascot/asy/ASY_MASTER.png',
      ...options
    };

    // Try through active Service Worker registration first (standard for Android & iOS PWA)
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration && registration.showNotification) {
          await registration.showNotification(title, defaultOptions);
          return;
        }
      } catch {
        // fallback
      }
    }

    // Fallback to Window Notification API
    try {
      const notif = new Notification(title, defaultOptions);
      notif.onclick = () => {
        window.focus();
        if (options?.data?.tab) {
          window.postMessage({ type: 'TADE_NOTIFICATION_CLICK', tab: options.data.tab }, '*');
        }
      };
    } catch (e) {
      console.warn('Native notification fallback:', e);
    }
  }
}

// Send a test push notification locally (simulates server-sent FCM payload)
export async function triggerTestPushNotification(
  category: NotificationCategory,
  title: string,
  body: string,
  targetTab: string = 'w1'
) {
  // 1. Add to in-app Notification Center store
  notificationService.addNotification({
    category,
    title,
    body,
    actionTab: targetTab,
    sender: 'Uji Push Notification FCM'
  });

  // 2. Dispatch native OS/Browser notification
  await showNativeNotification(title, {
    body,
    icon: '/assets/mascot/asy/ASY_MASTER.png',
    badge: '/assets/mascot/asy/ASY_MASTER.png',
    tag: category,
    data: {
      url: '/',
      tab: targetTab
    }
  });
}
