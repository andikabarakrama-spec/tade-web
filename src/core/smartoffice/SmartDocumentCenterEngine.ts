import { UserRole } from '../../types/index';

export interface SmartDocumentItem {
  id: string;
  documentNumber: string;
  title: string;
  category: 'SURAT_RESMI' | 'LAPORAN_KEUANGAN' | 'TEMPLATE_FORMULIR' | 'ARSIP_AKADEMIK' | 'REGULASI_YAYASAN';
  createdAt: string;
  author: string;
  format: 'PDF' | 'DOCX' | 'XLSX' | 'CERT_QR';
  accessLevel: UserRole[];
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  tags: string[];
  fileSizeKb: number;
}

export class SmartDocumentCenterEngine {
  private static instance: SmartDocumentCenterEngine;

  private documents: SmartDocumentItem[] = [
    {
      id: 'DOC-2026-001',
      documentNumber: '089/TK-ASY/KET/VIII/2026',
      title: 'Surat Keputusan Pengangkatan Tim Pengembang Smart Office 2026',
      category: 'SURAT_RESMI',
      createdAt: '2026-08-15T08:00:00Z',
      author: 'Ketua Yayasan Asy-Syifa',
      format: 'PDF',
      accessLevel: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'],
      status: 'ACTIVE',
      tags: ['SK', 'SmartOffice', 'Yayasan', 'Otorisasi'],
      fileSizeKb: 245
    },
    {
      id: 'DOC-2026-002',
      documentNumber: 'LAP-KEU-2026-08',
      title: 'Laporan Rekonsiliasi Penerimaan SPP & Kas Syahriah Agustus 2026',
      category: 'LAPORAN_KEUANGAN',
      createdAt: '2026-08-16T10:30:00Z',
      author: 'Bendahara Sekolah & SIM Finance',
      format: 'XLSX',
      accessLevel: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'],
      status: 'ACTIVE',
      tags: ['Keuangan', 'SPP', 'Kas', 'Agustus2026'],
      fileSizeKb: 512
    },
    {
      id: 'DOC-2026-003',
      documentNumber: 'TPL-PPDB-2026-V2',
      title: 'Formulir Standar Verifikasi & Wawancara Calon Santri PAUD',
      category: 'TEMPLATE_FORMULIR',
      createdAt: '2026-08-10T11:00:00Z',
      author: 'Panitia PPDB Asy-Syifa',
      format: 'DOCX',
      accessLevel: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'],
      status: 'ACTIVE',
      tags: ['PPDB', 'Formulir', 'Template', 'Wawancara'],
      fileSizeKb: 128
    },
    {
      id: 'DOC-2026-004',
      documentNumber: 'ARS-RAP-2026-SM1',
      title: 'Arsip Rekapitulasi Penilaian E-Rapor Semester 1 Tahun Ajaran 2025/2026',
      category: 'ARSIP_AKADEMIK',
      createdAt: '2026-08-12T14:00:00Z',
      author: 'Koordinator Akademik & Erapor',
      format: 'PDF',
      accessLevel: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'],
      status: 'ACTIVE',
      tags: ['Erapor', 'Penilaian', 'Arsip', 'Akademik'],
      fileSizeKb: 1024
    },
    {
      id: 'DOC-2026-005',
      documentNumber: 'REG-YYS-004/2026',
      title: 'Pedoman Tata Kelola Kedaulatan Data & Keamanan Arsip Digital Asy-Syifa',
      category: 'REGULASI_YAYASAN',
      createdAt: '2026-08-01T09:00:00Z',
      author: 'Dewan Pengawas & Guardian Directorate',
      format: 'PDF',
      accessLevel: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'],
      status: 'ACTIVE',
      tags: ['Kedaulatan', 'Regulasi', 'TataKelola', 'Guardian'],
      fileSizeKb: 380
    }
  ];

  public static getInstance(): SmartDocumentCenterEngine {
    if (!SmartDocumentCenterEngine.instance) {
      SmartDocumentCenterEngine.instance = new SmartDocumentCenterEngine();
    }
    return SmartDocumentCenterEngine.instance;
  }

  public searchDocuments(query: string, category?: string, role?: UserRole): SmartDocumentItem[] {
    const q = query.toLowerCase().trim();
    let results = this.documents;

    if (role) {
      results = results.filter(d => d.accessLevel.includes(role));
    }

    if (category && category !== 'ALL') {
      results = results.filter(d => d.category === category);
    }

    if (!q) return results;

    return results.filter(
      d =>
        d.title.toLowerCase().includes(q) ||
        d.documentNumber.toLowerCase().includes(q) ||
        d.author.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  public getDocumentStats(): {
    totalDocuments: number;
    totalSizeKb: number;
    byCategory: Record<string, number>;
  } {
    const byCat: Record<string, number> = {};
    let totalSize = 0;
    this.documents.forEach(d => {
      byCat[d.category] = (byCat[d.category] || 0) + 1;
      totalSize += d.fileSizeKb;
    });

    return {
      totalDocuments: this.documents.length,
      totalSizeKb: totalSize,
      byCategory: byCat
    };
  }
}
