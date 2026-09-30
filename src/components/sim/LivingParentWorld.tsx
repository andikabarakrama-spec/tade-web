import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  Camera,
  Gift,
  Sun,
  Smile,
  Volume2,
  CheckCircle2,
  Share2,
  MessageCircle,
  Star
} from 'lucide-react';

interface ActivityMemory {
  id: string;
  sentraName: string;
  timestamp: string;
  photoEmoji: string;
  caption: string;
  teacherNote: string;
  likes: number;
  isLiked: boolean;
  tags: string[];
}

export const LivingParentWorld: React.FC = () => {
  const [starCount, setStarCount] = useState<number>(18);
  const [isScratchRevealed, setIsScratchRevealed] = useState<boolean>(false);
  const [playingSurahAudio, setPlayingSurahAudio] = useState<boolean>(false);
  const [memories, setMemories] = useState<ActivityMemory[]>([
    {
      id: 'mem_1',
      sentraName: 'Sentra Balok & Rancang Bangun',
      timestamp: 'Hari ini • 09:30 WIB',
      photoEmoji: '🏰',
      caption: 'Ananda Rayyan berhasil menyusun miniatur Masjid Agung Asy-Syifatan bersama 3 sahabat kelompok.',
      teacherNote: 'Motorik halus dan kemampuan kerja sama ananda berkembang sangat pesat! Maa Syaa Allah.',
      likes: 12,
      isLiked: false,
      tags: ['#SentraBalok', '#Kerjasama', '#Kreativitas']
    },
    {
      id: 'mem_2',
      sentraName: 'Sentra Imtaq & Tahfidz',
      timestamp: 'Hari ini • 08:15 WIB',
      photoEmoji: '📖',
      caption: 'Murojaah Surah An-Naba ayat 1-10 dengan makharijul huruf yang fasih dan tartil.',
      teacherNote: 'Hafalan sangat lancar, intonasi tajwid mad thabi’i sudah tepat.',
      likes: 19,
      isLiked: true,
      tags: ['#TahfidzCilik', '#JuzAmma', '#AkhlakMulia']
    },
    {
      id: 'mem_3',
      sentraName: 'Sentra Sains & Eksplorasi Alam',
      timestamp: 'Kemarin • 10:00 WIB',
      photoEmoji: '🌱',
      caption: 'Menanam benih kecambah hijau dan mengamati proses tumbuh daun pertama di taman sekolah.',
      teacherNote: 'Ananda sangat antusias mencatat perubahan tinggi kecambah di buku observasi.',
      likes: 15,
      isLiked: false,
      tags: ['#SainsPAUD', '#EksplorasiAlam']
    }
  ]);

  const handleLikeToggle = (id: string) => {
    setMemories(prev =>
      prev.map(m => {
        if (m.id === id) {
          const nextLiked = !m.isLiked;
          return {
            ...m,
            isLiked: nextLiked,
            likes: nextLiked ? m.likes + 1 : m.likes - 1
          };
        }
        return m;
      })
    );
  };

  const handlePlayAudio = () => {
    setPlayingSurahAudio(true);
    setTimeout(() => setPlayingSurahAudio(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Warm Parent Greeting Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-teal-950 border border-rose-500/30 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* Floating background decorative animations */}
        <div className="absolute top-2 right-12 text-3xl opacity-20 pointer-events-none animate-bounce">
          🎈
        </div>
        <div className="absolute bottom-4 right-32 text-2xl opacity-25 pointer-events-none animate-pulse">
          🦋
        </div>
        <div className="absolute top-8 right-64 text-2xl opacity-20 pointer-events-none">
          🌈
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 text-2xl">
              👧
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                  LIVING PARENT WORLD
                </span>
                <span className="text-xs text-slate-400">Portal Kehangatan Keluarga & Sekolah</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Selamat Datang Bunda & Ayah Ananda Rayyan!
              </h1>
              <p className="text-sm text-rose-100/80 mt-0.5">
                "Assalamu'alaikum Ayah/Bunda! Ananda hari ini sangat ceria di Sentra Balok & menyelesaikan hafalan Surah An-Naba."
              </p>
            </div>
          </div>

          {/* Star Reward Widget */}
          <div className="bg-slate-950/80 border border-rose-500/30 rounded-xl p-3.5 flex items-center gap-3 min-w-[200px]">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">Bintang Kebaikan Ananda</div>
              <div className="text-lg font-black text-amber-400">{starCount} Bintang Emas</div>
              <div className="text-[10px] text-emerald-400">Level: Ananda Shalih Teladan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Daily Surprise Card & Today's Tahfidz Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Surprise Harian & Hadits Parenting */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-rose-500" />
              Kejutan Harian & Hadits Parenting Hari Ini
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              Surprise Card
            </span>
          </div>

          {!isScratchRevealed ? (
            <div
              onClick={() => {
                setIsScratchRevealed(true);
                setStarCount(prev => prev + 1);
              }}
              className="cursor-pointer p-6 rounded-xl border-2 border-dashed border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20 text-center space-y-2 hover:bg-rose-100/50 transition group"
            >
              <div className="text-3xl group-hover:scale-110 transition">🎁</div>
              <div className="font-bold text-xs text-rose-800 dark:text-rose-300">
                Klik di sini untuk membuka Pesan Kasih & Hadits Hari Ini (+1 Bintang Emas!)
              </div>
              <div className="text-[11px] text-slate-500">Sentuh kartu kejutan ini untuk membaca</div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-rose-50 dark:from-slate-800 dark:to-slate-800/80 border border-amber-200 dark:border-slate-700 space-y-2">
              <div className="text-xs font-serif italic text-slate-800 dark:text-slate-200 leading-relaxed">
                "Setiap anak terlahir dalam keadaan fitrah. Kedua orang tuanyalah yang menjadikannya Yahudi, Nasrani, atau Majusi." (HR. Bukhari & Muslim)
              </div>
              <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                💡 Tips Parenting Dek Asy: Luangkan 10 menit sebelum tidur untuk mendengar cerita ananda hari ini.
              </div>
            </div>
          )}
        </div>

        {/* Tahfidz Hari Ini & Audio Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Perkembangan Tahfidz Hari Ini
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Juz 30 (Juz 'Amma)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Surah An-Naba' (Ayat 1-10)</div>
                <div className="text-[11px] text-slate-500">Target Semester: Surah An-Naba' s/d An-Nazi'at</div>
              </div>
              <button
                onClick={handlePlayAudio}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition"
              >
                <Volume2 className={`w-3.5 h-3.5 ${playingSurahAudio ? 'animate-pulse' : ''}`} />
                {playingSurahAudio ? 'Memutar Suara...' : 'Dengar Rekaman'}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                <span>Kelancaran Makhraj & Tajwid</span>
                <span className="text-emerald-600 font-bold">95% Mumtaz</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Kenangan Hidup (Live Photo Activity Stream) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-teal-600" />
              Timeline Kenangan Kegiatan Ananda (Memory Stream)
            </h3>
            <p className="text-xs text-slate-500">Momen berharga harian ananda diabadikan langsung oleh guru kelas</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">3 Momen Baru</span>
        </div>

        <div className="space-y-4">
          {memories.map((mem) => (
            <div
              key={mem.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3 hover:border-slate-300 transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 border border-teal-300 dark:border-teal-700 flex items-center justify-center text-2xl shadow-xs">
                    {mem.photoEmoji}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{mem.sentraName}</div>
                    <div className="text-[11px] text-slate-500">{mem.timestamp}</div>
                  </div>
                </div>

                <div className="flex gap-1">
                  {mem.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                {mem.caption}
              </p>

              <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 text-[11px] text-teal-900 dark:text-teal-200 flex items-start gap-2">
                <span className="font-bold shrink-0">Catatan Ustadzah:</span>
                <span>{mem.teacherNote}</span>
              </div>

              {/* Reaction Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                <button
                  onClick={() => handleLikeToggle(mem.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                    mem.isLiked
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                      : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${mem.isLiked ? 'fill-rose-600' : ''}`} />
                  <span>{mem.likes} Ayah/Bunda Suka</span>
                </button>

                <button className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold text-xs">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Simpan ke Album Keluarga</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
