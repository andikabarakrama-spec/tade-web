/**
 * KOTA MINI PROFESI ASY & SYIFA HUB — SPRINT G23
 * 
 * Penanda: G23_KOTA_MINI_PROFESI_VERIFIED
 * 
 * Fitur Utama:
 * - P1: Peta Kota Mini Interaktif (7 Area: Klinik Cilik, Pos Pemadam, Perpustakaan, Toko Roti, Kebun Berkah, Bengkel Kereta, Kantor Pos)
 * - P2: Cerita Profesi Singkat (~20 Detik per vignette) dengan adab santun & doa harian
 * - P3: Integrasi Sutradara G22 (Susun otomatis tokoh, tempat, kamera, suara)
 * - P4: Transportasi Ceria bergerak pelan (Bus Sekolah, Mobil Pemadam, Ambulans, Traktor, Kereta Pos)
 * - P5: Belajar Tanpa Kompetisi (Lencana Cita-cita & Kartu Doa tanpa ranking/skor)
 * - P6: Hubungkan ke TV Asy, Buku Cerita, Festival, dan Pusat Aset
 * - P7: Living Event Engine: Mode Hari Profesi Sekolah
 */

import React, { useState, useEffect, useRef, useId } from 'react';
import { 
  Building2, Sparkles, Heart, Award, Volume2, VolumeX, Play, Pause, RotateCcw, 
  Tv, BookOpen, Compass, Film, CheckCircle2, ChevronRight, Share2, 
  Printer, Sun, Cloud, Star, MapPin, Flag, Shield, Users, Info, Sparkle
} from 'lucide-react';
import { 
  kotaMiniProfesiEngine, 
  PROFESSIONS_DATA, 
  VEHICLES_DATA, 
  ProfessionId, 
  VehicleId, 
  ProfessionArea, 
  EarnedProfessionBadge 
} from '../../services/kotaMiniProfesiEngine';
import { BuildingSvg, VehicleSvg } from './CityVisuals';
import { asySyifaDnaEngine } from '../../services/asySyifaDnaEngine';
import { CartoonCharacterSvg } from '../mascot/CartoonCharacterSvg';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';

interface Props {
  onSelectModule?: (moduleId: string) => void;
}

