import React, { useState, useEffect } from 'react';
import {
  Crown,
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  Terminal,
  Activity,
  Upload,
  Cpu,
  Bookmark,
  Save,
  RotateCcw,
  SlidersHorizontal,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Search,
  Command,
  Star,
  Columns,
  X,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { FounderDailyBrief } from './FounderDailyBrief';
import { FounderMissionQueue } from './FounderMissionQueue';
import { FounderReadinessScore } from './FounderReadinessScore';
import { AsySyifaExecutiveCompanion } from './AsySyifaExecutiveCompanion';
import { CabinetResolutionTracker } from './CabinetResolutionTracker';
import { FounderCommandRecorderViewer } from './FounderCommandRecorderViewer';
import { SmartUploadCommander } from '../media/SmartUploadCommander';
import { CreativeStudioFactory } from '../creative/CreativeStudioFactory';
import { TIBFoundation } from '../tib/TIBFoundation';
import { DrPulseHealthPassport } from './DrPulseHealthPassport';
import { HermesRecoveryCenter } from './HermesRecoveryCenter';
import { SovereignEngineRegistryViewer } from './SovereignEngineRegistryViewer';
import { LivingSchoolUniverseHub } from '../living/LivingSchoolUniverseHub';
import { MasterVisibilityCenter } from './MasterVisibilityCenter';
import { FeatureRolloutCenter } from './FeatureRolloutCenter';
import { LivingMessengerV2 } from '../living/LivingMessengerV2';
import { ParentCommunityHub } from '../parent/ParentCommunityHub';
import { LivingMicroInteractionsDemo } from '../living/LivingMicroInteractionsDemo';
import { SchoolCloneKitWizard } from './SchoolCloneKitWizard';
import { LivingMemoryTimeline } from '../living/LivingMemoryTimeline';
import { GoLiveCommandCenter } from './GoLiveCommandCenter';
import { RoleValidationMatrix } from './RoleValidationMatrix';
import { SmartPPDBFinalization } from '../sim/SmartPPDBFinalization';
import { GoLiveMonitor } from './GoLiveMonitor';
import { TrainingModeSimulator } from './TrainingModeSimulator';
import { GoLiveChecklistCenter } from './GoLiveChecklistCenter';
import { BlackBoxRecorderHub } from './BlackBoxRecorderHub';
import { TimeLensReconstructor } from './TimeLensReconstructor';
import { LiveUXAuditCenter } from './LiveUXAuditCenter';
import { SmartIncidentCenter } from './SmartIncidentCenter';
import { PerformanceStabilizerCenter } from './PerformanceStabilizerCenter';
import { FounderLiveStatusPanel } from './FounderLiveStatusPanel';
import { FounderPresenceSequence } from './FounderPresenceSequence';
import { CabinetMeetingModal } from './CabinetMeetingModal';
import { AutonomousVoiceCommander } from './AutonomousVoiceCommander';
import { FounderQuickActions } from './FounderQuickActions';
import { ProactiveSuggestionsWidget } from './ProactiveSuggestionsWidget';
import {
  founderWorkspaceMemory,
  FounderWorkspaceMemoryState,
  FounderWidgetPosition
} from '../../services/founderWorkspaceMemory';
import { founderCommandRecorder } from '../../services/founderCommandRecorder';

import { PusatAsetTADE } from '../assets/PusatAsetTADE';
import { RumahAsySyifaHub } from '../garden/RumahAsySyifaHub';
import { DuniaAsyLivingEnvironment } from '../garden/DuniaAsyLivingEnvironment';
import { KampungCeriaHub } from '../garden/KampungCeriaHub';
import { FestivalCeriaHub } from '../garden/FestivalCeriaHub';
import { EpisodeInteraktifHub } from '../garden/EpisodeInteraktifHub';
import { Tv, Map, PartyPopper, BookOpen } from 'lucide-react';

interface Props {
  onSelectModule?: (moduleId: string) => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  action: () => void;
  shortcut?: string;
}

export const FounderOfficeDashboard: React.FC<Props> = ({ onSelectModule }) => {
  const [memoryState, setMemoryState] = useState<FounderWorkspaceMemoryState>(
    founderWorkspaceMemory.load()
  );
  const [activeSection, setActiveSection] = useState<string>('COCKPIT');
  const [splitSecondarySection, setSplitSecondarySection] = useState<string>('PASSPORT');
  const [isSplitView, setIsSplitView] = useState<boolean>(false);
  const [notes, setNotes] = useState(memoryState.notes || '');
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showAwakeningSequence, setShowAwakeningSequence] = useState<boolean>(true);
  const [showCabinetMeeting, setShowCabinetMeeting] = useState<boolean>(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const mem = founderWorkspaceMemory.load();
    setMemoryState(mem);
    setNotes(mem.notes || '');
    setIsSplitView(mem.splitViewEnabled || false);
    setSplitSecondarySection(mem.splitViewSecondaryTab || 'PASSPORT');
  }, []);

  const handleSmartNavigation = (routeId: string) => {
    // Map of recognized routes
    const internalSectionMap: Record<string, string> = {
      'r_smart_ppdb': 'SMART_PPDB',
      'r_role_matrix': 'ROLE_MATRIX',
      'r_pulse_passport': 'PASSPORT',
      'r_blackbox_recorder': 'BLACK_BOX',
      'r_time_lens': 'TIME_LENS',
      'r_creative_studio': 'CREATIVE',
      'r_media_commander': 'MEDIA',
      'r_hermes_recovery': 'RECOVERY',
      'r_messenger': 'LIVING_MESSENGER',
      'r_founder_office': 'COCKPIT'
    };

    if (routeId === 'CABINET_MEETING_TRIGGER') {
      setShowCabinetMeeting(true);
      return;
    }

    if (internalSectionMap[routeId]) {
      setActiveSection(internalSectionMap[routeId]);
    } else if (onSelectModule) {
      onSelectModule(routeId);
    }
  };

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      } else if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveNotes = () => {
    founderWorkspaceMemory.save({ notes });
    founderCommandRecorder.recordCommand(
      'CONFIG_UPDATE',
      'Founder Workspace Memory',
      'Founder memperbarui catatan strategis workspace.'
    );
    setFeedback('Catatan strategis berhasil disimpan ke Workspace Memory.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleFavorite = (secId: string) => {
    const updated = founderWorkspaceMemory.toggleFavorite(secId);
    setMemoryState(founderWorkspaceMemory.load());
    setFeedback(`Favorit ${secId} diperbarui.`);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleToggleSplitView = () => {
    const next = !isSplitView;
    setIsSplitView(next);
    founderWorkspaceMemory.setSplitView(next, splitSecondarySection);
  };

  const handleToggleWidget = (id: string) => {
    const updated = memoryState.widgetPositions.map(w =>
      w.id === id ? { ...w, visible: !w.visible } : w
    );
    const newMem = founderWorkspaceMemory.save({ widgetPositions: updated });
    setMemoryState(newMem);
  };

  const handleMoveWidget = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= memoryState.widgetPositions.length) return;

    const list = [...memoryState.widgetPositions];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const reordered = list.map((w, idx) => ({ ...w, order: idx }));
    const newMem = founderWorkspaceMemory.save({ widgetPositions: reordered });
    setMemoryState(newMem);
  };

  const isVisible = (widgetId: string) => {
    const w = memoryState.widgetPositions.find(x => x.id === widgetId);
    return w ? w.visible : true;
  };

  const SECTIONS = [
    { id: 'COCKPIT', label: 'Cockpit Utama', icon: Crown },
    { id: 'BLACK_BOX', label: 'Black Box (G9 P1)', icon: Terminal },
    { id: 'TIME_LENS', label: 'Time Lens (G9 P2)', icon: Activity },
    { id: 'UX_AUDIT', label: 'Live UX Audit (G9 P3)', icon: ShieldCheck },
    { id: 'SMART_INCIDENT', label: 'Smart Incident (G9 P4)', icon: AlertCircle },
    { id: 'PERF_STABILIZER', label: 'Performance (G9 P5)', icon: Activity },
    { id: 'GO_LIVE_COMMAND', label: 'Go-Live Command (G8 P1)', icon: Crown },
    { id: 'ROLE_MATRIX', label: 'Role Matrix (G8 P2)', icon: ShieldCheck },
    { id: 'SMART_PPDB', label: 'Smart PPDB (G8 P3)', icon: Award },
    { id: 'GO_LIVE_MONITOR', label: 'Live Monitor (G8 P5)', icon: Activity },
    { id: 'TRAINING_MODE', label: 'Training Mode (G8 P6)', icon: Sparkles },
    { id: 'GO_LIVE_CHECKLIST', label: 'Launch Checklist (G8 P7)', icon: CheckCircle2 },
    { id: 'MASTER_VISIBILITY', label: 'Master Visibility (G7)', icon: Eye },
    { id: 'FEATURE_ROLLOUT', label: 'Feature Rollout (G7)', icon: SlidersHorizontal },
    { id: 'LIVING_MESSENGER', label: 'Living Messenger (G7)', icon: Sparkles },
    { id: 'PARENT_COMMUNITY', label: 'Parent Community (G7)', icon: Award },
    { id: 'MICRO_INTERACTIONS', label: 'Micro Interactions (G7)', icon: Activity },
    { id: 'SCHOOL_CLONE', label: 'School Clone Kit (G7)', icon: Layers },
    { id: 'LIVING_MEMORY', label: 'Living Memory (G7)', icon: Sparkles },
    { id: 'LIVING_UNIVERSE', label: 'Living Universe (G6)', icon: Sparkles },
    { id: 'ENGINES', label: 'Sovereign Engines', icon: Cpu },
    { id: 'PASSPORT', label: 'Health Passport', icon: Activity },
    { id: 'RECOVERY', label: 'Hermes Recovery', icon: RotateCcw },
    { id: 'MEDIA', label: 'Smart Media', icon: Upload },
    { id: 'CREATIVE', label: 'Creative Studio', icon: Layers },
    { id: 'TIB', label: 'TIB 7 Labs', icon: Sparkles },
    { id: 'RESOLUTIONS', label: 'Resolusi Kabinet', icon: Award },
    { id: 'RECORDER', label: 'Audit Perintah', icon: Terminal },
    { id: 'PUSAT_ASET', label: 'Pusat Aset TADE (G13)', icon: Sparkles },
    { id: 'TV_ASY_SYIFA', label: 'TV Asy Syifa (G15)', icon: Tv },
    { id: 'DUNIA_ASY_HIDUP', label: 'Dunia Asy Hidup (G16)', icon: Sparkles },
    { id: 'KAMPUNG_CERIA', label: 'Kampung Ceria (G17)', icon: Map },
    { id: 'FESTIVAL_CERIA', label: 'Festival Ceria (G18)', icon: PartyPopper },
    { id: 'EPISODE_INTERAKTIF', label: 'Episode Interaktif (G19)', icon: BookOpen }
  ];

  const commandItems: CommandItem[] = [
    { id: 'cmd-episodeinteraktif', title: 'Buka Episode Interaktif Asy & Syifa — Cerita Pagi, Pilihan 2 Arah, Sahabat, Buku Cerita (G19 P1–P7)', category: 'Episode Interaktif', action: () => { setActiveSection('EPISODE_INTERAKTIF'); setShowCommandPalette(false); } },
    { id: 'cmd-festivalceria', title: 'Buka Festival Ceria Asy & Syifa — Panggung, Karnaval 20s, Balon Harapan, Stan Ceria (G18 P1–P7)', category: 'Festival Ceria', action: () => { setActiveSection('FESTIVAL_CERIA'); setShowCommandPalette(false); } },
    { id: 'cmd-kampungceria', title: 'Buka Kampung Ceria Asy & Syifa — Peta 3D, Parade 15s & Stiker (G17 P1–P7)', category: 'Kampung Ceria', action: () => { setActiveSection('KAMPUNG_CERIA'); setShowCommandPalette(false); } },
    { id: 'cmd-duniaasy', title: 'Buka Dunia Asy yang Hidup — Waktu, Cuaca & Pohon Musim (G16 P1–P7)', category: 'Dunia Hidup', action: () => { setActiveSection('DUNIA_ASY_HIDUP'); setShowCommandPalette(false); } },
    { id: 'cmd-tvasysyifa', title: 'Buka TV Asy Syifa & Rumah Asy Syifa (G15 P1–P7)', category: 'TV & Cerita', action: () => { setActiveSection('TV_ASY_SYIFA'); setShowCommandPalette(false); } },
    { id: 'cmd-pusataset', title: 'Buka Pusat Aset TADE (Poster, Sertifikat, Mainan Asy, Suara)', category: 'Pusat Aset', action: () => { setActiveSection('PUSAT_ASET'); setShowCommandPalette(false); } },
    { id: 'cmd-cabinet-meeting', title: 'Jalankan Sidang Kilat Kabinet 30 Detik (G12)', category: 'Kabinet', action: () => { setShowCabinetMeeting(true); setShowCommandPalette(false); } },
    { id: 'cmd-awakening', title: 'Putar Ulang Emerald Sovereign Awakening (G12 P1)', category: 'Awakening', action: () => { setShowAwakeningSequence(true); setShowCommandPalette(false); } },
    { id: 'cmd-voice', title: 'Buka Voice Commander Asy & Syifa (G12 P3)', category: 'Suara', action: () => { setActiveSection('COCKPIT'); setShowCommandPalette(false); } },
    { id: 'cmd-blackbox', title: 'Buka TADE Black Box Telemetry Recorder (G9 P1)', category: 'Telemetri', action: () => { setActiveSection('BLACK_BOX'); setShowCommandPalette(false); } },
    { id: 'cmd-timelens', title: 'Buka TADE Time Lens State Reconstructor (G9 P2)', category: 'Historis', action: () => { setActiveSection('TIME_LENS'); setShowCommandPalette(false); } },
    { id: 'cmd-uxaudit', title: 'Buka Live User Experience Audit Center (G9 P3)', category: 'UX Audit', action: () => { setActiveSection('UX_AUDIT'); setShowCommandPalette(false); } },
    { id: 'cmd-smartincident', title: 'Buka Smart Incident Radar & Auto-Healing (G9 P4)', category: 'Insiden', action: () => { setActiveSection('SMART_INCIDENT'); setShowCommandPalette(false); } },
    { id: 'cmd-perfstabilizer', title: 'Buka Performance Stabilization & 60 FPS Engine (G9 P5)', category: 'Performa', action: () => { setActiveSection('PERF_STABILIZER'); setShowCommandPalette(false); } },
    { id: 'cmd-golive', title: 'Buka Founder Go-Live Command Center (G8 P1)', category: 'Go-Live', action: () => { setActiveSection('GO_LIVE_COMMAND'); setShowCommandPalette(false); } },
    { id: 'cmd-rolematrix', title: 'Buka Role Validation Matrix & RBAC (G8 P2)', category: 'Keamanan', action: () => { setActiveSection('ROLE_MATRIX'); setShowCommandPalette(false); } },
    { id: 'cmd-smartppdb', title: 'Buka Smart PPDB Finalization & Approval (G8 P3)', category: 'Kesiswaan', action: () => { setActiveSection('SMART_PPDB'); setShowCommandPalette(false); } },
    { id: 'cmd-golivemonitor', title: 'Buka Dr. Pulse Go-Live Realtime Monitor (G8 P5)', category: 'Diagnostik', action: () => { setActiveSection('GO_LIVE_MONITOR'); setShowCommandPalette(false); } },
    { id: 'cmd-trainingmode', title: 'Buka Sovereign Training Mode Simulator (G8 P6)', category: 'Pelatihan', action: () => { setActiveSection('TRAINING_MODE'); setShowCommandPalette(false); } },
    { id: 'cmd-golivechecklist', title: 'Buka Go-Live 10-Pillar Readiness Checklist (G8 P7)', category: 'Go-Live', action: () => { setActiveSection('GO_LIVE_CHECKLIST'); setShowCommandPalette(false); } },
    { id: 'cmd-cockpit', title: 'Buka Founder Cockpit Utama', category: 'Navigasi', action: () => { setActiveSection('COCKPIT'); setShowCommandPalette(false); } },
    { id: 'cmd-visibility', title: 'Buka Master Visibility Center (Sprint G7 P1)', category: 'Tata Kelola', action: () => { setActiveSection('MASTER_VISIBILITY'); setShowCommandPalette(false); } },
    { id: 'cmd-rollout', title: 'Buka Feature Rollout Center (Sprint G7 P2)', category: 'Rilis Bertahap', action: () => { setActiveSection('FEATURE_ROLLOUT'); setShowCommandPalette(false); } },
    { id: 'cmd-messenger', title: 'Buka Living Messenger Enterprise (Sprint G7 P3)', category: 'Komunikasi', action: () => { setActiveSection('LIVING_MESSENGER'); setShowCommandPalette(false); } },
    { id: 'cmd-community', title: 'Buka Parent Community Hub (Sprint G7 P4)', category: 'Wali Murid', action: () => { setActiveSection('PARENT_COMMUNITY'); setShowCommandPalette(false); } },
    { id: 'cmd-micro', title: 'Buka Living Micro Interaction Engine Demo (P5)', category: 'Interaksi', action: () => { setActiveSection('MICRO_INTERACTIONS'); setShowCommandPalette(false); } },
    { id: 'cmd-clone', title: 'Buka Sovereign School Clone Kit Wizard (P6)', category: 'Multi-Sekolah', action: () => { setActiveSection('SCHOOL_CLONE'); setShowCommandPalette(false); } },
    { id: 'cmd-memory', title: 'Buka Living Memory Engine & Capsule (P7)', category: 'Memori', action: () => { setActiveSection('LIVING_MEMORY'); setShowCommandPalette(false); } },
    { id: 'cmd-universe', title: 'Buka Living School Universe Console (Sprint G6)', category: 'Living Ecosystem', action: () => { setActiveSection('LIVING_UNIVERSE'); setShowCommandPalette(false); } },
    { id: 'cmd-engines', title: 'Buka Sovereign Engine Registry', category: 'Kedaulatan', action: () => { setActiveSection('ENGINES'); setShowCommandPalette(false); } },
    { id: 'cmd-passport', title: 'Inspeksi Dr. Pulse Health Passport', category: 'Diagnostik', action: () => { setActiveSection('PASSPORT'); setShowCommandPalette(false); } },
    { id: 'cmd-recovery', title: 'Buka Hermes Disaster Recovery Center', category: 'Integritas', action: () => { setActiveSection('RECOVERY'); setShowCommandPalette(false); } },
    { id: 'cmd-media', title: 'Buka Smart Media Pipeline & Upload Commander', category: 'Media', action: () => { setActiveSection('MEDIA'); setShowCommandPalette(false); } },
    { id: 'cmd-creative', title: 'Buka Creative Studio Factory Poster & Banner', category: 'Kreatif', action: () => { setActiveSection('CREATIVE'); setShowCommandPalette(false); } },
    { id: 'cmd-tib', title: 'Akses TIB Technological Innovation 7 Labs', category: 'Inovasi', action: () => { setActiveSection('TIB'); setShowCommandPalette(false); } },
    { id: 'cmd-resolutions', title: 'Lihat Pelacak Resolusi Kabinet Yayasan', category: 'Tata Kelola', action: () => { setActiveSection('RESOLUTIONS'); setShowCommandPalette(false); } },
    { id: 'cmd-recorder', title: 'Lihat Audit Trail Founder Command Recorder', category: 'Audit', action: () => { setActiveSection('RECORDER'); setShowCommandPalette(false); } },
    { id: 'cmd-split', title: 'Toggle Split View (Tampilan Ganda Bersebelahan)', category: 'Tampilan', action: () => { handleToggleSplitView(); setShowCommandPalette(false); } }
  ];

  const filteredCommands = commandItems.filter(cmd =>
    cmd.title.toLowerCase().includes(paletteQuery.toLowerCase()) ||
    cmd.category.toLowerCase().includes(paletteQuery.toLowerCase())
  );

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'COCKPIT':
        return (
          <div className="space-y-6">
            {/* Awakening Sequence & Status Header */}
            {isVisible('daily_brief') && (
              <FounderDailyBrief onNavigateTab={handleSmartNavigation} />
            )}

            {/* Sprint G12: Proactive Suggestions (P4) */}
            {isVisible('proactive_suggestions') && (
              <ProactiveSuggestionsWidget
                onNavigateTab={handleSmartNavigation}
                onOpenCabinetMeeting={() => setShowCabinetMeeting(true)}
              />
            )}

            {/* Sprint G12: Founder Quick Actions 1-Click (P5) */}
            {isVisible('founder_quick_actions') && (
              <FounderQuickActions
                onNavigateTab={handleSmartNavigation}
                onOpenCabinetMeeting={() => setShowCabinetMeeting(true)}
              />
            )}

            {/* Sprint G12: Autonomous Voice Commander (P3) */}
            {isVisible('autonomous_voice') && (
              <AutonomousVoiceCommander
                onNavigateTab={handleSmartNavigation}
                onOpenCabinetMeeting={() => setShowCabinetMeeting(true)}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {isVisible('mission_queue') && (
                <FounderMissionQueue onNavigateTab={handleSmartNavigation} />
              )}
              {isVisible('readiness_score') && (
                <FounderReadinessScore />
              )}
            </div>

            {isVisible('executive_companion') && (
              <AsySyifaExecutiveCompanion onNavigateTab={handleSmartNavigation} />
            )}

            {isVisible('cabinet_resolutions') && (
              <CabinetResolutionTracker />
            )}

            <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-3 shadow-sm text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-extrabold text-stone-900 text-sm">
                  <Bookmark className="w-4 h-4 text-emerald-600" />
                  Catatan Strategis Workspace Memory
                </div>
                <button
                  onClick={handleSaveNotes}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan Catatan
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Tuliskan catatan arahan pimpinan atau fokus pengembangan pekan ini..."
                className="w-full p-3 rounded-2xl bg-stone-50 border border-stone-300 focus:outline-none focus:border-emerald-600 text-stone-800 leading-relaxed font-medium"
              />
            </div>
          </div>
        );
      case 'BLACK_BOX':
        return <BlackBoxRecorderHub />;
      case 'TIME_LENS':
        return <TimeLensReconstructor />;
      case 'UX_AUDIT':
        return <LiveUXAuditCenter />;
      case 'SMART_INCIDENT':
        return <SmartIncidentCenter />;
      case 'PERF_STABILIZER':
        return <PerformanceStabilizerCenter />;
      case 'GO_LIVE_COMMAND':
        return <GoLiveCommandCenter onNavigateSection={(sec) => setActiveSection(sec)} />;
      case 'ROLE_MATRIX':
        return <RoleValidationMatrix />;
      case 'SMART_PPDB':
        return <SmartPPDBFinalization />;
      case 'GO_LIVE_MONITOR':
        return <GoLiveMonitor />;
      case 'TRAINING_MODE':
        return <TrainingModeSimulator />;
      case 'GO_LIVE_CHECKLIST':
        return <GoLiveChecklistCenter />;
      case 'MASTER_VISIBILITY':
        return <MasterVisibilityCenter />;
      case 'FEATURE_ROLLOUT':
        return <FeatureRolloutCenter />;
      case 'LIVING_MESSENGER':
        return <LivingMessengerV2 />;
      case 'PARENT_COMMUNITY':
        return <ParentCommunityHub />;
      case 'MICRO_INTERACTIONS':
        return <LivingMicroInteractionsDemo />;
      case 'SCHOOL_CLONE':
        return <SchoolCloneKitWizard />;
      case 'LIVING_MEMORY':
        return <LivingMemoryTimeline />;
      case 'LIVING_UNIVERSE':
        return <LivingSchoolUniverseHub />;
      case 'ENGINES':
        return <SovereignEngineRegistryViewer />;
      case 'PASSPORT':
        return <DrPulseHealthPassport />;
      case 'RECOVERY':
        return <HermesRecoveryCenter />;
      case 'MEDIA':
        return <SmartUploadCommander />;
      case 'CREATIVE':
        return <CreativeStudioFactory />;
      case 'TIB':
        return <TIBFoundation />;
      case 'RESOLUTIONS':
        return <CabinetResolutionTracker />;
      case 'RECORDER':
        return <FounderCommandRecorderViewer />;
      case 'PUSAT_ASET':
        return <PusatAsetTADE onSelectModule={onSelectModule} />;
      case 'TV_ASY_SYIFA':
        return <RumahAsySyifaHub onTabChange={onSelectModule} />;
      case 'DUNIA_ASY_HIDUP':
        return <DuniaAsyLivingEnvironment />;
      case 'KAMPUNG_CERIA':
        return <KampungCeriaHub />;
      case 'FESTIVAL_CERIA':
        return <FestivalCeriaHub />;
      case 'EPISODE_INTERAKTIF':
        return <EpisodeInteraktifHub />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Founder Office Sovereign Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg">
                <Crown className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-amber-950 text-amber-300 border border-amber-800">
                    SMART OFFICE EVOLUTION
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    SPRINT G5 LIVING INTELLIGENCE
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-1">
                  Founder Executive Cockpit
                </h1>
              </div>
            </div>
            <p className="text-xs text-emerald-100/80 max-w-3xl leading-relaxed">
              Pusat komando eksekutif Founder & Dewan Pembina TK Islam Asy-Syifa. Dilengkapi Universal Search (<kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-[10px] text-amber-300">Ctrl+K</kbd>), Command Palette, Workspace Favorites, dan Split View Cockpit.
            </p>
          </div>

          {/* Search, Split View, & Customizer Quick Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCabinetMeeting(true)}
              className="px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md"
              title="Mulai Sidang Kilat Kabinet 30 Detik"
            >
              <Crown className="w-4 h-4 text-stone-950" />
              <span>Rapat Kabinet</span>
            </button>

            <button
              onClick={() => setShowCommandPalette(true)}
              className="px-3.5 py-2 rounded-2xl bg-slate-950/80 border border-emerald-500/30 hover:border-amber-400/60 text-stone-300 hover:text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Universal Search</span>
              <span className="text-[10px] font-mono bg-stone-800 px-1.5 py-0.5 rounded text-stone-400">Ctrl+K</span>
            </button>

            <button
              onClick={handleToggleSplitView}
              className={`p-2 rounded-2xl border transition cursor-pointer ${
                isSplitView
                  ? 'bg-amber-500 text-stone-950 border-amber-400'
                  : 'bg-slate-950/80 text-stone-300 border-emerald-500/30 hover:text-white'
              }`}
              title="Toggle Split View Mode"
            >
              <Columns className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowCustomizer(!showCustomizer)}
              title="Kustomisasi Tata Letak Widget"
              className="p-2 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-stone-300 hover:text-amber-400 transition cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-5 pt-4 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-emerald-500/30">
            {SECTIONS.map((sec) => {
              const isFav = memoryState.favoriteModules?.includes(sec.id);
              return (
                <div key={sec.id} className="flex items-center">
                  <button
                    onClick={() => setActiveSection(sec.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      activeSection === sec.id
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    <span>{sec.label}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(sec.id);
                    }}
                    title={isFav ? 'Hapus dari Favorit' : 'Sematkan ke Favorit'}
                    className={`p-1 text-[10px] rounded hover:text-amber-300 transition cursor-pointer ${
                      isFav ? 'text-amber-400' : 'text-stone-600'
                    }`}
                  >
                    <Star className={`w-3 h-3 ${isFav ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Favorite Pins Bar */}
          {memoryState.favoriteModules && memoryState.favoriteModules.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-stone-300">
              <span className="text-amber-400 text-[10px] font-bold">PINNED:</span>
              {memoryState.favoriteModules.map(favId => {
                const sec = SECTIONS.find(s => s.id === favId);
                if (!sec) return null;
                return (
                  <button
                    key={favId}
                    onClick={() => setActiveSection(favId)}
                    className="px-2 py-0.5 rounded-lg bg-emerald-950/90 border border-emerald-700/60 text-emerald-200 font-bold hover:bg-emerald-900 cursor-pointer"
                  >
                    {sec.label.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* TADE Founder Live Status Radar (P7) */}
      <FounderLiveStatusPanel />

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-fade-in">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Widget Layout Customizer Drawer */}
      {showCustomizer && (
        <div className="p-5 bg-stone-900 text-white rounded-3xl border border-stone-800 space-y-4 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <div className="font-bold flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Kustomisasi Susunan Widget Founder Workspace Memory</span>
            </div>
            <button
              onClick={() => setShowCustomizer(false)}
              className="text-stone-400 hover:text-white font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {memoryState.widgetPositions.map((w, idx) => (
              <div
                key={w.id}
                className="p-3 bg-stone-800 rounded-xl border border-stone-700 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 truncate">
                  <button
                    onClick={() => handleToggleWidget(w.id)}
                    className={`p-1 rounded cursor-pointer ${w.visible ? 'text-emerald-400' : 'text-stone-500'}`}
                  >
                    {w.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <span className={`font-bold truncate ${w.visible ? 'text-stone-200' : 'text-stone-500 line-through'}`}>
                    {w.title}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleMoveWidget(idx, 'UP')}
                    disabled={idx === 0}
                    className="p-1 text-stone-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveWidget(idx, 'DOWN')}
                    disabled={idx === memoryState.widgetPositions.length - 1}
                    className="p-1 text-stone-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content: Single View OR Split View Mode */}
      {isSplitView ? (
        <div className="space-y-3">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-950 font-medium">
            <div className="flex items-center gap-2">
              <Columns className="w-4 h-4 text-amber-700" />
              <span>
                <strong>Split View Aktif:</strong> Panel Kiri ({activeSection}) vs Panel Kanan:
              </span>
              <select
                value={splitSecondarySection}
                onChange={(e) => {
                  setSplitSecondarySection(e.target.value);
                  founderWorkspaceMemory.setSplitView(true, e.target.value);
                }}
                className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-xs font-bold text-amber-900 focus:outline-none"
              >
                {SECTIONS.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleToggleSplitView}
              className="text-amber-800 hover:text-black font-bold cursor-pointer"
            >
              Tutup Split View
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div className="px-3 py-1.5 bg-stone-100 rounded-xl text-xs font-black text-stone-800 uppercase tracking-wider">
                Panel Utama: {SECTIONS.find(s => s.id === activeSection)?.label}
              </div>
              {renderSectionContent(activeSection)}
            </div>

            <div className="space-y-4">
              <div className="px-3 py-1.5 bg-stone-100 rounded-xl text-xs font-black text-stone-800 uppercase tracking-wider">
                Panel Sekunder: {SECTIONS.find(s => s.id === splitSecondarySection)?.label}
              </div>
              {renderSectionContent(splitSecondarySection)}
            </div>
          </div>
        </div>
      ) : (
        renderSectionContent(activeSection)
      )}

      {/* COMMAND PALETTE MODAL (Ctrl+K) */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 animate-fade-in">
          <div className="bg-slate-900 border border-stone-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden text-white space-y-3 p-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Command className="w-4 h-4" />
                <span>Command Palette & Universal Search</span>
              </div>
              <button
                onClick={() => setShowCommandPalette(false)}
                className="p-1 text-stone-400 hover:text-white cursor-pointer rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                placeholder="Ketik perintah, navigasi, atau kata kunci (contoh: 'Passport', 'Rollback', 'Poster')..."
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-stone-700 rounded-2xl text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Suggestions & Filtered Items */}
            <div className="max-h-72 overflow-y-auto space-y-1 pr-1 text-xs">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    className="w-full p-3 rounded-xl bg-slate-800/60 hover:bg-emerald-950/80 border border-stone-800 hover:border-emerald-500/50 flex items-center justify-between gap-2 text-left transition cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-stone-100">{cmd.title}</div>
                      <div className="text-[10px] text-stone-400 font-mono">{cmd.category}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-500" />
                  </button>
                ))
              ) : (
                <div className="text-center py-6 text-stone-400 text-xs">
                  Tidak ada perintah yang cocok dengan "{paletteQuery}".
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[10px] text-stone-500 font-mono">
              <span>Gunakan <kbd className="bg-stone-800 px-1 py-0.5 rounded text-stone-300">ESC</kbd> untuk menutup</span>
              <span>TK Islam Asy Syifa Tanggul</span>
            </div>
          </div>
        </div>
      )}

      {/* SPRINT G12: Emerald Sovereign Awakening Sequence (P1) */}
      {showAwakeningSequence && (
        <FounderPresenceSequence
          onComplete={() => setShowAwakeningSequence(false)}
        />
      )}

      {/* SPRINT G12: Cabinet Meeting 30-Second Rapid Session */}
      <CabinetMeetingModal
        isOpen={showCabinetMeeting}
        onClose={() => setShowCabinetMeeting(false)}
        onSessionFinalized={() => {
          setFeedback('Sidang Kabinet 30 Detik berhasil disahkan. Surat Keputusan diterbitkan.');
          setTimeout(() => setFeedback(null), 4000);
        }}
      />
    </div>
  );
};
