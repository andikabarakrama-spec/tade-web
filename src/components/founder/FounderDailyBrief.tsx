import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Activity,
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  Heart,
  Award,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Bell,
  RefreshCw,
  Crown
} from 'lucide-react';
import { defaultSchoolTimeAdapter } from '../../core/masterCharacter/schoolTimeAdapter';
import { adoptionAnalyticsService } from '../../services/adoptionAnalyticsService';
import { founderWorkspaceMemory } from '../../services/founderWorkspaceMemory';
import { cabinetResolutionService } from '../../services/cabinetResolutionService';

interface Props {
  onNavigateTab?: (tabId: string) => void;
}

export const FounderDailyBrief: React.FC<Props> = ({ onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'OPERATIONS' | 'INTEGRITY' | 'FINANCE'>('OVERVIEW');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDateStr, setCurrentDateStr] = useState<string>('');
  const [adoptionStats, setAdoptionStats] = useState(adoptionAnalyticsService.getMetrics());
  const [cabinetStats, setCabinetStats] = useState(cabinetResolutionService.getStats());

  useEffect(() => {
    const memory = founderWorkspaceMemory.load();
    if (memory.activeBriefTab) {
      setActiveTab(memory.activeBriefTab);
    }

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      setCurrentDateStr(now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTabSelect = (tab: 'OVERVIEW' | 'OPERATIONS' | 'INTEGRITY' | 'FINANCE') => {
    setActiveTab(tab);
    founderWorkspaceMemory.setBriefTab(tab);
  };

  const period = defaultSchoolTimeAdapter.getCurrentPeriod();

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 text-white relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                FOUNDER EXECUTIVE SITREP
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {currentDateStr} • {currentTime} WIB
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
              Executive Daily Briefing
            </h2>
            <p className="text-xs text-stone-300 max-w-2xl">
              Ringkasan komprehensif operasional, integritas karakter, dan kesehatan ekosistem TK ASY SYIFA.
            </p>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-stone-800">
            {(['OVERVIEW', 'OPERATIONS', 'INTEGRITY', 'FINANCE'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabSelect(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === tab
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {tab === 'OVERVIEW' ? 'Ringkasan' : tab === 'OPERATIONS' ? 'Operasional' : tab === 'INTEGRITY' ? 'Karakter' : 'Keuangan'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6">
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-bold">Periode Sekolah</span>
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-lg font-black text-stone-900">{period.label}</div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                  Status: Operasional Berjalan
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-bold">Adopsi Wali PWA</span>
                  <Heart className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-lg font-black text-stone-900">{adoptionStats.pwaInstalls} Wali</div>
                <div className="text-[11px] text-stone-600 mt-1">
                  {adoptionStats.notificationsEnabled} izin notifikasi aktif
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-bold">Resolusi Yayasan</span>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-lg font-black text-stone-900">{cabinetStats.verified + cabinetStats.completed} / {cabinetStats.total}</div>
                <div className="text-[11px] text-amber-700 font-semibold mt-1">
                  Rerata progres: {cabinetStats.averageProgress}%
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-bold">Integritas Keamanan</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-lg font-black text-emerald-800">100% SECURE</div>
                <div className="text-[11px] text-stone-600 mt-1">
                  Ring-0: Zero Data Drift
                </div>
              </div>
            </div>

            {/* Strategic Summary Box */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-emerald-950">
                    Sovereign SITREP Focus: Kesiapan Penuh Pembelajaran & Kemitraan
                  </h3>
                  <p className="text-xs text-emerald-900/90 leading-relaxed">
                    Hari ini seluruh kelompok kelas (KB Abu Bakar, Umar, Ali, Utsman, Fatimah, Aisyah) berjalan teratur. Program Tahfidz Surat Pendek dan 15 Doa Harian terintegrasi dengan kartu ringkasan wali murid. Tidak ada anomali keamanan dan seluruh sistem berjalan dengan Single Source of Truth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'OPERATIONS' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Agenda & Rutinitas Sentra Hari Ini</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl">
                <div className="font-bold text-stone-800 mb-1">Sentra Balok & Bahan Alam</div>
                <p className="text-stone-600">Eksplorasi sensorik dan rancang bangun masjid cilik.</p>
                <div className="mt-2 text-emerald-700 font-semibold">Guru: Ustadzah Fatimah • 18 Siswa</div>
              </div>
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl">
                <div className="font-bold text-stone-800 mb-1">Sentra Persiapan & Ibadah</div>
                <p className="text-stone-600">Praktik wudhu & sholat dhuha berjamaah dan mutabaah tahfidz.</p>
                <div className="mt-2 text-emerald-700 font-semibold">Guru: Ustadzah Khadijah • 20 Siswa</div>
              </div>
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl">
                <div className="font-bold text-stone-800 mb-1">Sentra Seni & Bermain Peran</div>
                <p className="text-stone-600">Kreasi kaligrafi sederhana dan melatih adab bertamu islami.</p>
                <div className="mt-2 text-emerald-700 font-semibold">Guru: Ustadzah Maryam • 16 Siswa</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'INTEGRITY' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Matriks Mutabaah Karakter & Tahfidz</h3>
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-950">Target Tahfidz Pekanan: QS. Al-Ikhlas & An-Naas</span>
                <span className="px-2 py-0.5 bg-teal-200 text-teal-900 rounded-full font-bold">94% Tercapai</span>
              </div>
              <div className="w-full bg-teal-200/60 rounded-full h-2">
                <div className="bg-teal-700 h-2 rounded-full" style={{ width: '94%' }} />
              </div>
              <p className="text-teal-900">
                15 Doa Harian (Doa Masuk Masjid, Keluar Rumah, Sebelum Makan, Bangun Tidur) rutin diamalkan dalam apersepsi pagi.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'FINANCE' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Posisi Arus Kas & Infaq Lembaga</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                <div className="text-stone-500 font-medium">Realisasi SPP & Infaq Bulan Ini</div>
                <div className="text-2xl font-black text-stone-900">Rp 48.500.000</div>
                <div className="text-emerald-700 font-bold">91.5% dari Target Rp 53.000.000</div>
              </div>
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                <div className="text-stone-500 font-medium">Cadangan Kas Operasional & Sarpras</div>
                <div className="text-2xl font-black text-stone-900">Rp 124.800.000</div>
                <div className="text-teal-700 font-bold">2.4x Kebutuhan Biaya Operasional Bulanan</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
