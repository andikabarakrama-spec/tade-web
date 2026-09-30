import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Filter, 
  Clock, 
  User, 
  Building2, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Search,
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';

interface AuditEvent {
  id: string;
  stepNumber: number;
  title: string;
  action: string;
  timestamp: string;
  date: string;
  actor: string;
  role: 'SUPER_ADMIN' | 'KETUA_YAYASAN' | 'KEPALA_SEKOLAH' | 'GURU' | 'ADMIN_SIM' | 'BENDAHARA';
  documentTitle: string;
  documentCategory: 'SK' | 'Raport' | 'Piagam' | 'Tabungan';
  tenantId: string;
  hash: string;
  details: string;
}

export const AuditReplayCenter: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedDocCategory, setSelectedDocCategory] = useState<string>('ALL');
  const [selectedTenant, setSelectedTenant] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [auditEvents] = useState<AuditEvent[]>([
    {
      id: 'EVT-001',
      stepNumber: 1,
      title: 'Penyusunan Draft SK Kurikulum Sentra',
      action: 'DRAFT_CREATED',
      timestamp: '15 Agustus 2026, 08:00:12 WIB',
      date: '2026-08-15',
      actor: 'Ustadzah Siti Aminah, S.Pd',
      role: 'ADMIN_SIM',
      documentTitle: 'SK Penetapan Kurikulum Sentra 2026/2027',
      documentCategory: 'SK',
      tenantId: 'TENANT-ASY-001',
      hash: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
      details: 'Draft awal diunggah ke sistem SIM dengan modul sentra balok, sains, dan peran.'
    },
    {
      id: 'EVT-002',
      stepNumber: 2,
      title: 'Review Kurikulum oleh Kepala Sekolah',
      action: 'REVIEW_COMPLETED',
      timestamp: '15 Agustus 2026, 09:15:40 WIB',
      date: '2026-08-15',
      actor: 'Ustadz Ahmad Fauzi, M.Pd',
      role: 'KEPALA_SEKOLAH',
      documentTitle: 'SK Penetapan Kurikulum Sentra 2026/2027',
      documentCategory: 'SK',
      tenantId: 'TENANT-ASY-001',
      hash: 'b10a8db164e0754105b7a99be72e3fe57e930f35',
      details: 'Pemeriksaan kesesuaian jam ajar sentra dan integrasi tahfidz juz 30.'
    },
    {
      id: 'EVT-003',
      stepNumber: 3,
      title: 'Pengesahan Ketua Yayasan',
      action: 'APPROVED_BY_FOUNDATION',
      timestamp: '15 Agustus 2026, 10:30:00 WIB',
      date: '2026-08-15',
      actor: 'KH. Dr. Muhammad Zaki',
      role: 'KETUA_YAYASAN',
      documentTitle: 'SK Penetapan Kurikulum Sentra 2026/2027',
      documentCategory: 'SK',
      tenantId: 'TENANT-ASY-001',
      hash: 'c21b9ec275f1865216c8ba0cf83f4af68fa41a46',
      details: 'Persetujuan resmi anggaran katering halal dan fasilitas sentra bahan alam.'
    },
    {
      id: 'EVT-004',
      stepNumber: 4,
      title: 'Tanda Tangan Kriptografi (Digital Signature)',
      action: 'DIGITAL_SIGNATURE_APPLIED',
      timestamp: '15 Agustus 2026, 11:00:15 WIB',
      date: '2026-08-15',
      actor: 'KH. Dr. Muhammad Zaki',
      role: 'KETUA_YAYASAN',
      documentTitle: 'SK Penetapan Kurikulum Sentra 2026/2027',
      documentCategory: 'SK',
      tenantId: 'TENANT-ASY-001',
      hash: 'd32c0fd386a2976327d9cb1da94a5ba79ab52b57',
      details: 'Penerbitan pasangan kunci kripto HMAC-SHA256 untuk sertifikasi digital.'
    },
    {
      id: 'EVT-005',
      stepNumber: 5,
      title: 'Pencetakan Berkas Fisik & Watermarking',
      action: 'PHYSICAL_PRINT_LOGGED',
      timestamp: '15 Agustus 2026, 11:30:00 WIB',
      date: '2026-08-15',
      actor: 'Ustadzah Siti Aminah, S.Pd',
      role: 'ADMIN_SIM',
      documentTitle: 'SK Penetapan Kurikulum Sentra 2026/2027',
      documentCategory: 'SK',
      tenantId: 'TENANT-ASY-001',
      hash: 'f54e2bf508c4b98549f1ed3fc16c7dc91cd74d79',
      details: 'Pencetakan 2 salinan resmi ber-QR Code di Ruang Tata Usaha.'
    },
    {
      id: 'EVT-006',
      stepNumber: 6,
      title: 'Penyimpanan Permanen Smart Vault',
      action: 'IMMUTABLE_VAULT_ARCHIVED',
      timestamp: '15 Agustus 2026, 11:45:10 WIB',
      date: '2026-08-15',
      actor: 'Sistem Kedaulatan TADE',
      role: 'SUPER_ADMIN',
      documentTitle: 'SK Penetapan Kurikulum Sentra 2026/2027',
      documentCategory: 'SK',
      tenantId: 'TENANT-ASY-001',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4',
      details: 'Penguncian arsip berstatus Read-Only dengan retensi 10 tahun.'
    }
  ]);

  const filteredEvents = auditEvents.filter(evt => {
    const matchesSearch = 
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.documentTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'ALL' || evt.role === selectedRole;
    const matchesCategory = selectedDocCategory === 'ALL' || evt.documentCategory === selectedDocCategory;
    const matchesTenant = selectedTenant === 'ALL' || evt.tenantId === selectedTenant;

    return matchesSearch && matchesRole && matchesCategory && matchesTenant;
  });

  const handlePlayReplay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    let step = 0;
    setCurrentStepIndex(0);

    const interval = setInterval(() => {
      step += 1;
      if (step >= filteredEvents.length) {
        clearInterval(interval);
        setIsPlaying(false);
      } else {
        setCurrentStepIndex(step);
      }
    }, 1000);
  };

  const handleResetReplay = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const currentReplayEvent = filteredEvents[currentStepIndex] || filteredEvents[0];

  return (
    <div id="audit-replay-center-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Play className="w-48 h-48 text-rose-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R225 &bull; TIME-MACHINE AUDITOR
              </span>
              <span className="text-xs text-slate-400">Interactive Forensic Event Player</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Play className="w-8 h-8 text-rose-400" />
              Audit Replay Center
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Simulasi pemutaran ulang jejak rekam audit dokumen secara interaktif berdasarkan filter Tanggal, Peran (Role), Kategori Dokumen, dan Tenant ID madrasah.
            </p>
          </div>

          {/* Replay Control Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayReplay}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-all shadow-md active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Jeda Replay' : 'Putar Replay Silsilah'}
            </button>
            <button
              onClick={handleResetReplay}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all active:scale-95"
              title="Reset Timeline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Jejak Terfilter</span>
            <span className="text-xl font-bold text-rose-400 font-mono">{filteredEvents.length} Event</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Status Putar</span>
            <span className="text-xl font-bold text-white font-mono">{isPlaying ? 'RUNNING' : 'STANDBY'}</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Langkah Aktif</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">Step {currentStepIndex + 1} / {filteredEvents.length}</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Integritas Kronologis</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">100% VALID</span>
          </div>
        </div>
      </div>

      {/* Multi-Dimensional Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-slate-500 font-medium mb-1">Filter Peran (Role):</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">Semua Role</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="KETUA_YAYASAN">KETUA_YAYASAN</option>
            <option value="KEPALA_SEKOLAH">KEPALA_SEKOLAH</option>
            <option value="GURU">GURU</option>
            <option value="ADMIN_SIM">ADMIN_SIM</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-500 font-medium mb-1">Kategori Dokumen:</label>
          <select
            value={selectedDocCategory}
            onChange={(e) => setSelectedDocCategory(e.target.value)}
            className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">Semua Dokumen</option>
            <option value="SK">SK Yayasan & Sekolah</option>
            <option value="Raport">Raport Sentra</option>
            <option value="Piagam">Piagam Santri</option>
            <option value="Tabungan">Buku Tabungan</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-500 font-medium mb-1">Tenant ID:</label>
          <select
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">Semua Tenant</option>
            <option value="TENANT-ASY-001">TENANT-ASY-001 (TK Asy-Syifa)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-500 font-medium mb-1">Cari Keyword:</label>
          <input
            type="text"
            placeholder="Cari aktor, dokumen..."
            maxLength={100}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Interactive Replay Spotlight View */}
      {currentReplayEvent && (
        <div className="bg-gradient-to-br from-rose-500/10 via-slate-900 to-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-mono text-xs font-bold">
                REPLAY SPOTLIGHT &bull; STEP {currentReplayEvent.stepNumber}
              </span>
              <span className="text-xs text-rose-300 font-mono">{currentReplayEvent.action}</span>
            </div>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {currentReplayEvent.timestamp}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{currentReplayEvent.title}</h3>
          <p className="text-sm text-slate-300 mb-4">{currentReplayEvent.details}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4 border-t border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px]">Aktor & Peran:</span>
              <span className="font-bold text-white">{currentReplayEvent.actor}</span>
              <span className="text-rose-400 font-mono block text-[10px]">({currentReplayEvent.role})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Dokumen Terkait:</span>
              <span className="font-bold text-white truncate block">{currentReplayEvent.documentTitle}</span>
              <span className="text-slate-400 font-mono text-[10px]">{currentReplayEvent.documentCategory}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Tenant Scope:</span>
              <span className="font-mono text-white font-bold">{currentReplayEvent.tenantId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Bukti Kriptografis:</span>
              <span className="font-mono text-emerald-400 font-bold block truncate">{currentReplayEvent.hash}</span>
            </div>
          </div>
        </div>
      )}

      {/* Full Chronological Timeline Feed */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-rose-600" />
          Daftar Lengkap Rekam Jejak Audit (Full Timeline Feed)
        </h3>

        <div className="space-y-3">
          {filteredEvents.map((evt, idx) => (
            <div
              key={evt.id}
              onClick={() => setCurrentStepIndex(idx)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                currentStepIndex === idx
                  ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20'
                  : 'bg-slate-50/60 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  currentStepIndex === idx
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                }`}>
                  {evt.stepNumber}
                </span>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{evt.title}</h4>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{evt.actor} ({evt.role})</span>
                    <span>&bull;</span>
                    <span>{evt.documentTitle}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-[10px] font-mono text-slate-400">{evt.timestamp}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  RECORDED
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
