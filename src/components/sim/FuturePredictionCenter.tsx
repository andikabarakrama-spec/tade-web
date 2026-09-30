import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  HardDrive,
  Database,
  Clock,
  Activity,
  Bot,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  RefreshCw,
  Building2
} from 'lucide-react';

export interface FuturePredictionAlert {
  id: string;
  category: 'STORAGE_EXHAUSTION' | 'BACKUP_DELAY_RISK' | 'TRIAL_EXPIRATION' | 'HEALTH_DEGRADATION' | 'ANOMALOUS_TRAFFIC';
  targetSchool: string;
  tenantId: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  headline: string;
  predictionDetail: string;
  timeHorizon: string; // e.g. "Diprediksi dalam 14 Hari"
  currentMetric: string;
  predictedMetric: string;
  recommendedAction: string;
  status: 'PENDING_ACTION' | 'MITIGATED';
}

const INITIAL_PREDICTIONS: FuturePredictionAlert[] = [
  {
    id: 'PRED-2026-001',
    category: 'STORAGE_EXHAUSTION',
    targetSchool: 'TK Islam Asy-Syifa (Pusat)',
    tenantId: 'asy-syifa-01',
    severity: 'HIGH',
    headline: 'Penyimpanan Media & Foto Portofolio Melebihi 90%',
    predictionDetail: 'Pertumbuhan upload foto portofolio santri naik 34% per pekan. Dengan tren saat ini, kuota 50 GB akan penuh dalam 12 hari.',
    timeHorizon: '12 Hari ke Depan',
    currentMetric: '44.8 GB / 50 GB (89.6%)',
    predictedMetric: '52.1 GB (Exhausted)',
    recommendedAction: 'Aktifkan Kompresi WebP Otonom & Alokasikan +25 GB Cold Vault.',
    status: 'PENDING_ACTION'
  },
  {
    id: 'PRED-2026-002',
    category: 'TRIAL_EXPIRATION',
    targetSchool: 'TK Terpadu Melati Ceria',
    tenantId: 'melati-02',
    severity: 'HIGH',
    headline: 'Masa Uji Coba Trial Segera Berakhir (Sisa 5 Hari)',
    predictionDetail: 'Aktivitas guru dan absensi QR sangat aktif (42 transaksi/hari). Diprediksi yayasan akan mengupgrade ke paket tahunan jika invoice dikirim sekarang.',
    timeHorizon: '5 Hari ke Depan',
    currentMetric: 'Hari ke-25 / 30',
    predictedMetric: 'Masa Trial Habis 19 Agustus',
    recommendedAction: 'Kirimkan proposal aktivasi tahunan via WhatsApp resmi AI Asy ke Ketua Yayasan.',
    status: 'PENDING_ACTION'
  },
  {
    id: 'PRED-2026-003',
    category: 'BACKUP_DELAY_RISK',
    targetSchool: 'TK Islam Darunnajah 8',
    tenantId: 'darunnajah-04',
    severity: 'MEDIUM',
    headline: 'Latensi Snapshot Database Meningkat pada Jam 03:00 WIB',
    predictionDetail: 'Pekerja snapshot backup mengalami bottleneck I/O sebesar 420ms akibat overlap dengan job rekonsiliasi SPP bulanan.',
    timeHorizon: 'Setiap Akhir Bulan',
    currentMetric: 'Latensi 420ms (Batas: 300ms)',
    predictedMetric: 'Potensi Timeout Snapshot DB',
    recommendedAction: 'Geser jadwal cron snapshot ke jam 04:15 WIB untuk menghindari window lock.',
    status: 'PENDING_ACTION'
  },
  {
    id: 'PRED-2026-004',
    category: 'HEALTH_DEGRADATION',
    targetSchool: 'PAUD Bintang Kecil Mandiri',
    tenantId: 'bintang-05',
    severity: 'LOW',
    headline: 'Rasio Guru Belum Mengisi Jurnal Harian Menurun 15%',
    predictionDetail: 'Tiga dari 6 guru terdeteksi belum melengkapi asesmen mingguan. AI Asy memprediksi keterlambatan rapor akhir semester jika tidak dipandu.',
    timeHorizon: '2 Pekan ke Depan',
    currentMetric: 'Kelengkapan 68%',
    predictedMetric: 'Keterlambatan Rapor 4 Hari',
    recommendedAction: 'Picu AI Asy Living Mascot untuk mengingatkan guru saat membuka modul portal.',
    status: 'PENDING_ACTION'
  }
];

