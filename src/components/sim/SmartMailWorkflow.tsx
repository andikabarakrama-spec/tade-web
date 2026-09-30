import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  UserCheck,
  Send,
  Archive,
  Hash,
  PenTool
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface WorkflowStep {
  stepNumber: number;
  name: string;
  actor: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  description: string;
}

export const SmartMailWorkflow: React.FC = () => {
  const [currentActiveStep, setCurrentActiveStep] = useState<number>(4);

  const steps: WorkflowStep[] = [
    { stepNumber: 1, name: 'Penyusunan Draft', actor: 'Staf Tata Usaha', status: 'COMPLETED', description: 'Input naskah konsep surat menggunakan template resmi baku' },
    { stepNumber: 2, name: 'Review Kelayakan', actor: 'Wakil Kepala Sekolah', status: 'COMPLETED', description: 'Pemeriksaan substansi isi dan tata bahasa naskah' },
    { stepNumber: 3, name: 'Paraf Hirarki', actor: 'Koordinator Tata Usaha', status: 'COMPLETED', description: 'Pembubuhan paraf digital persetujuan redaksi' },
    { stepNumber: 4, name: 'Persetujuan (Approval)', actor: 'Kepala Sekolah', status: 'IN_PROGRESS', description: 'Verifikasi akhir kewenangan penerbitan surat dinas' },
    { stepNumber: 5, name: 'Penomoran Otomatis', actor: 'Government Engine', status: 'PENDING', description: 'Alokasi nomor urut dinas bebas tubrukan (Zero Collision)' },
    { stepNumber: 6, name: 'Tanda Tangan & Stempel', actor: 'Kepala Sekolah / Yayasan', status: 'PENDING', description: 'Pemberian spesimen digital dan cap stempel resmi' },
    { stepNumber: 7, name: 'Pengarsipan Permanen', actor: 'WORM Archive Vault', status: 'PENDING', description: 'Penyimpanan bukti digital dengan SHA-256' },
    { stepNumber: 8, name: 'Distribusi & Ekspedisi', actor: 'Sistem Ekspedisi SIM', status: 'PENDING', description: 'Pengiriman surat fisik / PDF terenkripsi ke pihak tujuan' }
  ];

  const handleAdvanceStep = () => {
    if (currentActiveStep < 8) {
      setCurrentActiveStep(prev => prev + 1);
      blackBoxRecorder.record({
        moduleCode: 'R422-MAIL-WORKFLOW',
        role: 'KEPALA_SEKOLAH',
        eventType: 'ACTION',
        details: `Smart Mail Workflow advanced to step ${currentActiveStep + 1} (${steps[currentActiveStep].name}).`,
        severity: 'INFO'
      });
    }
  };

  return (
    <div id="smart-mail-workflow-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R422 &bull; SMART MAIL WORKFLOW
              </span>
              <span className="text-xs text-slate-400 font-mono">Government-Grade 8-Stage Document Routing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400" />
              Alur Surat Dinas Berstandar Pemerintahan (8 Tahapan)
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Alur berjenjang: Draft &rarr; Review &rarr; Paraf &rarr; Persetujuan &rarr; Penomoran &rarr; Tanda Tangan &rarr; Arsip &rarr; Distribusi lengkap dengan jejak audit trail.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAdvanceStep}
              disabled={currentActiveStep >= 8}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono shadow-md flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              {currentActiveStep >= 8 ? 'Workflow Selesai' : 'Lanjutkan Tahap Berikutnya'}
            </button>
          </div>
        </div>
      </div>

      {/* 8-Stage Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        {steps.map((st) => {
          const isDone = st.stepNumber < currentActiveStep;
          const isCurrent = st.stepNumber === currentActiveStep;
          return (
            <div
              key={st.stepNumber}
              className={`p-5 rounded-3xl border shadow-sm space-y-2.5 transition-all ${
                isCurrent
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500/50 ring-2 ring-blue-500/20'
                  : isDone
                  ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <span className="text-[10px] text-slate-400">TAHAP {st.stepNumber}</span>
                <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                  isDone ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                  isCurrent ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                }`}>
                  {isDone ? 'SELESAI' : isCurrent ? 'SEDANG PROSES' : 'MENUNGGU'}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-xs">
                {st.name}
              </h3>

              <div className="text-[11px] text-slate-600 dark:text-slate-300">
                <span className="text-[10px] text-slate-400 block">Pelaksana:</span>
                <strong>{st.actor}</strong>
              </div>

              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                {st.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
