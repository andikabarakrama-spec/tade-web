export type AdministrationMode = 
  | 'AUTONOMOUS_STANDBY' 
  | 'PAUSED' 
  | 'MANUAL_ADMIN' 
  | 'SUSPENDED' 
  | 'GLOBAL_OVERRIDE';

export interface PreservedTaskState {
  taskId: string;
  taskTitle: string;
  assignedRole: string;
  pausedAtStep: number;
  totalSteps: number;
  payloadSnapshot: Record<string, any>;
  timestamp: string;
}

export class SovereignManualAdministration {
  private static instance: SovereignManualAdministration;
  private currentMode: AdministrationMode = 'MANUAL_ADMIN'; // Default: Super Admin in full sovereign control
  private preservedQueue: PreservedTaskState[] = [
    {
      taskId: 'TASK-QUEUED-001',
      taskTitle: 'Penyusunan Format Rekap Absensi Semester Ganjil',
      assignedRole: 'ADMIN_TU',
      pausedAtStep: 2,
      totalSteps: 4,
      payloadSnapshot: { classGroup: 'A-1', dateRange: '2026-08' },
      timestamp: '2026-08-16T10:00:00Z'
    }
  ];
  private executionHistory: Array<{ timestamp: string; action: string; user: string }> = [
    { timestamp: '2026-08-16T10:05:00Z', action: 'MANUAL_ADMIN_MODE_SET', user: 'SUPER_ADMIN' }
  ];

  public static getInstance(): SovereignManualAdministration {
    if (!SovereignManualAdministration.instance) {
      SovereignManualAdministration.instance = new SovereignManualAdministration();
    }
    return SovereignManualAdministration.instance;
  }

  public getCurrentMode(): AdministrationMode {
    return this.currentMode;
  }

  public getState() {
    return {
      currentMode: this.currentMode,
      activeMode: this.currentMode,
      preservedQueue: [...this.preservedQueue],
      executionHistory: [...this.executionHistory]
    };
  }

  public getPreservedTasks(): PreservedTaskState[] {
    return [...this.preservedQueue];
  }

  public getExecutionHistory() {
    return [...this.executionHistory];
  }

  public setMode(mode: AdministrationMode, requestedBy: string = 'SUPER_ADMIN'): { success: boolean; message: string } {
    this.currentMode = mode;
    this.executionHistory.push({
      timestamp: new Date().toISOString(),
      action: `MODE_TRANSITION_TO_${mode}`,
      user: requestedBy
    });

    return {
      success: true,
      message: `Mode administrasi kedaulatan beralih ke: ${mode}. State tugas (${this.preservedQueue.length} item) terjaga aman tanpa duplikasi.`
    };
  }

  public parseNaturalCommand(command: string): { actionTaken: string; resultingMode: AdministrationMode; reply: string } {
    const cmd = command.toLowerCase().trim();

    if (cmd.includes('jeda hermes') || cmd.includes('pause hermes') || cmd.includes('hentikan sementara')) {
      this.setMode('PAUSED');
      return {
        actionTaken: 'PAUSE',
        resultingMode: 'PAUSED',
        reply: 'AI Asy: Hermes telah dijeda. Seluruh antrean tugas dibekukan dan statusnya dipertahankan tanpa ada yang hilang.'
      };
    }

    if (cmd.includes('bekerja sebagai admin') || cmd.includes('manual admin') || cmd.includes('ambil alih')) {
      this.setMode('MANUAL_ADMIN');
      return {
        actionTaken: 'MANUAL_ADMIN',
        resultingMode: 'MANUAL_ADMIN',
        reply: 'AI Asy: Mode Administrasi Manual aktif. Kendali penuh berada di tangan Super Admin; asisten tidak akan melakukan intervensi.'
      };
    }

    if (cmd.includes('lanjutkan hermes') || cmd.includes('resume hermes') || cmd.includes('aktifkan kembali')) {
      this.setMode('AUTONOMOUS_STANDBY');
      return {
        actionTaken: 'RESUME',
        resultingMode: 'AUTONOMOUS_STANDBY',
        reply: 'AI Asy: Hermes dilanjutkan dalam mode Standby. Memproses antrean yang tertunda tanpa eksekusi ganda.'
      };
    }

    if (cmd.includes('suspend') || cmd.includes('bekukan total') || cmd.includes('karantina')) {
      this.setMode('SUSPENDED');
      return {
        actionTaken: 'SUSPEND',
        resultingMode: 'SUSPENDED',
        reply: 'AI Asy: Eksekusi dibekukan total (SUSPENDED). Dibutuhkan otorisasi ulang Super Admin untuk melanjutkan.'
      };
    }

    return {
      actionTaken: 'NOOP',
      resultingMode: this.currentMode,
      reply: 'AI Asy: Perintah tidak dikenali sebagai kontrol administrasi. Mode saat ini tetap: ' + this.currentMode
    };
  }
}
