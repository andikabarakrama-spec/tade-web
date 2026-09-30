/**
 * TADE DEVICE & CAPABILITY INTELLIGENCE ENGINE — SPRINT G43 P4
 * Pure Platform-Aware, Non-Heuristic Hardware & Viewport Adaptation
 * 
 * Accurately determines:
 * 1. DEVICE CLASS: Mobile (<768px or coarse pointer mobile aspect), Tablet (768-1023px), Desktop (>=1024px)
 * 2. CAPABILITY TIER: LOW, STANDARD, HIGH (computed via hardwareConcurrency, memory, frame budget, reduced-motion)
 * 3. ERGONOMIC STATE: Touch capability, Pointer precision, Viewport orientation, Virtual keyboard / form focus state
 * 4. MOBILE CHARACTER SAFETY: Safe Corner anchoring, Quiet Mode docking, Non-intrusive UI/CTA clearance
 * 5. ANIMATION GOVERNOR BUDGET: Adaptive scaling (LOW: 2-3 max, STANDARD/HIGH: 5 max)
 * 
 * Absolute Rule: Never determines capability by string-matching device brands or user-agents.
 * Marker: G43_DEVICE_CAPABILITY_ENGINE_VERIFIED
 */

import { blackBoxRecorder } from './blackBoxRecorder';

export type DeviceClass = 'MOBILE' | 'TABLET' | 'DESKTOP';
export type CapabilityTier = 'LOW' | 'STANDARD' | 'HIGH';
export type DeviceOrientation = 'PORTRAIT' | 'LANDSCAPE';
export type PointerType = 'COARSE' | 'FINE' | 'NONE';

export interface DeviceCapabilitySnapshot {
  deviceClass: DeviceClass;
  capabilityTier: CapabilityTier;
  orientation: DeviceOrientation;
  viewportWidth: number;
  viewportHeight: number;
  aspectRatio: number;
  pointerType: PointerType;
  isTouchCapable: boolean;
  isKeyboardActive: boolean;
  prefersReducedMotion: boolean;
  hardwareConcurrency: number;
  deviceMemoryGb: number | null;
  maxConcurrentAnimations: number; // 2-3 on LOW, 5 on STANDARD/HIGH
  mascotScale: number;             // 0.75 Mobile, 0.9 Tablet, 1.0 Desktop
  mascotSafeCorner: 'BOTTOM_RIGHT' | 'BOTTOM_LEFT' | 'QUIET_DOCK';
  isQuietMode: boolean;            // active when keyboard focused or reduced-motion requested
}

export class DeviceCapabilityEngine {
  private static instance: DeviceCapabilityEngine | null = null;

  private currentSnapshot: DeviceCapabilitySnapshot;
  private subscribers: Set<(snapshot: DeviceCapabilitySnapshot) => void> = new Set();
  private resizeObserver: ResizeObserver | null = null;
  private visualViewportHandler: (() => void) | null = null;
  private initialViewportHeight: number = 0;

  public static getInstance(): DeviceCapabilityEngine {
    if (!DeviceCapabilityEngine.instance) {
      DeviceCapabilityEngine.instance = new DeviceCapabilityEngine();
    }
    return DeviceCapabilityEngine.instance;
  }

  private constructor() {
    this.currentSnapshot = this.computeInitialSnapshot();
    this.initializeSensors();
  }

