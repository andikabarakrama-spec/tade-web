import React, { useState } from 'react';
import { BookOpen, Shield, Layers, RefreshCw, Cpu, CheckCircle2, FileText, Search, Sparkles } from 'lucide-react';

interface ResearchEntry {
  id: string;
  title: string;
  category: 'Secure by Design' | 'Defense in Depth' | 'Recovery Pattern' | 'Reliability Pattern' | 'Architecture Pattern';
  referenceStandard: string;
  tadeImplementation: string;
  verifiedStatus: 'VERIFIED_FOUNDATION';
}

export const GuardianResearchVault: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const [articles] = useState<ResearchEntry[]>([
    {
      id: 'RES-01',
      title: 'Principle of Least Privilege & Total RBAC Separation',
      category: 'Secure by Design',
      referenceStandard: 'NIST SP 800-53 / OWASP Top 10 A01:2021-Broken Access Control',
      tadeImplementation: 'Pemisahan ketat hak akses 7 peran (Ketua Yayasan, Kepala Sekolah, Guru, Bendahara, Operator, Wali Murid, Super Admin) tanpa celah bypass.',
      verifiedStatus: 'VERIFIED_FOUNDATION'
    },
    {
      id: 'RES-02',
      title: 'Defense-in-Depth 4-Tier Ladder',
      category: 'Defense in Depth',
      referenceStandard: 'NSA Defense-in-Depth Framework & Zero Trust Architecture (NIST SP 800-207)',
      tadeImplementation: 'Pengelompokan sentinel, defender, squad, dan elite yang saling menopang dan memulihkan secara otonom.',
      verifiedStatus: 'VERIFIED_FOUNDATION'
    },
    {
      id: 'RES-03',
      title: '5-Phase Universal Self-Healing Lifecycle (Detect-Contain-Heal-Rejoin-Strengthen)',
      category: 'Recovery Pattern',
      referenceStandard: 'Autonomous Computing Architecture (IBM) & Circuit Breaker Pattern (Martin Fowler)',
      tadeImplementation: 'Standarisasi penyembuhan 12 engine aplikasi tanpa reboot dan tanpa downtime operasional.',
      verifiedStatus: 'VERIFIED_FOUNDATION'
    },
    {
      id: 'RES-04',
      title: 'WORM (Write Once Read Many) Immutable Storage',
      category: 'Reliability Pattern',
      referenceStandard: 'SEC Rule 17a-4(f) & ISO/IEC 27001 Annex A.12.4.1 Cryptographic Audit Log',
      tadeImplementation: 'Pencatatan kas dan raport menggunakan hashing SHA-256 tamper-evident anti-manipulasi.',
      verifiedStatus: 'VERIFIED_FOUNDATION'
    },
    {
      id: 'RES-05',
      title: 'Front Office & Back Office Total Domain Separation',
      category: 'Architecture Pattern',
      referenceStandard: 'Micro-Frontend Security Boundary & Clean Architecture Separation of Concerns',
      tadeImplementation: 'Pemisahan total Website publik (kecepatan SEO & branding) dengan SIM Back Office (data rahasia sekolah).',
      verifiedStatus: 'VERIFIED_FOUNDATION'
    }
  ]);

  const filtered = articles.filter(a => {
    const matchCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchQuery = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.tadeImplementation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div id="guardian-research-vault-root" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-blue-900/40">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              TADE RC70 • R534
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Internal Architecture Reference
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-400" />
            Guardian Research Vault
          </h1>
          <p className="text-blue-100/80 text-sm mt-1 max-w-2xl">
            Repositori internal mencatat referensi desain ilmiah dan standar keamanan kelas industri yang menjadi fondasi ketahanan TADE.
          </p>
        </div>
        <div className="bg-slate-900/80 border border-blue-500/30 px-4 py-2 rounded-xl text-center">
          <span className="text-xs text-blue-300 block">Research Papers</span>
          <span className="text-xl font-bold text-blue-400">{articles.length} CORE REFERENCES</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari referensi desain / standar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['ALL', 'Secure by Design', 'Defense in Depth', 'Recovery Pattern', 'Reliability Pattern', 'Architecture Pattern'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                  {item.category}
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  {item.verifiedStatus}
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-1">{item.title}</h3>
              <div className="text-xs text-slate-500 mb-3">Ref: {item.referenceStandard}</div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Implementasi Nyata TADE:</span>
                {item.tadeImplementation}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-mono flex justify-between">
              <span>{item.id}</span>
              <span>TADE Architectural Asset</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
