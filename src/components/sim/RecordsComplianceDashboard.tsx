import React, { useState } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  Clock, 
  Archive, 
  AlertOctagon, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  FileText, 
  Download, 
  Search, 
  BarChart3,
  Building,
  TrendingUp,
  Tag
} from 'lucide-react';

export const RecordsComplianceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EXPIRING' | 'TIME_CAPSULE' | 'DESTRUCTION_LEDGER'>('OVERVIEW');
  const [searchTerm, setSearchTerm] = useState('');

  // Overview metrics
  const complianceStats = {
    totalManagedDataGB: '14.8 GB',
    activeRecordsCount: 126440,
    archivedRecordsCount: 2480,
    timeCapsuleSealedCount: 4,
    nearExpiryCount: 18,
    controlledDestructionCount: 12,
    governanceScore: 99.8,
    immutableIntegrity: '100% SHA-256 Validated'
  };

  // Near expiring records data
  const expiringRecords = [
    {
      id: 'EXP-001',
      title: 'Draft Pendaftaran Calon Santri TA 2024 (Batal)',
      category: 'PPDB Draft',
      currentAgeDays: 710,
      maxRetentionDays: 730,
      daysRemaining: 20,
      actionRequired: 'TRIPLE_APPROVAL_DESTRUCTION',
      riskTier: 'CONFIDENTIAL'
    },
    {
      id: 'EXP-002',
      title: 'Ephemeral Diagnostic Trace & Daily Cache Juli 2026',
      category: 'Daily Temp Backup',
      currentAgeDays: 28,
      maxRetentionDays: 30,
      daysRemaining: 2,
      actionRequired: 'ROLLING_PURGE',
      riskTier: 'INTERNAL'
    },
    {
      id: 'EXP-003',
      title: 'Dokumen Formulir Uji Coba Minat Sentra 2024',
      category: 'Akademik Temp',
      currentAgeDays: 722,
      maxRetentionDays: 730,
      daysRemaining: 8,
      actionRequired: 'TRIPLE_APPROVAL_DESTRUCTION',
      riskTier: 'CONFIDENTIAL'
    }
  ];

  // Destruction audit ledger
  const destructionLedger = [
    {
      id: 'BA-PEMUSNAHAN/2026/001',
      date: '01 Agustus 2026, 11:30 WIB',
      title: 'Temporary Cache & Raw Image Previews TA 2025/2026',
      recordCount: 120,
      approvedBy: 'Admin + Kepala Sekolah + Ketua Yayasan',
      certificateHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    {
      id: 'BA-PEMUSNAHAN/2025/014',
      date: '15 Desember 2025, 14:00 WIB',
      title: 'Log Akses Web Tamu Publik 2020 (Retensi 5 Tahun Habis)',
      recordCount: 45000,
      approvedBy: 'Admin + Kepala Sekolah + Ketua Yayasan',
      certificateHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
    }
  ];

  // Time capsules
  const timeCapsuleSummary = [
    {
      year: '2025/2026 (Mid-Year)',
      id: 'CAPSULE-2026-MID',
      sealedDate: '15 Agustus 2026',
      items: '156 Santri, 165 Dokumen Resmi, Rp 195.4M Kas',
      sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0'
    },
    {
      year: '2025/2026',
      id: 'CAPSULE-2025-2026',
      sealedDate: '30 Juni 2026',
      items: '142 Santri, 48 Alumni, 312 Dokumen Resmi',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    },
    {
      year: '2024/2025',
      id: 'CAPSULE-2024-2025',
      sealedDate: '30 Juni 2025',
      items: '128 Santri, 42 Alumni, 278 Dokumen Resmi',
      sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
    },
    {
      year: '2023/2024',
      id: 'CAPSULE-2023-2024',
      sealedDate: '30 Juni 2024',
      items: '115 Santri, 36 Alumni, 245 Dokumen Resmi',
      sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
    }
  ];

  return (
    <div id="records-compliance-dashboard-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <FileCheck2 className="w-48 h-48 text-emerald-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R235 &bull; RECORDS GOVERNANCE DASHBOARD
              </span>
              <span className="text-xs text-slate-400">Holistic Compliance Oversight</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <FileCheck2 className="w-8 h-8 text-emerald-400" />
              Records Compliance Dashboard
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Pusat pemantauan kepatuhan siklus hidup data: <strong>Data Aktif, Data Arsip, Data Hampir Kedaluwarsa, Time Capsule Abadi</strong>, serta <strong>Buku Rekap Berita Acara Pemusnahan</strong>.
            </p>
          </div>
        </div>

        {/* Global Summary Metric Cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block font-mono">Data Aktif Terkelola</span>
            <span className="text-xl font-bold text-white font-mono">{complianceStats.activeRecordsCount.toLocaleString()} Rekaman</span>
          </div>
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block font-mono">Arsip Smart Vault</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">{complianceStats.archivedRecordsCount.toLocaleString()} Berkas</span>
          </div>
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block font-mono">Hampir Kedaluwarsa</span>
            <span className="text-xl font-bold text-amber-400 font-mono">{complianceStats.nearExpiryCount} Berkas</span>
          </div>
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block font-mono">Skor Kepatuhan TADE</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{complianceStats.governanceScore}% PERFECT</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'OVERVIEW'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Ringkasan & Metrik
        </button>
        <button
          onClick={() => setActiveTab('EXPIRING')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'EXPIRING'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <span>Hampir Kedaluwarsa</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-[10px]">
            {expiringRecords.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('TIME_CAPSULE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'TIME_CAPSULE'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Time Capsule 100 Thn
        </button>
        <button
          onClick={() => setActiveTab('DESTRUCTION_LEDGER')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'DESTRUCTION_LEDGER'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Buku Berita Acara Pemusnahan
        </button>
      </div>

      {/* Tab: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Status Kedaulatan & Integritas Kriptografis
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-300">Validasi Manifest Checksum SHA-256</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">100% MATCHED</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-300">Pemusnahan Tanpa Quorum (Unapproved)</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">0 DETECTED</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-300">Retensi Tertua yang Dilindungi</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">100 TAHUN (IJAZAH)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-300">Isolasi Founder Layer Root Seed</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">SECURE AIR-GAP</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Distribusi Volume Data Menurut Kategori
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Raport, Portofolio & Akademik</span>
                  <span className="font-bold font-mono">68%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '68%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Keuangan, SPP & Tabungan</span>
                  <span className="font-bold font-mono">22%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '22%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Legalitas Yayasan & SK Jabatan</span>
                  <span className="font-bold font-mono">7%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '7%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 dark:text-slate-300">SOP & Pengetahuan Kelembagaan</span>
                  <span className="font-bold font-mono">3%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '3%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: EXPIRING */}
      {activeTab === 'EXPIRING' && (
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
            Daftar rekaman yang mendekati batas akhir masa retensi. Diperlukan tindakan pemusnahan terkontrol melalui <em>Triple Approval</em> atau <em>Rolling Purge</em>.
          </div>

          <div className="grid grid-cols-1 gap-3">
            {expiringRecords.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {item.id}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Kategori: {item.category} &bull; Usia Data: <strong className="text-slate-800 dark:text-slate-200 font-mono">{item.currentAgeDays} / {item.maxRetentionDays} Hari</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-bold text-xs font-mono">
                    Sisa {item.daysRemaining} Hari
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold">
                    {item.actionRequired}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: TIME CAPSULE */}
      {activeTab === 'TIME_CAPSULE' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {timeCapsuleSummary.map((capsule) => (
              <div
                key={capsule.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Archive className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {capsule.year} ({capsule.id})
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Disegel: {capsule.sealedDate}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <strong>Cakupan Berkas:</strong> {capsule.items}
                </p>

                <div className="p-2 rounded bg-slate-900 text-slate-300 font-mono text-[9px] break-all border border-slate-800 flex justify-between items-center">
                  <span><strong className="text-amber-400">Manifest SHA-256:</strong> {capsule.sha256}</span>
                  <span className="text-emerald-400 shrink-0 font-bold ml-2">IMMUTABLE SEAL</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: DESTRUCTION LEDGER */}
      {activeTab === 'DESTRUCTION_LEDGER' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {destructionLedger.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {doc.id}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {doc.title}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {doc.date}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <div>Jumlah Rekaman: <strong className="text-slate-800 dark:text-slate-200 font-mono">{doc.recordCount} baris</strong></div>
                  <div>Otorisator: <strong className="text-slate-800 dark:text-slate-200">{doc.approvedBy}</strong></div>
                </div>

                <div className="p-2 rounded bg-slate-900 text-slate-300 font-mono text-[9px] break-all border border-slate-800">
                  <strong className="text-rose-400">Bukti Berita Acara Hash:</strong> {doc.certificateHash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
