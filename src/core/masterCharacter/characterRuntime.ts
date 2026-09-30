/**
 * TADE v9.2.0-MCA2 — R921 & R922
 * MASTER CHARACTER LIVING RUNTIME
 * 
 * High-Performance 60 FPS Character Runtime Engine
 * 
 * Features:
 * - 60 FPS requestAnimationFrame animation loop with delta-time throttling
 * - Automatic pause on tab blur / document.hidden (Page Visibility API)
 * - Auto-idle slowdown / pause on user typing (input focus)
 * - Zero memory leak architecture with disposal handles
 * - Structural body part node hierarchy for Asy & Syifa (head, eyes, eyebrows,
 *   mouth, body, arms, legs, peci / hijab front & back)
 * - Real-time performance metrics (FPS, Frame Time, CPU Load estimate, Dropped Frames)
 */

import { CharacterId, MasterExpressionKey, MasterPoseKey } from './masterCharacterRegistry';

export interface Transform2D {
  x: number;
  y: number;
  rotationDeg: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
}

export interface CharacterBodyNode {
  id: string;
  name: string;
  parentId?: string;
  zIndex: number;
  anchor: { x: number; y: number }; // 0.0 - 1.0 anchor point
  localTransform: Transform2D;
  worldTransform?: Transform2D;
  visible: boolean;
}

export interface CharacterRigStructure {
  characterId: CharacterId;
  version: string;
  rootAnchor: { x: number; y: number };
  nodes: Record<string, CharacterBodyNode>;
}

export interface RuntimeMetrics {
  fps: number;
  targetFps: number;
  frameTimeMs: number;
  cpuLoadEstimate: number; // percentage 0 - 100%
  renderedFrames: number;
  droppedFrames: number;
  memoryEstimateKb: number;
  isRunning: boolean;
  isPaused: boolean;
  isTypingPaused: boolean;
  lastTickTimestamp: number;
}

export type RuntimeTickCallback = (deltaTime: number, metrics: RuntimeMetrics) => void;

/**
 * Standard Body Part Definitions for Asy (R922)
 */
