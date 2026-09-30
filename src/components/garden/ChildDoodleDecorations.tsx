import React, { useState } from 'react';
import { Sparkles, Heart, Smile, Star, Volume2, X } from 'lucide-react';

// Hand-Drawn / Child-Style SVG Doodles
export const DoodleSun: React.FC<{ className?: string }> = ({ className = "w-12 h-12 text-amber-400" }) => (
  <svg viewBox="0 0 100 100" className={`${className} animate-spin-slow`} fill="currentColor">
    <circle cx="50" cy="50" r="24" fill="#FBBF24" />
    <path
      d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50 M22 22 L29 29 M71 71 L78 78 M22 78 L29 71 M71 29 L78 22"
      stroke="#F59E0B"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <circle cx="42" cy="44" r="3" fill="#78350F" />
    <circle cx="58" cy="44" r="3" fill="#78350F" />
    <path d="M42 56 Q50 64 58 56" stroke="#78350F" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

export const DoodleCloud: React.FC<{ className?: string }> = ({ className = "w-16 h-10 text-sky-200" }) => (
  <svg viewBox="0 0 120 80" className={`${className} animate-float-slow`} fill="currentColor">
    <path
      d="M20 60 A20 20 0 0 1 40 30 A25 25 0 0 1 85 30 A20 20 0 0 1 100 60 Z"
      fill="#E0F2FE"
      stroke="#38BDF8"
      strokeWidth="4"
    />
    <circle cx="45" cy="50" r="3" fill="#0369A1" />
    <circle cx="65" cy="50" r="3" fill="#0369A1" />
    <path d="M50 56 Q55 60 60 56" stroke="#0369A1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);

export const DoodleRainbow: React.FC<{ className?: string }> = ({ className = "w-24 h-14" }) => (
  <svg viewBox="0 0 120 70" className={className}>
    <path d="M10 65 A50 50 0 0 1 110 65" fill="none" stroke="#EF4444" strokeWidth="7" strokeLinecap="round" />
    <path d="M18 65 A42 42 0 0 1 102 65" fill="none" stroke="#F59E0B" strokeWidth="7" strokeLinecap="round" />
    <path d="M26 65 A34 34 0 0 1 94 65" fill="none" stroke="#10B981" strokeWidth="7" strokeLinecap="round" />
    <path d="M34 65 A26 26 0 0 1 86 65" fill="none" stroke="#3B82F6" strokeWidth="7" strokeLinecap="round" />
    <path d="M42 65 A18 18 0 0 1 78 65" fill="none" stroke="#8B5CF6" strokeWidth="7" strokeLinecap="round" />
  </svg>
);

export const DoodlePencil: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 60 60" className={className}>
    <path d="M10 50 L15 35 L40 10 L50 20 L25 45 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
    <polygon points="10,50 15,35 25,45" fill="#FED7AA" stroke="#D97706" strokeWidth="2" />
    <polygon points="10,50 12,46 14,48" fill="#1E293B" />
    <rect x="42" y="8" width="10" height="12" rx="2" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
  </svg>
);

export const DoodleCrayon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 60 60" className={className}>
    <rect x="15" y="15" width="30" height="35" rx="3" fill="#EC4899" stroke="#BE185D" strokeWidth="3" />
    <polygon points="30,5 15,15 45,15" fill="#F472B6" stroke="#BE185D" strokeWidth="2" />
    <line x1="20" y1="25" x2="40" y2="25" stroke="#FFF" strokeWidth="3" strokeDasharray="2 2" />
  </svg>
);

export const DoodlePaperAirplane: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 80 60" className={`${className} animate-pulse`}>
    <path d="M10 30 L70 10 L45 50 L35 38 L10 30 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
    <path d="M70 10 L35 38" stroke="#0284C7" strokeWidth="2" />
    <path d="M5 35 Q10 40 15 35" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 3" />
  </svg>
);

export const DoodleKite: React.FC<{ className?: string }> = ({ className = "w-10 h-14" }) => (
  <svg viewBox="0 0 60 90" className={`${className} animate-sway`}>
    <polygon points="30,5 55,35 30,65 5,35" fill="#F43F5E" stroke="#BE123C" strokeWidth="3" />
    <line x1="30" y1="5" x2="30" y2="65" stroke="#FFE4E6" strokeWidth="2" />
    <line x1="5" y1="35" x2="55" y2="35" stroke="#FFE4E6" strokeWidth="2" />
    <path d="M30 65 Q40 75 25 85 T35 95" stroke="#FB7185" strokeWidth="2.5" fill="none" />
    <circle cx="25" cy="85" r="3" fill="#FBBF24" />
  </svg>
);

