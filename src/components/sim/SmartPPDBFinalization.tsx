import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  UserCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  AlertCircle,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  Send,
  Filter,
  Check,
  Printer,
  Eye,
  RefreshCw,
  UserPlus,
  ArrowRight,
  School,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle,
  Lock
} from 'lucide-react';
import { PPDBRecord, Student, UserRole } from '../../types';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

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

const CANONICAL_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KETUA_YAYASAN',
  'KEPALA_SEKOLAH',
  'GURU',
  'KEUANGAN',
  'WALI_MURID',
  'CALON_WALI_MURID',
  'ALUMNI_FAMILY'
];

const PPDB_AUTHORIZED_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH',
  'KEUANGAN'
];

const PPDB_APPROVAL_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH'
];

const PPDB_FINANCE_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH',
  'KEUANGAN'
];

export const SmartPPDBFinalization: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();
  const [ppdbList, setPpdbList] = useState<PPDBRecord[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<PPDBRecord | null>(null);
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState<string>('ALL');
  const [filterWave, setFilterWave] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // In-flight Re-entry / Anti-Double-Submit Protection Locks
  const [approvingLevel, setApprovingLevel] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [togglingDocKey, setTogglingDocKey] = useState<string | null>(null);

  // Conversion Modal State
  const [showConvertModal, setShowConvertModal] = useState<boolean>(false);
  const [selectedClassGroup, setSelectedClassGroup] = useState<'Kelompok A1' | 'Kelompok A2' | 'Kelompok B1' | 'Kelompok B2' | 'PAUD TPA'>('Kelompok A1');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [conversionResult, setConversionResult] = useState<{ student: Student; record: PPDBRecord } | null>(null);

  // Document Checklist Local State per candidate ID
  const [docVerifications, setDocVerifications] = useState<Record<string, Record<string, { status: 'VERIFIED' | 'PENDING'; verifiedBy?: string; verifiedAt?: string }>>>(() => {
    try {
      const saved = localStorage.getItem('sim_ppdb_doc_checks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 1. Authoritative Fail-Closed Active Role Determination
  // Default Deny: If unauthenticated, missing role, or non-canonical role -> evaluates to null
  // Note: userProfile.role NEVER overrides activeRole
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // 2. Authentic Actor Identity Determination
  // Fail-closed: Must resolve from verified authenticated session credentials
  const actorName = useMemo<string | null>(() => {
    if (!currentUser?.uid) return null;
    return (
      userProfile?.nama?.trim() ||
      userProfile?.name?.trim() ||
      currentUser?.displayName?.trim() ||
      currentUser?.email?.trim() ||
      null
    );
  }, [userProfile?.nama, userProfile?.name, currentUser?.displayName, currentUser?.email, currentUser?.uid]);

  // 3. Authorization Boundaries
  const canAccessModule = useMemo<boolean>(() => {
    return Boolean(verifiedActiveRole && PPDB_AUTHORIZED_ROLES.includes(verifiedActiveRole));
  }, [verifiedActiveRole]);

  const canApprove = useMemo<boolean>(() => {
    return Boolean(verifiedActiveRole && PPDB_APPROVAL_ROLES.includes(verifiedActiveRole));
  }, [verifiedActiveRole]);

  const canValidateFinance = useMemo<boolean>(() => {
    return Boolean(verifiedActiveRole && PPDB_FINANCE_ROLES.includes(verifiedActiveRole));
  }, [verifiedActiveRole]);

  const loadData = useCallback(async () => {
    // HARD PRE-QUERY GATE: Deny sensitive PPDB records and Student master data query if unauthenticated or unauthorized
    if (!currentUser?.uid || !verifiedActiveRole || !canAccessModule) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [ppdbs, students] = await Promise.all([
        DataService.getPPDBRecords(),
        DataService.getStudents()
      ]);
      setPpdbList(ppdbs);
      setStudentsList(students);

      // Merge Firestore document checks with local storage
      const firestoreDocChecks: Record<string, Record<string, { status: 'VERIFIED' | 'PENDING'; verifiedBy?: string; verifiedAt?: string }>> = {};
      ppdbs.forEach(p => {
        if (p.notes && p.notes.includes('[DOC_CHECKS:')) {
          try {
            const match = p.notes.match(/\[DOC_CHECKS:([^\]]+)\]/);
            if (match && match[1]) {
              firestoreDocChecks[p.id] = JSON.parse(match[1]);
            }
          } catch {
            // ignore JSON parse error
          }
        }
      });

      setDocVerifications(prev => ({
        ...prev,
        ...firestoreDocChecks
      }));

      if (ppdbs.length > 0) {
        setSelectedRecord(prev => {
          if (!prev) return ppdbs[0];
          const exists = ppdbs.find(p => p.id === prev.id);
          return exists || ppdbs[0];
        });
      } else {
        setSelectedRecord(null);
      }
    } catch (err) {
      console.error('Failed to load PPDB records:', err);
      showFeedback('error', 'Gagal memuat data PPDB dari sistem.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.uid, verifiedActiveRole, canAccessModule]);

  useEffect(() => {
    if (canAccessModule) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [canAccessModule, loadData]);

  const showFeedback = (type: 'success' | 'error' | 'info', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  // Wave stats calculated dynamically from real data
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

  // Helper to check if a candidate is already enrolled in Master Siswa
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

  // Toggle document verification status and persist to DataService/Firestore
  const handleToggleDoc = async (candidateId: string, docId: string) => {
    // Fail-closed authorization check
    if (!currentUser?.uid || !actorName || !verifiedActiveRole || (!canApprove && !canValidateFinance)) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki wewenang untuk memverifikasi dokumen.');
      return;
    }

    const docLockKey = `${candidateId}_${docId}`;
    if (togglingDocKey === docLockKey) return;
    setTogglingDocKey(docLockKey);

    try {
      const currentCandidateDocs = docVerifications[candidateId] || {};
      const currentDoc = currentCandidateDocs[docId];
      const isCurrentlyVerified = currentDoc?.status === 'VERIFIED';
      const nextStatus: 'VERIFIED' | 'PENDING' = isCurrentlyVerified ? 'PENDING' : 'VERIFIED';

      const verifierName = actorName;
      const nowStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

      const updatedMap = {
        ...docVerifications,
        [candidateId]: {
          ...currentCandidateDocs,
          [docId]: {
            status: nextStatus,
            verifiedBy: nextStatus === 'VERIFIED' ? verifierName : undefined,
            verifiedAt: nextStatus === 'VERIFIED' ? nowStr : undefined
          }
        }
      };

      setDocVerifications(updatedMap);
      try {
        localStorage.setItem('sim_ppdb_doc_checks', JSON.stringify(updatedMap));
      } catch {
        // ignore
      }

      // Persist to PPDBRecord in Firestore via DataService
      const targetRecord = ppdbList.find(p => p.id === candidateId);
      if (targetRecord) {
        const baseNotes = (targetRecord.notes || '').replace(/\[DOC_CHECKS:[^\]]*\]/g, '').trim();
        const updatedNotes = `${baseNotes} [DOC_CHECKS:${JSON.stringify(updatedMap[candidateId])}]`.trim();
        const updatedRecord: PPDBRecord = {
          ...targetRecord,
          notes: updatedNotes
        };
        setPpdbList(prev => prev.map(p => p.id === candidateId ? updatedRecord : p));
        if (selectedRecord?.id === candidateId) {
          setSelectedRecord(updatedRecord);
        }
        try {
          await DataService.savePPDBRecord(updatedRecord);
        } catch (err) {
          console.error('Failed to persist document verification status to Firestore:', err);
        }
      }

      showFeedback('info', `Status berkas diperbarui: ${nextStatus === 'VERIFIED' ? 'Terverifikasi' : 'Pending'}`);
    } finally {
      setTogglingDocKey(null);
    }
  };

  // Multi-Level Approval Handlers
  const handleApproveLevel = async (level: 'ADMIN' | 'FINANCE' | 'PRINCIPAL') => {
    if (!selectedRecord) return;

    // Fail-closed authentic identity and session verification
    if (!currentUser?.uid || !actorName || !verifiedActiveRole) {
      showFeedback('error', 'Akses ditolak: Sesi autentikasi tidak valid atau identitas tidak terverifikasi.');
      return;
    }

    if (approvingLevel) return;
    setApprovingLevel(level);

    const uid = currentUser.uid;
    const name = actorName;
    const role = verifiedActiveRole;

    try {
      if (level === 'ADMIN') {
        if (!canApprove) {
          showFeedback('error', 'Akses ditolak: Hanya Staf Admin / Pimpinan yang berhak memverifikasi berkas.');
          return;
        }
        const updated: PPDBRecord = { ...selectedRecord, status: 'Verifikasi' };
        await DataService.savePPDBRecord(updated);
        showFeedback('success', `Verifikasi berkas administratif ${selectedRecord.studentName} berhasil dicatat.`);
      } else if (level === 'FINANCE') {
        if (!canValidateFinance) {
          showFeedback('error', 'Akses ditolak: Hanya bagian Keuangan / Pimpinan yang berhak memvalidasi pembayaran.');
          return;
        }
        const updated: PPDBRecord = { ...selectedRecord, isPaidFee: true };
        await DataService.savePPDBRecord(updated);
        showFeedback('success', `Validasi biaya pendaftaran & formulir ${selectedRecord.studentName} berhasil disahkan.`);
      } else if (level === 'PRINCIPAL') {
        if (!canApprove) {
          showFeedback('error', 'Akses ditolak: Hanya Kepala Sekolah / Super Admin yang berhak memberikan pengesahan akhir.');
          return;
        }
        const reqId = `REQ_PPDB_${selectedRecord.id}`;
        await DataService.approveRequest(reqId, uid, name, role);
        const updated: PPDBRecord = { ...selectedRecord, status: 'Diterima' };
        await DataService.savePPDBRecord(updated);
        showFeedback('success', `Pengesahan Kepala Sekolah: Calon siswa ${selectedRecord.studentName} RESMI DITERIMA.`);
        founderCommandRecorder.recordCommand(
          'CONFIG_UPDATE',
          'Smart PPDB Approval',
          `Pengesahan kelulusan siswa ${selectedRecord.studentName} (${selectedRecord.registrationNo})`
        );
      }

      await loadData();
    } catch (err) {
      console.error('Error during approval:', err);
      showFeedback('error', 'Terjadi kesalahan saat memproses pengesahan.');
    } finally {
      setApprovingLevel(null);
    }
  };

  const handleRejectCandidate = async () => {
    if (!selectedRecord) return;

    // Fail-closed authentic identity and session verification
    if (!currentUser?.uid || !actorName || !verifiedActiveRole || !canApprove) {
      showFeedback('error', 'Akses ditolak: Hanya Kepala Sekolah / Super Admin yang berhak menolak pendaftar.');
      return;
    }

    if (isRejecting) return;
    setIsRejecting(true);

    const uid = currentUser.uid;
    const name = actorName;
    const role = verifiedActiveRole;

    try {
      const reqId = `REQ_PPDB_${selectedRecord.id}`;
      await DataService.rejectRequest(reqId, uid, name, role, 'Ditolak berdasarkan pertimbangan hasil seleksi PPDB');
      const updated: PPDBRecord = { ...selectedRecord, status: 'Ditolak' };
      await DataService.savePPDBRecord(updated);
      showFeedback('info', `Status pendaftar ${selectedRecord.studentName} telah diubah menjadi Ditolak.`);
      await loadData();
    } catch (err) {
      console.error('Error during rejection:', err);
      showFeedback('error', 'Terjadi kesalahan saat menolak pendaftar.');
    } finally {
      setIsRejecting(false);
    }
  };

  // Open Convert Modal with default class group mapped
  const handleOpenConvertModal = () => {
    if (!selectedRecord) return;
    if (!currentUser?.uid || !actorName || !verifiedActiveRole || !canApprove) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki wewenang untuk konversi siswa.');
      return;
    }

    // Check if already registered
    const existing = findExistingStudent(selectedRecord);
    if (existing) {
      showFeedback('error', `Calon siswa ${selectedRecord.studentName} (${selectedRecord.registrationNo}) sudah terdaftar sebagai siswa aktif di Master Siswa (NIS: ${existing.nis}, Kelas: ${existing.classGroup}).`);
      return;
    }

    // Default class choice mapping
    let defaultClass: 'Kelompok A1' | 'Kelompok A2' | 'Kelompok B1' | 'Kelompok B2' | 'PAUD TPA' = 'Kelompok A1';
    if (selectedRecord.groupChoice === 'Kelompok A') defaultClass = 'Kelompok A1';
    else if (selectedRecord.groupChoice === 'Kelompok B') defaultClass = 'Kelompok B1';
    else if (selectedRecord.groupChoice === 'PAUD/TPA') defaultClass = 'PAUD TPA';

    setSelectedClassGroup(defaultClass);
    setShowConvertModal(true);
  };

  // Execute Student Conversion via DataService.saveStudent()
  const handleExecuteConversion = async () => {
    if (!selectedRecord) return;

    // Fail-closed authentic identity and session verification
    if (!currentUser?.uid || !actorName || !verifiedActiveRole || !canApprove) {
      showFeedback('error', 'Akses ditolak: Anda tidak memiliki wewenang untuk konversi siswa.');
      return;
    }

    if (isConverting) return;
    setIsConverting(true);
    try {
      // Re-check duplicate protection right before save
      const currentStudents = await DataService.getStudents();
      const existing = currentStudents.find(s => {
        const matchId = s.id === `std_${selectedRecord.id}` || (selectedRecord.nik && s.id === `std_${selectedRecord.nik}`);
        const matchNik = Boolean(selectedRecord.nik && s.nisn && s.nisn.trim() === selectedRecord.nik.trim());
        const matchNameBirth = Boolean(
          s.name.trim().toLowerCase() === selectedRecord.studentName.trim().toLowerCase() &&
          s.birthDate === selectedRecord.birthDate
        );
        return matchId || matchNik || matchNameBirth;
      });

      if (existing) {
        setIsConverting(false);
        setShowConvertModal(false);
        showFeedback('error', `Calon siswa ini sudah terdaftar sebagai siswa aktif (NIS: ${existing.nis}). Konversi dibatalkan untuk mencegah duplikasi.`);
        return;
      }

      const currentYear = new Date().getFullYear();
      const nextSeqNumber = String(currentStudents.length + 1).padStart(3, '0');
      const generatedNis = `${currentYear}${nextSeqNumber}`;
      const studentId = `std_${selectedRecord.id || Date.now()}`;

      const newStudent: Student = {
        id: studentId,
        nis: generatedNis,
        nisn: selectedRecord.nik || '',
        name: selectedRecord.studentName,
        namaLengkap: selectedRecord.studentName,
        nickname: selectedRecord.nickname || selectedRecord.studentName.split(' ')[0] || 'Siswa',
        gender: selectedRecord.gender === 'Perempuan' ? 'P' : 'L',
        classGroup: selectedClassGroup,
        kelompok: selectedClassGroup,
        birthDate: selectedRecord.birthDate,
        parentName: selectedRecord.fatherName || selectedRecord.motherName || 'Wali Siswa',
        namaAyah: selectedRecord.fatherName || '',
        namaOrangTua: selectedRecord.fatherName || selectedRecord.motherName || '',
        parentPhone: selectedRecord.phone || '',
        parentEmail: '',
        address: selectedRecord.address || '',
        status: 'Aktif',
        joinedYear: currentYear
      };

      // 1. Save to Master Siswa (Real persistence via DataService.saveStudent)
      await DataService.saveStudent(newStudent);

      // 2. Mark PPDB Record as Diterima
      const updatedPPDB: PPDBRecord = { ...selectedRecord, status: 'Diterima' };
      await DataService.savePPDBRecord(updatedPPDB);

      // 3. Sync Central Approval with canonical actor identity
      const uid = currentUser.uid;
      const name = actorName;
      const role = verifiedActiveRole;
      const reqId = `REQ_PPDB_${selectedRecord.id}`;
      try {
        await DataService.approveRequest(reqId, uid, name, role);
      } catch (err) {
        // non-blocking if approval request not initiated
      }

      // 4. Record Founder Governance Log
      founderCommandRecorder.recordCommand(
        'CONFIG_UPDATE',
        'PPDB Student Conversion',
        `Konversi PPDB ke Master Siswa: ${newStudent.name} (NIS: ${newStudent.nis}, Kelas: ${newStudent.classGroup})`
      );

      // 5. Refresh data
      await loadData();

      setConversionResult({ student: newStudent, record: updatedPPDB });
      setShowConvertModal(false);
      showFeedback('success', `Alhamdulillah! ${newStudent.name} telah berhasil dikonversi ke Master Siswa dengan NIS: ${newStudent.nis}.`);
    } catch (err) {
      console.error('Error during student conversion:', err);
      showFeedback('error', 'Terjadi kesalahan saat memproses konversi ke Master Siswa.');
    } finally {
      setIsConverting(false);
    }
  };

  // Filtered Candidates from real DataService records
  const filteredCandidates = ppdbList.filter(p => {
    const matchSearch =
      p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.registrationNo.toLowerCase().includes(search.toLowerCase()) ||
      (p.fatherName && p.fatherName.toLowerCase().includes(search.toLowerCase())) ||
      (p.motherName && p.motherName.toLowerCase().includes(search.toLowerCase()));

    const matchStage =
      filterStage === 'ALL' ||
      (filterStage === 'Diterima' && p.status === 'Diterima') ||
      (filterStage === 'Verifikasi' && p.status === 'Verifikasi') ||
      (filterStage === 'Menunggu' && p.status === 'Menunggu') ||
      (filterStage === 'Ditolak' && p.status === 'Ditolak');

    const matchWave = filterWave === 'ALL' || p.wave === filterWave;

    return matchSearch && matchStage && matchWave;
  });

  const existingStudent = selectedRecord ? findExistingStudent(selectedRecord) : undefined;
  const selectedDocChecks = selectedRecord ? (docVerifications[selectedRecord.id] || {}) : {};

  // Fail-Closed Access Control Gate Rendering
  if (!canAccessModule) {
    return (
      <div className="space-y-6" id="r13-smart-ppdb-unauthorized">
        <div className="rounded-3xl bg-slate-950 border border-rose-900/40 p-8 shadow-2xl text-center max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400 mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Akses Terbatas: PPDB Finalization Engine</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Modul seleksi calon siswa baru dan finalisasi data PPDB hanya dapat diakses oleh staf administratif dan pimpinan terotorisasi (Super Admin, Staf Administrasi, Kepala Sekolah, dan Bagian Keuangan).
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span>Peran Aktif Terdeteksi:</span>
            <span className="font-mono font-bold text-rose-400">{verifiedActiveRole || 'NON-CANONICAL / UNAUTHENTICATED'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="r13-smart-ppdb-root">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Sistem PPDB Terpadu • DataService Canonical</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Verifikasi & Seleksi Calon Siswa Baru
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              Pemeriksaan berkas persyaratan resmi, verifikasi bertingkat (Admin &rarr; Keuangan &rarr; Kepsek), serta konversi langsung siswa diterima ke Master Data Siswa.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Muat Ulang Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Pendaftar</span>
              <span className="text-sm font-bold text-white font-mono">{ppdbList.length} Siswa</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-800/60 text-center">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">Resmi Diterima</span>
              <span className="text-sm font-bold text-emerald-300 font-mono">
                {ppdbList.filter(c => c.status === 'Diterima').length} Siswa
              </span>
            </div>
          </div>
        </div>

        {feedback && (
          <div
            className={`mt-4 p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-2 animate-in fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200'
                : feedback.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/60 text-rose-200'
                : 'bg-indigo-950/90 border-indigo-500/60 text-indigo-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {feedback.type === 'error' && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {feedback.type === 'info' && <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />}
              <span className="font-medium">{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-[10px] opacity-70 hover:opacity-100 font-bold px-2 py-0.5"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Wave Quota Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {waveStats.map(wave => {
          const percent = Math.min(100, Math.round((wave.quotaFilled / wave.quotaTotal) * 100));
          return (
            <div key={wave.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate">{wave.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    wave.status === 'OPEN'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {wave.status === 'OPEN' ? 'DIBUKA' : 'DITUTUP'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">{wave.period}</div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Pendaftar Terdata:</span>
                <span className="text-white font-mono font-bold">
                  {wave.quotaFilled} / {wave.quotaTotal} ({percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Split View: Candidate List & Detailed Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Candidate List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Daftar Calon Siswa (Firestore)</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">{filteredCandidates.length} Terpilih</span>
          </div>

          {/* Search & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama / no reg / orang tua..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'ALL', label: 'Semua Status' },
                { id: 'Menunggu', label: 'Menunggu' },
                { id: 'Verifikasi', label: 'Verifikasi' },
                { id: 'Diterima', label: 'Diterima' },
                { id: 'Ditolak', label: 'Ditolak' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setFilterStage(st.id)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
                    filterStage === st.id
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* List items */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredCandidates.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                Tidak ada data calon siswa yang sesuai kriteria pencarian.
              </div>
            ) : (
              filteredCandidates.map(c => {
                const isSelected = selectedRecord?.id === c.id;
                const isEnrolled = Boolean(findExistingStudent(c));
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedRecord(c)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-950 border-emerald-500 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">{c.registrationNo}</span>
                      <div className="flex items-center gap-1.5">
                        {isEnrolled && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                            Siswa Aktif
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.status === 'Diterima'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : c.status === 'Verifikasi'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : c.status === 'Ditolak'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-white mt-1">{c.studentName}</h3>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                      <span>{c.groupChoice} • {c.wave}</span>
                      <span>{c.fatherName || c.motherName || 'Wali'}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Candidate Dossier (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedRecord ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              {/* Dossier Header & Conversion CTA */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {selectedRecord.registrationNo} • {selectedRecord.wave}
                    </span>
                    {existingStudent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 flex items-center gap-1">
                        <School className="w-3 h-3" />
                        NIS: {existingStudent.nis} ({existingStudent.classGroup})
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">{selectedRecord.studentName}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    NIK: <span className="text-white font-mono">{selectedRecord.nik || '-'}</span> | Pilihan:{' '}
                    <span className="text-white font-semibold">{selectedRecord.groupChoice}</span> | TTL:{' '}
                    <span className="text-white">{selectedRecord.birthPlace || 'Jember'}, {selectedRecord.birthDate}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Wali: <span className="text-white">{selectedRecord.fatherName || selectedRecord.motherName}</span> ({selectedRecord.phone})
                  </p>
                </div>

                {/* Conversion Button */}
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                    selectedRecord.isPaidFee
                      ? 'text-emerald-400 bg-emerald-950 border-emerald-800'
                      : 'text-amber-400 bg-amber-950 border-amber-800'
                  }`}>
                    {selectedRecord.isPaidFee ? 'LUNAS FORMULIR' : 'BELUM LUNAS FORMULIR'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
                      title="Cetak Rangkuman Dossier PPDB Calon Siswa"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Dossier</span>
                    </button>
                    {existingStudent ? (
                      <div className="px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-800 text-[11px] text-blue-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Terdaftar di Master Siswa</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleOpenConvertModal}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-950"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Terima & Konversi ke Master Siswa</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Multi-Level Approval Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Alur Persetujuan Bertingkat (Multi-Level Approval)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Level 1: Admin SIM */}
                  <div
                    className={`p-3.5 rounded-2xl border ${
                      selectedRecord.status === 'Verifikasi' || selectedRecord.status === 'Diterima'
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span>1. Admin SIM</span>
                      {selectedRecord.status === 'Verifikasi' || selectedRecord.status === 'Diterima' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <p className="text-[11px] opacity-80">
                      {selectedRecord.status === 'Verifikasi' || selectedRecord.status === 'Diterima'
                        ? 'Berkas administratif telah diverifikasi'
                        : 'Menunggu verifikasi kelengkapan berkas'}
                    </p>
                    {selectedRecord.status === 'Menunggu' && (
                      <button
                        onClick={() => handleApproveLevel('ADMIN')}
                        disabled={approvingLevel !== null}
                        className="mt-2 w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[10px] transition-all flex items-center justify-center gap-1.5"
                      >
                        {approvingLevel === 'ADMIN' && <RefreshCw className="w-3 h-3 animate-spin" />}
                        <span>Setujui Berkas</span>
                      </button>
                    )}
                  </div>

                  {/* Level 2: Bendahara / Keuangan */}
                  <div
                    className={`p-3.5 rounded-2xl border ${
                      selectedRecord.isPaidFee
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span>2. Bendahara</span>
                      {selectedRecord.isPaidFee ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <p className="text-[11px] opacity-80">
                      {selectedRecord.isPaidFee
                        ? 'Biaya pendaftaran & formulir LUNAS'
                        : 'Menunggu validasi setoran formulir'}
                    </p>
                    {!selectedRecord.isPaidFee && (
                      <button
                        onClick={() => handleApproveLevel('FINANCE')}
                        disabled={approvingLevel !== null}
                        className="mt-2 w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[10px] transition-all flex items-center justify-center gap-1.5"
                      >
                        {approvingLevel === 'FINANCE' && <RefreshCw className="w-3 h-3 animate-spin" />}
                        <span>Validasi Keuangan</span>
                      </button>
                    )}
                  </div>

                  {/* Level 3: Kepala Sekolah */}
                  <div
                    className={`p-3.5 rounded-2xl border ${
                      selectedRecord.status === 'Diterima'
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span>3. Kepala Sekolah</span>
                      {selectedRecord.status === 'Diterima' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <p className="text-[11px] opacity-80">
                      {selectedRecord.status === 'Diterima'
                        ? 'Pengesahan: Siswa Resmi Diterima'
                        : 'Pengesahan akhir oleh Kepala Sekolah'}
                    </p>
                    {selectedRecord.status !== 'Diterima' && (
                      <div className="mt-2 flex gap-1.5">
                        <button
                          onClick={() => handleApproveLevel('PRINCIPAL')}
                          disabled={approvingLevel !== null || isRejecting}
                          className="flex-1 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[10px] transition-all flex items-center justify-center gap-1"
                        >
                          {approvingLevel === 'PRINCIPAL' && <RefreshCw className="w-3 h-3 animate-spin" />}
                          <span>Sahkan Diterima</span>
                        </button>
                        <button
                          onClick={handleRejectCandidate}
                          disabled={approvingLevel !== null || isRejecting}
                          className="px-2 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 disabled:opacity-50 disabled:cursor-not-allowed text-rose-200 font-bold text-[10px] transition-all flex items-center justify-center gap-1"
                        >
                          {isRejecting && <RefreshCw className="w-3 h-3 animate-spin" />}
                          <span>Tolak</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Checklist */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Checklist Kelengkapan Berkas Wajib</span>
                </h3>
                <div className="space-y-2">
                  {MANDATORY_DOCS.map(doc => {
                    const checkItem = selectedDocChecks[doc.id];
                    const isVerified = checkItem?.status === 'VERIFIED';
                    return (
                      <div
                        key={doc.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => handleToggleDoc(selectedRecord.id, doc.id)}
                            disabled={togglingDocKey !== null}
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                              isVerified ? 'bg-emerald-600 text-white' : 'border border-slate-700 bg-slate-900 text-slate-600'
                            }`}
                          >
                            {isVerified && <Check className="w-3.5 h-3.5" />}
                          </button>
                          <div>
                            <span className="font-semibold text-white block">{doc.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {isVerified
                                ? `Telah diverifikasi oleh ${checkItem?.verifiedBy || 'Petugas Verifikasi'} (${checkItem?.verifiedAt || 'Terverifikasi'})`
                                : 'Klik kotak centang untuk memverifikasi fisik/digital berkas'}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isVerified ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400'
                          }`}
                        >
                          {isVerified ? 'VERIFIED' : 'PENDING'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Candidate Info Details */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-bold block mb-1">Data Orang Tua & Kontak:</span>
                  <p className="text-slate-300">Ayah: {selectedRecord.fatherName || '-'} ({selectedRecord.fatherJob || '-'})</p>
                  <p className="text-slate-300">Ibu: {selectedRecord.motherName || '-'} ({selectedRecord.motherJob || '-'})</p>
                  <p className="text-slate-300">HP: {selectedRecord.phone || '-'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-1">Alamat & Catatan:</span>
                  <p className="text-slate-300">{selectedRecord.address || '-'}</p>
                  <p className="text-slate-400 mt-1 italic">{selectedRecord.notes || 'Tidak ada catatan khusus.'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 text-xs">
              Pilih salah satu calon siswa di daftar sebelah kiri untuk meninjau berkas dan memproses penerimaan.
            </div>
          )}
        </div>
      </div>

      {/* Convert to Student Modal */}
      {showConvertModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Konversi ke Master Data Siswa</h3>
                <p className="text-xs text-slate-400">
                  Sahkan kelulusan dan buat rekaman siswa aktif di SIM TK Asy Syifa.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Nama Calon Siswa:</span>
                <span className="font-bold text-white">{selectedRecord.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nomor Registrasi:</span>
                <span className="font-mono text-emerald-400">{selectedRecord.registrationNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">NIK Siswa:</span>
                <span className="font-mono text-white">{selectedRecord.nik || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Jenis Kelamin:</span>
                <span>{selectedRecord.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tanggal Lahir:</span>
                <span>{selectedRecord.birthDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Orang Tua / Wali:</span>
                <span>{selectedRecord.fatherName || selectedRecord.motherName}</span>
              </div>
            </div>

            {/* Target Class Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Pilih Alokasi Kelas / Sentra:
              </label>
              <select
                value={selectedClassGroup}
                onChange={e => setSelectedClassGroup(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Kelompok A1">Kelompok A1 (Usia 4-5 Tahun)</option>
                <option value="Kelompok A2">Kelompok A2 (Usia 4-5 Tahun)</option>
                <option value="Kelompok B1">Kelompok B1 (Usia 5-6 Tahun)</option>
                <option value="Kelompok B2">Kelompok B2 (Usia 5-6 Tahun)</option>
                <option value="PAUD TPA">PAUD TPA (Usia 2-4 Tahun)</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Sistem akan membuat nomor induk siswa (NIS) resmi secara otomatis dan menyimpan rekaman siswa aktif ke koleksi database.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConvertModal(false)}
                disabled={isConverting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteConversion}
                disabled={isConverting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-950"
              >
                {isConverting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Memproses Penyimpanan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Konfirmasi & Simpan ke Master Siswa</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Conversion Dialog */}
      {conversionResult && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/60 rounded-3xl p-6 max-w-md w-full space-y-4 text-white shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Konversi Siswa Berhasil!</h3>
              <p className="text-xs text-slate-300">
                Siswa <strong className="text-white">{conversionResult.student.name}</strong> telah resmi terdaftar di Master Data Siswa.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Nomor Induk Siswa (NIS):</span>
                <span className="font-mono font-bold text-emerald-400">{conversionResult.student.nis}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kelas / Kelompok:</span>
                <span className="font-bold text-white">{conversionResult.student.classGroup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tahun Masuk:</span>
                <span>{conversionResult.student.joinedYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Keaktifan:</span>
                <span className="text-emerald-400 font-bold">Aktif</span>
              </div>
            </div>

            <button
              onClick={() => setConversionResult(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
            >
              Selesai & Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
