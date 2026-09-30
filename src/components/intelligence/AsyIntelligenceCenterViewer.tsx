import React, { useState } from 'react';
import { AsyIntelligenceCenter, IntelligenceItem } from '../../core/intelligence/AsyIntelligenceCenter';
import { TwoWayDialogueViewer } from './TwoWayDialogueViewer';
import { FreeTechnologyRadarViewer } from './FreeTechnologyRadarViewer';
import { FutureRadarViewer } from './FutureRadarViewer';
import { KnowledgeVaultViewer } from './KnowledgeVaultViewer';
import { FutureCouncilViewer } from './FutureCouncilViewer';
import { 
  Sparkles, 
  Radio, 
  Search, 
  Compass, 
  Database, 
  Award, 
  ShieldCheck, 
  Bookmark, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export const AsyIntelligenceCenterViewer: React.FC = () => {
  const center = AsyIntelligenceCenter.getInstance();
  const [activeTab, setActiveTab] = useState<'FEED' | 'DIALOGUE' | 'FREE_RADAR' | 'FUTURE_RADAR' | 'VAULT' | 'COUNCIL'>('FEED');
  const [feed, setFeed] = useState<IntelligenceItem[]>(center.getIntelligenceFeed());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [metrics] = useState(center.getMetrics());

  const categories = [
    'ALL',
    'AI',
    'Technology',
    'Cybersecurity',
    'Education',
    'Regulation',
    'Open Source',
    'Developer Tools',
    'Automation',
    'AI Agents',
    'Local AI',
    'Self-hosted',
    'Free Technology'
  ];

  const filteredFeed = selectedCategory === 'ALL'
    ? feed
    : feed.filter(item => item.kategori === selectedCategory);

  const handleUpdateStatus = (id: string, status: IntelligenceItem['status']) => {
    center.updateStatus(id, status);
    setFeed([...center.getIntelligenceFeed()]);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 text-white space-y-3 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center font-mono font-bold text-xl text-indigo-300">
              <Radio className="w-6 h-6 animate-pulse text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  R667 SOVEREIGN INTELLIGENCE
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                  100% BAHASA INDONESIA RESMI &bull; UNTRUSTED INPUT SHIELD
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white mt-1">
                AI Asy Intelligence Center &bull; Super Admin Hub
              </h2>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 inline-block">
              {metrics.total} Intelijen Terverifikasi
            </span>
            <span className="block text-[10px] text-indigo-300 mt-1">
              Zero Hallucination &bull; Anti Vendor Lock-in
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          Pusat pemantauan intelijen teknologi, regulasi UU PDP, keamanan siber, dan inovasi pendidikan bebas biaya untuk menjamin kemandirian dan keabadian ekosistem TADE.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'FEED', label: '1. Intelligence Feed (R667)', icon: Radio },
          { id: 'DIALOGUE', label: '2. Dialog Dua Arah (R669)', icon: Sparkles },
          { id: 'FREE_RADAR', label: '3. Free Technology Radar (R670)', icon: Search },
          { id: 'FUTURE_RADAR', label: '4. Future Radar (R671)', icon: Compass },
          { id: 'VAULT', label: '5. Knowledge Vault Evolution (R675)', icon: Database },
          { id: 'COUNCIL', label: '6. Future Council Governance (R676)', icon: Award }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-mono transition-all flex items-center gap-2 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: INTELLIGENCE FEED */}
      {activeTab === 'FEED' && (
        <div className="space-y-4">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-[11px] font-mono transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Feed Item Cards */}
          <div className="space-y-4 font-mono text-xs">
            {filteredFeed.map(item => (
              <div key={item.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.urgensi === 'CRITICAL' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' :
                        item.urgensi === 'HIGH' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                        item.urgensi === 'MEDIUM' ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' :
                        'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {item.urgensi}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {item.id} &bull; {item.kategori} &bull; {item.tanggal}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{item.judul}</h4>
                  </div>

                  {/* Status Badge */}
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    STATUS: {item.status}
                  </span>
                </div>

                <div className="space-y-2 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  <p><strong>Sumber Resmi:</strong> {item.sumber} {item.sumberUrl && <span className="text-indigo-500">({item.sumberUrl})</span>}</p>
                  <p><strong>Ringkasan:</strong> {item.ringkasan}</p>
                  <p><strong>Konteks &amp; Relevansi:</strong> {item.konteks} — {item.relevansi}</p>
                  <p><strong>Dampak terhadap TADE:</strong> {item.dampakTerhadapTADE}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Rekomendasi AI Asy:</strong> {item.rekomendasi}
                  </div>
                </div>

                {/* Status Toggle Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px]">
                  <span className="text-slate-400">Verifikasi: <strong>{item.verifikasiKeamanan}</strong></span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'SAVED')}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'DISCUSSED')}
                      className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                    >
                      Bahas
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'ARCHIVED')}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      Arsipkan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TWO-WAY DIALOGUE */}
      {activeTab === 'DIALOGUE' && <TwoWayDialogueViewer />}

      {/* TAB 3: FREE TECHNOLOGY RADAR */}
      {activeTab === 'FREE_RADAR' && <FreeTechnologyRadarViewer />}

      {/* TAB 4: FUTURE RADAR */}
      {activeTab === 'FUTURE_RADAR' && <FutureRadarViewer />}

      {/* TAB 5: KNOWLEDGE VAULT */}
      {activeTab === 'VAULT' && <KnowledgeVaultViewer />}

      {/* TAB 6: FUTURE COUNCIL */}
      {activeTab === 'COUNCIL' && <FutureCouncilViewer />}
    </div>
  );
};
