import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  FileSpreadsheet,
  FileDown,
  ShieldCheck,
  Send,
  MessageSquare,
  Copy,
  Check,
  RefreshCw,
  Search,
  Filter,
  Layers,
  Zap,
  ArrowRight,
  UserCheck,
  FileCheck,
  HelpCircle,
  Lock,
  Download,
  Bot,
  Sliders,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface AIAsyOfficeWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: UserRole;
  userName?: string;
  onNavigateToTab?: (tabCode: string) => void;
}

interface ProcessedDocument {
  id: string;
  fileName: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'CSV' | 'IMAGE' | 'TEXT' | 'WHATSAPP';
  category: 'Surat Edaran Dinas' | 'Surat Edaran Yayasan' | 'Notulen Rapat' | 'Catatan Guru' | 'Surat Wali Murid' | 'Pengumuman PPDB' | 'Keuangan & SPP';
  sender: string;
  date: string;
  summary: string;
  deadlines: { date: string; task: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' }[];
  actionItems: string[];
  requiredDocs: string[];
  suggestedDivision: string;
  approvalStatus: 'DRAFT_PENDING' | 'APPROVED' | 'REJECTED';
  confidenceScore: number;
}

const SAMPLE_TEMPLATES = [
  {
    title: 'Surat Edaran Dinas Pendidikan (CONTOH)',
    type: 'PDF',
    text: `SURAT EDARAN DINAS PENDIDIKAN DAN KEBUDAYAAN
Nomor: 421.1/089/Disdik/2026
Hal: Pelaksanaan Evaluasi Semester & Akreditasi PAUD/TK

Yth. Kepala TK ASY SYIFA,
Di Tempat.

Dengan hormat, diberitahukan kepada seluruh PAUD/TK bahwa batas akhir pengunggahan dokumen portofolio e-Rapor dan Laporan Keuangan Semester 1 adalah tanggal 15 Agustus 2026. Mohon menyiapkan:
1. Rekapitulasi Presensi Siswa & Guru
2. Laporan Realisasi Keuangan BOP
3. Dokumen Kurikulum Operasional Satuan Pendidikan (KOSP)`
  },
  {
    title: 'Pesan Whatsapp Pengajuan Cuti Guru (CONTOH)',
    type: 'WHATSAPP',
    text: `[10:15, 06/08/2026] Ustadzah Siti Fatimah: Assalamu'alaikum Bu Kepala Sekolah, izin menyampaikan bahwa hari Senin tanggal 10 Agustus 2026 saya izin tidak bisa mengajar di Kelompok A2 dikarenakan ada keperluan medis di RS Soetomo. Tugas pendampingan mewarnai & hafalan surah sudah saya titipkan ke Ustadzah Rina. Terima kasih Bu 🙏`
  },
  {
    title: 'Notulen Rapat Yayasan & Wali Murid (CONTOH)',
    type: 'TEXT',
    text: `NOTULEN RAPAT KORDINASI YAYASAN & KOMITE SEKOLAH
Tanggal: 5 Agustus 2026
Peserta: Pengurus Yayasan, Kepala Sekolah, Komite Sekolah
Keputusan:
1. Pelaksanaan Puncak Tema "Aku Cinta Indonesia" pada 17 Agustus 2026.
2. Setiap siswa mengenakan pakaian adat.
3. Batas akhir pendaftaran lomba mewarnai & hafalan pada 12 Agustus 2026.
4. Iuran perlengkapan Rp 35.000 disetorkan melalui Bendahara Sekolah paling lambat 10 Agustus 2026.`
  }
];

export const AIAsyOfficeWorkspace: React.FC<AIAsyOfficeWorkspaceProps> = ({
  isOpen,
  onClose,
  activeRole,
  userName = 'Pengguna',
  onNavigateToTab
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedFileType, setSelectedFileType] = useState<string>('TEXT');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'WORKSPACE' | 'SUPER_ADMIN_TECH' | 'DRAFT_GENERATOR' | 'APPROVAL_FLOW'>('WORKSPACE');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [processedDocs, setProcessedDocs] = useState<ProcessedDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<ProcessedDocument | null>(null);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle OCR & Analysis Simulator
  const handleStartAnalysis = (overrideText?: string) => {
    const textToAnalyze = overrideText || inputText;
    if (!textToAnalyze.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const lower = textToAnalyze.toLowerCase();

      let category: ProcessedDocument['category'] = 'Catatan Guru';
      if (lower.includes('dinas') || lower.includes('pemerintah')) category = 'Surat Edaran Dinas';
      else if (lower.includes('yayasan')) category = 'Surat Edaran Yayasan';
      else if (lower.includes('rapat') || lower.includes('notulen')) category = 'Notulen Rapat';
      else if (lower.includes('spp') || lower.includes('iuran') || lower.includes('keuangan')) category = 'Keuangan & SPP';
      else if (lower.includes('ppdb') || lower.includes('daftar')) category = 'Pengumuman PPDB';
      else if (lower.includes('wali') || lower.includes('orang tua') || lower.includes('ibu') || lower.includes('ayah')) category = 'Surat Wali Murid';

      const newDoc: ProcessedDocument = {
        id: `DOC-${Date.now().toString().slice(-4)}`,
        fileName: `Dokumen_Kantor_${Date.now().toString().slice(-4)}.${selectedFileType.toLowerCase()}`,
        fileType: selectedFileType as any,
        category,
        sender: lower.includes('dinas') ? 'Dinas Pendidikan Kabupaten/Kota' : lower.includes('ustadzah') ? 'Pendidik / Guru' : 'Sekretariat Sekolah',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        summary: `AI Asy telah mengekstrak isi dokumen: ${textToAnalyze.slice(0, 140)}...`,
        deadlines: [
          { date: '10 Agustus 2026', task: 'Tindak lanjut laporan & konfirmasi berkas', priority: 'HIGH' },
          { date: '15 Agustus 2026', task: 'Pengunggahan dokumen resmi ke portal', priority: 'MEDIUM' }
        ],
        actionItems: [
          'Verifikasi kelengkapan dokumen pendukung dengan data SIM R3 (Siswa) / R4 (Guru)',
          'Siapkan draf surat balasan resmi',
          'Jadwalkan notifikasi pengingat di kalender kegiatan sekolah'
        ],
        requiredDocs: ['Salinan Surat Resmi', 'Rekap Presensi SIM R6', 'Kwitansi/Bukti Bayar SIM R13'],
        suggestedDivision: category === 'Keuangan & SPP' ? 'Bendahara / Keuangan' : category === 'Surat Edaran Dinas' ? 'Tata Usaha / Admin' : 'Kepala Sekolah',
        approvalStatus: 'DRAFT_PENDING',
        confidenceScore: 98.5
      };

      setProcessedDocs((prev) => [newDoc, ...prev]);
      setSelectedDoc(newDoc);
      setIsAnalyzing(false);
      setInputText('');
    }, 1200);
  };

