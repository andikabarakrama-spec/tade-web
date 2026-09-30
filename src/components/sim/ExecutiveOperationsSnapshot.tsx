import React from 'react';
import {
  TrendingUp,
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  Users,
  Clock,
  CheckCircle2,
  FileCheck,
  DollarSign
} from 'lucide-react';

export const ExecutiveOperationsSnapshot: React.FC = () => {
  const kpis = [
    { label: 'Efisiensi Operasional', value: '96.8%', target: '95.0%', status: 'ABOVE_TARGET', trend: '+1.8%' },
    { label: 'Rata-rata Presensi Santri', value: '97.4%', target: '92.0%', status: 'ABOVE_TARGET', trend: '+5.4%' },
    { label: 'Penyelesaian Kurikulum', value: '91.2%', target: '90.0%', status: 'ON_TRACK', trend: '+1.2%' },
    { label: 'Ketepatan Pembayaran SPP', value: '94.6%', target: '90.0%', status: 'ABOVE_TARGET', trend: '+4.6%' }
  ];

  const riskFactors = [
    { risk: 'Fluktuasi Cuaca Hujan di Jam Kepulangan Santri', level: 'RENDAH', mitigation: 'Penyediaan payung transit & kanopi gerbang utama aktif.' },
    { risk: 'Beban Puncak Penggunaan Bandwidth Zoom Kajian', level: 'SEDANG', mitigation: 'Alokasi QoS khusus untuk ruang pertemuan yayasan.' },
    { risk: 'Stok Habis Bahan Alam Basah (Sentra Sains)', level: 'TERKENDALI', mitigation: 'Re-order otomatis berkala setiap hari Kamis.' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-900 text-amber-400 rounded-2xl border border-slate-800">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Executive Operations Snapshot</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono text-xs font-bold">
                Read-Only Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ikhtisar metrik eksekutif yayasan: evaluasi KPI sekolah, matriks efisiensi, pemetaan risiko operasional, dan tren jangka panjang.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{kpi.label}</span>
              <span className="text-emerald-600 font-bold font-mono">{kpi.trend}</span>
            </div>
            <div className="text-2xl font-black text-slate-800">{kpi.value}</div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
              <span>Target: {kpi.target}</span>
              <span className="text-emerald-600 font-bold">Tercapai</span>
            </div>
          </div>
        ))}
      </div>

      {/* Operational Efficiency & Risk Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Efficiency Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Distribusi Efisiensi Operasional Kampus
          </h2>

          <div className="space-y-3">
            {[
              { category: 'Efisiensi Administrasi Guru & RPP Digital', score: 98, note: 'Paperless workflow memangkas 4.2 jam kerja per pekan' },
              { category: 'Ketepatan Distribusi Buku Penghubung', score: 96, note: '100% tersinkron ke smartphone wali murid via timeline' },
              { category: 'Utilisasi Ruang Sentra Belajar', score: 94, note: '8 sentra beroperasi maksimal sesuai rotasi kelompok' },
              { category: 'Efisiensi Anggaran Konsumsi & Snack Sehat', score: 97, note: 'Pemanfaatan bahan lokal organik berkualitas' }
            ].map((item, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{item.category}</span>
                  <span className="font-mono font-bold text-emerald-700">{item.score}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${item.score}%` }} />
                </div>
                <p className="text-[10px] text-slate-400">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Registry & Mitigation */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Matriks Manajemen Risiko & Mitigasi Aktif
          </h2>

          <div className="space-y-3">
            {riskFactors.map((r, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{r.risk}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    {r.level}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                  <strong className="text-slate-700">Mitigasi:</strong> {r.mitigation}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Audit Siklus: Q3 2026</span>
            <span className="text-emerald-600 font-bold">Status: Stabil & Terkendali</span>
          </div>
        </div>
      </div>
    </div>
  );
};
