import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  GraduationCap,
  Moon,
  Flag,
  DollarSign,
  Award,
  Layers,
  Search,
  Filter
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface ScheduledEvent {
  id: string;
  title: string;
  category: 'NASIONAL' | 'PENDIDIKAN' | 'ISLAM' | 'SEKOLAH' | 'WISUDA' | 'HAFLAH' | 'MPLS' | 'UJIAN' | 'RAPORT' | 'SPP';
  dateStr: string;
  hijriDate?: string;
  description: string;
  status: 'SYNCHRONIZED' | 'UPCOMING' | 'COMPLETED';
}

export const SmartSchoolScheduler: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const events: ScheduledEvent[] = [
    {
      id: 'SCH-01',
      title: 'Hari Kemerdekaan Republik Indonesia ke-81',
      category: 'NASIONAL',
      dateStr: '17 Agustus 2026',
      description: 'Upacara Bendera & Pawai Budaya Santri Sentra Kreativitas',
      status: 'UPCOMING'
    },
    {
      id: 'SCH-02',
      title: 'Masa Pengenalan Lingkungan Sekolah (MPLS) Santri Baru',
      category: 'MPLS',
      dateStr: '18-20 Juli 2026',
      description: 'Orientasi Sentra Balok, Alam, Main Peran, dan Pengenalan Ustadzah',
      status: 'COMPLETED'
    },
    {
      id: 'SCH-03',
      title: 'Jatuh Tempo Pembayaran SPP Bulan Agustus 2026',
      category: 'SPP',
      dateStr: '10 Agustus 2026',
      description: 'Pengingat otomatis via notifikasi multi-kanal wali santri',
      status: 'COMPLETED'
    },
    {
      id: 'SCH-04',
      title: 'Peringatan Maulid Nabi Muhammad SAW 1448 H',
      category: 'ISLAM',
      dateStr: '25 Agustus 2026',
      hijriDate: '12 Rabiul Awal 1448 H',
      description: 'Pentas Seni Hadrah & Dongeng Teladan Rasulullah bersama Dek Asy',
      status: 'UPCOMING'
    },
    {
      id: 'SCH-05',
      title: 'Asesmen Tengah Semester (UTS) Sentra Imtaq & Persiapan',
      category: 'UJIAN',
      dateStr: '21-25 September 2026',
      description: 'Observasi capaian motorik, kognitif, dan hafalan surat pendek',
      status: 'UPCOMING'
    },
    {
      id: 'SCH-06',
      title: 'Penilaian Akhir Semester (UAS) / Evaluasi Sentra',
      category: 'UJIAN',
      dateStr: '07-12 Desember 2026',
      description: 'Portofolio karya santri dan rubrik perkembangan Kurikulum Merdeka PAUD',
      status: 'UPCOMING'
    },
    {
      id: 'SCH-07',
      title: 'Penyerahan Raport Semester Ganjil TA 2026/2027',
      category: 'RAPORT',
      dateStr: '19 Desember 2026',
      description: 'Penerbitan e-Raport QR SHA-256 dan temu wicara wali santri',
      status: 'UPCOMING'
    },
    {
      id: 'SCH-08',
      title: 'Haflah Akhirussanah & Wisuda Tahfidz Juz 30',
      category: 'HAFLAH',
      dateStr: '12 Juni 2027',
      description: 'Prosesi wisuda pelepasan santri kelompok B dan tasmi Al-Quran',
      status: 'UPCOMING'
    },
    {
      id: 'SCH-09',
      title: 'Wisuda Santri Kelulusan PAUD & TK Asy-Syifa',
      category: 'WISUDA',
      dateStr: '19 Juni 2027',
      description: 'Pemberian piagam kelulusan resmi dinas dan apresiasi karakter santri',
      status: 'UPCOMING'
    }
  ];

  const filteredEvents = events.filter(e => {
    const matchesCat = selectedFilter === 'ALL' || e.category === selectedFilter;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div id="smart-school-scheduler-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R412 &bull; SMART SCHOOL SCHEDULER
              </span>
              <span className="text-xs text-slate-400 font-mono">Academic, Islamic, National &amp; Financial Synchronizer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Calendar className="w-8 h-8 text-cyan-400" />
              Sinkronisasi Jadwal Akademik &amp; Kalender Terpadu
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Menyelaraskan kalender nasional, hari besar Islam, kegiatan sentra, agenda MPLS, jadwal ujian (UTS/UAS), pembagian raport, jatuh tempo SPP, dan wisuda haflah secara otomatis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-2 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
              100% SINKRON
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['ALL', 'NASIONAL', 'ISLAM', 'MPLS', 'UJIAN', 'RAPORT', 'SPP', 'HAFLAH', 'WISUDA'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedFilter === cat
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari agenda kegiatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-[10px] text-slate-400">{evt.id} &bull; {evt.category}</span>
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                evt.status === 'COMPLETED' ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' :
                'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
              }`}>
                {evt.status}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {evt.title}
            </h3>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Tanggal Masehi:</span>
                <strong className="text-slate-700 dark:text-slate-300">{evt.dateStr}</strong>
              </div>
              {evt.hijriDate && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Tanggal Hijriah:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">{evt.hijriDate}</strong>
                </div>
              )}
            </div>

            <p className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 text-slate-600 dark:text-slate-400 text-[10px] leading-relaxed">
              {evt.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
