import React, { useState } from 'react';
import { 
  ArrowRight, 
  Layers, 
  Archive, 
  Database, 
  CheckCircle2, 
  Clock, 
  RotateCw, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  History,
  Lock,
  Search,
  Filter
} from 'lucide-react';

export type LifecycleStage = 'AKTIF' | 'ARSIP' | 'TIME_CAPSULE';

export interface TransitionRecord {
  id: string;
  dataTitle: string;
  category: 'Akademik' | 'Keuangan' | 'Surat Keputusan' | 'Portofolio';
  stage: LifecycleStage;
  originYear: string;
  activeUntil: string;
  archivedAt: string | null;
  timeCapsuleAt: string | null;
  sha256Proof: string;
  historyPreserved: boolean;
  notes: string;
}

export const SmartArchiveTransition: React.FC = () => {
  const [records, setRecords] = useState<TransitionRecord[]>([
    {
      id: 'TRANS-001',
      dataTitle: 'Buku Raport Sentra Kelulusan TA 2023/2024 (Angkatan V)',
      category: 'Akademik',
      stage: 'TIME_CAPSULE',
      originYear: '2023/2024',
      activeUntil: '30 Juni 2024',
      archivedAt: '01 Juli 2024',
      timeCapsuleAt: '30 Juni 2026',
      sha256Proof: '7b902e6026be4b017b2f672322303022510b65f422e18fa4d9b4b0e5ad50ef55',
      historyPreserved: true,
      notes: 'Telah disegel ke Kapsul Abadi 100 Tahun dengan validasi ijazah digital.'
    },
    {
      id: 'TRANS-002',
      dataTitle: 'Ledger Pembayaran SPP & Kas Madrasah Semester Genap 2024/2025',
      category: 'Keuangan',
      stage: 'ARSIP',
      originYear: '2024/2025',
      activeUntil: '30 Juni 2025',
      archivedAt: '01 Juli 2025',
      timeCapsuleAt: null,
      sha256Proof: 'c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2',
      historyPreserved: true,
      notes: 'Status Read-Only di Smart Vault, siap transisi ke Time Capsule 2027.'
    },
    {
      id: 'TRANS-003',
      dataTitle: 'Penilaian Mingguan Sentra Balok & Portofolio TA 2025/2026',
      category: 'Akademik',
      stage: 'AKTIF',
      originYear: '2025/2026',
      activeUntil: '30 Juni 2026',
      archivedAt: null,
      timeCapsuleAt: null,
      sha256Proof: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      historyPreserved: true,
      notes: 'Sedang diedit aktif oleh guru sentra untuk persiapan pembagian raport.'
    },
    {
      id: 'TRANS-004',
      dataTitle: 'SK Penetapan Struktur Guru & Pegawai Periode 2024',
      category: 'Surat Keputusan',
      stage: 'ARSIP',
      originYear: '2024/2025',
      activeUntil: '31 Desember 2024',
      archivedAt: '01 Januari 2025',
      timeCapsuleAt: null,
      sha256Proof: 'a6c0861b10ab6f1d1579435d3014da801d790010f706e4c6d3b4be30efc0141f',
      historyPreserved: true,
      notes: 'SK kedaluwarsa masa jabatan, diarsipkan tanpa menghapus histori SK.'
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePromoteStage = (id: string) => {
    setIsSimulating(true);
    setTimeout(() => {
      setRecords(prev => prev.map(rec => {
        if (rec.id !== id) return rec;
        if (rec.stage === 'AKTIF') {
          return {
            ...rec,
            stage: 'ARSIP',
            archivedAt: 'Hari Ini (15 Agustus 2026, 13:00 WIB)',
            notes: 'Dipindahkan otomatis dari status Aktif ke Arsip Terkunci.'
          };
        }
        if (rec.stage === 'ARSIP') {
          return {
            ...rec,
            stage: 'TIME_CAPSULE',
            timeCapsuleAt: 'Hari Ini (15 Agustus 2026, 13:00 WIB)',
            notes: 'Disegel ke Centennial Time Capsule Vault 100 Tahun.'
          };
        }
        return rec;
      }));

      setIsSimulating(false);
      setSuccessMessage(`Transisi data ${id} berhasil dieksekusi tanpa menghapus histori data asli.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 800);
  };

  const filteredRecords = records.filter(r => {
    const matchesFilter = selectedFilter === 'ALL' || r.stage === selectedFilter;
    const matchesSearch = 
      r.dataTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div id="smart-archive-transition-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Layers className="w-48 h-48 text-cyan-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R233 &bull; CONTINUOUS LIFECYCLE PIPELINE
              </span>
              <span className="text-xs text-slate-400">Zero History Overwrite Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Layers className="w-8 h-8 text-cyan-400" />
              Smart Archive Transition
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Alur perpindahan data otomatis: <strong>Data Aktif &rarr; Arsip Pintar (Smart Vault) &rarr; Time Capsule Abadi</strong> tanpa pernah menghapus jejak dan histori awal.
            </p>
          </div>
        </div>

        {/* Global Pipeline Steps Visual */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold font-mono">
              1
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-mono">Tahap 1</span>
              <span className="text-sm font-bold text-blue-400">DATA AKTIF</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Operasional berjalan & dapat diedit guru/staf.</p>
            </div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold font-mono">
              2
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-mono">Tahap 2</span>
              <span className="text-sm font-bold text-purple-400">ARSIP TERKUNCI (VAULT)</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Read-Only immutable dengan SHA-256 seal.</p>
            </div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold font-mono">
              3
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-mono">Tahap 3</span>
              <span className="text-sm font-bold text-amber-400">TIME CAPSULE ABADI</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Snapshot komprehensif retensi 100 tahun.</p>
            </div>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'AKTIF', 'ARSIP', 'TIME_CAPSULE'].map((stage) => (
            <button
              key={stage}
              onClick={() => setSelectedFilter(stage)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === stage
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {stage === 'ALL' ? 'Semua Tahap' : stage.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama berkas, tahun, ID..."
            maxLength={100}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Transition Pipeline List */}
      <div className="space-y-4">
        {filteredRecords.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {item.id}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Tahun Asal: {item.originYear} &bull; {item.category}
                </span>
              </div>

              {/* Action Buttons for promotion */}
              <div className="flex items-center gap-2">
                {item.stage === 'AKTIF' && (
                  <button
                    onClick={() => handlePromoteStage(item.id)}
                    disabled={isSimulating}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-50"
                  >
                    <span>Transisikan ke Arsip</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {item.stage === 'ARSIP' && (
                  <button
                    onClick={() => handlePromoteStage(item.id)}
                    disabled={isSimulating}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-50"
                  >
                    <span>Segel ke Time Capsule</span>
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                )}
                {item.stage === 'TIME_CAPSULE' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Tersegel 100 Tahun
                  </span>
                )}
              </div>
            </div>

            {/* Content & Pipeline Progress */}
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {item.dataTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {item.notes}
              </p>
            </div>

            {/* Visual Stage Indicator */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700/60 text-center text-xs">
              <div className={`p-2 rounded-lg ${item.stage === 'AKTIF' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 font-bold' : 'text-slate-400'}`}>
                1. Aktif (Read/Write)
              </div>
              <div className={`p-2 rounded-lg ${item.stage === 'ARSIP' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 font-bold' : item.stage === 'TIME_CAPSULE' ? 'text-slate-400 line-through' : 'text-slate-400'}`}>
                2. Arsip Vault (Read-Only)
              </div>
              <div className={`p-2 rounded-lg ${item.stage === 'TIME_CAPSULE' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 font-bold' : 'text-slate-400'}`}>
                3. Time Capsule (Abadi)
              </div>
            </div>

            {/* Footprint Hash Proof */}
            <div className="p-2.5 rounded-xl bg-slate-900 text-slate-300 font-mono text-[10px] break-all border border-slate-800 flex items-center justify-between gap-2">
              <span><strong className="text-cyan-400">SHA-256 Proof:</strong> {item.sha256Proof}</span>
              <span className="text-emerald-400 shrink-0 font-bold text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40">
                HISTORY PRESERVED
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
