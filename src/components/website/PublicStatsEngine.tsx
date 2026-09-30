import React, { useEffect, useState } from 'react';
import { PublicStats } from '../../types';
import { DataService } from '../../services/db';
import { Users, Award, BookOpen, CheckCircle2, Sparkles, UserCheck, School } from 'lucide-react';

export const PublicStatsEngine: React.FC = () => {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    DataService.getPublicStats().then(setStats);
  }, []);

  if (!stats) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden my-8">
      {/* Decorative Garden Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest bg-amber-400 text-slate-950 px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Public Data Engine • SIM Realtime Sync
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Statistik Live & Perkembangan TK Asy Syifa
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm">
            Data terintegrasi dari Sistem Informasi Manajemen Sekolah (SIM) Tahun Ajaran {stats.activeAcademicYear}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Active Students */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 text-center space-y-1 transform hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-amber-400 text-slate-950 rounded-2xl mx-auto flex items-center justify-center font-black shadow-md">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-3xl sm:text-4xl font-black text-amber-300 block">{stats.totalStudents}</span>
            <span className="text-xs font-bold text-emerald-100 block">Siswa Cilik Aktif</span>
            <p className="text-[10px] text-stone-300">Kelompok A & B</p>
          </div>

          {/* Certified Teachers */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 text-center space-y-1 transform hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-emerald-400 text-slate-950 rounded-2xl mx-auto flex items-center justify-center font-black shadow-md">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-3xl sm:text-4xl font-black text-emerald-300 block">{stats.totalTeachers}</span>
            <span className="text-xs font-bold text-emerald-100 block">Pendidik S1 PAUD</span>
            <p className="text-[10px] text-stone-300">Berpengalaman & Teladan</p>
          </div>

          {/* Achievements */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 text-center space-y-1 transform hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-teal-400 text-slate-950 rounded-2xl mx-auto flex items-center justify-center font-black shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-3xl sm:text-4xl font-black text-teal-300 block">{stats.totalAchievements}+</span>
            <span className="text-xs font-bold text-emerald-100 block">Prestasi Siswa</span>
            <p className="text-[10px] text-stone-300">Kecamatan & Kabupaten</p>
          </div>

          {/* PPDB Quota Status */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 text-center space-y-1 transform hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-pink-400 text-slate-950 rounded-2xl mx-auto flex items-center justify-center font-black shadow-md">
              <School className="w-6 h-6" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-pink-300 block">{stats.ppdbQuotaRemaining} Kursi</span>
            <span className="text-xs font-bold text-emerald-100 block">Sisa Kuota PPDB</span>
            <span className="inline-block mt-1 text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
              {stats.ppdbStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
