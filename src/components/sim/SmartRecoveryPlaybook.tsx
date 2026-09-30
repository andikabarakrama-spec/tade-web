import React, { useState } from 'react';
import { BookOpen, WifiOff, RefreshCw, HardDrive, VideoOff, Printer, Users, Database, CheckCircle2, Bot, ArrowRight, Sparkles } from 'lucide-react';

interface PlaybookSOP {
  id: string;
  incidentType: string;
  icon: any;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  automatedAction: string;
  userStep: string;
  aiAsyAdvice: string;
}

export const SmartRecoveryPlaybook: React.FC = () => {
  const [playbooks] = useState<PlaybookSOP[]>([
    {
      id: 'SOP-01',
      incidentType: 'Koneksi Internet Putus (Offline)',
      icon: WifiOff,
      severity: 'MEDIUM',
      automatedAction: 'Sistem seketika beralih ke IndexedDB Offline Mode. Semua input data raport & kas disimpan di buffer lokal.',
      userStep: 'Lanjutkan pengisian form seperti biasa. Jangan refresh halaman browser.',
      aiAsyAdvice: 'Bismillah, ustadzah/ustadz tidak perlu cemas. Data tersimpan aman di peramban dan akan otomatis tersinkron saat internet kembali terhubung.'
    },
    {
      id: 'SOP-02',
      incidentType: 'Browser Terhenti / Crash',
      icon: RefreshCw,
      severity: 'LOW',
      automatedAction: 'Route Memory & Session Snapshot mengunci draf terakhir secara otomatis setiap 5 detik.',
      userStep: 'Buka kembali aplikasi SIM. Halaman dan formulir akan kembali ke kondisi tepat sebelum crash.',
      aiAsyAdvice: 'Alhamdulillah, fitur Route Memory telah memulihkan draf kerja Anda tanpa ada ketikan yang hilang.'
    },
    {
      id: 'SOP-03',
      incidentType: 'Kapasitas Storage Penuh (> 80%)',
      icon: HardDrive,
      severity: 'HIGH',
      automatedAction: 'Kompresi lossless berkas dokumen lama & pengarsipan otomatis ke cold storage.',
      userStep: 'Unduh arsip tahun ajaran lalu melalui menu Backup Independence Center.',
      aiAsyAdvice: 'Asy menyarankan untuk memindahkan berkas foto kegiatan tahun lalu ke Google Drive Yayasan untuk menjaga ruang penyimpanan tetap lapang.'
    },
    {
      id: 'SOP-04',
      incidentType: 'Kamera CCTV Offline / Bitrate Drop',
      icon: VideoOff,
      severity: 'MEDIUM',
      automatedAction: 'Sistem mengalihkan stream ke cached snapshot gerbang dan me-restart protokol handshake RTSP.',
      userStep: 'Periksa koneksi kabel LAN atau adaptor daya kamera di pos satpam.',
      aiAsyAdvice: 'Log pengawasan gerbang tetap aktif. Insya Allah proses reconnect otomatis berjalan dalam 15 detik.'
    },
    {
      id: 'SOP-05',
      incidentType: 'Printer Kasir / Thermal Error / Kertas Habis',
      icon: Printer,
      severity: 'LOW',
      automatedAction: 'Kuitansi SPP masuk ke Print Queue lokal dan salinan digital PDF ber-QR instan siap diunduh.',
      userStep: 'Pasang kertas printer baru lalu klik tombol Cetak Ulang pada antrean.',
      aiAsyAdvice: 'Kuitansi pembayaran ananda telah tersimpan rapi. Anda juga dapat mengirimkan tautan PDF langsung ke WhatsApp wali murid.'
    },
    {
      id: 'SOP-06',
      incidentType: 'Lonjakan Akses PPDB (Overload)',
      icon: Users,
      severity: 'HIGH',
      automatedAction: 'Dynamic Rate Limiter aktif & Static CDN Cache menahan beban formulir pendaftaran.',
      userStep: 'Tidak ada tindakan manual yang diperlukan. Sistem menangani pendaftar secara antrean FIFO.',
      aiAsyAdvice: 'Alhamdulillah, antusiasme calon wali murid sangat tinggi. Sistem melayani pendaftaran dengan aman dan adil.'
    },
    {
      id: 'SOP-07',
      incidentType: 'Sinkronisasi Backup Cloud Gagal',
      icon: Database,
      severity: 'HIGH',
      automatedAction: 'Fallback ke WORM storage lokal & penjadwalan ulang sinkronisasi bertahap (Exponential Backoff).',
      userStep: 'Klik tombol Sync Manual di Backup Independence Center atau ekspor cadangan ke flashdisk.',
      aiAsyAdvice: 'Kedaulatan data sekolah tetap terjaga utuh di perangkat lokal. Tidak ada data yang hilang.'
    }
  ]);

  const [selectedSOP, setSelectedSOP] = useState<PlaybookSOP>(playbooks[0]);

  return (
    <div id="smart-recovery-playbook-root" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-emerald-900/40">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              TADE RC70 • R532
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Automated Incident SOP & AI Guidance
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-emerald-400" />
            Smart Recovery Playbook
          </h1>
          <p className="text-emerald-100/80 text-sm mt-1 max-w-2xl">
            SOP pemulihan otomatis untuk 7 skenario insiden teknis umum sekolah dengan bimbingan santun dari AI Asy.
          </p>
        </div>
        <div className="bg-slate-900/80 border border-emerald-500/30 px-4 py-2 rounded-xl text-center">
          <span className="text-xs text-emerald-300 block">Playbooks Available</span>
          <span className="text-xl font-bold text-emerald-400">7/7 SOP READY</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: List */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">Katalog SOP Insiden</h2>
          {playbooks.map((sop) => {
            const Icon = sop.icon;
            const isSelected = selectedSOP.id === sop.id;
            return (
              <div
                key={sop.id}
                onClick={() => setSelectedSOP(sop)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{sop.incidentType}</div>
                  <div className="text-[11px] text-slate-500">{sop.id} • Tingkat: {sop.severity}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed SOP Viewer */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{selectedSOP.id}</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{selectedSOP.incidentType}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                SOP AKTIF
              </span>
            </div>

            {/* Step 1: Automated Action */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 1. Tindakan Otomatis Sistem (Self-Healing)
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {selectedSOP.automatedAction}
              </p>
            </div>

            {/* Step 2: User Action */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowRight className="w-4 h-4" /> 2. Langkah Pengguna / Petugas Sekolah
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {selectedSOP.userStep}
              </p>
            </div>

            {/* Step 3: AI Asy Advice */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-500/30 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-300 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-0.5">
                  Bimbingan Ramah Tamah AI Asy
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {selectedSOP.aiAsyAdvice}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
            <span>Standar Operasional Prosedur TADE</span>
            <span>Zero Data Loss Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};
