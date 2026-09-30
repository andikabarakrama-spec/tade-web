import React, { useState } from 'react';
import { 
  Film, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  Layers, 
  RotateCw, 
  Smartphone, 
  Download, 
  Music,
  Plus
} from 'lucide-react';

export interface BatchStoryQueueItem {
  id: string;
  activityTitle: string;
  theme: string;
  audioTrack: string;
  durationSec: number;
  resolution: '1080p' | '2K' | '4K';
  status: 'QUEUED' | 'RENDERING' | 'READY';
  thumbnailUrl: string;
}

export const StoryStudioBatchViewer: React.FC = () => {
  const [stories, setStories] = useState<BatchStoryQueueItem[]>([
    {
      id: 'STORY-001',
      activityTitle: 'Manasik Haji Cilik Santri',
      theme: 'Spiritual Islami Gold',
      audioTrack: 'Labbaikallahumma Labbaik (Acoustic)',
      durationSec: 15,
      resolution: '1080p',
      status: 'READY',
      thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'STORY-002',
      activityTitle: 'Senam Pagi & Minum Susu Bersama',
      theme: 'Ceria Energik Pastel',
      audioTrack: 'Senam Cilik Gembira',
      durationSec: 15,
      resolution: '1080p',
      status: 'READY',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'STORY-003',
      activityTitle: 'Muroja\'ah Surat Pendek Juz 30',
      theme: 'Tahfidz Tartil Hijau Zamrud',
      audioTrack: 'Al-Fatihah Murottal Anak',
      durationSec: 30,
      resolution: '1080p',
      status: 'QUEUED',
      thumbnailUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=300&auto=format&fit=crop&q=80'
    }
  ]);
  const [isRenderingAll, setIsRenderingAll] = useState<boolean>(false);

  const handleRenderAll = () => {
    setIsRenderingAll(true);
    setTimeout(() => {
      setStories(stories.map(s => ({ ...s, status: 'READY' })));
      setIsRenderingAll(false);
    }, 1000);
  };

  return (
    <div className="space-y-6" id="story-studio-batch-viewer">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                R847 &bull; Story Studio Batch
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                9:16 MULTI-REELS
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Generator Video Story & Reels Massal
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Membuat konten vertikal Instagram/WhatsApp Story untuk seluruh kelas sekaligus dengan template tematik otomatis dan musik latar ramah anak.
            </p>
          </div>

          <button
            onClick={handleRenderAll}
            disabled={isRenderingAll}
            className="px-5 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-violet-500/20 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isRenderingAll ? 'animate-spin' : ''}`} />
            <span>{isRenderingAll ? 'Merender Semua...' : 'Render Seluruh Antrean'}</span>
          </button>
        </div>
      </div>

      {/* Story Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stories.map((st) => (
          <div
            key={st.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
          >
            <div className="space-y-3">
              <div className="relative aspect-[9/16] max-h-56 w-full rounded-2xl overflow-hidden bg-slate-950 mx-auto">
                <img
                  src={st.thumbnailUrl}
                  alt={st.activityTitle}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-3">
                  <span className="text-[10px] font-black text-amber-300 uppercase">{st.theme}</span>
                  <h4 className="text-xs font-bold text-white leading-snug">{st.activityTitle}</h4>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <Music className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span className="truncate">{st.audioTrack}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px] pt-1">
                  <span>Format: <strong>9:16 Vertical</strong></span>
                  <span className="font-mono text-cyan-400">{st.resolution} &bull; {st.durationSec}s</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                st.status === 'READY' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {st.status}
              </span>

              <button className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                <span>Unduh</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
