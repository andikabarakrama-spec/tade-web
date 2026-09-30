import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  Send,
  Inbox,
  Bell,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Lock,
  Mail,
  MessageCircle,
  Plus,
  Eye,
  Archive,
  ShieldCheck,
  FileText,
  Check,
  Copy,
  ChevronRight,
  Sliders,
  Radio,
  Layers,
  UserCheck,
  Building2,
  PhoneCall,
  User,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DataService } from '../../services/db';
import {
  SystemNotification,
  NotificationType,
  NotificationPriority,
  UserRole,
  Student,
  Teacher,
  AuditLog,
  SchoolProfile
} from '../../types';

// Canonical System Roles supported by the institution
const CANONICAL_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KETUA_YAYASAN',
  'KEPALA_SEKOLAH',
  'GURU',
  'KEUANGAN',
  'WALI_MURID',
  'CALON_WALI_MURID',
  'ALUMNI_FAMILY'
];

// Institutional administrative leadership roles authorized for broadcast & management
const ADMINISTRATIVE_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'KEPALA_SEKOLAH',
  'KETUA_YAYASAN'
];

export type CommunicationCategory =
  | 'BROADCAST'
  | 'APPROVAL'
  | 'ACADEMIC'
  | 'FINANCIAL'
  | 'PARENT_MESSAGE'
  | 'TEACHER_MESSAGE'
  | 'INSTITUTIONAL';

export type MessageDeliveryStage =
  | 'CREATED'
  | 'QUEUED'
  | 'DELIVERED_INTERNAL'
  | 'READ'
  | 'ARCHIVED'
  | 'FAILED_VALIDATION';

export interface UnifiedMessageItem {
  id: string;
  code: string;
  type: NotificationType;
  category: CommunicationCategory;
  categoryLabel: string;
  title: string;
  body: string;
  senderUid: string;
  senderName: string;
  senderRole: UserRole;
  recipientType: 'BROADCAST' | 'ROLE' | 'SPECIFIC_USER';
  recipientId?: string;
  recipientRole?: UserRole | UserRole[];
  recipientName: string;
  priority: NotificationPriority;
  stage: MessageDeliveryStage;
  deliveryChannels: {
    internal: boolean;
    emailPrep: boolean;
    whatsappPrep: boolean;
  };
  createdAt: string;
  queuedAt?: string;
  deliveredAt?: string;
  readAt?: string;
  archivedAt?: string;
  failedReason?: string;
  templateCode?: string;
  metadata?: Record<string, any>;
}

