import React, { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  Award,
  Sparkles,
  ShieldCheck,
  Building2,
  Users,
  CreditCard,
  ChevronRight,
  Info
} from 'lucide-react';

interface AnonymousPeer {
  rank: number;
  anonymousLabel: string;
  cluster: string;
  sppCollectionRate: number;
  parentAdoptionRate: number;
  maturityScore: number;
  isCurrentSchool: boolean;
}

export const CrossSchoolBenchmark: React.FC = () => {
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');

  const peers: AnonymousPeer[] = [
    {
      rank: 1,
      anonymousLabel: 'Sekolah Mitra C (Bandung)',
      cluster: 'TK-Plus / Terpadu',
      sppCollectionRate: 98.4,
      parentAdoptionRate: 97.2,
      maturityScore: 97,
      isCurrentSchool: false
    },
    {
      rank: 2,
      anonymousLabel: 'TK Asy Syifa (Sekolah Anda)',
      cluster: 'TK-Plus / Terpadu',
      sppCollectionRate: 97.8,
      parentAdoptionRate: 96.5,
      maturityScore: 96,
      isCurrentSchool: true
    },
    {
      rank: 3,
      anonymousLabel: 'Sekolah Mitra A (Jakarta Selatan)',
      cluster: 'TK-Plus / Terpadu',
      sppCollectionRate: 96.1,
      parentAdoptionRate: 94.0,
      maturityScore: 94,
      isCurrentSchool: false
    },
    {
      rank: 4,
      anonymousLabel: 'Sekolah Mitra D (Surabaya Timur)',
      cluster: 'TK-Islam Standar',
      sppCollectionRate: 93.5,
      parentAdoptionRate: 91.2,
      maturityScore: 91,
      isCurrentSchool: false
    },
    {
      rank: 5,
      anonymousLabel: 'Sekolah Mitra B (Semarang)',
      cluster: 'TK-Islam Standar',
      sppCollectionRate: 91.0,
      parentAdoptionRate: 88.4,
      maturityScore: 89,
      isCurrentSchool: false
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Cross-School Benchmark</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                100% Agregasi Anonim
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Komparasi performa digitalisasi, tingkat kelancaran SPP, dan adopsi aplikasi orang tua antar-sekolah setara tanpa membuka data sensitif.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Privasi Terlindungi (Zero Leak)
          </span>
        </div>
      </div>

      {/* Highlights / Current Rank */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-medium">Peringkat Kematangan Digital:</span>
          <div className="text-2xl font-bold text-amber-600">Peringkat 2 <span className="text-xs font-normal text-slate-400">dari 18 Sekolah</span></div>
          <p className="text-[11px] text-slate-500">Kategori Klaster TK-Plus Terpadu.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-medium">Kelancaran SPP Anda:</span>
          <div className="text-2xl font-bold text-emerald-600">97.8%</div>
          <p className="text-[11px] text-slate-500">+4.2% di atas rata-rata klaster.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-medium">Adopsi Aplikasi Wali Murid:</span>
          <div className="text-2xl font-bold text-indigo-600">96.5%</div>
          <p className="text-[11px] text-slate-500">Keterlibatan buku penghubung aktif.</p>
        </div>
      </div>

      {/* Benchmark Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Tabel Komparasi Klaster Sekolah Sejenis</h2>
          <span className="text-xs text-slate-400 font-mono">Diperbarui: Mingguan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Sekolah (Anonim)</th>
                <th className="py-3 px-3">Klaster</th>
                <th className="py-3 px-3 text-right">Kelancaran SPP</th>
                <th className="py-3 px-3 text-right">Adopsi Wali</th>
                <th className="py-3 px-3 text-right">Skor Kematangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {peers.map(p => (
                <tr
                  key={p.rank}
                  className={`hover:bg-slate-50 transition ${
                    p.isCurrentSchool ? 'bg-amber-50/60 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      p.rank === 1 ? 'bg-amber-100 text-amber-800' : p.isCurrentSchool ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {p.rank}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-800">{p.anonymousLabel}</span>
                      {p.isCurrentSchool && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
                          Sekolah Anda
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{p.cluster}</td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-600 font-bold">{p.sppCollectionRate}%</td>
                  <td className="py-3 px-3 text-right font-mono text-indigo-600 font-bold">{p.parentAdoptionRate}%</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-800 font-extrabold">{p.maturityScore}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Best Practice Tips */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-bold text-slate-800">Rekomendasi Peningkatan Praktik Terbaik (Best Practice)</h2>
        </div>

        <div className="space-y-2 text-xs text-slate-600">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
            <ChevronRight className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Otomatisasi Broadcast Tagihan:</strong> Sekolah dengan kelancaran SPP &gt;98% mengaktifkan fitur pengingat otomatis di tanggal 5 dan 10 setiap bulan melalui WhatsApp Guardian.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
            <ChevronRight className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Foto Aktivitas Harian di Buku Penghubung:</strong> Mengunggah 1 foto kegiatan sentra setiap hari terbukti menaikkan pembukaan aplikasi wali murid hingga 97%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
