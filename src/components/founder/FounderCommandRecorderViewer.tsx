import React, { useState } from 'react';
import {
  Terminal,
  Download,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  RefreshCw,
  Hash,
  Crown
} from 'lucide-react';
import {
  founderCommandRecorder,
  FounderCommandEntry,
  FounderActionType,
  FounderExecutionStatus
} from '../../services/founderCommandRecorder';

export const FounderCommandRecorderViewer: React.FC = () => {
  const [history, setHistory] = useState<FounderCommandEntry[]>(
    founderCommandRecorder.getHistory()
  );
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<FounderCommandEntry | null>(null);

  const refreshHistory = () => {
    setHistory(founderCommandRecorder.getHistory());
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(founderCommandRecorder.exportJSON());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tade-founder-commands-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(founderCommandRecorder.exportCSV());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tade-founder-commands-${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filtered = history.filter(item => {
    const matchType = filterType === 'ALL' || item.actionType === filterType;
    const matchSearch = searchQuery === '' ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.auditHash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-900">
              <Terminal className="w-4 h-4" />
            </span>
            <h3 className="text-base font-extrabold text-stone-900">
              Founder Command Recorder & Audit Trail
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              {history.length} Aksi Terekam
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Pencatatan kriptografis seluruh arahan, intervensi, pengesahan, dan tindakan eksekutif Founder.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition"
          >
            <FileText className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-stone-100">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan deskripsi, modul, atau SHA-256 hash..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-emerald-600"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none"
        >
          <option value="ALL">Semua Jenis Aksi</option>
          <option value="DIRECTIVE">DIRECTIVE</option>
          <option value="POLICY_OVERRIDE">POLICY_OVERRIDE</option>
          <option value="BROADCAST_AUTH">BROADCAST_AUTH</option>
          <option value="SYSTEM_DIAGNOSTIC">SYSTEM_DIAGNOSTIC</option>
          <option value="MEDIA_VALIDATION">MEDIA_VALIDATION</option>
          <option value="CABINET_RESOLUTION">CABINET_RESOLUTION</option>
          <option value="SECURITY_ARM">SECURITY_ARM</option>
        </select>
      </div>

      {/* Timeline List */}
      <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">
            Tidak ada riwayat perintah yang cocok dengan filter.
          </div>
        ) : (
          filtered.map((entry) => (
            <div
              key={entry.id}
              onClick={() => setSelectedEntry(entry)}
              className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-500/50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-stone-500 text-[10px]">
                    {entry.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {entry.actionType}
                  </span>
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                    {entry.module}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    {entry.auditHash}
                  </span>
                </div>
                <p className="text-stone-800 font-semibold leading-relaxed">
                  {entry.description}
                </p>
                <div className="text-[10px] text-stone-400">
                  {new Date(entry.timestamp).toLocaleString('id-ID')} • Aktor: {entry.actor}
                </div>
              </div>

              <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-700 text-white flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {entry.status}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-stone-900">Rincian Perintah Founder</h3>
              <button onClick={() => setSelectedEntry(null)} className="text-stone-400 hover:text-stone-600 font-bold">
                ✕
              </button>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl space-y-2">
              <div><strong className="text-stone-500">ID:</strong> <span className="font-mono">{selectedEntry.id}</span></div>
              <div><strong className="text-stone-500">Waktu:</strong> {new Date(selectedEntry.timestamp).toLocaleString('id-ID')}</div>
              <div><strong className="text-stone-500">Aktor:</strong> {selectedEntry.actor}</div>
              <div><strong className="text-stone-500">Jenis:</strong> {selectedEntry.actionType}</div>
              <div><strong className="text-stone-500">Modul:</strong> {selectedEntry.module}</div>
              <div><strong className="text-stone-500">Status:</strong> {selectedEntry.status}</div>
              <div><strong className="text-stone-500">Audit Hash:</strong> <span className="font-mono text-emerald-800">{selectedEntry.auditHash}</span></div>
              <div><strong className="text-stone-500">Deskripsi:</strong> {selectedEntry.description}</div>
              {selectedEntry.metadata && (
                <div>
                  <strong className="text-stone-500">Metadata:</strong>
                  <pre className="mt-1 p-2 bg-stone-100 rounded-xl text-[10px] font-mono overflow-x-auto">
                    {JSON.stringify(selectedEntry.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
