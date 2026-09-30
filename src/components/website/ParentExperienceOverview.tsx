import React from 'react';
import { Smartphone, CheckCircle, Bell, Award, BookOpen, ShieldCheck, Heart, Sparkles, LogIn } from 'lucide-react';

export const ParentExperienceOverview: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-emerald-700/60 shadow-xl space-y-8 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 max-w-3xl mx-auto relative z-10">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800/80 text-amber-300 font-extrabold text-xs border border-emerald-600/50">
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          Kenyamanan Ayah & Bunda
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Pengalaman Orang Tua di Portal SIM R29
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          Ketenangan hati Ayah & Bunda adalah prioritas kami. Seluruh tumbuh kembang, kehadiran, hafalan, dan administrasi ananda dapat dipantau dari smartphone.
        </p>
      </div>

      {/* Feature Visual Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3 hover:border-amber-400/50 transition">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <Bell className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-amber-300">Presensi Real-Time</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Notifikasi otomatis saat ananda tiba di sekolah dan disapa oleh guru piket jam 06.30 WIB.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3 hover:border-emerald-400/50 transition">
          <div className="w-10 h-10 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-emerald-300">Bintang Tahfidz Tracker</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Catatan berkala hafalan Surah pendek, doa harian, dan capaian tartil Juz 30 ananda.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3 hover:border-sky-400/50 transition">
          <div className="w-10 h-10 rounded-xl bg-sky-400 text-slate-950 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-sky-300">Jurnal & E-Rapor PAUD</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Laporan foto kegiatan harian di 5 Sentra dan e-rapor Kurikulum Merdeka tiap semester.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3 hover:border-purple-400/50 transition">
          <div className="w-10 h-10 rounded-xl bg-purple-400 text-slate-950 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-purple-300">SPP & Administrasi R30</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Riwayat pembayaran SPP transparan, kuitansi digital, dan pengingat tanggal jatuh tempo.
          </p>
        </div>
      </div>

      {/* Direct Portal Login CTA Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-2xl p-6 border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
            Sudah Menjadi Wali Murid TK Asy Syifa?
          </h3>
          <p className="text-xs text-emerald-100">
            Akses langsung akun portal SIM Wali Murid R29 untuk melihat laporan hari ini.
          </p>
        </div>

        <button
          onClick={() => {
            const btn = document.querySelector('button[title*="Wali Murid"]') as HTMLButtonElement;
            if (btn) btn.click();
            else window.location.hash = 'r29';
          }}
          className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2 shrink-0"
        >
          <LogIn className="w-4 h-4" />
          Masuk Portal Wali Murid R29
        </button>
      </div>
    </section>
  );
};
