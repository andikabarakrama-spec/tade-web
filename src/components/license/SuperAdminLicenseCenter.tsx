import React, { useState } from 'react';
import { LicenseEngine } from '../../services/license/LicenseEngine';
import { LICENSE_POLICIES, PolicyType } from '../../services/license/LicensePolicy';
import { LicenseAuditEngine } from '../../services/license/LicenseAuditEngine';
import { LicenseIntegrityEngine, SecurityHealthReport } from '../../services/license/LicenseIntegrityEngine';
import {
  ShieldCheck,
  ShieldAlert,
  Key,
  Copy,
  Check,
  RefreshCw,
  AlertOctagon,
  Clock,
  Building2,
  FileText,
  Award,
  Sparkles,
  Zap,
  RotateCcw,
  Sliders,
  History,
  Lock,
  CheckCircle2,
  XCircle,
  Activity,
  Bot
} from 'lucide-react';

export const SuperAdminLicenseCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SECURITY_CENTER' | 'GENERATOR' | 'AUDIT_LOGS'>('OVERVIEW');
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyType>('ANNUAL_RENTAL');
  const [targetSchool, setTargetSchool] = useState('TK ASY SYIFA');
  const [targetFoundation, setTargetFoundation] = useState('Yayasan Asy Syifa');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [renewDays, setRenewDays] = useState(365);
  const [notice, setNotice] = useState<{ success: boolean; text: string } | null>(null);
  const [secReport, setSecReport] = useState<SecurityHealthReport>(() => LicenseIntegrityEngine.evaluateSecurityReport());

  const currentLicense = LicenseEngine.getLicense();
  const logs = LicenseAuditEngine.getLogs();

  const handleReverifySecurity = () => {
    const updatedReport = LicenseIntegrityEngine.performRevalidation();
    setSecReport(updatedReport);
    setNotice({
      success: updatedReport.integrityValid,
      text: updatedReport.integrityValid
        ? 'Re-verifikasi integritas keamanan & tanda tangan digital BERHASIL!'
        : 'Re-verifikasi selesai: Terdeteksi masalah integritas atau modifikasi lisensi.'
    });
  };

  const handleGenerateKey = () => {
    const key = LicenseEngine.generateLicenseKey(selectedPolicy, targetSchool, targetFoundation);
    setGeneratedKey(key);
    setNotice({ success: true, text: `Kunci Lisensi ${selectedPolicy} berhasil dibuat!` });
  };

  const handleCopyKey = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyGeneratedKey = () => {
    if (!generatedKey) return;
    const res = LicenseEngine.activateLicenseKey(generatedKey, 'SUPER_ADMIN_CENTER');
    if (res.success) {
      setNotice({ success: true, text: res.message });
      setGeneratedKey(null);
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setNotice({ success: false, text: res.message });
    }
  };

  const handleDirectRenew = () => {
    LicenseEngine.renewLicense(renewDays, 'SUPER_ADMIN_DIRECT');
    setNotice({ success: true, text: `Berhasil memperpanjang lisensi sebanyak ${renewDays} hari.` });
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleToggleSuspend = () => {
    if (currentLicense.status === 'SUSPENDED') {
      LicenseEngine.reactivateLicense('SUPER_ADMIN_CENTER');
      setNotice({ success: true, text: 'Lisensi berhasil dipulihkan dari penangguhan (Active).' });
    } else {
      LicenseEngine.suspendLicense('SUPER_ADMIN_CENTER', 'Penangguhan manual oleh Super Admin.');
      setNotice({ success: true, text: 'Lisensi berhasil ditangguhkan (Suspended).' });
    }
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleToggleWatermark = () => {
    LicenseEngine.setWatermarkEnabled(!currentLicense.watermarkEnabled);
    setNotice({ success: true, text: `Watermark policy diubah menjadi: ${!currentLicense.watermarkEnabled ? 'AKTIF' : 'NON-AKTIF'}` });
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 rounded-3xl border border-amber-500/40 text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs font-black uppercase">
              ENTERPRISE LICENSE CENTER
            </span>
            <span className="text-xs text-slate-400 font-mono">TADE v1.0.5 LTS</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
            <span>Pusat Manajemen Lisensi & Hak Akses Enterprise</span>
          </h2>
          <p className="text-xs text-slate-300">
            Pusat kendali pembuatan kunci, aktivasi sewa berlangganan, pembatasan Safe Mode, dan audit lisensi sekolah.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'OVERVIEW' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('SECURITY_CENTER')}
            className={`px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'SECURITY_CENTER' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Security Center
          </button>
          <button
            onClick={() => setActiveTab('GENERATOR')}
            className={`px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'GENERATOR' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" /> Generator Kunci
          </button>
          <button
            onClick={() => setActiveTab('AUDIT_LOGS')}
            className={`px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'AUDIT_LOGS' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Audit Log
          </button>
        </div>
      </div>

      {notice && (
        <div className={`p-3 rounded-2xl text-xs font-bold ${notice.success ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-200' : 'bg-rose-950 border border-rose-500/50 text-rose-200'}`}>
          {notice.text}
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-900/90 rounded-3xl border border-slate-800 space-y-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>Informasi Lisensi Sekolah Terdaftar</span>
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">ID Lisensi:</span>
                  <span className="font-bold text-amber-300">{currentLicense.licenseId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Nama Sekolah:</span>
                  <span className="font-bold text-slate-100">{currentLicense.schoolName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Yayasan Pengelola:</span>
                  <span className="font-bold text-slate-100">{currentLicense.foundationName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Tipe Lisensi:</span>
                  <span className="font-bold text-emerald-300">{currentLicense.licenseType}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Checksum Keamanan:</span>
                  <span className="font-bold text-slate-400 text-[10px] truncate max-w-[180px]">{currentLicense.checksum}</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-900/90 rounded-3xl border border-slate-800 space-y-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Tindakan Langsung Super Admin</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-xs text-slate-200 block">Perpanjang Lisensi Langsung</span>
                    <span className="text-[10px] text-slate-400">Tambahkan hari aktif secara instan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={renewDays}
                      onChange={(e) => setRenewDays(Number(e.target.value))}
                      className="px-2 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200"
                    >
                      <option value={30}>+30 Hari</option>
                      <option value={90}>+90 Hari</option>
                      <option value={180}>+180 Hari</option>
                      <option value={365}>+1 Tahun (365 Hari)</option>
                    </select>
                    <button
                      onClick={handleDirectRenew}
                      className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer"
                    >
                      Proses
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-xs text-slate-200 block">Status Penangguhan (Suspend)</span>
                    <span className="text-[10px] text-slate-400">Tangguhkan hak akses jika ada pelanggaran</span>
                  </div>
                  <button
                    onClick={handleToggleSuspend}
                    className={`px-3 py-1 rounded-xl font-black text-xs transition cursor-pointer ${
                      currentLicense.status === 'SUSPENDED'
                        ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                        : 'bg-rose-500 text-white hover:bg-rose-400'
                    }`}
                  >
                    {currentLicense.status === 'SUSPENDED' ? 'Pulihkan Lisensi' : 'Tangguhkan'}
                  </button>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-xs text-slate-200 block">Kebijakan Watermark Display</span>
                    <span className="text-[10px] text-slate-400">Paksa tampilkan penanda edisi pada antarmuka</span>
                  </div>
                  <button
                    onClick={handleToggleWatermark}
                    className={`px-3 py-1 rounded-xl font-black text-xs transition cursor-pointer ${
                      currentLicense.watermarkEnabled
                        ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {currentLicense.watermarkEnabled ? 'Watermark Aktif' : 'Watermark Off'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY CENTER TAB (Part 10 & Part 9 AI Asy) */}
      {activeTab === 'SECURITY_CENTER' && (
        <div className="space-y-6">
          {/* Health Score & Key Verification Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Health Score Card */}
            <div className="p-5 bg-slate-900/90 rounded-3xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 block uppercase">Skor Keamanan Lisensi</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className={`text-4xl font-black font-mono ${
                    secReport.securityHealthScore >= 80
                      ? 'text-emerald-400'
                      : secReport.securityHealthScore >= 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}>
                    {secReport.securityHealthScore}%
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ 100% Health</span>
                </div>
              </div>

              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-500 ${
                    secReport.securityHealthScore >= 80
                      ? 'bg-emerald-500'
                      : secReport.securityHealthScore >= 50
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${secReport.securityHealthScore}%` }}
                />
              </div>

              <button
                onClick={handleReverifySecurity}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Re-verifikasi Integritas Sekarang</span>
              </button>
            </div>

            {/* Verification Status Metrics */}
            <div className="p-5 bg-slate-900/90 rounded-3xl border border-slate-800 space-y-3 md:col-span-2">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Pemeriksaan Komponen Keamanan Enterprise</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Integritas Payload:</span>
                  <span className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                    secReport.integrityValid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {secReport.integrityValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {secReport.integrityValid ? 'TERVERIFIKASI' : 'TERDETEKSI RUSAK'}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Tanda Tangan Digital:</span>
                  <span className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                    secReport.signatureValid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {secReport.signatureValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {secReport.signatureValid ? 'VALID' : 'INVALID'}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Checksum Digital:</span>
                  <span className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                    secReport.checksumValid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {secReport.checksumValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {secReport.checksumValid ? 'COCOK' : 'MISMATCH'}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Validasi Offline:</span>
                  <span className="font-bold text-sky-300">
                    {secReport.offlineStatus}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Versi Engine Validasi: <strong className="text-amber-300">{secReport.validationVersion}</strong></span>
                <span>Waktu Verifikasi Terakhir: <strong className="text-slate-200">{new Date(secReport.lastValidationTime).toLocaleString('id-ID')}</strong></span>
              </div>
            </div>
          </div>

          {/* AI Asy Security Assistant Explanation Box (Part 9) */}
          <div className="p-5 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 rounded-3xl border border-amber-500/30 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
              <Bot className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-amber-300 text-sm flex items-center gap-2">
                <span>AI Asy Security Assistant</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[10px] font-mono">Panduan Keamanan Ramah</span>
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {secReport.integrityValid
                  ? 'Assalamu’alaikum Wr. Wb. Seluruh komponen lisensi Enterprise sekolah terverifikasi aman, lengkap, dan sah. Sistem operasional sekolah berjalan lancar tanpa hambatan!'
                  : 'Assalamu’alaikum Wr. Wb. Terdeteksi penyesuaian pada berkas lisensi atau jam sistem. Jangan khawatir, seluruh data murid, guru, keuangan, dan arsip tetap AMAN tersimpan di Safe Mode.'}
              </p>
            </div>
          </div>

          {/* Validation History Table */}
          <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              <span>Riwayat Verifikasi Integritas Keamanan</span>
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {secReport.history.map((item) => (
                <div key={item.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        item.status === 'SUCCESS'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-slate-300 text-[11px] font-sans">{item.details}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 shrink-0">
                    {new Date(item.timestamp).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GENERATOR TAB */}
      {activeTab === 'GENERATOR' && (
        <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 space-y-5">
          <div className="space-y-1">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              <span>Generator Kunci Lisensi Enterprise & Sewa Berlangganan</span>
            </h3>
            <p className="text-xs text-slate-400">
              Pilih kebijakan lisensi dan buat kunci terenkripsi resmi untuk didistribusikan ke unit sekolah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Pilih Kebijakan Lisensi:</label>
              <select
                value={selectedPolicy}
                onChange={(e) => setSelectedPolicy(e.target.value as PolicyType)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-hidden focus:border-amber-500"
              >
                {Object.entries(LICENSE_POLICIES).map(([key, pol]) => (
                  <option key={key} value={key}>
                    {pol.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Nama Sekolah Target:</label>
              <input
                type="text"
                value={targetSchool}
                onChange={(e) => setTargetSchool(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Nama Yayasan Target:</label>
              <input
                type="text"
                value={targetFoundation}
                onChange={(e) => setTargetFoundation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerateKey}
              className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-md"
            >
              <Zap className="w-4 h-4" />
              <span>Buat Kunci Lisensi Sekarang</span>
            </button>
          </div>

          {/* Result Key Box */}
          {generatedKey && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/40 space-y-3">
              <span className="text-xs font-bold text-amber-300 block font-mono">Kode Kunci Lisensi Hasil Generasi:</span>
              <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-amber-100 break-all border border-slate-800">
                {generatedKey}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyKey}
                  className="min-h-[44px] px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Kunci'}</span>
                </button>

                <button
                  onClick={handleApplyGeneratedKey}
                  className="min-h-[44px] px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Langsung Terapkan Ke Sistem Ini</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" />
              <span>Log Audit Aktivasi & Perubahan Lisensi</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{logs.length} Catatan Terekam</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {logs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs font-mono">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-300">{log.action}</span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-slate-300">{log.operator}</span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-emerald-400">{log.newStatus}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] font-sans">{log.details}</p>
                </div>
                <div className="text-[10px] text-slate-500 shrink-0">
                  {new Date(log.timestamp).toLocaleString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

