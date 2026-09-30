import React from 'react';
import {
  Sparkles,
  Download,
  Share2,
  Copy,
  Check,
  Eye,
  Trash2,
  Layout,
  FileCheck,
  Image as ImageIcon,
  Palette
} from 'lucide-react';
import { CreativeFormat } from './PromptComposer';

export interface CreativeArtifact {
  id: string;
  title: string;
  format: CreativeFormat;
  prompt: string;
  createdAt: string;
  thumbnailGradient: string;
  aspectRatio: string;
  dimensions: string;
  status: 'READY' | 'PROCESSING';
}

interface CreativeHistoryProps {
  artifacts: CreativeArtifact[];
  onSelectArtifact?: (art: CreativeArtifact) => void;
}

export const CreativeHistory: React.FC<CreativeHistoryProps> = ({
  artifacts,
  onSelectArtifact
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>Riwayat Kreasi Grafis & Galeri Desain ({artifacts.length})</span>
        </h4>
        <span className="text-xs text-slate-400 font-mono">
          Penyimpanan Ringan SVG/Canvas
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {artifacts.map((art) => (
          <div
            key={art.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            {/* Visual Canvas Mock Preview */}
            <div
              className={`h-40 w-full p-4 flex flex-col justify-between relative text-white ${art.thumbnailGradient}`}
            >
              <div className="flex items-center justify-between z-10">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-black/40 backdrop-blur-sm border border-white/20">
                  {art.format}
                </span>
                <span className="text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                  {art.dimensions}
                </span>
              </div>

              <div className="z-10">
                <h5 className="font-black text-sm drop-shadow-md leading-snug line-clamp-2">
                  {art.title}
                </h5>
                <p className="text-[10px] text-white/80 line-clamp-1 mt-0.5">
                  {art.prompt}
                </p>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Meta & Actions */}
            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Dibuat: {art.createdAt}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                  SIAP CETAK
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => alert(`Mengunduh file cetak HD untuk: ${art.title}`)}
                  className="py-2 px-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/80 text-purple-700 dark:text-purple-300 font-bold text-[11px] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF/PNG</span>
                </button>
                <button
                  onClick={() => alert(`Membagikan tautan desain: ${art.title}`)}
                  className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Bagikan Link</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
