import React, { useState, useEffect } from 'react';
import { useLivingGarden } from '../../context/LivingGardenContext';
import { ArrowUp, Sparkles } from 'lucide-react';

export const SmartDockManager: React.FC = () => {
  const { settings, toggleQuietMode } = useLivingGarden();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Monitor scroll for Back To Top
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed z-40 inset-x-0 bottom-0 pointer-events-none p-4 flex justify-between items-end gap-4 print:hidden">
      {/* LEFT SIDE DOCK (Back To Top & Quiet Mode) */}
      <div className="pointer-events-auto flex flex-col gap-2 items-start">
        {/* Back To Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="w-11 h-11 rounded-2xl bg-slate-900/90 text-white shadow-xl hover:bg-emerald-700 flex items-center justify-center transition transform hover:scale-105 active:scale-95 border border-slate-700/80 backdrop-blur-md cursor-pointer"
            title="Kembali ke Atas"
            aria-label="Kembali ke Atas"
          >
            <ArrowUp className="w-5 h-5 text-amber-300" />
          </button>
        )}
      </div>

      {/* RIGHT SIDE DOCK Reserved for AI Asy Single Floating Avatar System */}
      <div className="pointer-events-none" />
    </div>
  );
};

