import { LicenseState } from './LicensePolicy';

export interface LicenseReminderNotification {
  daysRemaining: number;
  status: LicenseState;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  title: string;
  message: string;
  aiSpeechSuggestion: string;
}

export class LicenseNotificationEngine {
  public static evaluateNotification(
    daysRemaining: number,
    status: LicenseState,
    schoolName: string = 'TK ASY SYIFA'
  ): LicenseReminderNotification {
    if (status === 'SUSPENDED') {
      return {
        daysRemaining: 0,
        status: 'SUSPENDED',
        severity: 'CRITICAL',
        title: 'Lisensi Diberhentikan Sementara (Suspended)',
        message: `Lisensi ${schoolName} dalam status ditangguhkan. Hubungi Super Admin Yayasan/Pengembang untuk pemulihan hak akses.`,
        aiSpeechSuggestion: 'Status lisensi sekolah ditangguhkan sementara. Asy sarankan hubungi Administrator Utama.'
      };
    }

    if (status === 'EXPIRED' || status === 'READ_ONLY') {
      return {
        daysRemaining: 0,
        status: 'READ_ONLY',
        severity: 'CRITICAL',
        title: 'Lisensi Telah Kadaluarsa (Moda Read-Only Safe Mode)',
        message: `Masa lisensi ${schoolName} telah habis. Seluruh data sekolah AMAN dan dapat dilihat/diunduh, namun pembuatan & pengeditan data baru dibatasi hingga lisensi diperbarui.`,
        aiSpeechSuggestion: 'Lisensi telah kadaluarsa, namun tenang Ayah/Bunda/Ustadz, seluruh data sekolah aman tersimpan di Safe Mode!'
      };
    }

    if (status === 'GRACE_PERIOD') {
      return {
        daysRemaining,
        status: 'GRACE_PERIOD',
        severity: 'WARNING',
        title: 'Masa Tenggang Lisensi (Grace Period)',
        message: `Sistem ${schoolName} memasuki masa tenggang Grace Period (${Math.abs(daysRemaining)} hari tersisa). Harap lakukan perpanjangan lisensi sebelum Safe Mode diaktifkan.`,
        aiSpeechSuggestion: 'Sistem sekolah dalam masa tenggang Grace Period. Segera perbarui lisensi agar aktivitas pembelajaran berjalan lancar!'
      };
    }

    if (daysRemaining <= 1) {
      return {
        daysRemaining: 1,
        status: 'ACTIVE',
        severity: 'CRITICAL',
        title: 'Lisensi Berakhir Hari Ini!',
        message: `Lisensi SIM ${schoolName} akan berakhir hari ini! Lakukan pembaruan kunci lisensi hari ini.`,
        aiSpeechSuggestion: 'Lisensi sekolah berakhir hari ini! Mari perbarui kunci lisensi sekarang.'
      };
    }

    if (daysRemaining <= 3) {
      return {
        daysRemaining,
        status: 'ACTIVE',
        severity: 'CRITICAL',
        title: `Lisensi Berakhir Dalam ${daysRemaining} Hari`,
        message: `Tersisa ${daysRemaining} hari masa berlaku lisensi ${schoolName}. Hubungi administrator untuk kunci perpanjangan.`,
        aiSpeechSuggestion: `Masa berlaku lisensi tersisa ${daysRemaining} hari lagi. Asy ingatkan untuk koordinasi perpanjangan ya.`
      };
    }

    if (daysRemaining <= 7) {
      return {
        daysRemaining,
        status: 'ACTIVE',
        severity: 'WARNING',
        title: `Peringatan 7 Hari: Masa Lisensi`,
        message: `Masa aktif lisensi ${schoolName} tersisa ${daysRemaining} hari. Segera siapkan berkas perpanjangan sewa/langganan.`,
        aiSpeechSuggestion: `Lisensi sekolah aktif 7 hari lagi. Asy bantu siapkan informasi perpanjangan lisensi.`
      };
    }

    if (daysRemaining <= 14) {
      return {
        daysRemaining,
        status: 'ACTIVE',
        severity: 'WARNING',
        title: `Peringatan 14 Hari Lisensi`,
        message: `Sisa masa lisensi 2 minggu (${daysRemaining} hari) untuk ${schoolName}.`,
        aiSpeechSuggestion: `Masa lisensi tersisa 2 minggu lagi. Semua data dan laporan tersimpan rapi.`
      };
    }

    if (daysRemaining <= 30) {
      return {
        daysRemaining,
        status: 'ACTIVE',
        severity: 'INFO',
        title: `Pengingat Bulanan: Lisensi 30 Hari`,
        message: `Masa lisensi ${schoolName} tersisa ${daysRemaining} hari lagi.`,
        aiSpeechSuggestion: `Lisensi sekolah aktif dengan baik! Masih ada 30 hari hingga jadwal perpanjangan.`
      };
    }

    if (daysRemaining <= 60) {
      return {
        daysRemaining,
        status: 'ACTIVE',
        severity: 'INFO',
        title: `Pengingat 60 Hari Lisensi`,
        message: `Masa aktif lisensi tersisa ${daysRemaining} hari.`,
        aiSpeechSuggestion: 'Sistem operasional sekolah berjalan lancar dan berlisensi resmi.'
      };
    }

    if (daysRemaining <= 90) {
      return {
        daysRemaining,
        status: 'ACTIVE',
        severity: 'INFO',
        title: `Pengingat 90 Hari Lisensi`,
        message: `Masa aktif lisensi tersisa ${daysRemaining} hari (3 bulan).`,
        aiSpeechSuggestion: 'Lisensi aktif dan terlindungi penuh di bawah pengawasan Super Admin.'
      };
    }

    return {
      daysRemaining,
      status: 'ACTIVE',
      severity: 'SUCCESS',
      title: 'Lisensi Enterprise Aktif & Valid',
      message: `Lisensi ${schoolName} aktif hingga ${daysRemaining} hari mendatang dengan garansi layanan penuh TADE v1.0.5 LTS.`,
      aiSpeechSuggestion: 'Alhamdulillah! Lisensi SIM TK ASY SYIFA aktif penuh dan insya Allah berkah!'
    };
  }
}
