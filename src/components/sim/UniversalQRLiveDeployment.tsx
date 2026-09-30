import React, { useState } from 'react';
import {
  QrCode,
  Download,
  Share2,
  Printer,
  Copy,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Calendar,
  Layers,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface UniversalQRItem {
  id: string;
  name: string;
  category: 'LOBBY' | 'MEETING' | 'EVENT' | 'VISITOR' | 'PPDB';
  code: string;
  targetUrl: string;
  expiration: string;
  scanCount: number;
  uniqueScanners: number;
  status: 'ACTIVE' | 'EXPIRED' | 'PAUSED';
  securitySeal: string;
}

const INITIAL_QRS: UniversalQRItem[] = [
  {
    id: 'qr_lobby',
    name: 'Lobby & Gerbang Utama School Check-In',
    category: 'LOBBY',
    code: 'QR-ASY-LOBBY-2026-MAIN',
    targetUrl: 'https://asy-syifatan.sch.id/lobby-receptionist',
    expiration: '2026-12-31 (Permanent)',
    scanCount: 1420,
    uniqueScanners: 215,
    status: 'ACTIVE',
    securitySeal: 'HMAC-SHA256-LOBBY-01'
  },
  {
    id: 'qr_meeting',
    name: 'Rapat Pleno Dewan Guru & Yayasan',
    category: 'MEETING',
    code: 'QR-MTG-YAYASAN-PLENO-26',
    targetUrl: 'https://asy-syifatan.sch.id/executive-meeting?room=PLENO-YAYASAN',
    expiration: 'Hari ini pukul 17:00 WIB',
    scanCount: 18,
    uniqueScanners: 18,
    status: 'ACTIVE',
    securitySeal: 'HMAC-SHA256-MTG-09'
  },
  {
    id: 'qr_event',
    name: 'Event Manasik Haji Cilik 2026 (Presensi Peserta)',
    category: 'EVENT',
    code: 'QR-EVT-MANASIK-HAJI-2026',
    targetUrl: 'https://asy-syifatan.sch.id/event-checkin?id=manasik-2026',
    expiration: '2026-08-30',
    scanCount: 86,
    uniqueScanners: 82,
    status: 'ACTIVE',
    securitySeal: 'HMAC-SHA256-EVT-88'
  },
  {
    id: 'qr_visitor',
    name: 'Pass Tamu & Kunjungan Dinas / Pengawas',
    category: 'VISITOR',
    code: 'QR-VST-DYNAMIC-TOKEN-77',
    targetUrl: 'https://asy-syifatan.sch.id/visitor-pass?token=VST-77981',
    expiration: 'Berlaku 4 Jam per Sesi',
    scanCount: 42,
    uniqueScanners: 39,
    status: 'ACTIVE',
    securitySeal: 'HMAC-SHA256-VST-12'
  },
  {
    id: 'qr_ppdb',
    name: 'Brosur & Formulir Online PPDB 2026/2027',
    category: 'PPDB',
    code: 'QR-PPDB-GELOMBANG-1-2026',
    targetUrl: 'https://asy-syifatan.sch.id/ppdb-online?ref=brosur-cetak',
    expiration: '2026-09-30',
    scanCount: 654,
    uniqueScanners: 489,
    status: 'ACTIVE',
    securitySeal: 'HMAC-SHA256-PPD-04'
  }
];

export const UniversalQRLiveDeployment: React.FC = () => {
  const [qrs, setQrs] = useState<UniversalQRItem[]>(INITIAL_QRS);
  const [selectedQR, setSelectedQR] = useState<UniversalQRItem>(INITIAL_QRS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (qr: UniversalQRItem) => {
    navigator.clipboard.writeText(qr.targetUrl);
    setCopiedId(qr.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  UNIVERSAL QR 2.0
                </span>
                <span className="text-xs text-slate-400">Live Campaign & Security Deployment</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Universal QR Live Deployment & Analytics
              </h1>
              <p className="text-sm text-emerald-100/80 mt-0.5">
                Pengelolaan pusat QR Code resmi sekolah: Lobby, Rapat, Event, Tamu, dan PPDB dengan enkripsi HMAC anti-pemalsuan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              HMAC-SHA256 SECURED
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: QR List & QR Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: QR Directory */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Daftar Live QR Code Sekolah</h3>
                <p className="text-xs text-slate-500">Pilih salah satu untuk melihat analitik dan mengunduh format cetak</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {qrs.length} QR Aktif
              </span>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {qrs.map((qr) => (
                <div
                  key={qr.id}
                  onClick={() => setSelectedQR(qr)}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition ${
                    selectedQR.id === qr.id
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{qr.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {qr.category}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-slate-500 mt-0.5">{qr.code}</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Masa Berlaku: {qr.expiration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Total Scan</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{qr.scanCount.toLocaleString()}x</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      ACTIVE
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Selected QR Preview & Actions */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="text-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{selectedQR.name}</h3>
              <p className="text-xs text-slate-500">{selectedQR.category} • {selectedQR.code}</p>
            </div>

            {/* Visual QR Code Display Container */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-3">
              <div className="w-44 h-44 bg-white p-3 rounded-xl shadow-md border-2 border-emerald-500/50 flex items-center justify-center relative">
                {/* Simulated High-Res QR SVG */}
                <QrCode className="w-36 h-36 text-slate-950" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white font-bold text-[9px]">
                    ASY
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-mono text-slate-400 text-center">
                Security Seal: {selectedQR.securitySeal}
              </div>
            </div>

            {/* Analytics Mini-Stats */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-500">Total Pindai</div>
                <div className="text-base font-bold text-slate-900 dark:text-white">{selectedQR.scanCount}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-500">Pengguna Unik</div>
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">{selectedQR.uniqueScanners}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleCopyLink(selectedQR)}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                {copiedId === selectedQR.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Tautan Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Salin Target URL
                  </>
                )}
              </button>

              <button
                onClick={() => alert(`Format cetak poster QR "${selectedQR.name}" siap di Print Center.`)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow transition"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Lembar Standee / Poster QR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
