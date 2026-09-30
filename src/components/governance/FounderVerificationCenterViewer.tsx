import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Award, 
  FileText, 
  Terminal, 
  AlertCircle,
  Clock,
  RotateCcw,
  Check
} from 'lucide-react';
import { FounderVerificationCenter, FounderVerificationRecord } from '../../core/governance/FounderVerificationCenter';

export const FounderVerificationCenterViewer: React.FC = () => {
  const center = FounderVerificationCenter.getInstance();
  const [record, setRecord] = useState<FounderVerificationRecord>(() => center.getRecord());
  const [founderNotes, setFounderNotes] = useState<string>(record.founderNotes || '');
  const [showSignModal, setShowSignModal] = useState<boolean>(false);

  const handleToggleItem = (id: string) => {
    center.toggleItemStatus(id);
    setRecord(center.getRecord());
  };

  const handleSignOff = () => {
    center.setFounderSignOff(founderNotes || 'Disetujui dan disahkan secara penuh oleh Founder TK Asy-Syifa.');
    setRecord(center.getRecord());
    setShowSignModal(false);
  };

  const handleReset = () => {
    center.resetAllToDefault();
    setRecord(center.getRecord());
    setFounderNotes(center.getRecord().founderNotes);
  };

  return (
    <div className="space-y-6" id="founder-verification-center-viewer">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Award className="w-3 h-3" />
                Sovereign Governance & Sign-Off
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R702
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Founder Verification Center
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Pusat audit dan pengesahan formal Founder atas 9 pilar kelayakan teknis, stabilitas kompilasi, kepatuhan Guardian, dan ketahanan data sebelum lock final.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Checklist
            </button>
            <button
              onClick={() => setShowSignModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg"
            >
              <ShieldCheck className="w-4 h-4" />
              Sahkan Verifikasi Founder
            </button>
          </div>
        </div>
      </div>

      {/* Verification Status Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Status Pengesahan Rilis: {record.rcVersion}
          </div>
          <div className="text-lg font-black text-white flex items-center gap-2">
            <span>{record.overallVerdict === 'FOUNDER_VERIFIED_LOCKED' ? 'TERVERIFIKASI & DISEGEL OLEH FOUNDER' : 'IMPLEMENTED — FOUNDER VERIFICATION REQUIRED'}</span>
          </div>
          <div className="text-xs text-slate-400">
            Catatan Founder: <span className="text-emerald-400 font-semibold">{record.founderNotes}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400 uppercase">Checklist Lulus</div>
            <div className="text-2xl font-black text-emerald-400">{record.verifiedCount} / {record.totalChecklists}</div>
          </div>
          <div className="h-10 w-px bg-slate-800 hidden md:block" />
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400 uppercase">Status Kelayakan</div>
            <span className={`inline-block mt-0.5 px-3 py-0.5 rounded-full text-xs font-extrabold ${
              record.verifiedCount === record.totalChecklists
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {record.verifiedCount === record.totalChecklists ? '100% SIAP RILIS' : 'PERLU REVIEW'}
            </span>
          </div>
        </div>
      </div>

      {/* 9 Checklist Items Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              9 Vektor Checklist Verifikasi Mutu & Kepatuhan
            </h3>
          </div>
          <span className="text-xs text-slate-400">Klik ikon status untuk verifikasi manual</span>
        </div>

        <div className="space-y-3">
          {record.checklists.map((item, idx) => {
            const isVerified = item.status === 'VERIFIED';
            return (
              <div 
                key={item.id}
                className={`p-4 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isVerified ? 'bg-slate-950/80 border-slate-800' : 'bg-amber-950/20 border-amber-800/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button 
                    onClick={() => handleToggleItem(item.id)}
                    className="mt-0.5 text-emerald-400 hover:text-emerald-300 transition"
                  >
                    {isVerified ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-500/20 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{item.description}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono pt-1">
                      <Terminal className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.commandSnippet}</span>
                    </div>
                  </div>
                </div>

                <div className="md:text-right space-y-1 pl-8 md:pl-0">
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                    isVerified ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.status}
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {item.verifiedBy || 'Belum ditandatangani'}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold max-w-xs md:ml-auto">
                    {item.evidenceNotes}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Founder Sign-off Modal */}
      {showSignModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
              <ShieldCheck className="w-6 h-6" />
              <span>Pengesahan Mandat Founder</span>
            </div>

            <p className="text-xs text-slate-300">
              Dengan menandatangani pengesahan ini, Anda menyatakan bahwa seluruh 9 pilar checklist telah diperiksa, Hermes tetap berstatus Dormant, SSoT db.ts terjaga utuh, dan rilis TADE RC88 siap dikunci.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Catatan Otorisasi Founder:</label>
              <textarea
                value={founderNotes}
                onChange={(e) => setFounderNotes(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="Tuliskan catatan otorisasi atau instruksi rilis..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSignModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Batal
              </button>
              <button
                onClick={handleSignOff}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Sahkan & Kunci Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
