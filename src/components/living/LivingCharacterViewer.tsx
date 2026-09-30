import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Play, 
  Smile, 
  Heart, 
  BookOpen, 
  Layers, 
  Activity, 
  Check, 
  RefreshCw, 
  Zap, 
  Sliders, 
  Cpu, 
  Eye 
} from 'lucide-react';
import { 
  LivingCharacterEngine, 
  MascotBehaviorDefinition, 
  MASCOT_BEHAVIOR_BANK, 
  MascotBehaviorType 
} from '../../core/living/livingCharacterEngine';

export const LivingCharacterViewer: React.FC = () => {
  const engine = useMemo(() => LivingCharacterEngine.getInstance(), []);
  const [currentBehavior, setCurrentBehavior] = useState<MascotBehaviorDefinition>(() => engine.getCurrentBehavior());
  const [isAutoCycle, setIsAutoCycle] = useState<boolean>(() => engine.isAutoCycling());
  const [isActing, setIsActing] = useState<boolean>(false);

  useEffect(() => {
    const unsub = engine.subscribe((b) => {
      setCurrentBehavior(b);
    });
    return () => unsub();
  }, [engine]);

  const handleTriggerBehavior = (id: MascotBehaviorType) => {
    setIsActing(true);
    const selected = engine.triggerBehavior(id);
    setCurrentBehavior(selected);
    setTimeout(() => setIsActing(false), 800);
  };

  const handleRandomTrigger = () => {
    setIsActing(true);
    const selected = engine.triggerRandomBehavior();
    setCurrentBehavior(selected);
    setTimeout(() => setIsActing(false), 800);
  };

  const handleToggleAutoCycle = () => {
    const next = engine.toggleAutoCycle();
    setIsAutoCycle(next);
  };

  return (
    <div className="space-y-6" id="living-character-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5" />
                Mesin Karakter Hidup & Bank Tingkah
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R827 &bull; RC100
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Asy Bukan NPC: Ekspresi Hidup & Responsif
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Koleksi tingkah laku alamiah Asy & Syifa: mengintip dari sudut kartu, mengejar kupu-kupu, merapikan peci zamrud, hingga membaca Iqro dengan beban CPU mendekati 0%.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomTrigger}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Zap className="w-4 h-4" />
              Tingkah Acak Ceria
            </button>
          </div>
        </div>
      </div>

      {/* Main Living Stage & Behavior Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Mascot Living Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white text-center space-y-5 shadow-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[380px]">
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

            {/* Mascot Visual Representation */}
            <div className={`relative transition-transform duration-500 ${isActing ? 'scale-110' : 'scale-100'}`}>
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-900/60 to-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center shadow-2xl relative">
                <span className="text-6xl select-none animate-bounce">
                  {currentBehavior.id === 'MEMEGANG_UJUNG_HIJAB' ? '👧' : '👦'}
                </span>

                {/* Animated accessory badge based on behavior */}
                {currentBehavior.id === 'MENGEJAR_KUPU_KUPU' && (
                  <span className="absolute -top-2 -right-2 text-2xl animate-spin">🦋</span>
                )}
                {currentBehavior.id === 'MEMBACA_IQRA' && (
                  <span className="absolute -bottom-2 -right-2 text-2xl animate-pulse">📖</span>
                )}
                {currentBehavior.id === 'MEMELUK_BONEKA_KECIL' && (
                  <span className="absolute -bottom-2 -left-2 text-2xl">🧸</span>
                )}
                {currentBehavior.id === 'MERAPIKAN_PECI' && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl">✨</span>
                )}
              </div>
            </div>

            {/* Mascot Dialogue Bubble */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 text-xs text-emerald-300 font-medium relative max-w-sm shadow-md">
              <span className="font-bold text-white block mb-1">Asy Berkata:</span>
              "{currentBehavior.dialogueSnippet}"
            </div>

            {/* Current Behavior Meta */}
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">{currentBehavior.title}</h3>
              <p className="text-xs text-slate-400 max-w-xs">{currentBehavior.description}</p>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
              <span>Beban: <strong className="text-emerald-400">{currentBehavior.cpuImpact}</strong></span>
              <span>&bull;</span>
              <span>Durasi: <strong className="text-white">{currentBehavior.durationSeconds}s</strong></span>
              <span>&bull;</span>
              <span>Kategori: <strong className="text-emerald-300">{currentBehavior.category}</strong></span>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Bank Tingkah Deck */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              Bank Tingkah Interaktif ({MASCOT_BEHAVIOR_BANK.length} Perilaku)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">KLIK UNTUK MENGAKTIFKAN</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MASCOT_BEHAVIOR_BANK.map((item) => {
              const isCurrent = currentBehavior.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleTriggerBehavior(item.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-2.5 ${
                    isCurrent
                      ? 'bg-emerald-500/10 border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-lg'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold truncate ${isCurrent ? 'text-emerald-300' : 'text-white'}`}>
                      {item.title}
                    </h4>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500 text-slate-950 shrink-0">
                        AKTIF
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-slate-950 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-mono text-emerald-400">{item.cpuImpact}</span>
                    <span className="text-slate-400 italic">"{item.dialogueSnippet.slice(0, 26)}..."</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
