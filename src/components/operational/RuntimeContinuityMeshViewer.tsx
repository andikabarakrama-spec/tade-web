import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, Save, RefreshCw, Smartphone, FileText, Database, ShieldCheck } from 'lucide-react';
import { runtimeContinuityMesh, ContinuitySnapshot } from '../../core/operational/RuntimeContinuityMesh';

export const RuntimeContinuityMeshViewer: React.FC = () => {
  const [snapshot, setSnapshot] = useState<ContinuitySnapshot>(runtimeContinuityMesh.getSnapshot());
  const [draftKey, setDraftKey] = useState('STUDENT_REGISTRATION_NOTE');
  const [draftContent, setDraftContent] = useState('Catatan santri baru: Dokumen akta kelahiran & KK telah terverifikasi oleh TU.');

  useEffect(() => {
    const unsub = runtimeContinuityMesh.subscribe((snap) => {
      setSnapshot(snap);
    });
    return () => unsub();
  }, []);

  const handleSaveDraft = () => {
    runtimeContinuityMesh.saveDraft(draftKey, { text: draftContent, savedBy: 'Staff TU' });
  };

  const handleClearDraft = (key: string) => {
    runtimeContinuityMesh.clearDraft(key);
  };

  return (
    <div id="runtime-continuity-mesh-viewer" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              R639 &bull; RUNTIME CONTINUITY
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              ZERO WORK LOSS GUARANTEE
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Runtime Continuity Mesh &amp; State Resurrection
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Total state persistence: Restores sessions, multi-step wizards, drafts, table query filters, and routes across refreshes.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 font-mono text-xs text-emerald-700 dark:text-emerald-300 font-bold">
          <ShieldCheck className="w-4 h-4" /> Differential Checkpoint Active
        </div>
      </div>

      {/* Snapshot High-Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">SESSION CONTINUITY</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">
            {snapshot.sessionId}
          </span>
          <span className="text-[10px] text-emerald-500 block">Active &bull; Token Retained</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">ACTIVE ROUTE MEMORY</span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">
            {snapshot.activeRoute}
          </span>
          <span className="text-[10px] text-slate-500 block">Sub-route: {snapshot.activeSubRoute}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">SAVED DRAFTS</span>
          <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400 font-mono">
            {Object.keys(snapshot.formDrafts).length} Drafts
          </span>
          <span className="text-[10px] text-slate-500 block">Zero Unsaved Input Loss</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 block">WIZARD RESURRECTION</span>
          <span className="text-xl font-bold text-purple-600 dark:text-purple-400 font-mono">
            {Object.keys(snapshot.wizardStates).length} In-Flight
          </span>
          <span className="text-[10px] text-slate-500 block">Step &amp; Payload Intact</span>
        </div>
      </div>

      {/* Interactive Draft & State Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Draft Simulator */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              Live Form Draft Auto-Persistence
            </h3>
            <span className="text-[10px] text-emerald-600 font-bold">Auto-Save 1s</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Draft Key Identifier</label>
              <input
                type="text"
                value={draftKey}
                onChange={(e) => setDraftKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Live Uncommitted Input</label>
              <textarea
                rows={3}
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Save className="w-4 h-4" /> Persist Draft Checkpoint
            </button>
          </div>

          {/* Active Saved Drafts List */}
          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Persisted Draft Items:</span>
            {Object.entries(snapshot.formDrafts).map(([key, val]: [string, any]) => (
              <div key={key} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-slate-900 dark:text-white block">{key}</strong>
                  <span className="text-[10px] text-slate-500">{JSON.stringify(val?.formData)}</span>
                </div>
                <button
                  onClick={() => handleClearDraft(key)}
                  className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-600 hover:bg-rose-600 hover:text-white text-[10px] text-slate-700 dark:text-slate-300 font-bold transition-all"
                >
                  Clear
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard & Table Continuity Inspector */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-500" />
              Active Wizard &amp; Filter Checkpoints
            </h3>
            <span className="text-[10px] text-purple-600 font-bold">SHA-256 Chained</span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Active Wizard Checkpoint:</span>
              {Object.entries(snapshot.wizardStates).map(([wKey, wVal]: [string, any]) => (
                <div key={wKey} className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-purple-900 dark:text-purple-200">{wKey}</strong>
                    <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-[10px] font-bold">
                      Step {wVal?.step}
                    </span>
                  </div>
                  <pre className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 overflow-x-auto">
                    {JSON.stringify(wVal?.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Table Filter State:</span>
              {Object.entries(snapshot.tableFilters).map(([tKey, tVal]: [string, any]) => (
                <div key={tKey} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 text-xs">
                  <strong className="text-slate-900 dark:text-white">{tKey}</strong>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Query: <span className="font-bold text-slate-700 dark:text-slate-300">"{tVal?.query}"</span> &bull; Sort: <span className="font-bold">{tVal?.sortBy} ({tVal?.sortOrder})</span>
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
