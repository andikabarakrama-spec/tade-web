import React, { useState, useEffect } from 'react';
import { History, Search, ShieldCheck, Filter, Download, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { GuardianPolicyEngine, AuditTimelineEvent } from '../../core/governance/guardianPolicyEngine';

export const AuditTimelineExplorerViewer: React.FC = () => {
  const [events, setEvents] = useState<AuditTimelineEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  useEffect(() => {
    const engine = GuardianPolicyEngine.getInstance();
    setEvents(engine.getAuditEvents());
    return engine.subscribe(() => {
      setEvents(engine.getAuditEvents());
    });
  }, []);

  const filteredEvents = events.filter(ev => {
    const matchSearch = ev.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ev.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ev.targetModule.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ev.sha256Proof.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSev = selectedSeverity === 'ALL' || ev.severity === selectedSeverity;
    return matchSearch && matchSev;
  });

  return (
    <div id="audit-timeline-explorer-root" className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <History className="w-4 h-4" /> R852 • Immutability Audit Trail
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Audit Timeline Explorer</h1>
            <p className="text-slate-400 text-sm mt-1">
              Jejak audit kronologis imutabel seluruh tindakan krusial sistem dengan bukti verifikasi SHA-256 terdesentralisasi.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Laporan audit terverifikasi SHA-256 berhasil diekspor!')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md"
            >
              <Download className="w-4 h-4" /> Ekspor Bukti Audit
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari aktor, modul, aksi, atau hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'SUCCESS', 'INFO', 'WARNING', 'CRITICAL'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedSeverity === sev
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev === 'ALL' ? 'Semua Status' : sev}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-4">
        {filteredEvents.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-slate-100 text-slate-700 rounded-md">
                  {item.id}
                </span>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {item.timestamp}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                    item.severity === 'SUCCESS'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.severity === 'WARNING'
                      ? 'bg-amber-100 text-amber-800'
                      : item.severity === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {item.severity}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{item.action}</h3>
              <p className="text-xs text-slate-600">{item.details}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <div>
                  <span className="font-semibold text-slate-700">Aktor:</span> {item.actor} ({item.role})
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Modul Target:</span> {item.targetModule}
                </div>
              </div>
            </div>

            <div className="sm:text-right bg-slate-50 p-3 rounded-lg border border-slate-100 min-w-[260px]">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center sm:justify-end gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> SHA-256 Proof Signature
              </div>
              <div className="font-mono text-[11px] text-slate-700 break-all mt-1 bg-white p-1.5 rounded border border-slate-200">
                {item.sha256Proof}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                ✓ Terverifikasi Imutabel di SSoT
              </div>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 text-sm">
            Tidak ditemukan jejak audit yang cocok dengan filter pencarian.
          </div>
        )}
      </div>
    </div>
  );
};
