import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  GraduationCap, 
  HardDrive, 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  ExternalLink, 
  Search, 
  Filter, 
  ChevronRight, 
  DollarSign, 
  Lock, 
  Database, 
  Activity, 
  Send,
  Zap,
  Tag,
  Radio,
  Sliders,
  Palette,
  Eye
} from 'lucide-react';

export type TenantLicenseStatus = 'TRIAL' | 'AKTIF' | 'BERAKHIR' | 'SUSPEND';

export interface TenantHealthBreakdown {
  database: number;   // 0-100
  backup: number;     // 0-100
  storage: number;    // 0-100
  login: number;      // 0-100
  qr: number;         // 0-100
  messenger: number;  // 0-100
  aiAsy: number;      // 0-100
  schoolTv: number;   // 0-100
  overallScore: number;
}

export interface TenantSchool {
  id: string;
  tenantId: string;
  name: string;
  city: string;
  npsn: string;
  accreditation: 'A (Unggul)' | 'B (Baik)' | 'Proses';
  logoUrl?: string;
  themeColor: string;
  licenseStatus: TenantLicenseStatus;
  licensePlan: 'Enterprise Golden' | 'Pro Islamic Suite' | 'Trial 30-Hari' | 'Community Free';
  startDate: string;
  endDate: string;
  daysRemaining: number;
  trialMilestoneNotice?: 'H-30' | 'H-14' | 'H-7' | 'H-3' | 'H-1' | 'Hari H' | null;
  health: TenantHealthBreakdown;
  metrics: {
    totalStudents: number;
    studentGrowthPct: number;
    totalTeachers: number;
    activeClasses: number;
    storageUsedGb: number;
    storageLimitGb: number;
    dailyActiveParents: number;
    featureAdoptionPct: number;
  };
  contactPic: {
    name: string;
    role: string;
    phone: string;
    email: string;
  };
}

