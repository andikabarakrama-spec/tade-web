import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  Sparkles,
  Users,
  Search,
  Filter,
  Eye,
  Sliders
} from 'lucide-react';
import { guardianFortressService } from '../../services/guardianFortressService';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

interface RolePermissionConfig {
  roleId: string;
  roleName: string;
  category: 'EKSEKUTIF' | 'OPERASIONAL' | 'KELUARGA';
  description: string;
  allowedModules: string[];
  restrictedModules: string[];
  approvalPower: string;
  dataBoundary: string;
  badgeColor: string;
}

const ROLES_CATALOG: RolePermissionConfig[] = [
  {
    roleId: 'FOUNDER',
    roleName: 'Andika (Founder & Insinyur Arsitektur)',
    category: 'EKSEKUTIF',
    description: 'Kedaulatan arsitektur mutlak, akses kendali penuh ke seluruh engine Ring-0, Recovery Hermes, dan Konstitusi.',
    allowedModules: ['Seluruh 58 Modul SIM', 'Founder Office Cockpit', 'Master Visibility Center', 'Feature Rollout', 'Hermes Recovery', 'Database Raw Vault'],
    restrictedModules: ['Tidak Ada (Akses Tertinggi)'],
    approvalPower: 'Pemberian Izin Darurat, Override Konstitusional & Break-Glass',
    dataBoundary: 'Akses Global Tanpa Batas',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800'
  },
  {
    roleId: 'KETUA_YAYASAN',
    roleName: 'Ketua Yayasan Asy Syifa',
    category: 'EKSEKUTIF',
    description: 'Pengawasan tata kelola lembaga, inspeksi arus kas makro, pengesahan keputusan strategis, dan persetujuan SK.',
    allowedModules: ['Executive Living Workspace', 'Laporan Keuangan Makro', 'Audit Trail', 'Pusat Surat Dinas', 'Health Passport'],
    restrictedModules: ['Pengaturan Teknis Ring-0', 'Bypass Cache Manual'],
    approvalPower: 'Persetujuan Anggaran Belanja & Surat Keputusan Yayasan',
    dataBoundary: 'Seluruh Lembaga TK & Yayasan',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800'
  },
  {
    roleId: 'KEPALA_SEKOLAH',
    roleName: 'Kepala Sekolah (Ustadzah Nurul)',
    category: 'EKSEKUTIF',
    description: 'Pimpinan akademik harian, approval akhir PPDB, pengesahan e-Rapor sentra, dan koordinasi kurikulum guru.',
    allowedModules: ['Portal Kepsek', 'Verifikasi & Seleksi PPDB', 'E-Rapor Sentra', 'Kalender Pendidikan', 'Pengumuman Resmi', 'Evaluasi Guru'],
    restrictedModules: ['Pengaturan Server / DNS', 'Konfigurasi Token Payment'],
    approvalPower: 'Approval Final Siswa Baru, Pengesahan Ijazah/Rapor, & Validasi Cuti Guru',
    dataBoundary: 'Unit Sekolah TK Islam Asy Syifa Tanggul',
    badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800'
  },
  {
    roleId: 'ADMIN',
    roleName: 'Admin SIM (Staf Tata Usaha)',
    category: 'OPERASIONAL',
    description: 'Pengelolaan data induk siswa, verifikasi berkas PPDB, penagihan SPP, pencatatan inventaris, dan publikasi website.',
    allowedModules: ['Admin Living Workspace', 'Data Siswa & Guru', 'Verifikasi PPDB Tahap 1', 'Kwitansi SPP', 'Sarpras & APE', 'CMS Berita'],
    restrictedModules: ['Approval Akhir PPDB Kepsek', 'Pengesahan SK Yayasan', 'Hermes Break-Glass'],
    approvalPower: 'Verifikasi Administrasi Berkas & Validasi Kwitansi Masuk',
    dataBoundary: 'Seluruh Siswa & Data Operasional Madrasah',
    badgeColor: 'bg-blue-950 text-blue-300 border-blue-800'
  },
  {
    roleId: 'GURU',
    roleName: 'Guru Sentra & Tahfidz',
    category: 'OPERASIONAL',
    description: 'Pencatatan presensi harian kelompok, catatan anekdot kasih, penilaian unjuk karya sentra, dan setoran tahfidz.',
    allowedModules: ['Portal Guru', 'Presensi Santri Kelas Binaan', 'Catatan Anekdot', 'Capaian Tahfidz & Doa', 'Buku Penghubung Digital'],
    restrictedModules: ['Laporan Keuangan Kas', 'Verifikasi PPDB', 'Manajemen User RBAC'],
    approvalPower: 'Input & Edit Data Kelompok Kelas Binaan Sendiri',
    dataBoundary: 'Hanya Santri di Kelompok/Sentra yang Ditugaskan',
    badgeColor: 'bg-teal-950 text-teal-300 border-teal-800'
  },
  {
    roleId: 'WALI_MURID',
    roleName: 'Wali Murid (Orang Tua Santri)',
    category: 'KELUARGA',
    description: 'Akses perkembangan anak, galeri unjuk karya sentra, buku penghubung, tagihan SPP, presensi live, dan Wish Tree.',
    allowedModules: ['Portal Wali Murid', 'Riwayat Pertumbuhan Santri', 'Buku Penghubung', 'Bukti Bayar SPP', 'Wish Tree Munajat', 'Parent Community'],
    restrictedModules: ['Seluruh Modul Staf/Guru', 'Data Nilai Anak Lain', 'Manajemen Administrasi'],
    approvalPower: 'Konfirmasi Penjemputan Santri & Kirim Doa Wish Tree',
    dataBoundary: 'Strict Terisolasi: Hanya Data Anak Kandung Sendiri',
    badgeColor: 'bg-violet-950 text-violet-300 border-violet-800'
  },
  {
    roleId: 'ALUMNI_FAMILY',
    roleName: 'Alumni Family (Keluarga Alumni)',
    category: 'KELUARGA',
    description: 'Akses Annual Time Capsule, piagam kenangan kelulusan, jejak karya kenangan, dan pendaftaran adik kandung jalur prioritas.',
    allowedModules: ['Portal Alumni Asy Syifa', 'Living Memory Timeline', 'Kapsul Kenangan Kelulusan', 'PPDB Jalur Prioritas Alumni'],
    restrictedModules: ['Presensi Harian Aktif', 'Tagihan SPP Berjalan', 'Modul Guru/Admin'],
    approvalPower: 'Akses Memori & Permohonan Rekomendasi Alumni',
    dataBoundary: 'Arsip Historis Santri Lulusan Terkait',
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-800'
  }
];

