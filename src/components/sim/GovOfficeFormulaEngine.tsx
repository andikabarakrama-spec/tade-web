import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Award,
  DollarSign,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Building,
  Printer,
  Sparkles,
  Layers,
  Calculator,
  Stamp
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const GovOfficeFormulaEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SURAT' | 'KEUANGAN' | 'PIAGAM'>('SURAT');

  return (
    <div id="gov-office-formula-engine-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R395 &bull; GOVERNMENT OFFICE FORMULA CONSTITUTION
              </span>
              <span className="text-xs text-slate-400 font-mono">Banking-Grade Precision &bull; State Legal Compliance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-amber-400" />
              Standar Tata Naskah Dinas &amp; Formula Keuangan Perbankan
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Penerapan standar naskah dinas resmi Republik Indonesia (Nomor Otomatis, Kop, QR, SHA-256, E-Signature, Stempel) dan formula akuntansi kas presisi tinggi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-2 rounded-2xl bg-amber-950 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
              100% REGULATED
            </span>
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2 font-mono text-xs">
        {[
          { id: 'SURAT', label: '1. Tata Naskah Surat Dinas' },
          { id: 'KEUANGAN', label: '2. Formula Keuangan Perbankan' },
          { id: 'PIAGAM', label: '3. Piagam & Sertifikat QR' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl transition-all font-bold ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Surat Dinas */}
      {activeTab === 'SURAT' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Spesifikasi Format Surat Dinas Resmi TADE
            </h3>
            <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              SESUAI PERMENDIKBUD &amp; KEMENAG
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
              <strong className="text-slate-900 dark:text-white block text-xs">Penomoran Otomatis</strong>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Format: <code>[No]/[Instansi]/[Kode]/[BulanRomawi]/[Tahun]</code> (Contoh: 084/YAS-TK/UND/VIII/2026).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
              <strong className="text-slate-900 dark:text-white block text-xs">Kop &amp; Watermark</strong>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Logo resmi Yayasan Asy-Syifa, alamat lengkap terverifikasi, dan nomor kontak resmi lembaga.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
              <strong className="text-slate-900 dark:text-white block text-xs">QR &amp; SHA-256 Stempel</strong>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Setiap lembar surat memuat QR checksum untuk verifikasi keaslian via aplikasi SIM / scan ponsel.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Keuangan Perbankan */}
      {activeTab === 'KEUANGAN' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Formula Rekonsiliasi Kas &amp; Buku Besar Perbankan
            </h3>
            <span className="px-2.5 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold text-[10px]">
              AUDIT TRAIL 100% BALANCED
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 space-y-2 text-[11px]">
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span>Formula Kas Akhir:</span>
              <strong className="text-amber-400">Saldo Akhir = Saldo Awal + Total Penerimaan SPP/Infaq - Total Pengeluaran Operasional</strong>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span>Metode Pembulatan:</span>
              <strong className="text-emerald-400">Half-Even Bankers Rounding (Zero Float Error)</strong>
            </div>
            <div className="flex justify-between">
              <span>Siklus Audit Rekonsiliasi:</span>
              <strong className="text-cyan-400">Otomatis Setiap Penutupan Kas Harian (16:00 WIB)</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Piagam & Sertifikat */}
      {activeTab === 'PIAGAM' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Standar Piagam Kelulusan &amp; Sertifikat Prestasi Santri
            </h3>
            <span className="px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">
              WATERMARKED &amp; DIGITALLY SIGNED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
              <strong className="text-slate-900 dark:text-white block text-xs">Nomor Registrasi Piagam</strong>
              <p className="text-[11px] text-slate-500">
                Pencatatan nomor unik nasional terikat pada NISN/NIS santri dan tersimpan permanen di Evidence Vault.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
              <strong className="text-slate-900 dark:text-white block text-xs">Watermark Ornamen Islam</strong>
              <p className="text-[11px] text-slate-500">
                Latar motif geometris Islami Asy-Syifa anti-duplikasi resolusi cetak 600 DPI.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
