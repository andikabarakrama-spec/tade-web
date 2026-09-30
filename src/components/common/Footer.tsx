import React from 'react';
import { GraduationCap, MapPin, Phone, Mail, Award, CheckCircle, ArrowUpRight, Heart, Sparkles, Moon } from 'lucide-react';
import { LivingGardenElements } from '../garden/LivingGardenElements';
import { LivingPageDecorator } from '../garden/LivingPageDecorator';
import { AIAsyCharacterScene } from '../assistant/AIAsyCharacterScene';

interface Props {
  onTabChange: (tab: string) => void;
}

export const Footer: React.FC<Props> = ({ onTabChange }) => {
  return (
    <footer className="relative bg-slate-950 text-slate-300 border-t border-emerald-900/60 pt-12 pb-12 overflow-hidden">
      <LivingPageDecorator pageName="Footer" />
      {/* Living Night Garden Background Elements */}
      <LivingGardenElements type="night-footer" />

      {/* Decorative Night Sky Stars */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-8 left-1/4 text-xs animate-pulse text-amber-200">✨</div>
        <div className="absolute top-12 right-1/3 text-xs animate-pulse text-amber-300 delay-500">⭐</div>
        <div className="absolute top-6 left-2/3 text-xs animate-pulse text-amber-200 delay-1000">🌟</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* AI Asy Storybook Farewell Banner - Night Sky & Garden */}
        <AIAsyCharacterScene pageContext="footer" onActionClick={() => onTabChange('w4')} className="mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">TK ASY SYIFA TANGGUL</h2>
                <p className="text-xs text-emerald-400 font-medium">NPSN 20567812 | Akreditasi A</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Taman Kanak-Kanak Islam Terpadu berkarakter Qurani, Cerdas, dan Kreatif di Tanggul, Jember, Jawa Timur.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-900/80 border border-emerald-700/60 text-amber-300 text-xs font-bold shadow-xs">
                <Award className="w-3.5 h-3.5 text-amber-400" /> Akreditasi A (96)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-emerald-300 text-xs font-bold shadow-xs">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> SIM v15 LIVE
              </span>
            </div>
          </div>

          {/* Col 2: Navigation W1-W5 */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Halaman Utama</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onTabChange('w1')} className="hover:text-amber-300 transition flex items-center gap-1.5 text-slate-300">
                  <ArrowUpRight className="w-3 h-3 text-emerald-500" /> Beranda & Sambutan
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('w2')} className="hover:text-amber-300 transition flex items-center gap-1.5 text-slate-300">
                  <ArrowUpRight className="w-3 h-3 text-emerald-500" /> Profil & Program Unggulan
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('w3')} className="hover:text-amber-300 transition flex items-center gap-1.5 text-slate-300">
                  <ArrowUpRight className="w-3 h-3 text-emerald-500" /> Berita, Pengumuman & Galeri
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('w4')} className="hover:text-amber-300 transition flex items-center gap-1.5 text-slate-300">
                  <ArrowUpRight className="w-3 h-3 text-emerald-500" /> Portal PPDB Online 2026
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('w5')} className="hover:text-amber-300 transition flex items-center gap-1.5 text-slate-300">
                  <ArrowUpRight className="w-3 h-3 text-emerald-500" /> Kontak & Lokasi Sekolah
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal SIM Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Portal SIM TK (R1–R32)</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onTabChange('r1')} className="hover:text-emerald-400 transition flex items-center gap-1.5 text-slate-300">
                  <ArrowUpRight className="w-3 h-3 text-slate-500" /> R1 Dashboard Utama
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('r6')} className="hover:text-emerald-400 transition flex items-center gap-1.5 text-slate-300">
                  <ArrowUpRight className="w-3 h-3 text-slate-500" /> R6 Presensi Siswa
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('r8')} className="hover:text-emerald-400 transition flex items-center gap-1.5 text-slate-300">
                  <ArrowUpRight className="w-3 h-3 text-slate-500" /> R8 E-Rapor PAUD & Capaian
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('r10')} className="hover:text-emerald-400 transition flex items-center gap-1.5 text-slate-300">
                  <ArrowUpRight className="w-3 h-3 text-slate-500" /> R10 Tagihan SPP & Keuangan
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('r29')} className="hover:text-emerald-400 transition flex items-center gap-1.5 text-slate-300">
                  <ArrowUpRight className="w-3 h-3 text-slate-500" /> R29 Portal Wali Murid
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Kontak Sekolah</h3>
            <div className="space-y-2 text-xs">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                Jl. Raya Tanggul No. 88, Tanggul Barat, Kec. Tanggul, Kab. Jember, Jawa Timur 68155
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                (0336) 441-239 / WA: 0812-3456-7890
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                info@tkasysyifa-tanggul.sch.id
              </p>
            </div>
          </div>
        </div>

        {/* Animated School Bus Driving Across Bottom Footer */}
        <div className="relative py-4 my-2 border-y border-slate-800/80 overflow-hidden bg-slate-900/60 rounded-xl">
          <div className="flex items-center justify-between text-xs text-amber-300 font-bold px-4">
            <span className="flex items-center gap-1.5">
              🚌 Bus Sekolah Asy Syifa Tanggul
            </span>
            <span className="text-[11px] text-slate-400">Rute Jemputan Aman & Nyaman</span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 TK ASY SYIFA TANGGUL. TADE SIM v15 LIVE. All Rights Reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-300 cursor-pointer">Privasi & Keamanan</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Syarat Ketentuan</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Panduan Pengguna</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

