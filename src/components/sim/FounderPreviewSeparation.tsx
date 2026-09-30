import React, { useState } from 'react';
import { 
  Crown, 
  Globe, 
  LayoutDashboard, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Terminal, 
  Monitor, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface EnvironmentRoute {
  name: string;
  url: string;
  type: 'WEBSITE' | 'SIM_DIRECT';
  description: string;
  isPrimary: boolean;
}

const PREVIEW_ROUTES: EnvironmentRoute[] = [
  {
    name: 'Website Publik Resmi',
    url: 'http://localhost:4173/',
    type: 'WEBSITE',
    description: 'Menampilkan landing page publik, profil yayasan, pilar keunggulan, berita & formulir PPDB.',
    isPrimary: false
  },
  {
    name: 'Portal SIM Terpadu (Direct Founder Entry)',
    url: 'http://localhost:4173/sim',
    type: 'SIM_DIRECT',
    description: 'Langsung membuka gerbang Portal SIM tanpa melewati halaman landing page website.',
    isPrimary: true
  },
  {
    name: 'SIM Dashboard Eksekutif',
    url: 'http://localhost:4173/sim/dashboard',
    type: 'SIM_DIRECT',
    description: 'Dashboard harian Super Admin dan Ketua Yayasan dengan metrik terpadu & AI Asy.',
    isPrimary: true
  }
];

export const FounderPreviewSeparation: React.FC = () => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
    blackBoxRecorder.record({
      moduleCode: 'R513',
      eventType: 'NAVIGATE',
      severity: 'INFO',
      details: `Copied direct preview URL: ${url}`
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R513 &bull; FOUNDER PREVIEW SEPARATION
          </span>
          <span className="text-xs text-slate-400 font-mono">Localhost Direct Route &bull; Zero Landing Interruption</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Crown className="w-8 h-8 text-amber-400" />
              Founder Preview Separation &bull; Pemisah Pratinjau Founder
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Memisahkan jalur pengujian Founder di lingkungan Localhost maupun Cloud Preview. Akses <code>/sim</code> langsung membuka Portal SIM tanpa perlu repot navigasi melalui landing page website.
            </p>
          </div>
        </div>

        {/* 4 Feature Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">JALUR / SIM</span>
            <span className="text-base font-bold text-amber-400 font-mono">DIRECT PORTAL</span>
            <span className="text-[9px] text-amber-500 block">Zero Website Pass</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">JALUR / PUBLIK</span>
            <span className="text-base font-bold text-cyan-400 font-mono">PUBLIC WEBSITE</span>
            <span className="text-[9px] text-cyan-500 block">Landing &amp; PPDB</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">PORT PREVIEW</span>
            <span className="text-base font-bold text-purple-400 font-mono">3000 / 4173</span>
            <span className="text-[9px] text-purple-400 block">Vite Production Preview</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">STATUS INTEGRASI</span>
            <span className="text-base font-bold text-emerald-400 font-mono">100% READY</span>
            <span className="text-[9px] text-emerald-500 block">Verified Stable</span>
          </div>
        </div>
      </div>

      {/* Routes List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
          Pilihan Rute Pengujian Founder (Direct Localhost / Cloud Preview)
        </h3>

        <div className="space-y-3">
          {PREVIEW_ROUTES.map(route => (
            <div
              key={route.url}
              className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                route.isPrimary
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                  : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                    {route.name}
                  </strong>
                  {route.isPrimary && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold font-mono">
                      Jalur Utama Founder
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {route.description}
                </p>
                <code className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 inline-block mt-1">
                  {route.url}
                </code>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(route.url)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedUrl === route.url ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Salin URL
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
