import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Crown, 
  Eye, 
  Film, 
  Sliders, 
  Mic,
  AlertCircle
} from 'lucide-react';
import { 
  EvolutionIntelligence, 
  EvolutionDomain, 
  EvolutionItem 
} from '../../core/operational/evolutionIntelligence';

export const EvolutionIntelligenceViewer: React.FC = () => {
  const evolution = useMemo(() => EvolutionIntelligence.getInstance(), []);
  const [selectedDomain, setSelectedDomain] = useState<EvolutionDomain | 'ALL'>('ALL');
  const [queue, setQueue] = useState<EvolutionItem[]>(() => evolution.getQueue());
  const [reviewItem, setReviewItem] = useState<EvolutionItem | null>(null);

  useEffect(() => {
    const unsub = evolution.subscribe(() => {
      setQueue(evolution.getQueue());
    });
    return unsub;
  }, [evolution]);

  const handlePromote = (id: string) => {
    evolution.updateItemStatus(id, 'FOUNDER_REVIEW', 'Disetujui Founder untuk evaluasi sandbox tingkat lanjut.');
    setReviewItem(null);
  };

  const handleReject = (id: string) => {
    evolution.updateItemStatus(id, 'REJECTED', 'Ditolak: Tidak sesuai dengan konstitusi atau nilai adab sekolah.');
    setReviewItem(null);
  };

  const filteredQueue = selectedDomain === 'ALL'
    ? queue
    : queue.filter(q => q.domain === selectedDomain);

  return (
    <div className="space-y-6" id="evolution-intelligence-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Pusat Intelijen Evolusi & Innovation Queue
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R839 &bull; RC101
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Radar Inovasi: Template, Video, Foto & Suara
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Memantau evolusi teknologi edukasi dunia. Seluruh kandidat masuk ke Innovation Queue dan dilarang masuk ke produksi tanpa Founder Review.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Prinsip Keamanan</span>
            <span className="text-xs font-bold text-amber-400 flex items-center justify-end gap-1">
              <Lock className="w-3.5 h-3.5" />
              NO AUTO DEPLOY
            </span>
          </div>
        </div>
      </div>

      {/* Domain Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'Semua Domain', icon: '🌐' },
          { id: 'TEMPLATE_TREN', label: 'Template Tren', icon: '🎨' },
          { id: 'VIDEO_STORY', label: 'Video & Reels', icon: '🎬' },
          { id: 'FOTO_OPTICS', label: 'Optik Foto', icon: '📸' },
          { id: 'SUARA_SPEECH', label: 'Sintesis Suara', icon: '🎙️' }
        ].map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDomain(d.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              selectedDomain === d.id
                ? 'bg-indigo-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>{d.icon}</span>
            <span>{d.label}</span>
          </button>
        ))}
      </div>

      {/* Innovation Queue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredQueue.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {item.domain.replace('_', ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{item.title}</h3>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                  item.readinessLevel === 'FOUNDER_REVIEW'
                    ? 'bg-amber-500 text-slate-950'
                    : item.readinessLevel === 'IN_SANDBOX'
                    ? 'bg-indigo-500 text-slate-950'
                    : item.readinessLevel === 'REJECTED'
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {item.readinessLevel.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Sumber:</span>
                  <span className="text-slate-300 font-semibold">{item.sourceInspiration}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Dampak Potensial:</span>
                  <span className="text-emerald-400 font-semibold">{item.potentialImpact}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Skor Stabilitas:</span>
                  <span className="font-mono text-indigo-400">{item.stabilityScore}/100</span>
                </div>
              </div>

              {item.founderNotes && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-[11px] text-amber-300 italic">
                  <strong>Catatan Founder:</strong> {item.founderNotes}
                </div>
              )}
            </div>

            {/* Founder Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handlePromote(item.id)}
                className="flex-1 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md"
              >
                Promosikan ke Sandbox
              </button>
              <button
                onClick={() => handleReject(item.id)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 font-bold text-xs transition cursor-pointer"
              >
                Tolak
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
