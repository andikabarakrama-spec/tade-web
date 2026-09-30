import React, { useState, useEffect } from 'react';
import { Sparkles, Gift, Star, Award, X, CheckCircle2 } from 'lucide-react';
import { tvAsySyifaService, SecretSurprise, SECRET_SURPRISES } from '../../services/tvAsySyifaService';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';

export const SecretSurprisePopup: React.FC = () => {
  const [activeSurprise, setActiveSurprise] = useState<SecretSurprise | null>(null);
  const [unlockedModalSurprise, setUnlockedModalSurprise] = useState<SecretSurprise | null>(null);
  const [showCatalog, setShowCatalog] = useState<boolean>(false);

  // Periodic chance to spawn a surprise
  useEffect(() => {
    const checkSpawn = () => {
      // 70% chance to spawn an occasional surprise floating icon
      if (!activeSurprise && Math.random() < 0.75) {
        const randomSurprise = SECRET_SURPRISES[Math.floor(Math.random() * SECRET_SURPRISES.length)];
        setActiveSurprise(randomSurprise);
      }
    };

    const initialTimeout = setTimeout(checkSpawn, 3000);
    const interval = setInterval(checkSpawn, 25000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [activeSurprise]);

  const handleCatchSurprise = (surprise: SecretSurprise) => {
    tvAsySyifaService.unlockSurprise(surprise.id);
    setActiveSurprise(null);
    setUnlockedModalSurprise(surprise);
  };

  const unlockedIds = tvAsySyifaService.getUnlockedSurprises();

  return (
    <>
      {/* Floating Mystery Item */}
      {activeSurprise && (
        <div className="fixed bottom-24 right-6 z-40 animate-bounce cursor-pointer group">
          <button
            onClick={() => handleCatchSurprise(activeSurprise)}
            className="relative flex items-center gap-2 bg-gradient-to-r from-amber-400 via-rose-400 to-teal-400 p-1.5 sm:p-2 rounded-full shadow-2xl border-2 border-white hover:scale-110 transition-transform"
            title="Kejutan Rahasia Muncul! Ketuk untuk menangkap!"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 flex items-center justify-center text-2xl shadow-inner">
              <span>{activeSurprise.emoji}</span>
            </div>
            <div className="hidden sm:block pr-3 text-left text-slate-900 font-black">
              <div className="text-[10px] uppercase tracking-wider text-purple-900 flex items-center gap-1 font-extrabold">
                <Sparkles className="w-3 h-3 text-purple-700 animate-spin" />
                Kejutan Rahasia!
              </div>
              <div className="text-xs font-bold text-slate-900">Ketuk Aku!</div>
            </div>
            {/* Sparkle ping */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full animate-ping" />
          </button>
        </div>
      )}

      {/* Unlock Congratulation Modal */}
      {unlockedModalSurprise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full rounded-3xl p-6 border-4 border-amber-400 shadow-2xl text-center space-y-4 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl" />
            
            <button
              onClick={() => setUnlockedModalSurprise(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-300 via-rose-300 to-teal-300 flex items-center justify-center text-4xl shadow-lg border-2 border-white">
              <span>{unlockedModalSurprise.emoji}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300">
                ✨ {unlockedModalSurprise.rarity}
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {unlockedModalSurprise.name}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {unlockedModalSurprise.description}
              </p>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl border border-emerald-300/80 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{unlockedModalSurprise.bonusBlessing}</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setUnlockedModalSurprise(null);
                  setShowCatalog(true);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black hover:bg-slate-200 transition"
              >
                Lihat Koleksi ({unlockedIds.length}/5)
              </button>
              <button
                onClick={() => setUnlockedModalSurprise(null)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black shadow-md hover:from-emerald-700 hover:to-teal-700 transition"
              >
                Alhamdulillah!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secret Collection Catalog Modal */}
      {showCatalog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 border-4 border-amber-400 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Koleksi Kejutan Rahasia ({unlockedIds.length}/5)
                </h3>
              </div>
              <button
                onClick={() => setShowCatalog(false)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300">
              Kejutan rahasia muncul sesekali saat anak-anak menjelajahi dunia TK Asy Syifa!
            </p>

            <div className="space-y-2.5">
              {SECRET_SURPRISES.map(surprise => {
                const isUnlocked = unlockedIds.includes(surprise.id);

                return (
                  <div
                    key={surprise.id}
                    className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all ${
                      isUnlocked
                        ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border flex items-center justify-center text-2xl shadow-sm">
                      {isUnlocked ? surprise.emoji : '❓'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {isUnlocked ? surprise.name : 'Kejutan Misterius'}
                        </h4>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900">
                          {surprise.rarity}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                        {isUnlocked ? surprise.description : 'Jelajahi web untuk menemukannya!'}
                      </p>
                    </div>
                    {isUnlocked && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowCatalog(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
            >
              Tutup Koleksi
            </button>
          </div>
        </div>
      )}
    </>
  );
};
