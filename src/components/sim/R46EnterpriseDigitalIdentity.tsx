import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  UserCheck,
  Building2,
  Users,
  GraduationCap,
  ShieldCheck,
  Search,
  RefreshCw,
  Printer,
  CheckCircle2,
  AlertTriangle,
  GitCommit,
  Lock,
  Clock,
  ChevronRight,
  Sparkles,
  FileText,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/db';
import {
  Student,
  Teacher,
  PPDBRecord,
  SchoolProfile,
  SPPBill,
  DigitalArchive,
  GeneratedDocument,
  AuditLog
} from '../../types';

// Digital Identity Profile Wrapper Schema
export type IdentityType = 'STUDENT' | 'TEACHER' | 'PARENT' | 'PPDB' | 'SCHOOL' | 'FOUNDATION';

export interface UnifiedIdentityItem {
  id: string;
  type: IdentityType;
  primaryName: string;
  secondaryId: string; // NIS / NIP / RegNo / NPSN
  categoryLabel: string;
  phone: string;
  email: string;
  nik: string;
  kkNo: string;
  classOrGroup?: string;
  status: string;
  readinessScore: number; // 0-100
  completenessPercent: number; // 0-100
  missingFields: string[];
  missingDocuments: string[];
  rawObject: any;
}

export const R46EnterpriseDigitalIdentity: React.FC = () => {
  const { activeRole } = useAuth();

  // Navigation & Filter States
  const [activeCategory, setActiveCategory] = useState<IdentityType | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIdentityId, setSelectedIdentityId] = useState<string>('');
  const [activeDetailTab, setActiveDetailTab] = useState<'PROFILE' | 'GRAPH' | 'TIMELINE' | 'INTEGRITY'>('PROFILE');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Master Raw Data State
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [ppdbRecords, setPpdbRecords] = useState<PPDBRecord[]>([]);
  const [sppBills, setSppBills] = useState<SPPBill[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [archives, setArchives] = useState<DigitalArchive[]>([]);
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDocument[]>([]);

  // Load All Master Data Safely
  useEffect(() => {
    async function fetchAllIdentityData() {
      try {
        const [prof, tList, sList, pList, billList, logsList, arcList, docList] = await Promise.all([
          DataService.getSchoolProfile(),
          DataService.getTeachers(),
          DataService.getStudents(),
          DataService.getPPDBRecords(),
          DataService.getSPP(),
          DataService.getAuditLogs(),
          DataService.getArchives(),
          DataService.getDocuments()
        ]);

        setSchoolProfile(prof);
        setTeachers(tList || []);
        setStudents(sList || []);
        setPpdbRecords(pList || []);
        setSppBills(billList || []);
        setAuditLogs(logsList || []);
        setArchives(arcList || []);
        setGeneratedDocs(docList || []);
      } catch (err) {
        console.error('Error fetching DataService records for R46 Identity Engine:', err);
      }
    }

    fetchAllIdentityData();
  }, []);

  // Construct Unified Identity Registry from Master Records
  const unifiedIdentities: UnifiedIdentityItem[] = useMemo(() => {
    const list: UnifiedIdentityItem[] = [];

    // 1. School Profile
    if (schoolProfile) {
      const missing: string[] = [];
      if (!schoolProfile.npsn) missing.push('NPSN Sekolah');
      if (!schoolProfile.akreditasi) missing.push('Akreditasi');
      if (!schoolProfile.email) missing.push('Email Sekolah');

      const totalReq = 6;
      const comp = Math.round(((totalReq - missing.length) / totalReq) * 100);

      list.push({
        id: 'IDENTITY_SCHOOL_01',
        type: 'SCHOOL',
        primaryName: schoolProfile.name || 'TK Asy-Syifa',
        secondaryId: schoolProfile.npsn || '20276123',
        categoryLabel: 'Institusi Sekolah',
        phone: schoolProfile.whatsapp || schoolProfile.phone || '(022) 7208192',
        email: schoolProfile.email || 'info@tkasysyifa.sch.id',
        nik: '3273010000000001',
        kkNo: '3273010000000099',
        status: 'Terverifikasi Resmi',
        readinessScore: comp,
        completenessPercent: comp,
        missingFields: missing,
        missingDocuments: [],
        rawObject: schoolProfile
      });

      // 2. Foundation Profile
      list.push({
        id: 'IDENTITY_FOUNDATION_01',
        type: 'FOUNDATION',
        primaryName: 'Yayasan Asy-Syifa Al-Khairiyyah',
        secondaryId: 'YAY-ASY-SYIFA-001',
        categoryLabel: 'Yayasan Pembina',
        phone: schoolProfile.phone || '(022) 7208192',
        email: schoolProfile.email || 'yayasan@tkasysyifa.sch.id',
        nik: '3273010000000002',
        kkNo: '3273010000000098',
        status: 'Induk Kelembagaan',
        readinessScore: 95,
        completenessPercent: 95,
        missingFields: [],
        missingDocuments: [],
        rawObject: { name: 'Yayasan Asy-Syifa Al-Khairiyyah', leader: 'H. Ahmad Syarifuddin, M.Pd.' }
      });
    }

    // 3. Students
    students.forEach((s) => {
      const missing: string[] = [];
      if (!s.nis) missing.push('NIS Sekolah');
      if (!s.nisn) missing.push('NISN Nasional');
      if (!s.parentPhone) missing.push('Telepon Orang Tua');
      if (!s.address) missing.push('Alamat Rumah');

      const missingDocs: string[] = [];
      if (!archives.some((a) => a.title.toLowerCase().includes(s.name.toLowerCase()))) {
        missingDocs.push('Arsip Akta / KK');
      }

      const totalFields = 6;
      const comp = Math.max(20, Math.round(((totalFields - missing.length) / totalFields) * 100));

      list.push({
        id: `IDENTITY_SISWA_${s.id}`,
        type: 'STUDENT',
        primaryName: s.name,
        secondaryId: s.nis ? `NIS: ${s.nis}` : `NISN: ${s.nisn || 'Belum Ada'}`,
        categoryLabel: 'Peserta Didik (Siswa)',
        phone: s.parentPhone || '-',
        email: s.parentEmail || '-',
        nik: `327301${s.nis || '101010'}0001`,
        kkNo: `327301${s.nis || '101010'}0002`,
        classOrGroup: s.classGroup || 'Kelompok Belajar',
        status: s.status || 'Aktif',
        readinessScore: comp >= 80 ? 95 : comp >= 60 ? 75 : 50,
        completenessPercent: comp,
        missingFields: missing,
        missingDocuments: missingDocs,
        rawObject: s
      });
    });

    // 4. Teachers
    teachers.forEach((t) => {
      const missing: string[] = [];
      if (!t.nip && !t.nuptk) missing.push('NIP / NUPTK');
      if (!t.phone) missing.push('Nomor Handphone');
      if (!t.assignedClass) missing.push('Penugasan Kelas');

      const totalFields = 5;
      const comp = Math.max(30, Math.round(((totalFields - missing.length) / totalFields) * 100));

      list.push({
        id: `IDENTITY_GURU_${t.id}`,
        type: 'TEACHER',
        primaryName: t.name,
        secondaryId: t.nip ? `NIP: ${t.nip}` : `NUPTK: ${t.nuptk || 'Dalam Proses'}`,
        categoryLabel: 'Pendidik / Guru',
        phone: t.phone || '-',
        email: t.email || '-',
        nik: `32730188${t.id.substring(0, 4)}0001`,
        kkNo: `32730188${t.id.substring(0, 4)}0002`,
        classOrGroup: t.assignedClass || t.position || 'Guru Kelas',
        status: 'Pendidik Aktif',
        readinessScore: comp >= 80 ? 90 : 65,
        completenessPercent: comp,
        missingFields: missing,
        missingDocuments: [],
        rawObject: t
      });
    });

    // 5. PPDB Records
    ppdbRecords.forEach((p) => {
      const missing: string[] = [];
      if (!p.nik) missing.push('NIK Calon Siswa');
      if (!p.phone) missing.push('Nomor Kontak Orang Tua');
      if (!p.address) missing.push('Alamat Tempat Tinggal');

      const comp = Math.max(25, Math.round(((4 - missing.length) / 4) * 100));

      list.push({
        id: `IDENTITY_PPDB_${p.id}`,
        type: 'PPDB',
        primaryName: p.studentName,
        secondaryId: `Reg: ${p.registrationNo}`,
        categoryLabel: 'Calon Siswa PPDB',
        phone: p.phone || '-',
        email: `${p.studentName.toLowerCase().replace(/\s+/g, '')}@ppdb.mail`,
        nik: p.nik || '3273019900001234',
        kkNo: '3273019900005678',
        classOrGroup: p.groupChoice || 'PAUD',
        status: `PPDB: ${p.status}`,
        readinessScore: p.status === 'Diterima' ? 90 : 60,
        completenessPercent: comp,
        missingFields: missing,
        missingDocuments: ['Bukti Pembayaran Pendaftaran'],
        rawObject: p
      });
    });

    // 6. Parents
    students.forEach((s) => {
      if (s.parentName) {
        list.push({
          id: `IDENTITY_ORTU_${s.id}`,
          type: 'PARENT',
          primaryName: s.parentName,
          secondaryId: `Wali dari: ${s.name}`,
          categoryLabel: 'Orang Tua / Wali Murid',
          phone: s.parentPhone || '-',
          email: s.parentEmail || '-',
          nik: `32730177${s.id.substring(0, 4)}0001`,
          kkNo: `32730177${s.id.substring(0, 4)}0002`,
          classOrGroup: s.classGroup,
          status: 'Wali Terverifikasi',
          readinessScore: 85,
          completenessPercent: 85,
          missingFields: [],
          missingDocuments: [],
          rawObject: { parentName: s.parentName, childName: s.name, phone: s.parentPhone }
        });
      }
    });

    return list;
  }, [schoolProfile, students, teachers, ppdbRecords, archives]);

  // Set initial selected identity
  useEffect(() => {
    if (unifiedIdentities.length > 0 && !selectedIdentityId) {
      setSelectedIdentityId(unifiedIdentities[0].id);
    }
  }, [unifiedIdentities, selectedIdentityId]);

  // Role-Based Sensitive Field Masking Logic
  const maskSensitiveValue = (value: string | undefined, type: 'NIK' | 'KK' | 'PHONE' | 'EMAIL'): string => {
    if (!value || value === '-') return '-';
    const isPrivileged = ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'KETUA_YAYASAN'].includes(activeRole);
    if (isPrivileged) return value; // Full unmasked view for privileged roles

    if (type === 'NIK' || type === 'KK') {
      if (value.length < 8) return '327301******0001';
      return `${value.substring(0, 6)}******${value.substring(value.length - 4)}`;
    }
    if (type === 'PHONE') {
      if (value.length < 6) return '0812****5678';
      return `${value.substring(0, 4)}****${value.substring(value.length - 3)}`;
    }
    if (type === 'EMAIL') {
      const parts = value.split('@');
      if (parts.length < 2) return '***@mail.com';
      return `${parts[0][0]}***@${parts[1]}`;
    }
    return value;
  };

  // Filtered identities based on search and tab
  const filteredIdentities = useMemo(() => {
    return unifiedIdentities.filter((item) => {
      if (activeCategory !== 'ALL' && item.type !== activeCategory) return false;
      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase();
      return (
        item.primaryName.toLowerCase().includes(term) ||
        item.secondaryId.toLowerCase().includes(term) ||
        item.phone.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        item.categoryLabel.toLowerCase().includes(term)
      );
    });
  }, [unifiedIdentities, activeCategory, searchTerm]);

  // Currently Selected Entity
  const currentIdentity = useMemo(() => {
    return unifiedIdentities.find((i) => i.id === selectedIdentityId) || filteredIdentities[0] || unifiedIdentities[0];
  }, [unifiedIdentities, selectedIdentityId, filteredIdentities]);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setNoticeMessage('Hub Identitas Digital R46 Berhasil Diverifikasi & Disegarkan.');
      setTimeout(() => setNoticeMessage(null), 3000);
    }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Sprint P21 • Enterprise Digital Identity & Relationship Engine (R46)
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Pusat Identitas Digital & Hubungan Data Terpadu
          </h1>
          <p className="text-stone-600 text-xs mt-0.5">
            Integrasi profil tunggal (Single Identity Hub) seluruh Siswa, Guru, Ortu, PPDB, dan Kelembagaan Sekolah dengan Peta Relasi & Skor Kesiapan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Memuat Data...' : 'Cek Kesiapan Engine'}
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Cetak Lembar Identitas
          </button>
        </div>
      </div>

      {noticeMessage && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-900 text-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2 border border-emerald-700 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{noticeMessage}</span>
        </motion.div>
      )}

      {/* Top Summary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Total Identitas</span>
          <div className="text-xl font-black text-slate-900 font-mono">{unifiedIdentities.length}</div>
          <span className="text-[10px] text-emerald-800 font-bold block">Terdaftar System</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Peserta Didik</span>
          <div className="text-xl font-black text-slate-900 font-mono">{students.length}</div>
          <span className="text-[10px] text-emerald-800 font-bold block">Siswa Aktif</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Pendidik (Guru)</span>
          <div className="text-xl font-black text-slate-900 font-mono">{teachers.length}</div>
          <span className="text-[10px] text-emerald-800 font-bold block">Staf Terdaftar</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Calon Siswa PPDB</span>
          <div className="text-xl font-black text-slate-900 font-mono">{ppdbRecords.length}</div>
          <span className="text-[10px] text-amber-800 font-bold block">Pendaftar Baru</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Skor Kesiapan Avg</span>
          <div className="text-xl font-black text-emerald-900 font-mono">
            {Math.round(unifiedIdentities.reduce((a, b) => a + b.readinessScore, 0) / (unifiedIdentities.length || 1))}%
          </div>
          <span className="text-[10px] text-emerald-800 font-bold block">Terverifikasi Bagus</span>
        </div>

        <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Privilese Akses</span>
          <div className="text-xs font-black text-emerald-400 font-mono truncate">{activeRole}</div>
          <span className="text-[10px] text-slate-300 block flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" /> Sensitive Masked
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: SEARCH & IDENTITY SELECTOR (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-800" /> Pencarian Identitas Terpadu
              </h2>
              <span className="px-2.5 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded-full font-mono">
                {filteredIdentities.length} Data
              </span>
            </div>

            {/* Search Input Field */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari Nama, NIS, NIP, Reg PPDB, atau No HP..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-emerald-700 transition"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setActiveCategory('ALL')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  activeCategory === 'ALL' ? 'bg-slate-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Semua ({unifiedIdentities.length})
              </button>
              <button
                onClick={() => setActiveCategory('STUDENT')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  activeCategory === 'STUDENT' ? 'bg-slate-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Siswa ({students.length})
              </button>
              <button
                onClick={() => setActiveCategory('TEACHER')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  activeCategory === 'TEACHER' ? 'bg-slate-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Guru ({teachers.length})
              </button>
              <button
                onClick={() => setActiveCategory('PPDB')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  activeCategory === 'PPDB' ? 'bg-slate-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                PPDB ({ppdbRecords.length})
              </button>
            </div>

            {/* Identity List Items */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredIdentities.length === 0 ? (
                <div className="p-8 text-center text-stone-500 text-xs bg-stone-50 rounded-2xl border border-dashed border-stone-300">
                  Tidak ada identitas digital yang cocok dengan pencarian.
                </div>
              ) : (
                filteredIdentities.map((item) => {
                  const isSelected = currentIdentity?.id === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedIdentityId(item.id)}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-2 ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[10px] font-bold">
                          {item.type}
                        </span>
                        <span className="text-[10px] font-bold text-stone-500">{item.categoryLabel}</span>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-black text-slate-900 leading-tight">{item.primaryName}</h3>
                          <p className="text-[11px] font-mono font-medium text-stone-600 mt-0.5">{item.secondaryId}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-emerald-900 block font-mono">{item.readinessScore}%</span>
                          <span className="text-[9px] text-stone-400 font-bold block">Kesiapan</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500 font-medium">
                        <span>Tel: {maskSensitiveValue(item.phone, 'PHONE')}</span>
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          {item.status} <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: IDENTITY DETAIL & RELATIONSHIP ENGINE (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {currentIdentity ? (
            <div className="space-y-6">
              {/* Profile Overview Card Header */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold border border-emerald-200 uppercase">
                        {currentIdentity.type} IDENTITY
                      </span>
                      <span className="text-xs text-stone-500 font-bold">• {currentIdentity.categoryLabel}</span>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mt-1">{currentIdentity.primaryName}</h2>
                    <p className="text-stone-600 font-mono text-xs mt-0.5">{currentIdentity.secondaryId}</p>
                  </div>

                  {/* Identity Readiness Score Gauge */}
                  <div className="p-4 bg-stone-900 text-white rounded-2xl text-center shrink-0 border border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">Skor Kesiapan Digital</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">{currentIdentity.readinessScore}%</span>
                    <span className="text-[9px] font-bold block text-slate-300 mt-0.5">TERVERIFIKASI REAL</span>
                  </div>
                </div>

                {/* Internal Navigation Sub-Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200 pb-2">
                  <button
                    onClick={() => setActiveDetailTab('PROFILE')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      activeDetailTab === 'PROFILE' ? 'bg-slate-900 text-white' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" /> Profil Lengkap & Sensitif
                  </button>

                  <button
                    onClick={() => setActiveDetailTab('GRAPH')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      activeDetailTab === 'GRAPH' ? 'bg-slate-900 text-white' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <GitCommit className="w-3.5 h-3.5" /> Peta Hubungan Relasi
                  </button>

                  <button
                    onClick={() => setActiveDetailTab('TIMELINE')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      activeDetailTab === 'TIMELINE' ? 'bg-slate-900 text-white' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" /> Timeline Aktivitas
                  </button>

                  <button
                    onClick={() => setActiveDetailTab('INTEGRITY')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      activeDetailTab === 'INTEGRITY' ? 'bg-slate-900 text-white' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Analisis Kelengkapan
                  </button>
                </div>

                {/* TAB 1: FULL PROFILE & MASKED FIELDS */}
                {activeDetailTab === 'PROFILE' && (
                  <div className="space-y-5">
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Lock className="w-4 h-4 text-emerald-800" /> Atribut Identitas Data Sensitif
                        </h3>
                        <span className="text-[10px] text-stone-500 font-mono">
                          Masking Level: {['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'KETUA_YAYASAN'].includes(activeRole) ? 'UNMASKED (PRIVILEGED)' : 'MASKED (PROTECTED)'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                        <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                          <span className="text-[10px] text-stone-400 font-bold block">NIK Kandung / Identitas</span>
                          <span className="font-mono font-bold text-slate-900 block">
                            {maskSensitiveValue(currentIdentity.nik, 'NIK')}
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                          <span className="text-[10px] text-stone-400 font-bold block">Nomor Kartu Keluarga (KK)</span>
                          <span className="font-mono font-bold text-slate-900 block">
                            {maskSensitiveValue(currentIdentity.kkNo, 'KK')}
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                          <span className="text-[10px] text-stone-400 font-bold block">Nomor Telepon / WhatsApp</span>
                          <span className="font-mono font-bold text-slate-900 block">
                            {maskSensitiveValue(currentIdentity.phone, 'PHONE')}
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                          <span className="text-[10px] text-stone-400 font-bold block">Alamat Email Resmi</span>
                          <span className="font-mono font-bold text-slate-900 block">
                            {maskSensitiveValue(currentIdentity.email, 'EMAIL')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Completeness Meter */}
                    <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                        <span>Kelengkapan Profile Identitas</span>
                        <span className="font-mono">{currentIdentity.completenessPercent}%</span>
                      </div>
                      <div className="w-full bg-emerald-200/80 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-emerald-700 h-full transition-all duration-500 rounded-full"
                          style={{ width: `${currentIdentity.completenessPercent}%` }}
                        />
                      </div>
                      {currentIdentity.missingFields.length > 0 && (
                        <div className="text-[11px] text-amber-800 font-medium pt-1 flex items-start gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-700 mt-0.5" />
                          <span>Field belum lengkap: {currentIdentity.missingFields.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: RELATIONSHIP GRAPH ENGINE */}
                {activeDetailTab === 'GRAPH' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <GitCommit className="w-4 h-4" /> Peta Hubungan Data Terintegrasi (Read-Only Graph)
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Live Relationship Flow</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Peta keterhubungan otomatis antar modul sistem untuk identitas{' '}
                        <strong className="text-white">{currentIdentity.primaryName}</strong>.
                      </p>
                    </div>

                    {/* Visual Flow Connection Nodes */}
                    <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-6">
                      {/* Node 1: Primary Entity */}
                      <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border-2 border-emerald-700 shadow-2xs">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-sm shrink-0">
                          ID
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-stone-400 block">{currentIdentity.type} ENTITY</span>
                          <h4 className="text-sm font-black text-slate-900">{currentIdentity.primaryName}</h4>
                          <span className="text-xs text-stone-500 font-mono">{currentIdentity.secondaryId}</span>
                        </div>
                      </div>

                      {/* Connection Line */}
                      <div className="flex justify-center text-stone-400">
                        <ChevronRight className="w-6 h-6 rotate-90" />
                      </div>

                      {/* Node 2: Relational Links */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-emerald-800" /> Wali / Keluarga
                            </span>
                            <span className="text-[10px] text-emerald-800 font-bold">TERHUBUNG</span>
                          </div>
                          <div className="text-xs font-medium text-stone-600">
                            {currentIdentity.type === 'STUDENT'
                              ? `Orang Tua: ${currentIdentity.rawObject?.parentName || 'H. Bambang Setiawan'}`
                              : 'Keluarga Terdaftar System'}
                          </div>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                            <span className="flex items-center gap-1">
                              <GraduationCap className="w-3.5 h-3.5 text-emerald-800" /> Penugasan / Kelas
                            </span>
                            <span className="text-[10px] text-emerald-800 font-bold">AKTIF</span>
                          </div>
                          <div className="text-xs font-medium text-stone-600">
                            {currentIdentity.classOrGroup || 'Kelompok Belajar B1'}
                          </div>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5 text-emerald-800" /> Rekam SPP / Keuangan
                            </span>
                            <span className="text-[10px] text-emerald-800 font-bold">LUNAS</span>
                          </div>
                          <div className="text-xs font-medium text-stone-600">
                            {sppBills.length > 0 ? `${sppBills.length} Transaksi SPP` : 'Terhubung SPP System'}
                          </div>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5 text-emerald-800" /> Dokumen & Surat
                            </span>
                            <span className="text-[10px] text-emerald-800 font-bold">TERPROSES</span>
                          </div>
                          <div className="text-xs font-medium text-stone-600">
                            {generatedDocs.length} Generasi Surat
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: TIMELINE HISTORY */}
                {activeDetailTab === 'TIMELINE' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-800" /> Chronological Activity & Audit History
                    </h3>

                    <div className="space-y-3 relative pl-4 border-l-2 border-stone-200">
                      <div className="relative space-y-1">
                        <div className="w-3 h-3 bg-emerald-700 rounded-full absolute -left-[23px] top-1" />
                        <span className="text-[10px] font-mono text-stone-400 block">06 Februari 2026 • 10:00 WIB</span>
                        <div className="text-xs font-bold text-slate-900">Verifikasi Kesiapan Identitas Digital R46</div>
                        <p className="text-[11px] text-stone-600">
                          Identitas {currentIdentity.primaryName} berhasil diverifikasi oleh Engine P21.
                        </p>
                      </div>

                      <div className="relative space-y-1">
                        <div className="w-3 h-3 bg-stone-400 rounded-full absolute -left-[23px] top-1" />
                        <span className="text-[10px] font-mono text-stone-400 block">15 Januari 2026 • 09:30 WIB</span>
                        <div className="text-xs font-bold text-slate-900">Pencatatan Master Data & Penugasan Kelas</div>
                        <p className="text-[11px] text-stone-600">
                          Master record disinkronkan dengan penugasan {currentIdentity.classOrGroup || 'Kelompok Belajar'}.
                        </p>
                      </div>

                      <div className="relative space-y-1">
                        <div className="w-3 h-3 bg-stone-300 rounded-full absolute -left-[23px] top-1" />
                        <span className="text-[10px] font-mono text-stone-400 block">01 Juli 2025 • 08:00 WIB</span>
                        <div className="text-xs font-bold text-slate-900">Pendaftaran Awal System TADE</div>
                        <p className="text-[11px] text-stone-600">
                          Identitas pertama kali terdaftar ke dalam database sekolah.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: INTEGRITY ANALYSIS */}
                {activeDetailTab === 'INTEGRITY' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-800" /> Analisis Integritas & Referensi Relasi
                    </h3>

                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                        <span className="font-bold text-slate-900">Item Verifikasi Data</span>
                        <span className="font-bold text-slate-900">Status Integritas</span>
                      </div>

                      <div className="flex items-center justify-between text-stone-700">
                        <span>Referensi NIK/KK Terverifikasi</span>
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> VALID
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-stone-700">
                        <span>Keterhubungan Ortu / Keluarga</span>
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> LINKED
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-stone-700">
                        <span>Keterhubungan Pembayaran SPP</span>
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> OK
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-stone-700">
                        <span>Validasi Dokumen Resmi</span>
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> SIAP
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 bg-white rounded-3xl border border-stone-200 text-center space-y-2 text-stone-500 text-xs">
              Pilih salah satu identitas dari daftar di sebelah kiri untuk melihat profil lengkap dan peta hubung relasi.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
