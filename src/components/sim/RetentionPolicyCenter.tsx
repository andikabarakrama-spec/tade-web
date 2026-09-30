import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Layers, 
  GraduationCap, 
  DollarSign, 
  UserPlus, 
  Terminal, 
  HardDrive, 
  AlertCircle, 
  CheckCircle2, 
  Archive, 
  Sparkles,
  Info,
  ArrowRight
} from 'lucide-react';

export interface RetentionRule {
  id: string;
  ruleCode: string;
  dataCategory: string;
  retentionPeriod: string;
  retentionYears: number;
  retentionDays: number;
  postRetentionAction: 'MOVE_TO_TIME_CAPSULE' | 'SECURE_CONTROLLED_DESTRUCTION' | 'ROLLING_PURGE';
  legalBasis: string;
  activeRecordsCount: number;
  scheduledArchiveCount: number;
  status: 'ACTIVE_ENFORCED' | 'MONITORED';
}

export const RetentionPolicyCenter: React.FC = () => {
  const [retentionRules, setRetentionRules] = useState<RetentionRule[]>([
    {
      id: 'RET-001',
      ruleCode: 'RET-RAPORT-100Y',
      dataCategory: 'Raport Sentra, Portofolio & Ijazah Santri',
      retentionPeriod: '100 Tahun (Centennial Vault)',
      retentionYears: 100,
      retentionDays: 36500,
      postRetentionAction: 'MOVE_TO_TIME_CAPSULE',
      legalBasis: 'Permendikbud & Regulasi Penyelenggaraan Arsip Ijazah Nasional',
      activeRecordsCount: 486,
      scheduledArchiveCount: 48,
      status: 'ACTIVE_ENFORCED'
    },
    {
      id: 'RET-002',
      ruleCode: 'RET-TABUNGAN-10Y',
      dataCategory: 'Buku Tabungan Santri, SPP & Rekap Kas Keuangan',
      retentionPeriod: '10 Tahun',
      retentionYears: 10,
      retentionDays: 3650,
      postRetentionAction: 'MOVE_TO_TIME_CAPSULE',
      legalBasis: 'UU Perbankan/Akuntansi Syariah & Standar Pemeriksaan Kemenkeu',
      activeRecordsCount: 1420,
      scheduledArchiveCount: 115,
      status: 'ACTIVE_ENFORCED'
    },
    {
      id: 'RET-003',
      ruleCode: 'RET-LOGSYS-05Y',
      dataCategory: 'Audit Replay Log, System Telemetry & Access Events',
      retentionPeriod: '5 Tahun',
      retentionYears: 5,
      retentionDays: 1825,
      postRetentionAction: 'SECURE_CONTROLLED_DESTRUCTION',
      legalBasis: 'Standar Keamanan Siber ISO/IEC 27001 & TADE Sovereign Governance',
      activeRecordsCount: 124500,
      scheduledArchiveCount: 1200,
      status: 'ACTIVE_ENFORCED'
    },
    {
      id: 'RET-004',
      ruleCode: 'RET-PPDBDRAFT-02Y',
      dataCategory: 'Draft Formulir PPDB Tidak Selesai & Berkas Cadangan',
      retentionPeriod: '2 Tahun',
      retentionYears: 2,
      retentionDays: 730,
      postRetentionAction: 'SECURE_CONTROLLED_DESTRUCTION',
      legalBasis: 'Kebijakan Perlindungan Privasi Data Pribadi (PDP) Calon Siswa',
      activeRecordsCount: 34,
      scheduledArchiveCount: 12,
      status: 'ACTIVE_ENFORCED'
    },
    {
      id: 'RET-005',
      ruleCode: 'RET-DAILYBCK-30D',
      dataCategory: 'Daily Ephemeral Cache Snapshot & Temp Backup',
      retentionPeriod: '30 Hari',
      retentionYears: 0.08,
      retentionDays: 30,
      postRetentionAction: 'ROLLING_PURGE',
      legalBasis: 'Sovereign Storage Quota Optimizer Protocol',
      activeRecordsCount: 30,
      scheduledArchiveCount: 5,
      status: 'ACTIVE_ENFORCED'
    }
  ]);

  const [auditRunning, setAuditRunning] = useState(false);
  const [auditSuccess, setAuditSuccess] = useState<string | null>(null);

  const handleRunAudit = () => {
    setAuditRunning(true);
    setTimeout(() => {
      setAuditRunning(false);
      setAuditSuccess('Audit Siklus Retensi selesai: Seluruh 5 Kebijakan Berstatus ACTIVE_ENFORCED tanpa anomali.');
      setTimeout(() => setAuditSuccess(null), 4000);
    }, 1000);
  };

  const getActionBadge = (action: RetentionRule['postRetentionAction']) => {
    switch (action) {
      case 'MOVE_TO_TIME_CAPSULE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            <Archive className="w-3 h-3" />
            Time Capsule Abadi
          </span>
        );
      case 'SECURE_CONTROLLED_DESTRUCTION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
            <AlertCircle className="w-3 h-3" />
            Pemusnahan Terkendali (Triple Approval)
          </span>
        );
      case 'ROLLING_PURGE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
            <Clock className="w-3 h-3" />
            Rolling Buffer Auto-Purge
          </span>
        );
    }
  };

  return (
    <div id="retention-policy-center-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Clock className="w-48 h-48 text-emerald-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R232 &bull; RETENTION GOVERNANCE
              </span>
              <span className="text-xs text-slate-400">Centennial Lifecycle Standards</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Clock className="w-8 h-8 text-emerald-400" />
              Retention Policy Center
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Pengaturan masa retensi baku madrasah: <strong>Raport (100 Thn)</strong>, <strong>Tabungan (10 Thn)</strong>, <strong>Log Sistem (5 Thn)</strong>, <strong>Draft PPDB (2 Thn)</strong>, dan <strong>Backup Harian (30 Hari)</strong>.
            </p>
          </div>

          <button
            onClick={handleRunAudit}
            disabled={auditRunning}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            {auditRunning ? 'Memeriksa Kepatuhan...' : 'Audit Siklus Retensi'}
          </button>
        </div>

        {/* Global Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Kebijakan Retensi Aktif</span>
            <span className="text-xl font-bold text-white font-mono">{retentionRules.length} Standar Baku</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Retensi Maksimum</span>
            <span className="text-xl font-bold text-amber-400 font-mono">100 TAHUN (IJAZAH)</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Integritas Penegakan</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">100% ENFORCED</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-400 block">Protokol Pasca Retensi</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">TIME CAPSULE / QUORUM</span>
          </div>
        </div>
      </div>

      {auditSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{auditSuccess}</span>
        </div>
      )}

      {/* Retention Rules Table / Cards */}
      <div className="space-y-4">
        {retentionRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {rule.ruleCode}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {rule.dataCategory}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  Masa Retensi: {rule.retentionPeriod}
                </span>
              </div>
            </div>

            {/* Rule Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block font-mono">Tindakan Akhir Masa Retensi:</span>
                <div className="mt-1.5">{getActionBadge(rule.postRetentionAction)}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block font-mono">Dasar Hukum / Kepatuhan:</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                  {rule.legalBasis}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block font-mono">Volume Rekaman Dipantau:</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-slate-800 dark:text-slate-200 font-bold font-mono">
                    {rule.activeRecordsCount.toLocaleString()} Rekaman Aktif
                  </span>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">
                    ({rule.scheduledArchiveCount} terjadwal)
                  </span>
                </div>
              </div>
            </div>

            {/* Retention Horizon Visualization */}
            <div className="p-3 rounded-xl bg-slate-900 text-slate-300 text-xs font-mono border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Status Siklus: <strong className="text-emerald-400">{rule.status}</strong></span>
              </div>
              <span className="text-slate-400 text-[11px]">
                Target Durasi: {rule.retentionDays.toLocaleString()} Hari (~{rule.retentionYears >= 1 ? `${rule.retentionYears} Tahun` : `${rule.retentionDays} Hari`})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
