/**
 * TADE FOUNDER QUICK ACTIONS — SPRINT G12 (P5)
 * Asy & Syifa 1-Click Executive Command Panel
 * 
 * Provides instantaneous 1-click executive triggers:
 * 1. Verifikasi PPDB & Calon Santri (Prof. Atlas)
 * 2. Siaran Resmi Wali Murid (Living Messenger)
 * 3. Guardian Ring-0 Sovereign Scan (Guardian)
 * 4. Dr. Pulse 60 FPS Performance Diagnostics (Dr. Pulse)
 * 5. Hermes Emergency Instant Snapshot (Hermes)
 * 6. Sidang Kilat Kabinet 30 Detik (Executive Companion)
 * 7. Creative Studio High-Res Factory (TIB Labs)
 * 8. Taman Kenangan & Alumni Universe (Alumni Engine)
 * 9. Black Box SHA-256 Telemetry Audit (Black Box)
 */

import React, { useState } from 'react';
import {
  Zap,
  Crown,
  FileCheck,
  Send,
  ShieldCheck,
  Activity,
  Radio,
  Cpu,
  GraduationCap,
  FileText,
  Sparkles,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';
import { hermesRecoveryService } from '../../services/hermesRecoveryService';

interface Props {
  onNavigateTab?: (tabId: string) => void;
  onOpenCabinetMeeting?: () => void;
}

interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badgeText: string;
  badgeColor: string;
  action: () => void;
}

export const FounderQuickActions: React.FC<Props> = ({
  onNavigateTab,
  onOpenCabinetMeeting
}) => {
  const [lastExecuted, setLastExecuted] = useState<string | null>(null);

  const triggerAction = (actionName: string, executeFn: () => void) => {
    executeFn();
    setLastExecuted(actionName);
    setTimeout(() => setLastExecuted(null), 3000);

    blackBoxRecorder.record({
      ring: 'RING_0',
      moduleCode: 'FOUNDER-QUICKACTION',
      role: 'SUPER_ADMIN',
      actorName: 'Founder Andika',
      category: 'FOUNDER_COMMAND',
      eventType: 'ACTION',
      details: `1-Click Quick Action dieksekusi: ${actionName}`,
      severity: 'INFO',
      route: '/founder-office'
    });
  };

  const actions: QuickActionItem[] = [
    {
      id: 'qa-cabinet',
      title: 'Sidang Kilat Kabinet 30 Detik',
      subtitle: 'Kumpulkan 7 pilar dewan kedaulatan untuk pengesahan SK resmi',
      icon: Crown,
      badgeText: 'KABINET',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      action: () => {
        if (onOpenCabinetMeeting) onOpenCabinetMeeting();
      }
    },
    {
      id: 'qa-ppdb',
      title: 'Verifikasi Berkas PPDB Gelombang I',
      subtitle: 'Buka alur verifikasi berkas santri baru & penetapan kelompok',
      icon: FileCheck,
      badgeText: 'PPDB',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      action: () => {
        if (onNavigateTab) onNavigateTab('r_smart_ppdb');
      }
    },
    {
      id: 'qa-broadcast',
      title: 'Siarkan Pengumuman ke Wali Murid',
      subtitle: 'Kirim format pesan beradab & jadwal sentra ke gawai orang tua',
      icon: Send,
      badgeText: 'MESSENGER',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      action: () => {
        if (onNavigateTab) onNavigateTab('r_messenger');
      }
    },
    {
      id: 'qa-guardian',
      title: 'Audit Perimeter Guardian Ring-0',
      subtitle: 'Periksa isolasi 7 peran RBAC, token hardware, & zero leakage',
      icon: ShieldCheck,
      badgeText: 'RING-0',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      action: () => {
        if (onNavigateTab) onNavigateTab('r_role_matrix');
      }
    },
    {
      id: 'qa-drpulse',
      title: 'Diagnostik 60 FPS & Memori Dr. Pulse',
      subtitle: 'Pembersihan heap cache & kalibrasi IndexedDB Single Source',
      icon: Activity,
      badgeText: 'HEALTH',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      action: () => {
        if (onNavigateTab) onNavigateTab('r_pulse_passport');
      }
    },
    {
      id: 'qa-hermes',
      title: 'Hermes Snapshot Darurat Seketika',
      subtitle: 'Amankan cadangan data SHA-256 lokal tanpa risiko kegagalan',
      icon: Radio,
      badgeText: 'RECOVERY',
      badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
      action: () => {
        hermesRecoveryService.createSandboxSnapshot('Executive 1-Click Founder Trigger', 'Manual 1-Click Founder Emergency Snapshot');
        if (onNavigateTab) onNavigateTab('r_hermes_recovery');
      }
    },
    {
      id: 'qa-creative',
      title: 'Creative Studio High-Res Factory',
      subtitle: 'Cetak poster sentra, spanduk PPDB, & kartu doa tanpa biaya',
      icon: Cpu,
      badgeText: 'CREATIVE',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      action: () => {
        if (onNavigateTab) onNavigateTab('r_creative_studio');
      }
    },
    {
      id: 'qa-alumni',
      title: 'Taman Kenangan & Alumni Universe',
      subtitle: 'Pohon silsilah alumni, paspor digital, & jalur santri saudara',
      icon: GraduationCap,
      badgeText: 'ALUMNI',
      badgeColor: 'bg-stone-100 text-stone-900 border-stone-300',
      action: () => {
        if (onNavigateTab) onNavigateTab('r_alumni_universe');
      }
    },
    {
      id: 'qa-blackbox',
      title: 'Audit Rekaman Telemetri Black Box',
      subtitle: 'Inspeksi 1000 jejak transaksi terenkripsi HMAC SHA-256',
      icon: FileText,
      badgeText: 'AUDIT',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      action: () => {
        if (onNavigateTab) onNavigateTab('r_blackbox_recorder');
      }
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-600" />
              FOUNDER QUICK ACTIONS (P5)
            </span>
            <span className="text-xs text-stone-400 font-medium">1-Click Executive Triggers</span>
          </div>
          <h3 className="text-lg font-black text-stone-900">
            Aksi Mandiri & Eksekusi Cepat Asy & Syifa
          </h3>
          <p className="text-xs text-stone-500">
            Eksekusi langsung kendali institusi dalam sekali klik tanpa melalui navigasi manual.
          </p>
        </div>

        {lastExecuted && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-1.5 animate-fade-in self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Berhasil: {lastExecuted}</span>
          </div>
        )}
      </div>

      {/* Grid of 1-Click Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => triggerAction(act.title, act.action)}
              className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-white hover:border-emerald-400 hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 group-hover:border-emerald-400 group-hover:bg-emerald-50 text-emerald-800 flex items-center justify-center shadow-2xs transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${act.badgeColor}`}>
                    {act.badgeText}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-black text-stone-900 group-hover:text-emerald-950 transition">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5 leading-relaxed">
                    {act.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] font-bold text-stone-400 group-hover:text-emerald-700 transition">
                <span>Eksekusi 1-Klik</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
