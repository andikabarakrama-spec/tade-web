/**
 * TADE SPRINT G39 — HARI PASAR CERIA & KOPERASI MINI HUB
 * Early Childhood Market Day, Honesty, Sharing, Polite Manners, & Cooperative Learning
 * 
 * Features:
 * - P1: Gerbang Pasar Ceria (Gapura warna-warni terbuka, balon melayang, sapaan Asy "Selamat datang di Hari Pasar Ceria.")
 * - P2: Stan Pasar Hidup (6 stan kartun: Buah Segar, Sayur Organik, Buku Dongeng, Mainan Kayu, Roti Berkah, Bunga Melati - semua tersenyum)
 * - P3: Koperasi Mini (Kasir ramah, belajar antre tertib, pembiasaan kata santun: "Tolong", "Terima kasih", "Alhamdulillah")
 * - P4: Keranjang Ceria (Keranjang beroda berjalan pelan, buah melambai, sayur tersenyum)
 * - P5: Cerita Pasar 20 Detik (Simulasi interaktif Asy & Syifa berbelanja jujur dan saling membantu)
 * - P6: Kartu Belanja Kenangan (Cap kenangan stempel kebaikan tanpa poin & ranking)
 * - P7: Founder Pasar Control (Uji suara pasar, uji antre, simulasi otomatis pasar, audit Black Box Ring-0)
 * - Bonus: Burung pipit, kupu-kupu, balon hati, kereta belanja mini
 * 
 * Marker: G39_PASAR_CERIA_VERIFIED
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Smile,
  Heart,
  Users,
  Award,
  ShoppingCart,
  Store,
  MessageSquareHeart,
  ArrowRight,
  Tv,
  Camera,
  Layers,
  ChevronRight,
  Plus,
  Trash2,
  Coffee,
  Sun
} from 'lucide-react';
import hariPasarEngine, {
  PasarPhase,
  StallId,
  PoliteWordId,
  PasarSnapshot
} from '../../services/hariPasarEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface HariPasarHubProps {
  onNavigateToMbg?: () => void;
  onNavigateToKotaMini?: () => void;
  onNavigateToFestival?: () => void;
  onNavigateToDNA?: () => void;
  onNavigateToKamera?: () => void;
  onNavigateToPetaDunia?: () => void;
  onNavigateToPawaiNusantara?: () => void;
  onNavigateToAula?: () => void;
  onNavigateToKebunAjaib?: () => void;
}

export const HariPasarHub: React.FC<HariPasarHubProps> = ({
  onNavigateToMbg,
  onNavigateToKotaMini,
  onNavigateToFestival,
  onNavigateToDNA,
  onNavigateToKamera,
  onNavigateToPetaDunia,
  onNavigateToPawaiNusantara,
  onNavigateToAula,
  onNavigateToKebunAjaib
}) => {
  const [snapshot, setSnapshot] = useState<PasarSnapshot>(hariPasarEngine.getSnapshot());
  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'STALLS' | 'KOPERASI' | 'BASKET' | 'STORY' | 'CARD' | 'FOUNDER'>('EXPLORE');
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [speechBubbleText, setSpeechBubbleText] = useState<string>(
    '“Selamat datang di Hari Pasar Ceria TK Asy Syifa! Mari belajar kejujuran, berbagi, antre yang rapi, dan berkata santun.”'
  );

  useEffect(() => {
    tadeAnimationGovernor.startAnimation('anim-pasar-ceria');
    const unsub = hariPasarEngine.subscribe(() => {
      setSnapshot(hariPasarEngine.getSnapshot());
    });

    return () => {
      unsub();
      tadeAnimationGovernor.stopAnimation('anim-pasar-ceria');
      hariPasarEngine.stopMarketStory();
      hariPasarEngine.stopFullPasarSimulation();
    };
  }, []);

  const handleSelectPhase = (phase: PasarPhase) => {
    hariPasarEngine.setPhase(phase);
    if (phase === 'GATE_PASAR') {
      setActiveTab('EXPLORE');
      setSpeechBubbleText('“Selamat datang di Hari Pasar Ceria! Gapura warna-warni dan balon ceria menyambut kita semua.”');
    } else if (phase === 'LIVING_STALLS') {
      setActiveTab('STALLS');
      setSpeechBubbleText('“Lihat 6 stan pasar yang ramah dan tersenyum! Ada buah, sayur, buku, mainan, roti, dan bunga melati.”');
    } else if (phase === 'KOPERASI_MINI') {
      setActiveTab('KOPERASI');
      setSpeechBubbleText('“Di Koperasi Mini, kita belajar antre dengan tertib dan mengucapkan Tolong, Terima Kasih, dan Alhamdulillah.”');
    } else if (phase === 'KERANJANG_CERIA') {
      setActiveTab('BASKET');
      setSpeechBubbleText('“Keranjang belanja kecil berjalan pelan, buah-buahan melambai dan sayur tersenyum riang!”');
    } else if (phase === 'MARKET_STORY') {
      setActiveTab('STORY');
      setSpeechBubbleText('“Cerita Pasar Ceria: Asy membeli buah segar, Syifa membeli buku dongeng, dan semua saling membantu.”');
    } else if (phase === 'SHOPPING_CARD') {
      setActiveTab('CARD');
      setSpeechBubbleText('“Alhamdulillah! Kartu Belanja Kenangan kita telah dicap stempel kebaikan dan kejujuran.”');
    }
  };

  const handleSelectStall = (stallId: StallId) => {
    hariPasarEngine.selectStall(stallId);
    const stall = hariPasarEngine.stalls[stallId];
    setSpeechBubbleText(`“${stall.sellerCharacter} di ${stall.name} menyapa: ${stall.greeting}”`);
  };

  const handleSelectPoliteWord = (wordId: PoliteWordId) => {
    hariPasarEngine.selectPoliteWord(wordId);
    const word = hariPasarEngine.politeWords[wordId];
    setSpeechBubbleText(`“Membiasakan kata santun: ${word.label} (${word.arabicMeaning}). ${word.usageContext}”`);
  };

  const currentStall = hariPasarEngine.stalls[snapshot.activeStall];

  return (
    <div id="hari-pasar-root" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none pb-12">
      {/* Top Header */}
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-amber-500/30 sticky top-0 z-50 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-red-500 to-emerald-500 flex items-center justify-center shadow-md shadow-amber-500/20 text-xl border border-white/20">
              🛒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  Sprint G39
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Dr. Pulse 60 FPS
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-2">
                Hari Pasar Ceria &amp; Koperasi Mini
                <span className="text-xs font-normal text-slate-400 hidden sm:inline">| TK Asy Syifa</span>
              </h1>
            </div>
          </div>

          {/* Ecosystem Navigation Links */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {onNavigateToPawaiNusantara && (
              <button
                onClick={onNavigateToPawaiNusantara}
                className="px-2.5 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-bold flex items-center gap-1 border border-red-500/40 transition"
                title="Pawai Nusantara G38"
              >
                <span>🇮🇩 Pawai</span>
              </button>
            )}
            {onNavigateToMbg && (
              <button
                onClick={onNavigateToMbg}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-bold flex items-center gap-1 border border-emerald-500/40 transition"
                title="MBG Makan Bergizi G31"
              >
                <span>🍱 MBG</span>
              </button>
            )}
            {onNavigateToKotaMini && (
              <button
                onClick={onNavigateToKotaMini}
                className="px-2.5 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs font-bold flex items-center gap-1 border border-blue-500/40 transition"
                title="Kota Mini G23"
              >
                <span>🏙️ Kota Mini</span>
              </button>
            )}
            {onNavigateToFestival && (
              <button
                onClick={onNavigateToFestival}
                className="px-2.5 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-xs font-bold flex items-center gap-1 border border-amber-500/40 transition"
                title="Festival Budaya G18"
              >
                <span>🎪 Festival</span>
              </button>
            )}
            {onNavigateToAula && (
              <button
                onClick={onNavigateToAula}
                className="px-2.5 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-bold flex items-center gap-1 border border-purple-500/40 transition"
                title="Aula Impian G37"
              >
                <span>🏛️ Aula</span>
              </button>
            )}
            {onNavigateToKebunAjaib && (
              <button
                onClick={onNavigateToKebunAjaib}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-bold flex items-center gap-1 border border-emerald-500/40 transition"
                title="Kebun Ajaib & Panen Berkah G40"
              >
                <span>🌱 Kebun Ajaib</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div className="bg-slate-800/60 border-b border-slate-700/60 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              onClick={() => handleSelectPhase('GATE_PASAR')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'EXPLORE'
                  ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🎪 Gerbang Pasar (P1)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('LIVING_STALLS')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'STALLS'
                  ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🏪 6 Stan Hidup (P2)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('KOPERASI_MINI')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'KOPERASI'
                  ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🤝 Koperasi &amp; Antre (P3)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('KERANJANG_CERIA')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'BASKET'
                  ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🧺 Keranjang Ceria (P4)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('MARKET_STORY')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'STORY'
                  ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>📖 Cerita 20s (P5)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('SHOPPING_CARD')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'CARD'
                  ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>💳 Kartu Belanja (P6)</span>
            </button>
            <button
              onClick={() => setActiveTab('FOUNDER')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'FOUNDER'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>⚙️ Founder Control (P7)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundMuted(!soundMuted)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
                soundMuted
                  ? 'bg-rose-900/30 border-rose-500/40 text-rose-300'
                  : 'bg-slate-700/40 border-slate-600 text-slate-300'
              }`}
              title={soundMuted ? 'Suara dimatikan' : 'Suara aktif'}
            >
              {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-4 pt-6 flex-1 flex flex-col gap-6">
        {/* Dek Asy & Syifa Sapaan Card with Floating Atmosphere */}
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-800/90 to-emerald-950/80 border border-amber-500/40 rounded-3xl p-4 md:p-6 shadow-2xl relative overflow-hidden">
          {/* Bonus Atmosphere: Burung Pipit, Kupu-kupu, Balon Hati, Kereta Belanja Mini */}
          <div className="absolute top-2 right-4 text-2xl opacity-70 animate-bounce pointer-events-none select-none">
            🐦
          </div>
          <div className="absolute top-10 right-20 text-xl opacity-70 animate-pulse pointer-events-none select-none">
            🦋
          </div>
          <div className="absolute bottom-2 left-4 text-2xl opacity-60 pointer-events-none select-none">
            💖🎈
          </div>
          <div className="absolute bottom-2 right-8 text-xl opacity-50 pointer-events-none select-none">
            🛒✨
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
            {/* Avatar Dek Asy & Syifa */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-400 via-red-500 to-amber-600 flex items-center justify-center text-3xl shadow-lg border-2 border-white/40">
                  👦🏻
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white">
                  Asy
                </div>
              </div>
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-rose-400 via-red-400 to-amber-300 flex items-center justify-center text-3xl shadow-lg border-2 border-white/40">
                  👧🏻
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white">
                  Syifa
                </div>
              </div>
            </div>

            {/* Sapaan Bubble */}
            <div className="flex-1 bg-slate-900/80 border border-amber-400/30 rounded-2xl p-4 shadow-inner">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Pesan Ceria Asy &amp; Syifa:
                </span>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                  Kejujuran &amp; Berbagi
                </span>
              </div>
              <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed italic">
                {speechBubbleText}
              </p>
            </div>
          </div>
        </div>

        {/* Tab 1: P1 — GERBANG PASAR CERIA */}
        {activeTab === 'EXPLORE' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
                    P1
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Gerbang Pasar Ceria TK Asy Syifa</h2>
                    <p className="text-xs text-slate-400">Gapura warna-warni terbuka dengan balon melayang riang</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectPhase('LIVING_STALLS')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
                >
                  <span>Kunjungi 6 Stan Pasar</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 3D Visual Gapura Pasar */}
              <div className="relative rounded-2xl bg-gradient-to-b from-sky-900/60 via-slate-900/90 to-amber-950/70 border border-amber-500/30 p-8 flex flex-col items-center justify-center text-center overflow-hidden min-h-[300px]">
                {/* Floating balloons */}
                <div className="absolute top-4 left-8 flex items-center gap-2">
                  <span className="text-3xl animate-bounce">🎈</span>
                  <span className="text-2xl">🟡🟢</span>
                </div>
                <div className="absolute top-4 right-8 flex items-center gap-2">
                  <span className="text-2xl">🔴🔵</span>
                  <span className="text-3xl animate-bounce">🎈</span>
                </div>

                {/* Gapura Arch */}
                <div className="w-full max-w-xl border-t-8 border-x-8 border-amber-500 rounded-t-3xl bg-amber-950/50 p-6 relative shadow-2xl backdrop-blur-sm">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 px-5 py-1 rounded-full text-xs font-black border-2 border-white shadow flex items-center gap-1.5">
                    <span>🎪</span> HARI PASAR CERIA <span>🎪</span>
                  </div>

                  <div className="text-5xl md:text-6xl my-4 flex items-center justify-center gap-6">
                    <span>🍎</span>
                    <span>🏪</span>
                    <span>📚</span>
                  </div>

                  <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-4 mt-4">
                    <p className="text-sm font-bold text-amber-300">
                      "Selamat datang di Hari Pasar Ceria."
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      Belajar mengenal nilai kebaikan, berbagi rezeki, antre teratur, dan mengucapkan kata santun dengan senyuman tulus.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <button
                    onClick={() => {
                      hariPasarEngine.playMarketBell();
                      setSpeechBubbleText('“Denting lonceng pasar ceria berbunyi menyambut kedatangan anak-anak saleh!”');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-amber-300 text-xs font-bold flex items-center gap-2 border border-amber-500/30 shadow"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Dengarkan Lonceng Pasar</span>
                  </button>
                  <button
                    onClick={() => handleSelectPhase('KOPERASI_MINI')}
                    className="px-4 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 text-xs font-bold flex items-center gap-2 border border-emerald-500/40 shadow"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Latihan Antre di Koperasi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: P2 — 6 STAN PASAR HIDUP */}
        {activeTab === 'STALLS' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
                    P2
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">6 Stan Pasar Kartun Hidup &amp; Tersenyum</h2>
                    <p className="text-xs text-slate-400">Pilih stan untuk menyapa penjual ramah dan melihat produk kebaikan</p>
                  </div>
                </div>
              </div>

              {/* Stalls Grid Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                {(Object.keys(hariPasarEngine.stalls) as StallId[]).map((stallId) => {
                  const stall = hariPasarEngine.stalls[stallId];
                  const isSelected = snapshot.activeStall === stallId;
                  return (
                    <button
                      key={stallId}
                      onClick={() => handleSelectStall(stallId)}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between transition ${
                        isSelected
                          ? `bg-gradient-to-b ${stall.accentColor} text-white shadow-xl ring-2 ring-white/40`
                          : 'bg-slate-800/60 border-slate-700 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="relative mb-1">
                        <span className="text-3xl">{stall.emoji}</span>
                        <span className="absolute -bottom-1 -right-1 text-xs">😊</span>
                      </div>
                      <span className="text-xs font-bold truncate w-full">{stall.name.split(' ')[1] || stall.name}</span>
                      <span className="text-[10px] opacity-80 mt-0.5 truncate w-full">{stall.category}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Stall Detail Showcase */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/50 border border-amber-500/40 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Stall Avatar */}
                  <div className="w-28 h-28 rounded-3xl bg-amber-900/40 border-2 border-amber-400/50 flex flex-col items-center justify-center text-5xl shadow-inner">
                    <span>{currentStall.emoji}</span>
                    <span className="text-[10px] font-bold text-amber-300 mt-1">Tersenyum</span>
                  </div>

                  {/* Stall Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
                          {currentStall.category}
                        </span>
                        <h3 className="text-xl font-black text-white">{currentStall.name}</h3>
                        <span className="text-xs text-slate-400">Penjual: {currentStall.sellerCharacter}</span>
                      </div>
                      <button
                        onClick={() => handleSelectPhase('KERANJANG_CERIA')}
                        className="px-3 py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Buka Keranjang</span>
                      </button>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3">
                      <p className="text-xs font-bold text-amber-300">Sapaan Penjual Ramah:</p>
                      <p className="text-sm text-slate-200 italic mt-0.5">{currentStall.greeting}</p>
                    </div>

                    {/* Items on Stall */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentStall.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <h4 className="text-xs font-bold text-slate-200">{item.name}</h4>
                              <p className="text-[10px] text-slate-400">{item.benefit}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              hariPasarEngine.addItemToBasket(item.name, item.icon);
                              setSpeechBubbleText(`“Memasukkan ${item.name} ke dalam keranjang belanja ceria!”`);
                            }}
                            className="p-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs"
                            title="Masukkan ke keranjang"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: P3 — KOPERASI MINI & BELAJAR ANTRE */}
        {activeTab === 'KOPERASI' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
                    P3
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Koperasi Mini &amp; Pembiasaan Adab Antre</h2>
                    <p className="text-xs text-slate-400">Kasir ramah menyapa, antre sabar, dan mengucapkan 3 kata ajaib</p>
                  </div>
                </div>
              </div>

              {/* Queue Visualizer */}
              <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-700/80 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">
                      Barisan Antre Tertib: Anda berada di nomor antrean #{snapshot.queuePosition} dari {snapshot.totalInQueue}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      hariPasarEngine.advanceQueue();
                      setSpeechBubbleText('“Maju selangkah dalam antrean dengan sabar dan tertib!”');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <span>Maju Antrean</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Queue Characters */}
                <div className="flex items-center justify-around gap-2 flex-wrap bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                  {/* Kasir */}
                  <div className="flex flex-col items-center bg-emerald-950/80 border border-emerald-500/50 p-2.5 rounded-2xl shadow">
                    <span className="text-3xl">🧕🏻</span>
                    <span className="text-[11px] font-black text-emerald-300 mt-1">Kasir Ramah</span>
                    <span className="text-[9px] text-slate-400">Ustadzah</span>
                  </div>

                  <span className="text-slate-600 font-bold text-xs">← Meja Kasir ←</span>

                  {/* Queue spots */}
                  {[1, 2, 3, 4, 5].map((pos) => {
                    const isUser = snapshot.queuePosition === pos;
                    return (
                      <div
                        key={pos}
                        className={`flex flex-col items-center p-2.5 rounded-2xl border transition ${
                          isUser
                            ? 'bg-amber-950/80 border-amber-400 text-amber-300 shadow-lg ring-2 ring-amber-400/40'
                            : 'bg-slate-900/60 border-slate-700 text-slate-400'
                        }`}
                      >
                        <span className="text-2xl">
                          {pos === 1 ? '👦🏻' : pos === 2 ? '👧🏻' : pos === 3 ? '👦🏽' : pos === 4 ? '👧🏼' : '👦🏿'}
                        </span>
                        <span className="text-[11px] font-bold mt-1">
                          {isUser ? '⭐ Giliran Anda' : `Antrean #${pos}`}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {pos === 1 ? 'Maju Kasir' : 'Sabar Menunggu'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3 Kata Ajaib / Polite Words Practice */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950/60 border border-indigo-500/40 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquareHeart className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-base font-black text-white">Pembiasaan Kata Santun &amp; Berkah</h3>
                  </div>
                  <span className="text-xs text-indigo-300 font-medium">Ketuk untuk Melafalkan</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  {(Object.keys(hariPasarEngine.politeWords) as PoliteWordId[]).map((wId) => {
                    const word = hariPasarEngine.politeWords[wId];
                    const isSelected = snapshot.activePoliteWord === wId;
                    return (
                      <button
                        key={wId}
                        onClick={() => handleSelectPoliteWord(wId)}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition transform active:scale-95 ${
                          isSelected
                            ? 'bg-indigo-600/40 border-indigo-400 text-white shadow-lg ring-2 ring-indigo-400/40'
                            : 'bg-slate-800/60 border-slate-700 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{word.icon}</span>
                          <span className="text-[10px] font-bold bg-slate-900/60 px-2 py-0.5 rounded text-amber-300">
                            {word.arabicMeaning}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white">{word.label}</h4>
                          <p className="text-[10px] text-slate-300 mt-1 leading-snug">{word.usageContext}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: P4 — KERANJANG CERIA */}
        {activeTab === 'BASKET' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
                    P4
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Keranjang Belanja Ceria Berjalan Pelan</h2>
                    <p className="text-xs text-slate-400">Buah melambai ceria, sayur tersenyum menyemangati hari belanja</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectPhase('MARKET_STORY')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <span>Putar Cerita Pasar (20s)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Animated Basket Showcase */}
              <div className="relative bg-gradient-to-b from-sky-900/60 via-slate-900 to-amber-950/70 rounded-2xl border border-slate-700/80 p-6 min-h-[300px] flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <ShoppingCart className="w-4 h-4" />
                    Isi Keranjang Belanja: {snapshot.basketItems.length} Barang Halal
                  </span>
                  <span>✨ Buah Melambai &amp; Sayur Tersenyum</span>
                </div>

                {/* Animated Basket Items */}
                <div className="my-6 flex items-center justify-center gap-4 flex-wrap">
                  {snapshot.basketItems.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="text-5xl opacity-40">🧺</span>
                      <p className="text-xs text-slate-400 mt-2">Keranjang masih kosong, mari ambil barang di Stan Pasar!</p>
                    </div>
                  ) : (
                    snapshot.basketItems.map((item) => (
                      <motion.div
                        key={item.id}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="bg-slate-900/90 border border-amber-500/40 p-4 rounded-2xl flex flex-col items-center text-center shadow-lg relative min-w-[130px]"
                      >
                        <span className="text-4xl mb-1">{item.icon}</span>
                        <span className="text-xs font-bold text-white">{item.name}</span>
                        <span className="text-[10px] text-emerald-400 mt-0.5">Melambai Ceria 👋</span>
                        <button
                          onClick={() => hariPasarEngine.removeItemFromBasket(item.id)}
                          className="mt-2 text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Keluarkan</span>
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Quick Add Helper */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-slate-700/80">
                  <span className="text-xs text-slate-400">Tambah Cepat:</span>
                  <button
                    onClick={() => hariPasarEngine.addItemToBasket('Pisang Emas', '🍌')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 border border-slate-700"
                  >
                    🍌 Pisang
                  </button>
                  <button
                    onClick={() => hariPasarEngine.addItemToBasket('Wortel Segar', '🥕')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 border border-slate-700"
                  >
                    🥕 Wortel
                  </button>
                  <button
                    onClick={() => hariPasarEngine.addItemToBasket('Roti Gandum', '🍞')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 border border-slate-700"
                  >
                    🍞 Roti
                  </button>
                  <button
                    onClick={() => hariPasarEngine.addItemToBasket('Bunga Melati', '🌸')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 border border-slate-700"
                  >
                    🌸 Melati
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: P5 — CERITA PASAR 20 DETIK */}
        {activeTab === 'STORY' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
                    P5
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Cerita Pasar Ceria (20 Detik)</h2>
                    <p className="text-xs text-slate-400">Asy membeli buah, Syifa membeli buku, semua saling tolong menolong</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {snapshot.isStoryPlaying ? (
                    <button
                      onClick={() => hariPasarEngine.stopMarketStory()}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Jeda Cerita</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => hariPasarEngine.startMarketStory(20)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Mulai Cerita (20s)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress 20 Detik */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700/80 mb-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Waktu Cerita Pasar: {snapshot.storyProgressSeconds} / 20 Detik
                  </span>
                  <span className="text-slate-400">
                    {snapshot.isStoryPlaying ? '🎬 Cerita Sedang Mengalir...' : '⏸️ Siap Menonton'}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-red-500 to-emerald-500 transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${(snapshot.storyProgressSeconds / 20) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Story Stage Scenes */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/60 border border-amber-500/40 rounded-2xl p-6 min-h-[280px] flex flex-col justify-center items-center text-center">
                {snapshot.storyProgressSeconds < 6 ? (
                  <div className="space-y-3">
                    <div className="text-5xl">🍎👦🏻</div>
                    <h3 className="text-lg font-black text-amber-300">Babak 1: Asy Memilih Buah Segar</h3>
                    <p className="text-sm text-slate-300 max-w-md">
                      Dek Asy mendatangi Stan Buah Berkah. Dengan ramah berkata: “Tolong apel manisnya, Kak Budi.” Kak Budi tersenyum hangat menyerahkan apel terbaik.
                    </p>
                  </div>
                ) : snapshot.storyProgressSeconds < 14 ? (
                  <div className="space-y-3">
                    <div className="text-5xl">📚👧🏻</div>
                    <h3 className="text-lg font-black text-blue-300">Babak 2: Syifa Memilih Buku Dongeng</h3>
                    <p className="text-sm text-slate-300 max-w-md">
                      Dek Syifa membaca buku doa di Stan Buku. Ustadzah Fatimah menemani dengan penuh kasih. Syifa berkata: “Terima kasih ustadzah atas ilmunya!”
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-5xl">🤝✨</div>
                    <h3 className="text-lg font-black text-emerald-300">Babak 3: Bersama Menuju Koperasi &amp; Berbagi</h3>
                    <p className="text-sm text-slate-300 max-w-md">
                      Asy &amp; Syifa bersama teman-teman antre rapi di meja kasir. Mengucapkan Alhamdulillah dan saling berbagi senyuman bahagia.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: P6 — KARTU BELANJA KENANGAN */}
        {activeTab === 'CARD' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
                    P6
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Kartu Belanja Kenangan (Cap Kebaikan)</h2>
                    <p className="text-xs text-slate-400">100% Apresiasi murni tanpa skor, tanpa poin, tanpa ranking</p>
                  </div>
                </div>
              </div>

              {/* Card Booklet Layout */}
              <div className="bg-gradient-to-br from-amber-950/70 via-slate-900 to-emerald-950/60 border-2 border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl">
                      💳
                    </div>
                    <div>
                      <h3 className="text-base font-black text-amber-300 tracking-wide uppercase">
                        KARTU KENANGAN HARI PASAR CERIA
                      </h3>
                      <p className="text-xs text-slate-300">TK Asy Syifa — Catatan Karakter &amp; Akhlak Mulia</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                    {snapshot.stampedBadges.length} Cap Kebaikan
                  </div>
                </div>

                {/* Stamped Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Sahabat Jujur', icon: '⭐', desc: 'Membayar dan menerima kembalian dengan jujur' },
                    { name: 'Budaya Antre Rapi', icon: '🚶‍♂️', desc: 'Sabar menunggu giliran tanpa berebut' },
                    { name: 'Ucapan Santun', icon: '🙏', desc: 'Membiasakan Tolong, Terima Kasih, & Alhamdulillah' },
                    { name: 'Peduli & Berbagi', icon: '💖', desc: 'Membantu membawakan belanjaan teman' },
                    { name: 'Penyayang Makanan Sehat', icon: '🍎', desc: 'Memilih buah dan sayur kaya gizi' },
                    { name: 'Penjaga Kebersihan Pasar', icon: '🌿', desc: 'Membuang bungkus pada tempatnya' }
                  ].map((badge, idx) => {
                    const isUnlocked = snapshot.stampedBadges.includes(badge.name);
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition ${
                          isUnlocked
                            ? 'bg-amber-950/40 border-amber-500/60 text-white shadow-md'
                            : 'bg-slate-900/40 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{badge.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-200">{badge.name}</h4>
                            <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{badge.desc}</p>
                          </div>
                        </div>
                        {isUnlocked ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-400 flex items-center justify-center text-emerald-400 text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              hariPasarEngine.addStampBadge(badge.name);
                              setSpeechBubbleText(`“Cap kebaikan ${badge.name} berhasil ditambahkan!”`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 text-xs font-bold border border-amber-500/40"
                          >
                            Cap
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: P7 — FOUNDER PASAR CONTROL COCKPIT */}
        {activeTab === 'FOUNDER' && (
          <div className="space-y-6">
            <div className="bg-slate-800/90 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4 border-b border-indigo-500/30 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold">
                    P7
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Founder Pasar Control Cockpit</h2>
                    <p className="text-xs text-indigo-300">Uji suara pasar, uji antre, simulasi otomatis, dan audit Black Box Ring-0</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Uji Suara Pasar */}
                <div className="bg-slate-900/80 border border-slate-700/80 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-amber-400 block">🔔 Uji Suara Pasar</span>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => hariPasarEngine.playMarketBell()}
                      className="w-full py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between"
                    >
                      <span>Lonceng Pasar</span>
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <button
                      onClick={() => hariPasarEngine.playCashierChime()}
                      className="w-full py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between"
                    >
                      <span>Denting Kasir</span>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                    <button
                      onClick={() => hariPasarEngine.playBasketDropSound()}
                      className="w-full py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between"
                    >
                      <span>Dentingan Keranjang</span>
                      <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                    </button>
                    <button
                      onClick={() => hariPasarEngine.playStampSound()}
                      className="w-full py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between"
                    >
                      <span>Cap Stempel</span>
                      <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                    </button>
                  </div>
                </div>

                {/* Uji Antre & Kata Santun */}
                <div className="bg-slate-900/80 border border-slate-700/80 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-emerald-400 block">🚶‍♂️ Uji Antre &amp; Adab</span>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => hariPasarEngine.advanceQueue()}
                      className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 text-xs font-semibold flex items-center justify-between border border-emerald-500/40"
                    >
                      <span>Maju Antrean #{snapshot.queuePosition}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => hariPasarEngine.selectPoliteWord('TOLONG')}
                      className="w-full py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center justify-between"
                    >
                      <span>Uji: "Tolong"</span>
                      <span>🤲</span>
                    </button>
                    <button
                      onClick={() => hariPasarEngine.selectPoliteWord('TERIMA_KASIH')}
                      className="w-full py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center justify-between"
                    >
                      <span>Uji: "Terima Kasih"</span>
                      <span>🙏</span>
                    </button>
                    <button
                      onClick={() => hariPasarEngine.selectPoliteWord('ALHAMDULILLAH')}
                      className="w-full py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center justify-between"
                    >
                      <span>Uji: "Alhamdulillah"</span>
                      <span>✨</span>
                    </button>
                  </div>
                </div>

                {/* Simulasi Otomatis Pasar */}
                <div className="bg-slate-900/80 border border-slate-700/80 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-indigo-400 block">🎬 Simulasi Pasar P1–P6</span>
                  {snapshot.isAutoPlayingPasar ? (
                    <button
                      onClick={() => hariPasarEngine.stopFullPasarSimulation()}
                      className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Hentikan Simulasi</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => hariPasarEngine.startFullPasarSimulation()}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Mulai Auto Tour (P1–P6)</span>
                    </button>
                  )}
                  <p className="text-[10px] text-slate-400 mt-2">
                    Menguji transisi otomatis seluruh alur Hari Pasar Ceria secara sekuensial.
                  </p>
                </div>

                {/* Audit Black Box Ring-0 */}
                <div className="bg-slate-900/80 border border-slate-700/80 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-purple-400 block">🛡️ Audit Black Box Ring-0</span>
                  <div className="text-[11px] text-slate-300 space-y-1 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <p className="text-emerald-400 font-bold">✓ Audit Protocol Active</p>
                    <p>Fase: {snapshot.currentPhase}</p>
                    <p>Stan Aktif: {snapshot.activeStall}</p>
                    <p>Isi Keranjang: {snapshot.basketItems.length}</p>
                    <p>Cap Apresiasi: {snapshot.stampedBadges.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HariPasarHub;
