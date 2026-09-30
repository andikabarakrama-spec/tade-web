import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  BookOpen, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { guardianPolicyRegistry } from '../../core/guardian/guardianPolicyRegistry';
import { GuardianPolicy, PolicyCategory } from '../../core/guardian/guardianTypes';

export const GuardianPolicyRegistryViewer: React.FC = () => {
  const [policies, setPolicies] = useState<GuardianPolicy[]>(() => guardianPolicyRegistry.getAllPolicies());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedPolicy, setSelectedPolicy] = useState<GuardianPolicy | null>(policies[0] || null);

  const categories: PolicyCategory[] = ['SECURITY', 'RBAC', 'RECOVERY', 'OFFLINE', 'INTELLIGENCE', 'GOVERNANCE'];

  const stats = guardianPolicyRegistry.getStats();

  const filtered = policies.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchSeverity = selectedSeverity === 'ALL' || p.severity === selectedSeverity;
    return matchSearch && matchCategory && matchSeverity;
  });

  const handleReset = () => {
    guardianPolicyRegistry.resetToDefaults();
    setPolicies(guardianPolicyRegistry.getAllPolicies());
    setSelectedPolicy(guardianPolicyRegistry.getAllPolicies()[0] || null);
  };

  return (
    <div id="guardian-policy-registry-viewer" className="space-y-6">
      {/* Header & Stats Cards */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold tracking-wider uppercase">R741 Guardian Policy Engine</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded-full border border-emerald-500/30 font-bold">LIVING SSoT</span>
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight">Guardian Policy Registry</h1>
            <p className="text-sm text-slate-400">Pusat registrasi kebijakan mutlak across 6 domain kedaulatan digital.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase">Total Codified Policies</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{stats.total}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1 font-mono">
            <CheckCircle className="w-3 h-3" /> 100% Active Enforced
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase">Blocking Severity</div>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">{stats.blockingCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5 font-mono">Immediate Interception</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase">Critical Severity</div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">{stats.criticalCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5 font-mono">Quarantine / Log Audit</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-mono text-slate-500 uppercase">Coverage Scope</div>
          <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">6 / 6</div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5 font-mono">All Domains Covered</div>
        </div>
      </div>

      {/* Main Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode, nama kebijakan, atau deskripsi..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                selectedCategory === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All ({policies.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Policy List & Detailed Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List */}
        <div className="lg:col-span-7 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
              Tidak ada kebijakan yang sesuai dengan kriteria pencarian.
            </div>
          ) : (
            filtered.map(policy => {
              const isSelected = selectedPolicy?.policyId === policy.policyId;
              return (
                <div
                  key={policy.policyId}
                  onClick={() => setSelectedPolicy(policy)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                          {policy.code}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          policy.severity === 'BLOCKING' 
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}>
                          {policy.severity}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {policy.category}
                        </span>
                      </div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white font-sans">{policy.name}</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{policy.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                        {policy.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Policy Inspector */}
        <div className="lg:col-span-5">
          {selectedPolicy ? (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">{selectedPolicy.policyId}</span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans mt-0.5">{selectedPolicy.name}</h2>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <div className="text-slate-400 uppercase text-[10px]">Constitution Reference</div>
                  <div className="text-slate-900 dark:text-slate-200 mt-1 font-sans font-semibold flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{selectedPolicy.constitutionArticleRef}</span>
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 uppercase text-[10px]">Description & Rationale</div>
                  <p className="text-slate-700 dark:text-slate-300 mt-1 font-sans leading-relaxed text-xs">
                    {selectedPolicy.description}
                  </p>
                </div>

                <div>
                  <div className="text-slate-400 uppercase text-[10px]">Enforcement Scope & Rule Expression</div>
                  <div className="mt-1 p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800">
                    <code>{selectedPolicy.ruleExpression}</code>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-slate-400 text-[10px]">SCOPE</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedPolicy.enforcementScope}</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-slate-400 text-[10px]">AUTHOR</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{selectedPolicy.author}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
              Pilih salah satu kebijakan untuk melihat rincian hukum.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
