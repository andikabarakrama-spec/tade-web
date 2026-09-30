import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, MapPin, Footprints, Heart, Sun, ArrowRight, Home, CheckCircle2 } from 'lucide-react';
import { AIAsyCharacterRenderer } from '../assistant/AIAsyCharacterRenderer';
import { AIAsyCharacterState } from '../assistant/AIAsyCharacterAssetRegistry';

interface WorldStop {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  targetId: string;
  tabKey?: string;
  bgTheme: string;
  aiAsyDialogue: string;
  worldElement: string;
  idlePose: AIAsyCharacterState;
  poseDescription: string;
}

export const DuniaAsySyifaWorldPath: React.FC<{ onTabChange?: (tab: string) => void }> = ({ onTabChange }) => {
  const [activeStopIndex, setActiveStopIndex] = useState<number>(0);
  const [isLanternLit, setIsLanternLit] = useState<boolean>(true);

  // Tour Guide Movement Animation States (Sprint P3D-10)
  const [guidePhase, setGuidePhase] = useState<'idle' | 'walking' | 'turning' | 'pointing' | 'arrived'>('idle');
  const [pointDirection, setPointDirection] = useState<'lanjut_berjalan' | 'none'>('none');

  const worldStops: WorldStop[] = [
    {
      id: 'stop-1',
      number: 1,
      title: 'Gerbang Utama',
      subtitle: 'Penyambutan Warm Salam',
      icon: '⛩️',
      targetId: 'gerbang-utama',
      tabKey: 'w1',
      bgTheme: 'from-emerald-900 via-teal-950 to-emerald-950',
      aiAsyDialogue: "Assalamu'alaikum! Selamat datang di gerbang kayu TK Asy Syifa Tanggul.",
      worldElement: 'Pagar Kayu & Lampion Pagi',
      idlePose: 'greeting',
      poseDescription: 'Pose Menyambut Warm Salam 🌿'
    },
    {
      id: 'stop-2',
      number: 2,
      title: 'Taman Asri & Sawah',
      subtitle: 'Kupu-kupu & Bunga Kamboja',
      icon: '🌸',
      targetId: 'taman-asri',
      tabKey: 'w1',
      bgTheme: 'from-emerald-800 via-green-900 to-teal-950',
      aiAsyDialogue: "Coba cium aroma Bunga Kamboja dan lihat kupu-kupu terbang di sekitar hamparan sawah!",
      worldElement: 'Jalan Setapak & Batu Pijakan',
      idlePose: 'watching_butterfly',
      poseDescription: 'Pose Mengamati Kupu-kupu 🦋'
    },
    {
      id: 'stop-3',
      number: 3,
      title: 'Halaman Ceria',
      subtitle: 'Area Bermain & Rumput Empuk',
      icon: '🛝',
      targetId: 'halaman-ceria',
      tabKey: 'w1',
      bgTheme: 'from-amber-800 via-emerald-900 to-emerald-950',
      aiAsyDialogue: "Di sini tempat kita berlari, melompat perosotan, dan tertawa gembira bersama teman!",
      worldElement: 'Bangku Kayu & Ayunan',
      idlePose: 'excited',
      poseDescription: 'Pose Ceria Melompat Gembira 🎈'
    },
    {
      id: 'stop-4',
      number: 4,
      title: 'Sentra Belajar',
      subtitle: 'Rumah-Rumah Kecil Edukasi',
      icon: '🏡',
      targetId: 'sentra-belajar',
      tabKey: 'w2',
      bgTheme: 'from-teal-900 via-emerald-900 to-stone-900',
      aiAsyDialogue: "Ayo singgah ke Rumah Sentra Bahan Alam, Peran, dan Balok Kreatif!",
      worldElement: 'Pondok Belajar Kayu',
      idlePose: 'point',
      poseDescription: 'Pose Menunjuk Bangunan Sentra 🏫'
    },
    {
      id: 'stop-5',
      number: 5,
      title: 'Rumah Tahfidz',
      subtitle: 'Lantunan Juz 30 Cilik',
      icon: '🕌',
      targetId: 'rumah-tahfidz',
      tabKey: 'w2',
      bgTheme: 'from-emerald-950 via-teal-900 to-amber-950',
      aiAsyDialogue: "Mari dengarkan lantunan merdu hafalan Surah An-Naba dari santri-santri cilik.",
      worldElement: 'Lampion Kunang-Kunang',
      idlePose: 'pray',
      poseDescription: 'Pose Salam Khusyuk & Santun 🤲'
    },
    {
      id: 'stop-6',
      number: 6,
      title: 'Album Kenangan',
      subtitle: 'Galeri Karya & Senyuman',
      icon: '📖',
      targetId: 'album-kenangan',
      tabKey: 'w3',
      bgTheme: 'from-amber-900 via-emerald-950 to-teal-950',
      aiAsyDialogue: "Lihat lukisan jari dan hasil karya kerajinan tangan penuh warna buatan teman-teman!",
      worldElement: 'Papan Foto Kayu',
      idlePose: 'drawing',
      poseDescription: 'Pose Menghias Karya Seni 🎨'
    },
    {
      id: 'stop-7',
      number: 7,
      title: 'Gerbang PPDB',
      subtitle: 'Langkah Awal Bergabung',
      icon: '🏫',
      targetId: 'gerbang-ppdb',
      tabKey: 'w4',
      bgTheme: 'from-emerald-900 via-amber-950 to-slate-950',
      aiAsyDialogue: "Ayah & Bunda sudah siap mendaftarkan ananda di Kampus Hijau TK Asy Syifa?",
      worldElement: 'Pintu Gerbang Pendaftaran',
      idlePose: 'greeting',
      poseDescription: 'Pose Salam Menyambut Wali Murid 📝'
    },
    {
      id: 'stop-8',
      number: 8,
      title: 'Rumah AI Asy',
      subtitle: 'Pojok Cerita & Tanya Jawab',
      icon: '🏡',
      targetId: 'rumah-ai-asy',
      tabKey: 'w1',
      bgTheme: 'from-teal-950 via-emerald-950 to-stone-900',
      aiAsyDialogue: "Ini pondok kayu Asy! Kalau ada yang mau ditanyakan, Asy selalu siap menjawab.",
      worldElement: 'Pondok Kayu AI Asy',
      idlePose: 'standing',
      poseDescription: 'Pose Berdiri Ramah di Rumah Asy 🏡'
    },
    {
      id: 'stop-9',
      number: 9,
      title: 'Perpisahan Warm Wish',
      subtitle: 'Sampai Jumpa di TK Asy Syifa',
      icon: '👋',
      targetId: 'perpisahan-warm-wish',
      tabKey: 'w5',
      bgTheme: 'from-emerald-950 via-stone-900 to-amber-950',
      aiAsyDialogue: "Semoga ananda tumbuh sehat dan penuh keberkahan. Sampai ketemu besok!",
      worldElement: 'Papan Surat Perpisahan',
      idlePose: 'goodbye',
      poseDescription: 'Pose Melambaikan Tangan Perpisahan 👋'
    }
  ];

  const currentStop = worldStops[activeStopIndex];

  // Tour Guide "Lanjut Berjalan" Sequential Action Handler (Sprint P3D-10)
  const handleLanjutBerjalan = (nextIndex: number) => {
    // Dispatch global site event for companion synchronization
    window.dispatchEvent(new CustomEvent('aiasy-lanjut-berjalan', { detail: { stopIndex: nextIndex } }));

    // Step 1: Walk a few small steps
    setGuidePhase('walking');
    setPointDirection('none');

    setTimeout(() => {
      // Step 2: Stop & Turn toward next checkpoint
      setActiveStopIndex(nextIndex);
      const stop = worldStops[nextIndex];
      if (stop.tabKey && onTabChange) {
        onTabChange(stop.tabKey);
      }
      const elem = document.getElementById(stop.targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
      setGuidePhase('turning');

      setTimeout(() => {
        // Step 3: Point toward the next checkpoint
        setGuidePhase('pointing');
        setPointDirection('lanjut_berjalan');

        setTimeout(() => {
          // Step 4: Smile and settle into checkpoint specific pose
          setGuidePhase('arrived');
          setPointDirection('none');

          // Trigger checkpoint reach celebration
          window.dispatchEvent(new CustomEvent('aiasy-checkpoint-reached', { detail: { stopIndex: nextIndex } }));

          setTimeout(() => {
            setGuidePhase('idle');
          }, 2000);
        }, 900);
      }, 700);
    }, 850);
  };

  const handleStopClick = (index: number) => {
    handleLanjutBerjalan(index);
  };

  // Determine current active character state based on tour guide phase or checkpoint idle pose
  const effectiveCharacterState: AIAsyCharacterState =
    guidePhase === 'walking' ? 'walking' :
    guidePhase === 'turning' ? 'look_right' :
    guidePhase === 'pointing' ? 'point' :
    currentStop.idlePose;

  return (
    <div className="w-full max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Wooden Signboard Map Header */}
      <div className="bg-gradient-to-r from-amber-950 via-emerald-950 to-amber-950 text-white rounded-3xl p-6 border-4 border-amber-400/80 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Decorative Hanging Lanterns & Vines */}
        <div className="absolute top-2 left-6 text-xl animate-bounce">🏮</div>
        <div className="absolute top-2 right-6 text-xl animate-bounce delay-150">🏮</div>
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600 opacity-60 pointer-events-none" />

        {/* Top Header Label */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-500/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md border border-amber-300">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-md">
                  Peta Petualangan Dunia Asy Syifa
                </span>
                <span className="text-xs text-emerald-300 font-bold hidden sm:inline">
                  • 9 Pos Perjalanan Taman
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-100 tracking-tight">
                Jalan Setapak "Dunia TK Asy Syifa"
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLanternLit(!isLanternLit)}
              className="px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 rounded-xl text-xs font-bold text-amber-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isLanternLit ? '✨ Lampion Menyala' : '🌙 Mode Malam'}</span>
            </button>
            <span className="text-xs font-black bg-emerald-900/90 text-amber-300 px-3 py-1.5 rounded-xl border border-emerald-500/50">
              Pos {currentStop.number} Dari 9
            </span>
          </div>
        </div>

        {/* Interactive Waypoint Path System Bar (Sprint P3D-10) */}
        <div className="relative overflow-x-auto pb-6 pt-3 no-scrollbar">
          <div className="flex items-end gap-3 min-w-max px-2">
            {worldStops.map((stop, idx) => {
              const isActive = activeStopIndex === idx;
              return (
                <div key={stop.id} className="flex items-center gap-2 relative">
                  {/* AI Asy Standing Directly Beside the Active Waypoint Stepping Stone */}
                  {isActive && (
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none animate-bounce">
                      <div className="bg-emerald-950/95 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-xl border border-amber-400 shadow-xl whitespace-nowrap mb-1">
                        <span>{stop.poseDescription}</span>
                      </div>
                      <div className="w-16 h-20 relative">
                        <AIAsyCharacterRenderer
                          state={effectiveCharacterState}
                          scale={0.8}
                          groundType="grass"
                          expression={guidePhase === 'arrived' ? 'smile' : 'curious_eyes'}
                          pointDirection={pointDirection}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleStopClick(idx)}
                    className={`relative p-3 rounded-2xl border-2 transition transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center w-36 sm:w-40 ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xl scale-105 font-black'
                        : 'bg-emerald-950/80 text-emerald-100 border-emerald-700/60 hover:bg-emerald-900/90 font-bold'
                    }`}
                  >
                    {/* Footprint Step Number Badge */}
                    <span className={`absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border ${
                      isActive ? 'bg-slate-950 text-amber-300 border-amber-400' : 'bg-emerald-800 text-emerald-200 border-emerald-600'
                    }`}>
                      {stop.number}
                    </span>

                    <span className="text-2xl mb-1">{stop.icon}</span>
                    <span className="text-xs line-clamp-1">{stop.title}</span>
                    <span className={`text-[10px] line-clamp-1 mt-0.5 ${isActive ? 'text-slate-900 font-extrabold' : 'text-emerald-300 font-medium'}`}>
                      {stop.subtitle}
                    </span>

                    {/* Active Stepping Stone Indicator */}
                    {isActive && (
                      <span className="absolute -bottom-2.5 px-2.5 py-0.5 bg-slate-950 text-amber-300 rounded-full text-[9px] font-black border border-amber-400 flex items-center gap-1 shadow-md">
                        <Footprints className="w-2.5 h-2.5 text-amber-400" />
                        <span>Pos Berjalan</span>
                      </span>
                    )}
                  </button>

                  {/* Connecting Wavy Stepping Stone Path Line */}
                  {idx < worldStops.length - 1 && (
                    <div className="flex items-center gap-1 text-emerald-500/70">
                      <span className="text-xs">🌸</span>
                      <div className="w-6 border-b-2 border-dashed border-emerald-500/50" />
                      <span className="text-xs">🐾</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Active Waypoint Spotlight Scene Card (Sprint P3D-10) */}
        <div className={`p-5 rounded-2xl border-2 border-amber-400/60 bg-gradient-to-r ${currentStop.bgTheme} flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden`}>
          {/* Soft Background Grass & Ground Ambient Light */}
          <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />

          {/* AI Asy Tour Guide Character Standing Beside Dialogue (Sprint P3D-10) */}
          <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
            <div className="w-20 h-28 shrink-0 bg-slate-950/60 rounded-2xl p-1.5 border-2 border-amber-400/60 flex items-center justify-center shadow-2xl relative">
              <AIAsyCharacterRenderer
                state={effectiveCharacterState}
                scale={0.95}
                groundType="grass"
                expression={guidePhase === 'arrived' ? 'big_smile' : 'smile'}
                pointDirection={pointDirection}
              />
              <span className="absolute -bottom-2 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-md border border-amber-300 shadow-md">
                Guide Asy
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                  Pemandu Wisata AI Asy
                </span>
                <span className="text-[10px] bg-emerald-900/90 text-emerald-200 px-2.5 py-0.5 rounded-md font-bold border border-emerald-500/40">
                  {currentStop.worldElement}
                </span>
                <span className="text-[10px] bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-md font-bold border border-amber-400/30">
                  {currentStop.poseDescription}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 italic font-semibold leading-relaxed">
                "{currentStop.aiAsyDialogue}"
              </p>
            </div>
          </div>

          {/* Tour Guide Control Action Button ("Lanjut Berjalan") */}
          <div className="flex items-center gap-3 shrink-0 relative z-10 w-full md:w-auto justify-end">
            <button
              onClick={() => handleLanjutBerjalan((activeStopIndex + 1) % worldStops.length)}
              disabled={guidePhase !== 'idle' && guidePhase !== 'arrived'}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer border-2 border-amber-200"
            >
              <Footprints className={`w-4 h-4 text-slate-950 ${guidePhase === 'walking' ? 'animate-bounce' : ''}`} />
              <span>
                {guidePhase === 'walking' ? 'AI Asy Sedang Melangkah... 🐾' :
                 guidePhase === 'turning' ? 'Menoleh & Bersiap... 🌿' :
                 guidePhase === 'pointing' ? 'Menunjuk Pos Berikutnya... 👉' :
                 `Lanjut Berjalan ke Pos ${((activeStopIndex + 1) % worldStops.length) + 1}`}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
