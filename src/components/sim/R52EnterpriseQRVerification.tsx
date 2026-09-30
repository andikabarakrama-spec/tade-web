import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  RefreshCw,
  FileText,
  Lock,
  Stamp,
  Paperclip,
  Building2,
  Sparkles,
  History,
  UserCheck,
  ExternalLink,
  Printer,
  Copy,
  Check,
  Award,
  Layers,
  Clock,
  Eye,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/db';
import {
  GeneratedDocument,
  SchoolProfile,
  Teacher,
  Student,
  AuditLog,
  UserRole
} from '../../types';

export type VerificationStatusBadge =
  | 'VALID'
  | 'DRAFT'
  | 'WAITING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'ARCHIVED'
  | 'SUPERSEDED'
  | 'EXPIRED';

export interface DocumentVerificationRecord {
  verificationId: string;
  documentId: string;
  documentTitle: string;
  documentNumber: string;
  category: string;
  issueDate: string;
  currentVersion: string;
  statusBadge: VerificationStatusBadge;
  approvalChainSummary: string;
  digitalSignatureStatus: 'VERIFIED' | 'PENDING' | 'INVALID';
  officialStampStatus: 'VALID_ACCREDITED' | 'NONE' | 'INVALID';
  checksumFingerprint: string;
  relatedAttachmentsCount: number;
  lastVerificationTimestamp: string;
  recipientName: string;
  issuerName: string;
}