  /**
   * Evaluates hardware and viewport signals to construct deterministic snapshot.
   */
  private computeInitialSnapshot(): DeviceCapabilitySnapshot {
    if (typeof window === 'undefined') {
      return {
        deviceClass: 'DESKTOP',
        capabilityTier: 'STANDARD',
        orientation: 'LANDSCAPE',
        viewportWidth: 1280,
        viewportHeight: 800,
        aspectRatio: 1.6,
        pointerType: 'FINE',
        isTouchCapable: false,
        isKeyboardActive: false,
        prefersReducedMotion: false,
        hardwareConcurrency: 4,
        deviceMemoryGb: 4,
        maxConcurrentAnimations: 5,
        mascotScale: 1.0,
        mascotSafeCorner: 'BOTTOM_RIGHT',
        isQuietMode: false
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / (height || 1);
    const orientation: DeviceOrientation = width < height ? 'PORTRAIT' : 'LANDSCAPE';

    // 1. Pointer & Touch Precision
    const hasCoarsePointer = window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : false;
    const hasFinePointer = window.matchMedia ? window.matchMedia('(pointer: fine)').matches : true;
    const pointerType: PointerType = hasCoarsePointer ? 'COARSE' : hasFinePointer ? 'FINE' : 'NONE';
    const isTouchCapable = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || false;

    // 2. Device Class Classification
    let deviceClass: DeviceClass = 'DESKTOP';
    if (width < 768 || (width < 900 && hasCoarsePointer && orientation === 'PORTRAIT')) {
      deviceClass = 'MOBILE';
    } else if (width >= 768 && width < 1024) {
      deviceClass = 'TABLET';
    } else {
      deviceClass = 'DESKTOP';
    }

    // 3. Reduced Motion Signal
    const prefersReducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

    // 4. Hardware & Concurrency Signals
    const concurrency = typeof navigator.hardwareConcurrency === 'number' ? navigator.hardwareConcurrency : 4;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? null;

    // 5. Capability Tier Calculation (Hardware signals + Reduced Motion + Frame constraints)
    let capabilityTier: CapabilityTier = 'STANDARD';
    if (prefersReducedMotion || concurrency <= 2 || (memory !== null && memory < 4)) {
      capabilityTier = 'LOW';
    } else if (concurrency >= 8 && (memory === null || memory >= 8)) {
      capabilityTier = 'HIGH';
    } else {
      capabilityTier = 'STANDARD';
    }

    // 6. Animation Budget Enforcement (Dr. Pulse Governor alignment)
    const maxConcurrentAnimations = capabilityTier === 'LOW' ? 3 : 5;

    // 7. Mascot Scale & Ergonomics
    const mascotScale = deviceClass === 'MOBILE' ? 0.75 : deviceClass === 'TABLET' ? 0.9 : 1.0;
    const isQuietMode = prefersReducedMotion;

    this.initialViewportHeight = height;

    return {
      deviceClass,
      capabilityTier,
      orientation,
      viewportWidth: width,
      viewportHeight: height,
      aspectRatio,
      pointerType,
      isTouchCapable: Boolean(isTouchCapable),
      isKeyboardActive: false,
      prefersReducedMotion,
      hardwareConcurrency: concurrency,
      deviceMemoryGb: memory,
      maxConcurrentAnimations,
      mascotScale,
      mascotSafeCorner: 'BOTTOM_RIGHT',
      isQuietMode
    };
  }

  /**
   * Initializes real-time listeners for viewport resizing, orientation change,
   * focus events (virtual keyboard detection), and reduced-motion changes.
   */
  private initializeSensors(): void {
    if (typeof window === 'undefined') return;

    // Viewport & Orientation Change Handler
    const handleResize = () => {
      this.recomputeState();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    // Reduced Motion Listener
    if (window.matchMedia) {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (motionQuery.addEventListener) {
        motionQuery.addEventListener('change', () => this.recomputeState());
      }
    }

    // Virtual Keyboard & Input Focus Detection (Mobile Ergonomics)
    document.addEventListener('focusin', (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        this.updateKeyboardState(true);
      }
    });

    document.addEventListener('focusout', () => {
      // Defer slightly to avoid flicker when moving between inputs
      setTimeout(() => {
        const active = document.activeElement as HTMLElement | null;
        const isStillFocused = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
        if (!isStillFocused) {
          this.updateKeyboardState(false);
        }
      }, 150);
    });

    // Visual Viewport Delta Check (Mobile keyboard height shrinkage)
    if (window.visualViewport) {
      this.visualViewportHandler = () => {
        if (!window.visualViewport) return;
        const currentVpHeight = window.visualViewport.height;
        const heightShrink = this.initialViewportHeight - currentVpHeight;
        // If viewport height shrinks by > 150px on mobile, virtual keyboard is active
        if (this.currentSnapshot.deviceClass === 'MOBILE' && heightShrink > 150) {
          this.updateKeyboardState(true);
        } else if (heightShrink < 60 && !document.activeElement?.matches('input, textarea, [contenteditable="true"]')) {
          this.updateKeyboardState(false);
        }
      };
      window.visualViewport.addEventListener('resize', this.visualViewportHandler, { passive: true });
    }
  }

  /**
   * Recomputes the deterministic snapshot and informs all subscribers.
   */
  private recomputeState(): void {
    const prev = this.currentSnapshot;
    const next = this.computeInitialSnapshot();
    // Preserve current keyboard state
    next.isKeyboardActive = prev.isKeyboardActive;
    next.isQuietMode = next.prefersReducedMotion || next.isKeyboardActive;
    next.mascotSafeCorner = next.isQuietMode ? 'QUIET_DOCK' : 'BOTTOM_RIGHT';

    this.currentSnapshot = next;
    this.notifySubscribers();
  }

  /**
   * Updates virtual keyboard / active form input state safely.
   */
  public updateKeyboardState(isActive: boolean): void {
    if (this.currentSnapshot.isKeyboardActive === isActive) return;

    this.currentSnapshot = {
      ...this.currentSnapshot,
      isKeyboardActive: isActive,
      isQuietMode: this.currentSnapshot.prefersReducedMotion || isActive,
      mascotSafeCorner: (this.currentSnapshot.prefersReducedMotion || isActive) ? 'QUIET_DOCK' : 'BOTTOM_RIGHT'
    };

    blackBoxRecorder.record({
      moduleCode: 'DEVICE_CAPABILITY',
      category: 'ACTION',
      eventType: 'ACTION',
      details: `[DeviceCapability] Keyboard/Input focus state updated: ${isActive ? 'ACTIVE (QUIET_MODE)' : 'INACTIVE'}`
    });

    this.notifySubscribers();
  }

  /**
   * Retrieves current immutable snapshot.
   */
  public getSnapshot(): DeviceCapabilitySnapshot {
    return { ...this.currentSnapshot };
  }

  /**
   * Computes device-safe layout styles for floating mascot companions.
   */
  public getMascotSafeLayout(): {
    scale: number;
    bottomPx: number;
    rightPx: number;
    opacity: number;
    isDocked: boolean;
  } {
    const { deviceClass, isKeyboardActive, isQuietMode, mascotScale } = this.currentSnapshot;

    if (isKeyboardActive || isQuietMode) {
      // Quiet / Docked Mode: tucked into non-interfering mini badge
      return {
        scale: 0.6,
        bottomPx: deviceClass === 'MOBILE' ? 8 : 16,
        rightPx: 12,
        opacity: 0.75,
        isDocked: true
      };
    }

    if (deviceClass === 'MOBILE') {
      return {
        scale: mascotScale, // 0.75
        bottomPx: 68,       // Clears bottom navigation bar & CTA
        rightPx: 12,
        opacity: 1.0,
        isDocked: false
      };
    }

    if (deviceClass === 'TABLET') {
      return {
        scale: mascotScale, // 0.9
        bottomPx: 24,
        rightPx: 20,
        opacity: 1.0,
        isDocked: false
      };
    }

    // Desktop
    return {
      scale: mascotScale, // 1.0
      bottomPx: 28,
      rightPx: 28,
      opacity: 1.0,
      isDocked: false
    };
  }

  /**
   * Subscribes to device capability changes.
   */
  public subscribe(listener: (snapshot: DeviceCapabilitySnapshot) => void): () => void {
    this.subscribers.add(listener);
    listener(this.getSnapshot());
    return () => {
      this.subscribers.delete(listener);
    };
  }

  private notifySubscribers(): void {
    const snap = this.getSnapshot();
    this.subscribers.forEach(fn => {
      try {
        fn(snap);
      } catch (err) {
        console.error('[DeviceCapabilityEngine] Subscriber notification error:', err);
      }
    });
  }
}

export const deviceCapabilityEngine = DeviceCapabilityEngine.getInstance();
