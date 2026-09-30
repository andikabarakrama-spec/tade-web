import React, { useState, useEffect } from 'react';
import {
  Heart,
  Smile,
  Clock,
  Compass,
  BookOpen,
  Sparkles,
  VolumeX,
  Volume2,
  Activity,
  Layers,
  ShieldCheck,
  Zap,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Search,
  Filter,
  Eye,
  Info
} from 'lucide-react';
import { EmotionalStateEngine, EmotionState, AsyEmotionType } from '../../core/mascot3d/emotionalStateEngine';
import { LivingScheduleEngine, CurrentScheduleStatus, TimePeriod } from '../../core/mascot3d/livingScheduleEngine';
import { ContextMovementEngine, MascotPositionOffset, MascotMovementMode } from '../../core/mascot3d/contextMovementEngine';
import { IslamicWisdomEngine, DailyDoaItem } from '../../core/mascot3d/islamicWisdomEngine';
import { CelebrationEngine, CelebrationEventType } from '../../core/mascot3d/celebrationEngine';
import { GentleGuidanceEngine, GuidanceTip } from '../../core/mascot3d/gentleGuidanceEngine';
import { SeasonalEnvironmentSync, SeasonTheme, SeasonalState } from '../../core/mascot3d/seasonalEnvironmentSync';
import { QuietPresenceMode, QuietModeState } from '../../core/mascot3d/quietPresenceMode';
import { CompanionEmotionDashboard } from './CompanionEmotionDashboard';

type RC97Tab = 'EMOTION' | 'SCHEDULE' | 'MOVEMENT' | 'WISDOM' | 'CELEBRATION' | 'QUIET_MODE' | 'DASHBOARD';

interface RC97LivingAsyWarRoomViewerProps {
  initialTab?: string;
}

