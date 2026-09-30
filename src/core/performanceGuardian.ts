// TADE Performance Guardian 2.0 & Real Hardware Profiler
// Constitution: TADE v8.1 | RC14 Locked Foundation Extension

export type HardwareProfileId = 
  | 'EXECUTIVE_LITE_PC'      // PC Jadul Ketua Yayasan
  | 'OPERATIONS_ULTRA_ROG'   // ASUS ROG GL503GE Admin
  | 'PRESIDENTIAL_ULTRA_ROG' // ASUS ROG GL503GE Super Admin
  | 'TEACHER_LITE_ANDROID'   // HP Android Guru
  | 'PARENT_LITE_ANDROID'    // HP Android Wali Murid
  | 'AUTO_DETECTED';

export type ShadowQuality = 'OFF' | 'BASIC' | 'SOFT' | 'RAYTRACED';
export type ParticleDensity = 'OFF' | 'MINIMAL' | 'BALANCED' | 'HIGH' | 'MAXIMUM';
export type AnimationBudget = 'ECO' | 'STANDARD' | 'SMOOTH_60FPS' | 'CINEMATIC_120FPS';

export interface HardwareProfileSpec {
  id: HardwareProfileId;
  label: string;
  deviceTarget: string;
  targetRole: string;
  maxFps: number;
  shadowQuality: ShadowQuality;
  particleDensity: ParticleDensity;
  maxParticles: number;
  enableCgi3D: boolean;
  enableBlurFx: boolean;
  enableSoundFx: boolean;
  bundleTargetKb: number;
  description: string;
}

export const HARDWARE_PROFILES: Record<HardwareProfileId, HardwareProfileSpec> = {
  EXECUTIVE_LITE_PC: {
    id: 'EXECUTIVE_LITE_PC',
    label: 'Executive Lite (PC Jadul)',
    deviceTarget: 'PC Kantor Core i3 / RAM 4GB',
    targetRole: 'Ketua Yayasan',
    maxFps: 30,
    shadowQuality: 'OFF',
    particleDensity: 'MINIMAL',
    maxParticles: 5,
    enableCgi3D: false,
    enableBlurFx: false,
    enableSoundFx: true,
    bundleTargetKb: 550,
    description: 'Prioritas font besar, kontras tinggi, surat terbuka instan, nol blur berat, nol overhead GPU.'
  },
  OPERATIONS_ULTRA_ROG: {
    id: 'OPERATIONS_ULTRA_ROG',
    label: 'Operations Ultra (ASUS ROG)',
    deviceTarget: 'ASUS ROG GL503GE / GTX 1050 Ti',
    targetRole: 'Admin Sekolah',
    maxFps: 60,
    shadowQuality: 'SOFT',
    particleDensity: 'HIGH',
    maxParticles: 120,
    enableCgi3D: true,
    enableBlurFx: true,
    enableSoundFx: true,
    bundleTargetKb: 1800,
    description: 'Multitasking penuh: Banner 3D Studio, Creative Center, QR Generator, Print Center, dan Action Dock berjalan simultan.'
  },
  PRESIDENTIAL_ULTRA_ROG: {
    id: 'PRESIDENTIAL_ULTRA_ROG',
    label: 'Presidential Ultra (ASUS ROG)',
    deviceTarget: 'ASUS ROG GL503GE / GTX 1050 Ti',
    targetRole: 'Super Admin',
    maxFps: 120,
    shadowQuality: 'RAYTRACED',
    particleDensity: 'MAXIMUM',
    maxParticles: 200,
    enableCgi3D: true,
    enableBlurFx: true,
    enableSoundFx: true,
    bundleTargetKb: 2500,
    description: 'Semua subsistem aktif real-time: Guardian Battlefield, 3D Threat Map, Shadow Agent Live, dan Full Discovery Memory.'
  },
  TEACHER_LITE_ANDROID: {
    id: 'TEACHER_LITE_ANDROID',
    label: 'Teacher Lite (HP Android)',
    deviceTarget: 'Android Mid-Range Smartphone',
    targetRole: 'Guru Sentra & Kelas',
    maxFps: 45,
    shadowQuality: 'BASIC',
    particleDensity: 'MINIMAL',
    maxParticles: 15,
    enableCgi3D: false,
    enableBlurFx: false,
    enableSoundFx: true,
    bundleTargetKb: 850,
    description: 'Dioptimalkan untuk Voice Attendance cepat, setoran Tahfidz instan, dan minim penggunaan kuota baterai.'
  },
  PARENT_LITE_ANDROID: {
    id: 'PARENT_LITE_ANDROID',
    label: 'Parent Lite (HP Android)',
    deviceTarget: 'Android Smartphone',
    targetRole: 'Wali Murid',
    maxFps: 45,
    shadowQuality: 'BASIC',
    particleDensity: 'BALANCED',
    maxParticles: 25,
    enableCgi3D: false,
    enableBlurFx: false,
    enableSoundFx: true,
    bundleTargetKb: 450,
    description: 'Paket super ringan ≤600 KB untuk koneksi seluler: Timeline Kenangan, Bintang Reward, dan Murojaah Tahfidz.'
  },
  AUTO_DETECTED: {
    id: 'AUTO_DETECTED',
    label: 'Auto-Calibrated Adaptive',
    deviceTarget: 'Dynamic Hardware Probe',
    targetRole: 'Adaptive System',
    maxFps: 60,
    shadowQuality: 'BASIC',
    particleDensity: 'BALANCED',
    maxParticles: 30,
    enableCgi3D: true,
    enableBlurFx: true,
    enableSoundFx: true,
    bundleTargetKb: 1000,
    description: 'Otomatis menyesuaikan dengan pembacaan sensor FPS, memori heap, status baterai, dan bandwidth.'
  }
};

