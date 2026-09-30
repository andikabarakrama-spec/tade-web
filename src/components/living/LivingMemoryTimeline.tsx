import React, { useState } from 'react';
import {
  Sparkles,
  TreePine,
  HeartHandshake,
  Award,
  Lock,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Bookmark,
  Share2,
  Crown
} from 'lucide-react';
import {
  livingMemoryEngine,
  LivingMemoryItem,
  MemoryCapsule,
  MemoryItemType
} from '../../services/livingMemoryEngine';

export const LivingMemoryTimeline: React.FC = () => {
  const [selectedStudentId, setSelectedStudentId] = useState('std-farhan-01');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | MemoryItemType>('ALL');

  const timeline = livingMemoryEngine.getUnifiedTimeline(selectedStudentId);
  const capsules = livingMemoryEngine.getCapsules(selectedStudentId);

  const filteredItems = selectedFilter === 'ALL'
    ? timeline
    : timeline.filter(item => item.type === selectedFilter);

  const FILTER_TABS: Array<{ id: 'ALL' | MemoryItemType; label: string; icon: string }> = [
    { id: 'ALL', label: 'Semua Jejak Memori', icon: '✨' },
    { id: 'BOTANICAL_GROWTH', label: 'Pohon Karakter', icon: '🌱' },
    { id: 'WISH_PRAYER', label: 'Munajat & Doa', icon: '🤲' },
    { id: 'SENTRA_MOMENT', label: 'Karya Sentra', icon: '🏰' },
    { id: 'CERTIFICATE_BADGE', label: 'Sertifikat & Medali', icon: '📜' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 rounded-3xl border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/40 text-2xl">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Living Memory Engine</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                  Sprint G7 Digital Heritage
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Kapsul Waktu & Linimasa Jejak Emas: Pohon Karakter, Doa Kasih, Karya Sentra, dan Sertifikat.
              </p>
            </div>
          </div>

          <div className="px-3 py-1.5 bg-slate-900/80 border border-emerald-500/30 rounded-xl text-xs font-mono text-amber-300">
            Santri: Muhammad Farhan Al-Fatih (TK B1)
          </div>
        </div>
      </div>

      {/* Graduation Memory Capsule Card */}
      {capsules.map(capsule => (
        <div
          key={capsule.id}
          className="bg-slate-900 text-white p-5 rounded-2xl border-2 border-amber-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  Time-Locked Vault
                </span>
                <span className="text-xs text-amber-300 font-mono">Buka Saat: {capsule.unlockDate}</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">{capsule.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Menyimpan rapi {capsule.itemCount} artefak kenangan ananda selama di TK Islam Asy Syifa Tanggul.
              </p>
            </div>
          </div>

          <button
            disabled
            className="px-4 py-2 bg-slate-800 text-amber-300/60 border border-slate-700 rounded-xl text-xs font-bold font-mono cursor-not-allowed"
          >
            🔒 TERKUNCI HINGGA WISUDA
          </button>
        </div>
      ))}

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              selectedFilter === tab.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Memory Timeline List */}
      <div className="space-y-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-xl flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    {item.badgeLabel && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold font-mono">
                        {item.badgeLabel}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">{item.subtitle} • {item.date}</p>
                </div>
              </div>

              {item.growthLevel && (
                <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 text-xs font-black">
                  Level {item.growthLevel}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {item.description}
            </p>

            {/* If Item has an image (Sentra moment or certificate) */}
            {item.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-w-sm">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-44 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {item.blessingCount !== undefined && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 pt-1">
                <span>❤️ {item.blessingCount} Untaian Berkah Diaminkan</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
