/**
 * TADE RC75 — R575: KERNEL EVENT BUS
 * Inspired by Linux Netlink & Event Dispatcher Architecture.
 * Provides unified, asynchronous, zero-overhead pub-sub communications for all 12 engine daemons.
 */

import { EngineId } from './GuardianKernelLayer';

export type KernelEventType =
  | 'engine.started'
  | 'engine.running'
  | 'engine.degraded'
  | 'engine.recovering'
  | 'recovery.initiated'
  | 'recovery.completed'
  | 'permission.denied'
  | 'heartbeat.timeout'
  | 'watchdog.triggered'
  | 'performance.budget_alert'
  | 'threat.detected';

export interface KernelEventPayload {
  eventId: string;
  type: KernelEventType;
  sourceEngine: EngineId;
  timestamp: string;
  epochMs: number;
  severity: 'INFO' | 'NOTICE' | 'WARNING' | 'CRITICAL';
  data: Record<string, unknown>;
  traceId: string;
}

export type KernelEventListener = (event: KernelEventPayload) => void;

class KernelEventBusManager {
  private static instance: KernelEventBusManager | null = null;
  private listeners: Map<KernelEventType | '*', Set<KernelEventListener>> = new Map();
  private ringBuffer: KernelEventPayload[] = [];
  private readonly MAX_RING_BUFFER_SIZE = 500;
  private eventSequence = 0;

  private constructor() {
    // Seed initial event bus boot events
    this.publish({
      type: 'engine.started',
      sourceEngine: 'GUARDIAN',
      severity: 'NOTICE',
      data: { message: 'Kernel Event Bus initialized with Linux Netlink emulation' },
      traceId: 'TRC-BOOT-001'
    });
  }

  public static getInstance(): KernelEventBusManager {
    if (!KernelEventBusManager.instance) {
      KernelEventBusManager.instance = new KernelEventBusManager();
    }
    return KernelEventBusManager.instance;
  }

  public publish(event: Omit<KernelEventPayload, 'eventId' | 'timestamp' | 'epochMs'>): KernelEventPayload {
    this.eventSequence++;
    const fullEvent: KernelEventPayload = {
      ...event,
      eventId: `EVT-${Date.now()}-${String(this.eventSequence).padStart(4, '0')}`,
      timestamp: new Date().toISOString(),
      epochMs: Date.now()
    };

    // Store in ring buffer (similar to Linux /dev/kmsg)
    this.ringBuffer.unshift(fullEvent);
    if (this.ringBuffer.length > this.MAX_RING_BUFFER_SIZE) {
      this.ringBuffer.pop();
    }

    // Dispatch to specific listeners
    const specificListeners = this.listeners.get(fullEvent.type);
    if (specificListeners) {
      specificListeners.forEach((listener) => {
        try {
          listener(fullEvent);
        } catch (err) {
          console.error(`[KernelEventBus] Error in listener for ${fullEvent.type}:`, err);
        }
      });
    }

    // Dispatch to wildcard listeners
    const wildcardListeners = this.listeners.get('*');
    if (wildcardListeners) {
      wildcardListeners.forEach((listener) => {
        try {
          listener(fullEvent);
        } catch (err) {
          console.error('[KernelEventBus] Error in wildcard listener:', err);
        }
      });
    }

    return fullEvent;
  }

  public subscribe(type: KernelEventType | '*', listener: KernelEventListener): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);

    // Return unbind handler
    return () => {
      const set = this.listeners.get(type);
      if (set) {
        set.delete(listener);
        if (set.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  public getRingBuffer(limit = 100): KernelEventPayload[] {
    return this.ringBuffer.slice(0, limit);
  }

  public getEventsByType(type: KernelEventType, limit = 50): KernelEventPayload[] {
    return this.ringBuffer.filter(e => e.type === type).slice(0, limit);
  }

  public getEventsByEngine(engine: EngineId, limit = 50): KernelEventPayload[] {
    return this.ringBuffer.filter(e => e.sourceEngine === engine).slice(0, limit);
  }

  public getStats() {
    const totalEvents = this.eventSequence;
    const bufferCount = this.ringBuffer.length;
    const subscriberCount = Array.from(this.listeners.values()).reduce((acc, s) => acc + s.size, 0);
    const criticalCount = this.ringBuffer.filter(e => e.severity === 'CRITICAL').length;
    const warningCount = this.ringBuffer.filter(e => e.severity === 'WARNING').length;

    return {
      totalDispatched: totalEvents,
      bufferedCount: bufferCount,
      activeSubscribers: subscriberCount,
      criticalEvents: criticalCount,
      warningEvents: warningCount,
      healthyRate: totalEvents > 0 ? (((totalEvents - criticalCount) / totalEvents) * 100).toFixed(1) : '100'
    };
  }

  public clearBuffer(): void {
    this.ringBuffer = [];
  }
}

export const kernelEventBus = KernelEventBusManager.getInstance();