export interface SystemPerformanceMetrics {
  currentFps: number;
  averageFps: number;
  memoryHeapMb: number;
  memoryLimitMb: number;
  batteryLevel: number; // 0.0 - 1.0
  isCharging: boolean;
  batterySaverActive: boolean;
  networkType: string;
  downlinkSpeedMbps: number;
  roundTripTimeMs: number;
  thermalState: 'NOMINAL' | 'WARM' | 'THROTTLED';
  activeProfile: HardwareProfileId;
  particleLimit: number;
  shadowMode: ShadowQuality;
}

class PerformanceGuardianEngine {
  private activeProfile: HardwareProfileId = 'AUTO_DETECTED';
  private metrics: SystemPerformanceMetrics = {
    currentFps: 60,
    averageFps: 59.4,
    memoryHeapMb: 42.6,
    memoryLimitMb: 2048,
    batteryLevel: 0.92,
    isCharging: true,
    batterySaverActive: false,
    networkType: '4g',
    downlinkSpeedMbps: 25.4,
    roundTripTimeMs: 28,
    thermalState: 'NOMINAL',
    activeProfile: 'AUTO_DETECTED',
    particleLimit: 30,
    shadowMode: 'BASIC'
  };

  private listeners: Set<(metrics: SystemPerformanceMetrics) => void> = new Set();
  private fpsBuffer: number[] = [];
  private frameCount = 0;
  private lastTime = performance.now();
  private animFrameId: number | null = null;

  constructor() {
    this.initHardwareDetection();
    this.startMonitoringLoop();
  }

