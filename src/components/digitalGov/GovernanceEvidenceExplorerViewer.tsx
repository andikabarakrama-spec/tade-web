import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  BookLock, 
  Layers, 
  Sparkles, 
  Key, 
  Hash, 
  Eye, 
  Copy,
  Check
} from 'lucide-react';
import { 
  GovernanceEvidenceExplorer, 
  EvidenceRecord, 
  EvidenceCategory 
} from '../../core/digitalGov/governanceEvidenceExplorer';

export const GovernanceEvidenceExplorerViewer: React.FC = () => {
  const explorer = useMemo(() => GovernanceEvidenceExplorer.getInstance(), []);
  const [selectedCategory, setSelectedCategory] = useState<EvidenceCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<EvidenceRecord | null>(null);
  const [copiedDigest, setCopiedDigest] = useState(false);

  const records = useMemo(() => {
    const cat = selectedCategory === 'ALL' ? undefined : selectedCategory;
    return explorer.searchEvidence(searchQuery, cat);
  }, [explorer, selectedCategory, searchQuery]);

  const handleCopyDigest = (digest: string) => {
    navigator.clipboard.writeText(digest);
    setCopiedDigest(true);
    setTimeout(() => setCopiedDigest(false), 2000);
  };

  const getCategoryBadge = (cat: EvidenceCategory) => {
    switch (cat) {
      case 'DECISION':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md font-mono bg-amber-50 text-amber-700 border border-amber-200">DECISION</span>;
      case 'POLICY':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">POLICY</span>;
      case 'JOURNAL_ENTRY':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md font-mono bg-blue-50 text-blue-700 border border-blue-200">JOURNAL</span>;
      case 'OFFICIAL_DOCUMENT':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md font-mono bg-purple-50 text-purple-700 border border-purple-200">DOCUMENT</span>;
      case 'DISCOVERY_ENTRY':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">DISCOVERY</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md font-mono bg-stone-100 text-stone-700 border border-stone-200">EVENT</span>;
    }
  };

  return (
    <div id="r779-governance-evidence-explorer" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-bold font-mono border border-cyan-500/30">
              <Search className="w-3.5 h-3.5" /> R779 • GOVERNANCE EVIDENCE EXPLORER
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Cross-Vector Sovereign Evidence Search
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Mesin pencari bukti dan jejak audit lintas vektor (Keputusan, Kebijakan, Jurnal, Dokumen Resmi, Registry) yang 100% read-only tanpa risiko mutasi state.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-xs px-4 py-3 rounded-2xl border border-slate-700 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Matched Records</p>
              <p className="text-2xl font-black text-cyan-400 font-mono">{records.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Explorer Search & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search & List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari ID, kata kunci, aktor, atau hash..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-500 w-full"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {(['ALL', 'DECISION', 'POLICY', 'JOURNAL_ENTRY', 'OFFICIAL_DOCUMENT', 'DISCOVERY_ENTRY'] as const).map((cat) => (
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

            {/* Evidence Records */}
            <div className="space-y-3 pt-2">
              {records.map((rec) => (
                <button
                  key={rec.evidenceId}
                  onClick={() => setSelectedRecord(rec)}
                  className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer space-y-2 flex flex-col ${
                    selectedRecord?.evidenceId === rec.evidenceId
                      ? 'bg-cyan-50/60 border-cyan-300 shadow-xs'
                      : 'bg-stone-50/70 border-stone-200 hover:border-cyan-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(rec.category)}
                      <span className="text-xs font-mono font-bold text-slate-800">
                        {rec.sourceCode}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(rec.timestamp).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{rec.title}</h3>
                  <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">{rec.summary}</p>

                  <div className="pt-1.5 border-t border-stone-200/50 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                    <span>{rec.authorOrActor}</span>
                    <span className="text-cyan-700 truncate max-w-[140px]">{rec.cryptographicDigest}</span>
                  </div>
                </button>
              ))}

              {records.length === 0 && (
                <div className="text-center py-12 text-stone-400 text-xs">
                  Tidak ditemukan bukti atau jejak audit yang sesuai dengan kueri.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Evidence Inspector Modal/Card */}
        <div className="lg:col-span-5 space-y-4">
          {selectedRecord ? (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-600" />
                  <span className="text-xs font-bold text-slate-900">Inspektur Bukti Tata Kelola</span>
                </div>
                <span className="text-[10px] font-mono bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded-md border border-cyan-200">
                  READ ONLY
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400 font-mono">Judul Bukti:</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedRecord.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-400 uppercase font-mono">Kategori:</span>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedRecord.category}</p>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-400 uppercase font-mono">Kode Sumber:</span>
                    <p className="font-mono font-bold text-slate-800 mt-0.5">{selectedRecord.sourceCode}</p>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase font-mono">Ringkasan / Bukti:</span>
                  <p className="text-stone-700 leading-relaxed text-xs">{selectedRecord.summary}</p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase font-mono">Aktor Terkait:</span>
                  <p className="text-slate-800 font-semibold">{selectedRecord.authorOrActor}</p>
                </div>

                {/* Cryptographic Proof */}
                <div className="p-3.5 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                      <Hash className="w-3 h-3" /> Cryptographic Seal Digest
                    </span>
                    <button
                      onClick={() => handleCopyDigest(selectedRecord.cryptographicDigest)}
                      className="text-stone-400 hover:text-white transition cursor-pointer flex items-center gap-1 text-[10px] font-mono"
                    >
                      {copiedDigest ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedDigest ? 'Tersalin' : 'Salin'}
                    </button>
                  </div>
                  <p className="font-mono text-xs text-cyan-300 break-all">
                    {selectedRecord.cryptographicDigest}
                  </p>
                </div>

                {/* Metadata JSON Viewer */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-stone-400 font-mono">Metadata Ekstra:</span>
                  <pre className="text-[10px] font-mono p-3 bg-stone-900 text-stone-200 rounded-xl overflow-x-auto max-h-40">
                    {JSON.stringify(selectedRecord.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-stone-400 text-xs border border-stone-200">
              Pilih salah satu entri bukti di sebelah kiri untuk melihat rincian bukti kriptografis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
