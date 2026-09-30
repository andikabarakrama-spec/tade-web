import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  GitMerge,
  ArrowRightLeft,
  FileText,
  UserCheck,
  RotateCcw,
  Sparkles,
  Lock
} from 'lucide-react';
import { conflictResolutionEngine } from '../../core/offline/conflictResolutionEngine';
import { ConflictRecord, ResolutionStrategy } from '../../core/offline/offlineTypes';

interface Props {
  onNavigate?: (module: string) => void;
}

export const ConflictResolutionViewer: React.FC<Props> = ({ onNavigate }) => {
  const [conflicts, setConflicts] = useState<ConflictRecord[]>(conflictResolutionEngine.getConflicts());
  const [selectedConflict, setSelectedConflict] = useState<ConflictRecord | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState<string>('');

  useEffect(() => {
    const unsub = conflictResolutionEngine.subscribe((c) => {
      setConflicts(c);
      if (!selectedConflict && c.length > 0) {
        setSelectedConflict(c[0]);
      }
    });
    return () => unsub();
  }, []);

  const handleResolve = (strategy: ResolutionStrategy) => {
    if (!selectedConflict) return;
    const notes = resolutionNotes || `Diselesaikan via strategi ${strategy}`;
    conflictResolutionEngine.resolveConflict(
      selectedConflict.id,
      strategy,
      'FOUNDER_OPERATOR',
      notes
    );
    setResolutionNotes('');
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'TIMESTAMP_CONFLICT':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      case 'DUPLICATE_WRITE':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
      case 'STALE_STATE':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      case 'MANUAL_CONFLICT':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              R733 &bull; CONFLICT RESOLUTION ENGINE
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
              <Lock className="w-3 h-3" /> ZERO DANGEROUS AUTO-MERGE
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Pusat Resolusi Konflik Sinkronisasi
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Deteksi dan isolasi tabrakan timestamp, duplicate write, stale state, dan conflict perbankan/raport.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {conflicts.some((c) => c.status === 'RESOLVED') && (
            <button
              onClick={() => conflictResolutionEngine.clearResolvedConflicts()}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all"
            >
              Bersihkan yang Sudah Selesai
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Conflict List + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Conflict List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-bold text-slate-500">
              DAFTAR KONFLIK ({conflicts.length})
            </span>
            <span className="text-xs font-mono text-slate-400">
              {conflicts.filter((c) => c.status === 'UNRESOLVED').length} belum selesai
            </span>
          </div>

          {conflicts.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Zero Pending Conflicts
              </p>
              <p className="text-xs mt-1">Tidak ada tabrakan versi yang membutuhkan tindakan.</p>
            </div>
          ) : (
            conflicts.map((conf) => (
              <div
                key={conf.id}
                onClick={() => setSelectedConflict(conf)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedConflict?.id === conf.id
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${getCategoryBadge(conf.category)}`}>
                    {conf.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      conf.status === 'UNRESOLVED'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {conf.status}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {conf.entityType} &bull; {conf.operationId}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {conf.resolutionNotes || 'Deteksi perbedaan versi antara cache offline dan SSoT.'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-2 flex items-center justify-between">
                  <span>{new Date(conf.detectedAt).toLocaleTimeString()}</span>
                  {conf.resolutionStrategy && (
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {conf.resolutionStrategy}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Conflict Inspector & Resolution Action */}
        <div className="lg:col-span-7 space-y-4">
          {selectedConflict ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold block">
                    INSPEKSI TABRAKAN DATA
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedConflict.entityType} ({selectedConflict.operationId})
                  </h3>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${getCategoryBadge(selectedConflict.category)}`}>
                  {selectedConflict.category}
                </span>
              </div>

              {/* Side-by-side versions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Local Version */}
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2">
                  <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 font-mono text-xs font-bold">
                    <span>VERSI DRAFT OFFLINE (LOKAL)</span>
                    <RotateCcw className="w-3.5 h-3.5" />
                  </div>
                  <pre className="p-3 rounded-xl bg-white/80 dark:bg-slate-950 text-[11px] font-mono text-slate-800 dark:text-amber-200 overflow-x-auto max-h-48">
                    {JSON.stringify(selectedConflict.localVersion, null, 2)}
                  </pre>
                </div>

                {/* Remote Version */}
                <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 space-y-2">
                  <div className="flex items-center justify-between text-sky-800 dark:text-sky-300 font-mono text-xs font-bold">
                    <span>VERSI SSoT AKTUAL (REMOTE)</span>
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <pre className="p-3 rounded-xl bg-white/80 dark:bg-slate-950 text-[11px] font-mono text-slate-800 dark:text-sky-200 overflow-x-auto max-h-48">
                    {JSON.stringify(selectedConflict.remoteVersion, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Resolution Form / Actions */}
              {selectedConflict.status === 'UNRESOLVED' ? (
                <div className="pt-2 space-y-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <label className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
                      Catatan Audit Resolusi:
                    </label>
                    <input
                      type="text"
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="e.g. Dipertahankan sesuai verifikasi dokumen fisik..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => handleResolve('SSOT_AUTHORITATIVE')}
                      className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs text-center transition-all"
                    >
                      Pertahankan SSoT (Tolak Lokal)
                    </button>
                    <button
                      onClick={() => handleResolve('LAST_WRITE_WINS_SAFE')}
                      className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center transition-all"
                    >
                      Terapkan Versi Lokal
                    </button>
                    <button
                      onClick={() => handleResolve('REJECT_STALE')}
                      className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs text-center transition-all"
                    >
                      Batalkan &amp; Buang (Stale)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 space-y-1 font-mono">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Konflik Telah Diselesaikan ({selectedConflict.resolutionStrategy})
                  </div>
                  <p className="text-[11px] opacity-90">
                    Oleh: {selectedConflict.resolvedBy} &bull; {selectedConflict.resolutionNotes}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-400">
              Pilih konflik di sebelah kiri untuk melihat rincian perbandingan versi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
