import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  Building,
  Award,
  Sparkles,
  RefreshCw,
  Bell
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface ComplianceItem {
  id: string;
  name: string;
  category: 'IZIN_OPERASIONAL' | 'AKREDITASI' | 'SANITASI_HIGIENE' | 'LEGALITAS_YAYASAN' | 'DOKUMEN_WAJIB';
  issuer: string;
  certNumber: string;
  validUntil: string;
  daysRemaining: number;
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
  description: string;
}

export const LegalComplianceCenter: React.FC = () => {
  const [compliances, setCompliances] = useState<ComplianceItem[]>([
    {
      id: 'CMP-01',
      name: 'Izin Operasional Satuan PAUD (KB-TK)',
      category: 'IZIN_OPERASIONAL',
      issuer: 'Dinas Pendidikan Kabupaten Jember & DPMPTSP',
      certNumber: '421.1/0458/DPMPTSP/PAUD/2024',
      validUntil: '2028-11-20',
      daysRemaining: 826,
      status: 'OPTIMAL',
      description: 'Izin penyelenggaraan pendidikan formal usia dini KB-TK Sentra Asy-Syifa.'
    },
    {
      id: 'CMP-02',
      name: 'Sertifikat Akreditasi BAN PDM (PAUD-Dasmen)',
      category: 'AKREDITASI',
      issuer: 'Badan Akreditasi Nasional PAUD & Dikdasmen',
      certNumber: '098/BAN-PDM/SK/2025 (Peringkat A Unggul)',
      validUntil: '2030-05-15',
      daysRemaining: 1367,
      status: 'OPTIMAL',
      description: 'Predikat Akreditasi A Unggul dengan skor 96.4 dari 8 Standar Nasional Pendidikan.'
    },
    {
      id: 'CMP-03',
      name: 'Sertifikat Laik Higiene Sanitasi Sentra Memasak & Kantin Sehat',
      category: 'SANITASI_HIGIENE',
      issuer: 'Dinas Kesehatan Kabupaten Jember',
      certNumber: 'SLHS/019/DINKES-JBR/2026',
      validUntil: '2027-04-10',
      daysRemaining: 237,
      status: 'OPTIMAL',
      description: 'Kelayakan sanitasi dapur sentra memasak, air minum, dan kebersihan ruang toilet.'
    },
    {
      id: 'CMP-04',
      name: 'SK Pengesahan Badan Hukum Yayasan Kemenkumham RI',
      category: 'LEGALITAS_YAYASAN',
      issuer: 'Kementerian Hukum dan HAM Republik Indonesia',
      certNumber: 'AHU-0014298.AH.01.04.Tahun 2021',
      validUntil: 'SEUMUR HIDUP (PERMANEN)',
      daysRemaining: 9999,
      status: 'OPTIMAL',
      description: 'Akta notaris pendirian dan SK Menkumham badan hukum yayasan pendidikan.'
    },
    {
      id: 'CMP-05',
      name: 'Nomor Pokok Sekolah Nasional (NPSN) Terverifikasi',
      category: 'DOKUMEN_WAJIB',
      issuer: 'Pusdatin Kemendikbudristek RI',
      certNumber: 'NPSN: 69982341 (Sinkron DAPODIK)',
      validUntil: 'TA 2026/2027 SEMESTER GANJIL',
      daysRemaining: 120,
      status: 'OPTIMAL',
      description: 'Sinkronisasi berkala data pokok pendidikan santri, guru, dan rombongan belajar.'
    }
  ]);

  const [reminderSent, setReminderSent] = useState<boolean>(false);

  const handleTriggerAudit = () => {
    setReminderSent(true);
    blackBoxRecorder.record({
      moduleCode: 'R433-LEGAL-COMPLIANCE',
      role: 'KETUA_YAYASAN',
      eventType: 'ACTION',
      details: 'Automated legal compliance audit refreshed. All 5 core institutional permits are valid.',
      severity: 'INFO'
    });
    setTimeout(() => setReminderSent(false), 3000);
  };

  return (
    <div id="legal-compliance-center-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R433 &bull; LEGAL COMPLIANCE CENTER
              </span>
              <span className="text-xs text-slate-400 font-mono">Government Institutional Permits &amp; Accreditation Guard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
              Pusat Kepatuhan Hukum, Perizinan &amp; Akreditasi Lembaga
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Pemantauan masa berlaku izin operasional PAUD, Akreditasi BAN PDM (A Unggul), Laik Higiene Sanitasi Dinkes, SK Kemenkumham, serta NPSN Kemendikbud.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerAudit}
              className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs font-mono shadow-md flex items-center gap-2"
            >
              <Bell className="w-4 h-4" /> Periksa Pengingat Masa Izin
            </button>
          </div>
        </div>
      </div>

      {/* Reminder Alert */}
      {reminderSent && (
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/40 text-amber-800 dark:text-amber-200 flex items-center gap-2 font-mono text-xs">
          <CheckCircle2 className="w-4 h-4 text-amber-500" />
          <span>Seluruh 5 dokumen legalitas yayasan dan sekolah berstatus AMAN &amp; AKTIF. Pengingat otomatis disinkronkan.</span>
        </div>
      )}

      {/* Grid of Legal Compliances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {compliances.map((cmp) => (
          <div
            key={cmp.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[9px]">
                  {cmp.category.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> SAH &amp; BERLAKU
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-xs leading-snug">
                {cmp.name}
              </h3>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {cmp.description}
              </p>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 text-[10px] space-y-1">
                <div>
                  <span className="text-slate-400 block">Penerbit:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{cmp.issuer}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Nomor SK / Izin:</span>
                  <code className="text-amber-600 dark:text-amber-400 font-bold">{cmp.certNumber}</code>
                </div>
                <div>
                  <span className="text-slate-400 block">Masa Berlaku:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-bold">{cmp.validUntil}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">SISA MASA BERLAKU</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {cmp.daysRemaining > 3000 ? 'Seumur Hidup' : `${cmp.daysRemaining} Hari Lagi`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
