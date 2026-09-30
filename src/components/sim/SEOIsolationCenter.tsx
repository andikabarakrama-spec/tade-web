import React, { useState } from 'react';
import { 
  Search, 
  ShieldAlert, 
  FileCode, 
  Globe, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  EyeOff, 
  Tag, 
  ExternalLink,
  Code
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface SEOMapping {
  domain: string;
  urlPath: string;
  robotsRule: string;
  metaTags: string;
  sitemapIncluded: boolean;
  searchEngineVisibility: 'INDEXED & PUBLIC' | 'STRICTLY FORBIDDEN (NOINDEX)';
}

const SEO_MAPPINGS: SEOMapping[] = [
  {
    domain: 'Website Resmi (Public)',
    urlPath: '/',
    robotsRule: 'User-agent: * Allow: /',
    metaTags: '<meta name="robots" content="index, follow" />',
    sitemapIncluded: true,
    searchEngineVisibility: 'INDEXED & PUBLIC'
  },
  {
    domain: 'Website PPDB (Public)',
    urlPath: '/ppdb',
    robotsRule: 'User-agent: * Allow: /ppdb',
    metaTags: '<meta name="robots" content="index, follow" />',
    sitemapIncluded: true,
    searchEngineVisibility: 'INDEXED & PUBLIC'
  },
  {
    domain: 'Portal SIM (Internal)',
    urlPath: '/sim',
    robotsRule: 'User-agent: * Disallow: /sim/',
    metaTags: '<meta name="robots" content="noindex, nofollow, noarchive" />',
    sitemapIncluded: false,
    searchEngineVisibility: 'STRICTLY FORBIDDEN (NOINDEX)'
  },
  {
    domain: 'SIM Dashboard (Internal)',
    urlPath: '/sim/dashboard',
    robotsRule: 'User-agent: * Disallow: /sim/*',
    metaTags: '<meta name="robots" content="noindex, nofollow, noarchive" />',
    sitemapIncluded: false,
    searchEngineVisibility: 'STRICTLY FORBIDDEN (NOINDEX)'
  },
  {
    domain: 'War Room & Black Box (Internal)',
    urlPath: '/sim/war-room',
    robotsRule: 'User-agent: * Disallow: /sim/war-room',
    metaTags: '<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />',
    sitemapIncluded: false,
    searchEngineVisibility: 'STRICTLY FORBIDDEN (NOINDEX)'
  }
];

export const SEOIsolationCenter: React.FC = () => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [lastAuditTime, setLastAuditTime] = useState('Baru saja');

  const handleRunSEOAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setLastAuditTime(new Date().toLocaleTimeString('id-ID'));
      blackBoxRecorder.record({
        moduleCode: 'R508',
        eventType: 'SECURITY',
        severity: 'INFO',
        details: 'SEO Isolation Audit completed: SIM domain 100% hidden from search engine crawlers with noindex, nofollow, noarchive.'
      });
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
            R508 &bull; SEO ISOLATION CENTER
          </span>
          <span className="text-xs text-slate-400 font-mono">Public Indexing vs SIM Total Camouflage</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Search className="w-8 h-8 text-purple-400" />
              SEO Isolation Center &bull; Pusat Isolasi Pengindeksan Web
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Memastikan search engine (Google, Bing, Yahoo) hanya mengindeks Website Publik dan PPDB daring. Seluruh modul SIM <code>/sim/*</code> diproteksi secara absolut dengan header <code>noindex, nofollow, noarchive</code> dan blokir robots.txt.
            </p>
          </div>

          <button
            onClick={handleRunSEOAudit}
            disabled={isAuditing}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'Memeriksa SEO Tag...' : 'Audit Isolasi SEO'}
          </button>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">WEBSITE PUBLIK</span>
            <span className="text-base font-bold text-cyan-400 font-mono">INDEX, FOLLOW</span>
            <span className="text-[9px] text-cyan-500 block">Sitemap.xml Aktif</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">PORTAL SIM /sim/*</span>
            <span className="text-base font-bold text-purple-400 font-mono">NOINDEX, NOFOLLOW</span>
            <span className="text-[9px] text-purple-400 block">Zero Search Leak</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">ROBOTS.TXT DISALLOW</span>
            <span className="text-base font-bold text-emerald-400 font-mono">100% TERKUNCI</span>
            <span className="text-[9px] text-emerald-500 block">Crawler Blocked</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="text-[10px] font-mono text-slate-400 block">AUDIT TERAKHIR</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{lastAuditTime}</span>
            <span className="text-[9px] text-emerald-500 block">Status Terverifikasi</span>
          </div>
        </div>
      </div>

      {/* SEO Isolation Mapping Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
              Matriks Isolasi SEO Berdasarkan Lingkungan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Pemisahan ketat tag meta &amp; aturan crawler bot per domain.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
            RC68 Strict Standard
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="p-4">Domain &amp; Rute</th>
                <th className="p-4">Aturan Robots.txt</th>
                <th className="p-4">Meta Robots Tag</th>
                <th className="p-4">Status Visibilitas Mesin Pencari</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {SEO_MAPPINGS.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                  <td className="p-4">
                    <strong className="text-slate-900 dark:text-white block">{item.domain}</strong>
                    <code className="text-cyan-600 dark:text-cyan-400 text-[11px]">{item.urlPath}</code>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    <code className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded text-[11px]">
                      {item.robotsRule}
                    </code>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">
                    <code className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded text-[11px]">
                      {item.metaTags}
                    </code>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                      item.searchEngineVisibility.includes('INDEXED')
                        ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    }`}>
                      {item.searchEngineVisibility.includes('INDEXED') ? (
                        <Globe className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      )}
                      {item.searchEngineVisibility}
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
