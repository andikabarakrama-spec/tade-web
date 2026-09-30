import React from 'react';
import { Heart, Sparkles, PhoneCall, ArrowRight, CheckCircle2, GraduationCap } from 'lucide-react';

interface Props {
  onTabChange?: (tab: string) => void;
}

export const EmotionalCTABanner: React.FC<Props> = ({ onTabChange }) => {
  const handlePPDB = () => {
    if (onTabChange) onTabChange('w4');
    else window.location.hash = 'w4';
  };

  const handleWA = () => {
    window.open('https://wa.me/6281234567890?text=Assalamu%27alaikum,%20saya%20ingin%20bertanya%20mengenai%20Pendaftaran%20Siswa%20Baru%20TK%20Asy%20Syifa%20Tanggul', '_blank');
  };

  return (
    <section className="bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 border-2 border-amber-400/50 shadow-2xl relative overflow-hidden space-y-8">
      {/* Decorative Balloons / Ornaments */}
      <div className="absolute top-4 right-6 text-4xl animate-bounce duration-1000 opacity-80 pointer-events-none">🎈</div>
      <div className="absolute bottom-6 left-6 text-3xl animate-pulse opacity-80 pointer-events-none">🌈</div>

      <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md">
          <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
          Penerimaan Peserta Didik Baru (PPDB) 2026/2027
        </span>

        <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
          Ayo Menjadi Bagian Dari Keluarga Besar TK Asy Syifa Tanggul!
        </h2>

        <p className="text-xs sm:text-base text-stone-100 leading-relaxed max-w-2xl mx-auto">
          Mari berikan hadiah terbaik untuk masa depan buah hati Anda melalui pendidikan PAUD & Tahfidz berkualitas, islami, ramah anak, dan terintegrasi ekosistem digital.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handlePPDB}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl transition transform hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer"
          >
            <GraduationCap className="w-5 h-5 text-slate-950" />
            Daftar PPDB Online Sekarang
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleWA}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            Konsultasi WhatsApp
          </button>
        </div>

        <div className="pt-4 flex items-center justify-center gap-6 text-xs text-stone-200 border-t border-emerald-700/80">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-300" /> Kuota Terbatas Tiap Kelompok
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-300" /> Bebas Biaya Pendaftaran
          </span>
        </div>
      </div>
    </section>
  );
};
