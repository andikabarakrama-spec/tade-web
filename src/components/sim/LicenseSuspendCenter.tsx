import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Clock,
  Ban,
  CheckCircle2,
  Download,
  Database,
  Lock,
  Unlock,
  RefreshCw,
  Search,
  Eye,
  PlusCircle,
  FileSpreadsheet,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export interface SchoolLicenseRecord {
  tenantId: string;
  schoolName: string;
  npsn: string;
  status: 'TRIAL' | 'ACTIVE' | 'GRACE_PERIOD' | 'SUSPENDED' | 'RECOVERED';
  planName: string;
  expiryDate: string;
  gracePeriodDaysLeft: number;
  contactPic: string;
  contactWa: string;
  suspendedAt?: string;
  readOnlyEnforced: boolean;
}

const INITIAL_SCHOOL_LICENSES: SchoolLicenseRecord[] = [
  {
    tenantId: 'asy-syifa-01',
    schoolName: 'TK Islam Asy-Syifa (Pusat)',
    npsn: '69812345',
    status: 'ACTIVE',
    planName: 'Enterprise Sovereign Unlimited',
    expiryDate: '2027-12-31',
    gracePeriodDaysLeft: 0,
    contactPic: 'Hj. Siti Rahmah, M.Pd.',
    contactWa: '6281234567890',
    readOnlyEnforced: false
  },
  {
    tenantId: 'melati-02',
    schoolName: 'TK Terpadu Melati Ceria',
    npsn: '69854321',
    status: 'GRACE_PERIOD',
    planName: 'Trial Standard 30-Hari',
    expiryDate: '2026-08-15',
    gracePeriodDaysLeft: 5,
    contactPic: 'Dra. Nurul Hidayah',
    contactWa: '6285678901234',
    readOnlyEnforced: false
  },
  {
    tenantId: 'darunnajah-04',
    schoolName: 'TK Islam Darunnajah 8',
    npsn: '69899001',
    status: 'SUSPENDED',
    planName: 'Pro Tier Annual',
    expiryDate: '2026-08-01',
    gracePeriodDaysLeft: 0,
    contactPic: 'Ustadz Ahmad Fauzi, S.Pd.I',
    contactWa: '6281398765432',
    suspendedAt: '2026-08-08',
    readOnlyEnforced: true
  },
  {
    tenantId: 'al-azhar-03',
    schoolName: 'TK Islam Al-Azhar Syarif',
    npsn: '69877112',
    status: 'ACTIVE',
    planName: 'Enterprise Golden Golden',
    expiryDate: '2027-06-30',
    gracePeriodDaysLeft: 0,
    contactPic: 'Dr. H. Muhammad Arifin',
    contactWa: '6281122334455',
    readOnlyEnforced: false
  },
  {
    tenantId: 'bintang-05',
    schoolName: 'PAUD Bintang Kecil Mandiri',
    npsn: '69833445',
    status: 'TRIAL',
    planName: 'Trial Standard 30-Hari',
    expiryDate: '2026-09-10',
    gracePeriodDaysLeft: 26,
    contactPic: 'Ibu Ratna Dewi',
    contactWa: '6287712345678',
    readOnlyEnforced: false
  }
];