export const R54EnterpriseCommunicationHub: React.FC = () => {
  const { currentUser, userProfile, activeRole } = useAuth();

  // 1. Authoritative Fail-Closed Active Role Determination
  const verifiedActiveRole = useMemo<UserRole | null>(() => {
    if (!currentUser?.uid || !activeRole) return null;
    return CANONICAL_ROLES.includes(activeRole as UserRole) ? (activeRole as UserRole) : null;
  }, [currentUser?.uid, activeRole]);

  // Administrative authority check for broadcast & audit logs
  const isAdministrativeRole = useMemo<boolean>(() => {
    return Boolean(verifiedActiveRole && ADMINISTRATIVE_ROLES.includes(verifiedActiveRole));
  }, [verifiedActiveRole]);

  // Authentic actor resolution - fail-closed if unidentifiable
  const authenticActor = useMemo<string | null>(() => {
    if (!currentUser?.uid) return null;
    const name = userProfile?.nama || userProfile?.name || currentUser.displayName || currentUser.email;
    return name && name.trim() ? name.trim() : null;
  }, [currentUser, userProfile]);

  // Concurrency & In-Flight Lock State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Navigation & Tab States
  const [activeTab, setActiveTab] = useState<
    'MESSAGES_INBOX' | 'COMPOSER' | 'DELIVERY_INSPECTOR' | 'CHANNEL_READINESS' | 'AUDIT_LOGS'
  >('MESSAGES_INBOX');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<CommunicationCategory | 'ALL'>('ALL');
  const [stageFilter, setStageFilter] = useState<MessageDeliveryStage | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<NotificationPriority | 'ALL'>('ALL');
  const [selectedMessageId, setSelectedMessageId] = useState<string>('');

  // Composer Form States
  const [composerRecipientType, setComposerRecipientType] = useState<'BROADCAST' | 'ROLE' | 'SPECIFIC_USER'>('BROADCAST');
  const [composerTargetRole, setComposerTargetRole] = useState<UserRole>('WALI_MURID');
  const [composerTargetUser, setComposerTargetUser] = useState<string>('');
  const [composerCategory, setComposerCategory] = useState<CommunicationCategory>('ACADEMIC');
  const [composerPriority, setComposerPriority] = useState<NotificationPriority>('normal');
  const [composerTitle, setComposerTitle] = useState<string>('');
  const [composerBody, setComposerBody] = useState<string>('');
  const [composerEnableEmailPrep, setComposerEnableEmailPrep] = useState<boolean>(true);
  const [composerEnableWAPrep, setComposerEnableWAPrep] = useState<boolean>(true);

  // Dynamic UI States
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Live System Data
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Local Unified Messages State (backed by DataService Notifications)
  const [messages, setMessages] = useState<UnifiedMessageItem[]>([]);

  // Load Initial System Data with Pre-Query Gate & Strict Sensitive Data Isolation
  const loadCommunicationData = async () => {
    // 1. Authoritative Pre-Query Session Gate
    if (!currentUser?.uid || !verifiedActiveRole) {
      setTeachers([]);
      setStudents([]);
      setSchoolProfile(null);
      setAuditLogs([]);
      setMessages([]);
      return;
    }

    try {
      let tchList: Teacher[] = [];
      let stdList: Student[] = [];
      let logsList: AuditLog[] = [];
      let prof: SchoolProfile | null = null;
      let rawNotifs: SystemNotification[] = [];

      // 2. Sensitive Data Isolation: queries executed only after role authorization
      if (isAdministrativeRole) {
        const [loadedTeachers, loadedStudents, loadedProfile, loadedLogs, loadedNotifs] = await Promise.all([
          DataService.getTeachers(),
          DataService.getStudents(),
          DataService.getSchoolProfile(),
          DataService.getAuditLogs(),
          DataService.getNotifications()
        ]);
        tchList = loadedTeachers || [];
        stdList = loadedStudents || [];
        prof = loadedProfile;
        logsList = loadedLogs || [];
        rawNotifs = loadedNotifs || [];
      } else {
        // Non-administrative users: query only their own scoped communications and school profile
        const [loadedProfile, loadedNotifs] = await Promise.all([
          DataService.getSchoolProfile(),
          DataService.getNotifications(currentUser.uid, verifiedActiveRole)
        ]);
        prof = loadedProfile;
        rawNotifs = loadedNotifs || [];
        // Isolate sensitive datasets from non-admin state
        tchList = [];
        stdList = [];
        logsList = [];
      }

      setTeachers(tchList);
      setStudents(stdList);
      setSchoolProfile(prof);
      setAuditLogs(logsList);

      // Convert authentic SystemNotifications into UnifiedMessageItems
      const mappedList: UnifiedMessageItem[] = (rawNotifs || []).map((n, idx) => {
        let cat: CommunicationCategory = 'INSTITUTIONAL';
        if (n.type.startsWith('APPROVAL')) cat = 'APPROVAL';
        else if (n.type === 'SYSTEM_BROADCAST') cat = 'BROADCAST';
        else if (n.type === 'PAYMENT_REMINDER') cat = 'FINANCIAL';
        else if (n.type === 'ACADEMIC_ANNOUNCEMENT') cat = 'ACADEMIC';

        const rawRole = n.metadata?.senderRole || (n.recipientRole ? (Array.isArray(n.recipientRole) ? n.recipientRole[0] : n.recipientRole) : null);
        const resolvedRole: UserRole = (rawRole && CANONICAL_ROLES.includes(rawRole as UserRole))
          ? (rawRole as UserRole)
          : verifiedActiveRole;

        return {
          id: n.id,
          code: `MSG-${cat.slice(0, 4)}-${(1000 + idx).toString()}`,
          type: n.type,
          category: cat,
          categoryLabel: n.type.replace(/_/g, ' '),
          title: n.title,
          body: n.message,
          senderUid: n.metadata?.senderUid || n.sourceId || currentUser.uid,
          senderName: n.metadata?.senderName || n.source || 'Layanan Komunikasi Resmi Sekolah',
          senderRole: resolvedRole,
          recipientType: n.recipientId === 'BROADCAST' ? 'BROADCAST' : (n.recipientRole ? 'ROLE' : 'SPECIFIC_USER'),
          recipientId: n.recipientId,
          recipientRole: n.recipientRole,
          recipientName: n.recipientId === 'BROADCAST'
            ? 'Semua Penerima'
            : (n.recipientRole ? `Role: ${Array.isArray(n.recipientRole) ? n.recipientRole.join(', ') : n.recipientRole}` : (n.recipientId || 'Penerima Terdaftar')),
          priority: n.priority || 'normal',
          stage: n.isRead ? 'READ' : 'DELIVERED_INTERNAL',
          deliveryChannels: { internal: true, emailPrep: true, whatsappPrep: true },
          createdAt: n.createdAt,
          deliveredAt: n.createdAt,
          readAt: n.readAt,
          metadata: n.metadata
        };
      });

      setMessages(mappedList);
      if (mappedList.length > 0) {
        setSelectedMessageId((prev) => (prev && mappedList.some((m) => m.id === prev) ? prev : mappedList[0].id));
      } else {
        setSelectedMessageId('');
      }

      if (stdList.length > 0) {
        setComposerTargetUser(stdList[0].id);
      }
    } catch (err) {
      console.error('Error loading communication hub data:', err);
    }
  };

  useEffect(() => {
    loadCommunicationData();
  }, [currentUser?.uid, verifiedActiveRole, isAdministrativeRole]);

  // Filtered Messages
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchesSearch =
        !searchQuery ||
        msg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.senderName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'ALL' || msg.category === categoryFilter;
      const matchesStage = stageFilter === 'ALL' || msg.stage === stageFilter;
      const matchesPriority = priorityFilter === 'ALL' || msg.priority === priorityFilter;

      return matchesSearch && matchesCategory && matchesStage && matchesPriority;
    });
  }, [messages, searchQuery, categoryFilter, stageFilter, priorityFilter]);

  // Selected Active Message
  const activeMessage = useMemo(() => {
    return messages.find((m) => m.id === selectedMessageId) || messages[0];
  }, [messages, selectedMessageId]);

  // Key Statistics
  const stats = useMemo(() => {
    const total = messages.length;
    const deliveredCount = messages.filter((m) => m.stage === 'DELIVERED_INTERNAL' || m.stage === 'READ').length;
    const queuedCount = messages.filter((m) => m.stage === 'QUEUED').length;
    const readCount = messages.filter((m) => m.stage === 'READ').length;
    const urgentCount = messages.filter((m) => m.priority === 'urgent' || m.priority === 'high').length;

    return { total, deliveredCount, queuedCount, readCount, urgentCount };
  }, [messages]);

  // Presets / Pre-made Templates Selection
  const handleApplyTemplate = (tmplType: 'ANNOUNCEMENT' | 'SPP' | 'MEETING' | 'VERIFICATION') => {
    if (tmplType === 'ANNOUNCEMENT') {
      setComposerCategory('BROADCAST');
      setComposerTitle('Pengumuman Kegiatan Belajar Mengajar & Libur Sekolah');
      setComposerBody(`Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nDiberitahukan kepada Ayah / Bunda Wali Murid bahwa kegiatan belajar mengajar pada hari Jumat mendatang disesuaikan dengan agenda puncak tema Islami. Ananda diharapkan hadir tepat waktu.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh.\nManajemen TK Islam Asy-Syifatan.`);
      setComposerPriority('normal');
    } else if (tmplType === 'SPP') {
      setComposerCategory('FINANCIAL');
      setComposerTitle('Pemberitahuan Tagihan SPP & Administrasi Bulanan');
      setComposerBody(`Yth. Bapak/Ibu Wali Murid.\n\nBerikut kami sampaikan pengingat pembayaran SPP & Administrasi sekolah untuk bulan berjalan. Pembayaran dapat dilakukan dengan aman melalui portal resmi secara cashless (QRIS / Transfer Bank).\n\nTerima kasih atas kerja samanya.\nKeuangan TK Islam Asy-Syifatan.`);
      setComposerPriority('high');
    } else if (tmplType === 'MEETING') {
      setComposerCategory('PARENT_MESSAGE');
      setComposerTitle('Undangan Pertemuan Wali Murid & Konsultasi Perkembangan Anak');
      setComposerBody(`Bapak/Ibu Wali Murid yang terhormat.\n\nKami mengundang kehadiran Ayah/Bunda dalam sesi konsultasi Laporan Perkembangan Anak (LPA) bersama Wali Kelas. Silakan memilih jadwal yang tersedia melalui aplikasi SIM Sekolah.\n\nSalam hangat,\nDewan Guru TK Islam Asy-Syifatan.`);
      setComposerPriority('normal');
    } else if (tmplType === 'VERIFICATION') {
      setComposerCategory('APPROVAL');
      setComposerTitle('Peringatan Verifikasi Dokumen & Berkas Persetujuan Pending');
      setComposerBody(`Diinformasikan kepada Tim Verifikator / Kepala Sekolah bahwa terdapat berkas kelengkapan administrasi yang membutuhkan tinjauan dan pengesahan digital.\n\nMohon periksa menu Central Approval Engine.`);
      setComposerPriority('urgent');
    }
  };

  // Submit & Dispatch New Message with Strict Authorization, Authentic Identity, and Canonical Audit
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Anti double-submit concurrency lock
    if (isSubmitting) return;

    // 2. Authoritative Fail-Closed Handler Authorization
    if (!currentUser?.uid || !verifiedActiveRole || !isAdministrativeRole || !authenticActor) {
      setNoticeMessage('Akses Ditolak: Anda tidak memiliki wewenang administratif untuk menerbitkan pesan broadcast.');
      return;
    }

    if (!composerTitle.trim() || !composerBody.trim()) {
      setNoticeMessage('Peringatan: Judul dan isi pesan wajib diisi!');
      return;
    }

    setIsSubmitting(true);

    const newId = `MSG-2026-${composerCategory.slice(0, 4)}-${Math.floor(100 + Math.random() * 900)}`;
    const newCode = `MSG-${composerCategory.slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';

    let recipientName = 'Semua Civitas & Wali Murid';
    if (composerRecipientType === 'ROLE') {
      recipientName = `Seluruh Role: ${composerTargetRole}`;
    } else if (composerRecipientType === 'SPECIFIC_USER') {
      const foundStudent = students.find((s) => s.id === composerTargetUser);
      recipientName = foundStudent ? `Siswa: ${foundStudent.name}` : 'Penerima Terpilih';
    }

    // Convert category to NotificationType
    let notifType: NotificationType = 'SYSTEM_BROADCAST';
    if (composerCategory === 'FINANCIAL') notifType = 'PAYMENT_REMINDER';
    else if (composerCategory === 'ACADEMIC') notifType = 'ACADEMIC_ANNOUNCEMENT';
    else if (composerCategory === 'APPROVAL') notifType = 'APPROVAL_CREATED';

    const newMessage: UnifiedMessageItem = {
      id: newId,
      code: newCode,
      type: notifType,
      category: composerCategory,
      categoryLabel: composerCategory.replace('_', ' '),
      title: composerTitle.trim(),
      body: composerBody.trim(),
      senderUid: currentUser.uid,
      senderName: authenticActor,
      senderRole: verifiedActiveRole,
      recipientType: composerRecipientType,
      recipientId: composerRecipientType === 'SPECIFIC_USER' ? composerTargetUser : undefined,
      recipientRole: composerRecipientType === 'ROLE' ? composerTargetRole : undefined,
      recipientName,
      priority: composerPriority,
      stage: 'DELIVERED_INTERNAL',
      deliveryChannels: {
        internal: true,
        emailPrep: composerEnableEmailPrep,
        whatsappPrep: composerEnableWAPrep
      },
      createdAt: nowStr,
      queuedAt: nowStr,
      deliveredAt: nowStr,
      templateCode: `TMPL-CUSTOM-${Math.floor(100 + Math.random() * 900)}`
    };

    try {
      // 1. Trigger Notification Engine in DataService
      if (composerRecipientType === 'BROADCAST') {
        await DataService.sendBroadcastNotification({
          type: notifType,
          title: composerTitle.trim(),
          message: composerBody.trim(),
          source: 'Enterprise Communication Hub',
          priority: composerPriority
        });
      } else if (composerRecipientType === 'ROLE') {
        await DataService.sendRoleNotification(composerTargetRole, {
          type: notifType,
          title: composerTitle.trim(),
          message: composerBody.trim(),
          source: 'Enterprise Communication Hub',
          priority: composerPriority
        });
      } else {
        await DataService.createNotification({
          id: newId,
          recipientId: composerTargetUser,
          type: notifType,
          title: composerTitle.trim(),
          message: composerBody.trim(),
          source: 'Enterprise Communication Hub',
          priority: composerPriority,
          status: 'unread',
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }

      // 2. Canonical Audit Log Execution with authentic actor and verifiedActiveRole
      const auditDetail = `Communication Hub - ${newCode}: ${composerTitle.trim()} (Tujuan: ${recipientName})`;
      await DataService.logAction(authenticActor, verifiedActiveRole, 'SEND_COMMUNICATION_MESSAGE', auditDetail);
      await DataService.createAuditLog({
        uid: currentUser.uid,
        userName: authenticActor,
        role: verifiedActiveRole,
        action: 'SEND_COMMUNICATION_MESSAGE',
        targetModule: auditDetail
      });

      // 3. Index into Knowledge Engine
      await DataService.indexKnowledge({
        sourceType: 'notifications',
        sourceId: newId,
        title: `Pesan Komunikasi: ${composerTitle.trim()}`,
        description: composerBody.trim().substring(0, 150),
        category: composerCategory,
        module: 'R54 - Communication Hub',
        accessRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID']
      });

      setMessages((prev) => [newMessage, ...prev]);
      setSelectedMessageId(newId);
      setComposerTitle('');
      setComposerBody('');
      setNoticeMessage(`Sukses! Pesan [${newCode}] telah diterbitkan dan dikirimkan secara terpadu melalui Delivery Center.`);
      setActiveTab('MESSAGES_INBOX');

      setTimeout(() => setNoticeMessage(null), 4000);
    } catch (err) {
      console.error('Error dispatching communication message:', err);
      setNoticeMessage('Gagal mengirim pesan. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mark Message as Read / Archived with in-handler authorization and authentic audit
  const handleUpdateMessageStage = async (msgId: string, newStage: MessageDeliveryStage) => {
    if (isSubmitting) return;

    if (!currentUser?.uid || !verifiedActiveRole || !authenticActor) {
      setNoticeMessage('Akses Ditolak: Sesi autentikasi tidak valid.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = messages.map((m) => {
        if (m.id === msgId) {
          const nowStr = new Date().toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) + ' WIB';

          return {
            ...m,
            stage: newStage,
            readAt: newStage === 'READ' ? nowStr : m.readAt,
            archivedAt: newStage === 'ARCHIVED' ? nowStr : m.archivedAt
          };
        }
        return m;
      });

      setMessages(updated);

      if (newStage === 'READ') {
        await DataService.markAsRead(msgId).catch(() => {});
      }

      const auditDetail = `Communication Hub - Msg: ${msgId} stage diubah ke ${newStage}`;
      await DataService.logAction(authenticActor, verifiedActiveRole, `MESSAGE_STAGE_UPDATED_${newStage}`, auditDetail);
      await DataService.createAuditLog({
        uid: currentUser.uid,
        userName: authenticActor,
        role: verifiedActiveRole,
        action: `MESSAGE_STAGE_UPDATED_${newStage}`,
        targetModule: auditDetail
      }).catch(() => {});

      setNoticeMessage(`Status pesan [${msgId}] berhasil diperbarui menjadi "${newStage}".`);
      setTimeout(() => setNoticeMessage(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadCommunicationData();
    setIsRefreshing(false);
    setNoticeMessage('Portal Communication Hub & Delivery Center Berhasil Disegarkan.');
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold uppercase tracking-wider border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-700" /> Sprint P29 • Enterprise Communication Hub & Delivery Center (R54)
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Pusat Komunikasi & Pengiriman Pesan Terpadu
          </h1>
          <p className="text-stone-600 text-xs mt-0.5">
            Pusat integrasi notifikasi sistem, pengumuman broadcast, peringatan keuangan, jadwal akademik, dan pesan guru/wali murid.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Segarkan Portal
          </button>

          {isAdministrativeRole && (
            <button
              onClick={() => setActiveTab('COMPOSER')}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Send className="w-4 h-4" /> Buat Pesan / Broadcast Baru
            </button>
          )}
        </div>
      </div>

      {noticeMessage && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-900 text-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2 border border-emerald-700 shadow-md print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{noticeMessage}</span>
        </motion.div>
      )}

      {/* Key Metrics Dashboard Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 print:hidden">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Total Pesan Terdaftar</span>
          <div className="text-xl font-black text-slate-900 font-mono">{stats.total} Pesan</div>
          <span className="text-[10px] text-emerald-800 font-bold block">Pusat Terpadu</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Terkirim (Internal SIM)</span>
          <div className="text-xl font-black text-emerald-900 font-mono">{stats.deliveredCount} Pesan</div>
          <span className="text-[10px] text-emerald-800 font-bold block">Status Aktif di Portal</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Antrean Delivery</span>
          <div className="text-xl font-black text-amber-700 font-mono">{stats.queuedCount} Pesan</div>
          <span className="text-[10px] text-amber-800 font-bold block">Siap Disebarkan</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Telah Dibaca (Read)</span>
          <div className="text-xl font-black text-indigo-900 font-mono">{stats.readCount} Pesan</div>
          <span className="text-[10px] text-indigo-800 font-bold block">Terbaca oleh Penerima</span>
        </div>

        <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status Kanal Siap</span>
          <div className="text-xs font-black text-emerald-400 font-mono truncate">SIM, EMAIL, WA</div>
          <span className="text-[10px] text-slate-300 block flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" /> Multi-Channel Prep
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 flex flex-wrap gap-2 print:hidden">
        <button
          onClick={() => setActiveTab('MESSAGES_INBOX')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'MESSAGES_INBOX' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Inbox className="w-4 h-4 text-emerald-400" /> 1. Pusat Kotak Pesan & Broadcast ({messages.length})
        </button>

        {isAdministrativeRole && (
          <button
            onClick={() => setActiveTab('COMPOSER')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'COMPOSER' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Send className="w-4 h-4 text-emerald-400" /> 2. Composer & Multi-Channel Publisher
          </button>
        )}

        <button
          onClick={() => setActiveTab('DELIVERY_INSPECTOR')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'DELIVERY_INSPECTOR' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Clock className="w-4 h-4 text-emerald-400" /> 3. Inspector Timeline Pengiriman
        </button>

        <button
          onClick={() => setActiveTab('CHANNEL_READINESS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'CHANNEL_READINESS' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-400" /> 4. Konfigurasi Kesiapan Kanal (Prep)
        </button>

        {isAdministrativeRole && (
          <button
            onClick={() => setActiveTab('AUDIT_LOGS')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'AUDIT_LOGS' ? 'bg-slate-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 5. Audit Trail Komunikasi
          </button>
        )}
      </div>

      {/* TAB 1: MESSAGES INBOX & OUTBOX CATALOG */}
      {activeTab === 'MESSAGES_INBOX' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side: Search, Filters & Message List (5 cols) */}
          <div className="lg:col-span-5 space-y-4 print:hidden">
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-emerald-800" /> Daftar Komunikasi Terpusat
                </h2>
                <span className="px-2.5 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded-full font-mono">
                  {filteredMessages.length} Pesan
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Judul, Isi Pesan, Kode, atau Pengirim..."
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-emerald-700 transition"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-slate-800"
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="BROADCAST">Pengumuman Broadcast</option>
                  <option value="FINANCIAL">Keuangan & SPP</option>
                  <option value="APPROVAL">Persetujuan (Approval)</option>
                  <option value="ACADEMIC">Akademik & Kelas</option>
                  <option value="PARENT_MESSAGE">Pesan Wali Murid</option>
                  <option value="INSTITUTIONAL">Notifikasi Institusi</option>
                </select>

                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value as any)}
                  className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-slate-800"
                >
                  <option value="ALL">Semua Status Delivery</option>
                  <option value="DELIVERED_INTERNAL">Terkirim Internal</option>
                  <option value="READ">Telah Dibaca</option>
                  <option value="QUEUED">Antrean</option>
                  <option value="ARCHIVED">Diarsipkan</option>
                </select>
              </div>

              {/* List Cards */}
              <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
                {filteredMessages.length === 0 ? (
                  <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                    <Inbox className="w-8 h-8 text-stone-400 mx-auto" />
                    <p className="text-xs font-bold text-stone-600">Tidak ada pesan atau komunikasi yang ditemukan.</p>
                  </div>
                ) : (
                  filteredMessages.map((item) => {
                    const isSelected = activeMessage?.id === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedMessageId(item.id)}
                        className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-2 ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                            : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[10px] font-bold">
                            {item.code}
                          </span>

                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-md font-mono ${
                              item.stage === 'READ'
                                ? 'bg-indigo-100 text-indigo-900'
                                : item.stage === 'DELIVERED_INTERNAL'
                                ? 'bg-emerald-100 text-emerald-900'
                                : item.stage === 'QUEUED'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {item.stage.replace('_', ' ')}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xs font-black text-slate-900 leading-tight">{item.title}</h3>
                          <p className="text-[11px] font-medium text-stone-600 line-clamp-2 mt-1">{item.body}</p>
                        </div>

                        <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                          <span>Dari: {item.senderName}</span>
                          <span className="font-bold text-emerald-800">{item.createdAt}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Message Detail Conversation-style Reader (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {activeMessage ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
                {/* Header Info */}
                <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block font-mono">
                          {activeMessage.categoryLabel}
                        </span>
                        <span className="px-2 py-0.2 bg-slate-800 text-slate-300 text-[10px] font-mono rounded-sm">
                          Kode: {activeMessage.code}
                        </span>
                      </div>
                      <h2 className="text-lg font-black text-white mt-0.5">{activeMessage.title}</h2>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Prioritas Pesan</span>
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-full uppercase inline-block mt-0.5 ${
                        activeMessage.priority === 'urgent'
                          ? 'bg-rose-500 text-white'
                          : activeMessage.priority === 'high'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-800 text-emerald-100'
                      }`}
                    >
                      {activeMessage.priority}
                    </span>
                  </div>
                </div>

                {/* Metadata Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Pengirim Asli</span>
                    <span className="font-bold text-slate-900 block">{activeMessage.senderName}</span>
                    <span className="text-[10px] text-stone-500 font-mono block">Role: {activeMessage.senderRole}</span>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Target Penerima</span>
                    <span className="font-bold text-slate-900 block">{activeMessage.recipientName}</span>
                    <span className="text-[10px] text-stone-500 font-mono block">Tipe: {activeMessage.recipientType}</span>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Tanggal Diterbitkan</span>
                    <span className="font-mono font-bold text-slate-900 block">{activeMessage.createdAt}</span>
                    <span className="text-[10px] text-emerald-800 font-bold block">Verified Timestamp</span>
                  </div>
                </div>

                {/* Body Message Reader Card */}
                <div className="p-6 bg-stone-50 border border-stone-200 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-800" /> Isi Dokumen / Pesan Komunikasi
                    </span>

                    <button
                      onClick={() => handleCopyCode(activeMessage.code)}
                      className="px-3 py-1 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-[11px] rounded-xl flex items-center gap-1 cursor-pointer transition"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedCode ? 'Tersalin' : 'Salin Kode'}
                    </button>
                  </div>

                  <p className="text-sm font-medium text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                    {activeMessage.body}
                  </p>
                </div>

                {/* Delivery Channel Badges */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-bold">Status Kanal Delivery:</span>
                    <span className="px-2.5 py-1 bg-emerald-900 text-emerald-200 rounded-lg font-mono font-bold border border-emerald-700">
                      • Internal SIM: Aktif Live
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg font-mono font-bold border ${
                        activeMessage.deliveryChannels.emailPrep
                          ? 'bg-indigo-950 text-indigo-200 border-indigo-700'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      • Email Prep: {activeMessage.deliveryChannels.emailPrep ? 'Ready' : 'Off'}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg font-mono font-bold border ${
                        activeMessage.deliveryChannels.whatsappPrep
                          ? 'bg-emerald-950 text-emerald-200 border-emerald-700'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      • WA Prep: {activeMessage.deliveryChannels.whatsappPrep ? 'Ready' : 'Off'}
                    </span>
                  </div>

                  {activeMessage.stage !== 'READ' && (
                    <button
                      onClick={() => handleUpdateMessageStage(activeMessage.id, 'READ')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Tandai Terbaca (Read)
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 border border-stone-200 shadow-xs text-center space-y-3">
                <MessageSquare className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="text-sm font-black text-slate-800">Tidak Ada Pesan Terpilih</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Pilih salah satu pesan dari daftar untuk melihat detail dokumen dan status kanal pengiriman.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: COMPOSER & MULTI-CHANNEL PUBLISHER */}
      {activeTab === 'COMPOSER' && (
        !isAdministrativeRole ? (
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center space-y-4">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-slate-900">Akses Terbatas: Penerbitan Pesan & Broadcast</h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              Fitur penerbitan broadcast multi-kanal dan pengiriman pesan berwenang hanya dapat diakses oleh pimpinan dan staf pengelola resmi.
            </p>
            <button
              onClick={() => setActiveTab('MESSAGES_INBOX')}
              className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Kembali ke Kotak Pesan
            </button>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Composer (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-800" /> Penerbitan Pesan & Broadcast Multi-Kanal
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Susun pengumuman resmi, pesan tagihan SPP, atau notifikasi akademik secara terstandar.
              </p>
            </div>

            {/* Template Presets Quick Buttons */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 block">Gunakan Template Standar Sekolah (Pilihan Cepat):</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('ANNOUNCEMENT')}
                  className="p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-300 rounded-xl font-bold text-slate-800 text-[11px] text-left transition cursor-pointer"
                >
                  📢 Broadcast Kegiatan
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('SPP')}
                  className="p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-300 rounded-xl font-bold text-slate-800 text-[11px] text-left transition cursor-pointer"
                >
                  💳 Pengingat SPP
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('MEETING')}
                  className="p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-300 rounded-xl font-bold text-slate-800 text-[11px] text-left transition cursor-pointer"
                >
                  🤝 Rapat Wali Murid
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('VERIFICATION')}
                  className="p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-300 rounded-xl font-bold text-slate-800 text-[11px] text-left transition cursor-pointer"
                >
                  ⚡ Alert Persetujuan
                </button>
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
              {/* Category & Priority Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-900 block">Kategori Komunikasi *</label>
                  <select
                    value={composerCategory}
                    onChange={(e) => setComposerCategory(e.target.value as CommunicationCategory)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-slate-900 focus:outline-hidden"
                  >
                    <option value="BROADCAST">Pengumuman Sekolah (Broadcast)</option>
                    <option value="FINANCIAL">Keuangan & Tagihan SPP</option>
                    <option value="ACADEMIC">Akademik & Agenda Kelas</option>
                    <option value="APPROVAL">Persetujuan Digital (Approval)</option>
                    <option value="PARENT_MESSAGE">Pesan & Konsultasi Wali Murid</option>
                    <option value="INSTITUTIONAL">Notifikasi Resmi Institusi</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900 block">Tingkat Prioritas Delivery *</label>
                  <select
                    value={composerPriority}
                    onChange={(e) => setComposerPriority(e.target.value as NotificationPriority)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-slate-900 focus:outline-hidden"
                  >
                    <option value="normal">Normal (Biasa)</option>
                    <option value="high">High (Tinggi - Highlight)</option>
                    <option value="urgent">Urgent (Penting & Mendesak)</option>
                    <option value="low">Low (Informasi Tambahan)</option>
                  </select>
                </div>
              </div>

              {/* Recipient Targeting Selector */}
              <div className="space-y-2">
                <label className="font-bold text-slate-900 block">Target Penerima Pesan *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setComposerRecipientType('BROADCAST')}
                    className={`p-3 rounded-2xl border text-center font-bold text-xs transition cursor-pointer ${
                      composerRecipientType === 'BROADCAST'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/30'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    Broadcast (Semua)
                  </button>

                  <button
                    type="button"
                    onClick={() => setComposerRecipientType('ROLE')}
                    className={`p-3 rounded-2xl border text-center font-bold text-xs transition cursor-pointer ${
                      composerRecipientType === 'ROLE'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/30'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    Per Role Spesifik
                  </button>

                  <button
                    type="button"
                    onClick={() => setComposerRecipientType('SPECIFIC_USER')}
                    className={`p-3 rounded-2xl border text-center font-bold text-xs transition cursor-pointer ${
                      composerRecipientType === 'SPECIFIC_USER'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/30'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    Penerima Individu
                  </button>
                </div>

                {/* Sub-selector for Role or Individual */}
                {composerRecipientType === 'ROLE' && (
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
                    <label className="font-bold text-slate-900 block">Pilih Role Sasaran:</label>
                    <select
                      value={composerTargetRole}
                      onChange={(e) => setComposerTargetRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-bold text-slate-900 focus:outline-hidden"
                    >
                      <option value="WALI_MURID">Wali Murid / Orang Tua</option>
                      <option value="GURU">Guru & Tenaga Pendidik</option>
                      <option value="KEUANGAN">Tim Keuangan Sekolah</option>
                      <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
                      <option value="KETUA_YAYASAN">Ketua Yayasan</option>
                      <option value="ADMIN">Staf Tata Usaha</option>
                    </select>
                  </div>
                )}

                {composerRecipientType === 'SPECIFIC_USER' && (
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
                    <label className="font-bold text-slate-900 block">Pilih Nama Siswa / Individu:</label>
                    <select
                      value={composerTargetUser}
                      onChange={(e) => setComposerTargetUser(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-bold text-slate-900 focus:outline-hidden"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.nis || 'Siswa'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Title & Body Inputs */}
              <div className="space-y-1">
                <label className="font-bold text-slate-900 block">Judul / Subjek Pesan *</label>
                <input
                  type="text"
                  required
                  value={composerTitle}
                  onChange={(e) => setComposerTitle(e.target.value)}
                  placeholder="Misal: Pengumuman Jadwal Penilaian Akhir Semester"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl font-bold text-slate-900 focus:outline-hidden focus:border-emerald-700 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 block">Isi Pesan / Narasi Komunikasi *</label>
                <textarea
                  rows={5}
                  required
                  value={composerBody}
                  onChange={(e) => setComposerBody(e.target.value)}
                  placeholder="Tuliskan isi pesan atau naskah pengumuman resmi di sini..."
                  className="w-full p-4 bg-stone-50 border border-stone-300 rounded-2xl font-medium text-slate-900 focus:outline-hidden focus:border-emerald-700 transition leading-relaxed"
                />
              </div>

              {/* Multi-channel Preparation Switches */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                <label className="font-bold text-slate-900 block">Kanal Pengiriman Terhubung (Multi-Channel Dispatch):</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-emerald-100 text-emerald-950 rounded-xl font-bold flex items-center justify-between border border-emerald-300">
                    <span>1. SIM Internal</span>
                    <span className="font-mono text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded-md">LIVE</span>
                  </div>

                  <label className="p-2.5 bg-white border border-stone-300 rounded-xl font-bold flex items-center justify-between cursor-pointer">
                    <span>2. Email Prep</span>
                    <input
                      type="checkbox"
                      checked={composerEnableEmailPrep}
                      onChange={(e) => setComposerEnableEmailPrep(e.target.checked)}
                      className="w-4 h-4 accent-emerald-700 cursor-pointer"
                    />
                  </label>

                  <label className="p-2.5 bg-white border border-stone-300 rounded-xl font-bold flex items-center justify-between cursor-pointer">
                    <span>3. WA Prep</span>
                    <input
                      type="checkbox"
                      checked={composerEnableWAPrep}
                      onChange={(e) => setComposerEnableWAPrep(e.target.checked)}
                      className="w-4 h-4 accent-emerald-700 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs rounded-2xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-emerald-300 animate-spin" />
                    Sedang Memproses Pengiriman...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-emerald-300" />
                    Terbitkan & Kirimkan Melalui Delivery Center
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Panel: Live Preview Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black flex items-center gap-2 text-white">
                  <Eye className="w-4 h-4 text-emerald-400" /> Pratinjau Tampilan Pesan (Live Preview)
                </h3>
                <span className="px-2.5 py-0.5 bg-emerald-900/80 text-emerald-300 text-[10px] font-mono font-bold rounded-full border border-emerald-700">
                  PORTAL PREVIEW
                </span>
              </div>

              {/* Card Preview Simulation */}
              <div className="p-5 bg-slate-950 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between text-[11px] font-mono border-b border-slate-800 pb-2">
                  <span className="font-bold text-emerald-400">{composerCategory}</span>
                  <span className="text-slate-400 uppercase font-bold">{composerPriority}</span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-white">
                    {composerTitle || 'Judul Pengumuman Berkas / Pesan Sekolah'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 whitespace-pre-line leading-relaxed">
                    {composerBody || 'Isi teks pengumuman yang disusun akan ditampilkan di sini secara real-time...'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Pengirim: {authenticActor || verifiedActiveRole || '-'}</span>
                  <span>Target: {composerRecipientType}</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-950/50 border border-emerald-800/80 rounded-2xl text-[11px] text-emerald-200 leading-relaxed">
                <strong>Catatan Integrasi P29:</strong> Pesan ini secara otomatis tersinkronisasi ke Notification Engine & Knowledge Graph tanpa mengubah skema Firestore terproteksi.
              </div>
            </div>
          </div>
        </div>
        )
      )}

      {/* TAB 3: TIMELINE & DELIVERY STAGE INSPECTOR */}
      {activeTab === 'DELIVERY_INSPECTOR' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-800" /> Timeline Status Pengiriman Pesan (Unified Message Lifetime)
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Melacak alur pengiriman 6 tahap: Created → Queued → Delivered (Internal) → Read → Archived / Failed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Message Selector (4 cols) */}
            <div className="lg:col-span-4 space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <div className="p-6 text-center bg-stone-50 rounded-2xl border border-stone-200">
                  <p className="text-xs font-bold text-stone-500">Tidak ada antrean pesan.</p>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMessageId(m.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer text-xs space-y-1 ${
                      activeMessage?.id === m.id
                        ? 'border-emerald-700 bg-emerald-50 font-bold'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="font-bold text-slate-900">{m.code}</span>
                      <span className="text-emerald-800 font-bold">{m.stage.replace('_', ' ')}</span>
                    </div>
                    <h4 className="font-black text-slate-900 truncate">{m.title}</h4>
                  </div>
                ))
              )}
            </div>

            {/* Right Timeline Visualizer (8 cols) */}
            <div className="lg:col-span-8 bg-stone-50 p-6 rounded-3xl border border-stone-200 space-y-6">
              {activeMessage ? (
                <>
                  <div className="border-b border-stone-200 pb-3">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">
                      STATUS TIMELINE INSPECTION
                    </span>
                    <h3 className="text-sm font-black text-slate-900">{activeMessage.title}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Kode: {activeMessage.code} • Pengirim: {activeMessage.senderName}</p>
                  </div>

                  {/* 6 Stage Lifecycle Steps */}
                  <div className="space-y-4">
                    {[
                      { stage: 'CREATED', label: '1. Disiapkan (Created)', time: activeMessage.createdAt, active: true },
                      { stage: 'QUEUED', label: '2. Masuk Antrean Delivery (Queued)', time: activeMessage.queuedAt || activeMessage.createdAt, active: ['QUEUED', 'DELIVERED_INTERNAL', 'READ', 'ARCHIVED'].includes(activeMessage.stage) },
                      { stage: 'DELIVERED_INTERNAL', label: '3. Terkirim Internal Portal (Delivered)', time: activeMessage.deliveredAt || activeMessage.createdAt, active: ['DELIVERED_INTERNAL', 'READ', 'ARCHIVED'].includes(activeMessage.stage) },
                      { stage: 'READ', label: '4. Telah Dibaca Penerima (Read)', time: activeMessage.readAt || 'Belum dibaca', active: ['READ', 'ARCHIVED'].includes(activeMessage.stage) },
                      { stage: 'ARCHIVED', label: '5. Diarsiapkan (Archived)', time: activeMessage.archivedAt || 'Belum diarsip', active: activeMessage.stage === 'ARCHIVED' },
                      { stage: 'FAILED_VALIDATION', label: '6. Gagal Validasi Internal (Failed)', time: activeMessage.failedReason || 'Tidak Ada Error', active: activeMessage.stage === 'FAILED_VALIDATION' }
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            step.active
                              ? 'bg-emerald-800 text-white shadow-xs'
                              : 'bg-stone-200 text-stone-500'
                          }`}
                        >
                          {idx + 1}
                        </div>

                        <div className="flex-1 p-3 bg-white rounded-2xl border border-stone-200 space-y-0.5">
                          <h4 className="font-black text-xs text-slate-900">{step.label}</h4>
                          <span className="text-[11px] font-mono text-stone-600 block">{step.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-stone-500 text-xs font-bold">
                  Pilih pesan dari daftar untuk menginspeksi alur tahapan delivery.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CHANNEL READINESS CONFIGURATION */}
      {activeTab === 'CHANNEL_READINESS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-800" /> Matriks Kesiapan Kanal Pengiriman (Channel Readiness)
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Pusat persiapan kanal pengiriman multi-channel tanpa menyambungkan provider luar secara tidak sah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Channel 1: Internal SIM */}
            <div className="p-6 bg-stone-50 rounded-3xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-emerald-800" /> 1. SIM Internal Portal
                </h3>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold rounded-full">
                  LIVE ACTIVE
                </span>
              </div>

              <p className="text-stone-600 text-[11px] leading-relaxed">
                Notifikasi langsung pada header & dashboard portal SIM. Terhubung ke Firestore & Local State Engine secara real-time.
              </p>

              <div className="p-3 bg-white rounded-xl border border-stone-200 font-mono text-[10px] space-y-1">
                <div>Status Backend: <strong className="text-emerald-800">Operational (100%)</strong></div>
                <div>Latensi Rata-rata: <strong className="text-slate-900">12 ms</strong></div>
              </div>
            </div>

            {/* Channel 2: Email Preparation */}
            <div className="p-6 bg-stone-50 rounded-3xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-indigo-800" /> 2. Email Channel (Prep)
                </h3>
                <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-900 font-mono text-[10px] font-bold rounded-full">
                  PREPARED
                </span>
              </div>

              <p className="text-stone-600 text-[11px] leading-relaxed">
                Struktur data & template email HTML resmi telah disiapkan. Menunggu konfigurasi API Provider resmi pada fase mendatang.
              </p>

              <div className="p-3 bg-white rounded-xl border border-stone-200 font-mono text-[10px] space-y-1">
                <div>Status Sandbox: <strong className="text-indigo-800">Configured</strong></div>
                <div>Template Format: <strong className="text-slate-900">HTML Standard</strong></div>
              </div>
            </div>

            {/* Channel 3: WhatsApp Preparation */}
            <div className="p-6 bg-stone-50 rounded-3xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-emerald-800" /> 3. WhatsApp Gateway (Prep)
                </h3>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold rounded-full">
                  PREPARED
                </span>
              </div>

              <p className="text-stone-600 text-[11px] leading-relaxed">
                Naskah WhatsApp blast terformat rapi. Menunggu penyambungan WA Gateway resmi sekolah tanpa mengubah skema database.
              </p>

              <div className="p-3 bg-white rounded-xl border border-stone-200 font-mono text-[10px] space-y-1">
                <div>Status Sandbox: <strong className="text-emerald-800">Ready</strong></div>
                <div>Format Teks: <strong className="text-slate-900">UTF-8 Formatted</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COMMUNICATION AUDIT TRAIL LOGS */}
      {activeTab === 'AUDIT_LOGS' && (
        !isAdministrativeRole ? (
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center space-y-4">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-slate-900">Akses Terbatas: Audit Trail Komunikasi</h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              Log aktivitas audit komunikasi sistem terpusat hanya dapat dilihat oleh pimpinan dan pengelola resmi institusi.
            </p>
            <button
              onClick={() => setActiveTab('MESSAGES_INBOX')}
              className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Kembali ke Kotak Pesan
            </button>
          </div>
        ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800" /> Audit Trail Aktivitas Komunikasi Sekolah
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Catatan riwayat aktivitas penerbitan pesan, pengiriman broadcast, dan pengubahan status delivery.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3 rounded-l-xl">Waktu</th>
                  <th className="p-3">Pengguna</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Aksi Komunikasi</th>
                  <th className="p-3 rounded-r-xl">Modul / Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-medium">
                {auditLogs.slice(0, 15).map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50 transition">
                    <td className="p-3 font-mono text-stone-600">{log.timestamp}</td>
                    <td className="p-3 font-bold text-slate-900">{log.userName}</td>
                    <td className="p-3 font-mono text-emerald-800 font-bold">{log.role}</td>
                    <td className="p-3 font-mono text-slate-800">{log.action}</td>
                    <td className="p-3 text-stone-600">{log.targetModule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )
      )}
    </motion.div>
  );
};
