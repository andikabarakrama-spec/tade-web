import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Zap,
  Sparkles,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Crown,
  HeartPulse,
  HardDrive,
  Cpu,
  Layers,
  Image as ImageIcon,
  CheckSquare,
  Lock,
  Flame,
  ChevronRight
} from 'lucide-react';
import {
  drPulseHealthPassportService,
  HealthPassportSummary,
  PillarHealthItem,
  HealthStatus,
  AutonomousCareRecommendation
} from '../../services/drPulseHealthPassport';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

interface DrPulseHealthPassportProps {
  onNavigateTab?: (tabId: string) => void;
}

export const DrPulseHealthPassport: React.FC<DrPulseHealthPassportProps> = ({ onNavigateTab }) => {
  const [passport, setPassport] = useState<HealthPassportSummary>(
    drPulseHealthPassportService.getWeeklyHealthPassport()
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'PILLARS' | 'PREDICTION' | 'RECOMMENDATIONS'>('PILLARS');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPassport(drPulseHealthPassportService.getWeeklyHealthPassport());
      setIsRefreshing(false);
      setFeedback('Paspor Kesehatan & Telemetri Dr. Pulse berhasil diperbarui.');
      setTimeout(() => setFeedback(null), 3000);
    }, 400);
  };

  const handleApplyRecommendation = (rec: AutonomousCareRecommendation) => {
    drPulseHealthPassportService.applySafeRecommendation(rec.id);
    setPassport(drPulseHealthPassportService.getWeeklyHealthPassport());
    
    founderCommandRecorder.recordCommand(
      'SYSTEM_DIAGNOSTIC',
      'Dr. Pulse Autonomous Care',
      `Rekomendasi aman diterapkan: ${rec.title}`
    );

    setFeedback(`Rekomendasi "${rec.title}" berhasil dijalankan secara aman.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const getStatusBadge = (status: HealthStatus) => {
    switch (status) {
      case 'GREEN':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
          color: 'text-emerald-600',
          label: 'HIJAU • OPTIMAL'
        };
      case 'YELLOW':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: AlertTriangle,
          color: 'text-amber-600',
          label: 'KUNING • PERHATIAN'
        };
      case 'RED':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: XCircle,
          color: 'text-rose-600',
          label: 'MERAH • KRITIS'
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 p-6 rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-400/20 text-teal-300 border border-teal-400/30 flex items-center gap-1">
              <HeartPulse className="w-3 h-3 text-rose-400" />
              DR. PULSE AUTONOMOUS CARE v10.2
            </span>
            <span className="text-xs text-stone-300">
              Sprint G5 Living Intelligence
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            Paspor Kesehatan & Perawatan Mandiri
          </h2>
          <p className="text-xs text-teal-100/80 max-w-2xl">
            Inspeksi otomatis 8 pilar kedaulatan, prediksi kapasitas penyimpanan, tren performa 60 FPS, kesehatan memori, dan rekomendasi aman non-intrusif.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-800/80 border border-stone-700 rounded-xl text-center">
            <div className="text-[10px] text-stone-400 font-medium">Composite Health</div>
            <div className="text-xl font-black text-emerald-400">{passport.overallScore}%</div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Pindai Ulang</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('PILLARS')}
          className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'PILLARS'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>8 Pilar Kedaulatan</span>
        </button>
        <button
          onClick={() => setActiveSubTab('PREDICTION')}
          className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'PREDICTION'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Prediksi & Telemetri Real-Time</span>
        </button>
        <button
          onClick={() => setActiveSubTab('RECOMMENDATIONS')}
          className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'RECOMMENDATIONS'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Rekomendasi Aman ({passport.safeRecommendations.filter(r => !r.applied).length})</span>
        </button>
      </div>

      {/* TAB 1: 8-PILLARS */}
      {activeSubTab === 'PILLARS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {passport.pillars.map((pillar) => {
              const badge = getStatusBadge(pillar.status);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={pillar.id}
                  className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5 flex flex-col justify-between hover:border-emerald-500/50 transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                        {pillar.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border flex items-center gap-1 ${badge.bg}`}>
                        <BadgeIcon className="w-3 h-3" />
                        {pillar.status}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-xs text-stone-900 leading-snug">
                      {pillar.name}
                    </h4>

                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {pillar.headline}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-200 space-y-1 text-[10px]">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500 font-medium">Metrik:</span>
                      <span className="font-mono font-bold text-emerald-800">{pillar.metric}</span>
                    </div>
                    <div className="text-stone-500 italic truncate" title={pillar.autonomousAction}>
                      {pillar.autonomousAction}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PREDICTION & TELEMETRY */}
      {activeSubTab === 'PREDICTION' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Storage Prediction Card */}
          <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-stone-800 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-600" />
                <span>Storage Prediction & Capacity Engine</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                {passport.storagePrediction.status}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-stone-600 font-medium">
                <span>Terpakai: {passport.storagePrediction.currentUsageMB} MB / {passport.storagePrediction.maxQuotaMB} MB</span>
                <span className="font-bold text-stone-900">{passport.storagePrediction.usagePercentage}%</span>
              </div>
              <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${passport.storagePrediction.usagePercentage}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2 bg-white rounded-xl border border-stone-200">
                <span className="text-stone-500 block">Pertumbuhan Harian:</span>
                <span className="font-bold text-stone-800">~{passport.storagePrediction.dailyGrowthRateKB} KB/hari</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-stone-200">
                <span className="text-stone-500 block">Prediksi Sisa Hari:</span>
                <span className="font-bold text-emerald-700">~{passport.storagePrediction.predictedDaysRemaining} Hari</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-600 italic bg-white p-2.5 rounded-xl border border-stone-200">
              {passport.storagePrediction.recommendation}
            </p>
          </div>

          {/* Performance & Animation Health Card */}
          <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-stone-800 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-teal-600" />
                <span>GPU & Animation Health Telemetry</span>
              </div>
              <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded font-bold text-[10px]">
                60 FPS LOCKED
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Rata-rata FPS</span>
                <span className="text-base font-black text-emerald-600">{passport.performanceTrend.avgFPS}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Frame Drops</span>
                <span className="text-base font-black text-stone-800">{passport.performanceTrend.frameDropsLastHour}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Render Latency</span>
                <span className="text-base font-black text-teal-600">{passport.performanceTrend.renderLatencyMS}ms</span>
              </div>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-[11px] space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-stone-500">Anggaran Frame:</span>
                <span className="font-bold text-emerald-800">{passport.animationHealth.frameBudgetUsagePct}% (Sangat Ringan)</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-stone-500">Scheduler Sync:</span>
                <span className="font-bold text-stone-800">{passport.animationHealth.schedulerSyncRate}</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-600 italic bg-white p-2.5 rounded-xl border border-stone-200">
              {passport.performanceTrend.recommendation}
            </p>
          </div>

          {/* Memory & Upload Health */}
          <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
            <div className="font-bold text-stone-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Kesehatan Memori & Cache (Zero Heap Leak)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-white rounded-xl border border-stone-200">
                <span className="text-stone-500 block">LocalStorage:</span>
                <span className="font-bold text-stone-800">{passport.memoryHealth.localStorageKB} KB</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-stone-200">
                <span className="text-stone-500 block">IndexedDB Store:</span>
                <span className="font-bold text-stone-800">{passport.memoryHealth.indexedDbMB} MB</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-600 italic bg-white p-2.5 rounded-xl border border-stone-200">
              {passport.memoryHealth.recommendation}
            </p>
          </div>

          {/* Upload Pipeline Health */}
          <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
            <div className="font-bold text-stone-800 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              <span>Smart Upload Health & Duplicate Intelligence</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Total Aset</span>
                <span className="font-bold text-stone-800">{passport.uploadHealth.totalMediaAssets}</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Skor Ketajaman</span>
                <span className="font-bold text-emerald-700">{passport.uploadHealth.avgSharpnessScore}%</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Tolak Duplikat</span>
                <span className="font-bold text-indigo-700">{passport.uploadHealth.duplicateRejections} file</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-600 italic bg-white p-2.5 rounded-xl border border-stone-200">
              {passport.uploadHealth.recommendation}
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: SAFE RECOMMENDATIONS (Autonomous Care) */}
      {activeSubTab === 'RECOMMENDATIONS' && (
        <div className="space-y-3">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Prinsip Autonomous Care:</strong> Sistem tidak memodifikasi data secara diam-diam. Setiap rekomendasi memerlukan pengesahan dari Anda.
            </span>
          </div>

          <div className="space-y-3">
            {passport.safeRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 text-[10px] font-bold">
                      {rec.category}
                    </span>
                    <h5 className="font-black text-stone-900 text-sm">{rec.title}</h5>
                  </div>
                  <p className="text-stone-600 text-[11px] max-w-xl">{rec.description}</p>
                </div>

                <div>
                  {rec.applied ? (
                    <span className="px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Telah Diterapkan
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApplyRecommendation(rec)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      {rec.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
