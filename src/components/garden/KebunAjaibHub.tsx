/**
 * TADE SPRINT G40 — KEBUN AJAIB & PANEN BERKAH HUB
 * Early Childhood Kindergarten Gardening, Nature Nurturing, Gratitude & MBG Harvest Hub
 * 
 * Features:
 * - P1: Gerbang Kebun Berkah (Gerbang bambu terbuka perlahan, burung pipit berkicau, sapaan Asy "Selamat datang di Kebun Berkah.")
 * - P2: Menanam Bersama (Wortel, Bayam, Kangkung, Tomat, Cabai, Bunga Matahari - tanah tersenyum, bibit melambai)
 * - P3: Menyiram Tanaman (Gembor kecil lucu, air mengalir pelan, daun bergoyang riang, pelangi kecil muncul)
 * - P4: Panen Berkah 20 Detik (Tanaman tumbuh subur, anak-anak memanen ceria, hasil panen disalurkan ke MBG)
 * - P5: Sahabat Kebun (Mimi si Kelinci, Bubu si Burung, Dodo penjaga kolam, Gogo pengangkat keranjang)
 * - P6: Buku Panen Kenangan (Cap apresiasi stempel kebaikan: Daun Hijau, Wortel Ceria, Matahari Berkah, Gembor Sahabat)
 * - P7: Founder Kebun Control (Uji suara kebun, uji hujan rintik segar, simulasi panen otomatis P1–P6, audit Black Box Ring-0)
 * - Bonus: Burung pipit, lebah madu, kupu-kupu, capung, pelangi kecil, orang-orangan sawah tersenyum
 * 
 * Marker: G40_KEBUN_AJAIB_VERIFIED
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout,
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
  Droplets,
  Sun,
  CloudRain,
  Flower2,
  TreePine,
  Layers,
  ChevronRight,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Activity,
  Bookmark
} from 'lucide-react';
import kebunAjaibEngine, {
  KebunPhase,
  PlantId,
  GardenFriendId,
  KebunSnapshot
} from '../../services/kebunAjaibEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface KebunAjaibHubProps {
  onNavigateToMbg?: () => void;
  onNavigateToKotaMini?: () => void;
  onNavigateToPasarCeria?: () => void;
  onNavigateToSekolahBernapas?: () => void;
  onNavigateToDNA?: () => void;
  onNavigateToKamera?: () => void;
  onNavigateToPawaiNusantara?: () => void;
  onNavigateToAula?: () => void;
}

export const KebunAjaibHub: React.FC<KebunAjaibHubProps> = ({
  onNavigateToMbg,
  onNavigateToKotaMini,
  onNavigateToPasarCeria,
  onNavigateToSekolahBernapas,
  onNavigateToDNA,
  onNavigateToKamera,
  onNavigateToPawaiNusantara,
  onNavigateToAula
}) => {
  const [snapshot, setSnapshot] = useState<KebunSnapshot>(kebunAjaibEngine.getSnapshot());
  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'PLANTING' | 'WATERING' | 'HARVEST' | 'FRIENDS' | 'BOOK' | 'FOUNDER'>('EXPLORE');
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [speechBubbleText, setSpeechBubbleText] = useState<string>(
    '“Selamat datang di Kebun Berkah TK Asy Syifa! Mari belajar merawat tanaman ciptaan Allah, bersyukur, dan memanen makanan sehat untuk MBG.”'
  );

  useEffect(() => {
    tadeAnimationGovernor.startAnimation('anim-kebun-ajaib');
    const unsub = kebunAjaibEngine.subscribe(() => {
      setSnapshot(kebunAjaibEngine.getSnapshot());
    });

    return () => {
      unsub();
      tadeAnimationGovernor.stopAnimation('anim-kebun-ajaib');
      kebunAjaibEngine.stopHarvestStory();
      kebunAjaibEngine.stopFullKebunSimulation();
    };
  }, []);

  const handleSelectPhase = (phase: KebunPhase) => {
    kebunAjaibEngine.setPhase(phase);
    if (phase === 'GATE_KEBUN') {
      setActiveTab('EXPLORE');
      setSpeechBubbleText('“Selamat datang di Kebun Berkah! Pintu bambu terbuka perlahan dan burung pipit berkicau riang.”');
    } else if (phase === 'PLANTING') {
      setActiveTab('PLANTING');
      setSpeechBubbleText('“Mari menanam bersama di tanah yang tersenyum! Ada wortel, bayam, kangkung, tomat, cabai, dan bunga matahari.”');
    } else if (phase === 'WATERING') {
      setActiveTab('WATERING');
      setSpeechBubbleText('“Segarnya air mengalir dari gembor kecil lucu! Daun-daun bergoyang gembira dan pelangi mungil tersenyum.”');
    } else if (phase === 'HARVEST_20S') {
      setActiveTab('HARVEST');
      setSpeechBubbleText('“Alhamdulillah! Saatnya panen berkah, hasil kebun segar kita bawa ke Dapur Makan Bergizi Gratis (MBG).”');
    } else if (phase === 'GARDEN_FRIENDS') {
      setActiveTab('FRIENDS');
      setSpeechBubbleText('“Kenalkan 4 sahabat kebun kita: Mimi si Kelinci, Bubu si Burung, Dodo penjaga kolam, dan Gogo pembawa keranjang!”');
    } else if (phase === 'HARVEST_BOOK') {
      setActiveTab('BOOK');
      setSpeechBubbleText('“Buku Panen Kenangan: setiap usaha merawat alam mendapat cap kenangan penuh kasih sayang.”');
    }
  };

  const handleSelectPlant = (plantId: PlantId) => {
    kebunAjaibEngine.selectPlant(plantId);
    const plant = kebunAjaibEngine.plants[plantId];
    setSpeechBubbleText(`“Memilih ${plant.name}: ${plant.careTip} ${plant.soilHumor}”`);
  };

  const handleSelectFriend = (friendId: GardenFriendId) => {
    kebunAjaibEngine.selectGardenFriend(friendId);
    const friend = kebunAjaibEngine.gardenFriends[friendId];
    setSpeechBubbleText(`“${friend.name} (${friend.role}): ${friend.greeting}”`);
  };

  const currentPlant = kebunAjaibEngine.plants[snapshot.activePlant];
  const currentFriend = kebunAjaibEngine.gardenFriends[snapshot.activeFriend];

  return (
    <div id="kebun-ajaib-root" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none pb-12">
      {/* Top Header */}
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-emerald-500/30 sticky top-0 z-50 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-green-600 to-amber-400 flex items-center justify-center shadow-md shadow-emerald-500/20 text-xl border border-white/20">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Sprint G40
                </span>
                <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Dr. Pulse 60 FPS
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-2">
                Kebun Ajaib &amp; Panen Berkah
                <span className="text-xs font-normal text-slate-400 hidden sm:inline">| TK Asy Syifa</span>
              </h1>
            </div>
          </div>

          {/* Ecosystem Navigation Links */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {onNavigateToPasarCeria && (
              <button
                onClick={onNavigateToPasarCeria}
                className="px-2.5 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-xs font-bold flex items-center gap-1 border border-amber-500/40 transition"
                title="Hari Pasar Ceria G39"
              >
                <span>🛒 Pasar Ceria</span>
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
            {onNavigateToSekolahBernapas && (
              <button
                onClick={onNavigateToSekolahBernapas}
                className="px-2.5 py-1.5 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-teal-200 text-xs font-bold flex items-center gap-1 border border-teal-500/40 transition"
                title="Sekolah Bernapas G29"
              >
                <span>🌬️ Bernapas</span>
              </button>
            )}
            {onNavigateToPawaiNusantara && (
              <button
                onClick={onNavigateToPawaiNusantara}
                className="px-2.5 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-bold flex items-center gap-1 border border-red-500/40 transition"
                title="Pawai Nusantara G38"
              >
                <span>🇮🇩 Pawai</span>
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
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div className="bg-slate-800/60 border-b border-slate-700/60 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              onClick={() => handleSelectPhase('GATE_KEBUN')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'EXPLORE'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🎋 Gerbang Berkah (P1)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('PLANTING')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'PLANTING'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🌱 Menanam Bersama (P2)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('WATERING')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'WATERING'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🚿 Menyiram Gembor (P3)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('HARVEST_20S')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'HARVEST'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🧺 Panen MBG 20s (P4)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('GARDEN_FRIENDS')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'FRIENDS'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🐰 Sahabat Kebun (P5)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('HARVEST_BOOK')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'BOOK'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>📖 Buku Panen (P6)</span>
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
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-800/90 to-amber-950/80 border border-emerald-500/40 rounded-3xl p-4 md:p-6 shadow-2xl relative overflow-hidden">
          {/* Bonus Atmosphere: Burung pipit, lebah madu, kupu-kupu, capung, orang-orangan sawah tersenyum */}
          <div className="absolute top-2 right-4 text-2xl opacity-70 animate-bounce pointer-events-none select-none">
            🐦
          </div>
          <div className="absolute top-10 right-20 text-xl opacity-70 animate-pulse pointer-events-none select-none">
            🐝
          </div>
          <div className="absolute top-16 right-8 text-xl opacity-70 pointer-events-none select-none">
            🦋
          </div>
          <div className="absolute bottom-2 left-4 text-2xl opacity-60 pointer-events-none select-none">
            🦗🌾
          </div>
          <div className="absolute bottom-2 right-8 text-2xl opacity-70 pointer-events-none select-none">
            🧑‍🌾✨
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
            {/* Avatar Dek Asy & Syifa */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-amber-500 flex items-center justify-center text-3xl shadow-lg border-2 border-white/40">
                  👦🏻
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white">
                  Asy
                </div>
              </div>
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-400 via-rose-400 to-emerald-400 flex items-center justify-center text-3xl shadow-lg border-2 border-white/40">
                  👧🏻
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white">
                  Syifa
                </div>
              </div>
            </div>

            {/* Sapaan Bubble */}
            <div className="flex-1 bg-slate-900/80 border border-emerald-400/30 rounded-2xl p-4 shadow-inner">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                  Sapaan Hangat Asy &amp; Syifa:
                </span>
                <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                  Syukur &amp; Merawat Alam
                </span>
              </div>
              <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed italic">
                {speechBubbleText}
              </p>
            </div>
          </div>
        </div>

        {/* Tab 1: P1 — GERBANG KEBUN BERKAH */}
        {activeTab === 'EXPLORE' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold">
                    P1
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Gerbang Bambu Kebun Berkah</h2>
                    <p className="text-xs text-slate-400">Pintu bambu terbuka perlahan dengan kicauan burung pipit ceria</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectPhase('PLANTING')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
                >
                  <span>Mulai Menanam Bersama</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 3D Visual Gerbang Bambu Kebun */}
              <div className="relative rounded-2xl bg-gradient-to-b from-sky-900/60 via-slate-900/90 to-emerald-950/70 border border-emerald-500/30 p-8 flex flex-col items-center justify-center text-center overflow-hidden min-h-[300px]">
                {/* Floating Sparrows & Leaves */}
                <div className="absolute top-4 left-8 flex items-center gap-2">
                  <span className="text-3xl animate-bounce">🐦</span>
                  <span className="text-2xl">🌿🌾</span>
                </div>
                <div className="absolute top-4 right-8 flex items-center gap-2">
                  <span className="text-2xl">🌱🍃</span>
                  <span className="text-3xl animate-bounce">🐦</span>
                </div>

                {/* Bamboo Gate Arch */}
                <div className="w-full max-w-xl border-t-8 border-x-8 border-emerald-600 rounded-t-3xl bg-emerald-950/50 p-6 relative shadow-2xl backdrop-blur-sm">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-slate-950 px-5 py-1 rounded-full text-xs font-black border-2 border-white shadow flex items-center gap-1.5">
                    <span>🎋</span> KEBUN BERKAH TK ASY SYIFA <span>🎋</span>
                  </div>

                  <div className="text-5xl md:text-6xl my-4 flex items-center justify-center gap-6">
                    <span>🥕</span>
                    <span>🏡</span>
                    <span>🌻</span>
                  </div>

                  <div className="bg-slate-900/90 border border-emerald-500/40 rounded-xl p-4 mt-4">
                    <p className="text-sm font-bold text-emerald-300">
                      "Selamat datang di Kebun Berkah."
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      Belajar mengenal asal mula makanan sehat, menyiram dengan penuh kasih, serta bersyukur atas rezeki berkah yang Allah tumbuhkan dari tanah.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <button
                    onClick={() => {
                      kebunAjaibEngine.playGateAndBirdChirp();
                      setSpeechBubbleText('“Suara pintu bambu berderit lembut diiringi kicauan burung pipit menyambut pagi di kebun!”');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-emerald-300 text-xs font-bold flex items-center gap-2 border border-emerald-500/30 shadow"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Dengarkan Kicau Burung Kebun</span>
                  </button>
                  <button
                    onClick={() => handleSelectPhase('WATERING')}
                    className="px-4 py-2 rounded-xl bg-sky-600/30 hover:bg-sky-600/50 text-sky-200 text-xs font-bold flex items-center gap-2 border border-sky-500/40 shadow"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    <span>Siram Tanaman dengan Gembor</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: P2 — MENANAM BERSAMA (6 TANAMAN) */}
        {activeTab === 'PLANTING' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold">
                    P2
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Menanam Bersama di Tanah Tersenyum</h2>
                    <p className="text-xs text-slate-400">Pilih tanaman untuk melihat bibit melambai dan khasiat gizinya</p>
                  </div>
                </div>
              </div>

              {/* Plants Grid Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                {(Object.keys(kebunAjaibEngine.plants) as PlantId[]).map((plantId) => {
                  const plant = kebunAjaibEngine.plants[plantId];
                  const isSelected = snapshot.activePlant === plantId;
                  return (
                    <button
                      key={plantId}
                      onClick={() => handleSelectPlant(plantId)}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between transition ${
                        isSelected
                          ? 'bg-gradient-to-b from-emerald-600 to-green-700 text-white shadow-xl ring-2 ring-white/40'
                          : 'bg-slate-800/60 border-slate-700 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="relative mb-1">
                        <span className="text-3xl">{plant.emoji}</span>
                        <span className="absolute -bottom-1 -right-1 text-xs">🌱</span>
                      </div>
                      <span className="text-xs font-bold truncate w-full">{plant.name.split(' ')[0]}</span>
                      <span className="text-[10px] opacity-80 mt-0.5 truncate w-full">{plant.category.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Plant Detail Showcase */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950/60 border border-emerald-500/40 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Plant Avatar / 3D Seedling */}
                  <div className="w-28 h-28 rounded-3xl bg-emerald-950/80 border-2 border-emerald-400/50 flex flex-col items-center justify-center text-5xl shadow-inner">
                    <span>{currentPlant.emoji}</span>
                    <span className="text-[10px] font-bold text-emerald-300 mt-1">Bibit Melambai 👋</span>
                  </div>

                  {/* Plant Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                          {currentPlant.category}
                        </span>
                        <h3 className="text-xl font-black text-white">{currentPlant.name}</h3>
                        <span className="text-xs text-slate-400">{currentPlant.growthTime}</span>
                      </div>
                      <button
                        onClick={() => {
                          kebunAjaibEngine.addHarvestItem(currentPlant.name, currentPlant.emoji);
                          setSpeechBubbleText(`“Alhamdulillah, memanen ${currentPlant.name} untuk MBG!”`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/40 hover:bg-emerald-600/60 text-emerald-200 text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5 shadow"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Panen ke Keranjang MBG</span>
                      </button>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3">
                      <p className="text-xs font-bold text-amber-300">Khasiat &amp; Gizi MBG:</p>
                      <p className="text-sm text-slate-200 italic mt-0.5">{currentPlant.mbgNutrient}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                        <h4 className="text-xs font-bold text-emerald-300">Cara Merawat dengan Kasih:</h4>
                        <p className="text-[11px] text-slate-300 mt-1">{currentPlant.careTip}</p>
                      </div>
                      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                        <h4 className="text-xs font-bold text-amber-300">Kata Tanah Tersenyum:</h4>
                        <p className="text-[11px] text-slate-300 mt-1">{currentPlant.soilHumor}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: P3 — MENYIRAM TANAMAN DENGAN GEMBOR */}
        {activeTab === 'WATERING' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold">
                    P3
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Menyiram Tanaman dengan Gembor Lucu</h2>
                    <p className="text-xs text-slate-400">Air sejuk mengalir pelan, daun bergoyang riang, dan pelangi kecil mekar</p>
                  </div>
                </div>
              </div>

              {/* Interactive Watering Stage */}
              <div className="bg-gradient-to-b from-sky-950/70 via-slate-900 to-emerald-950/80 rounded-2xl p-6 border border-sky-500/40 mb-6 relative overflow-hidden">
                {/* Rainbow overlay if watered */}
                {snapshot.hasRainbow && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl font-black text-center animate-pulse flex items-center gap-2">
                    <span>🌈</span>
                    <span className="text-xs text-amber-300 bg-slate-900/80 px-3 py-1 rounded-full border border-amber-400/40">
                      Pelangi Kecil Ceria Hadir Menyapa!
                    </span>
                    <span>🌈</span>
                  </div>
                )}

                <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                  {/* Animated Gembor */}
                  <motion.div
                    animate={{ rotate: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-6xl cursor-pointer"
                    onClick={() => {
                      kebunAjaibEngine.waterGarden();
                      setSpeechBubbleText('“Currrr... gembor kecil lucu mengucurkan air sejuk ke tanaman!”');
                    }}
                  >
                    🚿💧
                  </motion.div>

                  <div className="max-w-md w-full">
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                      <span className="font-bold flex items-center gap-1 text-sky-400">
                        <Droplets className="w-4 h-4" />
                        Tingkat Kesejukan Tanah:
                      </span>
                      <span className="font-black text-emerald-400">{snapshot.waterLevel}% Segar</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500 rounded-full"
                        style={{ width: `${snapshot.waterLevel}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        kebunAjaibEngine.waterGarden();
                        setSpeechBubbleText('“Alhamdulillah, tanaman segar berseri tersenyum terkena tetesan air bersih!”');
                      }}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-2 shadow"
                    >
                      <Droplets className="w-4 h-4" />
                      <span>Siram Kebun Sekarang</span>
                    </button>
                    <button
                      onClick={() => {
                        kebunAjaibEngine.playWateringDrops();
                        setSpeechBubbleText('“Suara tetesan air gembor menyejukkan dedaunan kebun!”');
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-sky-300 text-xs font-bold border border-sky-500/30"
                    >
                      <span>Tes Suara Air</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: P4 — PANEN BERKAH (20 DETIK) KE MBG */}
        {activeTab === 'HARVEST' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold">
                    P4
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Panen Berkah (20 Detik) Disalurkan ke MBG</h2>
                    <p className="text-xs text-slate-400">Sayur dan buah tumbuh subur, dipanen bersama, lalu dibawa ke dapur Makan Bergizi Gratis</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {snapshot.isHarvesting ? (
                    <button
                      onClick={() => kebunAjaibEngine.stopHarvestStory()}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Jeda Panen</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => kebunAjaibEngine.startHarvestStory(20)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Mulai Panen Berkah (20s)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress 20 Detik */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700/80 mb-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Waktu Panen Berkah: {snapshot.harvestProgressSeconds} / 20 Detik
                  </span>
                  <span className="text-slate-400">
                    {snapshot.isHarvesting ? '🚜 Panen Berlangsung Ceria...' : '⏸️ Siap Melakukan Panen'}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-green-500 to-amber-400 transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${(snapshot.harvestProgressSeconds / 20) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Harvest Stage Scenes */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950/60 border border-emerald-500/40 rounded-2xl p-6 min-h-[280px] flex flex-col justify-center items-center text-center">
                {snapshot.harvestProgressSeconds < 6 ? (
                  <div className="space-y-3">
                    <div className="text-5xl">🌱☀️🧑‍🌾</div>
                    <h3 className="text-lg font-black text-emerald-300">Babak 1: Tanaman Tumbuh Subur &amp; Mekar</h3>
                    <p className="text-sm text-slate-300 max-w-md">
                      Dengan sinar mentari pagi dan air berkah, wortel, bayam, dan tomat siap dipetik dengan tangan yang bersih.
                    </p>
                  </div>
                ) : snapshot.harvestProgressSeconds < 14 ? (
                  <div className="space-y-3">
                    <div className="text-5xl">🥕🥬🧺</div>
                    <h3 className="text-lg font-black text-amber-300">Babak 2: Anak-anak Memanen dengan Syukur</h3>
                    <p className="text-sm text-slate-300 max-w-md">
                      Dek Asy, Syifa, dan teman-teman memetik sayuran dengan hati gembira sambil melafalkan ucapan Alhamdulillah.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-5xl">🍱🚚✨</div>
                    <h3 className="text-lg font-black text-emerald-300">Babak 3: Hasil Panen Disalurkan ke Dapur MBG</h3>
                    <p className="text-sm text-slate-300 max-w-md">
                      Keranjang sayur diantarkan ke Dapur Makan Bergizi Gratis (MBG G31) untuk diolah menjadi hidangan sehat lezat seluruh anak sekolah!
                    </p>
                  </div>
                )}
              </div>

              {/* Harvested Baskets Table */}
              <div className="mt-6 pt-4 border-t border-slate-700">
                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-3">
                  Keranjang Hasil Panen untuk MBG:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {snapshot.harvestedBaskets.map((b) => (
                    <div
                      key={b.id}
                      className="bg-slate-900/80 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{b.icon}</span>
                        <div>
                          <span className="text-xs font-bold text-white block">{b.name}</span>
                          <span className="text-[10px] text-emerald-400">Siap Dapur MBG</span>
                        </div>
                      </div>
                      <span className="text-xs font-black bg-emerald-950 px-2 py-1 rounded text-emerald-300 border border-emerald-500/40">
                        {b.count} Ikat/Buah
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: P5 — SAHABAT KEBUN */}
        {activeTab === 'FRIENDS' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold">
                    P5
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">4 Sahabat Kebun yang Setia Membantu</h2>
                    <p className="text-xs text-slate-400">Mimi si Kelinci, Bubu si Burung, Dodo si Kura-kura, dan Gogo si Beruang Mini</p>
                  </div>
                </div>
              </div>

              {/* Friends Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {(Object.keys(kebunAjaibEngine.gardenFriends) as GardenFriendId[]).map((fId) => {
                  const friend = kebunAjaibEngine.gardenFriends[fId];
                  const isSelected = snapshot.activeFriend === fId;
                  return (
                    <button
                      key={fId}
                      onClick={() => handleSelectFriend(fId)}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition ${
                        isSelected
                          ? 'bg-gradient-to-b from-emerald-600/60 to-green-800/60 border-emerald-400 text-white shadow-xl ring-2 ring-emerald-400/40'
                          : 'bg-slate-800/60 border-slate-700 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-4xl">{friend.icon}</span>
                        <span className="text-[10px] font-bold bg-slate-900/60 px-2 py-0.5 rounded text-amber-300">
                          {friend.species}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white">{friend.name}</h3>
                        <p className="text-[11px] text-emerald-300 font-medium mt-0.5">{friend.role}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Friend Showcase */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950/60 border border-emerald-500/40 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400/50 flex items-center justify-center text-5xl shadow-inner">
                    {currentFriend.icon}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-white">{currentFriend.name}</h3>
                      <span className="text-xs text-amber-400 font-bold bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                        {currentFriend.role}
                      </span>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3">
                      <p className="text-xs font-bold text-emerald-300">Pesan Sahabat Kebun:</p>
                      <p className="text-sm text-slate-200 italic mt-0.5">{currentFriend.greeting}</p>
                    </div>
                    <p className="text-xs text-slate-300">
                      <span className="font-bold text-amber-300">Tugas Kebaikan:</span> {currentFriend.specialAction}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: P6 — BUKU PANEN KENANGAN */}
        {activeTab === 'BOOK' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold">
                    P6
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Buku Panen Kenangan (Cap Kebaikan)</h2>
                    <p className="text-xs text-slate-400">100% Apresiasi murni tanpa skor, tanpa poin, tanpa ranking</p>
                  </div>
                </div>
              </div>

              {/* Book Layout */}
              <div className="bg-gradient-to-br from-emerald-950/70 via-slate-900 to-amber-950/60 border-2 border-emerald-500/40 rounded-3xl p-6 md:p-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-2xl">
                      📖
                    </div>
                    <div>
                      <h3 className="text-base font-black text-emerald-300 tracking-wide uppercase">
                        BUKU PANEN KENANGAN KEBUN BERKAH
                      </h3>
                      <p className="text-xs text-slate-300">TK Asy Syifa — Jejak Cinta Alam &amp; Syukur</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                    {snapshot.stampedBadges.length} Cap Kenangan
                  </div>
                </div>

                {/* Stamped Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Daun Hijau', icon: '🍃', desc: 'Menjaga dan menyayangi daun segar' },
                    { name: 'Wortel Ceria', icon: '🥕', desc: 'Menanam umbi kaya vitamin A' },
                    { name: 'Matahari Berkah', icon: '🌻', desc: 'Menebar senyuman hangat bersyukur' },
                    { name: 'Gembor Sahabat', icon: '🚿', desc: 'Menyiram air dengan lembut & hemat' },
                    { name: 'Sahabat Cacing Tanah', icon: '🪱', desc: 'Membiarkan tanah tetap gembur & sehat' },
                    { name: 'Penyalur MBG', icon: '🍱', desc: 'Membagikan hasil panen untuk teman-teman' }
                  ].map((badge, idx) => {
                    const isUnlocked = snapshot.stampedBadges.includes(badge.name);
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition ${
                          isUnlocked
                            ? 'bg-emerald-950/40 border-emerald-500/60 text-white shadow-md'
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
                            onClick={() => kebunAjaibEngine.addStampBadge(badge.name)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-emerald-300 border border-slate-700"
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

        {/* Tab 7: P7 — FOUNDER KEBUN CONTROL */}
        {activeTab === 'FOUNDER' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-indigo-500/40 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold">
                    P7
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Founder Kebun Control Cockpit</h2>
                    <p className="text-xs text-slate-400">Pengujian sistem audio kebun, simulasi panen otomatis, dan audit Black Box Ring-0</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {snapshot.isAutoPlayingKebun ? (
                    <button
                      onClick={() => kebunAjaibEngine.stopFullKebunSimulation()}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Hentikan Simulasi</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => kebunAjaibEngine.startFullKebunSimulation()}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Mulai Simulasi P1–P6</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sound & Control Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-bold text-emerald-400">1. Uji Suara Gerbang &amp; Burung</span>
                  <p className="text-[11px] text-slate-400">Frekuensi gesekan bambu &amp; kicau burung pipit</p>
                  <button
                    onClick={() => kebunAjaibEngine.playGateAndBirdChirp()}
                    className="w-full py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-bold border border-emerald-500/40"
                  >
                    Bunyikan Gerbang &amp; Kicau
                  </button>
                </div>

                <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-bold text-sky-400">2. Uji Hujan Rintik &amp; Gembor</span>
                  <p className="text-[11px] text-slate-400">Sintesis tetesan air sejuk menetes ke tanah</p>
                  <button
                    onClick={() => kebunAjaibEngine.playWateringDrops()}
                    className="w-full py-1.5 rounded-xl bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 text-xs font-bold border border-sky-500/40"
                  >
                    Bunyikan Tetesan Air
                  </button>
                </div>

                <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-bold text-amber-400">3. Uji Lonceng Panen Berkah</span>
                  <p className="text-[11px] text-slate-400">Alunan pentatonik kilau kebaikan panen MBG</p>
                  <button
                    onClick={() => kebunAjaibEngine.playHarvestChime()}
                    className="w-full py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 text-xs font-bold border border-amber-500/40"
                  >
                    Bunyikan Lonceng Panen
                  </button>
                </div>

                <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-bold text-indigo-400">4. Uji Suara Stempel Apresiasi</span>
                  <p className="text-[11px] text-slate-400">Ketukan cap kayu &amp; nada apresiasi 1046 Hz</p>
                  <button
                    onClick={() => kebunAjaibEngine.playStampSound()}
                    className="w-full py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-bold border border-indigo-500/40"
                  >
                    Bunyikan Suara Cap
                  </button>
                </div>
              </div>

              {/* Black Box Audit Card */}
              <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-black text-white">Audit Telemetri Black Box Ring-0</h4>
                    <p className="text-xs text-slate-400">
                      Seluruh interaksi edukasi merawat tanaman dan panen berkah tercatat aman pada sistem audit.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-300 font-bold bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-500/40">
                    STATUS: G40_KEBUN_AJAIB_VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default KebunAjaibHub;
