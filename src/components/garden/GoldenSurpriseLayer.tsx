import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Star, Gift, X, CheckCircle2, Award } from 'lucide-react';
import { 
  livingWorldEngine, GoldenSurprise, GOLDEN_SURPRISES 
} from '../../services/livingWorldEngine';

export const GoldenSurpriseLayer: React.FC = () => {
  const [activeSurprise, setActiveSurprise] = useState<GoldenSurprise | null>(() => livingWorldEngine.getActiveGoldenSurprise());
  const [celebrationModal, setCelebrationModal] = useState<GoldenSurprise | null>(null);
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);
  const [collectedIds, setCollectedIds] = useState<string[]>(() => livingWorldEngine.getCollectedGoldenIds());

  useEffect(() => {
    const unsub = livingWorldEngine.subscribe(() => {
      setActiveSurprise(livingWorldEngine.getActiveGoldenSurprise());
      setCollectedIds(livingWorldEngine.getCollectedGoldenIds());
    });
    return unsub;
  }, []);

  const handleCatchGoldenSurprise = (surprise: GoldenSurprise) => {
    livingWorldEngine.collectGoldenSurprise(surprise.id);
    setCelebrationModal(surprise);
  };

  return (
    <>
      {/* Floating Golden Mystery Artifact */}
      {activeSurprise && (
        <div className="fixed top-28 right-6 z-40 animate-bounce cursor-pointer group">
          <button
            onClick={() => handleCatchGoldenSurprise(activeSurprise)}
            className="relative flex items-center gap-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 p-2 rounded-full shadow-2xl border-4 border-white hover:scale-110 transition-transform"
            title="Kejutan Emas Langka Muncul! Ketuk untuk mengambil!"
          >
            <div className="w-12 h-12 rounded-full bg-slate-950 flex items-center justify-center text-3xl shadow-inner border border-amber-300">
              <span>{activeSurprise.emoji}</span>
            </div>
            <div className="hidden sm:block pr-3 text-left text-slate-950 font-black">
              <div className="text-[10px] uppercase tracking-wider text-amber-950 flex items-center gap-1 font-extrabold">
                <Trophy className="w-3 h-3 text-amber-900 animate-spin" />
                ✨ Kejutan Emas!
              </div>
              <div className="text-xs font-black text-slate-950">{activeSurprise.name}</div>
            </div>
            {/* Shimmering ping ring */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-200 rounded-full animate-ping" />
          </button>
        </div>
      )}

      {/* Floating Catalog Access Trigger Button */}
      <div className="fixed bottom-24 left-6 z-30">
        <button
          onClick={() => setShowCatalogModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-400/90 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-lg border-2 border-white backdrop-blur-md hover:scale-105 transition-transform"
          title="Buka Lemari Koleksi Kejutan Emas Asy"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-900" />
          <span>Koleksi Emas ({collectedIds.length}/4)</span>
        </button>
      </div>

      {/* Celebration Modal upon Catching Golden Surprise */}
      {celebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full rounded-3xl p-6 border-4 border-amber-400 shadow-2xl text-center space-y-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/30 rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={() => setCelebrationModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Golden Emblem */}
            <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr ${celebrationModal.themeColor} flex items-center justify-center text-5xl shadow-2xl border-4 border-white animate-bounce`}>
              <span>{celebrationModal.emoji}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-400">
                🏆 {celebrationModal.rarityTitle}
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                {celebrationModal.name}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                {celebrationModal.description}
              </p>
            </div>

            {/* Blessing Card */}
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/50 rounded-2xl border border-amber-300 text-amber-950 dark:text-amber-200 text-xs font-bold leading-relaxed italic text-center">
              {celebrationModal.blessingMessage}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setCelebrationModal(null);
                  setShowCatalogModal(true);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black hover:bg-slate-200 transition"
              >
                Lihat Lemari Emas
              </button>
              <button
                onClick={() => setCelebrationModal(null)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black shadow-md hover:from-amber-400 hover:to-yellow-400 transition"
              >
                Alhamdulillah!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Golden Collection Catalog Modal */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 border-4 border-amber-400 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Lemari Kejutan Emas ({collectedIds.length}/4)
                </h3>
              </div>
              <button
                onClick={() => setShowCatalogModal(false)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Kejutan Emas adalah anugerah langka yang muncul berkala saat santri dan asatidz menjelajahi Dunia Asy yang Hidup.
            </p>

            <div className="space-y-2.5">
              {GOLDEN_SURPRISES.map(surprise => {
                const isCollected = collectedIds.includes(surprise.id);

                return (
                  <div
                    key={surprise.id}
                    className={`flex items-start gap-3.5 p-3.5 rounded-2xl border-2 transition-all ${
                      isCollected
                        ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/20 border-amber-400 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-sm shrink-0">
                      {isCollected ? surprise.emoji : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {isCollected ? surprise.name : 'Kejutan Emas Misterius'}
                        </h4>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-300 text-slate-950">
                          {surprise.rarityTitle}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                        {isCollected ? surprise.description : 'Jelajahi halaman dan temukan saat kejutan emas melayang!'}
                      </p>
                      {isCollected && (
                        <p className="text-[10px] text-amber-800 dark:text-amber-300 font-bold italic pt-1">
                          {surprise.blessingMessage}
                        </p>
                      )}
                    </div>
                    {isCollected && (
                      <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 self-center" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowCatalogModal(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs shadow-md transition"
              >
                Tutup Lemari Koleksi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
