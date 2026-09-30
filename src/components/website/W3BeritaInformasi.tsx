import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArticleCMS } from '../../types';
import { DataService } from '../../services/db';
import { Search, Calendar, Tag, X, Newspaper, ChevronRight, Sparkles, Heart, ThumbsUp, Star, Award, BookOpen, Share2, Eye } from 'lucide-react';
import { shareToWhatsAppOrWeb } from '../../services/guardian/whatsappConfig';
import { WhatsAppBroadcastModal } from '../common/WhatsAppBroadcastModal';
import { LivingGardenElements } from '../garden/LivingGardenElements';
import { LivingPageDecorator } from '../garden/LivingPageDecorator';
import { AIAsyCharacterScene } from '../assistant/AIAsyCharacterScene';
import { LivingSchoolEngine } from '../garden/LivingSchoolEngine';
import { ImmersiveWorldLandscape } from '../garden/ImmersiveWorldLandscape';
import { StoryStack, StoryCardItem } from '../interactions/StoryStack';
import { DepthCard } from '../interactions/DepthCard';

export const W3BeritaInformasi: React.FC = () => {
  const [articles, setArticles] = useState<ArticleCMS[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeArticle, setActiveArticle] = useState<ArticleCMS | null>(null);
  const [articleReactions, setArticleReactions] = useState<Record<string, number>>({});
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);

  useEffect(() => {
    DataService.getArticles().then(setArticles);
  }, []);

  const categories = ['Semua', 'Berita', 'Pengumuman', 'Edukasi', 'Kegiatan'];

  const filtered = articles.filter(a => {
    const matchesCategory = selectedCategory === 'Semua' || a.category === selectedCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.body.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const storyItems: StoryCardItem[] = articles.map(a => ({
    id: a.id,
    title: a.title,
    category: a.category,
    date: a.date,
    summary: a.body.slice(0, 140) + '...',
    content: a.body,
    image: a.image,
    tags: a.tags
  }));

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setArticleReactions(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  return (
    <ImmersiveWorldLandscape>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
        <LivingPageDecorator pageName="Galeri" />
        <LivingGardenElements type="page-decor" />

        {/* Page Title Scrapbook Banner - Motion Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 border-2 border-amber-400/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
        >
          <div className="space-y-2 relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md">
              <Newspaper className="w-3.5 h-3.5 text-slate-950" />
              LOKASI WORLD: ALBUM KENANGAN & PAPAN PENGUMUMAN
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Berita, Pengumuman & Artikel PAUD
            </h1>
            <p className="text-stone-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Informasi kegiatan harian anak, kabar prestasi, agenda manasik/outing class, dan panduan parenting Islami untuk Ayah & Bunda.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80 relative z-10">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Cari berita, agenda, atau tips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white text-slate-900 border-2 border-amber-400/80 text-xs font-bold focus:ring-2 focus:ring-amber-300 focus:outline-hidden shadow-md"
            />
          </div>
        </motion.div>

        {/* Interactive StoryStack Section */}
        {storyItems.length > 0 && (
          <StoryStack
            stories={storyItems}
            onReadMore={(story) => {
              const fullArt = articles.find(a => a.id === story.id);
              if (fullArt) setActiveArticle(fullArt);
            }}
          />
        )}

        {/* Living School Engine Integration (WR-16) */}
        <LivingSchoolEngine />

        {/* AI Asy Living Mascot Scene for News & Gallery */}
        <AIAsyCharacterScene pageContext="w3Galeri" />

        {/* Categories Scrapbook Chips */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-105 border-2 border-amber-300'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>✨</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Article Grid Scrapbook with DepthCard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((art) => {
            const likes = articleReactions[art.id] || 12;

            return (
              <DepthCard key={art.id} depth={6}>
                <div
                  onClick={() => setActiveArticle(art)}
                  className="bg-white rounded-3xl p-4 border-2 border-stone-200 shadow-sm hover:shadow-xl transition duration-300 cursor-pointer group flex flex-col justify-between relative h-full"
                >
                  {/* Tape Accent */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-200/90 border border-amber-300 -rotate-1 z-20 rounded-xs pointer-events-none shadow-2xs" />

                  <div className="space-y-3">
                    <div className="h-48 overflow-hidden rounded-2xl relative border border-stone-200">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-emerald-800 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md uppercase">
                        {art.category}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[11px] text-stone-500 flex items-center justify-between font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          {art.date}
                        </span>
                        <span>Penulis: {art.author}</span>
                      </div>

                      <h2 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-800 transition leading-snug">
                        {art.title}
                      </h2>

                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        {art.body}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold mt-3">
                    <button
                      onClick={(e) => handleLike(art.id, e)}
                      className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-rose-50 text-stone-700 hover:text-rose-600 border border-stone-200 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>{likes}</span>
                    </button>

                    <span className="text-emerald-800 flex items-center gap-1 group-hover:translate-x-1 transition font-black">
                      Baca Selengkapnya <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </DepthCard>
            );
          })}
        </div>

        {/* Reader Modal */}
        {activeArticle && (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200 border-2 border-emerald-300">
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-600 font-black text-sm cursor-pointer"
              >
                ✕
              </button>

              <span className="text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-3.5 py-1 rounded-full">
                {activeArticle.category}
              </span>

              <h2 className="text-2xl font-black text-slate-900 leading-snug">
                {activeArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-stone-500 border-b border-stone-200 pb-3 font-medium">
                <span>Tanggal: {activeArticle.date}</span>
                <span>•</span>
                <span>Penulis: {activeArticle.author}</span>
              </div>

              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-64 object-cover rounded-2xl shadow-md border border-stone-200"
              />

              <div className="text-xs sm:text-sm text-stone-700 leading-relaxed space-y-4 whitespace-pre-line font-normal">
                {activeArticle.body}
              </div>

              {activeArticle.tags && (
                <div className="flex items-center gap-2 pt-4 border-t border-stone-200 text-xs">
                  <Tag className="w-3.5 h-3.5 text-stone-400" />
                  {activeArticle.tags.map((t, i) => (
                    <span key={i} className="bg-stone-100 text-stone-600 px-2.5 py-1 rounded-md font-bold">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* G105 / G205 WhatsApp Share & Broadcast Action */}
              <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2.5">
                <button
                  onClick={() => setShowBroadcastModal(true)}
                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-stone-300 dark:border-stone-700 transition cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-emerald-600" />
                  Pratinjau Format
                </button>
                <button
                  onClick={() => shareToWhatsAppOrWeb(activeArticle.title, 'w3', activeArticle.body.slice(0, 160) + '...')}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition transform active:scale-95 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  Kirim ke WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Broadcast Modal */}
        {activeArticle && (
          <WhatsAppBroadcastModal
            isOpen={showBroadcastModal}
            onClose={() => setShowBroadcastModal(false)}
            title={activeArticle.title}
            category={activeArticle.category}
            body={activeArticle.body}
            targetTab="w3"
          />
        )}
      </div>
    </ImmersiveWorldLandscape>
  );
};
