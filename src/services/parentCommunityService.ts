/**
 * TADE PARENT COMMUNITY SERVICE — SPRINT G7 (P4)
 * Class Communities, Event Groups, Parent Bench, DM with Approval,
 * Guardian Safety Layer (Phone Masking), and Multi-Child Family Hub.
 */

export interface ChildProfile {
  id: string;
  name: string;
  nickname: string;
  gender: 'L' | 'P';
  className: string;
  cohort: string;
  avatarUrl: string;
  tahfidzProgress: string;
  adabScore: number;
  unpaidBills: number;
  unreadNotes: number;
}

export interface ParentBenchPost {
  id: string;
  authorName: string;
  authorChild: string;
  authorPhoneMasked: string; // e.g. 0812-****-8821
  authorAvatar: string;
  category: 'PARENTING' | 'BEKAL_SEHAT' | 'TAHFIDZ_TIPS' | 'KEGIATAN';
  title: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLikedByMe?: boolean;
  commentsCount: number;
  isVerifiedParent: boolean;
  isModeratedByTeacher: boolean;
  teacherEndorsement?: string;
  comments: Array<{
    id: string;
    sender: string;
    senderRole: string;
    text: string;
    time: string;
  }>;
}

export interface CommunityGroup {
  id: string;
  name: string;
  type: 'CLASS' | 'EVENT' | 'SPECIAL_INTEREST';
  memberCount: number;
  description: string;
  icon: string;
  isJoined: boolean;
  teacherInCharge: string;
  latestActivity: string;
}

export interface DirectMessageRequest {
  id: string;
  senderParentName: string;
  senderChildName: string;
  recipientParentName: string;
  topic: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  requestedAt: string;
}

const SAMPLE_CHILDREN: ChildProfile[] = [
  {
    id: 'child-farhan',
    name: 'Muhammad Farhan Al-Fatih',
    nickname: 'Farhan',
    gender: 'L',
    className: 'TK B1 (Utsman bin Affan)',
    cohort: 'TK_B1',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=60',
    tahfidzProgress: 'An-Naba 1-20 (Mutqin)',
    adabScore: 96,
    unpaidBills: 0,
    unreadNotes: 1
  },
  {
    id: 'child-aisyah',
    name: 'Aisyah Humaira Azzahra',
    nickname: 'Aisyah',
    gender: 'P',
    className: 'Playgroup (Thariq bin Ziyad)',
    cohort: 'PLAYGROUP',
    avatarUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=200&auto=format&fit=crop&q=60',
    tahfidzProgress: 'Surah Al-Fatihah & Al-Ikhlas',
    adabScore: 94,
    unpaidBills: 0,
    unreadNotes: 0
  }
];

