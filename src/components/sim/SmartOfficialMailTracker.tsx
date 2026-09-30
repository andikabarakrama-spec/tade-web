import React, { useState } from 'react';
import {
  Send,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Archive,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Building,
  UserCheck,
  Eye
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface TrackedMail {
  id: string;
  mailNumber: string;
  subject: string;
  recipient: string;
  currentStage: 'DRAFT' | 'REVIEW' | 'APPROVAL' | 'CETAK' | 'DISTRIBUSI' | 'ARSIP';
  sentDate: string;
  qrScanCount: number;
  sha256: string;
}

export const SmartOfficialMailTracker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMail, setSelectedMail] = useState<TrackedMail | null>(null);

  const mails: TrackedMail[] = [
    {
      id: 'TRK-01',
      mailNumber: '112/UND/TK-ASY/VIII/2026',
      subject: 'Undangan Parenting Sentra Karakter & Pertemuan Wali Santri',
      recipient: 'Seluruh Wali Santri Kelompok KB & TK',
      currentStage: 'DISTRIBUSI',
      sentDate: '2026-08-14',
      qrScanCount: 78,
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    },
    {
      id: 'TRK-02',
      mailNumber: '142/421.1/TK-ASY/VIII/2026',
      subject: 'Surat Keterangan Aktif Belajar Santri (Perpanjangan Paspor)',
      recipient: 'Imigrasi Kelas I TPI Jember',
      currentStage: 'ARSIP',
      sentDate: '2026-08-12',
      qrScanCount: 3,
      sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
    },
    {
      id: 'TRK-03',
      mailNumber: '150/421.1/TK-ASY/VIII/2026',
      subject: 'Permohonan Izin Kunjungan Edukasi Sentra Bahan Alam',
      recipient: 'Balai Penelitian Tanaman Buah & Holtikultura',
      currentStage: 'CETAK',
      sentDate: '2026-08-16',
      qrScanCount: 1,
      sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
    }
  ];

  const stages = ['DRAFT', 'REVIEW', 'APPROVAL', 'CETAK', 'DISTRIBUSI', 'ARSIP'];

  const filteredMails = mails.filter(m =>
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.mailNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.recipient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSimulateScan = (mail: TrackedMail) => {
    setSelectedMail({ ...mail, qrScanCount: mail.qrScanCount + 1 });
    blackBoxRecorder.record({
      moduleCode: 'R432-MAIL-TRACKER',
      role: 'ADMIN',
      eventType: 'ACTION',
      details: `QR Code verification scanned for official letter ${mail.mailNumber}. Scan counter incremented to ${mail.qrScanCount + 1}.`,
      severity: 'INFO'
    });
  };

  return (
    <div id="smart-official-mail-tracker-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R432 &bull; SMART OFFICIAL MAIL TRACKER
              </span>
              <span className="text-xs text-slate-400 font-mono">End-to-End State Dispatch &amp; QR Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Send className="w-8 h-8 text-blue-400" />
              Pelacak Ekspedisi &amp; Telemetri Surat Dinas Masuk/Keluar
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Pemantauan realtime alur surat: Draft, Review, Approval, Cetak, Distribusi, hingga Pengarsipan WORM Vault dengan pencatat frekuensi pindai QR.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-2 rounded-2xl bg-blue-950/60 border border-blue-500/40 text-blue-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-blue-400" /> QR SCAN TELEMETRY
            </span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-md font-mono text-xs">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Cari perihal / nomor surat / tujuan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
        />
      </div>

      {/* Detail Modal */}
      {selectedMail && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-blue-500/40 text-white font-mono space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-sm text-blue-300">Telemetri Pindai QR Surat Dinas</span>
            </div>
            <button onClick={() => setSelectedMail(null)} className="text-slate-400 hover:text-white text-xs">
              Tutup [X]
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">NOMOR SURAT DINAS:</span>
              <code className="text-blue-400 font-bold">{selectedMail.mailNumber}</code>
              <span className="text-slate-300 block mt-1">{selectedMail.subject}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">TUJUAN SURAT:</span>
              <span className="text-white font-bold">{selectedMail.recipient}</span>
              <span className="text-slate-400 block text-[10px] mt-1">Tanggal: {selectedMail.sentDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">TOTAL VERIFIKASI QR:</span>
              <span className="text-emerald-400 text-base font-bold">{selectedMail.qrScanCount} Kali Pindai</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400 break-all font-mono">
            <span className="text-blue-400 font-bold block mb-0.5">SHA-256 ENCRYPTION CHECKSUM:</span>
            {selectedMail.sha256}
          </div>
        </div>
      )}

      {/* Grid of Tracked Mails */}
      <div className="space-y-4 font-mono text-xs">
        {filteredMails.map((mail) => (
          <div
            key={mail.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 font-bold">{mail.mailNumber}</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                  {mail.subject}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSimulateScan(mail)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 border border-blue-500/30 text-blue-700 dark:text-blue-300 font-bold text-[10px] flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" /> Pindai QR ({mail.qrScanCount})
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap justify-between gap-2">
              <div>Tujuan: <strong className="text-slate-700 dark:text-slate-200">{mail.recipient}</strong></div>
              <div>Tanggal Kirim: <strong className="text-slate-700 dark:text-slate-200">{mail.sentDate}</strong></div>
            </div>

            {/* Stages Visual Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
              {stages.map((st, idx) => {
                const isPassed = stages.indexOf(mail.currentStage) >= idx;
                const isCurrent = mail.currentStage === st;
                return (
                  <div
                    key={st}
                    className={`p-2 rounded-xl text-center border text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : isPassed
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-700/20 border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    {st}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
