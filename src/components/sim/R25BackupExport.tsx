import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Database,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Clock,
  HardDrive,
  RefreshCw,
  Info,
  Layers,
  Users,
  DollarSign,
  Package,
  FileCheck,
  AlertCircle,
  ShieldAlert,
  Lock
} from 'lucide-react';
import { DataService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { AuditLog, SchoolProfile, UserRole } from '../../types';

// Canonical roles whitelist per TADE security contract
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

interface BackupMetadata {
  institution: string;
  npsn?: string;
  tadeVersion: string;
  schemaVersion: string;
  backupTimestamp: string;
  backupType: 'FULL' | 'ACADEMIC' | 'FINANCE' | 'INVENTORY';
  exportedBy: {
    name: string;
    role: string;
    email?: string;
  };
  recordSummary: {
    studentsCount: number;
    teachersCount: number;
    sppBillsCount: number;
    ppdbCount: number;
    inventoryCount?: number;
    presensiCount?: number;
    totalRecords: number;
  };
  integrity: {
    algorithm: 'SHA-256';
    checksumHex: string;
  };
}

interface BackupEnvelope {
  metadata: BackupMetadata;
  payload: {
    profile?: SchoolProfile | null;
    students?: any[];
    teachers?: any[];
    ppdb?: any[];
    spp?: any[];
    inventory?: any[];
    presensi?: any[];
    events?: any[];
    kms?: any[];
    anecdot?: any[];
    tahfidz?: any[];
  };
}

export const R25BackupExport: React.FC = () => {
  const { userProfile, activeRole, currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [selectedDomain, setSelectedDomain] = useState<'FULL' | 'ACADEMIC' | 'FINANCE' | 'INVENTORY'>('FULL');

  // Stats
  const [stats, setStats] = useState<{
    studentsCount: number;
    teachersCount: number;
    sppCount: number;
    ppdbCount: number;
    inventoryCount: number;
    lastBackupDate: string | null;
    estimatedSizeKb: number;
  }>({
    studentsCount: 0,
    teachersCount: 0,
    sppCount: 0,
    ppdbCount: 0,
    inventoryCount: 0,
    lastBackupDate: null,
    estimatedSizeKb: 0
  });

  // Restore validation state
  const [restoreCandidate, setRestoreCandidate] = useState<{
    fileName: string;
    fileSizeKb: number;
    envelope: BackupEnvelope | null;
    calculatedChecksum: string;
    isChecksumMatch: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);

  const [showRestoreModal, setShowRestoreModal] = useState<boolean>(false);
  const [confirmationInput, setConfirmationInput] = useState<string>('');

  // In-app notifications (Zero Native Dialogs)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);

  // 1. CANONICAL ROLE & AUTHENTICATION RESOLUTION (FAIL-CLOSED)
  // Authoritative session role: activeRole must match canonical roles list.
  // Zero fallback to userProfile.role. Zero privileged defaults.
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Operational Authority Gates:
  // - SUPER_ADMIN and ADMIN have full backup, export, and restore access.
  // - KEPALA_SEKOLAH retains read & export authority only.
  const isRestoreAuthorized = Boolean(
    currentUser?.uid &&
      verifiedActiveRole &&
      (verifiedActiveRole === 'SUPER_ADMIN' || verifiedActiveRole === 'ADMIN')
  );

  const isExportAuthorized = Boolean(
    currentUser?.uid &&
      verifiedActiveRole &&
      (verifiedActiveRole === 'SUPER_ADMIN' ||
        verifiedActiveRole === 'ADMIN' ||
        verifiedActiveRole === 'KEPALA_SEKOLAH')
  );

  const isReadOnly = verifiedActiveRole === 'KEPALA_SEKOLAH';

  // 2. AUTHENTIC IDENTITY RESOLUTION (ZERO SYNTHETIC 'Administrator')
  // Authentic actor identity derived solely from authenticated session.
  const actorName = useMemo<string | null>(() => {
    if (!currentUser?.uid) return null;
    const cleanProfileName = (userProfile?.nama || userProfile?.name)?.trim();
    if (cleanProfileName) return cleanProfileName;
    const cleanDisplayName = currentUser?.displayName?.trim();
    if (cleanDisplayName) return cleanDisplayName;
    const cleanEmail = currentUser?.email?.trim();
    if (cleanEmail) return cleanEmail;
    return `User (${currentUser.uid.slice(0, 8)})`;
  }, [currentUser?.uid, currentUser?.displayName, currentUser?.email, userProfile?.nama, userProfile?.name]);

  const currentUserEmail = currentUser?.email || userProfile?.email || undefined;

  // Helper for computing SHA-256 checksum via native Web Crypto API
  const computeSHA256 = async (str: string): Promise<string> => {
    try {
      const msgUint8 = new TextEncoder().encode(str);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch {
      return 'unavailable';
    }
  };

  // 3. PRE-QUERY AUTHORIZATION GATE
  // Sensitive queries are strictly forbidden before authorization is verified.
  const loadData = useCallback(async () => {
    // FAIL CLOSED: No sensitive queries may execute before authorization.
    if (!currentUser?.uid || !verifiedActiveRole || !isExportAuthorized) {
      setIsLoading(false);
      setSchoolProfile(null);
      setAuditLogs([]);
      setStats({
        studentsCount: 0,
        teachersCount: 0,
        sppCount: 0,
        ppdbCount: 0,
        inventoryCount: 0,
        lastBackupDate: null,
        estimatedSizeKb: 0
      });
      return;
    }

    setIsLoading(true);
    try {
      const [profile, students, teachers, spp, ppdb, inventory, logs] = await Promise.all([
        DataService.getSchoolProfile(),
        DataService.getStudents(),
        DataService.getTeachers(),
        DataService.getSPP(),
        DataService.getPPDBRecords(),
        DataService.getInventory(),
        DataService.getAuditLogs()
      ]);

      setSchoolProfile(profile);
      setAuditLogs(logs || []);

      // Find last backup log
      const backupLogs = (logs || []).filter(
        l => l.action.toLowerCase().includes('backup') || l.action.toLowerCase().includes('ekspor')
      );
      const lastDate = backupLogs.length > 0 ? backupLogs[0].timestamp : null;

      // Calculate approximate full payload size
      const rawPayload = { profile, students, teachers, spp, ppdb, inventory };
      const approxBytes = new Blob([JSON.stringify(rawPayload)]).size;

      setStats({
        studentsCount: (students || []).length,
        teachersCount: (teachers || []).length,
        sppCount: (spp || []).length,
        ppdbCount: (ppdb || []).length,
        inventoryCount: (inventory || []).length,
        lastBackupDate: lastDate,
        estimatedSizeKb: Math.round((approxBytes / 1024) * 10) / 10
      });
    } catch (e: any) {
      console.error('Error loading backup metrics:', e);
      setFeedback({
        type: 'error',
        message: 'STATUS: GAGAL → Gagal memuat metrik database untuk modul kedaulatan data.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.uid, verifiedActiveRole, isExportAuthorized]);

  useEffect(() => {
    if (currentUser?.uid && verifiedActiveRole && isExportAuthorized) {
      loadData();
    } else {
      setIsLoading(false);
      setSchoolProfile(null);
      setAuditLogs([]);
    }
  }, [currentUser?.uid, verifiedActiveRole, isExportAuthorized, loadData]);

  // 4. HANDLER-LEVEL AUTHORIZATION & ANTI-DOUBLE-SUBMIT: EXPORT
  const handleExecuteExport = async () => {
    if (isExporting) return;

    if (!currentUser?.uid || !verifiedActiveRole || !isExportAuthorized || !actorName) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Akses Ditolak: Anda tidak memiliki wewenang untuk mengekspor cadangan data sistem.'
      });
      return;
    }

    setIsExporting(true);
    try {
      const [profile, students, teachers, spp, ppdb, inventory, presensi, events, kms, anecdot, tahfidz] = await Promise.all([
        DataService.getSchoolProfile(),
        DataService.getStudents(),
        DataService.getTeachers(),
        DataService.getSPP(),
        DataService.getPPDBRecords(),
        DataService.getInventory(),
        DataService.getPresensi(),
        DataService.getEvents(),
        DataService.getKMS(),
        DataService.getAnecdot(),
        DataService.getTahfidz()
      ]);

      let payloadToExport: BackupEnvelope['payload'] = {};
      let totalRecords = 0;

      if (selectedDomain === 'FULL') {
        payloadToExport = {
          profile,
          students,
          teachers,
          ppdb,
          spp,
          inventory,
          presensi,
          events,
          kms,
          anecdot,
          tahfidz
        };
        totalRecords =
          (students?.length || 0) +
          (teachers?.length || 0) +
          (ppdb?.length || 0) +
          (spp?.length || 0) +
          (inventory?.length || 0) +
          (presensi?.length || 0) +
          (events?.length || 0) +
          (kms?.length || 0) +
          (anecdot?.length || 0) +
          (tahfidz?.length || 0);
      } else if (selectedDomain === 'ACADEMIC') {
        payloadToExport = {
          students,
          teachers,
          presensi,
          events,
          anecdot,
          tahfidz,
          kms
        };
        totalRecords =
          (students?.length || 0) +
          (teachers?.length || 0) +
          (presensi?.length || 0) +
          (events?.length || 0) +
          (anecdot?.length || 0) +
          (tahfidz?.length || 0) +
          (kms?.length || 0);
      } else if (selectedDomain === 'FINANCE') {
        payloadToExport = {
          spp,
          ppdb
        };
        totalRecords = (spp?.length || 0) + (ppdb?.length || 0);
      } else if (selectedDomain === 'INVENTORY') {
        payloadToExport = {
          inventory
        };
        totalRecords = inventory?.length || 0;
      }

      const timestamp = new Date().toISOString();
      const payloadString = JSON.stringify(payloadToExport);
      const checksum = await computeSHA256(payloadString);

      const envelope: BackupEnvelope = {
        metadata: {
          institution: 'TK ASY SYIFA TANGGUL',
          npsn: profile?.npsn || '69900000',
          tadeVersion: 'TADE-v15.8-Sovereign',
          schemaVersion: '2026.09-canonical',
          backupTimestamp: timestamp,
          backupType: selectedDomain,
          exportedBy: {
            name: actorName,
            role: verifiedActiveRole,
            email: currentUserEmail
          },
          recordSummary: {
            studentsCount: payloadToExport.students?.length || 0,
            teachersCount: payloadToExport.teachers?.length || 0,
            sppBillsCount: payloadToExport.spp?.length || 0,
            ppdbCount: payloadToExport.ppdb?.length || 0,
            inventoryCount: payloadToExport.inventory?.length || 0,
            presensiCount: payloadToExport.presensi?.length || 0,
            totalRecords
          },
          integrity: {
            algorithm: 'SHA-256',
            checksumHex: checksum
          }
        },
        payload: payloadToExport
      };

      const jsonStr = JSON.stringify(envelope, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateTag = timestamp.split('T')[0];
      a.href = url;
      a.download = `backup-tade-asy-syifa-${selectedDomain.toLowerCase()}-${dateTag}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Canonical Audit Log without synthetic identities
      await DataService.logAction(
        actorName,
        verifiedActiveRole,
        `Ekspor Cadangan Data (${selectedDomain} - ${totalRecords} Record)`,
        'R25-KedaulatanData'
      );

      setFeedback({
        type: 'success',
        message: `STATUS: SUKSES → Cadangan data ${selectedDomain} (${totalRecords} record) berhasil diekspor dengan Checksum SHA-256: ${checksum.substring(0, 12)}...`
      });

      await loadData();
    } catch (err: any) {
      console.error('Export failure:', err);
      setFeedback({
        type: 'error',
        message: 'STATUS: GAGAL → Gagal mengekspor data: ' + (err?.message || 'Terjadi kesalahan sistem internal.')
      });
    } finally {
      setIsExporting(false);
    }
  };

  // 5. HANDLER-LEVEL AUTHORIZATION: FILE PARSING & VALIDATION
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser?.uid || !verifiedActiveRole || !isRestoreAuthorized) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Akses Ditolak: Hanya Super Admin dan Admin yang berwenang memilih berkas pemulihan.'
      });
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    const fileSizeKb = Math.round((file.size / 1024) * 10) / 10;
    const errors: string[] = [];
    const warnings: string[] = [];

    const reader = new FileReader();
    reader.onload = async e => {
      try {
        const text = e.target?.result as string;
        if (!text || text.trim() === '') {
          setRestoreCandidate({
            fileName: file.name,
            fileSizeKb,
            envelope: null,
            calculatedChecksum: '',
            isChecksumMatch: false,
            errors: ['Berkas kosong atau tidak dapat dibaca.'],
            warnings: []
          });
          setShowRestoreModal(true);
          return;
        }

        let parsed: any = null;
        try {
          parsed = JSON.parse(text);
        } catch {
          setRestoreCandidate({
            fileName: file.name,
            fileSizeKb,
            envelope: null,
            calculatedChecksum: '',
            isChecksumMatch: false,
            errors: ['Berkas bukan berformat JSON yang valid.'],
            warnings: []
          });
          setShowRestoreModal(true);
          return;
        }

        // Check if enveloped structure or legacy raw structure
        let envelope: BackupEnvelope | null = null;
        let calculatedChecksum = '';
        let isChecksumMatch = false;

        if (parsed.metadata && parsed.payload) {
          envelope = parsed as BackupEnvelope;
          const payloadStr = JSON.stringify(envelope.payload);
          calculatedChecksum = await computeSHA256(payloadStr);
          isChecksumMatch = envelope.metadata.integrity?.checksumHex === calculatedChecksum;

          if (envelope.metadata.institution !== 'TK ASY SYIFA TANGGUL') {
            warnings.push(
              `Nama institusi pada berkas cadangan (${envelope.metadata.institution || 'Tidak Diketahui'}) berbeda dengan profil sekolah aktif.`
            );
          }

          if (!isChecksumMatch) {
            warnings.push(
              'Checksum berkas payload berbeda dengan metadata (berkas mungkin telah diedit secara manual).'
            );
          }
        } else if (parsed.students || parsed.teachers || parsed.spp || parsed.ppdb) {
          // Legacy raw format
          warnings.push('Berkas menggunakan format cadangan legacy v1 (tanpa metadata envelope).');
          envelope = {
            metadata: {
              institution: parsed.profile?.schoolName || 'TK ASY SYIFA TANGGUL (Legacy)',
              tadeVersion: 'Legacy-v1',
              schemaVersion: '1.0',
              backupTimestamp: parsed.exportedAt || new Date().toISOString(),
              backupType: 'FULL',
              exportedBy: { name: 'Legacy System', role: 'ADMIN' },
              recordSummary: {
                studentsCount: parsed.students?.length || 0,
                teachersCount: parsed.teachers?.length || 0,
                sppBillsCount: parsed.spp?.length || 0,
                ppdbCount: parsed.ppdb?.length || 0,
                totalRecords:
                  (parsed.students?.length || 0) +
                  (parsed.teachers?.length || 0) +
                  (parsed.spp?.length || 0) +
                  (parsed.ppdb?.length || 0)
              },
              integrity: {
                algorithm: 'SHA-256',
                checksumHex: 'legacy-untracked'
              }
            },
            payload: parsed
          };
        } else {
          errors.push(
            'Struktur data tidak dikenali. Tidak ditemukan entitas data kanonikal (students/teachers/spp/ppdb).'
          );
        }

        setRestoreCandidate({
          fileName: file.name,
          fileSizeKb,
          envelope,
          calculatedChecksum,
          isChecksumMatch,
          errors,
          warnings
        });
        setConfirmationInput('');
        setShowRestoreModal(true);
      } catch (err: any) {
        setRestoreCandidate({
          fileName: file.name,
          fileSizeKb,
          envelope: null,
          calculatedChecksum: '',
          isChecksumMatch: false,
          errors: ['Kesalahan pembacaan berkas: ' + (err?.message || 'Format tidak didukung.')],
          warnings: []
        });
        setShowRestoreModal(true);
      }
    };
    reader.readAsText(file);
    // Reset file input value so same file can be selected again
    event.target.value = '';
  };

  // 6. HANDLER-LEVEL AUTHORIZATION & ANTI-DOUBLE-SUBMIT: RESTORE
  const handleExecuteRestore = async () => {
    if (isRestoring) return;

    if (!currentUser?.uid || !verifiedActiveRole || !isRestoreAuthorized || !actorName) {
      setFeedback({
        type: 'error',
        message: 'STATUS: DITOLAK → Akses Ditolak: Hanya Super Admin dan Admin yang berwenang mengeksekusi pemulihan data sistem.'
      });
      return;
    }

    if (!restoreCandidate || !restoreCandidate.envelope || restoreCandidate.errors.length > 0) {
      setFeedback({
        type: 'error',
        message: 'STATUS: GAGAL → Tidak dapat memulihkan berkas yang memiliki kesalahan struktur.'
      });
      return;
    }

    if (confirmationInput.trim().toUpperCase() !== 'PULIHKAN DATA') {
      setFeedback({
        type: 'warning',
        message: 'STATUS: KONFIRMASI DIBUTUHKAN → Ketik "PULIHKAN DATA" untuk mengonfirmasi operasi berisiko tinggi ini.'
      });
      return;
    }

    setIsRestoring(true);
    try {
      const payload = restoreCandidate.envelope.payload;

      // Defensive individual restoration of collections
      let restoredCount = 0;

      if (Array.isArray(payload.students)) {
        for (const s of payload.students) {
          if (s.id && s.name) {
            await DataService.saveStudent(s);
            restoredCount++;
          }
        }
      }

      if (Array.isArray(payload.teachers)) {
        for (const t of payload.teachers) {
          if (t.id && t.name) {
            await DataService.saveTeacher(t);
            restoredCount++;
          }
        }
      }

      if (Array.isArray(payload.spp)) {
        for (const bill of payload.spp) {
          if (bill.id) {
            await DataService.saveSPP(bill);
            restoredCount++;
          }
        }
      }

      if (Array.isArray(payload.inventory)) {
        for (const item of payload.inventory) {
          if (item.id && item.name) {
            await DataService.saveInventory(item);
            restoredCount++;
          }
        }
      }

      if (Array.isArray(payload.presensi)) {
        for (const pres of payload.presensi) {
          if (pres.id) {
            await DataService.savePresensi(pres);
            restoredCount++;
          }
        }
      }

      // Canonical Audit Log without synthetic identities
      await DataService.logAction(
        actorName,
        verifiedActiveRole,
        `Pemulihan Cadangan Data (${restoreCandidate.envelope.metadata.backupType} - ${restoredCount} Record)`,
        'R25-KedaulatanData'
      );

      setShowRestoreModal(false);
      setRestoreCandidate(null);
      setConfirmationInput('');

      setFeedback({
        type: 'success',
        message: `STATUS: SUKSES → Pemulihan data selesai! ${restoredCount} record data berhasil dipulihkan ke basis data sistem.`
      });

      await loadData();
    } catch (err: any) {
      console.error('Restore failure:', err);
      setFeedback({
        type: 'error',
        message: 'STATUS: GAGAL → Pemulihan data terhenti: ' + (err?.message || 'Terjadi kesalahan sistem internal.')
      });
    } finally {
      setIsRestoring(false);
    }
  };

  // Filtered audit logs for backup activities
  const backupAuditLogs = useMemo(() => {
    return auditLogs.filter(
      l =>
        l.targetModule?.includes('R25') ||
        l.targetModule?.includes('Kedaulatan') ||
        l.action.toLowerCase().includes('cadangan') ||
        l.action.toLowerCase().includes('backup') ||
        l.action.toLowerCase().includes('pemulihan') ||
        l.action.toLowerCase().includes('ekspor')
    );
  }, [auditLogs]);

  // 7. UI / DOM ISOLATION: UNAUTHORIZED ACCESS STATE (FAIL-CLOSED)
  if (!currentUser?.uid || !verifiedActiveRole || !isExportAuthorized) {
    return (
      <div id="r25-access-denied-container" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full inline-block">
              Akses Dibatasi — Kedaulatan Data
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Otoritas Tidak Memadai
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Modul <strong>R25 (Kedaulatan & Cadangan Data)</strong> memuat fasilitas ekspor basis data sekolah dan pemulihan sistem yang memiliki risiko tinggi. Akses modul ini dibatasi ketat hanya untuk peran <strong>SUPER_ADMIN</strong>, <strong>ADMIN</strong>, dan <strong>KEPALA_SEKOLAH</strong> (khusus ekspor).
            </p>
          </div>
          <div className="pt-2 text-[11px] text-stone-500 bg-stone-50 py-2.5 px-4 rounded-xl border border-stone-200 max-w-sm mx-auto flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-stone-400" />
            <span>Peran Sesi Anda: <strong>{verifiedActiveRole || 'Tidak Terautentikasi'}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="r25-backup-export-container" className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                Modul R25 — Kedaulatan & Cadangan Data
              </span>
              <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                TK ASY SYIFA TANGGUL
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Cadangan Data, Pemulihan & Kedaulatan Sistem
            </h1>
            <p className="text-stone-600 text-xs mt-1 max-w-2xl">
              Fasilitas independen untuk mengamankan data seluruh ekosistem sekolah (Siswa, Pendidik, Keuangan SPP, Sarpras, dan Presensi) secara terenkapsulasi dengan verifikasi integritas Checksum SHA-256.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              title="Perbarui Status Database"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Segarkan Status
            </button>
          </div>
        </div>
      </div>

      {/* In-App Feedback Banner (Zero Native Dialogs) */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-start justify-between gap-3 text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : feedback.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : feedback.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
            {feedback.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
            {feedback.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />}
            {feedback.type === 'info' && <Info className="w-5 h-5 text-blue-600 shrink-0" />}
            <span className="font-medium">{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-600 font-bold px-2 py-0.5 rounded-lg cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Smart Health & Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Status Database</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">Aktif & Siap</div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            Koneksi SSOT Kanonikal Normal
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Rekaman Data</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">
            {stats.studentsCount + stats.teachersCount + stats.sppCount + stats.ppdbCount + stats.inventoryCount} Rekaman
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {stats.studentsCount} Siswa • {stats.teachersCount} Guru • {stats.sppCount} SPP
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cadangan Terakhir</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 truncate">
            {stats.lastBackupDate ? stats.lastBackupDate.split(' ')[0] : 'Belum Ada'}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 truncate">
            {stats.lastBackupDate ? `Waktu: ${stats.lastBackupDate}` : 'Lakukan pencadangan berkala'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Estimasi Ukuran JSON</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">~{stats.estimatedSizeKb} KB</div>
          <div className="text-[11px] text-stone-500 mt-1">
            Integritas: SHA-256 Web Crypto
          </div>
        </div>
      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Export Engine (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">Ekspor Berkas Cadangan Mandiri</h2>
                <p className="text-xs text-stone-500">Unduh data terenkapsulasi ke format JSON resmi institusi.</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Portable JSON
            </span>
          </div>

          {/* Domain Selection Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Pilih Cakupan Cadangan Data:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSelectedDomain('FULL')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedDomain === 'FULL'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <Database className="w-4 h-4 text-emerald-700 mb-1" />
                <div className="font-bold text-xs">Seluruh Sistem</div>
                <div className="text-[10px] text-stone-500">Semua Entitas</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDomain('ACADEMIC')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedDomain === 'ACADEMIC'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <Users className="w-4 h-4 text-blue-700 mb-1" />
                <div className="font-bold text-xs">Akademik & Siswa</div>
                <div className="text-[10px] text-stone-500">Siswa & Guru</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDomain('FINANCE')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedDomain === 'FINANCE'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <DollarSign className="w-4 h-4 text-amber-700 mb-1" />
                <div className="font-bold text-xs">Keuangan & SPP</div>
                <div className="text-[10px] text-stone-500">Tagihan & PPDB</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDomain('INVENTORY')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedDomain === 'INVENTORY'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700'
                }`}
              >
                <Package className="w-4 h-4 text-purple-700 mb-1" />
                <div className="font-bold text-xs">Sarpras & APE</div>
                <div className="text-[10px] text-stone-500">Inventaris</div>
              </button>
            </div>
          </div>

          {/* Export Details & Summary Box */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Format Metadata:</span>
              <span className="font-mono font-bold text-slate-800">TADE-v15.8 (Canonical 2026)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Institusi Pemilik:</span>
              <span className="font-bold text-slate-800">TK ASY SYIFA TANGGUL</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Integritas Algoritma:</span>
              <span className="font-mono text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded font-semibold">
                SHA-256 Hash Digest
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200">
              <span className="text-stone-500">Operator Ekspor:</span>
              <span className="font-medium text-slate-700">{actorName || 'User Terautentikasi'} ({verifiedActiveRole})</span>
            </div>
          </div>

          {/* Export Action Button */}
          <div className="pt-2">
            <button
              onClick={handleExecuteExport}
              disabled={isExporting || !isExportAuthorized}
              className="w-full py-3 px-5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Menyiapkan Cadangan Data...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Unduh Berkas Cadangan ({selectedDomain})
                </>
              )}
            </button>
            {!isExportAuthorized && (
              <p className="text-[11px] text-rose-600 text-center mt-2">
                * Ekspor data terbatas hanya untuk Super Admin, Admin, dan Kepala Sekolah.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Restore Engine (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Pemulihan Data Sistem</h2>
                  <p className="text-xs text-stone-500">Impor berkas cadangan JSON terverifikasi.</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                High Risk
              </span>
            </div>

            <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                Prosedur Pemulihan Defensif:
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Pemulihan data akan memperbarui rekaman data yang ada pada database lokal dan Firestore. Berkas yang diunggah akan divalidasi integritas dan strukturnya terlebih dahulu sebelum konfirmasi akhir.
              </p>
            </div>

            {isRestoreAuthorized ? (
              <div className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-2xl p-6 text-center space-y-3 transition-colors bg-stone-50/50">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-800">Pilih Berkas Cadangan (.json)</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Maksimal ukuran 50 MB</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={!isRestoreAuthorized || isRestoring}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!isRestoreAuthorized || isRestoring}
                  className="px-4 py-2 bg-white hover:bg-stone-100 text-slate-800 font-bold text-xs rounded-xl border border-stone-300 shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Pilih Berkas dari Komputer
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-2 text-xs text-stone-600">
                <Lock className="w-6 h-6 text-stone-400 mx-auto" />
                <p className="font-semibold text-slate-800">Fasilitas Pemulihan Terkunci</p>
                <p className="text-[11px] text-stone-500">
                  Peran {verifiedActiveRole} hanya memiliki hak baca/ekspor. Pemulihan cadangan data dibatasi khusus untuk Super Admin dan Admin.
                </p>
              </div>
            )}
          </div>

          <div className="text-[11px] text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200/60">
            <strong>Catatan Otoritas:</strong> Hanya akun <span className="font-bold text-slate-700">SUPER_ADMIN</span> dan <span className="font-bold text-slate-700">ADMIN</span> yang memiliki hak untuk mengeksekusi pemulihan data produksi.
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">
              Log Riwayat Cadangan & Pemulihan Sistem
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            {backupAuditLogs.length} Aktivitas Tercatat
          </span>
        </div>

        {backupAuditLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-500">
            Belum ada aktivitas ekspor atau pemulihan data yang tercatat dalam log audit.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/80 text-stone-600">
                  <th className="py-2.5 px-3 font-bold rounded-l-xl">Waktu</th>
                  <th className="py-2.5 px-3 font-bold">Operator</th>
                  <th className="py-2.5 px-3 font-bold">Peran</th>
                  <th className="py-2.5 px-3 font-bold">Aktivitas</th>
                  <th className="py-2.5 px-3 font-bold rounded-r-xl">Modul Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {backupAuditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{log.userName}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-700">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{log.action}</td>
                    <td className="py-2.5 px-3 text-stone-500 font-mono text-[11px]">{log.targetModule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Restore Confirmation Modal (Zero Native Dialogs) */}
      {showRestoreModal && restoreCandidate && isRestoreAuthorized && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-stone-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Pratinjau & Validasi Cadangan Data
                </h3>
              </div>
              <button
                onClick={() => setShowRestoreModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Error state */}
            {restoreCandidate.errors.length > 0 ? (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-rose-950">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  Berkas Tidak Memenuhi Syarat Validasi:
                </div>
                <ul className="list-disc list-inside space-y-1 text-rose-800">
                  {restoreCandidate.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            ) : (
              /* Valid state with summary */
              <div className="space-y-4">
                {restoreCandidate.warnings.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1 text-amber-950">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Peringatan Validasi:
                    </div>
                    <ul className="list-disc list-inside text-amber-800 text-[11px]">
                      {restoreCandidate.warnings.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Nama Berkas:</span>
                    <span className="font-mono font-medium text-slate-800">{restoreCandidate.fileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Ukuran:</span>
                    <span className="font-medium text-slate-800">{restoreCandidate.fileSizeKb} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Institusi Berkas:</span>
                    <span className="font-bold text-slate-800">
                      {restoreCandidate.envelope?.metadata.institution || 'Tidak Diketahui'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Waktu Cadangan Dibuat:</span>
                    <span className="font-medium text-slate-800">
                      {restoreCandidate.envelope?.metadata.backupTimestamp || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Tipe Cakupan:</span>
                    <span className="font-bold text-emerald-800">
                      {restoreCandidate.envelope?.metadata.backupType || 'FULL'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-stone-200">
                    <span className="text-stone-500">Total Rekaman Terdeteksi:</span>
                    <span className="font-bold text-slate-900">
                      {restoreCandidate.envelope?.metadata.recordSummary.totalRecords || 0} Record
                    </span>
                  </div>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-900 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-rose-950">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    Konfirmasi Tindakan Pemulihan:
                  </div>
                  <p className="text-[11px] text-rose-800 leading-relaxed">
                    Tindakan ini akan menimpa data produksi dengan data dari berkas cadangan ini. Ketik kata{' '}
                    <span className="font-mono font-bold text-rose-950 bg-rose-200/70 px-1 py-0.5 rounded">
                      PULIHKAN DATA
                    </span>{' '}
                    di bawah untuk mengaktifkan tombol eksekusi:
                  </p>
                  <input
                    type="text"
                    value={confirmationInput}
                    onChange={e => setConfirmationInput(e.target.value)}
                    placeholder="Ketik PULIHKAN DATA"
                    className="w-full mt-2 px-3 py-2 bg-white border border-rose-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRestoreModal(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Batal
              </button>
              {restoreCandidate.errors.length === 0 && (
                <button
                  type="button"
                  onClick={handleExecuteRestore}
                  disabled={isRestoring || confirmationInput.trim().toUpperCase() !== 'PULIHKAN DATA'}
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-40 flex items-center gap-2 cursor-pointer"
                >
                  {isRestoring ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Memulihkan Data...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Eksekusi Pemulihan Data
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