const INITIAL_BENCH_POSTS: ParentBenchPost[] = [
  {
    id: 'post-1',
    authorName: 'Bunda Sarah (Wali Farhan)',
    authorChild: 'Muhammad Farhan (TK B1)',
    authorPhoneMasked: '0812-****-3319',
    authorAvatar: '🧕',
    category: 'TAHFIDZ_TIPS',
    title: 'Metode Muroja\'ah Santai Sebelum Tidur untuk Juz 30',
    content: 'Assalamu\'alaikum bunda-bunda shalihah. Alhamdulillah mendengarkan murottal santai sambil peluk ananda 15 menit sebelum tidur ternyata sangat membantu hafalan Surah An-Naba ananda jadi cepat mutqin.',
    createdAt: 'Hari ini, 07:30 WIB',
    likesCount: 19,
    isLikedByMe: true,
    commentsCount: 3,
    isVerifiedParent: true,
    isModeratedByTeacher: true,
    teacherEndorsement: 'Masya Allah bunda Farhan, metode bonding kasih sayang ini sangat sesuai dengan adab talaqqi Rasulullah SAW.',
    comments: [
      { id: 'c-1', sender: 'Bunda Rayyan (TK B1)', senderRole: 'WALI', text: 'Masya Allah tipsnya sangat bermanfaat bunda!', time: '08:00 WIB' },
      { id: 'c-2', sender: 'Ustadzah Fatimah, S.Pd', senderRole: 'GURU', text: 'Alhamdulillah Farhan di kelas juga sangat tartil melafalkannya.', time: '08:15 WIB' }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Bunda Nadia (Wali Kenzo)',
    authorChild: 'Kenzo Alvaro (TK A1)',
    authorPhoneMasked: '0857-****-9102',
    authorAvatar: '👩‍🦰',
    category: 'BEKAL_SEHAT',
    title: 'Ide Bento Bekal Sentra: Sayur Organik & Telur Puyuh Karakter',
    content: 'Share resep praktis bekal sehat tanpa MSG untuk tema Sentra Memasak & Sentra Alam besok!',
    createdAt: 'Kemarin, 16:45 WIB',
    likesCount: 14,
    isLikedByMe: false,
    commentsCount: 2,
    isVerifiedParent: true,
    isModeratedByTeacher: true,
    comments: [
      { id: 'c-3', sender: 'Bunda Aisyah (PG)', senderRole: 'WALI', text: 'Boleh minta takaran bumbu alaminya bunda?', time: '17:00 WIB' }
    ]
  }
];

const INITIAL_GROUPS: CommunityGroup[] = [
  {
    id: 'grp-tk-b1',
    name: 'Paguyuban Kelas TK B1 (Utsman bin Affan)',
    type: 'CLASS',
    memberCount: 22,
    description: 'Wadah silaturahmi, informasi jadwal sentra, dan parenting kelas TK B1.',
    icon: '🌸',
    isJoined: true,
    teacherInCharge: 'Ustadzah Fatimah, S.Pd',
    latestActivity: 'Dokumentasi Sentra Main Peran dibagikan.'
  },
  {
    id: 'grp-tk-a1',
    name: 'Paguyuban Kelas TK A1 (Abu Bakar)',
    type: 'CLASS',
    memberCount: 20,
    description: 'Koordinasi kegiatan belajar dan adab kelas TK A1.',
    icon: '🌱',
    isJoined: false,
    teacherInCharge: 'Ustadzah Sarah, S.Pd',
    latestActivity: 'Pengingat perlengkapan sentra alam.'
  },
  {
    id: 'grp-event-milad',
    name: 'Kepanitiaan Wali Milad Ke-15 & Wisuda Akbar',
    type: 'EVENT',
    memberCount: 35,
    description: 'Grup koordinasi panitia gebyar milad, pawai budaya, dan pentas seni santri.',
    icon: '🎪',
    isJoined: true,
    teacherInCharge: 'Ustadz Ahmad & Komite Sekolah',
    latestActivity: 'Rancangan susunan acara kirab santri dirilis.'
  }
];

const STORAGE_KEY = 'tade_parent_community_store_v10_4';

class ParentCommunityService {
  private static instance: ParentCommunityService | null = null;
  private children: ChildProfile[];
  private activeChildId: string;
  private posts: ParentBenchPost[];
  private groups: CommunityGroup[];
  private dmRequests: DirectMessageRequest[];
  private listeners: Array<() => void> = [];

  private constructor() {
    this.children = [...SAMPLE_CHILDREN];
    this.activeChildId = 'child-farhan';
    this.posts = [...INITIAL_BENCH_POSTS];
    this.groups = [...INITIAL_GROUPS];
    this.dmRequests = [
      {
        id: 'dm-req-1',
        senderParentName: 'Bunda Rayyan',
        senderChildName: 'Rayyan (TK B1)',
        recipientParentName: 'Bunda Farhan',
        topic: 'Tanya info penjahit seragam wisuda',
        status: 'ACCEPTED',
        requestedAt: '21 Agustus 2026'
      }
    ];
    this.loadFromStorage();
  }

  public static getInstance(): ParentCommunityService {
    if (!ParentCommunityService.instance) {
      ParentCommunityService.instance = new ParentCommunityService();
    }
    return ParentCommunityService.instance;
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.activeChildId) this.activeChildId = parsed.activeChildId;
      if (parsed.posts) this.posts = parsed.posts;
      if (parsed.groups) this.groups = parsed.groups;
      if (parsed.dmRequests) this.dmRequests = parsed.dmRequests;
    } catch {
      // fallback
    }
  }

  public getChildren(): ChildProfile[] {
    return [...this.children];
  }

  public getActiveChild(): ChildProfile {
    return this.children.find(c => c.id === this.activeChildId) || this.children[0];
  }

  public setActiveChild(childId: string): void {
    this.activeChildId = childId;
    this.persist();
  }

  public getBenchPosts(): ParentBenchPost[] {
    return [...this.posts];
  }

  public getGroups(): CommunityGroup[] {
    return [...this.groups];
  }

  public getDmRequests(): DirectMessageRequest[] {
    return [...this.dmRequests];
  }

  public toggleLike(postId: string): void {
    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLikedByMe;
        return {
          ...p,
          isLikedByMe: isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    });
    this.persist();
  }

  public addComment(postId: string, text: string, sender = 'Bunda Farhan', role = 'WALI'): void {
    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [
            ...p.comments,
            {
              id: `c-${Date.now()}`,
              sender,
              senderRole: role,
              text,
              time: 'Baru saja'
            }
          ]
        };
      }
      return p;
    });
    this.persist();
  }

  public createPost(payload: { title: string; content: string; category: ParentBenchPost['category'] }): ParentBenchPost {
    const active = this.getActiveChild();
    const newPost: ParentBenchPost = {
      id: `post-${Date.now()}`,
      authorName: `Bunda ${active.nickname}`,
      authorChild: `${active.name} (${active.className})`,
      authorPhoneMasked: '0812-****-3319',
      authorAvatar: '🧕',
      category: payload.category,
      title: payload.title,
      content: payload.content,
      createdAt: 'Baru saja',
      likesCount: 1,
      isLikedByMe: true,
      commentsCount: 0,
      isVerifiedParent: true,
      isModeratedByTeacher: true,
      comments: []
    };

    this.posts = [newPost, ...this.posts];
    this.persist();
    return newPost;
  }

  public toggleJoinGroup(groupId: string): void {
    this.groups = this.groups.map(g => {
      if (g.id === groupId) {
        const joined = !g.isJoined;
        return {
          ...g,
          isJoined: joined,
          memberCount: joined ? g.memberCount + 1 : Math.max(0, g.memberCount - 1)
        };
      }
      return g;
    });
    this.persist();
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private persist(): void {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          activeChildId: this.activeChildId,
          posts: this.posts,
          groups: this.groups,
          dmRequests: this.dmRequests
        })
      );
      this.notify();
    } catch (e) {
      console.warn('Failed to persist Parent Community store:', e);
    }
  }

  private notify(): void {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('Parent community listener error:', err);
      }
    });
  }
}

export const parentCommunityService = ParentCommunityService.getInstance();
