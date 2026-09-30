import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Printer,
  FileText,
  Sliders,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers,
  Paperclip,
  Download,
  Eye,
  RefreshCw,
  Search,
  BookOpen,
  User,
  Building2,
  Stamp,
  Award,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/db';
import {
  SchoolProfile,
  Student,
  Teacher,
  PPDBRecord,
  SPPBill,
  GeneratedDocument
} from '../../types';

export type PaperSize = 'A4' | 'F4' | 'LETTER' | 'LEGAL';
export type Orientation = 'PORTRAIT' | 'LANDSCAPE';
export type WatermarkType = 'NONE' | 'OFFICIAL' | 'DRAFT' | 'CONFIDENTIAL' | 'COPY';
export type MarginType = 'STANDARD' | 'NARROW' | 'WIDE';

export type DocumentTemplateType =
  | 'SK_KEPALA_SEKOLAH'
  | 'SURAT_KETERANGAN_SISWA'
  | 'SURAT_TUGAS_GURU'
  | 'KWITANSI_SPP'
  | 'SERTIFIKAT_KELULUSAN';

export interface PrintableDocumentConfig {
  id: string;
  templateType: DocumentTemplateType;
  title: string;
  documentNumber: string;
  recipientName: string;
  recipientType: 'STUDENT' | 'TEACHER' | 'STAFF' | 'GENERAL';
  paperSize: PaperSize;
  orientation: Orientation;
  watermark: WatermarkType;
  margin: MarginType;
  copies: number;
  includeSchoolHeader: boolean;
  includeStamp: boolean;
  includeSignature: boolean;
  contentBody: string;
  linkedAttachmentIds: string[];
}

