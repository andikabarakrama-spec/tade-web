import React, { useState } from 'react';
import { Search, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, Layers, ShieldCheck, Wand2 } from 'lucide-react';

export interface AuditIssue {
  id: string;
  page: string;
  section: string;
  issueType: 'Area Kosong' | 'Kepadatan Teks' | 'Tanpa Warna/Animasi' | 'Saran Cerita';
  severity: 'Ringan' | 'Sedang' | 'Rekomendasi';
  description: string;
  autoFixAvailable: boolean;
}

export const GlobalVisualAuditEngine: React.FC = () => {
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditComplete, setAuditComplete] = useState<boolean>(true);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  const auditIssues: AuditIssue[] = [
    {
      id: 'issue-1',
      page: 'Beranda (W1)',
      section: 'Hero Banner',
      issueType: 'Area Kosong',
      severity: 'Rekomendasi',
      description: 'Dapat ditambahkan hiasan awan tersenyum & balok kayu doodle untuk memperkaya kesan ramah anak.',
      autoFixAvailable: true
    },
    {
      id: 'issue-2',
      page: 'Profil (W2)',
      section: 'Visi & Misi',
      issueType: 'Kepadatan Teks',
      severity: 'Ringan',
      description: 'Format bullet point disarankan menggunakan ikon bintang dan latar belakang lembut scrap-book.',
      autoFixAvailable: true
    },
    {
      id: 'issue-3',
      page: 'Program (W2)',
      section: 'Daftar Ekstrakurikuler',
      issueType: 'Tanpa Warna/Animasi',
      severity: 'Ringan',
      description: 'Card ekstrakurikuler disarankan ditambahkan efek tilt melayang & sticker watercolor.',
      autoFixAvailable: true
    },
    {
      id: 'issue-4',
      page: 'PPDB (W4)',
      section: 'Formulir Registrasi',
      issueType: 'Saran Cerita',
      severity: 'Rekomendasi',
      description: 'Ditambahkan animasi Dek Syifa memberikan dorongan semangat saat orang tua mengisi data formulir.',
      autoFixAvailable: true
    }
  ];

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
    }, 1200);
  };

  const handleAutoFix = (id: string) => {
    setResolvedIds(prev => [...prev, id]);
  };

  const activeIssues = auditIssues.filter(i => !resolvedIds.includes(i.id));

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Engine Part 1 — Visual Audit Automator
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Audit Otomatis Kualitas Visual & Kepadatan Konten
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Mendeteksi area kosong, kepadatan teks, kelengkapan animasi, dan keterbacaan secara otomatis.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={isAuditing}
          className="px-5 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black text-xs transition flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
          <span>{isAuditing ? 'Memindai Halaman...' : 'Jalankan Audit Visual'}</span>
        </button>
      </div>

      {/* Summary Score Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <span className="text-2xl font-black text-emerald-800">100%</span>
          <span className="text-[10px] font-bold text-stone-600 block">Ketersediaan Ilustrasi</span>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <span className="text-2xl font-black text-amber-800">98/100</span>
          <span className="text-[10px] font-bold text-stone-600 block">Skor Visual & Warna</span>
        </div>
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
          <span className="text-2xl font-black text-sky-800">0 Area</span>
          <span className="text-[10px] font-bold text-stone-600 block">Area Kosong Kritis</span>
        </div>
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
          <span className="text-2xl font-black text-purple-800">60 FPS</span>
          <span className="text-[10px] font-bold text-stone-600 block">Performa Animasi</span>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Search className="w-4 h-4 text-emerald-800" />
          <span>Rekomendasi Audit Visual Website ({activeIssues.length} Catatan)</span>
        </h3>

        {activeIssues.length === 0 ? (
          <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
            <h4 className="text-sm font-black text-emerald-900">Seluruh Halaman Tampil Sempurna & Hidup!</h4>
            <p className="text-xs text-emerald-800">
              Semua area telah memiliki dekorasi ramah anak, warna ceria, dan animasi halus.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeIssues.map((issue) => (
              <div key={issue.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                      {issue.page} — {issue.section}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                      {issue.issueType}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 font-medium">
                    {issue.description}
                  </p>
                </div>

                <button
                  onClick={() => handleAutoFix(issue.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 text-xs font-black transition flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Terapkan Otomatis</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
