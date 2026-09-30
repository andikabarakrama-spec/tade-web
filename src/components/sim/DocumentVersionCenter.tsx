import React, { useState } from 'react';
import { 
  History, 
  Layers, 
  CheckCircle2, 
  FileText, 
  GitBranch, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Search, 
  KeyRound,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

interface DocumentVersion {
  version: string;
  releaseDate: string;
  author: string;
  role: string;
  changeSummary: string;
  sha256: string;
  status: 'SUPERSEDED' | 'ACTIVE_LATEST';
  verificationStatus: 'VALID' | 'REVOKED';
}

interface VersionedDocumentGroup {
  docId: string;
  title: string;
  category: string;
  activeVersion: string;
  versions: DocumentVersion[];
}

export const DocumentVersionCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string>('DOC-SK-KURIKULUM-2026');

  const [documentGroups] = useState<VersionedDocumentGroup[]>([
    {
      docId: 'DOC-SK-KURIKULUM-2026',
      title: 'SK Standar Operasional Prosedur Sentra & Kepatuhan Gizi Santri',
      category: 'SK Yayasan & Sekolah',
      activeVersion: 'v3.0',
      versions: [
        {
          version: 'v1.0',
          releaseDate: '10 Juli 2026, 08:30 WIB',
          author: 'Ustadzah Siti Aminah, S.Pd',
          role: 'ADMIN_SIM',
          changeSummary: 'Penerbitan draft awal modul sentra balok & sains awal semester.',
          sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
          status: 'SUPERSEDED',
          verificationStatus: 'VALID'
        },
        {
          version: 'v2.0',
          releaseDate: '25 Juli 2026, 14:00 WIB',
          author: 'Ustadz Ahmad Fauzi, M.Pd',
          role: 'KEPALA_SEKOLAH',
          changeSummary: 'Penyesuaian indikator capaian motorik halus sentra bahan alam sesuai standar Ban-PDM.',
          sha256: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
          status: 'SUPERSEDED',
          verificationStatus: 'VALID'
        },
        {
          version: 'v3.0',
          releaseDate: '15 Agustus 2026, 10:15 WIB',
          author: 'KH. Dr. Muhammad Zaki',
          role: 'KETUA_YAYASAN',
          changeSummary: 'Integrasi modul kemandirian santri & sertifikasi halal katering yayasan (FINAL).',
          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          status: 'ACTIVE_LATEST',
          verificationStatus: 'VALID'
        }
      ]
    },
    {
      docId: 'DOC-RPT-FATIMAH-2026',
      title: 'Raport Portofolio Semester Ganjil — Fatimah Az-Zahra',
      category: 'Raport Santra',
      activeVersion: 'v2.0',
      versions: [
        {
          version: 'v1.0',
          releaseDate: '12 Agustus 2026, 11:00 WIB',
          author: 'Ustadzah Nurul Hidayah, S.Pd',
          role: 'GURU_SENTRA',
          changeSummary: 'Draft evaluasi capaian hafalan Surat Pendek juz 30.',
          sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
          status: 'SUPERSEDED',
          verificationStatus: 'VALID'
        },
        {
          version: 'v2.0',
          releaseDate: '14 Agustus 2026, 16:30 WIB',
          author: 'Ustadz Ahmad Fauzi, M.Pd',
          role: 'KEPALA_SEKOLAH',
          changeSummary: 'Penambahan foto kegiatan sentra persiapan & tanda tangan kepala sekolah.',
          sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
          status: 'ACTIVE_LATEST',
          verificationStatus: 'VALID'
        }
      ]
    }
  ]);

  const activeGroup = documentGroups.find(g => g.docId === selectedDocId) || documentGroups[0];

  const filteredGroups = documentGroups.filter(g =>
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.docId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="document-version-center-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <GitBranch className="w-48 h-48 text-cyan-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R223 &bull; VERSION VAULT
              </span>
              <span className="text-xs text-slate-400">Non-Destructive Revision Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <GitBranch className="w-8 h-8 text-cyan-400" />
              Document Version Center
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Aturan Kedaulatan: <strong>Dokumen lama TIDAK BOLEH DITIMPA (*Zero Overwrite*)</strong>. Setiap revisi menerbitkan iterasi bertingkat (v1, v2, v3) dengan semua versi tetap dapat diverifikasi kriptografis.
            </p>
          </div>
        </div>

        {/* Global Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Total Grup Dokumen</span>
            <span className="text-xl font-bold text-white font-mono">{documentGroups.length} Dokumen</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Aturan Timpa Dokumen</span>
            <span className="text-xl font-bold text-rose-400 font-mono">DILARANG (0 OVERWRITE)</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Keterverifikasian v1/v2/v3</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">100% VALID</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Standar Kepatuhan</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">ISO 15489 &bull; REVISION</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Group Selector */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-600" />
              Daftar Riwayat Versi
            </h3>
            <span className="text-xs text-slate-500 font-mono">{filteredGroups.length} Dokumen</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari ID, Judul, Kategori..."
              maxLength={100}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="space-y-2">
            {filteredGroups.map((group) => (
              <div
                key={group.docId}
                onClick={() => setSelectedDocId(group.docId)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedDocId === group.docId
                    ? 'bg-cyan-50/70 dark:bg-cyan-950/40 border-cyan-500 ring-2 ring-cyan-500/20'
                    : 'bg-slate-50/50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200">
                    {group.docId}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300">
                    Aktif: {group.activeVersion}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">{group.title}</h4>
                <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{group.category}</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">{group.versions.length} Iterasi Versi</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Version Iteration Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">{activeGroup.docId}</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{activeGroup.title}</h2>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                {activeGroup.versions.length} Versi Tersedia
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {activeGroup.versions.map((ver, idx) => (
                <div 
                  key={ver.version}
                  className={`p-4 rounded-xl border transition-all ${
                    ver.status === 'ACTIVE_LATEST'
                      ? 'bg-cyan-50/40 dark:bg-cyan-950/20 border-cyan-400 ring-1 ring-cyan-400/30'
                      : 'bg-slate-50/60 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg ${
                        ver.status === 'ACTIVE_LATEST'
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                      }`}>
                        Versi {ver.version}
                      </span>
                      {ver.status === 'ACTIVE_LATEST' ? (
                        <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          VERSI SAH TERBARU
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          (Versi Sebelumnya &bull; Tetap Sah Terverifikasi)
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {ver.releaseDate}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-200 mb-3 font-medium">
                    {ver.changeSummary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Penerbit Revisi:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{ver.author}</span>
                      <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 block">{ver.role}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Kondisi Kripto:</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {ver.verificationStatus}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
                        IMMUTABLE
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900 text-slate-300 font-mono text-[10px] break-all border border-slate-800">
                    <strong className="text-cyan-400">SHA-256 Checksum:</strong> {ver.sha256}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
