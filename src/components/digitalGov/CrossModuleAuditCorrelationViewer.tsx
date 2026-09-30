import React, { useState, useMemo } from 'react';
import { 
  GitCommit, 
  Search, 
  Filter, 
  ShieldCheck, 
  Activity, 
  Database, 
  RotateCcw, 
  Layers, 
  Users, 
  Sparkles,
  Tag,
  Clock,
  Key
} from 'lucide-react';
import { 
  CrossModuleAuditCorrelator, 
  CorrelatedAuditEvent, 
  AuditSourceModule 
} from '../../core/digitalGov/crossModuleAuditCorrelator';

export const CrossModuleAuditCorrelationViewer: React.FC = () => {
  const correlator = useMemo(() => CrossModuleAuditCorrelator.getInstance(), []);
  const [selectedSource, setSelectedSource] = useState<AuditSourceModule | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const events = useMemo(() => {
    const filter = selectedSource === 'ALL' ? undefined : selectedSource;
    const all = correlator.getUnifiedTimeline(filter);
    if (!searchQuery.trim()) return all;
    const q = searchQuery.toLowerCase();
    return all.filter(e => 
      e.title.toLowerCase().includes(q) ||
      e.detail.toLowerCase().includes(q) ||
      e.eventCode.toLowerCase().includes(q) ||
      e.actorName.toLowerCase().includes(q) ||
      e.correlationToken.toLowerCase().includes(q)
    );
  }, [correlator, selectedSource, searchQuery]);

  const getSourceIcon = (src: AuditSourceModule) => {
    switch (src) {
      case 'GUARDIAN': return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'WAR_ROOM': return <Sparkles className="w-3.5 h-3.5 text-amber-600" />;
      case 'COMPANION': return <Users className="w-3.5 h-3.5 text-blue-600" />;
      case 'RECOVERY': return <RotateCcw className="w-3.5 h-3.5 text-rose-600" />;
      case 'SESSION': return <Clock className="w-3.5 h-3.5 text-indigo-600" />;
      case 'GOVERNANCE': return <Layers className="w-3.5 h-3.5 text-purple-600" />;
      default: return <Activity className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const getSeverityBadge = (sev: 'INFO' | 'NOTICE' | 'WARNING' | 'CRITICAL') => {
    switch (sev) {
      case 'INFO':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md font-mono bg-blue-50 text-blue-700 border border-blue-200">INFO</span>;
      case 'NOTICE':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md font-mono bg-stone-100 text-stone-700 border border-stone-200">NOTICE</span>;
      case 'WARNING':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md font-mono bg-amber-50 text-amber-700 border border-amber-200">WARNING</span>;
      case 'CRITICAL':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md font-mono bg-rose-50 text-rose-700 border border-rose-200">CRITICAL</span>;
    }
  };

  return (
    <div id="r774-cross-module-audit-correlation" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold font-mono border border-purple-500/30">
              <GitCommit className="w-3.5 h-3.5" /> R774 • CROSS-MODULE AUDIT CORRELATION
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Unified Chronological Audit Observatory
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Penyatuan audit trail lintas subsistem (Guardian, War Room, Companion, Recovery, Registry, Session, Governance) dalam 1 garis waktu terpadu dengan token korelasi berantai.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-xs px-4 py-3 rounded-2xl border border-slate-700 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Correlated Events</p>
              <p className="text-2xl font-black text-purple-400 font-mono">{events.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['ALL', 'GUARDIAN', 'GOVERNANCE', 'SESSION', 'RECOVERY', 'COMPANION', 'WAR_ROOM'] as const).map((src) => (
              <button
                key={src}
                onClick={() => setSelectedSource(src)}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  selectedSource === src
                    ? 'bg-slate-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {src !== 'ALL' && getSourceIcon(src)}
                {src}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari audit atau token korelasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Timeline Stream */}
        <div className="space-y-3 pt-2">
          {events.map((evt, idx) => (
            <div 
              key={evt.correlationId}
              className="p-4 bg-stone-50/70 rounded-2xl border border-stone-200 hover:border-purple-300 transition space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-white rounded-lg border border-stone-200 shadow-2xs">
                    {getSourceIcon(evt.sourceModule)}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800">
                    {evt.eventCode}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    {evt.correlationToken}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getSeverityBadge(evt.severity)}
                  <span className="text-[11px] text-stone-400 font-mono">
                    {new Date(evt.timestamp).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900">{evt.title}</h3>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{evt.detail}</p>
              </div>

              <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-[10px] text-stone-400 font-mono">
                <div>
                  Aktor: <strong className="text-stone-700 font-sans">{evt.actorName}</strong> ({evt.actorRole})
                </div>
                <div>
                  Integrity Hash: <span className="text-purple-600">{evt.integrityHash}</span>
                </div>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="text-center py-12 text-stone-400 text-xs">
              Tidak ada audit event yang cocok dengan kueri.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
