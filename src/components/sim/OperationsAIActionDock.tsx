import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  Printer,
  QrCode,
  Archive,
  Send,
  FileText,
  Sparkles,
  RefreshCw,
  Clock,
  ArrowRight,
  Layers
} from 'lucide-react';

export const OperationsAIActionDock: React.FC = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<'PPDB' | 'SURAT'>('PPDB');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedWorkflows, setCompletedWorkflows] = useState<string[]>([]);

  const ppdbSteps = [
    { title: '1. Verifikasi Berkas', desc: 'Validasi Akta Kelahiran & KK Ananda', icon: CheckCircle2 },
    { title: '2. Cetak Formulir Resmi', desc: 'Format Standar Diknas A4', icon: Printer },
    { title: '3. Generate Universal QR', desc: 'QR ID Calon Siswa Terenkripsi', icon: QrCode },
    { title: '4. Arsip Smart Vault', desc: 'Checksum SHA-256 Terdaftar', icon: Archive },
    { title: '5. Kirim WA Selamat Datang', desc: 'Notifikasi Otomatis ke Nomor Ayah/Bunda', icon: Send }
  ];

  const suratSteps = [
    { title: '1. Auto-Draft Template', desc: 'Substitusi Variabel Nama & Tujuan', icon: FileText },
    { title: '2. Nomor Surat Otomatis', desc: 'Format: 045/TK-ASY/VIII/2026', icon: Sparkles },
    { title: '3. Export PDF Berkop Resmi', desc: 'Resolusi Siap Cetak Hi-Res', icon: Printer },
    { title: '4. Catat ke Buku Ekspedisi', desc: 'Smart Archive Vault Terverifikasi', icon: Archive }
  ];

  const currentStepsList = activeWorkflow === 'PPDB' ? ppdbSteps : suratSteps;

  const handleExecuteFullPipeline = () => {
    setIsProcessing(true);
    setCurrentStep(1);

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= currentStepsList.length) {
          clearInterval(interval);
          setIsProcessing(false);
          setCompletedWorkflows(old => [
            `${activeWorkflow === 'PPDB' ? 'PPDB Ananda Faris Al-Fatih' : 'Surat Tugas Pelatihan Guru'} — ${new Date().toLocaleTimeString('id-ID')}`,
            ...old
          ]);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Dock Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-500/30 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Zap className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  OPERATIONS AI ACTION DOCK
                </span>
                <span className="text-xs text-slate-400">Contextual 1-Click Operational Dispatch</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Admin AI Action Dock & Workflow Pipeline
              </h1>
              <p className="text-sm text-teal-100/80 mt-0.5">
                Proses berkas PPDB dan Surat Resmi sekolah dalam 1 rangkaian otomatis tanpa perlu berpindah-pindah 5 menu berbeda.
              </p>
            </div>
          </div>

          {/* Workflow Toggle */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-teal-500/30 p-1.5 rounded-xl">
            <button
              onClick={() => {
                setActiveWorkflow('PPDB');
                setCurrentStep(0);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeWorkflow === 'PPDB'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pipeline PPDB
            </button>
            <button
              onClick={() => {
                setActiveWorkflow('SURAT');
                setCurrentStep(0);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeWorkflow === 'SURAT'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pipeline Surat Resmi
            </button>
          </div>
        </div>
      </div>

      {/* Main Execution Stage */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {activeWorkflow === 'PPDB'
                ? 'Alur Otomatisasi Penerimaan Siswa Baru (PPDB Online)'
                : 'Alur Penerbitan Surat Keputusan & Surat Tugas Resmi'}
            </h3>
            <p className="text-xs text-slate-500">
              Setiap langkah terhubung dengan database, print queue, dan smart archive secara otomatis.
            </p>
          </div>

          <button
            onClick={handleExecuteFullPipeline}
            disabled={isProcessing}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition"
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-300" />}
            {isProcessing ? 'Memproses Rangkaian Pipeline...' : 'Jalankan Pipeline 1-Klik'}
          </button>
        </div>

        {/* Step Progression Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {currentStepsList.map((step, idx) => {
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx + 1 && isProcessing;

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition ${
                  isCompleted
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-700'
                    : isCurrent
                    ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-400 animate-pulse'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className={`p-2 rounded-lg ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold font-mono">
                    {isCompleted ? 'SELESAI' : isCurrent ? 'PROSES...' : 'STANDBY'}
                  </span>
                </div>

                <div className="font-bold text-xs text-slate-900 dark:text-white">{step.title}</div>
                <div className="text-[11px] text-slate-500 mt-1">{step.desc}</div>
              </div>
            );
          })}
        </div>

        {/* History of Dispatched Pipelines */}
        {completedWorkflows.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Riwayat Eksekusi Pipeline Hari Ini:
            </span>
            <ul className="space-y-1">
              {completedWorkflows.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
