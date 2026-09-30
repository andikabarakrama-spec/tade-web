import React, { useState, useEffect, useMemo } from 'react';
import { 
  FolderArchive, 
  HardDrive, 
  ShieldCheck, 
  Lock, 
  Zap, 
  CheckCircle2, 
  Activity, 
  FileText, 
  RefreshCw, 
  Layers, 
  Database,
  ArrowDownToLine,
  Sliders
} from 'lucide-react';
import { 
  HermesDigitalVault, 
  ArchiveFolderConfig, 
  ArchiveManifestRecord, 
  RecoveryLogEntry 
} from '../../core/operational/hermesDigitalVault';

export const HermesDigitalVaultViewer: React.FC = () => {
  const vault = useMemo(() => HermesDigitalVault.getInstance(), []);
  const [config, setConfig] = useState<ArchiveFolderConfig>(() => vault.getConfig());
  const [manifests, setManifests] = useState<ArchiveManifestRecord[]>(() => vault.getManifests());
  const [logs, setLogs] = useState<RecoveryLogEntry[]>(() => vault.getLogs());
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testFeedback, setTestFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsub = vault.subscribe(() => {
      setConfig(vault.getConfig());
      setLogs(vault.getLogs());
    });
    return unsub;
  }, [vault]);

  const handleTestLatency = () => {
    setIsTesting(true);
    setTimeout(() => {
      const res = vault.testFolderAccess();
      setTestFeedback(`Akses folder teruji: ${res.latencyMs}ms (${res.status})`);
      setIsTesting(false);
    }, 400);
  };

  const handleToggleAutoArchive = () => {
    vault.updateConfig({ isAutoArchiveEnabled: !config.isAutoArchiveEnabled });
  };

  const percentageUsed = Math.round((config.usedCapacityGb / config.totalCapacityGb) * 100);

  return (
    <div className="space-y-6" id="hermes-digital-vault-viewer">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <FolderArchive className="w-3.5 h-3.5" />
                Brankas Digital Hermes (Folder Arsip Founder)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                R836 &bull; RC101
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Manajemen Folder Arsip & Manifest SHA-256
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Pilih folder arsip, uji latensi, kelola kuota, dan aktifkan arsip terjadwal otomatis. Nol database kedua (SSoT tetap utuh di db.ts).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestLatency}
              disabled={isTesting}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              {isTesting ? 'Menguji Akses...' : 'Uji Latensi Folder'}
            </button>
          </div>
        </div>
      </div>

      {testFeedback && (
        <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-4 py-3 rounded-2xl text-xs flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{testFeedback}</span>
          </div>
          <button onClick={() => setTestFeedback(null)} className="text-cyan-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* Grid: Storage Metrics & Folder Config */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Capacity */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              Kapasitas Brankas
            </span>
            <span className="text-xs font-mono text-cyan-400">{percentageUsed}% Terpakai</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{config.usedCapacityGb} GB</span>
            <span className="text-xs text-slate-400">dari {config.totalCapacityGb} GB</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${percentageUsed}%` }} />
          </div>
        </div>

        {/* Metric 2: Latency */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              Latensi Akses I/O
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
              ULTRA FAST
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {config.readWriteLatencyMs} ms
          </div>
          <span className="text-[11px] text-slate-400 block">
            Terakhir diuji: {config.lastTestedTimestamp}
          </span>
        </div>

        {/* Metric 3: Auto-Archive Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-3 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-amber-400" />
              Arsip Otomatis
            </span>
            <button
              onClick={handleToggleAutoArchive}
              className={`px-3 py-1 rounded-xl text-[10px] font-black cursor-pointer transition ${
                config.isAutoArchiveEnabled
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {config.isAutoArchiveEnabled ? 'AKTIF (Tiap 6 Jam)' : 'NON-AKTIF'}
            </button>
          </div>
          <span className="text-[11px] text-slate-400">
            Snapshot berkala menjaga kepastian data tanpa membebani browser HP.
          </span>
        </div>
      </div>

      {/* Manifests & Recovery Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Archive Manifests */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Manifest Snapshot Resmi ({manifests.length})
          </h3>

          <div className="space-y-3">
            {manifests.map((m) => (
              <div
                key={m.manifestId}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-4 text-white space-y-2.5 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-300">{m.manifestId}</span>
                    <span className="text-[10px] text-slate-400">{m.timestamp}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {m.status}
                  </span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-400 break-all">
                  SHA-256: {m.sha256Checksum}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{m.totalCollectionsArchived} Koleksi SSoT &bull; {m.totalRecordsArchived} Rekord</span>
                  <span className="italic">{m.archiveFileName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 Cols: Recovery & Audit Logs */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Log Pemulihan & Audit Hermes
          </h3>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 text-white space-y-2.5 shadow-md">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono text-cyan-400">{log.operationType}</span>
                  <span className="text-slate-500">{log.timestamp}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{log.details}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                  <span>Waktu Eksekusi: {log.executionTimeMs}ms</span>
                  <span className="text-emerald-400 font-semibold">{log.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