export const MOCK_TENANTS: TenantSchool[] = [
  {
    id: 't-001',
    tenantId: 'tenant-asy-syifa-01',
    name: 'TK Islam Asy-Syifa (Pusat Unggulan)',
    city: 'Bandung, Jawa Barat',
    npsn: '20258901',
    accreditation: 'A (Unggul)',
    themeColor: '#059669', // Emerald
    licenseStatus: 'AKTIF',
    licensePlan: 'Enterprise Golden',
    startDate: '2026-01-01',
    endDate: '2027-01-01',
    daysRemaining: 140,
    trialMilestoneNotice: null,
    health: {
      database: 100,
      backup: 100,
      storage: 95,
      login: 98,
      qr: 100,
      messenger: 96,
      aiAsy: 99,
      schoolTv: 98,
      overallScore: 98
    },
    metrics: {
      totalStudents: 148,
      studentGrowthPct: 18.5,
      totalTeachers: 16,
      activeClasses: 6,
      storageUsedGb: 14.8,
      storageLimitGb: 100,
      dailyActiveParents: 132,
      featureAdoptionPct: 94
    },
    contactPic: {
      name: 'KH. Abdullah Syifa / Hj. Siti Rahmah',
      role: 'Ketua Yayasan & Kepala Sekolah',
      phone: '0812-3456-7890',
      email: 'yayasan@asy-syifa.sch.id'
    }
  },
  {
    id: 't-002',
    tenantId: 'tenant-melati-02',
    name: 'TK Terpadu Melati Ceria',
    city: 'Surabaya, Jawa Timur',
    npsn: '20512344',
    accreditation: 'A (Unggul)',
    themeColor: '#4f46e5', // Indigo
    licenseStatus: 'TRIAL',
    licensePlan: 'Trial 30-Hari',
    startDate: '2026-07-21',
    endDate: '2026-08-21',
    daysRemaining: 7,
    trialMilestoneNotice: 'H-7',
    health: {
      database: 96,
      backup: 92,
      storage: 88,
      login: 90,
      qr: 95,
      messenger: 92,
      aiAsy: 89,
      schoolTv: 85,
      overallScore: 91
    },
    metrics: {
      totalStudents: 85,
      studentGrowthPct: 12.0,
      totalTeachers: 9,
      activeClasses: 4,
      storageUsedGb: 6.2,
      storageLimitGb: 20,
      dailyActiveParents: 70,
      featureAdoptionPct: 82
    },
    contactPic: {
      name: 'Dra. Hj. Nurul Hidayati',
      role: 'Kepala Sekolah',
      phone: '0813-8877-6655',
      email: 'nurul@melaticeria.sch.id'
    }
  },
  {
    id: 't-003',
    tenantId: 'tenant-al-azhar-03',
    name: 'TK Islam Al-Azhar Syarif',
    city: 'Jakarta Selatan, DKI Jakarta',
    npsn: '20199882',
    accreditation: 'A (Unggul)',
    themeColor: '#0284c7', // Sky
    licenseStatus: 'AKTIF',
    licensePlan: 'Enterprise Golden',
    startDate: '2026-03-15',
    endDate: '2027-03-15',
    daysRemaining: 213,
    trialMilestoneNotice: null,
    health: {
      database: 100,
      backup: 100,
      storage: 92,
      login: 100,
      qr: 100,
      messenger: 98,
      aiAsy: 97,
      schoolTv: 96,
      overallScore: 98
    },
    metrics: {
      totalStudents: 210,
      studentGrowthPct: 24.2,
      totalTeachers: 22,
      activeClasses: 8,
      storageUsedGb: 38.5,
      storageLimitGb: 150,
      dailyActiveParents: 195,
      featureAdoptionPct: 96
    },
    contactPic: {
      name: 'Ust. Muhammad Farhan, M.Pd',
      role: 'Direktur Pendidikan',
      phone: '0811-9988-1122',
      email: 'farhan@alazhar-syarif.sch.id'
    }
  },
  {
    id: 't-004',
    tenantId: 'tenant-darunnajah-04',
    name: 'TK Islam Darunnajah 8',
    city: 'Bogor, Jawa Barat',
    npsn: '20245671',
    accreditation: 'A (Unggul)',
    themeColor: '#7c3aed', // Purple
    licenseStatus: 'TRIAL',
    licensePlan: 'Trial 30-Hari',
    startDate: '2026-08-11',
    endDate: '2026-08-14',
    daysRemaining: 1,
    trialMilestoneNotice: 'H-1',
    health: {
      database: 88,
      backup: 70, // Needs attention
      storage: 90,
      login: 85,
      qr: 92,
      messenger: 84,
      aiAsy: 86,
      schoolTv: 75,
      overallScore: 84
    },
    metrics: {
      totalStudents: 92,
      studentGrowthPct: 8.5,
      totalTeachers: 10,
      activeClasses: 4,
      storageUsedGb: 8.1,
      storageLimitGb: 20,
      dailyActiveParents: 74,
      featureAdoptionPct: 78
    },
    contactPic: {
      name: 'H. Ridwan Kamiludin, S.Ag',
      role: 'Ketua Yayasan',
      phone: '0857-1122-3344',
      email: 'ridwan@darunnajah8.sch.id'
    }
  },
  {
    id: 't-005',
    tenantId: 'tenant-insan-kamil-05',
    name: 'PAUD Cendekia Insan Kamil',
    city: 'Yogyakarta, D.I. Yogyakarta',
    npsn: '20401123',
    accreditation: 'B (Baik)',
    themeColor: '#d97706', // Amber
    licenseStatus: 'AKTIF',
    licensePlan: 'Pro Islamic Suite',
    startDate: '2026-02-01',
    endDate: '2027-02-01',
    daysRemaining: 171,
    trialMilestoneNotice: null,
    health: {
      database: 94,
      backup: 95,
      storage: 92,
      login: 96,
      qr: 90,
      messenger: 94,
      aiAsy: 91,
      schoolTv: 89,
      overallScore: 93
    },
    metrics: {
      totalStudents: 64,
      studentGrowthPct: 14.0,
      totalTeachers: 7,
      activeClasses: 3,
      storageUsedGb: 4.5,
      storageLimitGb: 50,
      dailyActiveParents: 58,
      featureAdoptionPct: 86
    },
    contactPic: {
      name: 'Sri Wahyuni, S.Pd',
      role: 'Kepala PAUD',
      phone: '0812-7766-5544',
      email: 'wahyuni@insankamil-yogya.sch.id'
    }
  },
  {
    id: 't-006',
    tenantId: 'tenant-an-nur-06',
    name: 'TK Islam Terpadu An-Nur',
    city: 'Medan, Sumatera Utara',
    npsn: '20298711',
    accreditation: 'B (Baik)',
    themeColor: '#e11d48', // Rose
    licenseStatus: 'BERAKHIR',
    licensePlan: 'Trial 30-Hari',
    startDate: '2026-07-01',
    endDate: '2026-08-01',
    daysRemaining: 0,
    trialMilestoneNotice: 'Hari H',
    health: {
      database: 90,
      backup: 85,
      storage: 80,
      login: 75,
      qr: 80,
      messenger: 70,
      aiAsy: 80,
      schoolTv: 60,
      overallScore: 78
    },
    metrics: {
      totalStudents: 55,
      studentGrowthPct: 5.0,
      totalTeachers: 6,
      activeClasses: 3,
      storageUsedGb: 3.8,
      storageLimitGb: 20,
      dailyActiveParents: 30,
      featureAdoptionPct: 65
    },
    contactPic: {
      name: 'Ust. Zulkifli Lubis, S.Pd.I',
      role: 'Pengelola Yayasan',
      phone: '0813-6655-4433',
      email: 'zulkifli@annur-medan.sch.id'
    }
  }
];

