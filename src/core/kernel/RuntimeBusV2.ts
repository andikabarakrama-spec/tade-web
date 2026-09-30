/**
 * R629: Runtime Bus V2
 * Central communication spine for all TADE internal subsystems.
 * Enforces 4 strict priority queues (CRITICAL, HIGH, NORMAL, LOW) with backpressure handling
 * and seamless integration across Event Bus, Control Plane, and Recovery Mesh.
 */

import { VirtualNamespace } from './KernelNamespaceManager';

export type BusMessagePriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export interface RuntimeBusMessage<T = unknown> {
  id: string;
  timestamp: string;
  topic: string;
  sourceNamespace: VirtualNamespace;
  targetNamespace: VirtualNamespace | 'BROADCAST';
  priority: BusMessagePriority;
  payload: T;
  deliveryStatus: 'PENDING' | 'DISPATCHED' | 'ACKNOWLEDGED' | 'DROPPED_BACKPRESSURE';
  latencyMs: number;
}

export type BusSubscriber<T = unknown> = (msg: RuntimeBusMessage<T>) => void;

class RuntimeBusV2 {
  private static instance: RuntimeBusV2;

  private queues: Record<BusMessagePriority, RuntimeBusMessage[]> = {
    CRITICAL: [],
    HIGH: [],
    NORMAL: [],
    LOW: [],
  };

  private subscribers: Map<string, BusSubscriber[]> = new Map();
  private messageHistory: RuntimeBusMessage[] = [];
  private totalDispatched: number = 0;
  private totalDropped: number = 0;
  private maxQueueCapacity: number = 200;

  private constructor() {
    this.seedInitialMessages();
  }

  public static getInstance(): RuntimeBusV2 {
    if (!RuntimeBusV2.instance) {
      RuntimeBusV2.instance = new RuntimeBusV2();
    }
    return RuntimeBusV2.instance;
  }

  private seedInitialMessages(): void {
    this.publish({
      topic: 'kernel.boot.sequence',
      sourceNamespace: 'SYSTEM_KERNEL',
      targetNamespace: 'BROADCAST',
      priority: 'CRITICAL',
      payload: { status: 'READY', stage: 'STAGE_7_WAR_ROOM' },
    });

    this.publish({
      topic: 'guardian.defcon.sync',
      sourceNamespace: 'GUARDIAN',
      targetNamespace: 'BROADCAST',
      priority: 'HIGH',
      payload: { defcon: 5, status: 'NORMAL_SECURE' },
    });

    this.publish({
      topic: 'civil.workflow.heartbeat',
      sourceNamespace: 'CIVIL_SERVICE',
      targetNamespace: 'AI_ASY',
      priority: 'NORMAL',
      payload: { activeMinistries: 10, queueDepth: 2 },
    });
  }

  public publish<T = unknown>(params: {
    topic: string;
    sourceNamespace: VirtualNamespace;
    targetNamespace?: VirtualNamespace | 'BROADCAST';
    priority?: BusMessagePriority;
    payload: T;
  }): RuntimeBusMessage<T> {
    const priority = params.priority || 'NORMAL';
    const queue = this.queues[priority];

    if (queue.length >= this.maxQueueCapacity) {
      if (priority === 'LOW') {
        this.totalDropped++;
        const droppedMsg: RuntimeBusMessage<T> = {
          id: `BUS-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: new Date().toISOString(),
          topic: params.topic,
          sourceNamespace: params.sourceNamespace,
          targetNamespace: params.targetNamespace || 'BROADCAST',
          priority,
          payload: params.payload,
          deliveryStatus: 'DROPPED_BACKPRESSURE',
          latencyMs: 0,
        };
        return droppedMsg;
      }
    }

    const msg: RuntimeBusMessage<T> = {
      id: `BUS-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      topic: params.topic,
      sourceNamespace: params.sourceNamespace,
      targetNamespace: params.targetNamespace || 'BROADCAST',
      priority,
      payload: params.payload,
      deliveryStatus: 'PENDING',
      latencyMs: 0,
    };

    queue.push(msg as RuntimeBusMessage);
    this.drainQueue(priority);
    return msg;
  }

  private drainQueue(priority: BusMessagePriority): void {
    const queue = this.queues[priority];
    while (queue.length > 0) {
      const msg = queue.shift();
      if (!msg) break;

      const startTime = performance.now();
      const subs = this.subscribers.get(msg.topic) || [];
      const wildcardSubs = this.subscribers.get('*') || [];

      [...subs, ...wildcardSubs].forEach((sub) => {
        try {
          sub(msg);
        } catch (err) {
          console.error(`Error delivering message ${msg.id} on topic ${msg.topic}:`, err);
        }
      });

      msg.deliveryStatus = 'ACKNOWLEDGED';
      msg.latencyMs = Math.round((performance.now() - startTime) * 100) / 100;
      this.totalDispatched++;

      this.messageHistory.unshift(msg);
      if (this.messageHistory.length > 60) {
        this.messageHistory.pop();
      }
    }
  }

  public subscribe<T = unknown>(topic: string, subscriber: BusSubscriber<T>): () => void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, []);
    }
    this.subscribers.get(topic)!.push(subscriber as BusSubscriber);
    return () => {
      const current = this.subscribers.get(topic) || [];
      this.subscribers.set(
        topic,
        current.filter((s) => s !== subscriber)
      );
    };
  }

  public getQueueStats(): { priority: BusMessagePriority; depth: number }[] {
    return (['CRITICAL', 'HIGH', 'NORMAL', 'LOW'] as BusMessagePriority[]).map((p) => ({
      priority: p,
      depth: this.queues[p].length,
    }));
  }

  public getRecentMessages(): RuntimeBusMessage[] {
    return [...this.messageHistory];
  }

  public getTotalDispatched(): number {
    return this.totalDispatched;
  }

  public getTotalDropped(): number {
    return this.totalDropped;
  }
}

export const runtimeBusV2 = RuntimeBusV2.getInstance();
