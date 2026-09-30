import React, { useState } from 'react';
import {
  Briefcase,
  ShieldCheck,
  TrendingUp,
  AlertOctagon,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  FileCheck2,
  Lock,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { companionInsightEngine } from '../../core/companion/companionInsightEngine';
import { conversationContextEngine } from '../../core/companion/conversationContextEngine';

export const ExecutiveCompanionViewer: React.FC = () => {
  const [execQuery, setExecQuery] = useState('');
  const [execBriefing, setExecBriefing] = useState<string | null>(
    'SITREP EKSEKUTIF: Seluruh operasional berjalan dalam integritas 100%. Tidak ada pelanggaran Ring-0, arus kas infaq tercapai 91%, dan antrean validasi PPDB dalam batas aman.'
  );

  const insights = companionInsightEngine.getInsightsForRole('EXECUTIVE');

  const handleAskExecutiveAsy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!execQuery.trim()) return;

    const session = conversationContextEngine.createOrGetSession('EXECUTIVE', 'founder-01', 'Executive SITREP');
    conversationContextEngine.appendQuery(session.sessionId, execQuery);

    if (execQuery.toLowerCase().includes('risiko') || execQuery.toLowerCase().includes('risk')) {
      setExecBriefing(
        'Matriks Risiko Terkini: 1) Risiko Keterlambatan Verifikasi PPDB: Rendah (18 berkas pending, SLA rata-rata 3.2 jam). 2) Risiko Integritas Data: Nihil (Zero cryptographic drift, SHA-256 verified). 3) Risiko Finansial: Sangat Rendah (Kas operasional surplus 2.4x kebutuhan bulanan).'
      );
    } else if (execQuery.toLowerCase().includes('keuangan') || execQuery.toLowerCase().includes('kas')) {
      setExecBriefing(
        'Posisi Keuangan Lembaga: Penerimaan SPP & Infaq bulan Agustus tercatat Rp 48.500.000 (91.5% dari target Rp 53.000.000). Alokasi operasional sentra & makan sehat terpenuhi penuh tanpa penundaan.'
      );
    } else {
      setExecBriefing(
        `Analisis Pimpinan terkait "${execQuery}": Berdasarkan SSoT v7, seluruh metrik stabilitas tata kelola berada pada level HIGH COMPLIANCE. Rekomendasi kebijakan: fokus pada finalisasi kuota rombel gelombang 2.`
      );
    }
    setExecQuery('');
  };

  return (
    <div className="space-y-6" id="executive-digital-companion-view">
      {/* Top Sovereign Executive Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-purple-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> R753 Executive Companion
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                RBAC: ROLE_FOUNDER / EXECUTIVE
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <Briefcase className="w-7 h-7 text-purple-400" />
              Executive Digital Companion
            </h1>
            <p className="text-sm text-purple-200/80 mt-1 max-w-2xl">
              Pusat komando pimpinan dan dewan pengurus yayasan: pemantauan SITREP kelembagaan, analisis risiko terpadu, serta rekomendasi strategis non-destruktif.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-purple-950/60 p-3 rounded-xl border border-purple-800/50 backdrop-blur-sm">
            <div className="text-right">
              <div className="text-xs text-purple-300 font-medium">Status Kelembagaan:</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-4 h-4" /> SOVEREIGN & SECURE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Executive Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: SITREP */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
              <Activity className="w-4 h-4" /> SITREP Status
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              NOMINAL
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100">100% Siap</div>
          <div className="text-xs text-slate-400 mt-1">Zero Breach • SSoT Terverifikasi</div>
        </div>

        {/* Card 2: Financial Infaq */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5 uppercase">
              <TrendingUp className="w-4 h-4" /> Arus Kas Masuk
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              91.5% Target
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100">Rp 48.5 Jt</div>
          <div className="text-xs text-slate-400 mt-1">Total Target: Rp 53.0 Juta</div>
        </div>

        {/* Card 3: PPDB Queue */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
              <Layers className="w-4 h-4" /> Antrean PPDB G2
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              18 Pending
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100">92% Terisi</div>
          <div className="text-xs text-slate-400 mt-1">Kuota Rombel TK A & TK B</div>
        </div>

        {/* Card 4: Guardian Ring-0 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5 uppercase">
              <Lock className="w-4 h-4" /> Guardian Ring-0
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              Hermes Dormant
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-300">0 Violations</div>
          <div className="text-xs text-slate-400 mt-1">Sha-256 Ledger Locked</div>
        </div>
      </div>

      {/* Main Split: AI Executive Advisory + Strategic Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Advisory Briefing Engine */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">Asy AI Executive Strategic Advisor</h3>
                  <p className="text-xs text-slate-400">Pemberi rekomendasi kebijakan kelembagaan • Strictly non-autonomous</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Sovereign Advisory
              </span>
            </div>

            {/* Briefing Box */}
            {execBriefing && (
              <div className="bg-slate-950/70 border border-purple-500/20 rounded-xl p-4 mb-4 text-slate-200 text-sm leading-relaxed flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex-shrink-0 flex items-center justify-center text-purple-400 text-xs font-bold">
                  Asy
                </div>
                <div className="flex-1">{execBriefing}</div>
              </div>
            )}

            {/* Suggested Strategic Queries */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                'Analisis komparasi pendaftar PPDB tahun lalu vs sekarang',
                'Status kepatuhan kebijakan Guardian Ring-0 & Constitution',
                'Rincian proyeksi belanja operasional bulan depan',
                'Evaluasi kesiapan bencana & offline continuity'
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setExecQuery(q)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAskExecutiveAsy} className="flex gap-2 pt-3 border-t border-slate-800">
            <input
              type="text"
              value={execQuery}
              onChange={e => setExecQuery(e.target.value)}
              placeholder="Ketik konsultasi strategis pimpinan..."
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-purple-900/30"
            >
              <Sparkles className="w-4 h-4" /> Konsultasi
            </button>
          </form>
        </div>

        {/* Right 1 Col: Decision Queue & Key Insights */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2 mb-3">
              <FileCheck2 className="w-5 h-5 text-purple-400" />
              Keputusan Pending ({insights.length})
            </h3>
            <div className="space-y-3">
              {insights.map(c => (
                <div key={c.insightId} className="p-3 bg-slate-950/60 border border-purple-500/20 rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{c.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                      {c.confidenceScore}% Acc
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{c.recommendation}</p>
                  <div className="pt-1 text-[10px] text-purple-400/80 font-mono">
                    Kategori: {c.category} • {c.metricValue}
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
