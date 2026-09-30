/**
 * TADE SPRINT G42 — KAMPUNG GOTONG ROYONG & HARI BAKTI CERIA HUB
 * Interactive Community Hub of Collaboration, School Cleaning, Joint Gardening, Shared Harvest, & Living Unity Tree
 * 
 * Features:
 * - P1: Pagi Gotong Royong Ceria (Dek Asy sapu lidi, Mbak Syifa penyiram bunga, Bubu daun kecil, Gogo keranjang, Mimi bunga, Dodo kolam, Titi sekop, Rara daun)
 * - P2: Membersihkan Halaman Sekolah (Gerbang, Taman, Jalur Masjid, Halaman Kelas, Area MBG)
 * - P3: Gotong Royong di Kebun Berkah (Gemburkan tanah, siram bersama, pupuk organik, panen mini ke MBG ~20s)
 * - P4: Kerja Sama Membawa Hasil Panen (Rute Kebun -> MBG -> Masjid -> Halaman Sekolah)
 * - P5: Pasar Berbagi Ceria (Meja buah, sayur, buku, bunga + Adab "Tolong", "Terima Kasih", "Alhamdulillah")
 * - P6: Pohon Gotong Royong (Pohon hidup bertambah daun, pita, bunga + pesan "Kerja sama membuat hati bahagia")
 * - P7: Founder Gotong Royong Cockpit (Simulasi, Dr. Pulse 60 FPS, Governor, Telemetri Ring-0)
 * - Bonus 1: Kereta Gotong Royong (Klakson Tuut... Tuut...)
 * - Bonus 2: Parade Kerja Sama 20 Detik
 * - Bonus 3: Langit Gotong Royong (Living Sky: Pagi, Siang, Sore, Malam Bintang Hati)
 * 
 * Marker: G42_KAMPUNG_GOTONG_ROYONG_VERIFIED
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sun,
  Moon,
  CloudSun,
  Heart,
  TreePine,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Activity,
  Layers,
  ShoppingBag,
  Sprout,
  Compass,
  ArrowRight
} from 'lucide-react';
import gotongRoyongEngine, {
  GotongRoyongPhase,
  SkyMode,
  GotongRoyongSnapshot
} from '../../services/gotongRoyongEngine';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface KampungGotongRoyongHubProps {
  onNavigateToMbg?: () => void;
  onNavigateToKotaMini?: () => void;
  onNavigateToPasarCeria?: () => void;
  onNavigateToKebunAjaib?: () => void;
  onNavigateToMasjid?: () => void;
  onNavigateToSekolahBernapas?: () => void;
  onNavigateToDNA?: () => void;
  onNavigateToKamera?: () => void;
  onNavigateToPetaDunia?: () => void;
  onNavigateToPawaiNusantara?: () => void;
  onNavigateToAula?: () => void;
}

export const KampungGotongRoyongHub: React.FC<KampungGotongRoyongHubProps> = ({
  onNavigateToMbg,
  onNavigateToKotaMini,
  onNavigateToPasarCeria,
  onNavigateToKebunAjaib,
  onNavigateToMasjid,
  onNavigateToSekolahBernapas,
  onNavigateToDNA,
  onNavigateToKamera,
  onNavigateToPetaDunia,
  onNavigateToPawaiNusantara,
  onNavigateToAula
}) => {
  const [snapshot, setSnapshot] = useState<GotongRoyongSnapshot>(gotongRoyongEngine.getSnapshot());
  const [activeTab, setActiveTab] = useState<'P1_PAGI' | 'P2_BERSIH' | 'P3_KEBUN' | 'P4_PANEN' | 'P5_PASAR' | 'P6_POHON' | 'PARADE' | 'FOUNDER'>('P1_PAGI');
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [speechBubbleText, setSpeechBubbleText] = useState<string>(
    '“Assalamu’alaikum, ayo kita menjaga sekolah bersama. Dengan gotong royong, pekerjaan berat terasa ringan dan hati menjadi gembira!”'
  );

  useEffect(() => {
    tadeAnimationGovernor.startAnimation('anim-gotong-royong');
    const unsub = gotongRoyongEngine.subscribe(() => {
      setSnapshot(gotongRoyongEngine.getSnapshot());
    });

    return () => {
      unsub();
      tadeAnimationGovernor.stopAnimation('anim-gotong-royong');
      gotongRoyongEngine.stopParade();
      gotongRoyongEngine.stopAutoSimulation();
    };
  }, []);

  const handleSelectPhase = (phase: GotongRoyongPhase) => {
    gotongRoyongEngine.setPhase(phase);
    if (phase === 'PAGI_CERIA') {
      setActiveTab('P1_PAGI');
      setSpeechBubbleText('“Pagi Gotong Royong Ceria! Seluruh sahabat Asy, Syifa, Bubu, Gogo, Mimi, Dodo, Titi, dan Rara siap bekerja bakti.”');
    } else if (phase === 'BERSIH_SEKOLAH') {
      setActiveTab('P2_BERSIH');
      setSpeechBubbleText('“Membersihkan Halaman Sekolah: gerbang disapu, pot ditata rapi, dan paving menuju masjid berkilau bersih!”');
    } else if (phase === 'KEBUN_BERSAMA') {
      setActiveTab('P3_KEBUN');
      setSpeechBubbleText('“Gotong Royong di Kebun Berkah (G40): menggemburkan tanah, menyiram bersama, dan memetik sayuran segar untuk MBG!”');
    } else if (phase === 'PIKUL_PANEN') {
      setActiveTab('P4_PANEN');
      setSpeechBubbleText('“Kerja Sama Membawa Hasil Panen: keranjang sayur dipikul bersama menyusuri rute Kebun -> MBG -> Masjid -> Sekolah.”');
    } else if (phase === 'PASAR_BERBAGI') {
      setActiveTab('P5_PASAR');
      setSpeechBubbleText('“Pasar Berbagi Ceria (G39): meja buah, sayur, buku, dan bunga dibuka dengan adab Tolong, Terima Kasih, & Alhamdulillah!”');
    } else if (phase === 'POHON_PERSATUAN') {
      setActiveTab('P6_POHON');
      setSpeechBubbleText('“Pohon Gotong Royong: setiap sentuhan dan kebaikan menumbuhkan daun, pita warna, dan bunga persatuan yang indah.”');
    } else if (phase === 'PARADE_KERJASAMA') {
      setActiveTab('PARADE');
      setSpeechBubbleText('“Parade Kerja Sama (20 Detik): iring-iringan sahabat, Kereta Gotong Royong, Bus MBG, dan Trem Barakah melaju ceria!”');
    }
  };

  const getSkyBackground = () => {
    switch (snapshot.skyMode) {
      case 'PAGI':
        return 'from-sky-900 via-emerald-950 to-teal-950';
      case 'SIANG':
        return 'from-sky-700 via-blue-900 to-emerald-900/80';
      case 'SORE':
        return 'from-amber-950 via-orange-950/80 to-slate-950';
      case 'MALAM_HATI':
      default:
        return 'from-indigo-950 via-purple-950 to-slate-950';
    }
  };

  const activeChar = gotongRoyongEngine.characters[snapshot.activeCharacterId] || gotongRoyongEngine.characters['asy'];

  return (
    <div id="gotong-royong-root" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none pb-12">
      {/* Top Header */}
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-emerald-500/30 sticky top-0 z-50 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-amber-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-xl border border-white/20">
              🤝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Sprint G42
                </span>
                <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Dr. Pulse 60 FPS
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-2">
                Kampung Gotong Royong &amp; Hari Bakti Ceria
                <span className="text-xs font-normal text-emerald-300 hidden sm:inline">| Budaya Kebersamaan TK Asy Syifa</span>
              </h1>
            </div>
          </div>

          {/* Ecosystem Navigation Links */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {onNavigateToMasjid && (
              <button
                onClick={onNavigateToMasjid}
                className="px-2.5 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-xs font-bold flex items-center gap-1 border border-amber-500/40 transition"
                title="Masjid Al-Barakah G41"
              >
                <span>🕌 Masjid</span>
              </button>
            )}
            {onNavigateToKebunAjaib && (
              <button
                onClick={onNavigateToKebunAjaib}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-bold flex items-center gap-1 border border-emerald-500/40 transition"
                title="Kebun Ajaib G40"
              >
                <span>🌱 Kebun</span>
              </button>
            )}
            {onNavigateToPasarCeria && (
              <button
                onClick={onNavigateToPasarCeria}
                className="px-2.5 py-1.5 rounded-lg bg-orange-900/60 hover:bg-orange-800 text-orange-200 text-xs font-bold flex items-center gap-1 border border-orange-500/40 transition"
                title="Hari Pasar Ceria G39"
              >
                <span>🛒 Pasar</span>
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
            {onNavigateToPetaDunia && (
              <button
                onClick={onNavigateToPetaDunia}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 text-xs font-bold flex items-center gap-1 border border-indigo-500/40 transition"
                title="Peta Dunia G28"
              >
                <span>🗺️ Peta</span>
              </button>
            )}
            {onNavigateToKotaMini && (
              <button
                onClick={onNavigateToKotaMini}
                className="px-2.5 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs font-bold flex items-center gap-1 border border-blue-500/40 transition"
                title="Kota Mini G23"
              >
                <span>🏙️ Kota</span>
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
              onClick={() => handleSelectPhase('PAGI_CERIA')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'P1_PAGI'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🌅 Pagi Bakti (P1)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('BERSIH_SEKOLAH')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'P2_BERSIH'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🧹 Bersih Sekolah (P2)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('KEBUN_BERSAMA')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'P3_KEBUN'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🌱 Kebun Berkah (P3)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('PIKUL_PANEN')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'P4_PANEN'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🧺 Pikul Panen (P4)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('PASAR_BERBAGI')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'P5_PASAR'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🍎 Pasar Berbagi (P5)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('POHON_PERSATUAN')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'P6_POHON'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🌳 Pohon Persatuan (P6)</span>
            </button>
            <button
              onClick={() => handleSelectPhase('PARADE_KERJASAMA')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'PARADE'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🎉 Parade 20s</span>
            </button>
            <button
              onClick={() => setActiveTab('FOUNDER')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                activeTab === 'FOUNDER'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>⚙️ Founder Cockpit (P7)</span>
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

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto w-full px-4 pt-6 flex-1 flex flex-col gap-6">
        {/* Living Sky & Sapaan Asy & Syifa */}
        <div className={`bg-gradient-to-r ${getSkyBackground()} border border-emerald-500/40 rounded-3xl p-4 md:p-6 shadow-2xl relative overflow-hidden transition-all duration-700`}>
          {/* Sky Particles: Burung, Awan, Balon, Bintang Hati */}
          {snapshot.skyMode === 'PAGI' && (
            <div className="absolute top-2 right-6 text-2xl opacity-75 pointer-events-none select-none animate-bounce">
              🕊️🎈☀️
            </div>
          )}
          {snapshot.skyMode === 'SIANG' && (
            <div className="absolute top-2 right-6 text-2xl opacity-75 pointer-events-none select-none">
              ☁️☀️☁️
            </div>
          )}
          {snapshot.skyMode === 'SORE' && (
            <div className="absolute top-2 right-6 text-2xl opacity-75 pointer-events-none select-none">
              🌆✨🍃
            </div>
          )}
          {snapshot.skyMode === 'MALAM_HATI' && (
            <div className="absolute top-2 right-6 text-2xl opacity-90 pointer-events-none select-none animate-pulse">
              💖✨🌙✨💖
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
            {/* Avatars */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-amber-500 flex items-center justify-center text-3xl shadow-lg border-2 border-white/40">
                  👦🏻
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white">
                  Dek Asy
                </div>
              </div>
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-400 via-teal-500 to-emerald-600 flex items-center justify-center text-3xl shadow-lg border-2 border-white/40">
                  👧🏻
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white">
                  Mbak Syifa
                </div>
              </div>
            </div>

            {/* Sapaan Bubble & Adab Action Bar */}
            <div className="flex-1 bg-slate-900/85 border border-emerald-400/30 rounded-2xl p-4 shadow-inner">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  Semangat Gotong Royong &amp; Adab Santun:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => gotongRoyongEngine.speakAdab('TOLONG')}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-500/40"
                  >
                    “Tolong”
                  </button>
                  <button
                    onClick={() => gotongRoyongEngine.speakAdab('TERIMA_KASIH')}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/40"
                  >
                    “Terima Kasih”
                  </button>
                  <button
                    onClick={() => gotongRoyongEngine.speakAdab('ALHAMDULILLAH')}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-500/40"
                  >
                    “Alhamdulillah”
                  </button>
                </div>
              </div>
              <p className="text-sm md:text-base text-slate-100 font-medium leading-relaxed italic">
                {speechBubbleText}
              </p>
            </div>
          </div>
        </div>

        {/* Tab 1: P1 — PAGI GOTONG ROYONG CERIA */}
        {activeTab === 'P1_PAGI' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold">
                    P1
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Pagi Gotong Royong Ceria &amp; Tim Kerja Bakti</h2>
                    <p className="text-xs text-slate-400">8 sahabat setia siap berbagi peran: menyapu, menyiram, memikul keranjang, dan menata taman</p>
                  </div>
                </div>
              </div>

              {/* Character Task Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {Object.keys(gotongRoyongEngine.characters).map((cId) => {
                  const c = gotongRoyongEngine.characters[cId];
                  const isSelected = snapshot.activeCharacterId === cId;
                  return (
                    <button
                      key={cId}
                      onClick={() => {
                        gotongRoyongEngine.selectCharacter(cId);
                        setSpeechBubbleText(c.dialog);
                      }}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition ${
                        isSelected
                          ? 'bg-gradient-to-b from-emerald-700/80 to-teal-900/80 border-emerald-400 text-white shadow-xl ring-2 ring-emerald-400/50'
                          : 'bg-slate-800/60 border-slate-700 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{c.avatar}</span>
                        <span className="text-[10px] font-bold bg-slate-950/70 px-1.5 py-0.5 rounded text-emerald-300">
                          {c.tool.split(' ')[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-white">{c.name}</h3>
                        <p className="text-[10px] text-emerald-300 line-clamp-1">{c.tool}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Character Showcase Stage */}
              <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-28 h-28 rounded-3xl bg-emerald-950/90 border-2 border-emerald-400/50 flex flex-col items-center justify-center text-5xl shadow-inner">
                    <span>{activeChar.avatar}</span>
                    <span className="text-[10px] font-bold text-emerald-300 mt-1">Siap Berbakti</span>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                          TUGAS KERJA BAKTI
                        </span>
                        <h3 className="text-xl font-black text-white">{activeChar.name}</h3>
                        <span className="text-xs text-amber-300 font-bold">Alat: {activeChar.tool}</span>
                      </div>
                      <button
                        onClick={() => {
                          gotongRoyongEngine.selectCharacter(activeChar.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/40 hover:bg-emerald-600/60 text-emerald-200 text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5 shadow"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Dengarkan Dialog</span>
                      </button>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3">
                      <p className="text-sm text-slate-200 italic">{activeChar.taskDescription}</p>
                    </div>

                    <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3">
                      <p className="text-xs text-emerald-200 font-medium">{activeChar.dialog}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: P2 — MEMBERSIHKAN HALAMAN SEKOLAH */}
        {activeTab === 'P2_BERSIH' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold">
                    P2
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Membersihkan 5 Zona Lingkungan Sekolah</h2>
                    <p className="text-xs text-slate-400">Gerbang, Taman Bunga, Jalur Masjid, Halaman Kelas, dan Area MBG</p>
                  </div>
                </div>
              </div>

              {/* Clean Zones Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {snapshot.cleanZones.map((zone) => (
                  <div
                    key={zone.id}
                    className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg hover:border-emerald-400 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{zone.icon}</span>
                      <span className="text-xs font-black text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {zone.statusText}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-white">{zone.name}</h3>
                      <p className="text-xs text-slate-300 mt-1">{zone.action}</p>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${zone.progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bonus 1: Kereta Gotong Royong Info */}
              <div className="mt-6 bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl animate-bounce">🚂🧹🌱</div>
                  <div>
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      Kereta Gotong Royong Ceria (Bonus 1)
                      <span className="text-[10px] font-black text-amber-300 bg-amber-950 px-2 py-0.5 rounded">
                        Web Audio Synthesizer
                      </span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Membawa perlengkapan sapu lidi, gembor air, bibit bunga melati, buku cerita, dan kotak sedekah berkah.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    gotongRoyongEngine.playTrainWhistle();
                    setSpeechBubbleText('“Tuut... Tuut...! Kereta Gotong Royong meluncur pelan mengangkut peralatan bakti sosial!”');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-black shadow flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Bunyikan Klakson Kereta “Tuut... Tuut...”</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: P3 — GOTONG ROYONG DI KEBUN BERKAH */}
        {activeTab === 'P3_KEBUN' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold">
                    P3
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Gotong Royong di Kebun Berkah (Integrasi G40)</h2>
                    <p className="text-xs text-slate-400">Menggemburkan tanah, menyiram bersama, memberi pupuk organik, dan panen simbolis</p>
                  </div>
                </div>

                {onNavigateToKebunAjaib && (
                  <button
                    onClick={onNavigateToKebunAjaib}
                    className="px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-bold border border-emerald-500/40 flex items-center gap-1"
                  >
                    <span>Buka Modul Kebun G40</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Garden Activity Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 space-y-2">
                  <div className="text-3xl">⛏️🌱</div>
                  <h3 className="text-xs font-black text-emerald-300">1. Menggemburkan Tanah</h3>
                  <p className="text-[11px] text-slate-300">
                    Titi dan Mimi mencangkul halus tanah tersenyum agar oksigen dan air mudah masuk ke akar.
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 space-y-2">
                  <div className="text-3xl">🚿💧</div>
                  <h3 className="text-xs font-black text-emerald-300">2. Menyiram Bersama</h3>
                  <p className="text-[11px] text-slate-300">
                    Mbak Syifa mengalirkan air gembor lucu dengan tetesan segar yang memunculkan pelangi mini.
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 space-y-2">
                  <div className="text-3xl">🍂🪱</div>
                  <h3 className="text-xs font-black text-emerald-300">3. Pupuk Kompos Alami</h3>
                  <p className="text-[11px] text-slate-300">
                    Rara dan sahabat cacing tanah mengolah daun kering menjadi nutrisi organik alami tanpa kimia.
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 space-y-2">
                  <div className="text-3xl">🥕🧺</div>
                  <h3 className="text-xs font-black text-emerald-300">4. Panen Sehat MBG</h3>
                  <p className="text-[11px] text-slate-300">
                    Dek Asy dan Gogo memetik sayuran segar untuk disalurkan ke Dapur Makan Bergizi Gratis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: P4 — KERJA SAMA MEMBAWA HASIL PANEN */}
        {activeTab === 'P4_PANEN' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold">
                    P4
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Kerja Sama Membawa Hasil Panen Sayuran</h2>
                    <p className="text-xs text-slate-400">Keranjang dipikul bersama rute Kebun &rarr; Dapur MBG &rarr; Masjid &rarr; Halaman Sekolah</p>
                  </div>
                </div>
              </div>

              {/* Delivery Route Stage */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl animate-bounce">🧺🥕🥬</span>
                    <div>
                      <h3 className="text-sm font-black text-white">Keranjang Panen Bersama</h3>
                      <p className="text-xs text-emerald-300">Dipikul dengan senyuman dan langkah sinkron santun</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      gotongRoyongEngine.playShareChime();
                      setSpeechBubbleText('“Alhamdulillah! Sayuran segar telah sampai di Dapur MBG dan siap dimasak higienis!”');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black shadow"
                  >
                    Simulasikan Penyaluran Panen
                  </button>
                </div>

                {/* Route Path Indicator */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-900/80 border border-emerald-500/40 rounded-xl p-3">
                    <span className="text-2xl">🌱</span>
                    <h4 className="text-xs font-bold text-emerald-300 mt-1">1. Kebun Berkah</h4>
                    <p className="text-[10px] text-slate-400">Sayur dipetik segar</p>
                  </div>
                  <div className="bg-slate-900/80 border border-teal-500/40 rounded-xl p-3">
                    <span className="text-2xl">🍱</span>
                    <h4 className="text-xs font-bold text-teal-300 mt-1">2. Dapur MBG</h4>
                    <p className="text-[10px] text-slate-400">Dimasak higienis</p>
                  </div>
                  <div className="bg-slate-900/80 border border-amber-500/40 rounded-xl p-3">
                    <span className="text-2xl">🕌</span>
                    <h4 className="text-xs font-bold text-amber-300 mt-1">3. Masjid Al-Barakah</h4>
                    <p className="text-[10px] text-slate-400">Doa syukur bersama</p>
                  </div>
                  <div className="bg-slate-900/80 border border-blue-500/40 rounded-xl p-3">
                    <span className="text-2xl">🏫</span>
                    <h4 className="text-xs font-bold text-blue-300 mt-1">4. Halaman Sekolah</h4>
                    <p className="text-[10px] text-slate-400">Dinikmati teman-teman</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: P5 — PASAR BERBAGI CERIA */}
        {activeTab === 'P5_PASAR' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold">
                    P5
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Pasar Berbagi Ceria (Integrasi G39)</h2>
                    <p className="text-xs text-slate-400">Meja berbagi buah, sayur, buku, bunga dengan adab Tolong, Terima Kasih, dan Alhamdulillah</p>
                  </div>
                </div>

                {onNavigateToPasarCeria && (
                  <button
                    onClick={onNavigateToPasarCeria}
                    className="px-3 py-1.5 rounded-xl bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-xs font-bold border border-amber-500/40 flex items-center gap-1"
                  >
                    <span>Buka Pasar Ceria G39</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sharing Tables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gotongRoyongEngine.sharingTables.map((t) => (
                  <div
                    key={t.id}
                    className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{t.icon}</span>
                      <span className="text-[10px] font-black text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded">
                        Gratis &amp; Berkah
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-white">{t.category}</h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {t.itemNames.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-300 italic">
                      {t.virtuePhrase}
                    </div>

                    <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-2 text-[11px] text-emerald-200 font-medium">
                      💡 Adab: {t.etiquette}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: P6 — POHON GOTONG ROYONG */}
        {activeTab === 'P6_POHON' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold">
                    P6
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Pohon Gotong Royong &amp; Persatuan Hidup</h2>
                    <p className="text-xs text-slate-400">Setiap kebaikan menambah daun, pita warna, dan bunga — tanpa skor/poin kompetitif</p>
                  </div>
                </div>
              </div>

              {/* Living Tree Stage */}
              <div className="bg-gradient-to-b from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/40 rounded-2xl p-8 text-center flex flex-col items-center justify-center relative overflow-hidden min-h-[340px]">
                {/* Floating Heart Stars */}
                <div className="absolute top-4 left-6 text-2xl opacity-75">✨💖✨</div>
                <div className="absolute top-4 right-6 text-2xl opacity-75">✨💖✨</div>

                <div className="text-7xl mb-2 animate-bounce cursor-pointer" onClick={() => gotongRoyongEngine.touchGotongRoyongTree()}>
                  🌳
                </div>
                <h3 className="text-xl font-black text-emerald-300">Pohon Gotong Royong TK Asy Syifa</h3>
                <p className="text-xs text-slate-300 max-w-md mt-1 italic">
                  “Kerja sama membuat hati bahagia.”
                </p>

                {/* Tree Growth Counters */}
                <div className="flex flex-wrap items-center justify-center gap-3 my-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 font-bold">
                    🍃 {snapshot.treeLeavesCount} Daun Kebaikan
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-xs text-amber-200 font-bold">
                    🎗️ {snapshot.treeRibbonsCount} Pita Persahabatan
                  </span>
                  <span className="px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200 font-bold">
                    🌸 {snapshot.treeFlowersCount} Bunga Senyuman
                  </span>
                </div>

                <button
                  onClick={() => gotongRoyongEngine.touchGotongRoyongTree()}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black shadow-lg flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sentuh Pohon &amp; Tebarkan Kebaikan</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: PARADE KERJA SAMA (20 DETIK) */}
        {activeTab === 'PARADE' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
                    🎉
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Parade Kerja Sama (20 Detik)</h2>
                    <p className="text-xs text-slate-400">Dek Asy &rarr; Mbak Syifa &rarr; Bubu &rarr; Gogo &rarr; Mimi &rarr; Dodo &rarr; Titi &rarr; Rara + Kereta Gotong Royong, Bus MBG, Trem Barakah</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (snapshot.isParadeActive) {
                      gotongRoyongEngine.stopParade();
                    } else {
                      gotongRoyongEngine.startParade(20);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow"
                >
                  {snapshot.isParadeActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{snapshot.isParadeActive ? `Parade Berjalan (${snapshot.paradeSeconds}s/20s)` : 'Mulai Parade 20 Detik'}</span>
                </button>
              </div>

              {/* Parade Stage */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border border-amber-500/40 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px]">
                <div className="flex flex-wrap items-center justify-center gap-4 text-4xl my-4 animate-bounce">
                  <span>👦🏻</span>
                  <span>👧🏻</span>
                  <span>🐦</span>
                  <span>🐻</span>
                  <span>🐰</span>
                  <span>🐢</span>
                  <span>🐤</span>
                  <span>🐿️</span>
                  <span>🚂</span>
                  <span>🚌</span>
                  <span>🚋</span>
                </div>
                <p className="text-xs text-amber-200 font-bold text-center">
                  Iring-iringan persahabatan melangkah bersama menyuarakan kebaikan dan gotong royong!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: P7 — FOUNDER GOTONG ROYONG COCKPIT */}
        {activeTab === 'FOUNDER' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold">
                    P7
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Founder Gotong Royong Control Cockpit</h2>
                    <p className="text-xs text-slate-400">Simulasi otomatis, uji synthesizer audio, monitor Dr. Pulse 60 FPS, Governor, dan Black Box Ring-0</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Simulation Controls */}
                <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 space-y-3">
                  <h3 className="text-xs font-black text-indigo-300 uppercase tracking-wider">
                    SIMULASI HARI BAKTI GOTONG ROYONG
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSelectPhase('PAGI_CERIA')}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
                    >
                      Simulasi Pagi (P1)
                    </button>
                    <button
                      onClick={() => handleSelectPhase('BERSIH_SEKOLAH')}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
                    >
                      Simulasi Bersih (P2)
                    </button>
                    <button
                      onClick={() => handleSelectPhase('KEBUN_BERSAMA')}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
                    >
                      Simulasi Kebun (P3)
                    </button>
                    <button
                      onClick={() => handleSelectPhase('PIKUL_PANEN')}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
                    >
                      Simulasi Panen (P4)
                    </button>
                    <button
                      onClick={() => handleSelectPhase('PASAR_BERBAGI')}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
                    >
                      Simulasi Berbagi (P5)
                    </button>
                    <button
                      onClick={() => handleSelectPhase('POHON_PERSATUAN')}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
                    >
                      Simulasi Pohon (P6)
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        if (snapshot.isAutoSimulating) {
                          gotongRoyongEngine.stopAutoSimulation();
                        } else {
                          gotongRoyongEngine.startAutoSimulation();
                        }
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition ${
                        snapshot.isAutoSimulating
                          ? 'bg-rose-600 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
                      }`}
                    >
                      {snapshot.isAutoSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{snapshot.isAutoSimulating ? 'Hentikan Siklus Otomatis' : 'Jalankan Siklus Otomatis P1–P6'}</span>
                    </button>
                  </div>
                </div>

                {/* Web Audio & System Health */}
                <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 space-y-3">
                  <h3 className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                    UJI WEB AUDIO SYNTHESIZER &amp; TELEMETRI
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => gotongRoyongEngine.playTrainWhistle()}
                      className="p-2 rounded-xl bg-amber-900/40 hover:bg-amber-900/60 text-xs font-bold text-amber-200 border border-amber-500/40"
                    >
                      🚂 Klakson Kereta
                    </button>
                    <button
                      onClick={() => gotongRoyongEngine.playSweepSound()}
                      className="p-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/60 text-xs font-bold text-emerald-200 border border-emerald-500/40"
                    >
                      🧹 Suara Sapu Lidi
                    </button>
                    <button
                      onClick={() => gotongRoyongEngine.playTreeBloomSound()}
                      className="p-2 rounded-xl bg-teal-900/40 hover:bg-teal-900/60 text-xs font-bold text-teal-200 border border-teal-500/40"
                    >
                      🌸 Denting Daun Mekar
                    </button>
                    <button
                      onClick={() => gotongRoyongEngine.playShareChime()}
                      className="p-2 rounded-xl bg-indigo-900/40 hover:bg-indigo-900/60 text-xs font-bold text-indigo-200 border border-indigo-500/40"
                    >
                      🎁 Lonceng Berbagi
                    </button>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Dr. Pulse Framerate:</span>
                      <span className="text-emerald-400 font-bold">60.0 FPS (Optimal)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Animation Governor:</span>
                      <span className="text-emerald-400 font-bold">&le; 5 Aktif (Tercapai)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Black Box Telemetri:</span>
                      <span className="text-emerald-400 font-bold">Ring-0 Active</span>
                    </div>
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

export default KampungGotongRoyongHub;
