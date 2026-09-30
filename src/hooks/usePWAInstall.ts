import React, { useState, useEffect, useCallback } from 'react';
import { adoptionAnalyticsService } from '../services/adoptionAnalyticsService';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const STORAGE_KEY = 'tade_pwa_install_dismissed_v1';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(true); // start true until checked
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    // 1. Service Worker Registration
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.debug('[TADE PWA] SW registration notice:', err);
        });
      });
    }

    // 2. Check Standalone / Installed status
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isNavigatorStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      const standaloneActive = isStandaloneMedia || isNavigatorStandalone;
      setIsStandalone(standaloneActive);
      if (standaloneActive) {
        setIsInstalled(true);
      }
    };

    checkStandalone();

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios|edgios/.test(userAgent);
    setIsIOS(isIOSDevice && isSafari);

    // 4. Check LocalStorage dismissal
    try {
      const dismissedTimestamp = localStorage.getItem(STORAGE_KEY);
      if (dismissedTimestamp) {
        // If dismissed within the last 7 days, keep it hidden
        const parsedTime = parseInt(dismissedTimestamp, 10);
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - parsedTime < sevenDaysMs) {
          setIsDismissed(true);
        } else {
          setIsDismissed(false);
        }
      } else {
        setIsDismissed(false);
      }
    } catch {
      setIsDismissed(false);
    }

    // 5. Listen to beforeinstallprompt event (Android / Chromium)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    // 6. Listen to appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      adoptionAnalyticsService.trackPWAInstall();
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Trigger Install (for Android/Chromium)
  const promptInstall = useCallback(async (): Promise<'accepted' | 'dismissed' | 'unsupported'> => {
    if (!deferredPrompt) {
      return 'unsupported';
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        adoptionAnalyticsService.trackPWAInstall();
      }
      return choiceResult.outcome;
    } catch (err) {
      console.error('[TADE PWA] Prompt install error:', err);
      return 'unsupported';
    }
  }, [deferredPrompt]);

  // Dismiss Banner
  const dismissBanner = useCallback((permanentDays: number = 7) => {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {}
  }, []);

  // Force show banner (for testing or button click)
  const showBanner = useCallback(() => {
    setIsDismissed(false);
  }, []);

  const shouldShowBanner = !isStandalone && !isInstalled && !isDismissed && (isInstallable || isIOS);

  return {
    isInstallable,
    isInstalled,
    isStandalone,
    isIOS,
    isDismissed,
    shouldShowBanner,
    promptInstall,
    installPWA: promptInstall,
    dismissBanner,
    showBanner
  };
}
