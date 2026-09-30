import React, { useState, useEffect } from 'react';
import {
  Heart,
  Smile,
  Clock,
  Sparkles,
  VolumeX,
  Volume2,
  BookOpen,
  Activity,
  Compass,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Sun,
  Moon,
  Info
} from 'lucide-react';
import { EmotionalStateEngine, EmotionState, AsyEmotionType } from '../../core/mascot3d/emotionalStateEngine';
import { LivingScheduleEngine, CurrentScheduleStatus } from '../../core/mascot3d/livingScheduleEngine';
import { ContextMovementEngine, MascotPositionOffset, MascotMovementMode } from '../../core/mascot3d/contextMovementEngine';
import { IslamicWisdomEngine, DailyDoaItem } from '../../core/mascot3d/islamicWisdomEngine';
import { CelebrationEngine } from '../../core/mascot3d/celebrationEngine';
import { SeasonalEnvironmentSync, SeasonalState } from '../../core/mascot3d/seasonalEnvironmentSync';
import { QuietPresenceMode, QuietModeState } from '../../core/mascot3d/quietPresenceMode';

export const CompanionEmotionDashboard: React.FC = () => {
  const [emotionState, setEmotionState] = useState<EmotionState>(EmotionalStateEngine.getInstance().getState());
  const [scheduleStatus, setScheduleStatus] = useState<CurrentScheduleStatus>(LivingScheduleEngine.getInstance().getCurrentStatus());
  const [movementState, setMovementState] = useState<MascotPositionOffset>(ContextMovementEngine.getInstance().getMovement());
  const [seasonalState, setSeasonalState] = useState<SeasonalState>(SeasonalEnvironmentSync.getInstance().getSeasonalState());
  const [quietState, setQuietState] = useState<QuietModeState>(QuietPresenceMode.getInstance().getState());
  const [activeDoa, setActiveDoa] = useState<DailyDoaItem>(IslamicWisdomEngine.getInstance().getRandomWisdom());

  useEffect(() => {
    const unsubEmotion = EmotionalStateEngine.getInstance().subscribe(setEmotionState);
    const unsubMovement = ContextMovementEngine.getInstance().subscribe(setMovementState);
    const unsubSeasonal = SeasonalEnvironmentSync.getInstance().subscribe(setSeasonalState);
    const unsubQuiet = QuietPresenceMode.getInstance().subscribe(setQuietState);

    const interval = setInterval(() => {
      setScheduleStatus(LivingScheduleEngine.getInstance().getCurrentStatus());
    }, 10000);

    return () => {
      unsubEmotion();
      unsubMovement();
      unsubSeasonal();
      unsubQuiet();
      clearInterval(interval);
    };
  }, []);

  const emotionsList: Array<{ type: AsyEmotionType; label: string; icon: string; desc: string }> = [
    { type: 'HAPPY', label: 'Happy (Ceria)', icon: '😊', desc: 'Senyum gembira menyambut tugas harian' },
    { type: 'CURIOUS', label: 'Curious (Penasaran)', icon: '🧐', desc: 'Menyimak fitur atau opsi yang baru diklik' },
    { type: 'THINKING', label: 'Thinking (Berpikir)', icon: '🤔', desc: 'Sedang menimbang atau memproses data' },
    { type: 'PROUD', label: 'Proud (Bangga)', icon: '🌟', desc: 'Apresiasi pencapaian atau data sukses tersimpan' },
    { type: 'SHY', label: 'Shy (Malu Santun)', icon: '☺️', desc: 'Sopan santun beradab khas santri cilik' },
    { type: 'SLEEPY', label: 'Sleepy (Mengantuk)', icon: '😴', desc: 'Waktu malam atau saat rehat hening' },
    { type: 'PRAYING', label: 'Praying (Khusyuk)', icon: '🤲', desc: 'Membaca doa harian dan dzikir pagi/petang' }
  ];

  const movementsList: Array<{ mode: MascotMovementMode; label: string; desc: string }> = [
    { mode: 'DOCK_NORMAL', label: 'Dock Normal', desc: 'Sudut kanan bawah standar' },
    { mode: 'PEEK', label: 'Mengintip (Peek)', desc: 'Mengintip ramah dari sisi kanan' },
    { mode: 'CARD_SIT', label: 'Duduk di Card', desc: 'Duduk di tepi panel aktif' },
    { mode: 'BELL_RUN', label: 'Hampiri Lonceng', desc: 'Melangkah ke arah notifikasi' },
    { mode: 'POINTER_GUIDE', label: 'Pandu Tombol', desc: 'Mengarahkan tangan ke tombol aksi' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-linear-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-800/80 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-400/60 flex items-center justify-center text-2xl shadow-inner">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-wide">R799 — Asy Companion Emotion Dashboard</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold uppercase">
                  RC97 Life Engine
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-1">
                Telemetri real-time kecerdasan emosional, rutinitas harian santri, gerak kontekstual, dan mode hening produktif.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                QuietPresenceMode.getInstance().setManualQuietMode(!quietState.isActive);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border cursor-pointer ${
                quietState.isActive
                  ? 'bg-amber-900/60 text-amber-200 border-amber-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              {quietState.isActive ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{quietState.isActive ? 'Mode Hening (Aktif)' : 'Mode Suara Normal'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid 4 Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: Current Emotion */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">Status Emosi</span>
            <Smile className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              {emotionsList.find(e => e.type === emotionState.currentEmotion)?.icon || '😊'}
            </div>
            <div>
              <p className="text-base font-black text-white">{emotionState.currentEmotion}</p>
              <p className="text-[11px] text-emerald-300 font-medium">{emotionState.expressionName}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Pemicu: {emotionState.sourceTrigger}</span>
            <span>Intensitas: {Math.round(emotionState.intensity * 100)}%</span>
          </div>
        </div>

        {/* Metric 2: Living Schedule */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">Jadwal Harian</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              {scheduleStatus.period === 'NIGHT' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-xs font-black text-white">{scheduleStatus.period}</p>
              <p className="text-[10px] text-slate-300 truncate">{scheduleStatus.activeActivity.title}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Jam: {scheduleStatus.currentHour}:{scheduleStatus.currentMinute.toString().padStart(2, '0')}</span>
            <span>{scheduleStatus.isSimulated ? 'Simulasi' : 'Jam Nyata'}</span>
          </div>
        </div>

        {/* Metric 3: Movement Mode */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">Gerak Kontekstual</span>
            <Compass className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-white truncate">{movementState.mode}</p>
              <p className="text-[10px] text-teal-300 truncate">{movementState.label}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Offset X: {movementState.offsetX}px</span>
            <span>Offset Y: {movementState.offsetY}px</span>
          </div>
        </div>

        {/* Metric 4: Seasonal Theme */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">Aura Musim</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-white truncate">{seasonalState.themeName}</p>
              <p className="text-[10px] text-emerald-300 truncate">{seasonalState.badgeText}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Aksen: {seasonalState.accentColor}</span>
            <span>Topi: {seasonalState.hatDecoration}</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Live Emulators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Emotion Test Matrix & Celebration Triggers */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Smile className="w-4 h-4 text-emerald-400" />
              <span>Matriks Pengujian Emosi Deterministik</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Klik salah satu tombol emosi untuk menguji respon mimik wajah dan ekspresi mata Maskot Asy secara instan.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {emotionsList.map(e => (
              <button
                key={e.type}
                onClick={() => {
                  EmotionalStateEngine.getInstance().setEmotion(e.type, 'MANUAL_DASHBOARD_TEST', {
                    durationMs: 9000,
                    decayTo: 'HAPPY'
                  });
                }}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  emotionState.currentEmotion === e.type
                    ? 'bg-emerald-950 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{e.icon}</span>
                  {emotionState.currentEmotion === e.type && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold leading-tight">{e.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{e.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Celebration Engine Triggers */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Pemicu Perayaan Ringan (Celebration Engine)</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => CelebrationEngine.getInstance().triggerCelebration('SAVE_SUCCESS')}
                className="py-2 px-3 bg-emerald-900/50 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-700/80 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <span>💾 Simpan Data Sukses</span>
              </button>
              <button
                onClick={() => CelebrationEngine.getInstance().triggerCelebration('TAHFIDZ_MILESTONE')}
                className="py-2 px-3 bg-amber-900/50 hover:bg-amber-800/80 text-amber-200 border border-amber-700/80 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <span>👑 Prestasi Tahfidz</span>
              </button>
              <button
                onClick={() => CelebrationEngine.getInstance().triggerCelebration('ATTENDANCE_COMPLETE')}
                className="py-2 px-3 bg-teal-900/50 hover:bg-teal-800/80 text-teal-200 border border-teal-700/80 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <span>📋 Absensi Santri Selesai</span>
              </button>
              <button
                onClick={() => CelebrationEngine.getInstance().triggerCelebration('PPDB_COMPLETE')}
                className="py-2 px-3 bg-indigo-900/50 hover:bg-indigo-800/80 text-indigo-200 border border-indigo-700/80 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <span>🎓 Santri Baru PPDB</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Context Movement & Wisdom Bank Sample */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-400" />
              <span>Simulasi Gerak Kontekstual Aman (Movement Engine)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Uji koordinat translasi Asy di layar tanpa mengganggu area formulir pengguna.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {movementsList.map(m => (
              <button
                key={m.mode}
                onClick={() => ContextMovementEngine.getInstance().triggerMovement(m.mode, { durationMs: 6000 })}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                  movementState.mode === m.mode
                    ? 'bg-teal-950 border-teal-500 text-white shadow-md'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                }`}
              >
                <div>
                  <p className="text-xs font-bold leading-tight">{m.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{m.desc}</p>
                </div>
                <Play className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              </button>
            ))}
          </div>

          {/* Islamic Wisdom Spotlight */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bank Doa Harian & Adab Santri (Local Wisdom)</span>
              </h4>
              <button
                onClick={() => setActiveDoa(IslamicWisdomEngine.getInstance().getRandomWisdom())}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Acak Doa
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-900/60 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-300">{activeDoa.title}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold uppercase">
                  {activeDoa.category}
                </span>
              </div>
              <p className="text-base font-serif text-right text-amber-200/90 leading-relaxed py-1" dir="rtl">
                {activeDoa.arabic}
              </p>
              <p className="text-xs font-mono text-emerald-200/90 italic">
                "{activeDoa.latin}"
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Artinya: {activeDoa.translation}
              </p>
              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                <strong>Adab:</strong> {activeDoa.adabTips}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
