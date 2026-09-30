import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  Search, 
  QrCode, 
  KeyRound, 
  FileCheck, 
  UserCheck, 
  Layers, 
  ShieldCheck,
  Eye,
  Copy,
  Check
} from 'lucide-react';

interface EvidenceEntry {
  documentId: string;
  version: string;
  title: string;
  category: 'SK Yayasan' | 'Ijazah Digital' | 'Raport Sentra' | 'Buku Tabungan Santri';
  sha256: string;
  qrPayload: string;
  signer: string;
  reviewer: string;
  creator: string;
  timestamp: string;
  tenantId: string;
  isImmutable: boolean;
}

export const LegalEvidenceLedger: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<EvidenceEntry | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [ledgerEntries] = useState<EvidenceEntry[]>([
    {
      documentId: 'EV-2026-SK-YYS-001',
      version: 'v1.0 (FINAL)',
      title: 'SK Penetapan Struktur Guru & Kurikulum Sentra 2026/2027',
      category: 'SK Yayasan',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      qrPayload: 'https://final7.sim.sch.id/verify?doc=EV-2026-SK-YYS-001&hash=e3b0c442',
      signer: 'KH. Dr. Muhammad Zaki (Ketua Yayasan)',
      reviewer: 'Ustadz Ahmad Fauzi, M.Pd (Kepala Sekolah)',
      creator: 'Ustadzah Siti Aminah, S.Pd (Admin SIM)',
      timestamp: '15 Agustus 2026, 11:00:15 WIB',
      tenantId: 'TENANT-ASY-001',
      isImmutable: true
    },
    {
      documentId: 'EV-2026-IJZ-SAN-088',
      version: 'v1.0 (FINAL)',
      title: 'Ijazah Digital & Surat Tanda Tamat Belajar (STTB) — Fatimah Az-Zahra',
      category: 'Ijazah Digital',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      qrPayload: 'https://final7.sim.sch.id/verify?doc=EV-2026-IJZ-SAN-088&hash=9f86d081',
      signer: 'Ustadz Ahmad Fauzi, M.Pd (Kepala Sekolah)',
      reviewer: 'Ustadzah Siti Maryam, S.Pd (Waka Kurikulum)',
      creator: 'Ustadz Ridwan Kamil (Tata Usaha)',
      timestamp: '10 Juli 2026, 10:15:22 WIB',
      tenantId: 'TENANT-ASY-001',
      isImmutable: true
    },
    {
      documentId: 'EV-2026-RPT-SNT-104',
      version: 'v1.2 (VERIFIED)',
      title: 'Raport Sentra Bahan Alam & Sains — Ananda Muhammad Fatih',
      category: 'Raport Sentra',
      sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      qrPayload: 'https://final7.sim.sch.id/verify?doc=EV-2026-RPT-SNT-104&hash=5e884898',
      signer: 'Ustadzah Nurul Hidayah, S.Pd (Guru Sentra)',
      reviewer: 'Ustadz Ahmad Fauzi, M.Pd (Kepala Sekolah)',
      creator: 'Ustadzah Nurul Hidayah, S.Pd (Guru Sentra)',
      timestamp: '14 Agustus 2026, 16:00:00 WIB',
      tenantId: 'TENANT-ASY-001',
      isImmutable: true
    },
    {
      documentId: 'EV-2026-TBG-SAN-042',
      version: 'v1.0 (FINAL)',
      title: 'Buku Rekening Tabungan Santri & Rekonsiliasi SPP — Ahmad Dahlan',
      category: 'Buku Tabungan Santri',
      sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      qrPayload: 'https://final7.sim.sch.id/verify?doc=EV-2026-TBG-SAN-042&hash=4b227777',
      signer: 'Ustadzah Halimah (Bendahara Sekolah)',
      reviewer: 'Ustadz Ahmad Fauzi, M.Pd (Kepala Sekolah)',
      creator: 'Ustadzah Halimah (Bendahara Sekolah)',
      timestamp: '01 Agustus 2026, 09:30:10 WIB',
      tenantId: 'TENANT-ASY-001',
      isImmutable: true
    }
  ]);

  const filteredEntries = ledgerEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.documentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.sha256.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.signer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div id="legal-evidence-ledger-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Lock className="w-48 h-48 text-indigo-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R222 &bull; READ-ONLY LEDGER
              </span>
              <span className="text-xs text-slate-400">Strict Tamper-Proof Evidence Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Lock className="w-8 h-8 text-indigo-400" />
              Legal Evidence Ledger
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Buku besar bukti hukum berstatus <strong>Read-Only Mutlak (TIDAK BISA DIEDIT)</strong>. Menyimpan catatan permanen documentId, versi, Checksum SHA-256, payload QR, Penandatangan, Reviewer, dan Pembuat.
            </p>
          </div>
        </div>

        {/* Ledger Summary Stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Status Buku Besar</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">READ-ONLY (LOCKED)</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Total Entri Sah</span>
            <span className="text-xl font-bold text-white font-mono">{ledgerEntries.length} Dokumen</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Integritas Hash</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">SHA-256 VERIFIED</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Proteksi Edit</span>
            <span className="text-xl font-bold text-rose-400 font-mono">0% MUTABLE</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Document ID, Judul, Hash, Penandatangan..."
            maxLength={100}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Semua entri dilindungi kriptografi SHA-256</span>
        </div>
      </div>

      {/* Evidence Ledger Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400 uppercase font-mono border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3.5">Document ID & Versi</th>
                <th className="px-4 py-3.5">Judul Dokumen Resmi</th>
                <th className="px-4 py-3.5">Tritunggal Aktor (Creator, Reviewer, Signer)</th>
                <th className="px-4 py-3.5">SHA-256 Checksum</th>
                <th className="px-4 py-3.5">QR Verification</th>
                <th className="px-4 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredEntries.map((entry) => (
                <tr key={entry.documentId} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-4 align-top">
                    <div className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      {entry.documentId}
                    </div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                      {entry.version}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1">{entry.timestamp}</span>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <div className="font-bold text-slate-900 dark:text-white max-w-xs">{entry.title}</div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">{entry.category}</span>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Tenant: {entry.tenantId}</span>
                  </td>

                  <td className="px-4 py-4 align-top space-y-1">
                    <div className="text-[11px]">
                      <span className="text-slate-400 font-mono text-[10px]">Creator:</span>{' '}
                      <span className="text-slate-700 dark:text-slate-200">{entry.creator}</span>
                    </div>
                    <div className="text-[11px]">
                      <span className="text-slate-400 font-mono text-[10px]">Reviewer:</span>{' '}
                      <span className="text-slate-700 dark:text-slate-200">{entry.reviewer}</span>
                    </div>
                    <div className="text-[11px]">
                      <span className="text-slate-400 font-mono text-[10px]">Signer:</span>{' '}
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{entry.signer}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <div className="bg-slate-900 text-slate-300 font-mono text-[10px] p-2 rounded-lg max-w-xs break-all border border-slate-800 relative group">
                      {entry.sha256}
                      <button
                        onClick={() => handleCopy(entry.sha256, entry.documentId)}
                        className="mt-1.5 flex items-center gap-1 text-[9px] text-emerald-400 hover:text-emerald-300 font-sans"
                      >
                        {copiedId === entry.documentId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedId === entry.documentId ? 'Tersalin' : 'Salin SHA-256'}
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-800 dark:text-slate-200">
                        <QrCode className="w-6 h-6" />
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-[140px]">
                        HMAC-SHA256
                        <span className="block text-emerald-600 dark:text-emerald-400 font-bold">READY SCAN</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 align-top text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      IMMUTABLE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strict Immutability Notice */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
        <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Ketentuan Hukum & Perlindungan Kedaulatan Berkas (Non-Repudiation Policy)
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            Seluruh data dalam Legal Evidence Ledger berstatus *Append-Only* dan tidak menyediakan fungsi edit/hapus. Setiap perubahan terhadap konten dokumen fisik atau digital wajib diterbitkan melalui versi baru (v2, v3, dst.) dengan relasi hash ke versi sebelumnya untuk menjaga kepatuhan audit akreditasi Ban-PDM.
          </p>
        </div>
      </div>
    </div>
  );
};
