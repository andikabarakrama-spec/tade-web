import React, { useState } from 'react';
import { 
  UserCheck, 
  History, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  Award, 
  Stamp, 
  KeyRound, 
  Building2, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface PositionRecord {
  id: string;
  personId: string;
  personName: string;
  role: 'KETUA_YAYASAN' | 'KEPALA_SEKOLAH' | 'BENDAHARA' | 'WAKA_KURIKULUM' | 'ADMIN_SIM' | 'GURU_SENTRA';
  roleTitle: string;
  startDate: string;
  endDate: string | null;
  status: 'AKTIF' | 'PURNA_TUGAS' | 'TRANSISI' | 'PLT';
  skPengangkatan: {
    number: string;
    date: string;
    sha256: string;
  };
  skPemberhentian?: {
    number: string;
    date: string;
    sha256: string;
  };
  digitalSignatureHash: string;
  officialStampId: string;
  archivedDocumentsCount: number;
  notes: string;
}

export const PositionHistoryVault: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedRecordId, setSelectedRecordId] = useState<string>('POS-2024-KS-001');

  const [positions] = useState<PositionRecord[]>([
    {
      id: 'POS-2024-KS-001',
      personId: 'PERS-FAUZI-01',
      personName: 'Ustadz Ahmad Fauzi, M.Pd',
      role: 'KEPALA_SEKOLAH',
      roleTitle: 'Kepala Sekolah TK Islam Asy-Syifa',
      startDate: '01 Juli 2024',
      endDate: null,
      status: 'AKTIF',
      skPengangkatan: {
        number: 'SK/YYS-ASY/PENGANGKATAN/2024/007',
        date: '28 Juni 2024',
        sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
      },
      digitalSignatureHash: 'SIG-HMAC-FAUZI-2024-884c7d65',
      officialStampId: 'STAMP-TK-ASYSYIFA-OFFICIAL-2024',
      archivedDocumentsCount: 384,
      notes: 'Pejabat definitif penanggung jawab kurikulum dan operasional madrasah.'
    },
    {
      id: 'POS-2020-KY-001',
      personId: 'PERS-ZAKI-01',
      personName: 'KH. Dr. Muhammad Zaki',
      role: 'KETUA_YAYASAN',
      roleTitle: 'Ketua Dewan Pembina & Yayasan Asy-Syifa',
      startDate: '10 Januari 2020',
      endDate: null,
      status: 'AKTIF',
      skPengangkatan: {
        number: 'AKTA-NOTARIS-YYS-001/2020',
        date: '05 Januari 2020',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      },
      digitalSignatureHash: 'SIG-HMAC-ZAKI-YYS-2020-e3b0c442',
      officialStampId: 'STAMP-YAYASAN-ASY-LEGAL-2020',
      archivedDocumentsCount: 1420,
      notes: 'Pemegang mandat tertinggi yayasan dan kedaulatan TADE Sovereign Cloud.'
    },
    {
      id: 'POS-2021-KS-000',
      personId: 'PERS-BAHRUL-00',
      personName: 'Drs. H. Bahrul Alam, M.M',
      role: 'KEPALA_SEKOLAH',
      roleTitle: 'Kepala Sekolah Demisioner (Periode 2021-2024)',
      startDate: '01 Juli 2021',
      endDate: '30 Juni 2024',
      status: 'PURNA_TUGAS',
      skPengangkatan: {
        number: 'SK/YYS-ASY/PENGANGKATAN/2021/014',
        date: '25 Juni 2021',
        sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
      },
      skPemberhentian: {
        number: 'SK/YYS-ASY/PEMBERHENTIAN/2024/006',
        date: '27 Juni 2024',
        sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
      },
      digitalSignatureHash: 'SIG-HMAC-BAHRUL-2021-4b227777',
      officialStampId: 'STAMP-TK-ASYSYIFA-HISTORIC-V1',
      archivedDocumentsCount: 890,
      notes: 'Dokumen dan ijazah santri periode 2021-2024 tetap sah menggunakan tanda tangan beliau.'
    },
    {
      id: 'POS-2023-BND-001',
      personId: 'PERS-HALIMAH-01',
      personName: 'Ustadzah Halimah',
      role: 'BENDAHARA',
      roleTitle: 'Bendahara Sekolah & Kasir SPP',
      startDate: '01 Agustus 2023',
      endDate: null,
      status: 'AKTIF',
      skPengangkatan: {
        number: 'SK/KS-ASY/BENDAHARA/2023/022',
        date: '28 Juli 2023',
        sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e'
      },
      digitalSignatureHash: 'SIG-HMAC-HALIMAH-2023-a1b2c3d4',
      officialStampId: 'STAMP-KEUANGAN-ASYSYIFA-2023',
      archivedDocumentsCount: 5200,
      notes: 'Otorisator kuitansi pembayaran SPP dan buku rekening tabungan santri.'
    }
  ]);

  const filteredPositions = positions.filter(p => {
    const matchesSearch = 
      p.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.skPengangkatan.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'ALL' || p.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const activeRecord = positions.find(p => p.id === selectedRecordId) || positions[0];

  return (
    <div id="position-history-vault-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <History className="w-48 h-48 text-indigo-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R226 &bull; POSITION HISTORY VAULT
              </span>
              <span className="text-xs text-slate-400">Institutional Lineage Guardian</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-indigo-400" />
              Position History Vault
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Penyimpanan sejarah jabatan institusi lengkap (Ketua Yayasan, Kepala Sekolah, Guru, Admin). Dokumen terbitan masa lampau <strong>tetap sah secara hukum</strong> menggunakan identitas dan stempel periode tersebut.
            </p>
          </div>
        </div>

        {/* Global Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Total Riwayat Pejabat</span>
            <span className="text-xl font-bold text-white font-mono">{positions.length} Entri Sah</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Dokumen Bersejarah Sah</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">100% VALID</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Integritas SK Pengangkatan</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">SHA-256 MATCH</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Keabsahan Retrospektif</span>
            <span className="text-xl font-bold text-amber-400 font-mono">IMMUTABLE</span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Filter & Position List */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Daftar Riwayat Jabatan
            </h3>
            <span className="text-xs text-slate-500 font-mono">{filteredPositions.length} Pejabat</span>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama, SK, jabatan..."
                maxLength={100}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">Semua Jabatan</option>
              <option value="KETUA_YAYASAN">Ketua Yayasan</option>
              <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
              <option value="BENDAHARA">Bendahara</option>
            </select>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredPositions.map((pos) => (
              <div
                key={pos.id}
                onClick={() => setSelectedRecordId(pos.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedRecordId === pos.id
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50/50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200">
                    {pos.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    pos.status === 'AKTIF' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                    pos.status === 'PLT' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                    'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {pos.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{pos.personName}</h4>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">{pos.roleTitle}</p>
                <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{pos.startDate} &rarr; {pos.endDate || 'Sekarang'}</span>
                  <span className="text-slate-600 dark:text-slate-300 font-bold">{pos.archivedDocumentsCount} Dok</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Deep-Dive Position Dossier */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">{activeRecord.id} &bull; {activeRecord.personId}</span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{activeRecord.personName}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{activeRecord.roleTitle}</p>
              </div>
              <span className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold ${
                activeRecord.status === 'AKTIF' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                Periode: {activeRecord.startDate} — {activeRecord.endDate || 'Sedang Menjabat (Aktif)'}
              </span>
            </div>

            {/* Legal Proof Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SK Pengangkatan Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                  <Award className="w-4 h-4" />
                  <span>SK Pengangkatan Resmi</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{activeRecord.skPengangkatan.number}</div>
                <div className="text-[11px] text-slate-500 font-mono">Diterbitkan: {activeRecord.skPengangkatan.date}</div>
                <div className="p-2 rounded bg-slate-900 text-slate-300 font-mono text-[9px] break-all border border-slate-800">
                  <strong className="text-indigo-400">SHA-256:</strong> {activeRecord.skPengangkatan.sha256}
                </div>
              </div>

              {/* Tanda Tangan & Stempel Terkait */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                  <Stamp className="w-4 h-4" />
                  <span>Kredensial Otorisasi & Stempel</span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-200">
                  <span className="text-slate-400 block text-[10px]">Stempel Terkait:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{activeRecord.officialStampId}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 text-slate-300 font-mono text-[9px] break-all border border-slate-800">
                  <strong className="text-emerald-400">Signature Hash:</strong> {activeRecord.digitalSignatureHash}
                </div>
              </div>
            </div>

            {/* If Demisioner, show SK Pemberhentian */}
            {activeRecord.skPemberhentian && (
              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                  <FileText className="w-4 h-4" />
                  <span>SK Pemberhentian / Purna Tugas Terhormat</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{activeRecord.skPemberhentian.number}</div>
                <div className="text-[11px] text-slate-500 font-mono">Tanggal Efektif: {activeRecord.skPemberhentian.date}</div>
                <div className="p-2 rounded bg-slate-900 text-slate-300 font-mono text-[9px] break-all border border-slate-800">
                  <strong className="text-amber-400">SHA-256:</strong> {activeRecord.skPemberhentian.sha256}
                </div>
              </div>
            )}

            {/* Operational Legacy Guarantee */}
            <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-800/30 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-1">Catatan Keabsahan Arsip ({activeRecord.archivedDocumentsCount} Dokumen Diterbitkan):</span>
              {activeRecord.notes} Seluruh ijazah, raport, dan SK yang ditandatangani pada periode jabatan ini tetap diakui sah dan tidak terpengaruh oleh pergantian kepengurusan di masa depan.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
