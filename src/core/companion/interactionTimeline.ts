import { InteractionTimelineItem, CompanionRole, ReminderPriority } from './companionTypes';

export const INITIAL_TIMELINE_ITEMS: InteractionTimelineItem[] = [
  {
    itemId: 'TL-001',
    type: 'EXECUTIVE_BRIEFING',
    role: 'EXECUTIVE',
    title: 'SITREP Harian: Integritas Sistem 100% & Zero Incident',
    description: 'Seluruh sentra beroperasi normal. Database SSoT sinkron dengan backup lokal tanpa anomali.',
    priority: 'HIGH',
    timestamp: '2026-08-18T06:00:00Z',
    isRead: true
  },
  {
    itemId: 'TL-002',
    type: 'REMINDER',
    role: 'TEACHER',
    title: 'Input Penilaian Sentra Seni',
    description: 'Guru kelas TK A mengingatkan pengisian form observasi santriwati.',
    priority: 'HIGH',
    timestamp: '2026-08-18T06:30:00Z',
    isRead: false
  },
  {
    itemId: 'TL-003',
    type: 'INSIGHT',
    role: 'PARENT',
    title: 'Laporan Hafalan Santri Bertambah',
    description: 'Ananda berhasil menghafal Surat Al-Insyiqaq dengan makhraj sempurna.',
    priority: 'MEDIUM',
    timestamp: '2026-08-18T06:45:00Z',
    isRead: false
  },
  {
    itemId: 'TL-004',
    type: 'NOTIFICATION',
    role: 'UNIVERSAL',
    title: 'Jadwal Kajian Parenting Islami Bulanan',
    description: 'Kajian akan diadakan Sabtu depan pukul 08:30 WIB bersama Ustadzah pembina.',
    priority: 'LOW',
    timestamp: '2026-08-18T07:00:00Z',
    isRead: true
  }
];

/**
 * R758 — Interaction Timeline Engine
 * Immutable, append-only chronological stream for companion interactions.
 */
class InteractionTimelineEngine {
  private static instance: InteractionTimelineEngine;
  private items: InteractionTimelineItem[] = [];
  private readonly STORAGE_KEY = 'TADE_INTERACTION_TIMELINE_V7';

  private constructor() {
    this.loadTimeline();
  }

  public static getInstance(): InteractionTimelineEngine {
    if (!InteractionTimelineEngine.instance) {
      InteractionTimelineEngine.instance = new InteractionTimelineEngine();
    }
    return InteractionTimelineEngine.instance;
  }

  private loadTimeline() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.items = JSON.parse(stored);
      } else {
        this.items = [...INITIAL_TIMELINE_ITEMS];
        this.saveTimeline();
      }
    } catch {
      this.items = [...INITIAL_TIMELINE_ITEMS];
    }
  }

  private saveTimeline() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.warn('[InteractionTimelineEngine] Failed to save timeline', e);
    }
  }

  public getTimelineForRole(role: CompanionRole): InteractionTimelineItem[] {
    return this.items.filter(item => item.role === role || item.role === 'UNIVERSAL');
  }

  public getAllItems(): InteractionTimelineItem[] {
    return [...this.items];
  }

  /**
   * Append-only addition. Reordering or deleting past records is prohibited.
   */
  public appendItem(item: {
    type: 'REMINDER' | 'INSIGHT' | 'NOTIFICATION' | 'EXECUTIVE_BRIEFING';
    role: CompanionRole;
    title: string;
    description: string;
    priority: ReminderPriority;
    metadata?: Record<string, any>;
  }): InteractionTimelineItem {
    const newItem: InteractionTimelineItem = {
      itemId: `TL-${Date.now()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      type: item.type,
      role: item.role,
      title: item.title,
      description: item.description,
      priority: item.priority,
      timestamp: new Date().toISOString(),
      metadata: item.metadata,
      isRead: false
    };

    // Append to top for chronological descending order
    this.items.unshift(newItem);
    this.saveTimeline();
    return newItem;
  }

  public markAsRead(itemId: string): void {
    const item = this.items.find(i => i.itemId === itemId);
    if (item) {
      item.isRead = true;
      this.saveTimeline();
    }
  }
}

export const interactionTimelineEngine = InteractionTimelineEngine.getInstance();
