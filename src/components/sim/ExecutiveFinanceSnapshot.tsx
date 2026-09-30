import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Heart,
  PieChart,
  Calendar,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export const ExecutiveFinanceSnapshot: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('Agustus 2026');

  const summary = {
    totalPemasukan: 'Rp 118.500.000',
    totalPengeluaran: 'Rp 74.200.000',
    surplusNetto: 'Rp 44.300.000',
    targetTercapai: '94.8%'
  };

  const revenueBreakdown = [
    { label: 'SPP Rutin Bulanan', amount: 'Rp 96.750.000', percentage: '81.6%', count: '215 Santri', icon: CreditCard, color: 'emerald' },
    { label: 'Infaq Pengembangan & Shadaqah', amount: 'Rp 14.250.000', percentage: '12.0%', count: '64 Donatur', icon: Heart, color: 'indigo' },
    { label: 'Pendaftaran & Formulir PPDB', amount: 'Rp 5.500.000', percentage: '4.6%', count: '11 Pendaftar', icon: DollarSign, color: 'amber' },
    { label: 'Kantin Sehat & Merchandise', amount: 'Rp 2.000.000', percentage: '1.8%', count: 'Harian', icon: PieChart, color: 'purple' }
  ];

  const expenseBreakdown = [
    { label: 'Gaji Pendidik & Tenaga Kependidikan', amount: 'Rp 48.000.000', percentage: '64.7%' },
    { label: 'Pengadaan Bahan Ajar & Alat Sentra', amount: 'Rp 12.500.000', percentage: '16.8%' },
    { label: 'Operasional Listrik, Internet & Utilitas', amount: 'Rp 8.200.000', percentage: '11.1%' },
    { label: 'Pemeliharaan Gedung & Sanitasi Kampus', amount: 'Rp 5.500.000', percentage: '7.4%' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Executive Finance Snapshot</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Laporan Eksekutif Yayasan
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ringkasan arus kas keuangan sekolah: penerimaan SPP, infaq jariyah, alokasi beban operasional, dan surplus berjalan (Read-Only).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Agustus 2026">Agustus 2026</option>
            <option value="Juli 2026">Juli 2026</option>
            <option value="Juni 2026">Juni 2026</option>
          </select>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Penerimaan Kas:</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">{summary.totalPemasukan}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +8.4% vs Bulan Lalu
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Realisasi Pengeluaran:</span>
            <TrendingDown className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800">{summary.totalPengeluaran}</div>
          <div className="text-[11px] text-slate-500 font-medium">
            Sesuai Anggaran RAPBS
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Surplus Kas Berjalan:</span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-600">{summary.surplusNetto}</div>
          <div className="text-[11px] text-indigo-600 font-semibold">
            Cadangan Kas Sehat (Ratio 1.6x)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Target Kolektibilitas:</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{summary.targetTercapai}</div>
          <div className="text-[11px] text-slate-500 font-medium">
            Tersisa 31 Santri Belum Lunas
          </div>
        </div>
      </div>

      {/* Breakdown Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Sumber Penerimaan */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Struktur Sumber Pendapatan ({selectedMonth})
            </h2>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">
              {summary.totalPemasukan}
            </span>
          </div>

          <div className="space-y-3">
            {revenueBreakdown.map((rev, idx) => {
              const Icon = rev.icon;
              return (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{rev.label}</div>
                      <span className="text-[11px] text-slate-400 font-mono">{rev.count}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-slate-800">{rev.amount}</div>
                    <span className="text-[10px] text-emerald-600 font-bold font-mono">{rev.percentage}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Alokasi Pengeluaran */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-amber-600" />
              Alokasi Pengeluaran Operasional
            </h2>
            <span className="text-xs text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full">
              {summary.totalPengeluaran}
            </span>
          </div>

          <div className="space-y-3">
            {expenseBreakdown.map((exp, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-800">{exp.label}</div>
                  <div className="w-32 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full" style={{ width: exp.percentage }} />
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-slate-800">{exp.amount}</div>
                  <span className="text-[10px] text-slate-400 font-mono">{exp.percentage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