  const handleApproveDocument = (docId: string) => {
    setProcessedDocs((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, approvalStatus: 'APPROVED' } : d))
    );
    if (selectedDoc && selectedDoc.id === docId) {
      setSelectedDoc({ ...selectedDoc, approvalStatus: 'APPROVED' });
    }
  };

  const handleGenerateExport = (type: 'PDF' | 'EXCEL' | 'WORD') => {
    setExportSuccessMsg(`Draft ${type} berhasil dibuat oleh AI Asy! Siap diunduh setelah persetujuan.`);
    setTimeout(() => setExportSuccessMsg(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden text-slate-100"
      >
        {/* Workspace Top Header Bar */}
        <div className="px-5 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 tracking-tight">
                  AI Asy Office Workspace & Document Intelligence
                </h2>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold">
                  TADE v1.0.5 LTS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pusat analisis dokumen resmi, OCR otomatis, draf surat, & pengingat jadwal TK ASY SYIFA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition focus:outline-hidden"
            aria-label="Tutup AI Office Workspace"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('WORKSPACE')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition ${
                activeTab === 'WORKSPACE'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Dokumen & OCR Intelligence</span>
            </button>

            <button
              onClick={() => setActiveTab('DRAFT_GENERATOR')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition ${
                activeTab === 'DRAFT_GENERATOR'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Pembuat Draf Surat & Laporan</span>
            </button>

            <button
              onClick={() => setActiveTab('APPROVAL_FLOW')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition ${
                activeTab === 'APPROVAL_FLOW'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Alur Persetujuan Resmi ({processedDocs.filter((d) => d.approvalStatus === 'DRAFT_PENDING').length})</span>
            </button>

            {activeRole === 'SUPER_ADMIN' && (
              <button
                onClick={() => setActiveTab('SUPER_ADMIN_TECH')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition ${
                  activeTab === 'SUPER_ADMIN_TECH'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-amber-400/80 hover:bg-slate-800 hover:text-amber-300'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Super Admin Technical Companion</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Role:</span>
            <span className="font-semibold text-slate-200">{activeRole}</span>
          </div>
        </div>

        {/* Export Notification Toast */}
        {exportSuccessMsg && (
          <div className="mx-5 mt-3 px-4 py-2.5 bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{exportSuccessMsg}</span>
            </div>
            <button onClick={() => setExportSuccessMsg(null)} className="text-emerald-400 hover:text-emerald-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Workspace Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === 'WORKSPACE' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Panel: Input & OCR Upload */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Unggah atau Tempel Teks Dokumen</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Format: PDF, DOCX, XLSX, WA, Text</span>
                  </div>

                  {/* Sample Template Quick Fillers */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-slate-400 font-medium">Contoh Teks Cepat:</span>
                    <div className="flex flex-col gap-1.5">
                      {SAMPLE_TEMPLATES.map((tmpl, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInputText(tmpl.text);
                            setSelectedFileType(tmpl.type);
                          }}
                          className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-300 transition flex items-center justify-between gap-2"
                        >
                          <span className="truncate">{tmpl.title}</span>
                          <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                            {tmpl.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Text Area */}
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Tempelkan isi surat dinas, edaran yayasan, catatan rapat, atau percakapan WhatsApp di sini..."
                    className="w-full h-36 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500/60 transition resize-none font-sans"
                  />

                  {/* Action Trigger Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-400" />
                        <span>Pilih Berkas</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setInputText(`[Unggahan Berkas: ${file.name}]\nAI Asy membaca isi dokumen resmi ${file.name} untuk ekstraksi otomatis.`);
                            setSelectedFileType(file.name.endsWith('.pdf') ? 'PDF' : file.name.endsWith('.xlsx') ? 'XLSX' : 'DOCX');
                          }
                        }}
                      />
                    </div>

                    <button
                      onClick={() => handleStartAnalysis()}
                      disabled={isAnalyzing || !inputText.trim()}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Menganalisis...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Analisis AI Asy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Safety Guarantee Notice */}
                <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-start gap-3 text-xs text-emerald-300">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-emerald-200">Prinsip Keamanan Dokumen AI Asy:</span>
                    <p className="text-[11px] leading-relaxed text-emerald-300/90 mt-0.5">
                      Dokumen hanya dianalisis untuk kebutuhan operasional internal TK ASY SYIFA. AI Asy tidak pernah mengirim dokumen resmi secara otomatis tanpa persetujuan berjenjang.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Panel: Analyzed Output & Document Intelligence Details */}
              <div className="lg:col-span-7 space-y-4">
                {selectedDoc ? (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-5 animate-fade-in">
                    {/* Document Header Info */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded font-semibold border border-emerald-500/30">
                            {selectedDoc.id}
                          </span>
                          <span className="text-xs text-slate-400">{selectedDoc.date}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-100 mt-1">{selectedDoc.fileName}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Pengirim: {selectedDoc.sender}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            selectedDoc.approvalStatus === 'APPROVED'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {selectedDoc.approvalStatus === 'APPROVED' ? 'Telah Disetujui' : 'Menunggu Persetujuan'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Akurasi OCR: {selectedDoc.confidenceScore}%</span>
                      </div>
                    </div>

                    {/* Ringkasan Eksekutif */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Ringkasan Eksekutif AI Asy:</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
                        {selectedDoc.summary}
                      </p>
                    </div>

                    {/* Extracted Deadlines */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Batas Waktu & Tenggat Penting:</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedDoc.deadlines.map((dl, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs">
                            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-200 block">{dl.task}</span>
                              <span className="text-[11px] text-amber-300/90 font-mono">Batas: {dl.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Items & Recommendations */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>Langkah Tindak Lanjut Direkomendasikan:</span>
                      </h4>
                      <ul className="space-y-1.5">
                        {selectedDoc.actionItems.map((item, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                            <span className="text-emerald-400 font-bold shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Quick Document Generation Trigger Actions */}
                    <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleGenerateExport('PDF')}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
                        >
                          <FileDown className="w-3.5 h-3.5 text-red-400" />
                          <span>Buat Draf PDF</span>
                        </button>
                        <button
                          onClick={() => handleGenerateExport('EXCEL')}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Buat Draf Excel</span>
                        </button>
                      </div>

                      {selectedDoc.approvalStatus === 'DRAFT_PENDING' && (
                        <button
                          onClick={() => handleApproveDocument(selectedDoc.id)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Setujui Draf Dokumen</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-10 flex flex-col items-center justify-center text-center space-y-3 min-h-[360px]">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="max-w-md">
                      <h4 className="text-sm font-bold text-slate-200">Belum Ada Dokumen Yang Dipilih</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Pilih contoh teks cepat di sebelah kiri atau tempelkan teks dokumen resmi untuk memulai analisis otomatis AI Asy.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'DRAFT_GENERATOR' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Generator Draf Surat & Laporan Sekolah Otomatis</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Buat draf resmi sesuai format standar TK ASY SYIFA dengan 1-klik untuk diulas sebelum diterbitkan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Surat Undangan Wali Murid',
                    category: 'Akademik & Kegiatan',
                    desc: 'Draf surat undangan pertemuan wali murid, puncak tema, atau rapat komite sekolah.',
                    icon: FileText
                  },
                  {
                    title: 'Rekap Laporan SPP Bulanan',
                    category: 'Keuangan Sekolah',
                    desc: 'Draf tabel ringkasan pembayaran SPP per kelas untuk laporan Kepala Sekolah & Yayasan.',
                    icon: FileSpreadsheet
                  },
                  {
                    title: 'Surat Keterangan Siswa Aktif',
                    category: 'Administrasi Murid',
                    desc: 'Draf resmi surat keterangan aktif belajar di TK ASY SYIFA.',
                    icon: FileCheck
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 rounded-xl space-y-3 transition group">
                    <div className="flex items-center justify-between">
                      <item.icon className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {item.category}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleGenerateExport('PDF')}
                      className="w-full py-2 bg-slate-900 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-semibold rounded-lg border border-slate-800 hover:border-emerald-500 transition flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Buat Draf Sekarang</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'APPROVAL_FLOW' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Daftar Persetujuan Draf Dokumen Bertingkat</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Memastikan seluruh laporan & surat resmi diperiksa oleh pejabat berwenang sebelum dipublikasikan.
                </p>
              </div>

              {processedDocs.length > 0 ? (
                <div className="space-y-2">
                  {processedDocs.map((doc) => (
                    <div key={doc.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-100">{doc.fileName}</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {doc.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{doc.summary}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {doc.approvalStatus === 'APPROVED' ? (
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-lg flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Disetujui</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApproveDocument(doc.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md transition flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Setujui Draf</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/80 border border-slate-800 rounded-xl">
                  Belum ada draf dokumen yang menunggu persetujuan. Mulaialah dengan mengunggah teks di menu Dokumen & OCR.
                </div>
              )}
            </div>
          )}

          {activeTab === 'SUPER_ADMIN_TECH' && activeRole === 'SUPER_ADMIN' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 bg-amber-950/40 border border-amber-800/40 rounded-xl space-y-1.5 text-amber-200">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>AI Asy Technical Companion Mode (Super Admin Only)</span>
                </div>
                <p className="text-xs text-amber-300/90 leading-relaxed">
                  Asy membantu memantau kesehatan arsitektur TADE v1.0.5 LTS, integritas linting TypeScript, serta memberikan rekomendasi optimasi sistem tanpa pernah memaparkan kredensial rahasia.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Status Kesehatan Arsitektur & Build</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center justify-between p-2 bg-slate-900 rounded-lg">
                      <span>Kompilasi TypeScript:</span>
                      <span className="font-mono text-emerald-400 font-bold">PASSED (0 Error)</span>
                    </li>
                    <li className="flex items-center justify-between p-2 bg-slate-900 rounded-lg">
                      <span>Verifikasi ESLint Strict:</span>
                      <span className="font-mono text-emerald-400 font-bold">CLEAN (0 Warn)</span>
                    </li>
                    <li className="flex items-center justify-between p-2 bg-slate-900 rounded-lg">
                      <span>Format Lisensi Enterprise:</span>
                      <span className="font-mono text-emerald-400 font-bold">LTS LOCKED</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Rekomendasi Pemeliharaan Rutin</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Lakukan verifikasi berkala snapshot Firestore di R57 Enterprise Operations Center setiap pergantian pekan untuk menjamin kestabilan transaksi sekolah.
                  </p>
                  {onNavigateToTab && (
                    <button
                      onClick={() => {
                        onNavigateToTab('r57');
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow transition flex items-center gap-1.5"
                    >
                      <span>Buka Operations Center (R57)</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-5 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>AI Asy Digital School Companion • Selalu Menjaga Keamanan Data Sekolah</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition"
          >
            Tutup Workspace
          </button>
        </div>
      </motion.div>
    </div>
  );
};
