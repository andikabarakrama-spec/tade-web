import React from 'react';
import { Sparkles, Heart, Compass, MapPin, Feather, Sun, Star, BookOpen } from 'lucide-react';
import { AIAsyCharacterRenderer } from '../assistant/AIAsyCharacterRenderer';

// SCRAPBOOK PAPER FRAME (Replaces SaaS Cards)
export const ScrapbookPaperFrame: React.FC<{
  title?: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
  sticker?: string;
}> = ({ title, subtitle, badge, children, className = '', sticker = '🌸' }) => {
  return (
    <div className={`relative bg-amber-50/95 text-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-amber-200/90 shadow-xl space-y-4 my-6 overflow-hidden transform rotate-0.5 transition hover:rotate-0 ${className}`}>
      
      {/* Brass Pin / Washi Tape Accent */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-amber-300/60 border border-amber-400/50 rotate-[-1deg] shadow-xs flex items-center justify-center text-[10px] font-black text-amber-950 uppercase tracking-widest">
        📌 MEMORI ASY SYIFA
      </div>

      {/* Decorative Corner Stickers */}
      <div className="absolute top-3 right-4 text-xl select-none">{sticker}</div>
      <div className="absolute bottom-3 left-4 text-xl select-none opacity-60">🌿</div>

      {/* Header Block */}
      {(title || badge) && (
        <div className="border-b border-amber-200/80 pb-3 pt-2 space-y-1">
          {badge && (
            <span className="inline-block bg-emerald-800 text-amber-300 font-black text-[10px] uppercase px-3 py-0.5 rounded-full shadow-xs">
              {badge}
            </span>
          )}
          {title && <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h3>}
          {subtitle && <p className="text-xs text-stone-600 font-medium">{subtitle}</p>}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
        {children}
      </div>
    </div>
  );
};

// WOODEN BOARD FRAME (Replaces Corporate Containers)
export const WoodenBoardFrame: React.FC<{
  title?: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
  icon?: string;
}> = ({ title, badge, children, className = '', icon = '🪵' }) => {
  return (
    <div className={`relative bg-gradient-to-b from-amber-950 via-amber-900 to-emerald-950 text-amber-100 rounded-3xl p-6 sm:p-8 border-4 border-amber-400/80 shadow-2xl space-y-4 my-6 overflow-hidden ${className}`}>
      
      {/* Wooden Board Header */}
      {(title || badge) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-500/40 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{icon}</span>
            <div>
              {badge && (
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-md">
                  {badge}
                </span>
              )}
              {title && <h3 className="text-lg sm:text-xl font-black text-amber-200 tracking-tight mt-0.5">{title}</h3>}
            </div>
          </div>
        </div>
      )}

      {/* Wood Frame Content */}
      <div className="relative z-10 text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
        {children}
      </div>
    </div>
  );
};

// NATURAL LANDSCAPE SELECTION DIVIDERS (Replaces HR Lines)
export const StoneSteppingPathDivider: React.FC<{ label?: string }> = ({ label = 'Jalan Setapak Taman Asy Syifa' }) => (
  <div className="my-8 flex flex-col items-center justify-center space-y-2 pointer-events-none">
    <div className="flex items-center gap-3">
      <span className="text-xl">🪨</span>
      <div className="w-16 border-b-2 border-dashed border-emerald-600/60" />
      <span className="text-xl">🌸</span>
      <div className="w-16 border-b-2 border-dashed border-emerald-600/60" />
      <span className="text-xl">🪨</span>
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-300">
      {label}
    </span>
  </div>
);

export const WoodenFenceDivider: React.FC = () => (
  <div className="my-8 w-full flex items-center justify-center gap-2 overflow-hidden pointer-events-none opacity-80">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} className="flex items-center gap-1">
        <div className="w-4 h-8 bg-amber-800 border border-amber-500 rounded-t-md shadow-xs" />
        <span className="text-xs">🌿</span>
      </div>
    ))}
  </div>
);

// IMMERSIVE WORLD LANDSCAPE WRAPPER
export const ImmersiveWorldLandscape: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-100/80 via-amber-50/90 via-teal-50/80 to-emerald-100/90 text-slate-900 relative overflow-x-hidden">
      
      {/* Floating Butterflies & Birds in Sky */}
      <div className="fixed top-20 left-10 text-2xl animate-float-slow pointer-events-none z-30 opacity-80">
        🦋
      </div>
      <div className="fixed top-36 right-12 text-xl animate-bounce pointer-events-none z-30 opacity-70">
        🐦
      </div>

      {/* Main World Content Stream */}
      <div className="relative z-10 space-y-2">
        {children}
      </div>
    </div>
  );
};
