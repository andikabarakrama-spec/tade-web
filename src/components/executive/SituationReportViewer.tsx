import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Download,
  Copy,
  Check,
  Clock,
  Sparkles,
  Award,
  AlertCircle,
  Activity,
  Layers,
  Database
} from 'lucide-react';
import { SituationReportEngine, SituationReport } from '../../core/executive/SituationReportEngine';

export const SituationReportViewer: React.FC = () => {
  const sitrepEngine = SituationReportEngine.getInstance();
  const [report, setReport] = useState<SituationReport>(() => sitrepEngine.generateDailySITREP());
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(report.rawMarkdownExport);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'EXCELLENT':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'GOOD':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-300 dark:border-sky-800';
      case 'ATTENTION':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300 dark:border-red-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top SITREP Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono uppercase">
                {report.readinessLevel}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                R724 SITREP Engine
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-mono">
              <FileText className="w-7 h-7 text-emerald-400" />
              AI Asy Situation Report (SITREP) Eksekutif
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Dokumen pelaporan situasi komprehensif harian institusi TK Asy-Syifa Tanggul (TADE Enterprise).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-medium rounded-xl text-xs border border-slate-700 transition-all cursor-pointer"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              {isCopied ? 'Tersalin ke Clipboard!' : 'Salin Markdown'}
            </button>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400 font-mono block">Kode Dokumen</span>
            <span className="text-sm font-bold text-white font-mono">{report.reportId}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-mono block">Tanggal Laporan</span>
            <span className="text-sm font-bold text-slate-200 font-mono">{report.reportDate}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-mono block">Tingkat Keyakinan</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              {report.confidenceRating.confidenceScore}% ({report.confidenceRating.confidenceLevel})
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-mono block">Otoritas Dokumen</span>
            <span className="text-sm font-bold text-indigo-300 font-mono">AI Asy Cognitive 2.0</span>
          </div>
        </div>
      </div>

      {/* Executive Summary Card */}
      <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 p-5 rounded-2xl">
        <h3 className="text-xs font-bold font-mono text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Ringkasan Eksekutif Pimpinan
        </h3>
        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
          {report.executiveSummary}
        </p>
      </div>

      {/* Structured Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {report.sections.map((section, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm font-mono">
                  {section.sectionTitle}
                </h4>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${getBadgeColor(section.statusBadge)}`}>
                  {section.statusBadge}
                </span>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {section.bulletPoints.map((bp, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{bp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
