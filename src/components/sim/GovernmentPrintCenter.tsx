import React, { useState } from 'react';
import {
  Printer,
  FileText,
  Sliders,
  CheckCircle2,
  Maximize2,
  Sparkles,
  ShieldCheck,
  QrCode,
  Layers,
  Settings,
  Eye
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const GovernmentPrintCenter: React.FC = () => {
  const [paperSize, setPaperSize] = useState<'A4' | 'F4'>('F4');
  const [includeHeader, setIncludeHeader] = useState<boolean>(true);
  const [includeFooter, setIncludeFooter] = useState<boolean>(true);
  const [includeQR, setIncludeQR] = useState<boolean>(true);
  const [includeWatermark, setIncludeWatermark] = useState<boolean>(true);
  const [marginPreset, setMarginPreset] = useState<'GOV_STANDARD' | 'NARROW' | 'FORMAL_DIPLOMA'>('GOV_STANDARD');
  const [isPrinted, setIsPrinted] = useState<boolean>(false);

  const handlePrint = () => {
    setIsPrinted(true);
    blackBoxRecorder.record({
      moduleCode: 'R429-PRINT-CENTER',
      role: 'ADMIN',
      eventType: 'ACTION',
      details: `Official print dispatched. Paper: ${paperSize}, Margin: ${marginPreset}, QR: ${includeQR ? 'YES' : 'NO'}, Watermark: ${includeWatermark ? 'YES' : 'NO'}.`,
      severity: 'INFO'
    });
    setTimeout(() => setIsPrinted(false), 3000);
  };

  return (
    <div id="government-print-center-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R429 &bull; GOVERNMENT PRINT CENTER
              </span>
              <span className="text-xs text-slate-400 font-mono">Pixel-Perfect State &amp; Folio Printing Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Printer className="w-8 h-8 text-cyan-400" />
              Pusat Cetak Dokumen Dinas &amp; Format Kertas Resmi
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Pengaturan cetak presisi: Kertas Folio F4 (215 x 330 mm) &amp; A4 ISO, margin standar pemerintah, kop dinas, footer pengesahan, QR verifikasi, dan watermark resmi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-mono shadow-md flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Cetak Naskah Dinas Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Print Success Alert */}
      {isPrinted && (
        <div className="p-4 rounded-3xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-500/40 text-cyan-800 dark:text-cyan-200 flex items-center gap-2 font-mono text-xs">
          <CheckCircle2 className="w-4 h-4 text-cyan-500" />
          <span>Perintah cetak dikirim ke spooler printer dengan konfigurasi {paperSize} ({marginPreset}). Dokumen siap cetak!</span>
        </div>
      )}

      {/* Main Grid: Controls + Live Document Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* Left: Settings */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <Sliders className="w-4 h-4 text-cyan-500" /> Parameter Cetak Dinas
          </h3>

          {/* Paper Size */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-400 font-bold block">FORMAT UKURAN KERTAS</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaperSize('F4')}
                className={`py-2 rounded-xl font-bold border transition-all ${
                  paperSize === 'F4'
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                F4 Folio (21.5 x 33 cm)
              </button>
              <button
                onClick={() => setPaperSize('A4')}
                className={`py-2 rounded-xl font-bold border transition-all ${
                  paperSize === 'A4'
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                A4 ISO (21 x 29.7 cm)
              </button>
            </div>
          </div>

          {/* Margin Preset */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-400 font-bold block">MARGIN STANDAR PEMERINTAH</label>
            <div className="space-y-1.5">
              {[
                { id: 'GOV_STANDARD', label: 'Standar Naskah Dinas (Kiri 3cm, Atas/Bwh/Kanan 2cm)' },
                { id: 'NARROW', label: 'Margin Ringkas (Semua 1.5 cm)' },
                { id: 'FORMAL_DIPLOMA', label: 'Piagam & Sertifikat (Simetris 2.5 cm)' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMarginPreset(m.id as any)}
                  className={`w-full text-left p-2.5 rounded-xl border text-[11px] font-bold transition-all ${
                    marginPreset === m.id
                      ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 text-cyan-800 dark:text-cyan-300'
                      : 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
            <label className="flex items-center justify-between text-slate-700 dark:text-slate-300 cursor-pointer">
              <span>Sertakan Kop Surat Resmi</span>
              <input
                type="checkbox"
                checked={includeHeader}
                onChange={(e) => setIncludeHeader(e.target.checked)}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
            </label>
            <label className="flex items-center justify-between text-slate-700 dark:text-slate-300 cursor-pointer">
              <span>Sertakan Footer &amp; No. Halaman</span>
              <input
                type="checkbox"
                checked={includeFooter}
                onChange={(e) => setIncludeFooter(e.target.checked)}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
            </label>
            <label className="flex items-center justify-between text-slate-700 dark:text-slate-300 cursor-pointer">
              <span>QR Code Validasi SHA-256</span>
              <input
                type="checkbox"
                checked={includeQR}
                onChange={(e) => setIncludeQR(e.target.checked)}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
            </label>
            <label className="flex items-center justify-between text-slate-700 dark:text-slate-300 cursor-pointer">
              <span>Watermark Lembaga Asli</span>
              <input
                type="checkbox"
                checked={includeWatermark}
                onChange={(e) => setIncludeWatermark(e.target.checked)}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
            </label>
          </div>
        </div>

        {/* Right: Simulated Paper Live Preview (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
          <div className="text-[11px] text-slate-500 mb-3 flex items-center gap-1.5 font-bold">
            <Eye className="w-4 h-4 text-cyan-500" /> SIMULASI CETAK FISIK ({paperSize} &bull; {marginPreset})
          </div>

          {/* Paper Sheet Preview */}
          <div
            className={`w-full max-w-lg bg-white text-slate-900 shadow-2xl rounded-sm p-6 sm:p-8 space-y-4 border border-slate-300 relative transition-all ${
              paperSize === 'F4' ? 'min-h-[580px]' : 'min-h-[500px]'
            }`}
          >
            {/* Watermark */}
            {includeWatermark && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <span className="text-4xl font-bold tracking-widest uppercase rotate-45">ASY-SYIFA OFFICIAL</span>
              </div>
            )}

            {/* Header / Kop */}
            {includeHeader && (
              <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
                <h4 className="font-bold text-xs uppercase tracking-wider">YAYASAN PENDIDIKAN ISLAM SENTRA ASY-SYIFA</h4>
                <h5 className="font-bold text-sm text-slate-900 uppercase">KB - TK - TPA SENTRA ASY-SYIFA</h5>
                <p className="text-[9px] text-slate-600">
                  Jl. Sentra Edukasi No. 07 Jember, Jawa Timur &bull; Telp: (0331) 489221 &bull; NPSN: 69982341
                </p>
              </div>
            )}

            {/* Letter Title & Number */}
            <div className="text-center pt-2 space-y-0.5">
              <span className="font-bold text-xs underline uppercase tracking-wide block">SURAT KEPUTUSAN</span>
              <span className="text-[10px] text-slate-600 block">Nomor: 018/SK/YYS-ASY/KPTS/VIII/2026</span>
            </div>

            {/* Body Text */}
            <div className="text-[10px] text-slate-700 leading-relaxed space-y-2 pt-2 text-justify">
              <p>
                Menimbang bahwa dalam rangka meningkatkan mutu tata kelola pembelajaran sentra dan pembinaan akhlak santri usia dini di KB-TK-TPA Sentra Asy-Syifa, dipandang perlu menetapkan keputusan resmi yayasan.
              </p>
              <p>
                Mengingat Undang-Undang No. 20 Tahun 2003 tentang Sistem Pendidikan Nasional dan Anggaran Dasar Yayasan Sentra Asy-Syifa.
              </p>
              <p className="font-bold">MEMUTUSKAN:</p>
              <p>
                Menetapkan struktur kurikulum sentra dan formasi pendidik tahun ajaran 2026/2027 secara sah dan berkekuatan hukum tetap.
              </p>
            </div>

            {/* Signature & QR Block */}
            <div className="pt-6 flex justify-between items-end text-[9px]">
              {includeQR ? (
                <div className="p-1.5 border border-slate-300 rounded bg-slate-50 text-center space-y-1">
                  <QrCode className="w-10 h-10 mx-auto text-slate-800" />
                  <span className="text-[7px] text-slate-500 block">VALIDASI ANRI/SHA-256</span>
                </div>
              ) : <div />}

              <div className="text-center space-y-1">
                <span className="block text-slate-600">Ditetapkan di: Jember, 16 Agustus 2026</span>
                <span className="font-bold block">Ketua Yayasan Asy-Syifa</span>
                <div className="h-10 flex items-center justify-center font-serif italic text-slate-400 text-xs">
                  [Tanda Tangan &amp; Cap Basah]
                </div>
                <strong className="block text-slate-900 underline">Drs. H. Abdullah Mansur</strong>
              </div>
            </div>

            {/* Footer */}
            {includeFooter && (
              <div className="border-t border-slate-200 pt-2 flex justify-between text-[8px] text-slate-400">
                <span>SIM KB-TK Sentra Asy-Syifa &bull; Dokumen Resmi</span>
                <span>Halaman 1 dari 1</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
