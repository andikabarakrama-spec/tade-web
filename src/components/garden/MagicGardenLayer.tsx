import React, { useEffect, useRef, useState } from 'react';
import { founderWorkspaceMemory } from '../../services/founderWorkspaceMemory';
import { livingEventEngine } from '../../services/livingEventEngine';

interface Props {
  timeOfDay?: 'Pagi' | 'Siang' | 'Sore' | 'Malam';
  enabled?: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  type: 'LEAF' | 'BUTTERFLY' | 'LIGHT_ORB' | 'STAR';
  rotation: number;
  rotationSpeed: number;
}

export const MagicGardenLayer: React.FC<Props> = ({
  timeOfDay = 'Pagi',
  enabled = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const memory = founderWorkspaceMemory.load();
  const gpuQuality = memory.gpuQuality || 'HIGH';
  const isBatterySaver = gpuQuality === 'BATTERY_SAVER';

  const [activeEvent] = useState(() => livingEventEngine.getActiveEvent());

  useEffect(() => {
    if (!enabled || isBatterySaver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool: High = 16, Balanced = 8
    const particleCount = gpuQuality === 'HIGH' ? 16 : 8;
    const particles: Particle[] = [];

    const isNight = timeOfDay === 'Malam';

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isNight ? Math.random() * 2 + 1 : Math.random() * 6 + 4,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: isNight ? (Math.random() - 0.5) * 0.2 : Math.random() * 0.4 + 0.2,
        opacity: Math.random() * 0.4 + 0.1,
        type: isNight ? 'STAR' : (i % 3 === 0 ? 'BUTTERFLY' : (i % 3 === 1 ? 'LEAF' : 'LIGHT_ORB')),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render light beams / particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y > height + 20) p.y = -20;

        ctx.save();
        ctx.globalAlpha = p.opacity;

        if (p.type === 'STAR') {
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'LEAF') {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'BUTTERFLY') {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(-2, 0, p.size / 2, 0, Math.PI * 2);
          ctx.arc(2, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // LIGHT_ORB
          ctx.fillStyle = '#6ee7b7';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, gpuQuality, isBatterySaver, timeOfDay]);

  if (!enabled || isBatterySaver) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-70"
    />
  );
};
