import { AdministrativeWorkflowLibrary, AdministrativeWorkflowBlueprint } from './AdministrativeWorkflowLibrary';
import { TaskRole, TaskPriority } from './AdministrativeTaskOrchestrator';

export interface ParsedAdminIntent {
  rawCommand: string;
  recognizedGoal: string;
  category: 
    | 'ABSENSI' 
    | 'SPP_PEMBAYARAN' 
    | 'TABUNGAN' 
    | 'PPDB' 
    | 'LAPORAN' 
    | 'PENGUMUMAN' 
    | 'SURAT_DOKUMEN' 
    | 'ARSIP' 
    | 'ADMINISTRASI_GURU' 
    | 'ADMINISTRASI_SISWA'
    | 'GOVERNANCE'
    | 'GENERAL_ADMIN';
  suggestedRole: TaskRole;
  requiredCapability: string;
  matchedWorkflow?: AdministrativeWorkflowBlueprint;
  deconstructedSteps: string[];
  dependencies: string[];
  priority: TaskPriority;
  isSensitive: boolean;
  explanation: string;
}

export class NaturalLanguageAdminIntentEngine {
  private static instance: NaturalLanguageAdminIntentEngine;

  public static getInstance(): NaturalLanguageAdminIntentEngine {
    if (!NaturalLanguageAdminIntentEngine.instance) {
      NaturalLanguageAdminIntentEngine.instance = new NaturalLanguageAdminIntentEngine();
    }
    return NaturalLanguageAdminIntentEngine.instance;
  }

