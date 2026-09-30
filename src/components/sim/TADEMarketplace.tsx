import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Tag,
  Download,
  Building2,
  CheckCircle2,
  Award,
  Layers,
  UploadCloud,
  FileCheck
} from 'lucide-react';
import { TemplateStore } from './TemplateStore';

export const TADEMarketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STORE' | 'CONTRIBUTE'>('STORE');

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/80 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    MODULE R146
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    MULTI-TENANT MARKETPLACE
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-100">
                  TADE Template & Asset Marketplace
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Pusat pertukaran aset grafis dan template administratif siap pakai untuk seluruh sekolah TADE di Indonesia. Bebas unduh spanduk panggung 3D, format sertifikat, template LPJ keuangan, RAB, dan kalender pendidikan.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/80 p-1.5 rounded-xl border border-amber-500/30 shrink-0">
            <button
              onClick={() => setActiveTab('STORE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'STORE'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Koleksi Template
            </button>
            <button
              onClick={() => setActiveTab('CONTRIBUTE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'CONTRIBUTE'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Unggah Template Anda
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'STORE' && <TemplateStore />}

      {activeTab === 'CONTRIBUTE' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5 max-w-2xl mx-auto text-xs">
          <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Bagikan Karya & Template ke Komunitas TADE
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Template Anda akan ditinjau oleh kurator TADE sebelum dibagikan ke seluruh sekolah.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Judul Template:</label>
              <input
                type="text"
                placeholder="Contoh: Template Sertifikat Manasik Haji Cilik"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Kategori Template:</label>
              <select className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs">
                <option value="SERTIFIKAT">Sertifikat / Piagam</option>
                <option value="BANNER_3D">Banner / Spanduk Panggung</option>
                <option value="BROSUR">Brosur PPDB</option>
                <option value="LPJ">LPJ & Form Keuangan</option>
                <option value="RAB">RAB Sekolah</option>
                <option value="NUSANTARA">Template Nusantara</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Deskripsi Singkat:</label>
              <textarea
                rows={3}
                placeholder="Jelaskan isi template dan panduan penggunaannya..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs"
              />
            </div>

            <button
              onClick={() => alert('Terima kasih! Template Anda telah dikirim untuk kurasi.')}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow cursor-pointer transition-all"
            >
              Kirimkan Template untuk Kurasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
