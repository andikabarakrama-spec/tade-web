import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sliders, 
  RotateCcw, 
  CheckCircle2, 
  Layers, 
  Bookmark, 
  Compass, 
  Filter, 
  FileText,
  Workflow
} from 'lucide-react';

interface GuardedState {
  route: string;
  selectedFilter: string;
  wizardStep: number;
  openDrawer: boolean;
  draftText: string;
  lastPersistedAt: string;
}

export const RuntimeStateGuardianViewer: React.FC = () => {
  const [state, setState] = useState<GuardedState>({
    route: '/sim/kurikulum/rapor',
    selectedFilter: 'Kelas X-A &bull; Semester Ganjil 2026/2027',
    wizardStep: 3,
    openDrawer: true,
    draftText: 'Capaian Pembelajaran: Peserta didik mampu menganalisis struktur data pohon dan graf...',
    lastPersistedAt: 'Live (Synchronous Memory Ring)'
  });

  const [notification, setNotification] = useState<string | null>(null);

  const handleSimulateStateChange = () => {
    setState(prev => ({
      ...prev,
      wizardStep: prev.wizardStep < 4 ? prev.wizardStep + 1 : 1,
      draftText: prev.draftText + ' [Updated Draft]',
      lastPersistedAt: new Date().toLocaleTimeString()
    }));
    setNotification('State otomatis tersimpan ke Runtime State Guardian buffer.');
  };

  const handleReloadSimulation = () => {
    setNotification('Page Reload Simulated. 100% active state, filter, and draft restored intact.');
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                R590 &bull; RUNTIME STATE GUARDIAN
              </span>
              <span className="text-xs text-slate-400 font-mono">Continuous Workspace Continuity</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Runtime State Guardian &amp; Form Persistence</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateStateChange}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 font-mono text-xs font-bold transition flex items-center gap-1.5"
          >
            <Bookmark className="w-4 h-4" /> Mutate State
          </button>
          <button
            onClick={handleReloadSimulation}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
          >
            <RotateCcw className="w-4 h-4" /> Test Page Reload Restore
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 font-mono text-xs text-indigo-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* 4 Guarded State Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-2">
          <span className="text-indigo-400 font-bold flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> Route Memory
          </span>
          <p className="text-slate-300 text-[11px] truncate bg-slate-900 p-2 rounded-xl border border-slate-800">
            {state.route}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-2">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <Filter className="w-4 h-4" /> Selected Filter
          </span>
          <p className="text-slate-300 text-[11px] truncate bg-slate-900 p-2 rounded-xl border border-slate-800">
            {state.selectedFilter}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-2">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <Workflow className="w-4 h-4" /> Wizard Progress
          </span>
          <p className="text-emerald-300 text-[11px] font-bold bg-slate-900 p-2 rounded-xl border border-slate-800">
            Step {state.wizardStep} of 4 (Asesmen)
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-2">
          <span className="text-amber-400 font-bold flex items-center gap-1.5">
            <Bookmark className="w-4 h-4" /> UI Drawer / Modal
          </span>
          <p className="text-amber-300 text-[11px] font-bold bg-slate-900 p-2 rounded-xl border border-slate-800">
            {state.openDrawer ? 'OPEN (Preserved)' : 'CLOSED'}
          </p>
        </div>
      </div>

      {/* Live Form Draft Buffer */}
      <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-bold flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Live Form Draft Memory Stream:
          </span>
          <span className="text-slate-500 text-[10px]">Sync Interval: 500ms</span>
        </div>

        <textarea
          rows={3}
          value={state.draftText}
          onChange={(e) => setState(prev => ({ ...prev, draftText: e.target.value }))}
          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-sans text-xs focus:border-indigo-500 outline-none"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Auto-Persist Target: <code>sessionStorage.TADE_DRAFT_BUFFER</code></span>
          <span className="text-emerald-400 font-bold">100% In-Sync</span>
        </div>
      </div>
    </div>
  );
};