export function createAsyRigStructure(): CharacterRigStructure {
  return {
    characterId: 'ASY',
    version: '1.0.0-MCA2',
    rootAnchor: { x: 80, y: 190 },
    nodes: {
      body: {
        id: 'body',
        name: 'Badan Koko Putih',
        zIndex: 10,
        anchor: { x: 0.5, y: 0.8 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      },
      legs: {
        id: 'legs',
        name: 'Kaki & Celana Kain',
        parentId: 'body',
        zIndex: 5,
        anchor: { x: 0.5, y: 0.1 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      },
      head: {
        id: 'head',
        name: 'Kepala & Wajah Chibi',
        parentId: 'body',
        zIndex: 20,
        anchor: { x: 0.5, y: 0.85 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      },
      peci: {
        id: 'peci',
        name: 'Peci Hitam Zamrud Santri',
        parentId: 'head',
        zIndex: 25,
        anchor: { x: 0.5, y: 0.9 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      },
      eyebrows: {
        id: 'eyebrows',
        name: 'Alis Ekspresif',
        parentId: 'head',
        zIndex: 26,
        anchor: { x: 0.5, y: 0.5 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      },
      eyes: {
        id: 'eyes',
        name: 'Mata Binar Santun',
        parentId: 'head',
        zIndex: 27,
        anchor: { x: 0.5, y: 0.5 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      },
      mouth: {
        id: 'mouth',
        name: 'Mulut Senyum Ramah',
        parentId: 'head',
        zIndex: 28,
        anchor: { x: 0.5, y: 0.5 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      },
      armLeft: {
        id: 'armLeft',
        name: 'Lengan Kiri',
        parentId: 'body',
        zIndex: 12,
        anchor: { x: 0.8, y: 0.2 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      },
      armRight: {
        id: 'armRight',
        name: 'Lengan Kanan (Melambai/Iqro)',
        parentId: 'body',
        zIndex: 15,
        anchor: { x: 0.2, y: 0.2 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      }
    }
  };
}

/**
 * Standard Body Part Definitions for Syifa (R922)
 */
export function createSyifaRigStructure(): CharacterRigStructure {
  return {
    characterId: 'SYIFA',
    version: '1.0.0-MCA2',
    rootAnchor: { x: 80, y: 190 },
    nodes: {
      hijabBack: {
        id: 'hijabBack',
        name: 'Hijab Belakang Hijau Zamrud',
        zIndex: 2,
        anchor: { x: 0.5, y: 0.3 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      },
      body: {
        id: 'body',
        name: 'Gamis Putih & Rok Santriwati',
        zIndex: 10,
        anchor: { x: 0.5, y: 0.8 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      },
      legs: {
        id: 'legs',
        name: 'Kaki & Sepatu Santun',
        parentId: 'body',
        zIndex: 5,
        anchor: { x: 0.5, y: 0.1 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      },
      head: {
        id: 'head',
        name: 'Kepala & Wajah Chibi',
        parentId: 'body',
        zIndex: 18,
        anchor: { x: 0.5, y: 0.85 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      },
      eyebrows: {
        id: 'eyebrows',
        name: 'Alis Teduh Muslimah',
        parentId: 'head',
        zIndex: 22,
        anchor: { x: 0.5, y: 0.5 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      },
      eyes: {
        id: 'eyes',
        name: 'Mata Cantik Binar Ramah',
        parentId: 'head',
        zIndex: 23,
        anchor: { x: 0.5, y: 0.5 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      },
      mouth: {
        id: 'mouth',
        name: 'Mulut Senyum Manis',
        parentId: 'head',
        zIndex: 24,
        anchor: { x: 0.5, y: 0.5 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      },
      hijabFront: {
        id: 'hijabFront',
        name: 'Hijab Depan Syar\'i Menutup Dada',
        parentId: 'head',
        zIndex: 26,
        anchor: { x: 0.5, y: 0.2 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      },
      armLeft: {
        id: 'armLeft',
        name: 'Lengan Kiri',
        parentId: 'body',
        zIndex: 14,
        anchor: { x: 0.8, y: 0.2 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      },
      armRight: {
        id: 'armRight',
        name: 'Lengan Kanan (Salam/Kupu-kupu)',
        parentId: 'body',
        zIndex: 16,
        anchor: { x: 0.2, y: 0.2 },
        localTransform: { x: 0, y: 0, rotationDeg: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        visible: true
      }
    }
  };
}

export class CharacterRuntime {
  private activeCharacter: CharacterId = 'ASY';
  private targetFps: number = 60;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private isTypingPaused: boolean = false;

  private animationFrameId: number | null = null;
  private lastFrameTimestamp: number = 0;
  private frameIntervalMs: number = 1000 / 60;

  // Performance telemetry
  private frameCount: number = 0;
  private lastFpsUpdateTimestamp: number = 0;
  private currentCalculatedFps: number = 60;
  private lastFrameTimeMs: number = 16.6;
  private droppedFrameCount: number = 0;

  // Rig Structure
  private asyRig: CharacterRigStructure;
  private syifaRig: CharacterRigStructure;

  // Callbacks
  private tickListeners: Set<RuntimeTickCallback> = new Set();
  private cleanupHandlers: Array<() => void> = [];

  constructor(initialCharacter: CharacterId = 'ASY') {
    this.activeCharacter = initialCharacter;
    this.asyRig = createAsyRigStructure();
    this.syifaRig = createSyifaRigStructure();

    this.setupVisibilityListener();
    this.setupTypingDetection();
  }

  public setCharacter(id: CharacterId): void {
    if (this.activeCharacter !== id) {
      this.activeCharacter = id;
    }
  }

  public getCharacter(): CharacterId {
    return this.activeCharacter;
  }

  public getActiveRig(): CharacterRigStructure {
    return this.activeCharacter === 'ASY' ? this.asyRig : this.syifaRig;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isPaused = false;
    this.lastFrameTimestamp = performance.now();
    this.lastFpsUpdateTimestamp = performance.now();
    this.frameCount = 0;
    this.loop(this.lastFrameTimestamp);
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    if (this.isRunning && this.isPaused) {
      this.isPaused = false;
      this.lastFrameTimestamp = performance.now();
      if (!this.animationFrameId) {
        this.loop(this.lastFrameTimestamp);
      }
    }
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public setTargetFPS(fps: number): void {
    this.targetFps = Math.max(15, Math.min(120, fps));
    this.frameIntervalMs = 1000 / this.targetFps;
  }

  public getMetrics(): RuntimeMetrics {
    return {
      fps: Math.round(this.currentCalculatedFps),
      targetFps: this.targetFps,
      frameTimeMs: Number(this.lastFrameTimeMs.toFixed(2)),
      cpuLoadEstimate: Number(Math.min(100, Math.max(1, (this.lastFrameTimeMs / this.frameIntervalMs) * 35)).toFixed(1)),
      renderedFrames: this.frameCount,
      droppedFrames: this.droppedFrameCount,
      memoryEstimateKb: 48,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      isTypingPaused: this.isTypingPaused,
      lastTickTimestamp: this.lastFrameTimestamp
    };
  }

  public onTick(callback: RuntimeTickCallback): () => void {
    this.tickListeners.add(callback);
    return () => {
      this.tickListeners.delete(callback);
    };
  }

  private loop = (timestamp: number): void => {
    if (!this.isRunning) return;

    this.animationFrameId = requestAnimationFrame(this.loop);

    if (this.isPaused || this.isTypingPaused) {
      this.lastFrameTimestamp = timestamp;
      return;
    }

    const elapsed = timestamp - this.lastFrameTimestamp;

    // Throttle to target FPS
    if (elapsed < this.frameIntervalMs - 1) {
      return;
    }

    const deltaSeconds = Math.min(0.1, elapsed / 1000);
    this.lastFrameTimeMs = elapsed;
    this.lastFrameTimestamp = timestamp - (elapsed % this.frameIntervalMs);

    this.frameCount++;

    // Calculate FPS every 500ms
    if (timestamp - this.lastFpsUpdateTimestamp >= 500) {
      const framesInPeriod = this.frameCount;
      const timeElapsedSec = (timestamp - this.lastFpsUpdateTimestamp) / 1000;
      this.currentCalculatedFps = framesInPeriod / timeElapsedSec;
      
      if (this.currentCalculatedFps < this.targetFps * 0.7) {
        this.droppedFrameCount++;
      }

      this.frameCount = 0;
      this.lastFpsUpdateTimestamp = timestamp;
    }

    // Dispatch tick to subscribers
    const metrics = this.getMetrics();
    this.tickListeners.forEach(listener => {
      try {
        listener(deltaSeconds, metrics);
      } catch (err) {
        console.error('[CharacterRuntime] Listener error:', err);
      }
    });
  };

  /**
   * Automatically pause rendering when tab is hidden (Page Visibility API)
   */
  private setupVisibilityListener(): void {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    this.cleanupHandlers.push(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    });
  }

  /**
   * Pause micro-animations when user focuses input/textarea so typing is undisturbed
   */
  private setupTypingDetection(): void {
    if (typeof window === 'undefined') return;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        this.isTypingPaused = true;
      }
    };

    const handleFocusOut = () => {
      this.isTypingPaused = false;
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);

    this.cleanupHandlers.push(() => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
    });
  }

  public destroy(): void {
    this.stop();
    this.tickListeners.clear();
    this.cleanupHandlers.forEach(cleanup => cleanup());
    this.cleanupHandlers = [];
  }
}

export const defaultCharacterRuntime = new CharacterRuntime();