export const TenantOverview: React.FC<{
  onSelectTenant?: (tenant: TenantSchool) => void;
  onOpenRemoteAssist?: (tenant: TenantSchool) => void;
}> = ({ onSelectTenant, onOpenRemoteAssist }) => {
  const [tenants, setTenants] = useState<TenantSchool[]>(MOCK_TENANTS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<TenantLicenseStatus | 'ALL'>('ALL');
  const [selectedTenantModal, setSelectedTenantModal] = useState<TenantSchool | null>(null);
  const [showAddTenantModal, setShowAddTenantModal] = useState<boolean>(false);
  const [newSchoolName, setNewSchoolName] = useState<string>('');
  const [newSchoolCity, setNewSchoolCity] = useState<string>('');
  const [newSchoolPic, setNewSchoolPic] = useState<string>('');
  const [newSchoolPicPhone, setNewSchoolPicPhone] = useState<string>('');

  // AI Asy Instant WhatsApp Notification Trigger for Trial Reminders (Phase 3 - R121)
  const handleTriggerTrialReminder = (t: TenantSchool) => {
    alert(`[AI Asy Trial Intelligence R121]\nBerhasil mengirimkan notifikasi resmi pengingat masa trial (${t.trialMilestoneNotice || 'H-' + t.daysRemaining}) ke PIC Sekolah ${t.name} (${t.contactPic.phone}).\n\nPesan: "Assalamu'alaikum wr wb. Yth. ${t.contactPic.name}, masa trial TADE untuk ${t.name} tersisa ${t.daysRemaining} hari. Segera aktifkan lisensi Enterprise untuk kelangsungan layanan tanpa jeda."`);
  };

  const handleAddNewTenant = () => {
    if (!newSchoolName || !newSchoolCity) return;
    const newId = `t-${String(tenants.length + 1).padStart(3, '0')}`;
    const slug = newSchoolName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15);
    const newTenant: TenantSchool = {
      id: newId,
      tenantId: `tenant-${slug}-${Math.floor(10 + Math.random() * 90)}`,
      name: newSchoolName,
      city: newSchoolCity,
      npsn: `202${Math.floor(10000 + Math.random() * 90000)}`,
      accreditation: 'Proses',
      themeColor: '#059669',
      licenseStatus: 'TRIAL',
      licensePlan: 'Trial 30-Hari',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysRemaining: 30,
      trialMilestoneNotice: 'H-30',
      health: {
        database: 100,
        backup: 100,
        storage: 100,
        login: 100,
        qr: 100,
        messenger: 100,
        aiAsy: 100,
        schoolTv: 100,
        overallScore: 100
      },
      metrics: {
        totalStudents: 30,
        studentGrowthPct: 0,
        totalTeachers: 4,
        activeClasses: 2,
        storageUsedGb: 0.5,
        storageLimitGb: 20,
        dailyActiveParents: 25,
        featureAdoptionPct: 50
      },
      contactPic: {
        name: newSchoolPic || 'Kepala Sekolah',
        role: 'Penanggung Jawab',
        phone: newSchoolPicPhone || '0812-0000-0000',
        email: `admin@${slug}.sch.id`
      }
    };

    setTenants([newTenant, ...tenants]);
    setShowAddTenantModal(false);
    setNewSchoolName('');
    setNewSchoolCity('');
    setNewSchoolPic('');
    setNewSchoolPicPhone('');
    alert(`[Multi-Tenant Engine R120] Berhasil mendaftarkan tenant baru: ${newSchoolName} dengan Tenant ID: ${newTenant.tenantId}. Database Firestore Namespace terisolasi 100%.`);
  };

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.tenantId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.licenseStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              R120 • Multi-Tenant Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              R121 Trial Intelligence
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Ekosistem Multi-Sekolah & Pemantauan Tenant
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Setiap institusi sekolah memiliki ruang database terisolasi, logo, skema warna, konfigurasi, dan masa lisensi independen.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowAddTenantModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-transform active:scale-95"
          >
            <Building2 className="w-4 h-4" />
            <span>+ Daftarkan Sekolah Baru</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama sekolah, kota, atau tenantId..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto text-xs">
          <span className="text-slate-400 font-medium px-1 text-[11px]">Filter Lisensi:</span>
          {(['ALL', 'AKTIF', 'TRIAL', 'BERAKHIR', 'SUSPEND'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'Semua Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Tenant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTenants.map((tenant) => {
          const isTrialExpiringSoon = tenant.licenseStatus === 'TRIAL' && tenant.daysRemaining <= 7;
          const isExpired = tenant.licenseStatus === 'BERAKHIR';

          return (
            <div
              key={tenant.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between ${
                isTrialExpiringSoon 
                  ? 'border-amber-400/80 ring-2 ring-amber-400/20' 
                  : isExpired 
                  ? 'border-rose-400/80 ring-2 ring-rose-400/20' 
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="p-5 space-y-4">
                {/* Header Card */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-base shadow-sm"
                      style={{ backgroundColor: tenant.themeColor }}
                    >
                      {tenant.name.slice(3, 5).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                        {tenant.name}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{tenant.city}</span>
                        <span>•</span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">{tenant.accreditation}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                    tenant.licenseStatus === 'AKTIF'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : tenant.licenseStatus === 'TRIAL'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : tenant.licenseStatus === 'BERAKHIR'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {tenant.licenseStatus}
                  </span>
                </div>

                {/* Tenant ID Badge & Plan */}
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    ID: <strong className="text-slate-800 dark:text-slate-200">{tenant.tenantId}</strong>
                  </span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {tenant.licensePlan}
                  </span>
                </div>

                {/* Trial Milestone Warning Banner (Phase 3) */}
                {tenant.trialMilestoneNotice && (
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    isExpired
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-200'
                      : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 text-amber-900 dark:text-amber-200'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Notice {tenant.trialMilestoneNotice}: {tenant.daysRemaining} hari tersisa</span>
                    </div>
                    <button
                      onClick={() => handleTriggerTrialReminder(tenant)}
                      className="px-2 py-1 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-900 dark:text-slate-100 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-1"
                    >
                      <Send className="w-3 h-3 text-indigo-600" />
                      <span>Kirim WA</span>
                    </button>
                  </div>
                )}

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Murid</div>
                    <div className="text-xs font-black text-slate-900 dark:text-slate-100">{tenant.metrics.totalStudents}</div>
                    <div className="text-[9px] text-emerald-600 font-bold">+{tenant.metrics.studentGrowthPct}%</div>
                  </div>

                  <div className="p-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Guru</div>
                    <div className="text-xs font-black text-slate-900 dark:text-slate-100">{tenant.metrics.totalTeachers}</div>
                    <div className="text-[9px] text-slate-500">{tenant.metrics.activeClasses} Kelas</div>
                  </div>

                  <div className="p-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Health Score</div>
                    <div className="text-xs font-black text-emerald-600">{tenant.health.overallScore}/100</div>
                    <div className="text-[9px] text-slate-500">8/8 Modul</div>
                  </div>
                </div>

                {/* Health Score Mini Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>SLA Health Index (R122)</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{tenant.health.overallScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        tenant.health.overallScore >= 95 ? 'bg-emerald-500' : tenant.health.overallScore >= 85 ? 'bg-indigo-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${tenant.health.overallScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 rounded-b-2xl flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedTenantModal(tenant)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Detail Tenant</span>
                </button>

                <button
                  onClick={() => onOpenRemoteAssist && onOpenRemoteAssist(tenant)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Remote Assist (R124)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tenant Detail Modal (Phase 2 & 4) */}
      {selectedTenantModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white"
                  style={{ backgroundColor: selectedTenantModal.themeColor }}
                >
                  {selectedTenantModal.name.slice(3, 5)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{selectedTenantModal.name}</h3>
                  <div className="text-xs text-slate-400 font-mono">Tenant ID: {selectedTenantModal.tenantId}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTenantModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Tenant Health Center 8-Pillar Score (Phase 4 - R122) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>R122 • Tenant Health Center (8 Pilar Diagnostic)</span>
                  </h4>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Skor Total: {selectedTenantModal.health.overallScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { label: 'Database', score: selectedTenantModal.health.database },
                    { label: 'Backup Snapshot', score: selectedTenantModal.health.backup },
                    { label: 'Storage Cloud', score: selectedTenantModal.health.storage },
                    { label: 'Login & RBAC', score: selectedTenantModal.health.login },
                    { label: 'Dynamic QR', score: selectedTenantModal.health.qr },
                    { label: 'Living Messenger', score: selectedTenantModal.health.messenger },
                    { label: 'AI Asy Engine', score: selectedTenantModal.health.aiAsy },
                    { label: 'School TV Kiosk', score: selectedTenantModal.health.schoolTv }
                  ].map((p, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="text-[10px] text-slate-500">{p.label}</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                        <span>{p.score}%</span>
                        <span className={`w-2 h-2 rounded-full ${p.score >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* License & Contact PIC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Lisensi & Masa Aktif</span>
                  </h4>
                  <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span>Paket:</span>
                      <strong className="text-slate-900 dark:text-slate-100">{selectedTenantModal.licensePlan}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Mulai:</span>
                      <span>{selectedTenantModal.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Berakhir:</span>
                      <span>{selectedTenantModal.endDate}</span>
                    </div>
                    <div className="flex justify-between text-indigo-600 dark:text-indigo-400 font-bold">
                      <span>Sisa Waktu:</span>
                      <span>{selectedTenantModal.daysRemaining} Hari</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kontak PIC Sekolah</span>
                  </h4>
                  <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{selectedTenantModal.contactPic.name}</div>
                    <div className="text-slate-500">{selectedTenantModal.contactPic.role}</div>
                    <div>Telp/WA: <strong>{selectedTenantModal.contactPic.phone}</strong></div>
                    <div>Email: <strong>{selectedTenantModal.contactPic.email}</strong></div>
                  </div>
                </div>
              </div>

              {/* Data Isolation Verification */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Jaminan Isolasi Data Multi-Tenant (DISC-041)</span>
                </div>
                <p className="text-emerald-800 dark:text-emerald-400 text-[11px] leading-relaxed">
                  Tenant ini memiliki namespace database mandiri <code className="bg-emerald-100 dark:bg-emerald-900 px-1 py-0.5 rounded text-emerald-900 dark:text-emerald-200 font-mono">/tenants/{selectedTenantModal.tenantId}/</code>. Tidak ada akses data silang murid/guru dengan sekolah lain sesuai konstitusi TADE v8.3.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
              <button
                onClick={() => setSelectedTenantModal(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Tenant Modal (Phase 2) */}
      {showAddTenantModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Daftarkan Sekolah Baru</h3>
              </div>
              <button onClick={() => setShowAddTenantModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Institusi TK / PAUD:</label>
                <input
                  type="text"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  placeholder="Contoh: TK Islam Bintang Kejora"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kota / Kabupaten & Provinsi:</label>
                <input
                  type="text"
                  value={newSchoolCity}
                  onChange={(e) => setNewSchoolCity(e.target.value)}
                  placeholder="Contoh: Semarang, Jawa Tengah"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Penanggung Jawab (PIC):</label>
                <input
                  type="text"
                  value={newSchoolPic}
                  onChange={(e) => setNewSchoolPic(e.target.value)}
                  placeholder="Contoh: Ustadzah Maryam, M.Pd"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">No. WhatsApp PIC:</label>
                <input
                  type="text"
                  value={newSchoolPicPhone}
                  onChange={(e) => setNewSchoolPicPhone(e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-900 dark:text-indigo-200">
                ⚡ <strong>Auto-Provisioning:</strong> Sekolah otomatis mendapatkan masa Trial 30 Hari penuh dan notifikasi milestone H-30 s/d Hari H via AI Asy.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowAddTenantModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleAddNewTenant}
                disabled={!newSchoolName || !newSchoolCity}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold"
              >
                Aktifkan Tenant Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
