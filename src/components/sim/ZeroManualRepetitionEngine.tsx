import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Copy,
  Layers,
  ShieldCheck,
  Building,
  MapPin,
  Phone,
  Mail,
  Award,
  Stamp
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

export const ZeroManualRepetitionEngine: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const schoolMasterData = {
    institutionName: 'KB - TK - TPA SENTRA ASY-SYIFA',
    foundationName: 'YAYASAN ASY-SYIFA TANGGUL JEMBER',
    npsn: '69987214',
    address: 'Jl. Melati No. 45, Tanggul Kulon, Kec. Tanggul, Kab. Jember, Jawa Timur 68155',
    phone: '(0336) 441209 / 0812-3456-7890',
    email: 'info@kb-tk-sentra-asy-syifa.sch.id',
    activePrincipal: 'Ustadzah Syifa Fauziah, S.Pd.',
    activeFoundationHead: 'Dr. H. Muhammad Haris, M.Pd.I.',
    officialStampStatus: 'Digital Stamp High-Res Active (SHA-256 Verified)',
    letterheadKopStatus: 'Standard Kemendikbudristek & Kemenag PAUD Valid'
  };

  const handleCopyValue = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div id="zero-manual-repetition-engine-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R420 &bull; ZERO MANUAL REPETITION ENGINE
              </span>
              <span className="text-xs text-slate-400 font-mono">Instant Institutional Auto-Fill &amp; Identity Sync</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-amber-400" />
              Mesin Otomasi Identitas &amp; Pengisian Naskah Instan
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Menghilangkan pengetikan berulang: secara otomatis mengisi kop surat, logo resmi, nama yayasan, tanda tangan pejabat aktif, stempel digital, kontak, dan alamat sekolah.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-2 rounded-2xl bg-amber-950 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> AUTO-POPULATED
            </span>
          </div>
        </div>
      </div>

      {/* Identity Master Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-xs border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-500" /> Profil Lembaga &amp; Kop Surat Resmi
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-slate-400 block">NAMA LEMBAGA:</span>
              <div className="flex items-center justify-between mt-0.5">
                <strong className="text-slate-900 dark:text-white">{schoolMasterData.institutionName}</strong>
                <button
                  onClick={() => handleCopyValue('inst', schoolMasterData.institutionName)}
                  className="text-[10px] text-amber-600 hover:text-amber-500 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> {copiedKey === 'inst' ? 'Tersalin' : 'Salin'}
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block">NAMA YAYASAN:</span>
              <div className="flex items-center justify-between mt-0.5">
                <strong className="text-slate-800 dark:text-slate-200">{schoolMasterData.foundationName}</strong>
                <button
                  onClick={() => handleCopyValue('fnd', schoolMasterData.foundationName)}
                  className="text-[10px] text-amber-600 hover:text-amber-500 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> {copiedKey === 'fnd' ? 'Tersalin' : 'Salin'}
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block">NPSN &amp; AKREDITASI:</span>
              <strong className="text-emerald-600 dark:text-emerald-400">{schoolMasterData.npsn} &bull; Terakreditasi A</strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block">ALAMAT LENGKAP:</span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">{schoolMasterData.address}</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-xs border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500" /> Pejabat Aktif &amp; Pengesahan Digital
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-slate-400 block">KEPALA SEKOLAH AKTIF:</span>
              <strong className="text-slate-900 dark:text-white">{schoolMasterData.activePrincipal}</strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block">KETUA YAYASAN:</span>
              <strong className="text-slate-800 dark:text-slate-200">{schoolMasterData.activeFoundationHead}</strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block">STATUS STEMPEL RESMI:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] inline-block mt-0.5">
                {schoolMasterData.officialStampStatus}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block">KONTAK &amp; SURAT ELEKTRONIK:</span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">{schoolMasterData.phone} | {schoolMasterData.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
