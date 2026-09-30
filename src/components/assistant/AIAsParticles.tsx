import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EventConfig } from './AIAsyEvents';
import { PerformanceMode } from './AIAsyContext';

interface AIAsyParticlesProps {
  eventConfig: EventConfig;
  performanceMode: PerformanceMode;
  isActive: boolean;
}

interface ParticleItem {
  id: number;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  size: number;
  color: string;
  rotation: number;
  delay: number;
  duration: number;
}

export const AIAsyParticles: React.FC<AIAsyParticlesProps> = ({
  eventConfig,
  performanceMode,
  isActive
}) => {
  const [particles, setParticles] = useState<ParticleItem[]>([]);

  // Check system prefers reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!isActive || prefersReducedMotion) {
      setParticles([]);
      return;
    }

    // Determine particle count based on performance mode
    const count = performanceMode === 'LIGHT' ? 10 : performanceMode === 'NORMAL' ? 18 : 28;

    const colorsMap: Record<string, string[]> = {
      CONFETTI: ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
      STARS: ['#fbbf24', '#f59e0b', '#fef08a', '#38bdf8', '#a7f3d0'],
      PETALS: ['#f472b6', '#fb7185', '#fda4af', '#f43f5e', '#ffe4e6'],
      BALLOONS: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
      HEARTS: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af'],
      STREAMERS: ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#a855f7']
    };

    const colors = colorsMap[eventConfig.particleType] || colorsMap.STARS;

    const newParticles: ParticleItem[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 90 + 5,
      y: Math.random() * 40 + 50, // originate near Asy
      size: Math.floor(Math.random() * 10) + 8,
      color: colors[i % colors.length],
      rotation: Math.floor(Math.random() * 360),
      delay: Math.random() * 1.5,
      duration: Math.random() * 2 + 2.5
    }));

    setParticles(newParticles);
  }, [isActive, eventConfig, performanceMode, prefersReducedMotion]);

  if (!isActive || prefersReducedMotion || particles.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-20" aria-hidden="true">
      <AnimatePresence>
        {particles.map((p) => {
          if (eventConfig.particleType === 'CONFETTI' || eventConfig.particleType === 'STREAMERS') {
            return (
              <motion.div
                key={p.id}
                initial={{
                  x: `${p.x}%`,
                  y: '90%',
                  opacity: 0,
                  scale: 0.2,
                  rotate: p.rotation
                }}
                animate={{
                  x: [`${p.x}%`, `${p.x + (p.id % 2 === 0 ? 15 : -15)}%`, `${p.x}%`],
                  y: ['90%', '-120%', '-200%'],
                  opacity: [0, 1, 1, 0],
                  scale: [0.2, 1, 0.8, 0],
                  rotate: [p.rotation, p.rotation + 360]
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeOut'
                }}
                style={{
                  position: 'absolute',
                  width: `${p.size}px`,
                  height: `${p.size * 0.6}px`,
                  backgroundColor: p.color,
                  borderRadius: p.id % 2 === 0 ? '2px' : '50%'
                }}
              />
            );
          }

          if (eventConfig.particleType === 'STARS') {
            return (
              <motion.div
                key={p.id}
                initial={{
                  x: `${p.x}%`,
                  y: '80%',
                  opacity: 0,
                  scale: 0.3
                }}
                animate={{
                  y: ['80%', '20%', '-50%'],
                  opacity: [0, 1, 0.8, 0],
                  scale: [0.3, 1.2, 0.5, 0],
                  rotate: [0, 180]
                }}
                transition={{
                  duration: p.duration + 1,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{
                  position: 'absolute',
                  color: p.color
                }}
              >
                <svg width={p.size * 1.5} height={p.size * 1.5} viewBox="0 0 24 24" fill={p.color}>
                  <path d="M12 2L14.85 8.65L22 9.24L16.5 13.97L18.18 21L12 17.27L5.82 21L7.5 13.97L2 9.24L9.15 8.65L12 2Z" />
                </svg>
              </motion.div>
            );
          }

          if (eventConfig.particleType === 'PETALS' || eventConfig.particleType === 'HEARTS') {
            return (
              <motion.div
                key={p.id}
                initial={{
                  x: `${p.x}%`,
                  y: '80%',
                  opacity: 0,
                  scale: 0.4
                }}
                animate={{
                  x: [`${p.x}%`, `${p.x + (p.id % 2 === 0 ? 10 : -10)}%`],
                  y: ['80%', '10%', '-80%'],
                  opacity: [0, 1, 0.9, 0],
                  scale: [0.4, 1, 0.7, 0],
                  rotate: [0, p.id % 2 === 0 ? 90 : -90]
                }}
                transition={{
                  duration: p.duration + 1.2,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{
                  position: 'absolute',
                  color: p.color
                }}
              >
                {eventConfig.particleType === 'HEARTS' ? (
                  <svg width={p.size * 1.4} height={p.size * 1.4} viewBox="0 0 24 24" fill={p.color}>
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg width={p.size * 1.3} height={p.size * 1.3} viewBox="0 0 24 24" fill={p.color}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  </svg>
                )}
              </motion.div>
            );
          }

          // Default BALLOONS
          return (
            <motion.div
              key={p.id}
              initial={{
                x: `${p.x}%`,
                y: '100%',
                opacity: 0,
                scale: 0.5
              }}
              animate={{
                y: ['100%', '-150%'],
                x: [`${p.x}%`, `${p.x + (p.id % 2 === 0 ? 8 : -8)}%`],
                opacity: [0, 0.9, 0.9, 0],
                scale: [0.5, 1, 0.9, 0.7]
              }}
              transition={{
                duration: p.duration + 2,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeOut'
              }}
              style={{
                position: 'absolute',
                width: `${p.size * 1.4}px`,
                height: `${p.size * 1.8}px`,
                backgroundColor: p.color,
                borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%'
              }}
            >
              {/* Balloon String */}
              <div className="absolute top-full left-1/2 w-0.5 h-4 bg-slate-400 -translate-x-1/2" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
