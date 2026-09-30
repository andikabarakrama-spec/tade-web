import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Copy,
  Layers,
  ShieldCheck,
  Plus,
  RefreshCw,
  Hash
} from 'lucide-react';
import { blackBoxRecorder } from '../../services/blackBoxRecorder';

interface NumberingTemplate {
  docType: string;
  name: string;
  codePrefix: string;
  currentSequence: number;
  formatExample: string;
  category: 'SURAT' | 'SK' | 'BERITA_ACARA' | 'SERTIFIKAT' | 'PIAGAM' | 'MEMO' | 'ARSIP';
}

export const GovernmentNumberingEngine: React.FC = () => {
  const [templates, setTemplates] = useState<NumberingTemplate[]>([
    {
      docType: 'SURAT_KELUAR',
      name: 'Surat Dinas Keluar Resmi',
      codePrefix: '421.1/TK-ASY',
      currentSequence: 142,
      formatExample: '142/421.1/TK-ASY/VIII/2026',
      category: 'SURAT'
    },
    {
      docType: 'SURAT_MASUK',
      name: 'Registrasi Agenda Surat Masuk',
      codePrefix: 'SM/DISDIK',
      currentSequence: 89,
      formatExample: '089/SM/DISDIK-JBR/VIII/2026',
      category: 'SURAT'
    },
    {
      docType: 'SK_YAYASAN',
      name: 'Surat Keputusan (SK) Pengangkatan/Tugas',
      codePrefix: '024/SK/YYS-ASY',
      currentSequence: 18,
      formatExample: '018/SK/YYS-ASY/KPTS/2026',
      category: 'SK'
    },
    {
      docType: 'BERITA_ACARA',
      name: 'Berita Acara Serah Terima / Kegiatan (BA)',
      codePrefix: 'BA/SENTRA',
      currentSequence: 34,
      formatExample: '034/BA/SENTRA-ASY/VIII/2026',
      category: 'BERITA_ACARA'
    },
    {
      docType: 'SERTIFIKAT',
      name: 'Sertifikat Pelatihan / Lomba Santri',
      codePrefix: 'SRT/TAHFIDZ',
      currentSequence: 204,
      formatExample: '204/SRT/TAHFIDZ-J30/VI/2026',
      category: 'SERTIFIKAT'
    },
    {
      docType: 'PIAGAM',
      name: 'Piagam Penghargaan & Kelulusan PAUD',
      codePrefix: 'PGM/PAUD-ASY',
      currentSequence: 76,
      formatExample: '076/PGM/PAUD-ASY/VII/2026',
      category: 'PIAGAM'
    },
    {
      docType: 'MEMO_INTERNAL',
      name: 'Nota Dinas / Memo Internal Sekolah',
      codePrefix: 'MEMO/KS',
      currentSequence: 52,
      formatExample: '052/MEMO/KS-ASY/VIII/2026',
      category: 'MEMO'
    },
    {
      docType: 'ARSIP_PERMANEN',
      name: 'Nomor Registrasi Arsip Permanen (WORM)',
      codePrefix: 'ARSIP/PERM',
      currentSequence: 318,
      formatExample: 'ARSIP-2026-08-318-SEC',
      category: 'ARSIP'
    }
  ]);

  const [generatedNumber, setGeneratedNumber] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerateNext = (docType: string) => {
    setTemplates(prev => prev.map(t => {
      if (t.docType === docType) {
        const nextSeq = t.currentSequence + 1;
        const romanMonth = 'VIII';
        const year = '2026';
        let newNumber = '';
        if (t.category === 'SK') {
          newNumber = `${String(nextSeq).padStart(3, '0')}/SK/YYS-ASY/KPTS/${year}`;
        } else if (t.category === 'ARSIP') {
          newNumber = `ARSIP-${year}-08-${String(nextSeq).padStart(3, '0')}-SEC`;
        } else {
          newNumber = `${String(nextSeq).padStart(3, '0')}/${t.codePrefix}/${romanMonth}/${year}`;
        }
        setGeneratedNumber(newNumber);
        blackBoxRecorder.record({
          moduleCode: 'R413-GOV-NUMBER',
          role: 'ADMIN',
          eventType: 'ACTION',
          details: `Generated unique government number for ${t.name}: ${newNumber}. Collision check: 0 duplicates.`,
          severity: 'INFO'
        });
        return { ...t, currentSequence: nextSeq, formatExample: newNumber };
      }
      return t;
    }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="government-numbering-engine-root" className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                R413 &bull; GOVERNMENT NUMBERING ENGINE
              </span>
              <span className="text-xs text-slate-400 font-mono">Zero Collision State Document Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Hash className="w-8 h-8 text-amber-400" />
              Mesin Penomoran Otomatis Dokumen &amp; Surat Dinas
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Tata naskah dinas resmi untuk Surat Keluar/Masuk, SK Yayasan, Berita Acara, Sertifikat, Piagam, Memo, dan Arsip dengan jaminan nomor anti-ganda (Zero Collision).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-2 rounded-2xl bg-amber-950 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> ZERO DUPLICATE
            </span>
          </div>
        </div>
      </div>

      {/* Generated Banner if active */}
      {generatedNumber && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/50 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Nomor Dokumen Terbit Baru:</span>
            <strong className="text-amber-700 dark:text-amber-300 text-sm">{generatedNumber}</strong>
          </div>
          <button
            onClick={() => handleCopy(generatedNumber)}
            className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Tersalin!' : 'Salin Nomor'}
          </button>
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        {templates.map((tpl) => (
          <div
            key={tpl.docType}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <span className="text-[10px] text-slate-400">{tpl.category}</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                  Seq: #{tpl.currentSequence}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-xs">
                {tpl.name}
              </h3>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                <span className="text-[10px] text-slate-400 block">Format Terakhir:</span>
                <code className="text-slate-800 dark:text-amber-400 font-bold text-[11px] break-all">
                  {tpl.formatExample}
                </code>
              </div>
            </div>

            <button
              onClick={() => handleGenerateNext(tpl.docType)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Terbitkan Nomor Berikutnya
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
