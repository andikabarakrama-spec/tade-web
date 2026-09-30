import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  BookOpen,
  Heart,
  Layers,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Smile,
  Zap,
  Info
} from 'lucide-react';
import {
  growingTreeService,
  StudentTreeProfile,
  TreeGrowthStage
} from '../../services/growingTreeService';
import { livingEventEngine } from '../../services/livingEventEngine';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

export const GrowingTreeViewer: React.FC = () => {
  const [profile, setProfile] = useState<StudentTreeProfile>(() =>
    growingTreeService.getSampleStudentTree()
  );
  const [activeTab, setActiveTab] = useState<'TREE' | 'LEAVES' | 'FLOWERS'>('TREE');
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeEvent = livingEventEngine.getActiveEvent();
  const stageInfo = growingTreeService.getTreeStageInfo(profile.stage);

  const handleWaterTree = () => {
    const nextXp = profile.currentXp + 25;
    let nextStage: TreeGrowthStage = profile.stage;
    if (nextXp >= 800) nextStage = 'BERBUAH';
    else if (nextXp >= 500) nextStage = 'BERBUNGA';
    else if (nextXp >= 250) nextStage = 'BATANG_MUDA';
    else if (nextXp >= 100) nextStage = 'TUNAS';

    setProfile({
      ...profile,
      currentXp: nextXp,
      stage: nextStage,
      treeHealth: 100
    });

    founderCommandRecorder.recordCommand(
      'DIRECTIVE',
      'Growing Tree Engine',
      `Menyiram Pohon Karakter Ananda ${profile.studentName} (+25 XP Nutrisi Kasih Sayang)`
    );

    setFeedback('🌿 Pohon Karakter disiram! Bertambah +25 XP dan kesegaran 100%.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              GROWING TREE FOUNDATION (P4)
            </span>
            <span className="text-xs text-stone-500">Pondasi visual pohon perkembangan anak</span>
          </div>
          <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
            <span>Pohon Karakter Santri: {profile.studentName}</span>
          </h2>
          <p className="text-xs text-stone-500">
            Visualisasi hidup perkembangan tahfidz, adab, kemandirian, dan sholat berpadu dengan tema event sekolah.
          </p>
        </div>

        <button
          onClick={handleWaterTree}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Siram Pohon Karakter (+25 XP)</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Top Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
          <div className="text-[10px] text-emerald-800 font-bold uppercase">Tahap Pertumbuhan</div>
          <div className="text-sm font-black text-emerald-950 mt-1 flex items-center gap-1.5">
            <span>{stageInfo.icon}</span>
            <span>{stageInfo.label}</span>
          </div>
        </div>

        <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-200">
          <div className="text-[10px] text-teal-800 font-bold uppercase">Total Daun Prestasi</div>
          <div className="text-sm font-black text-teal-950 mt-1">
            {profile.totalLeaves} Daun Terverifikasi
          </div>
        </div>

        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
          <div className="text-[10px] text-amber-800 font-bold uppercase">Bunga Apresiasi Guru</div>
          <div className="text-sm font-black text-amber-950 mt-1">
            {profile.totalFlowers} Bunga Kasih Sayang
          </div>
        </div>

        <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
          <div className="text-[10px] text-stone-500 font-bold uppercase">Bonus Event Aktif</div>
          <div className="text-xs font-bold text-stone-800 mt-1 truncate">
            {activeEvent.badge}
          </div>
        </div>
      </div>

      {/* Interactive Visual Stage */}
      <div className="bg-gradient-to-b from-teal-950 via-slate-900 to-emerald-950 rounded-3xl p-6 text-white border border-stone-800 relative overflow-hidden flex flex-col items-center justify-center min-h-[320px] text-center space-y-4">
        {/* Sky Ambient Particles */}
        <div className="absolute top-4 left-6 text-2xl animate-bounce">☀️</div>
        <div className="absolute top-6 right-8 text-xl animate-pulse">🦋</div>

        {/* Tree Render Representation */}
        <div className="relative p-6 group cursor-pointer" onClick={handleWaterTree}>
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center text-6xl shadow-2xl group-hover:scale-105 transition-transform duration-500">
            {stageInfo.icon}
          </div>
          <div className="absolute -bottom-2 inset-x-0 mx-auto w-fit px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
            {stageInfo.label}
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full max-w-md space-y-1.5">
          <div className="flex justify-between text-xs text-stone-300">
            <span>Progress Karakter:</span>
            <span className="font-mono text-emerald-300 font-bold">
              {profile.currentXp} / {profile.nextLevelXp} XP
            </span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-stone-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (profile.currentXp / profile.nextLevelXp) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs for Detailed Milestones */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <button
            onClick={() => setActiveTab('LEAVES')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'LEAVES'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            🍃 Daun Prestasi ({profile.leaves.length})
          </button>
          <button
            onClick={() => setActiveTab('FLOWERS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'FLOWERS'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            🌸 Bunga Kasih Sayang ({profile.flowers.length})
          </button>
        </div>

        {activeTab === 'LEAVES' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.leaves.map((leaf) => (
              <div key={leaf.id} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {leaf.pillar}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500">{leaf.achievedDate}</span>
                </div>
                <div className="font-black text-xs text-stone-900">{leaf.title}</div>
                <p className="text-[11px] text-stone-600">{leaf.surahOrHabit}</p>
                <div className="text-[10px] font-bold text-emerald-700">+{leaf.xpPoints} XP Akhlak</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'FLOWERS' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.flowers.map((flower) => (
              <div key={flower.id} className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    {flower.badgeLabel}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500">{flower.date}</span>
                </div>
                <div className="font-black text-xs text-stone-900">{flower.title}</div>
                <p className="text-[11px] text-stone-600">Diberikan oleh: {flower.senderUstadzah}</p>
                <div className="text-[10px] font-bold text-amber-800">Tipe: Bunga {flower.flowerType} (+50 XP)</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
