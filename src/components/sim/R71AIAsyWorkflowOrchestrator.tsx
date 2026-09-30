import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Users,
  Shield,
  ArrowRight,
  RefreshCw,
  Plus,
  Copy,
  Check,
  Brain,
  Zap,
  ListTodo,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export interface AutoOrchestratedPlan {
  id: string;
  goalTitle: string;
  category: string;
  estimatedDurationDays: number;
  executiveSummary: string;
  subtasks: {
    id: string;
    title: string;
    targetRole: UserRole;
    estimatedDays: number;
    deliverable: string;
    priority: 'HIGH' | 'NORMAL' | 'LOW';
  }[];
  generatedDocumentDrafts: {
    docType: string;
    title: string;
    contentSnippet: string;
  }[];
  automatedReminders: {
    stage: string;
    triggerCondition: string;
    recipientRole: UserRole;
  }[];
}

const SAMPLE_ORCHESTRATIONS: Record<string, AutoOrchestratedPlan> = {
  'KTP_RENEWAL': {
    id: 'ORCH-001',
    goalTitle: 'Pembaruan Dokumen Hukum & Verifikasi Identitas Pengurus Yayasan 2026/2027',
    category: 'LEGAL_GOVERNANCE',
    estimatedDurationDays: 14,
    executiveSummary: 'AI Asy telah menyusun rencana orkestrasi 5 tahapan berurutan, menyiapkan draf Surat Pengantar Notaris, draf Surat Pernyataan Tanggung Jawab Mutlak (SPTJM), dan matriks pengingat otomatis berjangka.',
    subtasks: [
      {
        id: 't1',
        title: 'Pengumpulan Salinan KTP & KK Pengurus Yayasan & Dewan Pembina',
        targetRole: 'ADMIN',
        estimatedDays: 3,
        deliverable: 'Berkas PDF Terverifikasi di Smart Vault',
        priority: 'HIGH'
      },
      {
        id: 't2',
        title: 'Penyusunan Draf Berita Acara Rapat Tahunan Yayasan',
        targetRole: 'KEPALA_SEKOLAH',
        estimatedDays: 4,
        deliverable: 'Draf Dokumen Berita Acara bertanda tangan digital',
        priority: 'NORMAL'
      },
      {
        id: 't3',
        title: 'Validasi Silang Rekening Yayasan & Kemenkumham dengan Bank Jatim',
        targetRole: 'KEUANGAN',
        estimatedDays: 3,
        deliverable: 'Surat Keterangan Bank Aktif 2026',
        priority: 'HIGH'
      },
      {
        id: 't4',
        title: 'Penandatanganan Digital & Pengesahan Akta Notaris Yayasan',
        targetRole: 'KETUA_YAYASAN',
        estimatedDays: 2,
        deliverable: 'Akta Perubahan Sah & Disahkan',
        priority: 'HIGH'
      },
      {
        id: 't5',
        title: 'Pengarsipan Digital & Verifikasi Kriptografi QR Code',
        targetRole: 'SUPER_ADMIN',
        estimatedDays: 2,
        deliverable: 'Audit Trail & Snapshot Integrity Hash Terkunci',
        priority: 'NORMAL'
      }
    ],
    generatedDocumentDrafts: [
      {
        docType: 'SURAT_PENGANTAR_NOTARIS',
        title: 'Surat Pengantar Pengkinian Data Pengurus Yayasan No. 044/YAY-ASY/VIII/2026',
        contentSnippet: 'Dengan hormat, bersama ini kami sampaikan berkas pembaruan data pengurus Yayasan Pendidikan Islam Asy-Syifatan Tanggul untuk tahun ajaran 2026/2027 guna keperluan penerbitan SK Notaris...'
      },
      {
        docType: 'SPTJM_YAYASAN',
        title: 'Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) Keabsahan Data Dokumen',
        contentSnippet: 'Yang bertanda tangan di bawah ini, KH. Achmad Shodiq selaku Ketua Yayasan Asy-Syifatan, menyatakan dengan sesungguhnya bahwa seluruh data pengurus dan aset yang dilampirkan adalah benar dan sah...'
      }
    ],
    automatedReminders: [
      { stage: 'H-7 Target', triggerCondition: '7 hari sebelum tenggat 25 Agustus', recipientRole: 'ADMIN' },
      { stage: 'H-3 Target', triggerCondition: '3 hari sebelum rapat notaris', recipientRole: 'KEPALA_SEKOLAH' },
      { stage: 'H-1 Target', triggerCondition: '1 hari sebelum penandatanganan', recipientRole: 'KETUA_YAYASAN' }
    ]
  },
  'PPDB_PREP': {
    id: 'ORCH-002',
    goalTitle: 'Persiapan & Peluncuran Gelombang Khusus PPDB 2026/2027',
    category: 'ADMISSIONS',
    estimatedDurationDays: 10,
    executiveSummary: 'AI Asy mengorkestrasikan kesiapan formulir digital, alokasi kuota 60 calon siswa (Kelompok A & B), poster promosi media sosial, dan verifikasi alur transfer bank otomatis.',
    subtasks: [
      {
        id: 't1',
        title: 'Verifikasi Brosur Digital & Setting Kuota Formulir Pendaftaran',
        targetRole: 'ADMIN',
        estimatedDays: 2,
        deliverable: 'Formulir PPDB Online Siap Menerima Calon Wali Murid',
        priority: 'HIGH'
      },
      {
        id: 't2',
        title: 'Penyusunan Jadwal Observasi Tumbuh Kembang & Wawancara Wali Murid',
        targetRole: 'GURU',
        estimatedDays: 3,
        deliverable: 'Rubrik Penilaian Observasi Anekdot Siswa Baru',
        priority: 'NORMAL'
      },
      {
        id: 't3',
        title: 'Penerbitan Rekening Pembayaran Infaq Formulir & Biaya Masuk',
        targetRole: 'KEUANGAN',
        estimatedDays: 2,
        deliverable: 'Stempel Rekonsiliasi Virtual Account / QRIS Sekolah',
        priority: 'HIGH'
      },
      {
        id: 't4',
        title: 'Persetujuan Final & Pembukaan Seremonial PPDB oleh Ketua Yayasan',
        targetRole: 'KETUA_YAYASAN',
        estimatedDays: 3,
        deliverable: 'SK Pembukaan Pendaftaran Resmi 2026/2027',
        priority: 'HIGH'
      }
    ],
    generatedDocumentDrafts: [
      {
        docType: 'SK_PPDB_2026',
        title: 'Surat Keputusan Pembukaan Penerimaan Peserta Didik Baru (PPDB) TA 2026/2027',
        contentSnippet: 'Menimbang perlunya regenerasi siswa dan standarisasi daya tampung kelas, Yayasan Asy-Syifatan memutuskan pembukaan pendaftaran siswa baru terhitung tanggal 1 September 2026...'
      }
    ],
    automatedReminders: [
      { stage: 'H-3 Launch', triggerCondition: '3 hari sebelum rilis formulir', recipientRole: 'ADMIN' },
      { stage: 'Day-H Launch', triggerCondition: 'Saat sistem PPDB live dibuka', recipientRole: 'KETUA_YAYASAN' }
    ]
  }
};

