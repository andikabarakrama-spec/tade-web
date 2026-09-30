import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Shield,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Check,
  Lock,
  Eye
} from 'lucide-react';

export interface HardeningProposal {
  id: string;
  category: 'SECURITY' | 'PERFORMANCE' | 'DATABASE' | 'PAYMENT';
  title: string;
  proposedBy: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  patternFrequency: string;
  recommendationDetails: string;
  recommendedRegressionTests: string[];
  similarIncidents: string[];
  status: 'PENDING_APPROVAL' | 'SUPER_ADMIN_APPROVED';
}

export const GuardianReinforcementCenter: React.FC = () => {
  const [proposals, setProposals] = useState<HardeningProposal[]>([
    {
      id: 'hard-01',
      category: 'PERFORMANCE',
      title: 'Peningkatan TTL Cache Master Siswa & Data Rombel Pagi',
      proposedBy: 'Guardian Maintenance Minister (Eng. Asy-Maintenance)',
      riskLevel: 'LOW',
      patternFrequency: 'Tinggi (Terjadi setiap hari kerja pukul 07:30 - 08:15 WIB)',
      recommendationDetails:
        'Tingkatkan TTL IndexedDB lokal untuk daftar rombel dari 5 menit menjadi 30 menit selama jam presensi pagi guna memotong 70% query Firestore redundant.',
      recommendedRegressionTests: [
        'Test mutasi pindah kelas siswa saat jam aktif',
        'Test sinkronisasi offline-to-online saat reconnect'
      ],
      similarIncidents: ['INC-2026-0810 (Lonjakan Presensi Senin Pagi)', 'INC-2026-0803 (Awal Semester Ganjil)'],
      status: 'PENDING_APPROVAL'
    },
    {
      id: 'hard-02',
      category: 'PAYMENT',
      title: 'Validasi Tambahan Double-Tap Touchscreen Kasir SPP',
      proposedBy: 'Guardian Financial Invariant (Akunt. Asy-Finance)',
      riskLevel: 'LOW',
      patternFrequency: 'Sedang (Terjadi saat antrean kwitansi kasir padat)',
      recommendationDetails:
        'Kunci tombol bayar selama 1200ms secara visual di UI kasir sebagai redundansi perlindungan di atas idempotency lock H0-01 backend.',
      recommendedRegressionTests: [
        'Uji 10 klik simultan pada tombol bayar kwitansi',
        'Uji auto-reset tombol jika koneksi timeout'
      ],
      similarIncidents: ['INC-2026-0808 (Rapid Click Kasir Kasus #12)'],
      status: 'PENDING_APPROVAL'
    },
    {
      id: 'hard-03',
      category: 'SECURITY',
      title: 'Penyempurnaan Regex Prompt Injection Audio Dek Syifa',
      proposedBy: 'AI Asy Intelligence Minister (Dr. Asy-Intelligence)',
      riskLevel: 'LOW',
      patternFrequency: 'Rendah (Pencegahan proaktif)',
      recommendationDetails:
        'Tambahkan 14 variasi kalimat jailbreak baru ke dalam Voice Security Shield sebelum audio diteruskan ke engine Gemini model.',
      recommendedRegressionTests: [
        'Fuzzing 50 skenario manipulasi role via mic suara',
        'Verifikasi du’a anak tetap lolos 100%'
      ],
      similarIncidents: ['SEC-AUDIT-2026-0812'],
      status: 'SUPER_ADMIN_APPROVED'
    }
  ]);

  const handleApprove = (id: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'SUPER_ADMIN_APPROVED' } : p))
    );
  };

  return (
    <div id="guardian-reinforcement-center" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Protokol Verifikasi Tiga Lapis
            </span>
            <span className="text-xs text-slate-400 font-medium">| Otoritas Mutlak Super Admin</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-1">
            Pusat Penguatan & Rekomendasi Hardening Pasca-Insiden
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Hasil pembelajaran mandiri Guardian dikonversi menjadi rekomendasi penguatan kode. Tidak diterapkan otomatis tanpa persetujuan manusia.
          </p>
        </div>

        <div className="text-right hidden sm:block">
          <div className="text-xs text-slate-400">Total Rekomendasi</div>
          <div className="text-lg font-bold text-teal-400">{proposals.length} Modul Teridentifikasi</div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {proposals.map((prop) => {
          const isApproved = prop.status === 'SUPER_ADMIN_APPROVED';

          return (
            <div
              key={prop.id}
              className={`p-6 rounded-2xl border transition bg-white ${
                isApproved ? 'border-emerald-300 shadow-xs' : 'border-stone-200 shadow-xs hover:border-slate-400'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-stone-100 px-2 py-0.5 rounded-md">
                      {prop.id}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">[{prop.category}]</span>
                    <span className="text-xs text-stone-400">• Diusulkan oleh {prop.proposedBy}</span>
                  </div>
                  <h4 className="text-base font-bold text-stone-900 mt-1">{prop.title}</h4>
                </div>

                <div>
                  {isApproved ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      DISETUJUI SUPER ADMIN
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApprove(prop.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      Setujui Penguatan (Super Admin)
                    </button>
                  )}
                </div>
              </div>

              {/* Details Body */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-stone-400 font-medium">Uraian Rekomendasi</div>
                    <p className="text-xs text-stone-700 mt-1 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                      {prop.recommendationDetails}
                    </p>
                  </div>

                  <div>
                    <div className="text-xs text-stone-400 font-medium">Frekuensi Pola Terdeteksi</div>
                    <div className="text-xs font-semibold text-slate-800 mt-0.5">{prop.patternFrequency}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-stone-400 font-medium">Rekomendasi Uji Regresi Terkait</div>
                    <ul className="mt-1 space-y-1">
                      {prop.recommendedRegressionTests.map((t, idx) => (
                        <li key={idx} className="text-xs text-stone-700 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-xs text-stone-400 font-medium">Insiden Serupa Sebelumnya (GKL)</div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {prop.similarIncidents.map((inc, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                        >
                          {inc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