export const KotaMiniProfesiHub: React.FC<Props> = ({ onSelectModule }) => {
  const containerId = useId();
  const [activeTab, setActiveTab] = useState<'MAP' | 'STORY' | 'DIRECTOR' | 'BADGES' | 'CAREER_DAY'>('MAP');
  const [selectedProfId, setSelectedProfId] = useState<ProfessionId>('DOKTER');
  const [isCareerDay, setIsCareerDay] = useState<boolean>(() => kotaMiniProfesiEngine.getState().isCareerDayActive);
  
  // Story Player State
  const [currentAct, setCurrentAct] = useState<1 | 2 | 3>(1);
  const [isPlayingStory, setIsPlayingStory] = useState<boolean>(false);
  const [storyProgress, setStoryProgress] = useState<number>(0);
  const [childNameInput, setChildNameInput] = useState<string>('Santri Ceria');
  const [justEarnedBadge, setJustEarnedBadge] = useState<EarnedProfessionBadge | null>(null);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Vehicle Track Animation
  const [movingVehicles, setMovingVehicles] = useState<VehicleId[]>([
    'BUS_SEKOLAH', 'MOBIL_PEMADAM', 'AMBULANS_MINI', 'TRAKTOR_KEBUN', 'KERETA_POS'
  ]);
  const [isLightweight, setIsLightweight] = useState<boolean>(false);

  const selectedArea = PROFESSIONS_DATA[selectedProfId];
  const storyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Hari Profesi toggle
  const handleToggleCareerDay = () => {
    const next = kotaMiniProfesiEngine.toggleCareerDay();
    setIsCareerDay(next);
    if (next) {
      asySyifaDnaEngine.playSignatureSound('POP_BALON');
      showToast('🎉 Mode Hari Profesi Sekolah Aktif! Kota Mini kini penuh dekorasi karnaval ceria.');
    } else {
      showToast('Mode Kota Normal kembali aktif.');
    }
  };

  // Start 20s Story playback
  const startStory = (profId: ProfessionId) => {
    setSelectedProfId(profId);
    kotaMiniProfesiEngine.selectArea(profId);
    setCurrentAct(1);
    setStoryProgress(0);
    setIsPlayingStory(true);
    setJustEarnedBadge(null);
    setActiveTab('STORY');

    if (!audioMuted) {
      asySyifaDnaEngine.playSignatureSound('PLING_BINTANG');
    }
  };

  // Story step progression (~7s per act, total ~21s)
  useEffect(() => {
    if (!isPlayingStory) {
      if (storyTimerRef.current) clearInterval(storyTimerRef.current);
      return;
    }

    const actSounds = {
      1: selectedArea.vignetteStory.act1.sound,
      2: selectedArea.vignetteStory.act2.sound,
      3: selectedArea.vignetteStory.act3.sound
    };

    if (!audioMuted) {
      asySyifaDnaEngine.playSignatureSound(actSounds[currentAct]);
    }

    const interval = setInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) {
          if (currentAct === 1) {
            setCurrentAct(2);
            return 0;
          } else if (currentAct === 2) {
            setCurrentAct(3);
            return 0;
          } else {
            // Story complete -> Award Badge!
            setIsPlayingStory(false);
            const badge = kotaMiniProfesiEngine.awardBadge(selectedProfId, childNameInput);
            setJustEarnedBadge(badge);
            if (!audioMuted) {
              asySyifaDnaEngine.playSignatureSound('TEPUK_TANGAN_KECIL');
            }
            return 100;
          }
        }
        return prev + 2.5; // ~7 seconds per act
      });
    }, 175);

    storyTimerRef.current = interval;
    return () => clearInterval(interval);
  }, [isPlayingStory, currentAct, selectedProfId, audioMuted, selectedArea]);

  // Handle 1-Click Sutradara G22 Episode Generation
  const handleGenerateDirectorEpisode = (profId: ProfessionId) => {
    const ep = kotaMiniProfesiEngine.generateAndExportDirectorEpisode(profId);
    if (!audioMuted) {
      asySyifaDnaEngine.playSignatureSound('TEPUK_TANGAN_KECIL');
    }
    showToast(`🎬 Episode Sutradara #${ep.code} berhasil dibuat dan otomatis disinkronkan ke TV Asy & Buku Cerita!`);
  };

  const unlockedBadges = kotaMiniProfesiEngine.getUnlockedBadges();

  return (
    <div id={containerId} className="min-h-screen bg-gradient-to-b from-amber-50 via-sky-50 to-emerald-50 text-slate-800 pb-16 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-2xl border border-emerald-500/40 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Kota Mini Profesi Asy
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  G23 Verified
                </span>
                {isCareerDay && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                    🎉 Hari Profesi Aktif
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Belajar Cita-cita Melalui Cerita Santun • Tanpa Kompetisi • Ramah Anak TK
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleCareerDay}
              className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs ${
                isCareerDay 
                  ? 'bg-rose-500 text-white hover:bg-rose-600' 
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{isCareerDay ? 'Matikan Hari Profesi' : 'Rayakan Hari Profesi'}</span>
            </button>

            <button
              onClick={() => setAudioMuted(!audioMuted)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title={audioMuted ? "Nyalakan Suara" : "Bisukan Suara"}
            >
              {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            </button>

            {onSelectModule && (
              <button
                onClick={() => onSelectModule('sutradara_ajaib')}
                className="text-xs font-medium px-3 py-2 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition flex items-center gap-1"
              >
                <Film className="w-3.5 h-3.5 text-teal-600" />
                <span>Buka Sutradara G22</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('MAP')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'MAP' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Peta Kota Mini</span>
          </button>

          <button
            onClick={() => setActiveTab('STORY')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'STORY' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Panggung Cerita Profesi (~20s)</span>
          </button>

          <button
            onClick={() => setActiveTab('DIRECTOR')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'DIRECTOR' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Sutradara Profesi Otomatis (G22)</span>
          </button>

          <button
            onClick={() => setActiveTab('BADGES')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'BADGES' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Lencana Cita-cita ({unlockedBadges.length}/7)</span>
          </button>

          <button
            onClick={() => setActiveTab('CAREER_DAY')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'CAREER_DAY' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Event Hari Profesi</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* TAB 1: PETA KOTA MINI INTERAKTIF */}
        {activeTab === 'MAP' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Atmosphere Header */}
            <div className={`p-4 sm:p-5 rounded-3xl border transition-all ${
              isCareerDay 
                ? 'bg-gradient-to-r from-rose-100 via-amber-100 to-teal-100 border-rose-300 shadow-md' 
                : 'bg-white/80 border-emerald-200/80 shadow-xs'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🏡</div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {isCareerDay ? '🎪 Karnaval Hari Profesi Kota Mini Asy' : 'Jelajahi 7 Area Profesi & Kebaikan'}
                    </h2>
                    <p className="text-xs text-slate-600">
                      Sentuh gedung untuk menyimak cerita 20 detik bersama Dek Asy & Mbak Syifa.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white/70 px-3 py-1.5 rounded-xl border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>5 Kendaraan Ceria Melaju Pelan (60 FPS)</span>
                </div>
              </div>
            </div>

            {/* City Canvas Map Grid */}
            <div className="relative bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-100 p-4 sm:p-8 rounded-3xl border-2 border-emerald-300 shadow-xl overflow-hidden min-h-[580px]">
              {/* Background Cloud & Sun Deco */}
              <div className="absolute top-4 left-6 flex items-center gap-2 text-sky-400/40">
                <Cloud className="w-12 h-12" />
                <Cloud className="w-8 h-8 -mt-2" />
              </div>
              <div className="absolute top-4 right-8 text-amber-400">
                <Sun className="w-14 h-14 animate-spin origin-center" style={{ animationDuration: '30s' }} />
              </div>

              {/* Career Day Bunting across sky */}
              {isCareerDay && (
                <div className="absolute top-0 left-0 right-0 h-10 bg-repeat-x flex justify-around text-lg opacity-90 select-none">
                  <span>🚩</span><span>🎈</span><span>🚩</span><span>⭐</span><span>🚩</span><span>🎈</span><span>🚩</span><span>⭐</span><span>🚩</span><span>🎈</span>
                </div>
              )}

              {/* Curving Road Graphic Background */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" preserveAspectRatio="none" viewBox="0 0 1000 600">
                {/* Winding Cheerful Boulevard */}
                <path d="M 50 120 Q 300 80 500 200 T 950 180" stroke="#fef08a" strokeWidth="60" strokeLinecap="round" fill="none" />
                <path d="M 50 120 Q 300 80 500 200 T 950 180" stroke="#eab308" strokeWidth="4" strokeDasharray="16 16" fill="none" />

                <path d="M 100 500 Q 400 550 500 350 T 900 480" stroke="#fef08a" strokeWidth="60" strokeLinecap="round" fill="none" />
                <path d="M 100 500 Q 400 550 500 350 T 900 480" stroke="#eab308" strokeWidth="4" strokeDasharray="16 16" fill="none" />

                <path d="M 500 200 V 350" stroke="#fef08a" strokeWidth="50" fill="none" />
                <path d="M 500 200 V 350" stroke="#eab308" strokeWidth="4" strokeDasharray="16 16" fill="none" />
              </svg>

              {/* 7 Buildings Layout */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {(Object.keys(PROFESSIONS_DATA) as ProfessionId[]).map((profId) => {
                  const item = PROFESSIONS_DATA[profId];
                  const isSelected = selectedProfId === profId;
                  const isUnlocked = unlockedBadges.some(b => b.professionId === profId);

                  return (
                    <div
                      key={profId}
                      onClick={() => startStory(profId)}
                      className={`group cursor-pointer rounded-2xl p-4 transition-all duration-300 transform hover:-translate-y-1.5 relative ${
                        isSelected 
                          ? 'bg-white shadow-xl ring-3 ring-emerald-500 scale-102' 
                          : 'bg-white/85 hover:bg-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      {/* Badge indicator if already visited */}
                      {isUnlocked && (
                        <div className="absolute top-2 right-2 z-20 bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                          <span>{item.badgeIcon}</span>
                          <span>Tuntas</span>
                        </div>
                      )}

                      {/* Building Cartoon SVG */}
                      <div className="w-full h-36 flex items-center justify-center p-1">
                        <BuildingSvg 
                          professionId={profId} 
                          isSelected={isSelected}
                          isCareerDay={isCareerDay}
                        />
                      </div>

                      {/* Name & Tagline */}
                      <div className="mt-2 text-center">
                        <div className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 mb-1">
                          <span>{item.iconEmoji}</span>
                          <span>{item.locationName}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                          {item.shortTitle}
                        </h3>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                          {item.tagline}
                        </p>
                      </div>

                      {/* Play Button Action */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-medium text-emerald-700 flex items-center gap-1">
                          <Play className="w-3 h-3 fill-current" /> ~20 Detik
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 group-hover:text-emerald-600 flex items-center gap-0.5">
                          Buka Cerita <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* P4: 5 Moving Vehicles Track Lane */}
              <div className="relative z-10 mt-8 pt-4 border-t-2 border-emerald-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <span>🚗</span> Transportasi Ceria Kota (Bergerak Pelan)
                  </span>
                  <span className="text-[11px] text-slate-600">
                    Klik kendaraan untuk melihat tugasnya
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {(Object.keys(VEHICLES_DATA) as VehicleId[]).map((vId) => {
                    const veh = VEHICLES_DATA[vId];
                    return (
                      <div 
                        key={vId}
                        onClick={() => startStory(veh.assignedProfession)}
                        className="bg-white/90 hover:bg-white p-2.5 rounded-xl border border-emerald-200 shadow-xs cursor-pointer group hover:scale-105 transition"
                      >
                        <div className="h-14 w-full flex items-center justify-center">
                          <VehicleSvg vehicleId={vId} isMoving={true} />
                        </div>
                        <div className="text-center mt-1">
                          <span className="text-[11px] font-bold text-slate-800 block truncate">
                            {veh.name}
                          </span>
                          <span className="text-[9px] text-emerald-600 font-medium">
                            {veh.soundCue}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PANGGUNG CERITA PROFESI (~20 DETIK) */}
        {activeTab === 'STORY' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Story Player Container */}
            <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl overflow-hidden">
              {/* Header Info */}
              <div className={`p-5 bg-gradient-to-r ${selectedArea.accentGradient} text-white flex flex-wrap items-center justify-between gap-4`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl bg-white/20 p-2 rounded-2xl">{selectedArea.iconEmoji}</span>
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20">
                      Cerita Profesi Cilik • {selectedArea.locationName}
                    </span>
                    <h2 className="text-xl font-bold tracking-tight mt-0.5">
                      {selectedArea.shortTitle}
                    </h2>
                  </div>
                </div>

                {/* Act Navigator */}
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold">
                  <span className={currentAct === 1 ? "text-yellow-300 font-bold" : "text-white/60"}>Babak 1</span>
                  <span>•</span>
                  <span className={currentAct === 2 ? "text-yellow-300 font-bold" : "text-white/60"}>Babak 2</span>
                  <span>•</span>
                  <span className={currentAct === 3 ? "text-yellow-300 font-bold" : "text-white/60"}>Babak 3 (Doa)</span>
                </div>
              </div>

              {/* Stage Visual Scene */}
              <div className="relative bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50 p-6 sm:p-10 min-h-[380px] flex flex-col justify-between">
                {/* Visual Backdrop with Character Avatars */}
                <div className="flex items-center justify-around py-4">
                  {/* Dek Asy */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-40 transform transition hover:scale-105">
                      <CartoonCharacterSvg 
                        character="ASY"
                        movementStyle={currentAct === 1 ? 'LAMBAIAN_TANGAN' : currentAct === 2 ? 'LANGKAH_KECIL' : 'ANGGUKAN_KEPALA'}
                        expression={currentAct === 3 ? 'BANGGA' : 'SENYUM'}
                        size={140}
                      />
                    </div>
                    <span className="mt-2 text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
                      Dek Asy
                    </span>
                    <span className="text-[10px] text-slate-500 max-w-[140px] mt-1">
                      {currentAct === 1 ? selectedArea.vignetteStory.act1.asyAction :
                       currentAct === 2 ? selectedArea.vignetteStory.act2.asyAction :
                       selectedArea.vignetteStory.act3.asyAction}
                    </span>
                  </div>

                  {/* Center Building Graphic */}
                  <div className="hidden sm:block w-36 h-36">
                    <BuildingSvg professionId={selectedProfId} isCareerDay={isCareerDay} />
                  </div>

                  {/* Mbak Syifa */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-40 transform transition hover:scale-105">
                      <CartoonCharacterSvg 
                        character="SYIFA"
                        movementStyle={currentAct === 1 ? 'SENYUM_HANGAT' : currentAct === 2 ? 'LAMBAIAN_TANGAN' : 'ANGGUKAN_KEPALA'}
                        expression={currentAct === 3 ? 'BANGGA' : 'SENYUM'}
                        size={140}
                      />
                    </div>
                    <span className="mt-2 text-xs font-bold px-3 py-1 rounded-full bg-teal-600 text-white shadow-xs">
                      Mbak Syifa
                    </span>
                    <span className="text-[10px] text-slate-500 max-w-[140px] mt-1">
                      {currentAct === 1 ? selectedArea.vignetteStory.act1.syifaAction :
                       currentAct === 2 ? selectedArea.vignetteStory.act2.syifaAction :
                       selectedArea.vignetteStory.act3.syifaAction}
                    </span>
                  </div>
                </div>

                {/* Subtitles & Dialogue Bubble */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-emerald-200 shadow-md max-w-3xl mx-auto w-full space-y-3">
                  <div className="text-xs text-slate-500 font-medium italic border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>
                      {currentAct === 1 ? selectedArea.vignetteStory.act1.narrator :
                       currentAct === 2 ? selectedArea.vignetteStory.act2.narrator :
                       selectedArea.vignetteStory.act3.narrator}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-100">
                      <span className="text-xs font-bold text-emerald-800 block mb-0.5">Dek Asy:</span>
                      <p className="text-slate-800 text-xs sm:text-sm">
                        {currentAct === 1 ? selectedArea.vignetteStory.act1.asySpeech :
                         currentAct === 2 ? selectedArea.vignetteStory.act2.asySpeech :
                         selectedArea.vignetteStory.act3.asySpeech}
                      </p>
                    </div>

                    <div className="bg-teal-50/80 p-3 rounded-xl border border-teal-100">
                      <span className="text-xs font-bold text-teal-800 block mb-0.5">Mbak Syifa:</span>
                      <p className="text-slate-800 text-xs sm:text-sm">
                        {currentAct === 1 ? selectedArea.vignetteStory.act1.syifaSpeech :
                         currentAct === 2 ? selectedArea.vignetteStory.act2.syifaSpeech :
                         selectedArea.vignetteStory.act3.syifaSpeech}
                      </p>
                    </div>
                  </div>

                  {/* Doa / Moral Lesson in Act 3 */}
                  {currentAct === 3 && (
                    <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-center animate-in fade-in">
                      <span className="text-xs font-bold text-amber-900 block mb-1">
                        🤲 Doa Cita-Cita & Kebaikan
                      </span>
                      <p className="text-sm font-arabic text-slate-900 leading-loose">
                        {selectedArea.duaText}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 italic">
                        "{selectedArea.duaMeaning}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar & Player Controls */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                {/* Progress */}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Kemajuan Kisah (~20 Detik)</span>
                    <span>Babak {currentAct} dari 3</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-200 rounded-full"
                      style={{ width: `${((currentAct - 1) * 33.33) + (storyProgress / 3)}%` }}
                    />
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (isPlayingStory) {
                        setIsPlayingStory(false);
                      } else {
                        startStory(selectedProfId);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition"
                  >
                    {isPlayingStory ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingStory ? 'Jeda' : 'Mulai Cerita'}</span>
                  </button>

                  <button
                    onClick={() => startStory(selectedProfId)}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
                    title="Ulangi Cerita"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleGenerateDirectorEpisode(selectedProfId)}
                    className="px-3.5 py-2 rounded-xl bg-teal-100 text-teal-900 hover:bg-teal-200 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Ekspor ke Sutradara G22</span>
                  </button>
                </div>
              </div>
            </div>

            {/* P5: BADGE AWARD MODAL / CARD (Belajar Tanpa Kompetisi) */}
            {justEarnedBadge && (
              <div className="p-6 bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 rounded-3xl border-2 border-amber-300 shadow-xl text-center space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 bg-amber-400 text-3xl rounded-full flex items-center justify-center mx-auto shadow-md border-2 border-white">
                  {justEarnedBadge.badgeIcon}
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full">
                    Apresiasi Santri Hebat • Belajar Tanpa Skor
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">
                    Selamat, {childNameInput}!
                  </h3>
                  <p className="text-sm font-semibold text-emerald-800 mt-0.5">
                    Kamu mendapatkan: {justEarnedBadge.badgeTitle}
                  </p>
                  <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                    {selectedArea.badgeDescription}
                  </p>
                </div>

                {/* Input Child Name for Memory Card */}
                <div className="max-w-xs mx-auto flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-amber-300">
                  <span className="text-xs font-semibold text-slate-500">Nama Santri:</span>
                  <input
                    type="text"
                    value={childNameInput}
                    onChange={(e) => setChildNameInput(e.target.value)}
                    className="text-xs font-bold text-slate-800 bg-transparent outline-none flex-1"
                    placeholder="Tulis nama anak..."
                  />
                </div>

                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setActiveTab('BADGES')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition"
                  >
                    Buka Lembar Koleksi Lencana
                  </button>
                  <button
                    onClick={() => setJustEarnedBadge(null)}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 transition"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SUTRADARA PROFESI OTOMATIS (G22 INTEGRATION) */}
        {activeTab === 'DIRECTOR' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Sutradara Profesi Otomatis (G22 Engine)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Guru cukup memilih profesi. Sutradara otomatis menyusun tokoh, tempat, kamera, suara, dan menyinkronkan ke TV Asy & Buku Cerita.
                  </p>
                </div>
              </div>

              {/* 7 Profession Cards with 1-Click Director Button */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {(Object.keys(PROFESSIONS_DATA) as ProfessionId[]).map((profId) => {
                  const p = PROFESSIONS_DATA[profId];
                  return (
                    <div key={profId} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition space-y-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{p.iconEmoji}</span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{p.shortTitle}</h4>
                          <span className="text-[10px] text-slate-500">{p.locationName}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {p.moralMessage}
                      </p>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          Lead: {p.leadCharacter}
                        </span>
                        <button
                          onClick={() => handleGenerateDirectorEpisode(profId)}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition"
                        >
                          <Film className="w-3 h-3" />
                          <span>Susun Episode</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: KOLEKSI LENCANA CITA-CITA & KARTU DOA */}
        {activeTab === 'BADGES' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Child Profile & Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20">
                  Belajar Tanpa Ranking • Berkah & Doa
                </span>
                <h2 className="text-xl font-bold tracking-tight mt-1">
                  Koleksi Lencana Cita-Cita {childNameInput}
                </h2>
                <p className="text-xs text-white/90 mt-0.5">
                  Telah menyimak {unlockedBadges.length} dari 7 cerita profesi mulia.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={childNameInput}
                  onChange={(e) => setChildNameInput(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white/20 text-white placeholder:text-white/60 text-xs font-bold outline-none border border-white/30"
                  placeholder="Ganti nama anak..."
                />
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(Object.keys(PROFESSIONS_DATA) as ProfessionId[]).map((profId) => {
                const p = PROFESSIONS_DATA[profId];
                const badge = unlockedBadges.find(b => b.professionId === profId);
                const isEarned = !!badge;

                return (
                  <div
                    key={profId}
                    className={`p-5 rounded-2xl border transition-all text-center space-y-3 ${
                      isEarned 
                        ? 'bg-white border-amber-300 shadow-md' 
                        : 'bg-slate-100/70 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto ${
                      isEarned ? 'bg-amber-100 text-amber-900 border-2 border-amber-300' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {p.badgeIcon}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{p.badgeTitle}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {p.badgeDescription}
                      </p>
                    </div>

                    {isEarned ? (
                      <div className="pt-2 border-t border-slate-100 text-[10px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tercapai dengan Bahagia</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => startStory(profId)}
                        className="w-full py-1.5 rounded-lg bg-slate-200 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-medium transition"
                      >
                        Simak Cerita
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: LIVING EVENT ENGINE - HARI PROFESI */}
        {activeTab === 'CAREER_DAY' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md">
                  <Flag className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Living Event Engine: Hari Profesi Sekolah
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ketika sekolah mengadakan agenda Pekan Profesi / Karnaval Cita-cita, aktifkan mode ini agar Kota Mini Asy otomatis bertransformasi tematik.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl border border-rose-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Status Event</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {isCareerDay ? '🎉 Mode Hari Profesi Sedang Aktif' : '🍃 Mode Kota Santai (Standar)'}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-md">
                    Mengaktifkan dekorasi karnaval, bendera pelangi di langit kota mini, sambutan kostum Asy & Syifa, dan efek suara pesta ceria.
                  </p>
                </div>

                <button
                  onClick={handleToggleCareerDay}
                  className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-md flex items-center gap-2 ${
                    isCareerDay 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Flag className="w-4 h-4" />
                  <span>{isCareerDay ? 'Nonaktifkan Hari Profesi' : 'Aktifkan Hari Profesi Sekarang'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
