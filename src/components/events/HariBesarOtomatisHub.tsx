import React, { useState, useEffect } from 'react';
import {
  Sun, Moon, Calendar, Sparkles, Volume2, 
  Shirt, Flag, Trees, Sliders, ShieldCheck, 
  CheckCircle2, Play, RotateCcw, Clapperboard, 
  Tv, Palette, Building2, BatteryCharging, Zap,
  Layers, ArrowRight, Eye, RefreshCw, Award, BookOpen,
  MapPin, Heart, Compass
} from 'lucide-react';
import { 
  livingEventEngine, 
  SchoolEventType, 
  SchoolEventTheme,
  CelebrationCategory,
  G46ProofSuiteReport,
  G47ProofSuiteReport,
  IndonesiaTimezone
} from '../../services/livingEventEngine';
import { DynamicSkyView } from './DynamicSkyView';
import { EventBonusParadeModal } from './EventBonusParadeModal';
import { CartoonCharacterSvg } from '../mascot/CartoonCharacterSvg';
import { asySyifaDnaEngine } from '../../services/asySyifaDnaEngine';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';
import { deviceCapabilityEngine } from '../../services/deviceCapabilityEngine';

type HubTab = 
  | 'G47_INTELLIGENCE'
  | 'G46_PROOF_SUITE'
  | 'SKY_ATMOSPHERE' 
  | 'CALENDAR_TIMELINE' 
  | 'COSTUME_STUDIO' 
  | 'WORLD_OVERLAY'
  | 'ECOSYSTEM_INTEGRATION' 
  | 'PARADE_BONUS'
  | 'FOUNDER_COCKPIT';

