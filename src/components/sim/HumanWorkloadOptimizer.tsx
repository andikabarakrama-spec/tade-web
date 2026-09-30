import React, { useState } from 'react';
import { 
  TrendingDown, 
  Clock, 
  Zap, 
  CheckCircle2, 
  Sparkles, 
  BarChart3, 
  Lightbulb, 
  ArrowRight, 
  Users,
  Smile
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface WorkloadStat {
  category: string;
  automatedPct: number;
  manualPct: number;
  hoursSavedMonthly: number;
  details: string;
}

const WORKLOAD_DATA: WorkloadStat[] = [
  {
    category: 'Persuratan & Tata Usaha',
    automatedPct: 92,
    manualPct: 8,
    hoursSavedMonthly: 44,
    details: 'Penomoran surat, template F4, penataan tanda tangan QR digital otomatis.'
  },
  {
    category: 'Rekonsiliasi Kasir & SPP',
    automatedPct: 95,
    manualPct: 5,
    hoursSavedMonthly: 38,
    details: 'Pencocokan mutasi BSI, penerbitan kwitansi QR, dan kalkulasi tunggakan.'
  },
  {
    category: 'Presensi & Kesiapan KBM',
    automatedPct: 88,
    manualPct: 12,
    hoursSavedMonthly: 30,
    details: 'Checklist 8 pilar harian, rekapitulasi kehadiran guru & santri ke Buku Induk.'
  },
  {
    category: 'PPDB & Penerimaan Santri',
    automatedPct: 90,
    manualPct: 10,
    hoursSavedMonthly: 28,
    details: 'Verifikasi berkas daring, alokasi nomor induk calon santri, notifikasi WA.'
  }
];

export const HumanWorkloadOptimizer: React.FC = () => {
  const [recommendations] = useState([
    { id: 'REC-01', title: 'Auto-Distribusi Rangkuman Raport Bulanan ke WA Wali Murid', impact: 'Hemat ~ 6 Jam / Bulan', status: 'RECOMMENDED' },
    { id: 'REC-02', title: 'Pengingat Otomatis Peremajaan Alat APE Sentra Berdasarkan Usia Pakai', impact: 'Hemat ~ 3 Jam / Bulan', status: 'RECOMMENDED' },
    { id: 'REC-03', title: 'Auto-Sync Data Kelulusan Santri ke Format EMIS Kemenag & Dapodik', impact: 'Hemat ~ 8 Jam / Semester', status: 'RECOMMENDED' }
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R503 &bull; HUMAN WORKLOAD OPTIMIZER
          </span>
          <span className="text-xs text-slate-400 font-mono">Toil Reduction &amp; Operational Efficiency Engine</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <TrendingDown className="w-8 h-8 text-emerald-400" />
              Human Workload Optimizer &bull; Pengurang Beban Kerja
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Melacak dan mengukur rasio pekerjaan otomatis vs manual staf TK Asy Syifa: memangkas kerja repetitif administratif, menghemat ratusan jam per bulan, dan memberikan rekomendasi otomatisasi lanjutan.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/80 text-center shrink-0">
            <span className="text-[10px] font-mono text-emerald-300 block">TOTAL WAKTU DIHEMAT</span>
            <span className="text-xl font-bold text-white font-mono flex items-center justify-center gap-1.5 mt-0.5">
              140+ JAM / BULAN
            </span>
            <span className="text-[10px] text-cyan-400 block font-bold">~ 91.2% Pekerjaan Terotomasi</span>
          </div>
        </div>

        {/* 4 Key Optimization Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">RASIO OTOMASI</span>
            <span className="text-base font-bold text-emerald-400 font-mono">91.2% Otomatis</span>
            <span className="text-[9px] text-emerald-500 block">8.8% Sentuhan Manual</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">PENGHEMATAN HARIAN</span>
            <span className="text-base font-bold text-cyan-400 font-mono">4.6 Jam / Hari</span>
            <span className="text-[9px] text-cyan-500 block">Fokus ke Pembelajaran Santri</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">REDUKSI STRESS STAF</span>
            <span className="text-base font-bold text-purple-400 font-mono">-78% Kelelahan</span>
            <span className="text-[9px] text-purple-400 block">Zero Overtime Lembur</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">REKOMENDASI BARU</span>
            <span className="text-base font-bold text-amber-400 font-mono">3 Usulan AI Asy</span>
            <span className="text-[9px] text-amber-500 block">Siap Diterapkan</span>
          </div>
        </div>
      </div>

      {/* Main Workload Ratio Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-500" />
              RASIO BEBAN KERJA PER DEPARTEMEN
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-500">Live Breakdown</span>
          </div>

          <div className="space-y-4">
            {WORKLOAD_DATA.map(item => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-slate-900 dark:text-white font-mono">{item.category}</strong>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                    {item.automatedPct}% Auto ({item.hoursSavedMonthly} Jam Hemat)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                  <div style={{ width: `${item.automatedPct}%` }} className="bg-emerald-500 h-full rounded-l-full" />
                  <div style={{ width: `${item.manualPct}%` }} className="bg-amber-400 h-full rounded-r-full" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                  {item.details}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Asy Future Recommendations */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              REKOMENDASI OTOMASI LANJUTAN ASY
            </h3>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              Peluang Penghematan
            </span>
          </div>

          <div className="space-y-3">
            {recommendations.map(rec => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/20 border border-slate-200 dark:border-slate-700 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {rec.id}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {rec.impact}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {rec.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
