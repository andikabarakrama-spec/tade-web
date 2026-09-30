/**
 * TADE SPRINT G41 — MASJID AL-BARAKAH HIDUP & KAMPUNG SHALIH HUB
 * Main Spiritual Landmark of TADE & Asy-Syifa Cinematic World
 * 
 * Features:
 * - P1: Masjid Al-Barakah Hidup (Kubah emas berkilau, bulan sabit tersenyum, lentera bergoyang, jendela berkedip, pintu membuka pelan, cahaya hangat masuk)
 * - P2: Jalan Menuju Masjid (Bunga melambai, kupu-kupu emas, burung pipit, paving berkilau, Trem Mini Barakah, Sepeda Ceria, Skuter Hijau, Gerobak Buku)
 * - P3: Air Wudhu Ceria (Tetesan air tersenyum, kran ramah, ikan kecil, gelembung pelangi, percikan air lembut, urutan wudhu 8 langkah edukasi)
 * - P4: Shaf Kecil Ceria (DNA G20: langkah kecil, anggukan, senyum, lambaian, sajadah hidup, rak sandal rapi, rak Al-Qur'an kecil, cahaya lembut)
 * - P5: Menara Cahaya (Burung mengitari menara, cahaya sore, bintang muncul, bulan tersenyum, awan lewat, lentera malam otomatis)
 * - P6: Halaman Masjid Bernapas (Pohon kurma, pohon melati, kolam koi, merpati putih, tupai kecil, Ayunan Lentera, Bangku Hikmah, Pohon Doa)
 * - P7: Founder Masjid Control Cockpit (Simulasi pagi-siang-sore-malam, uji suara wudhu, uji burung, uji lentera, uji transportasi, audit Ring-0)
 * - Bonus 1: Parade Jumat Ceria 20 Detik (Dek Asy, Mbak Syifa, Bubu, Gogo, Mimi, Dodo, Titi, Rara, Trem Mini, Gerobak Buku, Balon hijau putih)
 * - Bonus 2: MBG Menuju Masjid (Bus MBG -> Makan bersama -> Jaga kebersihan -> Alhamdulillah -> Berjalan ke Masjid)
 * - Bonus 3: Kejutan Rahasia (Bintang Doa, Kupu-kupu Barakah, Merpati Putih, Lentera Emas ke Paspor Petualang tanpa poin)
 * 
 * Marker: G41_MASJID_AL_BARAKAH_VERIFIED
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Droplets,
  Heart,
  Users,
  CheckCircle2,
  Award,
  TreePine,
  ChevronRight,
  ShieldCheck,
  Activity,
  Layers,
  ArrowRight,
  Plus
} from 'lucide-react';
import masjidAlBarakahEngine, {
  MasjidPhase,
  TimeOfDay,
  TransportId,
  MasjidSnapshot
} from '../../services/masjidAlBarakahEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface MasjidAlBarakahHubProps {
  onNavigateToMbg?: () => void;
  onNavigateToKotaMini?: () => void;
  onNavigateToPasarCeria?: () => void;
  onNavigateToKebunAjaib?: () => void;
  onNavigateToSekolahBernapas?: () => void;
  onNavigateToDNA?: () => void;
  onNavigateToKamera?: () => void;
  onNavigateToPetaDunia?: () => void;
  onNavigateToPawaiNusantara?: () => void;
  onNavigateToAula?: () => void;
}

export const MasjidAlBarakahHub: React.FC<MasjidAlBarakahHubProps> = ({
  onNavigateToMbg,
  onNavigateToKotaMini,
  onNavigateToPasarCeria,
  onNavigateToKebunAjaib,
  onNavigateToSekolahBernapas,
  onNavigateToDNA,
  onNavigateToKamera,
  onNavigateToPetaDunia,
  onNavigateToPawaiNusantara,
  onNavigateToAula
}) => {
  const [snapshot, setSnapshot] = useState<MasjidSnapshot>(masjidAlBarakahEngine.getSnapshot());
  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'PATHWAY' | 'WUDHU' | 'SHAF' | 'MINARET' | 'COURTYARD' | 'PARADE' | 'FOUNDER'>('EXPLORE');
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [speechBubbleText, setSpeechBubbleText] = useState<string>(
    '“Assalamu’alaikum warahmatullah! Selamat datang di Masjid Al-Barakah, landmark utama kebaikan dan tempat belajar ibadah ceria bersama Asy & Syifa.”'
  );

  useEffect(() => {
    tadeAnimationGovernor.startAnimation('anim-masjid-barakah');
    const unsub = masjidAlBarakahEngine.subscribe(() => {
      setSnapshot(masjidAlBarakahEngine.getSnapshot());
    });

    return () => {
      unsub();
      tadeAnimationGovernor.stopAnimation('anim-masjid-barakah');
      masjidAlBarakahEngine.stopFridayParade();
      masjidAlBarakahEngine.stopFullMasjidSimulation();
    };
  }, []);

  const handleSelectPhase = (phase: MasjidPhase) => {
    masjidAlBarakahEngine.setPhase(phase);
    if (phase === 'LANDMARK') {
      setActiveTab('EXPLORE');
      setSpeechBubbleText('“Dek Asy: Assalamu’alaikum, mari kita ke Masjid Al-Barakah! Mbak Syifa: Bismillah, kita belajar bersama.”');
    } else if (phase === 'PATHWAY') {
      setActiveTab('PATHWAY');
      setSpeechBubbleText('“Menyusuri Jalan Menuju Masjid berbunga melati dengan Trem Mini Barakah dan Sepeda Ceria yang berjalan santun!”');
    } else if (phase === 'WUDHU') {
      setActiveTab('WUDHU');
      setSpeechBubbleText('“Segarnya Area Air Wudhu Ceria! Tetesan air tersenyum dan gelembung pelangi menemani 8 langkah wudhu yang bersih.”');
    } else if (phase === 'SHAF') {
      setActiveTab('SHAF');
      setSpeechBubbleText('“Shaf Kecil Ceria: sajadah hidup terhampar rapi, rak sandal tertata bersih, dan cahaya lembut menaungi jamaah cilik.”');
    } else if (phase === 'MINARET') {
      setActiveTab('MINARET');
      setSpeechBubbleText('“Menara Cahaya menjulang indah di langit senja dengan burung berputar riang dan lentera emas menyala otomatis.”');
    } else if (phase === 'COURTYARD') {
      setActiveTab('COURTYARD');
      setSpeechBubbleText('“Halaman Masjid Bernapas: pohon kurma teduh, kolam koi berkilau, ayunan lentera, dan bangku hikmah tempat berkisah.”');
    } else if (phase === 'FRIDAY_PARADE') {
      setActiveTab('PARADE');
      setSpeechBubbleText('“Parade Jumat Ceria (20 Detik): seluruh sahabat Asy, Syifa, Bubu, Gogo, Mimi, Dodo, Titi, & Rara melangkah bersama ke masjid!”');
    }
  };

  const handleSetTime = (time: TimeOfDay) => {
    masjidAlBarakahEngine.setTimeOfDay(time);
    const labelMap: Record<TimeOfDay, string> = {
      DAWN: 'Subuh Berkah fajar merekah',
      NOON: 'Zuhur Cerah mentari bersinar',
      AFTERNOON: 'Ashar Sejuk angin sepoi',
      DUSK: 'Maghrib Syahdu senja jingga',
      NIGHT: 'Isya Tenang bertabur bintang'
    };
    setSpeechBubbleText(`“Suasana waktu masjid beralih ke ${labelMap[time]}. Lentera dan bayangan kubah emas menyesuaikan lembut!”`);
  };

  const getTimeBg = () => {
    switch (snapshot.timeOfDay) {
      case 'DAWN':
        return 'from-sky-950 via-indigo-950 to-amber-950/60';
      case 'NOON':
        return 'from-sky-800 via-blue-900 to-emerald-950/60';
      case 'AFTERNOON':
        return 'from-amber-950 via-slate-900 to-indigo-950';
      case 'DUSK':
        return 'from-purple-950 via-rose-950/80 to-slate-950';
      case 'NIGHT':
      default:
        return 'from-slate-950 via-indigo-950 to-slate-900';
    }
  };

  const currentWudhu = masjidAlBarakahEngine.wudhuSteps.find(
    (w) => w.stepNumber === snapshot.activeWudhuStep
  ) || masjidAlBarakahEngine.wudhuSteps[0];

  const currentTransport = masjidAlBarakahEngine.transports[snapshot.activeTransport];

  return (
    <div id="masjid-barakah-root" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none pb-12">
      {/* Top Header */}
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-amber-500/30 sticky top-0 z-50 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-600 to-indigo-900 flex items-center justify-center shadow-md shadow-amber-500/20 text-xl border border-white/20">
              🕌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  Sprint G41
                </span>
                <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Dr. Pulse 60 FPS
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-2">
                Masjid Al-Barakah Hidup &amp; Kampung Shalih
                <span className="text-xs font-normal text-amber-300 hidden sm:inline">| Landmark Utama TADE</span>
              </h1>
            </div>
          </div>

          {/* Ecosystem Navigation Links */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {onNavigateToKebunAjaib && (
              <button
                onClick={onNavigateToKebunAjaib}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-bold flex items-center gap-1 border border-emerald-500/40 transition"
                title="Kebun Ajaib & Panen Berkah G40"
              >
                <span>🌱 Kebun Ajaib</span>
              </button>
            )}
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
                className="px-2.5 py-1.5 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-teal-200 text-xs font-bold flex items-center gap-1 border border-teal-500/40 transition"
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
            {onNavigateToPetaDunia && (
              <button
                onClick={onNavigateToPetaDunia}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 text-xs font-bold flex items-center gap-1 border border-indigo-500/40 transition"
                title="Peta Dunia G28"
              >
                <span>🗺️ Peta Dunia</span>
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
              onClick={() => handleSelectPhase('LANDMARK')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'EXPLORE'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🕌 Masjid Hidup (P1)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('PATHWAY')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'PATHWAY'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🛣️ Jalan &amp; Trem (P2)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('WUDHU')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'WUDHU'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>💧 Air Wudhu Ceria (P3)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('SHAF')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'SHAF'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🕋 Shaf Kecil Ceria (P4)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('MINARET')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'MINARET'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>✨ Menara Cahaya (P5)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('COURTYARD')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'COURTYARD'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🌴 Halaman Bernapas (P6)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('FRIDAY_PARADE')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'PARADE'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🎉 Parade Jumat 20s</span>
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
        {/* Dek Asy & Mbak Syifa Sapaan Card */}
        <div className={`bg-gradient-to-r ${getTimeBg()} border border-amber-500/40 rounded-3xl p-4 md:p-6 shadow-2xl relative overflow-hidden transition-all duration-700`}>
          {/* Floating Atmosphere Elements: Kubah, Bintang, Burung, Bulan Sabit */}
          <div className="absolute top-2 right-4 text-2xl opacity-70 animate-pulse pointer-events-none select-none">
            🌙✨
          </div>
          <div className="absolute top-10 right-20 text-xl opacity-60 pointer-events-none select-none">
            🕊️🕊️
          </div>
          <div className="absolute bottom-2 right-8 text-2xl opacity-70 pointer-events-none select-none">
            🏮🌟
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
            {/* Avatar Dek Asy & Mbak Syifa */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-400 via-emerald-500 to-indigo-600 flex items-center justify-center text-3xl shadow-lg border-2 border-white/40">
                  👦🏻
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white">
                  Dek Asy
                </div>
              </div>
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-amber-400 flex items-center justify-center text-3xl shadow-lg border-2 border-white/40">
                  👧🏻
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white">
                  Mbak Syifa
                </div>
              </div>
            </div>

            {/* Sapaan Bubble */}
            <div className="flex-1 bg-slate-900/80 border border-amber-400/30 rounded-2xl p-4 shadow-inner">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  Sapaan Asy &amp; Syifa di Masjid Al-Barakah:
                </span>
                {/* Time of day quick selector */}
                <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700">
                  <button
                    onClick={() => handleSetTime('DAWN')}
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${snapshot.timeOfDay === 'DAWN' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
                    title="Fajar Subuh"
                  >
                    🌅 Subuh
                  </button>
                  <button
                    onClick={() => handleSetTime('NOON')}
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${snapshot.timeOfDay === 'NOON' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
                    title="Zuhur"
                  >
                    ☀️ Siang
                  </button>
                  <button
                    onClick={() => handleSetTime('DUSK')}
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${snapshot.timeOfDay === 'DUSK' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                    title="Maghrib Senja"
                  >
                    🌆 Senja
                  </button>
                  <button
                    onClick={() => handleSetTime('NIGHT')}
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${snapshot.timeOfDay === 'NIGHT' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                    title="Isya Malam"
                  >
                    🌙 Malam
                  </button>
                </div>
              </div>
              <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed italic">
                {speechBubbleText}
              </p>
            </div>
          </div>
        </div>

        {/* Tab 1: P1 — MASJID AL-BARAKAH HIDUP */}
        {activeTab === 'EXPLORE' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
                    P1
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Landmark Masjid Al-Barakah Hidup</h2>
                    <p className="text-xs text-slate-400">Kubah emas berkilau, bulan sabit tersenyum, lentera bergoyang, dan pintu membuka perlahan</p>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectPhase('PATHWAY')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow transition"
                >
                  <span>Menuju Jalan Masjid</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 3D Grand Mosque Landmark Stage */}
              <div className={`relative rounded-3xl bg-gradient-to-b ${getTimeBg()} border-2 border-amber-500/40 p-8 flex flex-col items-center justify-center text-center overflow-hidden min-h-[360px] shadow-2xl transition-all duration-700`}>
                {/* Floating Birds & Crescent */}
                <div className="absolute top-4 left-8 flex items-center gap-2">
                  <span className="text-3xl animate-bounce">🕊️</span>
                  <span className="text-xs text-amber-300 bg-slate-900/60 px-2.5 py-1 rounded-full border border-amber-400/30">
                    Merpati Putih Barakah
                  </span>
                </div>
                <div className="absolute top-4 right-8 flex items-center gap-2">
                  <span className="text-xs text-amber-300 bg-slate-900/60 px-2.5 py-1 rounded-full border border-amber-400/30">
                    Bulan Sabit Tersenyum
                  </span>
                  <span className="text-3xl animate-pulse">🌙</span>
                </div>

                {/* Grand Mosque Structure */}
                <div className="w-full max-w-2xl bg-slate-900/80 border-2 border-amber-400/50 rounded-3xl p-6 relative shadow-2xl backdrop-blur-md">
                  {/* Golden Dome */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="text-6xl drop-shadow-[0_0_15px_rgba(245,158,11,0.7)] animate-pulse">
                      🕌
                    </div>
                    <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-[11px] px-4 py-0.5 rounded-full border-2 border-white shadow mt-1">
                      KUBAH EMAS AL-BARAKAH
                    </span>
                  </div>

                  <div className="pt-10 pb-4 space-y-3">
                    <div className="text-4xl flex items-center justify-center gap-6 my-2">
                      <span className={snapshot.isLanternLit ? 'animate-pulse' : 'opacity-40'}>🏮</span>
                      <span>✨</span>
                      <span>📖</span>
                      <span>✨</span>
                      <span className={snapshot.isLanternLit ? 'animate-pulse' : 'opacity-40'}>🏮</span>
                    </div>

                    <div className="bg-slate-950/70 border border-emerald-500/30 rounded-2xl p-4 max-w-lg mx-auto">
                      <p className="text-sm font-bold text-amber-300 italic">
                        "Assalamu’alaikum, mari kita ke Masjid Al-Barakah. Bismillah, kita belajar bersama."
                      </p>
                      <p className="text-xs text-slate-300 mt-1">
                        Pintu kayu jati terbuka perlahan, memancarkan cahaya hangat nan menenteramkan untuk seluruh anak-anak shalih.
                      </p>
                    </div>
                  </div>

                  {/* Interactive Controls */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => {
                        masjidAlBarakahEngine.playMasjidChime();
                        masjidAlBarakahEngine.toggleDoor();
                        setSpeechBubbleText('“Pintu jati Masjid Al-Barakah berderit lembut membuka jalan masuk bagi jamaah cilik!”');
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 text-xs font-bold border border-amber-500/40 shadow flex items-center gap-1.5"
                    >
                      <span>🚪 {snapshot.isDoorOpen ? 'Tutup Pintu Pelan' : 'Buka Pintu Perlahan'}</span>
                    </button>
                    <button
                      onClick={() => {
                        masjidAlBarakahEngine.toggleLanterns();
                        setSpeechBubbleText('“Lentera-lentera masjid memancarkan pendar cahaya keemasan yang menyejukkan hati!”');
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-bold border border-indigo-500/40 shadow flex items-center gap-1.5"
                    >
                      <span>🏮 {snapshot.isLanternLit ? 'Redupkan Lentera' : 'Nyalakan Lentera'}</span>
                    </button>
                    <button
                      onClick={() => {
                        masjidAlBarakahEngine.playMasjidChime();
                        setSpeechBubbleText('“Alunan denting harpa barakah menyapa seisi kampung dengan penuh ketenteraman.”');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 text-xs font-bold border border-emerald-500/40 shadow flex items-center gap-1.5"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Denting Nada Barakah</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: P2 — JALAN MENUJU MASJID */}
        {activeTab === 'PATHWAY' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
                    P2
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Jalan Menuju Masjid &amp; Transportasi Ramah</h2>
                    <p className="text-xs text-slate-400">Paving berkilau, bunga melambai, kupu-kupu emas, Trem Mini Barakah, Sepeda Ceria, dan Gerobak Buku</p>
                  </div>
                </div>
              </div>

              {/* Transport Selector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {(Object.keys(masjidAlBarakahEngine.transports) as TransportId[]).map((tId) => {
                  const tr = masjidAlBarakahEngine.transports[tId];
                  const isSelected = snapshot.activeTransport === tId;
                  return (
                    <button
                      key={tId}
                      onClick={() => {
                        masjidAlBarakahEngine.selectTransport(tId);
                        setSpeechBubbleText(`“Memilih ${tr.name} (${tr.driver}): ${tr.description}”`);
                      }}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition ${
                        isSelected
                          ? 'bg-gradient-to-b from-amber-600/70 to-emerald-800/70 border-amber-400 text-white shadow-xl ring-2 ring-amber-400/40'
                          : 'bg-slate-800/60 border-slate-700 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-4xl">{tr.icon}</span>
                        <span className="text-[10px] font-black bg-slate-950/70 px-2 py-0.5 rounded text-amber-300">
                          {tr.speedText}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white">{tr.name}</h3>
                        <p className="text-[11px] text-amber-300 mt-0.5">Pengemudi: {tr.driver}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Pathway Showcase Stage */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/60 border border-amber-500/40 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-28 h-28 rounded-3xl bg-amber-950/80 border-2 border-amber-400/50 flex flex-col items-center justify-center text-5xl shadow-inner">
                    <span>{currentTransport.icon}</span>
                    <span className="text-[10px] font-bold text-amber-300 mt-1">Jalan Santun</span>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
                          KENDARAAN RAMAH LINGKUNGAN
                        </span>
                        <h3 className="text-xl font-black text-white">{currentTransport.name}</h3>
                        <span className="text-xs text-slate-400">Pengemudi: {currentTransport.driver}</span>
                      </div>
                      <button
                        onClick={() => {
                          masjidAlBarakahEngine.playTremBellSound();
                          setSpeechBubbleText('“Ting-ting! Suara lonceng lembut berbunyi menandakan jalanan masjid aman dan tertib.”');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-600/40 hover:bg-amber-600/60 text-amber-200 text-xs font-bold border border-amber-500/40 flex items-center gap-1.5 shadow"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Bunyikan Lonceng Ting-Ting</span>
                      </button>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3">
                      <p className="text-sm text-slate-200 italic">{currentTransport.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                        <h4 className="text-xs font-bold text-emerald-300">Suasana Jalan:</h4>
                        <p className="text-[11px] text-slate-300 mt-1">
                          Dikelilingi bunga melati harum, kupu-kupu emas beterbangan, dan lampu taman yang menyala temaram.
                        </p>
                      </div>
                      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                        <h4 className="text-xs font-bold text-amber-300">Paving Batu Berkilau:</h4>
                        <p className="text-[11px] text-slate-300 mt-1">
                          Batu alam rapi yang bersih dari sampah, nyaman dipijak anak-anak yang melangkah ke masjid.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: P3 — AIR WUDHU CERIA */}
        {activeTab === 'WUDHU' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-600/30 border border-sky-500/50 flex items-center justify-center text-sky-400 font-bold">
                    P3
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Area Air Wudhu Ceria &amp; Kran Ramah</h2>
                    <p className="text-xs text-slate-400">Tetesan air tersenyum, ikan kecil di kolam wudhu, gelembung pelangi, dan 8 langkah edukasi bersuci</p>
                  </div>
                </div>
              </div>

              {/* Steps Progress Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 mb-6">
                {masjidAlBarakahEngine.wudhuSteps.map((w) => {
                  const isSelected = snapshot.activeWudhuStep === w.stepNumber;
                  return (
                    <button
                      key={w.stepNumber}
                      onClick={() => {
                        masjidAlBarakahEngine.selectWudhuStep(w.stepNumber);
                        setSpeechBubbleText(`“Langkah ${w.stepNumber}: ${w.name} (${w.arabicPhrase}). ${w.educationTip}”`);
                      }}
                      className={`p-2 rounded-xl border text-center flex flex-col items-center justify-between transition ${
                        isSelected
                          ? 'bg-gradient-to-b from-sky-600 to-indigo-700 text-white shadow-xl ring-2 ring-sky-400'
                          : 'bg-slate-800/60 border-slate-700 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="text-xs font-black text-amber-300">{w.stepNumber}</span>
                      <span className="text-2xl my-1">{w.emoji.split(' ')[0]}</span>
                      <span className="text-[10px] font-bold truncate w-full">{w.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Wudhu Step Showcase */}
              <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-emerald-950/60 border border-sky-500/40 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-28 h-28 rounded-3xl bg-sky-950/80 border-2 border-sky-400/50 flex flex-col items-center justify-center text-4xl shadow-inner">
                    <span>{currentWudhu.emoji}</span>
                    <span className="text-[10px] font-bold text-sky-300 mt-1">Langkah {currentWudhu.stepNumber}</span>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-sky-400 uppercase tracking-widest">
                          URUTAN WUDHU ISLAMI ANAK
                        </span>
                        <h3 className="text-xl font-black text-white">{currentWudhu.name}</h3>
                        <span className="text-xs text-amber-300 font-serif italic">"{currentWudhu.arabicPhrase}"</span>
                      </div>
                      <button
                        onClick={() => {
                          masjidAlBarakahEngine.playWudhuWaterSound();
                          setSpeechBubbleText('“Kran ramah mengalirkan air jernih dan segar secukupnya tanpa boros!”');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-sky-600/40 hover:bg-sky-600/60 text-sky-200 text-xs font-bold border border-sky-500/40 flex items-center gap-1.5 shadow"
                      >
                        <Droplets className="w-3.5 h-3.5" />
                        <span>Alirkan Air Kran Ramah</span>
                      </button>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3">
                      <p className="text-sm text-slate-200 italic">{currentWudhu.educationTip}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                        <h4 className="text-xs font-bold text-sky-300">Kata Tetesan Air Tersenyum:</h4>
                        <p className="text-[11px] text-slate-300 mt-1">{currentWudhu.waterHumor}</p>
                      </div>
                      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                        <h4 className="text-xs font-bold text-emerald-300">Adab Hemat Air:</h4>
                        <p className="text-[11px] text-slate-300 mt-1">
                          Membuka kran secukupnya, tidak memercikkan air ke mana-mana, dan bersyukur atas nikmat air bersih.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: P4 — SHAF KECIL CERIA */}
        {activeTab === 'SHAF' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
                    P4
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Shaf Kecil Ceria &amp; Sajadah Hidup (DNA G20)</h2>
                    <p className="text-xs text-slate-400">Langkah kecil, anggukan santun, lambaian, sajadah hidup terhampar, dan rak sandal yang rapi</p>
                  </div>
                </div>
              </div>

              {/* Interactive Mosque Interior Stage */}
              <div className="bg-gradient-to-b from-indigo-950/80 via-slate-900 to-amber-950/70 border border-amber-500/40 rounded-2xl p-6 relative overflow-hidden min-h-[320px] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 bg-slate-900/80 px-3 py-1 rounded-full border border-amber-500/30">
                    🕋 Arah Kiblat &amp; Mimbar Barakah
                  </span>
                  <span className="text-xs text-emerald-300 bg-slate-900/80 px-3 py-1 rounded-full border border-emerald-500/30">
                    ✨ Cahaya Lembut Masjid
                  </span>
                </div>

                {/* 3D Animated Shaf with Children & Living Sajadah */}
                <div className="my-6 flex flex-wrap items-center justify-center gap-6">
                  {/* Sajadah 1: Dek Asy */}
                  <div className="flex flex-col items-center">
                    <div className="text-4xl animate-bounce">👦🏻</div>
                    <div className="w-20 h-10 rounded-xl bg-gradient-to-b from-emerald-600 to-green-700 border-2 border-amber-300 flex items-center justify-center shadow-lg text-xs font-bold text-white">
                      🌿 Asy
                    </div>
                    <span className="text-[10px] text-amber-300 mt-1">Shaf Depan Rapi</span>
                  </div>

                  {/* Sajadah 2: Mbak Syifa */}
                  <div className="flex flex-col items-center">
                    <div className="text-4xl animate-bounce">👧🏻</div>
                    <div className="w-20 h-10 rounded-xl bg-gradient-to-b from-teal-600 to-emerald-700 border-2 border-amber-300 flex items-center justify-center shadow-lg text-xs font-bold text-white">
                      🌸 Syifa
                    </div>
                    <span className="text-[10px] text-amber-300 mt-1">Mukena Bersih</span>
                  </div>

                  {/* Sajadah 3: Sahabat Cilik 1 */}
                  <div className="flex flex-col items-center">
                    <div className="text-4xl">👦🏽</div>
                    <div className="w-20 h-10 rounded-xl bg-gradient-to-b from-amber-600 to-yellow-700 border-2 border-amber-300 flex items-center justify-center shadow-lg text-xs font-bold text-white">
                      ⭐ Budi
                    </div>
                    <span className="text-[10px] text-amber-300 mt-1">Tertib &amp; Tenang</span>
                  </div>

                  {/* Sajadah 4: Sahabat Cilik 2 */}
                  <div className="flex flex-col items-center">
                    <div className="text-4xl">👧🏼</div>
                    <div className="w-20 h-10 rounded-xl bg-gradient-to-b from-rose-600 to-pink-700 border-2 border-amber-300 flex items-center justify-center shadow-lg text-xs font-bold text-white">
                      💖 Siti
                    </div>
                    <span className="text-[10px] text-amber-300 mt-1">Senyum Santun</span>
                  </div>
                </div>

                {/* Interior Features: Rak Sandal & Rak Al-Qur'an */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                  <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👡👞</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">Rak Sandal Rapi</h4>
                        <p className="text-[10px] text-slate-400">Sandal diletakkan menghadap ke luar dengan tertib</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-950 px-2 py-1 rounded">
                      Rapi 100%
                    </span>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📖✨</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">Rak Al-Qur'an Kecil</h4>
                        <p className="text-[10px] text-slate-400">Mushaf anak berbaris rapi dan harum kasturi</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-amber-400 bg-amber-950 px-2 py-1 rounded">
                      Terawat
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: P5 — MENARA CAHAYA */}
        {activeTab === 'MINARET' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
                    P5
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Menara Cahaya &amp; Langit Spiritual TADE</h2>
                    <p className="text-xs text-slate-400">Burung mengitari menara, cahaya sore berkilau, bintang bertabur, dan lentera malam otomatis</p>
                  </div>
                </div>
              </div>

              {/* Minaret Sky Showcase */}
              <div className="bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 border border-amber-500/40 rounded-2xl p-8 text-center relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
                {/* Floating Clouds & Birds */}
                <div className="absolute top-4 left-6 text-3xl opacity-60">☁️🕊️</div>
                <div className="absolute top-6 right-8 text-3xl opacity-60">✨🌙☁️</div>

                <div className="text-7xl mb-2 animate-pulse">
                  🕌
                </div>
                <h3 className="text-xl font-black text-amber-300">Menara Cahaya Al-Barakah</h3>
                <p className="text-xs text-slate-300 max-w-md mt-1">
                  Menjulang tinggi dengan hiasan bulan sabit emas yang selalu tersenyum, memancarkan kedamaian untuk seluruh warga kampung shalih.
                </p>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => {
                      masjidAlBarakahEngine.playLanternSparkle();
                      setSpeechBubbleText('“Bintang-bintang doa berkilauan di langit menara masjid mengiringi lantunan doa anak-anak!”');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-600/40 hover:bg-amber-600/60 text-amber-200 text-xs font-bold border border-amber-500/40 flex items-center gap-2 shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Nyalakan Kilau Bintang Doa</span>
                  </button>
                  <button
                    onClick={() => {
                      masjidAlBarakahEngine.collectSecretSurprise('Lentera Emas');
                      setSpeechBubbleText('“Alhamdulillah! Menemukan Lentera Emas Rahasia yang disimpan ke Paspor Petualang.”');
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-200 text-xs font-bold border border-indigo-500/40 flex items-center gap-2 shadow"
                  >
                    <span>🎁 Ambil Kejutan Rahasia</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: P6 — HALAMAN MASJID BERNAPAS */}
        {activeTab === 'COURTYARD' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold">
                    P6
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Halaman Masjid Bernapas (Taman Islami Hidup)</h2>
                    <p className="text-xs text-slate-400">Pohon kurma, kolam koi barakah, ayunan lentera, bangku hikmah, dan pohon doa penuh berkah</p>
                  </div>
                </div>
              </div>

              {/* 4 Courtyard Interactive Spots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {masjidAlBarakahEngine.courtyardSpots.map((spot) => (
                  <div
                    key={spot.id}
                    className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-5 flex flex-col justify-between gap-3 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{spot.icon}</span>
                        <div>
                          <h3 className="text-sm font-black text-white">{spot.name}</h3>
                          <span className="text-[10px] text-emerald-400 font-bold">Sahabat: {spot.characterPresent}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300">{spot.feature}</p>

                    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                      <p className="text-xs font-bold text-amber-300 italic">{spot.blessingText}</p>
                    </div>

                    <button
                      onClick={() => {
                        masjidAlBarakahEngine.playLanternSparkle();
                        setSpeechBubbleText(`“Berinteraksi di ${spot.name}: ${spot.blessingText}”`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 text-xs font-bold border border-emerald-500/40 text-center"
                    >
                      Kunjungi Spot Ini
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: BONUS 1 — PARADE JUMAT CERIA (20 DETIK) & BONUS 2: MBG */}
        {activeTab === 'PARADE' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold">
                    🎉
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Parade Jumat Ceria (20 Detik) &amp; Alur MBG</h2>
                    <p className="text-xs text-slate-400">Rombongan sahabat Asy, Syifa, Bubu, Gogo, Mimi, Dodo, Titi, Rara melangkah bersama ke Masjid Al-Barakah</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {snapshot.isFridayParadeActive ? (
                    <button
                      onClick={() => masjidAlBarakahEngine.stopFridayParade()}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Jeda Parade</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => masjidAlBarakahEngine.startFridayParade(20)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Mulai Parade Jumat (20s)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress 20 Detik */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700/80 mb-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Waktu Parade Jumat: {snapshot.fridayParadeSeconds} / 20 Detik
                  </span>
                  <span className="text-slate-400">
                    {snapshot.isFridayParadeActive ? '🚶‍♂️🚶‍♀️ Parade Melangkah Ceria...' : '⏸️ Siap Memulai Parade'}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-teal-400 transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${(snapshot.fridayParadeSeconds / 20) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Characters Parade Lineup */}
              <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-amber-950/70 border border-emerald-500/40 rounded-2xl p-6 min-h-[220px] flex flex-col justify-center items-center text-center">
                <div className="text-4xl sm:text-5xl flex flex-wrap items-center justify-center gap-4 my-3">
                  <span>👦🏻</span>
                  <span>👧🏻</span>
                  <span>🐦</span>
                  <span>🐻</span>
                  <span>🐰</span>
                  <span>🐢</span>
                  <span>🐦</span>
                  <span>🐿️</span>
                  <span>🚋</span>
                  <span>🛒📚</span>
                </div>

                <h3 className="text-base font-black text-amber-300 mt-2">
                  Barisan Sahabat Shalih &amp; Trem Mini Barakah
                </h3>
                <p className="text-xs text-slate-300 max-w-lg mt-1">
                  Dek Asy, Mbak Syifa, Bubu, Gogo, Mimi, Dodo, Titi, dan Rara beriringan dengan gembira, diiringi balon hijau putih dan kupu-kupu emas.
                </p>
              </div>

              {/* Bonus 2: MBG Menuju Masjid Flow */}
              <div className="mt-6 pt-4 border-t border-slate-700">
                <h4 className="text-xs font-black text-teal-400 uppercase tracking-wider mb-3">
                  Alur Integrasi MBG G31 Menuju Masjid:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {[
                    { step: '1', name: 'Bus MBG Tiba', icon: '🚌🍱' },
                    { step: '2', name: 'Makan Bersama', icon: '🍲🥣' },
                    { step: '3', name: 'Dodo: Jaga Bersih', icon: '🐢🧹' },
                    { step: '4', name: 'Alhamdulillah', icon: '🤲✨' },
                    { step: '5', name: 'Jalan ke Masjid', icon: '🚶‍♂️🕌' }
                  ].map((m) => (
                    <div key={m.step} className="bg-slate-900/80 border border-teal-500/30 p-3 rounded-xl text-center">
                      <span className="text-xl block mb-1">{m.icon}</span>
                      <span className="text-[10px] font-black text-teal-300 block">{m.step}. {m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: P7 — FOUNDER MASJID CONTROL */}
        {activeTab === 'FOUNDER' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-indigo-500/40 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold">
                    P7
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Founder Masjid Control Cockpit</h2>
                    <p className="text-xs text-slate-400">Pengujian sistem audio barakah, simulasi pagi-siang-sore-malam, dan audit Black Box Ring-0</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {snapshot.isAutoSimulating ? (
                    <button
                      onClick={() => masjidAlBarakahEngine.stopFullMasjidSimulation()}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Hentikan Simulasi</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => masjidAlBarakahEngine.startFullMasjidSimulation()}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Simulasi Lengkap P1–P7</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sound & Atmosphere Tests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <button
                  onClick={() => masjidAlBarakahEngine.playMasjidChime()}
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-amber-500/40 text-left"
                >
                  <span className="text-xs font-bold text-amber-300 block">🔔 Uji Harpa Barakah</span>
                  <span className="text-[10px] text-slate-400">Pentatonic Chime D4-D5</span>
                </button>
                <button
                  onClick={() => masjidAlBarakahEngine.playWudhuWaterSound()}
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-sky-500/40 text-left"
                >
                  <span className="text-xs font-bold text-sky-300 block">💧 Uji Air Wudhu</span>
                  <span className="text-[10px] text-slate-400">Percikan &amp; tetesan segar</span>
                </button>
                <button
                  onClick={() => masjidAlBarakahEngine.playTremBellSound()}
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-emerald-500/40 text-left"
                >
                  <span className="text-xs font-bold text-emerald-300 block">🚋 Uji Lonceng Trem</span>
                  <span className="text-[10px] text-slate-400">Ting-ting kendaraan santun</span>
                </button>
                <button
                  onClick={() => masjidAlBarakahEngine.playLanternSparkle()}
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-purple-500/40 text-left"
                >
                  <span className="text-xs font-bold text-purple-300 block">✨ Uji Kilau Lentera</span>
                  <span className="text-[10px] text-slate-400">High pitch C6 sparkle</span>
                </button>
              </div>

              {/* Secret Surprises Display */}
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4">
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-2">
                  Kejutan Rahasia Paspor Petualang (Non-Skor):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {snapshot.collectedSecretSurprises.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center gap-1"
                    >
                      <span>🌟</span> {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MasjidAlBarakahHub;