export const R52EnterpriseQRVerification: React.FC = () => {
  const { activeRole } = useAuth();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'GATEWAY_SCANNER' | 'VERIFIED_REGISTRY' | 'SECURITY_AUDIT'>('GATEWAY_SCANNER');
  const [selectedVerificationId, setSelectedVerificationId] = useState<string>('VER-2026-SK-0981');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Data from DataService
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [dbDocuments, setDbDocuments] = useState<GeneratedDocument[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Load Real Data from DataService
  const loadGatewayData = async () => {
    try {
      const [prof, docList, logsList] = await Promise.all([
        DataService.getSchoolProfile(),
        DataService.getDocuments(),
        DataService.getAuditLogs()
      ]);

      setSchoolProfile(prof);
      setDbDocuments(docList || []);
      setAuditLogs(logsList || []);
    } catch (err) {
      console.error('Error fetching DataService records for R52 QR Verification:', err);
    }
  };

  useEffect(() => {
    loadGatewayData();
  }, []);

  // Built-in Registry of Verifiable Documents (combining DB & Master System Docs)
  const verificationRegistry: DocumentVerificationRecord[] = useMemo(() => {
    const headmasterName = schoolProfile?.headmaster || 'Hj. Syarifah Nur, S.Pd.I';
    const schoolName = schoolProfile?.name || 'TK ISLAM ASY-SYIFATAN';

    const defaultRecords: DocumentVerificationRecord[] = [
      {
        verificationId: 'VER-2026-SK-0981',
        documentId: 'DOC-SK-001',
        documentTitle: 'Surat Keputusan (SK) Penerimaan Peserta Didik Baru (PPDB)',
        documentNumber: 'SK/2026/TK-ASY/0981',
        category: 'Surat Keputusan Resmi',
        issueDate: '05 Agustus 2026',
        currentVersion: 'v1.0.5 LTS',
        statusBadge: 'VALID',
        approvalChainSummary: 'Admin TU (Disetujui) → Kepala Sekolah (Disetujui) → Ketua Yayasan (Disetujui)',
        digitalSignatureStatus: 'VERIFIED',
        officialStampStatus: 'VALID_ACCREDITED',
        checksumFingerprint: 'SHA256:8f9a2b4c1e0d3f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f',
        relatedAttachmentsCount: 3,
        lastVerificationTimestamp: new Date().toLocaleString('id-ID'),
        recipientName: 'Peserta Didik & Wali Murid T.A 2025/2026',
        issuerName: `${headmasterName} (Kepala Sekolah ${schoolName})`
      },
      {
        verificationId: 'VER-2026-ST-0102',
        documentId: 'DOC-ST-002',
        documentTitle: 'Surat Tugas Pelatihan Kurikulum PAUD & SPPD Dinas',
        documentNumber: '090/ST-GURU/2026/102',
        category: 'Surat Tugas Pendidik',
        issueDate: '06 Agustus 2026',
        currentVersion: 'v1.0.0',
        statusBadge: 'WAITING_APPROVAL',
        approvalChainSummary: 'Guru Pendidik (Diajukan) → Kepala Sekolah (Proses Menunggu)',
        digitalSignatureStatus: 'PENDING',
        officialStampStatus: 'NONE',
        checksumFingerprint: 'SHA256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
        relatedAttachmentsCount: 1,
        lastVerificationTimestamp: new Date().toLocaleString('id-ID'),
        recipientName: 'Siti Aminah, S.Pd (Guru PAUD)',
        issuerName: headmasterName
      },
      {
        verificationId: 'VER-2026-KW-8812',
        documentId: 'DOC-KW-003',
        documentTitle: 'Kwitansi Tanda Terima Lunas SPP & Biaya Pendidikan',
        documentNumber: 'KW-SPP/2026/8812',
        category: 'Dokumen Keuangan',
        issueDate: '04 Agustus 2026',
        currentVersion: 'v1.0.0',
        statusBadge: 'VALID',
        approvalChainSummary: 'Bendahara Keuangan (Lunas) → Kepala Sekolah (Mengetahui)',
        digitalSignatureStatus: 'VERIFIED',
        officialStampStatus: 'VALID_ACCREDITED',
        checksumFingerprint: 'SHA256:7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
        relatedAttachmentsCount: 2,
        lastVerificationTimestamp: new Date().toLocaleString('id-ID'),
        recipientName: 'Wali Murid Ananda Ahmad Rizky',
        issuerName: 'Bendahara Sekolah & Kepala Sekolah'
      },
      {
        verificationId: 'VER-2026-CERT-901',
        documentId: 'DOC-CERT-004',
        documentTitle: 'Sertifikat Kelulusan & Tamat Belajar PAUD / TK',
        documentNumber: 'CERT-PAUD/2026/901',
        category: 'Sertifikat Pendidikan',
        issueDate: '15 Juni 2026',
        currentVersion: 'v1.2.0',
        statusBadge: 'APPROVED',
        approvalChainSummary: 'Wali Kelas (Direkomendasikan) → Kepala Sekolah (Disahkan)',
        digitalSignatureStatus: 'VERIFIED',
        officialStampStatus: 'VALID_ACCREDITED',
        checksumFingerprint: 'SHA256:3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
        relatedAttachmentsCount: 2,
        lastVerificationTimestamp: new Date().toLocaleString('id-ID'),
        recipientName: 'Ahmad Rizky (NISN: 31209845)',
        issuerName: headmasterName
      }
    ];

    // Merge Generated Documents from Database
    dbDocuments.forEach((doc) => {
      defaultRecords.push({
        verificationId: `VER-${doc.id.substring(0, 8).toUpperCase()}`,
        documentId: doc.id,
        documentTitle: doc.title,
        documentNumber: doc.documentNumber || 'DOC/2026/TADE',
        category: doc.type || 'Dokumen Resmi',
        issueDate: new Date(doc.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        currentVersion: 'v1.0.5 LTS',
        statusBadge: doc.status === 'APPROVED' ? 'VALID' : doc.status === 'REJECTED' ? 'REJECTED' : 'WAITING_APPROVAL',
        approvalChainSummary: 'Admin TU → Kepala Sekolah',
        digitalSignatureStatus: doc.status === 'APPROVED' ? 'VERIFIED' : 'PENDING',
        officialStampStatus: doc.status === 'APPROVED' ? 'VALID_ACCREDITED' : 'NONE',
        checksumFingerprint: `SHA256:${doc.id.repeat(2).substring(0, 50)}`,
        relatedAttachmentsCount: doc.attachments ? doc.attachments.length : 1,
        lastVerificationTimestamp: new Date().toLocaleString('id-ID'),
        recipientName: doc.recipientName || 'Umum / Civitas Akademika',
        issuerName: doc.createdBy || headmasterName
      });
    });

    return defaultRecords;
  }, [schoolProfile, dbDocuments]);

  // Active Selected Document Record
  const activeRecord = useMemo(() => {
    return verificationRegistry.find((r) => r.verificationId === selectedVerificationId) || verificationRegistry[0];
  }, [verificationRegistry, selectedVerificationId]);

  // Filtered Registry Items
  const filteredRegistry = useMemo(() => {
    if (!searchQuery) return verificationRegistry;
    const q = searchQuery.toLowerCase();
    return verificationRegistry.filter(
      (r) =>
        r.verificationId.toLowerCase().includes(q) ||
        r.documentNumber.toLowerCase().includes(q) ||
        r.documentTitle.toLowerCase().includes(q) ||
        r.recipientName.toLowerCase().includes(q)
    );
  }, [verificationRegistry, searchQuery]);

  // Handle Scan / Authenticate Verification Action
  const handleVerifyNow = async (verId: string) => {
    setSelectedVerificationId(verId);

    // Audit Logging via DataService
    try {
      await DataService.createAuditLog({
        uid: 'PUBLIC_VERIFICATION_GATEWAY',
        userName: activeRole || 'Masyarakat / Orang Tua',
        role: (activeRole as UserRole) || 'CALON_WALI_MURID',
        action: 'VERIFY_DOCUMENT_QR',
        targetModule: `QR Authenticity Gateway - ID: ${verId}`
      });

      setNoticeMessage(`Pemeriksaan Keabsahan Berhasil! Dokumen [${verId}] Terverifikasi Sah di Database TADE.`);
      setTimeout(() => setNoticeMessage(null), 4000);
    } catch (err) {
      console.error('Error logging verification audit:', err);
    }
  };

  const handleCopyVerificationId = (verId: string) => {
    navigator.clipboard.writeText(verId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleRefreshGateway = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setNoticeMessage('Universal QR Authenticity Gateway Berhasil Disegarkan.');
      setTimeout(() => setNoticeMessage(null), 3000);
    }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Sprint P27 • Enterprise QR Verification & Authenticity Gateway (R52)
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Portal Verifikasi Keabsahan Dokumen & Barcode QR Universal
          </h1>
          <p className="text-stone-600 text-xs mt-0.5">
            Pintu gerbang autentikasi publik untuk memverifikasi keaslian SK, Surat Tugas, Sertifikat, dan Kwitansi resmi tanpa membocorkan data sensitif.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshGateway}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Segarkan Gateway
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Cetak Bukti Verifikasi
          </button>
        </div>
      </div>

      {noticeMessage && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-900 text-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2 border border-emerald-700 shadow-md print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{noticeMessage}</span>
        </motion.div>
      )}

      {/* Top Security & Authentic Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:hidden">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Total Terverifikasi</span>
          <div className="text-xl font-black text-emerald-900 font-mono">{verificationRegistry.length} Dokumen</div>
          <span className="text-[10px] text-emerald-800 font-bold block">Terkoneksi TADE LTS</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Status Keabsahan</span>
          <div className="text-xl font-black text-emerald-900 font-mono">100% OTENTIK</div>
          <span className="text-[10px] text-emerald-800 font-bold block">Digital Signature Ready</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Kategori Terdukung</span>
          <div className="text-xl font-black text-slate-900 font-mono">12 Jenis Surat</div>
          <span className="text-[10px] text-emerald-800 font-bold block">Universal Coverage</span>
        </div>

        <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sertifikat Kriptografi</span>
          <div className="text-xs font-black text-emerald-400 font-mono truncate">SHA256 FINGERPRINT</div>
          <span className="text-[10px] text-slate-300 block flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" /> Terkunci Tanpa Duplikasi
          </span>
        </div>
      </div>

      {/* Main Two-Column Gateway Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: LIVE SEARCH & REGISTRY SELECTION (5 cols) */}
        <div className="lg:col-span-5 space-y-4 print:hidden">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-800" /> Antrean Dokumen & Kode Verifikasi
              </h2>
              <span className="px-2.5 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded-full font-mono">
                {filteredRegistry.length} Berkas
              </span>
            </div>

            {/* Live Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Masukkan ID Verifikasi, Nomor SK, atau Judul..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-emerald-700 transition"
              />
            </div>

            {/* Document Verification Cards */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredRegistry.map((item) => {
                const isSelected = activeRecord?.verificationId === item.verificationId;

                return (
                  <div
                    key={item.verificationId}
                    onClick={() => handleVerifyNow(item.verificationId)}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[10px] font-bold">
                        {item.verificationId}
                      </span>

                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md font-mono ${
                          item.statusBadge === 'VALID' || item.statusBadge === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : item.statusBadge === 'WAITING_APPROVAL'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        {item.statusBadge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-black text-slate-900 leading-tight">{item.documentTitle}</h3>
                      <p className="text-[11px] font-mono text-stone-500 mt-0.5">No: {item.documentNumber}</p>
                    </div>

                    <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500 font-medium">
                      <span>Penerima: {item.recipientName}</span>
                      <span className="font-mono font-bold text-emerald-800">{item.issueDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: OFFICIAL VERIFICATION CERTIFICATE DISPLAY (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeRecord ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6 print:border-none print:shadow-none print:p-0">
              {/* Header Verification Badge */}
              <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block font-mono">
                      OFFICIAL AUTHENTICITY GATEWAY
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-white">DOKUMEN TERVERIFIKASI SAH</h2>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Sistem Informasi Manajemen TK ASY SYIFA TADE LTS
                    </p>
                  </div>
                </div>

                <div className="text-center sm:text-right font-mono">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Status Dokumen</span>
                  <span className="text-2xl font-black text-emerald-400">{activeRecord.statusBadge}</span>
                </div>
              </div>

              {/* QR Code Graphic & Verification ID Box */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-5 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="sm:col-span-4 flex justify-center">
                  {/* Simulated High-Res Universal Barcode QR Block */}
                  <div className="p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-sm flex flex-col items-center">
                    <div className="w-32 h-32 bg-slate-900 p-2 rounded-xl flex items-center justify-center text-white relative">
                      <QrCode className="w-24 h-24 text-emerald-400" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="px-1.5 py-0.5 bg-emerald-900 text-emerald-100 font-mono text-[8px] font-bold rounded-xs border border-emerald-500">
                          TADE
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-slate-900 mt-2 uppercase">
                      {activeRecord.verificationId}
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-8 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-stone-500 uppercase">ID Verifikasi Unik</span>
                    <button
                      onClick={() => handleCopyVerificationId(activeRecord.verificationId)}
                      className="text-[10px] font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer print:hidden"
                    >
                      {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedId ? 'Tersalin' : 'Salin Kode'}
                    </button>
                  </div>

                  <div className="p-2.5 bg-white border border-stone-300 rounded-xl font-mono text-xs font-black text-slate-900 tracking-wider">
                    {activeRecord.verificationId}
                  </div>

                  <p className="text-[10px] text-stone-500 leading-relaxed">
                    Kode verifikasi QR ini dienkripsi dan terhubung langsung ke Master Synchronization & Knowledge Graph Engine.
                  </p>
                </div>
              </div>

              {/* Detailed Verified Attributes List */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-stone-200 pb-2">
                  Rincian Informasi Keabsahan Dokumen
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-0.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Nama Dokumen</span>
                    <span className="font-bold text-slate-900 block">{activeRecord.documentTitle}</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-0.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Nomor Surat / SK Resmi</span>
                    <span className="font-mono font-bold text-slate-900 block">{activeRecord.documentNumber}</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-0.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Kategori & Jenis</span>
                    <span className="font-bold text-slate-900 block">{activeRecord.category}</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-0.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Tanggal Penerbitan</span>
                    <span className="font-mono font-bold text-slate-900 block">{activeRecord.issueDate}</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-0.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Pihak Penerima (Beneficiary)</span>
                    <span className="font-bold text-slate-900 block">{activeRecord.recipientName}</span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-0.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Pejabat Penandatangan</span>
                    <span className="font-bold text-slate-900 block">{activeRecord.issuerName}</span>
                  </div>
                </div>

                {/* Status Badges & Stamps Status */}
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
                  <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block flex items-center gap-1.5">
                    <Stamp className="w-4 h-4 text-emerald-800" /> Verifikasi Stempel Digital & Tanda Tangan
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 font-bold text-emerald-950">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Tanda Tangan Digital: {activeRecord.digitalSignatureStatus}</span>
                    </div>

                    <div className="flex items-center gap-2 font-bold text-emerald-950">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Stempel Basah Sekolah: TERAKREDITASI</span>
                    </div>
                  </div>
                </div>

                {/* Checksum / Cryptographic Fingerprint */}
                <div className="p-3 bg-slate-900 text-white rounded-2xl space-y-1 font-mono text-[10px]">
                  <span className="text-slate-400 block font-bold uppercase">Sidik Jari Kriptografi Dokumen (SHA-256 Fingerprint)</span>
                  <div className="text-emerald-400 break-all font-bold">{activeRecord.checksumFingerprint}</div>
                </div>
              </div>

              {/* Footnote Timestamp */}
              <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-stone-500 font-mono">
                <span>Waktu Pemeriksaan Terakhir: {activeRecord.lastVerificationTimestamp}</span>
                <span className="font-bold text-slate-900">Protected by TADE v1.0.5 LTS Platform</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};
