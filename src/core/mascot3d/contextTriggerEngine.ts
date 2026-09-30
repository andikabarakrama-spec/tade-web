/**
 * R784 — Context Trigger Engine
 * TADE RC96A — ASY LIVING 3D MASCOT FOUNDATION
 * 
 * Intercepts platform lifecycle events (login, save success, error, notification, PPDB, War Room)
 * and dispatches contextual animations and Islamic preschool advice.
 */

import { LivingAnimationEngine } from './livingAnimationEngine';
import { BubbleDialogueSystem } from './bubbleDialogueSystem';

export type PlatformContextEventType = 
  | 'USER_LOGIN'
  | 'SAVE_SUCCESS'
  | 'OPERATION_ERROR'
  | 'NOTIFICATION_RECEIVED'
  | 'PPDB_SUBMITTED'
  | 'WAR_ROOM_ENTERED'
  | 'TAHFIDZ_MILESTONE'
  | 'OFFLINE_DETECTED'
  | 'ONLINE_RESTORED'
  | 'SUPER_ADMIN_COMMAND';

export interface TriggerEventPayload {
  type: PlatformContextEventType;
  title?: string;
  detail?: string;
  role?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface ContextReaction {
  targetPose: 'CELEBRATE' | 'WAVE' | 'LOOK_AROUND' | 'READING_DOA' | 'SMALL_JUMP' | 'IDLE_BREATHING';
  dialogueText: string;
  dialogueDurationMs: number;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CONSTITUTIONAL';
}

export class ContextTriggerEngine {
  private static instance: ContextTriggerEngine;
  private recentEvents: TriggerEventPayload[] = [];
  private eventListeners: Set<(event: TriggerEventPayload) => void> = new Set();

  private constructor() {}

  public static getInstance(): ContextTriggerEngine {
    if (!ContextTriggerEngine.instance) {
      ContextTriggerEngine.instance = new ContextTriggerEngine();
    }
    return ContextTriggerEngine.instance;
  }

  public dispatchEvent(type: PlatformContextEventType, payload?: Partial<TriggerEventPayload>) {
    const fullEvent: TriggerEventPayload = {
      type,
      title: payload?.title,
      detail: payload?.detail,
      role: payload?.role,
      metadata: payload?.metadata,
      timestamp: new Date().toISOString()
    };

    this.recentEvents.unshift(fullEvent);
    if (this.recentEvents.length > 50) this.recentEvents.pop();

    const reaction = this.computeReaction(fullEvent);
    if (reaction) {
      const animEngine = LivingAnimationEngine.getInstance();
      const bubbleSys = BubbleDialogueSystem.getInstance();

      animEngine.triggerPose(reaction.targetPose, reaction.dialogueDurationMs);
      bubbleSys.speak(reaction.dialogueText, {
        durationMs: reaction.dialogueDurationMs,
        priority: reaction.priority,
        category: type
      });
    }

    this.eventListeners.forEach(l => l(fullEvent));
  }

  private computeReaction(event: TriggerEventPayload): ContextReaction | null {
    switch (event.type) {
      case 'USER_LOGIN':
        return {
          targetPose: 'WAVE',
          dialogueText: "Assalamu'alaikum Warahmatullahi Wabarakatuh! Selamat datang kembali di SIM TK Asy Syifa Tanggul ✨",
          dialogueDurationMs: 5000,
          priority: 'NORMAL'
        };

      case 'SAVE_SUCCESS':
        return {
          targetPose: 'CELEBRATE',
          dialogueText: "Alhamdulillah! Data berhasil disimpan dengan aman ke Single Source of Truth 🍃",
          dialogueDurationMs: 4000,
          priority: 'NORMAL'
        };

      case 'OPERATION_ERROR':
        return {
          targetPose: 'LOOK_AROUND',
          dialogueText: "Astaghfirullah, ada kendala sistem. Jangan panik, Guardian Ring-0 siap mengamankan data antum.",
          dialogueDurationMs: 6000,
          priority: 'HIGH'
        };

      case 'NOTIFICATION_RECEIVED':
        return {
          targetPose: 'SMALL_JUMP',
          dialogueText: "Ada pesan/notifikasi baru yang masuk di panel notifikasi antum! 🔔",
          dialogueDurationMs: 4500,
          priority: 'NORMAL'
        };

      case 'PPDB_SUBMITTED':
        return {
          targetPose: 'CELEBRATE',
          dialogueText: "Ahlan wa Sahlan! Pendaftaran calon santri baru PPDB telah berhasil diterima. Barakallah! 🎓",
          dialogueDurationMs: 5500,
          priority: 'HIGH'
        };

      case 'WAR_ROOM_ENTERED':
        return {
          targetPose: 'WAVE',
          dialogueText: "Memasuki Pusat Komando Operasional. Seluruh telemetri beroperasi normal.",
          dialogueDurationMs: 4500,
          priority: 'NORMAL'
        };

      case 'TAHFIDZ_MILESTONE':
        return {
          targetPose: 'READING_DOA',
          dialogueText: "Maa Syaa Allah! Capaian hafalan Qur'an dan doa harian santri bertambah. Semoga berkah 📖",
          dialogueDurationMs: 6000,
          priority: 'HIGH'
        };

      case 'OFFLINE_DETECTED':
        return {
          targetPose: 'LOOK_AROUND',
          dialogueText: "Koneksi terputus. Mode Offline Continuity aktif, antum tetap dapat bekerja normal 🛡️",
          dialogueDurationMs: 6000,
          priority: 'HIGH'
        };

      case 'ONLINE_RESTORED':
        return {
          targetPose: 'CELEBRATE',
          dialogueText: "Alhamdulillah koneksi pulih! Sinkronisasi otomatis sedang berlangsung 🔄",
          dialogueDurationMs: 4500,
          priority: 'NORMAL'
        };

      case 'SUPER_ADMIN_COMMAND':
        return {
          targetPose: 'WAVE',
          dialogueText: "Perintah Super Admin / Founder diterima dan diproses sesuai protokol konstitusi ⚡",
          dialogueDurationMs: 4000,
          priority: 'HIGH'
        };

      default:
        return null;
    }
  }

  public getRecentEvents(): TriggerEventPayload[] {
    return [...this.recentEvents];
  }

  public subscribe(listener: (event: TriggerEventPayload) => void): () => void {
    this.eventListeners.add(listener);
    return () => this.eventListeners.delete(listener);
  }
}
