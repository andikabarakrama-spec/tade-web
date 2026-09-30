import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Camera, 
  Smartphone, 
  ShieldCheck, 
  HardDrive, 
  UserCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Info, 
  SunMedium 
} from 'lucide-react';
import { AsyIntelligenceCouncil, MorningBriefingReport, MorningBriefingItem } from '../../core/living/asyIntelligenceCouncil';

export const IntelligenceCouncilViewer: React.FC = () => {
  const council = useMemo(() => AsyIntelligenceCouncil.getInstance(), []);
  const [report, setReport] = useState<MorningBriefingReport>(() => council.getReport());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const unsub = council.subscribe((rep) => {
      setReport(rep);
    });
    return () => unsub();
  }, [council]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      council.refreshReport();
      setIsRefreshing(false);
    }, 600);
  };

  const getItemIcon = (category: string) => {
    switch (category) {
      case 'PHOTO_MEDIA': return Camera;
      case 'VIDEO_STORY': return Smartphone;
      case 'GUARDIAN_SECURITY': return ShieldCheck;
      case 'HERMES_CONTINUITY': return HardDrive;
      case 'USER_ACTIVITY': return UserCheck;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-6" id="intelligence-council-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <SunMedium className="w-3.5 h-3.5" />
                Dewan Intelijen Asy &bull; Laporan Pagi
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R829 &bull; RC100
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% ADVISORY
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Laporan Pagi & Koordinasi Strategis Super Admin
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Ikhtisar terpadu harian mencakup foto santri siap kurasi, draf video story, kesehatan perisai Guardian, kesiapan sinkronisasi Hermes, dan aktivitas santri.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Segarkan Laporan
            </button>
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">Ringkasan Eksekutif ({report.dateStamp} - {report.generatedAt} WIB):</span>
            <p className="leading-relaxed">{report.executiveSummary}</p>
          </div>
        </div>
      </div>

      {/* Grid of Briefing Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {report.items.map((item) => {
          const Icon = getItemIcon(item.category);
          return (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white flex flex-col justify-between space-y-4 shadow-xl hover:border-slate-700 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 text-amber-400 border border-slate-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950 text-slate-400 border border-slate-800">
                    {item.urgency}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-black text-amber-400">{item.count}</span>
                    <span className="text-xs text-slate-400 font-medium">{item.unit}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-bold text-emerald-400 block mb-0.5">Saran Rekomendasi:</span>
                <p className="leading-tight text-slate-300">{item.actionRecommendation}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advisory Safeguard Note */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-center text-xs text-slate-400">
        &bull; <strong>Catatan Kedaulatan:</strong> {report.advisoryNote}
      </div>
    </div>
  );
};
