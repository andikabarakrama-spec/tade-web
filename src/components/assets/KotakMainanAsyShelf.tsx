import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Layers,
  Zap,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  Copy,
  Info,
  Sliders,
  RotateCcw
} from 'lucide-react';
import {
  TadeAnimationItem,
  KOTAK_MAINAN_ASY_CATALOG,
  tadeAnimationGovernor,
  MAX_CONCURRENT_ANIMATIONS
} from '../../services/tadeAnimationGovernor';
import { tadeAssetCenterService } from '../../services/tadeAssetCenterService';
import { tadeSoundEngine } from '../../services/tadeSoundEngine';
import { asySyifaDnaEngine } from '../../services/asySyifaDnaEngine';

export const KotakMainanAsyShelf: React.FC = () => {
  const [selectedShelf, setSelectedShelf] = useState<string>('ALL');
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<TadeAnimationItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = tadeAnimationGovernor.subscribe((list, count) => {
      setActiveIds(list);
      setActiveCount(count);
    });
    return () => unsub();
  }, []);

  const shelves = [
    { id: 'ALL', label: 'Semua Mainan (48)' },
    { id: 'KENDARAAN', label: '1. Kendaraan (13)' },
    { id: 'HEWAN', label: '2. Hewan (10)' },
    { id: 'ALAM', label: '3. Alam (8)' },
    { id: 'MAINAN', label: '4. Mainan (6)' },
    { id: 'TEMA_ISLAMI', label: '5. Tema Islami (5)' },
    { id: 'BELAJAR', label: '6. Belajar (5)' },
    { id: 'ASY_SYIFA', label: '7. Asy & Syifa (7)' }
  ];

  const filteredItems = selectedShelf === 'ALL'
    ? KOTAK_MAINAN_ASY_CATALOG
    : KOTAK_MAINAN_ASY_CATALOG.filter(item => item.shelf === selectedShelf);

  const handleToggle = (id: string) => {
    const isNowActive = tadeAnimationGovernor.toggleAnimation(id);
    tadeAssetCenterService.recordAssetUsage(id, 'Kotak Mainan Asy');

    if (isNowActive) {
      if (id.includes('kereta') || id.includes('train')) {
        tadeSoundEngine.playFx('TUT_TUT_KERETA');
      } else if (id.includes('bintang') || id.includes('star') || id.includes('bulan')) {
        tadeSoundEngine.playFx('PLING_BINTANG');
      } else if (id.includes('balon') || id.includes('balloon') || id.includes('bola')) {
        tadeSoundEngine.playFx('POP_BALON');
      } else if (id.includes('buku') || id.includes('book') || id.includes('quran')) {
        tadeSoundEngine.playFx('FLIP_BUKU');
      } else {
        tadeSoundEngine.playFx('TEPUK_TANGAN_KECIL');
      }
    }
  };

  const handleCopySvgCode = (item: TadeAnimationItem) => {
    navigator.clipboard.writeText(`<TadeAnimatedToy item="${item.id}" shelf="${item.shelf}" />`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to render responsive animated SVG icons
  const renderToyVisual = (item: TadeAnimationItem, isAnimating: boolean) => {
    const animClass = isAnimating ? 'animate-bounce' : 'transition-transform hover:scale-105';

    switch (item.svgKey) {
      case 'train':
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className={`w-14 h-14 ${isAnimating ? 'animate-pulse' : ''}`}>
              <rect x="15" y="40" width="55" height="35" rx="6" fill="#0d9488" />
              <rect x="50" y="25" width="20" height="50" rx="4" fill="#0f766e" />
              <circle cx="30" cy="78" r="9" fill="#1e293b" className={isAnimating ? 'animate-spin' : ''} />
              <circle cx="58" cy="78" r="9" fill="#1e293b" className={isAnimating ? 'animate-spin' : ''} />
              <circle cx="30" cy="78" r="4" fill="#f59e0b" />
              <circle cx="58" cy="78" r="4" fill="#f59e0b" />
              <rect x="22" y="28" width="8" height="15" fill="#f97316" />
              {isAnimating && (
                <circle cx="26" cy="18" r="6" fill="#e2e8f0" className="animate-ping opacity-75" />
              )}
            </svg>
          </div>
        );

      case 'bus':
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className={`w-14 h-14 ${isAnimating ? 'animate-bounce' : ''}`}>
              <rect x="15" y="30" width="70" height="40" rx="8" fill="#f59e0b" />
              <rect x="22" y="38" width="14" height="14" rx="2" fill="#e0f2fe" />
              <rect x="42" y="38" width="14" height="14" rx="2" fill="#e0f2fe" />
              <rect x="62" y="38" width="14" height="14" rx="2" fill="#e0f2fe" />
              <circle cx="32" cy="72" r="8" fill="#1e293b" />
              <circle cx="68" cy="72" r="8" fill="#1e293b" />
            </svg>
          </div>
        );

      case 'hotairballoon':
      case 'rocket':
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className={`w-14 h-14 ${isAnimating ? 'animate-bounce' : ''}`}>
              <path d="M50 15 C30 15 25 35 35 55 C40 65 45 70 50 75 C55 70 60 65 65 55 C75 35 70 15 50 15 Z" fill="#ef4444" />
              <path d="M50 15 C42 15 38 35 44 55 C47 65 50 75 50 75 C50 75 53 65 56 55 C62 35 58 15 50 15 Z" fill="#f59e0b" />
              <rect x="46" y="80" width="8" height="8" rx="2" fill="#78350f" />
              <line x1="42" y1="73" x2="46" y2="80" stroke="#78350f" strokeWidth="2" />
              <line x1="58" y1="73" x2="54" y2="80" stroke="#78350f" strokeWidth="2" />
            </svg>
          </div>
        );

      case 'rabbit':
      case 'cat':
      case 'panda':
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className={`w-14 h-14 ${isAnimating ? 'animate-bounce' : ''}`}>
              <ellipse cx="50" cy="58" rx="26" ry="24" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
              <ellipse cx="38" cy="28" rx="6" ry="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" className={isAnimating ? 'origin-bottom animate-pulse' : ''} />
              <ellipse cx="62" cy="28" rx="6" ry="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" className={isAnimating ? 'origin-bottom animate-pulse' : ''} />
              <circle cx="42" cy="54" r="3" fill="#1e293b" />
              <circle cx="58" cy="54" r="3" fill="#1e293b" />
              <circle cx="50" cy="62" r="3" fill="#f43f5e" />
            </svg>
          </div>
        );

      case 'rainbow':
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className={`w-14 h-14 ${isAnimating ? 'animate-pulse' : ''}`}>
              <path d="M15 75 A35 35 0 0 1 85 75" fill="none" stroke="#ef4444" strokeWidth="5" />
              <path d="M22 75 A28 28 0 0 1 78 75" fill="none" stroke="#f59e0b" strokeWidth="5" />
              <path d="M29 75 A21 21 0 0 1 71 75" fill="none" stroke="#10b981" strokeWidth="5" />
              <path d="M36 75 A14 14 0 0 1 64 75" fill="none" stroke="#3b82f6" strokeWidth="5" />
            </svg>
          </div>
        );

      case 'sun':
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className={`w-14 h-14 ${isAnimating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}>
              <circle cx="50" cy="50" r="18" fill="#f59e0b" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
                <line
                  key={idx}
                  x1="50"
                  y1="22"
                  x2="50"
                  y2="14"
                  stroke="#fbbf24"
                  strokeWidth="4"
                  strokeLinecap="round"
                  transform={`rotate(${angle} 50 50)`}
                />
              ))}
            </svg>
          </div>
        );

      case 'crescent':
      case 'islamicstar':
      case 'lantern':
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className={`w-14 h-14 ${isAnimating ? 'animate-pulse' : ''}`}>
              <path d="M55 20 A30 30 0 1 0 75 75 A36 36 0 1 1 55 20 Z" fill="#f59e0b" />
              <polygon points="68,36 72,44 80,44 74,48 76,56 68,51 60,56 62,48 56,44 64,44" fill="#fbbf24" className={isAnimating ? 'animate-spin' : ''} style={{ animationDuration: '4s' }} />
            </svg>
          </div>
        );

      case 'asywaving':
      case 'asytrain':
      case 'asyreading':
      default:
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className={`w-14 h-14 ${isAnimating ? 'animate-bounce' : ''}`}>
              <circle cx="50" cy="35" r="16" fill="#fed7aa" />
              {/* Peci / Kerudung */}
              <path d="M34 32 C34 20 66 20 66 32 Z" fill="#047857" />
              {/* Eyes & Smile */}
              <circle cx="44" cy="36" r="2.5" fill="#1e293b" />
              <circle cx="56" cy="36" r="2.5" fill="#1e293b" />
              <path d="M46 42 Q50 46 54 42" stroke="#1e293b" strokeWidth="2" fill="none" />
              {/* Baju Koko / Gamis */}
              <path d="M30 52 L70 52 L64 85 L36 85 Z" fill="#10b981" />
              {/* Hand Wave */}
              {isAnimating && (
                <circle cx="76" cy="48" r="5" fill="#fed7aa" className="animate-ping opacity-60" />
              )}
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Governor Status Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Kotak Mainan Asy — 7 Rak Animasi Vektor Ceria
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                48 Aset Interaktif
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Ringan & bebas lag. Dijaga ketat oleh Governor Dr. Pulse untuk kestabilan 60 FPS di semua perangkat sekolah.
            </p>
          </div>
        </div>

        {/* Live Governor Pill */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Animasi Aktif:</span>
              <span className={`font-bold ${activeCount >= MAX_CONCURRENT_ANIMATIONS ? 'text-amber-400' : 'text-emerald-400'}`}>
                {activeCount} / {MAX_CONCURRENT_ANIMATIONS} Max
              </span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              60 FPS Prima
            </div>
          </div>

          {activeCount > 0 && (
            <button
              onClick={() => tadeAnimationGovernor.stopAll()}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Hentikan Semua
            </button>
          )}
        </div>
      </div>

      {/* Shelf Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {shelves.map(shelf => (
          <button
            key={shelf.id}
            onClick={() => setSelectedShelf(shelf.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedShelf === shelf.id
                ? 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-900/30'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {shelf.label}
          </button>
        ))}
      </div>

      {/* Grid of Toys */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredItems.map(item => {
          const isAnimating = activeIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative group ${
                isAnimating
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/40'
                  : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              {/* Shelf Tag Badge */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                <span className="truncate uppercase font-medium">{item.shelf.replace('_', ' ')}</span>
                <span className={`w-2 h-2 rounded-full ${isAnimating ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
              </div>

              {/* Centered Animated Visual */}
              <div
                onClick={() => handleToggle(item.id)}
                className="my-auto py-2 flex items-center justify-center cursor-pointer select-none"
              >
                {renderToyVisual(item, isAnimating)}
              </div>

              {/* Details & Controls */}
              <div className="mt-2 pt-2 border-t border-slate-700/50">
                <h4 className="text-xs font-bold text-white truncate text-center mb-0.5">
                  {item.name}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-1 text-center mb-2.5">
                  {item.description}
                </p>

                <div className="flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => handleToggle(item.id)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                      isAnimating
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                    }`}
                  >
                    {isAnimating ? (
                      <>
                        <Pause className="w-3 h-3" />
                        Jeda
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        Mainkan
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleCopySvgCode(item)}
                    title="Salin Kode Komponen"
                    className="p-1.5 rounded-lg bg-slate-700/70 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    {copiedId === item.id ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
