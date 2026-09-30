import React from 'react';
import {
  ShieldCheck,
  Award,
  BookOpen,
  Activity,
  DollarSign,
  Heart,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';

export interface PillarScore {
  id: string;
  name: string;
  score: number;
  weight: number;
  status: 'EXCELLENT' | 'OPTIMAL' | 'ATTENTION';
  details: string;
  icon: any;
}

const PILLARS: PillarScore[] = [
  {
    id: 'p1',
    name: 'Kurikulum & Karakter Islami',
    score: 100,
    weight: 20,
    status: 'EXCELLENT',
    details: '15 Doa Harian, Surat Pendek Juz 30, dan Kurikulum Sentra terverifikasi.',
    icon: BookOpen
  },
  {
    id: 'p2',
    name: 'Infrastruktur & Keamanan Ring-0',
    score: 100,
    weight: 20,
    status: 'EXCELLENT',
    details: 'Zero permission leakage, Single Source of Truth terisolasi sempurna.',
    icon: ShieldCheck
  },
  {
    id: 'p3',
    name: 'Operasional & Disiplin Sentra',
    score: 99,
    weight: 15,
    status: 'OPTIMAL',
    details: 'Rombel KB & TK berjalan teratur dengan presensi guru & siswa aktif.',
    icon: Activity
  },
  {
    id: 'p4',
    name: 'Keuangan & Infaq Yayasan',
    score: 96,
    weight: 15,
    status: 'OPTIMAL',
    details: 'Penerimaan SPP 91.5%, cadangan kas sarpras surplus 2.4x kebutuhan.',
    icon: DollarSign
  },
  {
    id: 'p5',
    name: 'Adopsi PWA & Kemitraan Wali',
    score: 98,
    weight: 15,
    status: 'OPTIMAL',
    details: 'PWA homescreen install rate tinggi, notifikasi & deep link aktif.',
    icon: Heart
  },
  {
    id: 'p6',
    name: 'Laboratorium & Inovasi TIB',
    score: 98,
    weight: 15,
    status: 'OPTIMAL',
    details: '7 Sandbox Labs siap uji coba, GPU Quality Switch & pipeline media aktif.',
    icon: Cpu
  }
];

export const FounderReadinessScore: React.FC = () => {
  const totalScore = Math.round(
    PILLARS.reduce((acc, curr) => acc + (curr.score * curr.weight) / 100, 0)
  );

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Top Composite Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              AUDIT KELAIKAN TADE v9.7
            </span>
            <span className="text-xs text-emerald-200">
              Composite Readiness Metric
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-black text-white">
            Founder Readiness Composite Score
          </h3>
          <p className="text-xs text-emerald-100/80 max-w-xl">
            Kalkulasi komposit lintas 6 pilar kedaulatan sekolah: kurikulum, keamanan Ring-0, operasional, finansial, adopsi orang tua, dan inovasi lab.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-500/30 shrink-0">
          <div className="text-right">
            <div className="text-3xl font-black text-amber-300">{totalScore}%</div>
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wide">
              GO-LIVE VERIFIED
            </div>
          </div>
          <Award className="w-10 h-10 text-amber-400" />
        </div>
      </div>

      {/* 6 Pillars Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PILLARS.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-500/50 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-stone-800">{p.name}</span>
                </div>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {p.score}%
                </span>
              </div>

              {/* Mini progress bar */}
              <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full"
                  style={{ width: `${p.score}%` }}
                />
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed">
                {p.details}
              </p>

              <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-200/60">
                <span>Bobot: {p.weight}%</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