export const FuturePredictionCenter: React.FC = () => {
  const [predictions, setPredictions] = useState<FuturePredictionAlert[]>(INITIAL_PREDICTIONS);
  const [mitigatingId, setMitigatingId] = useState<string | null>(null);

  const handleMitigate = async (id: string) => {
    setMitigatingId(id);
    await new Promise((r) => setTimeout(r, 1000));
    setPredictions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'MITIGATED' as const } : p))
    );
    setMitigatingId(null);
  };

  const getSeverityBadge = (sev: FuturePredictionAlert['severity']) => {
    switch (sev) {
      case 'HIGH':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shadow-lg">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    MODULE R137
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    PROACTIVE DEFENSE MATRIX
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-100">
                  Guardian Future Prediction & Fleet Anomaly Radar
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              AI Asy memindai tren telemetri lintas-tenant secara proaktif untuk memprediksi potensi kehabisan storage, bottleneck backup, masa trial habis, dan penurunan health score sebelum terjadi insiden nyata.
            </p>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Total Prediksi Aktif</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 block">
            {predictions.length} Kasus
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Radar AI Asy 24/7</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Risiko Prioritas Tinggi</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-2xl font-black text-red-600 dark:text-red-400 mt-2 block">
            {predictions.filter(p => p.severity === 'HIGH' && p.status === 'PENDING_ACTION').length} Sekolah
          </span>
          <span className="text-[10px] text-red-500 mt-1 block">Perlu Mitigasi Segera</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Akurasi Model Prediktif</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 block">
            99.2%
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Berdasarkan 450+ Metrik</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Sudah Dimonitor & Dimutasi</span>
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
          </div>
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2 block">
            {predictions.filter(p => p.status === 'MITIGATED').length} Termitigasi
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Zero Downtime Guarantee</span>
        </div>
      </div>

      {/* Prediction Cards List */}
      <div className="space-y-4">
        {predictions.map((pred) => (
          <div
            key={pred.id}
            className={`bg-white dark:bg-slate-900 rounded-2xl border p-6 shadow-sm transition-all space-y-4 ${
              pred.status === 'MITIGATED'
                ? 'border-slate-200 dark:border-slate-800 opacity-60'
                : pred.severity === 'HIGH'
                ? 'border-red-300 dark:border-red-900/60 ring-1 ring-red-500/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${getSeverityBadge(pred.severity)}`}>
                  {pred.severity} RISK
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {pred.headline}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400 font-medium">Prediksi AI:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800 font-mono">
                  {pred.timeHorizon}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {pred.predictionDetail}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Institusi / Tenant:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{pred.targetSchool}</span>
                <span className="text-[10px] text-slate-500 font-mono">{pred.tenantId}</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Metrik Saat Ini:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{pred.currentMetric}</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Proyeksi AI Asy:</span>
                <span className="font-bold text-red-600 dark:text-red-400 mt-0.5 block">{pred.predictedMetric}</span>
              </div>
            </div>

            {/* AI Recommendation & Action */}
            <div className="bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start space-x-2.5">
                <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-indigo-950 dark:text-indigo-200 block">Rekomendasi AI Asy:</span>
                  <span className="text-slate-600 dark:text-slate-300 mt-0.5 block">{pred.recommendedAction}</span>
                </div>
              </div>

              <div>
                {pred.status === 'MITIGATED' ? (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Telah Dimonitor</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleMitigate(pred.id)}
                    disabled={mitigatingId === pred.id}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-900/30 transition-all shrink-0 disabled:opacity-50"
                  >
                    {mitigatingId === pred.id ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengeksekusi...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Eksekusi Mitigasi 1-Klik</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
