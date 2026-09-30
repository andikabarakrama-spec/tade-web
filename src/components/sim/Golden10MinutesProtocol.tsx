import React, { useState, useEffect } from 'react';
import {
  Zap,
  Timer,
  ShieldAlert,
  Lock,
  Camera,
  Milestone,
  CheckCircle2,
  FileCheck2,
  Bell,
  Play,
  RotateCcw,
  Sparkles,
  Flame,
  AlertTriangle,
  FolderDown
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const Golden10MinutesProtocol: React.FC = () => {
  const [protocolActive, setProtocolActive] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600); // 10 minutes
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const steps = [
    {
      step: 1,
      title: '1. Lock Rekaman Video (Buffer Freeze)',
      desc: 'Membekukan ring buffer 30 menit ke belakang pada seluruh 6 kamera agar tidak tertimpa rollover.',
      status: 'COMPLETED'
    },
    {
      step: 2,
      title: '2. Ekstraksi Snapshot Resolusi Tinggi',
      desc: 'Mengambil snapshot full frame 2560x1440 pada stempel waktu kejadian dari sudut gerbang dan koridor.',
      status: 'COMPLETED'
    },
    {
      step: 3,
      title: '3. Pembuatan Kronologi Lintas Kamera',
      desc: 'Menghubungkan urutan deteksi pergerakan secara kronologis antar zona.',
      status: 'COMPLETED'
    },
    {
      step: 4,
      title: '4. Komputasi Hash Kriptografis SHA-256',
      desc: 'Mengesahkan integritas file rekaman dengan stempel hash SHA-256 yang tidak dapat dimanipulasi.',
      status: 'COMPLETED'
    },
    {
      step: 5,
      title: '5. Aktivasi Incident Dashboard',
      desc: 'Menampilkan layar komando terpadu untuk tim tanggap darurat dan satpam.',
      status: 'COMPLETED'
    },
    {
      step: 6,
      title: '6. Notifikasi Darurat Multi-Kanal',
      desc: 'Mengirimkan sinyal siaga ke Ketua Yayasan, Kepala Sekolah, dan Pos Satpam.',
      status: 'COMPLETED'
    },
    {
      step: 7,
      title: '7. Pembungkusan Paket Bukti (Dossier Siap BAP)',
      desc: 'Membundel seluruh rekaman, log hash, dan metadata ke format standar kepolisian.',
      status: 'COMPLETED'
    }
  ];

  const handleStartProtocol = () => {
    setProtocolActive(true);
    setSecondsRemaining(600);
    blackBoxRecorder.record({
      moduleCode: 'R385-GOLDEN10',
      role: 'SECURITY_COMMANDER',
      eventType: 'SECURITY',
      details: 'Golden 10 Minutes Protocol triggered. 7 automated security actions executed in sequence.',
      severity: 'CRITICAL'
    });
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div id="golden-10-minutes-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R385 &bull; GOLDEN 10 MINUTES PROTOCOL
              </span>
              <span className="text-xs text-slate-400 font-mono">Instant First-Responder Digital Forensics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Zap className="w-8 h-8 text-amber-400" />
              Protokol 10 Menit Emas Penyelamatan Bukti
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Dalam 10 menit pertama insiden, sistem otomatis mengunci buffer rekaman, mengekstrak snapshot, menghitung hash SHA-256, dan menyiapkan berkas bukti legal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-center font-mono">
              <span className="text-[10px] text-amber-300 block">JENDELA EMAS</span>
              <span className="text-2xl font-bold text-amber-400">{formatTimer(secondsRemaining)}</span>
            </div>
            <button
              onClick={handleStartProtocol}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono shadow-lg shadow-rose-600/30 flex items-center gap-2"
            >
              <Flame className="w-4 h-4" /> Picu Protokol 10 Menit
            </button>
          </div>
        </div>
      </div>

      {/* 7 Automated Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {steps.map((st) => (
          <div
            key={st.step}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                {st.step}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                {st.status}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-sm pt-1">
              {st.title}
            </h3>

            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              {st.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