  public parseIntent(command: string, userRole: TaskRole = 'SUPER_ADMIN'): ParsedAdminIntent {
    const cmd = command.toLowerCase().trim();
    const wfLib = AdministrativeWorkflowLibrary.getInstance();

    // 1. "Hermes, siapkan laporan absensi" / "rekap absensi"
    if (cmd.includes('absensi') || cmd.includes('kehadiran') || cmd.includes('presensi')) {
      const wf = wfLib.getWorkflowById('WF-ABS-01');
      return {
        rawCommand: command,
        recognizedGoal: 'Penyusunan Rekapitulasi Presensi Santri Bulanan',
        category: 'ABSENSI',
        suggestedRole: userRole === 'SUPER_ADMIN' ? 'GURU' : userRole,
        requiredCapability: 'CAP_ATTENDANCE_RECAP',
        matchedWorkflow: wf,
        deconstructedSteps: [
          'Ambil log presensi kelas dari Single Source of Truth db.ts',
          'Hitung persentase hadir, izin, sakit, dan alpa santri',
          'Susun draf rekapitulasi kehadiran siap diverifikasi wali kelas'
        ],
        dependencies: ['src/services/db.ts:getAttendanceSummary'],
        priority: 'HIGH',
        isSensitive: false,
        explanation: 'Perintah dipetakan ke Workflow Absensi Presensi. Data dihitung langsung tanpa mutasi destruktif.'
      };
    }

    // 2. "Hermes, cek pembayaran yang belum selesai" / "SPP" / "tagihan"
    if (cmd.includes('pembayaran') || cmd.includes('spp') || cmd.includes('tagihan') || cmd.includes('iuran')) {
      const wf = wfLib.getWorkflowById('WF-SPP-02');
      return {
        rawCommand: command,
        recognizedGoal: 'Pemeriksaan dan Rekapitulasi Pembayaran SPP & Piutang Santri',
        category: 'SPP_PEMBAYARAN',
        suggestedRole: userRole === 'SUPER_ADMIN' ? 'ADMIN_TU' : userRole,
        requiredCapability: 'CAP_FINANCE_RECAP',
        matchedWorkflow: wf,
        deconstructedSteps: [
          'Pindai status kwitansi pembayaran di buku kas db.ts',
          'Identifikasi santri dengan tagihan belum terselesaikan',
          'Susun tabel rekapitulasi penerimaan kas dan draf laporan tagihan'
        ],
        dependencies: ['src/services/db.ts:getSavingsTransactions'],
        priority: 'HIGH',
        isSensitive: false,
        explanation: 'Perintah dipetakan ke Workflow SPP & Pembayaran. Rekapitulasi finansial disiapkan secara transparan.'
      };
    }

    // 3. "Hermes, siapkan bahan rapat yayasan" / "rapat pembina"
    if (cmd.includes('rapat yayasan') || cmd.includes('bahan rapat') || cmd.includes('dewan pembina')) {
      const wf = wfLib.getWorkflowById('WF-LAP-05');
      return {
        rawCommand: command,
        recognizedGoal: 'Kompilasi Bahan Laporan Pertanggungjawaban Rapat Dewan Pembina Yayasan',
        category: 'GOVERNANCE',
        suggestedRole: userRole === 'SUPER_ADMIN' ? 'KETUA_YAYASAN' : userRole,
        requiredCapability: 'CAP_GOVERNANCE_BRIEF',
        matchedWorkflow: wf,
        deconstructedSteps: [
          'Ambil ringkasan performa finansial, akademik, dan inventaris dari db.ts',
          'Sintesis 5 pilar kelembagaan menjadi ringkasan eksekutif 1 halaman',
          'Siapkan draf dokumen bahan presentasi rapat pembina'
        ],
        dependencies: ['src/services/db.ts:getInstitutionalLedger'],
        priority: 'HIGH',
        isSensitive: false,
        explanation: 'Perintah dipetakan ke Workflow Governance Yayasan. Hanya membaca data agregat tanpa mengubah saldo.'
      };
    }

    // 4. "Hermes, rapikan administrasi kelas saya" / "jurnal mengajar"
    if (cmd.includes('administrasi kelas') || cmd.includes('jurnal') || cmd.includes('modul ajar') || cmd.includes('perangkat ajar')) {
      const wf = wfLib.getWorkflowById('WF-GURU-09');
      return {
        rawCommand: command,
        recognizedGoal: 'Penyusunan Format Jurnal Pembelajaran Harian & Modul Ajar Guru',
        category: 'ADMINISTRASI_GURU',
        suggestedRole: userRole === 'SUPER_ADMIN' ? 'GURU' : userRole,
        requiredCapability: 'CAP_CURRICULUM_DRAFTING',
        matchedWorkflow: wf,
        deconstructedSteps: [
          'Muat data silabus dan capaian pembelajaran yang diampu',
          'Format agenda harian kelas dan rekap catatan evaluasi siswa',
          'Kompilasi ke dalam portofolio perangkat ajar guru'
        ],
        dependencies: ['src/services/db.ts:getTeacherLessonPlans'],
        priority: 'MEDIUM',
        isSensitive: false,
        explanation: 'Perintah dipetakan ke Workflow Administrasi Guru. Menyusun draf dokumen pembelajaran mandiri.'
      };
    }

    // 5. "Hermes, bereskan administrasi bulan ini" / "rekap bulanan global"
    if (cmd.includes('bereskan administrasi') || cmd.includes('administrasi bulan ini') || cmd.includes('audit rutin')) {
      return {
        rawCommand: command,
        recognizedGoal: 'Penyusunan Paket Rekonsiliasi Administrasi Bulanan Terpadu',
        category: 'LAPORAN',
        suggestedRole: userRole,
        requiredCapability: 'CAP_MONTHLY_AUDIT_SUITE',
        deconstructedSteps: [
          '1. Rekapitulasi absensi seluruh rombel (WF-ABS-01)',
          '2. Rekon pembayaran SPP dan kas operasional (WF-SPP-02)',
          '3. Audit saldo kas tabungan santri (WF-TAB-03)',
          '4. Susun ringkasan laporan eksekutif bulanan (WF-LAP-05)'
        ],
        dependencies: ['src/services/db.ts:getAllSchoolData'],
        priority: 'HIGH',
        isSensitive: true,
        explanation: 'Perintah komprehensif. Didekomposisi menjadi 4 sub-tugas terstruktur. Memerlukan verifikasi sebelum finalisasi.'
      };
    }

    // Fallback: General Admin command
    return {
      rawCommand: command,
      recognizedGoal: `Pemrosesan Tugas Administratif: "${command}"`,
      category: 'GENERAL_ADMIN',
      suggestedRole: userRole,
      requiredCapability: 'CAP_GENERAL_ADMIN_EXEC',
      deconstructedSteps: [
        'Analisis sasaran dokumen / laporan yang diminta',
        'Validasi hak akses pengguna terhadap objek data',
        'Eksekusi pembacaan dan penyusunan draf terformat'
      ],
      dependencies: ['src/services/db.ts:genericQuery'],
      priority: 'MEDIUM',
      isSensitive: false,
      explanation: 'Tugas umum dikenali dan dialokasikan ke antrean eksekusi terisolasi.'
    };
  }
}
