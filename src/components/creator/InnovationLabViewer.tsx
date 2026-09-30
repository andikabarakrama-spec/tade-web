import React, { useState, useMemo, useEffect } from 'react';
import { 
  FlaskConical, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Terminal, 
  Award, 
  MessageSquareQuote, 
  Zap, 
  Sliders, 
  RefreshCw,
  Cpu
} from 'lucide-react';
import { 
  InnovationLabManager, 
  InnovationFeatureItem, 
  InnovationFeatureStatus 
} from '../../core/creator/innovationLabManager';
import { AsyCentralIntelligenceCore } from '../../core/creator/asyCentralIntelligenceCore';

export const InnovationLabViewer: React.FC = () => {
  const labManager = useMemo(() => InnovationLabManager.getInstance(), []);
  const centralIntel = useMemo(() => AsyCentralIntelligenceCore.getInstance(), []);

  const [features, setFeatures] = useState<InnovationFeatureItem[]>(() => labManager.getFeatures());
  const [selectedFeature, setSelectedFeature] = useState<InnovationFeatureItem | null>(() => features[0] || null);
  const [notesEdit, setNotesEdit] = useState<string>('');

  useEffect(() => {
    const unsub = labManager.subscribe(setFeatures);
    return () => unsub();
  }, [labManager]);

  useEffect(() => {
    if (selectedFeature) {
      setNotesEdit(selectedFeature.founderReviewNotes || '');
    }
  }, [selectedFeature]);

  const handleUpdateStatus = (status: InnovationFeatureStatus) => {
    if (!selectedFeature) return;
    labManager.updateStatus(selectedFeature.id, status, notesEdit);
    centralIntel.recordEvent(
      'Innovation Lab',
      'INFO',
      `Status inovasi "${selectedFeature.name}" diperbarui ke [${status}].`
    );
  };

  const getStatusBadge = (status: InnovationFeatureStatus) => {
    switch (status) {
      case 'PRODUCTION_READY':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">PRODUCTION READY</span>;
      case 'FOUNDER_REVIEW':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">FOUNDER REVIEW</span>;
      case 'TESTING':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">TESTING SANDBOX</span>;
      case 'EXPERIMENTAL':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">EXPERIMENTAL</span>;
    }
  };

  return (
    <div className="space-y-6" id="innovation-lab-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5" />
                Innovation Lab & Sandbox
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R819 &bull; RC99
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Ruang Eksperimen Fitur Masa Depan
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Inkubasi fitur mutakhir dengan proteksi berlapis. Fitur terkunci secara internal dan baru dapat aktif setelah melewati tahap Founder Review dan pengujian One-Hand Mobile.
            </p>
          </div>
        </div>

        {/* Security Warning Banner */}
        <div className="mt-4 p-3 rounded-2xl bg-purple-950/40 border border-purple-800/60 flex items-center gap-2 text-xs text-purple-200">
          <Lock className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            <strong>Gated Rollout Guard:</strong> Fitur berstatus Experimental & Testing hanya dapat dijalankan di sandbox terisolasi, tidak akan terlihat oleh wali murid atau pengguna publik.
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Features List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Daftar Modul Eksperimental ({features.length})
          </h3>

          <div className="space-y-2.5">
            {features.map(f => {
              const isSelected = selectedFeature?.id === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedFeature(f)}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-purple-500/10 border-purple-500/60 shadow-lg'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{f.name}</span>
                    {getStatusBadge(f.status)}
                  </div>

                  <span className="text-[10px] font-mono text-purple-400 block">{f.codename}</span>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {f.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Stabilitas: <strong className="text-emerald-400 font-semibold">{f.stabilityScore}%</strong></span>
                    <span>Versi: {f.version}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Feature Inspector & Governance Controls */}
        <div className="lg:col-span-7 space-y-6">
          {selectedFeature ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 block">{selectedFeature.codename}</span>
                  <h2 className="text-lg font-bold text-white">{selectedFeature.name}</h2>
                </div>
                {getStatusBadge(selectedFeature.status)}
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 block">Deskripsi Inovasi:</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  {selectedFeature.description}
                </p>
              </div>

              {/* Stability Score Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    Skor Stabilitas & Optimasi Memori
                  </span>
                  <span className="font-bold text-emerald-400">{selectedFeature.stabilityScore}% (Target &ge;90%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-linear-to-r from-purple-500 to-emerald-400 rounded-full"
                    style={{ width: `${selectedFeature.stabilityScore}%` }}
                  />
                </div>
              </div>

              {/* Sandbox Toggle */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Status Sandbox Internal</span>
                  <span className="text-[10px] text-slate-400">
                    {selectedFeature.isSandboxEnabled ? 'Aktif dalam ruang uji isolasi' : 'Non-aktif'}
                  </span>
                </div>
                <button
                  onClick={() => labManager.toggleSandbox(selectedFeature.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedFeature.isSandboxEnabled
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {selectedFeature.isSandboxEnabled ? 'SANDBOX ENABLED' : 'SANDBOX DISABLED'}
                </button>
              </div>

              {/* Founder Review Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MessageSquareQuote className="w-4 h-4 text-amber-400" />
                  Catatan Founder & Accessibility QA:
                </label>
                <textarea
                  rows={3}
                  value={notesEdit}
                  onChange={(e) => setNotesEdit(e.target.value)}
                  placeholder="Tuliskan evaluasi founder mengenai kelayakan peluncuran..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-purple-500 transition"
                />
              </div>

              {/* Lifecycle Stage Switcher */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300 block">
                  Ubah Status Siklus Inovasi (Gated Promotion):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['EXPERIMENTAL', 'TESTING', 'FOUNDER_REVIEW', 'PRODUCTION_READY'] as InnovationFeatureStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(st)}
                      className={`py-2 px-1 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                        selectedFeature.status === st
                          ? 'bg-purple-500 text-slate-950 font-black shadow-md'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center text-slate-500 text-xs">
              Pilih modul di sebelah kiri untuk melihat detail inspeksi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