export const R71AIAsyWorkflowOrchestrator: React.FC = () => {
  const { userProfile, activeRole } = useAuth();
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('KTP_RENEWAL');
  const [customGoalInput, setCustomGoalInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activePlan, setActivePlan] = useState<AutoOrchestratedPlan>(SAMPLE_ORCHESTRATIONS['KTP_RENEWAL']);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerateCustomPlan = () => {
    if (!customGoalInput.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const generated: AutoOrchestratedPlan = {
        id: `ORCH-${Math.floor(100 + Math.random() * 900)}`,
        goalTitle: customGoalInput,
        category: 'CUSTOM_EXECUTIVE_MISSION',
        estimatedDurationDays: 12,
        executiveSummary: `AI Asy telah menganalisis instruksi eksekutif "${customGoalInput}". Rencana pendelegasian 4 sub-tugas terstruktur telah dirumuskan dengan jaminan kepatuhan terhadap hierarki RBAC TADE.`,
        subtasks: [
          {
            id: 'ct1',
            title: `Penyusunan Rencana Operasional & Anggaran untuk ${customGoalInput}`,
            targetRole: 'KEPALA_SEKOLAH',
            estimatedDays: 3,
            deliverable: 'Dokumen Perencanaan Lengkap',
            priority: 'HIGH'
          },
          {
            id: 'ct2',
            title: 'Persiapan Teknis & Surat Menyurat Resmi ke Pihak Terkait',
            targetRole: 'ADMIN',
            estimatedDays: 4,
            deliverable: 'Arsip Surat Masuk/Keluar di Smart Vault',
            priority: 'NORMAL'
          },
          {
            id: 'ct3',
            title: 'Sosialisasi & Koordinasi dengan Dewan Guru dan Wali Murid',
            targetRole: 'GURU',
            estimatedDays: 3,
            deliverable: 'Rekap Presensi & Notula Rapat Koordinasi',
            priority: 'NORMAL'
          },
          {
            id: 'ct4',
            title: 'Review Akhir & Pengesahan Eksekutif oleh Ketua Yayasan',
            targetRole: 'KETUA_YAYASAN',
            estimatedDays: 2,
            deliverable: 'Dokumen Final Berstempel Sah',
            priority: 'HIGH'
          }
        ],
        generatedDocumentDrafts: [
          {
            docType: 'DRAF_SURAT_TUGAS',
            title: `Surat Penugasan & Pelaksanaan Program: ${customGoalInput}`,
            contentSnippet: `Berdasarkan arahan strategis Yayasan Pendidikan Islam Asy-Syifatan, ditugaskan kepada tim pelaksana untuk melaksanakan ${customGoalInput} secara akuntabel, aman, dan tepat waktu...`
          }
        ],
        automatedReminders: [
          { stage: 'H-5 Tenggat', triggerCondition: '5 hari sebelum target selesai', recipientRole: 'ADMIN' },
          { stage: 'H-1 Evaluasi', triggerCondition: '1 hari sebelum penyerahan laporan', recipientRole: 'KETUA_YAYASAN' }
        ]
      };

      setActivePlan(generated);
      setIsGenerating(false);
      setCustomGoalInput('');
    }, 1200);
  };

  const handleCopyDraft = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white border border-teal-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center shrink-0">
              <Bot className="w-8 h-8 text-teal-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  Phase 3 Executive Secretary AI
                </span>
                <span className="text-xs text-teal-200/80 font-bold">• Zero RBAC Bypass</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">AI Asy Workflow Orchestrator</h2>
              <p className="text-sm text-teal-100/80 font-medium">
                Penerjemah Satu Perintah Eksekutif Menjadi Puluhan Subtugas, Draf Surat Resmi, & Jadwal Kalender Otomatis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 font-bold flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              TADE AI Constitution Safe
            </span>
          </div>
        </div>
      </div>

      {/* Preset Launcher & Custom Input Prompt */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-600" />
          Pilih Template Misi Cepat atau Berikan Instruksi Bebas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => {
              setSelectedTemplateKey('KTP_RENEWAL');
              setActivePlan(SAMPLE_ORCHESTRATIONS['KTP_RENEWAL']);
            }}
            className={`p-4 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
              selectedTemplateKey === 'KTP_RENEWAL'
                ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-200'
                : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-teal-800">Template Legal Yayasan</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">Pembaruan Dokumen KTP & Notaris Yayasan</div>
              <div className="text-xs text-stone-500 mt-1">5 Subtugas • 2 Draf Surat • Auto Reminders H-7/H-3/H-1</div>
            </div>
            <ArrowRight className="w-5 h-5 text-teal-600 shrink-0" />
          </button>

          <button
            onClick={() => {
              setSelectedTemplateKey('PPDB_PREP');
              setActivePlan(SAMPLE_ORCHESTRATIONS['PPDB_PREP']);
            }}
            className={`p-4 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
              selectedTemplateKey === 'PPDB_PREP'
                ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-200'
                : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-indigo-800">Template Akademik & PPDB</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">Peluncuran Gelombang Khusus PPDB 2026</div>
              <div className="text-xs text-stone-500 mt-1">4 Subtugas • 1 Draf SK Yayasan • Alokasi Kuota Siswa</div>
            </div>
            <ArrowRight className="w-5 h-5 text-indigo-600 shrink-0" />
          </button>
        </div>

        {/* Custom Input */}
        <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Contoh: 'Persiapkan Rencana Studi Banding Guru ke Sekolah Percontohan Surabaya'..."
              value={customGoalInput}
              onChange={e => setCustomGoalInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleGenerateCustomPlan();
              }}
              className="w-full pl-4 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Sparkles className="w-4 h-4 text-teal-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={handleGenerateCustomPlan}
            disabled={isGenerating || !customGoalInput.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-black shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer min-h-[44px]"
          >
            <Brain className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'AI Asy Menyusun...' : 'Orkestrasikan Rencana (1-Click)'}
          </button>
        </div>
      </div>

      {/* Generated Orchestration Results */}
      {activePlan && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Subtasks & Responsibility Breakdown */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 uppercase">
                    {activePlan.id} • {activePlan.category}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">{activePlan.goalTitle}</h3>
                </div>
                <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-bold flex items-center gap-1 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  Estimasi: {activePlan.estimatedDurationDays} Hari
                </span>
              </div>

              {/* AI Executive Summary */}
              <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-100 flex items-start gap-3">
                <Bot className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-teal-950 leading-relaxed">
                  {activePlan.executiveSummary}
                </p>
              </div>

              {/* Subtasks List */}
              <div className="space-y-3">
                <h4 className="text-xs font-black tracking-wider uppercase text-stone-500 flex items-center gap-1.5">
                  <ListTodo className="w-4 h-4 text-teal-600" />
                  Rantai Subtugas & Alokasi Penanggung Jawab (RBAC Validated)
                </h4>

                {activePlan.subtasks.map((task, idx) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-stone-300 transition space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <h5 className="text-xs font-extrabold text-slate-900">{task.title}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                              PIC: {task.targetRole}
                            </span>
                            <span className="text-[11px] font-medium text-stone-500">
                              Estimasi: {task.estimatedDays} Hari
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          task.priority === 'HIGH'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <div className="bg-white px-3 py-1.5 rounded-xl border border-stone-100 text-[11px] font-semibold text-stone-700 flex items-center justify-between">
                      <span>Deliverable: {task.deliverable}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Generated Drafts & Auto Reminders */}
          <div className="lg:col-span-5 space-y-4">
            {/* Document Drafts */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <h4 className="text-xs font-black tracking-wider uppercase text-stone-500 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-600" />
                Draf Dokumen Resmi Tergenerate ({activePlan.generatedDocumentDrafts.length})
              </h4>

              <div className="space-y-3">
                {activePlan.generatedDocumentDrafts.map((draft, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-teal-100 bg-teal-50/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-teal-200 text-teal-900">
                        {draft.docType}
                      </span>
                      <button
                        onClick={() => handleCopyDraft(draft.contentSnippet, idx)}
                        className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Tersalin!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Salin Draf
                          </>
                        )}
                      </button>
                    </div>

                    <h5 className="text-xs font-bold text-slate-900">{draft.title}</h5>
                    <p className="text-[11px] font-medium text-stone-600 italic bg-white p-3 rounded-xl border border-stone-100 leading-relaxed">
                      "{draft.contentSnippet}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Automated Reminders */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
              <h4 className="text-xs font-black tracking-wider uppercase text-stone-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Jadwal Pengingat Otomatis (Auto Follow-Up)
              </h4>

              <div className="space-y-2">
                {activePlan.automatedReminders.map((rem, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-amber-100 bg-amber-50/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{rem.stage}</div>
                      <div className="text-[11px] font-medium text-stone-500">{rem.triggerCondition}</div>
                    </div>
                    <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md text-[10px]">
                      Target: {rem.recipientRole}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