export const DoodleBlocks: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 70 70" className={className}>
    <rect x="5" y="35" width="30" height="30" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
    <text x="15" y="57" fontSize="20" fontWeight="bold" fill="#FFF">A</text>
    <rect x="35" y="35" width="30" height="30" rx="4" fill="#10B981" stroke="#047857" strokeWidth="3" />
    <text x="45" y="57" fontSize="20" fontWeight="bold" fill="#FFF">B</text>
    <rect x="20" y="5" width="30" height="30" rx="4" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
    <text x="30" y="27" fontSize="20" fontWeight="bold" fill="#FFF">C</text>
  </svg>
);

export const DoodleHandprint: React.FC<{ className?: string }> = ({ className = "w-8 h-8 text-rose-400" }) => (
  <svg viewBox="0 0 80 80" className={className} fill="currentColor">
    <circle cx="40" cy="50" r="18" />
    <ellipse cx="25" cy="22" rx="4" ry="12" transform="rotate(-20 25 22)" />
    <ellipse cx="35" cy="18" rx="4" ry="14" />
    <ellipse cx="46" cy="19" rx="4" ry="13" transform="rotate(10 46 19)" />
    <ellipse cx="56" cy="24" rx="3.5" ry="11" transform="rotate(25 56 24)" />
    <ellipse cx="18" cy="38" rx="4" ry="10" transform="rotate(-50 18 38)" />
  </svg>
);

