import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Crown, 
  SunMedium, 
  FileText, 
  TrendingUp, 
  Wrench, 
  HeartHandshake, 
  CheckCircle2, 
  Calendar,
  Layers
} from 'lucide-react';

export const AIAsyExecutiveIntelligenceViewer: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'BRIEF' | 'INCIDENT' | 'RECOMMENDATION' | 'FORECAST'>('BRIEF');

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
                R597 &bull; AI ASY EXECUTIVE INTELLIGENCE
              </span>
              <span className="text-xs text-slate-400 font-mono">Ketua Yayasan Executive Briefing Engine</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">AI Asy Executive Intelligence &amp; Daily Forecast</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-950 text-amber-300 font-mono text-xs font-bold border border-amber-800 flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            Mode Guru Ramah &bull; Executive Co-Pilot
          </span>
        </div>
      </div>

      {/* 4 Intelligence Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-xs">
        {[
          { id: 'BRIEF', label: 'Executive Morning Brief', icon: SunMedium, color: 'text-amber-400' },
          { id: 'INCIDENT', label: 'Incident Summary (24h)', icon: FileText, color: 'text-cyan-400' },
          { id: 'RECOMMENDATION', label: 'Daily Recommendations', icon: TrendingUp, color: 'text-emerald-400' },
          { id: 'FORECAST', label: 'Maintenance Forecast', icon: Wrench, color: 'text-purple-400' }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
              className={`p-3.5 rounded-2xl border text-left transition space-y-1 ${
                selectedTab === tab.id
                  ? 'bg-slate-800 border-amber-500/50 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${tab.color}`} />
                <span className="text-[10px] text-slate-500">ACTIVE</span>
              </div>
              <strong className="text-xs text-white block">{tab.label}</strong>
            </button>
          );
        })}
      </div>

      {/* Intelligence Content Window */}
      <div className="p-5 md:p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        {selectedTab === 'BRIEF' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <SunMedium className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white font-mono">
                Executive Morning Brief &bull; Ahad, 17 Agustus 2026
              </h3>
            </div>
            <div className="text-xs text-slate-300 font-sans leading-relaxed space-y-3">
              <p>
                <strong>Assalamu’alaikum Warahmatullahi Wabarakatuh, Bapak Ketua Yayasan.</strong>
              </p>
              <p>
                Semua operasional sistem TADE berada dalam kondisi <strong>100% prima dan stabil</strong>. Pagi ini tercatat 384 santri dan siswa telah memulai kegiatan harian dengan presensi digital berjalan mulus. Pembayaran SPP dan infaq santri tercatat surplus dengan zero reconciliation error.
              </p>
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 font-mono text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero System Outage &bull; 0 Kehilangan Data &bull; 100% Kesiapsiagaan Ujian &amp; Rapor</span>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'INCIDENT' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-mono">
                Human-Friendly Incident Summary (Terakhir 24 Jam)
              </h3>
            </div>
            <div className="text-xs text-slate-300 font-sans leading-relaxed space-y-3">
              <p>
                Dalam 24 jam terakhir, Guardian Kernel mendeteksi <strong>1 kali fluktuasi koneksi internet lokal (12 detik)</strong> di area asrama putra.
              </p>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 font-mono text-xs">
                <span className="text-cyan-400 font-bold block">&bull; Penanganan Mandiri:</span>
                <p className="text-slate-300 font-sans text-[11px]">
                  Sistem langsung beralih ke Mode Local-First (Offline Queue). Ustadz yang sedang mengetik presensi tidak mengalami gangguan apapun, dan seluruh 28 catatan presensi terkirim otomatis saat internet pulih.
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'RECOMMENDATION' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-mono">
                Rekomendasi Strategis Harian AI Asy
              </h3>
            </div>
            <div className="space-y-2 text-xs font-sans">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-xs font-mono">1</span>
                <div>
                  <strong className="text-white font-mono">Jadwalkan Peninjauan Rapor Sumatif</strong>
                  <p className="text-slate-400 text-[11px] mt-0.5">85% guru telah menyelesaikan input deskripsi capaian pembelajaran Kurikulum Merdeka.</p>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-xs font-mono">2</span>
                <div>
                  <strong className="text-white font-mono">Pencadangan Bulanan Snapshot SHA-256</strong>
                  <p className="text-slate-400 text-[11px] mt-0.5">Disarankan menjalankan snapshot pra-penutupan buku kas bendahara yayasan.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'FORECAST' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <Wrench className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white font-mono">
                Prakiraan Pemeliharaan &amp; Kapasitas (7 Hari ke Depan)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">STORAGE QUOTA</span>
                <strong className="text-purple-300 text-sm">4.2% Terpakai</strong>
                <span className="text-slate-500 text-[10px] block">Aman hingga 2030</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">PEAK TRAFFIC PPDB</span>
                <strong className="text-cyan-300 text-sm">Estimasi 120 Santri/Jam</strong>
                <span className="text-slate-500 text-[10px] block">Kapasitas Maks: 5000/Jam</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">AUTOMATED HEALTH</span>
                <strong className="text-emerald-300 text-sm">Zero Maintenance Lock</strong>
                <span className="text-slate-500 text-[10px] block">Self-Healing Armed</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
