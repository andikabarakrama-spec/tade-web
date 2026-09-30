import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Building,
  Camera,
  Milestone,
  Sparkles,
  Share2
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const PoliceReadyEvidencePack: React.FC = () => {
  const [dossierNumber] = useState<string>('BAP-EVD/ASY-TGL/2026/08/001');
  const [incidentDate] = useState<string>('Minggu, 16 Agustus 2026');

  const handlePrint = () => {
    blackBoxRecorder.record({
      moduleCode: 'R386-POLICE',
      role: 'SUPER_ADMIN',
      eventType: 'ACTION',
      details: `Printed Official Police Ready Evidence Pack ${dossierNumber}.`,
      severity: 'INFO'
    });
    window.print();
  };

  return (
    <div id="police-ready-evidence-pack-root" className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Action Bar */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
              R386 &bull; POLICE READY EVIDENCE PACK
            </span>
            <span className="text-xs text-slate-400 font-mono">Format Berita Acara &amp; Dokumen Bukti Resmi</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-emerald-400" />
            Paket Berkas Bukti Digital Siap Sidang / BAP
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 font-mono shadow-md"
          >
            <Printer className="w-4 h-4" /> Cetak Dokumen Resmi (PDF/A4)
          </button>
        </div>
      </div>

      {/* Official Legal Printable Dossier (A4 Sized Frame) */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-300 shadow-lg space-y-6 font-serif">
        {/* Kop Yayasan */}
        <div className="text-center border-b-2 border-slate-900 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider">
            YAYASAN ASY-SYIFA TANGGUL
          </h2>
          <h3 className="text-sm font-semibold uppercase tracking-wide">
            KB &bull; TK &bull; TPA SENTRA ASY-SYIFA TANGGUL JEMBER
          </h3>
          <p className="text-xs font-sans text-slate-600 mt-1">
            Jl. Raya Tanggul No. 45, Tanggul Kulon, Kec. Tanggul, Kab. Jember, Jawa Timur 68155
          </p>
          <div className="mt-2 text-[10px] font-mono text-slate-500 font-bold">
            BERITA ACARA SERAH TERIMA BUKTI REKAMAN CCTV ELEKTRONIK
          </div>
        </div>

        {/* Dossier Meta */}
        <div className="grid grid-cols-2 gap-4 font-sans text-xs border-b border-slate-200 pb-4">
          <div>
            <span className="text-slate-500 block">Nomor Berkas:</span>
            <strong className="font-mono text-sm">{dossierNumber}</strong>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">Tanggal Kejadian:</span>
            <strong>{incidentDate}</strong>
          </div>
        </div>

        {/* Section 1: Kronologi Ringkas */}
        <div className="space-y-2">
          <h4 className="font-sans font-bold text-sm uppercase text-slate-800 tracking-wide border-b border-slate-200 pb-1">
            I. KRONOLOGI INSIDEN KEAMANAN
          </h4>
          <p className="text-xs font-sans leading-relaxed text-slate-700">
            Berdasarkan rekaman kamera pengawas (CCTV) otomatis yang terpasang pada perimeter sekolah, pada pukul 14:23:10 WIB terdeteksi seorang oknum tidak dikenal memasuki area gerbang samping dengan sepeda motor matic hitam tanpa plat nomor depan, mengenakan helm full face dan masker. Oknum tersebut menuju area gudang arsip dan mencoba membuka akses pintu sebelum akhirnya meninggalkan lokasi pada pukul 14:31:05 WIB.
          </p>
        </div>

        {/* Section 2: Metadata Kamera & Hash Kriptografi */}
        <div className="space-y-2">
          <h4 className="font-sans font-bold text-sm uppercase text-slate-800 tracking-wide border-b border-slate-200 pb-1">
            II. DAFTAR KAMERA &amp; SERTIFIKASI INTEGRITAS (SHA-256)
          </h4>
          <table className="w-full text-left font-mono text-[11px] border border-slate-300">
            <thead className="bg-slate-100">
              <tr className="border-b border-slate-300">
                <th className="p-2">ID KAMERA</th>
                <th className="p-2">LOKASI &amp; RESOLUSI</th>
                <th className="p-2">CHECKSUM SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2 font-bold">CAM-01</td>
                <td className="p-2">Gerbang Utama &bull; 2560x1440 (Hikvision)</td>
                <td className="p-2 break-all text-[10px]">SHA256:7f83b1657ff1fc53b92dc18148a1d65d...</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">CAM-04</td>
                <td className="p-2">Koridor Sentra &bull; 2560x1440 (Ezviz)</td>
                <td className="p-2 break-all text-[10px]">SHA256:385ea3f5c191e6403615714f35836815...</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">CAM-06</td>
                <td className="p-2">Gudang Arsip &bull; 1920x1080 (Imou)</td>
                <td className="p-2 break-all text-[10px]">SHA256:d82c4be562095f9c464e83c271e84df9...</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 3: QR Validation & Sign-offs */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-center font-sans text-xs">
          <div>
            <p className="text-slate-500 mb-12">Petugas Keamanan / Satpam,</p>
            <strong className="block underline">Ustadz Ahmad Farhan</strong>
            <span className="text-[10px] text-slate-400">NIP. SEC-2024-001</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="p-2 border border-slate-300 rounded-xl bg-slate-50">
              <QrCode className="w-16 h-16" />
            </div>
            <span className="text-[9px] font-mono text-slate-500 mt-1">Verifikasi Digital TADE</span>
          </div>

          <div>
            <p className="text-slate-500 mb-12">Ketua Yayasan Asy-Syifa,</p>
            <strong className="block underline">Drs. H. Ahmad Syukri</strong>
            <span className="text-[10px] text-slate-400">Ketua Yayasan</span>
          </div>
        </div>
      </div>
    </div>
  );
};
