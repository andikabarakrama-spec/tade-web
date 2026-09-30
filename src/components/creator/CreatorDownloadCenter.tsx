import React, { useState, useMemo, useEffect } from 'react';
import { 
  Download, 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  HardDrive, 
  Clock, 
  Layers, 
  FolderArchive, 
  ArrowDownToLine, 
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { 
  CreatorDownloadCenter as DownloadCenterService, 
  CreatorExportJob, 
  ExportResolutionType, 
  ExportFileFormat,
  ResolutionProfile 
} from '../../core/creator/creatorDownloadCenter';

export const CreatorDownloadCenter: React.FC = () => {
  const downloadService = useMemo(() => DownloadCenterService.getInstance(), []);
  const [jobs, setJobs] = useState<CreatorExportJob[]>(() => downloadService.getExportJobs());
  const [resolutionProfiles] = useState<ResolutionProfile[]>(() => DownloadCenterService.RESOLUTION_PROFILES);

  // Quick export test state
  const [selectedRes, setSelectedRes] = useState<ExportResolutionType>('HD_1080');
  const [selectedFormat, setSelectedFormat] = useState<ExportFileFormat>('WEBP');
  const [customTitle, setCustomTitle] = useState<string>('Poster_Kegiatan_Santri_Ceria');

  useEffect(() => {
    const unsub = downloadService.subscribe(setJobs);
    return () => unsub();
  }, [downloadService]);

  const handleCreateTestJob = () => {
    downloadService.createExportJob(
      customTitle || 'Aset_Kreatif_Asy',
      'MANUAL_EXPORT',
      selectedRes,
      selectedFormat,
      1080,
      1920
    );
  };

  return (
    <div className="space-y-6" id="creator-download-center">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Creator Download Center
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R818 &bull; RC99
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Pusat Unduhan & Ekspor Multi-Resolusi
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Unduh hasil olahan foto, story kegiatan, banner website, dan piagam santri dalam resolusi Preview (SD), HD 1080p, Full HD 2K, hingga Ultra 4K masa depan tanpa batasan hardcoded.
            </p>
          </div>
        </div>
      </div>

      {/* Resolution Profiles Grid (Future-Ready Extensible) */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          Profil Resolusi Siap Masa Depan (Extensible Profiles)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resolutionProfiles.map(p => (
            <div
              key={p.id}
              className={`p-4 rounded-3xl border transition space-y-2 ${
                selectedRes === p.id
                  ? 'bg-sky-500/10 border-sky-500/50'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{p.label}</span>
                <span className="text-[10px] font-semibold text-sky-400 bg-sky-500/20 px-2 py-0.5 rounded-full">
                  ~{p.estimatedSizeMb} MB
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {p.description}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                Cocok: <strong className="text-slate-300">{p.recommendedFor}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Adaptive Export Utility */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-sky-400" />
          Generator Ekspor Cepat
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Nama File Aset</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-sky-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Pilih Resolusi Target</label>
            <select
              value={selectedRes}
              onChange={(e) => setSelectedRes(e.target.value as ExportResolutionType)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-sky-500 transition cursor-pointer"
            >
              {resolutionProfiles.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Format Berkas</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as ExportFileFormat)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden focus:border-sky-500 transition cursor-pointer"
            >
              <option value="WEBP">WEBP (Hemat & Optimal Web)</option>
              <option value="PNG">PNG (Transparan / Lossless)</option>
              <option value="JPEG">JPEG (Standar Foto)</option>
              <option value="PDF_ARCHIVE">PDF Archive (Dokumen Akreditasi)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleCreateTestJob}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition shadow-md shadow-sky-950/40 flex items-center gap-2 cursor-pointer"
          >
            <ArrowDownToLine className="w-4 h-4" />
            Generate Aset Siap Unduh
          </button>
        </div>
      </div>

      {/* Active Export Jobs List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            Riwayat Unduhan & Berkas Siap Simpan ({jobs.length})
          </h3>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Client-Side Safe Download
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            Belum ada antrean unduhan. Gunakan Story Studio atau Photo Lab untuk mengekspor desain perdana Anda.
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map(job => (
              <div
                key={job.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{job.assetTitle}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="bg-slate-800 px-2 py-0.5 rounded-md font-semibold text-slate-300">
                        {job.resolution}
                      </span>
                      <span>{job.format}</span>
                      <span>&bull;</span>
                      <span>{job.dimensions.width} &times; {job.dimensions.height} px</span>
                      <span>&bull;</span>
                      <span>{(job.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => downloadService.triggerDownload(job.id)}
                    className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