export const LicenseSuspendCenter: React.FC = () => {
  const [licenses, setLicenses] = useState<SchoolLicenseRecord[]>(INITIAL_SCHOOL_LICENSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [testModalTenant, setTestModalTenant] = useState<SchoolLicenseRecord | null>(null);

  const filteredLicenses = licenses.filter((lic) => {
    const matchesSearch =
      lic.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.tenantId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.npsn.includes(searchQuery);
    const matchesStatus = filterStatus === 'ALL' || lic.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleToggleSuspend = (tenantId: string) => {
    setLicenses((prev) =>
      prev.map((lic) => {
        if (lic.tenantId === tenantId) {
          const isCurrentlySuspended = lic.status === 'SUSPENDED';
          const newStatus = isCurrentlySuspended ? 'RECOVERED' : 'SUSPENDED';
          const newReadOnly = !isCurrentlySuspended;
          return {
            ...lic,
            status: newStatus,
            readOnlyEnforced: newReadOnly,
            suspendedAt: isCurrentlySuspended ? undefined : new Date().toISOString().split('T')[0]
          };
        }
        return lic;
      })
    );

    const target = licenses.find((l) => l.tenantId === tenantId);
    setActionNotice(
      target?.status === 'SUSPENDED'
        ? `Lisensi ${target?.schoolName} berhasil di-RECOVER! Mode tulis kembali aktif.`
        : `Lisensi ${target?.schoolName} telah di-SUSPEND. Akses dibatasi menjadi READ-ONLY.`
    );
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleGrantGracePeriod = (tenantId: string) => {
    setLicenses((prev) =>
      prev.map((lic) => {
        if (lic.tenantId === tenantId) {
          return {
            ...lic,
            status: 'GRACE_PERIOD',
            gracePeriodDaysLeft: 7,
            readOnlyEnforced: false
          };
        }
        return lic;
      })
    );
    setActionNotice(`Grace Period +7 Hari berhasil diberikan untuk ${tenantId}. Notifikasi WhatsApp dikirim.`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const getStatusBadge = (status: SchoolLicenseRecord['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'TRIAL':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'GRACE_PERIOD':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-300 dark:border-red-800';
      case 'RECOVERED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/80 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg">
                <Ban className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    MODULE R133
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    READ-ONLY PRESERVATION
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-100">
                  License Suspend, Grace Period & Safe Recovery Center
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Tata kelola status lisensi transparan. Saat status <strong className="text-red-400">SUSPEND</strong>, data sekolah 100% aman (dapat dibaca, diekspor, dan dibackup). Fitur penulisan (PPDB, transaksi kas, broadcast baru) dibekukan hingga lisensi pulih.
            </p>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="bg-amber-950/80 border border-amber-700 text-amber-200 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 shadow-lg animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold">{actionNotice}</span>
        </div>
      )}

      {/* Rules Banner (What is Allowed / Blocked during Suspend) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-emerald-950/30 border border-emerald-900/60 rounded-xl p-4 text-slate-200 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>TETAP DIIZINKAN SAAT SUSPEND (READ-ONLY PRESERVATION):</span>
          </div>
          <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
            <li>Membaca seluruh riwayat data santri, absensi, dan SPP</li>
            <li>Ekspor data ke format Excel / PDF / CSV</li>
            <li>Mengunduh snapshot backup database sekolah mandiri</li>
            <li>Akses login guru dan kepala sekolah untuk melihat arsip nilai</li>
          </ul>
        </div>

        <div className="bg-red-950/30 border border-red-900/60 rounded-xl p-4 text-slate-200 space-y-2">
          <div className="flex items-center space-x-2 text-red-400 font-bold">
            <Ban className="w-4 h-4" />
            <span>DIBEKUKAN SEMENTARA SAAT SUSPEND:</span>
          </div>
          <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
            <li>Pendaftaran santri baru (PPDB Input)</li>
            <li>Pencatatan mutasi transaksi kas dan penerbitan kuitansi baru</li>
            <li>Pengiriman siaran WhatsApp Guardian / Living Messenger baru</li>
            <li>Pembuatan QR Code presensi baru harian</li>
          </ul>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari sekolah, tenant ID, NPSN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'ACTIVE', 'GRACE_PERIOD', 'SUSPENDED', 'TRIAL'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === st
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* License Management Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Sekolah & Tenant ID</th>
                <th className="py-3 px-4">Paket & Masa Aktif</th>
                <th className="py-3 px-4">Status Lisensi</th>
                <th className="py-3 px-4">Read-Only Guard</th>
                <th className="py-3 px-4">PIC & Kontak</th>
                <th className="py-3 px-4 text-right">Aksi Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredLicenses.map((lic) => (
                <tr key={lic.tenantId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{lic.schoolName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {lic.tenantId} • NPSN: {lic.npsn}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{lic.planName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Berakhir: {lic.expiryDate}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(lic.status)}`}>
                      {lic.status}
                    </span>
                    {lic.status === 'GRACE_PERIOD' && (
                      <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-1">
                        Sisa {lic.gracePeriodDaysLeft} hari tenggang
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {lic.readOnlyEnforced ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-800 flex items-center space-x-1 w-fit">
                        <Lock className="w-3 h-3" />
                        <span>READ-ONLY ENFORCED</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center space-x-1 w-fit">
                        <Unlock className="w-3 h-3" />
                        <span>FULL READ/WRITE</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-800 dark:text-slate-200 font-medium">{lic.contactPic}</div>
                    <div className="text-[11px] text-slate-400 font-mono">+{lic.contactWa}</div>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => setTestModalTenant(lic)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                      title="Uji coba aksi Read-Only"
                    >
                      <Eye className="w-3.5 h-3.5 inline mr-1" />
                      Uji Izin
                    </button>

                    {lic.status !== 'SUSPENDED' && (
                      <button
                        onClick={() => handleGrantGracePeriod(lic.tenantId)}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold"
                      >
                        +7 Hari Grace
                      </button>
                    )}

                    <button
                      onClick={() => handleToggleSuspend(lic.tenantId)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        lic.status === 'SUSPENDED'
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-red-600 hover:bg-red-500 text-white'
                      }`}
                    >
                      {lic.status === 'SUSPENDED' ? 'Pulihkan (Recover)' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Simulasi Akses Uji Izin */}
      {testModalTenant && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-base text-slate-100">Simulasi Enforcer Lisensi</h4>
                <p className="text-xs text-slate-400">{testModalTenant.schoolName} ({testModalTenant.status})</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(testModalTenant.status)}`}>
                {testModalTenant.status}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-semibold text-slate-300 block">Tes Operasi Read-Only vs Mutation:</span>
                
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Ekspor Data Santri & Backup DB</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded">
                    DIIZINKAN (200 OK)
                  </span>
                </div>

                <div className={`p-2.5 rounded-lg flex items-center justify-between border ${
                  testModalTenant.readOnlyEnforced
                    ? 'bg-red-950/40 border-red-800 text-red-300'
                    : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                }`}>
                  <div className="flex items-center space-x-2">
                    <PlusCircle className="w-4 h-4" />
                    <span>Input PPDB Baru / Tambah Transaksi SPP</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950">
                    {testModalTenant.readOnlyEnforced ? 'DICEGAT (403 READ_ONLY_SUSPEND)' : 'DIIZINKAN (200 OK)'}
                  </span>
                </div>
              </div>

              {testModalTenant.readOnlyEnforced && (
                <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/60 text-[11px] text-red-300">
                  <span className="font-bold block mb-0.5">Penjelasan Konstitusi TADE:</span>
                  Status Suspend tidak menghapus data sekolah atau menyita rekaman santri. Sekolah tetap dapat mengekspor seluruh basis data ke format spreadsheet secara independen kapan saja.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setTestModalTenant(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Tutup Simulasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