// Interactive Playground Overlay Component
export const InteractiveKindergartenPlayground: React.FC = () => {
  const [mascotMessage, setMascotMessage] = useState<string | null>(null);
  const [activeStory, setActiveStory] = useState<string | null>("Dek Syifa sedang menyiram tanaman di taman sekolah.");
  const [busHonked, setBusHonked] = useState(false);
  const [birdChirped, setBirdChirped] = useState(false);
  const [applesCount, setApplesCount] = useState(3);
  const [balloonPopped, setBalloonPopped] = useState(false);

  const mascotGreetings = [
    "Assalamu'alaikum teman-teman! Selamat datang di TK Asy Syifa!",
    "Hari ini kita mau mewarnai dan membaca Iqro bersama Dek Syifa!",
    "Aku senang sekali belajar di Kampus Hijau yang asri!",
    "Ayo belajar berdoa sebelum makan dan tidur!",
    "Senyum, salam, dan sapa adalah akhlak terpuji!"
  ];

  const handleMascotClick = () => {
    const randomMsg = mascotGreetings[Math.floor(Math.random() * mascotGreetings.length)];
    setMascotMessage(randomMsg);
  };

  const handleBusHonk = () => {
    setBusHonked(true);
    setTimeout(() => setBusHonked(false), 2500);
  };

  const handleBirdChirp = () => {
    setBirdChirped(true);
    setTimeout(() => setBirdChirped(false), 2500);
  };

  const handleAppleTreeClick = () => {
    if (applesCount > 0) {
      setApplesCount(prev => prev - 1);
    } else {
      setApplesCount(3);
    }
  };

  return (
    <div className="relative my-6 p-4 sm:p-6 bg-gradient-to-r from-emerald-100 via-teal-50 to-sky-100 rounded-3xl border-2 border-amber-300 shadow-md overflow-hidden">
      {/* Mini Stories Bar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 mb-4 border-b border-emerald-200">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs">
            📖
          </span>
          <div>
            <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wider">
              Cerita Mini Taman Asy Syifa
            </h4>
            <p className="text-xs text-stone-700 font-bold italic">
              “{activeStory}”
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 text-[10px] font-extrabold">
          <button
            onClick={() => setActiveStory("Burung kecil sedang mengantar anak ke sekolah.")}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-amber-100 text-emerald-900 border border-emerald-300 shadow-2xs"
          >
            🐦 Burung Kecil
          </button>

          <button
            onClick={() => setActiveStory("Kelinci putih sedang melompat gembira di rumput.")}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-amber-100 text-emerald-900 border border-emerald-300 shadow-2xs"
          >
            🐇 Kelinci Taman
          </button>

          <button
            onClick={() => setActiveStory("Lebah madu sedang mencari sari bunga matahari.")}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-amber-100 text-emerald-900 border border-emerald-300 shadow-2xs"
          >
            🐝 Lebah Madu
          </button>

          <button
            onClick={() => setActiveStory("Dek Syifa sedang menyiram tanaman di taman sekolah.")}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-amber-100 text-emerald-900 border border-emerald-300 shadow-2xs"
          >
            🌱 Dek Syifa
          </button>
        </div>
      </div>

      {/* Interactive Objects Playground Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
        {/* Interactive Dek Syifa Mascot */}
        <div
          onClick={handleMascotClick}
          className="bg-white p-3 rounded-2xl border-2 border-emerald-300 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col items-center justify-between relative"
        >
          <div className="text-3xl group-hover:scale-125 transition duration-300 animate-bounce">
            👶
          </div>
          <span className="text-[11px] font-black text-slate-900 mt-1">Dek Syifa</span>
          <span className="text-[9px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full mt-1">Klik Aku!</span>
        </div>

        {/* Interactive Bus Sekolah */}
        <div
          onClick={handleBusHonk}
          className="bg-white p-3 rounded-2xl border-2 border-amber-300 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col items-center justify-between relative"
        >
          <div className="text-3xl group-hover:scale-125 transition duration-300 animate-pulse">
            🚌
          </div>
          <span className="text-[11px] font-black text-slate-900 mt-1">Bus Sekolah</span>
          <span className="text-[9px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full mt-1">
            {busHonked ? "Tiiinn Tiiinn! 🔊" : "Bunyikan Klakson"}
          </span>
        </div>

        {/* Interactive Bird */}
        <div
          onClick={handleBirdChirp}
          className="bg-white p-3 rounded-2xl border-2 border-sky-300 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col items-center justify-between relative"
        >
          <div className="text-3xl group-hover:scale-125 transition duration-300">
            🐦
          </div>
          <span className="text-[11px] font-black text-slate-900 mt-1">Burung Taman</span>
          <span className="text-[9px] text-sky-800 font-bold bg-sky-100 px-2 py-0.5 rounded-full mt-1">
            {birdChirped ? "Cuit Cuit! 🎶" : "Dengarkan Kicauan"}
          </span>
        </div>

        {/* Interactive Apple Tree */}
        <div
          onClick={handleAppleTreeClick}
          className="bg-white p-3 rounded-2xl border-2 border-rose-300 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col items-center justify-between relative"
        >
          <div className="text-3xl group-hover:scale-125 transition duration-300">
            🌳
          </div>
          <span className="text-[11px] font-black text-slate-900 mt-1">Pohon Apel</span>
          <span className="text-[9px] text-rose-800 font-bold bg-rose-100 px-2 py-0.5 rounded-full mt-1">
            Apel: {applesCount} 🍎 (Petik)
          </span>
        </div>

        {/* Interactive Balloon */}
        <div
          onClick={() => setBalloonPopped(!balloonPopped)}
          className="bg-white p-3 rounded-2xl border-2 border-purple-300 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col items-center justify-between relative col-span-2 sm:col-span-1"
        >
          <div className="text-3xl group-hover:scale-125 transition duration-300">
            {balloonPopped ? "💥" : "🎈"}
          </div>
          <span className="text-[11px] font-black text-slate-900 mt-1">Balon Warna</span>
          <span className="text-[9px] text-purple-800 font-bold bg-purple-100 px-2 py-0.5 rounded-full mt-1">
            {balloonPopped ? "Letus! (Tiup Lagi)" : "Letuskan Balon"}
          </span>
        </div>
      </div>

      {/* Mascot Message Modal Popup */}
      {mascotMessage && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-amber-400 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center text-4xl mx-auto shadow-md">
              👶
            </div>
            <h3 className="text-base font-black text-slate-900">
              Pesan Dari Dek Syifa Maskot!
            </h3>
            <p className="text-xs text-stone-700 bg-amber-50 p-4 rounded-2xl border border-amber-200 font-bold leading-relaxed">
              “{mascotMessage}”
            </p>
            <button
              onClick={() => setMascotMessage(null)}
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs rounded-xl shadow-md transition"
            >
              Terima Kasih Dek Syifa!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
