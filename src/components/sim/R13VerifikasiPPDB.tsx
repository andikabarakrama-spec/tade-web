import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PPDBRecord, Student, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { SIMSkeletonLoader } from './SIMSkeletonLoader';
import {
  UserCheck,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Calendar,
  School,
  FileText,
  ShieldCheck,
  Check,
  Building,
  X,
  AlertTriangle,
  Info,
  ChevronRight,
  Filter,
  Shield,
  Lock
} from 'lucide-react';

const CANONICAL_ROLES: readonly UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KETUA_YAYASAN',
  'KEPALA_SEKOLAH',
  'GURU',
  'KEUANGAN',
  'WALI_MURID',
  'CALON_WALI_MURID',
  'ALUMNI_FAMILY'
] as const;

// R13 Authority Contract: Only PPDB Committee may access verification workspace
const PPDB_DECISION_ROLES: readonly UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH'
] as const;

interface MandatoryDocItem {
  id: string;
  name: string;
  required: boolean;
}

const MANDATORY_DOCS: MandatoryDocItem[] = [
  { id: 'doc-kk', name: 'Kartu Keluarga (KK)', required: true },
  { id: 'doc-akta', name: 'Akta Kelahiran Calon Siswa', required: true },
  { id: 'doc-foto', name: 'Pas Foto Siswa (3x4)', required: true },
  { id: 'doc-kms', name: 'Buku KIA / Riwayat KMS / Imunisasi', required: true },
  { id: 'doc-surat', name: 'Surat Pernyataan Komitmen Wali', required: true }
];

