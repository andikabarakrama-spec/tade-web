import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../common/AuthModal';
import { FirstSetupWizard } from '../common/FirstSetupWizard';
import { DataService } from '../../services/db';
import { CommandCenterModal } from './CommandCenterModal';
import { FounderCommandPaletteModal } from '../sovereign/FounderCommandPaletteModal';
import { LicenseWatermark } from '../license/LicenseWatermark';
import { SafeModeNotice } from '../license/SafeModeNotice';
import { NotificationBellButton } from '../common/NotificationBellButton';
import { NotificationCenterModal } from '../common/NotificationCenterModal';
import { PPDBLifecycleConfig } from '../../types';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  CalendarCheck,
  Award,
  BookOpen,
  DollarSign,
  FileCheck,
  FileText,
  Sparkles,
  PieChart,
  Calendar,
  Bell,
  MessageSquare,
  Book,
  Box,
  Library,
  Activity,
  RefreshCw,
  Paperclip,
  Network,
  Printer,
  Stamp,
  QrCode,
  ScanLine,
  Trophy,
  Globe,
  Trees,
  Upload,
  Settings,
  Shield,
  Database,
  MapPin,
  Utensils,
  Truck,
  HeartHandshake,
  User,
  Briefcase,
  Wrench,
  Search,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Clock,
  LogIn,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Stethoscope,
  RotateCcw,
  Hammer,
  FlaskConical,
  GitCompare,
  ListTree,
  Lightbulb,
  PauseCircle,
  Sliders,
  GitCommit,
  Building2,
  Command,
  Zap,
  KeyRound,
  Gauge,
  Cpu,
  Compass,
  Inbox,
  Bot,
  Rocket,
  Sun,
  Moon,
  Ship,
  Palette,
  Wifi,
  Mic,
  Boxes,
  Tv,
  Laptop,
  Ban,
  Flame,
  TrendingUp,
  Lock,
  Crown,
  ShoppingBag,
  FileSpreadsheet,
  HelpCircle,
  Radio,
  BarChart3,
  HardDrive,
  AlertTriangle,
  FileCode,
  Brain,
  History,
  BarChart2,
  Heart,
  Layers,
  FolderArchive,
  CalendarDays,
  Leaf,
  FileCheck2,
  Building,
  Bug,
  Server,
  Play,
  ArrowRightLeft,
  Archive,
  Tag,
  AlertOctagon,
  Shirt,
  Video,
  Crosshair,
  Milestone,
  DoorClosed,
  HeartPulse,
  CheckSquare,
  SpellCheck,
  Calculator,
  PenTool,
  Send,
  Split,
  Scale,
  GitFork,
  Trash2,
  Link2,
  Share2,
  FileLock2,
  Timer,
  Monitor,
  WifiOff,
  Camera,
  GitMerge,
  Hourglass,
  CheckCircle2,
  Terminal,
  ListOrdered,
  BookLock,
  Accessibility,
  Smartphone,
  Download,
  SunMedium,
  Smile,
  Film,
  Clapperboard,
  Target,
  LifeBuoy,
  Package
} from 'lucide-react';
import { AsyDockAssistantWidget } from '../mascot3d/AsyDockAssistantWidget';

interface Props {
  activeModule: string;
  onSelectModule: (mod: string) => void;
  children: React.ReactNode;
}

export interface ModuleTabDef {
  id: string;
  code: string;
  name: string;
  icon: any;
  category: string;
  allowedRoles: string[];
}

