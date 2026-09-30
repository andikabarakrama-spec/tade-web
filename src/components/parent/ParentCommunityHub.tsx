import React, { useState, useEffect } from 'react';
import {
  Users,
  Heart,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Award,
  Send,
  Plus,
  Lock,
  ChevronRight,
  UserCheck,
  Calendar,
  Layers,
  HeartHandshake
} from 'lucide-react';
import {
  parentCommunityService,
  ChildProfile,
  ParentBenchPost,
  CommunityGroup,
  DirectMessageRequest
} from '../../services/parentCommunityService';
import { livingMicroInteractionEngine } from '../../services/livingMicroInteractions';

export const ParentCommunityHub: React.FC = () => {
  const [children, setChildren] = useState<ChildProfile[]>(() => parentCommunityService.getChildren());
  const [activeChild, setActiveChild] = useState<ChildProfile>(() => parentCommunityService.getActiveChild());
  const [posts, setPosts] = useState<ParentBenchPost[]>(() => parentCommunityService.getBenchPosts());
  const [groups, setGroups] = useState<CommunityGroup[]>(() => parentCommunityService.getGroups());
  const [dmRequests, setDmRequests] = useState<DirectMessageRequest[]>(() => parentCommunityService.getDmRequests());

  const [activeTab, setActiveTab] = useState<'BENCH' | 'GROUPS' | 'DM_APPROVAL' | 'FAMILY_HUB'>('BENCH');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<ParentBenchPost['category']>('PARENTING');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsub = parentCommunityService.subscribe(() => {
      setChildren(parentCommunityService.getChildren());
      setActiveChild(parentCommunityService.getActiveChild());
      setPosts(parentCommunityService.getBenchPosts());
      setGroups(parentCommunityService.getGroups());
      setDmRequests(parentCommunityService.getDmRequests());
    });
    return unsub;
  }, []);

  const handleSelectChild = (childId: string) => {
    parentCommunityService.setActiveChild(childId);
  };

  const handleLike = (postId: string) => {
    parentCommunityService.toggleLike(postId);
  };

  const handleAddComment = (postId: string) => {
    const text = commentInput[postId];
    if (!text?.trim()) return;
    parentCommunityService.addComment(postId, text, `Bunda ${activeChild.nickname}`, 'WALI');
    setCommentInput(prev => ({ ...prev, [postId]: '' }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    parentCommunityService.createPost({
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory
    });

    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPostModal(false);
  };

  const handleToggleJoin = (groupId: string) => {
    parentCommunityService.toggleJoinGroup(groupId);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Family Hub Multi-Child Switcher Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 rounded-3xl border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={activeChild.avatarUrl}
                alt={activeChild.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full text-[10px]">
                🌿
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  Family Hub Active
                </span>
                <span className="text-xs text-emerald-300 font-mono">1 Akun Multi-Anak</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                {activeChild.name}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {activeChild.className} • Tahfidz: <span className="text-amber-300 font-bold">{activeChild.tahfidzProgress}</span>
              </p>
            </div>
          </div>

          {/* Child Selection Pills */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-emerald-500/30">
            <span className="text-[11px] font-bold text-slate-400 px-2">Ganti Ananda:</span>
            {children.map(c => (
              <button
                key={c.id}
                onClick={() => handleSelectChild(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  c.id === activeChild.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{c.gender === 'L' ? '👦' : '👧'}</span>
                <span>{c.nickname}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('BENCH')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'BENCH'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5" /> Bangku Wali (Parent Bench)
        </button>
        <button
          onClick={() => setActiveTab('GROUPS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'GROUPS'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Paguyuban & Event ({groups.length})
        </button>
        <button
          onClick={() => setActiveTab('DM_APPROVAL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'DM_APPROVAL'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Persetujuan DM ({dmRequests.length})
        </button>
      </div>

      {/* TAB 1: PARENT BENCH */}
      {activeTab === 'BENCH' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Diskusi Santun & Parenting Sahabat Asy Syifa
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                Guardian Safety Active (No Phone Leak)
              </span>
            </div>
            <button
              onClick={() => setShowNewPostModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5" /> Tulis Cerita / Tips
            </button>
          </div>

          <div className="space-y-4">
            {posts.map(post => (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-lg">
                      {post.authorAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {post.authorName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {post.authorPhoneMasked}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{post.authorChild} • {post.createdAt}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                    {post.category}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{post.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{post.content}</p>
                </div>

                {/* Teacher Endorsement Tag */}
                {post.teacherEndorsement && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-900 dark:text-emerald-200 italic">
                      <span className="font-bold not-italic">Catatan Ustadzah:</span> {post.teacherEndorsement}
                    </p>
                  </div>
                )}

                {/* Actions & Comment Input */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                        post.isLikedByMe ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLikedByMe ? 'fill-rose-500' : ''}`} />
                      <span>{post.likesCount} Suka</span>
                    </button>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <MessageCircle className="w-4 h-4" /> {post.commentsCount} Komentar
                    </span>
                  </div>
                </div>

                {/* Comments List */}
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-2 pt-2 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl">
                    {post.comments.map(c => (
                      <div key={c.id} className="text-xs flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{c.sender}: </span>
                          <span className="text-slate-600 dark:text-slate-400">{c.text}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{c.time}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Tulis balasan santun..."
                    value={commentInput[post.id] || ''}
                    onChange={e => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                    className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: GROUPS */}
      {activeTab === 'GROUPS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map(grp => (
            <div
              key={grp.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-xl flex items-center justify-center">
                    {grp.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{grp.name}</h4>
                    <p className="text-xs text-slate-500">{grp.memberCount} Anggota • Pembina: {grp.teacherInCharge}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleJoin(grp.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    grp.isJoined
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {grp.isJoined ? 'Tergabung' : '+ Gabung'}
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{grp.description}</p>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
                <span className="font-bold text-emerald-600">Aktivitas Terakhir:</span> {grp.latestActivity}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: DM APPROVAL */}
      {activeTab === 'DM_APPROVAL' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Persetujuan Komunikasi Langsung (Anti-Spam & Privasi)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Demi menjaga adab dan kenyamanan wali murid, komunikasi privat antar wali murid memerlukan konfirmasi sebelum pesan dapat dikirimkan.
          </p>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {dmRequests.map(req => (
              <div key={req.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{req.senderParentName}</span>
                    <span className="text-[10px] text-slate-500">({req.senderChildName})</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Topik: "{req.topic}"</p>
                  <span className="text-[10px] text-slate-400 font-mono">Diajukan: {req.requestedAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold">
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal New Post */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tulis Cerita / Tips di Bangku Wali
            </h3>
            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Kategori</label>
                <select
                  value={newPostCategory}
                  onChange={e => setNewPostCategory(e.target.value as any)}
                  className="w-full mt-1 p-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="PARENTING">Parenting & Adab</option>
                  <option value="TAHFIDZ_TIPS">Tips Hafalan / Tahfidz</option>
                  <option value="BEKAL_SEHAT">Ide Bekal Sehat</option>
                  <option value="KEGIATAN">Kegiatan & Kerjasama</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Judul</label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={e => setNewPostTitle(e.target.value)}
                  placeholder="Contoh: Pengalaman membiasakan sholat dhuha..."
                  className="w-full mt-1 p-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Isi Cerita</label>
                <textarea
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                  rows={4}
                  placeholder="Bagikan pengalaman bernilai berkah untuk sesama wali..."
                  className="w-full mt-1 p-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Publikasikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
