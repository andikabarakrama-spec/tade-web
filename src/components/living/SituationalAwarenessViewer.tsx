import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Eye, 
  CheckCircle2, 
  Moon, 
  Sun, 
  Smartphone, 
  Upload, 
  Film, 
  Sliders, 
  ShieldCheck, 
  Sparkles, 
  HeartHandshake, 
  Award,
  Zap
} from 'lucide-react';
import { 
  SituationalAwarenessEngine, 
  AppSituationContext, 
  SituationReaction 
} from '../../core/living/situationalAwarenessEngine';

export const SituationalAwarenessViewer: React.FC = () => {
  const engine = useMemo(() => SituationalAwarenessEngine.getInstance(), []);
  const [currentContext, setCurrentContext] = useState<AppSituationContext>(() => engine.getContext());
  const [currentReaction, setCurrentReaction] = useState<SituationReaction>(() => engine.getReaction());
  const situations = useMemo(() => engine.getAllSituations(), [engine]);

  useEffect(() => {
    const unsub = engine.subscribe((ctx, react) => {
      setCurrentContext(ctx);
      setCurrentReaction(react);
    });
    return () => unsub();
  }, [engine]);

  const handleSelectContext = (ctx: AppSituationContext) => {
    engine.setContext(ctx);
  };

  const getContextIcon = (ctx: AppSituationContext) => {
    switch (ctx) {
      case 'LOGIN_SUCCESS': return CheckCircle2;
      case 'PHOTO_UPLOADED': return Upload;
      case 'VIDEO_RENDER_COMPLETE': return Film;
      case 'KEYBOARD_ACTIVE': return Smartphone;
      case 'FOCUS_MODE_ON': return Sliders;
      case 'NIGHT_HOURS': return Moon;
      case 'SEASON_RAMADHAN': return Sparkles;
      case 'SEASON_WISUDA': return Award;
      case 'SEASON_HARI_GURU': return HeartHandshake;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6" id="situational-awareness-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Mesin Kesadaran Situasi & Konteks
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R828 &bull; RC100
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Sensor Kontekstual Non-Intrusif TADE
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Maskot Asy membaca kondisi aplikasi secara dinamis (login, unggah media, keyboard aktif, waktu malam, Ramadhan, wisuda) dan bereaksi santun tanpa mengganggu alur kerja guru.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Konteks Terdeteksi Saat Ini</span>
            <span className="text-sm font-bold text-sky-400">{currentReaction.title}</span>
          </div>
        </div>
      </div>

      {/* Grid: Context Monitor & Simulation Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Active Reaction Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl p-6 text-white space-y-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-sky-400 block">RESPON AKTIF ASY</span>
                  <h3 className="text-sm font-bold text-white">{currentReaction.title}</h3>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {currentReaction.badgeLabel}
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Nasehat / Respon Dialog:</span>
              <p className="text-xs text-sky-300 italic font-medium leading-relaxed">
                "{currentReaction.mascotReactionText}"
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Adaptasi Visual</span>
                <span className="font-semibold text-white text-right max-w-[200px] truncate">{currentReaction.visualAdaptation}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Tingkah Terpilih</span>
                <span className="font-mono text-emerald-400">{currentReaction.suggestedBehavior}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Sifat Gangguan</span>
                <span className="font-bold text-emerald-400">ZERO DISRUPTIVE (AMAN)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Context Trigger Simulation Grid */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-sky-400" />
              Daftar Konteks Aplikasi Terpasang ({situations.length})
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">SIMULASI KLIK</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {situations.map((sit) => {
              const isCurrent = currentContext === sit.context;
              const Icon = getContextIcon(sit.context);
              return (
                <div
                  key={sit.context}
                  onClick={() => handleSelectContext(sit.context)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                    isCurrent
                      ? 'bg-sky-500/10 border-sky-500/60 ring-2 ring-sky-500/20 shadow-lg'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isCurrent ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-sky-400'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <h4 className={`text-xs font-bold truncate ${isCurrent ? 'text-sky-300' : 'text-white'}`}>
                        {sit.title}
                      </h4>
                    </div>

                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 shrink-0">
                      {sit.badgeLabel}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {sit.visualAdaptation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
