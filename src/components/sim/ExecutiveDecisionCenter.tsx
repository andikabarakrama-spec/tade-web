import React, { useState } from 'react';
import {
  ShieldAlert,
  TrendingUp,
  Award,
  Lightbulb,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Sparkles
} from 'lucide-react';

interface StrategicRisk {
  id: string;
  category: 'OPERASIONAL' | 'KEUANGAN' | 'SDM' | 'SARPRAS';
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  mitigation: string;
  owner: string;
}

export const ExecutiveDecisionCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kpi' | 'risks' | 'recommendations' | 'summary'>('kpi');

  const risks: StrategicRisk[] = [
    {
      id: 'RSK-01',
      category: 'SARPRAS',
      title: 'Kapasitas Ruang Sentra Balok Mendekati Ambang Batas Maksimal (92%)',
      severity: 'MEDIUM',
      mitigation: 'Pengalokasian perluasan ruang bermain outdoor lantai 1 pada Rencana Anggaran RAPBM Semester Genap.',
      owner: 'Kepala Sekolah & Tim Sarpras'
    },
    {
      id: 'RSK-02',
      category: 'SDM',
      title: 'Kebutuhan Sertifikasi Lanjutan Guru Sentra Kurikulum Merdeka',
      severity: 'LOW',
      mitigation: 'Pemberangkatan 4 guru untuk workshop intensif metodologi sentra nasional pada September 2026.',
      owner: 'Wakil Kepala Bidang Kurikulum'
    },
    {
      id: 'RSK-03',
      category: 'KEUANGAN',
      title: 'Fluktuasi Harga Bahan Makanan Tambahan Sehat (PMT) Sentra',
      severity: 'LOW',
      mitigation: 'Kerjasama pasokan langsung dengan koperasi petani organik lokal binaan yayasan.',
      owner: 'Bendahara Madrasah'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Executive Decision Center</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold font-mono">
                Read-Only Strategic Hub
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pusat keputusan strategis pimpinan: pemantauan KPI institusi, mitigasi risiko proaktif, tren pertumbuhan, dan rekomendasi tata kelola.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(['kpi', 'risks', 'recommendations', 'summary'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'kpi' && 'Indikator Utama'}
              {tab === 'risks' && 'Manajemen Risiko'}
              {tab === 'recommendations' && 'Rekomendasi'}
              {tab === 'summary' && 'Ringkasan Eksekutif'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Efisiensi Anggaran</span>
          <div className="text-2xl font-black text-slate-800">97.4%</div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Sesuai Target RAPBM
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Kehadiran Siswa & Guru</span>
          <div className="text-2xl font-black text-slate-800">98.2%</div>
          <span className="text-[10px] text-slate-500 font-medium">Rata-rata 30 Hari Terakhir</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Ketepatan Bayar SPP</span>
          <div className="text-2xl font-black text-blue-600">99.1%</div>
          <span className="text-[10px] text-slate-500 font-medium">Gateway Payment Otomatis</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Status Keamanan Sistem</span>
          <div className="text-2xl font-black text-emerald-600">Defcon-1</div>
          <span className="text-[10px] text-slate-500 font-medium">Royal Guard & Cloud Sync</span>
        </div>
      </div>

      {/* Tab: KPI */}
      {activeTab === 'kpi' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Matriks Sasaran Kinerja Institusi (Balanced Scorecard PAUD)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between font-bold">
                <span>1. Perspektif Kepuasan Pemangku Kepentingan</span>
                <span className="text-emerald-600">98.5% (Tercapai)</span>
              </div>
              <p className="text-[11px] text-slate-500">Keterlibatan wali murid, kepuasan pembelajaran adab, dan kepercayaan komite sekolah.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between font-bold">
                <span>2. Perspektif Pembelajaran & Pertumbuhan SDM</span>
                <span className="text-blue-600">94.0% (Baik)</span>
              </div>
              <p className="text-[11px] text-slate-500">Jam pelatihan dewan guru, sertifikasi keilmuan tahsin, dan adopsi modul ajar cerdas.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Risks */}
      {activeTab === 'risks' && (
        <div className="space-y-3">
          {risks.map((risk) => (
            <div key={risk.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${risk.severity === 'HIGH' ? 'text-rose-500' : 'text-amber-500'}`} />
                  <span className="font-bold text-slate-800">{risk.title}</span>
                </div>
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                  risk.severity === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  Tingkat Risiko: {risk.severity}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-700 text-[11px]">Rencana Mitigasi Strategis:</div>
                <p className="text-slate-600 text-[11px]">{risk.mitigation}</p>
              </div>

              <div className="text-[10px] font-mono text-slate-400">
                Penanggung Jawab: {risk.owner} • Kategori: {risk.category}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Rekomendasi Kebijakan Berkelanjutan Pimpinan
          </h2>
          <div className="space-y-3">
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
              <div className="font-bold text-emerald-900">1. Digitalisasi Penuh Portofolio Rapor Kurikulum Merdeka</div>
              <p className="text-emerald-800 text-[11px]">Memanfaatkan Smart PDF Generation terintegrasi WhatsApp Guardian guna menghemat 60% biaya pencetakan kertas raport fisik.</p>
            </div>
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
              <div className="font-bold text-blue-900">2. Optimalisasi Program Tahfidz Mandiri Berbasis Audio Visual</div>
              <p className="text-blue-800 text-[11px]">Integrasi modul murottal anak di Sentra Imtaq untuk mempercepat akselerasi hafalan juz 30.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Summary */}
      {activeTab === 'summary' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-blue-600" />
            Executive Governance Briefing
          </h2>
          <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            Kondisi operasional madrasah berada pada kondisi prima dengan tata kelola berbasis multi-tenant yang aman. Seluruh fungsi inti akademik, keuangan, dan relasi wali murid berjalan harmonis dalam standar mutu ISO Pendidikan dan Akreditasi Unggul.
          </p>
        </div>
      )}
    </div>
  );
};
