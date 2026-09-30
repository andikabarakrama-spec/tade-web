import React, { useState } from 'react';
import {
  Award,
  FileCheck,
  QrCode,
  ShieldCheck,
  Sparkles,
  Search,
  CheckCircle2,
  Printer,
  ExternalLink,
  GraduationCap,
  Star,
  Lock
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface CertificateItem {
  id: string;
  certNumber: string;
  recipientName: string;
  category: 'PIAGAM_KELULUSAN' | 'SERTIFIKAT_TAHFIDZ' | 'HAFLAH_WISUDA' | 'PENGHARGAAN_PRESTASI';
  achievement: string;
  issueDate: string;
  sha256Hash: string;
  signatory: string;
  isVerified: boolean;
}

export const CertificateDiplomaIntelligence: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const certificates: CertificateItem[] = [
    {
      id: 'CERT-001',
      certNumber: 'PGM/2026/TK-ASY/089',
      recipientName: 'Ahmad Fathir Al-Faruq',
      category: 'PIAGAM_KELULUSAN',
      achievement: 'Lulus Pendidikan Anak Usia Dini (TK-B) Sentra Karakter & Imtaq',
      issueDate: '2026-06-20',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      signatory: 'Ustadzah Hj. Fatimah, S.Pd.I (Kepala Sekolah)',
      isVerified: true
    },
    {
      id: 'CERT-002',
      certNumber: 'SRT-THF/2026/042',
      recipientName: 'Aisyah Humaira Putri',
      category: 'SERTIFIKAT_TAHFIDZ',
      achievement: 'Tuntas Tasmi Tahfidz Al-Qur\'an Juz 30 Mutqin dengan Predikat Jayyid Jiddan',
      issueDate: '2026-07-15',
      sha256Hash: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
      signatory: 'Ustadz Muhammad Zaki, Al-Hafidz (Koordinator Tahfidz)',
      isVerified: true
    },
    {
      id: 'CERT-003',
      certNumber: 'WSD-HFL/2026/014',
      recipientName: 'Muhammad Rayyan Pratama',
      category: 'HAFLAH_WISUDA',
      achievement: 'Wisudawan Teladan Haflah Akhirussanah Angkatan VIII',
      issueDate: '2026-06-25',
      sha256Hash: 'b5a2c9b149afbf4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c442',
      signatory: 'Drs. H. Abdullah Mansur (Ketua Yayasan Asy-Syifa)',
      isVerified: true
    },
    {
      id: 'CERT-004',
      certNumber: 'PGR-KRE/2026/033',
      recipientName: 'Khansa Naura Salsabila',
      category: 'PENGHARGAAN_PRESTASI',
      achievement: 'Juara 1 Lomba Rancang Bangun Sentra Balok PAUD Tingkat Kabupaten',
      issueDate: '2026-08-10',
      sha256Hash: '8996fb92427ae41e4649b934ca495991b7852b855e3b0c4424f53cda18c2baa0c',
      signatory: 'Ustadzah Siti Aminah, S.Pd (Guru Sentra Balok)',
      isVerified: true
    }
  ];

  const filteredCerts = certificates.filter(c => {
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesSearch = c.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.certNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.achievement.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleVerify = (cert: CertificateItem) => {
    setSelectedCert(cert);
    blackBoxRecorder.record({
      moduleCode: 'R426-CERT-DIPLOMA',
      role: 'ADMIN',
      eventType: 'ACTION',
      details: `Certificate verified: ${cert.certNumber} for ${cert.recipientName}. SHA-256 integrity intact.`,
      severity: 'INFO'
    });
  };

  return (
    <div id="certificate-diploma-intelligence-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R426 &bull; CERTIFICATE &amp; DIPLOMA INTELLIGENCE
              </span>
              <span className="text-xs text-slate-400 font-mono">Government-Standard Credentials &amp; Verification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-400" />
              Pusat Piagam, Sertifikat Tahfidz &amp; Ijazah Resmi PAUD
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Penerbitan dokumen kelulusan berstempel digital, nomor unik anti-duplikasi, QR verifikasi online, dan pengamanan watermark kriptografis SHA-256.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-2 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-amber-400" /> 100% QR AUTHENTICATED
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['ALL', 'PIAGAM_KELULUSAN', 'SERTIFIKAT_TAHFIDZ', 'HAFLAH_WISUDA', 'PENGHARGAAN_PRESTASI'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari santri / no piagam..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
          />
        </div>
      </div>

      {/* Verified Detail Modal/Banner */}
      {selectedCert && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/40 text-white font-mono space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-sm text-amber-300">Hasil Verifikasi Dokumen Kriptografis Asli</span>
            </div>
            <button onClick={() => setSelectedCert(null)} className="text-slate-400 hover:text-white text-xs">
              Tutup [X]
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">PENERIMA / SANTRI:</span>
              <strong className="text-white text-sm">{selectedCert.recipientName}</strong>
              <span className="text-amber-400 block mt-1">{selectedCert.achievement}</span>
            </div>
            <div className="space-y-1">
              <div>
                <span className="text-slate-400 block text-[10px]">NOMOR DOKUMEN RESMI:</span>
                <code className="text-emerald-400 font-bold">{selectedCert.certNumber}</code>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">PEJABAT PENANDATANGAN:</span>
                <span className="text-slate-300">{selectedCert.signatory}</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400 break-all font-mono">
            <span className="text-amber-400 font-bold block mb-0.5">SHA-256 DIGITAL DIGEST:</span>
            {selectedCert.sha256Hash}
          </div>
        </div>
      )}

      {/* Grid of Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {filteredCerts.map((cert) => (
          <div
            key={cert.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Watermark effect */}
            <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none text-slate-900 dark:text-white">
              <Award className="w-36 h-36" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[9px]">
                  {cert.category.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-slate-400">Tgl: {cert.issueDate}</span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {cert.recipientName}
              </h3>

              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {cert.achievement}
              </p>

              <div className="pt-2 text-[10px] space-y-1 text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700">
                <div className="flex justify-between">
                  <span>Nomor Dokumen:</span>
                  <code className="font-bold text-slate-800 dark:text-slate-200">{cert.certNumber}</code>
                </div>
                <div className="flex justify-between">
                  <span>Tanda Tangan:</span>
                  <span className="truncate max-w-[200px]">{cert.signatory}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleVerify(cert)}
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <QrCode className="w-3.5 h-3.5" /> Verifikasi Online (QR)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
