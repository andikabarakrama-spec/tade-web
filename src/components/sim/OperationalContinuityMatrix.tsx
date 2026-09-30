import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Layers,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Activity,
  Cpu,
  FileText,
  CreditCard,
  GraduationCap,
  HardDrive,
  Users,
  Lock
} from 'lucide-react';

export interface SectorContinuity {
  id: string;
  sectorName: string;
  guardianLead: string;
  status: 'OPTIMAL' | 'BUSY_DELEGATING' | 'REINFORCING';
  loadPercent: number;
  isolationLane: string;
  failoverReady: boolean;
  impactOnOthers: string;
  independentStorage: string;
}

export const OperationalContinuityMatrix: React.FC = () => {
  const [activeSimulationScenario, setActiveSimulationScenario] = useState<'NORMAL' | 'DDOS_BURST' | 'PPDB_PEAK' | 'DOC_HEAVY'>('NORMAL');

  const getSectors = (scenario: 'NORMAL' | 'DDOS_BURST' | 'PPDB_PEAK' | 'DOC_HEAVY'): SectorContinuity[] => {
    switch (scenario) {
      case 'DDOS_BURST':
        return [
          {
            id: 'sec-security',
            sectorName: 'Edge & Ingress Security',
            guardianLead: 'Guardian DDoS & Honey Shield',
            status: 'BUSY_DELEGATING',
            loadPercent: 88,
            isolationLane: 'Lane #01 (Edge Firewall)',
            failoverReady: true,
            impactOnOthers: 'Terasolasi 100% — Tidak ada spillover ke database/kasir.',
            independentStorage: 'Edge Memory Cache & IP Blacklist KV'
          },
          {
            id: 'sec-payment',
            sectorName: 'Financial & SPP Core',
            guardianLead: 'Guardian Financial Invariant (FIND-08-R4)',
            status: 'OPTIMAL',
            loadPercent: 12,
            isolationLane: 'Lane #02 (Secure Financial Vault)',
            failoverReady: true,
            impactOnOthers: 'Berjalan 100% normal tanpa delay atau gangguan.',
            independentStorage: 'Isolated Transaction Mutex & Zero-Drift Ledger'
          },
          {
            id: 'sec-docs',
            sectorName: 'Smart Document Factory',
            guardianLead: 'Guardian Document Lifecycle Engine',
            status: 'OPTIMAL',
            loadPercent: 18,
            isolationLane: 'Lane #03 (Worker Thread Sandbox)',
            failoverReady: true,
            impactOnOthers: 'Generasi rapor & PDF kwitansi tetap lancar.',
            independentStorage: 'Ephemeral PDF Buffer'
          },
          {
            id: 'sec-edu',
            sectorName: 'Education & Tahfidz',
            guardianLead: 'Guardian Academic & Mutabaah System',
            status: 'OPTIMAL',
            loadPercent: 24,
            isolationLane: 'Lane #04 (Classroom Engine)',
            failoverReady: true,
            impactOnOthers: 'Presensi & buku penghubung aktif normal.',
            independentStorage: 'IndexedDB Offline Cache'
          },
          {
            id: 'sec-recovery',
            sectorName: 'Autonomous Recovery',
            guardianLead: 'Guardian Recovery & Snapshot Engine',
            status: 'OPTIMAL',
            loadPercent: 8,
            isolationLane: 'Lane #05 (Background Cold Archive)',
            failoverReady: true,
            impactOnOthers: 'Verifikasi berkala berjalan di thread terpisah.',
            independentStorage: 'Immutable Snapshot Vault'
          }
        ];

      case 'PPDB_PEAK':
        return [
          {
            id: 'sec-security',
            sectorName: 'Edge & Ingress Security',
            guardianLead: 'Guardian DDoS & Honey Shield',
            status: 'OPTIMAL',
            loadPercent: 32,
            isolationLane: 'Lane #01 (Edge Firewall)',
            failoverReady: true,
            impactOnOthers: 'Ingress traffic terfilter rapi.',
            independentStorage: 'Edge Memory Cache'
          },
          {
            id: 'sec-payment',
            sectorName: 'Financial & SPP Core',
            guardianLead: 'Guardian Financial Invariant (FIND-08-R4)',
            status: 'OPTIMAL',
            loadPercent: 28,
            isolationLane: 'Lane #02 (Secure Financial Vault)',
            failoverReady: true,
            impactOnOthers: 'Pembayaran formulir PPDB diproses teratur.',
            independentStorage: 'Isolated Transaction Mutex'
          },
          {
            id: 'sec-docs',
            sectorName: 'Smart Document Factory',
            guardianLead: 'Guardian Document Lifecycle Engine',
            status: 'BUSY_DELEGATING',
            loadPercent: 82,
            isolationLane: 'Lane #03 (Worker Thread Sandbox)',
            failoverReady: true,
            impactOnOthers: 'Antrean PDF pendaftar di-batching tanpa menghambat kasir.',
            independentStorage: 'Worker Queue Partition'
          },
          {
            id: 'sec-edu',
            sectorName: 'Education & Tahfidz',
            guardianLead: 'Guardian Academic & Mutabaah System',
            status: 'OPTIMAL',
            loadPercent: 15,
            isolationLane: 'Lane #04 (Classroom Engine)',
            failoverReady: true,
            impactOnOthers: 'Kegiatan belajar mengajar santri normal.',
            independentStorage: 'IndexedDB Offline Cache'
          },
          {
            id: 'sec-recovery',
            sectorName: 'Autonomous Recovery',
            guardianLead: 'Guardian Recovery & Snapshot Engine',
            status: 'OPTIMAL',
            loadPercent: 10,
            isolationLane: 'Lane #05 (Background Cold Archive)',
            failoverReady: true,
            impactOnOthers: 'Audit integritas data calon santri terekam.',
            independentStorage: 'Immutable Snapshot Vault'
          }
        ];

      default:
        return [
          {
            id: 'sec-security',
            sectorName: 'Edge & Ingress Security',
            guardianLead: 'Guardian DDoS & Honey Shield',
            status: 'OPTIMAL',
            loadPercent: 14,
            isolationLane: 'Lane #01 (Edge Firewall)',
            failoverReady: true,
            impactOnOthers: 'Kondisi hijau, 0 ancaman aktif.',
            independentStorage: 'Edge Memory Cache'
          },
          {
            id: 'sec-payment',
            sectorName: 'Financial & SPP Core',
            guardianLead: 'Guardian Financial Invariant (FIND-08-R4)',
            status: 'OPTIMAL',
            loadPercent: 8,
            isolationLane: 'Lane #02 (Secure Financial Vault)',
            failoverReady: true,
            impactOnOthers: 'Semua mutasi zero-drift.',
            independentStorage: 'Isolated Transaction Mutex'
          },
          {
            id: 'sec-docs',
            sectorName: 'Smart Document Factory',
            guardianLead: 'Guardian Document Lifecycle Engine',
            status: 'OPTIMAL',
            loadPercent: 12,
            isolationLane: 'Lane #03 (Worker Thread Sandbox)',
            failoverReady: true,
            impactOnOthers: 'Generasi berkas on-demand.',
            independentStorage: 'Ephemeral Buffer'
          },
          {
            id: 'sec-edu',
            sectorName: 'Education & Tahfidz',
            guardianLead: 'Guardian Academic & Mutabaah System',
            status: 'OPTIMAL',
            loadPercent: 20,
            isolationLane: 'Lane #04 (Classroom Engine)',
            failoverReady: true,
            impactOnOthers: 'Presensi santri sinkron.',
            independentStorage: 'IndexedDB Offline Cache'
          },
          {
            id: 'sec-recovery',
            sectorName: 'Autonomous Recovery',
            guardianLead: 'Guardian Recovery & Snapshot Engine',
            status: 'OPTIMAL',
            loadPercent: 5,
            isolationLane: 'Lane #05 (Background Cold Archive)',
            failoverReady: true,
            impactOnOthers: 'Snapshot sync sehat.',
            independentStorage: 'Immutable Snapshot Vault'
          }
        ];
    }
  };

  const sectors = getSectors(activeSimulationScenario);

  return (
    <div id="operational-continuity-matrix" className="space-y-6">
      {/* Scenario Switcher Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Zero Single Point of Failure
            </span>
            <span className="text-xs text-slate-400 font-medium">| Arsitektur Jalur Terisolasi</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-1">
            Matriks Kontinuitas Operasional Lintas Sektor
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Buktikan ketahanan sistem: jika satu Guardian sibuk/menangani insiden, sektor lain tetap beroperasi 100% tanpa gangguan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Uji Simulasi:</span>
          {[
            { key: 'NORMAL', label: 'Operasi Normal' },
            { key: 'DDOS_BURST', label: 'Simulasi Lonjakan DDoS' },
            { key: 'PPDB_PEAK', label: 'Simulasi Puncak PPDB' }
          ].map((sc) => (
            <button
              key={sc.key}
              onClick={() => setActiveSimulationScenario(sc.key as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSimulationScenario === sc.key
                  ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Continuity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectors.map((sec) => {
          const isBusy = sec.status === 'BUSY_DELEGATING';
          return (
            <div
              key={sec.id}
              className={`p-5 rounded-2xl border transition ${
                isBusy
                  ? 'bg-amber-500/5 border-amber-500/30 shadow-md ring-1 ring-amber-500/20'
                  : 'bg-white border-stone-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                  {sec.isolationLane}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isBusy
                      ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                  }`}
                >
                  {isBusy ? 'SIBUK & TERISOLASI' : 'OPTIMAL (100% UP)'}
                </span>
              </div>

              <h4 className="text-sm font-bold text-stone-900">{sec.sectorName}</h4>
              <div className="text-xs text-stone-500 mt-0.5">{sec.guardianLead}</div>

              {/* Load Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-stone-500">Beban Pemrosesan:</span>
                  <span className={isBusy ? 'text-amber-600' : 'text-emerald-600'}>{sec.loadPercent}%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isBusy ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${sec.loadPercent}%` }}
                  />
                </div>
              </div>

              {/* Isolation Proof */}
              <div className="mt-4 pt-3 border-t border-stone-100 space-y-2 text-xs">
                <div>
                  <span className="text-stone-400 block text-[11px]">Dampak Terhadap Sektor Lain:</span>
                  <span className="font-medium text-stone-800">{sec.impactOnOthers}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Penyimpanan Mandiri:</span>
                  <span className="font-mono text-[11px] text-stone-600">{sec.independentStorage}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
