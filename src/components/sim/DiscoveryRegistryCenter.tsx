import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Lock,
  Search,
  Filter,
  ShieldCheck,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Tag,
  Copy,
  Check,
  ExternalLink,
  Info
} from 'lucide-react';
import { DISCOVERY_REGISTRY, DISCOVERY_MANIFEST, searchDiscoveries } from '../../core/discoveryRegistry';
import { DiscoveryCategory, DiscoveryEntry } from '../../core/discoveryTypes';

export const DiscoveryRegistryCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedEntry, setSelectedEntry] = useState<DiscoveryEntry>(DISCOVERY_REGISTRY[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: { key: string; label: string }[] = [
    { key: 'ALL', label: 'Semua Kategori' },
    { key: 'EXPERIENCE', label: 'Pengalaman & Maskot' },
    { key: 'SECURITY', label: 'Keamanan & Guardian' },
    { key: 'GOVERNANCE', label: 'Tata Kelola & Vault' },
    { key: 'AI_ORCHESTRATION', label: 'AI & Alur Kerja' },
    { key: 'MEDIA', label: 'Media & Kreatif' },
    { key: 'PERFORMANCE', label: 'Performa & Loading' },
  ];

  const filteredEntries = useMemo(() => {
    let result = searchDiscoveries(searchQuery);
    if (selectedCategory !== 'ALL') {
      result = result.filter(item => item.category === selectedCategory);
    }
    return result;
  }, [searchQuery, selectedCategory]);

  const handleCopyManifest = () => {
    const text = JSON.stringify(DISCOVERY_MANIFEST, null, 2);
    navigator.clipboard.writeText(text);
    setCopiedId('MANIFEST');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyEntry = (entry: DiscoveryEntry) => {
    const text = JSON.stringify(entry, null, 2);
    navigator.clipboard.writeText(text);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-indigo-400" />
                  PERMANENT KNOWLEDGE REGISTRY
                </span>
                <span className="text-xs text-slate-400">TADE Constitution v3.2 Foundation</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                TADE Discovery Registry & Architectural Memory
              </h1>
              <p className="text-sm text-indigo-100/80 mt-0.5">
                Dokumentasi permanen seluruh inovasi arsitektur, alasan pemilihan, mitigasi risiko, dan alternatif yang ditolak agar sprint berikutnya tidak mengulang pekerjaan lama.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-center">
              <div className="text-xs text-slate-400 font-medium">Total Inovasi Terdaftar</div>
              <div className="text-xl font-bold text-indigo-300 flex items-center justify-center gap-1.5 mt-0.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                {DISCOVERY_MANIFEST.totalDiscoveries} Inovasi (100% LOCKED)
              </div>
            </div>

            <button
              onClick={handleCopyManifest}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition"
            >
              {copiedId === 'MANIFEST' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copiedId === 'MANIFEST' ? 'Tersalin!' : 'Ekspor Manifest JSON'}
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID (DISC-001), nama, tag, atau modul..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Entries List & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Discoveries */}
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
          {filteredEntries.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center text-slate-500 text-xs">
              Tidak ada inovasi ditemukan dengan kata kunci tersebut.
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const isSelected = selectedEntry.id === entry.id;
              return (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-700 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-500" />
                      {entry.id}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Asal: {entry.sprintOrigin}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                    {entry.name}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {entry.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right 2 Columns: Detailed Inspector */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
            {/* Header of Inspector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {selectedEntry.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    STATUS: {selectedEntry.status}
                  </span>
                  <span className="text-xs text-slate-400">Sprint: {selectedEntry.sprintOrigin}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                  {selectedEntry.name}
                </h2>
              </div>

              <button
                onClick={() => handleCopyEntry(selectedEntry)}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {copiedId === selectedEntry.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === selectedEntry.id ? 'Tersalin' : 'Salin JSON'}
              </button>
            </div>

            {/* Main Details Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Alasan Dipilih */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Alasan Dipilih (Strategic Rationale)
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedEntry.reason}
                </p>
              </div>

              {/* 2. Risiko yang Diantisipasi */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  Risiko & Mitigasi Arsitektur
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedEntry.risk}
                </p>
              </div>
            </div>

            {/* 3. Alternatif yang Ditolak */}
            <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2.5">
              <div className="text-xs font-bold text-rose-700 dark:text-rose-400">
                Alternatif yang Ditolak (Rejected Alternatives)
              </div>
              <ul className="space-y-1.5">
                {selectedEntry.rejectedAlternatives.map((alt, idx) => (
                  <li key={idx} className="text-xs text-rose-900 dark:text-rose-300/90 flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{alt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Kompatibilitas & Implementasi */}
            <div className="space-y-3">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  Kompatibilitas Sistem & Locked Foundations
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  {selectedEntry.compatibility}
                </p>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  Catatan Implementasi Teknis
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  {selectedEntry.implementationNotes}
                </p>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span>Modul Terkait:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedEntry.moduleCodes.map((code) => (
                    <span key={code} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                      {code}
                    </span>
                  ))}
                </div>
              </div>
              <div>Author: <strong>{selectedEntry.author}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