export const RC97LivingAsyWarRoomViewer: React.FC<RC97LivingAsyWarRoomViewerProps> = ({ initialTab }) => {
  const resolveInitialTab = (): RC97Tab => {
    if (!initialTab) return 'DASHBOARD';
    const upper = initialTab.toUpperCase();
    if (upper.includes('EMOTION')) return 'EMOTION';
    if (upper.includes('SCHEDULE')) return 'SCHEDULE';
    if (upper.includes('MOVEMENT')) return 'MOVEMENT';
    if (upper.includes('WISDOM')) return 'WISDOM';
    if (upper.includes('CELEBRATION')) return 'CELEBRATION';
    if (upper.includes('QUIET')) return 'QUIET_MODE';
    return 'DASHBOARD';
  };

  const [activeTab, setActiveTab] = useState<RC97Tab>(resolveInitialTab());
  const [emotionState, setEmotionState] = useState<EmotionState>(EmotionalStateEngine.getInstance().getState());
  const [scheduleStatus, setScheduleStatus] = useState<CurrentScheduleStatus>(LivingScheduleEngine.getInstance().getCurrentStatus());
  const [movementState, setMovementState] = useState<MascotPositionOffset>(ContextMovementEngine.getInstance().getMovement());
  const [seasonalState, setSeasonalState] = useState<SeasonalState>(SeasonalEnvironmentSync.getInstance().getSeasonalState());
  const [quietState, setQuietState] = useState<QuietModeState>(QuietPresenceMode.getInstance().getState());
  const [wisdomSearch, setWisdomSearch] = useState('');
  const [wisdomFilter, setWisdomFilter] = useState<string>('ALL');

  useEffect(() => {
    const unsubEmotion = EmotionalStateEngine.getInstance().subscribe(setEmotionState);
    const unsubMovement = ContextMovementEngine.getInstance().subscribe(setMovementState);
    const unsubSeasonal = SeasonalEnvironmentSync.getInstance().subscribe(setSeasonalState);
    const unsubQuiet = QuietPresenceMode.getInstance().subscribe(setQuietState);

    return () => {
      unsubEmotion();
      unsubMovement();
      unsubSeasonal();
      unsubQuiet();
    };
  }, []);

  const wisdomList = IslamicWisdomEngine.getInstance().getAllWisdom().filter(w => {
    const matchesSearch =
      w.title.toLowerCase().includes(wisdomSearch.toLowerCase()) ||
      w.latin.toLowerCase().includes(wisdomSearch.toLowerCase()) ||
      w.translation.toLowerCase().includes(wisdomSearch.toLowerCase());
    const matchesCat = wisdomFilter === 'ALL' || w.category === wisdomFilter;
    return matchesSearch && matchesCat;
  });

  const celebrationPresets: Array<{ type: CelebrationEventType; title: string; subtitle: string; icon: string }> = [
    { type: 'SAVE_SUCCESS', title: 'Simpan Data Berhasil', subtitle: 'Penyimpanan formulir & nilai tuntas', icon: '💾' },
    { type: 'TAHFIDZ_MILESTONE', title: 'Capaian Prestasi Tahfidz', subtitle: 'Santri menyelesaikan hafalan juz / surat', icon: '👑' },
    { type: 'ATTENDANCE_COMPLETE', title: 'Presensi Harian Lengkap', subtitle: 'Verifikasi kehadiran kelas selesai', icon: '📋' },
    { type: 'PPDB_COMPLETE', title: 'Registrasi PPDB Tuntas', subtitle: 'Santri baru tervalidasi di sistem', icon: '🎓' },
    { type: 'EXCELLENCE_MILESTONE', title: 'Pencapaian Mutu Madrasah', subtitle: 'Audit tata kelola tanpa anomali', icon: '⭐' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-emerald-950 via-slate-900 to-teal-950 border-2 border-emerald-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
                TADE SPRINT RC97
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                MANIFEST v7.5.0-RC97
              </span>
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-mono font-bold">
                DISC-791 – DISC-800
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>RC97 — Asy Emotional Intelligence & Contextual Life</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-3xl leading-relaxed">
              Pusat komando orkestrasi kecerdasan emosional, siklus hidup santri cilik, gerak kontekstual aman, bank mutiara hikmah islami lokal, dan mode hening produktif.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 bg-slate-900/90 border border-emerald-600/60 rounded-2xl text-center shadow-lg">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Status Emosi</p>
              <p className="text-sm font-black text-emerald-400 mt-0.5">{emotionState.currentEmotion}</p>
            </div>
            <div className="px-4 py-3 bg-slate-900/90 border border-amber-600/60 rounded-2xl text-center shadow-lg">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Waktu Asy</p>
              <p className="text-sm font-black text-amber-400 mt-0.5">{scheduleStatus.period}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'DASHBOARD'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Emotion Dashboard (R799)</span>
          </button>

          <button
            onClick={() => setActiveTab('EMOTION')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'EMOTION'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Emotional State Engine (R791)</span>
          </button>

          <button
            onClick={() => setActiveTab('SCHEDULE')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'SCHEDULE'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Living Schedule Engine (R792)</span>
          </button>

          <button
            onClick={() => setActiveTab('MOVEMENT')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'MOVEMENT'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Context Movement (R793)</span>
          </button>

          <button
            onClick={() => setActiveTab('WISDOM')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'WISDOM'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Islamic Wisdom (R794)</span>
          </button>

          <button
            onClick={() => setActiveTab('CELEBRATION')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'CELEBRATION'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celebration Engine (R795)</span>
          </button>

          <button
            onClick={() => setActiveTab('QUIET_MODE')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'QUIET_MODE'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>Quiet Presence Mode (R798)</span>
          </button>
        </div>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'DASHBOARD' && <CompanionEmotionDashboard />}

      {activeTab === 'EMOTION' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-white">
          <div>
            <h2 className="text-lg font-black flex items-center gap-2">
              <Smile className="w-5 h-5 text-emerald-400" />
              <span>R791 — Emotional State Engine Management</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              7 status emosi murni deterministik berdasarkan interaksi UI pengguna tanpa ketergantungan model generatif eksternal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Katalog Status Emosi Asy</h3>
              <div className="space-y-2">
                {[
                  { name: 'HAPPY', color: 'emerald', desc: 'Respon positif standar saat aplikasi berjalan normal dan lancar.' },
                  { name: 'CURIOUS', color: 'teal', desc: 'Muncul saat pengguna membuka modul baru atau mencari data.' },
                  { name: 'THINKING', color: 'blue', desc: 'Muncul saat proses perhitungan audit atau sinkronisasi berlangsung.' },
                  { name: 'PROUD', color: 'amber', desc: 'Muncul saat simpan data tuntas, absensi penuh, atau prestasi tahfidz.' },
                  { name: 'SHY', color: 'rose', desc: 'Respon sopan santun saat dipuji atau saat pengguna mengklik salam.' },
                  { name: 'SLEEPY', color: 'indigo', desc: 'Waktu malam (setelah 21:00) atau saat rehat kerja hening.' },
                  { name: 'PRAYING', color: 'purple', desc: 'Saat membuka bank doa harian, adab santri, atau waktu adzan.' }
                ].map(item => (
                  <div key={item.name} className="p-3 bg-slate-800/60 border border-slate-700/80 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-white">{item.name}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => EmotionalStateEngine.getInstance().setEmotion(item.name as AsyEmotionType, 'WARROOM_TEST', { durationMs: 8000 })}
                      className="px-3 py-1 bg-slate-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Uji Emosi
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Log Riwayat Emosi Terkini</h3>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 max-h-96 overflow-y-auto font-mono text-xs">
                {EmotionalStateEngine.getInstance().getHistory().length === 0 ? (
                  <p className="text-slate-500 italic">Belum ada riwayat transisi emosi.</p>
                ) : (
                  EmotionalStateEngine.getInstance().getHistory().map(h => (
                    <div key={h.id} className="p-2 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-emerald-400 font-bold">{h.emotion}</span>
                        <span className="text-slate-400 ml-2 text-[10px]">({h.trigger})</span>
                      </div>
                      <span className="text-slate-500 text-[10px]">{h.timestamp}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SCHEDULE' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>R792 — Living Schedule Engine</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Jadwal harian alami santri cilik yang sinkron dengan jam lokal tanpa repitisi monoton.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => LivingScheduleEngine.getInstance().setSimulatedHour(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Jam Nyata
              </button>
            </div>
          </div>

          {/* Time of Day Simulation Bar */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
              Simulasi Periode Waktu Harian
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { period: 'MORNING' as TimePeriod, label: 'Pagi (07:00)', hour: 7 },
                { period: 'MIDDAY' as TimePeriod, label: 'Siang (12:00)', hour: 12 },
                { period: 'AFTERNOON' as TimePeriod, label: 'Sore (15:00)', hour: 15 },
                { period: 'EVENING' as TimePeriod, label: 'Petang (19:00)', hour: 19 },
                { period: 'NIGHT' as TimePeriod, label: 'Malam (22:00)', hour: 22 }
              ].map(t => (
                <button
                  key={t.period}
                  onClick={() => LivingScheduleEngine.getInstance().setSimulatedHour(t.hour)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    scheduleStatus.period === t.period
                      ? 'bg-amber-950 text-amber-200 border-amber-500 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Current Activity Details */}
          <div className="p-6 bg-linear-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-700/60 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Aktivitas Aktif Saat Ini</span>
              <span className="text-xs font-mono text-slate-400">{scheduleStatus.periodName}</span>
            </div>
            <h3 className="text-xl font-black text-white">{scheduleStatus.activeActivity.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{scheduleStatus.activeActivity.description}</p>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-amber-200/90 italic">
              "{scheduleStatus.activeActivity.dialogueSnippet}"
            </div>
          </div>
        </div>
      )}

      {activeTab === 'MOVEMENT' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-white">
          <div>
            <h2 className="text-lg font-black flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-400" />
              <span>R793 — Context Movement Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Pergerakan kontekstual di safe bounding area tanpa menutupi input formulir kerja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { mode: 'DOCK_NORMAL' as MascotMovementMode, title: 'Dock Standar', desc: 'Menetap di pojok kanan bawah' },
              { mode: 'PEEK' as MascotMovementMode, title: 'Mengintip (Peek)', desc: 'Menoleh ramah dari tepi samping' },
              { mode: 'CARD_SIT' as MascotMovementMode, title: 'Duduk di Card', desc: 'Duduk riang di tepi panel formulir' },
              { mode: 'BELL_RUN' as MascotMovementMode, title: 'Hampiri Lonceng', desc: 'Melangkah ke arah notifikasi baru' },
              { mode: 'POINTER_GUIDE' as MascotMovementMode, title: 'Pandu Tombol', desc: 'Mengarahkan gestur ke tombol simpan' }
            ].map(m => (
              <div key={m.mode} className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl space-y-2 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{m.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                </div>
                <button
                  onClick={() => ContextMovementEngine.getInstance().triggerMovement(m.mode, { durationMs: 7000 })}
                  className="mt-3 w-full py-2 bg-teal-900/60 hover:bg-teal-800 text-teal-200 border border-teal-700/80 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" /> Uji Gerak
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'WISDOM' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>R794 — Islamic Wisdom Engine (Bank Konten Lokal)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Koleksi terkurasi doa harian, adab santri preschool, dan mutiara motivasi islami 100% lokal terverifikasi.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari doa & adab..."
                  value={wisdomSearch}
                  onChange={e => setWisdomSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wisdomList.map(item => (
              <div key={item.id} className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-300">{item.title}</h4>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold uppercase">
                    {item.category}
                  </span>
                </div>
                <p className="text-base font-serif text-right text-amber-200/90 py-1" dir="rtl">
                  {item.arabic}
                </p>
                <p className="text-xs font-mono text-emerald-200/90 italic">"{item.latin}"</p>
                <p className="text-[11px] text-slate-300 leading-relaxed">Artinya: {item.translation}</p>
                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                  <strong>Adab:</strong> {item.adabTips}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'CELEBRATION' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-white">
          <div>
            <h2 className="text-lg font-black flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>R795 — Celebration Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Partikel bintang lembut dan konfeti minimal zamrud/emas saat pencapaian operasional tuntas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {celebrationPresets.map(c => (
              <div key={c.type} className="p-5 bg-slate-800/60 border border-slate-700/80 rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <h4 className="text-sm font-bold text-white">{c.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{c.subtitle}</p>
                </div>
                <button
                  onClick={() => CelebrationEngine.getInstance().triggerCelebration(c.type)}
                  className="mt-3 w-full py-2.5 bg-linear-to-r from-emerald-800 to-amber-700 hover:from-emerald-700 hover:to-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Jalankan Perayaan</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'QUIET_MODE' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-white">
          <div>
            <h2 className="text-lg font-black flex items-center gap-2">
              <VolumeX className="w-5 h-5 text-amber-400" />
              <span>R798 — Quiet Presence Mode Management</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Mekanisme perlindungan fokus pengguna saat mengetik atau bekerja lama tanpa terganggu animasi dan dialog spontan.
            </p>
          </div>

          <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Status Mode Hening</span>
                <p className="text-sm font-bold text-white">
                  {quietState.isActive ? 'Mode Hening Sedang AKTIF' : 'Mode Hening NON-AKTIF (Standar)'}
                </p>
                <p className="text-xs text-slate-400">Alasan: {quietState.reason}</p>
              </div>
              <button
                onClick={() => QuietPresenceMode.getInstance().setManualQuietMode(!quietState.isActive)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  quietState.isActive
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {quietState.isActive ? 'Non-aktifkan Hening' : 'Aktifkan Mode Hening'}
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Bubble Spontan</span>
                <span className="font-bold text-white">{quietState.suppressSpontaneousBubbles ? 'Dibisukan (Suppressed)' : 'Diizinkan'}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Intensitas Animasi</span>
                <span className="font-bold text-white">{quietState.minimalAnimationMode ? 'Minimal (Micro-Breathing)' : 'Animasi Penuh Hidup'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
