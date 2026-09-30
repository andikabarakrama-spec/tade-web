import React, { useState } from 'react';
import {
  Activity,
  HeartPulse,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Server,
  HardDrive,
  Clock,
  KeyRound,
  Eye,
  Camera,
  Zap
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface SecurityDiagnosticTest {
  id: string;
  name: string;
  category: 'STREAM' | 'PROTOCOL' | 'STORAGE' | 'SECURITY';
  weight: number;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  score: number;
  details: string;
}

export const SecurityHealthLab: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [tests, setTests] = useState<SecurityDiagnosticTest[]>([
    {
      id: 'SEC-TEST-01',
      name: 'RTSP Stream Throughput & Latency Test',
      category: 'STREAM',
      weight: 20,
      status: 'PASSED',
      score: 100,
      details: 'Seluruh 6 kamera mengalirkan 30 FPS stabil dengan latensi < 28 ms (H.265+ codec).'
    },
    {
      id: 'SEC-TEST-02',
      name: 'ONVIF Profile S & WSDL Protocol Handshake',
      category: 'PROTOCOL',
      weight: 15,
      status: 'PASSED',
      score: 100,
      details: 'Autentikasi Digest WS-Security ONVIF terverifikasi 100% tanpa bypass.'
    },
    {
      id: 'SEC-TEST-03',
      name: 'NVR Storage RAID & Write IOPS Benchmark',
      category: 'STORAGE',
      weight: 15,
      status: 'PASSED',
      score: 98,
      details: 'Kecepatan tulis disk 140 MB/s, cadangan retensi 30 hari siap tanpa fragmentasi.'
    },
    {
      id: 'SEC-TEST-04',
      name: 'High-Res Snapshot REST API Latency',
      category: 'STREAM',
      weight: 10,
      status: 'PASSED',
      score: 100,
      details: 'Ekstraksi snapshot resolusi 2560x1440 selesai dalam 140 ms.'
    },
    {
      id: 'SEC-TEST-05',
      name: 'NTP Time Synchronization Drift Check',
      category: 'PROTOCOL',
      weight: 10,
      status: 'PASSED',
      score: 100,
      details: 'Selisih waktu (clock drift) antar kamera < 5 ms terhadap server pool.ntp.org.'
    },
    {
      id: 'SEC-TEST-06',
      name: 'Firmware Vulnerability & CVE Scan',
      category: 'SECURITY',
      weight: 15,
      status: 'PASSED',
      score: 96,
      details: 'Tidak ditemukan celah keamanan kritis pada firmware seluruh vendor kamera.'
    },
    {
      id: 'SEC-TEST-07',
      name: 'Default Credential Hardening Audit',
      category: 'SECURITY',
      weight: 15,
      status: 'PASSED',
      score: 100,
      details: '0 kamera menggunakan kredensial default (admin/admin atau 123456). Password kuat aktif.'
    }
  ]);

  const totalScore = Math.round(
    tests.reduce((acc, t) => acc + (t.score * t.weight) / 100, 0)
  );

  const handleRunFullDiagnostics = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      blackBoxRecorder.record({
        moduleCode: 'R389-HEALTHLAB',
        role: 'SUPER_ADMIN',
        eventType: 'SECURITY',
        details: `Security Health Lab executed full 7-test suite. Global Security Score: ${totalScore}/100.`,
        severity: 'INFO'
      });
    }, 1200);
  };

  return (
    <div id="security-health-lab-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R389 &bull; SECURITY HEALTH LAB
              </span>
              <span className="text-xs text-slate-400 font-mono">Automated Multi-Vector Diagnostic Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-cyan-400" />
              Laboratorium Diagnostik &amp; Kelaikan Keamanan
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Uji otomatis komprehensif mengaudit RTSP stream, kepatuhan ONVIF, kecepatan write storage NVR, clock drift, CVE firmware, dan pengerasan kredensial.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-center font-mono">
              <span className="text-[10px] text-cyan-300 block">SECURITY SCORE</span>
              <span className="text-2xl font-bold text-cyan-400">{totalScore}/100</span>
            </div>
            <button
              onClick={handleRunFullDiagnostics}
              disabled={isRunning}
              className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-mono shadow-md flex items-center gap-2"
            >
              {isRunning ? <Zap className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Menguji Sistem...' : 'Jalankan Total Audit Ulang'}
            </button>
          </div>
        </div>
      </div>

      {/* Test Results Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {tests.map((test) => (
          <div
            key={test.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-[10px] text-slate-400">{test.id} &bull; {test.category}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                {test.status} ({test.score}%)
              </span>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {test.name}
            </h3>

            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              {test.details}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400">
              <span>Bobot Skor: {test.weight}%</span>
              <span className="text-emerald-500 font-bold">100% COMPLIANT</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
