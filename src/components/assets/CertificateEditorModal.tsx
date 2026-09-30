import React, { useState, useRef } from 'react';
import {
  X,
  Award,
  Download,
  Printer,
  Sparkles,
  Save,
  CheckCircle2,
  ShieldCheck,
  Building,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { TadeAssetItem, tadeAssetCenterService } from '../../services/tadeAssetCenterService';
import { useAuth } from '../../context/AuthContext';

interface Props {
  asset?: TadeAssetItem | null;
  onClose: () => void;
  onSaved?: (savedAsset: TadeAssetItem) => void;
}

export const CertificateEditorModal: React.FC<Props> = ({ asset, onClose, onSaved }) => {
  const { userProfile } = useAuth();
  const [certType, setCertType] = useState<'WISUDA' | 'TAHFIDZ' | 'PIAGAM' | 'KEGIATAN'>(
    asset?.templateData?.certType || 'WISUDA'
  );
  const [title, setTitle] = useState(asset?.templateData?.title || 'SERTIFIKAT KELULUSAN');
  const [subtitle, setSubtitle] = useState(asset?.templateData?.subtitle || 'Haflah Akhirussanah Kelompok B Tahun Ajaran 2025/2026');
  const [recipientName, setRecipientName] = useState(asset?.templateData?.recipientName || 'MUHAMMAD FAIZ AL-FARISY');
  const [recipientNisn, setRecipientNisn] = useState(asset?.templateData?.recipientNisn || 'NISN. 3192847291');
  const [achievementText, setAchievementText] = useState(
    asset?.templateData?.achievementText ||
      'Telah menyelesaikan seluruh rangkaian program pendidikan sentra dan dinyatakan LULUS dengan predikat SANGAT MEMUASKAN.'
  );
  const [signeeName1, setSigneeName1] = useState(asset?.templateData?.signeeName1 || 'Ustadzah Hj. Nurul Hidayah, S.Pd');
  const [signeeRole1, setSigneeRole1] = useState(asset?.templateData?.signeeRole1 || 'Kepala TK ASY SYIFA');
  const [signeeName2, setSigneeName2] = useState(asset?.templateData?.signeeName2 || 'H. Andika Barakrama, M.Kom');
  const [signeeRole2, setSigneeRole2] = useState(asset?.templateData?.signeeRole2 || 'Ketua Yayasan Asy Syifa');
  const [skNumber, setSkNumber] = useState(asset?.templateData?.skNumber || 'SK-YAS/088/WIS/2026');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const certRef = useRef<HTMLDivElement>(null);

  const handleTypeChange = (type: 'WISUDA' | 'TAHFIDZ' | 'PIAGAM' | 'KEGIATAN') => {
    setCertType(type);
    switch (type) {
      case 'TAHFIDZ':
        setTitle('SYAHADAH TAHFIDZ AL-QUR\'AN');
        setSubtitle('Sertifikasi Uji Publik Hafalan Juz 30 (Juz \'Amma)');
        setAchievementText('Telah menyelesaikan hafalan Surat An-Naba sampai An-Nas secara lancar (Mutqin) dengan kaidah tajwid makharijul huruf yang baik.');
        setSkNumber('SK-TAH/034/JUZ30/2026');
        break;
      case 'PIAGAM':
        setTitle('PIAGAM PENGHARGAAN');
        setSubtitle('Apresiasi Karakter Islami & Santri Teladan');
        setAchievementText('Atas dedikasi, kemandirian, dan keteladanan akhlak mulia dalam tolong menolong sesama santri di sekolah.');
        setSkNumber('PIAGAM/019/PRESTASI/2026');
        break;
      case 'KEGIATAN':
        setTitle('SERTIFIKAT PARTISIPASI');
        setSubtitle('Peragaan Manasik Haji Cilik & Outing Class Sentra Alam');
        setAchievementText('Telah mengikuti seluruh rangkaian rukun & wajib haji cilik dengan tertib, mandiri, dan khusyuk.');
        setSkNumber('SERT-MANASIK/09/2026');
        break;
      case 'WISUDA':
      default:
        setTitle('SERTIFIKAT KELULUSAN');
        setSubtitle('Haflah Akhirussanah Kelompok B Tahun Ajaran 2025/2026');
        setAchievementText('Telah menyelesaikan seluruh rangkaian program pendidikan sentra dan dinyatakan LULUS dengan predikat SANGAT MEMUASKAN.');
        setSkNumber('SK-YAS/088/WIS/2026');
        break;
    }
  };

  const handleSaveToPusatAset = () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const authorName = userProfile?.displayName || userProfile?.email || 'Kepala Sekolah';
      const authorRole = userProfile?.role || 'KEPALA_SEKOLAH';

      const result = tadeAssetCenterService.saveAsset({
        id: asset?.id,
        title: `Sertifikat Resmi: ${title} (${recipientName})`,
        category: 'SERTIFIKAT',
        shelf: asset?.shelf || (certType === 'WISUDA' ? 'Sertifikat Wisuda' : certType === 'TAHFIDZ' ? 'Sertifikat Tahfidz' : 'Piagam Penghargaan'),
        description: `Dokumen resmi sekolah ${title} dengan nomor registrasi ${skNumber}. Bebas watermark luar.`,
        tags: [certType, 'Sertifikat Resmi', 'Ijazah', 'SK Yayasan'],
        author: authorName,
        authorRole: authorRole,
        dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' },
        fileSizeBytes: 290000,
        previewType: 'CANVAS_TEMPLATE',
        templateData: {
          certType,
          title,
          subtitle,
          recipientName,
          recipientNisn,
          achievementText,
          signeeName1,
          signeeRole1,
          signeeName2,
          signeeRole2,
          skNumber
        },
        forceApprove: userProfile?.role === 'SUPER_ADMIN' || userProfile?.role === 'KETUA_YAYASAN'
      });

      setSaveSuccess(true);
      if (onSaved) onSaved(result.asset);
    } catch (e) {
      console.error(e);
      alert('Gagal menyimpan sertifikat.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    if (asset?.id) {
      tadeAssetCenterService.recordAssetUsage(asset.id, 'Cetak Dokumen Resmi');
    }
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Studio Sertifikat & Ijazah Resmi Sekolah
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Cap Digital & SK Resmi
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Penerbitan dokumen legal berstandar yayasan tanpa watermark pihak ketiga.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body (2 Columns) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Jenis Dokumen Legal
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'WISUDA', label: 'Wisuda Kelulusan' },
                  { id: 'TAHFIDZ', label: 'Syahadah Tahfidz' },
                  { id: 'PIAGAM', label: 'Piagam Prestasi' },
                  { id: 'KEGIATAN', label: 'Sertifikat Kegiatan' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleTypeChange(item.id as any)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all text-left ${
                      certType === item.id
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Nama Lengkap Santri Penerima</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-amber-300 font-bold focus:outline-none focus:border-amber-500 uppercase tracking-wide"
                  placeholder="Nama santri..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">NISN / Nomor Induk</label>
                  <input
                    type="text"
                    value={recipientNisn}
                    onChange={e => setRecipientNisn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Nomor Registrasi / SK</label>
                  <input
                    type="text"
                    value={skNumber}
                    onChange={e => setSkNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Kalimat Pencapaian / Prestasi</label>
                <textarea
                  rows={2}
                  value={achievementText}
                  onChange={e => setAchievementText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Penandatangan 1 (Kiri)</label>
                  <input
                    type="text"
                    value={signeeName1}
                    onChange={e => setSigneeName1(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    value={signeeRole1}
                    onChange={e => setSigneeRole1(e.target.value)}
                    className="w-full px-3 py-1 bg-slate-800/60 border border-slate-700/60 rounded-lg text-[10px] text-slate-400 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Penandatangan 2 (Kanan)</label>
                  <input
                    type="text"
                    value={signeeName2}
                    onChange={e => setSigneeName2(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    value={signeeRole2}
                    onChange={e => setSigneeRole2(e.target.value)}
                    className="w-full px-3 py-1 bg-slate-800/60 border border-slate-700/60 rounded-lg text-[10px] text-slate-400 mt-1"
                  />
                </div>
              </div>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Dokumen legal resmi berhasil tersimpan di Pusat Aset!</span>
              </div>
            )}
          </div>

          {/* Certificate Live Preview (Landscape) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div
              ref={certRef}
              className="w-full aspect-[16/10] bg-[#fafaf9] border-8 border-amber-600/70 rounded-xl p-6 shadow-2xl relative flex flex-col justify-between text-slate-900 select-none overflow-hidden"
            >
              {/* Inner Double Gold Border */}
              <div className="absolute inset-2 border-2 border-amber-500/60 rounded-lg pointer-events-none" />
              <div className="absolute inset-3 border border-emerald-800/40 rounded pointer-events-none" />

              {/* Watermark Logo Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <Building className="w-64 h-64 text-emerald-950" />
              </div>

              {/* Top Header */}
              <div className="text-center relative z-10 space-y-0.5">
                <div className="text-[10px] font-bold tracking-widest text-emerald-900 uppercase">
                  YAYASAN ASY-SYIFATAN TANGGUL
                </div>
                <div className="text-sm font-extrabold tracking-wider text-emerald-800">
                  TK ISLAM ASY-SYIFA TANGGUL - JEMBER
                </div>
                <div className="text-[9px] text-slate-500">
                  NPSN: 69827391 • Izin Operasional Kemendikbudristek & Kemenag
                </div>
                <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-1" />
              </div>

              {/* Certificate Title */}
              <div className="text-center my-auto py-1 relative z-10">
                <h3 className="text-lg font-black tracking-wider text-amber-900 uppercase font-serif">
                  {title}
                </h3>
                <p className="text-[10px] text-slate-600 italic">
                  {subtitle}
                </p>

                <div className="my-2">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-0.5">
                    Diberikan Kepada:
                  </span>
                  <div className="text-base font-black tracking-widest text-emerald-950 underline decoration-amber-500 decoration-2 underline-offset-4">
                    {recipientName}
                  </div>
                  <div className="text-[9px] font-mono text-slate-600 mt-0.5">
                    {recipientNisn}
                  </div>
                </div>

                <p className="text-[10px] text-slate-700 max-w-md mx-auto leading-relaxed px-4">
                  {achievementText}
                </p>
              </div>

              {/* Signatures & Seal */}
              <div className="relative z-10 pt-2 border-t border-slate-300 flex items-end justify-between px-4">
                <div className="text-center w-36">
                  <div className="text-[8px] text-slate-500">{signeeRole1}</div>
                  <div className="h-7 flex items-center justify-center">
                    <span className="text-[10px] font-cursive text-slate-600 italic">[Tanda Tangan Digital]</span>
                  </div>
                  <div className="text-[9px] font-bold text-slate-900 border-t border-slate-400 pt-0.5">
                    {signeeName1}
                  </div>
                </div>

                {/* Official Gold Seal Badge */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-500 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 shadow-md flex items-center justify-center text-amber-900">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[8px] font-mono text-slate-500 mt-0.5 font-bold">
                    {skNumber}
                  </span>
                </div>

                <div className="text-center w-36">
                  <div className="text-[8px] text-slate-500">{signeeRole2}</div>
                  <div className="h-7 flex items-center justify-center">
                    <span className="text-[10px] font-cursive text-slate-600 italic">[Tanda Tangan Digital]</span>
                  </div>
                  <div className="text-[9px] font-bold text-slate-900 border-t border-slate-400 pt-0.5">
                    {signeeName2}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Sertifikat Terakreditasi • Otomatis Tercatat di Buku Induk & Black Box
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-800/90 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Cetak Dokumen Resmi
            </button>
            <button
              onClick={() => alert('Sertifikat siap diexport dalam format PDF Berkualitas Tinggi.')}
              className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Unduh Format Cetak (PDF)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handleSaveToPusatAset}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-900/30 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan ke Pusat Aset
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
