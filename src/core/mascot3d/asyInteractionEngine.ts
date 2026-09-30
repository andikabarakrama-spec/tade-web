/**
 * R786 — Interaction Engine (SANDBOX / WIDGET SCOPED)
 * TADE RC96A — ASY LIVING 3D MASCOT FOUNDATION
 * 
 * ARCHITECTURAL SCOPE:
 * - This engine is strictly SCOPED to the Asy Dock Assistant Widget & Preview Sandboxes.
 * - Global character behavior and multi-character orchestration are governed
 *   exclusively by `CharacterBehaviorOrchestrator` (/src/services/characterBehaviorOrchestrator.ts).
 * 
 * Manages local user direct widget micro-interactions:
 * - Hover: curious head tilt & happy eyes
 * - Single Click: randomized greeting / Islamic preschool wisdom / encouragement
 * - Double Click / Pet: energetic small jump & celebration bounce
 * - Dragging: smooth viewport repositioning and edge snapping
 */

import { LivingAnimationEngine } from './livingAnimationEngine';
import { BubbleDialogueSystem } from './bubbleDialogueSystem';

export interface InteractionStats {
  totalClicks: number;
  totalHovers: number;
  totalQuotesShared: number;
  lastInteractedAt: string;
}

export class AsyInteractionEngine {
  private static instance: AsyInteractionEngine;
  private stats: InteractionStats;
  private quotes: string[] = [
    "Semangat mendidik generasi sholeh & sholehah hari ini! 🌟",
    "Bismillah, setiap tugas bernilai ibadah bila diawali dengan niat ikhlas 🍃",
    "Thalabul 'ilmi faridhatun 'ala kulli Muslim — Menuntut ilmu adalah kewajiban 📖",
    "Jangan lupa istirahat sejenak, minum air putih dan tadabbur ya! 💧",
    "Alhamdulillah, proses belajar mengajar di TK Asy Syifa berjalan ceria & penuh berkah ✨",
    "Ada hal yang perlu dibantu di SIM Sekolah? Asy siap mendampingi antum!",
    "Senyum adalah sedekah (Tabassumuka fii wajhi akhika shadaqah) 😊",
    "Satu sentra penuh inspirasi, satu generasi penuh prestasi 🕌"
  ];

  private constructor() {
    this.stats = {
      totalClicks: 0,
      totalHovers: 0,
      totalQuotesShared: 0,
      lastInteractedAt: new Date().toISOString()
    };
  }

  public static getInstance(): AsyInteractionEngine {
    if (!AsyInteractionEngine.instance) {
      AsyInteractionEngine.instance = new AsyInteractionEngine();
    }
    return AsyInteractionEngine.instance;
  }

  public handleHoverStart() {
    this.stats.totalHovers++;
    this.stats.lastInteractedAt = new Date().toISOString();
    
    const anim = LivingAnimationEngine.getInstance();
    if (anim.getCurrentState().currentPose === 'IDLE_BREATHING') {
      anim.triggerPose('LOOK_AROUND', 2000);
    }
  }

  public handleClick() {
    this.stats.totalClicks++;
    this.stats.totalQuotesShared++;
    this.stats.lastInteractedAt = new Date().toISOString();

    const anim = LivingAnimationEngine.getInstance();
    const bubble = BubbleDialogueSystem.getInstance();

    const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    const poses = ['WAVE', 'SMALL_JUMP', 'CELEBRATE', 'READING_DOA'] as const;
    const randomPose = poses[Math.floor(Math.random() * poses.length)];

    anim.triggerPose(randomPose, 4500);
    bubble.speak(randomQuote, { durationMs: 4500, priority: 'NORMAL', category: 'INTERACTION' });
  }

  public handleDoubleClick() {
    this.stats.totalClicks += 2;
    this.stats.lastInteractedAt = new Date().toISOString();

    const anim = LivingAnimationEngine.getInstance();
    const bubble = BubbleDialogueSystem.getInstance();

    anim.triggerPose('CELEBRATE', 3500);
    bubble.speak("Yeay! Senang sekali bisa menemani antum hari ini! Barakallahu fiikum! 🎉", {
      durationMs: 4000,
      priority: 'NORMAL',
      category: 'PET'
    });
  }

  public getStats(): InteractionStats {
    return { ...this.stats };
  }
}
