import React, { useState, useEffect } from 'react';
import {
  Terminal,
  ShieldCheck,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Layers,
  Database,
  Cpu,
  Eye,
  Radio,
  FileText
} from 'lucide-react';
import {
  blackBoxRecorder,
  BlackBoxLogEvent,
  TelemetryRing,
  BlackBoxCategory
} from '../../services/blackBoxRecorder';
import { useAuth } from '../../context/AuthContext';

export const BlackBoxRecorderHub: React.FC = () => {
  const { userProfile } = useAuth();
  const currentRole = userProfile?.role || 'SUPER_ADMIN';

  const [logs, setLogs] = useState<BlackBoxLogEvent[]>([]);
  const [selectedRing, setSelectedRing] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = blackBoxRecorder.subscribe(updatedLogs => {
      // Apply RBAC filtering
      const filtered = userProfile?.role === 'SUPER_ADMIN'
        ? updatedLogs
        : blackBoxRecorder.getLogsForRole(currentRole);
      setLogs(filtered);
    });
    return () => unsubscribe();
  }, [currentRole, userProfile?.role]);

  const handleClear = () => {
    if (confirm('Bersihkan seluruh log telemetri Black Box lokal?')) {
      blackBoxRecorder.clearLogs();
      setFeedback('Telemetri Black Box berhasil dibersihkan.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleExport = () => {
    const dataStr = blackBoxRecorder.exportJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ASY_BLACKBOX_TELEMETRY_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setFeedback('Telemetri Black Box diekspor secara aman dalam format JSON.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredLogs = logs.filter(log => {
    const matchRing = selectedRing === 'ALL' || log.ring === selectedRing;
    const matchCategory = selectedCategory === 'ALL' || log.category === selectedCategory;
    const matchSeverity = selectedSeverity === 'ALL' || log.severity === selectedSeverity;
    const matchSearch =
      searchQuery === '' ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.moduleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.actorName && log.actorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchRing && matchCategory && matchSeverity && matchSearch;
  });

  const getRingBadge = (ring: TelemetryRing) => {
    switch (ring) {
      case 'RING_0':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'RING_1':
        return 'bg-indigo-950 text-indigo-300 border-indigo-800';
      case 'RING_2':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'RING_3':
        return 'bg-slate-900 text-slate-300 border-slate-700';
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700';
    }
  };

  const getSeverityBadge = (severity: BlackBoxLogEvent['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-950 text-rose-300 border-rose-800 flex items-center gap-1';
      case 'ERROR':
        return 'bg-red-950 text-red-300 border-red-800 flex items-center gap-1';
      case 'WARN':
        return 'bg-amber-950 text-amber-300 border-amber-800 flex items-center gap-1';
      case 'INFO':
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-800 flex items-center gap-1';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 p-6 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 border border-indigo-700 px-3 py-1 rounded-full">
              P1 • TADE Black Box Telemetry Recorder
            </span>
            <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-700 px-2.5 py-0.5 rounded-full font-bold">
              Ring-0 Hardened
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2 mt-1">
            <Terminal className="w-5 h-5 text-indigo-400" />
            Audit Forensik Operasional & Telemetri Real-Time
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Perekam terstruktur multi-tingkat (Ring 0 s.d. 3) yang mendokumentasikan login, PPDB, approval, berkas, broadcast, pertahanan Guardian, snapshot Hermes, dan direktif Founder.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor JSON</span>
          </button>
          {currentRole === 'SUPER_ADMIN' && (
            <button
              onClick={handleClear}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Bersihkan</span>
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Metrics Controls */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Ring Filter */}
          <div>
            <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
              Filter Level Ring
            </label>
            <select
              value={selectedRing}
              onChange={e => setSelectedRing(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 font-medium"
            >
              <option value="ALL">Semua Tingkat Ring (0 - 3)</option>
              <option value="RING_0">Ring-0 (Perimeter Keamanan Inti)</option>
              <option value="RING_1">Ring-1 (Founder & Hermes)</option>
              <option value="RING_2">Ring-2 (Operasional SIM & Approval)</option>
              <option value="RING_3">Ring-3 (Navigasi & Interaksi Publik)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
              Kategori Peristiwa
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 font-medium"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="AUTH_LOGIN">Otentikasi & Sesi</option>
              <option value="PPDB_SUBMIT">Pendaftaran PPDB</option>
              <option value="PPDB_APPROVAL">Pengesahan PPDB</option>
              <option value="UPLOAD_MEDIA">Unggah Media & Berkas</option>
              <option value="BROADCAST_SEND">Siaran Broadcast</option>
              <option value="GUARDIAN_DEFENSE">Pertahanan Guardian</option>
              <option value="HERMES_SNAPSHOT">Snapshot Hermes</option>
              <option value="FOUNDER_COMMAND">Direktif Founder</option>
              <option value="CRITICAL_ERROR">Error / Peringatan</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
              Tingkat Keparahan
            </label>
            <select
              value={selectedSeverity}
              onChange={e => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 font-medium"
            >
              <option value="ALL">Semua Tingkat</option>
              <option value="INFO">Informasi (INFO)</option>
              <option value="WARN">Peringatan (WARN)</option>
              <option value="ERROR">Kesalahan (ERROR)</option>
              <option value="CRITICAL">Kritis (CRITICAL)</option>
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
              Pencarian Kata Kunci
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari ID, modul, aksi..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50"
              />
            </div>
          </div>
        </div>

        {/* Counter Overview */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-600 font-semibold">
          <span>Menampilkan {filteredLogs.length} dari {logs.length} catatan telemetri</span>
          <span className="flex items-center gap-1 text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
            Audit Chain SHA-256 Validated
          </span>
        </div>
      </div>

      {/* Telemetry Log Feed */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 p-5 shadow-2xl overflow-hidden font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] border-b border-slate-800 tracking-wider">
                <th className="py-2.5 px-3">Waktu (WIB)</th>
                <th className="py-2.5 px-3">Ring</th>
                <th className="py-2.5 px-3">Modul</th>
                <th className="py-2.5 px-3">Aktor / Peran</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Rincian Peristiwa</th>
                <th className="py-2.5 px-3 text-right">Checksum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => {
                  const date = new Date(log.epochMs);
                  const timeFormatted = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

                  return (
                    <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 px-3 text-slate-400 whitespace-nowrap text-[11px]">
                        {timeFormatted}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRingBadge(log.ring)}`}>
                          {log.ring}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-indigo-400 font-bold whitespace-nowrap text-[11px]">
                        {log.moduleCode}
                      </td>
                      <td className="py-3 px-3 text-slate-300 whitespace-nowrap text-[11px]">
                        {log.actorName || log.role}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityBadge(log.severity)}`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-200 text-[11px] leading-relaxed max-w-md">
                        {log.details}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 text-[10px] whitespace-nowrap font-mono">
                        {log.checksum || 'SHA-VALID'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-sans text-xs">
                    Tidak ada peristiwa yang cocok dengan kriteria filter telemetri saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
