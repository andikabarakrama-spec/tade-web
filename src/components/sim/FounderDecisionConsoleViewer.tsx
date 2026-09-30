import React, { useState } from 'react';
import { 
  Crown, 
  ShieldCheck, 
  Bot, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  FileCheck2, 
  TrendingUp, 
  ArrowUpRight, 
  Users, 
  DollarSign, 
  Sparkles,
  Zap
} from 'lucide-react';

export const FounderDecisionConsoleViewer: React.FC = () => {
  const [decisions, setDecisions] = useState([
    {
      id: 'DEC-01',
      title: 'Persetujuan Ekspansi Kuota Gelombang 2 PPDB',
      department: 'Akademik & PPDB',
      impact: 'Penambahan 2 kelas baru (60 siswa) dengan estimasi pemasukan Rp 180.000.000',
      guardianStatus: 'CLEAN (Kapasitas server & izin aman)',
      aiAsyRecommendation: 'Disarankan segera disetujui untuk mengunci animo wali murid.',
      status: 'PENDING'
    },
    {
      id: 'DEC-02',
      title: 'Otorisasi Pencairan Dana BOS Triwulan III',
      department: 'Keuangan & Sarpras',
      impact: 'Pengadaan 15 unit PC Laboratorium Komputer dan pemeliharaan genset',
      guardianStatus: 'VERIFIED (Audit log kasir sinkron 100%)',
      aiAsyRecommendation: 'Sesuai dengan RAPBS Tahun Ajaran 2026/2027.',
      status: 'PENDING'
    },
    {
      id: 'DEC-03',
      title: 'Penetapan Standar KKM Baru Kurikulum Merdeka',
      department: 'Kurikulum & Rapor',
      impact: 'Penyesuaian bobot asesmen formatif 60% dan sumatif 40%',
      guardianStatus: 'CLEAN (Format rapor lolos validasi Kemendikbud)',
      aiAsyRecommendation: 'Meningkatkan transparansi capaian kompetensi santri/siswa.',
      status: 'PENDING'
    }
  ]);

  const [approvedCount, setApprovedCount] = useState<number>(0);

  const handleApprove = (id: string) => {
    setDecisions(prev => prev.map(d => d.id === id ? { ...d, status: 'APPROVED' } : d));
    setApprovedCount(prev => prev + 1);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30 text-amber-400">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50">
                R583 &bull; FOUNDER DECISION CONSOLE
              </span>
              <span className="text-xs text-slate-400 font-mono">Executive Command &bull; Ketua Yayasan</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Founder Decision Console &amp; Executive Telemetry</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-xs text-emerald-400 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            {approvedCount} Keputusan Disahkan Hari Ini
          </span>
        </div>
      </div>

      {/* Top 3 Strategic Pillars (Dual Cognition Anchor) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {/* Pillar 1: Guardian Alert (Left Hand) */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-rose-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-rose-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Guardian Security (Tangan Kiri)
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px]">
              0 ANOMALI
            </span>
          </div>
          <p className="text-slate-300 font-sans text-xs">
            Seluruh 12 engine dan 7 role beroperasi dalam isolasi Ring 0. Brankas data keuangan dan rapor terkunci rapat.
          </p>
        </div>

        {/* Pillar 2: AI Asy Insight (Right Hand) */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Bot className="w-4 h-4" />
              AI Asy Intelligence (Tangan Kanan)
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px]">
              OPTIMAL
            </span>
          </div>
          <p className="text-slate-300 font-sans text-xs">
            Tingkat kepuasan wali murid PPDB mencapai 99.2%. Disarankan merilis pengumuman seleksi berkas tepat waktu sore ini.
          </p>
        </div>

        {/* Pillar 3: Operational Risk Index */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-indigo-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-indigo-400 font-bold flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              Indeks Risiko Operasional
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-bold text-[10px]">
              RENDAH (0.2%)
            </span>
          </div>
          <p className="text-slate-300 font-sans text-xs">
            Kapasitas server stabil pada 60 FPS, memori browser 46MB, dan zero downtime pada seluruh modul.
          </p>
        </div>
      </div>

      {/* Decision Requests Queue */}
      <div className="space-y-3">
        <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-amber-400" />
          Daftar Keputusan Strategis Yayasan Menunggu Pengesahan:
        </span>

        <div className="space-y-3">
          {decisions.map((dec) => (
            <div
              key={dec.id}
              className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/70 hover:border-slate-600 transition space-y-3"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800">
                      {dec.id}
                    </span>
                    <span className="text-slate-400">{dec.department}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{dec.title}</h3>
                </div>

                <div>
                  {dec.status === 'APPROVED' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> TELAH DISAHKAN
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApprove(dec.id)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                    >
                      <Crown className="w-4 h-4" />
                      Sahkan Keputusan
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-200">{dec.impact}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-rose-400 block font-bold text-[10px]">Verifikasi Guardian:</span>
                  <span className="text-slate-300 text-[11px]">{dec.guardianStatus}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-emerald-400 block font-bold text-[10px]">Rekomendasi AI Asy:</span>
                  <span className="text-slate-300 text-[11px]">{dec.aiAsyRecommendation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
