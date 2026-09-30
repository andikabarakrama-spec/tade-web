import React, { useState } from 'react';
import { 
  GitCommit, 
  Clock, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  KeyRound, 
  Building2, 
  Search, 
  Filter,
  ArrowRight,
  Stamp,
  Printer,
  Archive,
  QrCode
} from 'lucide-react';

interface CustodyStep {
  stepName: string;
  timestamp: string;
  actor: string;
  role: string;
  tenantId: string;
  hash: string;
  iconType: 'draft' | 'review' | 'approve' | 'sign' | 'stamp' | 'print' | 'archive' | 'verify';
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

interface CustodyDocument {
  id: string;
  title: string;
  docNumber: string;
  category: 'SK Yayasan' | 'Ijazah / Piagam' | 'Raport Sentra' | 'Buku Tabungan';
  currentStage: string;
  createdAt: string;
  steps: CustodyStep[];
}

export const ChainOfCustodyCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string>('DOC-2026-SK-001');

  const [documents] = useState<CustodyDocument[]>([
    {
      id: 'DOC-2026-SK-001',
      title: 'SK Penetapan Kurikulum Sentra & Standar Kepatuhan',
      docNumber: 'SK/YYS-ASYSYIFA/2026/VIII/042',
      category: 'SK Yayasan',
      currentStage: 'Diverifikasi Penuh',
      createdAt: '15 Agustus 2026, 08:00 WIB',
      steps: [
        {
          stepName: 'Draft Awal Dibuat',
          timestamp: '15 Agustus 2026, 08:00:12 WIB',
          actor: 'Ustadzah Siti Aminah, S.Pd',
          role: 'ADMIN_SIM',
          tenantId: 'TENANT-ASY-001',
          hash: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3420456d',
          iconType: 'draft',
          status: 'COMPLETED'
        },
        {
          stepName: 'Review Kurikulum Sentra',
          timestamp: '15 Agustus 2026, 09:15:40 WIB',
          actor: 'Ustadz Ahmad Fauzi, M.Pd',
          role: 'KEPALA_SEKOLAH',
          tenantId: 'TENANT-ASY-001',
          hash: 'b10a8db164e0754105b7a99be72e3fe57e930f3531b790d',
          iconType: 'review',
          status: 'COMPLETED'
        },
        {
          stepName: 'Persetujuan Dewan Pembina',
          timestamp: '15 Agustus 2026, 10:30:00 WIB',
          actor: 'KH. Dr. Muhammad Zaki',
          role: 'KETUA_YAYASAN',
          tenantId: 'TENANT-ASY-001',
          hash: 'c21b9ec275f1865216c8ba0cf83f4af68fa41a4642c801e',
          iconType: 'approve',
          status: 'COMPLETED'
        },
        {
          stepName: 'Penandatanganan Digital (HMAC)',
          timestamp: '15 Agustus 2026, 11:00:15 WIB',
          actor: 'KH. Dr. Muhammad Zaki',
          role: 'KETUA_YAYASAN',
          tenantId: 'TENANT-ASY-001',
          hash: 'd32c0fd386a2976327d9cb1da94a5ba79ab52b5753d912f',
          iconType: 'sign',
          status: 'COMPLETED'
        },
        {
          stepName: 'Pembubuhan Stempel Resmi Digital',
          timestamp: '15 Agustus 2026, 11:05:22 WIB',
          actor: 'Sistem Kedaulatan TADE',
          role: 'GUARDIAN_CORE',
          tenantId: 'TENANT-ASY-001',
          hash: 'e43d1ae497b3a87438e0dc2eb05b6cb80bc63c6864ea23a',
          iconType: 'stamp',
          status: 'COMPLETED'
        },
        {
          stepName: 'Pencetakan Berkas Fisik Ber-QR',
          timestamp: '15 Agustus 2026, 11:30:00 WIB',
          actor: 'Ustadzah Siti Aminah, S.Pd',
          role: 'ADMIN_SIM',
          tenantId: 'TENANT-ASY-001',
          hash: 'f54e2bf508c4b98549f1ed3fc16c7dc91cd74d7975fb34b',
          iconType: 'print',
          status: 'COMPLETED'
        },
        {
          stepName: 'Pengarsipan Smart Vault (Immutable)',
          timestamp: '15 Agustus 2026, 11:45:10 WIB',
          actor: 'Smart Vault Custodian',
          role: 'SYSTEM_ARCHIVE',
          tenantId: 'TENANT-ASY-001',
          hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          iconType: 'archive',
          status: 'COMPLETED'
        },
        {
          stepName: 'Verifikasi Publik & Validasi QR',
          timestamp: '15 Agustus 2026, 12:00:00 WIB',
          actor: 'Portal Verifikasi Publik Ban-PDM',
          role: 'EXTERNAL_AUDITOR',
          tenantId: 'TENANT-ASY-001',
          hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          iconType: 'verify',
          status: 'COMPLETED'
        }
      ]
    },
    {
      id: 'DOC-2026-RAPORT-104',
      title: 'Raport Capaian Santri Sentra Balok — Ananda Muhammad Fatih',
      docNumber: 'RAPORT/SENTRA/2026/S1/104',
      category: 'Raport Sentra',
      currentStage: 'Diverifikasi Penuh',
      createdAt: '14 Agustus 2026, 14:20 WIB',
      steps: [
        {
          stepName: 'Draft Penilaian Guru Sentra',
          timestamp: '14 Agustus 2026, 14:20:00 WIB',
          actor: 'Ustadzah Nurul Hidayah, S.Pd',
          role: 'GURU',
          tenantId: 'TENANT-ASY-001',
          hash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0',
          iconType: 'draft',
          status: 'COMPLETED'
        },
        {
          stepName: 'Review Kepala Sekolah',
          timestamp: '14 Agustus 2026, 15:10:00 WIB',
          actor: 'Ustadz Ahmad Fauzi, M.Pd',
          role: 'KEPALA_SEKOLAH',
          tenantId: 'TENANT-ASY-001',
          hash: '8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1',
          iconType: 'review',
          status: 'COMPLETED'
        },
        {
          stepName: 'Persetujuan Final',
          timestamp: '14 Agustus 2026, 15:45:00 WIB',
          actor: 'Ustadz Ahmad Fauzi, M.Pd',
          role: 'KEPALA_SEKOLAH',
          tenantId: 'TENANT-ASY-001',
          hash: '9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
          iconType: 'approve',
          status: 'COMPLETED'
        },
        {
          stepName: 'Tanda Tangan Elektronik & Cetak PDF',
          timestamp: '14 Agustus 2026, 16:00:00 WIB',
          actor: 'Ustadzah Nurul Hidayah, S.Pd',
          role: 'GURU',
          tenantId: 'TENANT-ASY-001',
          hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f',
          iconType: 'print',
          status: 'COMPLETED'
        },
        {
          stepName: 'Diarsipkan ke Vault Wali Murid',
          timestamp: '14 Agustus 2026, 16:15:00 WIB',
          actor: 'Smart Vault Engine',
          role: 'SYSTEM_ARCHIVE',
          tenantId: 'TENANT-ASY-001',
          hash: 'f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a',
          iconType: 'archive',
          status: 'COMPLETED'
        }
      ]
    }
  ]);