export const MODULE_TABS: ModuleTabDef[] = [
  { id: 'r1', code: 'R1', name: 'Dashboard Utama', icon: LayoutDashboard, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r2', code: 'R2', name: 'Manajemen User & RBAC', icon: Users, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'r3', code: 'R3', name: 'Data Siswa Master', icon: GraduationCap, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN'] },
  { id: 'r4', code: 'R4', name: 'Data Guru & Staf', icon: UserCheck, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r5', code: 'R5', name: 'Kelompok & Kelas', icon: Box, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },

  { id: 'r6', code: 'R6', name: 'Presensi Siswa', icon: CalendarCheck, category: 'Akademik', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r7', code: 'R7', name: 'Presensi Guru & PTK', icon: CalendarCheck, category: 'Akademik', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r8', code: 'R8', name: 'E-Rapor PAUD & Capaian', icon: Award, category: 'Akademik', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r9', code: 'R9', name: 'Catatan Anekdot', icon: BookOpen, category: 'Akademik', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },

  { id: 'r10', code: 'R10', name: 'Tagihan SPP & Keuangan', icon: DollarSign, category: 'Keuangan & PPDB', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r11', code: 'R11', name: 'Pembayaran & Kwitansi', icon: FileCheck, category: 'Keuangan & PPDB', allowedRoles: ['SUPER_ADMIN', 'KEUANGAN'] },
  { id: 'r12', code: 'R12', name: 'Laporan Keuangan', icon: PieChart, category: 'Keuangan & PPDB', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r13', code: 'R13', name: 'Verifikasi PPDB', icon: UserCheck, category: 'Keuangan & PPDB', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },

  { id: 'r14', code: 'R14', name: 'Smart Archive Digital', icon: Database, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN'] },
  { id: 'r16', code: 'R16', name: 'Smart Document Factory', icon: FileText, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r33', code: 'R33', name: 'AI Search & Knowledge', icon: Sparkles, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r15', code: 'R15', name: 'Pengumuman Internal', icon: Bell, category: 'Komunikasi', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r17', code: 'R17', name: 'Program Tahfidz & Doa', icon: Book, category: 'Komunikasi', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },

  { id: 'r18', code: 'R18', name: 'Inventaris & Sarpras', icon: Box, category: 'Sarpras & Layanan', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r19', code: 'R19', name: 'Perpustakaan & APE', icon: Library, category: 'Sarpras & Layanan', allowedRoles: ['SUPER_ADMIN', 'GURU'] },
  { id: 'r20', code: 'R20', name: 'Layanan KMS / Kesehatan', icon: Activity, category: 'Sarpras & Layanan', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r21', code: 'R21', name: 'Ekstrakurikuler', icon: Trophy, category: 'Sarpras & Layanan', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },

  { id: 'r22', code: 'R22', name: 'CMS Website Public', icon: Globe, category: 'Pengaturan CMS', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r23', code: 'R23', name: 'Pengaturan Identitas', icon: Settings, category: 'Pengaturan CMS', allowedRoles: ['SUPER_ADMIN'] },

  { id: 'r24', code: 'R24', name: 'Audit Log & Keamanan', icon: Shield, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'r25', code: 'R25', name: 'Backup & Restore', icon: Database, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'r26', code: 'R26', name: 'Peta Zonasi Siswa', icon: MapPin, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r27', code: 'R27', name: 'Menu Catering Sehat', icon: Utensils, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'GURU', 'WALI_MURID'] },
  { id: 'r28', code: 'R28', name: 'Antar Jemput', icon: Truck, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'WALI_MURID'] },

  { id: 'r29', code: 'R29', name: 'Portal Wali Murid', icon: HeartHandshake, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN', 'WALI_MURID'] },
  { id: 'r30', code: 'R30', name: 'Portal Guru', icon: User, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN', 'GURU'] },
  { id: 'r31', code: 'R31', name: 'Portal Kepala Sekolah', icon: Briefcase, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r32', code: 'R32', name: 'System Settings', icon: Wrench, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'r34', code: 'R34', name: 'Self Health Check', icon: Activity, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
  { id: 'r35', code: 'R35', name: 'Backup & Recovery Center', icon: Database, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
  { id: 'r36', code: 'R36', name: 'AI Operating System v26', icon: Sparkles, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r37', code: 'R37', name: 'Patch & Operational Governance', icon: ShieldCheck, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r38', code: 'R38', name: 'Observability & System Health', icon: Eye, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r39', code: 'R39', name: 'Self-Diagnostic & Auto Validation', icon: Stethoscope, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r40', code: 'R40', name: 'Resilience & Recovery Validation', icon: RotateCcw, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r41', code: 'R41', name: 'Configuration & System Governance', icon: Sliders, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r42', code: 'R42', name: 'Administrative Document Center', icon: FileText, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r43', code: 'R43', name: 'Document Lifecycle & Approval Engine', icon: GitCommit, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r44', code: 'R44', name: 'Pustaka Templat Dokumen (Template Library)', icon: Library, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r45', code: 'R45', name: 'Document Generation Engine (Phase 1)', icon: Zap, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r46', code: 'R46', name: 'Digital Identity & Relationship Engine', icon: UserCheck, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID', 'CALON_WALI_MURID'] },
  { id: 'r47', code: 'R47', name: 'Master Data Synchronization Engine', icon: RefreshCw, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r48', code: 'R48', name: 'Enterprise Attachment Registry & File Linking', icon: Paperclip, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID', 'CALON_WALI_MURID'] },
  { id: 'r49', code: 'R49', name: 'Enterprise Knowledge Graph & Knowledge Engine', icon: Network, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID', 'CALON_WALI_MURID'] },
  { id: 'r50', code: 'R50', name: 'Enterprise PDF & Print Composer Engine', icon: Printer, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID', 'CALON_WALI_MURID'] },
  { id: 'r51', code: 'R51', name: 'Enterprise Approval & Digital Signature Engine', icon: Stamp, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID', 'CALON_WALI_MURID'] },
  { id: 'r52', code: 'R52', name: 'Enterprise QR Verification & Authenticity Gateway', icon: QrCode, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID', 'CALON_WALI_MURID'] },
  { id: 'r53', code: 'R53', name: 'Enterprise Smart Document Intake & OCR Prep Center', icon: ScanLine, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID', 'CALON_WALI_MURID'] },
  { id: 'r54', code: 'R54', name: 'Enterprise Communication Hub & Delivery Center', icon: MessageSquare, category: 'Komunikasi', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID', 'CALON_WALI_MURID'] },
  { id: 'r55', code: 'R55', name: 'Enterprise Go-Live Readiness & System Diagnostic Center', icon: ShieldCheck, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID', 'CALON_WALI_MURID'] },
  { id: 'r56', code: 'R56', name: 'Enterprise License, Trial, Rental & Subscription Engine', icon: KeyRound, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID', 'CALON_WALI_MURID'] },
  { id: 'r57', code: 'R57', name: 'Enterprise Operations Center (EOC) & Real-Time Monitoring', icon: Gauge, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID', 'CALON_WALI_MURID'] },
  { id: 'r58', code: 'R58', name: 'Device & Hardware Guardian Audit', icon: Cpu, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID', 'CALON_WALI_MURID'] },
  { id: 'r63', code: 'R63', name: 'Executive Living Workspace (Ketua Yayasan)', icon: LayoutDashboard, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r65', code: 'R65', name: 'Event & School Activity Center', icon: Calendar, category: 'Akademik', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN', 'GURU', 'KEUANGAN'] },
  { id: 'r68', code: 'R68', name: 'Admin Living Operations Workspace', icon: Inbox, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r70', code: 'R70', name: 'Executive Mission Control', icon: Compass, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r71', code: 'R71', name: 'AI Asy Workflow Orchestrator', icon: Bot, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN', 'GURU'] },
  { id: 'r80', code: 'R80', name: 'Pilot Mode & Go-Live Control Center', icon: Rocket, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r81', code: 'R81', name: 'Daily Operation Companion (AI Asy)', icon: Sun, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r82', code: 'R82', name: 'Guardian Go-Live Daily Verification', icon: ShieldCheck, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r83', code: 'R83', name: 'Operator Training Academy & Simulator', icon: GraduationCap, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r84', code: 'R84', name: 'Universal QR Live Deployment & Analytics', icon: QrCode, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r85', code: 'R85', name: 'AI Asy Lobby Receptionist & Queue', icon: Bot, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r94', code: 'R94', name: 'Media & Content Studio', icon: Palette, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r86', code: 'R86', name: 'Guardian Batch Print Center & Labels', icon: Printer, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r87', code: 'R87', name: 'Offline-First Resilience & Sync Engine', icon: Wifi, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r88', code: 'R88', name: 'AI Voice Identity & Persona Studio', icon: Mic, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r89', code: 'R89', name: 'Executive Launch & Health Dashboard', icon: LayoutDashboard, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r90', code: 'R90', name: 'Discovery Registry & Permanent Memory', icon: Network, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r91', code: 'R91', name: 'Official Dek Asy Living Mascot Runtime', icon: Bot, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r92', code: 'R92', name: 'Role Adaptive Loading & Performance Guardian', icon: Gauge, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r93', code: 'R93', name: 'Living Parent World', icon: HeartHandshake, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN', 'WALI_MURID', 'GURU'] },
  { id: 'r95', code: 'R95', name: 'Living Teacher World & Voice Station', icon: Sparkles, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN', 'GURU', 'KEPALA_SEKOLAH'] },
  { id: 'r96', code: 'R96', name: 'Senior Executive World (Ketua Yayasan)', icon: ShieldCheck, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r97', code: 'R97', name: 'Operations AI Action Dock', icon: Zap, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r98', code: 'R98', name: 'Living Banner Nusantara 3D Studio', icon: Palette, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r99', code: 'R99', name: 'Intelligent Chunk Engine (Bundle Split)', icon: Boxes, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r100', code: 'R100', name: 'Performance Guardian 2.0 (Hardware Tuning)', icon: Gauge, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r101', code: 'R101', name: 'Executive Lite Mode (PC Jadul)', icon: ShieldCheck, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r102', code: 'R102', name: 'Operations Ultra Mode (ASUS ROG)', icon: Laptop, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r103', code: 'R103', name: 'Presidential Ultra Mode (Super Admin)', icon: ShieldAlert, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'r104', code: 'R104', name: 'Living Messenger Enterprise (Chat & Broadcast)', icon: MessageSquare, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r106', code: 'R106', name: 'Universal QR Evolution (Auto-Expire)', icon: QrCode, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r107', code: 'R107', name: 'School TV Living Broadcast Channel', icon: Tv, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r108', code: 'R108', name: 'AI Voice Everywhere Studio', icon: Mic, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r110', code: 'R110', name: 'Guardian Bundle Size Auditor', icon: Activity, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r111', code: 'R111', name: 'Supreme Command Center (Super Admin)', icon: Zap, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'r112', code: 'R112', name: 'Command Mission Engine & AI Asy', icon: Bot, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r115', code: 'R115', name: 'Live Mission Lifecycle Timeline', icon: Activity, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r119', code: 'R119', name: 'TADE Multi-School Control Tower', icon: Building2, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'r120', code: 'R120', name: 'Multi-Tenant Ecosystem & Licenses', icon: Building2, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'r126', code: 'R126', name: 'Guardian Fleet Monitor & Support', icon: ShieldCheck, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'r131', code: 'R131', name: 'Sovereign Root & Security Vault', icon: Lock, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'r132', code: 'R132', name: 'AI Asy Dual Intelligence Console', icon: Bot, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r133', code: 'R133', name: 'License Suspend & Safe Recovery', icon: Ban, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'r134', code: 'R134', name: 'Universal Education Profile DNA', icon: GraduationCap, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r136', code: 'R136', name: 'Break-Glass Recovery Chamber', icon: Flame, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'r137', code: 'R137', name: 'Guardian Future Prediction Radar', icon: TrendingUp, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r138', code: 'R138', name: 'Constitution Guard Sentinel', icon: ShieldCheck, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r139', code: 'R139', name: 'Founder Exclusive Governance (Air-Gapped)', icon: Crown, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'r140', code: 'R140', name: 'Root Physical Recovery Center', icon: Lock, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'r141', code: 'R141', name: 'Zero Confusion Setup Wizard', icon: HelpCircle, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r142', code: 'R142', name: 'Smart Multi-Role Landing Engine', icon: Compass, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r143', code: 'R143', name: 'Performance Gate & Feather Benchmark', icon: Gauge, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r144', code: 'R144', name: 'Feature Gate & Pioneer Program', icon: Radio, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r145', code: 'R145', name: 'Asy Creative Intelligence Studio', icon: Palette, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r146', code: 'R146', name: 'TADE Template & Asset Marketplace', icon: ShoppingBag, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r147', code: 'R147', name: 'Customer Success AI & Onboarding', icon: Bot, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r148', code: 'R148', name: 'Auto Migration & Spreadsheet Import', icon: FileSpreadsheet, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r151', code: 'R151', name: 'Founder Insight Fleet Intelligence', icon: Crown, category: 'Portal Khusus', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'r152', code: 'R152', name: 'Global Notification Hub & Approvals', icon: Bell, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r153', code: 'R153', name: 'School Health Center & Storage Quota', icon: Activity, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r154', code: 'R154', name: 'Smart Automation Center', icon: Zap, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r155', code: 'R155', name: 'Guardian Compliance & Data Privacy', icon: ShieldCheck, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r156', code: 'R156', name: 'AI Asy Persistent Memory Layer', icon: Brain, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r157', code: 'R157', name: 'Asset Optimization & Performance', icon: Gauge, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r158', code: 'R158', name: 'Enterprise Usage & Analytics', icon: BarChart3, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r159', code: 'R159', name: 'Guardian Mission Control', icon: ShieldAlert, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r160', code: 'R160', name: 'Zero-Touch Maintenance Center', icon: Wrench, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r161', code: 'R161', name: 'Unified Audit Timeline', icon: History, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r162', code: 'R162', name: 'School Readiness Score', icon: Award, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN'] },
  { id: 'r163', code: 'R163', name: 'Smart Document Lifecycle', icon: FileText, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN'] },
  { id: 'r164', code: 'R164', name: 'AI Asy Operations Coach', icon: Bot, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r165', code: 'R165', name: 'Enterprise Backup Observatory', icon: HardDrive, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r166', code: 'R166', name: 'Cross-School Benchmark', icon: BarChart2, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r167', code: 'R167', name: 'Campus Command Center', icon: LayoutDashboard, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN'] },
  { id: 'r168', code: 'R168', name: 'Smart Parent Timeline', icon: Heart, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r169', code: 'R169', name: 'Teacher Productivity Hub', icon: Briefcase, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r170', code: 'R170', name: 'Digital Campus Map', icon: Compass, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r171', code: 'R171', name: 'AI Asy Knowledge Assistant', icon: BookOpen, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r172', code: 'R172', name: 'Smart Visitor Experience', icon: UserCheck, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r173', code: 'R173', name: 'Executive Finance Snapshot', icon: DollarSign, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r174', code: 'R174', name: 'Digital Campus Experience', icon: Sparkles, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r175', code: 'R175', name: 'School Operating Dashboard', icon: Layers, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r176', code: 'R176', name: 'Smart Communication Center', icon: MessageSquare, category: 'Komunikasi', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r177', code: 'R177', name: 'Digital Classroom Pulse', icon: Activity, category: 'Akademik', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r178', code: 'R178', name: 'Intelligent Resource Center', icon: FolderArchive, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r179', code: 'R179', name: 'AI Asy Daily Briefing', icon: Bot, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r180', code: 'R180', name: 'School Event Command', icon: CalendarDays, category: 'Akademik', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r181', code: 'R181', name: 'Executive Operations Snapshot', icon: BarChart3, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r182', code: 'R182', name: 'Adaptive Experience Engine', icon: Sparkles, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r183', code: 'R183', name: 'Student Growth Intelligence', icon: TrendingUp, category: 'Akademik', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r184', code: 'R184', name: 'Parent Engagement Center', icon: HeartHandshake, category: 'Komunikasi', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r185', code: 'R185', name: 'Teacher Planning Studio', icon: BookOpen, category: 'Akademik', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r186', code: 'R186', name: 'AI Asy Curriculum Assistant', icon: Bot, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r187', code: 'R187', name: 'Digital Archive Intelligence', icon: FolderArchive, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN'] },
  { id: 'r188', code: 'R188', name: 'School Reputation Dashboard', icon: Award, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r189', code: 'R189', name: 'Executive Decision Center', icon: FileCheck2, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r190', code: 'R190', name: 'Adaptive Learning Experience', icon: Leaf, category: 'Akademik', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r191', code: 'R191', name: 'School Operations Automation Hub', icon: Zap, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN'] },
  { id: 'r192', code: 'R192', name: 'Smart Attendance Intelligence', icon: TrendingUp, category: 'Akademik', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r193', code: 'R193', name: 'AI Asy Parent Companion', icon: Bot, category: 'Komunikasi', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r194', code: 'R194', name: 'School Resource Planner', icon: Building, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN'] },
  { id: 'r195', code: 'R195', name: 'Digital Compliance Archive', icon: ShieldCheck, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r196', code: 'R196', name: 'Executive Risk Observatory', icon: ShieldAlert, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r197', code: 'R197', name: 'Community Engagement Hub', icon: HeartHandshake, category: 'Komunikasi', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r198', code: 'R198', name: 'Adaptive Resilience Engine', icon: Cpu, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'WALI_MURID'] },
  { id: 'r207', code: 'R207', name: 'Guardian Health Center', icon: Activity, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r208', code: 'R208', name: 'Memory Leak Hunter', icon: Bug, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r209', code: 'R209', name: 'Storage Sentinel', icon: HardDrive, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r210', code: 'R210', name: 'Database Health Monitor', icon: Database, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r211', code: 'R211', name: 'Backup Health Monitor', icon: Server, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r212', code: 'R212', name: 'Device Health Simulator', icon: Gauge, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r213', code: 'R213', name: 'Long Life Simulation', icon: History, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r221', code: 'R221', name: 'Chain of Custody Center', icon: GitCommit, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN'] },
  { id: 'r222', code: 'R222', name: 'Legal Evidence Ledger', icon: Lock, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r223', code: 'R223', name: 'Document Version Center', icon: Layers, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r224', code: 'R224', name: 'Print Evidence Center', icon: Printer, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r225', code: 'R225', name: 'Audit Replay Center', icon: Play, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r226', code: 'R226', name: 'Position History Vault', icon: Building, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r227', code: 'R227', name: 'Succession Center', icon: ArrowRightLeft, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r228', code: 'R228', name: 'Credential Rotation Center', icon: KeyRound, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r229', code: 'R229', name: 'Knowledge Continuity Center', icon: BookOpen, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r230', code: 'R230', name: 'Annual Time Capsule', icon: Archive, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r231', code: 'R231', name: 'Data Classification Center', icon: Tag, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r232', code: 'R232', name: 'Retention Policy Center', icon: Clock, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r233', code: 'R233', name: 'Smart Archive Transition', icon: Layers, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r234', code: 'R234', name: 'Destruction Approval Center', icon: AlertOctagon, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r235', code: 'R235', name: 'Records Compliance Dashboard', icon: FileCheck2, category: 'Main & Core', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN'] },
  { id: 'r236', code: 'R236', name: 'Living Calendar Engine', icon: Calendar, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r237', code: 'R237', name: 'Asy Wardrobe System', icon: Shirt, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r238', code: 'R238', name: 'Cultural Animation Engine', icon: Sparkles, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r239', code: 'R239', name: 'Education Calendar Engine', icon: BookOpen, category: 'Akademik', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r240', code: 'R240', name: 'Weather & Daytime Engine', icon: Sun, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r241', code: 'R241', name: 'Total System War Room', icon: ShieldAlert, category: 'Portal & System', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN', 'GURU', 'WALI_MURID'] },
  { id: 'r378', code: 'R378', name: 'Security Command Center', icon: Video, category: 'Guardian & CCTV', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r379', code: 'R379', name: 'CCTV Setup Wizard', icon: Sliders, category: 'Guardian & CCTV', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r380', code: 'R380', name: 'Camera Health Guardian', icon: Activity, category: 'Guardian & CCTV', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r381', code: 'R381', name: 'Smart Intruder Tracking', icon: Crosshair, category: 'Guardian & CCTV', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r382', code: 'R382', name: 'Security Incident Timeline', icon: Milestone, category: 'Guardian & CCTV', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r383', code: 'R383', name: 'Evidence Vault Enterprise', icon: Lock, category: 'Guardian & CCTV', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r384', code: 'R384', name: 'Executive Security Bridge', icon: Crown, category: 'Guardian & CCTV', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r385', code: 'R385', name: 'Golden 10 Minutes Protocol', icon: Flame, category: 'Guardian & CCTV', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r386', code: 'R386', name: 'Police Ready Evidence Pack', icon: FileText, category: 'Guardian & CCTV', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r387', code: 'R387', name: 'Gate Guardian Protocol', icon: DoorClosed, category: 'Guardian & CCTV', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r388', code: 'R388', name: 'Child Safety Zone', icon: MapPin, category: 'Guardian & CCTV', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN', 'GURU'] },
  { id: 'r389', code: 'R389', name: 'Security Health Lab', icon: ShieldCheck, category: 'Guardian & CCTV', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r390', code: 'R390', name: 'QR CCTV Pairing Card', icon: QrCode, category: 'Guardian & CCTV', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r391', code: 'R391', name: 'Never Lose User Work', icon: HardDrive, category: 'Konstitusi Permanen', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'KEUANGAN', 'ADMIN'] },
  { id: 'r392', code: 'R392', name: 'AI Studio Export Guardian', icon: FolderArchive, category: 'Konstitusi Permanen', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r393', code: 'R393', name: 'One Engine Cross Platform', icon: ArrowRightLeft, category: 'Konstitusi Permanen', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r394', code: 'R394', name: 'School Deployment Bridge', icon: Globe, category: 'Konstitusi Permanen', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r395', code: 'R395', name: 'Gov Office Formula Engine', icon: FileSpreadsheet, category: 'Konstitusi Permanen', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN', 'ADMIN'] },
  { id: 'r396', code: 'R396', name: 'One Click Emergency Guardian', icon: Flame, category: 'Konstitusi Permanen', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r397', code: 'R397', name: 'Smart Asset Maintenance', icon: Wrench, category: 'Konstitusi Permanen', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r398', code: 'R398', name: 'Parent Pickup Guardian', icon: UserCheck, category: 'Konstitusi Permanen', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r399', code: 'R399', name: 'TADE Self Healing Engine', icon: HeartPulse, category: 'Konstitusi Permanen', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r400', code: 'R400', name: 'Founder Command Center', icon: Crown, category: 'Konstitusi Permanen', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r411', code: 'R411', name: 'Guardian Daily Autopilot', icon: Zap, category: 'Otomasi & Autopilot', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r412', code: 'R412', name: 'Smart School Scheduler', icon: Calendar, category: 'Otomasi & Autopilot', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r413', code: 'R413', name: 'Gov Numbering Engine', icon: FileText, category: 'Otomasi & Autopilot', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r414', code: 'R414', name: 'Banking Formula Guardian', icon: Calculator, category: 'Otomasi & Autopilot', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN', 'ADMIN'] },
  { id: 'r415', code: 'R415', name: 'Document Auto Validation', icon: FileCheck, category: 'Otomasi & Autopilot', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r416', code: 'R416', name: 'Smart Report Generator', icon: FileSpreadsheet, category: 'Otomasi & Autopilot', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN', 'ADMIN'] },
  { id: 'r417', code: 'R417', name: 'Classroom Readiness Engine', icon: CheckSquare, category: 'Otomasi & Autopilot', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r418', code: 'R418', name: 'Guardian Notification Matrix', icon: Bell, category: 'Otomasi & Autopilot', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r419', code: 'R419', name: 'Office Quality Validator', icon: SpellCheck, category: 'Otomasi & Autopilot', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r420', code: 'R420', name: 'Zero Manual Repetition', icon: Sparkles, category: 'Otomasi & Autopilot', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r421', code: 'R421', name: 'Office Formula Compatibility', icon: FileSpreadsheet, category: 'Otomasi & Autopilot', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN', 'ADMIN'] },
  { id: 'r422', code: 'R422', name: 'Smart Mail Workflow', icon: FileText, category: 'Otomasi & Autopilot', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r423', code: 'R423', name: 'Executive Morning Brief', icon: Sun, category: 'Otomasi & Autopilot', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },

  // RC60: Legal Government & Banking Office Enterprise
  { id: 'r424', code: 'R424', name: 'Gov Letter Intelligence', icon: FileText, category: 'Legal & Banking Office', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r425', code: 'R425', name: 'Banking Ledger Intelligence', icon: Calculator, category: 'Legal & Banking Office', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN', 'ADMIN'] },
  { id: 'r426', code: 'R426', name: 'Certificate & Diploma Hub', icon: Award, category: 'Legal & Banking Office', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r427', code: 'R427', name: 'Government Archive Vault', icon: Archive, category: 'Legal & Banking Office', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r428', code: 'R428', name: 'Legal Stamp & Signature', icon: PenTool, category: 'Legal & Banking Office', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r429', code: 'R429', name: 'Government Print Center', icon: Printer, category: 'Legal & Banking Office', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r430', code: 'R430', name: 'Office Formula Verifier', icon: FileSpreadsheet, category: 'Legal & Banking Office', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'KEUANGAN', 'ADMIN'] },
  { id: 'r431', code: 'R431', name: 'Executive Approval Matrix', icon: UserCheck, category: 'Legal & Banking Office', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r432', code: 'R432', name: 'Official Mail Tracker', icon: Send, category: 'Legal & Banking Office', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r433', code: 'R433', name: 'Legal Compliance Center', icon: ShieldCheck, category: 'Legal & Banking Office', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },

  // RC65: Digital Twin Campus & Living Operations Command
  { id: 'r475', code: 'R475', name: 'Digital Twin Campus Center', icon: Building2, category: 'Digital Twin & Living Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'BENDAHARA', 'OPERATOR'] },
  { id: 'r476', code: 'R476', name: 'Living Room Intelligence', icon: Activity, category: 'Digital Twin & Living Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r477', code: 'R477', name: 'Asy Living Guide (3D)', icon: Bot, category: 'Digital Twin & Living Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID', 'ADMIN'] },
  { id: 'r478', code: 'R478', name: 'Campus Heat Map', icon: Flame, category: 'Digital Twin & Living Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r479', code: 'R479', name: 'Live CCTV Bridge', icon: Video, category: 'Digital Twin & Living Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r480', code: 'R480', name: 'Smart Asset Locator', icon: MapPin, category: 'Digital Twin & Living Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r481', code: 'R481', name: 'Classroom Readiness Live', icon: CheckSquare, category: 'Digital Twin & Living Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r482', code: 'R482', name: 'Founder Command Map', icon: Gauge, category: 'Digital Twin & Living Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r483', code: 'R483', name: 'Smart Navigation Engine', icon: Compass, category: 'Digital Twin & Living Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID', 'ADMIN'] },
  { id: 'r484', code: 'R484', name: 'Performance Split Engine', icon: Zap, category: 'Digital Twin & Living Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC67: AI Asy & Guardian Command Hierarchy Enterprise
  { id: 'r495', code: 'R495', name: 'AI Asy Command Center', icon: Bot, category: 'AI Asy & Guardian Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'BENDAHARA', 'OPERATOR'] },
  { id: 'r496', code: 'R496', name: 'Guardian Command Center', icon: ShieldAlert, category: 'AI Asy & Guardian Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r497', code: 'R497', name: 'Dual AI Coordination Engine', icon: ArrowRightLeft, category: 'AI Asy & Guardian Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r498', code: 'R498', name: 'Founder Preview Mode Final', icon: Crown, category: 'AI Asy & Guardian Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r499', code: 'R499', name: 'Smart Route Memory V2', icon: Compass, category: 'AI Asy & Guardian Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'WALI_MURID'] },
  { id: 'r500', code: 'R500', name: 'Living Task Automation Engine', icon: Zap, category: 'AI Asy & Guardian Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r501', code: 'R501', name: 'Guardian Incident Commander', icon: Flame, category: 'AI Asy & Guardian Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r502', code: 'R502', name: 'Executive AI Bridge', icon: LayoutDashboard, category: 'AI Asy & Guardian Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r503', code: 'R503', name: 'Human Workload Optimizer', icon: TrendingUp, category: 'AI Asy & Guardian Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r504', code: 'R504', name: 'Constitution Enforcement Engine', icon: ShieldCheck, category: 'AI Asy & Guardian Command', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC68: Website & Web App Total Separation + Security Hardening Enterprise
  { id: 'r505', code: 'R505', name: 'Dual Architecture Separation Engine', icon: Split, category: 'Separation & Security Hardening', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r506', code: 'R506', name: 'Secure Route Isolation', icon: Compass, category: 'Separation & Security Hardening', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'WALI_MURID'] },
  { id: 'r507', code: 'R507', name: 'Security Boundary Firewall', icon: ShieldAlert, category: 'Separation & Security Hardening', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r508', code: 'R508', name: 'SEO Isolation Center', icon: Search, category: 'Separation & Security Hardening', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r509', code: 'R509', name: 'Session Fortress', icon: Lock, category: 'Separation & Security Hardening', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'BENDAHARA', 'OPERATOR'] },
  { id: 'r510', code: 'R510', name: 'Browser Security Fortress', icon: ShieldCheck, category: 'Separation & Security Hardening', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r511', code: 'R511', name: 'Firebase Security Fortress', icon: Database, category: 'Separation & Security Hardening', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r512', code: 'R512', name: 'Cache Isolation Engine', icon: HardDrive, category: 'Separation & Security Hardening', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r513', code: 'R513', name: 'Founder Preview Separation', icon: Crown, category: 'Separation & Security Hardening', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r514', code: 'R514', name: 'Security War Room Dashboard', icon: Gauge, category: 'Separation & Security Hardening', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC69: Enterprise Production Launch & Long Life Operations
  { id: 'r515', code: 'R515', name: 'Enterprise Deployment Command Center', icon: Server, category: 'Production & Long Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r517', code: 'R517', name: 'Backup Independence Center', icon: HardDrive, category: 'Production & Long Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r518', code: 'R518', name: 'AI Asy Living Operations', icon: Bot, category: 'Production & Long Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'BENDAHARA', 'OPERATOR'] },
  { id: 'r519', code: 'R519', name: 'Guardian Continuous Security', icon: ShieldAlert, category: 'Production & Long Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r520', code: 'R520', name: 'Smart Maintenance Calendar', icon: Calendar, category: 'Production & Long Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r521', code: 'R521', name: 'Founder Executive Timeline', icon: GitCommit, category: 'Production & Long Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r522', code: 'R522', name: 'School Knowledge Vault', icon: BookOpen, category: 'Production & Long Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'WALI_MURID'] },
  { id: 'r523', code: 'R523', name: 'Production Health Observatory', icon: Activity, category: 'Production & Long Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r524', code: 'R524', name: 'Final Candidate Preparation Center', icon: Crown, category: 'Production & Long Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },

  // RC70: Immortal Core Hardening & Living War Room
  { id: 'r526', code: 'R526', name: 'Universal Healing Core', icon: Zap, category: 'Immortal Core & Living Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r527', code: 'R527', name: 'Living War Room Operations', icon: Gauge, category: 'Immortal Core & Living Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r528', code: 'R528', name: 'Guardian Defense Ladder', icon: Shield, category: 'Immortal Core & Living Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r529', code: 'R529', name: 'Recovery Swarm Coordination', icon: Users, category: 'Immortal Core & Living Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r530', code: 'R530', name: 'Executive Incident Theater', icon: Crown, category: 'Immortal Core & Living Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r531', code: 'R531', name: 'Continuous Threat Observatory', icon: Eye, category: 'Immortal Core & Living Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r532', code: 'R532', name: 'Smart Recovery Playbook', icon: BookOpen, category: 'Immortal Core & Living Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r533', code: 'R533', name: 'Founder Crisis Timeline', icon: GitCommit, category: 'Immortal Core & Living Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r534', code: 'R534', name: 'Guardian Research Vault', icon: BookOpen, category: 'Immortal Core & Living Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'WALI_MURID'] },

  // RC72: Guardian Kernel Layer & Operating System Philosophy
  { id: 'r545', code: 'R545', name: 'Guardian Kernel Layer', icon: Cpu, category: 'Guardian Kernel Layer & OS Architecture', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r546', code: 'R546', name: 'Kernel Process Isolation', icon: Shield, category: 'Guardian Kernel Layer & OS Architecture', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r547', code: 'R547', name: 'Kernel Scheduler Governor', icon: Sliders, category: 'Guardian Kernel Layer & OS Architecture', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r548', code: 'R548', name: 'Kernel Memory Guardian', icon: Activity, category: 'Guardian Kernel Layer & OS Architecture', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r549', code: 'R549', name: 'Kernel Journal Service', icon: FileText, category: 'Guardian Kernel Layer & OS Architecture', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r550', code: 'R550', name: 'Kernel Permission Matrix', icon: Lock, category: 'Guardian Kernel Layer & OS Architecture', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r551', code: 'R551', name: 'Kernel Recovery Swarm V2', icon: Zap, category: 'Guardian Kernel Layer & OS Architecture', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r552', code: 'R552', name: 'Kernel Heartbeat Observatory', icon: Radio, category: 'Guardian Kernel Layer & OS Architecture', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r553', code: 'R553', name: 'Kernel Integrity Scanner', icon: ShieldCheck, category: 'Guardian Kernel Layer & OS Architecture', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r554', code: 'R554', name: 'Kernel Constitution Guardian', icon: Scale, category: 'Guardian Kernel Layer & OS Architecture', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },

  // RC73: Linux Enterprise Resilience & Kernel Optimization
  { id: 'r555', code: 'R555', name: 'Kernel Boot Sequence Manager', icon: Play, category: 'Linux Resilience & Kernel Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r556', code: 'R556', name: 'Engine Dependency Graph', icon: GitFork, category: 'Linux Resilience & Kernel Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r557', code: 'R557', name: 'Adaptive Resource Scheduler', icon: Sliders, category: 'Linux Resilience & Kernel Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r558', code: 'R558', name: 'Kernel Memory Reclaimer', icon: Trash2, category: 'Linux Resilience & Kernel Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r559', code: 'R559', name: 'Immutable Audit Chain', icon: Link2, category: 'Linux Resilience & Kernel Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r560', code: 'R560', name: 'Dynamic Permission Enforcement', icon: Lock, category: 'Linux Resilience & Kernel Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r561', code: 'R561', name: 'Recovery Swarm Mesh V3', icon: Share2, category: 'Linux Resilience & Kernel Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r562', code: 'R562', name: 'Kernel Pulse Network', icon: Radio, category: 'Linux Resilience & Kernel Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r563', code: 'R563', name: 'Integrity Guardian Matrix', icon: ShieldCheck, category: 'Linux Resilience & Kernel Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r564', code: 'R564', name: 'Constitution Evolution Guardian', icon: Scale, category: 'Linux Resilience & Kernel Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },

  // RC74: Linux Enterprise Supervision & Autonomous Operations
  { id: 'r565', code: 'R565', name: 'Kernel Service Lifecycle Manager', icon: Cpu, category: 'Linux Enterprise Supervision', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r566', code: 'R566', name: 'Guardian Dependency Supervisor', icon: GitFork, category: 'Linux Enterprise Supervision', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r567', code: 'R567', name: 'Autonomous Recovery Planner', icon: Bot, category: 'Linux Enterprise Supervision', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r568', code: 'R568', name: 'Kernel Health Propagation', icon: Activity, category: 'Linux Enterprise Supervision', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r569', code: 'R569', name: 'Smart Journal Replay', icon: RotateCcw, category: 'Linux Enterprise Supervision', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r570', code: 'R570', name: 'Permission Drift Detector', icon: ShieldAlert, category: 'Linux Enterprise Supervision', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r571', code: 'R571', name: 'Recovery Swarm Collective', icon: Share2, category: 'Linux Enterprise Supervision', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r572', code: 'R572', name: 'Kernel Performance Observatory V2', icon: Gauge, category: 'Linux Enterprise Supervision', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r573', code: 'R573', name: 'Executive Operational Theater', icon: Crown, category: 'Linux Enterprise Supervision', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r574', code: 'R574', name: 'Constitution Consistency Auditor', icon: Scale, category: 'Linux Enterprise Supervision', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },

  // RC75: Kernel Resilience Mesh & Founder Operations
  { id: 'r575', code: 'R575', name: 'Kernel Event Bus (Netlink)', icon: Radio, category: 'Kernel Resilience & Founder Ops', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r576', code: 'R576', name: 'Dependency Recovery Mesh', icon: GitFork, category: 'Kernel Resilience & Founder Ops', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r577', code: 'R577', name: 'AI Asy Operational Copilot', icon: Bot, category: 'Kernel Resilience & Founder Ops', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'BENDAHARA', 'GURU', 'ADMIN'] },
  { id: 'r578', code: 'R578', name: 'Guardian Threat Matrix', icon: ShieldAlert, category: 'Kernel Resilience & Founder Ops', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r579', code: 'R579', name: 'Immutable Recovery Ledger', icon: FileLock2, category: 'Kernel Resilience & Founder Ops', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r580', code: 'R580', name: 'Kernel Watchdog Timer', icon: Timer, category: 'Kernel Resilience & Founder Ops', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r581', code: 'R581', name: 'Browser Runtime Sentinel', icon: Monitor, category: 'Kernel Resilience & Founder Ops', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r582', code: 'R582', name: 'Performance Budget Guardian', icon: Gauge, category: 'Kernel Resilience & Founder Ops', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r583', code: 'R583', name: 'Founder Decision Console', icon: Crown, category: 'Kernel Resilience & Founder Ops', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r584', code: 'R584', name: 'Kernel Stability Auditor', icon: Scale, category: 'Kernel Resilience & Founder Ops', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },

  // RC76: Immortal Storage & Disaster Resilience Kernel
  { id: 'r585', code: 'R585', name: 'Immortal Storage Manager', icon: Database, category: 'Immortal Storage & Disaster Resilience', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r586', code: 'R586', name: 'WAL Persistence Engine', icon: FileText, category: 'Immortal Storage & Disaster Resilience', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r587', code: 'R587', name: 'Smart Snapshot Scheduler', icon: Camera, category: 'Immortal Storage & Disaster Resilience', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r588', code: 'R588', name: 'Browser Crash Recovery', icon: RotateCcw, category: 'Immortal Storage & Disaster Resilience', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r589', code: 'R589', name: 'Offline Operation Manager', icon: WifiOff, category: 'Immortal Storage & Disaster Resilience', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'BENDAHARA', 'GURU', 'ADMIN'] },
  { id: 'r590', code: 'R590', name: 'Runtime State Guardian', icon: ShieldCheck, category: 'Immortal Storage & Disaster Resilience', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r591', code: 'R591', name: 'Disaster Recovery Simulator', icon: AlertOctagon, category: 'Immortal Storage & Disaster Resilience', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r592', code: 'R592', name: 'Guardian Storage Integrity', icon: ShieldCheck, category: 'Immortal Storage & Disaster Resilience', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r593', code: 'R593', name: 'AI Asy Recovery Guide', icon: Bot, category: 'Immortal Storage & Disaster Resilience', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'BENDAHARA', 'GURU', 'ADMIN'] },
  { id: 'r594', code: 'R594', name: 'Founder Disaster Command', icon: Crown, category: 'Immortal Storage & Disaster Resilience', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC77: Guardian Control Plane & Observability Kernel
  { id: 'r595', code: 'R595', name: 'Guardian Control Plane', icon: Network, category: 'Control Plane & Observability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r596', code: 'R596', name: 'Unified Telemetry Bus', icon: Activity, category: 'Control Plane & Observability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r597', code: 'R597', name: 'AI Asy Executive Intelligence', icon: Bot, category: 'Control Plane & Observability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'BENDAHARA', 'GURU', 'ADMIN'] },
  { id: 'r598', code: 'R598', name: 'Guardian Threat Correlator', icon: ShieldAlert, category: 'Control Plane & Observability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r599', code: 'R599', name: 'Distributed Recovery Coordinator', icon: Share2, category: 'Control Plane & Observability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r600', code: 'R600', name: 'Kernel Trace Observatory', icon: Radio, category: 'Control Plane & Observability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r601', code: 'R601', name: 'Secure Sync Coordinator', icon: Lock, category: 'Control Plane & Observability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r602', code: 'R602', name: 'Founder Command Timeline V2', icon: Crown, category: 'Control Plane & Observability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r603', code: 'R603', name: 'Operational Governance Engine', icon: Scale, category: 'Control Plane & Observability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r604', code: 'R604', name: 'Kernel Future Compatibility Guard', icon: Compass, category: 'Control Plane & Observability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC78: Sovereign Government & Long-Life Operations
  { id: 'r605', code: 'R605', name: 'Sovereign Command Center', icon: Crown, category: 'Sovereign Government & Long-Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r606', code: 'R606', name: 'Prime Minister Cabinet Engine', icon: Building2, category: 'Sovereign Government & Long-Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'BENDAHARA', 'GURU', 'ADMIN'] },
  { id: 'r607', code: 'R607', name: 'Minister Assistant Network', icon: Users, category: 'Sovereign Government & Long-Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'BENDAHARA', 'GURU', 'ADMIN'] },
  { id: 'r608', code: 'R608', name: 'Guardian Military Command', icon: ShieldCheck, category: 'Sovereign Government & Long-Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r609', code: 'R609', name: 'Commander Assistant Network', icon: Crosshair, category: 'Sovereign Government & Long-Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r610', code: 'R610', name: 'Micro Agent Swarm', icon: Cpu, category: 'Sovereign Government & Long-Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r611', code: 'R611', name: 'Executive Escalation Chain', icon: GitMerge, category: 'Sovereign Government & Long-Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r612', code: 'R612', name: 'Long-Life Operations (LTS)', icon: Hourglass, category: 'Sovereign Government & Long-Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r613', code: 'R613', name: 'Executive Government Theater', icon: Layers, category: 'Sovereign Government & Long-Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'BENDAHARA', 'ADMIN'] },
  { id: 'r614', code: 'R614', name: 'Constitutional Enforcement V2', icon: Scale, category: 'Sovereign Government & Long-Life Operations', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC79: Sovereign Civil Service & Autonomous Government
  { id: 'r615', code: 'R615', name: 'Sovereign Civil Service Registry', icon: Users, category: 'Sovereign Civil Service & Autonomous Gov', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'BENDAHARA', 'GURU', 'ADMIN'] },
  { id: 'r616', code: 'R616', name: 'Digital Employee Workforce', icon: Bot, category: 'Sovereign Civil Service & Autonomous Gov', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'BENDAHARA', 'GURU', 'ADMIN'] },
  { id: 'r617', code: 'R617', name: 'Cross-Ministry Collaboration Engine', icon: GitMerge, category: 'Sovereign Civil Service & Autonomous Gov', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'BENDAHARA', 'ADMIN'] },
  { id: 'r618', code: 'R618', name: 'Government Workflow Orchestrator', icon: Cpu, category: 'Sovereign Civil Service & Autonomous Gov', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'BENDAHARA', 'ADMIN'] },
  { id: 'r619', code: 'R619', name: 'Guardian Military Logistics', icon: ShieldCheck, category: 'Sovereign Civil Service & Autonomous Gov', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r620', code: 'R620', name: 'Recovery Reinforcement Corps', icon: Crosshair, category: 'Sovereign Civil Service & Autonomous Gov', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r621', code: 'R621', name: 'Constitutional Decision Ledger', icon: FileText, category: 'Sovereign Civil Service & Autonomous Gov', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r622', code: 'R622', name: 'Government Intelligence Board', icon: Activity, category: 'Sovereign Civil Service & Autonomous Gov', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'BENDAHARA', 'ADMIN'] },
  { id: 'r623', code: 'R623', name: 'Executive Command Theater V2', icon: Crown, category: 'Sovereign Civil Service & Autonomous Gov', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r624', code: 'R624', name: 'Constitutional Harmony Auditor', icon: Scale, category: 'Sovereign Civil Service & Autonomous Gov', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC80: Digital State Infrastructure & Capability Kernel
  { id: 'r625', code: 'R625', name: 'Kernel Namespace Manager', icon: Layers, category: 'Digital State & Capability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r626', code: 'R626', name: 'Capability Kernel Engine', icon: KeyRound, category: 'Digital State & Capability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r627', code: 'R627', name: 'Virtual Process Table (/proc)', icon: Cpu, category: 'Digital State & Capability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r628', code: 'R628', name: 'Unified Telemetry Matrix', icon: Activity, category: 'Digital State & Capability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r629', code: 'R629', name: 'Runtime Bus V2', icon: Network, category: 'Digital State & Capability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r630', code: 'R630', name: 'Agent Registry V2 (Zero Anon)', icon: UserCheck, category: 'Digital State & Capability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r631', code: 'R631', name: 'Founder Boot Sequence V2', icon: RotateCcw, category: 'Digital State & Capability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r632', code: 'R632', name: 'Government Runtime Observatory', icon: Eye, category: 'Digital State & Capability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'BENDAHARA', 'ADMIN'] },
  { id: 'r633', code: 'R633', name: 'Resource Governor V3 (CFS)', icon: Sliders, category: 'Digital State & Capability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r634', code: 'R634', name: 'Capability Constitution Auditor', icon: FileCheck, category: 'Digital State & Capability Kernel', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC81: Operational Doctrine & Longevity Architecture
  { id: 'r635', code: 'R635', name: 'Operational Doctrine Engine', icon: Scale, category: 'Operational Doctrine & Longevity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r636', code: 'R636', name: 'Dependency Graph Guardian', icon: Network, category: 'Operational Doctrine & Longevity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r637', code: 'R637', name: 'Service Ownership Registry', icon: Users, category: 'Operational Doctrine & Longevity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r638', code: 'R638', name: 'Recovery Reinforcement Matrix', icon: Crosshair, category: 'Operational Doctrine & Longevity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r639', code: 'R639', name: 'Runtime Continuity Mesh', icon: Zap, category: 'Operational Doctrine & Longevity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r640', code: 'R640', name: 'Immutable Journal Federation', icon: FileText, category: 'Operational Doctrine & Longevity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r641', code: 'R641', name: 'Executive Operations Board', icon: LayoutDashboard, category: 'Operational Doctrine & Longevity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r642', code: 'R642', name: 'Autonomous Maintenance Rotation', icon: Wrench, category: 'Operational Doctrine & Longevity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r643', code: 'R643', name: 'Operational Invariants Engine', icon: ShieldCheck, category: 'Operational Doctrine & Longevity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r644', code: 'R644', name: 'Long-Life Forecast Engine', icon: TrendingUp, category: 'Operational Doctrine & Longevity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC85: Sovereign Intelligence & Hermes Control Suite
  { id: 'r667', code: 'R667', name: 'AI Asy Intelligence Center', icon: Radio, category: 'Sovereign Intelligence & Hermes Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r668', code: 'R668', name: 'Executive Intelligence Briefing', icon: AlertTriangle, category: 'Sovereign Intelligence & Hermes Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r669', code: 'R669', name: 'Dialog Dua Arah AI Asy', icon: Sparkles, category: 'Sovereign Intelligence & Hermes Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r670', code: 'R670', name: 'Free Technology Radar', icon: Search, category: 'Sovereign Intelligence & Hermes Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r671', code: 'R671', name: 'Future Radar (6–24 Bulan)', icon: Compass, category: 'Sovereign Intelligence & Hermes Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r672', code: 'R672', name: 'Hermes Activation Gate', icon: Lock, category: 'Sovereign Intelligence & Hermes Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r673', code: 'R673', name: 'Hermes Service Contracts', icon: FileCode, category: 'Sovereign Intelligence & Hermes Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r674', code: 'R674', name: 'Sovereign Manual Administration', icon: Sliders, category: 'Sovereign Intelligence & Hermes Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r675', code: 'R675', name: 'Knowledge Vault Evolution', icon: Database, category: 'Sovereign Intelligence & Hermes Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r676', code: 'R676', name: 'Future Council Governance', icon: Award, category: 'Sovereign Intelligence & Hermes Suite', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC86: Administrative Intelligence & Task Completion Engine
  { id: 'r677', code: 'R677', name: 'Administrative Task Orchestrator', icon: Sparkles, category: 'Administrative Intelligence & Completion Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r678', code: 'R678', name: 'Administrative Completion Engine', icon: CheckCircle2, category: 'Administrative Intelligence & Completion Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r679', code: 'R679', name: 'Natural Language Admin Intent', icon: Bot, category: 'Administrative Intelligence & Completion Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r680', code: 'R680', name: 'Administrative Workflow Library', icon: BookOpen, category: 'Administrative Intelligence & Completion Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r681', code: 'R681', name: 'Role-Aware Service Mode', icon: UserCheck, category: 'Administrative Intelligence & Completion Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r682', code: 'R682', name: 'Task Self-Recovery Engine', icon: RefreshCw, category: 'Administrative Intelligence & Completion Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r683', code: 'R683', name: 'Administrative Completion Score', icon: BarChart3, category: 'Administrative Intelligence & Completion Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r684', code: 'R684', name: 'Human Handoff Engine', icon: ShieldAlert, category: 'Administrative Intelligence & Completion Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r685', code: 'R685', name: 'Administrative Activity Journal', icon: History, category: 'Administrative Intelligence & Completion Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r686', code: 'R686', name: 'Admin Service Quality Board', icon: Layers, category: 'Administrative Intelligence & Completion Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r687', code: 'R687', name: 'Sovereign Work Mode', icon: Crown, category: 'Administrative Intelligence & Completion Engine', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'r688', code: 'R688', name: 'Administrative Safety Gate', icon: ShieldCheck, category: 'Administrative Intelligence & Completion Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r689', code: 'R689', name: 'Founder Admin Command Center', icon: Terminal, category: 'Administrative Intelligence & Completion Engine', allowedRoles: ['SUPER_ADMIN'] },
  { id: 'r690', code: 'R690', name: 'Hermes Readiness Simulator', icon: Cpu, category: 'Administrative Intelligence & Completion Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC87: Adaptive Workflow Intelligence & Hermes Continuity Engine
  { id: 'r691', code: 'R691', name: 'Adaptive Workflow Memory', icon: Database, category: 'Adaptive Intelligence & Continuity Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r692', code: 'R692', name: 'Pause/Resume Intelligence', icon: PauseCircle, category: 'Adaptive Intelligence & Continuity Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r693', code: 'R693', name: 'Manual Takeover Learning', icon: BookOpen, category: 'Adaptive Intelligence & Continuity Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r694', code: 'R694', name: 'Workflow Adaptation Engine', icon: Sparkles, category: 'Adaptive Intelligence & Continuity Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r695', code: 'R695', name: 'Failure Pattern Intelligence', icon: AlertTriangle, category: 'Adaptive Intelligence & Continuity Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r696', code: 'R696', name: 'Completion Optimization Engine', icon: BarChart3, category: 'Adaptive Intelligence & Continuity Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r697', code: 'R697', name: 'Administrative Pattern Learning', icon: Award, category: 'Adaptive Intelligence & Continuity Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r698', code: 'R698', name: 'Continuity Reconciliation', icon: ShieldCheck, category: 'Adaptive Intelligence & Continuity Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r699', code: 'R699', name: 'Adaptive Admin Quality Board', icon: Layers, category: 'Adaptive Intelligence & Continuity Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r700', code: 'R700', name: 'Hermes Adaptive Dry-Run Lab', icon: Cpu, category: 'Adaptive Intelligence & Continuity Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r_adaptive_suite', code: 'RC87', name: 'Hermes Adaptive Suite Master', icon: Sparkles, category: 'Adaptive Intelligence & Continuity Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC88: Operational Intelligence & Governance Foundation
  { id: 'r701', code: 'R701', name: 'Operational Health Center', icon: Activity, category: 'Operational Intelligence & Governance Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r702', code: 'R702', name: 'Founder Verification Center', icon: Award, category: 'Operational Intelligence & Governance Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN'] },
  { id: 'r703', code: 'R703', name: 'Guardian Integrity Scanner', icon: ShieldCheck, category: 'Operational Intelligence & Governance Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r704', code: 'R704', name: 'Recovery Readiness Dashboard', icon: HardDrive, category: 'Operational Intelligence & Governance Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r705', code: 'R705', name: 'Configuration Drift Detector', icon: Sliders, category: 'Operational Intelligence & Governance Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r706', code: 'R706', name: 'Executive Decision Journal', icon: BookOpen, category: 'Operational Intelligence & Governance Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r707', code: 'R707', name: 'Knowledge Evolution Tracker', icon: Layers, category: 'Operational Intelligence & Governance Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r708', code: 'R708', name: 'Founder Command History', icon: Terminal, category: 'Operational Intelligence & Governance Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN'] },
  { id: 'r709', code: 'R709', name: 'Performance Observation Engine', icon: Gauge, category: 'Operational Intelligence & Governance Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r710', code: 'R710', name: 'RC88 Governance War Room', icon: Sparkles, category: 'Operational Intelligence & Governance Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r_rc88_suite', code: 'RC88', name: 'RC88 Governance Master Hub', icon: ShieldCheck, category: 'Operational Intelligence & Governance Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC89: Smart Office Enterprise Orchestration
  { id: 'r711', code: 'R711', name: 'Smart Office Workspace', icon: Briefcase, category: 'Smart Office Enterprise Orchestration', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r712', code: 'R712', name: 'Unified Administrative Queue', icon: ListOrdered, category: 'Smart Office Enterprise Orchestration', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r713', code: 'R713', name: 'Intelligent Priority Engine', icon: Sparkles, category: 'Smart Office Enterprise Orchestration', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r714', code: 'R714', name: 'Executive Inbox Pimpinan', icon: Inbox, category: 'Smart Office Enterprise Orchestration', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r715', code: 'R715', name: 'Smart Document Center', icon: FileText, category: 'Smart Office Enterprise Orchestration', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r716', code: 'R716', name: 'Administrative Activity Timeline', icon: History, category: 'Smart Office Enterprise Orchestration', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r717', code: 'R717', name: 'Smart Notification Router', icon: Bell, category: 'Smart Office Enterprise Orchestration', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r718', code: 'R718', name: 'Founder Workspace Snapshot', icon: Layers, category: 'Smart Office Enterprise Orchestration', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN'] },
  { id: 'r719', code: 'R719', name: 'Cross-Module Consistency Auditor', icon: ShieldCheck, category: 'Smart Office Enterprise Orchestration', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r720', code: 'R720', name: 'RC89 Smart Office War Room', icon: Sparkles, category: 'Smart Office Enterprise Orchestration', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r_rc89_suite', code: 'RC89', name: 'RC89 Smart Office Master Hub', icon: Briefcase, category: 'Smart Office Enterprise Orchestration', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC90: Enterprise Engine Contract & AI Asy Executive Intelligence
  { id: 'r721', code: 'R721', name: 'Engine Contract Registry', icon: FileCode, category: 'Engine Contract & Executive Intelligence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r722', code: 'R722', name: 'Compatibility Validator', icon: ShieldCheck, category: 'Engine Contract & Executive Intelligence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r723', code: 'R723', name: 'Executive Intelligence Hub', icon: Brain, category: 'Engine Contract & Executive Intelligence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r724', code: 'R724', name: 'Situation Report (SITREP)', icon: Activity, category: 'Engine Contract & Executive Intelligence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r725', code: 'R725', name: 'Role-Specific Executive Brief', icon: Crown, category: 'Engine Contract & Executive Intelligence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH'] },
  { id: 'r726', code: 'R726', name: 'Operational Insight Engine', icon: TrendingUp, category: 'Engine Contract & Executive Intelligence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r727', code: 'R727', name: 'Executive Question Console', icon: Bot, category: 'Engine Contract & Executive Intelligence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r728', code: 'R728', name: 'Intelligence Confidence Engine', icon: Award, category: 'Engine Contract & Executive Intelligence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r729', code: 'R729', name: 'System Capability Registry', icon: Network, category: 'Engine Contract & Executive Intelligence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r730', code: 'R730', name: 'RC90 Executive Intelligence War Room', icon: Sparkles, category: 'Engine Contract & Executive Intelligence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r_rc90_suite', code: 'RC90', name: 'RC90 Executive Intelligence Master Hub', icon: Crown, category: 'Engine Contract & Executive Intelligence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC91: Enterprise Offline Continuity & Disaster Resilience
  { id: 'r731', code: 'R731', name: 'Offline Continuity Manager', icon: Radio, category: 'Offline Continuity Enterprise', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r732', code: 'R732', name: 'Safe Sync Queue', icon: ListOrdered, category: 'Offline Continuity Enterprise', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r733', code: 'R733', name: 'Conflict Resolution Engine', icon: AlertTriangle, category: 'Offline Continuity Enterprise', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r734', code: 'R734', name: 'Local Snapshot Cache', icon: HardDrive, category: 'Offline Continuity Enterprise', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r735', code: 'R735', name: 'Connectivity Intelligence', icon: Activity, category: 'Offline Continuity Enterprise', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r736', code: 'R736', name: 'Recovery Replay Engine', icon: RotateCcw, category: 'Offline Continuity Enterprise', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r737', code: 'R737', name: 'Offline Readiness Dashboard', icon: LayoutDashboard, category: 'Offline Continuity Enterprise', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r738', code: 'R738', name: 'Disaster Continuity Simulator', icon: Flame, category: 'Offline Continuity Enterprise', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r739', code: 'R739', name: 'Offline Integrity Auditor', icon: FileCheck2, category: 'Offline Continuity Enterprise', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r740', code: 'R740', name: 'RC91 Offline War Room', icon: Sparkles, category: 'Offline Continuity Enterprise', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r_rc91_suite', code: 'RC91', name: 'RC91 Offline Continuity Master Hub', icon: ShieldCheck, category: 'Offline Continuity Enterprise', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC92: Guardian Policy Engine & Constitution Compiler
  { id: 'r741', code: 'R741', name: 'Guardian Policy Registry', icon: Shield, category: 'Guardian Policy & Constitution Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r742', code: 'R742', name: 'Policy Evaluation Engine', icon: Zap, category: 'Guardian Policy & Constitution Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r743', code: 'R743', name: 'Constitution Compiler', icon: Cpu, category: 'Guardian Policy & Constitution Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r744', code: 'R744', name: 'Build Gate Validator', icon: Hammer, category: 'Guardian Policy & Constitution Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r745', code: 'R745', name: 'Runtime Policy Monitor', icon: Radio, category: 'Guardian Policy & Constitution Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r746', code: 'R746', name: 'Guardian Exception Journal', icon: FileText, category: 'Guardian Policy & Constitution Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r747', code: 'R747', name: 'Policy Simulator', icon: FlaskConical, category: 'Guardian Policy & Constitution Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r748', code: 'R748', name: 'Constitution Diff Viewer', icon: GitCompare, category: 'Guardian Policy & Constitution Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r749', code: 'R749', name: 'Sovereign Governance Board', icon: Award, category: 'Guardian Policy & Constitution Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r750', code: 'R750', name: 'RC92 Guardian War Room', icon: ShieldCheck, category: 'Guardian Policy & Constitution Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r_rc92_suite', code: 'RC92', name: 'RC92 Sovereign Guardian War Room', icon: Crown, category: 'Guardian Policy & Constitution Engine', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC93: Digital Companion Ecosystem
  { id: 'r751', code: 'R751', name: 'Parent Digital Companion', icon: Users, category: 'Digital Companion Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'WALI_MURID'] },
  { id: 'r752', code: 'R752', name: 'Teacher Digital Companion', icon: GraduationCap, category: 'Digital Companion Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r753', code: 'R753', name: 'Executive Companion', icon: Briefcase, category: 'Digital Companion Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r754', code: 'R754', name: 'Companion Memory Manager', icon: HardDrive, category: 'Digital Companion Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r755', code: 'R755', name: 'Conversation Context Engine', icon: MessageSquare, category: 'Digital Companion Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r756', code: 'R756', name: 'Smart Reminder Engine', icon: Bell, category: 'Digital Companion Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r757', code: 'R757', name: 'Companion Insight Cards', icon: Lightbulb, category: 'Digital Companion Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r758', code: 'R758', name: 'Interaction Timeline Stream', icon: ListTree, category: 'Digital Companion Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r759', code: 'R759', name: 'Companion Privacy Guard', icon: Lock, category: 'Digital Companion Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r760', code: 'R760', name: 'RC93 Companion War Room', icon: Sparkles, category: 'Digital Companion Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r_rc93_suite', code: 'RC93', name: 'RC93 Digital Companion Master Hub', icon: Crown, category: 'Digital Companion Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },

  // RC94: Sovereign Operations & Offline Continuity (R761 - R770)
  { id: 'r761', code: 'R761', name: 'Offline Continuity Engine', icon: Wifi, category: 'Sovereign Operations & Offline Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'BENDAHARA'] },
  { id: 'r762', code: 'R762', name: 'Founder Command Palette', icon: Command, category: 'Sovereign Operations & Offline Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r763', code: 'R763', name: 'Guardian Continuous Verification', icon: ShieldCheck, category: 'Sovereign Operations & Offline Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r764', code: 'R764', name: 'Sovereign Session Intelligence', icon: Clock, category: 'Sovereign Operations & Offline Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r765', code: 'R765', name: 'Offline Companion Cache', icon: Database, category: 'Sovereign Operations & Offline Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r766', code: 'R766', name: 'Sync Reconciliation Viewer', icon: GitMerge, category: 'Sovereign Operations & Offline Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r767', code: 'R767', name: 'Guardian Health Dashboard', icon: Activity, category: 'Sovereign Operations & Offline Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r768', code: 'R768', name: 'Discovery Integrity Scanner', icon: FileCheck, category: 'Sovereign Operations & Offline Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r769', code: 'R769', name: 'Recovery Readiness Simulator', icon: HardDrive, category: 'Sovereign Operations & Offline Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r770', code: 'R770', name: 'RC94 Sovereign War Room', icon: Sparkles, category: 'Sovereign Operations & Offline Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r_rc94_suite', code: 'RC94', name: 'RC94 Sovereign Operations Master Hub', icon: Crown, category: 'Sovereign Operations & Offline Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC95: Digital Government Foundation (R771 - R780)
  { id: 'r771', code: 'R771', name: 'Constitutional Policy Engine', icon: Scale, category: 'Digital Government Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r772', code: 'R772', name: 'Digital Signature Readiness Engine', icon: Stamp, category: 'Digital Government Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r773', code: 'R773', name: 'Immutable Governance Journal', icon: BookLock, category: 'Digital Government Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r774', code: 'R774', name: 'Cross-Module Audit Correlation Engine', icon: GitCommit, category: 'Digital Government Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r775', code: 'R775', name: 'Founder Decision Ledger', icon: Crown, category: 'Digital Government Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r776', code: 'R776', name: 'Government Operations Dashboard', icon: Building2, category: 'Digital Government Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r777', code: 'R777', name: 'Constitutional Conflict Detector', icon: AlertOctagon, category: 'Digital Government Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r778', code: 'R778', name: 'Institutional Approval Workflow', icon: CheckSquare, category: 'Digital Government Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r779', code: 'R779', name: 'Governance Evidence Explorer', icon: Search, category: 'Digital Government Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r780', code: 'R780', name: 'RC95 Government War Room', icon: Sparkles, category: 'Digital Government Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r_rc95_suite', code: 'RC95', name: 'RC95 Digital Government Master Hub', icon: Crown, category: 'Digital Government Foundation', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },

  // RC96A: Asy Living 3D Mascot Foundation (R781 - R790)
  { id: 'r781', code: 'R781', name: 'Asy 3D Asset Foundation', icon: Box, category: 'Asy Living 3D Mascot Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r782', code: 'R782', name: 'Asy Dock Assistant Hub', icon: Bot, category: 'Asy Living 3D Mascot Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r783', code: 'R783', name: 'Living Animation Engine', icon: Sparkles, category: 'Asy Living 3D Mascot Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r784', code: 'R784', name: 'Context Trigger Deck', icon: Zap, category: 'Asy Living 3D Mascot Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r785', code: 'R785', name: 'Bubble Dialogue System', icon: MessageSquare, category: 'Asy Living 3D Mascot Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r786', code: 'R786', name: 'Asy Interaction Engine', icon: Heart, category: 'Asy Living 3D Mascot Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r787', code: 'R787', name: 'Mascot Performance Guard', icon: Gauge, category: 'Asy Living 3D Mascot Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r788', code: 'R788', name: 'Mascot Accessibility Layer', icon: Accessibility, category: 'Asy Living 3D Mascot Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r789', code: 'R789', name: 'Asy Control Panel', icon: Sliders, category: 'Asy Living 3D Mascot Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r790', code: 'R790', name: 'RC96A Asy War Room', icon: Sparkles, category: 'Asy Living 3D Mascot Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r_rc96a_suite', code: 'RC96A', name: 'RC96A Asy Living Mascot Master Hub', icon: Crown, category: 'Asy Living 3D Mascot Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },

  // RC97: Asy Emotional Intelligence & Contextual Life (R791 - R800)
  { id: 'r800', code: 'R800', name: 'RC97 Living Asy War Room', icon: Bot, category: 'Asy Living 3D Mascot Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r799', code: 'R799', name: 'Companion Emotion Dashboard', icon: Heart, category: 'Asy Living 3D Mascot Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },

  // RC98: Asy Micro-Interaction Masterpiece (R801 - R810)
  { id: 'r809', code: 'R809', name: 'One-Hand UX Validator', icon: Smartphone, category: 'Asy Micro-Interaction Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r810', code: 'R810', name: 'RC98 Living Asy War Room', icon: Crown, category: 'Asy Micro-Interaction Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },

  // RC99: Asy Central Intelligence & Creator Ecosystem (R811 - R820)
  { id: 'r812', code: 'R812', name: 'Living Activity Center', icon: Activity, category: 'Asy Creator Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r813', code: 'R813', name: 'AI Photo Lab', icon: Sliders, category: 'Asy Creator Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r815', code: 'R815', name: 'Story Studio Express', icon: Smartphone, category: 'Asy Creator Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r816', code: 'R816', name: 'Template Hub', icon: Layers, category: 'Asy Creator Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r817', code: 'R817', name: 'Trend Intelligence', icon: TrendingUp, category: 'Asy Creator Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r818', code: 'R818', name: 'Download Center', icon: Download, category: 'Asy Creator Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r819', code: 'R819', name: 'Innovation Lab', icon: FlaskConical, category: 'Asy Creator Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r820', code: 'R820', name: 'RC99 Creator War Room', icon: Sparkles, category: 'Asy Creator Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r_rc99_suite', code: 'RC99', name: 'RC99 Creator Ecosystem Hub', icon: Crown, category: 'Asy Creator Ecosystem', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },

  // RC100: Living Digital School (R821 - R830)
  { id: 'r822', code: 'R822', name: 'Balai Kota Digital', icon: Building2, category: 'Living Digital School', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r823', code: 'R823', name: 'Kabinet Asy', icon: Sparkles, category: 'Living Digital School', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r824', code: 'R824', name: 'Kabinet Guardian', icon: ShieldCheck, category: 'Living Digital School', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r825', code: 'R825', name: 'Kabinet Hermes', icon: HardDrive, category: 'Living Digital School', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r826', code: 'R826', name: 'Studio Suara Asy', icon: Mic, category: 'Living Digital School', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r827', code: 'R827', name: 'Karakter Hidup', icon: Smile, category: 'Living Digital School', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r828', code: 'R828', name: 'Sensor Situasi', icon: Activity, category: 'Living Digital School', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r829', code: 'R829', name: 'Dewan Intelijen Asy', icon: SunMedium, category: 'Living Digital School', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r830', code: 'R830', name: 'RC100 Pusat Kendali', icon: Crown, category: 'Living Digital School', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r_rc100_suite', code: 'RC100', name: 'RC100 Living School Hub', icon: Crown, category: 'Living Digital School', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },

  // RC101: Operational Excellence (R831 - R840)
  { id: 'r831', code: 'R831', name: 'Master Character Lock', icon: Crown, category: 'Operational Excellence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r832', code: 'R832', name: 'Pusat Kegiatan TK Pro', icon: Camera, category: 'Operational Excellence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r833', code: 'R833', name: 'Photo Lab Pro+', icon: Sliders, category: 'Operational Excellence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r834', code: 'R834', name: 'Story Studio Viral 9:16', icon: Film, category: 'Operational Excellence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r835', code: 'R835', name: 'Perpustakaan Cerdas', icon: BookOpen, category: 'Operational Excellence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r836', code: 'R836', name: 'Brankas Digital Hermes', icon: FolderArchive, category: 'Operational Excellence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r837', code: 'R837', name: 'Dashboard Wali Murid', icon: Heart, category: 'Operational Excellence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r838', code: 'R838', name: 'Mode Sekolah Hidup', icon: Smile, category: 'Operational Excellence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r839', code: 'R839', name: 'Intelijen Evolusi', icon: TrendingUp, category: 'Operational Excellence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r840', code: 'R840', name: 'RC101 War Room Operasional', icon: Sparkles, category: 'Operational Excellence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r_rc101_suite', code: 'RC101', name: 'RC101 Master Command', icon: Crown, category: 'Operational Excellence', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },

  // RC102: Autonomous Reliability & Production Readiness (R841 - R850)
  { id: 'r841', code: 'R841', name: 'Task Orchestrator Nasional', icon: Server, category: 'Autonomous Reliability', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r842', code: 'R842', name: 'Smart Queue Dashboard', icon: Layers, category: 'Autonomous Reliability', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r843', code: 'R843', name: 'Pusat Otomasi Sekolah', icon: Zap, category: 'Autonomous Reliability', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r844', code: 'R844', name: 'Pemeriksa Kesehatan Harian', icon: HeartPulse, category: 'Autonomous Reliability', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r845', code: 'R845', name: 'Brankas Digital Otomatis', icon: FolderArchive, category: 'Autonomous Reliability', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r846', code: 'R846', name: 'Photo Lab Batch', icon: Sliders, category: 'Autonomous Reliability', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r847', code: 'R847', name: 'Story Studio Batch', icon: Film, category: 'Autonomous Reliability', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r848', code: 'R848', name: 'Dashboard Kepala Sekolah', icon: GraduationCap, category: 'Autonomous Reliability', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r849', code: 'R849', name: 'Guardian Stress Test', icon: ShieldAlert, category: 'Autonomous Reliability', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r850', code: 'R850', name: 'RC102 Reliability War Room', icon: Crown, category: 'Autonomous Reliability', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r_rc102_suite', code: 'RC102', name: 'RC102 Reliability Hub', icon: Crown, category: 'Autonomous Reliability', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },

  // RC103: Go-Live Governance & Operational Trust (R851 - R860)
  { id: 'r851', code: 'R851', name: 'Guardian Policy Center', icon: ShieldCheck, category: 'Go-Live Governance', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r852', code: 'R852', name: 'Audit Timeline Explorer', icon: History, category: 'Go-Live Governance', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r853', code: 'R853', name: 'School Command Center', icon: LayoutDashboard, category: 'Go-Live Governance', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r854', code: 'R854', name: 'Operational KPI Engine', icon: Target, category: 'Go-Live Governance', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r855', code: 'R855', name: 'Smart Incident Manager', icon: AlertOctagon, category: 'Go-Live Governance', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r856', code: 'R856', name: 'Founder Governance Console', icon: Crown, category: 'Go-Live Governance', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r857', code: 'R857', name: 'Compliance Readiness Center', icon: Award, category: 'Go-Live Governance', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r858', code: 'R858', name: 'Offline Sync Assurance', icon: Layers, category: 'Go-Live Governance', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r859', code: 'R859', name: 'Living Performance Profiler', icon: Gauge, category: 'Go-Live Governance', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r860', code: 'R860', name: 'RC103 Governance War Room', icon: Crown, category: 'Go-Live Governance', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r_rc103_suite', code: 'RC103', name: 'RC103 Governance Hub', icon: Crown, category: 'Go-Live Governance', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },

  // RC104: Business Continuity & Operational Intelligence (R861 - R870)
  { id: 'r861', code: 'R861', name: 'Continuity Command Engine', icon: Activity, category: 'Business Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r862', code: 'R862', name: 'Predictive Health Intelligence', icon: Eye, category: 'Business Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r863', code: 'R863', name: 'Guardian Risk Observatory', icon: ShieldAlert, category: 'Business Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r864', code: 'R864', name: 'Smart Recovery Coordinator', icon: LifeBuoy, category: 'Business Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'r865', code: 'R865', name: 'School Operations Timeline', icon: Calendar, category: 'Business Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN', 'GURU'] },
  { id: 'r866', code: 'R866', name: 'Executive Decision Center', icon: Briefcase, category: 'Business Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r867', code: 'R867', name: 'Capacity Forecast Engine', icon: Database, category: 'Business Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r868', code: 'R868', name: 'Offline Mission Control', icon: WifiOff, category: 'Business Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r869', code: 'R869', name: 'Founder Intelligence Briefing', icon: Sparkles, category: 'Business Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r870', code: 'R870', name: 'RC104 Continuity War Room', icon: Crown, category: 'Business Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r_rc104_suite', code: 'RC104', name: 'RC104 Continuity Hub', icon: Crown, category: 'Business Continuity', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },

  // GLC-1: Production Certification & Go-Live Candidate (G901 - G910)
  { id: 'g901', code: 'G901', name: 'Functional Validation', icon: ShieldCheck, category: 'Production Go-Live', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'g902', code: 'G902', name: 'Guardian Security Validation', icon: Lock, category: 'Production Go-Live', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'g903', code: 'G903', name: 'Performance Certification', icon: Gauge, category: 'Production Go-Live', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'g904', code: 'G904', name: 'Offline & Sync Certification', icon: WifiOff, category: 'Production Go-Live', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'g905', code: 'G905', name: 'Hermes Recovery Certification', icon: Activity, category: 'Production Go-Live', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH'] },
  { id: 'g906', code: 'G906', name: 'Mobile Production Certification', icon: Smartphone, category: 'Production Go-Live', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'g907', code: 'G907', name: 'Founder Acceptance Suite', icon: Crown, category: 'Production Go-Live', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'g908', code: 'G908', name: 'Documentation & SOP', icon: BookOpen, category: 'Production Go-Live', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'g909', code: 'G909', name: 'Production Deployment Package', icon: Package, category: 'Production Go-Live', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'g910', code: 'G910', name: 'Go-Live Control Tower', icon: Rocket, category: 'Production Go-Live', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r_glc1_suite', code: 'GLC-1', name: 'Go-Live Control Tower', icon: Rocket, category: 'Production Go-Live', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },

  // MCA-1: Master Character Canon (Asy & Syifa)
  { id: 'mca1', code: 'MCA-1', name: 'Master Character Canon', icon: Sparkles, category: 'Master Mascot', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },
  { id: 'r_mca1_suite', code: 'MCA1', name: 'Master Character Canon', icon: Sparkles, category: 'Master Mascot', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'WALI_MURID'] },

  // SPRINT G3: Founder Office Phase-1 & Sovereign Tools
  { id: 'r_founder_office', code: 'G3-FO', name: 'Founder Office Phase-1 Cockpit', icon: Crown, category: 'Founder Office (G3)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN'] },
  { id: 'r_media_commander', code: 'R94', name: 'Smart Media Commander & Pipeline', icon: Upload, category: 'Founder Office (G3)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r_creative_studio', code: 'G3-CS', name: 'Creative Studio (Poster & Banner Factory)', icon: Palette, category: 'Founder Office (G3)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN', 'KEPALA_SEKOLAH', 'GURU'] },
  { id: 'r_tib_labs', code: 'TIB', name: 'TIB 7 Sandbox Innovation Labs', icon: Cpu, category: 'Founder Office (G3)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'ADMIN'] },
  { id: 'r_cabinet_tracker', code: 'G3-CR', name: 'Cabinet Resolution Tracker', icon: Award, category: 'Founder Office (G3)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'ADMIN'] },
  { id: 'r_command_recorder', code: 'G3-CRD', name: 'Founder Command Recorder Audit', icon: Terminal, category: 'Founder Office (G3)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN'] },

  // SPRINT G10: Alumni Universe & Taman Kenangan
  { id: 'r_alumni_universe', code: 'G10-AU', name: 'Alumni Universe & Taman Kenangan', icon: Trees, category: 'Alumni Universe (G10)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'WALI_MURID', 'ALUMNI_FAMILY'] },

  // SPRINT G13: Pusat Aset TADE
  { id: 'r_asset_center', code: 'G13-PA', name: 'Pusat Aset TK Asy Syifa', icon: FolderArchive, category: 'Pusat Aset (G13)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'BENDAHARA', 'OPERATOR', 'WALI_MURID'] },
  { id: 'r_asset_posters', code: 'G13-POS', name: 'Tempat Poster Siap Pakai', icon: Palette, category: 'Pusat Aset (G13)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r_asset_certs', code: 'G13-CRT', name: 'Tempat Sertifikat & Ijazah', icon: Award, category: 'Pusat Aset (G13)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN'] },
  { id: 'r_asset_toys', code: 'G13-TOY', name: 'Kotak Mainan Asy (Animasi)', icon: Sparkles, category: 'Pusat Aset (G13)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'WALI_MURID'] },
  { id: 'r_asset_sounds', code: 'G13-SND', name: 'Tempat Suara Alami', icon: Radio, category: 'Pusat Aset (G13)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'WALI_MURID'] },

  // SPRINT G20: Pusat DNA Animasi & Suara Asy Syifa
  { id: 'r_dna_center', code: 'G20-DNA', name: 'Pusat DNA Animasi & Suara', icon: Sparkles, category: 'DNA & Maskot (G20-G27)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'BENDAHARA', 'OPERATOR', 'WALI_MURID'] },

  // SPRINT G21: Studio Kamera Ajaib Asy & Syifa
  { id: 'r_camera_studio', code: 'G21-CAM', name: 'Studio Kamera Ajaib', icon: Film, category: 'DNA & Maskot (G20-G27)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'BENDAHARA', 'OPERATOR', 'WALI_MURID'] },

  // SPRINT G22: Sutradara Ajaib Asy & Syifa
  { id: 'r_director_hub', code: 'G22-DIR', name: 'Sutradara Ajaib Asy & Syifa', icon: Clapperboard, category: 'DNA & Maskot (G20-G27)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'BENDAHARA', 'OPERATOR', 'WALI_MURID'] },

  // SPRINT G23: Kota Mini Profesi Asy
  { id: 'r_city_hub', code: 'G23-KOTA', name: 'Kota Mini Profesi Asy', icon: Building2, category: 'DNA & Maskot (G20-G27)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'BENDAHARA', 'OPERATOR', 'WALI_MURID'] },

  // SPRINT G24: Rumah Kreatif Asy
  { id: 'r_creative_house', code: 'G24-RKA', name: 'Rumah Kreatif Asy & Syifa', icon: Palette, category: 'DNA & Maskot (G20-G27)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'BENDAHARA', 'OPERATOR', 'WALI_MURID'] },

  // SPRINT G25: Hari Besar Otomatis & Langit Hidup
  { id: 'r_auto_events', code: 'G25-HARI', name: 'Hari Besar Otomatis & Langit Hidup', icon: Sun, category: 'DNA & Maskot (G20-G27)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'BENDAHARA', 'OPERATOR', 'WALI_MURID'] },

  // SPRINT G26: Bioskop Langit Asy & Syifa
  { id: 'r_bioskop_langit', code: 'G26-BIOSKOP', name: 'Bioskop Langit Asy & Syifa', icon: Moon, category: 'DNA & Maskot (G20-G27)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'BENDAHARA', 'OPERATOR', 'WALI_MURID'] },

  // SPRINT G27: Kapal Awan & Pulau Petualangan
  { id: 'r_kapal_awan', code: 'G27-KAPAL', name: 'Kapal Awan & Pulau Petualangan', icon: Ship, category: 'DNA & Maskot (G20-G27)', allowedRoles: ['SUPER_ADMIN', 'KETUA_YAYASAN', 'KEPALA_SEKOLAH', 'GURU', 'ADMIN', 'BENDAHARA', 'OPERATOR', 'WALI_MURID'] }
];

export const SIMLayout: React.FC<Props> = ({ activeModule, onSelectModule, children }) => {
  const { activeRole, userProfile, logout, currentUser, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showCommandCenter, setShowCommandCenter] = useState(false);
  const [showFounderPalette, setShowFounderPalette] = useState(false);
  const [systemInitialized, setSystemInitialized] = useState<boolean>(true);
  const [checkingInit, setCheckingInit] = useState<boolean>(true);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const [ppdbConfig, setPpdbConfig] = useState<PPDBLifecycleConfig | null>(null);
  const [isSeniorMode, setIsSeniorMode] = useState<boolean>(() => {
    return localStorage.getItem('senior_mode_enabled') === 'true';
  });

  // Global Keyboard Shortcut: CTRL+K / CMD+K to open Founder Command Palette
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowFounderPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const toggleSeniorMode = () => {
    const next = !isSeniorMode;
    setIsSeniorMode(next);
    localStorage.setItem('senior_mode_enabled', next ? 'true' : 'false');
  };

  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsub = DataService.subscribeNotifications(currentUser.uid, userProfile?.role, (list) => {
      setUnreadNotifCount(list.filter(n => !n.isRead).length);
    });
    return () => unsub();
  }, [currentUser?.uid, userProfile?.role]);

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const isInit = await DataService.isSystemInitialized();
        setSystemInitialized(isInit);
      } catch (e) {
        console.error('Error checking system initialization:', e);
      } finally {
        setCheckingInit(false);
      }
    };
    checkSetup();

    DataService.getPPDBLifecycleConfig()
      .then((cfg) => setPpdbConfig(cfg))
      .catch((err) => console.warn('Could not fetch PPDB lifecycle in SIMLayout:', err));
  }, []);

  // First Setup required handling
  if (!checkingInit && !systemInitialized) {
    if (userProfile?.role === 'SUPER_ADMIN') {
      return <FirstSetupWizard onComplete={() => setSystemInitialized(true)} />;
    }
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-stone-200 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">First Setup Belum Selesai</h2>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900 font-bold text-xs">
            Aplikasi belum dikonfigurasi melalui First Setup Production.
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Hanya <strong>Super Admin</strong> yang diizinkan melakukan konfigurasi First Setup pertama kali. Silakan login menggunakan akun Super Admin.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" /> Login Super Admin
          </button>
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultMode="login" />
        </div>
      </div>
    );
  }

  // Auth Loading State during initial page reload
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-300">Memuat Sistem Informasi...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated Login Gate for Web App
  if (!currentUser || !userProfile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-stone-200 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Portal SIM Asy-Syifa</h2>
            <p className="text-xs text-stone-500 mt-1 font-medium">Sistem Informasi Manajemen & Ekosistem Digital Terpadu</p>
          </div>
          <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-emerald-900 font-semibold text-xs">
            Silakan masuk untuk mengakses sistem administrasi, kurikulum, keuangan, dan layanan sekolah.
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" /> Masuk ke Sistem (Login)
          </button>
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultMode="login" onTabChange={onSelectModule} />
        </div>
      </div>
    );
  }

  // Pending Screen for unapproved accounts
  if (userProfile && userProfile.status !== 'active') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-stone-200 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Menunggu Persetujuan</h2>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900 font-bold text-sm">
            "Akun sedang menunggu persetujuan Administrator."
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Pendaftaran akun atas nama <strong>{userProfile.nama || userProfile.name}</strong> ({userProfile.role}) telah tersimpan. Mohon hubungi Administrator / Super Admin TK Asy Syifa Tanggul untuk aktivasi akun.
          </p>
          <button
            onClick={logout}
            className="w-full py-3 bg-rose-800 hover:bg-rose-900 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Keluar / Ganti Akun
          </button>
        </div>
      </div>
    );
  }

  // Module RBAC Route Protection Check
  const currentModObj = MODULE_TABS.find(m => m.id === activeModule) || MODULE_TABS[0];
  const isAllowedForRole = currentModObj.allowedRoles.includes(activeRole);

  // Filter modules by role & search
  let visibleModules = MODULE_TABS.filter((m) => {
    const roleAllowed = m.allowedRoles.includes(activeRole);
    const searchMatches = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.code.toLowerCase().includes(searchQuery.toLowerCase());
    if (!roleAllowed || !searchMatches) return false;

    // PPDB Lifecycle Visibility Rule:
    // If PPDB is inactive or hidden from menu, non-operational roles don't see R13 in sidebar
    if (m.id === 'r13' && ppdbConfig) {
      const isOpsManager = ['ADMIN', 'SUPER_ADMIN', 'KEPALA_SEKOLAH'].includes(activeRole);
      if (!isOpsManager && (!ppdbConfig.showMenuInSIM || !ppdbConfig.isActive)) {
        return false;
      }
    }

    return true;
  });

  // Senior Teacher Mode Constraint: Max 6 simplified core menus
  if (isSeniorMode) {
    const seniorMenuIds = ['r1', 'r6', 'r8', 'r9', 'r17', 'r33'];
    visibleModules = visibleModules.filter(m => seniorMenuIds.includes(m.id));
  }

  const categories = Array.from(new Set(visibleModules.map(m => m.category)));

  return (
    <div className={`min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/25 to-amber-50/20 flex flex-col md:flex-row ${isSeniorMode ? 'text-base' : 'text-xs'}`}>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white p-3.5 flex items-center justify-between border-b border-slate-800 sticky top-[37px] z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-800 text-slate-200"
          >
            <Menu className="w-6 h-6" />
          </button>
          <NotificationBellButton
            variant="dark"
            onClick={() => setShowNotificationCenter(true)}
          />
        </div>
        <span className="font-bold text-sm text-emerald-400 truncate max-w-[160px]">
          {currentModObj.code}: {currentModObj.name}
        </span>
        <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded font-mono">
          {activeRole}
        </span>
      </div>

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 ${isSeniorMode ? 'w-80' : 'w-72'} bg-slate-900 text-slate-300 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-0 flex flex-col justify-between border-r border-slate-800 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className={`font-extrabold text-white tracking-tight flex items-center gap-2 ${isSeniorMode ? 'text-lg' : 'text-sm'}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                TK ASY SYIFA
              </h2>
              <p className="text-[10px] text-emerald-300 font-medium mt-0.5">
                Taman Belajar Digital • {activeRole}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <NotificationBellButton
                variant="dark"
                onClick={() => setShowNotificationCenter(true)}
              />
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-slate-400 hover:text-white p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mode Guru Senior Toggle Banner */}
          <div className="px-3 py-2 border-b border-slate-800">
            <button
              onClick={toggleSeniorMode}
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                isSeniorMode
                  ? 'bg-amber-950/80 border-amber-600 text-amber-200 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className={`w-4 h-4 ${isSeniorMode ? 'text-amber-400 animate-bounce' : 'text-emerald-400'}`} />
                <span className={isSeniorMode ? 'text-xs font-bold' : 'text-[11px] font-semibold'}>
                  {isSeniorMode ? 'Mode Guru Senior (Aktif)' : 'Aktifkan Mode Guru Senior'}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                isSeniorMode ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'
              }`}>
                {isSeniorMode ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          {/* User Profile Summary */}
          {userProfile ? (
            <div className="p-3 bg-slate-800/80 mx-3 my-2 rounded-xl border border-slate-700/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 overflow-hidden text-xs">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">
                  {(userProfile.nama || userProfile.name || 'U').charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-white truncate text-[11px]">{userProfile.nama || userProfile.name}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold truncate">{userProfile.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onSelectModule('r15')}
                  title="Pusat Notifikasi"
                  className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 transition relative cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-extrabold text-[9px] flex items-center justify-center animate-pulse">
                      {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={logout}
                  title="Keluar Akun"
                  className="p-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-300 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-950/60 mx-3 my-2 rounded-xl border border-emerald-800/80 text-center space-y-2">
              <p className="text-[11px] font-bold text-emerald-300">Akses Portal SIM</p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" /> Masuk / Daftar
              </button>
            </div>
          )}

          {/* Module Search Bar & Command Center Button */}
          <div className="px-3 py-2 space-y-1.5">
            <button
              onClick={() => setShowCommandCenter(true)}
              className="w-full py-2 px-3 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 rounded-xl text-emerald-200 text-xs font-bold transition flex items-center justify-between cursor-pointer shadow-xs group"
              title="Universal Search & Command Center (CTRL+K)"
            >
              <div className="flex items-center gap-2">
                <Command className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition" />
                <span>Command Center</span>
              </div>
              <span className="text-[10px] bg-emerald-900 text-emerald-300 font-mono px-1.5 py-0.5 rounded border border-emerald-700 font-extrabold">
                Ctrl+K
              </span>
            </button>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter menu sidebar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Module Links List */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 text-xs">
            {categories.map((cat) => {
              const catMods = visibleModules.filter(m => m.category === cat);
              if (catMods.length === 0) return null;
              return (
                <div key={cat} className="space-y-1">
                  <span className="px-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    {cat}
                  </span>
                  {catMods.map((m) => {
                    const Icon = m.icon;
                    const isActive = activeModule === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          onSelectModule(m.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg font-medium transition flex items-center justify-between cursor-pointer ${
                          isActive
                            ? 'bg-emerald-600 text-white font-bold shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                          <span className="truncate">
                            <strong className="mr-1 text-[11px] opacity-80">{m.code}:</strong> {m.name}
                          </span>
                          {m.id === 'r13' && ppdbConfig && !ppdbConfig.isActive && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-stone-700 text-stone-300 shrink-0">
                              Tutup
                            </span>
                          )}
                        </div>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Production Auth</span>
            <span className="text-emerald-400 font-mono">FIREBASE</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full relative">
        <LicenseWatermark />
        <SafeModeNotice onOpenLicenseCenter={() => onSelectModule('r56')} />
        {!isAllowedForRole ? (
          <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-lg text-center space-y-4 my-12 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Akses Modul Dibatasi (RBAC Protected)</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Role Anda (<strong>{activeRole}</strong>) tidak memiliki kewenangan untuk mengakses modul <strong>{currentModObj.code} - {currentModObj.name}</strong>.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => onSelectModule('r1')}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Kembali ke Dashboard Utama (R1)
              </button>
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      {/* Floating AI Companion Trigger (Always visible in Senior Mode / Accessible anytime) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => onSelectModule('r33')}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-3 rounded-2xl shadow-2xl border-2 border-emerald-400 flex items-center gap-2.5 transition transform hover:scale-105 cursor-pointer"
          title="Tanya Asisten AI Cerdas Sekolah"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-extrabold text-sm shadow-xs">
            <Sparkles className="w-5 h-5 text-slate-900 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-extrabold leading-none">Asisten AI Sekolah</p>
            <p className="text-[10px] text-emerald-200 mt-0.5">Tanya Dokumen & Governance</p>
          </div>
        </button>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
        onTabChange={onSelectModule}
      />

      <CommandCenterModal
        isOpen={showCommandCenter}
        onClose={() => setShowCommandCenter(false)}
        onSelectModule={onSelectModule}
      />

      <FounderCommandPaletteModal
        isOpen={showFounderPalette}
        onClose={() => setShowFounderPalette(false)}
        onSelectTab={onSelectModule}
        userRole={activeRole}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        onSelectTab={onSelectModule}
      />

      {/* R782: Living 3D Asy Dock Assistant Widget */}
      <AsyDockAssistantWidget />
    </div>
  );
};
