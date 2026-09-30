import React, { useState } from 'react';
import { 
  Crown, ShieldCheck, FileCheck2, AlertTriangle, CheckCircle2, 
  XCircle, Award, Sparkles, RefreshCw, Send, Lock
} from 'lucide-react';
import { sovereignCommandCenter, ExecutiveApprovalRequest, SovereignDecree } from '../../core/government/SovereignCommandCenter';

export const SovereignCommandCenterViewer: React.FC = () => {
  const [approvals, setApprovals] = useState<ExecutiveApprovalRequest[]>(() => sovereignCommandCenter.getPendingApprovals());
  const [decrees, setDecrees] = useState<SovereignDecree[]>(() => sovereignCommandCenter.getIssuedDecrees());
  const [overrideText, setOverrideText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    sovereignCommandCenter.approveRequest(id, 'KETUA_YAYASAN');
    setApprovals([...sovereignCommandCenter.getPendingApprovals()]);
    setFeedback(`Permohonan ${id} telah disahkan dengan Segel Digital Ketua Yayasan.`);
  };

  const handleReject = (id: string) => {
    sovereignCommandCenter.rejectRequest(id);
    setApprovals([...sovereignCommandCenter.getPendingApprovals()]);
    setFeedback(`Permohonan ${id} telah ditolak oleh Otoritas Eksekutif.`);
  };

  const handleIssueOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideText.trim()) return;
    const decree = sovereignCommandCenter.issueEmergencyOverride(overrideText, 'KETUA_YAYASAN');
    setDecrees([...sovereignCommandCenter.getIssuedDecrees()]);
    setOverrideText('');
    setFeedback(`Dekrit Darurat Berhasil Diterbitkan: ${decree.decreeNumber}`);
  };

  return (
    <div id="sovereign-command-center" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 p-6 rounded-3xl text-white border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Crown className="w-48 h-48 text-amber-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Crown className="w-4 h-4" /> R605 &bull; Sovereign Command Center &bull; One Sovereign Principle
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Pusat Komando Kedaulatan Tertinggi
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Pusat keputusan eksklusif Ketua Yayasan &amp; Super Admin. Menegakkan One Sovereign Principle, pengesahan dekrit strategis, dan intervensi darurat (emergency override).
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> SUPER ADMIN / KETUA YAYASAN
            </span>
            <span className="text-[11px] font-mono text-slate-400">Ring -1 Sovereign Domain</span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {feedback}
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Grid: Approvals vs Decrees */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Executive Approval Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-amber-500" /> Antrean Otorisasi Strategis
            </h2>
            <span className="text-xs font-mono text-slate-500">
              {approvals.filter(a => a.status === 'PENDING').length} Menunggu Keputusan
            </span>
          </div>

          <div className="space-y-3">
            {approvals.map((req) => (
              <div 
                key={req.id} 
                className={`p-5 rounded-2xl border transition-all ${
                  req.status === 'APPROVED' 
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30' 
                    : req.status === 'REJECTED'
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-500/30'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 mr-2">
                      {req.id}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      req.urgency === 'CRITICAL_NATIONAL'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                    }`}>
                      {req.urgency}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {req.title}
                    </h3>
                  </div>
                  <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full ${
                    req.status === 'APPROVED' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                      : req.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                  {req.description}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 text-[11px] space-y-1 mb-3">
                  <div className="text-slate-500 dark:text-slate-400">
                    <strong className="text-slate-700 dark:text-slate-300">Asal:</strong> {req.source} | <strong className="text-slate-700 dark:text-slate-300">Dampak:</strong> {req.impactAssessment}
                  </div>
                  {req.signature && (
                    <div className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">
                      ✓ Disahkan: {req.signature}
                    </div>
                  )}
                </div>

                {req.status === 'PENDING' && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Sahkan Otorisasi
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-rose-600 hover:text-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Tolak
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Emergency Override & Decrees */}
        <div className="lg:col-span-5 space-y-6">
          {/* Emergency Override Form */}
          <div className="p-5 rounded-3xl bg-amber-500/5 border border-amber-500/20 space-y-4">
            <h2 className="text-sm font-bold text-amber-500 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Emergency Sovereign Override
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Intervensi langsung Ketua Yayasan yang mengabaikan birokrasi standar untuk perlindungan keselamatan sistem secara mutlak.
            </p>
            <form onSubmit={handleIssueOverride} className="space-y-3">
              <textarea
                value={overrideText}
                onChange={(e) => setOverrideText(e.target.value)}
                placeholder="Tuliskan instruksi darurat (misal: Bekukan seluruh akses kas & alihkan ke mode pemulihan total)..."
                className="w-full p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none h-24 font-mono"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" /> Terbitkan Dekrit Darurat Sovereign
              </button>
            </form>
          </div>

          {/* Issued Decrees List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Dekrit &amp; Maklumat Kedaulatan ({decrees.length})
            </h3>
            {decrees.map((dec) => (
              <div key={dec.decreeNumber} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                    {dec.decreeNumber}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                    {dec.effectiveDate}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {dec.title}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {dec.content}
                </p>
                <div className="text-[9px] font-mono text-slate-400 truncate">
                  Segel: {dec.digitalSealSha256}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
