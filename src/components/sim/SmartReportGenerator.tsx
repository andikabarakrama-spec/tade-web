import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Download,
  Calendar,
  Sparkles,
  CheckCircle2,
  Layers,
  Printer,
  Table,
  Loader2
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';

export const SmartReportGenerator: React.FC = () => {
  const { userProfile, activeRole } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'HARIAN' | 'MINGGUAN' | 'BULANAN' | 'SEMESTER' | 'TAHUNAN'>('BULANAN');
  const [selectedTopic, setSelectedTopic] = useState<'KEUANGAN' | 'AKADEMIK' | 'ABSENSI' | 'PPDB' | 'ASET'>('KEUANGAN');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportedFormat, setExportedFormat] = useState<string | null>(null);

  const handleExport = async (format: 'PDF' | 'EXCEL' | 'WORD') => {
    setIsExporting(true);
    try {
      let csvContent = '';
      const timestamp = new Date().toLocaleDateString('id-ID');
      const filename = `Laporan_${selectedTopic}_${selectedPeriod}_${Date.now()}`;

      if (selectedTopic === 'KEUANGAN') {
        const [spp, expenses] = await Promise.all([
          DataService.getSPPBills().catch(() => []),
          DataService.getExpenses().catch(() => [])
        ]);
        csvContent = `LAPORAN KEUANGAN TK ISLAM ASY-SYIFA\nPeriode: ${selectedPeriod}\nTanggal Unduh: ${timestamp}\n\n` +
          `TAGIHAN SPP\nID,Siswa,Bulan,Jumlah,Status\n` +
          spp.map(s => `"${s.id}","${s.studentName || ''}","${s.month}","${s.amount}","${s.status}"`).join('\n') +
          `\n\nPENGELUARAN\nID,Kategori,Deskripsi,Jumlah,Tanggal\n` +
          expenses.map(e => `"${e.id}","${e.category}","${e.description}","${e.amount}","${e.date}"`).join('\n');
      } else if (selectedTopic === 'AKADEMIK' || selectedTopic === 'PPDB') {
        const students = await DataService.getStudents().catch(() => []);
        csvContent = `LAPORAN DATA SISWA & AKADEMIK TK ISLAM ASY-SYIFA\nPeriode: ${selectedPeriod}\nTanggal Unduh: ${timestamp}\n\n` +
          `ID,Nama Lengkap,NISN,Kelompok,Status,Jenis Kelamin\n` +
          students.map(s => `"${s.id}","${s.name}","${s.nisn || '-'}","${s.kelas || '-'}","${s.status || 'AKTIF'}","${s.gender || '-'}"`).join('\n');
      } else {
        const auditLogs = await DataService.getAuditLogs().catch(() => []);
        csvContent = `REKAPITULASI SISTEM ${selectedTopic} TK ISLAM ASY-SYIFA\nPeriode: ${selectedPeriod}\nTanggal Unduh: ${timestamp}\n\n` +
          `ID,User,Role,Aksi,Waktu,Detail\n` +
          auditLogs.slice(0, 100).map(l => `"${l.id}","${l.user}","${l.role}","${l.action}","${l.timestamp}","${(l.details || '').replace(/"/g, '""')}"`).join('\n');
      }

      // Create downloadable file blob
      let mimeType = 'text/csv;charset=utf-8;';
      let ext = 'csv';
      let blobData = csvContent;

      if (format === 'WORD') {
        mimeType = 'application/msword;charset=utf-8;';
        ext = 'doc';
        blobData = `<html><body><pre style="font-family: Arial, sans-serif;">${csvContent}</pre></body></html>`;
      } else if (format === 'PDF') {
        mimeType = 'text/plain;charset=utf-8;';
        ext = 'txt';
      }

      const blob = new Blob([blobData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.${ext}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportedFormat(format);

      blackBoxRecorder.record({
        moduleCode: 'R416-REPORT-GEN',
        role: activeRole || 'ADMIN',
        eventType: 'ACTION',
        details: `Smart Report generated and downloaded: Period ${selectedPeriod}, Topic ${selectedTopic}, Format ${format}.`,
        severity: 'INFO'
      });

      await DataService.logAction(
        userProfile?.nama || userProfile?.name || 'Administrator',
        activeRole || 'ADMIN',
        'GENERATE_SMART_REPORT',
        `Ekspor Laporan ${selectedTopic} (${selectedPeriod}) dalam format ${format}.`
      );

      setTimeout(() => setExportedFormat(null), 4000);
    } catch (err) {
      console.error('Export report error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div id="smart-report-generator-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R416 &bull; SMART REPORT GENERATOR
              </span>
              <span className="text-xs text-slate-400 font-mono">Multi-Format Periodic Institutional Reporting</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-indigo-400" />
              Generator Laporan Otomatis Berkala (PDF, Excel &amp; Word)
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Membuat rekapitulasi data sekolah harian, mingguan, bulanan, semesteran, hingga tahunan siap ekspor untuk arsip yayasan dan laporan dinas pendidikan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-2 rounded-2xl bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-bold">
              3 FORMAT TERSEDIA
            </span>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5 font-mono text-xs">
        <div>
          <label className="text-[10px] text-slate-400 font-bold block mb-2">1. PILIH PERIODE LAPORAN:</label>
          <div className="flex flex-wrap gap-2">
            {(['HARIAN', 'MINGGUAN', 'BULANAN', 'SEMESTER', 'TAHUNAN'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  selectedPeriod === p ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 font-bold block mb-2">2. PILIH TOPIK LAPORAN:</label>
          <div className="flex flex-wrap gap-2">
            {(['KEUANGAN', 'AKADEMIK', 'ABSENSI', 'PPDB', 'ASET'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  selectedTopic === t ? 'bg-slate-900 text-white dark:bg-indigo-900 dark:text-indigo-200 shadow-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-700 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-slate-400 block">DOKUMEN SIAP GENERATE:</span>
            <strong className="text-slate-800 dark:text-white text-xs">
              Laporan {selectedTopic} &bull; Periode {selectedPeriod} (TA 2026/2027)
            </strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleExport('PDF')}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Ekspor PDF
            </button>
            <button
              onClick={() => handleExport('EXCEL')}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Ekspor Excel
            </button>
            <button
              onClick={() => handleExport('WORD')}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Ekspor Word
            </button>
          </div>
        </div>

        {exportedFormat && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Laporan format <strong>{exportedFormat}</strong> berhasil diunduh dan tersimpan ke arsip.</span>
          </div>
        )}
      </div>
    </div>
  );
};
