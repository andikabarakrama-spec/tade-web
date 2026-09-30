import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Layout,
  FileCheck,
  History,
  Bot,
  Zap,
  CheckCircle2,
  RefreshCw,
  Award
} from 'lucide-react';
import { PromptComposer, CreativeFormat } from './PromptComposer';
import { CreativeHistory, CreativeArtifact } from './CreativeHistory';

const INITIAL_ARTIFACTS: CreativeArtifact[] = [
  {
    id: 'ART-2026-001',
    title: 'Banner Panggung Wisuda Santri Angkatan XII',
    format: 'BANNER_3D',
    prompt: 'Spanduk panggung wisuda 4x2m hijau emas bertabur bintang dengan kaligrafi indah.',
    createdAt: 'Hari ini, 14:15 WIB',
    thumbnailGradient: 'bg-gradient-to-tr from-emerald-800 via-teal-900 to-amber-700',
    aspectRatio: '2:1',
    dimensions: '4000 x 2000 px',
    status: 'READY'
  },
  {
    id: 'ART-2026-002',
    title: 'Sertifikat Kelulusan Tahfidz Juz 30',
    format: 'SERTIFIKAT',
    prompt: 'Sertifikat formal motif emas arabesque dengan ruang nilai 10 surat pilihan.',
    createdAt: 'Kemarin, 09:30 WIB',
    thumbnailGradient: 'bg-gradient-to-tr from-amber-900 via-yellow-800 to-stone-900',
    aspectRatio: '4:3',
    dimensions: '2480 x 3508 px (A4)',
    status: 'READY'
  },
  {
    id: 'ART-2026-003',
    title: 'Instagram Feed PPDB Gelombang 1 Dibuka',
    format: 'FEED_IG',
    prompt: 'Post feed persegi ceria warna biru muda dan kuning dengan foto anak bermain lego.',
    createdAt: '12 Agustus 2026',
    thumbnailGradient: 'bg-gradient-to-tr from-sky-600 via-indigo-700 to-purple-800',
    aspectRatio: '1:1',
    dimensions: '1080 x 1080 px',
    status: 'READY'
  }
];

export const AsyCreativeStudio: React.FC = () => {
  const [artifacts, setArtifacts] = useState<CreativeArtifact[]>(INITIAL_ARTIFACTS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);

  const handleGenerate = async (format: CreativeFormat, prompt: string, title: string) => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1200));

    const gradients = [
      'bg-gradient-to-tr from-purple-800 via-indigo-900 to-pink-700',
      'bg-gradient-to-tr from-emerald-900 via-teal-800 to-cyan-900',
      'bg-gradient-to-tr from-amber-800 via-orange-900 to-rose-900'
    ];
    const randomGrad = gradients[Math.floor(Math.random() * gradients.length)];

    const newArtifact: CreativeArtifact = {
      id: `ART-2026-${String(artifacts.length + 1).padStart(3, '0')}`,
      title: title || `Desain Baru ${format}`,
      format,
      prompt,
      createdAt: 'Baru saja',
      thumbnailGradient: randomGrad,
      aspectRatio: format === 'BANNER_3D' ? '2:1' : format === 'FEED_IG' ? '1:1' : '3:4',
      dimensions: format === 'BANNER_3D' ? '3000 x 1500 px' : '1080 x 1080 px',
      status: 'READY'
    };

    setArtifacts([newArtifact, ...artifacts]);
    setIsGenerating(false);
    setGenerationNotice(`Desain "${newArtifact.title}" berhasil dibuat dan siap diunduh!`);
    setTimeout(() => setGenerationNotice(null), 4000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/80 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/50 flex items-center justify-center text-purple-400 shadow-lg">
                <Palette className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                    MODULE R145
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    AI CREATIVE STUDIO
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-100">
                  Asy Creative Intelligence & Studio Grafis
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Hasilkan spanduk panggung 3D, poster kegiatan, sertifikat kelulusan, brosur PPDB, dan konten media sosial sekolah dengan sekali ketik. Generator instan bekerja on-demand menjaga platform selalu ringan.
            </p>
          </div>
        </div>
      </div>

      {generationNotice && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{generationNotice}</span>
        </div>
      )}

      {/* Main Composer */}
      <PromptComposer onGenerate={handleGenerate} isGenerating={isGenerating} />

      {/* History & Gallery */}
      <CreativeHistory artifacts={artifacts} />
    </div>
  );
};
