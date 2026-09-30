import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Users,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  Award,
  Sparkles
} from 'lucide-react';

export const EnterpriseAnalytics: React.FC = () => {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExport = (type: string) => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const adoptionStats = [
    { name: 'Presensi & Absensi Santri', usage: '99.4%', status: 'Tinggi', users: 248 },
    { name: 'Kwitansi & Tagihan SPP', usage: '96.2%', status: 'Tinggi', users: 238 },
    { name: 'Setoran Tahfidz & Doa Harian', usage: '91.8%', status: 'Tinggi', users: 228 },
    { name: 'Buku Penghubung & Parenting', usage: '88.5%', status: 'Optimal', users: 219 },
    { name: 'E-Rapor & Capaian Belajar', usage: '84.0%', status: 'Optimal', users: 208 }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Enterprise Usage & Engagement Analytics</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                Level Adopsi 94.2%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Analisis mendalam adopsi modul sekolah, tingkat interaksi orang tua santri, dan tren produktivitas tenaga pendidik.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['7d', '30d', '90d'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  period === p ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleExport('EXCEL')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Ekspor Rekap Excel
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Laporan Analitik Eksekutif TADE RC19 berhasil di-generate dan siap dibagikan ke Yayasan.
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Daily Active Users (DAU)</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">234 Wali & Guru</div>
          <div className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 94.3% dari Total Akun
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Rata-rata Durasi Sesi</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">4 Menit 18 Detik</div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Sangat Ringan & Efisien
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Tingkat Buka WhatsApp</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">98.7%</div>
          <div className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Notifikasi Terbaca Cepat
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Pembayaran Digital SPP</span>
          <div className="text-2xl font-bold text-indigo-600 mt-1">91.4% Cashless</div>
          <div className="text-xs text-slate-400 mt-2">Via VA Bank Syariah</div>
        </div>
      </div>

      {/* Adoption Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-800">Matriks Adopsi Modul Sekolah TADE</h2>
        
        <div className="space-y-3">
          {adoptionStats.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-bold text-slate-800">{item.name}</span>
                <div className="text-[11px] text-slate-500 mt-0.5">{item.users} Pengguna Aktif Mingguan</div>
              </div>
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <span className="font-bold text-indigo-600 text-sm">{item.usage}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
