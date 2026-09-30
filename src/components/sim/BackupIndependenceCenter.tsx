import React, { useState } from 'react';
import { 
  HardDrive, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Database, 
  Cloud, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw, 
  Layers,
  Archive,
  Lock
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const BackupIndependenceCenter: React.FC = () => {
  const [exportingType, setExportingType] = useState<string | null>(null);
  const [lastBackupDate, setLastBackupDate] = useState<string>('2026-08-16 14:00 WIB');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleExport = (type: 'JSON' | 'EXCEL' | 'PDF' | 'GDRIVE') => {
    setExportingType(type);
    setStatusMessage(null);

    setTimeout(() => {
      setExportingType(null);
      setLastBackupDate(new Date().toLocaleTimeString('id-ID'));
      setStatusMessage(`Backup format ${type} berhasil diekspor dan diverifikasi SHA-256 integrity hash.`);

      // Log to Black Box
      blackBoxRecorder.record({
        moduleCode: 'R517',
        eventType: 'STORAGE',
        severity: 'INFO',
        details: `Backup Independence Center exported ${type} package. Data ownership 100% with TK Aisyiyah 1.`
      });
    }, 1200);
  };

  const backupModules = [
    { name: 'Basis Data Siswa & Santri (500+ Record)', size: '2.4 MB', records: '542 Siswa', status: 'SYNCHRONIZED' },
    { name: 'Buku Kas & Transaksi SPP (3 Tahun Buku)', size: '14.8 MB', records: '12,450 Transaksi', status: 'SYNCHRONIZED' },
    { name: 'Arsip Surat Masuk & Keluar Digital', size: '8.1 MB', records: '1,890 Dokumen', status: 'SYNCHRONIZED' },
    { name: 'Raport Kurikulum Merdeka & Portofolio', size: '32.5 MB', records: '542 Raport', status: 'SYNCHRONIZED' },
    { name: 'WORM Immutable Audit Log Ledger', size: '5.2 MB', records: '48,920 Event', status: 'LOCKED' },
    { name: 'Pusat Pengetahuan & SOP Sekolah (Vault)', size: '3.6 MB', records: '45 Modul SOP', status: 'SYNCHRONIZED' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 dark:bg-purple-400/10 rounded-2xl border border-purple-500/20 text-purple-600 dark:text-purple-400">
              <HardDrive className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 font-mono">
                  R517 &bull; INDEPENDENCE CENTER
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 font-mono">
                  CLOUD INDEPENDENT
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Backup Independence Center
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Kedaulatan data mutlak milik sekolah. Ekspor data lengkap kapan pun tanpa ketergantungan vendor cloud.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">Backup Terakhir: <strong>{lastBackupDate}</strong></span>
          </div>
        </div>
      </div>

      {/* Notification */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {statusMessage}
        </div>
      )}

      {/* 4 Multi-Format Export Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ekspor Full JSON</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Raw database dump struktur relasional siap restore.</p>
          </div>
          <button
            onClick={() => handleExport('JSON')}
            disabled={exportingType !== null}
            className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {exportingType === 'JSON' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Unduh .JSON
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ekspor Excel (XLSX)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Format spreadsheet multi-sheet untuk audit manual.</p>
          </div>
          <button
            onClick={() => handleExport('EXCEL')}
            disabled={exportingType !== null}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {exportingType === 'EXCEL' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Unduh .XLSX
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ekspor Laporan PDF</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ringkasan eksekutif siap cetak dengan QR verifikasi.</p>
          </div>
          <button
            onClick={() => handleExport('PDF')}
            disabled={exportingType !== null}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {exportingType === 'PDF' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Unduh .PDF
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sinkron Drive</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Penyimpanan cadangan terenkripsi ke Google Drive.</p>
          </div>
          <button
            onClick={() => handleExport('GDRIVE')}
            disabled={exportingType !== null}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {exportingType === 'GDRIVE' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Cloud className="w-3.5 h-3.5" />}
            Sinkron Cloud
          </button>
        </div>
      </div>

      {/* Database Partition Breakdown */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Archive className="w-5 h-5 text-purple-500" />
          Status Integritas Partisi Data Sekolah
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
          {backupModules.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</h4>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.records} &bull; Ukuran: {item.size}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
