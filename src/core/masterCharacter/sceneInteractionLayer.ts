/**
 * TADE v9.5.0-MCA5 — R953
 * SCENE INTERACTION LAYER
 * 
 * Provides reactive interactive school props & environmental actors:
 * - Flying Yellow/Emerald Butterfly with physics flutter
 * - Islamic Garden Flowers with gentle sway
 * - Drifting Clouds with wind velocity
 * - Achievement Sparkles & Celebration Confetti
 */

export interface ButterflyState {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  wingAngle: number; // 0 - 60 deg
  scale: number;
  colorHex: string;
  isVisible: boolean;
}

export interface CloudProp {
  id: string;
  x: number; // percentage
  y: number;
  speed: number;
  scale: number;
  opacity: number;
}

export interface FlowerProp {
  id: string;
  x: number;
  color: string;
  swayAngleDeg: number;
  bloomScale: number;
}

export interface SceneInteractionSnapshot {
  butterfly: ButterflyState;
  clouds: CloudProp[];
  flowers: FlowerProp[];
  activeSparklesCount: number;
  environmentPropCount: number;
}

export class SceneInteractionLayer {
  private timeSec: number = 0;
  private butterfly: ButterflyState = {
    x: 20,
    y: 40,
    wingAngle: 30,
    scale: 1.0,
    colorHex: '#FBBF24', // golden amber
    isVisible: true
  };

  private clouds: CloudProp[] = [
    { id: 'c1', x: 10, y: 15, speed: 0.8, scale: 1.0, opacity: 0.85 },
    { id: 'c2', x: 60, y: 25, speed: 0.5, scale: 0.75, opacity: 0.7 }
  ];

  private flowers: FlowerProp[] = [
    { id: 'f1', x: 15, color: '#F43F5E', swayAngleDeg: 0, bloomScale: 1.0 },
    { id: 'f2', x: 28, color: '#38BDF8', swayAngleDeg: 0, bloomScale: 0.9 },
    { id: 'f3', x: 75, color: '#FBBF24', swayAngleDeg: 0, bloomScale: 1.05 },
    { id: 'f4', x: 88, color: '#34D399', swayAngleDeg: 0, bloomScale: 0.95 }
  ];

  private sparklesCount: number = 0;

  public update(deltaSeconds: number): SceneInteractionSnapshot {
    this.timeSec += deltaSeconds;

    // 1. Update butterfly sinusoidal flight path
    const bPhase = this.timeSec * 1.8;
    this.butterfly.x = 50 + 35 * Math.sin(bPhase * 0.7);
    this.butterfly.y = 45 + 20 * Math.cos(bPhase * 1.1) + 8 * Math.sin(bPhase * 2.3);
    this.butterfly.wingAngle = Math.abs(Math.sin(this.timeSec * 18)) * 55;

    // 2. Update drifting clouds
    this.clouds.forEach(c => {
      c.x += c.speed * deltaSeconds * 2;
      if (c.x > 110) c.x = -20;
    });

    // 3. Update flower swaying in breeze
    this.flowers.forEach((f, idx) => {
      f.swayAngleDeg = Math.sin(this.timeSec * 2.2 + idx * 1.5) * 6;
    });

    return this.getSnapshot();
  }

  public triggerCelebrationSparkles(count: number = 12): void {
    this.sparklesCount = count;
  }

  public getSnapshot(): SceneInteractionSnapshot {
    return {
      butterfly: { ...this.butterfly },
      clouds: this.clouds.map(c => ({ ...c })),
      flowers: this.flowers.map(f => ({ ...f })),
      activeSparklesCount: this.sparklesCount,
      environmentPropCount: this.clouds.length + this.flowers.length + 1
    };
  }
}

export const defaultSceneInteractionLayer = new SceneInteractionLayer();
