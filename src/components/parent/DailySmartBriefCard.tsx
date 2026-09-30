import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, Moon, Shirt, BookOpen, Utensils, Calendar, 
  CheckCircle2, Sparkles, PiggyBank, Heart, ArrowRight, 
  Clock, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { defaultSchoolTimeAdapter, SCHOOL_PERIOD_DEFINITIONS } from '../../core/masterCharacter/schoolTimeAdapter';
import { Student } from '../../types';

interface DailySmartBriefCardProps {
  activeStudent?: Student | null;
  onSelectModule?: (moduleCode: string) => void;
  compact?: boolean;
}

interface UniformInfo {
  dayName: string;
  uniform: string;
  activity: string;
  colorBadge: string;
}

const UNIFORM_SCHEDULE: Record<number, UniformInfo> = {
  1: { // Senin
    dayName: 'Senin',
    uniform: 'Seragam Putih - Hijau Asy Syifa',
    activity: 'Upacara Bendera Santri & Doa Pagi Bersama',
    colorBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  2: { // Selasa
    dayName: 'Selasa',
    uniform: 'Seragam Batik Khas Asy Syifa',
    activity: 'Sentra Balok, Sains & Eksplorasi Kreatif',
    colorBadge: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  3: { // Rabu
    dayName: 'Rabu',
    uniform: 'Seragam Kaos Olahraga Ceria',
    activity: 'Senam Irama Santri, Motorik Kasar & Outbound Cilik',
    colorBadge: 'bg-sky-100 text-sky-800 border-sky-300'
  },
  4: { // Kamis
    dayName: 'Kamis',
    uniform: 'Busana Muslim Khas Santri',
    activity: 'Sentra Imtaq, Praktik Wudhu & Kisah Teladan Nabi',
    colorBadge: 'bg-teal-100 text-teal-800 border-teal-300'
  },
  5: { // Jumat
    dayName: 'Jumat',
    uniform: 'Busana Santri Putih / Pramuka Pra-Siaga',
    activity: 'Sholat Dhuha Berjamaah & Kotak Infaq Jumat Berkah',
    colorBadge: 'bg-emerald-100 text-emerald-900 border-emerald-400'
  },
  6: { // Sabtu
    dayName: 'Sabtu',
    uniform: 'Pakaian Santai Sopan',
    activity: 'Libur Akhir Pekan — Quality Time Keluarga',
    colorBadge: 'bg-stone-100 text-stone-700 border-stone-300'
  },
  0: { // Ahad
    dayName: 'Ahad',
    uniform: 'Pakaian Santai Sopan',
    activity: 'Libur Akhir Pekan — Istirahat & Persiapan Esok Hari',
    colorBadge: 'bg-stone-100 text-stone-700 border-stone-300'
  }
};

export const DailySmartBriefCard: React.FC<DailySmartBriefCardProps> = ({
  activeStudent,
  onSelectModule,
  compact = false
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const hours = currentDate.getHours();
  const dayOfWeek = currentDate.getDay();
  const isMorning = hours >= 4 && hours < 12;
  const isAfternoon = hours >= 12 && hours < 18;
  const isNight = hours >= 18 || hours < 4;

  const currentPeriod = defaultSchoolTimeAdapter.getCurrentPeriod();
  const periodMeta = currentPeriod;
  const uniformInfo = UNIFORM_SCHEDULE[dayOfWeek];

  const studentName = activeStudent?.nickname || activeStudent?.namaLengkap || 'Ananda';
  const studentClass = activeStudent?.classGroup || activeStudent?.kelompok || 'Kelompok B';

  const dateStringFormatted = currentDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className={`bg-gradient-to-br ${
      isMorning 
        ? 'from-amber-50 via-emerald-50/40 to-teal-50 border-emerald-200/80 shadow-emerald-900/5' 
        : isAfternoon
        ? 'from-emerald-50 via-teal-50/40 to-sky-50 border-teal-200/80 shadow-teal-900/5'
        : 'from-slate-900 via-indigo-950 to-slate-900 text-white border-indigo-700/60 shadow-xl'
    } rounded-3xl p-6 sm:p-7 border shadow-md relative overflow-hidden transition-all duration-300`}>
      
      {/* Decorative ambient badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-2xl ${
            isMorning ? 'bg-amber-100 text-amber-700' : isAfternoon ? 'bg-teal-100 text-teal-700' : 'bg-indigo-900/80 text-amber-300'
          }`}>
            {isMorning ? <Sun className="w-5 h-5 animate-spin-slow" /> : <Moon className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                {isMorning ? 'Smart Brief Pagi' : isAfternoon ? 'Smart Brief Siang & Sore' : 'Smart Brief Malam'}
              </span>
              <span className="text-[10px] bg-emerald-600/15 text-emerald-700 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                {periodMeta?.label || 'Sentra Santri'}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-300 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              {dateStringFormatted}
            </p>
          </div>
        </div>

        {/* Student Active Pill */}
        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-stone-200/80 dark:border-white/10 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-bold text-stone-800 dark:text-white">
            {studentName} ({studentClass})
          </span>
        </div>
      </div>

      {/* Brief Content Switcher */}
      {isMorning ? (
        /* ================= MORNING SMART BRIEF ================= */
        <div className="space-y-4">
          <div className="bg-white/90 dark:bg-stone-800/90 rounded-2xl p-4 border border-emerald-100 dark:border-stone-700 space-y-1">
            <h4 className="text-sm font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              Semangat Pagi Ayah & Bunda!
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Awali hari dengan bismillah dan senyuman hangat. Berikut panduan persiapan ananda hari ini:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Seragam */}
            <div className="bg-white/80 dark:bg-stone-800/80 p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-700 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                <Shirt className="w-4 h-4" />
                <span>Seragam Hari Ini</span>
              </div>
              <p className="text-xs font-extrabold text-stone-800 dark:text-stone-100">
                {uniformInfo.uniform}
              </p>
              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md border ${uniformInfo.colorBadge}`}>
                {uniformInfo.activity}
              </span>
            </div>

            {/* 2. Tahfidz */}
            <div className="bg-white/80 dark:bg-stone-800/80 p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-700 space-y-1.5">
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs">
                <BookOpen className="w-4 h-4" />
                <span>Target Tahfidz</span>
              </div>
              <p className="text-xs font-extrabold text-stone-800 dark:text-stone-100">
                Surah An-Naba / Juz Amma
              </p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                Muroja'ah ayat 1-15 & Doa Masuk Masjid
              </p>
            </div>

            {/* 3. Bekal */}
            <div className="bg-white/80 dark:bg-stone-800/80 p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-700 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                <Utensils className="w-4 h-4" />
                <span>Bekal & Perlengkapan</span>
              </div>
              <p className="text-xs font-extrabold text-stone-800 dark:text-stone-100">
                Bekal Sehat Halal & Air Minum
              </p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                Buku penghubung & perlengkapan sholat
              </p>
            </div>

            {/* 4. Agenda Hari Ini */}
            <div className="bg-white/80 dark:bg-stone-800/80 p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-700 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs">
                <Calendar className="w-4 h-4" />
                <span>Agenda Utama</span>
              </div>
              <p className="text-xs font-extrabold text-stone-800 dark:text-stone-100">
                {periodMeta?.label || 'Sentra Belajar Kreatif'}
              </p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                Pukul 07.15 s/d 11.00 WIB
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ================= AFTERNOON & EVENING SMART BRIEF ================= */
        <div className="space-y-4">
          <div className="bg-white/90 dark:bg-stone-800/90 rounded-2xl p-4 border border-teal-100 dark:border-stone-700 space-y-1">
            <h4 className="text-sm font-black text-teal-900 dark:text-teal-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Alhamdulillah, Kegiatan Sekolah Hari Ini Berjalan Lancar!
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Ananda telah menyelesaikan aktivitas sentra dengan riang. Berikut rangkuman kepulangan & catatan penting:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Presensi & Kepulangan */}
            <div className="bg-white/80 dark:bg-stone-800/80 p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-700 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Status Kepulangan</span>
              </div>
              <p className="text-xs font-extrabold text-stone-800 dark:text-stone-100">
                Penjemputan Terkonfirmasi
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Telah pulang bersama wali terdaftar
              </p>
            </div>

            {/* 2. Mutabaah Capaian */}
            <div className="bg-white/80 dark:bg-stone-800/80 p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-700 space-y-1.5">
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs">
                <BookOpen className="w-4 h-4" />
                <span>Tahfidz Hari Ini</span>
              </div>
              <p className="text-xs font-extrabold text-stone-800 dark:text-stone-100">
                Predikat: Mumtaz ⭐⭐⭐
              </p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                Setoran hafalan & makhraj lancar
              </p>
            </div>

            {/* 3. Info Tabungan / Infaq */}
            <div className="bg-white/80 dark:bg-stone-800/80 p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-700 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                <PiggyBank className="w-4 h-4" />
                <span>Tabungan & Infaq</span>
              </div>
              <p className="text-xs font-extrabold text-stone-800 dark:text-stone-100">
                Status SPP: Lunas Terverifikasi
              </p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                Kwitansi digital aman di Portal R10
              </p>
            </div>

            {/* 4. Persiapan Besok */}
            <div className="bg-white/80 dark:bg-stone-800/80 p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-700 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs">
                <Moon className="w-4 h-4" />
                <span>Muroja'ah Malam</span>
              </div>
              <p className="text-xs font-extrabold text-stone-800 dark:text-stone-100">
                Doa Sebelum Tidur & Adab Malam
              </p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                Istirahat cukup untuk esok pagi
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Navigation Buttons */}
      {onSelectModule && (
        <div className="mt-5 pt-4 border-t border-emerald-200/60 dark:border-stone-700/80 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-stone-600 dark:text-stone-300">
            Akses Cepat Modul Ananda:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onSelectModule('r17')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-emerald-600 hover:text-white text-emerald-800 dark:text-emerald-200 text-xs font-bold border border-emerald-200 dark:border-stone-700 transition flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Buku Tahfidz (R17)
            </button>
            <button
              onClick={() => onSelectModule('r6')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-teal-600 hover:text-white text-teal-800 dark:text-teal-200 text-xs font-bold border border-teal-200 dark:border-stone-700 transition flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Presensi Digital (R6)
            </button>
            <button
              onClick={() => onSelectModule('r10')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-amber-600 hover:text-white text-amber-800 dark:text-amber-200 text-xs font-bold border border-amber-200 dark:border-stone-700 transition flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <PiggyBank className="w-3.5 h-3.5" />
              SPP & Infaq (R10)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