export const R13VerifikasiPPDB: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();

  // 1. CANONICAL ROLE & RBAC RESOLUTION (FAIL-CLOSED)
  // Authoritative role: activeRole must match canonical roles list.
  // Zero fallback to userProfile.role. Zero privileged defaults.
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Operational Authority: Strictly restricted to PPDB Committee (SUPER_ADMIN, ADMIN, KEPALA_SEKOLAH)
  const isAuthorizedR13 = useMemo<boolean>(() => {
    return Boolean(
      currentUser?.uid &&
      verifiedActiveRole &&
      PPDB_DECISION_ROLES.includes(verifiedActiveRole)
    );
  }, [currentUser?.uid, verifiedActiveRole]);

  const canApprove = isAuthorizedR13;

  // Authentic Identity Resolution: strictly use authenticated session without synthetic fallbacks
  const actorName = useMemo<string | null>(() => {
    if (!currentUser?.uid) return null;
    const cleanProfileName = (userProfile?.nama || userProfile?.name)?.trim();
    if (cleanProfileName) return cleanProfileName;
    const cleanDisplayName = currentUser?.displayName?.trim();
    if (cleanDisplayName) return cleanDisplayName;
    const cleanEmail = currentUser?.email?.trim();
    if (cleanEmail) return cleanEmail;
    return `User (${currentUser.uid.slice(0, 8)})`;
  }, [currentUser?.uid, userProfile?.nama, userProfile?.name, currentUser?.displayName, currentUser?.email]);

  const [ppdbList, setPpdbList] = useState<PPDBRecord[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<PPDBRecord | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterWave, setFilterWave] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'SMART_PPDB' | 'CLASSIC'>('SMART_PPDB');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; message: string } | null>(null);

  // Anti double-submit state locks
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processingDocId, setProcessingDocId] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);

  // Conversion Modal State
  const [convertRecord, setConvertRecord] = useState<PPDBRecord | null>(null);
  const [convertTargetClass, setConvertTargetClass] = useState<'Kelompok A1' | 'Kelompok A2' | 'Kelompok B1' | 'Kelompok B2' | 'PAUD TPA'>('Kelompok A1');

  // 2. PRE-QUERY AUTHORIZATION GATE & DATA ISOLATION
  // Under zero circumstances may unauthorized roles (e.g. CALON_WALI_MURID, WALI_MURID, GURU)
  // query or load global prospective student records, NIK, or family data into state.
  const loadData = useCallback(async () => {
    if (!currentUser?.uid || !verifiedActiveRole || !isAuthorizedR13) {
      setIsLoading(false);
      setPpdbList([]);
      setStudentsList([]);
      setSelectedRecord(null);
      return;
    }

    setIsLoading(true);
    try {
      const [ppdbs, students] = await Promise.all([
        DataService.getPPDBRecords(),
        DataService.getStudents()
      ]);
      setPpdbList(ppdbs || []);
      setStudentsList(students || []);

      // Keep selection in sync
      if (ppdbs && ppdbs.length > 0) {
        setSelectedRecord(prev => {
          if (!prev) return ppdbs[0];
          const exists = ppdbs.find(p => p.id === prev.id);
          return exists || ppdbs[0];
        });
      } else {
        setSelectedRecord(null);
      }
    } catch (err: any) {
      console.error('Failed to load PPDB records:', err);
      setFeedback({
        type: 'error',
        message: `Gagal memuat data pendaftar PPDB: ${err?.message || 'Gangguan koneksi database.'}`
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.uid, verifiedActiveRole, isAuthorizedR13]);

  useEffect(() => {
    if (currentUser?.uid && verifiedActiveRole && isAuthorizedR13) {
      loadData();
    } else {
      setIsLoading(false);
      setPpdbList([]);
      setStudentsList([]);
      setSelectedRecord(null);
    }
  }, [currentUser?.uid, verifiedActiveRole, isAuthorizedR13, loadData]);

  const findExistingStudent = (record: PPDBRecord): Student | undefined => {
    return studentsList.find(s => {
      const matchId = s.id === `std_${record.id}` || (record.nik && s.id === `std_${record.nik}`);
      const matchNik = Boolean(record.nik && s.nisn && s.nisn.trim() === record.nik.trim());
      const matchNameBirth = Boolean(
        s.name.trim().toLowerCase() === record.studentName.trim().toLowerCase() &&
        s.birthDate === record.birthDate
      );
      const matchNis = Boolean(s.nis && s.nis === record.registrationNo);
      return matchId || matchNik || matchNameBirth || matchNis;
    });
  };

  // Helper to parse verified document IDs from record notes
  const getVerifiedDocs = (record: PPDBRecord): string[] => {
    if (!record.notes) return [];
    try {
      const match = record.notes.match(/\[DOCS_VERIFIED:([^\]]+)\]/);
      if (match && match[1]) {
        return match[1].split(',').filter(Boolean);
      }
    } catch {
      // ignore parsing error
    }
    return [];
  };

  // 3. MUTATION AUTHORIZATION & ANTI-DOUBLE-SUBMIT: TOGGLE DOC VERIFICATION
  const handleToggleDocCheck = async (record: PPDBRecord, docId: string) => {
    if (!currentUser?.uid || !verifiedActiveRole || !isAuthorizedR13 || !actorName) {
      setFeedback({
        type: 'error',
        message: 'Akses ditolak: Hanya Panitia PPDB (Super Admin, Admin, dan Kepala Sekolah) yang berhak memverifikasi berkas.'
      });
      return;
    }

    const docLockKey = `${record.id}_${docId}`;
    if (processingDocId === docLockKey || processingId === record.id) return;
    setProcessingDocId(docLockKey);

    try {
      const currentDocs = getVerifiedDocs(record);
      const isAlreadyChecked = currentDocs.includes(docId);
      const nextDocs = isAlreadyChecked
        ? currentDocs.filter(d => d !== docId)
        : [...currentDocs, docId];

      const cleanNotes = (record.notes || '').replace(/\[DOCS_VERIFIED:[^\]]+\]/g, '').trim();
      const updatedNotes = nextDocs.length > 0
        ? `${cleanNotes} [DOCS_VERIFIED:${nextDocs.join(',')}]`.trim()
        : cleanNotes;

      const updatedRecord: PPDBRecord = {
        ...record,
        notes: updatedNotes
      };

      await DataService.savePPDBRecord(updatedRecord);

      // Canonical audit log with authentic session actor
      const docObj = MANDATORY_DOCS.find(d => d.id === docId);
      await DataService.createAuditLog({
        uid: currentUser.uid,
        userName: actorName,
        role: verifiedActiveRole,
        action: 'VERIFY_PPDB_DOCUMENT',
        targetModule: `Verifikasi PPDB - Dokumen [${docObj?.name || docId}] ${isAlreadyChecked ? 'dibatalkan' : 'disetujui'} untuk calon siswa: ${record.registrationNo} - ${record.studentName}`
      }).catch((auditErr) => {
        console.warn('Non-blocking audit log failure:', auditErr);
      });

      setPpdbList(prev => prev.map(p => p.id === record.id ? updatedRecord : p));
      if (selectedRecord?.id === record.id) {
        setSelectedRecord(updatedRecord);
      }

      setFeedback({
        type: 'info',
        message: `Status berkas ${docObj?.name || docId} berhasil diperbarui.`
      });
    } catch (err: any) {
      console.error('Error toggling document verification:', err);
      setFeedback({
        type: 'error',
        message: `Gagal memperbarui verifikasi berkas: ${err?.message || 'Terjadi kesalahan sistem.'}`
      });
    } finally {
      setProcessingDocId(null);
    }
  };

  // 4. MUTATION AUTHORIZATION & ANTI-DOUBLE-SUBMIT: STATUS DECISION CHANGE
  const handleStatusChange = async (record: PPDBRecord, newStatus: 'Diterima' | 'Ditolak' | 'Verifikasi') => {
    if (!currentUser?.uid || !verifiedActiveRole || !isAuthorizedR13 || !actorName) {
      setFeedback({
        type: 'error',
        message: 'Akses ditolak: Hanya Panitia PPDB (Super Admin, Admin, dan Kepala Sekolah) yang berhak memutuskan status pendaftaran.'
      });
      return;
    }

    if (processingId) return;
    setProcessingId(record.id);

    const reqId = `REQ_PPDB_${record.id}`;

    try {
      if (newStatus === 'Diterima') {
        await DataService.approveRequest(reqId, currentUser.uid, actorName, verifiedActiveRole);
        const updated: PPDBRecord = { ...record, status: 'Diterima' };
        await DataService.savePPDBRecord(updated);

        await DataService.createAuditLog({
          uid: currentUser.uid,
          userName: actorName,
          role: verifiedActiveRole,
          action: 'APPROVE_PPDB_CANDIDATE',
          targetModule: `Verifikasi PPDB - Persetujuan Calon Siswa: ${record.registrationNo} - ${record.studentName} [Pilihan: ${record.groupChoice}, ${record.wave}] disetujui (Diterima)`
        }).catch((auditErr) => {
          console.warn('Non-blocking audit log failure:', auditErr);
        });

        setFeedback({
          type: 'success',
          message: `Alhamdulillah! Calon siswa ${record.studentName} (${record.registrationNo}) telah disetujui (Diterima).`
        });
      } else if (newStatus === 'Ditolak') {
        await DataService.rejectRequest(reqId, currentUser.uid, actorName, verifiedActiveRole, 'Ditolak dari Verifikasi PPDB');
        const updated: PPDBRecord = { ...record, status: 'Ditolak' };
        await DataService.savePPDBRecord(updated);

        await DataService.createAuditLog({
          uid: currentUser.uid,
          userName: actorName,
          role: verifiedActiveRole,
          action: 'REJECT_PPDB_CANDIDATE',
          targetModule: `Verifikasi PPDB - Penolakan Calon Siswa: ${record.registrationNo} - ${record.studentName} [Status: Ditolak]`
        }).catch((auditErr) => {
          console.warn('Non-blocking audit log failure:', auditErr);
        });

        setFeedback({
          type: 'info',
          message: `Calon siswa ${record.studentName} (${record.registrationNo}) telah ditandai Ditolak.`
        });
      } else {
        const updated: PPDBRecord = { ...record, status: 'Verifikasi' };
        await DataService.savePPDBRecord(updated);

        await DataService.createAuditLog({
          uid: currentUser.uid,
          userName: actorName,
          role: verifiedActiveRole,
          action: 'SET_PPDB_IN_VERIFICATION',
          targetModule: `Verifikasi PPDB - Pembaruan status berkas Calon Siswa: ${record.registrationNo} - ${record.studentName} [Status: Verifikasi]`
        }).catch((auditErr) => {
          console.warn('Non-blocking audit log failure:', auditErr);
        });

        setFeedback({
          type: 'info',
          message: `Status berkas ${record.studentName} diperbarui menjadi Verifikasi.`
        });
      }

      await loadData();
    } catch (err: any) {
      console.error('Error changing PPDB status:', err);
      setFeedback({
        type: 'error',
        message: `Gagal memperbarui status pendaftar: ${err?.message || 'Terjadi gangguan jaringan database.'}`
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openConversionModal = (record: PPDBRecord) => {
    if (!currentUser?.uid || !verifiedActiveRole || !isAuthorizedR13 || !actorName) {
      setFeedback({
        type: 'error',
        message: 'Akses ditolak: Anda tidak memiliki wewenang untuk konversi siswa ke Master Data.'
      });
      return;
    }
    const existing = findExistingStudent(record);
    if (existing) {
      setFeedback({
        type: 'error',
        message: `Calon siswa ${record.studentName} (${record.registrationNo}) sudah terdaftar sebagai siswa aktif di Master Siswa (NIS: ${existing.nis}).`
      });
      return;
    }

    let defaultClass: 'Kelompok A1' | 'Kelompok A2' | 'Kelompok B1' | 'Kelompok B2' | 'PAUD TPA' = 'Kelompok A1';
    if (record.groupChoice === 'Kelompok A') defaultClass = 'Kelompok A1';
    else if (record.groupChoice === 'Kelompok B') defaultClass = 'Kelompok B1';
    else if (record.groupChoice === 'PAUD/TPA') defaultClass = 'PAUD TPA';

    setConvertTargetClass(defaultClass);
    setConvertRecord(record);
  };

  // 5. MUTATION AUTHORIZATION & DETERMINISTIC RECORD IDENTITY: EXECUTE CONVERSION
  const handleExecuteConversion = async () => {
    if (!currentUser?.uid || !verifiedActiveRole || !isAuthorizedR13 || !actorName) {
      setFeedback({
        type: 'error',
        message: 'Akses ditolak: Anda tidak memiliki wewenang untuk konversi siswa ke Master Data.'
      });
      return;
    }

    if (!convertRecord) return;
    if (isConverting) return;

    setIsConverting(true);

    try {
      const currentStudents = await DataService.getStudents();
      const existing = currentStudents.find(s => {
        const matchId = s.id === `std_${convertRecord.id}` || (convertRecord.nik && s.id === `std_${convertRecord.nik}`);
        const matchNik = Boolean(convertRecord.nik && s.nisn && s.nisn.trim() === convertRecord.nik.trim());
        const matchNameBirth = Boolean(
          s.name.trim().toLowerCase() === convertRecord.studentName.trim().toLowerCase() &&
          s.birthDate === convertRecord.birthDate
        );
        return matchId || matchNik || matchNameBirth;
      });

      if (existing) {
        setConvertRecord(null);
        setFeedback({
          type: 'error',
          message: `Calon siswa ini sudah terdaftar sebagai siswa aktif (NIS: ${existing.nis}).`
        });
        return;
      }

      const currentYear = new Date().getFullYear();
      const nextSeq = String(currentStudents.length + 1).padStart(3, '0');
      const generatedNis = `${currentYear}${nextSeq}`;

      // Deterministic record identity: derived directly from canonical PPDB record ID (no synthetic Date.now() / Math.random())
      const sanitizedRegNo = convertRecord.registrationNo.replace(/[^a-zA-Z0-9]/g, '_');
      const studentId = `std_${convertRecord.id || sanitizedRegNo}`;

      const newStudent: Student = {
        id: studentId,
        nis: generatedNis,
        nisn: convertRecord.nik || '',
        name: convertRecord.studentName,
        namaLengkap: convertRecord.studentName,
        nickname: convertRecord.nickname || convertRecord.studentName.split(' ')[0] || 'Siswa',
        gender: convertRecord.gender === 'Perempuan' ? 'P' : 'L',
        classGroup: convertTargetClass,
        kelompok: convertTargetClass,
        birthDate: convertRecord.birthDate,
        parentName: convertRecord.fatherName || convertRecord.motherName || 'Wali Siswa',
        namaAyah: convertRecord.fatherName || '',
        namaOrangTua: convertRecord.fatherName || convertRecord.motherName || '',
        parentPhone: convertRecord.phone || '',
        parentEmail: '',
        address: convertRecord.address || '',
        status: 'Aktif',
        joinedYear: currentYear
      };

      // 1. Save to Master Siswa
      await DataService.saveStudent(newStudent);

      // 2. Mark PPDB Record as Diterima
      const updatedPPDB: PPDBRecord = { ...convertRecord, status: 'Diterima' };
      await DataService.savePPDBRecord(updatedPPDB);

      // 3. Central Approval Sync
      try {
        await DataService.approveRequest(`REQ_PPDB_${convertRecord.id}`, currentUser.uid, actorName, verifiedActiveRole);
      } catch (apprErr) {
        console.warn('[Approval Request Sync Warning]:', apprErr);
      }

      // 4. Canonical Audit Log with authentic session actor
      await DataService.createAuditLog({
        uid: currentUser.uid,
        userName: actorName,
        role: verifiedActiveRole,
        action: 'CONVERT_PPDB_TO_STUDENT',
        targetModule: `Verifikasi PPDB - Konversi Siswa ke Master Data: ${newStudent.name} (NIS: ${newStudent.nis}) dialokasikan ke ${newStudent.classGroup} [No. Reg: ${convertRecord.registrationNo}]`
      }).catch((auditErr) => {
        console.warn('Non-blocking audit log failure:', auditErr);
      });

      await loadData();
      setConvertRecord(null);
      setFeedback({
        type: 'success',
        message: `Alhamdulillah! ${newStudent.name} telah berhasil dikonversi ke Master Siswa dengan NIS ${newStudent.nis} di ${newStudent.classGroup}.`
      });
    } catch (err: any) {
      console.error('Conversion error:', err);
      setFeedback({
        type: 'error',
        message: `Terjadi kesalahan saat memproses konversi ke Master Siswa: ${err?.message || 'Periksa koneksi database.'}`
      });
    } finally {
      setIsConverting(false);
    }
  };

  // Wave stats calculated dynamically from loaded data
  const waveStats = [
    {
      id: 'WAVE-1',
      name: 'Gelombang 1 (Early Bird)',
      waveKey: 'Gelombang 1',
      period: '1 Jan 2026 - 31 Mar 2026',
      quotaTotal: 30,
      quotaFilled: ppdbList.filter(p => p.wave === 'Gelombang 1').length,
      status: 'CLOSED' as const,
      benefit: 'Bebas Biaya Formulir & Potongan Seragam'
    },
    {
      id: 'WAVE-2',
      name: 'Gelombang 2 (Reguler)',
      waveKey: 'Gelombang 2',
      period: '1 Apr 2026 - 30 Jun 2026',
      quotaTotal: 40,
      quotaFilled: ppdbList.filter(p => p.wave === 'Gelombang 2').length,
      status: 'OPEN' as const,
      benefit: 'Paket Perlengkapan Sentra Islami Lengkap'
    },
    {
      id: 'WAVE-3',
      name: 'Gelombang 3 (Susulan)',
      waveKey: 'Gelombang 3',
      period: '1 Jul 2026 - 15 Agu 2026',
      quotaTotal: 15,
      quotaFilled: ppdbList.filter(p => p.wave === 'Gelombang 3').length,
      status: 'OPEN' as const,
      benefit: 'Alokasi Terbatas Kursi Sentra'
    }
  ];

  const filtered = useMemo(() => {
    return ppdbList.filter(p => {
      const matchSearch =
        p.studentName.toLowerCase().includes(search.toLowerCase()) ||
        p.registrationNo.toLowerCase().includes(search.toLowerCase()) ||
        (p.fatherName && p.fatherName.toLowerCase().includes(search.toLowerCase())) ||
        (p.motherName && p.motherName.toLowerCase().includes(search.toLowerCase())) ||
        (p.nik && p.nik.toLowerCase().includes(search.toLowerCase()));

      const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
      const matchWave = filterWave === 'ALL' || p.wave === filterWave;

      return matchSearch && matchStatus && matchWave;
    });
  }, [ppdbList, search, filterStatus, filterWave]);

  if (isLoading && ppdbList.length === 0) {
    return (
      <div className="space-y-6">
        <SIMSkeletonLoader type="dashboard" />
      </div>
    );
  }

  // 6. FAIL-CLOSED ACCESS DENIED CONTAINER & STATE/DOM ISOLATION
  // Under zero circumstances are applicant cards, NIK, phone numbers, or tables rendered to unauthorized roles.
  if (!currentUser?.uid || !verifiedActiveRole || !isAuthorizedR13) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6" id="r13-access-denied-container">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto shadow-xs">
            <Shield className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full inline-block">
              Akses Dibatasi — Verifikasi & Administrasi PPDB
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Otoritas Tidak Memadai
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Modul <strong>R13 (Verifikasi & Administrasi PPDB)</strong> memuat data sensitif identitas calon siswa (NIK), kontak orang tua, dan berkas fisik pendaftaran. Akses verifikasi dibatasi secara ketat hanya untuk Panitia PPDB (Super Admin, Admin SIM, dan Kepala Sekolah).
            </p>
          </div>
          <div className="pt-2 text-[11px] text-stone-500 bg-stone-50 py-2.5 px-4 rounded-xl border border-stone-200 max-w-sm mx-auto flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-stone-400" />
            <span>Peran Sesi Anda: <strong>{verifiedActiveRole || 'Tidak Terautentikasi'}</strong></span>
          </div>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              SEC-R13-FAILCLOSED-COMMITTEE-ONLY
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="r13-verifikasi-ppdb-page">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-stone-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <UserCheck className="w-3.5 h-3.5" /> Module R13 • Smart PPDB Pipeline
              </span>
              <span className="text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full">
                TK ASY SYIFA TANGGUL
              </span>
              <span className="text-xs font-semibold text-stone-400">
                Operator: <strong className="text-stone-200">{actorName}</strong> ({verifiedActiveRole})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Verifikasi & Seleksi Calon Siswa PPDB
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Verifikasi berkas persyaratan, persetujuan bertingkat (Admin, Keuangan, Kepsek), dan konversi calon siswa diterima ke Master Data Siswa resmi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 bg-stone-800/90 p-1.5 rounded-2xl border border-stone-700">
              <button
                type="button"
                onClick={() => setViewMode('SMART_PPDB')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'SMART_PPDB'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart PPDB (Dossier & Kuota)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('CLASSIC')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'CLASSIC'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Tabel Klasik</span>
              </button>
            </div>

            <button
              type="button"
              onClick={loadData}
              disabled={isLoading || processingId !== null || isConverting || processingDocId !== null}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-2xl border border-stone-700 text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh Data Pendaftar"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Global In-App Feedback Banner (Zero Native Dialogs) */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : feedback.type === 'error'
                ? 'bg-red-50 border-red-300 text-red-950'
                : feedback.type === 'warning'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-blue-50 border-blue-300 text-blue-950'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
              {feedback.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />}
              {feedback.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />}
              {feedback.type === 'info' && <Info className="w-4 h-4 text-blue-700 shrink-0" />}
              <span>{feedback.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="p-1 rounded-lg hover:bg-black/5 cursor-pointer text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wave Quota Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {waveStats.map(wave => {
          const percentage = Math.min(100, Math.round((wave.quotaFilled / wave.quotaTotal) * 100));
          return (
            <div
              key={wave.id}
              className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{wave.name}</span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    wave.status === 'OPEN'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {wave.status}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500">Kuota Terisi:</span>
                  <span className="font-extrabold text-slate-900">{wave.quotaFilled} / {wave.quotaTotal} Siswa</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentage >= 100
                        ? 'bg-rose-500'
                        : percentage >= 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-stone-500 line-clamp-1">
                {wave.benefit}
              </p>
            </div>
          );
        })}
      </div>

      {viewMode === 'SMART_PPDB' ? (
        /* SMART PPDB DOSSIER VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: List of Candidates */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm">Daftar Berkas Calon Siswa</h3>
                <span className="text-xs text-stone-500 font-semibold">{filtered.length} Pendaftar</span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Cari nama, no reg, wali..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Status Filter Chips */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {['ALL', 'Menunggu', 'Verifikasi', 'Diterima', 'Ditolak'].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      filterStatus === st
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st === 'ALL' ? 'Semua' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Candidate List */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filtered.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-2">
                  <AlertCircle className="w-8 h-8 text-stone-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Tidak ada calon siswa ditemukan</p>
                  <p className="text-[11px] text-stone-500">Coba sesuaikan kata kunci pencarian atau filter status.</p>
                </div>
              ) : (
                filtered.map(p => {
                  const enrolled = findExistingStudent(p);
                  const isSelected = selectedRecord?.id === p.id;
                  const verifiedDocs = getVerifiedDocs(p);

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedRecord(p)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
                          : 'bg-stone-50/50 hover:bg-stone-100/70 border-stone-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-extrabold text-xs text-slate-900 block">{p.studentName}</span>
                          <span className="text-[10px] font-mono text-emerald-800 font-bold">{p.registrationNo}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] shrink-0 ${
                            p.status === 'Diterima'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'Verifikasi'
                              ? 'bg-amber-100 text-amber-800'
                              : p.status === 'Ditolak'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/60">
                        <span>{p.groupChoice} • {p.wave}</span>
                        {enrolled ? (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            NIS: {enrolled.nis}
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400">
                            Berkas: {verifiedDocs.length}/{MANDATORY_DOCS.length}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Dossier Detail */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            {selectedRecord ? (
              <div className="space-y-6">
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {selectedRecord.registrationNo}
                      </span>
                      <span className="text-xs text-stone-400 font-semibold">{selectedRecord.wave}</span>
                    </div>
                    <h2 className="text-xl font-black text-slate-900">{selectedRecord.studentName}</h2>
                    <p className="text-xs text-stone-500">
                      Pilihan Program: <strong className="text-slate-800">{selectedRecord.groupChoice}</strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full font-black text-xs ${
                        selectedRecord.status === 'Diterima'
                          ? 'bg-emerald-600 text-white'
                          : selectedRecord.status === 'Verifikasi'
                          ? 'bg-amber-500 text-white'
                          : selectedRecord.status === 'Ditolak'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-600 text-white'
                      }`}
                    >
                      Status: {selectedRecord.status}
                    </span>
                  </div>
                </div>

                {/* Candidate Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <h4 className="font-bold text-slate-900 border-b border-stone-200 pb-1">Biodata Calon Siswa</h4>
                    <div className="space-y-1 text-stone-600">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Nama Lengkap:</span>
                        <span className="font-bold text-slate-800">{selectedRecord.studentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Panggilan:</span>
                        <span>{selectedRecord.nickname || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Jenis Kelamin:</span>
                        <span>{selectedRecord.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">TTL:</span>
                        <span>{selectedRecord.birthPlace || 'Tanggul'}, {selectedRecord.birthDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">NIK:</span>
                        <span className="font-mono">{selectedRecord.nik || '-'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <h4 className="font-bold text-slate-900 border-b border-stone-200 pb-1">Data Orang Tua / Kontak</h4>
                    <div className="space-y-1 text-stone-600">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Nama Ayah:</span>
                        <span className="font-semibold text-slate-800">{selectedRecord.fatherName || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Pekerjaan Ayah:</span>
                        <span>{selectedRecord.fatherJob || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Nama Ibu:</span>
                        <span className="font-semibold text-slate-800">{selectedRecord.motherName || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Telepon / WA:</span>
                        <span className="font-mono">{selectedRecord.phone || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Alamat:</span>
                        <span className="text-right truncate max-w-[150px]">{selectedRecord.address || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mandatory Document Verification Checklist */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      Verifikasi Berkas Fisik & Persyaratan
                    </h4>
                    <span className="text-[11px] text-stone-500 font-semibold">
                      {getVerifiedDocs(selectedRecord).length} dari {MANDATORY_DOCS.length} Terverifikasi
                    </span>
                  </div>

                  <div className="space-y-2">
                    {MANDATORY_DOCS.map(doc => {
                      const isVerified = getVerifiedDocs(selectedRecord).includes(doc.id);
                      const isDocProcessing = processingDocId === `${selectedRecord.id}_${doc.id}`;
                      return (
                        <div
                          key={doc.id}
                          className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                            isVerified
                              ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                              : 'bg-stone-50 border-stone-200 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                                isVerified ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-500'
                              }`}
                            >
                              {isVerified ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <span className="font-bold text-xs block">{doc.name}</span>
                              <span className="text-[10px] text-stone-500">
                                {doc.required ? 'Dokumen Wajib' : 'Dokumen Tambahan'}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleDocCheck(selectedRecord, doc.id)}
                            disabled={!canApprove || isDocProcessing || processingId === selectedRecord.id}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition flex items-center gap-1 ${
                              isVerified
                                ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                                : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                            } disabled:opacity-50`}
                          >
                            {isDocProcessing && <RefreshCw className="w-3 h-3 animate-spin" />}
                            <span>{isVerified ? 'Terverifikasi' : 'Tandai Sah'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Master Siswa Status & Action Controls */}
                <div className="pt-4 border-t border-stone-200 space-y-4">
                  {(() => {
                    const enrolled = findExistingStudent(selectedRecord);
                    return enrolled ? (
                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <School className="w-6 h-6 text-blue-700 shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-blue-950 block">
                              Sudah Terdaftar di Master Data Siswa
                            </span>
                            <span className="text-[11px] text-blue-800">
                              NIS: <strong>{enrolled.nis}</strong> • Kelompok: <strong>{enrolled.classGroup}</strong>
                            </span>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-blue-700 text-white font-bold text-xs">
                          Aktif
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-stone-500">
                          Status Master Siswa: <span className="italic text-stone-400">Belum Dikonversi</span>
                        </div>

                        {selectedRecord.status === 'Diterima' && (
                          <button
                            type="button"
                            onClick={() => openConversionModal(selectedRecord)}
                            disabled={!canApprove || isConverting}
                            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer transition"
                          >
                            <UserPlus className="w-4 h-4" />
                            <span>Konversi ke Master Siswa</span>
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {/* Decision Action Buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                    {selectedRecord.status !== 'Diterima' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(selectedRecord, 'Diterima')}
                        disabled={!canApprove || processingId === selectedRecord.id}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        {processingId === selectedRecord.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        <span>Setujui (Diterima)</span>
                      </button>
                    )}

                    {selectedRecord.status !== 'Verifikasi' && selectedRecord.status !== 'Diterima' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(selectedRecord, 'Verifikasi')}
                        disabled={!canApprove || processingId === selectedRecord.id}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        {processingId === selectedRecord.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>Tandai Verifikasi</span>
                      </button>
                    )}

                    {selectedRecord.status !== 'Ditolak' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(selectedRecord, 'Ditolak')}
                        disabled={!canApprove || processingId === selectedRecord.id}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        {processingId === selectedRecord.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        <span>Tolak Pendaftaran</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-stone-400 space-y-2">
                <FileText className="w-10 h-10 mx-auto text-stone-300" />
                <h4 className="text-sm font-bold text-stone-600">Pilih berkas calon siswa untuk melihat dossier</h4>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* CLASSIC TABLE VIEW */
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari no registrasi / nama / orang tua..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-semibold">Total {filtered.length} Pendaftar</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 uppercase font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3">No. Reg</th>
                  <th className="p-3">Nama Calon Siswa</th>
                  <th className="p-3">Pilihan</th>
                  <th className="p-3">Gelombang</th>
                  <th className="p-3">Orang Tua / HP</th>
                  <th className="p-3">Status Verifikasi</th>
                  <th className="p-3">Status Master Siswa</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-stone-400">
                      Tidak ada data calon siswa yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filtered.map(p => {
                    const enrolled = findExistingStudent(p);
                    const isRecordProcessing = processingId === p.id;

                    return (
                      <tr key={p.id} className="hover:bg-stone-50 transition">
                        <td className="p-3 font-mono font-bold text-emerald-800">{p.registrationNo}</td>
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">{p.studentName}</span>
                          <span className="text-[10px] text-stone-400 font-mono">NIK: {p.nik || '-'}</span>
                        </td>
                        <td className="p-3 text-stone-600">{p.groupChoice}</td>
                        <td className="p-3 font-semibold text-stone-700">{p.wave}</td>
                        <td className="p-3 text-stone-600">
                          <div>{p.fatherName || p.motherName || 'Wali'}</div>
                          <div className="text-[10px] text-stone-400">{p.phone}</div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-1 rounded-md font-bold text-white text-[10px] ${
                              p.status === 'Diterima'
                                ? 'bg-emerald-600'
                                : p.status === 'Verifikasi'
                                ? 'bg-amber-500'
                                : p.status === 'Ditolak'
                                ? 'bg-rose-600'
                                : 'bg-slate-500'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {enrolled ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                              <School className="w-3 h-3" />
                              NIS: {enrolled.nis}
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400 italic">Belum Konversi</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {p.status !== 'Diterima' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(p, 'Diterima')}
                                disabled={!canApprove || isRecordProcessing}
                                className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 disabled:opacity-50 font-bold text-[11px] transition cursor-pointer"
                              >
                                {isRecordProcessing ? '...' : 'Terima'}
                              </button>
                            )}

                            {p.status !== 'Verifikasi' && p.status !== 'Diterima' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(p, 'Verifikasi')}
                                disabled={!canApprove || isRecordProcessing}
                                className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 disabled:opacity-50 font-bold text-[11px] transition cursor-pointer"
                              >
                                {isRecordProcessing ? '...' : 'Verifikasi'}
                              </button>
                            )}

                            {p.status !== 'Ditolak' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(p, 'Ditolak')}
                                disabled={!canApprove || isRecordProcessing}
                                className="px-2 py-1 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200 disabled:opacity-50 font-bold text-[11px] transition cursor-pointer"
                              >
                                {isRecordProcessing ? '...' : 'Tolak'}
                              </button>
                            )}

                            {!enrolled && (
                              <button
                                type="button"
                                onClick={() => openConversionModal(p)}
                                disabled={!canApprove || isConverting}
                                className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50 font-bold text-[11px] flex items-center gap-1 transition shadow-xs cursor-pointer"
                                title="Konversi ke Master Data Siswa"
                              >
                                <UserPlus className="w-3 h-3" />
                                <span>Konversi</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONVERSION MODAL */}
      <AnimatePresence>
        {convertRecord && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-stone-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Konversi ke Master Siswa</h3>
                  <p className="text-xs text-stone-500">
                    Daftarkan siswa baru ke Master Data Siswa resmi TK ASY SYIFA.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Nama Calon:</span>
                  <span className="font-bold text-slate-900">{convertRecord.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">No. Registrasi:</span>
                  <span className="font-mono font-bold text-emerald-800">{convertRecord.registrationNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">NIK:</span>
                  <span className="font-mono">{convertRecord.nik || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Pilihan Awal:</span>
                  <span className="font-semibold">{convertRecord.groupChoice}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">
                  Pilih Alokasi Kelas / Sentra:
                </label>
                <select
                  value={convertTargetClass}
                  onChange={e => setConvertTargetClass(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="Kelompok A1">Kelompok A1</option>
                  <option value="Kelompok A2">Kelompok A2</option>
                  <option value="Kelompok B1">Kelompok B1</option>
                  <option value="Kelompok B2">Kelompok B2</option>
                  <option value="PAUD TPA">PAUD TPA</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConvertRecord(null)}
                  disabled={isConverting}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteConversion}
                  disabled={isConverting}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isConverting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan ke Master Siswa...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Simpan Siswa</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