  private initHardwareDetection() {
    if (typeof window === 'undefined') return;

    // Detect Battery Status
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        this.metrics.batteryLevel = battery.level;
        this.metrics.isCharging = battery.charging;
        this.notify();

        battery.addEventListener('levelchange', () => {
          this.metrics.batteryLevel = battery.level;
          if (battery.level < 0.20 && !battery.charging) {
            this.metrics.batterySaverActive = true;
          }
          this.notify();
        });

        battery.addEventListener('chargingchange', () => {
          this.metrics.isCharging = battery.charging;
          if (battery.charging) {
            this.metrics.batterySaverActive = false;
          }
          this.notify();
        });
      }).catch(() => {
        // Fallback gracefully
      });
    }

    // Detect Network Speed
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (conn) {
      this.metrics.networkType = conn.effectiveType || '4g';
      this.metrics.downlinkSpeedMbps = conn.downlink || 20;
      this.metrics.roundTripTimeMs = conn.rtt || 30;

      conn.addEventListener('change', () => {
        this.metrics.networkType = conn.effectiveType || '4g';
        this.metrics.downlinkSpeedMbps = conn.downlink || 20;
        this.metrics.roundTripTimeMs = conn.rtt || 30;
        this.notify();
      });
    }
  }

  private startMonitoringLoop() {
    const loop = (now: number) => {
      this.frameCount++;
      const delta = now - this.lastTime;

      if (delta >= 1000) {
        const fps = Math.round((this.frameCount * 1000) / delta);
        this.metrics.currentFps = fps;
        this.fpsBuffer.push(fps);
        if (this.fpsBuffer.length > 20) this.fpsBuffer.shift();

        const sum = this.fpsBuffer.reduce((a, b) => a + b, 0);
        this.metrics.averageFps = Number((sum / this.fpsBuffer.length).toFixed(1));

        // Estimate Memory
        const perfMemory = typeof performance !== 'undefined' ? (performance as any).memory : null;
        if (perfMemory) {
          this.metrics.memoryHeapMb = Number((perfMemory.usedJSHeapSize / (1024 * 1024)).toFixed(1));
          this.metrics.memoryLimitMb = Number((perfMemory.jsHeapSizeLimit / (1024 * 1024)).toFixed(0));
        }

        // Auto-adjust if in AUTO_DETECTED
        if (this.activeProfile === 'AUTO_DETECTED') {
          if (this.metrics.currentFps < 35 || this.metrics.batterySaverActive) {
            this.metrics.shadowMode = 'OFF';
            this.metrics.particleLimit = 8;
            this.metrics.thermalState = 'THROTTLED';
          } else if (this.metrics.currentFps < 50) {
            this.metrics.shadowMode = 'BASIC';
            this.metrics.particleLimit = 20;
            this.metrics.thermalState = 'WARM';
          } else {
            this.metrics.shadowMode = 'SOFT';
            this.metrics.particleLimit = 40;
            this.metrics.thermalState = 'NOMINAL';
          }
        }

        this.frameCount = 0;
        this.lastTime = now;
        this.notify();
      }

      if (typeof window !== 'undefined' && typeof requestAnimationFrame !== 'undefined') {
        this.animFrameId = requestAnimationFrame(loop);
      }
    };

    if (typeof window !== 'undefined' && typeof requestAnimationFrame !== 'undefined') {
      this.animFrameId = requestAnimationFrame(loop);
    }
  }

  public setProfile(profileId: HardwareProfileId) {
    this.activeProfile = profileId;
    this.metrics.activeProfile = profileId;
    const spec = HARDWARE_PROFILES[profileId];

    if (spec && profileId !== 'AUTO_DETECTED') {
      this.metrics.shadowMode = spec.shadowQuality;
      this.metrics.particleLimit = spec.maxParticles;
    }
    this.notify();
  }

  public toggleBatterySaver(force?: boolean) {
    this.metrics.batterySaverActive = force !== undefined ? force : !this.metrics.batterySaverActive;
    if (this.metrics.batterySaverActive) {
      this.metrics.shadowMode = 'OFF';
      this.metrics.particleLimit = 5;
    }
    this.notify();
  }

  public getMetrics(): SystemPerformanceMetrics {
    return { ...this.metrics };
  }

  public getProfileSpec(): HardwareProfileSpec {
    return HARDWARE_PROFILES[this.activeProfile];
  }

  public subscribe(callback: (metrics: SystemPerformanceMetrics) => void): () => void {
    this.listeners.add(callback);
    callback(this.getMetrics());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    const copy = this.getMetrics();
    this.listeners.forEach(cb => cb(copy));
  }

  public destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }
}

export const performanceGuardian = new PerformanceGuardianEngine();
