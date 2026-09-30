import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Sparkles, Star } from 'lucide-react';

export interface FlowItem {
  id: string;
  title: string;
  category?: string;
  subtitle?: string;
  description?: string;
  image: string;
  badge?: string;
  onClick?: () => void;
}

interface InteractiveFlowProps {
  items: FlowItem[];
  onSelect?: (item: FlowItem) => void;
  className?: string;
  autoPlay?: boolean;
}

export const InteractiveFlow: React.FC<InteractiveFlowProps> = ({
  items,
  onSelect,
  className = '',
  autoPlay = false
}) => {
  const [activeIndex, setActiveIndex] = useState(Math.floor(items.length / 2));
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % items.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [autoPlay, items.length]);

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (diffX > 40) {
      handlePrev();
    } else if (diffX < -40) {
      handleNext();
    }
    touchStartX.current = null;
  };

  if (!items || items.length === 0) return null;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`relative py-8 overflow-hidden select-none ${className}`}
    >
      {/* 3D Flow Canvas */}
      <div
        className="flex items-center justify-center min-h-[360px] sm:min-h-[420px] relative"
        style={{ perspective: '1200px' }}
      >
        {items.map((item, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);
          const isActive = index === activeIndex;

          // Limit rendering depth for performance
          if (absOffset > 3) return null;

          const translateX = offset * 220; // horizontal spacing offset
          const rotateY = offset < 0 ? 32 : offset > 0 ? -32 : 0; // 3D coverflow inward tilt
          const scale = isActive ? 1.05 : Math.max(0.7, 1 - absOffset * 0.15);
          const zIndex = 30 - absOffset * 5;
          const opacity = isActive ? 1 : Math.max(0.35, 1 - absOffset * 0.3);

          return (
            <div
              key={item.id || index}
              onClick={() => {
                if (isActive) {
                  if (onSelect) onSelect(item);
                  if (item.onClick) item.onClick();
                } else {
                  setActiveIndex(index);
                }
              }}
              className={`absolute top-0 w-72 sm:w-80 h-[340px] sm:h-[380px] rounded-3xl bg-white border border-stone-200/90 shadow-xl overflow-hidden cursor-pointer transition-all duration-500 ease-out flex flex-col justify-between ${
                isActive ? 'ring-4 ring-emerald-500/80 shadow-2xl' : 'hover:border-stone-300'
              }`}
              style={{
                transform: `translateX(${translateX}px) translateZ(${isActive ? 120 : -absOffset * 80}px) rotateY(${rotateY}deg) scale(${scale})`,
                zIndex,
                opacity,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Card Image */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {item.category && (
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-emerald-800/90 text-white text-[10px] font-black uppercase tracking-wider rounded-full backdrop-blur-xs border border-emerald-400/30">
                    {item.category}
                  </span>
                )}

                {item.badge && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 fill-slate-950" /> {item.badge}
                  </span>
                )}

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-extrabold text-base sm:text-lg leading-snug drop-shadow-md">
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="text-xs text-amber-300 font-bold truncate">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Body & Action */}
              <div className="p-4 bg-stone-50/90 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {item.description || 'Klik untuk melihat detail pengalaman visual berharga.'}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-stone-200/80">
                  <span className="text-[10px] font-extrabold text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    {isActive ? 'Klik untuk Membuka' : 'Geser / Pilih'}
                  </span>
                  <div className="p-1.5 bg-emerald-700 text-white rounded-xl shadow-xs">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          className="p-3 rounded-2xl bg-white border border-stone-300 text-slate-800 hover:bg-emerald-700 hover:text-white transition cursor-pointer shadow-sm hover:shadow-md"
          title="Item Sebelum"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dots Indicator */}
        <div className="flex items-center gap-1.5">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex
                  ? 'w-7 bg-emerald-700'
                  : 'w-2.5 bg-stone-300 hover:bg-stone-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-3 rounded-2xl bg-white border border-stone-300 text-slate-800 hover:bg-emerald-700 hover:text-white transition cursor-pointer shadow-sm hover:shadow-md"
          title="Item Selanjutnya"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
