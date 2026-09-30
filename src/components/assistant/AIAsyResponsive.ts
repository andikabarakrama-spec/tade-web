import React, { useState, useEffect } from 'react';
import { PerformanceMode } from './AIAsyContext';

export interface ResponsiveConfig {
  screenType: 'mobile' | 'tablet' | 'desktop';
  characterScale: number;
  bubbleMaxWidth: number;
  walkDistancePx: number;
  isKeyboardOpen: boolean;
  isModalOpen: boolean;
  bottomOffsetPx: number;
  leftOffsetPx: number;
  performanceMode: PerformanceMode;
}

export const useAIAsyResponsive = (): ResponsiveConfig => {
  const [config, setConfig] = useState<ResponsiveConfig>({
    screenType: 'desktop',
    characterScale: 1,
    bubbleMaxWidth: 320,
    walkDistancePx: 40,
    isKeyboardOpen: false,
    isModalOpen: false,
    bottomOffsetPx: 16,
    leftOffsetPx: 16,
    performanceMode: 'FULL'
  });

  useEffect(() => {
    const handleResizeAndDetect = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 1. Screen Type
      let screenType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      let characterScale = 1;
      let bubbleMaxWidth = 340;
      let walkDistancePx = 50;
      let leftOffsetPx = 24;
      let bottomOffsetPx = 24;

      if (width < 640) {
        screenType = 'mobile';
        characterScale = 0.82;
        bubbleMaxWidth = Math.min(width - 32, 280);
        walkDistancePx = 20;
        leftOffsetPx = 12;
        bottomOffsetPx = 16;
      } else if (width < 1024) {
        screenType = 'tablet';
        characterScale = 0.92;
        bubbleMaxWidth = 300;
        walkDistancePx = 35;
        leftOffsetPx = 16;
        bottomOffsetPx = 20;
      }

      // 2. Detect Keyboard Open (Mobile input focus or virtual keyboard shrink)
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.getAttribute('contenteditable') === 'true');

      const isKeyboardOpen = Boolean(screenType === 'mobile' && isInputFocused);
      if (isKeyboardOpen) {
        bottomOffsetPx = Math.max(bottomOffsetPx, 120); // Move upward when typing
      }

      // 3. Detect Modal Open
      const modalElements = document.querySelectorAll(
        '[role="dialog"], .fixed.inset-0, .modal-backdrop, .bg-slate-900\\/80'
      );
      const isModalOpen = modalElements.length > 0;
      if (isModalOpen) {
        leftOffsetPx = 10; // Shift to edge to stay clear
      }

      // 4. Performance Mode Detection
      let performanceMode: PerformanceMode = 'FULL';
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const memory = (navigator as any).deviceMemory || 4;

      if (hardwareConcurrency <= 2 || memory <= 2 || width < 480) {
        performanceMode = 'LIGHT';
      } else if (hardwareConcurrency <= 4 || memory <= 4) {
        performanceMode = 'NORMAL';
      }

      setConfig({
        screenType,
        characterScale,
        bubbleMaxWidth,
        walkDistancePx,
        isKeyboardOpen,
        isModalOpen,
        bottomOffsetPx,
        leftOffsetPx,
        performanceMode
      });
    };

    handleResizeAndDetect();

    // Listeners
    window.addEventListener('resize', handleResizeAndDetect);
    window.addEventListener('focusin', handleResizeAndDetect);
    window.addEventListener('focusout', handleResizeAndDetect);

    // MutationObserver to detect modal insertions dynamically
    const observer = new MutationObserver(handleResizeAndDetect);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', handleResizeAndDetect);
      window.removeEventListener('focusin', handleResizeAndDetect);
      window.removeEventListener('focusout', handleResizeAndDetect);
      observer.disconnect();
    };
  }, []);

  return config;
};