export const RoleValidationMatrix: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<RolePermissionConfig>(ROLES_CATALOG[0]);
  const [testModule, setTestModule] = useState<string>('PPDB_VERIFIKASI');
  const [simResult, setSimResult] = useState<{ allowed: boolean; reason: string } | null>(null);

  const handleTestPermission = () => {
    const verdict = guardianFortressService.validateRoleAccess(selectedRole.roleId, testModule);
    setSimResult(verdict);
    founderCommandRecorder.recordCommand(
      'CONFIG_UPDATE',
      'Role Validation Matrix',
      `Audit simulasi akses peran ${selectedRole.roleName} pada modul ${testModule}: ${verdict.allowed ? 'DIIZINKAN' : 'DITOLAK'}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sprint G8 P2 • Matriks Hak Akses & Integritas Peran</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Audit & Validasi 7 Peran Pengguna
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              Memastikan seluruh menu, izin tindakan, wewenang persetujuan, dan batas isolasi data terlindungi dari kebocoran hak akses antar peran.
            </p>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Status Keamanan Role</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> 0 Kebocoran Izin
            </span>
          </div>
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {ROLES_CATALOG.map(role => {
          const isSelected = selectedRole.roleId === role.roleId;
          return (
            <button
              key={role.roleId}
              onClick={() => {
                setSelectedRole(role);
                setSimResult(null);
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 shadow-lg'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border inline-block mb-1.5 ${role.badgeColor}`}>
                {role.roleId}
              </span>
              <span className="text-xs font-bold text-white block truncate">{role.roleName.split(' ')[0]}</span>
              <span className="text-[10px] text-slate-400 block truncate">{role.category}</span>
            </button>
          );
        })}
      </div>

      {/* Role Detailed Audit Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Role Specification */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-md border ${selectedRole.badgeColor}`}>
                  {selectedRole.category} • {selectedRole.roleId}
                </span>
                <h2 className="text-lg font-bold text-white mt-2">{selectedRole.roleName}</h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedRole.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Modul yang Dapat Diakses:</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {selectedRole.allowedModules.map((mod, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      <span>{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Batas Larangan Akses (Restricted):</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {selectedRole.restrictedModules.map((mod, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <XCircle className="w-3 h-3 text-rose-500 flex-shrink-0" />
                      <span>{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400">Wewenang Persetujuan (Approval Power):</span>
                <span className="text-amber-400 font-semibold">{selectedRole.approvalPower}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                <span className="font-bold text-slate-400">Batas Data (Data Boundary):</span>
                <span className="text-cyan-400 font-semibold">{selectedRole.dataBoundary}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Role Simulator */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Simulasi Otorisasi Hak Akses</span>
            </h2>
            <p className="text-xs text-slate-400">
              Uji coba apakah peran saat ini diizinkan mengakses modul sensitif.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Pilih Target Modul</label>
                <select
                  value={testModule}
                  onChange={e => setTestModule(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="PPDB_VERIFIKASI">Pendaftaran & Verifikasi PPDB</option>
                  <option value="PORTAL_GURU">Portal Guru & Presensi Sentra</option>
                  <option value="LAPORAN_KEUANGAN">Laporan Keuangan & Kas</option>
                  <option value="MASTER_VISIBILITY">Master Visibility Center (P1)</option>
                  <option value="HERMES_RECOVERY">Hermes Break-Glass Recovery</option>
                  <option value="PORTAL_WALI_MURID">Portal Wali Murid & Wish Tree</option>
                </select>
              </div>

              <button
                onClick={handleTestPermission}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs transition-all shadow-md shadow-emerald-950"
              >
                Uji Otorisasi Ring-0
              </button>

              {simResult && (
                <div
                  className={`p-3 rounded-xl border text-xs space-y-1 animate-in fade-in ${
                    simResult.allowed
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {simResult.allowed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Akses Diizinkan</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Akses Ditolak (Dicegah)</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] opacity-90">{simResult.reason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
