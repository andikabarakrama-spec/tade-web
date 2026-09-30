import React, { useState } from 'react';
import { 
  Command, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  ExternalLink, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { FounderCommandPalette, CommandItem } from '../../core/sovereign/founderCommandPalette';
import { UserRole } from '../../types';

interface FounderCommandPaletteViewerProps {
  onNavigateTab?: (tabId: string) => void;
}

export const FounderCommandPaletteViewer: React.FC<FounderCommandPaletteViewerProps> = ({
  onNavigateTab
}) => {
  const palette = FounderCommandPalette.getInstance();
  const [selectedRole, setSelectedRole] = useState<UserRole>('SUPER_ADMIN');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const allItems = palette.getAllCommands(selectedRole);
  const searchResults = palette.searchCommands(query, selectedRole);

  const filteredItems = selectedCategory === 'ALL'
    ? searchResults
    : searchResults.filter(i => i.category === selectedCategory);

  const handleExecute = (targetTab: string) => {
    if (onNavigateTab) {
      onNavigateTab(targetTab);
    }
  };

  return (
    <div className="space-y-6" id="founder-command-palette-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Sovereign Navigation
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R762 &bull; RC94
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Founder Command Palette
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Pusat pintasan perintah cepat global (Shortcut: <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-200 text-xs font-mono">Ctrl+K</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-200 text-xs font-mono">Cmd+K</kbd>) dengan penegakan batasan RBAC ketat.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Simulasi Peran:</span>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value as UserRole)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
            >
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="KETUA_YAYASAN">KETUA_YAYASAN</option>
              <option value="KEPALA_SEKOLAH">KEPALA_SEKOLAH</option>
              <option value="GURU">GURU</option>
              <option value="KEUANGAN">KEUANGAN</option>
              <option value="WALI_MURID">WALI_MURID</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari perintah, modul, war room, atau guardian..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['ALL', 'WAR_ROOM', 'GUARDIAN', 'COMPANION', 'OFFLINE', 'SYSTEM'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Commands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(cmd => (
          <div
            key={cmd.id}
            className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-4 transition shadow-lg flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                  {cmd.category}
                </span>
                {cmd.badge && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono font-bold text-slate-400">
                    {cmd.badge}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                {cmd.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {cmd.subtitle}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="font-mono text-[11px] text-slate-500">{cmd.targetTab}</span>
              <button
                onClick={() => handleExecute(cmd.targetTab)}
                className="flex items-center gap-1 px-3 py-1 bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-semibold transition"
              >
                <span>Buka</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
