import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Ban, 
  CheckCircle2, 
  Search, 
  Filter, 
  Layers, 
  Play, 
  Scale,
  RefreshCw,
  Sliders,
  FileCode2,
  Info
} from 'lucide-react';
import { 
  ConstitutionalPolicyEngine, 
  InstitutionalPolicy, 
  PolicyCategory, 
  PolicyEvaluationResult 
} from '../../core/digitalGov/constitutionalPolicyEngine';

export const ConstitutionalPolicyEngineViewer: React.FC = () => {
  const engine = useMemo(() => ConstitutionalPolicyEngine.getInstance(), []);
  const [selectedCategory, setSelectedCategory] = useState<PolicyCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [evaluationContext, setEvaluationContext] = useState<string>(
    JSON.stringify({
      role: 'SUPER_ADMIN',
      actionType: 'NORMAL_OPERATION',
      amount: 2500000,
      isAutomatedScript: false,
      hasStateMutation: true,
      humanApproved: true,
      tahfidzSurahEmpty: false,
      isFinalReport: true
    }, null, 2)
  );
  const [evaluationResults, setEvaluationResults] = useState<PolicyEvaluationResult[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const policies = useMemo(() => {
    const all = engine.getAllPolicies();
    return all.filter(p => {
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [engine, selectedCategory, searchQuery]);

  const handleRunEvaluation = () => {
    setIsEvaluating(true);
    try {
      const parsedCtx = JSON.parse(evaluationContext);
      const catFilter = selectedCategory === 'ALL' ? undefined : selectedCategory;
      const results = engine.evaluateContext(parsedCtx, catFilter);
      setEvaluationResults(results);
    } catch (err: any) {
      alert('Format JSON Context tidak valid: ' + err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getVerdictBadge = (verdict: 'PASS' | 'WARNING' | 'BLOCK') => {
    switch (verdict) {
      case 'PASS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" /> PASS
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold font-mono">
            <AlertTriangle className="w-3.5 h-3.5" /> WARNING
          </span>
        );
      case 'BLOCK':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold font-mono">
            <Ban className="w-3.5 h-3.5" /> BLOCK
          </span>
        );
    }
  };

  return (
    <div id="r771-constitutional-policy-engine" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold font-mono border border-emerald-500/30">
              <Scale className="w-3.5 h-3.5" /> R771 • CONSTITUTIONAL POLICY ENGINE
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Institutional Policy Evaluator
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Mesin evaluasi kebijakan internal TADE untuk 6 pilar konstitusional (Security, RBAC, Academic, Financial, Governance, Recovery) dengan prinsip Zero Autonomous Mutation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-xs px-4 py-3 rounded-2xl border border-slate-700 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Active Policies</p>
              <p className="text-2xl font-black text-emerald-400 font-mono">{engine.getAllPolicies().length}</p>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-xs px-4 py-3 rounded-2xl border border-slate-700 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Enforcement Level</p>
              <p className="text-xs font-extrabold text-amber-300 font-mono">RING-0 STRICT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Policy Catalog & Interactive Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Policy Catalog */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" /> Daftar Kebijakan Institusi
              </h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari kebijakan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 w-full sm:w-56"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {(['ALL', 'SECURITY', 'RBAC', 'ACADEMIC', 'FINANCIAL', 'GOVERNANCE', 'RECOVERY'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Policy Cards */}
            <div className="space-y-3 pt-2">
              {policies.map((pol) => (
                <div 
                  key={pol.policyId}
                  className="p-4 bg-stone-50/70 rounded-2xl border border-stone-200 hover:border-emerald-300 transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {pol.code}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                          {pol.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{pol.title}</h3>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md font-mono ${
                      pol.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                      pol.severity === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {pol.severity}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">{pol.description}</p>

                  <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500">
                    <span className="font-mono text-[10px] text-slate-400 truncate">
                      Ref: {pol.invariantReference}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-stone-600">Otoritas:</span>
                      <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded-sm border border-stone-200">
                        {pol.targetRoles.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {policies.length === 0 && (
                <div className="text-center py-12 text-stone-400 text-xs">
                  Tidak ada kebijakan yang sesuai dengan kriteria pencarian.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Evaluation Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" /> Simulator Kebijakan
              </h2>
              <span className="text-[11px] font-mono text-stone-400">Context Tester</span>
            </div>

            <p className="text-xs text-stone-600">
              Uji keputusan atau payload transaksi terhadap seluruh kebijakan institusi untuk melihat kalkulasi verdict (PASS / WARNING / BLOCK).
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Payload Context (JSON):</span>
                <span className="text-[10px] text-emerald-600 font-mono">Editable</span>
              </label>
              <textarea
                value={evaluationContext}
                onChange={(e) => setEvaluationContext(e.target.value)}
                rows={8}
                className="w-full text-xs font-mono p-3 bg-slate-950 text-emerald-400 rounded-2xl border border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed resize-none"
              />
            </div>

            <button
              onClick={handleRunEvaluation}
              disabled={isEvaluating}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isEvaluating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              Jalankan Evaluasi Kebijakan
            </button>

            {/* Results Display */}
            {evaluationResults.length > 0 && (
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">Hasil Evaluasi ({evaluationResults.length} Aturan)</h3>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {evaluationResults.map((res) => (
                    <div 
                      key={res.evaluationId}
                      className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-800">{res.policyCode}</span>
                        {getVerdictBadge(res.verdict)}
                      </div>
                      <p className="text-stone-600 text-[11px] leading-relaxed">{res.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
