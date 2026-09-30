import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Command, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Bot, 
  Sparkles, 
  X, 
  ExternalLink,
  ChevronRight,
  Briefcase,
  Zap
} from 'lucide-react';
import { FounderCommandPalette, CommandItem } from '../../core/sovereign/founderCommandPalette';
import { UserRole } from '../../types';

interface FounderCommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
  userRole: UserRole;
}

export const FounderCommandPaletteModal: React.FC<FounderCommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  userRole
}) => {
  const palette = FounderCommandPalette.getInstance();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = palette.searchCommands(query, userRole);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (results.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (results.length || 1)) % (results.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          onSelectTab(results[selectedIndex].targetTab);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, onSelectTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Ketik perintah atau nama modul... (misal: war room, offline, r761, guardian)"
            className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-400">
            ESC
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Tidak ditemukan perintah yang cocok dengan &quot;{query}&quot; untuk peran {userRole}.
            </div>
          ) : (
            results.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    onSelectTab(cmd.targetTab);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-lg'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-700 text-white' : 'bg-slate-800 text-sky-400'}`}>
                      <Command className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold truncate">{cmd.title}</p>
                        {cmd.badge && (
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                            isSelected ? 'bg-sky-800 text-sky-200' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {cmd.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] truncate ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                        {cmd.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold flex-shrink-0">
                    <span className="font-mono text-[10px] uppercase opacity-75">{cmd.targetTab}</span>
                    <ChevronRight className="w-4 h-4 opacity-75" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span>Navigasi: <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300">↑</kbd> <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300">↓</kbd></span>
            <span>Buka: <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300">Enter</kbd></span>
          </div>
          <span className="font-mono text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            RBAC Filtered: {userRole}
          </span>
        </div>
      </div>
    </div>
  );
};