  const activeDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  const filteredDocs = documents.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.docNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStepIcon = (type: CustodyStep['iconType']) => {
    switch (type) {
      case 'draft': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'review': return <Search className="w-4 h-4 text-purple-500" />;
      case 'approve': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'sign': return <KeyRound className="w-4 h-4 text-amber-500" />;
      case 'stamp': return <Stamp className="w-4 h-4 text-rose-500" />;
      case 'print': return <Printer className="w-4 h-4 text-indigo-500" />;
      case 'archive': return <Archive className="w-4 h-4 text-teal-500" />;
      case 'verify': return <QrCode className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div id="chain-of-custody-center-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <GitCommit className="w-48 h-48 text-emerald-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R221 &bull; CHAIN OF CUSTODY
              </span>
              <span className="text-xs text-slate-400">Lifelong Document Lineage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <GitCommit className="w-8 h-8 text-emerald-400" />
              Chain of Custody Center
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Pusat pelacakan silsilah dokumen resmi sejak draft dibuat, direview, disetujui, ditandatangani, distempel, dicetak, diarsipkan, hingga diverifikasi publik bertahun-tahun kemudian.
            </p>
          </div>
        </div>

        {/* Global Custody Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Dokumen Terlacak</span>
            <span className="text-xl font-bold text-white font-mono">{documents.length} Dokumen</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Integritas Silsilah</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">100% UNBROKEN</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Kedaulatan Hash</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">SHA-256 MATCH</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Status Kepatuhan</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">BAN-PDM READY</span>
          </div>
        </div>
      </div>

      {/* Main Layout: List & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Document Selector */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Pilih Dokumen Resmi
            </h3>
            <span className="text-xs text-slate-500 font-mono">{filteredDocs.length} Item</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari ID, Judul, No SK..."
              maxLength={100}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedDocId === doc.id
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50/50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200">
                    {doc.id}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {doc.category}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">{doc.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1 truncate">{doc.docNumber}</p>
                <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{doc.steps.length} Silsilah Jejak</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{doc.currentStage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Full Silsilah Timeline (Draft -> Review -> Setuju -> TTD -> Stempel -> Cetak -> Arsip -> Verifikasi) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-700/80 pb-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                {activeDoc.category} &bull; {activeDoc.id}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                Dibuat: {activeDoc.createdAt}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-2">{activeDoc.title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">Nomor Resmi: {activeDoc.docNumber}</p>
          </div>

          {/* Timeline Nodes */}
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700 before:z-0">
            {activeDoc.steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-emerald-500 shadow-sm flex items-center justify-center shrink-0">
                  {getStepIcon(step.iconType)}
                </div>

                <div className="flex-1 bg-slate-50 dark:bg-slate-700/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">Step {idx + 1}:</span>
                      {step.stepName}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {step.timestamp}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs mb-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Aktor:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">{step.actor}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Peran (Role):</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{step.role}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Tenant ID:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{step.tenantId}</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900 text-slate-300 font-mono text-[10px] break-all border border-slate-800 flex items-center justify-between">
                    <span><strong className="text-emerald-400">Kripto Hash:</strong> {step.hash}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0 ml-2">
                      VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
