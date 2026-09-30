import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  DollarSign,
  Server,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Sparkles
} from 'lucide-react';

interface ReadinessCategory {
  id: string;
  name: string;
  score: number;
  weight: string;
  icon: any;
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION';
  highlights: string[];
  recommendation: string;
}

export const SchoolReadinessScore: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const categories: ReadinessCategory[] = [
    {
      id: 'admin',
      name: 'Tata Kelola Administrasi',
      score: 96,
      weight: '15%',
      icon: FileCheck2,
      status: 'EXCELLENT',
      highlights: ['Data santri & wali lengkap 100%', 'Buku penghubung digital aktif', 'Arsip surat otomatis'],
      recommendation: 'Pertahankan pembaruan berkas berkala setiap semester baru.'
    },
    {
      id: 'academic',
      name: 'Akademik & Kurikulum Islam',
      score: 94,
      weight: '20%',
      icon: BookOpen,
      status: 'EXCELLENT',
      highlights: ['Silabus Merdeka terintegrasi', 'Catatan mutabaah tahfidz harian aktif', 'Rapor capaian santri siap cetak'],
      recommendation: 'Lengkapi bank indikator penilaian karakter islami untuk kelompok usia KB.'
    },
    {
      id: 'finance',
      name: 'Transparansi & Arus Kas Keuangan',
      score: 98,
      weight: '20%',
      icon: DollarSign,
      status: 'EXCELLENT',
      highlights: ['Rekonsiliasi otomatis Virtual Account 100%', 'Nol selisih kas fisik & POS', 'Laporan bulanan siap ekspor'],
      recommendation: 'Semua tagihan SPP berjalan dengan auto-reminder terjadwal.'
    },
    {
      id: 'infra',
      name: 'Infrastruktur & Sarana POS',
      score: 92,
      weight: '15%',
      icon: Server,
      status: 'EXCELLENT',
      highlights: ['Printer thermal kasir terhubung', 'Absensi fingerprint sinkron', 'Koneksi offline-first cadangan aktif'],
      recommendation: 'Lakukan kalibrasi kertas thermal cadangan di meja resepsionis.'
    },
    {
      id: 'security',
      name: 'Keamanan & Kepatuhan Data PDP',
      score: 99,
      weight: '15%',
      icon: ShieldCheck,
      status: 'EXCELLENT',
      highlights: ['Kepatuhan ISO 27001 & Permendikbud', 'Enkripsi data santri AES-256', 'Pemisahan multi-tenant air-gapped'],
      recommendation: 'Audit keamanan berkala terus dilakukan secara otomatis oleh Guardian.'
    },
    {
      id: 'digital',
      name: 'Adopsi Digital Guru & Wali Murid',
      score: 95,
      weight: '15%',
      icon: Smartphone,
      status: 'EXCELLENT',
      highlights: ['96% wali menginstal Parent Portal', '100% guru menginput presensi via HP', 'Notifikasi WhatsApp terbaca >90%'],
      recommendation: 'Sediakan panduan singkat satu lembar untuk wali santri baru.'
    }
  ];

  const overallScore = Math.round(
    categories.reduce((acc, curr) => acc + curr.score, 0) / categories.length
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
              <Award className="w-3.5 h-3.5" />
              Sertifikasi Akreditasi Digital
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">School Readiness Index</h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Penilaian komprehensif 6 pilar kesiapan operasional, digitalisasi, dan kepatuhan standar PAUD/TK modern.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center min-w-[200px] flex flex-col items-center justify-center">
            <span className="text-xs font-medium text-emerald-200 uppercase tracking-wider">Skor Kesiapan Total</span>
            <div className="text-4xl sm:text-5xl font-extrabold text-white my-1">{overallScore}<span className="text-xl font-normal text-emerald-200">/100</span></div>
            <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-400/20 text-emerald-100 text-xs font-bold border border-emerald-300/30">
              Predikat: A+ (Sangat Siap)
            </span>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-slate-300 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{cat.name}</h3>
                    <span className="text-[10px] text-slate-400">Bobot: {cat.weight}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-emerald-600 font-mono">{cat.score}</span>
                  <span className="text-[10px] text-slate-400">/100</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${cat.score}%` }}
                />
              </div>

              {/* Highlights */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Capaian Utama:</span>
                <ul className="space-y-1">
                  {cat.highlights.map((h, i) => (
                    <li key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendation */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
                <strong className="text-slate-700">Rekomendasi:</strong> {cat.recommendation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
