import React, { useState } from 'react';
import { Bot, Sparkles, Send, CheckCircle2, RefreshCw, Wand2, Eye, Layout, Type, Image } from 'lucide-react';

export const AIWebsiteGuide: React.FC = () => {
  const [promptInput, setPromptInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPreview, setGeneratedPreview] = useState<{
    type: string;
    title: string;
    content: string;
    seoTitle: string;
    metaDescription: string;
    keywords: string;
  } | null>(null);

  const presetPrompts = [
    "Buat berita kegiatan outbound anak minggu ini",
    "Buat pengumuman libur sekolah dan pesan Ustadzah",
    "Ganti warna theme menjadi lebih ceria & hangat",
    "Buat FAQ pendaftaran siswa baru PPDB"
  ];

  const handleGenerate = (query: string) => {
    if (!query.trim()) return;
    setIsGenerating(true);
    setGeneratedPreview(null);

    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedPreview({
        type: query.toLowerCase().includes('berita') ? 'Artikel Berita' : 'Konten / Desain Website',
        title: query.toLowerCase().includes('berita')
          ? 'Keseruan Outbound Ceria Santri TK Asy Syifa di Taman Kota'
          : 'Pembaruan Tampilan Ceria & Pengumuman Sekolah',
        content: query.toLowerCase().includes('berita')
          ? 'Ananda diajak mengenal alam sekitar, melatih motorik kasar, dan belajar kekompakan tim lewat permainan edukatif ramah anak.'
          : 'Tema warna diperkaya dengan gradasi pastel hangat, hiasan balon udara, serta tombol interaktif yang ramah pengguna.',
        seoTitle: 'Outbound Edukatif Anak TK Asy Syifa Tanggul | Sekolah Ramah Anak',
        metaDescription: 'Kegiatan outbound dan eksplorasi alam terbuka anak TK Asy Syifa Tanggul Jember untuk mengasah kecerdasan kognitif & emosional.',
        keywords: 'TK Asy Syifa, Outbound Anak, Pendidikan Karakter, PAUD Tanggul Jember'
      });
    }, 1000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
        <span className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md">
          🤖
        </span>
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Part 6 - 8 — AI Website Guide & Content Generator
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
            Asisten AI Pengelola & Desainer Website
          </h2>
          <p className="text-xs text-stone-500">
            Ketik perintah atau pilih rekomendasi di bawah untuk membuat artikel, pengumuman, SEO metadata, dan desain otomatis.
          </p>
        </div>
      </div>

      {/* Preset Command Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-stone-700 block">Rekomendasi Perintah Pintar AI:</span>
        <div className="flex flex-wrap gap-2">
          {presetPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPromptInput(p);
                handleGenerate(p);
              }}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 text-xs font-bold transition border border-stone-200 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{p}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Prompt Form */}
      <div className="flex gap-2">
        <input
          type="text"
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          placeholder="Ketik instruksi AI (contoh: 'Buat artikel keutamaan membaca Iqro')..."
          className="flex-1 p-3.5 border-2 border-stone-200 focus:border-emerald-600 rounded-2xl text-xs font-medium outline-hidden"
        />
        <button
          onClick={() => handleGenerate(promptInput)}
          disabled={isGenerating || !promptInput.trim()}
          className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black text-xs rounded-2xl transition flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Generasi AI</span>
        </button>
      </div>

      {/* AI Generated Preview Panel */}
      {generatedPreview && (
        <div className="bg-gradient-to-br from-amber-50 via-emerald-50 to-teal-50 p-6 rounded-3xl border-2 border-amber-300 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
            <span className="text-xs font-black uppercase text-emerald-900 bg-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Preview Hasil Generasi AI ({generatedPreview.type})
            </span>
            <span className="text-[10px] text-stone-500 font-bold">Status: Siap Diterapkan</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-black text-slate-900">{generatedPreview.title}</h3>
            <p className="text-xs text-stone-700 leading-relaxed font-medium bg-white/80 p-3 rounded-xl border border-stone-200">
              {generatedPreview.content}
            </p>
          </div>

          {/* SEO Metadata Card */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-xs space-y-1.5">
            <span className="font-black text-emerald-900 block uppercase tracking-wider text-[10px]">
              Otomatisasi SEO & OpenGraph Metadata:
            </span>
            <p><strong>SEO Title:</strong> {generatedPreview.seoTitle}</p>
            <p><strong>Meta Description:</strong> {generatedPreview.metaDescription}</p>
            <p><strong>Keywords:</strong> {generatedPreview.keywords}</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setGeneratedPreview(null)}
              className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-slate-800 font-bold text-xs"
            >
              Batal
            </button>
            <button
              onClick={() => {
                alert("Konten & SEO Metadata AI Berhasil Diterapkan ke Website Publik!");
                setGeneratedPreview(null);
                setPromptInput('');
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black text-xs transition shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>TERAPKAN SEKARANG</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
