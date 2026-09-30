import React, { useState } from 'react';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Database,
  RefreshCw,
  Layers,
  Table,
  FileCheck
} from 'lucide-react';

interface ColumnMapping {
  excelHeader: string;
  mappedField: string;
  confidence: number;
}

interface ParsedRow {
  rowNum: number;
  nama: string;
  nisn: string;
  kelas: string;
  waliWa: string;
  nominalSpp: number;
  status: 'VALID' | 'WARNING' | 'ERROR';
  note?: string;
}

const MOCK_PARSED_ROWS: ParsedRow[] = [
  {
    rowNum: 1,
    nama: 'Ahmad Faris Al-Fatih',
    nisn: '3182910291',
    kelas: 'TK A (Al-Kautsar)',
    waliWa: '081234567890',
    nominalSpp: 250000,
    status: 'VALID'
  },
  {
    rowNum: 2,
    nama: 'Aisyah Humaira Putri',
    nisn: '3182910292',
    kelas: 'TK A (Al-Kautsar)',
    waliWa: '081398765432',
    nominalSpp: 250000,
    status: 'VALID'
  },
  {
    rowNum: 3,
    nama: 'Muhammad Zaidan',
    nisn: '3182910293',
    kelas: 'TK B (Ar-Rahman)',
    waliWa: '085711223344',
    nominalSpp: 275000,
    status: 'VALID'
  },
  {
    rowNum: 4,
    nama: 'Khadijah Azzahra',
    nisn: '3182910294',
    kelas: 'TK B (Ar-Rahman)',
    waliWa: '082199887766',
    nominalSpp: 275000,
    status: 'VALID'
  }
];

export const AutoMigrationCenter: React.FC = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [rows, setRows] = useState<ParsedRow[]>(MOCK_PARSED_ROWS);

  const [mappings, setMappings] = useState<ColumnMapping[]>([
    { excelHeader: 'Nama Lengkap Santri', mappedField: 'nama', confidence: 99 },
    { excelHeader: 'Nomor Induk / NISN', mappedField: 'nisn', confidence: 98 },
    { excelHeader: 'Rombel Kelas', mappedField: 'kelas', confidence: 95 },
    { excelHeader: 'No HP / WhatsApp Ortu', mappedField: 'waliWa', confidence: 96 },
    { excelHeader: 'Besaran SPP', mappedField: 'nominalSpp', confidence: 92 }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setFileUploaded(true);
      }, 1000);
    }
  };

  const handleExecuteImport = async () => {
    setIsImporting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsImporting(false);
    setImportSuccess(true);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/80 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-lg">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    MODULE R148
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    AUTO MIGRATION ENGINE
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-100">
                  Auto Migration & Smart Spreadsheet Import
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Pindahkan ratusan data santri, nomor WhatsApp wali murid, dan riwayat tagihan dari Excel/CSV lama dengan pemetaan kolom otomatis bertenaga AI Asy tanpa risiko data korup.
            </p>
          </div>
        </div>
      </div>

      {importSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center space-x-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          <div>
            <span className="font-bold block">Migrasi Data Berhasil Dilakukan!</span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-300">
              4 santri baru telah ditambahkan ke database kelas tanpa bentrok dengan data lama.
            </span>
          </div>
        </div>
      )}

      {/* Upload Zone */}
      {!fileUploaded ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 text-center space-y-4 hover:border-emerald-500 transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Tarik & Letakkan File Excel (.xlsx) atau CSV Sekolah
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Atau klik tombol di bawah untuk memilih file dari komputer Anda
            </p>
          </div>
          <label className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow cursor-pointer transition-all">
            <FileCheck className="w-4 h-4" />
            <span>Pilih File Spreadsheet</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Smart AI Auto-Mapping Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Hasil Pemetaan Kolom Otomatis (AI Asy Mapping)</span>
              </h4>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                100% TERPETAKAN
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              {mappings.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1"
                >
                  <span className="text-[10px] text-slate-400 block truncate">
                    Excel: "{m.excelHeader}"
                  </span>
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1">
                    <ArrowRight className="w-3 h-3 text-emerald-500" />
                    <span>Database: {m.mappedField}</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">
                    Akurasi: {m.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Table Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Table className="w-4 h-4 text-emerald-500" />
                <span>Pratinjau 4 Baris Data Siap Impor</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                Semua Baris Valid
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Nama Santri</th>
                    <th className="py-3 px-4">NISN</th>
                    <th className="py-3 px-4">Rombel Kelas</th>
                    <th className="py-3 px-4">No. WhatsApp Wali</th>
                    <th className="py-3 px-4">SPP Bulanan</th>
                    <th className="py-3 px-4 text-right">Validasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {rows.map((r) => (
                    <tr key={r.rowNum} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono text-slate-400">{r.rowNum}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">{r.nama}</td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">{r.nisn}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{r.kelas}</td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">{r.waliWa}</td>
                      <td className="py-3 px-4 font-mono text-slate-900 dark:text-slate-100">Rp {r.nominalSpp.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 inline-flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>VALID</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setFileUploaded(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Ganti File
              </button>

              <button
                onClick={handleExecuteImport}
                disabled={isImporting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                <Database className={`w-4 h-4 ${isImporting ? 'animate-spin' : ''}`} />
                <span>{isImporting ? 'Menyimpan ke Database...' : 'Eksekusi Migrasi Data Sekarang'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
