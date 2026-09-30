import React, { useMemo } from 'react';
import { Box, Layers, ShieldCheck, Cpu, HardDrive, CheckCircle2, FileCode } from 'lucide-react';
import { AsyAssetFoundation } from '../../core/mascot3d/asyAssetFoundation';

export const AsyAssetViewer: React.FC = () => {
  const foundation = useMemo(() => AsyAssetFoundation.getInstance(), []);
  const assets = foundation.getAllAssets();
  const webgl = foundation.getWebGLCapabilities();
  const theme = foundation.getPrimaryTheme();

  return (
    <div id="r781-asy-asset-foundation" className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-600">
            <Box className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 text-sm">3D Mesh Architecture</h3>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">GLB & 2.5D</p>
          <p className="text-xs text-stone-500">
            Struktur aset utama berbasis Binary glTF (GLB) dengan fallback SVG vector puppet 28KB.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-600">
            <Cpu className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 text-sm">GPU Pipeline Status</h3>
          </div>
          <p className="text-2xl font-black text-indigo-900 font-mono">
            {webgl.isSupported ? 'ACCELERATED' : 'FALLBACK'}
          </p>
          <p className="text-xs text-stone-500 font-mono truncate">
            {webgl.rendererName}
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-600">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 text-sm">Integrity & Theme</h3>
          </div>
          <p className="text-2xl font-black text-emerald-700 font-mono">EMERALD</p>
          <p className="text-xs text-stone-500">
            Islamic Preschool Theme: Koko Zamrud, Peci Hitam, & Gold Brocade.
          </p>
        </div>
      </div>

      {/* Asset Registry Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-emerald-600" /> Model & Texture Asset Registry (assets/asy/)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-mono">
              <tr>
                <th className="p-3">Asset ID</th>
                <th className="p-3">Nama Model / Aset</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Format</th>
                <th className="p-3">Ukuran</th>
                <th className="p-3">LOD</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {assets.map((asset) => (
                <tr key={asset.assetId} className="hover:bg-stone-50/80 transition">
                  <td className="p-3 font-mono font-bold text-indigo-700">{asset.assetId}</td>
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{asset.name}</p>
                    <p className="text-[11px] font-mono text-stone-400">{asset.uri}</p>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {asset.category}
                    </span>
                  </td>
                  <td className="p-3 font-mono uppercase text-slate-600">{asset.format}</td>
                  <td className="p-3 font-mono text-slate-600">
                    {(asset.fileSizeBytes / 1024).toFixed(1)} KB
                  </td>
                  <td className="p-3 font-mono text-slate-600">{asset.lodLevel}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> READY
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
