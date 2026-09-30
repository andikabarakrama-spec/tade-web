export interface AdministrativeJournalEntry {
  entryId: string;
  taskId: string;
  requester: string;
  role: string;
  action: string;
  previousState: string;
  resultingState: string;
  resultSummary?: string;
  recoveryNote?: string;
  approvalReference?: string;
  timestamp: string;
  hashVerification: string;
}

export class AdministrativeActivityJournal {
  private static instance: AdministrativeActivityJournal;
  private entries: AdministrativeJournalEntry[] = [
    {
      entryId: 'JRNL-2026-9001',
      taskId: 'TASK-2026-0801',
      requester: 'Ustadz Ahmad (Wali Kelas 1)',
      role: 'GURU',
      action: 'EXECUTE_ATTENDANCE_AGGREGATION',
      previousState: 'EXECUTING',
      resultingState: 'COMPLETED',
      resultSummary: 'Rekap kehadiran 28 santri berhasil disintesis tanpa anomali.',
      timestamp: '2026-08-17T08:00:15Z',
      hashVerification: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
    },
    {
      entryId: 'JRNL-2026-9002',
      taskId: 'TASK-2026-0802',
      requester: 'Staf Tata Usaha',
      role: 'ADMIN_TU',
      action: 'EXECUTE_SPP_RECAP',
      previousState: 'EXECUTING',
      resultingState: 'COMPLETED',
      resultSummary: 'Rekap penerimaan SPP Rp 21.000.000 terverifikasi dengan buku kas.',
      timestamp: '2026-08-17T08:15:30Z',
      hashVerification: 'SHA256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    },
    {
      entryId: 'JRNL-2026-9003',
      taskId: 'TASK-2026-0804',
      requester: 'Admin Keuangan',
      role: 'ADMIN_TU',
      action: 'SAVINGS_SETTLEMENT_GATE_CHECK',
      previousState: 'EXECUTING',
      resultingState: 'BLOCKED',
      resultSummary: 'Tertahan di Safety Gate: Batas otorisasi multi-sig diperlukan untuk pencairan > Rp 1.000.000.',
      recoveryNote: 'Human Handoff diterbitkan ke Kepala Madrasah.',
      timestamp: '2026-08-17T08:50:00Z',
      hashVerification: 'SHA256:5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
    }
  ];

  public static getInstance(): AdministrativeActivityJournal {
    if (!AdministrativeActivityJournal.instance) {
      AdministrativeActivityJournal.instance = new AdministrativeActivityJournal();
    }
    return AdministrativeActivityJournal.instance;
  }

  public getJournalEntries(): AdministrativeJournalEntry[] {
    return [...this.entries];
  }

  public logAction(entry: Omit<AdministrativeJournalEntry, 'entryId' | 'timestamp' | 'hashVerification'>): AdministrativeJournalEntry {
    const id = `JRNL-2026-${String(this.entries.length + 9001).padStart(4, '0')}`;
    const timestamp = new Date().toISOString();
    const hash = `SHA256:SIMULATED_${Date.now().toString(16)}_${Math.random().toString(16).slice(2, 10)}`;

    const newEntry: AdministrativeJournalEntry = {
      ...entry,
      entryId: id,
      timestamp,
      hashVerification: hash
    };

    this.entries.unshift(newEntry);
    return newEntry;
  }
}
