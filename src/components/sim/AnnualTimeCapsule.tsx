import React, { useState } from 'react';
import { 
  Archive, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Layers, 
  Users, 
  GraduationCap, 
  DollarSign, 
  FileText, 
  HardDrive, 
  Lock,
  Sparkles,
  Search
} from 'lucide-react';

interface TimeCapsule {
  id: string;
  academicYear: string;
  createdAt: string;
  totalStudents: number;
  totalAlumni: number;
  totalFinancialVolume: string;
  totalSavingsBalance: string;
  officialDocCount: number;
  manifestSha256: string;
  status: 'SEALED_IMMUTABLE' | 'VERIFIED';
  packageSize: string;
  sealedBy: string;
}

export const AnnualTimeCapsule: React.FC = () => {
  const [capsules, setCapsules] = useState<TimeCapsule[]>([
    {
      id: 'CAPSULE-2025-2026',
      academicYear: 'Tahun Ajaran 2025/2026',
      createdAt: '30 Juni 2026, 23:59:59 WIB',
      totalStudents: 142,
      totalAlumni: 48,
      totalFinancialVolume: 'Rp 482.500.000',
      totalSavingsBalance: 'Rp 86.420.000',
      officialDocCount: 312,
      manifestSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      status: 'SEALED_IMMUTABLE',
      packageSize: '42.8 MB (Encrypted)',
      sealedBy: 'KH. Dr. Muhammad Zaki & Ahmad Fauzi, M.Pd'
    },
    {
      id: 'CAPSULE-2024-2025',
      academicYear: 'Tahun Ajaran 2024/2025',
      createdAt: '30 Juni 2025, 23:59:59 WIB',
      totalStudents: 128,
      totalAlumni: 42,
      totalFinancialVolume: 'Rp 415.200.000',
      totalSavingsBalance: 'Rp 72.150.000',
      officialDocCount: 278,
      manifestSha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      status: 'VERIFIED',
      packageSize: '38.4 MB (Encrypted)',
      sealedBy: 'KH. Dr. Muhammad Zaki & Drs. H. Bahrul Alam'
    },
    {
      id: 'CAPSULE-2023-2024',
      academicYear: 'Tahun Ajaran 2023/2024',
      createdAt: '30 Juni 2024, 23:59:59 WIB',
      totalStudents: 115,
      totalAlumni: 36,
      totalFinancialVolume: 'Rp 360.800.000',
      totalSavingsBalance: 'Rp 61.300.000',
      officialDocCount: 245,
      manifestSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      status: 'VERIFIED',
      packageSize: '34.1 MB (Encrypted)',
      sealedBy: 'KH. Dr. Muhammad Zaki'
    }
  ]);

  const [isSealing, setIsSealing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleCreateNewCapsule = () => {
    setIsSealing(true);
    setTimeout(() => {
      const newCapsule: TimeCapsule = {
        id: `CAPSULE-2026-MID`,
        academicYear: 'Tahun Ajaran 2026/2027 (Mid-Year Snapshot)',
        createdAt: '15 Agustus 2026, 12:45:00 WIB',
        totalStudents: 156,
        totalAlumni: 48,
        totalFinancialVolume: 'Rp 195.400.000',
        totalSavingsBalance: 'Rp 94.200.000',
        officialDocCount: 165,
        manifestSha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
        status: 'SEALED_IMMUTABLE',
        packageSize: '24.6 MB (Encrypted)',
        sealedBy: 'TADE Sovereign Autonomous Keeper'
      };
      setCapsules([newCapsule, ...capsules]);
      setIsSealing(false);
    }, 1200);
  };

  const handleDownload = (id: string) => {
    setDownloadSuccess(`Paket Kapsul ${id} berhasil diunduh lengkap dengan manifest.sha256`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div id="annual-time-capsule-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Archive className="w-48 h-48 text-amber-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R230 &bull; ANNUAL TIME CAPSULE
              </span>
              <span className="text-xs text-slate-400">Centennial Data Preservation Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Archive className="w-8 h-8 text-amber-400" />
              Annual Time Capsule
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Penyimpanan snapshot komprehensif akhir tahun (<strong>Daftar Santri, Nilai Akhir, Tabungan, Aset, Keuangan, Dokumen Resmi, Data Alumni</strong>). Disertai <em>Manifest SHA-256</em> untuk validasi dan pemulihan kapan saja hingga 100 tahun ke depan.
            </p>
          </div>

          <button
            onClick={handleCreateNewCapsule}
            disabled={isSealing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            {isSealing ? 'Menyegel Kapsul...' : 'Kunci Kapsul Baru'}
          </button>
        </div>

        {/* Global Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Total Kapsul Tahun</span>
            <span className="text-xl font-bold text-white font-mono">{capsules.length} Arsip Abadi</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Integritas Manifest</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">100% SHA-256 SEAL</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Status Data</span>
            <span className="text-xl font-bold text-amber-400 font-mono">IMMUTABLE / READ-ONLY</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Retensi Arsip</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">100 TAHUN</span>
          </div>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Capsule Feed */}
      <div className="space-y-4">
        {capsules.map((capsule) => (
          <div
            key={capsule.id}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                    {capsule.id}
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {capsule.academicYear}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  Disegel: {capsule.createdAt}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(capsule.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Kapsul ({capsule.packageSize})
                </button>
                <button
                  onClick={() => alert(`Simulasi Pemulihan: Kapsul ${capsule.id} siap dipulihkan ke database darurat.`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold hover:bg-amber-100"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Uji Pemulihan
                </button>
              </div>
            </div>

            {/* Included Content Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 text-center">
                <Users className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                <span className="text-[10px] text-slate-400 block">Daftar Santri</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{capsule.totalStudents} Santri</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 text-center">
                <GraduationCap className="w-4 h-4 mx-auto text-purple-500 mb-1" />
                <span className="text-[10px] text-slate-400 block">Lulusan / Alumni</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{capsule.totalAlumni} Santri</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 text-center">
                <DollarSign className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
                <span className="text-[10px] text-slate-400 block">Arus Keuangan</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate block">{capsule.totalFinancialVolume}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 text-center">
                <HardDrive className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                <span className="text-[10px] text-slate-400 block">Saldo Tabungan</span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono truncate block">{capsule.totalSavingsBalance}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 text-center">
                <FileText className="w-4 h-4 mx-auto text-indigo-500 mb-1" />
                <span className="text-[10px] text-slate-400 block">Dokumen Resmi</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{capsule.officialDocCount} Berkas</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 text-center">
                <Lock className="w-4 h-4 mx-auto text-rose-500 mb-1" />
                <span className="text-[10px] text-slate-400 block">Status Segel</span>
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 font-mono">SEALED</span>
              </div>
            </div>

            {/* Manifest SHA-256 Box */}
            <div className="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-[10px] border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span>Manifest SHA-256 Checksum:</span>
                <span className="text-amber-400">Otorisator: {capsule.sealedBy}</span>
              </div>
              <div className="text-emerald-400 break-all bg-slate-950 p-2 rounded border border-slate-800">
                {capsule.manifestSha256}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
