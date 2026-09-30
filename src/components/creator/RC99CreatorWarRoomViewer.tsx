import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  Activity, 
  Sliders, 
  Smartphone, 
  FileText, 
  TrendingUp, 
  Download, 
  FlaskConical, 
  Cpu, 
  ShieldCheck, 
  Globe, 
  HardDrive, 
  Clock, 
  CheckCircle2, 
  Zap, 
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { AsyCentralIntelligenceCore, CentralIntelligenceTelemetry } from '../../core/creator/asyCentralIntelligenceCore';
import { LivingActivityCenter } from './LivingActivityCenter';
import { PhotoLabEnhancer } from './PhotoLabEnhancer';
import { StoryStudioExpress } from './StoryStudioExpress';
import { TemplateIntelligenceHub } from './TemplateIntelligenceHub';
import { TrendIntelligenceCenter } from './TrendIntelligenceCenter';
import { CreatorDownloadCenter } from './CreatorDownloadCenter';
import { InnovationLabViewer } from './InnovationLabViewer';

export type RC99TabType = 
  | 'INTELLIGENCE'
  | 'ACTIVITY'
  | 'PHOTO_LAB'
  | 'STORY_STUDIO'
  | 'TEMPLATES'
  | 'TRENDS'
  | 'DOWNLOADS'
  | 'INNOVATION';

interface RC99CreatorWarRoomViewerProps {
  initialTab?: RC99TabType;
}

export const RC99CreatorWarRoomViewer: React.FC<RC99CreatorWarRoomViewerProps> = ({
  initialTab = 'INTELLIGENCE'
}) => {
  const centralIntel = useMemo(() => AsyCentralIntelligenceCore.getInstance(), []);
  const [telemetry, setTelemetry] = useState<CentralIntelligenceTelemetry>(() => centralIntel.getTelemetry());
  const [activeTab, setActiveTab] = useState<RC99TabType>(initialTab);
  const [sharedPhotoUrl, setSharedPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80');

  useEffect(() => {
    const unsub = centralIntel.subscribe(setTelemetry);
    return () => unsub();
  }, [centralIntel]);

  const tabs: Array<{ id: RC99TabType; label: string; icon: any; badge?: string }> = [
    { id: 'INTELLIGENCE', label: 'Central Core', icon: Cpu, badge: 'R811' },
    { id: 'ACTIVITY', label: 'Living Activity', icon: Activity, badge: 'R812' },
    { id: 'PHOTO_LAB', label: 'Photo Lab', icon: Sliders, badge: 'R813/14' },
    { id: 'STORY_STUDIO', label: 'Story Studio', icon: Smartphone, badge: 'R815' },
    { id: 'TEMPLATES', label: 'Templates Hub', icon: Layers, badge: 'R816' },
    { id: 'TRENDS', label: 'Trend Radar', icon: TrendingUp, badge: 'R817' },
    { id: 'DOWNLOADS', label: 'Downloads', icon: Download, badge: 'R818' },
    { id: 'INNOVATION', label: 'Innovation Lab', icon: FlaskConical, badge: 'R819' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12" id="rc99-creator-war-room">
      {/* Master Top Hub Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                RC99 Creator Command Center
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                v7.7.0-RC99 &bull; R811–R820
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Asy Central Intelligence & Creator Ecosystem
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Pusat orkestrasi 7 subsistem kreatif: Photo Lab, Story Studio Express, Living Activity Center, Trend Intelligence, Template Hub, Download Center, dan Innovation Sandbox.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2 text-right">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Health Score</span>
              <span className="text-lg font-black text-emerald-400">{telemetry.overallHealth}%</span>
            </div>
          </div>
        </div>

        {/* Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
            <span className="text-slate-400 block text-[10px]">Subsistem Online</span>
            <span className="text-sm font-bold text-white mt-0.5 block">{telemetry.onlineSubsystems} / {telemetry.totalSubsystems}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
            <span className="text-slate-400 block text-[10px]">Workflows Aktif</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{telemetry.activeWorkflows} Alur</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
            <span className="text-slate-400 block text-[10px]">Aset Terproses</span>
            <span className="text-sm font-bold text-sky-400 mt-0.5 block">{telemetry.totalAssetsProcessedToday} File</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
            <span className="text-slate-400 block text-[10px]">Alokasi Memori</span>
            <span className="text-sm font-bold text-purple-400 mt-0.5 block">{telemetry.memoryUsageMb} MB</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
            <span className="text-slate-400 block text-[10px]">Idle CPU</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{telemetry.cpuIdlePercent}% (Optimal)</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
            <span className="text-slate-400 block text-[10px]">Guardian Ring-0</span>
            <span className="text-sm font-bold text-amber-400 mt-0.5 block">ENFORCED</span>
          </div>
        </div>
      </div>

      {/* Navigation Subsystem Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-x-auto shadow-md">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${
                  active ? 'bg-slate-950/30 text-slate-900' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'INTELLIGENCE' && (
        <div className="space-y-6">
          {/* Subsystems Status Board */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  R811: Asy Central Intelligence Subsystem Status (READ-ONLY)
                </h3>
                <p className="text-xs text-slate-400">Monitoring kondisi real-time seluruh modul ekosistem creator.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {telemetry.subsystems.map(sub => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{sub.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {sub.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block">{sub.category}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {sub.notes}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Terproses: <strong className="text-white">{sub.processedCount}</strong></span>
                    <span>Latensi: <strong className="text-emerald-400">{sub.latencyMs} ms</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Coordination Event Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Event Dispatch & Coordination Audit Trail
            </h3>

            <div className="space-y-2">
              {telemetry.recentLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs"
                >
                  <span className="font-mono text-slate-500 shrink-0 text-[10px]">{log.timestamp}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold shrink-0 ${
                    log.level === 'SECURITY'
                      ? 'bg-amber-500/20 text-amber-300'
                      : log.level === 'SUCCESS'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-sky-500/20 text-sky-300'
                  }`}>
                    {log.subsystem}
                  </span>
                  <p className="text-slate-300 flex-1">{log.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ACTIVITY' && (
        <LivingActivityCenter
          onOpenPhotoLab={(url) => {
            if (url) setSharedPhotoUrl(url);
            setActiveTab('PHOTO_LAB');
          }}
          onOpenStoryStudio={(url) => {
            if (url) setSharedPhotoUrl(url);
            setActiveTab('STORY_STUDIO');
          }}
        />
      )}

      {activeTab === 'PHOTO_LAB' && (
        <PhotoLabEnhancer
          initialPhotoUrl={sharedPhotoUrl}
          onSendToStoryStudio={(url) => {
            setSharedPhotoUrl(url);
            setActiveTab('STORY_STUDIO');
          }}
          onSendToDownloadCenter={(url) => {
            setSharedPhotoUrl(url);
            setActiveTab('DOWNLOADS');
          }}
        />
      )}

      {activeTab === 'STORY_STUDIO' && (
        <StoryStudioExpress
          initialPhotoUrl={sharedPhotoUrl}
          onNavigateToDownloadCenter={() => setActiveTab('DOWNLOADS')}
        />
      )}

      {activeTab === 'TEMPLATES' && (
        <TemplateIntelligenceHub
          onSelectTemplate={(tmpl) => {
            setActiveTab('STORY_STUDIO');
          }}
        />
      )}

      {activeTab === 'TRENDS' && (
        <TrendIntelligenceCenter />
      )}

      {activeTab === 'DOWNLOADS' && (
        <CreatorDownloadCenter />
      )}

      {activeTab === 'INNOVATION' && (
        <InnovationLabViewer />
      )}
    </div>
  );
};
