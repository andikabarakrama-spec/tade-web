/**
 * TADE FOUNDER OFFICE PHASE-1 — SPRINT G3
 * Cabinet Resolution Service
 * Manages official resolutions, governance decrees, and cross-domain action items for Yayasan & Founder.
 * Single Source of Truth: localStorage (tade_cabinet_resolutions_v1)
 */

export type ResolutionCategory = 
  | 'TATA_KELOLA' 
  | 'KURIKULUM_TAHFIDZ' 
  | 'INFRASTRUKTUR_SARPRAS' 
  | 'KEUANGAN_INFAQ' 
  | 'KEMITRAAN_WALI';

export type ResolutionStatus = 'Pending' | 'In Progress' | 'Verified' | 'Completed';
export type ResolutionPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM';

export interface ActionItem {
  id: string;
  task: string;
  completed: boolean;
  assignedRole: string;
}

export interface CabinetResolution {
  id: string;
  code: string;
  title: string;
  description: string;
  category: ResolutionCategory;
  status: ResolutionStatus;
  priority: ResolutionPriority;
  createdDate: string;
  targetDate: string;
  leadResponsible: string;
  progressPercentage: number;
  actionItems: ActionItem[];
  verifiedBy?: string;
  verifiedTimestamp?: string;
}

const STORAGE_KEY = 'tade_cabinet_resolutions_v1';

const INITIAL_RESOLUTIONS: CabinetResolution[] = [
  {
    id: 'res-01',
    code: 'RES/YSF/2026/08/001',
    title: 'Standarisasi Mutabaah Tahfidz & Doa Harian Digital',
    description: 'Penerapan pencatatan hafalan surat pendek (An-Nas s/d Ad-Dhuha) dan 15 doa harian langsung melalui Portal Guru dan ringkasan harian di Portal Wali Murid.',
    category: 'KURIKULUM_TAHFIDZ',
    status: 'Verified',
    priority: 'HIGH',
    createdDate: '2026-08-15',
    targetDate: '2026-08-25',
    leadResponsible: 'Kepala Sekolah & Koordinator Tahfidz',
    progressPercentage: 92,
    verifiedBy: 'Founder Andika & Ketua Yayasan',
    verifiedTimestamp: '2026-08-20T10:00:00Z',
    actionItems: [
      { id: 'act-1', task: 'Penyusunan matriks 15 doa harian terstandar', completed: true, assignedRole: 'Guru Sentra Agama' },
      { id: 'act-2', task: 'Uji coba sync data tahfidz ke kartu ringkasan wali', completed: true, assignedRole: 'Admin SIM' },
      { id: 'act-3', task: 'Sosialisasi pengisian mandiri mutabaah', completed: false, assignedRole: 'Wali Kelas' }
    ]
  },
  {
    id: 'res-02',
    code: 'RES/YSF/2026/08/002',
    title: 'Peningkatan Protokol Sanitasi & Nutrisi KMS Berkala',
    description: 'Pemeriksaan kesehatan fisik (Tinggi Badan, Berat Badan, Lingkar Kepala) anak setiap minggu ke-3 dan integrasi otomatis ke grafik KMS.',
    category: 'INFRASTRUKTUR_SARPRAS',
    status: 'In Progress',
    priority: 'HIGH',
    createdDate: '2026-08-16',
    targetDate: '2026-08-28',
    leadResponsible: 'Koordinator UKS & Sentra Bahan Alam',
    progressPercentage: 65,
    actionItems: [
      { id: 'act-4', task: 'Pengadaan timbangan digital terkalibrasi', completed: true, assignedRole: 'Sarpras' },
      { id: 'act-5', task: 'Input baseline data KMS seluruh siswa', completed: true, assignedRole: 'Guru Kelas' },
      { id: 'act-6', task: 'Pemberian laporan status gizi per semester ke wali murid', completed: false, assignedRole: 'Admin SIM' }
    ]
  },
  {
    id: 'res-03',
    code: 'RES/YSF/2026/08/003',
    title: 'Adopsi PWA & Kanal Komunikasi Terpadu Tanpa Hambatan',
    description: 'Pencapaian target 90% wali murid menginstal PWA ke homescreen dan mengaktifkan notifikasi resmi kegiatan sekolah.',
    category: 'KEMITRAAN_WALI',
    status: 'In Progress',
    priority: 'CRITICAL',
    createdDate: '2026-08-18',
    targetDate: '2026-08-30',
    leadResponsible: 'Humas & Tim IT Sekolah',
    progressPercentage: 78,
    actionItems: [
      { id: 'act-7', task: 'Pemasangan banner panduan PWA di gerbang sekolah', completed: true, assignedRole: 'Humas' },
      { id: 'act-8', task: 'Aktivasi broadcast WhatsApp ber-deep link', completed: true, assignedRole: 'Admin SIM' },
      { id: 'act-9', task: 'Verifikasi penerimaan notifikasi pada 100% wali murid', completed: false, assignedRole: 'Admin SIM' }
    ]
  },
  {
    id: 'res-04',
    code: 'RES/YSF/2026/08/004',
    title: 'Pemisahan Rekening Khusus Infaq Bangunan & SPP Rutin',
    description: 'Pencatatan transparan seluruh arus kas sekolah dengan kwitansi digital bernomor unik dan laporan keuangan real-time.',
    category: 'KEUANGAN_INFAQ',
    status: 'Completed',
    priority: 'CRITICAL',
    createdDate: '2026-08-10',
    targetDate: '2026-08-18',
    leadResponsible: 'Bendahara Yayasan',
    progressPercentage: 100,
    verifiedBy: 'Ketua Yayasan',
    verifiedTimestamp: '2026-08-18T16:00:00Z',
    actionItems: [
      { id: 'act-10', task: 'Penetapan rekening giro resmi yayasan', completed: true, assignedRole: 'Bendahara' },
      { id: 'act-11', task: 'Integrasi kwitansi otomatis dengan QR verifikasi', completed: true, assignedRole: 'Admin SIM' }
    ]
  },
  {
    id: 'res-05',
    code: 'RES/YSF/2026/08/005',
    title: 'Audit Keamanan Data Siswa & Zero Vendor Lock-in',
    description: 'Memastikan seluruh data identitas, foto kegiatan, dan laporan nilai disimpan dalam arsitektur berdaulat dengan audit log mutlak.',
    category: 'TATA_KELOLA',
    status: 'Verified',
    priority: 'CRITICAL',
    createdDate: '2026-08-19',
    targetDate: '2026-08-27',
    leadResponsible: 'Founder & Tim Kedaulatan Digital',
    progressPercentage: 95,
    verifiedBy: 'Founder Andika',
    verifiedTimestamp: '2026-08-21T03:00:00Z',
    actionItems: [
      { id: 'act-12', task: 'Audit Ring-0 keamanan RBAC', completed: true, assignedRole: 'Founder' },
      { id: 'act-13', task: 'Validasi Single Source of Truth DataService', completed: true, assignedRole: 'Founder' }
    ]
  }
];