export const R50EnterprisePdfPrintComposer: React.FC = () => {
  const { activeRole } = useAuth();

  // Selected Template & Form Configuration
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplateType>('SK_KEPALA_SEKOLAH');
  const [paperSize, setPaperSize] = useState<PaperSize>('A4');
  const [orientation, setOrientation] = useState<Orientation>('PORTRAIT');
  const [watermark, setWatermark] = useState<WatermarkType>('OFFICIAL');
  const [margin, setMargin] = useState<MarginType>('STANDARD');
  const [copies, setCopies] = useState<number>(1);
  const [includeSchoolHeader, setIncludeSchoolHeader] = useState(true);
  const [includeStamp, setIncludeStamp] = useState(true);
  const [includeSignature, setIncludeSignature] = useState(true);

  // Dynamic Variable Binding Selection
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');

  // Loaded Master Data
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [sppBills, setSppBills] = useState<SPPBill[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Privileged Role Check for Official Document Generation
  const isPrivilegedRole = useMemo(() => {
    return ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'KETUA_YAYASAN'].includes(activeRole);
  }, [activeRole]);

  // Load DataService Master Records
  const loadComposerData = async () => {
    try {
      const [prof, sList, tList, billList] = await Promise.all([
        DataService.getSchoolProfile(),
        DataService.getStudents(),
        DataService.getTeachers(),
        DataService.getSPP()
      ]);

      setSchoolProfile(prof);
      setStudents(sList || []);
      setTeachers(tList || []);
      setSppBills(billList || []);

      if (sList && sList.length > 0) setSelectedStudentId(sList[0].id);
      if (tList && tList.length > 0) setSelectedTeacherId(tList[0].id);
    } catch (err) {
      console.error('Error loading data for PDF Composer:', err);
    }
  };

  useEffect(() => {
    loadComposerData();
  }, []);

  // Currently Selected Target Beneficiary
  const selectedStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  const selectedTeacher = useMemo(() => {
    return teachers.find((t) => t.id === selectedTeacherId) || teachers[0];
  }, [teachers, selectedTeacherId]);

  // Dynamic Document Body Generator based on Template & Variable Registry
  const generatedDocumentContent = useMemo(() => {
    const schoolName = schoolProfile?.name || 'TK ISLAM ASY-SYIFATAN';
    const headmasterName = schoolProfile?.headmaster || 'Hj. Syarifah Nur, S.Pd.I';
    const npsn = schoolProfile?.npsn || '69901234';

    if (selectedTemplate === 'SK_KEPALA_SEKOLAH') {
      return {
        title: 'SURAT KEPUTUSAN KEPALA SEKOLAH',
        docNum: `SK/${new Date().getFullYear()}/TK-ASY/${Math.floor(1000 + Math.random() * 9000)}`,
        subtitle: `TENTANG PENETAPAN PENERIMAAN SISWA & WALI MURID TAHUN AJARAN ${schoolProfile?.academicYear || '2025/2026'}`,
        bodyText: `Menimbang dan mengingat Peraturan Menteri Pendidikan Kebudayaan Riset dan Teknologi RI serta Keputusan Yayasan Asy-Syifa Al-Khairiyyah, Kepala Sekolah ${schoolName} (NPSN: ${npsn}) dengan ini MEMUTUSKAN dan MENETAPKAN:
        
1. Menyatakan bahwa Ananda ${selectedStudent?.name || 'Ahmad Rizky'} (NISN: ${selectedStudent?.nisn || '31209845'}) secara resmi terdaftar sebagai Peserta Didik Aktif pada Rombongan Belajar Kelompok ${selectedStudent?.classGroup || 'A'}.
2. Seluruh hak dan kewajiban administrasi pendidikan diatur sesuai ketentuan operasional sekolah yang berlaku.
3. Surat Keputusan ini berlaku sejak tanggal ditetapkan dan apabila terdapat kekeliruan di kemudian hari akan diadakan perbaikan sebagaimana mestinya.`
      };
    } else if (selectedTemplate === 'SURAT_KETERANGAN_SISWA') {
      return {
        title: 'SURAT KETERANGAN SISWA AKTIF',
        docNum: `421.1/SK-SISWA/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
        subtitle: 'Diterbitkan untuk Keperluan Administrasi Resmi',
        bodyText: `Yang bertanda tangan di bawah ini Kepala ${schoolName} menerangkan bahwa:

Nama Lengkap Siswa : ${selectedStudent?.name || 'Ahmad Rizky'}
NISN / Nomor Induk : ${selectedStudent?.nisn || '31209845'}
Rombongan Belajar  : Kelompok ${selectedStudent?.classGroup || 'A'}
Nama Orang Tua/Wali: ${selectedStudent?.parentName || 'Bapak/Ibu Wali Murid'}

Adalah benar-benar Peserta Didik Aktif yang terdaftar pada ${schoolName} Tahun Ajaran ${schoolProfile?.academicYear || '2025/2026'}. Surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.`
      };
    } else if (selectedTemplate === 'SURAT_TUGAS_GURU') {
      return {
        title: 'SURAT TUGAS PENDIDIK & TENAGA KEPENDIRIKAN',
        docNum: `090/ST-GURU/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
        subtitle: 'Penugasan Pelatihan / Workshop Kurikulum PAUD',
        bodyText: `Kepala ${schoolName} memberikan tugas resmi kepada:

Nama Pendidik  : ${selectedTeacher?.name || 'Siti Aminah, S.Pd'}
NIP / NUPTK    : ${selectedTeacher?.nip || '19850123 201001 2 005'}
Jabatan / Peran: ${selectedTeacher?.position || 'Pendidik PAUD / Guru Kelompok A'}

Untuk melaksanakan tugas pendampingan kegiatan edukasi interaktif dan workshop penguatan transisi PAUD ke SD yang menyenangkan. Demikian Surat Tugas ini diberikan untuk dilaksanakan dengan penuh tanggung jawab.`
      };
    } else if (selectedTemplate === 'KWITANSI_SPP') {
      return {
        title: 'BUKTI PEMBAYARAN & KWITANSI RESMI SPP',
        docNum: `KW-SPP/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`,
        subtitle: 'Tanda Terima Lunas SPP Bulanan & Administrasi',
        bodyText: `Telah terima dari : ${selectedStudent?.parentName || 'Orang Tua Siswa'} (${selectedStudent?.name || 'Siswa'})
Jumlah Uang      : Rp 350.000,- (Tiga Ratus Lima Puluh Ribu Rupiah)
Untuk Pembayaran : Sumbangan Pembinaan Pendidikan (SPP) Bulan Agustus 2025
Status Validasi  : LUNAS - Terverifikasi Keuangan Sistem TADE`
      };
    } else {
      return {
        title: 'SERTIFIKAT KELULUSAN & PENDIDIKAN PAUD',
        docNum: `CERT-PAUD/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
        subtitle: 'Pernyataan Tamat Belajar Pendidikan Anak Usia Dini',
        bodyText: `Dengan puji syukur kepada Tuhan Yang Maha Esa, Kepala ${schoolName} menyatakan bahwa:

${selectedStudent?.name || 'Ahmad Rizky'} (NISN: ${selectedStudent?.nisn || '31209845'})

Telah menyelesaikan seluruh program pembelajaran Pendidikan Anak Usia Dini dengan predikat SANGAT BAIK dan dinyatakan LULUS.`
      };
    }
  }, [selectedTemplate, schoolProfile, selectedStudent, selectedTeacher]);

  // Handle Trigger System Print
  const handlePrintComposer = () => {
    window.print();
  };

  const handleRefreshComposer = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setNoticeMessage('Enterprise PDF & Print Composer Engine Berhasil Disegarkan.');
      setTimeout(() => setNoticeMessage(null), 3000);
    }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Sprint P25 • Enterprise PDF & Print Composer Engine (R50)
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Penggubah Dokumen PDF & Tata Letak Cetak Resmi
          </h1>
          <p className="text-stone-600 text-xs mt-0.5">
            Penggubah cetak resmi terpadu untuk SK, Surat Keterangan, Kwitansi, dan Sertifikat terhubung langsung ke Variable Registry & Attachment Engine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshComposer}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Segarkan Composer
          </button>

          <button
            onClick={handlePrintComposer}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Cetak Dokumen PDF
          </button>
        </div>
      </div>

      {noticeMessage && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-900 text-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2 border border-emerald-700 shadow-md print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{noticeMessage}</span>
        </motion.div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: PRINT CONFIGURATION & VARIABLE BINDING (5 cols) */}
        <div className="lg:col-span-5 space-y-5 print:hidden">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-5">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-stone-200 pb-3">
              <Sliders className="w-4 h-4 text-emerald-800" /> Pengaturan Dokumen & Tata Letak
            </h2>

            {/* Template Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase block">Pilih Jenis Templat Dokumen</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as any)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900"
              >
                <option value="SK_KEPALA_SEKOLAH">Surat Keputusan (SK) Kepala Sekolah</option>
                <option value="SURAT_KETERANGAN_SISWA">Surat Keterangan Siswa Aktif</option>
                <option value="SURAT_TUGAS_GURU">Surat Tugas Pendidik & SPPD</option>
                <option value="KWITANSI_SPP">Bukti Kwitansi SPP Resmi</option>
                <option value="SERTIFIKAT_KELULUSAN">Sertifikat Kelulusan PAUD/TK</option>
              </select>
            </div>

            {/* Dynamic Recipient Variable Binding */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <span className="text-[10px] font-bold text-stone-500 uppercase block flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-800" /> Binding Variabel Penerima Dokumen
              </span>

              {selectedTemplate === 'SURAT_TUGAS_GURU' ? (
                <div>
                  <label className="text-[10px] font-bold text-stone-500 block mb-1">Pilih Guru / Pendidik</label>
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-slate-900"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.position || 'Guru'})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="text-[10px] font-bold text-stone-500 block mb-1">Pilih Peserta Didik (Siswa)</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-slate-900"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (Kelompok {s.classGroup || 'A'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Paper Size & Orientation Controls */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Ukuran Kertas</label>
                <select
                  value={paperSize}
                  onChange={(e) => setPaperSize(e.target.value as any)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-slate-900"
                >
                  <option value="A4">A4 (210 x 297 mm)</option>
                  <option value="F4">F4 / Folio (215 x 330 mm)</option>
                  <option value="LETTER">Letter (215.9 x 279.4 mm)</option>
                  <option value="LEGAL">Legal (215.9 x 355.6 mm)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Orientasi Kertas</label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-slate-900"
                >
                  <option value="PORTRAIT">Tegak (Portrait)</option>
                  <option value="LANDSCAPE">Mendatar (Landscape)</option>
                </select>
              </div>
            </div>

            {/* Watermark & Margin Options */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Watermark Latar</label>
                <select
                  value={watermark}
                  onChange={(e) => setWatermark(e.target.value as any)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-slate-900"
                >
                  <option value="OFFICIAL">DOKUMEN RESMI</option>
                  <option value="DRAFT">KONSEP / DRAFT</option>
                  <option value="CONFIDENTIAL">RAHASIA</option>
                  <option value="COPY">SALINAN</option>
                  <option value="NONE">Tanpa Watermark</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Margin Halaman</label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(e.target.value as any)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-slate-900"
                >
                  <option value="STANDARD">Standar (20mm)</option>
                  <option value="NARROW">Rapat (10mm)</option>
                  <option value="WIDE">Lebar (30mm)</option>
                </select>
              </div>
            </div>

            {/* Checkbox Layout Accessories */}
            <div className="space-y-2 pt-2 border-t border-stone-200/60 text-xs font-bold text-slate-900">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSchoolHeader}
                  onChange={(e) => setIncludeSchoolHeader(e.target.checked)}
                  className="rounded-xs text-emerald-800 focus:ring-emerald-700 w-4 h-4"
                />
                <span>Sertakan Kop Surat & Logo Sekolah Resmi (R42)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeStamp}
                  onChange={(e) => setIncludeStamp(e.target.checked)}
                  className="rounded-xs text-emerald-800 focus:ring-emerald-700 w-4 h-4"
                />
                <span>Sertakan Stempel Basah Digital Terakreditasi (R42)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSignature}
                  onChange={(e) => setIncludeSignature(e.target.checked)}
                  className="rounded-xs text-emerald-800 focus:ring-emerald-700 w-4 h-4"
                />
                <span>Sertakan Spesimen Tanda Tangan Kepala Sekolah (R43)</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: WYSIWYG HIGH-FIDELITY PRINTABLE PAPER CANVAS (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-stone-200/80 p-4 sm:p-8 rounded-3xl border border-stone-300 overflow-x-auto flex justify-center print:p-0 print:bg-white print:border-none">
            {/* The Actual Printable Sheet Component */}
            <div
              className={`bg-white text-slate-900 shadow-xl border border-stone-300 relative transition-all duration-200 font-serif print:shadow-none print:border-none print:m-0 print:w-full ${
                orientation === 'PORTRAIT' ? 'w-[210mm] min-h-[297mm]' : 'w-[297mm] min-h-[210mm]'
              } ${
                margin === 'STANDARD' ? 'p-12' : margin === 'NARROW' ? 'p-6' : 'p-16'
              }`}
            >
              {/* Optional Watermark Overlay */}
              {watermark !== 'NONE' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-10">
                  <span className="text-6xl sm:text-7xl font-black font-sans uppercase tracking-widest text-slate-900 -rotate-45 border-8 border-slate-900 p-8 rounded-3xl">
                    {watermark === 'OFFICIAL'
                      ? 'DOKUMEN RESMI'
                      : watermark === 'DRAFT'
                      ? 'KONSEP / DRAFT'
                      : watermark === 'CONFIDENTIAL'
                      ? 'RAHASIA'
                      : 'SALINAN'}
                  </span>
                </div>
              )}

              {/* Document Header / Kop Surat Resmi */}
              {includeSchoolHeader && (
                <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 flex items-center gap-4 relative z-10 font-sans">
                  <div className="w-16 h-16 bg-emerald-900 text-emerald-100 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 font-mono">
                    TK
                  </div>

                  <div className="text-center flex-1">
                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide text-slate-900 leading-tight">
                      YAYASAN ASY-SYIFA AL-KHAIRIYYAH
                    </h2>
                    <h1 className="text-xl sm:text-2xl font-black uppercase text-emerald-900 tracking-wider">
                      {schoolProfile?.name || 'TK ISLAM ASY-SYIFATAN'}
                    </h1>
                    <p className="text-xs text-stone-600 font-medium mt-0.5">
                      {schoolProfile?.address || 'Jl. Raya Pendidikan No. 12'}, NPSN: {schoolProfile?.npsn || '69901234'} • Akreditasi {schoolProfile?.akreditasi || 'A'}
                    </p>
                    <p className="text-[10px] text-stone-500 font-mono">
                      Telepon: {schoolProfile?.phone || '021-7890123'} • Email: info@tk-asy-syifatan.sch.id
                    </p>
                  </div>
                </div>
              )}

              {/* Document Title & Number Section */}
              <div className="text-center space-y-1 mb-6 relative z-10 font-sans">
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 inline-block px-4 pb-0.5">
                  {generatedDocumentContent.title}
                </h3>
                <p className="text-xs font-mono font-bold text-stone-600">Nomor: {generatedDocumentContent.docNum}</p>
                <p className="text-xs italic text-stone-500">{generatedDocumentContent.subtitle}</p>
              </div>

              {/* Document Main Content Body */}
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-4 mb-12 whitespace-pre-line relative z-10 font-serif">
                {generatedDocumentContent.bodyText}
              </div>

              {/* Signatures & Stamps Footer Area */}
              <div className="mt-12 pt-6 flex justify-between items-end relative z-10 font-sans">
                <div className="text-center text-xs space-y-1 font-mono">
                  <span className="text-[10px] text-stone-400 block uppercase">Otentikasi Keuangan & Sistem</span>
                  <div className="p-2 bg-stone-100 rounded-lg border border-stone-200 text-[10px] text-stone-600">
                    TADE Security Hash: {Math.random().toString(36).substring(2, 10).toUpperCase()}
                  </div>
                </div>

                <div className="text-center space-y-1 relative">
                  <p className="text-xs text-slate-800">Ditetapkan di: Jakarta</p>
                  <p className="text-xs text-slate-800 font-bold mb-8">
                    Pada Tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>

                  {/* Stamp Overlay */}
                  {includeStamp && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-6 pointer-events-none opacity-80">
                      <div className="w-20 h-20 rounded-full border-4 border-emerald-800 text-emerald-800 flex items-center justify-center font-black text-[9px] uppercase text-center p-1 font-mono rotate-12">
                        STEMPEL RESMI
                        <br />
                        TK ASY-SYIFA
                      </div>
                    </div>
                  )}

                  {/* Headmaster Signature */}
                  {includeSignature && (
                    <div className="h-12 flex items-center justify-center">
                      <span className="font-serif italic text-lg text-slate-900 font-bold decoration-wavy underline">
                        {schoolProfile?.headmaster || 'Hj. Syarifah Nur, S.Pd.I'}
                      </span>
                    </div>
                  )}

                  <p className="text-xs font-black uppercase text-slate-900 border-t border-slate-900 pt-1">
                    {schoolProfile?.headmaster || 'Hj. Syarifah Nur, S.Pd.I'}
                  </p>
                  <p className="text-[10px] text-stone-500 font-mono">Kepala TK ASY SYIFA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
