import React, { useState, useEffect } from 'react';
import { Sparkles, Sun, Heart, GraduationCap, BookOpen, Star } from 'lucide-react';

export const CinematicIntroLoader: React.FC = () => {
  const [show, setShow] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Has visited in current session?
    const hasSeen = sessionStorage.getItem('tade_intro_seen');
    if (hasSeen) {
      setShow(false);
      return;
    }

    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1800);

    const removeTimer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('tade_intro_seen', 'true');
    }, 2400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-white flex flex-col items-center justify-center p-6 transition-opacity duration-700 pointer-events-none ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background magical elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-10 left-10 text-4xl animate-bounce">🎈</div>
        <div className="absolute top-1/4 right-16 text-3xl animate-pulse">🦋</div>
        <div className="absolute bottom-20 left-1/3 text-4xl animate-spin">✨</div>
        <div className="absolute bottom-12 right-20 text-3xl animate-bounce">🌈</div>
      </div>

      <div className="relative z-10 text-center space-y-4 max-w-md animate-in zoom-in-90 duration-500">
        {/* Logo Badge */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-1 shadow-2xl flex items-center justify-center animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-emerald-400" />
          </div>
        </div>

        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            Living Digital Kindergarten
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            TK ASY SYIFA TANGGUL
          </h1>
          <p className="text-xs text-amber-300 font-semibold italic">
            "Mewujudkan Generasi Muslim Cerdas, Qurani, & Berkarakter"
          </p>
        </div>

        {/* Loading Bar */}
        <div className="w-48 h-2 mx-auto bg-slate-800 rounded-full overflow-hidden border border-emerald-700/50 shadow-inner">
          <div className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-teal-300 animate-pulse w-full rounded-full" />
        </div>

        <p className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
          <Heart className="w-3 h-3 text-red-400 fill-red-400 animate-ping" />
          Membuka Taman Digital Ceria...
        </p>
      </div>
    </div>
  );
};
