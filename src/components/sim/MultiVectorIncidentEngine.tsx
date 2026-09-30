import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Flame,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  BookOpen,
  Radio,
  FileText,
  CreditCard,
  Database,
  Users,
  HardDrive,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export interface BattleWave {
  waveNumber: number;
  waveName: string;
  intensity: 'Light' | 'Moderate' | 'Heavy' | 'Combined' | 'Recovery';
  description: string;
  vectors: string[];
  detectionLog: string;
  guardianResponse: string;
  aiRecommendation: string;
  recoveryStatus: string;
  metrics: {
    latency: string;
    trafficQps: string;
    zeroDriftStatus: boolean;
    integrityVerified: boolean;
  };
}

export interface BattleMemoryCard {
  id: string;
  title: string;
  waveLevel: string;
  rootCause: string;
  guardianResponse: string;
  recoveryTimeMs: number;
  preventionStrategy: string;
  regressionTest: string;
  gklClassification: string;
  createdAt: string;
}

export const MultiVectorIncidentEngine: React.FC = () => {
  const [activeWave, setActiveWave] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [generatedMemories, setGeneratedMemories] = useState<BattleMemoryCard[]>([]);

  const waves: BattleWave[] = [
    {
      waveNumber: 1,
      waveName: 'Gelombang 1 — Light Ingress & Attendance Influx',
      intensity: 'Light',
      description: 'Lonjakan ringan presensi santri pagi hari bersamaan dengan 20 request voice audio.',
      vectors: ['Attendance Rush', 'Voice Requests'],
      detectionLog: '08:00 WIB — Monitoring mencatat 45 req/detik presensi masuk via portal guru.',
      guardianResponse: 'Guardian Academic mengaktifkan batch sync IndexedDB lokal; latensi terjaga 16ms.',
      aiRecommendation: 'AI Education menyarankan pre-load daftar rombel kelas TK-A dan TK-B.',
      recoveryStatus: 'Kondisi 100% terkendali tanpa anomali.',
      metrics: {
        latency: '16 ms',
        trafficQps: '45 qps',
        zeroDriftStatus: true,
        integrityVerified: true
      }
    },
    {
      waveNumber: 2,
      waveName: 'Gelombang 2 — Moderate PPDB Surge & Upload Flood',
      intensity: 'Moderate',
      description: 'Pendaftaran gelombang 2 PPDB dibuka; 80 calon wali murid mengunggah berkas KK & Akta serentak.',
      vectors: ['PPDB Surge', 'Upload Flood'],
      detectionLog: '08:05 WIB — Gate intake PPDB mendeteksi 80 request upload payload bersamaan.',
      guardianResponse: 'Guardian Resilient Storage mengaktifkan adaptive chunking & deduplikasi file hash.',
      aiRecommendation: 'AI Document Minister mengalokasikan worker thread kompresi foto terpisah.',
      recoveryStatus: 'Antrean upload selesai dalam 1.8 detik tanpa memory spike.',
      metrics: {
        latency: '24 ms',
        trafficQps: '110 qps',
        zeroDriftStatus: true,
        integrityVerified: true
      }
    },
    {
      waveNumber: 3,
      waveName: 'Gelombang 3 — Heavy DDoS Pressure & Firestore Spike',
      intensity: 'Heavy',
      description: 'Upaya scraping bot 500 req/menit terhadap endpoint publik disertai peningkatan beban query.',
      vectors: ['DDoS Pressure', 'Firestore Latency'],
      detectionLog: '08:10 WIB — Honey Shield mendeteksi 4 IP melakukan crawl berulang tanpa token otentikasi.',
      guardianResponse: 'Guardian DDoS mengisolasi 4 IP ke Honey Trap; Guardian Firestore mengaktifkan cache routing.',
      aiRecommendation: 'AI Monitoring Minister menaikkan scoring alert ke Defcon Yellow.',
      recoveryStatus: 'Trafik liar diblokir di Edge; Core Firestore tetap stabil di 22ms.',
      metrics: {
        latency: '22 ms',
        trafficQps: '320 qps',
        zeroDriftStatus: true,
        integrityVerified: true
      }
    },
    {
      waveNumber: 4,
      waveName: 'Gelombang 4 — Combined Multi-Vector Stress (The Crucible)',
      intensity: 'Combined',
      description: 'Semua 7 vektor insiden berjalan bersamaan: PPDB + Presensi + SPP Kasir + Backup + DDoS + Voice + Upload.',
      vectors: ['PPDB Surge', 'Attendance Rush', 'Upload Flood', 'Firestore Latency', 'Voice Requests', 'DDoS Pressure', 'Backup Running'],
      detectionLog: '08:15 WIB — Seluruh sektor mendeteksi beban puncak multivariabel simultan.',
      guardianResponse: 'Orkestrasi Lintas Guardian aktif: Jalur terisolasi memisahkan kasir (FIND-08-R4) dan backup dari beban PPDB.',
      aiRecommendation: 'AI Asy Prime mengoordinasikan seluruh 8 menteri untuk menjaga Zero Data Drift.',
      recoveryStatus: 'Pertahanan terpadu sukses: 0 transaksi kasir terganggu, 0 data korup.',
      metrics: {
        latency: '38 ms',
        trafficQps: '680 qps',
        zeroDriftStatus: true,
        integrityVerified: true
      }
    },
    {
      waveNumber: 5,
      waveName: 'Gelombang 5 — Autonomous Zero-Damage Recovery',
      intensity: 'Recovery',
      description: 'Siklus pemulihan mandiri pasca-badai multisektor; pembuatan Battle Memory Card dan arsip GKL.',
      vectors: ['Self-Healing Verification', 'Integrity Signature Audit'],
      detectionLog: '08:20 WIB — Beban trafik mereda ke level normal baseline (18 qps).',
      guardianResponse: 'Guardian Royal Guard mengonfirmasi 100% invariant aman; Recovery Engine mencatat RPO=0.',
      aiRecommendation: 'AI Knowledge Minister menyusun rangkuman kartu pengetahuan ke GKL.',
      recoveryStatus: 'Kondisi Defcon 5 Green dipulihkan penuh dengan integritas 100%.',
      metrics: {
        latency: '15 ms',
        trafficQps: '18 qps',
        zeroDriftStatus: true,
        integrityVerified: true
      }
    }
  ];

  const currentWaveData = waves[activeWave - 1];

  const handleStartSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveWave(1);

    let current = 1;
    const interval = setInterval(() => {
      current += 1;
      if (current > 5) {
        clearInterval(interval);
        setIsRunning(false);
        setActiveWave(5);
        // Generate Battle Memory Card
        const newCard: BattleMemoryCard = {
          id: `BMC-${Date.now().toString().slice(-4)}`,
          title: 'Orkestrasi Simulasi Multivektor 5 Gelombang Penuh',
          waveLevel: 'Gelombang 1 - 5 (Combined Wave Crucible)',
          rootCause: 'Simulasi beban serentak 7 vektor (PPDB, SPP, Presensi, DDoS, Upload, Voice, Backup)',
          guardianResponse: 'Isolasi jalur per sektor; Zero Drift Lock H0-01 aktif; Honey Shield Edge Ingress',
          recoveryTimeMs: 380,
          preventionStrategy: 'Pertahankan isolasi worker thread dan limit adaptif 100 req/mnt/IP',
          regressionTest: 'Uji concurrency 50 transaksi SPP simultan selama lonjakan upload PPDB',
          gklClassification: 'GKL-BATTLEFIELD-ORCHESTRATION',
          createdAt: new Date().toLocaleTimeString('id-ID') + ' WIB'
        };
        setGeneratedMemories((prev) => [newCard, ...prev]);
      } else {
        setActiveWave(current);
      }
    }, 1500);
  };

  return (
    <div id="multi-vector-incident-engine" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              Engine Insiden Multivektor & Sistem Gelombang Pertempuran
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Uji orkestrasi serentak 7 Guardian dalam skenario gabungan dari Gelombang 1 (Light) hingga Gelombang 5 (Recovery).
          </p>
        </div>

        <button
          onClick={handleStartSimulation}
          disabled={isRunning}
          className={`px-5 py-3 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
            isRunning
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-rose-500 text-white hover:bg-rose-400 shadow-md font-black'
          }`}
        >
          {isRunning ? (
            <>
              <Activity className="w-4 h-4 animate-spin text-white" />
              Menjalankan Gelombang {activeWave}/5...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Luncurkan Simulasi 5 Gelombang Penuh
            </>
          )}
        </button>
      </div>

      {/* Wave Stepper Bar */}
      <div className="grid grid-cols-5 gap-2">
        {waves.map((w) => {
          const isSelected = activeWave === w.waveNumber;
          const isDone = activeWave > w.waveNumber;

          return (
            <button
              key={w.waveNumber}
              onClick={() => !isRunning && setActiveWave(w.waveNumber)}
              className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                  : isDone
                  ? 'bg-teal-50/50 border-teal-200 text-slate-800'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                Wave {w.waveNumber}
              </div>
              <div className="text-xs font-extrabold mt-0.5 truncate">{w.intensity}</div>
            </button>
          );
        })}
      </div>

      {/* Current Active Wave Dashboard */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-teal-600">
              [GELOMBANG AKTIF KE-{currentWaveData.waveNumber}]
            </span>
            <h4 className="text-base font-bold text-stone-900 mt-0.5">{currentWaveData.waveName}</h4>
            <p className="text-xs text-stone-500 mt-1">{currentWaveData.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {currentWaveData.vectors.map((vec, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
              >
                {vec}
              </span>
            ))}
          </div>
        </div>

        {/* 4 Pillars of Wave Response */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>1. Deteksi Insiden (Detection)</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed pl-6">{currentWaveData.detectionLog}</p>
          </div>

          <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>2. Respon Guardian (Guardian Response)</span>
            </div>
            <p className="text-xs text-teal-800 leading-relaxed pl-6">{currentWaveData.guardianResponse}</p>
          </div>

          <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>3. Rekomendasi AI Asy (AI Recommendation)</span>
            </div>
            <p className="text-xs text-purple-800 leading-relaxed pl-6">{currentWaveData.aiRecommendation}</p>
          </div>

          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>4. Status Pemulihan (Recovery Status)</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed pl-6">{currentWaveData.recoveryStatus}</p>
          </div>
        </div>

        {/* Real-time Telemetry for Wave */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-center">
            <div className="text-[10px] text-stone-400 font-medium">Beban Trafik</div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">{currentWaveData.metrics.trafficQps}</div>
          </div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-center">
            <div className="text-[10px] text-stone-400 font-medium">Latensi Respons</div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">{currentWaveData.metrics.latency}</div>
          </div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-center">
            <div className="text-[10px] text-stone-400 font-medium">Integritas Keuangan</div>
            <div className="text-sm font-bold text-emerald-600 mt-0.5">Rp 0 Drift (100%)</div>
          </div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-center">
            <div className="text-[10px] text-stone-400 font-medium">Kondisi Data Produksi</div>
            <div className="text-sm font-bold text-teal-600 mt-0.5">0 Modifikasi (Read-Only)</div>
          </div>
        </div>
      </div>

      {/* Generated Battle Memory Cards (Phase 10) */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <h4 className="text-sm font-bold text-stone-900">
              Kartu Pengetahuan Pertempuran (Battle Memory & GKL Expansion)
            </h4>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            {generatedMemories.length > 0 ? `${generatedMemories.length} Tersimpan di GKL` : 'Siap merekam pasca-simulasi'}
          </span>
        </div>

        {generatedMemories.length === 0 ? (
          <div className="text-center py-8 bg-stone-50 rounded-xl border border-dashed border-stone-200">
            <p className="text-xs text-stone-500">
              Jalankan simulasi 5 gelombang penuh untuk menggenerasi Kartu Pengetahuan Pertempuran (Battle Memory) otomatis.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {generatedMemories.map((card) => (
              <div
                key={card.id}
                className="p-4 rounded-xl border border-teal-200 bg-teal-50/20 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-teal-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                      {card.id}
                    </span>
                    <span className="font-bold text-stone-900">{card.title}</span>
                  </div>
                  <span className="text-[11px] text-stone-500">{card.createdAt}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Akar Masalah (Root Cause):</span>
                    <span className="text-stone-700 font-medium">{card.rootCause}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Respon Guardian:</span>
                    <span className="text-stone-700 font-medium">{card.guardianResponse}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Strategi Pencegahan:</span>
                    <span className="text-stone-700 font-medium">{card.preventionStrategy}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Rekomendasi Uji Regresi:</span>
                    <span className="text-stone-700 font-medium">{card.regressionTest}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-teal-100 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-teal-700">Katalog: {card.gklClassification}</span>
                  <span className="text-emerald-700 font-bold">Waktu Pulih: {card.recoveryTimeMs} ms</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
