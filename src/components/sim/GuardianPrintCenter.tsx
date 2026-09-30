import React, { useState } from 'react';
import {
  Printer,
  FileText,
  QrCode,
  Tag,
  CreditCard,
  Layers,
  CheckCircle2,
  Download,
  Copy,
  Settings,
  Sparkles
} from 'lucide-react';

interface PrintJob {
  id: string;
  name: string;
  category: 'ARCHIVE_LABEL' | 'VISITOR_PASS' | 'QR_SHEET' | 'EVENT_CARD' | 'CERTIFICATE';
  quantity: number;
  layout: 'A4_SHEET_8X' | 'A4_SHEET_12X' | 'STANDALONE_CARD' | 'LABEL_STICKER_ROLL';
  status: 'QUEUED' | 'PRINTING' | 'COMPLETED';
}

const INITIAL_JOBS: PrintJob[] = [
  { id: 'pj1', name: 'Stiker Label Arsip Smart Vault (10 Kategori Akreditasi)', category: 'ARCHIVE_LABEL', quantity: 30, layout: 'LABEL_STICKER_ROLL', status: 'COMPLETED' },
  { id: 'pj2', name: 'ID Card & Pass Tamu Dinas (HMAC Secure QR)', category: 'VISITOR_PASS', quantity: 20, layout: 'A4_SHEET_8X', status: 'QUEUED' },
  { id: 'pj3', name: 'Lembar Stiker Universal QR Penjemputan Kelas A & B', category: 'QR_SHEET', quantity: 50, layout: 'A4_SHEET_12X', status: 'QUEUED' },
  { id: 'pj4', name: 'Kartu Peserta Manasik Haji Cilik 2026 (Lanyard Card)', category: 'EVENT_CARD', quantity: 60, layout: 'A4_SHEET_8X', status: 'COMPLETED' }
];

export const GuardianPrintCenter: React.FC = () => {
  const [jobs, setJobs] = useState<PrintJob[]>(INITIAL_JOBS);
  const [selectedLayout, setSelectedLayout] = useState<'A4_SHEET_8X' | 'A4_SHEET_12X' | 'STANDALONE_CARD'>('A4_SHEET_8X');
  const [printFilter, setPrintFilter] = useState<'ALL' | 'ARCHIVE' | 'PASS' | 'QR'>('ALL');
  const [isPrinting, setIsPrinting] = useState(false);

  const handleRunBatchPrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setJobs(prev => prev.map(j => ({ ...j, status: 'COMPLETED' })));
      setIsPrinting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-stone-900 to-slate-900 border border-stone-500/30 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-stone-500/20 border border-stone-400/40 flex items-center justify-center text-stone-300">
              <Printer className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-500/20 text-stone-300 border border-stone-400/30">
                  GUARDIAN PRINT CENTER
                </span>
                <span className="text-xs text-slate-400">Enterprise High-Density Production</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Guardian Batch Print & Label Studio
              </h1>
              <p className="text-sm text-stone-100/80 mt-0.5">
                Cetak massal label arsip dokumen fisik, visitor pass, lembar Universal QR penjemputan anak, dan kartu peserta event sekolah.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunBatchPrint}
              disabled={isPrinting}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition"
            >
              <Printer className="w-4 h-4" />
              {isPrinting ? 'Memproses Cetak Massal...' : 'Cetak Semua Antrean Cetak'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Print Job Queue & Sheet Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/40">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Antrean Cetak Dokumen & Label Fisik</h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300">
                {jobs.filter(j => j.status === 'QUEUED').length} Menunggu Cetak
              </span>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {jobs.map(job => (
                <div key={job.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-slate-800 text-amber-600">
                      {job.category === 'ARCHIVE_LABEL' ? <Tag className="w-5 h-5" /> :
                       job.category === 'VISITOR_PASS' ? <CreditCard className="w-5 h-5" /> :
                       job.category === 'QR_SHEET' ? <QrCode className="w-5 h-5" /> :
                       <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{job.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>Format: <strong>{job.layout}</strong></span>
                        <span>•</span>
                        <span>Jumlah: <strong>{job.quantity} Lembar/Pcs</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      job.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                      'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}>
                      {job.status}
                    </span>
                    <button
                      onClick={() => alert(`Memulai proses cetak untuk: ${job.name}`)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Cetak Sekarang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Sheet Layout Grid Visualizer */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Simulasi Layout Kertas Cetak A4</h3>
            <p className="text-xs text-slate-500">Kerapatan kisi stiker & kartu (Zero Margin Waste)</p>

            {/* Visual Sheet Mockup */}
            <div className="w-full h-72 bg-slate-100 dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 grid grid-cols-2 grid-rows-4 gap-2">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-1.5 flex items-center justify-between shadow-xs text-[9px] text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-[8px]">ASY-PASS #{idx + 1}</div>
                      <div>TK ASY SYIFA</div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 text-center">
              Layout: 8-Up Badge / Stiker Presisi Tinggi (210 x 297 mm)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
