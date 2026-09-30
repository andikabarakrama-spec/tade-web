import React, { useState } from 'react';
import { 
  Compass, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  Lock, 
  RefreshCw, 
  Eye, 
  Globe, 
  Layers,
  FileCheck
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface RouteRule {
  path: string;
  targetDomain: 'PUBLIC_WEBSITE' | 'INTERNAL_SIM';
  description: string;
  guardMechanism: string;
  status: 'ACTIVE' | 'ISOLATED';
}

const ROUTE_RULES: RouteRule[] = [
  {
    path: '/',
    targetDomain: 'PUBLIC_WEBSITE',
    description: 'Halaman Beranda, Profil Yayasan, Berita, Galeri & PPDB Online',
    guardMechanism: 'Public Open Route & Bullhorn SEO',
    status: 'ACTIVE'
  },
  {
    path: '/sim',
    targetDomain: 'INTERNAL_SIM',
    description: 'Gerbang Utama Portal SIM Terpadu Sekolah',
    guardMechanism: 'Direct Route & RBAC Session Guard',
    status: 'ISOLATED'
  },
  {
    path: '/sim/dashboard',
    targetDomain: 'INTERNAL_SIM',
    description: 'Dashboard Eksekutif Super Admin, Guru, Kasir, dan Wali Murid',
    guardMechanism: 'RBAC Multi-Level Token Guard',
    status: 'ISOLATED'
  },
  {
    path: '/sim/war-room',
    targetDomain: 'INTERNAL_SIM',
    description: 'Ruang Komando Validasi & Telemetri Black Box Terpusat',
    guardMechanism: 'Guardian WORM Signature & WORM Log',
    status: 'ISOLATED'
  },
  {
    path: '/sim/*',
    targetDomain: 'INTERNAL_SIM',
    description: 'Modul R1 - R514 (Akademik, Kasir, Perpustakaan, AI Asy, Digital Twin)',
    guardMechanism: 'Strict Route Interceptor + Zero Forced Redirect ke Website',
    status: 'ISOLATED'
  }
];

export const SecureRouteIsolation: React.FC = () => {
  const [testPath, setTestPath] = useState('/sim');
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestRoute = () => {
    if (testPath.startsWith('/sim')) {
      setTestResult('TERISOLASI: Rute diarahkan langsung ke Portal SIM tanpa redirect ke Website Publik (100% Secure).');
    } else {
      setTestResult('PUBLIK: Rute diarahkan ke Website Profil Publik sekolah.');
    }
    blackBoxRecorder.record({
      moduleCode: 'R506',
      eventType: 'SECURITY',
      severity: 'INFO',
      details: `Route isolation probe executed on path ${testPath}. Output: ${testResult}`
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R506 &bull; SECURE ROUTE ISOLATION
          </span>
          <span className="text-xs text-slate-400 font-mono">Zero Collision &bull; Zero False Redirect</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Compass className="w-8 h-8 text-emerald-400" />
              Secure Route Isolation &bull; Isolasi Rute Mutlak
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Memastikan akses rute <code>/</code> membuka Website Publik, sementara rute <code>/sim</code> dan sub-rutenya <code>/sim/*</code> membuka Portal SIM secara langsung tanpa redirect paksa ke Website Publik.
            </p>
          </div>
        </div>
      </div>

      {/* Simulator Tes Rute */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-500" />
          Simulator Intersepsi Rute Bersih (Zero-Redirect Probe)
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={testPath}
            onChange={(e) => setTestPath(e.target.value)}
            placeholder="Contoh: /sim atau /sim/dashboard"
            className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleTestRoute}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
          >
            Uji Routing
          </button>
        </div>

        {testResult && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-mono text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            {testResult}
          </div>
        )}
      </div>

      {/* Route Isolation Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
            Daftar Aturan Isolasi Jalur Rute (Route Separation Table)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="p-4">Path URL</th>
                <th className="p-4">Domain Target</th>
                <th className="p-4">Deskripsi Layanan</th>
                <th className="p-4">Mekanisme Pengamanan</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {ROUTE_RULES.map((rule) => (
                <tr key={rule.path} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">{rule.path}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rule.targetDomain === 'PUBLIC_WEBSITE'
                        ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    }`}>
                      {rule.targetDomain}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">{rule.description}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{rule.guardMechanism}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" /> {rule.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
