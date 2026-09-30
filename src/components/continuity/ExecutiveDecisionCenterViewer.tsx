import React, { useState } from 'react';
import { Briefcase, TrendingUp, CheckCircle2, ShieldCheck, DollarSign, Users, Award, FileText } from 'lucide-react';

export const ExecutiveDecisionCenterViewer: React.FC = () => {
  const [decisionTab, setDecisionTab] = useState<'FINANCIAL' | 'ACADEMIC' | 'EXPANSION'>('FINANCIAL');

  return (
    <div id="r866-executive-decision-center" className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 rounded">R866</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded">RC104</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded">Executive Suite</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mt-1">Executive Decision Center</h2>
              <p className="text-sm text-slate-500">
                Pusat data analitik strategis bagi Ketua Yayasan &amp; Kepala Sekolah untuk keputusan alokasi anggaran, kurikulum, dan SDM.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-purple-50 text-purple-700 font-bold px-3 py-1.5 rounded-lg border border-purple-200 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              Sovereign Board Access Only
            </span>
          </div>
        </div>
      </div>

      {/* Decision Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setDecisionTab('FINANCIAL')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            decisionTab === 'FINANCIAL'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Kesehatan Finansial &amp; RKAS
        </button>
        <button
          onClick={() => setDecisionTab('ACADEMIC')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            decisionTab === 'ACADEMIC'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Mutu Pembelajaran &amp; Tahfidz
        </button>
        <button
          onClick={() => setDecisionTab('EXPANSION')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            decisionTab === 'EXPANSION'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Kapasitas &amp; Rencana Sentra Baru
        </button>
      </div>

      {/* Content based on selected tab */}
      {decisionTab === 'FINANCIAL' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">Realisasi Anggaran RKAS</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">84.2%</p>
              <span className="text-xs text-emerald-600 font-medium">Sesuai proyeksi Q3 2026</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">Rasio Likuiditas Kas Operasional</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">4.6 Bulan</p>
              <span className="text-xs text-emerald-600 font-medium">Cadangan aman di atas ambang minimum</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">Kolektibilitas SPP / Infaq</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">98.1%</p>
              <span className="text-xs text-blue-600 font-medium">Kemitraan orang tua sangat solid</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              Rekomendasi Keputusan Eksekutif Finansial
            </h3>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
              Yayasan memiliki kelebihan kas likuid sebesar Rp 42.500.000 dari pos efisiensi pengadaan perlengkapan sentra. Direkomendasikan untuk mengalokasikan 60% untuk insentif pengabdian guru tahfidz dan 40% untuk pengadaan perangkat outdoor playground sentra gerak.
            </div>
          </div>
        </div>
      )}

      {decisionTab === 'ACADEMIC' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">Kelulusan Target Tahfidz</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">94.8%</p>
              <span className="text-xs text-emerald-600 font-medium">Juz 30 (An-Naas s/d An-Naba)</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">Capaian Perkembangan Anak</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">BSB (92%)</p>
              <span className="text-xs text-emerald-600 font-medium">Berkembang Sangat Baik</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">Kepuasan Wali Murid</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">4.9 / 5.0</p>
              <span className="text-xs text-blue-600 font-medium">Survei semester genap</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              Rekomendasi Mutu Pembelajaran Sentra
            </h3>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
              Tingkat kemandirian dan motorik halus santri sentra balok mencapai nilai optimal. Disarankan menyelenggarakan expo karya sentra santri bersama orang tua pada akhir bulan depan untuk mempererat silaturahmi paguyuban.
            </div>
          </div>
        </div>
      )}

      {decisionTab === 'EXPANSION' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">Utilisasi Ruang Sentra Saat Ini</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">72.5%</p>
              <span className="text-xs text-slate-500">6 Sentra Utama Aktif</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">Antrean Pendaftar (Waiting List)</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">28 Calon Santri</p>
              <span className="text-xs text-emerald-600 font-medium">Tahun Ajaran Baru 2026/2027</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">Kesiapan Tenaga Pendidik</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">100% Siap</p>
              <span className="text-xs text-blue-600 font-medium">12 Guru Tersertifikasi</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Keputusan Pembukaan Rombel Baru
            </h3>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
              Berdasarkan kapasitas ruang dan rasio guru, sekolah siap membuka 1 Rombel Tambahan Kelompok B (maksimal 18 santri) tanpa perlu menambah sewa gedung baru.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