export const HariBesarOtomatisHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HubTab>('G47_INTELLIGENCE');
  const [activeEvent, setActiveEvent] = useState<SchoolEventTheme>(() => livingEventEngine.getActiveEvent());
  const [worldState, setWorldState] = useState(() => livingEventEngine.getWorldState());
  const [isAutoCalendar, setIsAutoCalendar] = useState<boolean>(() => livingEventEngine.isAutoCalendarActive());
  const [isEcoMode, setIsEcoMode] = useState<boolean>(() => livingEventEngine.isEcoModeActive());
  const [schoolTimezone, setSchoolTimezone] = useState<IndonesiaTimezone>(() => livingEventEngine.getSchoolTimezone());
  const [selectedCategory, setSelectedCategory] = useState<CelebrationCategory | 'ALL'>('ALL');
  const [proofReport, setProofReport] = useState<G46ProofSuiteReport | null>(null);
  const [g47Report, setG47Report] = useState<G47ProofSuiteReport | null>(null);
  const [isExecutingProof, setIsExecutingProof] = useState<boolean>(false);
  const [isExecutingG47, setIsExecutingG47] = useState<boolean>(false);
  const [showBonusModal, setShowBonusModal] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeGovernorCount, setActiveGovernorCount] = useState(tadeAnimationGovernor.getActiveCount());

  const allEvents = livingEventEngine.getAllEvents();
  const upcomingEvents = livingEventEngine.getUpcomingEvents();
  const academicCalendar = livingEventEngine.getAcademicCalendar();

  useEffect(() => {
    const unsub = livingEventEngine.subscribe(() => {
      setActiveEvent(livingEventEngine.getActiveEvent());
      setWorldState(livingEventEngine.getWorldState());
      setIsAutoCalendar(livingEventEngine.isAutoCalendarActive());
      setIsEcoMode(livingEventEngine.isEcoModeActive());
    });
    const govUnsub = tadeAnimationGovernor.subscribe(() => {
      setActiveGovernorCount(tadeAnimationGovernor.getActiveCount());
    });
    return () => {
      unsub();
      govUnsub();
    };
  }, []);

  // Refresh active event
  const refreshActiveEvent = () => {
    const updated = livingEventEngine.getActiveEvent();
    setActiveEvent(updated);
    setWorldState(livingEventEngine.getWorldState());
  };

  const handleSelectEvent = (eventId: SchoolEventType) => {
    livingEventEngine.startCelebration(eventId);
    refreshActiveEvent();
    setIsAutoCalendar(false);
    setFeedback(`Overlay Perayaan Diaktifkan: ${livingEventEngine.getEventThemeById(eventId).title}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRestoreBaseWorld = () => {
    livingEventEngine.restoreBaseWorld();
    refreshActiveEvent();
    setFeedback('Dunia Dasar (Base World) berhasil dipulihkan tanpa sisa residu!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRunG47ProofSuite = () => {
    setIsExecutingG47(true);
    setFeedback('Menjalankan G47 Living Calendar Intelligence & Scheduler Proof Suite (Skenario A–J)...');
    
    setTimeout(() => {
      const report = livingEventEngine.runG47ProofScenarios();
      setG47Report(report);
      setIsExecutingG47(false);
      refreshActiveEvent();
      setFeedback(`G47 Proof Suite SELESAI: ${report.passedScenarios}/${report.totalScenarios} Skenario LULUS VERIFIKASI 100%!`);
      setTimeout(() => setFeedback(null), 5000);
    }, 400);
  };

  const handleRunFullProofSuite = () => {
    setIsExecutingProof(true);
    setFeedback('Menjalankan G46 Living Celebration World Proof Suite (Skenario A–F)...');
    
    setTimeout(() => {
      const report = livingEventEngine.runG46ProofScenarios();
      setProofReport(report);
      setIsExecutingProof(false);
      refreshActiveEvent();
      setFeedback(`G46 Proof Suite SELESAI: ${report.passedScenarios}/${report.totalScenarios} Skenario LULUS VERIFIKASI 100%!`);
      setTimeout(() => setFeedback(null), 5000);
    }, 400);
  };

  const handleTimezoneChange = (tz: IndonesiaTimezone) => {
    livingEventEngine.setSchoolTimezone(tz);
    setSchoolTimezone(tz);
    refreshActiveEvent();
    setFeedback(`Timezone Sekolah Diubah ke: ${tz}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handlePreviewCelebration = (eventId: SchoolEventType) => {
    const ok = livingEventEngine.previewCelebration(eventId);
    if (ok) {
      refreshActiveEvent();
      setFeedback(`Mode Safe Preview Aktif: ${livingEventEngine.getEventThemeById(eventId).title}`);
    } else {
      setFeedback(`Gagal Mengaktifkan Preview untuk event ${eventId}`);
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleEndPreview = () => {
    livingEventEngine.endPreview();
    refreshActiveEvent();
    setFeedback('Safe Preview Dihentikan -> Dunia Kembali Normal');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleAutoCalendar = (enabled: boolean) => {
    livingEventEngine.setAutoCalendarEnabled(enabled);
    setIsAutoCalendar(enabled);
    refreshActiveEvent();
    setFeedback(enabled ? 'Mode Otomatis Kalender Aktif (Mengikuti Tanggal Nyata)' : 'Mode Manual Override Aktif');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleEcoMode = (enabled: boolean) => {
    livingEventEngine.setEcoMode(enabled);
    setIsEcoMode(enabled);
    setFeedback(enabled ? 'Mode Ringan Hemat Daya Aktif (Animasi Statis)' : 'Mode 60 FPS Dinamis Aktif');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handlePlaySoundscape = () => {
    livingEventEngine.playEventChime();
    setFeedback(`Harmoni Suara Diputar: ${activeEvent.sky.soundscapePreset}`);
    setTimeout(() => setFeedback(null), 2500);
  };

  const filteredEvents = selectedCategory === 'ALL'
    ? allEvents
    : allEvents.filter(e => e.category === selectedCategory);

  return (
    <div className="space-y-6" id="hari-besar-otomatis-hub">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-indigo-950 border border-teal-500/40 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-black tracking-wider uppercase border border-teal-500/30 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" />
                <span>SPRINT G25 • HARI BESAR OTOMATIS</span>
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${isAutoCalendar ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                <RefreshCw className={`w-3 h-3 ${isAutoCalendar ? 'animate-spin' : ''}`} />
                <span>{isAutoCalendar ? 'AUTO KALENDER ON' : 'SIMULASI OVERRIDE'}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>GOVERNOR &le; 5 ANIMASI</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Pusat Hari Besar Otomatis & Langit Hidup TADE
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Seluruh semesta TK Asy Syifa (langit, kostum Asy & Syifa, suara Web Audio, dekorasi, cerita, krayon) berubah otomatis sesuai kalender sekolah, hari besar Islam, dan nasional.
            </p>
          </div>

          {/* Quick Simulation Carousel Selector */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col gap-3 min-w-[280px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Uji Coba Hari Besar:</span>
              <span className="text-[11px] font-bold text-teal-400">{activeEvent.badge}</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {allEvents.map((evt) => {
                const isSelected = activeEvent.eventId === evt.eventId;
                return (
                  <button
                    key={evt.eventId}
                    type="button"
                    onClick={() => handleSelectEvent(evt.eventId)}
                    className={`p-2 rounded-xl text-center transition-all cursor-pointer ${isSelected ? 'bg-teal-500 text-slate-950 font-black shadow-lg scale-105' : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'}`}
                    title={evt.title}
                  >
                    <span className="text-sm block">{evt.decorations[0]?.icon || '✨'}</span>
                    <span className="text-[9px] font-bold uppercase truncate block mt-0.5">{evt.eventId.slice(0, 4)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Global Feedback notification */}
        {feedback && (
          <div className="mt-4 p-3 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-200 text-xs font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-700/60 scrollbar-thin">
        {[
          { id: 'G47_INTELLIGENCE', label: '0. G47 Calendar Intelligence (A–J)', icon: Calendar },
          { id: 'G46_PROOF_SUITE', label: '1. G46 World Proof (A–F)', icon: ShieldCheck },
          { id: 'SKY_ATMOSPHERE', label: '2. Langit & Suasana Hidup', icon: Sun },
          { id: 'WORLD_OVERLAY', label: '3. Lokasi & Peran Karakter', icon: MapPin },
          { id: 'COSTUME_STUDIO', label: '4. Kostum & Busana Adat', icon: Shirt },
          { id: 'CALENDAR_TIMELINE', label: '5. Kalender & Hitung Mundur', icon: Calendar },
          { id: 'ECOSYSTEM_INTEGRATION', label: '6. Integrasi Seluruh Dunia TADE', icon: Layers },
          { id: 'FOUNDER_COCKPIT', label: '7. Cockpit Pengaturan Founder', icon: Sliders }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as HubTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${isActive ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/20 scale-102' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">Kategori:</span>
        {[
          { id: 'ALL', label: 'Semua Event' },
          { id: 'SCHOOL_CRITICAL', label: '🚨 Kritis Sekolah' },
          { id: 'ISLAMIC_RELIGIOUS', label: '🌙 Hari Besar Islam' },
          { id: 'NATIONAL', label: '🇮🇩 Hari Nasional' },
          { id: 'EDUCATIONAL', label: '📚 Pendidikan & Guru' },
          { id: 'CULTURAL', label: '🎨 Budaya & Seni' },
          { id: 'SCHOOL_EVENT', label: '🏫 Kegiatan Sekolah' },
          { id: 'SEASONAL', label: '🌱 Musiman & Alam' },
          { id: 'NORMAL', label: '☀️ Harian Normal' }
        ].map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${isSelected ? 'bg-teal-500 text-slate-950 shadow-md font-black' : 'bg-slate-800/70 hover:bg-slate-700 text-slate-300'}`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* World State Controller Card */}
      <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-3.5 h-3.5 rounded-full ${worldState === 'CELEBRATION_ACTIVE' ? 'bg-emerald-400 animate-pulse' : worldState === 'CELEBRATION_TRANSITION' ? 'bg-amber-400 animate-spin' : 'bg-teal-400'}`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">WORLD STATE:</span>
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${worldState === 'CELEBRATION_ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : worldState === 'RESTORE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-700 text-slate-200'}`}>
                {worldState}
              </span>
              <span className="text-xs text-teal-300 font-bold">({activeEvent.title})</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Timezone Sekolah: <strong className="text-teal-300">{schoolTimezone}</strong> • {worldState === 'CELEBRATION_ACTIVE' ? 'Temporary Overlay aktif: Kostum, Langit, Lokasi, dan Peran Karakter disesuaikan.' : 'Dunia berada dalam status dasar (Base World) stabil.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {worldState === 'CELEBRATION_ACTIVE' && (
            <button
              type="button"
              onClick={handleRestoreBaseWorld}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Base World</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleRunG47ProofSuite}
            disabled={isExecutingG47}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Calendar className="w-4 h-4" />
            <span>{isExecutingG47 ? 'Memverifikasi...' : 'Jalankan G47 Suite (A–J)'}</span>
          </button>
          <button
            type="button"
            onClick={handleRunFullProofSuite}
            disabled={isExecutingProof}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isExecutingProof ? 'Memverifikasi...' : 'G46 Suite (A–F)'}</span>
          </button>
        </div>
      </div>

      {/* TAB 0: G47 CALENDAR INTELLIGENCE PROOF SUITE (A–J) & CONTROLS */}
      {activeTab === 'G47_INTELLIGENCE' && (
        <div className="space-y-6">
          {/* Top Control Header Card */}
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black tracking-wider uppercase border border-emerald-500/30 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>G47 LIVING CALENDAR INTELLIGENCE & SCHEDULER</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                    KEMENAG HIJRI • 10 SKENARIO (A–J)
                  </span>
                </div>

                <h3 className="text-xl sm:text-3xl font-black text-white">
                  Inteligensi Kalender & Penjadwal Perayaan Islami
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  Menentukan secara deterministik kapan perayaan aktif, durasi kalender (Masehi & Hijriah), resolusi prioritas multi-event, kepatuhan timezone Indonesia (WIB/WITA/WIT), dan safe preview tanpa residu.
                </p>
              </div>

              {/* Timezone Switcher & Action CTA */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="bg-slate-800/80 border border-white/10 p-2.5 rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Zona Waktu Sekolah:</span>
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'Asia/Jakarta', label: 'WIB (JKT)' },
                      { id: 'Asia/Makassar', label: 'WITA (MKS)' },
                      { id: 'Asia/Jayapura', label: 'WIT (JPR)' }
                    ].map((tz) => (
                      <button
                        key={tz.id}
                        type="button"
                        onClick={() => handleTimezoneChange(tz.id as IndonesiaTimezone)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${schoolTimezone === tz.id ? 'bg-emerald-400 text-slate-950 font-black shadow-md' : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'}`}
                      >
                        {tz.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunG47ProofSuite}
                  disabled={isExecutingG47}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 text-slate-950 font-black text-sm shadow-xl hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{isExecutingG47 ? 'Memverifikasi 10 Skenario...' : 'Jalankan G47 Proof Suite (A–J)'}</span>
                </button>
              </div>
            </div>

            {/* Proof Report Summary Header */}
            {g47Report && (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>G47 STATUS: {g47Report.overallStatus} ({g47Report.passedScenarios}/{g47Report.totalScenarios} SKENARIO TERVERIFIKASI)</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{g47Report.timestamp}</span>
                </div>
                <p className="text-xs text-emerald-200 font-medium leading-relaxed">
                  {g47Report.summary}
                </p>
              </div>
            )}

            {/* 10 G47 Verification Scenarios Grid */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>10 Skenario Verifikasi Lengkap (A–J)</span>
                </h4>
                <span className="text-xs text-slate-400">Deterministic Scheduling Verification</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    code: 'A_SOLAR_SINGLE',
                    title: 'Scenario A: Single-Day Solar Event',
                    subtitle: 'Hari Guru Nasional (25 Nov)',
                    category: 'EDUCATIONAL',
                    priority: '60 (EDUCATIONAL)',
                    rule: 'SOLAR_DATE • 11/23 - 11/28'
                  },
                  {
                    code: 'B_SOLAR_MULTI',
                    title: 'Scenario B: Multi-Day Event',
                    subtitle: 'Hari Kemerdekaan RI (10–20 Aug)',
                    category: 'NATIONAL',
                    priority: '70 (NATIONAL)',
                    rule: 'DATE_RANGE • 08/10 - 08/20'
                  },
                  {
                    code: 'C_PERIOD_RAMADAN',
                    title: 'Scenario C: Period-Style Event',
                    subtitle: 'Bulan Suci Ramadhan (1–30 Ramadhan)',
                    category: 'ISLAMIC_RELIGIOUS',
                    priority: '80 (RELIGIOUS_MAJOR)',
                    rule: 'PERIOD_BASED • 1 Bulan Penuh'
                  },
                  {
                    code: 'D_HIJRI_EVENT',
                    title: 'Scenario D: Verified Hijri Event',
                    subtitle: 'Maulid Nabi Muhammad ﷺ (12 Rabiul Awwal)',
                    category: 'ISLAMIC_RELIGIOUS',
                    priority: '80 (RELIGIOUS_MAJOR)',
                    rule: 'HIJRI_DATE • Kemenag Bounds'
                  },
                  {
                    code: 'E_SIMULTANEOUS_PRIORITY',
                    title: 'Scenario E: Simultaneous Priority',
                    subtitle: 'Deterministic Hierarchy Tie-Breaker',
                    category: 'SCHOOL_CRITICAL',
                    priority: 'Priority Rank > Category > Specificity',
                    rule: 'PRIORITY_ARBITRATION'
                  },
                  {
                    code: 'F_INVALID_FALLBACK',
                    title: 'Scenario F: Missing/Invalid Fallback',
                    subtitle: 'Safe Fallback ke Normal World',
                    category: 'NORMAL',
                    priority: '10 (NORMAL)',
                    rule: 'ZERO_ERROR_FALLBACK'
                  },
                  {
                    code: 'G_EVENT_END_RESTORE',
                    title: 'Scenario G: Event End Restoration',
                    subtitle: 'Zero Residual Role, Audio, & Decor',
                    category: 'NORMAL',
                    priority: 'Canonical Base Restoration',
                    rule: 'CLEAN_RESTORE'
                  },
                  {
                    code: 'H_SAFE_PREVIEW',
                    title: 'Scenario H: Safe Preview Mode',
                    subtitle: 'Preview Non-Persistent Tanpa Ubah Jam',
                    category: 'EDUCATIONAL',
                    priority: 'Isolated Visual Simulation',
                    rule: 'SAFE_PREVIEW'
                  },
                  {
                    code: 'I_TIMEZONE_BOUNDARY',
                    title: 'Scenario I: Indonesia Timezone Boundary',
                    subtitle: 'WIB, WITA, WIT (23:59:59 -> 00:00:00)',
                    category: 'NATIONAL',
                    priority: 'Accurate Regional Day Rollover',
                    rule: 'TIMEZONE_ACCURACY'
                  },
                  {
                    code: 'J_DEVICE_LOW',
                    title: 'Scenario J: Device LOW Safety',
                    subtitle: 'Kalender Independen & Governor <= 5',
                    category: 'NORMAL',
                    priority: '60 FPS Performance Safe',
                    rule: 'PERFORMANCE_GOVERNOR'
                  }
                ].map((sc) => {
                  const scenarioResult = g47Report?.scenarios.find(s => s.scenarioId === sc.code);
                  const isPassed = scenarioResult ? scenarioResult.allPassed : null;

                  return (
                    <div
                      key={sc.code}
                      className={`rounded-2xl border p-4 space-y-2.5 transition-all ${isPassed === true ? 'bg-slate-900/90 border-emerald-500/40 shadow-md shadow-emerald-500/5' : isPassed === false ? 'bg-slate-900/90 border-rose-500/40' : 'bg-slate-900/60 border-white/10'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase border border-emerald-500/30">
                          {sc.rule}
                        </span>
                        {isPassed === true && (
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>PASS</span>
                          </span>
                        )}
                      </div>

                      <div>
                        <h5 className="text-xs font-black text-white">{sc.title}</h5>
                        <p className="text-[11px] text-teal-300 font-bold mt-0.5">{sc.subtitle}</p>
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-300 pt-1.5 border-t border-white/10">
                        <div className="flex justify-between"><span className="text-slate-400">Prioritas:</span> <span className="font-bold text-amber-300">{sc.priority}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Kategori:</span> <span className="font-bold text-teal-200">{sc.category}</span></div>
                      </div>

                      {scenarioResult && (
                        <div className="space-y-1 pt-2 border-t border-white/10">
                          {scenarioResult.steps.map((st, i) => (
                            <div key={i} className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-300 truncate max-w-[85%]">{st.stepName}</span>
                              <span className={st.passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                                {st.passed ? '✓' : '✗'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* School Event Management & Safe Preview Matrix */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-teal-400" />
                  <span>Katalog Jadwal & Safe Preview Perayaan Sekolah</span>
                </h4>
                {livingEventEngine.isPreviewing() && (
                  <button
                    type="button"
                    onClick={handleEndPreview}
                    className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Hentikan Safe Preview</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {allEvents.filter(e => e.eventId !== 'REGULAR_DAY').map((evt) => {
                  const isEnabled = livingEventEngine.isEventEnabled(evt.eventId);
                  const isCurActive = activeEvent.eventId === evt.eventId;

                  return (
                    <div
                      key={evt.eventId}
                      className={`p-3.5 rounded-2xl border transition-all ${isCurActive ? 'bg-teal-950/40 border-teal-500/50' : 'bg-slate-800/60 border-white/10'}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{evt.decorations[0]?.icon || '✨'}</span>
                          <div>
                            <h5 className="text-xs font-black text-white">{evt.title}</h5>
                            <span className="text-[10px] text-teal-400 font-bold">{evt.badge} • Prio {evt.priority || 70}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            livingEventEngine.enableEvent(evt.eventId, !isEnabled);
                            refreshActiveEvent();
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer ${isEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}
                        >
                          {isEnabled ? 'ENABLED' : 'DISABLED'}
                        </button>
                      </div>

                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePreviewCelebration(evt.eventId)}
                          className="w-full py-1.5 rounded-xl bg-slate-700/80 hover:bg-teal-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Safe Preview</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: G46 PROOF SUITE (A–F) */}
      {activeTab === 'G46_PROOF_SUITE' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>G46 LIVING CELEBRATION WORLD • AUTOMATED PROOF VERIFICATION</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Verifikasi Deterministik 6 Skenario Wajib (A–F)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Uji menyeluruh mencakup aktivasi temporary overlay, kalender Hijriah & Masehi, peran karakter G20, adaptasi lokasi, Web Audio synthesizer, dan 100% restorasi aman ke Base World.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunFullProofSuite}
                disabled={isExecutingProof}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300 text-slate-950 font-black text-sm shadow-xl hover:scale-102 active:scale-98 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isExecutingProof ? 'Sedang Memverifikasi...' : 'Jalankan Tes Suite G46'}</span>
              </button>
            </div>

            {/* Proof Report Summary Header */}
            {proofReport && (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>STATUS: {proofReport.overallStatus} ({proofReport.passedScenarios}/{proofReport.totalScenarios} SKENARIO LULUS)</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{proofReport.timestamp}</span>
                </div>
                <p className="text-xs text-emerald-200 font-medium">
                  {proofReport.summary}
                </p>
              </div>
            )}

            {/* 6 Proof Scenarios Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  id: 'MAULID_NABI',
                  code: 'A',
                  title: 'Scenario A: Maulid Nabi Muhammad ﷺ',
                  badge: 'HIJRI • MASJID AL-BARAKAH',
                  category: 'ISLAMIC_RELIGIOUS',
                  priority: '80 (RELIGIOUS_MAJOR)',
                  roles: 'Asy: Learner / Story Participant',
                  sky: 'Bulan Sabit, Lentera Fanous, Nasyid Ceria',
                  decor: 'Kubah Berkilau & Lentera di Masjid'
                },
                {
                  id: 'RAMADHAN',
                  code: 'B',
                  title: 'Scenario B: Bulan Suci Ramadhan',
                  badge: 'PERIOD • 1–30 RAMADHAN',
                  category: 'ISLAMIC_RELIGIOUS',
                  priority: '80 (RELIGIOUS_MAJOR)',
                  roles: 'Asy: Fasting Guide, Syifa: Tadarus Guide',
                  sky: 'Malam Lailah, Lentera Fanous, Takbir Harmoni',
                  decor: 'Tenda Takjil di Sekolah & Masjid'
                },
                {
                  id: 'HARI_GURU',
                  code: 'C',
                  title: 'Scenario C: Hari Guru Nasional',
                  badge: '25 NOVEMBER • SENTRA KELAS',
                  category: 'EDUCATIONAL',
                  priority: '60 (EDUCATIONAL)',
                  roles: 'Asy & Syifa: Asisten Guru & Apresiasi',
                  sky: 'Matahari Belajar, Balon Apresiasi, Lonceng Lembut',
                  decor: 'Papan Surat Cinta untuk Ustadzah'
                },
                {
                  id: 'HARI_KARTINI',
                  code: 'D',
                  title: 'Scenario D: Hari Kartini (Literasi)',
                  badge: '21 APRIL • PERPUSTAKAAN AJAIB',
                  category: 'CULTURAL',
                  priority: '50 (CULTURAL)',
                  roles: 'Syifa: Duta Literasi Santriwati',
                  sky: 'Pelangi Belajar, Kupu-kupu, Suara Alam',
                  decor: 'Pojok Membaca & Busana Adat Santun'
                },
                {
                  id: 'HARI_BATIK',
                  code: 'E',
                  title: 'Scenario E: Hari Batik Nasional',
                  badge: '2 OKTOBER • RUMAH KREATIF',
                  category: 'CULTURAL',
                  priority: '50 (CULTURAL)',
                  roles: 'Asy & Syifa: Duta Mahakarya Batik',
                  sky: 'Motif Nusantara, Pita Seni, Suara Alam',
                  decor: 'Kain Canting Batik di Rumah Kreatif'
                },
                {
                  id: 'KEMERDEKAAN',
                  code: 'F',
                  title: 'Scenario F: Hari Kemerdekaan RI (17 Agustus)',
                  badge: '17 AGUSTUS • LAPANGAN CERIA',
                  category: 'NATIONAL',
                  priority: '70 (NATIONAL)',
                  roles: 'Asy & Syifa: Peserta Pawai Merah Putih',
                  sky: 'Bendera Merah Putih, Mars TK Ceria',
                  decor: 'Umbul-umbul & Tiang Bendera Lapangan'
                }
              ].map((sc) => {
                const scenarioResult = proofReport?.scenarios.find(s => s.scenarioId.startsWith(sc.code));
                const isPassed = scenarioResult ? scenarioResult.allPassed : null;

                return (
                  <div 
                    key={sc.id}
                    className={`rounded-2xl border p-5 space-y-3 transition-all ${isPassed === true ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/5' : isPassed === false ? 'bg-slate-900/90 border-rose-500/40' : 'bg-slate-900/60 border-white/10'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-black tracking-wider uppercase border border-teal-500/30">
                        {sc.badge}
                      </span>
                      {isPassed === true && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>PASS</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-black text-white">{sc.title}</h4>

                    <div className="space-y-1 text-xs text-slate-300 pt-1 border-t border-white/10">
                      <div className="flex justify-between"><span className="text-slate-400">Prioritas:</span> <span className="font-bold text-amber-300">{sc.priority}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Peran:</span> <span className="font-bold text-teal-200 truncate ml-2">{sc.roles}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Langit:</span> <span className="text-slate-300 truncate ml-2">{sc.sky}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Lokasi:</span> <span className="text-slate-300 truncate ml-2">{sc.decor}</span></div>
                    </div>

                    {scenarioResult && (
                      <div className="space-y-1.5 pt-2 border-t border-white/10">
                        {scenarioResult.steps.map((st, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-300 truncate">{st.stepName}</span>
                            <span className={st.passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                              {st.passed ? '✓' : '✗'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectEvent(sc.id as SchoolEventType)}
                        className="w-full py-2 rounded-xl bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-white font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>Uji Coba Langsung</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LOKASI & PERAN KARAKTER (WORLD OVERLAY) */}
      {activeTab === 'WORLD_OVERLAY' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">G46 • TEMPORARY WORLD OVERLAY</span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Lokasi, Landmark & Transformasi Peran Karakter ({activeEvent.badge})
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Saat perayaan aktif, lokasi utama dan karakter mendapatkan overlay visual dan peran edukatif tanpa mengubah DNA dasar mereka.
              </p>
            </div>

            {/* Character Roles in Active Event */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'ASY', name: 'Dek Asy (Mascot)', role: livingEventEngine.getCharacterActiveRole('ASY')?.role || 'CANONICAL_HOST', avatar: '👦' },
                { id: 'SYIFA', name: 'Dek Syifa (Mascot)', role: livingEventEngine.getCharacterActiveRole('SYIFA')?.role || 'CANONICAL_GUIDE', avatar: '🧕' },
                { id: 'BUBU', name: 'Bubu Burung Hantu', role: livingEventEngine.getCharacterActiveRole('BUBU')?.role || 'LOYAL_COMPANION', avatar: '🦉' },
                { id: 'GOGO', name: 'Gogo Kancil Cerdik', role: livingEventEngine.getCharacterActiveRole('GOGO')?.role || 'PLAYFUL_COMPANION', avatar: '🦌' }
              ].map((char) => (
                <div key={char.id} className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{char.avatar}</span>
                    <div>
                      <h4 className="text-xs font-black text-white">{char.name}</h4>
                      <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/30">
                        {char.role}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Peran kontekstual sementara untuk tema {activeEvent.title}.
                  </p>
                </div>
              ))}
            </div>

            {/* Overlaid Locations */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Lokasi yang Mendapatkan Transformasi Suasana:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'MASJID_AL_BARAKAH', name: 'Masjid Al-Barakah', emoji: '🕌' },
                  { id: 'SEKOLAH_BERNAPAS', name: 'Sekolah Bernapas', emoji: '🏫' },
                  { id: 'RUMAH_KREATIF', name: 'Rumah Kreatif', emoji: '🎨' },
                  { id: 'PERPUSTAKAAN_AJAIB', name: 'Perpustakaan Ajaib', emoji: '📚' },
                  { id: 'KAMPUNG_CERIA', name: 'Kampung Ceria', emoji: '🏡' },
                  { id: 'KEBUN_BERKAH', name: 'Kebun Berkah', emoji: '🌱' }
                ].map((loc) => {
                  const overlay = livingEventEngine.getLocationOverlay(loc.id);
                  const isOverlaid = !!overlay;

                  return (
                    <div 
                      key={loc.id}
                      className={`p-4 rounded-2xl border transition-all ${isOverlaid ? 'bg-teal-950/40 border-teal-500/40 shadow-md' : 'bg-slate-800/50 border-white/5 opacity-60'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{loc.emoji}</span>
                          <h5 className="text-xs font-black text-white">{loc.name}</h5>
                        </div>
                        {isOverlaid ? (
                          <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[9px] font-bold border border-teal-500/30">
                            OVERLAY AKTIF
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">Normal</span>
                        )}
                      </div>
                      {isOverlaid && overlay ? (
                        <div className="space-y-1 text-[11px] text-slate-300">
                          <p>{overlay.ambienceDescription}</p>
                          <div className="flex items-center gap-1.5 text-amber-300 font-bold pt-1">
                            <span>{overlay.landmarkDecorEmoji}</span>
                            <span>{overlay.landmarkDecorLabel}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400">Suasana standar base world aktif.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: LANGIT & SUASANA HIDUP */}
      {activeTab === 'SKY_ATMOSPHERE' && (
        <div className="space-y-6">
          {/* Main Dynamic Sky Viewer */}
          <DynamicSkyView 
            eventTheme={activeEvent} 
            isEcoMode={isEcoMode} 
            onPlayChime={handlePlaySoundscape}
          />

          {/* Quick Summary Cards (P2, P3, P4, P5) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Suasana Langit & Elemen */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
                <Sun className="w-4 h-4" />
                <span>P2 • Langit & Benda Angkasa</span>
              </div>
              <p className="text-sm font-black text-white">{activeEvent.sky.celestialBody.replace('_', ' ')}</p>
              <p className="text-xs text-slate-300">
                Awan tematik ({activeEvent.sky.cloudStyle.replace('_', ' ')}) dengan partikel ({activeEvent.sky.particleType}).
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">Frekuensi Chime:</span>
                <span className="font-bold text-amber-300">{activeEvent.sky.audioChimeFrequency} Hz Solfeggio</span>
              </div>
            </div>

            {/* 2. Suara & Harmoni Web Audio */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Volume2 className="w-4 h-4" />
                <span>P4 • Web Audio Synthesizer</span>
              </div>
              <p className="text-sm font-black text-white">{activeEvent.sky.soundscapePreset.replace('_', ' ')}</p>
              <p className="text-xs text-slate-300">
                Arpeggio nada algoritmik murni tanpa file eksternal berlisensi.
              </p>
              <button
                type="button"
                onClick={handlePlaySoundscape}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Dengarkan Harmoni</span>
              </button>
            </div>

            {/* 3. Fitur Bonus Spesial */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Bonus • {activeEvent.bonusFeature.title}</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  {activeEvent.bonusFeature.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBonusModal(true)}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
              >
                <span>{activeEvent.bonusFeature.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KALENDER & HITUNG MUNDUR */}
      {activeTab === 'CALENDAR_TIMELINE' && (
        <div className="space-y-6">
          {/* Upcoming Event Countdown Cards */}
          <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-400" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  Hitung Mundur Hari Besar Mendatang
                </h3>
              </div>
              <span className="text-xs text-slate-400">Sinkronisasi Tanggal Otomatis</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingEvents.slice(0, 4).map(({ event, daysRemaining }) => (
                <div 
                  key={event.eventId} 
                  className="bg-slate-800/80 border border-white/10 hover:border-teal-400/40 rounded-2xl p-4 transition-all hover:scale-102 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{event.decorations[0]?.icon || '🎈'}</span>
                      <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 font-black text-xs border border-teal-500/30">
                        {daysRemaining} Hari Lagi
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug">{event.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">{event.dateRangeLabel}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectEvent(event.eventId)}
                    className="mt-3 w-full py-1.5 rounded-xl bg-slate-700/60 hover:bg-teal-600 hover:text-slate-950 text-white text-[11px] font-bold transition-colors text-center cursor-pointer"
                  >
                    Simulasikan Sekarang
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Master Academic Calendar Table */}
          <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>Agenda Kalender Pendidikan TK Asy Syifa</span>
            </h3>

            <div className="divide-y divide-white/10">
              {academicCalendar.map((item) => (
                <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-teal-400 px-2 py-0.5 rounded bg-teal-500/10">
                        {item.startDate} s/d {item.endDate}
                      </span>
                      <span className="text-xs font-bold text-white">{item.title}</span>
                    </div>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-300 px-2.5 py-1 rounded-full bg-slate-800 border border-white/10">
                      {item.targetAudience}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSelectEvent(item.eventType)}
                      className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Uji Suasana
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KOSTUM ASY, SYIFA & SAHABAT */}
      {activeTab === 'COSTUME_STUDIO' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">P3 • Kostum Otomatis</span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Busana Karakter untuk {activeEvent.title}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                100% Syar'i & Otentik
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dek Asy Card */}
              <div className="bg-slate-800/80 border border-emerald-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex flex-col items-center">
                  <CartoonCharacterSvg type="ASY" size={130} expression="SENYUM" movement="LANGKAH_KECIL" />
                  <span className="mt-2 text-xs font-black text-emerald-400">Dek Asy</span>
                </div>

                <div className="space-y-2 text-left w-full">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase">Tema Busana:</span>
                  <h4 className="text-base font-black text-white">{activeEvent.costumes.asy.title}</h4>
                  <div className="text-xs text-slate-300 space-y-1">
                    <p><strong className="text-slate-400">Pakaian:</strong> {activeEvent.costumes.asy.clothing}</p>
                    <p><strong className="text-slate-400">Peci/Penutup:</strong> {activeEvent.costumes.asy.headwear}</p>
                    <p><strong className="text-slate-400">Aksesoris:</strong> {activeEvent.costumes.asy.accessory}</p>
                  </div>
                </div>
              </div>

              {/* Mbak Syifa Card */}
              <div className="bg-slate-800/80 border border-teal-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex flex-col items-center">
                  <CartoonCharacterSvg type="SYIFA" size={130} expression="SENYUM" movement="ANGGUK_SANTUN" />
                  <span className="mt-2 text-xs font-black text-teal-400">Mbak Syifa</span>
                </div>

                <div className="space-y-2 text-left w-full">
                  <span className="text-[11px] font-bold text-teal-300 uppercase">Tema Busana:</span>
                  <h4 className="text-base font-black text-white">{activeEvent.costumes.syifa.title}</h4>
                  <div className="text-xs text-slate-300 space-y-1">
                    <p><strong className="text-slate-400">Gamis:</strong> {activeEvent.costumes.syifa.clothing}</p>
                    <p><strong className="text-slate-400">Jilbab:</strong> {activeEvent.costumes.syifa.hijab}</p>
                    <p><strong className="text-slate-400">Aksesoris:</strong> {activeEvent.costumes.syifa.accessory}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sahabat Satwa Cilik (Bubu, Gogo, Mimi) */}
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                🐾 Aksesoris Sahabat Cilik (Bubu, Gogo, Mimi):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                  <span className="font-black text-amber-400 block mb-1">🐱 Bubu Kucing Ceria:</span>
                  <p className="text-slate-300">{activeEvent.costumes.sahabat.bubu}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                  <span className="font-black text-emerald-400 block mb-1">🚂 Gogo Kereta Asy:</span>
                  <p className="text-slate-300">{activeEvent.costumes.sahabat.gogo}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                  <span className="font-black text-pink-400 block mb-1">🐰 Mimi Kelinci Santun:</span>
                  <p className="text-slate-300">{activeEvent.costumes.sahabat.mimi}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PAWAI & PARADE INTERAKTIF (BONUS) */}
      {activeTab === 'PARADE_BONUS' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Fitur Interaktif Ceria</span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Pawai & Parade Hari Besar (Sprint G25 Bonus)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Aktivitas interaktif menyenangkan untuk anak-anak dan keluarga saat memperingati hari besar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1. Pawai Bendera 17 Agustus */}
              <div className="bg-slate-800/80 border border-red-500/30 rounded-2xl p-5 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-3xl">🇮🇩</span>
                  <h4 className="text-sm font-black text-white mt-2">Pawai Bendera 17 Agustus</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Kibarkan bendera merah putih dan langkahkan kaki dengan iringan mars kemerdekaan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleSelectEvent('KEMERDEKAAN');
                    setShowBonusModal(true);
                  }}
                  className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Buka Pawai Merah Putih
                </button>
              </div>

              {/* 2. Parade Lentera Ramadhan */}
              <div className="bg-slate-800/80 border border-amber-500/30 rounded-2xl p-5 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-3xl">🏮</span>
                  <h4 className="text-sm font-black text-white mt-2">Parade Lentera Ramadhan</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Nyalakan 4 lentera kebaikan untuk membuka pesan motivasi puasa dan tadarus santri.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleSelectEvent('RAMADHAN');
                    setShowBonusModal(true);
                  }}
                  className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Nyalakan Lentera
                </button>
              </div>

              {/* 3. Pelangi Milad TK Asy Syifa */}
              <div className="bg-slate-800/80 border border-purple-500/30 rounded-2xl p-5 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-3xl">🌈</span>
                  <h4 className="text-sm font-black text-white mt-2">Pelangi Keberkahan Milad</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Sentuh 7 busur warna pelangi untuk membuka 7 nilai keunggulan TK Asy Syifa Tanggul.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleSelectEvent('MILAD_TK');
                    setShowBonusModal(true);
                  }}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Sentuh Busur Pelangi
                </button>
              </div>

              {/* 4. Pohon Doa & Harapan Event */}
              <div className="bg-slate-800/80 border border-emerald-500/30 rounded-2xl p-5 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-3xl">🌳</span>
                  <h4 className="text-sm font-black text-white mt-2">Pohon Doa & Harapan Event</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Tuliskan doa kebaikan santri dan keluarga yang langsung tersimpan di pohon digital.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowBonusModal(true);
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Sematkan Doa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: INTEGRASI SELURUH DUNIA TADE */}
      {activeTab === 'ECOSYSTEM_INTEGRATION' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">P6 • Integrasi Ekosistem</span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Matriks Transformasi Seluruh Dunia TADE ({activeEvent.badge})
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Bagaimana modul-modul lain di TADE bereaksi secara harmonis terhadap event aktif ini:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* 1. TV Asy & Cerita Santri */}
              <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Tv className="w-4 h-4" />
                  <span>TV Asy & Cerita Khusus</span>
                </div>
                <h4 className="text-sm font-black text-white">{activeEvent.storyIntegration.tvAsyTitle}</h4>
                <p className="text-xs text-slate-300">{activeEvent.storyIntegration.tvAsySynopsis}</p>
              </div>

              {/* 2. Sutradara Ajaib (G22) */}
              <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                  <Clapperboard className="w-4 h-4" />
                  <span>Sutradara Ajaib (G22)</span>
                </div>
                <h4 className="text-sm font-black text-white">Tema: {activeEvent.storyIntegration.sutradaraTheme}</h4>
                <p className="text-xs text-slate-300">
                  Preset cerita otomatis memprioritaskan genre {activeEvent.storyIntegration.sutradaraTheme.toLowerCase()} dengan dialog khas hari besar.
                </p>
              </div>

              {/* 3. Rumah Kreatif Asy (G24) */}
              <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-pink-400 font-bold text-xs">
                  <Palette className="w-4 h-4" />
                  <span>Rumah Kreatif Asy (G24)</span>
                </div>
                <h4 className="text-sm font-black text-white">Template: {activeEvent.storyIntegration.creativeRecommendedTemplate}</h4>
                <p className="text-xs text-slate-300">
                  Palet krayon otomatis merekomendasikan warna tematik {activeEvent.badge}.
                </p>
              </div>

              {/* 4. Kota Mini Profesi (G23) */}
              <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Building2 className="w-4 h-4" />
                  <span>Kota Mini Profesi (G23)</span>
                </div>
                <h4 className="text-sm font-black text-white">Misi Khusus</h4>
                <p className="text-xs text-slate-300">{activeEvent.storyIntegration.kotaMiniSpecialMission}</p>
              </div>

              {/* 5. Festival & Karnaval */}
              <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Panggung Festival Sentra</span>
                </div>
                <h4 className="text-sm font-black text-white">Pentas Tematik</h4>
                <p className="text-xs text-slate-300">{activeEvent.storyIntegration.festivalSpecialStage}</p>
              </div>

              {/* 6. Pohon Tumbuh & Doa (Living Tree) */}
              <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                  <Trees className="w-4 h-4" />
                  <span>Pohon Tumbuh & Doa</span>
                </div>
                <h4 className="text-sm font-black text-white">{activeEvent.wishTreeCategory}</h4>
                <p className="text-xs text-slate-300">{activeEvent.growingTreeNourishment}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FOUNDER COCKPIT (P7 MASTER CONTROL) */}
      {activeTab === 'FOUNDER_COCKPIT' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">P7 • Founder Master Control</span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Cockpit Pengendali Hari Besar Otomatis
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                Guardian Ring-0 Protected
              </span>
            </div>

            {/* Switches and Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Auto Calendar Switch */}
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white">Deteksi Kalender Otomatis</h4>
                    <p className="text-xs text-slate-400">Mengubah tema dunia secara otomatis sesuai tanggal nyata.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleAutoCalendar(!isAutoCalendar)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${isAutoCalendar ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'bg-slate-700 text-white'}`}
                  >
                    {isAutoCalendar ? 'AKTIF (ON)' : 'NONAKTIF (OFF)'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl">
                  {isAutoCalendar ? 'Sistem sedang berjalan otomatis mengikuti kalender Hijriah dan Masehi.' : 'Sistem sedang berada dalam mode simulasi manual founder override.'}
                </p>
              </div>

              {/* Eco Battery Mode Governor */}
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white">Governor Animasi & Mode Hemat</h4>
                    <p className="text-xs text-slate-400">Maksimal 5 animasi aktif. Mode hemat untuk perangkat ringan.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleEcoMode(!isEcoMode)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${isEcoMode ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-700 text-white'}`}
                  >
                    {isEcoMode ? 'ECO RINGAN' : '60 FPS NORMAL'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl">
                  {isEcoMode ? 'Animasi dinonaktifkan untuk menghemat baterai santri.' : 'Animasi partikel langit dan gerakan karakter aktif (maksimal 5 item).'}
                </p>
              </div>
            </div>

            {/* Test All Soundscapes */}
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Audisi Seluruh Web Audio Soundscape:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {[
                  { id: 'LONCENG_LEMBUT', label: 'Lonceng Lembut' },
                  { id: 'TAKBIR_HARMONI', label: 'Takbir Harmoni' },
                  { id: 'MARS_TK', label: 'Mars TK Ceria' },
                  { id: 'NASYID_CERIA', label: 'Nasyid Ceria' },
                  { id: 'SUARA_ALAM', label: 'Suara Alam' },
                  { id: 'TEPUK_GEMBIRA', label: 'Tepuk Gembira' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => livingEventEngine.playEventChime(s.id as any)}
                    className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold transition-all text-center border border-white/10 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 mx-auto mb-1 opacity-70" />
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bonus Feature Interactive Modal */}
      <EventBonusParadeModal
        eventTheme={activeEvent}
        isOpen={showBonusModal}
        onClose={() => setShowBonusModal(false)}
      />
    </div>
  );
};
