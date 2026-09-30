import React, { useState, useRef, useEffect } from 'react';

interface DepthCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number; // 1 to 20
  glowColor?: string;
  onClick?: () => void;
  disabled3D?: boolean;
}

export const DepthCard: React.FC<DepthCardProps> = ({
  children,
  className = '',
  depth = 10,
  glowColor = 'rgba(16, 185, 129, 0.15)',
  onClick,
  disabled3D = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled3D || prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rY = ((x - centerX) / centerX) * (depth * 0.8);
    const rX = -((y - centerY) / centerY) * (depth * 0.8);

    setRotateX(rX);
    setRotateY(rY);
    setGlowPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-300 ease-out cursor-pointer ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      <div
        className="w-full h-full rounded-2xl transition-transform duration-200 ease-out relative overflow-hidden"
        style={{
          transform: isHovered && !prefersReducedMotion && !disabled3D
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${depth * 1.5}px) scale(1.02)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
          boxShadow: isHovered
            ? '0 20px 35px -10px rgba(0, 0, 0, 0.15), 0 10px 15px -5px rgba(0, 0, 0, 0.08)'
            : '0 4px 12px -2px rgba(0, 0, 0, 0.06)'
        }}
      >
        {/* Subtle Ambient Light/Glow Overlay */}
        {isHovered && !prefersReducedMotion && (
          <div
            className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${glowColor}, transparent 70%)`
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
};
