import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  GraduationCap,
  Briefcase,
  HardDrive,
  MessageSquare,
  Bell,
  Lightbulb,
  ListTree,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Compass,
  FileCheck2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { ParentDigitalCompanionViewer } from './ParentDigitalCompanionViewer';
import { TeacherDigitalCompanionViewer } from './TeacherDigitalCompanionViewer';
import { ExecutiveCompanionViewer } from './ExecutiveCompanionViewer';
import { CompanionMemoryViewer } from './CompanionMemoryViewer';
import { ConversationContextViewer } from './ConversationContextViewer';
import { SmartReminderViewer } from './SmartReminderViewer';
import { CompanionInsightCardsViewer } from './CompanionInsightCardsViewer';
import { InteractionTimelineViewer } from './InteractionTimelineViewer';
import { CompanionPrivacyGuardViewer } from './CompanionPrivacyGuardViewer';

type RC93Tab =
  | 'OVERVIEW'
  | 'PARENT'
  | 'TEACHER'
  | 'EXECUTIVE'
  | 'MEMORY'
  | 'CONTEXT'
  | 'REMINDERS'
  | 'INSIGHTS'
  | 'TIMELINE'
  | 'PRIVACY_GUARD';

export const RC93CompanionWarRoomViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RC93Tab>('OVERVIEW');

  const rc93Modules = [
    { code: 'R751', name: 'Parent Digital Companion', icon: Users, disc: 'DISC-751', tab: 'PARENT', status: 'VERIFIED' },
    { code: 'R752', name: 'Teacher Digital Companion', icon: GraduationCap, disc: 'DISC-752', tab: 'TEACHER', status: 'VERIFIED' },
    { code: 'R753', name: 'Executive Companion', icon: Briefcase, disc: 'DISC-753', tab: 'EXECUTIVE', status: 'VERIFIED' },
    { code: 'R754', name: 'Companion Memory', icon: HardDrive, disc: 'DISC-754', tab: 'MEMORY', status: 'VERIFIED' },
    { code: 'R755', name: 'Conversation Context Engine', icon: MessageSquare, disc: 'DISC-755', tab: 'CONTEXT', status: 'VERIFIED' },
    { code: 'R756', name: 'Smart Reminder Engine', icon: Bell, disc: 'DISC-756', tab: 'REMINDERS', status: 'VERIFIED' },
    { code: 'R757', name: 'Companion Insight Cards', icon: Lightbulb, disc: 'DISC-757', tab: 'INSIGHTS', status: 'VERIFIED' },
    { code: 'R758', name: 'Interaction Timeline', icon: ListTree, disc: 'DISC-758', tab: 'TIMELINE', status: 'VERIFIED' },
    { code: 'R759', name: 'Companion Privacy Guard', icon: Lock, disc: 'DISC-759', tab: 'PRIVACY_GUARD', status: 'VERIFIED' },
    { code: 'R760', name: 'RC93 Companion War Room', icon: Sparkles, disc: 'DISC-760', tab: 'OVERVIEW', status: 'VERIFIED' }
  ];

  return (
    <div className="space-y-6" id="rc93-companion-war-room">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 rounded-2xl border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> Manifest: v7.1.0-RC93
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30 font-mono">
                Hermes: DORMANT_SAFE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                100% Advisory Non-Destructive
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-emerald-400" />
              RC93 Companion War Room
            </h1>
            <p className="text-sm text-emerald-200/90 mt-1 max-w-3xl">
              Pusat orkestrasi ekosistem pendamping digital Asy Syifa: mengintegrasikan seluruh asisten cerdas untuk wali murid, guru, dan pimpinan dengan penjagaan privasi berstandar Ring-0.
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 bg-slate-950/60 p-4 rounded-xl border border-emerald-800/40 backdrop-blur-sm">
            <div className="text-xs text-slate-400 font-medium">Ecosystem Readiness:</div>
            <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" /> 10 / 10 Active
            </div>
            <div className="text-[10px] text-slate-500 font-mono">SSoT src/services/db.ts</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'OVERVIEW'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4" /> War Room Hub (R760)
        </button>
        <button
          onClick={() => setActiveTab('PARENT')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'PARENT'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Users className="w-4 h-4" /> Parent (R751)
        </button>
        <button
          onClick={() => setActiveTab('TEACHER')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'TEACHER'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Teacher (R752)
        </button>
        <button
          onClick={() => setActiveTab('EXECUTIVE')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'EXECUTIVE'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Executive (R753)
        </button>
        <button
          onClick={() => setActiveTab('MEMORY')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'MEMORY'
              ? 'bg-teal-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <HardDrive className="w-4 h-4" /> Memory (R754)
        </button>
        <button
          onClick={() => setActiveTab('CONTEXT')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'CONTEXT'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Context (R755)
        </button>
        <button
          onClick={() => setActiveTab('REMINDERS')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'REMINDERS'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Bell className="w-4 h-4" /> Reminders (R756)
        </button>
        <button
          onClick={() => setActiveTab('INSIGHTS')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'INSIGHTS'
              ? 'bg-teal-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Lightbulb className="w-4 h-4" /> Insights (R757)
        </button>
        <button
          onClick={() => setActiveTab('TIMELINE')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'TIMELINE'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ListTree className="w-4 h-4" /> Timeline (R758)
        </button>
        <button
          onClick={() => setActiveTab('PRIVACY_GUARD')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'PRIVACY_GUARD'
              ? 'bg-rose-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Lock className="w-4 h-4" /> Privacy Guard (R759)
        </button>
      </div>

      {/* Render Active Tab */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* 10 Discovery Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {rc93Modules.map(m => {
              const IconComp = m.icon;
              return (
                <div
                  key={m.code}
                  onClick={() => setActiveTab(m.tab as RC93Tab)}
                  className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl hover:border-emerald-500/40 hover:bg-slate-800/60 cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                        {m.code}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{m.disc}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-emerald-500/20 text-slate-300 group-hover:text-emerald-400 flex items-center justify-center mb-3 transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-100 text-sm mb-1">{m.name}</h3>
                  </div>
                  <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                    <span className="text-[10px] font-mono group-hover:text-emerald-300">Open &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Discovery Registry Index DISC-751 s.d DISC-760 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                Discovery Registry Index (DISC-751 — DISC-760)
              </h3>
              <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-semibold">
                Status: RATIFIED
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase">
                    <th className="py-2.5 px-3">Discovery ID</th>
                    <th className="py-2.5 px-3">Module</th>
                    <th className="py-2.5 px-3">Scope & Capability</th>
                    <th className="py-2.5 px-3">RBAC Bound</th>
                    <th className="py-2.5 px-3">Guardian Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-emerald-400">DISC-751</td>
                    <td className="py-2.5 px-3 text-slate-200">Parent Digital Companion</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Read-only agenda, tahfidz, SPP, and absensi</td>
                    <td className="py-2.5 px-3 text-slate-300">ROLE_PARENT</td>
                    <td className="py-2.5 px-3 text-emerald-400">PASS</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-emerald-400">DISC-752</td>
                    <td className="py-2.5 px-3 text-slate-200">Teacher Digital Companion</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Lesson planning, daily observation & tasks</td>
                    <td className="py-2.5 px-3 text-slate-300">ROLE_TEACHER</td>
                    <td className="py-2.5 px-3 text-emerald-400">PASS</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-emerald-400">DISC-753</td>
                    <td className="py-2.5 px-3 text-slate-200">Executive Companion</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">SITREP, risk matrix, PPDB queue, decisions</td>
                    <td className="py-2.5 px-3 text-slate-300">ROLE_EXECUTIVE</td>
                    <td className="py-2.5 px-3 text-emerald-400">PASS</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-emerald-400">DISC-754</td>
                    <td className="py-2.5 px-3 text-slate-200">Companion Memory</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Sanitized local preference cache without PII</td>
                    <td className="py-2.5 px-3 text-slate-300">UNIVERSAL</td>
                    <td className="py-2.5 px-3 text-emerald-400">PASS</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-emerald-400">DISC-755</td>
                    <td className="py-2.5 px-3 text-slate-200">Conversation Context Engine</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Ephemeral multi-turn advisory dialogue retention</td>
                    <td className="py-2.5 px-3 text-slate-300">UNIVERSAL</td>
                    <td className="py-2.5 px-3 text-emerald-400">PASS</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-emerald-400">DISC-756</td>
                    <td className="py-2.5 px-3 text-slate-200">Smart Reminder Engine</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Deduplicated priority-based notifications</td>
                    <td className="py-2.5 px-3 text-slate-300">UNIVERSAL</td>
                    <td className="py-2.5 px-3 text-emerald-400">PASS</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-emerald-400">DISC-757</td>
                    <td className="py-2.5 px-3 text-slate-200">Companion Insight Cards</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Proactive operational & academic advisory cards</td>
                    <td className="py-2.5 px-3 text-slate-300">UNIVERSAL</td>
                    <td className="py-2.5 px-3 text-emerald-400">PASS</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-emerald-400">DISC-758</td>
                    <td className="py-2.5 px-3 text-slate-200">Interaction Timeline</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Append-only unified activity & briefing stream</td>
                    <td className="py-2.5 px-3 text-slate-300">UNIVERSAL</td>
                    <td className="py-2.5 px-3 text-emerald-400">PASS</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-emerald-400">DISC-759</td>
                    <td className="py-2.5 px-3 text-slate-200">Companion Privacy Guard</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">RBAC, Guardian & Constitution access auditor</td>
                    <td className="py-2.5 px-3 text-slate-300">RING-0 GUARDIAN</td>
                    <td className="py-2.5 px-3 text-emerald-400">PASS</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-emerald-400">DISC-760</td>
                    <td className="py-2.5 px-3 text-slate-200">RC93 Companion War Room</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Unified control & compliance dashboard hub</td>
                    <td className="py-2.5 px-3 text-slate-300">EXECUTIVE / ALL</td>
                    <td className="py-2.5 px-3 text-emerald-400">PASS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'PARENT' && <ParentDigitalCompanionViewer />}
      {activeTab === 'TEACHER' && <TeacherDigitalCompanionViewer />}
      {activeTab === 'EXECUTIVE' && <ExecutiveCompanionViewer />}
      {activeTab === 'MEMORY' && <CompanionMemoryViewer />}
      {activeTab === 'CONTEXT' && <ConversationContextViewer />}
      {activeTab === 'REMINDERS' && <SmartReminderViewer />}
      {activeTab === 'INSIGHTS' && <CompanionInsightCardsViewer />}
      {activeTab === 'TIMELINE' && <InteractionTimelineViewer />}
      {activeTab === 'PRIVACY_GUARD' && <CompanionPrivacyGuardViewer />}
    </div>
  );
};
