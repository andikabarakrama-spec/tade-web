import { UserRole } from '../../types';

export type SignatureStepStatus = 'PENDING' | 'SIGNED' | 'REJECTED' | 'BYPASSED';
export type DocumentVerificationStatus = 'DRAFT' | 'IN_REVIEW' | 'FULLY_EXECUTED' | 'INVALIDATED';

export interface SignatureStep {
  stepIndex: number;
  role: UserRole;
  title: string;
  assignedToName?: string;
  assignedToUid?: string;
  status: SignatureStepStatus;
  signedAt?: string;
  signatureHash?: string;
  verificationCode?: string;
  signerRemarks?: string;
  ipAddress?: string;
}

export interface OfficialDocumentSeal {
  documentId: string;
  documentNumber: string;
  documentTitle: string;
  category: 'SURAT_KEPUTUSAN' | 'RAPOR_SANTRI' | 'LAPORAN_KEUANGAN' | 'IJAZAH' | 'BERITA_ACARA';
  createdAt: string;
  createdByUid: string;
  createdByName: string;
  verificationStatus: DocumentVerificationStatus;
  approvalChain: SignatureStep[];
  contentDigest: string;
  qrVerificationUrl: string;
  isImmutable: boolean;
}

export class DigitalSignatureReadiness {
  private static instance: DigitalSignatureReadiness;
  private documents: Map<string, OfficialDocumentSeal> = new Map();

  private constructor() {
    this.seedSampleOfficialDocs();
  }

  public static getInstance(): DigitalSignatureReadiness {
    if (!DigitalSignatureReadiness.instance) {
      DigitalSignatureReadiness.instance = new DigitalSignatureReadiness();
    }
    return DigitalSignatureReadiness.instance;
  }

  private seedSampleOfficialDocs() {
    const doc1: OfficialDocumentSeal = {
      documentId: 'DOC-SK-2026-001',
      documentNumber: '001/YYS-ASY/SK/VIII/2026',
      documentTitle: 'Surat Keputusan Pengangkatan Tim Pengembang TADE RC95',
      category: 'SURAT_KEPUTUSAN',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      createdByUid: 'admin-01',
      createdByName: 'Sekretariat Yayasan Asy-Syifa',
      verificationStatus: 'FULLY_EXECUTED',
      contentDigest: 'SHA256-7E8B901AC842F559A73C002',
      qrVerificationUrl: 'https://asy-syifa.sch.id/verify/DOC-SK-2026-001',
      isImmutable: true,
      approvalChain: [
        {
          stepIndex: 1,
          role: 'KEPALA_SEKOLAH',
          title: 'Verifikator Administrasi (Kepala Sekolah)',
          assignedToName: 'Ustadzah Nurul Hidayah, S.Pd',
          assignedToUid: 'ks-01',
          status: 'SIGNED',
          signedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
          signatureHash: 'SIG-KS-88921A93',
          verificationCode: 'VER-KS-2026-091',
          signerRemarks: 'Dokumen telah diselaraskan dengan tata tertib sekolah.'
        },
        {
          stepIndex: 2,
          role: 'KETUA_YAYASAN',
          title: 'Pengesahan Pimpinan (Ketua Yayasan)',
          assignedToName: 'H. Andika Barakrama, S.Kom',
          assignedToUid: 'ky-01',
          status: 'SIGNED',
          signedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
          signatureHash: 'SIG-KY-99014B11',
          verificationCode: 'VER-KY-2026-772',
          signerRemarks: 'Disetujui untuk dipublikasikan ke seluruh sivitas.'
        }
      ]
    };

    const doc2: OfficialDocumentSeal = {
      documentId: 'DOC-RAP-2026-G1',
      documentNumber: 'RAPOR/TK-A/2026/08',
      documentTitle: 'Buku Rapor Capaian Pembelajaran Santri Kelompok A - Semester Ganjil',
      category: 'RAPOR_SANTRI',
      createdAt: new Date().toISOString(),
      createdByUid: 'guru-01',
      createdByName: 'Ustadzah Fatimah, S.Pd (Wali Kelas A1)',
      verificationStatus: 'IN_REVIEW',
      contentDigest: 'SHA256-FA3341908CD1128E619',
      qrVerificationUrl: 'https://asy-syifa.sch.id/verify/DOC-RAP-2026-G1',
      isImmutable: false,
      approvalChain: [
        {
          stepIndex: 1,
          role: 'GURU',
          title: 'Penyusun Rapor (Guru Kelas)',
          assignedToName: 'Ustadzah Fatimah, S.Pd',
          assignedToUid: 'guru-01',
          status: 'SIGNED',
          signedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          signatureHash: 'SIG-GR-44510B82',
          verificationCode: 'VER-GR-2026-004',
          signerRemarks: 'Data penilaian hafalan surat pendek dan adab telah lengkap.'
        },
        {
          stepIndex: 2,
          role: 'KEPALA_SEKOLAH',
          title: 'Pengesahan Kepala Sekolah',
          assignedToName: 'Ustadzah Nurul Hidayah, S.Pd',
          assignedToUid: 'ks-01',
          status: 'PENDING',
          signerRemarks: 'Menunggu review hasil evaluasi belajar.'
        }
      ]
    };

    this.documents.set(doc1.documentId, doc1);
    this.documents.set(doc2.documentId, doc2);
  }

  public getAllDocuments(): OfficialDocumentSeal[] {
    return Array.from(this.documents.values());
  }

  public getDocumentById(id: string): OfficialDocumentSeal | undefined {
    return this.documents.get(id);
  }

  public executeSignStep(
    documentId: string, 
    stepIndex: number, 
    signerName: string, 
    signerRole: UserRole, 
    remarks: string
  ): { success: boolean; message: string; doc?: OfficialDocumentSeal } {
    const doc = this.documents.get(documentId);
    if (!doc) {
      return { success: false, message: 'Dokumen tidak ditemukan.' };
    }

    if (doc.isImmutable && doc.verificationStatus === 'FULLY_EXECUTED') {
      return { success: false, message: 'Dokumen sudah berstatus final dan terkunci (Immutable).' };
    }

    const step = doc.approvalChain.find(s => s.stepIndex === stepIndex);
    if (!step) {
      return { success: false, message: 'Tahapan tanda tangan tidak valid.' };
    }

    if (step.role !== signerRole && signerRole !== 'SUPER_ADMIN') {
      return { success: false, message: `Hanya peran ${step.role} yang berwenang menandatangani tahapan ini.` };
    }

    // Sign the step
    step.status = 'SIGNED';
    step.assignedToName = signerName;
    step.signedAt = new Date().toISOString();
    step.signatureHash = `SIG-${signerRole.substring(0, 2)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    step.verificationCode = `VER-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    step.signerRemarks = remarks || 'Ditandatangani secara resmi di SIM TADE.';

    // Check if all steps are completed
    const allSigned = doc.approvalChain.every(s => s.status === 'SIGNED');
    if (allSigned) {
      doc.verificationStatus = 'FULLY_EXECUTED';
      doc.isImmutable = true;
    } else {
      doc.verificationStatus = 'IN_REVIEW';
    }

    this.documents.set(documentId, { ...doc });
    return { success: true, message: 'Tanda tangan resmi berhasil dibubuhkan.', doc };
  }
}
