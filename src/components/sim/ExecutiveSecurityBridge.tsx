import React, { useState } from 'react';
import {
  ShieldAlert,
  Crown,
  KeyRound,
  FileCheck2,
  Users,
  Eye,
  Video,
  Download,
  Sliders,
  CheckCircle2,
  XCircle,
  Clock,
  History,
  Lock,
  Search,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface SecurityAuditLog {
  id: string;
  timeWib: string;
  actorName: string;
  role: string;
  actionType: 'VIEW_STREAM' | 'PLAYBACK' | 'EXPORT_EVIDENCE' | 'CONFIG_CHANGE' | 'PTZ_CONTROL';
  cameraOrTarget: string;
  ipAddress: string;
  authorizationLevel: 'AUTHORIZED' | 'ESCALATED';
}

export const ExecutiveSecurityBridge: React.FC = () => {
  const { activeRole, userProfile } = useAuth();
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');

  const auditLogs: SecurityAuditLog[] = [
    {
      id: 'SEC-LOG-01',
      timeWib: '14:35:10 WIB',
      actorName: 'Drs. H. Ahmad Syukri (Ketua Yayasan)',
      role: 'KETUA_YAYASAN',
      actionType: 'EXPORT_EVIDENCE',
      cameraOrTarget: 'EVD-2026-0816-01 (All 4 Cameras)',
      ipAddress: '192.168.10.250',
      authorizationLevel: 'AUTHORIZED'
    },
    {
      id: 'SEC-LOG-02',
      timeWib: '14:28:40 WIB',
      actorName: 'Ustadzah Siti Fatimah, S.Pd. (Kepala Sekolah)',
      role: 'KEPALA_SEKOLAH',
      actionType: 'PLAYBACK',
      cameraOrTarget: 'CAM-06-GUDANG',
      ipAddress: '192.168.10.12',
      authorizationLevel: 'AUTHORIZED'
    },
    {
      id: 'SEC-LOG-03',
      timeWib: '14:15:00 WIB',
      actorName: 'Rian Hidayat, S.Kom. (Admin SIM)',
      role: 'ADMIN_SIM',
      actionType: 'CONFIG_CHANGE',
      cameraOrTarget: 'CAM-01 NTP Offset Sync Calibration',
      ipAddress: '192.168.10.5',
      authorizationLevel: 'AUTHORIZED'
    },
    {
      id: 'SEC-LOG-04',
      timeWib: '14:02:11 WIB',
      actorName: 'Super Administrator Root',
      role: 'SUPER_ADMIN',
      actionType: 'VIEW_STREAM',
      cameraOrTarget: 'Live Command Multi-View Grid (6 Feeds)',
      ipAddress: '192.168.10.2',
      authorizationLevel: 'AUTHORIZED'
    }
  ];

  const rbacMatrix = [
    {
      role: 'SUPER ADMIN',
      fullCctv: true,
      playback: true,
      export: true,
      config: true,
      desc: 'Akses penuh seluruh infrastruktur, export bukti hukum, dan konfigurasi master.'
    },
    {
      role: 'KETUA YAYASAN',
      fullCctv: true,
      playback: true,
      export: true,
      config: true,
      desc: 'Hak prerogatif eksekutif tertinggi yayasan untuk pengawasan menyeluruh 24/7.'
    },
    {
      role: 'KEPALA SEKOLAH',
      fullCctv: true,
      playback: true,
      export: true,
      config: false,
      desc: 'Pengawasan operasional harian sekolah, pemantauan santri, dan laporan insiden.'
    },
    {
      role: 'ADMIN SIM',
      fullCctv: false,
      playback: false,
      export: false,
      config: true,
      desc: 'Pengelolaan teknis, onboarding perangkat kamera IP, ONVIF, dan alokasi storage NVR.'
    }
  ];

  const filteredLogs = selectedRoleFilter === 'ALL'
    ? auditLogs
    : auditLogs.filter(l => l.role === selectedRoleFilter);

  return (
    <div id="executive-security-bridge-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R384 &bull; EXECUTIVE SECURITY BRIDGE
              </span>
              <span className="text-xs text-slate-400 font-mono">Role-Based Access Control &bull; Tamper-Proof Audit Trail</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Crown className="w-8 h-8 text-amber-400" />
              Matriks Wewenang &amp; Jejak Audit Keamanan
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Memisahkan hak akses Ketua Yayasan &amp; Super Admin (Full CCTV, Playback, Export) dari Kepala Sekolah (Operasional) dan Admin SIM (Konfigurasi Teknis).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs">
              Role Aktif Anda: <strong className="text-amber-400">{activeRole || 'SUPER_ADMIN'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* RBAC Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        {rbacMatrix.map((r, idx) => (
          <div key={idx} className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <strong className="text-sm text-slate-900 dark:text-white">{r.role}</strong>
              <Crown className={`w-4 h-4 ${idx < 2 ? 'text-amber-500' : 'text-slate-400'}`} />
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Live CCTV:</span>
                {r.fullCctv ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Playback Rekaman:</span>
                {r.playback ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Ekspor Bukti (.ZIP):</span>
                {r.export ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Konfigurasi Kamera:</span>
                {r.config ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-tight pt-2 border-t border-slate-100 dark:border-slate-700">
              {r.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Security Audit Trail Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-amber-500" />
              Jejak Audit Aktivitas Keamanan &amp; CCTV
            </h3>
            <span className="text-[11px] text-slate-400">Setiap akses playback, ekspor bukti, dan pengubahan kamera tercatat permanen</span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {['ALL', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN_SIM', 'SUPER_ADMIN'].map(role => (
              <button
                key={role}
                onClick={() => setSelectedRoleFilter(role)}
                className={`px-2.5 py-1 rounded-xl text-[10px] whitespace-nowrap transition-all ${
                  selectedRoleFilter === role
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 text-[10px]">
                <th className="pb-2 font-bold">WAKTU</th>
                <th className="pb-2 font-bold">PENGGUNA &amp; PERAN</th>
                <th className="pb-2 font-bold">TINDAKAN</th>
                <th className="pb-2 font-bold">TARGET / OBJEK</th>
                <th className="pb-2 font-bold">IP CLIENT</th>
                <th className="pb-2 font-bold text-right">OTORISASI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                  <td className="py-3 text-amber-600 dark:text-amber-400 font-bold">{log.timeWib}</td>
                  <td className="py-3">
                    <strong className="text-slate-900 dark:text-white block">{log.actorName}</strong>
                    <span className="text-[10px] text-slate-400">{log.role}</span>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                      {log.actionType}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{log.cameraOrTarget}</td>
                  <td className="py-3 text-slate-400">{log.ipAddress}</td>
                  <td className="py-3 text-right text-emerald-500 font-bold">{log.authorizationLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
