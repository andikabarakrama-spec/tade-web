import React, { useState } from 'react';
import { 
  Briefcase, 
  ListOrdered, 
  FileText, 
  History, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  BarChart3, 
  Gauge, 
  Award 
} from 'lucide-react';
import { SmartOfficeWorkspaceViewer } from './SmartOfficeWorkspaceViewer';
import { UnifiedAdministrativeQueueViewer } from './UnifiedAdministrativeQueueViewer';
import { SmartDocumentCenterViewer } from './SmartDocumentCenterViewer';
import { AdministrativeTimelineViewer } from './AdministrativeTimelineViewer';
import { CrossModuleConsistencyAuditorViewer } from './CrossModuleConsistencyAuditorViewer';

export const RC89SmartOfficeWarRoomViewer: React.FC<{ onNavigate?: (moduleCode: string) => void }> = ({ onNavigate }) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'workspace' | 'queue' | 'documents' | 'timeline' | 'auditor'>('overview');

  const subTabs = [
    { id: 'overview', label: 'RC89 Enterprise Overview', icon: Layers, badge: 'R720' },
    { id: 'workspace', label: 'Smart Office Workspace', icon: Briefcase, badge: 'R711, R714, R718' },
    { id: 'queue', label: 'Administrative Queue & Priority', icon: ListOrdered, badge: 'R712, R713' },
    { id: 'documents', label: 'Smart Document Center', icon: FileText, badge: 'R715' },
    { id: 'timeline', label: 'Timeline & Notifications', icon: History, badge: 'R716, R717' },
    { id: 'auditor', label: 'Consistency Auditor', icon: ShieldCheck, badge: 'R719' },
  ];

  return (
    <div className="space-y-6" id="rc89-smart-office-war-room-viewer">
      {/* Sub-tab Switcher Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex flex-wrap gap-2 shadow-lg">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-1 min-w-[190px] flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs transition ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md ring-1 ring-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-950/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-950 text-slate-500'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Overview Screen */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    RC89 Enterprise Orchestration Layer
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    Manifest v6.7.0-RC89
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  RC89 Smart Office Enterprise War Room (R720)
                </h1>
                <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                  Pusat orkestrasi administrasi terpadu, antrean tugas cerdas lintas domain, indeks khazanah dokumen, linimasa kegiatan tak terubah, dan audit konsistensi arsitektur TK Asy-Syifa Digital Ecosystem.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-slate-800 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Hermes: DORMANT_SAFE (Zero Production Executor)
                </span>
              </div>
            </div>
          </div>

          {/* 10-Point RC89 Architecture Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R711 &bull; Workspace</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Smart Office Workspace Center</div>
              <p className="text-xs text-slate-400">Pusat kerja terpadu untuk orkestrasi tugas, agenda, pengumuman, dan shortcut.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R712 &bull; Queue</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Unified Administrative Queue</div>
              <p className="text-xs text-slate-400">Pengumpulan antrean tugas PPDB, Absensi, Tabungan, SPP, Infaq, dan Surat.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R713 &bull; Priority</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Intelligent Priority Engine</div>
              <p className="text-xs text-slate-400">Evaluasi bobot prioritas (CRITICAL, HIGH, MEDIUM, LOW) berbasis urgensi dan dampak.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R714 &bull; Executive Inbox</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Executive Inbox Pimpinan</div>
              <p className="text-xs text-slate-400">Pemisahan pesan strategis Ketua Yayasan, Kepala Sekolah, dan Super Admin.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R715 &bull; Document Center</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Smart Document Center</div>
              <p className="text-xs text-slate-400">Indeks pencarian surat resmi, laporan, template formulir, dan arsip yayasan.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R716 &bull; Activity Timeline</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Administrative Activity Timeline</div>
              <p className="text-xs text-slate-400">Linimasa historis gabungan keputusan (R706), komando (R708), dan snapshot recovery.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R717 &bull; Smart Notif</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Smart Notification Router</div>
              <p className="text-xs text-slate-400">Routing notifikasi internal sesuai RBAC dengan deduplikasi bebas spam dan nol biaya.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R718 &bull; Snapshot</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Founder Workspace Snapshot</div>
              <p className="text-xs text-slate-400">Matriks sekilas pandang kedaulatan, kesehatan sistem, dan keputusan pending.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>R719 &bull; Consistency</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold text-white">Cross-Module Consistency Auditor</div>
              <p className="text-xs text-slate-400">Pemeriksaan referensi yatim, duplikasi registri, dan kepatuhan SSoT (Report-Only).</p>
            </div>
          </div>
        </div>
      )}

      {/* Render Active View */}
      {activeSubTab === 'workspace' && <SmartOfficeWorkspaceViewer onNavigate={onNavigate} />}
      {activeSubTab === 'queue' && <UnifiedAdministrativeQueueViewer onNavigate={onNavigate} />}
      {activeSubTab === 'documents' && <SmartDocumentCenterViewer />}
      {activeSubTab === 'timeline' && <AdministrativeTimelineViewer />}
      {activeSubTab === 'auditor' && <CrossModuleConsistencyAuditorViewer />}
    </div>
  );
};
