import React, { useState, useEffect } from 'react';
import { AsyIntelligenceCenter, IntelligenceItem } from '../../core/intelligence/AsyIntelligenceCenter';
import { AlertTriangle, Sparkles, BookOpen, Bookmark, Clock, ArrowRight, ShieldCheck, X } from 'lucide-react';

interface ExecutiveIntelligencePopupProps {
  onExplainMore?: (item: IntelligenceItem) => void;
  onOpenFeed?: () => void;
}

export const ExecutiveIntelligencePopup: React.FC<ExecutiveIntelligencePopupProps> = ({
  onExplainMore,
  onOpenFeed
}) => {
  const [activeItem, setActiveItem] = useState<IntelligenceItem | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const center = AsyIntelligenceCenter.getInstance();
      const urgentItems = center.getCriticalAndHighItems();
      if (urgentItems.length > 0) {
        setActiveItem(urgentItems[0]);
        setIsOpen(true);
      }
    } catch (err) {
      console.warn('Non-blocking: Failed to retrieve executive intelligence popup items:', err);
    }
  }, []);

  if (!isOpen || !activeItem) {
    return null;
  }

  const handleDismiss = () => {
    if (activeItem) {
      AsyIntelligenceCenter.getInstance().updateStatus(activeItem.id, 'READ');
    }
    setIsOpen(false);
  };

  const handleSave = () => {
    if (activeItem) {
      AsyIntelligenceCenter.getInstance().updateStatus(activeItem.id, 'SAVED');
    }
    setIsOpen(false);
  };

  const handleExplain = () => {
    if (activeItem) {
      AsyIntelligenceCenter.getInstance().updateStatus(activeItem.id, 'DISCUSSED');
      if (onExplainMore) onExplainMore(activeItem);
    }
    setIsOpen(false);
  };

  const handleOpenCenter = () => {
    if (activeItem) {
      AsyIntelligenceCenter.getInstance().updateStatus(activeItem.id, 'READ');
    }
    setIsOpen(false);
    if (onOpenFeed) onOpenFeed();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl max-w-2xl w-full p-6 space-y-4 overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500 text-white uppercase">
                  {activeItem.urgensi} INTELLIGENCE
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {activeItem.tanggal} &bull; {activeItem.kategori}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Executive Intelligence Briefing
              </h3>
            </div>
          </div>

          <button 
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
            {activeItem.judul}
          </h4>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
            <p><strong>Ringkasan:</strong> {activeItem.ringkasan}</p>
            <p><strong>Dampak terhadap TADE:</strong> {activeItem.dampakTerhadapTADE}</p>
            <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Rekomendasi AI Asy: {activeItem.rekomendasi}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Sumber Resmi: <strong>{activeItem.sumber}</strong></span>
            <span>Verifikasi: <strong>{activeItem.verifikasiKeamanan}</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleDismiss}
            className="px-3.5 py-2 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Nanti
          </button>
          <button
            onClick={handleSave}
            className="px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </button>
          <button
            onClick={handleExplain}
            className="px-3.5 py-2 rounded-xl text-xs font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Jelaskan Lebih Lanjut</span>
          </button>
          <button
            onClick={handleOpenCenter}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-600 hover:bg-amber-700 active:scale-95 text-white transition-all shadow-md shadow-amber-600/20 flex items-center gap-1.5"
          >
            <span>Buka Intelligence Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
