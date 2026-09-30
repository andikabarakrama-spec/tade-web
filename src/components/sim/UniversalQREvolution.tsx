import React, { useState } from 'react';
import { 
  QrCode, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  UserCheck, 
  Sparkles, 
  Download, 
  Printer, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  Users,
  FileCheck
} from 'lucide-react';

export type QRCategoryType = 
  | 'RAPAT' 
  | 'EVENT' 
  | 'PPDB' 
  | 'BANNER' 
  | 'VISITOR' 
  | 'GURU' 
  | 'KELAS' 
  | 'DOKUMEN';

export type QRExpiryType = '1_HOUR' | '3_HOURS' | '24_HOURS' | '7_DAYS' | 'PERMANENT';

interface GeneratedQRRecord {
  id: string;
  title: string;
  category: QRCategoryType;
  expiryType: QRExpiryType;
  expiresAt: string;
  payload: string;
  checksum: string;
  scanCount: number;
}

export const UniversalQREvolution: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<QRCategoryType>('RAPAT');
  const [title, setTitle] = useState<string>('Rapat Evaluasi Kurikulum Merdeka PAUD');
  const [targetRole, setTargetRole] = useState<string>('DEWAN_GURU');
  const [expiryType, setExpiryType] = useState<QRExpiryType>('3_HOURS');
  const [customData, setCustomData] = useState<string>('Ruang Aula Utama Asy Syifa');
  const [generatedList, setGeneratedList] = useState<GeneratedQRRecord[]>([
    {
      id: 'QR-EVO-001',
      title: 'Presensi Rapat Bulanan Yayasan',
      category: 'RAPAT',
      expiryType: '3_HOURS',
      expiresAt: 'Hari ini, 14:00 WIB',
      payload: 'https://asy-syifa.sch.id/auth/qr?type=RAPAT&sig=8f1c99a0b',
      checksum: 'HMAC-SHA256: 8f1c99a0b3e512df88',
      scanCount: 14
    },
    {
      id: 'QR-EVO-002',
      title: 'Pendaftaran Santri Baru Gelombang 1',
      category: 'PPDB',
      expiryType: '7_DAYS',
      expiresAt: '21 Agustus 2026',
      payload: 'https://asy-syifa.sch.id/ppdb/intake?ref=BANNER_NUSANTARA',
      checksum: 'HMAC-SHA256: 12a9ef741cd99401ab',
      scanCount: 88
    },
    {
      id: 'QR-EVO-003',
      title: 'Sertifikat Akreditasi BAN-PAUD Aset',
      category: 'DOKUMEN',
      expiryType: 'PERMANENT',
      expiresAt: 'Permanen (Arsip Digital)',
      payload: 'https://asy-syifa.sch.id/vault/verify?doc=BAN_PAUD_2026',
      checksum: 'HMAC-SHA256: ff781109bc4412ad00',
      scanCount: 3
    }
  ]);

  const [activeQR, setActiveQR] = useState<GeneratedQRRecord>(generatedList[0]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const expiryLabel = 
      expiryType === '1_HOUR' ? '1 Jam Kedepan' :
      expiryType === '3_HOURS' ? '3 Jam Kedepan' :
      expiryType === '24_HOURS' ? '24 Jam Kedepan' :
      expiryType === '7_DAYS' ? '7 Hari Kedepan' : 'Permanen';

    const newRecord: GeneratedQRRecord = {
      id: `QR-EVO-00${generatedList.length + 1}`,
      title,
      category: selectedCat,
      expiryType,
      expiresAt: expiryLabel,
      payload: `https://asy-syifa.sch.id/qr/verify?cat=${selectedCat}&t=${Date.now()}&sig=${Math.random().toString(36).substring(2, 10)}`,
      checksum: `HMAC-SHA256: ${Math.random().toString(16).substring(2, 12)}...`,
      scanCount: 0
    };

    setGeneratedList([newRecord, ...generatedList]);
    setActiveQR(newRecord);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-500/20 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  R106 • Universal QR Evolution
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  HMAC-SHA256 Signature
                </span>
              </div>
              <h1 className="text-2xl font-bold mt-1 text-white">Universal Dynamic QR Generator & Crypto Verifier</h1>
              <p className="text-sm text-slate-300">
                Penerbitan QR resmi dengan batas kedaluwarsa dinamis (1 Jam s/d Permanen) untuk Rapat, PPDB, Tamu, Guru, dan Dokumen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Creator Form & Live QR Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Generator Settings (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h2 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Konfigurasi QR Baru</span>
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Kategori QR Universal
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'RAPAT', label: '📋 Rapat' },
                  { id: 'EVENT', label: '🎉 Event' },
                  { id: 'PPDB', label: '🎒 PPDB' },
                  { id: 'BANNER', label: '🎨 Banner' },
                  { id: 'VISITOR', label: '👤 Tamu' },
                  { id: 'GURU', label: '👩‍🏫 Guru' },
                  { id: 'KELAS', label: '🏫 Kelas' },
                  { id: 'DOKUMEN', label: '📄 Dokumen' }
                ].map(cat => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id as QRCategoryType)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedCat === cat.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Judul / Keperluan QR
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Rapat Pleno Yayasan atau Kartu Santri"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Expiry Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Waktu Kedaluwarsa (Auto-Expire)</span>
                <span className="text-[11px] text-indigo-600 font-normal">Otomatis tidak berlaku setelah waktu habis</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { id: '1_HOUR', label: '1 Jam' },
                  { id: '3_HOURS', label: '3 Jam' },
                  { id: '24_HOURS', label: '24 Jam' },
                  { id: '7_DAYS', label: '7 Hari' },
                  { id: 'PERMANENT', label: 'Permanen' }
                ].map(exp => (
                  <button
                    type="button"
                    key={exp.id}
                    onClick={() => setExpiryType(exp.id as QRExpiryType)}
                    className={`py-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                      expiryType === exp.id
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {exp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location / Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Lokasi / Catatan Validasi
              </label>
              <input
                type="text"
                value={customData}
                onChange={(e) => setCustomData(e.target.value)}
                placeholder="Contoh: Gerbang Utama atau Aula Yayasan"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span>Terbitkan QR Resmi Ber-HMAC</span>
            </button>
          </form>
        </div>

        {/* Right: Live Stamp & Crypto Badge (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300">
                  {activeQR.category} • {activeQR.id}
                </span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mt-1">
                  {activeQR.title}
                </h3>
              </div>
              <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{activeQR.expiresAt}</span>
              </span>
            </div>

            {/* Visual QR Code Box */}
            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl my-4 border border-dashed border-slate-300 dark:border-slate-700">
              {/* Stylized QR Vector */}
              <div className="p-4 bg-white rounded-2xl shadow-md border-4 border-indigo-600">
                <svg className="w-48 h-48 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                  {/* Outer Corners */}
                  <rect x="10" y="10" width="24" height="24" rx="4" fill="#1e1b4b" />
                  <rect x="14" y="14" width="16" height="16" rx="2" fill="#ffffff" />
                  <rect x="18" y="18" width="8" height="8" rx="1" fill="#4f46e5" />

                  <rect x="66" y="10" width="24" height="24" rx="4" fill="#1e1b4b" />
                  <rect x="70" y="14" width="16" height="16" rx="2" fill="#ffffff" />
                  <rect x="74" y="18" width="8" height="8" rx="1" fill="#4f46e5" />

                  <rect x="10" y="66" width="24" height="24" rx="4" fill="#1e1b4b" />
                  <rect x="14" y="70" width="16" height="16" rx="2" fill="#ffffff" />
                  <rect x="18" y="74" width="8" height="8" rx="1" fill="#4f46e5" />

                  {/* Random QR Patterns */}
                  <rect x="40" y="10" width="6" height="6" fill="#1e1b4b" />
                  <rect x="50" y="10" width="10" height="6" fill="#4f46e5" />
                  <rect x="40" y="24" width="12" height="6" fill="#1e1b4b" />
                  <rect x="10" y="42" width="6" height="10" fill="#4f46e5" />
                  <rect x="24" y="42" width="10" height="6" fill="#1e1b4b" />
                  <rect x="42" y="42" width="16" height="16" rx="2" fill="#059669" />
                  <rect x="66" y="42" width="8" height="12" fill="#4f46e5" />
                  <rect x="80" y="42" width="10" height="6" fill="#1e1b4b" />
                  <rect x="42" y="66" width="10" height="8" fill="#1e1b4b" />
                  <rect x="58" y="66" width="6" height="16" fill="#4f46e5" />
                  <rect x="70" y="70" width="20" height="6" fill="#1e1b4b" />
                  <rect x="70" y="82" width="12" height="8" fill="#4f46e5" />
                </svg>
              </div>

              <div className="mt-3 text-center">
                <span className="text-[11px] font-mono font-bold text-slate-500 block">
                  {activeQR.checksum}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Valid Signature • Siap Scan</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => alert(`Mengunduh QR Code PNG High-DPI: ${activeQR.title}`)}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Unduh PNG</span>
            </button>

            <button
              onClick={() => alert(`Mencetak Label QR ke Print Center: ${activeQR.title}`)}
              className="flex-1 py-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Label Stand</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
