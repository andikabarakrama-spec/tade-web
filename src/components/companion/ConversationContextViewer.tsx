import React, { useState } from 'react';
import {
  MessageSquare,
  ShieldAlert,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Clock,
  User,
  ShieldCheck
} from 'lucide-react';
import { conversationContextEngine } from '../../core/companion/conversationContextEngine';
import { ConversationContextSession } from '../../core/companion/companionTypes';

export const ConversationContextViewer: React.FC = () => {
  const [sessions, setSessions] = useState<ConversationContextSession[]>(
    conversationContextEngine.getAllSessions()
  );
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    sessions[0]?.sessionId || ''
  );

  const activeSession = sessions.find(s => s.sessionId === selectedSessionId) || sessions[0];

  const handleRefresh = () => {
    setSessions(conversationContextEngine.getAllSessions());
  };

  return (
    <div className="space-y-6" id="conversation-context-view">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> R755 Multi-Turn Dialogue Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                Strictly Advisory Mode
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <MessageSquare className="w-7 h-7 text-indigo-400" />
              Conversation Context Engine
            </h1>
            <p className="text-sm text-indigo-200/80 mt-1 max-w-2xl">
              Pengelola konteks percakapan multi-putaran Asy AI: mempertahankan topik diskusi tanpa memberikan wewenang pengambilan keputusan atau mutasi database mandiri.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Sessions
          </button>
        </div>
      </div>

      {/* Safety Directive Notice */}
      <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl flex items-center gap-3 text-xs text-indigo-200">
        <ShieldAlert className="w-5 h-5 text-indigo-400 flex-shrink-0" />
        <div>
          <span className="font-bold text-white">Guardian Ring-0 Enforcement:</span> AI Asy beroperasi dengan batas mutlak non-destruktif. Semua respon percakapan bersifat panduan konsultatif (advisory).
        </div>
      </div>

      {/* Main Split: Session List (Left) vs Session Details & State (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Session Cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Sesi Percakapan Aktif ({sessions.length})
          </h3>
          {sessions.map(s => (
            <button
              key={s.sessionId}
              onClick={() => setSelectedSessionId(s.sessionId)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedSessionId === s.sessionId
                  ? 'bg-indigo-900/30 border-indigo-500 text-white shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-semibold text-indigo-400">{s.sessionId}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {s.role}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-100">{s.activeTopic}</div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                <Clock className="w-3.5 h-3.5" /> {s.lastInteraction.split('T')[1]?.substring(0, 8)} WIB
              </div>
            </button>
          ))}
        </div>

        {/* Right 2 Cols: Session Inspection & Context Payload */}
        {activeSession && (
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  Inspeksi Konteks: {activeSession.sessionId}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">Topik Aktif: {activeSession.activeTopic}</div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Non-Autonomous Verified
              </span>
            </div>

            {/* Recent Queries Stream */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-400" /> Riwayat Pertanyaan Pengguna
              </h4>
              {activeSession.recentQueries.length > 0 ? (
                <div className="space-y-2">
                  {activeSession.recentQueries.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono"
                    >
                      <span className="text-indigo-400 font-bold mr-2">[{idx + 1}]</span>
                      {q}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/80 text-xs text-slate-400 italic">
                  Belum ada query tambahan pada sesi ini. Sesi dalam status terinisialisasi.
                </div>
              )}
            </div>

            {/* Context State Payload JSON */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-400" /> Ephemeral Context State (Memory Slice)
              </h4>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-teal-300 overflow-x-auto">
                <pre>{JSON.stringify(activeSession.contextState, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
