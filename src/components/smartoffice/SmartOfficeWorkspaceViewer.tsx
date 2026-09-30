import React, { useState } from 'react';
import { 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  UserCheck, 
  CalendarCheck, 
  Receipt, 
  FileText, 
  Package, 
  Layers, 
  Inbox,
  Mail,
  HardDrive,
  Cpu,
  Clock
} from 'lucide-react';
import { SmartOfficeWorkspaceEngine, SmartOfficeShortcut, SmartOfficeAgendaItem, SmartOfficeSystemSnapshot } from '../../core/smartoffice/SmartOfficeWorkspaceEngine';
import { ExecutiveInboxEngine, ExecutiveInboxMessage } from '../../core/smartoffice/ExecutiveInboxEngine';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const SmartOfficeWorkspaceViewer: React.FC<{ onNavigate?: (moduleCode: string) => void }> = ({ onNavigate }) => {
  const { activeRole } = useAuth();
  const currentRole: UserRole = activeRole || 'SUPER_ADMIN';

  const workspaceEngine = SmartOfficeWorkspaceEngine.getInstance();
  const inboxEngine = ExecutiveInboxEngine.getInstance();

  const [selectedExecutiveTab, setSelectedExecutiveTab] = useState<'KETUA_YAYASAN' | 'KEPALA_SEKOLAH' | 'SUPER_ADMIN'>('SUPER_ADMIN');

  const shortcuts = workspaceEngine.getShortcuts(currentRole);
  const agendas = workspaceEngine.getAgendas(currentRole);
  const snapshot: SmartOfficeSystemSnapshot = workspaceEngine.getSystemSnapshot();
  const inboxMessages = inboxEngine.getMessagesForExecutive(selectedExecutiveTab);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'UserCheck': return <UserCheck className="w-5 h-5" />;
      case 'CalendarCheck': return <CalendarCheck className="w-5 h-5" />;
      case 'Receipt': return <Receipt className="w-5 h-5" />;
      case 'FileText': return <FileText className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'Package': return <Package className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6" id="smart-office-workspace-viewer">
      {/* Hero / Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                R711 &bull; Smart Office Workspace
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Enterprise Layer
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Pusat Kerja &amp; Ekosistem Administrasi Terpadu
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Ruang kerja cerdas untuk orkestrasi tugas aktif, agenda pimpinan, shortcut administrasi, dan snapshot kesehatan kedaulatan TK Asy-Syifa Tanggul.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="px-3 py-1.5 bg-slate-800 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Hermes: DORMANT_SAFE
            </span>
          </div>
        </div>
      </div>

      {/* R718: Founder Workspace Snapshot (Quick Glance Matrix) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Founder Operational Glance Snapshot (R718)</h2>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Live Sync: {new Date(snapshot.timestamp).toLocaleTimeString('id-ID')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Status Sistem</div>
            <div className="text-base font-black text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              {snapshot.buildStatus}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Zero Build Errors</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Guardian Ring-0</div>
            <div className="text-base font-black text-emerald-400 mt-1">
              {snapshot.guardianIntegrityScore}%
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Konsistensi Invarian</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Kesiapan Recovery</div>
            <div className="text-base font-black text-emerald-400 mt-1">
              {snapshot.recoveryReadinessScore}%
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">RTO ~2s / RPO 0s</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Antrean Tugas</div>
            <div className="text-base font-black text-sky-400 mt-1">
              {snapshot.unresolvedQueueCount} Item
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Terkumpul di R712</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Keputusan Pending</div>
            <div className="text-base font-black text-amber-400 mt-1">
              {snapshot.pendingExecutiveDecisions} Keputusan
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Menunggu Pengesahan</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Cadangan Terakhir</div>
            <div className="text-base font-black text-emerald-400 mt-1">
              {snapshot.lastBackupAgeMinutes} Menit Lalu
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">SSoT Multi-Layer</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid: Shortcuts & Agendas + Executive Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Shortcuts & Agendas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shortcuts Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                Akses Cepat Administrasi (Sesuai Peran: {currentRole})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {shortcuts.map((sc) => (
                <div
                  key={sc.id}
                  onClick={() => onNavigate && onNavigate(sc.targetModuleId)}
                  className="bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-800/40 p-4 rounded-xl transition cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-slate-900 rounded-lg text-emerald-400 group-hover:text-emerald-300 border border-slate-800">
                        {getIconComponent(sc.icon)}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-900 text-slate-400 rounded">
                        {sc.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                      {sc.label}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {sc.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-emerald-400 font-bold">
                    <span>Buka Modul</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agenda & Jadwal Kerja */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-400" />
                Agenda &amp; Jadwal Kerja Pimpinan
              </h2>
            </div>

            <div className="space-y-3">
              {agendas.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        item.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                        item.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {item.date} &bull; {item.time}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                      <span>Lokasi: {item.location}</span>
                      <span>&bull;</span>
                      <span>Penyelenggara: {item.organizer}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: R714 Executive Inbox */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Inbox className="w-5 h-5 text-amber-400" />
                Executive Inbox (R714)
              </h2>
            </div>

            {/* Executive Role Switcher */}
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedExecutiveTab(role)}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition text-center ${
                    selectedExecutiveTab === role
                      ? 'bg-slate-800 text-white shadow-sm ring-1 ring-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {role === 'SUPER_ADMIN' ? 'Super Admin' :
                   role === 'KETUA_YAYASAN' ? 'Yayasan' : 'Kepsek'}
                </button>
              ))}
            </div>

            {/* Message List */}
            <div className="space-y-3">
              {inboxMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-xl border transition ${
                    msg.isRead 
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-80' 
                      : 'bg-slate-950/80 border-slate-800 shadow-md ring-1 ring-amber-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-slate-400">{msg.senderTitle}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                      msg.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                      msg.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {msg.priority}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{msg.subject}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{msg.summary}</p>
                  
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {msg.actionRequired}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(msg.timestamp).toLocaleTimeString('id-ID')}
                    </span>
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