export const cabinetResolutionService = {
  getResolutions(): CabinetResolution[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESOLUTIONS));
        return INITIAL_RESOLUTIONS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_RESOLUTIONS;
    }
  },

  addResolution(res: Omit<CabinetResolution, 'id' | 'code' | 'createdDate'>): CabinetResolution {
    const all = this.getResolutions();
    const count = all.length + 1;
    const code = `RES/YSF/2026/${new Date().getMonth() + 1}/${String(count).padStart(3, '0')}`;
    const newRes: CabinetResolution = {
      ...res,
      id: `res-${Date.now()}`,
      code,
      createdDate: new Date().toISOString().split('T')[0]
    };
    const updated = [newRes, ...all];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return newRes;
  },

  updateStatus(id: string, status: ResolutionStatus, verifiedBy?: string): boolean {
    const all = this.getResolutions();
    const item = all.find(r => r.id === id);
    if (!item) return false;

    item.status = status;
    if (status === 'Verified' || status === 'Completed') {
      item.verifiedBy = verifiedBy || 'Founder Andika';
      item.verifiedTimestamp = new Date().toISOString();
      if (status === 'Completed') item.progressPercentage = 100;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {}
    return true;
  },

  toggleActionItem(resId: string, actionId: string): boolean {
    const all = this.getResolutions();
    const res = all.find(r => r.id === resId);
    if (!res) return false;

    const action = res.actionItems.find(a => a.id === actionId);
    if (!action) return false;

    action.completed = !action.completed;
    const completedCount = res.actionItems.filter(a => a.completed).length;
    res.progressPercentage = Math.round((completedCount / res.actionItems.length) * 100);

    if (res.progressPercentage === 100 && res.status !== 'Completed') {
      res.status = 'Verified';
      res.verifiedBy = 'Sovereign Auto-Validator';
      res.verifiedTimestamp = new Date().toISOString();
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {}
    return true;
  },

  getStats() {
    const all = this.getResolutions();
    return {
      total: all.length,
      pending: all.filter(r => r.status === 'Pending').length,
      inProgress: all.filter(r => r.status === 'In Progress').length,
      verified: all.filter(r => r.status === 'Verified').length,
      completed: all.filter(r => r.status === 'Completed').length,
      averageProgress: Math.round(all.reduce((acc, curr) => acc + curr.progressPercentage, 0) / (all.length || 1))
    };
  }
};
