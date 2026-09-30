import React, { useState } from 'react';
import { 
  GitMerge, ShieldCheck, CheckCircle2, AlertTriangle, 
  ArrowUpRight, Bot, Crown, Send, RefreshCw, Layers
} from 'lucide-react';
import { executiveEscalationChain, EscalationRecord, IncidentDomain } from '../../core/government/ExecutiveEscalationChain';

export const ExecutiveEscalationChainViewer: React.FC = () => {
  const [history, setHistory] = useState<EscalationRecord[]>(() => executiveEscalationChain.getHistory());
  const [testTitle, setTestTitle] = useState('');
  const [testDomain, setTestDomain] = useState<IncidentDomain>('OPERATIONAL');
  const [testModule, setTestModule] = useState('Kementerian Terkait');
  const [testReason, setTestReason] = useState('');

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle.trim()) return;
    executiveEscalationChain.routeIncident(testTitle, testDomain, testModule, testReason || 'Uji Rute Eskalasi Konstitusional');
    setHistory([...executiveEscalationChain.getHistory()]);
    setTestTitle('');
    setTestReason('');
  };

  return (
    <div id="executive-escalation-chain" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 rounded-3xl text-white border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <GitMerge className="w-48 h-48 text-blue-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <GitMerge className="w-4 h-4" /> R611 &bull; Executive Escalation Chain Engine &bull; Separation Doctrine
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Rantai Eskalasi Eksekutif &amp; Pemisahan Wewenang
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Memastikan perutean insiden otonom: <strong>Operasional → AI Asy</strong>, <strong>Keamanan → Guardian</strong>, serta <strong>Lintas-Kementerian &amp; Krisis → Super Admin</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Rules Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
          <div className="font-bold flex items-center gap-1 text-emerald-400">
            <Bot className="w-4 h-4" /> 1. Operasional
          </div>
          <p className="text-[11px] text-slate-300">Diputuskan langsung oleh Perdana Menteri AI Asy.</p>
        </div>
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 space-y-1">
          <div className="font-bold flex items-center gap-1 text-red-400">
            <ShieldCheck className="w-4 h-4" /> 2. Keamanan Ring 0
          </div>
          <p className="text-[11px] text-slate-300">Diputuskan langsung oleh Jenderal Tertinggi Guardian.</p>
        </div>
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
          <div className="font-bold flex items-center gap-1 text-amber-400">
            <Crown className="w-4 h-4" /> 3. Lintas-Kementerian
          </div>
          <p className="text-[11px] text-slate-300">Wajib eskalasi ke Super Admin / Ketua Yayasan.</p>
        </div>
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 space-y-1">
          <div className="font-bold flex items-center gap-1 text-rose-400">
            <AlertTriangle className="w-4 h-4" /> 4. Keadaan Krisis
          </div>
          <p className="text-[11px] text-slate-300">Deklarasi Darurat Nasional oleh Super Admin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulator Form */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-500" /> Simulasi Perutean Insiden
          </h2>
          <form onSubmit={handleSimulate} className="space-y-3">
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Judul Insiden</label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="Contoh: Sengketa anggaran PPDB vs Laboratorium"
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Domain Insiden</label>
              <select
                value={testDomain}
                onChange={(e) => setTestDomain(e.target.value as IncidentDomain)}
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-mono"
              >
                <option value="OPERATIONAL">OPERASIONAL (AI Asy)</option>
                <option value="SECURITY">KEAMANAN (Guardian)</option>
                <option value="CROSS_MINISTRY">LINTAS KEMENTERIAN (Super Admin)</option>
                <option value="CRISIS_STATE">KRISIS DARURAT (Super Admin)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Modul Asal</label>
              <input
                type="text"
                value={testModule}
                onChange={(e) => setTestModule(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Alasan Eskalasi</label>
              <textarea
                value={testReason}
                onChange={(e) => setTestReason(e.target.value)}
                placeholder="Alasan mengapa insiden membutuhkan keputusan..."
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-mono resize-none h-16"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <ArrowUpRight className="w-4 h-4" /> Kirim ke Jalur Eskalasi
            </button>
          </form>
        </div>

        {/* History Log */}
        <div className="lg:col-span-8 space-y-3">
          <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
            Riwayat Perutean Eskalasi ({history.length})
          </h3>
          <div className="space-y-3">
            {history.map((rec) => (
              <div key={rec.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {rec.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      rec.domain === 'OPERATIONAL' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      rec.domain === 'SECURITY' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {rec.domain}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400">
                    {rec.timestamp}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {rec.incidentTitle}
                </h4>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
                  <div>
                    <strong className="text-blue-500">Otoritas Pemutus:</strong> {rec.routedAuthority}
                  </div>
                  <div className="text-slate-500">
                    <strong>Alasan:</strong> {rec.escalationReason}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    📜 {rec.constitutionalClause}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
