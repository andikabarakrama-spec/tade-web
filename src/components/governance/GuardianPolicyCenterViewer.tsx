import React, { useState, useEffect } from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle2, RefreshCw, Key, FileCheck, Sliders } from 'lucide-react';
import { GuardianPolicyEngine, GuardianPolicyRule } from '../../core/governance/guardianPolicyEngine';

export const GuardianPolicyCenterViewer: React.FC = () => {
  const [policies, setPolicies] = useState<GuardianPolicyRule[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'POLICIES' | 'ENFORCEMENT' | 'RULES'>('POLICIES');

  useEffect(() => {
    const engine = GuardianPolicyEngine.getInstance();
    setPolicies(engine.getPolicies());
    return engine.subscribe(() => {
      setPolicies(engine.getPolicies());
    });
  }, []);

  const handleToggle = (id: string) => {
    GuardianPolicyEngine.getInstance().togglePolicy(id);
  };

  const filtered = filterCategory === 'ALL'
    ? policies
    : policies.filter(p => p.category === filterCategory);

  return (
    <div id="guardian-policy-center-root" className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                R851 • Otoritas Tertinggi
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <Shield className="w-3.5 h-3.5" /> Guardian Ring-0 Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
              Guardian Policy Center
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Pusat orkestrasi & penegakan kebijakan kedaulatan data, kepatuhan finansial, serta proteksi privasi santri PAUD/TK secara imutabel.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-center">
              <div className="text-xs text-slate-300">Tingkat Kepatuhan</div>
              <div className="text-2xl font-black text-emerald-400">100.0%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Kebijakan Aktif</div>
            <div className="text-xl font-bold text-slate-800">{policies.filter(p => p.status === 'ACTIVE').length} / {policies.length}</div>
            <div className="text-xs text-emerald-600 font-medium">Strict Block Enforced</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Pelanggaran Terdeteksi</div>
            <div className="text-xl font-bold text-slate-800">0 Kasus</div>
            <div className="text-xs text-blue-600 font-medium">Zero Violation Record</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Hermes Storage Mode</div>
            <div className="text-xl font-bold text-purple-700">DORMANT_SAFE</div>
            <div className="text-xs text-purple-600 font-medium">Zero Duplicate Execution</div>
          </div>
        </div>
      </div>

      {/* Filter & Subtabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['ALL', 'RING0_CORE', 'STUDENT_PROTECTION', 'FINANCIAL_INTEGRITY', 'OFFLINE_RESILIENCE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Menampilkan {filtered.length} Aturan Kebijakan
        </div>
      </div>

      {/* Policy Rules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((policy) => (
          <div
            key={policy.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {policy.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                    {policy.name}
                  </h3>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    policy.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {policy.status === 'ACTIVE' ? 'DITEGAKKAN' : 'AUDIT ONLY'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                {policy.description}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Metode Penegakan:</span>
                <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {policy.enforcementLevel}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Terakhir Diaudit:</span>
                <span className="font-medium text-slate-700">{policy.lastEnforcedAt}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-emerald-600">Kepatuhan: {policy.compliancePercentage}%</span>
                <button
                  onClick={() => handleToggle(policy.id)}
                  className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
                >
                  {policy.status === 'ACTIVE' ? 'Ubah ke Audit' : 'Aktifkan Strict'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
