/**
 * R789 — Asy Control Panel
 * TADE RC96A — ASY LIVING 3D MASCOT FOUNDATION
 * 
 * Central management for Super Admin and users to configure Asy's presence,
 * behavior, scale, speech frequency, sound future-ready toggles, and real-time debug overlay.
 */

import { LivingAnimationEngine } from './livingAnimationEngine';
import { AsyDockAssistant } from './asyDockAssistant';
import { BubbleDialogueSystem } from './bubbleDialogueSystem';

export interface AsyControlSettings {
  isEnabled: boolean;
  scale: number; // 0.75 to 1.5
  animationSpeed: number; // 0.5 to 2.0
  chattinessMode: 'CHATTY' | 'BALANCED' | 'QUIET' | 'SILENT';
  soundEnabled: boolean;
  soundVolume: number; // 0.0 to 1.0
  debugOverlayEnabled: boolean;
  genderOutfit: 'ASY_KOKO_EMERALD' | 'ASYAH_HIJAB_EMERALD' | 'BATIK_PAUD';
  roleGreetingEnabled: boolean;
}

export class AsyControlPanelManager {
  private static instance: AsyControlPanelManager;
  private settings: AsyControlSettings;
  private listeners: Set<(settings: AsyControlSettings) => void> = new Set();

  private constructor() {
    this.settings = this.loadSettings();
    this.applySettingsToEngines();
  }

  public static getInstance(): AsyControlPanelManager {
    if (!AsyControlPanelManager.instance) {
      AsyControlPanelManager.instance = new AsyControlPanelManager();
    }
    return AsyControlPanelManager.instance;
  }

  private loadSettings(): AsyControlSettings {
    if (typeof localStorage === 'undefined') {
      return this.getDefaults();
    }
    try {
      const saved = localStorage.getItem('tade_asy_control_settings');
      if (saved) {
        return { ...this.getDefaults(), ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return this.getDefaults();
  }

  private getDefaults(): AsyControlSettings {
    return {
      isEnabled: true,
      scale: 1.0,
      animationSpeed: 1.0,
      chattinessMode: 'BALANCED',
      soundEnabled: false, // Default muted
      soundVolume: 0.5,
      debugOverlayEnabled: false,
      genderOutfit: 'ASY_KOKO_EMERALD',
      roleGreetingEnabled: true
    };
  }

  private applySettingsToEngines() {
    LivingAnimationEngine.getInstance().setSpeedMultiplier(this.settings.animationSpeed);
    BubbleDialogueSystem.getInstance().setMuted(!this.settings.soundEnabled);
    if (!this.settings.isEnabled) {
      AsyDockAssistant.getInstance().setDisplayMode('HIDDEN');
    } else {
      AsyDockAssistant.getInstance().setDisplayMode('COMPACT_DOCK');
    }
  }

  private persist() {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('tade_asy_control_settings', JSON.stringify(this.settings));
      } catch {
        // ignore
      }
    }
    this.applySettingsToEngines();
    this.notify();
  }

  public updateSettings(partial: Partial<AsyControlSettings>) {
    this.settings = { ...this.settings, ...partial };
    this.persist();
  }

  public resetToDefaults() {
    this.settings = this.getDefaults();
    this.persist();
  }

  public getSettings(): AsyControlSettings {
    return { ...this.settings };
  }

  public subscribe(listener: (settings: AsyControlSettings) => void): () => void {
    this.listeners.add(listener);
    listener(this.settings);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l({ ...this.settings }));
  }
}
