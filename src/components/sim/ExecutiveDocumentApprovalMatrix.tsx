import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Sparkles,
  ArrowRight,
  Send,
  AlertCircle,
  Building
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface ApprovalItem {
  id: string;
  docTitle: string;
  docType: 'SK_PENGANGKATAN' | 'ANGGARAN_SARPRAS' | 'IJAZAH_HAFLAH' | 'KERJASAMA_DINAS';
  proposedBy: string;
  amount?: string;
  step1_AdminSIM: 'APPROVED' | 'PENDING';
  step2_KepalaSekolah: 'APPROVED' | 'PENDING';
  step3_KetuaYayasan: 'APPROVED' | 'PENDING';
  status: 'COMPLETED' | 'IN_PROGRESS';
}

export const ExecutiveDocumentApprovalMatrix: React.FC = () => {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    {
      id: 'APV-001',
      docTitle: 'Pengadaan Paket Balok Kayu & Media Sentra Peran Semester Ganjil',
      docType: 'ANGGARAN_SARPRAS',
      proposedBy: 'Koordinator Sentra (Ustadzah Siti Aminah)',
      amount: 'Rp 6.450.000',
      step1_AdminSIM: 'APPROVED',
      step2_KepalaSekolah: 'APPROVED',
      step3_KetuaYayasan: 'PENDING',
      status: 'IN_PROGRESS'
    },
    {
      id: 'APV-002',
      docTitle: 'SK Penetapan Kelulusan & Penerbitan Piagam Angkatan VIII',
      docType: 'IJAZAH_HAFLAH',
      proposedBy: 'Staf Tata Usaha PAUD',
      step1_AdminSIM: 'APPROVED',
      step2_KepalaSekolah: 'APPROVED',
      step3_KetuaYayasan: 'APPROVED',
      status: 'COMPLETED'
    },
    {
      id: 'APV-003',
      docTitle: 'MoU Kerjasama Kunjungan Sentra Bahan Alam ke Balai Pertanian',
      docType: 'KERJASAMA_DINAS',
      proposedBy: 'Wakil Kepala Sekolah Bidang Kurikulum',
      step1_AdminSIM: 'APPROVED',
      step2_KepalaSekolah: 'PENDING',
      step3_KetuaYayasan: 'PENDING',
      status: 'IN_PROGRESS'
    }
  ]);

  const handleApprove = (id: string, role: 'KEPALA_SEKOLAH' | 'KETUA_YAYASAN') => {
    setApprovals(prev => prev.map(item => {
      if (item.id === id) {
        const nextKS = role === 'KEPALA_SEKOLAH' ? 'APPROVED' : item.step2_KepalaSekolah;
        const nextKY = role === 'KETUA_YAYASAN' ? 'APPROVED' : item.step3_KetuaYayasan;
        const isComplete = item.step1_AdminSIM === 'APPROVED' && nextKS === 'APPROVED' && nextKY === 'APPROVED';
        return {
          ...item,
          step2_KepalaSekolah: nextKS,
          step3_KetuaYayasan: nextKY,
          status: isComplete ? 'COMPLETED' : 'IN_PROGRESS'
        };
      }
      return item;
    }));

    blackBoxRecorder.record({
      moduleCode: 'R431-APPROVAL-MATRIX',
      role: role,
      eventType: 'ACTION',
      details: `Executive approval granted for document ${id} by ${role}. Triple approval workflow updated.`,
      severity: 'INFO'
    });
  };

  return (
    <div id="executive-document-approval-matrix-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R431 &bull; EXECUTIVE DOCUMENT APPROVAL MATRIX
              </span>
              <span className="text-xs text-slate-400 font-mono">3-Tier Hierarchical Executive Consensus</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-emerald-400" />
              Matriks Persetujuan Berjenjang (Triple Approval)
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Alur otorisasi formal berjenjang: Validasi Teknis Admin SIM &rarr; Verifikasi Akademik Kepala Sekolah &rarr; Pengesahan Final Ketua Yayasan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> TRIPLE GOVERNANCE LOCKED
            </span>
          </div>
        </div>
      </div>

      {/* Approval Items Grid */}
      <div className="space-y-4 font-mono text-xs">
        {approvals.map((doc) => (
          <div
            key={doc.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">{doc.id}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-[9px]">
                    {doc.docType.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                  {doc.docTitle}
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full font-bold text-[10px] self-start sm:self-auto ${
                doc.status === 'COMPLETED'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
              }`}>
                {doc.status === 'COMPLETED' ? 'SELESAI (SAH)' : 'DALAM PROSES APPROVAL'}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div>Diajukan oleh: <strong className="text-slate-700 dark:text-slate-200">{doc.proposedBy}</strong></div>
              {doc.amount && <div>Nilai Anggaran: <strong className="text-emerald-600 dark:text-emerald-400">{doc.amount}</strong></div>}
            </div>

            {/* 3 Tier Stages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* Tier 1: Admin SIM */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 block">TIER 1: ADMIN SIM</span>
                <strong className="text-slate-900 dark:text-white text-xs block">Verifikasi Teknis &amp; Format</strong>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> DISETUJUI ADMIN
                </div>
              </div>

              {/* Tier 2: Kepala Sekolah */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 block">TIER 2: KEPALA SEKOLAH</span>
                <strong className="text-slate-900 dark:text-white text-xs block">Verifikasi Akademik &amp; SDM</strong>
                {doc.step2_KepalaSekolah === 'APPROVED' ? (
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> DISETUJUI KEPALA SEKOLAH
                  </div>
                ) : (
                  <button
                    onClick={() => handleApprove(doc.id, 'KEPALA_SEKOLAH')}
                    className="w-full mt-1 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center justify-center gap-1"
                  >
                    <UserCheck className="w-3 h-3" /> Setujui (Kepsek)
                  </button>
                )}
              </div>

              {/* Tier 3: Ketua Yayasan */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 block">TIER 3: KETUA YAYASAN</span>
                <strong className="text-slate-900 dark:text-white text-xs block">Otorisasi &amp; Pengesahan Akhir</strong>
                {doc.step3_KetuaYayasan === 'APPROVED' ? (
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> DISETUJUI KETUA YAYASAN
                  </div>
                ) : doc.step2_KepalaSekolah === 'APPROVED' ? (
                  <button
                    onClick={() => handleApprove(doc.id, 'KETUA_YAYASAN')}
                    className="w-full mt-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center gap-1"
                  >
                    <ShieldCheck className="w-3 h-3" /> Sahkan (Yayasan)
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 block pt-1 italic">Menunggu Kepsek</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
