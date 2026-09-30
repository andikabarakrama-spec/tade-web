import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Sun, Cloud, Flower2, DoorOpen, ArrowRight } from 'lucide-react';
import { MasterMascotRenderer } from '../assistant/MasterMascotRenderer';

interface OpeningExperienceProps {
  onEnterWorld: () => void;
}

export const OpeningExperience: React.FC<OpeningExperienceProps> = ({ onEnterWorld }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Parallax & gaze tracking state
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Individual mascot interaction states & dialogs
  const [asyState, setAsyState] = useState<'wave' | 'speaking' | 'celebrate' | 'happy'>('wave');
  const [syifaState, setSyifaState] = useState<'happy' | 'speaking' | 'celebrate' | 'greeting'>('happy');

  const [asyDialog, setAsyDialog] = useState<string>("Assalamu'alaikum! Aku Asy. 👋");
  const [syifaDialog, setSyifaDialog] = useState<string>("Bismillah! Aku Syifa. ✨");

  const [asyActiveHighlight, setAsyActiveHighlight] = useState(false);
  const [syifaActiveHighlight, setSyifaActiveHighlight] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Normalized coords between -1 and 1
    const x = (clientX / innerWidth) * 2 - 1;
    const y = (clientY / innerHeight) * 2 - 1;
    setMousePos({ x, y });
  };

  const handleAsyClick = () => {
    setAsyState('speaking');
    setAsyActiveHighlight(true);
    setAsyDialog("Assalamu'alaikum! Aku Asy. 👋");
    setTimeout(() => setAsyActiveHighlight(false), 800);
    setTimeout(() => setAsyState('wave'), 3500);
  };

  const handleSyifaClick = () => {
    setSyifaState('speaking');
    setSyifaActiveHighlight(true);
    setSyifaDialog("Bismillah! Aku Syifa. ✨");
    setTimeout(() => setSyifaActiveHighlight(false), 800);
    setTimeout(() => setSyifaState('happy'), 3500);
  };

  const handleEnterClick = () => {
    setIsOpen(true);
    setIsEntering(true);
    setAsyState('celebrate');
    setSyifaState('celebrate');
    setAsyDialog("Alhamdulillah! Selamat datang!");
    setSyifaDialog("Mari masuk bersama kami!");

    setTimeout(() => {
      onEnterWorld();
    }, prefersReducedMotion ? 200 : 700);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-[140] bg-sky-300 text-slate-900 flex flex-col justify-between overflow-hidden select-none transition-all duration-700 ${
        isEntering ? 'opacity-0 scale-105 blur-sm pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* ================= MASTER GARDEN BACKGROUND IMAGE LAYER (Layer Paling Belakang) ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/assets/environment/garden/asy-syifa-garden-background.png"
          alt="TK Asy Syifa Living Digital Garden Background"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out"
          style={{
            transform: prefersReducedMotion
              ? 'none'
              : `scale(1.04) translate(${mousePos.x * 4}px, ${mousePos.y * 3}px)`
          }}
          onError={(e) => {
            // Soft fallback if image fails to load or is unrendered
            (e.currentTarget as HTMLElement).style.opacity = '0.15';
          }}
        />
        {/* Soft Transparent Atmospheric Sky & Vignette Overlay to ensure clear UI readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 via-transparent to-emerald-950/35 pointer-events-none" />
      </div>

      {/* ================= BACKGROUND SKY & ATMOSPHERE LAYER ================= */}
      <div
        className="absolute inset-0 z-10 pointer-events-none overflow-hidden transition-transform duration-300 ease-out"
        style={{
          transform: prefersReducedMotion ? 'none' : `translate(${mousePos.x * 12}px, ${mousePos.y * 8}px)`
        }}
      >
        {/* Rainbow Sky Arch */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[90vw] max-w-5xl h-64 border-t-[12px] border-r-[12px] border-l-[12px] border-transparent rounded-t-full bg-gradient-to-r from-red-400/25 via-yellow-400/25 via-emerald-400/25 via-sky-400/25 to-purple-400/25 blur-[1px] opacity-80" />

        {/* Soft Golden Glowing Sun with Spinning Rays */}
        <div className="absolute top-4 left-6 sm:left-12 w-28 sm:w-36 h-28 sm:h-36 bg-amber-300/80 rounded-full blur-xs shadow-[0_0_120px_rgba(251,191,36,0.95)] animate-pulse flex items-center justify-center">
          <Sun className="w-16 sm:w-20 h-16 sm:h-20 text-amber-500 animate-spin" style={{ animationDuration: '30s' }} />
        </div>

        {/* Distant Hills & Islamic School Silhouette */}
        <div className="absolute inset-x-0 bottom-44 h-56 opacity-35 flex items-end justify-between px-2 sm:px-12 text-emerald-950 pointer-events-none">
          <div className="flex items-end gap-1">
            <span className="text-7xl sm:text-9xl opacity-80">⛰️</span>
            <span className="text-5xl sm:text-7xl opacity-70">🌲</span>
          </div>
          <div className="flex items-end gap-3 pb-2">
            <span className="text-6xl sm:text-8xl opacity-90 drop-shadow-md">🕌</span>
            <span className="text-5xl sm:text-7xl opacity-85 hidden sm:inline">🏫</span>
            <span className="text-4xl sm:text-6xl opacity-75 hidden md:inline">🌙</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-5xl sm:text-7xl opacity-70">🌲</span>
            <span className="text-7xl sm:text-9xl opacity-80">⛰️</span>
          </div>
        </div>

        {/* Drifting Clouds Layer */}
        <motion.div
          animate={{ x: ['-20vw', '110vw'] }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute top-6 text-white/90"
        >
          <Cloud className="w-24 sm:w-36 h-24 sm:h-36 fill-white drop-shadow-md" />
        </motion.div>

        <motion.div
          animate={{ x: ['110vw', '-20vw'] }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
          className="absolute top-16 text-white/80"
        >
          <Cloud className="w-20 sm:w-28 h-20 sm:h-28 fill-white drop-shadow-sm" />
        </motion.div>

        {/* Flying Birds across Horizon */}
        {!prefersReducedMotion && (
          <>
            <motion.div
              animate={{
                x: ['-10vw', '110vw'],
                y: ['15vh', '10vh', '18vh', '12vh'],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: 'linear',
                delay: 2,
              }}
              className="absolute z-10 text-2xl sm:text-3xl pointer-events-none drop-shadow-md"
            >
              🕊️
            </motion.div>

            <motion.div
              animate={{
                x: ['110vw', '-10vw'],
                y: ['25vh', '18vh', '28vh', '20vh'],
              }}
              transition={{
                duration: 28,
                repeat: Infinity,
                ease: 'linear',
                delay: 8,
              }}
              className="absolute z-10 text-xl sm:text-2xl pointer-events-none drop-shadow-sm"
            >
              🕊️
            </motion.div>
          </>
        )}

        {/* Flying Butterflies Loops */}
        {!prefersReducedMotion && (
          <>
            {/* Butterfly 1: Diagonally across screen */}
            <motion.div
              animate={{
                x: ['0vw', '35vw', '70vw', '105vw'],
                y: ['60vh', '35vh', '48vh', '20vh'],
                rotate: [0, 20, -15, 25, 0],
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute z-25 text-2xl sm:text-3xl pointer-events-none drop-shadow-md"
            >
              🦋
            </motion.div>

            {/* Butterfly 2: Right to left across garden */}
            <motion.div
              animate={{
                x: ['100vw', '65vw', '30vw', '-5vw'],
                y: ['45vh', '25vh', '40vh', '30vh'],
                rotate: [0, -25, 15, -20, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 3,
              }}
              className="absolute z-25 text-2xl sm:text-3xl pointer-events-none drop-shadow-md"
            >
              🦋
            </motion.div>

            {/* Butterfly 3: Fluttering near Asy garden */}
            <motion.div
              animate={{
                x: ['12vw', '18vw', '8vw', '15vw', '12vw'],
                y: ['65vh', '58vh', '62vh', '55vh', '65vh'],
                rotate: [0, 15, -20, 10, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute z-25 text-xl sm:text-2xl pointer-events-none"
            >
              🦋
            </motion.div>

            {/* Butterfly 4: Fluttering near Syifa garden */}
            <motion.div
              animate={{
                x: ['80vw', '85vw', '75vw', '82vw', '80vw'],
                y: ['65vh', '55vh', '60vh', '52vh', '65vh'],
                rotate: [0, -15, 20, -10, 0],
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.5,
              }}
              className="absolute z-25 text-xl sm:text-2xl pointer-events-none"
            >
              🦋
            </motion.div>
          </>
        )}

        {/* Ambient Bees & Ladybugs in Garden */}
        <motion.div
          animate={{ x: [0, 15, -10, 0], y: [0, -12, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[48%] left-[18%] text-xl pointer-events-none z-20"
        >
          🐝
        </motion.div>
        <motion.div
          animate={{ x: [0, -12, 8, 0], y: [0, 8, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[52%] right-[22%] text-xl pointer-events-none z-20"
        >
          🐞
        </motion.div>

        {/* Ambient Sparkles & Petals */}
        <div className="absolute top-1/3 right-1/4 text-3xl sm:text-4xl animate-pulse" style={{ animationDuration: '3s' }}>✨</div>
        <div className="absolute top-1/2 left-1/5 text-xl sm:text-2xl animate-ping" style={{ animationDuration: '5s' }}>🌸</div>
        <div className="absolute top-1/4 left-1/3 text-2xl animate-pulse" style={{ animationDuration: '4s' }}>✨</div>
      </div>

      {/* ================= MIDDLE GROUND GARDEN & ARCHITECTURAL DECORATION ================= */}
      <div
        className="absolute inset-x-0 bottom-16 h-80 z-20 pointer-events-none transition-transform duration-300 ease-out flex items-end justify-between px-2 sm:px-10 opacity-95"
        style={{
          transform: prefersReducedMotion ? 'none' : `translate(${mousePos.x * 6}px, ${mousePos.y * 4}px)`
        }}
      >
        {/* Left Side Garden: Lush Trees, Flower Beds, Picket Fence, Playground Slide & Lantern */}
        <div className="flex items-end gap-1 text-emerald-800/90 max-w-[32vw]">
          <motion.span
            animate={{ rotate: [0, 1.5, -1.5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="text-7xl sm:text-9xl drop-shadow-xl inline-block"
          >
            🌳
          </motion.span>
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl sm:text-5xl drop-shadow-md">🛝</span>
            <span className="text-2xl sm:text-4xl drop-shadow-sm">🏮</span>
          </div>
          <span className="text-4xl sm:text-7xl drop-shadow-md">🌲</span>
          <div className="hidden sm:flex flex-col items-center">
            <span className="text-3xl sm:text-4xl drop-shadow-sm">🌻</span>
            <span className="text-xl sm:text-3xl">🪵</span>
          </div>
          <span className="text-3xl sm:text-5xl drop-shadow-sm hidden md:inline">🌺</span>
        </div>

        {/* Center Garden Pathway Arc Leading to Central Gate Entrance */}
        <div className="w-full max-w-xl mx-auto h-36 bg-gradient-to-t from-amber-200/95 via-amber-100/70 to-transparent rounded-t-[160px] border-t-4 border-amber-300 shadow-inner flex flex-col items-center justify-end pb-2 relative overflow-hidden">
          {/* Stepping Stones & Flower Border */}
          <div className="flex items-center gap-4 sm:gap-8 opacity-80 text-amber-900 text-sm font-bold">
            <span className="text-base sm:text-xl">🌸</span>
            <span className="text-sm sm:text-base">🪨</span>
            <span className="text-base sm:text-xl">🌼</span>
            <span className="text-sm sm:text-base">🪨</span>
            <span className="text-base sm:text-xl">🌷</span>
          </div>
          <div className="text-[10px] sm:text-xs font-black text-amber-900/80 tracking-widest uppercase mt-1">
            Jalan Taman Asy Syifa
          </div>
        </div>

        {/* Right Side Garden: Lush Trees, Art Corner, Flower Beds, Fence & Lights */}
        <div className="flex items-end gap-1 text-emerald-800/90 max-w-[32vw] justify-end">
          <span className="text-3xl sm:text-5xl drop-shadow-sm hidden md:inline">🌹</span>
          <div className="hidden sm:flex flex-col items-center">
            <span className="text-3xl sm:text-4xl drop-shadow-sm">🌷</span>
            <span className="text-xl sm:text-3xl">🪵</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl sm:text-5xl drop-shadow-md">🎨</span>
            <span className="text-2xl sm:text-4xl drop-shadow-sm">💡</span>
          </div>
          <span className="text-4xl sm:text-7xl drop-shadow-md">🌲</span>
          <motion.span
            animate={{ rotate: [0, -1.5, 1.5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="text-7xl sm:text-9xl drop-shadow-xl inline-block"
          >
            🌳
          </motion.span>
        </div>
      </div>

      {/* ================= TOP HEADER BRANDING & WELCOME ================= */}
      <div className="relative z-30 pt-5 sm:pt-7 px-4 text-center space-y-2 max-w-5xl mx-auto">
        {/* Living Digital World Badge */}
        <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-white/95 text-emerald-950 text-xs sm:text-sm font-black uppercase tracking-widest shadow-2xl border-2 border-emerald-300 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
          <span>LIVING DIGITAL WORLD — TK ASY SYIFA</span>
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
        </div>

        {/* Main Title - Clean Responsive Typography without awkward wrapping */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] whitespace-normal md:whitespace-nowrap">
          Selamat Datang di Dunia Asy Syifa
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-emerald-950 font-extrabold max-w-2xl mx-auto bg-amber-200/95 px-5 py-2 rounded-2xl border-2 border-amber-300 shadow-xl backdrop-blur-sm">
          Taman Kanak-Kanak Islam Modern Tanggul • Cerdas • Qurani • Berkarakter
        </p>
      </div>

      {/* ================= FOREGROUND ENTRANCE SCENE & OFFICIAL MASCOTS ================= */}
      <div className="relative z-30 flex-1 flex flex-col items-center justify-end px-2 sm:px-6 pb-6 sm:pb-8">
        {/* Asy & Syifa Mascots + Center Gate Composition */}
        <div className="relative w-full max-w-6xl flex flex-col md:flex-row items-center md:items-end justify-between px-2 sm:px-6 gap-4 md:gap-0">
          {/* ================= ASY (LEFT BOY MASCOT) ================= */}
          <div
            onClick={handleAsyClick}
            aria-label="Asy — Maskot TK Asy Syifa"
            role="button"
            tabIndex={0}
            className={`flex flex-col items-center group relative z-20 cursor-pointer transition-all duration-300 ${
              asyActiveHighlight ? 'scale-110 drop-shadow-[0_0_35px_rgba(251,191,36,0.95)]' : 'hover:scale-105'
            }`}
            style={{
              transform: prefersReducedMotion ? 'none' : `translate(${mousePos.x * -10}px, ${mousePos.y * -6}px)`
            }}
          >
            {/* Master Mascot Renderer with Garden Ground Integration */}
            <div className="relative w-48 sm:w-64 h-60 sm:h-80 flex items-center justify-center">
              <MasterMascotRenderer
                character="ASY"
                state={isOpen ? 'celebrate' : asyState}
                scale={1.15}
                gazeX={mousePos.x}
                gazeY={mousePos.y}
                speechBubbleText={asyDialog}
              />
              {/* Garden Grass & Flowers surrounding Asy's feet */}
              <div className="absolute -bottom-1 inset-x-4 flex justify-around text-xs pointer-events-none opacity-90 z-20">
                <span>🌱</span>
                <span>🌸</span>
                <span>🌿</span>
                <span>🌼</span>
              </div>
            </div>
            <span className="mt-1 px-4 py-1.5 bg-amber-900/95 text-amber-100 text-xs font-black rounded-full shadow-xl border-2 border-amber-400/80 backdrop-blur-md flex items-center gap-1.5 z-30">
              <span>👦</span> Mascot Asy
            </span>
          </div>

          {/* ================= CENTER GATE ENTRANCE PORTAL ================= */}
          <div className="w-full max-w-sm md:max-w-md mx-auto sm:mx-4 text-center space-y-3 pointer-events-auto z-30 my-2 md:my-0">
            <div
              className={`p-5 sm:p-7 bg-white/95 backdrop-blur-lg rounded-3xl border-4 border-amber-400 shadow-2xl transition-all duration-700 ${
                isOpen ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
              }`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-xl mb-2 border-2 border-amber-300">
                <DoorOpen className="w-8 h-8 sm:w-9 sm:h-9 text-amber-300 animate-pulse" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight tracking-tight">
                GERBANG ASY SYIFA
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-bold">
                Masuk ke Dunia Pendidikan Ceria & Islami
              </p>

              {/* Primary Entrance Button */}
              <button
                onClick={handleEnterClick}
                className="w-full mt-4 py-3.5 px-6 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-800 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border-2 border-emerald-400 min-h-[50px]"
              >
                MASUK KE DUNIA ASY SYIFA <ArrowRight className="w-5 h-5 text-amber-300 animate-pulse" />
              </button>

              <button
                onClick={onEnterWorld}
                className="mt-2 text-xs text-stone-500 hover:text-emerald-800 font-bold underline cursor-pointer p-1 transition-colors"
              >
                Langsung Masuk ke Halaman Utama
              </button>
            </div>
          </div>

          {/* ================= SYIFA (RIGHT GIRL MASCOT) ================= */}
          <div
            onClick={handleSyifaClick}
            aria-label="Syifa — Maskot TK Asy Syifa"
            role="button"
            tabIndex={0}
            className={`flex flex-col items-center group relative z-20 cursor-pointer transition-all duration-300 ${
              syifaActiveHighlight ? 'scale-110 drop-shadow-[0_0_35px_rgba(244,114,182,0.95)]' : 'hover:scale-105'
            }`}
            style={{
              transform: prefersReducedMotion ? 'none' : `translate(${mousePos.x * 10}px, ${mousePos.y * -6}px)`
            }}
          >
            {/* Master Mascot Renderer with Garden Ground Integration */}
            <div className="relative w-48 sm:w-64 h-60 sm:h-80 flex items-center justify-center">
              <MasterMascotRenderer
                character="SYIFA"
                state={isOpen ? 'celebrate' : syifaState}
                scale={1.15}
                gazeX={mousePos.x}
                gazeY={mousePos.y}
                speechBubbleText={syifaDialog}
              />
              {/* Garden Grass & Flowers surrounding Syifa's feet */}
              <div className="absolute -bottom-1 inset-x-4 flex justify-around text-xs pointer-events-none opacity-90 z-20">
                <span>🌷</span>
                <span>🌿</span>
                <span>🌸</span>
                <span>🌱</span>
              </div>
            </div>
            <span className="mt-1 px-4 py-1.5 bg-pink-900/95 text-pink-100 text-xs font-black rounded-full shadow-xl border-2 border-pink-400/80 backdrop-blur-md flex items-center gap-1.5 z-30">
              <span>👧</span> Mascot Syifa
            </span>
          </div>
        </div>

        {/* ================= GARDEN LANDSCAPE BASE & FOOTER BAR ================= */}
        <div className="w-full h-14 sm:h-16 bg-gradient-to-r from-emerald-700 via-green-600 to-teal-700 rounded-t-3xl border-t-4 border-emerald-400 flex items-center justify-between px-4 sm:px-10 shadow-2xl relative z-30">
          <div className="flex items-center gap-2">
            <Flower2 className="w-5 h-5 sm:w-6 sm:h-6 text-pink-300 animate-spin" style={{ animationDuration: '16s' }} />
            <span className="text-xs font-black text-white hidden sm:inline">RAMAH ANAK & ISLAMI</span>
          </div>

          <span className="text-[11px] sm:text-xs font-black text-amber-200 tracking-wider text-center">
            🌸 LINGKUNGAN ASRI • TANGGUL WETAN • JEMBER 🌸
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white hidden sm:inline">BERKARAKTER QURANI</span>
            <Flower2 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 animate-spin" style={{ animationDuration: '18s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};


