import React, { useState } from 'react';
import {
  History,
  LogIn,
  CheckSquare,
  HardDrive,
  Zap,
  Shield,
  Download,
  Filter,
  Search,
  Calendar,
  Lock,
  ChevronDown
} from 'lucide-react';

interface AuditEntry {
  id: string;
  timestamp: string;
  category: 'LOGIN' | 'APPROVAL' | 'BACKUP' | 'AUTOMATION' | 'SECURITY' | 'EXPORT';
  actor: string;
  role: string;
  tenantId: string;
  action: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED';
}

export const UnifiedAuditTimeline: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const auditData: AuditEntry[] = [
    {
      id: 'AUD-8821',
      timestamp: '15 Agt 2026, 10:20:11 WIB',
      category: 'APPROVAL',
      actor: 'H. Ahmad Dahlan (Kepala Sekolah)',
      role: 'KEPALA_SEKOLAH',
      tenantId: 'tenant-asy-syifa-01',
      action: 'Menyetujui dispensasi SPP Santri Ananda Rayyan Fadhil (Diskon 50%)',
      ipAddress: '182.253.12.90',
      status: 'SUCCESS'
    },
    {
      id: 'AUD-8820',
      timestamp: '15 Agt 2026, 09:45:00 WIB',
      category: 'EXPORT',
      actor: 'Siti Rahmawati, S.Pd (Bendahara)',
      role: 'KEUANGAN',
      tenantId: 'tenant-asy-syifa-01',
      action: 'Ekspor rekapitulasi SPP periode Juli-Agustus 2026 ke format Excel (XLSX)',
      ipAddress: '182.253.12.91',
      status: 'SUCCESS'
    },
    {
      id: 'AUD-8819',
      timestamp: '15 Agt 2026, 08:15:33 WIB',
      category: 'LOGIN',
      actor: 'Ustazah Maryam (Wali Kelas A1)',
      role: 'GURU',
      tenantId: 'tenant-asy-syifa-01',
      action: 'Autentikasi sesi guru berhasil dari Chrome Android v128',
      ipAddress: '114.122.45.19',
      status: 'SUCCESS'
    },
    {
      id: 'AUD-8818',
      timestamp: '15 Agt 2026, 04:00:02 WIB',
      category: 'BACKUP',
      actor: 'System Daemon (TADE Engine)',
      role: 'SYSTEM',
      tenantId: 'tenant-asy-syifa-01',
      action: 'Pencadangan snapshot harian terenkripsi AES-256 selesai dalam 1.2 detik',
      ipAddress: '127.0.0.1',
      status: 'SUCCESS'
    },
    {
      id: 'AUD-8817',
      timestamp: '14 Agt 2026, 21:10:00 WIB',
      category: 'AUTOMATION',
      actor: 'Smart Automation Engine',
      role: 'SYSTEM',
      tenantId: 'tenant-asy-syifa-01',
      action: 'Pengiriman siaran WhatsApp pengingat SPP otomatis ke 48 wali santri',
      ipAddress: '127.0.0.1',
      status: 'SUCCESS'
    },
    {
      id: 'AUD-8816',
      timestamp: '14 Agt 2026, 17:30:15 WIB',
      category: 'SECURITY',
      actor: 'Guardian Sentinel',
      role: 'SECURITY',
      tenantId: 'tenant-asy-syifa-01',
      action: 'Validasi token akses sesi RBAC dinyatakan valid (Zero Unauthorized Attempt)',
      ipAddress: '182.253.12.90',
      status: 'SUCCESS'
    }
  ];

  const filteredData = auditData.filter(item => {
    const matchCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchSearch =
      item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'LOGIN': return <LogIn className="w-4 h-4 text-blue-600" />;
      case 'APPROVAL': return <CheckSquare className="w-4 h-4 text-emerald-600" />;
      case 'BACKUP': return <HardDrive className="w-4 h-4 text-purple-600" />;
      case 'AUTOMATION': return <Zap className="w-4 h-4 text-amber-600" />;
      case 'SECURITY': return <Shield className="w-4 h-4 text-indigo-600" />;
      case 'EXPORT': return <Download className="w-4 h-4 text-teal-600" />;
      default: return <History className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl border border-violet-100">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Unified Audit Timeline</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 text-xs font-bold">
                Tenant: Asy-Syifa 01
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Jejak audit forensik terpadu seluruh aktivitas autentikasi, persetujuan keuangan, backup, otomasi, dan keamanan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Immutable Log Ledger</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari aktivitas, aktor, atau kode audit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {['ALL', 'LOGIN', 'APPROVAL', 'BACKUP', 'AUTOMATION', 'SECURITY', 'EXPORT'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Semua' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-800">Linimasa Peristiwa ({filteredData.length} Kejadian)</h2>
          <span className="text-[11px] text-slate-400 font-mono">Zona Waktu: Asia/Jakarta (WIB)</span>
        </div>

        <div className="relative border-l-2 border-slate-100 ml-4 pl-6 space-y-6">
          {filteredData.map(entry => (
            <div key={entry.id} className="relative group">
              {/* Dot Icon */}
              <div className="absolute -left-[35px] top-1 p-1.5 rounded-full bg-white border-2 border-slate-200 shadow-xs">
                {getCategoryIcon(entry.category)}
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {entry.id}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{entry.actor}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                      {entry.role}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">{entry.timestamp}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">{entry.action}</p>

                <div className="pt-2 border-t border-slate-200/40 flex items-center justify-between text-[11px] text-slate-400">
                  <span>IP Aktor: <strong className="font-mono text-slate-600">{entry.ipAddress}</strong></span>
                  <span className="text-emerald-600 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                    {entry.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
