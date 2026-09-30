import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';

export interface LivingSlideCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number, isActive: boolean) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  itemsPerPageDesktop?: number;
  itemsPerPageTablet?: number;
  itemsPerPageMobile?: number;
  title?: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export function LivingSlideCarousel<T>({
  items,
  renderItem,
  keyExtractor,
  autoPlay = true,
  autoPlayInterval = 5000,
  itemsPerPageDesktop = 3,
  itemsPerPageTablet = 2,
  itemsPerPageMobile = 1,
  title,
  subtitle,
  badge,
  className = '',
}: LivingSlideCarouselProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(itemsPerPageDesktop);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Responsive Items Per Page Adjustment
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerPage(itemsPerPageMobile);
      } else if (width < 1024) {
        setItemsPerPage(itemsPerPageTablet);
      } else {
        setItemsPerPage(itemsPerPageDesktop);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerPageMobile, itemsPerPageTablet, itemsPerPageDesktop]);

  const maxIndex = Math.max(0, Math.ceil(items.length / itemsPerPage) - 1);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay Effect
  useEffect(() => {
    if (!isPlaying || isHovered || maxIndex <= 0) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, maxIndex, autoPlayInterval, handleNext]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Slice visible items
  const startIdx = currentIndex * itemsPerPage;
  const visibleItems = items.slice(startIdx, startIdx + itemsPerPage);

  // Fallback if slice is smaller than itemsPerPage on the last slide
  const displayItems =
    visibleItems.length < itemsPerPage && items.length >= itemsPerPage
      ? items.slice(items.length - itemsPerPage, items.length)
      : visibleItems;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: [0.25, 1, 0.5, 1],
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.96,
      transition: {
        duration: 0.35,
        ease: [0.25, 1, 0.5, 1],
      },
    }),
  };

  return (
    <div
      className={`relative w-full my-6 rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-emerald-900/40 via-stone-900/60 to-teal-950/40 border-2 border-emerald-500/30 backdrop-blur-md shadow-2xl overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header Controls Bar */}
      {(title || subtitle || badge || maxIndex > 0) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-emerald-500/20">
          <div>
            {badge && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {badge}
              </span>
            )}
            {title && <h3 className="text-xl sm:text-2xl font-black text-white">{title}</h3>}
            {subtitle && <p className="text-xs sm:text-sm text-emerald-100/80 font-medium mt-0.5">{subtitle}</p>}
          </div>

          {/* Navigation Controls */}
          {maxIndex > 0 && (
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-400/30 transition-all cursor-pointer shadow-md"
                title={isPlaying ? 'Jeda Autoplay' : 'Putar Autoplay'}
                aria-label={isPlaying ? 'Jeda Slide' : 'Putar Slide'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-600 text-white border border-emerald-400/40 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                aria-label="Slide Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-600 text-white border border-emerald-400/40 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                aria-label="Slide Selanjutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Slide Item Container */}
      <div className="relative min-h-[300px] w-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants as any}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid gap-4 sm:gap-6 w-full"
            style={{
              gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))`,
            }}
          >
            {displayItems.map((item, idx) => {
              const actualIdx = startIdx + idx;
              return (
                <div key={keyExtractor(item, actualIdx)} className="h-full w-full">
                  {renderItem(item, actualIdx, actualIdx === currentIndex)}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Indicators / Dots */}
      {maxIndex > 0 && (
        <div className="flex items-center justify-center gap-2 mt-6 pt-2">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/50 border border-amber-300'
                  : 'w-2.5 bg-emerald-700/60 hover:bg-emerald-500/80'
              }`}
              aria-label={`Ke slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
