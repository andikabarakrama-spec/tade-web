import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LivingGardenProvider } from './context/LivingGardenContext';
import { AIAsyCharacterProvider } from './context/AIAsyCharacterContext';
import { CinematicIntroLoader } from './components/garden/CinematicIntroLoader';
import { SmartDockManager } from './components/garden/SmartDockManager';
import { HeaderNavbar } from './components/common/HeaderNavbar';
import { Footer } from './components/common/Footer';
import { ParentJourneyBar } from './components/garden/ParentJourneyBar';
import { LivingSeasonBanner } from './components/garden/LivingSeasonBanner';
import { LivingWidgetsBar } from './components/garden/LivingWidgetsBar';
import { LivingGardenPopups } from './components/garden/LivingGardenPopups';
import { AIAsy } from './components/assistant/AIAsy';
import { WhatsAppGuardianButton } from './components/guardian/WhatsAppGuardianButton';
import { InstallBanner } from './components/pwa/InstallBanner';
import { NotificationPermissionDialog } from './components/pwa/NotificationPermissionDialog';
import { SplashScreen } from './components/ui/SplashScreen';
import { ProgressIndicator } from './components/ui/ProgressIndicator';

// Phase W1 Master Interaction Engine Components
import { OpeningExperience } from './components/interactions/OpeningExperience';
import { JourneyTransition } from './components/interactions/JourneyTransition';

// Website Pages
import { W1Beranda } from './components/website/W1Beranda';
import { W2ProfilProgram } from './components/website/W2ProfilProgram';
import { W3BeritaInformasi } from './components/website/W3BeritaInformasi';
import { W4PortalPPDB } from './components/website/W4PortalPPDB';
import { W5KontakSekolah } from './components/website/W5KontakSekolah';

// SIM Portal Layout & Modules
import { SIMLayout } from './components/sim/SIMLayout';
import { R1Dashboard } from './components/sim/R1Dashboard';
import { R2UserRBAC } from './components/sim/R2UserRBAC';
import { R3DataSiswa } from './components/sim/R3DataSiswa';
import { R4DataGuru } from './components/sim/R4DataGuru';
import { R5KelompokKelas } from './components/sim/R5KelompokKelas';
import { R6PresensiSiswa } from './components/sim/R6PresensiSiswa';
import { R7PresensiGuru } from './components/sim/R7PresensiGuru';
import { R8Erapor } from './components/sim/R8Erapor';
import { R9Anekdot } from './components/sim/R9Anekdot';
import { R10SPPTagihan } from './components/sim/R10SPPTagihan';
import { R11PembayaranKwitansi } from './components/sim/R11PembayaranKwitansi';
import { R12LaporanKeuangan } from './components/sim/R12LaporanKeuangan';
import { R13VerifikasiPPDB } from './components/sim/R13VerifikasiPPDB';
import { R14SmartArchive } from './components/sim/R14SmartArchive';
import { R15PengumumanInternal } from './components/sim/R15PengumumanInternal';
import { R16SmartDocumentFactory } from './components/sim/R16SmartDocumentFactory';
import { R17TahfidzDoa } from './components/sim/R17TahfidzDoa';
import { R18InventarisSarpras } from './components/sim/R18InventarisSarpras';
import { R19PerpustakaanAPE } from './components/sim/R19PerpustakaanAPE';
import { R20LayananKMS } from './components/sim/R20LayananKMS';
import { R21Ekstrakurikuler } from './components/sim/R21Ekstrakurikuler';
import { R22CMSWebsite } from './components/sim/R22CMSWebsite';
import { R23PengaturanWebsite } from './components/sim/R23PengaturanWebsite';
import { R24AuditLog } from './components/sim/R24AuditLog';
import { R25BackupExport } from './components/sim/R25BackupExport';
import { R26PetaZonasi } from './components/sim/R26PetaZonasi';
import { R27MenuCatering } from './components/sim/R27MenuCatering';
import { R28AntarJemput } from './components/sim/R28AntarJemput';
import { R29PortalWaliMurid } from './components/sim/R29PortalWaliMurid';
import { R30PortalGuru } from './components/sim/R30PortalGuru';
import { R31PortalKepsek } from './components/sim/R31PortalKepsek';
import { R32SystemMaintenance } from './components/sim/R32SystemMaintenance';
import { R33AISearchKnowledge } from './components/sim/R33AISearchKnowledge';
import { R34SelfHealthCheck } from './components/sim/R34SelfHealthCheck';
import { R35BackupRecoveryCenter } from './components/sim/R35BackupRecoveryCenter';
import { R36AIOperatingSystem } from './components/sim/R36AIOperatingSystem';
import { R37EnterprisePatchGovernance } from './components/sim/R37EnterprisePatchGovernance';
import { R38EnterpriseObservability } from './components/sim/R38EnterpriseObservability';
import { R39EnterpriseSelfDiagnostic } from './components/sim/R39EnterpriseSelfDiagnostic';
import { R40EnterpriseRecoveryValidation } from './components/sim/R40EnterpriseRecoveryValidation';
import { R41EnterpriseConfigGovernance } from './components/sim/R41EnterpriseConfigGovernance';
import { R42EnterpriseDocCenter } from './components/sim/R42EnterpriseDocCenter';
import { R43EnterpriseDocLifecycleEngine } from './components/sim/R43EnterpriseDocLifecycleEngine';
import { R44EnterpriseTemplateLibrary } from './components/sim/R44EnterpriseTemplateLibrary';
import { R45EnterpriseDocGenEngine } from './components/sim/R45EnterpriseDocGenEngine';
import { R46EnterpriseDigitalIdentity } from './components/sim/R46EnterpriseDigitalIdentity';
import { R47EnterpriseMasterDataSyncEngine } from './components/sim/R47EnterpriseMasterDataSyncEngine';
import { R48EnterpriseAttachmentRegistry } from './components/sim/R48EnterpriseAttachmentRegistry';
import { R49EnterpriseKnowledgeGraph } from './components/sim/R49EnterpriseKnowledgeGraph';
import { R50EnterprisePdfPrintComposer } from './components/sim/R50EnterprisePdfPrintComposer';
import { R51EnterpriseApprovalDigitalSignature } from './components/sim/R51EnterpriseApprovalDigitalSignature';
import { R52EnterpriseQRVerification } from './components/sim/R52EnterpriseQRVerification';
import { R53EnterpriseSmartDocumentIntake } from './components/sim/R53EnterpriseSmartDocumentIntake';
import { R54EnterpriseCommunicationHub } from './components/sim/R54EnterpriseCommunicationHub';
import { R55EnterpriseGoLiveReadiness } from './components/sim/R55EnterpriseGoLiveReadiness';
import { R56EnterpriseLicenseManager } from './components/sim/R56EnterpriseLicenseManager';
import { R57EnterpriseOperationsCenter } from './components/sim/R57EnterpriseOperationsCenter';
import { R58DeviceHardwareGuardian } from './components/sim/R58DeviceHardwareGuardian';
import { R63ExecutiveLivingWorkspace } from './components/sim/R63ExecutiveLivingWorkspace';
import { R65SchoolActivityCenter } from './components/sim/R65SchoolActivityCenter';
import { R68AdminLivingWorkspace } from './components/sim/R68AdminLivingWorkspace';
import { R70ExecutiveMissionControl } from './components/sim/R70ExecutiveMissionControl';
import { R71AIAsyWorkflowOrchestrator } from './components/sim/R71AIAsyWorkflowOrchestrator';
import { PilotModeCenter } from './components/sim/PilotModeCenter';
import { DailyOperationCompanion } from './components/sim/DailyOperationCompanion';
import { GuardianGoLiveChecklist } from './components/sim/GuardianGoLiveChecklist';
import { OperatorTrainingAcademy } from './components/sim/OperatorTrainingAcademy';
import { UniversalQRLiveDeployment } from './components/sim/UniversalQRLiveDeployment';
import { AIAsyReceptionist } from './components/sim/AIAsyReceptionist';
import { MediaContentStudio } from './components/sim/MediaContentStudio';
import { GuardianPrintCenter } from './components/sim/GuardianPrintCenter';
import { OfflineFirstValidation } from './components/sim/OfflineFirstValidation';
import { VoiceIdentityStudio } from './components/sim/VoiceIdentityStudio';
import { ExecutiveLaunchDashboard } from './components/sim/ExecutiveLaunchDashboard';
import { DiscoveryRegistryCenter } from './components/sim/DiscoveryRegistryCenter';
import { DekAsyLivingRuntime } from './components/sim/DekAsyLivingRuntime';
import { RoleAdaptiveBundleManager } from './components/sim/RoleAdaptiveBundleManager';
import { LivingParentWorld } from './components/sim/LivingParentWorld';
import { LivingTeacherWorld } from './components/sim/LivingTeacherWorld';
import { LivingExecutiveWorld } from './components/sim/LivingExecutiveWorld';
import { OperationsAIActionDock } from './components/sim/OperationsAIActionDock';
import { LivingBannerNusantara3D } from './components/sim/LivingBannerNusantara3D';
import { IntelligentChunkEngineManager } from './components/sim/IntelligentChunkEngineManager';
import { PerformanceGuardianDashboard } from './components/sim/PerformanceGuardianDashboard';
import { ExecutiveLiteModeWorkspace } from './components/sim/ExecutiveLiteModeWorkspace';
import { OperationsUltraWorkspace } from './components/sim/OperationsUltraWorkspace';
import { PresidentialUltraWorkspace } from './components/sim/PresidentialUltraWorkspace';
import { LivingMessengerEnterprise } from './components/sim/LivingMessengerEnterprise';
import { UniversalQREvolution } from './components/sim/UniversalQREvolution';
import { SchoolTVLivingChannel } from './components/sim/SchoolTVLivingChannel';
import { AIVoiceEverywhereStudio } from './components/sim/AIVoiceEverywhereStudio';
import { GuardianBundleAuditor } from './components/sim/GuardianBundleAuditor';
import { SupremeCommandCenter } from './components/sim/SupremeCommandCenter';
import { CommandMissionEngine } from './components/sim/CommandMissionEngine';
import { CommandTimeline } from './components/sim/CommandTimeline';
import { TADEControlTower } from './components/sim/TADEControlTower';
import { TenantOverview } from './components/sim/TenantOverview';
import { SystemFleetMonitor } from './components/sim/SystemFleetMonitor';
import { RootGuardianCenter } from './components/sim/RootGuardianCenter';
import { AIAsyCommandConsole } from './components/sim/AIAsyCommandConsole';
import { LicenseSuspendCenter } from './components/sim/LicenseSuspendCenter';
import { EducationProfileEngine } from './components/sim/EducationProfileEngine';
import { BreakGlassRecovery } from './components/sim/BreakGlassRecovery';
import { FuturePredictionCenter } from './components/sim/FuturePredictionCenter';
import { ConstitutionGuard } from './components/sim/ConstitutionGuard';
import { FounderDashboard } from './components/sim/FounderDashboard';
import { RootRecoveryCenter } from './components/sim/RootRecoveryCenter';
import { FounderFirstSetupWizard } from './components/sim/FounderFirstSetupWizard';
import { SmartLandingEngine } from './components/sim/SmartLandingEngine';
import { PerformanceGateCenter } from './components/sim/PerformanceGateCenter';
import { FeatureGateCenter } from './components/sim/FeatureGateCenter';
import { AsyCreativeStudio } from './components/sim/AsyCreativeStudio';
import { TADEMarketplace } from './components/sim/TADEMarketplace';
import { CustomerSuccessAI } from './components/sim/CustomerSuccessAI';
import { AutoMigrationCenter } from './components/sim/AutoMigrationCenter';
import { FounderInsightDashboard } from './components/sim/FounderInsightDashboard';
import { GlobalNotificationHub } from './components/sim/GlobalNotificationHub';
import { SchoolHealthCenter } from './components/sim/SchoolHealthCenter';
import { SmartAutomationCenter } from './components/sim/SmartAutomationCenter';
import { GuardianComplianceCenter } from './components/sim/GuardianComplianceCenter';
import { AIAsyMemoryLayer } from './components/sim/AIAsyMemoryLayer';
import { AssetOptimizationEngine } from './components/sim/AssetOptimizationEngine';
import { EnterpriseAnalytics } from './components/sim/EnterpriseAnalytics';
import { GuardianMissionControl } from './components/sim/GuardianMissionControl';
import { ZeroTouchMaintenanceCenter } from './components/sim/ZeroTouchMaintenanceCenter';
import { UnifiedAuditTimeline } from './components/sim/UnifiedAuditTimeline';
import { SchoolReadinessScore } from './components/sim/SchoolReadinessScore';
import { SmartDocumentLifecycle } from './components/sim/SmartDocumentLifecycle';
import { AIAsyOperationsCoach } from './components/sim/AIAsyOperationsCoach';
import { EnterpriseBackupObservatory } from './components/sim/EnterpriseBackupObservatory';
import { CrossSchoolBenchmark } from './components/sim/CrossSchoolBenchmark';
import { CampusCommandCenter } from './components/sim/CampusCommandCenter';
import { SmartParentTimeline } from './components/sim/SmartParentTimeline';
import { TeacherProductivityHub } from './components/sim/TeacherProductivityHub';
import { DigitalCampusMap } from './components/sim/DigitalCampusMap';
import { AIAsyKnowledgeAssistant } from './components/sim/AIAsyKnowledgeAssistant';
import { SmartVisitorExperience } from './components/sim/SmartVisitorExperience';
import { ExecutiveFinanceSnapshot } from './components/sim/ExecutiveFinanceSnapshot';
import { DigitalCampusExperience } from './components/sim/DigitalCampusExperience';
import { SchoolOperatingDashboard } from './components/sim/SchoolOperatingDashboard';
import { SmartCommunicationCenter } from './components/sim/SmartCommunicationCenter';
import { DigitalClassroomPulse } from './components/sim/DigitalClassroomPulse';
import { IntelligentResourceCenter } from './components/sim/IntelligentResourceCenter';
import { AIAsyDailyBriefing } from './components/sim/AIAsyDailyBriefing';
import { SchoolEventCommand } from './components/sim/SchoolEventCommand';
import { ExecutiveOperationsSnapshot } from './components/sim/ExecutiveOperationsSnapshot';
import { AdaptiveExperienceEngine } from './components/sim/AdaptiveExperienceEngine';
import { StudentGrowthIntelligence } from './components/sim/StudentGrowthIntelligence';
import { ParentEngagementCenter } from './components/sim/ParentEngagementCenter';
import { TeacherPlanningStudio } from './components/sim/TeacherPlanningStudio';
import { AIAsyCurriculumAssistant } from './components/sim/AIAsyCurriculumAssistant';
import { DigitalArchiveIntelligence } from './components/sim/DigitalArchiveIntelligence';
import { SchoolReputationDashboard } from './components/sim/SchoolReputationDashboard';
import { ExecutiveDecisionCenter } from './components/sim/ExecutiveDecisionCenter';
import { AdaptiveLearningExperience } from './components/sim/AdaptiveLearningExperience';
import { SchoolOperationsAutomationHub } from './components/sim/SchoolOperationsAutomationHub';
import { SmartAttendanceIntelligence } from './components/sim/SmartAttendanceIntelligence';
import { AIAsyParentCompanion } from './components/sim/AIAsyParentCompanion';
import { SchoolResourcePlanner } from './components/sim/SchoolResourcePlanner';
import { DigitalComplianceArchive } from './components/sim/DigitalComplianceArchive';
import { ExecutiveRiskObservatory } from './components/sim/ExecutiveRiskObservatory';
import { CommunityEngagementHub } from './components/sim/CommunityEngagementHub';
import { AdaptiveResilienceEngine } from './components/sim/AdaptiveResilienceEngine';
import { GuardianHealthCenter } from './components/sim/GuardianHealthCenter';
import { MemoryLeakHunter } from './components/sim/MemoryLeakHunter';
import { StorageSentinel } from './components/sim/StorageSentinel';
import { DatabaseHealthMonitor } from './components/sim/DatabaseHealthMonitor';
import { BackupHealthMonitor } from './components/sim/BackupHealthMonitor';
import { DeviceHealthSimulator } from './components/sim/DeviceHealthSimulator';
import { LongLifeSimulation } from './components/sim/LongLifeSimulation';
import { ChainOfCustodyCenter } from './components/sim/ChainOfCustodyCenter';
import { LegalEvidenceLedger } from './components/sim/LegalEvidenceLedger';
import { DocumentVersionCenter } from './components/sim/DocumentVersionCenter';
import { PrintEvidenceCenter } from './components/sim/PrintEvidenceCenter';
import { AuditReplayCenter } from './components/sim/AuditReplayCenter';
import { PositionHistoryVault } from './components/sim/PositionHistoryVault';
import { SuccessionCenter } from './components/sim/SuccessionCenter';
import { CredentialRotationCenter } from './components/sim/CredentialRotationCenter';
import { KnowledgeContinuityCenter } from './components/sim/KnowledgeContinuityCenter';
import { AnnualTimeCapsule } from './components/sim/AnnualTimeCapsule';
import { DataClassificationCenter } from './components/sim/DataClassificationCenter';
import { RetentionPolicyCenter } from './components/sim/RetentionPolicyCenter';
import { SmartArchiveTransition } from './components/sim/SmartArchiveTransition';
import { DestructionApprovalCenter } from './components/sim/DestructionApprovalCenter';
import { RecordsComplianceDashboard } from './components/sim/RecordsComplianceDashboard';
import { AsyLivingCalendarEngine } from './components/sim/AsyLivingCalendarEngine';
import { AsyWardrobeSystem } from './components/sim/AsyWardrobeSystem';
import { CulturalAnimationEngine } from './components/sim/CulturalAnimationEngine';
import { EducationCalendarEngine } from './components/sim/EducationCalendarEngine';
import { WeatherDaytimeEngine } from './components/sim/WeatherDaytimeEngine';
import { TotalSystemWarRoom } from './components/sim/TotalSystemWarRoom';
import { GuardianSecurityCommandCenter } from './components/sim/GuardianSecurityCommandCenter';
import { CCTVSetupWizardEnterprise } from './components/sim/CCTVSetupWizardEnterprise';
import { CameraHealthGuardian } from './components/sim/CameraHealthGuardian';
import { SmartIntruderTracking } from './components/sim/SmartIntruderTracking';
import { SecurityIncidentTimeline } from './components/sim/SecurityIncidentTimeline';
import { EvidenceVaultEnterprise } from './components/sim/EvidenceVaultEnterprise';
import { ExecutiveSecurityBridge } from './components/sim/ExecutiveSecurityBridge';
import { Golden10MinutesProtocol } from './components/sim/Golden10MinutesProtocol';
import { PoliceReadyEvidencePack } from './components/sim/PoliceReadyEvidencePack';
import { GateGuardianProtocol } from './components/sim/GateGuardianProtocol';
import { ChildSafetyZone } from './components/sim/ChildSafetyZone';
import { SecurityHealthLab } from './components/sim/SecurityHealthLab';
import { QRCCTVPairingCard } from './components/sim/QRCCTVPairingCard';
import { NeverLoseWorkEngine } from './components/sim/NeverLoseWorkEngine';
import { AIStudioExportGuardian } from './components/sim/AIStudioExportGuardian';
import { OneEngineCrossPlatform } from './components/sim/OneEngineCrossPlatform';
import { SchoolDeploymentBridge } from './components/sim/SchoolDeploymentBridge';
import { GovOfficeFormulaEngine } from './components/sim/GovOfficeFormulaEngine';
import { OneClickEmergencyGuardian } from './components/sim/OneClickEmergencyGuardian';
import { SmartAssetMaintenance } from './components/sim/SmartAssetMaintenance';
import { ParentPickupGuardian } from './components/sim/ParentPickupGuardian';
import { TADESelfHealingEngine } from './components/sim/TADESelfHealingEngine';
import { FounderCommandCenter } from './components/sim/FounderCommandCenter';
import { GuardianDailyAutopilot } from './components/sim/GuardianDailyAutopilot';
import { SmartSchoolScheduler } from './components/sim/SmartSchoolScheduler';
import { GovernmentNumberingEngine } from './components/sim/GovernmentNumberingEngine';
import { BankingFormulaGuardian } from './components/sim/BankingFormulaGuardian';
import { DocumentAutoValidation } from './components/sim/DocumentAutoValidation';
import { SmartReportGenerator } from './components/sim/SmartReportGenerator';
import { ClassroomReadinessEngine } from './components/sim/ClassroomReadinessEngine';
import { GuardianNotificationMatrix } from './components/sim/GuardianNotificationMatrix';
import { OfficeQualityValidator } from './components/sim/OfficeQualityValidator';
import { ZeroManualRepetitionEngine } from './components/sim/ZeroManualRepetitionEngine';
import { OfficeFormulaCompatibilityEngine } from './components/sim/OfficeFormulaCompatibilityEngine';
import { SmartMailWorkflow } from './components/sim/SmartMailWorkflow';
import { ExecutiveDashboardMorningBrief } from './components/sim/ExecutiveDashboardMorningBrief';
import { GovernmentLetterIntelligenceCenter } from './components/sim/GovernmentLetterIntelligenceCenter';
import { BankingLedgerIntelligence } from './components/sim/BankingLedgerIntelligence';
import { CertificateDiplomaIntelligence } from './components/sim/CertificateDiplomaIntelligence';
import { GovernmentArchiveVault } from './components/sim/GovernmentArchiveVault';
import { LegalStampSignatureCenter } from './components/sim/LegalStampSignatureCenter';
import { GovernmentPrintCenter } from './components/sim/GovernmentPrintCenter';
import { OfficeFormulaVerificationEngine } from './components/sim/OfficeFormulaVerificationEngine';
import { ExecutiveDocumentApprovalMatrix } from './components/sim/ExecutiveDocumentApprovalMatrix';
import { SmartOfficialMailTracker } from './components/sim/SmartOfficialMailTracker';
import { LegalComplianceCenter } from './components/sim/LegalComplianceCenter';
import { DigitalTwinCampusCenter } from './components/sim/DigitalTwinCampusCenter';
import { LivingRoomIntelligence } from './components/sim/LivingRoomIntelligence';
import { AsyLivingGuide } from './components/sim/AsyLivingGuide';
import { CampusHeatMap } from './components/sim/CampusHeatMap';
import { LiveCCTVBridge } from './components/sim/LiveCCTVBridge';
import { SmartAssetLocator } from './components/sim/SmartAssetLocator';
import { ClassroomReadinessLive } from './components/sim/ClassroomReadinessLive';
import { FounderCommandMap } from './components/sim/FounderCommandMap';
import { SmartNavigationEngine } from './components/sim/SmartNavigationEngine';
import { PerformanceSplitEngine } from './components/sim/PerformanceSplitEngine';
import { AIAsyCommandCenter } from './components/sim/AIAsyCommandCenter';
import { GuardianCommandCenter } from './components/sim/GuardianCommandCenter';
import { DualAICoordinationEngine } from './components/sim/DualAICoordinationEngine';
import { FounderPreviewModeFinal } from './components/sim/FounderPreviewModeFinal';
import { SmartRouteMemoryV2 } from './components/sim/SmartRouteMemoryV2';
import { LivingTaskAutomationEngine } from './components/sim/LivingTaskAutomationEngine';
import { GuardianIncidentCommander } from './components/sim/GuardianIncidentCommander';
import { ExecutiveAIBridge } from './components/sim/ExecutiveAIBridge';
import { HumanWorkloadOptimizer } from './components/sim/HumanWorkloadOptimizer';
import { ConstitutionEnforcementEngine } from './components/sim/ConstitutionEnforcementEngine';
import { DualArchitectureSeparationEngine } from './components/sim/DualArchitectureSeparationEngine';
import { SecureRouteIsolation } from './components/sim/SecureRouteIsolation';
import { SecurityBoundaryFirewall } from './components/sim/SecurityBoundaryFirewall';
import { SEOIsolationCenter } from './components/sim/SEOIsolationCenter';
import { SessionFortress } from './components/sim/SessionFortress';
import { BrowserSecurityFortress } from './components/sim/BrowserSecurityFortress';
import { FirebaseSecurityFortress } from './components/sim/FirebaseSecurityFortress';
import { CacheIsolationEngine } from './components/sim/CacheIsolationEngine';
import { FounderPreviewSeparation } from './components/sim/FounderPreviewSeparation';
import { SecurityWarRoomDashboard } from './components/sim/SecurityWarRoomDashboard';
import { EnterpriseDeploymentCommandCenter } from './components/sim/EnterpriseDeploymentCommandCenter';
import { BackupIndependenceCenter } from './components/sim/BackupIndependenceCenter';
import { AIAsyLivingOperations } from './components/sim/AIAsyLivingOperations';
import { GuardianContinuousSecurity } from './components/sim/GuardianContinuousSecurity';
import { SmartMaintenanceCalendar } from './components/sim/SmartMaintenanceCalendar';
import { FounderExecutiveTimeline } from './components/sim/FounderExecutiveTimeline';
import { SchoolKnowledgeVault } from './components/sim/SchoolKnowledgeVault';
import { ProductionHealthObservatory } from './components/sim/ProductionHealthObservatory';
import { FinalCandidatePreparationCenter } from './components/sim/FinalCandidatePreparationCenter';
import { UniversalHealingCore } from './components/sim/UniversalHealingCore';
import { LivingWarRoomOperations } from './components/sim/LivingWarRoomOperations';
import { GuardianDefenseLadder } from './components/sim/GuardianDefenseLadder';
import { RecoverySwarmCoordination } from './components/sim/RecoverySwarmCoordination';
import { ExecutiveIncidentTheater } from './components/sim/ExecutiveIncidentTheater';
import { ContinuousThreatObservatory } from './components/sim/ContinuousThreatObservatory';
import { SmartRecoveryPlaybook } from './components/sim/SmartRecoveryPlaybook';
import { FounderCrisisTimeline } from './components/sim/FounderCrisisTimeline';
import { GuardianResearchVault } from './components/sim/GuardianResearchVault';
import { KernelProcessIsolation } from './components/sim/KernelProcessIsolation';
import { KernelSchedulerGovernor } from './components/sim/KernelSchedulerGovernor';
import { KernelMemoryGuardian } from './components/sim/KernelMemoryGuardian';
import { KernelJournalService } from './components/sim/KernelJournalService';
import { KernelPermissionMatrix } from './components/sim/KernelPermissionMatrix';
import { KernelRecoverySwarmV2 } from './components/sim/KernelRecoverySwarmV2';
import { KernelHeartbeatObservatory } from './components/sim/KernelHeartbeatObservatory';
import { KernelIntegrityScanner } from './components/sim/KernelIntegrityScanner';
import { KernelConstitutionGuardian } from './components/sim/KernelConstitutionGuardian';
import { KernelBootSequenceViewer } from './components/sim/KernelBootSequenceViewer';
import { EngineDependencyGraphViewer } from './components/sim/EngineDependencyGraphViewer';
import { AdaptiveResourceSchedulerViewer } from './components/sim/AdaptiveResourceSchedulerViewer';
import { KernelMemoryReclaimerViewer } from './components/sim/KernelMemoryReclaimerViewer';
import { ImmutableAuditChainViewer } from './components/sim/ImmutableAuditChainViewer';
import { DynamicPermissionEnforcerViewer } from './components/sim/DynamicPermissionEnforcerViewer';
import { RecoverySwarmMeshV3Viewer } from './components/sim/RecoverySwarmMeshV3Viewer';
import { KernelPulseNetworkViewer } from './components/sim/KernelPulseNetworkViewer';
import { IntegrityGuardianMatrixViewer } from './components/sim/IntegrityGuardianMatrixViewer';
import { ConstitutionEvolutionGuardianViewer } from './components/sim/ConstitutionEvolutionGuardianViewer';
import { KernelServiceLifecycleManagerViewer } from './components/sim/KernelServiceLifecycleManagerViewer';
import { GuardianDependencySupervisorViewer } from './components/sim/GuardianDependencySupervisorViewer';
import { AutonomousRecoveryPlannerViewer } from './components/sim/AutonomousRecoveryPlannerViewer';
import { KernelHealthPropagationViewer } from './components/sim/KernelHealthPropagationViewer';
import { SmartJournalReplayViewer } from './components/sim/SmartJournalReplayViewer';
import { PermissionDriftDetectorViewer } from './components/sim/PermissionDriftDetectorViewer';
import { RecoverySwarmCollectiveViewer } from './components/sim/RecoverySwarmCollectiveViewer';
import { KernelPerformanceObservatoryV2 } from './components/sim/KernelPerformanceObservatoryV2';
import { ExecutiveOperationalTheaterViewer } from './components/sim/ExecutiveOperationalTheaterViewer';
import { ConstitutionConsistencyAuditorViewer } from './components/sim/ConstitutionConsistencyAuditorViewer';
import { KernelEventBusViewer } from './components/sim/KernelEventBusViewer';
import { ServiceDependencyRecoveryMeshViewer } from './components/sim/ServiceDependencyRecoveryMeshViewer';
import { AIAsyOperationalCopilotViewer } from './components/sim/AIAsyOperationalCopilotViewer';
import { GuardianThreatMatrixViewer } from './components/sim/GuardianThreatMatrixViewer';
import { ImmutableRecoveryLedgerViewer } from './components/sim/ImmutableRecoveryLedgerViewer';
import { KernelWatchdogTimerViewer } from './components/sim/KernelWatchdogTimerViewer';
import { BrowserRuntimeSentinelViewer } from './components/sim/BrowserRuntimeSentinelViewer';
import { PerformanceBudgetGuardianViewer } from './components/sim/PerformanceBudgetGuardianViewer';
import { FounderDecisionConsoleViewer } from './components/sim/FounderDecisionConsoleViewer';
import { KernelStabilityAuditorViewer } from './components/sim/KernelStabilityAuditorViewer';
import { ImmortalStorageManagerViewer } from './components/sim/ImmortalStorageManagerViewer';
import { WALPersistenceEngineViewer } from './components/sim/WALPersistenceEngineViewer';
import { SmartSnapshotSchedulerViewer } from './components/sim/SmartSnapshotSchedulerViewer';
import { BrowserCrashRecoveryViewer } from './components/sim/BrowserCrashRecoveryViewer';
import { OfflineOperationManagerViewer } from './components/sim/OfflineOperationManagerViewer';
import { RuntimeStateGuardianViewer } from './components/sim/RuntimeStateGuardianViewer';
import { DisasterRecoverySimulatorViewer } from './components/sim/DisasterRecoverySimulatorViewer';
import { GuardianStorageIntegrityViewer } from './components/sim/GuardianStorageIntegrityViewer';
import { AIAsyRecoveryGuideViewer } from './components/sim/AIAsyRecoveryGuideViewer';
import { FounderDisasterCommandViewer } from './components/sim/FounderDisasterCommandViewer';
import { GuardianControlPlaneViewer } from './components/sim/GuardianControlPlaneViewer';
import { UnifiedTelemetryBusViewer } from './components/sim/UnifiedTelemetryBusViewer';
import { AIAsyExecutiveIntelligenceViewer } from './components/sim/AIAsyExecutiveIntelligenceViewer';
import { GuardianThreatCorrelatorViewer } from './components/sim/GuardianThreatCorrelatorViewer';
import { DistributedRecoveryCoordinatorViewer } from './components/sim/DistributedRecoveryCoordinatorViewer';
import { KernelTraceObservatoryViewer } from './components/sim/KernelTraceObservatoryViewer';
import { SecureSyncCoordinatorViewer } from './components/sim/SecureSyncCoordinatorViewer';
import { FounderCommandTimelineV2Viewer } from './components/sim/FounderCommandTimelineV2Viewer';
import { OperationalGovernanceEngineViewer } from './components/sim/OperationalGovernanceEngineViewer';
import { KernelFutureCompatibilityGuardViewer } from './components/sim/KernelFutureCompatibilityGuardViewer';

// RC78: Sovereign Government & Long-Life Operations
import { SovereignCommandCenterViewer } from './components/sim/SovereignCommandCenterViewer';
import { PrimeMinisterCabinetViewer } from './components/sim/PrimeMinisterCabinetViewer';
import { MinisterAssistantNetworkViewer } from './components/sim/MinisterAssistantNetworkViewer';
import { GuardianMilitaryCommandViewer } from './components/sim/GuardianMilitaryCommandViewer';
import { CommanderAssistantNetworkViewer } from './components/sim/CommanderAssistantNetworkViewer';
import { MicroAgentSwarmViewer } from './components/sim/MicroAgentSwarmViewer';
import { ExecutiveEscalationChainViewer } from './components/sim/ExecutiveEscalationChainViewer';
import { LongLifeOperationsViewer } from './components/sim/LongLifeOperationsViewer';
import { ExecutiveGovernmentTheaterViewer } from './components/sim/ExecutiveGovernmentTheaterViewer';
import { ConstitutionalEnforcementV2Viewer } from './components/sim/ConstitutionalEnforcementV2Viewer';

// RC79: Sovereign Civil Service & Autonomous Government
import { CivilServiceRegistryViewer } from './components/government/CivilServiceRegistryViewer';
import { CrossMinistryCollaborationViewer } from './components/government/CrossMinistryCollaborationViewer';
import { GovernmentWorkflowOrchestratorViewer } from './components/government/GovernmentWorkflowOrchestratorViewer';
import { GuardianMilitaryLogisticsViewer } from './components/government/GuardianMilitaryLogisticsViewer';
import { ConstitutionalDecisionLedgerViewer } from './components/government/ConstitutionalDecisionLedgerViewer';
import { GovernmentIntelligenceBoardViewer } from './components/government/GovernmentIntelligenceBoardViewer';
import { ExecutiveCommandTheaterV2Viewer } from './components/government/ExecutiveCommandTheaterV2Viewer';
import { ConstitutionalHarmonyAuditorViewer } from './components/government/ConstitutionalHarmonyAuditorViewer';

// RC80: Digital State Infrastructure & Capability Kernel
import { KernelNamespaceManagerViewer } from './components/kernel/KernelNamespaceManagerViewer';
import { CapabilityKernelViewer } from './components/kernel/CapabilityKernelViewer';
import { VirtualProcessTableViewer } from './components/kernel/VirtualProcessTableViewer';
import { UnifiedTelemetryMatrixViewer } from './components/kernel/UnifiedTelemetryMatrixViewer';
import { RuntimeBusV2Viewer } from './components/kernel/RuntimeBusV2Viewer';
import { AgentRegistryV2Viewer } from './components/kernel/AgentRegistryV2Viewer';
import { FounderBootSequenceViewer } from './components/kernel/FounderBootSequenceViewer';
import { GovernmentRuntimeObservatoryViewer } from './components/kernel/GovernmentRuntimeObservatoryViewer';
import { ResourceGovernorViewer } from './components/kernel/ResourceGovernorViewer';
import { CapabilityConstitutionAuditorViewer } from './components/kernel/CapabilityConstitutionAuditorViewer';

// RC81: Operational Doctrine & Longevity Architecture
import { OperationalDoctrineViewer } from './components/operational/OperationalDoctrineViewer';
import { DependencyGraphGuardianViewer } from './components/operational/DependencyGraphGuardianViewer';
import { ServiceOwnershipRegistryViewer } from './components/operational/ServiceOwnershipRegistryViewer';
import { RecoveryReinforcementMatrixViewer } from './components/operational/RecoveryReinforcementMatrixViewer';
import { RuntimeContinuityMeshViewer } from './components/operational/RuntimeContinuityMeshViewer';
import { ImmutableJournalFederationViewer } from './components/operational/ImmutableJournalFederationViewer';
import { ExecutiveOperationsBoardViewer } from './components/operational/ExecutiveOperationsBoardViewer';
import { AutonomousMaintenanceRotationViewer } from './components/operational/AutonomousMaintenanceRotationViewer';
import { OperationalInvariantsEngineViewer } from './components/operational/OperationalInvariantsEngineViewer';
import { LongLifeForecastEngineViewer } from './components/operational/LongLifeForecastEngineViewer';

// RC85 Intelligence & Hermes Suite
import { ExecutiveIntelligencePopup } from './components/intelligence/ExecutiveIntelligencePopup';
import { AsyIntelligenceCenterViewer } from './components/intelligence/AsyIntelligenceCenterViewer';
import { HermesControlPlaneViewer } from './components/hermes/HermesControlPlaneViewer';

// RC86 Administrative Intelligence & Task Completion Engine
import { HermesAdministrativeSuiteViewer } from './components/hermes/HermesAdministrativeSuiteViewer';
import { AdministrativeTaskOrchestratorViewer } from './components/hermes/AdministrativeTaskOrchestratorViewer';
import { AdminServiceQualityBoardViewer } from './components/hermes/AdminServiceQualityBoardViewer';
import { FounderAdminCommandCenterViewer } from './components/hermes/FounderAdminCommandCenterViewer';
import { HermesDryRunSimulatorViewer } from './components/hermes/HermesDryRunSimulatorViewer';

// RC87 Adaptive Workflow Intelligence & Continuity Engine
import { HermesAdaptiveSuiteViewer } from './components/hermes/HermesAdaptiveSuiteViewer';
import { AdaptiveAdminQualityBoardViewer } from './components/hermes/AdaptiveAdminQualityBoardViewer';
import { PauseResumeContinuityViewer } from './components/hermes/PauseResumeContinuityViewer';
import { WorkflowAdaptationViewer } from './components/hermes/WorkflowAdaptationViewer';
import { HermesAdaptiveDryRunLabViewer } from './components/hermes/HermesAdaptiveDryRunLabViewer';

// RC88 Operational Intelligence & Governance Foundation
import { RC88GovernanceSuiteViewer } from './components/governance/RC88GovernanceSuiteViewer';
import { OperationalHealthViewer } from './components/governance/OperationalHealthViewer';
import { FounderVerificationCenterViewer } from './components/governance/FounderVerificationCenterViewer';
import { GuardianIntegrityScannerViewer } from './components/governance/GuardianIntegrityScannerViewer';
import { ExecutiveGovernanceJournalViewer } from './components/governance/ExecutiveGovernanceJournalViewer';

// RC89 Smart Office Enterprise Orchestration
import { RC89SmartOfficeWarRoomViewer } from './components/smartoffice/RC89SmartOfficeWarRoomViewer';
import { SmartOfficeWorkspaceViewer } from './components/smartoffice/SmartOfficeWorkspaceViewer';
import { UnifiedAdministrativeQueueViewer } from './components/smartoffice/UnifiedAdministrativeQueueViewer';
import { SmartDocumentCenterViewer } from './components/smartoffice/SmartDocumentCenterViewer';
import { AdministrativeTimelineViewer } from './components/smartoffice/AdministrativeTimelineViewer';
import { CrossModuleConsistencyAuditorViewer } from './components/smartoffice/CrossModuleConsistencyAuditorViewer';

// RC90 Enterprise Engine Contract & AI Asy Executive Intelligence
import { RC90ExecutiveIntelligenceWarRoomViewer } from './components/executive/RC90ExecutiveIntelligenceWarRoomViewer';
import { ExecutiveIntelligenceHubViewer } from './components/executive/ExecutiveIntelligenceHubViewer';
import { SituationReportViewer } from './components/executive/SituationReportViewer';
import { ExecutiveQuestionConsoleViewer } from './components/executive/ExecutiveQuestionConsoleViewer';
import { EngineContractRegistryViewer } from './components/executive/EngineContractRegistryViewer';
import { CapabilityRegistryViewer } from './components/executive/CapabilityRegistryViewer';

// RC91 Enterprise Offline Continuity & Disaster Resilience
import { OfflineContinuityManagerViewer } from './components/offline/OfflineContinuityManagerViewer';
import { SafeSyncQueueViewer } from './components/offline/SafeSyncQueueViewer';
import { ConflictResolutionViewer } from './components/offline/ConflictResolutionViewer';
import { LocalSnapshotCacheViewer } from './components/offline/LocalSnapshotCacheViewer';
import { ConnectivityIntelligenceViewer } from './components/offline/ConnectivityIntelligenceViewer';
import { RecoveryReplayViewer } from './components/offline/RecoveryReplayViewer';
import { OfflineReadinessDashboardViewer } from './components/offline/OfflineReadinessDashboardViewer';
import { DisasterContinuitySimulatorViewer } from './components/offline/DisasterContinuitySimulatorViewer';
import { OfflineIntegrityAuditorViewer } from './components/offline/OfflineIntegrityAuditorViewer';
import { RC91OfflineWarRoomViewer } from './components/offline/RC91OfflineWarRoomViewer';

// RC92 Guardian Policy Engine & Constitution Compiler
import { GuardianPolicyRegistryViewer } from './components/guardian/GuardianPolicyRegistryViewer';
import { PolicyEvaluationViewer } from './components/guardian/PolicyEvaluationViewer';
import { ConstitutionCompilerViewer } from './components/guardian/ConstitutionCompilerViewer';
import { BuildGateValidatorViewer } from './components/guardian/BuildGateValidatorViewer';
import { RuntimePolicyMonitorViewer } from './components/guardian/RuntimePolicyMonitorViewer';
import { GuardianExceptionJournalViewer } from './components/guardian/GuardianExceptionJournalViewer';
import { PolicySimulatorViewer } from './components/guardian/PolicySimulatorViewer';
import { ConstitutionDiffViewer } from './components/guardian/ConstitutionDiffViewer';
import { SovereignGovernanceBoardViewer } from './components/guardian/SovereignGovernanceBoardViewer';
import { RC92GuardianWarRoomViewer } from './components/guardian/RC92GuardianWarRoomViewer';

// RC93 Digital Companion Ecosystem (R751 - R760)
import { ParentDigitalCompanionViewer } from './components/companion/ParentDigitalCompanionViewer';
import { TeacherDigitalCompanionViewer } from './components/companion/TeacherDigitalCompanionViewer';
import { ExecutiveCompanionViewer } from './components/companion/ExecutiveCompanionViewer';
import { CompanionMemoryViewer } from './components/companion/CompanionMemoryViewer';
import { ConversationContextViewer } from './components/companion/ConversationContextViewer';
import { SmartReminderViewer } from './components/companion/SmartReminderViewer';
import { CompanionInsightCardsViewer } from './components/companion/CompanionInsightCardsViewer';
import { InteractionTimelineViewer } from './components/companion/InteractionTimelineViewer';
import { CompanionPrivacyGuardViewer } from './components/companion/CompanionPrivacyGuardViewer';
import { RC93CompanionWarRoomViewer } from './components/companion/RC93CompanionWarRoomViewer';

// RC94 Sovereign Operations & Offline Continuity (R761 - R770)
import { OfflineContinuityEngineViewer } from './components/sovereign/OfflineContinuityEngineViewer';
import { FounderCommandPaletteViewer } from './components/sovereign/FounderCommandPaletteViewer';
import { GuardianContinuousVerificationViewer } from './components/sovereign/GuardianContinuousVerificationViewer';
import { SovereignSessionIntelligenceViewer } from './components/sovereign/SovereignSessionIntelligenceViewer';
import { OfflineCompanionCacheViewer } from './components/sovereign/OfflineCompanionCacheViewer';
import { SyncReconciliationViewer } from './components/sovereign/SyncReconciliationViewer';
import { GuardianHealthDashboardViewer } from './components/sovereign/GuardianHealthDashboardViewer';
import { DiscoveryIntegrityScannerViewer } from './components/sovereign/DiscoveryIntegrityScannerViewer';
import { RecoveryReadinessSimulatorViewer } from './components/sovereign/RecoveryReadinessSimulatorViewer';
import { RC94SovereignWarRoomViewer } from './components/sovereign/RC94SovereignWarRoomViewer';

// RC95 Digital Government Foundation (R771 - R780)
import { ConstitutionalPolicyEngineViewer } from './components/digitalGov/ConstitutionalPolicyEngineViewer';
import { DigitalSignatureReadinessViewer } from './components/digitalGov/DigitalSignatureReadinessViewer';
import { ImmutableGovernanceJournalViewer } from './components/digitalGov/ImmutableGovernanceJournalViewer';
import { CrossModuleAuditCorrelationViewer } from './components/digitalGov/CrossModuleAuditCorrelationViewer';
import { FounderDecisionLedgerViewer } from './components/digitalGov/FounderDecisionLedgerViewer';
import { GovernmentOperationsDashboardViewer } from './components/digitalGov/GovernmentOperationsDashboardViewer';
import { ConstitutionalConflictDetectorViewer } from './components/digitalGov/ConstitutionalConflictDetectorViewer';
import { InstitutionalApprovalWorkflowViewer } from './components/digitalGov/InstitutionalApprovalWorkflowViewer';
import { GovernanceEvidenceExplorerViewer } from './components/digitalGov/GovernanceEvidenceExplorerViewer';
import { RC95GovernmentWarRoomViewer } from './components/digitalGov/RC95GovernmentWarRoomViewer';

// RC96A Asy Living 3D Mascot Foundation (R781 - R790)
import { AsyAssetViewer } from './components/mascot3d/AsyAssetViewer';
import { AsyAnimationViewer } from './components/mascot3d/AsyAnimationViewer';
import { AsyTriggerViewer } from './components/mascot3d/AsyTriggerViewer';
import { AsyPerformanceViewer } from './components/mascot3d/AsyPerformanceViewer';
import { AsyAccessibilityViewer } from './components/mascot3d/AsyAccessibilityViewer';
import { RC96AAsyWarRoomViewer } from './components/mascot3d/RC96AAsyWarRoomViewer';

// RC97 Asy Emotional Intelligence & Contextual Life (R791 - R800)
import { CompanionEmotionDashboard } from './components/mascot3d/CompanionEmotionDashboard';
import { RC97LivingAsyWarRoomViewer } from './components/mascot3d/RC97LivingAsyWarRoomViewer';

// RC98 Asy Micro-Interaction Masterpiece (R801 - R810)
import { OneHandUXValidator } from './components/mascot3d/OneHandUXValidator';
import { RC98LivingAsyWarRoomViewer } from './components/mascot3d/RC98LivingAsyWarRoomViewer';

// RC99 Asy Central Intelligence & Creator Ecosystem (R811 - R820)
import { LivingActivityCenter } from './components/creator/LivingActivityCenter';
import { PhotoLabEnhancer } from './components/creator/PhotoLabEnhancer';
import { StoryStudioExpress } from './components/creator/StoryStudioExpress';
import { TemplateIntelligenceHub } from './components/creator/TemplateIntelligenceHub';
import { TrendIntelligenceCenter } from './components/creator/TrendIntelligenceCenter';
import { CreatorDownloadCenter } from './components/creator/CreatorDownloadCenter';
import { InnovationLabViewer } from './components/creator/InnovationLabViewer';
import { RC99CreatorWarRoomViewer } from './components/creator/RC99CreatorWarRoomViewer';

// RC100 Living Digital School (R821 - R830)
import { DigitalTownHallViewer } from './components/living/DigitalTownHallViewer';
import { AsyCabinetViewer } from './components/living/AsyCabinetViewer';
import { GuardianCabinetViewer } from './components/living/GuardianCabinetViewer';
import { HermesCabinetViewer } from './components/living/HermesCabinetViewer';
import { AsyVoiceStudioViewer } from './components/living/AsyVoiceStudioViewer';
import { LivingCharacterViewer } from './components/living/LivingCharacterViewer';
import { SituationalAwarenessViewer } from './components/living/SituationalAwarenessViewer';
import { IntelligenceCouncilViewer } from './components/living/IntelligenceCouncilViewer';
import { RC100LivingSchoolWarRoomViewer } from './components/living/RC100LivingSchoolWarRoomViewer';

// RC101 Operational Excellence (R831 - R840)
import { MasterCharacterViewer } from './components/operational/MasterCharacterViewer';
import { SchoolActivityCenterPro } from './components/operational/SchoolActivityCenterPro';
import { PhotoLabProPlus } from './components/operational/PhotoLabProPlus';
import { StoryStudioViral } from './components/operational/StoryStudioViral';
import { SmartTeachingLibrary } from './components/operational/SmartTeachingLibrary';
import { HermesDigitalVaultViewer } from './components/operational/HermesDigitalVaultViewer';
import { ParentEngagementDashboard } from './components/operational/ParentEngagementDashboard';
import { LivingSchoolModeViewer } from './components/operational/LivingSchoolModeViewer';
import { EvolutionIntelligenceViewer } from './components/operational/EvolutionIntelligenceViewer';
import { RC101OperationalWarRoomViewer } from './components/operational/RC101OperationalWarRoomViewer';

// RC102 Autonomous Reliability & Production Readiness (R841 - R850)
import { NationalTaskOrchestratorViewer } from './components/reliability/NationalTaskOrchestratorViewer';
import { SmartQueueDashboard } from './components/reliability/SmartQueueDashboard';
import { AutomationCenterViewer } from './components/reliability/AutomationCenterViewer';
import { DailyHealthInspectorViewer } from './components/reliability/DailyHealthInspectorViewer';
import { AutonomousDigitalVaultViewer } from './components/reliability/AutonomousDigitalVaultViewer';
import { PhotoLabBatchViewer } from './components/reliability/PhotoLabBatchViewer';
import { StoryStudioBatchViewer } from './components/reliability/StoryStudioBatchViewer';
import { PrincipalExecutiveDashboard } from './components/reliability/PrincipalExecutiveDashboard';
import { GuardianStressTestViewer } from './components/reliability/GuardianStressTestViewer';
import { RC102ReliabilityWarRoomViewer } from './components/reliability/RC102ReliabilityWarRoomViewer';

// RC103 Go-Live Governance & Operational Trust (R851 - R860)
import { GuardianPolicyCenterViewer } from './components/governance/GuardianPolicyCenterViewer';
import { AuditTimelineExplorerViewer } from './components/governance/AuditTimelineExplorerViewer';
import { SchoolCommandCenterViewer } from './components/governance/SchoolCommandCenterViewer';
import { OperationalKPIEngineViewer } from './components/governance/OperationalKPIEngineViewer';
import { SmartIncidentManagerViewer } from './components/governance/SmartIncidentManagerViewer';
import { FounderGovernanceConsoleViewer } from './components/governance/FounderGovernanceConsoleViewer';
import { ComplianceReadinessCenterViewer } from './components/governance/ComplianceReadinessCenterViewer';
import { OfflineSyncAssuranceViewer } from './components/governance/OfflineSyncAssuranceViewer';
import { LivingPerformanceProfilerViewer } from './components/governance/LivingPerformanceProfilerViewer';
import { RC103GovernanceWarRoomViewer } from './components/governance/RC103GovernanceWarRoomViewer';

// RC104 Business Continuity & Operational Intelligence (R861 - R870)
import { ContinuityCommandEngineViewer } from './components/continuity/ContinuityCommandEngineViewer';
import { PredictiveHealthIntelligenceViewer } from './components/continuity/PredictiveHealthIntelligenceViewer';
import { GuardianRiskObservatoryViewer } from './components/continuity/GuardianRiskObservatoryViewer';
import { SmartRecoveryCoordinatorViewer } from './components/continuity/SmartRecoveryCoordinatorViewer';
import { SchoolOperationsTimelineViewer } from './components/continuity/SchoolOperationsTimelineViewer';
import { ExecutiveDecisionCenterViewer } from './components/continuity/ExecutiveDecisionCenterViewer';
import { CapacityForecastEngineViewer } from './components/continuity/CapacityForecastEngineViewer';
import { OfflineMissionControlViewer } from './components/continuity/OfflineMissionControlViewer';
import { FounderIntelligenceBriefingViewer } from './components/continuity/FounderIntelligenceBriefingViewer';
import { RC104ContinuityWarRoomViewer } from './components/continuity/RC104ContinuityWarRoomViewer';

// GLC-1 Production Certification & Go-Live Candidate (G901 - G910)
import { FunctionalValidationViewer } from './components/golive/FunctionalValidationViewer';
import { GuardianSecurityValidationViewer } from './components/golive/GuardianSecurityValidationViewer';
import { PerformanceCertificationViewer } from './components/golive/PerformanceCertificationViewer';
import { OfflineSyncCertificationViewer } from './components/golive/OfflineSyncCertificationViewer';
import { HermesRecoveryCertificationViewer } from './components/golive/HermesRecoveryCertificationViewer';
import { MobileProductionCertificationViewer } from './components/golive/MobileProductionCertificationViewer';
import { FounderAcceptanceSuiteViewer } from './components/golive/FounderAcceptanceSuiteViewer';
import { DocumentationSopViewer } from './components/golive/DocumentationSopViewer';
import { ProductionDeploymentPackageViewer } from './components/golive/ProductionDeploymentPackageViewer';
import { GoLiveControlTowerViewer } from './components/golive/GoLiveControlTowerViewer';

// MCA-1 Master Character Code Integration (R911 - R920)
import { MasterCharacterCanonViewer } from './components/mascot/MasterCharacterCanonViewer';
import { MascotOverlay } from './components/mascot/MascotOverlay';

// MCA-2 Living Character Runtime (R921 - R930)
import { FounderAnimationPreview } from './components/mascot/FounderAnimationPreview';

// MCA-3 Official Character Production Pipeline (R931 - R940)
import { LivingCharacterPreview } from './components/mascot/LivingCharacterPreview';

// Sprint G2 Parent Adoption & Operational Intelligence
import { SmartParentWelcomeModal } from './components/parent/SmartParentWelcomeModal';
import { FounderAdoptionConsole } from './components/sim/FounderAdoptionConsole';
import { adoptionAnalyticsService } from './services/adoptionAnalyticsService';

// Sprint G3 Founder Office Phase-1 & Sovereign Tools
import { FounderOfficeDashboard } from './components/founder/FounderOfficeDashboard';
import { FounderOfficeOverlay } from './components/founder/FounderOfficeOverlay';
import { SmartUploadCommander } from './components/media/SmartUploadCommander';
import { CreativeStudioFactory } from './components/creative/CreativeStudioFactory';
import { TIBFoundation } from './components/tib/TIBFoundation';
import { CabinetResolutionTracker } from './components/founder/CabinetResolutionTracker';
import { FounderCommandRecorderViewer } from './components/founder/FounderCommandRecorderViewer';

// Sprint G10 Alumni Universe & Taman Kenangan
import { AlumniGarden } from './components/alumni/AlumniGarden';

// Sprint G13 Pusat Aset TADE
import { PusatAsetTADE } from './components/assets/PusatAsetTADE';

// Sprint G20 Pusat DNA Animasi & Suara Asy Syifa
import { PusatDnaAsySyifaHub } from './components/dna/PusatDnaAsySyifaHub';
import { RainbowGateModal } from './components/dna/RainbowGateModal';
import { FarewellToastModal } from './components/dna/FarewellToastModal';

// Sprint G21 Studio Kamera Ajaib Asy & Syifa
import { StudioKameraAjaibHub } from './components/camera/StudioKameraAjaibHub';

// Sprint G22 Sutradara Ajaib Asy & Syifa
import { SutradaraAjaibHub } from './components/director/SutradaraAjaibHub';

// Sprint G23 Kota Mini Profesi Asy
import { KotaMiniProfesiHub } from './components/city/KotaMiniProfesiHub';

// Sprint G24 Rumah Kreatif Asy
import { RumahKreatifAsyHub } from './components/creative/RumahKreatifAsyHub';

// Sprint G25 Hari Besar Otomatis & Langit Hidup
import { HariBesarOtomatisHub } from './components/events/HariBesarOtomatisHub';

// Sprint G26 Bioskop Langit Asy & Syifa
import { BioskopLangitHub } from './components/cinema/BioskopLangitHub';

// Sprint G27 Kapal Awan & Pulau Petualangan
import { KapalAwanHub } from './components/adventure/KapalAwanHub';

// Sprint G28 Peta Dunia TADE
import { PetaDuniaHub } from './components/world/PetaDuniaHub';

// Sprint G29 Sekolah Bernapas
import { SekolahBernapasHub } from './components/school/SekolahBernapasHub';

// Sprint G30 Lorong Kenangan Asy & Syifa
import { LorongKenanganHub } from './components/memory/LorongKenanganHub';

// Sprint G31 Keluarga Sahabat Asy & Syifa
import { KeluargaSahabatHub } from './components/sahabat/KeluargaSahabatHub';

// Sprint G31 Makan Bergizi Gratis (MBG) Ceria
import { MbgCeriaHub } from './components/mbg/MbgCeriaHub';

// Sprint G32 Pagi Ceria di TK Asy Syifa
import { PagiCeriaHub } from './components/morning/PagiCeriaHub';

// Sprint G33 Kelas Hidup & Sentra Ceria PAUD
import { KelasHidupHub } from './components/classroom/KelasHidupHub';

// Sprint G34 Jam Bermain Ceria & Taman Petualangan TK Asy Syifa
import { TamanPetualanganHub } from './components/playground/TamanPetualanganHub';

// Sprint G35 Pulang Ceria & Gerbang Perpisahan TK Asy Syifa
import { PulangCeriaHub } from './components/dismissal/PulangCeriaHub';

// Sprint G36 Perpustakaan Ajaib & Kereta Buku TK Asy Syifa
import { PerpustakaanAjaibHub } from './components/library/PerpustakaanAjaibHub';

// Sprint G37 Aula Impian & Panggung Serbaguna TK Asy Syifa
import { AulaImpianHub } from './components/hall/AulaImpianHub';

// Sprint G38 Pawai Nusantara & Kampung Indonesia TK Asy Syifa
import { PawaiNusantaraHub } from './components/nusantara/PawaiNusantaraHub';

// Sprint G39 Hari Pasar Ceria & Koperasi Mini TK Asy Syifa
import { HariPasarHub } from './components/market/HariPasarHub';

// Sprint G40 Kebun Ajaib & Panen Berkah TK Asy Syifa
import { KebunAjaibHub } from './components/garden/KebunAjaibHub';

// Sprint G41 Masjid Al-Barakah Hidup & Kampung Shalih
import { MasjidAlBarakahHub } from './components/spiritual/MasjidAlBarakahHub';

// Sprint G42 Kampung Gotong Royong & Hari Bakti Ceria
import { KampungGotongRoyongHub } from './components/community/KampungGotongRoyongHub';

const isSimPath = (pathname: string): boolean => {
  return pathname === '/sim' || pathname.startsWith('/sim/') || pathname.startsWith('/sim?');
};

function AppContent() {
  const { currentUser, isLoading: isAuthLoading } = useAuth();

  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname || '/';
        const params = new URLSearchParams(window.location.search);
        const urlTab = params.get('tab');

        if (isSimPath(path)) {
          if (urlTab) return urlTab;
          const savedSimTab = localStorage.getItem('tade_sim_tab') || sessionStorage.getItem('tade_sim_tab');
          if (savedSimTab) return savedSimTab;
          return 'r1';
        } else {
          if (urlTab) return urlTab;
          const savedWebTab = localStorage.getItem('tade_website_tab') || sessionStorage.getItem('tade_website_tab');
          if (savedWebTab) return savedWebTab;
          return 'w1';
        }
      }
    } catch {
      // safe fallback
    }
    return 'w1';
  });
  const [previousTab, setPreviousTab] = useState<string | undefined>(undefined);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
        return !sessionStorage.getItem('tade_splash_shown_v971');
      }
    } catch {
      // safe fallback
    }
    return false;
  });
  const [showOpeningExperience, setShowOpeningExperience] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
        return !sessionStorage.getItem('tade_opening_seen');
      }
    } catch {
      // safe fallback
    }
    return false;
  });

  // Keep state synchronized on browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const pathname = window.location.pathname || '/';
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab');
      setCurrentPath(pathname);

      if (isSimPath(pathname)) {
        const targetTab = urlTab || localStorage.getItem('tade_sim_tab') || 'r1';
        setActiveTab(targetTab);
      } else {
        const targetTab = urlTab || localStorage.getItem('tade_website_tab') || 'w1';
        setActiveTab(targetTab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('tade_splash_shown_v971', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  // Deep-linking from Push Notification Clicks & URL parameters (?tab=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const targetTab = params.get('tab');
      const refSource = params.get('ref') || 'direct_url';
      if (targetTab) {
        handleTabChange(targetTab);
        adoptionAnalyticsService.trackDeepLinkOpened(targetTab, refSource);
      }
    } catch {
      // Ignored
    }

    // Service Worker postMessage handler for notification clicks in foreground/active window
    if ('serviceWorker' in navigator) {
      const handleSwMessage = (event: MessageEvent) => {
        if (event.data?.type === 'NOTIFICATION_CLICK' && event.data?.url) {
          try {
            const url = new URL(event.data.url, window.location.origin);
            const targetTab = url.searchParams.get('tab');
            if (targetTab) {
              handleTabChange(targetTab);
              adoptionAnalyticsService.trackNotificationClick(targetTab);
              adoptionAnalyticsService.trackDeepLinkOpened(targetTab, 'push_notification');
            }
          } catch (e) {
            console.error('Error handling notification click message:', e);
          }
        }
      };
      navigator.serviceWorker.addEventListener('message', handleSwMessage);
      return () => navigator.serviceWorker.removeEventListener('message', handleSwMessage);
    }
  }, []);

  const handleTabChange = (newTab: string) => {
    const isSIM = (newTab || '').startsWith('r') || (newTab || '').startsWith('g') || (newTab || '').startsWith('mca') || newTab === 'policy_center' || newTab === 'governance_war_room' || newTab === 'continuity_war_room' || newTab === 'golive_control_tower' || newTab === 'master_character_canon';
    const isCurrentlySIM = isSimPath(currentPath);

    if (newTab === activeTab && isSIM === isCurrentlySIM) return;
    setPreviousTab(activeTab);
    setActiveTab(newTab);
    setIsNavigating(true);

    try {
      if (typeof window !== 'undefined') {
        if (isSIM) {
          setCurrentPath('/sim');
          localStorage.setItem('tade_sim_tab', newTab);
          sessionStorage.setItem('tade_sim_tab', newTab);
          const targetUrl = newTab === 'r1' ? '/sim' : `/sim?tab=${newTab}`;
          if (window.location.pathname !== '/sim' || window.location.search !== (newTab === 'r1' ? '' : `?tab=${newTab}`)) {
            window.history.pushState({ path: '/sim', tab: newTab }, '', targetUrl);
          }
        } else {
          setCurrentPath('/');
          localStorage.setItem('tade_website_tab', newTab);
          sessionStorage.setItem('tade_website_tab', newTab);
          const targetUrl = newTab === 'w1' ? '/' : `/?tab=${newTab}`;
          if (window.location.pathname !== '/' || window.location.search !== (newTab === 'w1' ? '' : `?tab=${newTab}`)) {
            window.history.pushState({ path: '/', tab: newTab }, '', targetUrl);
          }
        }
      }
    } catch {
      // safe fallback
    }
  };

  const handleEnterWorld = () => {
    setShowOpeningExperience(false);
    sessionStorage.setItem('tade_opening_seen', 'true');
  };

  // Helper to render SIM Module Content
  const renderSIMModule = (moduleCode: string) => {
    switch (moduleCode) {
      case 'r1': return <R1Dashboard onSelectModule={handleTabChange} />;
      case 'r2': return <R2UserRBAC />;
      case 'r3': return <R3DataSiswa />;
      case 'r4': return <R4DataGuru />;
      case 'r5': return <R5KelompokKelas />;
      case 'r6': return <R6PresensiSiswa />;
      case 'r7': return <R7PresensiGuru />;
      case 'r8': return <R8Erapor />;
      case 'r9': return <R9Anekdot />;
      case 'r10': return <R10SPPTagihan />;
      case 'r11': return <R11PembayaranKwitansi />;
      case 'r12': return <R12LaporanKeuangan />;
      case 'r13': return <R13VerifikasiPPDB />;
      case 'r14': return <R14SmartArchive />;
      case 'r15': return <R15PengumumanInternal />;
      case 'r16': return <R16SmartDocumentFactory />;
      case 'r17': return <R17TahfidzDoa />;
      case 'r18': return <R18InventarisSarpras />;
      case 'r19': return <R19PerpustakaanAPE />;
      case 'r20': return <R20LayananKMS />;
      case 'r21': return <R21Ekstrakurikuler />;
      case 'r22': return <R22CMSWebsite />;
      case 'r23': return <R23PengaturanWebsite />;
      case 'r24': return <R24AuditLog />;
      case 'r25': return <R35BackupRecoveryCenter />;
      case 'r26': return <R26PetaZonasi />;
      case 'r27': return <R27MenuCatering />;
      case 'r28': return <R28AntarJemput />;
      case 'r29': return <R29PortalWaliMurid onSelectModule={handleTabChange} />;
      case 'r30': return <R30PortalGuru onSelectModule={handleTabChange} />;
      case 'r31': return <R31PortalKepsek onSelectModule={handleTabChange} />;
      case 'r32': return <R32SystemMaintenance />;
      case 'r33': return <R33AISearchKnowledge />;
      case 'r34': return <R34SelfHealthCheck />;
      case 'r35': return <R35BackupRecoveryCenter />;
      case 'r36': return <R36AIOperatingSystem />;
      case 'r37': return <R37EnterprisePatchGovernance />;
      case 'r38': return <R38EnterpriseObservability />;
      case 'r39': return <R39EnterpriseSelfDiagnostic />;
      case 'r40': return <R40EnterpriseRecoveryValidation />;
      case 'r41': return <R41EnterpriseConfigGovernance />;
      case 'r42': return <R42EnterpriseDocCenter />;
      case 'r43': return <R43EnterpriseDocLifecycleEngine />;
      case 'r44': return <R44EnterpriseTemplateLibrary />;
      case 'r45': return <R45EnterpriseDocGenEngine />;
      case 'r46': return <R46EnterpriseDigitalIdentity />;
      case 'r47': return <R47EnterpriseMasterDataSyncEngine />;
      case 'r48': return <R48EnterpriseAttachmentRegistry />;
      case 'r49': return <R49EnterpriseKnowledgeGraph />;
      case 'r50': return <R50EnterprisePdfPrintComposer />;
      case 'r51': return <R51EnterpriseApprovalDigitalSignature />;
      case 'r52': return <R52EnterpriseQRVerification />;
      case 'r53': return <R53EnterpriseSmartDocumentIntake />;
      case 'r54': return <R54EnterpriseCommunicationHub />;
      case 'r55': return <R55EnterpriseGoLiveReadiness />;
      case 'r56': return <R56EnterpriseLicenseManager />;
      case 'r57': return <R57EnterpriseOperationsCenter />;
      case 'r58': return <R58DeviceHardwareGuardian />;
      case 'r63': return <R63ExecutiveLivingWorkspace />;
      case 'r65': return <R65SchoolActivityCenter />;
      case 'r68': return <R68AdminLivingWorkspace />;
      case 'r70': return <R70ExecutiveMissionControl />;
      case 'r71': return <R71AIAsyWorkflowOrchestrator />;
      case 'r80': return <PilotModeCenter />;
      case 'r81': return <DailyOperationCompanion />;
      case 'r82': return <GuardianGoLiveChecklist />;
      case 'r83': return <OperatorTrainingAcademy />;
      case 'r84': return <UniversalQRLiveDeployment />;
      case 'r85': return <AIAsyReceptionist />;
      case 'r94': return <MediaContentStudio />;
      case 'r86': return <GuardianPrintCenter />;
      case 'r87': return <OfflineFirstValidation />;
      case 'r88': return <VoiceIdentityStudio />;
      case 'r89': return <ExecutiveLaunchDashboard />;
      case 'r90': return <DiscoveryRegistryCenter />;
      case 'r91': return <DekAsyLivingRuntime />;
      case 'r92': return <RoleAdaptiveBundleManager />;
      case 'r93': return <LivingParentWorld />;
      case 'r95': return <LivingTeacherWorld />;
      case 'r96': return <LivingExecutiveWorld />;
      case 'r97': return <OperationsAIActionDock />;
      case 'r98': return <LivingBannerNusantara3D />;
      case 'r99': return <IntelligentChunkEngineManager />;
      case 'r100': return <PerformanceGuardianDashboard />;
      case 'r101': return <ExecutiveLiteModeWorkspace />;
      case 'r102': return <OperationsUltraWorkspace onSelectModule={handleTabChange} />;
      case 'r103': return <PresidentialUltraWorkspace onSelectModule={handleTabChange} />;
      case 'r104': return <LivingMessengerEnterprise />;
      case 'r106': return <UniversalQREvolution />;
      case 'r107': return <SchoolTVLivingChannel />;
      case 'r108': return <AIVoiceEverywhereStudio onSelectModule={handleTabChange} />;
      case 'r110': return <GuardianBundleAuditor />;
      case 'r111': return <SupremeCommandCenter onSelectModule={handleTabChange} />;
      case 'r112': return <CommandMissionEngine onSelectModule={handleTabChange} />;
      case 'r115': return <CommandMissionEngine onSelectModule={handleTabChange} />;
      case 'r119': return <TADEControlTower onSelectModule={handleTabChange} />;
      case 'r120': return <TenantOverview />;
      case 'r126': return <SystemFleetMonitor />;
      case 'r131': return <RootGuardianCenter onSelectModule={handleTabChange} />;
      case 'r132': return <AIAsyCommandConsole onSelectModule={handleTabChange} />;
      case 'r133': return <LicenseSuspendCenter />;
      case 'r134': return <EducationProfileEngine />;
      case 'r136': return <BreakGlassRecovery />;
      case 'r137': return <FuturePredictionCenter />;
      case 'r138': return <ConstitutionGuard />;
      case 'r139': return <FounderDashboard onSelectModule={handleTabChange} />;
      case 'r140': return <RootRecoveryCenter />;
      case 'r141': return <FounderFirstSetupWizard />;
      case 'r142': return <SmartLandingEngine onSelectModule={handleTabChange} />;
      case 'r143': return <PerformanceGateCenter />;
      case 'r144': return <FeatureGateCenter />;
      case 'r145': return <AsyCreativeStudio />;
      case 'r146': return <TADEMarketplace />;
      case 'r147': return <CustomerSuccessAI />;
      case 'r148': return <AutoMigrationCenter />;
      case 'r151': return <FounderInsightDashboard onSelectModule={handleTabChange} />;
      case 'r152': return <GlobalNotificationHub />;
      case 'r153': return <SchoolHealthCenter />;
      case 'r154': return <SmartAutomationCenter />;
      case 'r155': return <GuardianComplianceCenter />;
      case 'r156': return <AIAsyMemoryLayer />;
      case 'r157': return <AssetOptimizationEngine />;
      case 'r158': return <EnterpriseAnalytics />;
      case 'r159': return <GuardianMissionControl />;
      case 'r160': return <ZeroTouchMaintenanceCenter />;
      case 'r161': return <UnifiedAuditTimeline />;
      case 'r162': return <SchoolReadinessScore />;
      case 'r163': return <SmartDocumentLifecycle />;
      case 'r164': return <AIAsyOperationsCoach />;
      case 'r165': return <EnterpriseBackupObservatory />;
      case 'r166': return <CrossSchoolBenchmark />;
      case 'r167': return <CampusCommandCenter onSelectModule={handleTabChange} />;
      case 'r168': return <SmartParentTimeline />;
      case 'r169': return <TeacherProductivityHub />;
      case 'r170': return <DigitalCampusMap />;
      case 'r171': return <AIAsyKnowledgeAssistant />;
      case 'r172': return <SmartVisitorExperience />;
      case 'r173': return <ExecutiveFinanceSnapshot />;
      case 'r174': return <DigitalCampusExperience />;
      case 'r175': return <SchoolOperatingDashboard onSelectModule={handleTabChange} />;
      case 'r176': return <SmartCommunicationCenter />;
      case 'r177': return <DigitalClassroomPulse />;
      case 'r178': return <IntelligentResourceCenter />;
      case 'r179': return <AIAsyDailyBriefing />;
      case 'r180': return <SchoolEventCommand />;
      case 'r181': return <ExecutiveOperationsSnapshot />;
      case 'r182': return <AdaptiveExperienceEngine />;
      case 'r183': return <StudentGrowthIntelligence />;
      case 'r184': return <ParentEngagementCenter />;
      case 'r185': return <TeacherPlanningStudio />;
      case 'r186': return <AIAsyCurriculumAssistant />;
      case 'r187': return <DigitalArchiveIntelligence />;
      case 'r188': return <SchoolReputationDashboard />;
      case 'r189': return <ExecutiveDecisionCenter />;
      case 'r190': return <AdaptiveLearningExperience />;
      case 'r191': return <SchoolOperationsAutomationHub />;
      case 'r192': return <SmartAttendanceIntelligence />;
      case 'r193': return <AIAsyParentCompanion />;
      case 'r194': return <SchoolResourcePlanner />;
      case 'r195': return <DigitalComplianceArchive />;
      case 'r196': return <ExecutiveRiskObservatory />;
      case 'r197': return <CommunityEngagementHub />;
      case 'r198': return <AdaptiveResilienceEngine />;
      case 'r207': return <GuardianHealthCenter />;
      case 'r208': return <MemoryLeakHunter />;
      case 'r209': return <StorageSentinel />;
      case 'r210': return <DatabaseHealthMonitor />;
      case 'r211': return <BackupHealthMonitor />;
      case 'r212': return <DeviceHealthSimulator />;
      case 'r213': return <LongLifeSimulation />;
      case 'r221': return <ChainOfCustodyCenter />;
      case 'r222': return <LegalEvidenceLedger />;
      case 'r223': return <DocumentVersionCenter />;
      case 'r224': return <PrintEvidenceCenter />;
      case 'r225': return <AuditReplayCenter />;
      case 'r226': return <PositionHistoryVault />;
      case 'r227': return <SuccessionCenter />;
      case 'r228': return <CredentialRotationCenter />;
      case 'r229': return <KnowledgeContinuityCenter />;
      case 'r230': return <AnnualTimeCapsule />;
      case 'r231': return <DataClassificationCenter />;
      case 'r232': return <RetentionPolicyCenter />;
      case 'r233': return <SmartArchiveTransition />;
      case 'r234': return <DestructionApprovalCenter />;
      case 'r235': return <RecordsComplianceDashboard />;
      case 'r236': return <AsyLivingCalendarEngine />;
      case 'r237': return <AsyWardrobeSystem />;
      case 'r238': return <CulturalAnimationEngine />;
      case 'r239': return <EducationCalendarEngine />;
      case 'r240': return <WeatherDaytimeEngine />;
      case 'r241': return <TotalSystemWarRoom />;
      case 'r378': return <GuardianSecurityCommandCenter />;
      case 'r379': return <CCTVSetupWizardEnterprise />;
      case 'r380': return <CameraHealthGuardian />;
      case 'r381': return <SmartIntruderTracking />;
      case 'r382': return <SecurityIncidentTimeline />;
      case 'r383': return <EvidenceVaultEnterprise />;
      case 'r384': return <ExecutiveSecurityBridge />;
      case 'r385': return <Golden10MinutesProtocol />;
      case 'r386': return <PoliceReadyEvidencePack />;
      case 'r387': return <GateGuardianProtocol />;
      case 'r388': return <ChildSafetyZone />;
      case 'r389': return <SecurityHealthLab />;
      case 'r390': return <QRCCTVPairingCard />;
      case 'r391': return <NeverLoseWorkEngine />;
      case 'r392': return <AIStudioExportGuardian />;
      case 'r393': return <OneEngineCrossPlatform />;
      case 'r394': return <SchoolDeploymentBridge />;
      case 'r395': return <GovOfficeFormulaEngine />;
      case 'r396': return <OneClickEmergencyGuardian />;
      case 'r397': return <SmartAssetMaintenance />;
      case 'r398': return <ParentPickupGuardian />;
      case 'r399': return <TADESelfHealingEngine />;
      case 'r400': return <FounderCommandCenter />;
      case 'r411': return <GuardianDailyAutopilot />;
      case 'r412': return <SmartSchoolScheduler />;
      case 'r413': return <GovernmentNumberingEngine />;
      case 'r414': return <BankingFormulaGuardian />;
      case 'r415': return <DocumentAutoValidation />;
      case 'r416': return <SmartReportGenerator />;
      case 'r417': return <ClassroomReadinessEngine />;
      case 'r418': return <GuardianNotificationMatrix />;
      case 'r419': return <OfficeQualityValidator />;
      case 'r420': return <ZeroManualRepetitionEngine />;
      case 'r421': return <OfficeFormulaCompatibilityEngine />;
      case 'r422': return <SmartMailWorkflow />;
      case 'r423': return <ExecutiveDashboardMorningBrief />;
      case 'r424': return <GovernmentLetterIntelligenceCenter />;
      case 'r425': return <BankingLedgerIntelligence />;
      case 'r426': return <CertificateDiplomaIntelligence />;
      case 'r427': return <GovernmentArchiveVault />;
      case 'r428': return <LegalStampSignatureCenter />;
      case 'r429': return <GovernmentPrintCenter />;
      case 'r430': return <OfficeFormulaVerificationEngine />;
      case 'r431': return <ExecutiveDocumentApprovalMatrix />;
      case 'r432': return <SmartOfficialMailTracker />;
      case 'r433': return <LegalComplianceCenter />;
      case 'r475': return <DigitalTwinCampusCenter />;
      case 'r476': return <LivingRoomIntelligence />;
      case 'r477': return <AsyLivingGuide />;
      case 'r478': return <CampusHeatMap />;
      case 'r479': return <LiveCCTVBridge />;
      case 'r480': return <SmartAssetLocator />;
      case 'r481': return <ClassroomReadinessLive />;
      case 'r482': return <FounderCommandMap />;
      case 'r483': return <SmartNavigationEngine onNavigate={handleTabChange} />;
      case 'r484': return <PerformanceSplitEngine />;
      case 'r495': return <AIAsyCommandCenter />;
      case 'r496': return <GuardianCommandCenter />;
      case 'r497': return <DualAICoordinationEngine />;
      case 'r498': return <FounderPreviewModeFinal />;
      case 'r499': return <SmartRouteMemoryV2 />;
      case 'r500': return <LivingTaskAutomationEngine />;
      case 'r501': return <GuardianIncidentCommander />;
      case 'r502': return <ExecutiveAIBridge />;
      case 'r503': return <HumanWorkloadOptimizer />;
      case 'r504': return <ConstitutionEnforcementEngine />;
      case 'r505': return <DualArchitectureSeparationEngine />;
      case 'r506': return <SecureRouteIsolation />;
      case 'r507': return <SecurityBoundaryFirewall />;
      case 'r508': return <SEOIsolationCenter />;
      case 'r509': return <SessionFortress />;
      case 'r510': return <BrowserSecurityFortress />;
      case 'r511': return <FirebaseSecurityFortress />;
      case 'r512': return <CacheIsolationEngine />;
      case 'r513': return <FounderPreviewSeparation />;
      case 'r514': return <SecurityWarRoomDashboard />;
      case 'r515': return <EnterpriseDeploymentCommandCenter />;
      case 'r517': return <BackupIndependenceCenter />;
      case 'r518': return <AIAsyLivingOperations />;
      case 'r519': return <GuardianContinuousSecurity />;
      case 'r520': return <SmartMaintenanceCalendar />;
      case 'r521': return <FounderExecutiveTimeline />;
      case 'r522': return <SchoolKnowledgeVault />;
      case 'r523': return <ProductionHealthObservatory />;
      case 'r524': return <FinalCandidatePreparationCenter />;
      case 'r525':
      case 'r526': return <UniversalHealingCore />;
      case 'r527': return <LivingWarRoomOperations />;
      case 'r528': return <GuardianDefenseLadder />;
      case 'r529': return <RecoverySwarmCoordination />;
      case 'r530': return <ExecutiveIncidentTheater />;
      case 'r531': return <ContinuousThreatObservatory />;
      case 'r532': return <SmartRecoveryPlaybook />;
      case 'r533': return <FounderCrisisTimeline />;
      case 'r534': return <GuardianResearchVault />;
      case 'r545': return <KernelProcessIsolation />;
      case 'r546': return <KernelProcessIsolation />;
      case 'r547': return <KernelSchedulerGovernor />;
      case 'r548': return <KernelMemoryGuardian />;
      case 'r549': return <KernelJournalService />;
      case 'r550': return <KernelPermissionMatrix />;
      case 'r551': return <KernelRecoverySwarmV2 />;
      case 'r552': return <KernelHeartbeatObservatory />;
      case 'r553': return <KernelIntegrityScanner />;
      case 'r554': return <KernelConstitutionGuardian />;
      case 'r555': return <KernelBootSequenceViewer />;
      case 'r556': return <EngineDependencyGraphViewer />;
      case 'r557': return <AdaptiveResourceSchedulerViewer />;
      case 'r558': return <KernelMemoryReclaimerViewer />;
      case 'r559': return <ImmutableAuditChainViewer />;
      case 'r560': return <DynamicPermissionEnforcerViewer />;
      case 'r561': return <RecoverySwarmMeshV3Viewer />;
      case 'r562': return <KernelPulseNetworkViewer />;
      case 'r563': return <IntegrityGuardianMatrixViewer />;
      case 'r564': return <ConstitutionEvolutionGuardianViewer />;
      case 'r565': return <KernelServiceLifecycleManagerViewer />;
      case 'r566': return <GuardianDependencySupervisorViewer />;
      case 'r567': return <AutonomousRecoveryPlannerViewer />;
      case 'r568': return <KernelHealthPropagationViewer />;
      case 'r569': return <SmartJournalReplayViewer />;
      case 'r570': return <PermissionDriftDetectorViewer />;
      case 'r571': return <RecoverySwarmCollectiveViewer />;
      case 'r572': return <KernelPerformanceObservatoryV2 />;
      case 'r573': return <ExecutiveOperationalTheaterViewer />;
      case 'r574': return <ConstitutionConsistencyAuditorViewer />;
      case 'r575': return <KernelEventBusViewer />;
      case 'r576': return <ServiceDependencyRecoveryMeshViewer />;
      case 'r577': return <AIAsyOperationalCopilotViewer />;
      case 'r578': return <GuardianThreatMatrixViewer />;
      case 'r579': return <ImmutableRecoveryLedgerViewer />;
      case 'r580': return <KernelWatchdogTimerViewer />;
      case 'r581': return <BrowserRuntimeSentinelViewer />;
      case 'r582': return <PerformanceBudgetGuardianViewer />;
      case 'r583': return <FounderDecisionConsoleViewer />;
      case 'r584': return <KernelStabilityAuditorViewer />;
      case 'r585': return <ImmortalStorageManagerViewer />;
      case 'r586': return <WALPersistenceEngineViewer />;
      case 'r587': return <SmartSnapshotSchedulerViewer />;
      case 'r588': return <BrowserCrashRecoveryViewer />;
      case 'r589': return <OfflineOperationManagerViewer />;
      case 'r590': return <RuntimeStateGuardianViewer />;
      case 'r591': return <DisasterRecoverySimulatorViewer />;
      case 'r592': return <GuardianStorageIntegrityViewer />;
      case 'r593': return <AIAsyRecoveryGuideViewer />;
      case 'r594': return <FounderDisasterCommandViewer />;
      case 'r595': return <GuardianControlPlaneViewer />;
      case 'r596': return <UnifiedTelemetryBusViewer />;
      case 'r597': return <AIAsyExecutiveIntelligenceViewer />;
      case 'r598': return <GuardianThreatCorrelatorViewer />;
      case 'r599': return <DistributedRecoveryCoordinatorViewer />;
      case 'r600': return <KernelTraceObservatoryViewer />;
      case 'r601': return <SecureSyncCoordinatorViewer />;
      case 'r602': return <FounderCommandTimelineV2Viewer />;
      case 'r603': return <OperationalGovernanceEngineViewer />;
      case 'r604': return <KernelFutureCompatibilityGuardViewer />;

      // RC78: Sovereign Government & Long-Life Operations
      case 'r605': return <SovereignCommandCenterViewer />;
      case 'r606': return <PrimeMinisterCabinetViewer />;
      case 'r607': return <MinisterAssistantNetworkViewer />;
      case 'r608': return <GuardianMilitaryCommandViewer />;
      case 'r609': return <CommanderAssistantNetworkViewer />;
      case 'r610': return <MicroAgentSwarmViewer />;
      case 'r611': return <ExecutiveEscalationChainViewer />;
      case 'r612': return <LongLifeOperationsViewer />;
      case 'r613': return <ExecutiveGovernmentTheaterViewer />;
      case 'r614': return <ConstitutionalEnforcementV2Viewer />;

      // RC79: Sovereign Civil Service & Autonomous Government
      case 'r615': return <CivilServiceRegistryViewer />;
      case 'r616': return <CivilServiceRegistryViewer />;
      case 'r617': return <CrossMinistryCollaborationViewer />;
      case 'r618': return <GovernmentWorkflowOrchestratorViewer />;
      case 'r619': return <GuardianMilitaryLogisticsViewer />;
      case 'r620': return <GuardianMilitaryLogisticsViewer />;
      case 'r621': return <ConstitutionalDecisionLedgerViewer />;
      case 'r622': return <GovernmentIntelligenceBoardViewer />;
      case 'r623': return <ExecutiveCommandTheaterV2Viewer />;
      case 'r624': return <ConstitutionalHarmonyAuditorViewer />;

      // RC80: Digital State Infrastructure & Capability Kernel
      case 'r625': return <KernelNamespaceManagerViewer />;
      case 'r626': return <CapabilityKernelViewer />;
      case 'r627': return <VirtualProcessTableViewer />;
      case 'r628': return <UnifiedTelemetryMatrixViewer />;
      case 'r629': return <RuntimeBusV2Viewer />;
      case 'r630': return <AgentRegistryV2Viewer />;
      case 'r631': return <FounderBootSequenceViewer />;
      case 'r632': return <GovernmentRuntimeObservatoryViewer />;
      case 'r633': return <ResourceGovernorViewer />;
      case 'r634': return <CapabilityConstitutionAuditorViewer />;

      // RC81: Operational Doctrine & Longevity Architecture
      case 'r635': return <OperationalDoctrineViewer />;
      case 'r636': return <DependencyGraphGuardianViewer />;
      case 'r637': return <ServiceOwnershipRegistryViewer />;
      case 'r638': return <RecoveryReinforcementMatrixViewer />;
      case 'r639': return <RuntimeContinuityMeshViewer />;
      case 'r640': return <ImmutableJournalFederationViewer />;
      case 'r641': return <ExecutiveOperationsBoardViewer />;
      case 'r642': return <AutonomousMaintenanceRotationViewer />;
      case 'r643': return <OperationalInvariantsEngineViewer />;
      case 'r644': return <LongLifeForecastEngineViewer />;
      
      // RC85 Sovereign Intelligence & Hermes Suite (R667 - R676)
      case 'r667': return <AsyIntelligenceCenterViewer />;
      case 'r668': return <AsyIntelligenceCenterViewer />;
      case 'r669': return <AsyIntelligenceCenterViewer />;
      case 'r670': return <AsyIntelligenceCenterViewer />;
      case 'r671': return <AsyIntelligenceCenterViewer />;
      case 'r672': return <HermesControlPlaneViewer />;
      case 'r673': return <HermesControlPlaneViewer />;
      case 'r674': return <HermesControlPlaneViewer />;
      case 'r675': return <AsyIntelligenceCenterViewer />;
      case 'r676': return <AsyIntelligenceCenterViewer />;

      // RC86 Administrative Intelligence & Task Completion Engine (R677 - R690)
      case 'r677': return <AdministrativeTaskOrchestratorViewer />;
      case 'r678': return <AdministrativeTaskOrchestratorViewer />;
      case 'r679': return <AdministrativeTaskOrchestratorViewer />;
      case 'r680': return <AdministrativeTaskOrchestratorViewer />;
      case 'r681': return <AdministrativeTaskOrchestratorViewer />;
      case 'r682': return <AdministrativeTaskOrchestratorViewer />;
      case 'r683': return <AdminServiceQualityBoardViewer />;
      case 'r684': return <AdministrativeTaskOrchestratorViewer />;
      case 'r685': return <AdminServiceQualityBoardViewer />;
      case 'r686': return <AdminServiceQualityBoardViewer />;
      case 'r687': return <FounderAdminCommandCenterViewer />;
      case 'r688': return <HermesDryRunSimulatorViewer />;
      case 'r689': return <FounderAdminCommandCenterViewer />;
      case 'r690': return <HermesDryRunSimulatorViewer />;
      case 'r_hermes_suite': return <HermesAdministrativeSuiteViewer />;

      // RC87 Adaptive Workflow Intelligence & Continuity Engine (R691 - R700)
      case 'r691': return <PauseResumeContinuityViewer />;
      case 'r692': return <PauseResumeContinuityViewer />;
      case 'r693': return <AdaptiveAdminQualityBoardViewer />;
      case 'r694': return <WorkflowAdaptationViewer />;
      case 'r695': return <AdaptiveAdminQualityBoardViewer />;
      case 'r696': return <AdaptiveAdminQualityBoardViewer />;
      case 'r697': return <WorkflowAdaptationViewer />;
      case 'r698': return <PauseResumeContinuityViewer />;
      case 'r699': return <AdaptiveAdminQualityBoardViewer />;
      case 'r700': return <HermesAdaptiveDryRunLabViewer />;
      case 'r_adaptive_suite': return <HermesAdaptiveSuiteViewer />;

      // RC88 Operational Intelligence & Governance Foundation (R701 - R710)
      case 'r701': return <OperationalHealthViewer />;
      case 'r702': return <FounderVerificationCenterViewer />;
      case 'r703': return <GuardianIntegrityScannerViewer />;
      case 'r704': return <OperationalHealthViewer />;
      case 'r705': return <GuardianIntegrityScannerViewer />;
      case 'r706': return <ExecutiveGovernanceJournalViewer />;
      case 'r707': return <ExecutiveGovernanceJournalViewer />;
      case 'r708': return <ExecutiveGovernanceJournalViewer />;
      case 'r709': return <OperationalHealthViewer />;
      case 'r710': return <RC88GovernanceSuiteViewer />;
      case 'r_rc88_suite': return <RC88GovernanceSuiteViewer />;

      // RC89 Smart Office Enterprise Orchestration (R711 - R720)
      case 'r711': return <SmartOfficeWorkspaceViewer onNavigate={handleTabChange} />;
      case 'r712': return <UnifiedAdministrativeQueueViewer onNavigate={handleTabChange} />;
      case 'r713': return <UnifiedAdministrativeQueueViewer onNavigate={handleTabChange} />;
      case 'r714': return <SmartOfficeWorkspaceViewer onNavigate={handleTabChange} />;
      case 'r715': return <SmartDocumentCenterViewer />;
      case 'r716': return <AdministrativeTimelineViewer />;
      case 'r717': return <AdministrativeTimelineViewer />;
      case 'r718': return <SmartOfficeWorkspaceViewer onNavigate={handleTabChange} />;
      case 'r719': return <CrossModuleConsistencyAuditorViewer />;
      case 'r720': return <RC89SmartOfficeWarRoomViewer onNavigate={handleTabChange} />;
      case 'r_rc89_suite': return <RC89SmartOfficeWarRoomViewer onNavigate={handleTabChange} />;
      case 'r721': return <EngineContractRegistryViewer onNavigate={handleTabChange} />;
      case 'r722': return <EngineContractRegistryViewer onNavigate={handleTabChange} />;
      case 'r723': return <ExecutiveIntelligenceHubViewer onNavigate={handleTabChange} />;
      case 'r724': return <SituationReportViewer />;
      case 'r725': return <ExecutiveIntelligenceHubViewer onNavigate={handleTabChange} />;
      case 'r726': return <ExecutiveIntelligenceHubViewer onNavigate={handleTabChange} />;
      case 'r727': return <ExecutiveQuestionConsoleViewer onNavigate={handleTabChange} />;
      case 'r728': return <SituationReportViewer />;
      case 'r729': return <CapabilityRegistryViewer onNavigate={handleTabChange} />;
      case 'r730': return <RC90ExecutiveIntelligenceWarRoomViewer onNavigate={handleTabChange} />;
      case 'r_rc90_suite': return <RC90ExecutiveIntelligenceWarRoomViewer onNavigate={handleTabChange} />;

      // RC91 Enterprise Offline Continuity & Disaster Resilience (R731 - R740)
      case 'r731': return <OfflineContinuityManagerViewer onNavigate={handleTabChange} />;
      case 'r732': return <SafeSyncQueueViewer onNavigate={handleTabChange} />;
      case 'r733': return <ConflictResolutionViewer onNavigate={handleTabChange} />;
      case 'r734': return <LocalSnapshotCacheViewer onNavigate={handleTabChange} />;
      case 'r735': return <ConnectivityIntelligenceViewer onNavigate={handleTabChange} />;
      case 'r736': return <RecoveryReplayViewer onNavigate={handleTabChange} />;
      case 'r737': return <OfflineReadinessDashboardViewer onNavigate={handleTabChange} />;
      case 'r738': return <DisasterContinuitySimulatorViewer onNavigate={handleTabChange} />;
      case 'r739': return <OfflineIntegrityAuditorViewer onNavigate={handleTabChange} />;
      case 'r740': return <RC91OfflineWarRoomViewer onNavigate={handleTabChange} />;
      case 'r_rc91_suite': return <RC91OfflineWarRoomViewer onNavigate={handleTabChange} />;

      // RC92 Guardian Policy Engine & Constitution Compiler (R741 - R750)
      case 'r741': return <GuardianPolicyRegistryViewer />;
      case 'r742': return <PolicyEvaluationViewer />;
      case 'r743': return <ConstitutionCompilerViewer />;
      case 'r744': return <BuildGateValidatorViewer />;
      case 'r745': return <RuntimePolicyMonitorViewer />;
      case 'r746': return <GuardianExceptionJournalViewer />;
      case 'r747': return <PolicySimulatorViewer />;
      case 'r748': return <ConstitutionDiffViewer />;
      case 'r749': return <SovereignGovernanceBoardViewer />;
      case 'r750': return <RC92GuardianWarRoomViewer />;
      case 'r_rc92_suite': return <RC92GuardianWarRoomViewer />;

      // RC93 Digital Companion Ecosystem (R751 - R760)
      case 'r751': return <ParentDigitalCompanionViewer />;
      case 'r752': return <TeacherDigitalCompanionViewer />;
      case 'r753': return <ExecutiveCompanionViewer />;
      case 'r754': return <CompanionMemoryViewer />;
      case 'r755': return <ConversationContextViewer />;
      case 'r756': return <SmartReminderViewer />;
      case 'r757': return <CompanionInsightCardsViewer />;
      case 'r758': return <InteractionTimelineViewer />;
      case 'r759': return <CompanionPrivacyGuardViewer />;
      case 'r760': return <RC93CompanionWarRoomViewer />;
      case 'r_rc93_suite': return <RC93CompanionWarRoomViewer />;

      // RC94 Sovereign Operations & Offline Continuity (R761 - R770)
      case 'r761': return <OfflineContinuityEngineViewer />;
      case 'r762': return <FounderCommandPaletteViewer onNavigateTab={handleTabChange} />;
      case 'r763': return <GuardianContinuousVerificationViewer />;
      case 'r764': return <SovereignSessionIntelligenceViewer />;
      case 'r765': return <OfflineCompanionCacheViewer />;
      case 'r766': return <SyncReconciliationViewer />;
      case 'r767': return <GuardianHealthDashboardViewer />;
      case 'r768': return <DiscoveryIntegrityScannerViewer />;
      case 'r769': return <RecoveryReadinessSimulatorViewer />;
      case 'r770': return <RC94SovereignWarRoomViewer onNavigateTab={handleTabChange} />;
      case 'r_rc94_suite': return <RC94SovereignWarRoomViewer onNavigateTab={handleTabChange} />;
      case 'r771': return <ConstitutionalPolicyEngineViewer />;
      case 'r772': return <DigitalSignatureReadinessViewer />;
      case 'r773': return <ImmutableGovernanceJournalViewer />;
      case 'r774': return <CrossModuleAuditCorrelationViewer />;
      case 'r775': return <FounderDecisionLedgerViewer />;
      case 'r776': return <GovernmentOperationsDashboardViewer />;
      case 'r777': return <ConstitutionalConflictDetectorViewer />;
      case 'r778': return <InstitutionalApprovalWorkflowViewer />;
      case 'r779': return <GovernanceEvidenceExplorerViewer />;
      case 'r780': return <RC95GovernmentWarRoomViewer />;
      case 'r_rc95_suite': return <RC95GovernmentWarRoomViewer />;

      // RC96A Asy Living 3D Mascot Foundation (R781 - R790)
      case 'r781': return <AsyAssetViewer />;
      case 'r782': return <RC96AAsyWarRoomViewer />;
      case 'r783': return <AsyAnimationViewer />;
      case 'r784': return <AsyTriggerViewer />;
      case 'r785': return <RC96AAsyWarRoomViewer />;
      case 'r786': return <RC96AAsyWarRoomViewer />;
      case 'r787': return <AsyPerformanceViewer />;
      case 'r788': return <AsyAccessibilityViewer />;
      case 'r789': return <RC96AAsyWarRoomViewer />;
      case 'r790': return <RC96AAsyWarRoomViewer />;
      case 'r_rc96a_suite': return <RC96AAsyWarRoomViewer />;

      // RC97 Asy Emotional Intelligence & Contextual Life (R791 - R800)
      case 'r791': return <RC97LivingAsyWarRoomViewer initialTab="emotion" />;
      case 'r792': return <RC97LivingAsyWarRoomViewer initialTab="schedule" />;
      case 'r793': return <RC97LivingAsyWarRoomViewer initialTab="movement" />;
      case 'r794': return <RC97LivingAsyWarRoomViewer initialTab="wisdom" />;
      case 'r795': return <RC97LivingAsyWarRoomViewer initialTab="celebration" />;
      case 'r796': return <RC97LivingAsyWarRoomViewer initialTab="dashboard" />;
      case 'r797': return <RC97LivingAsyWarRoomViewer initialTab="dashboard" />;
      case 'r798': return <RC97LivingAsyWarRoomViewer initialTab="quiet" />;
      case 'r799': return <CompanionEmotionDashboard />;
      case 'r800': return <RC97LivingAsyWarRoomViewer />;
      case 'r_rc97_suite': return <RC97LivingAsyWarRoomViewer />;

      // RC98 Asy Micro-Interaction Masterpiece (R801 - R810)
      case 'r801': return <RC98LivingAsyWarRoomViewer initialTab="peek" />;
      case 'r802': return <RC98LivingAsyWarRoomViewer initialTab="thumb" />;
      case 'r803': return <RC98LivingAsyWarRoomViewer initialTab="edge" />;
      case 'r804': return <RC98LivingAsyWarRoomViewer initialTab="reactions" />;
      case 'r805': return <RC98LivingAsyWarRoomViewer initialTab="bubble" />;
      case 'r806': return <RC98LivingAsyWarRoomViewer initialTab="gesture" />;
      case 'r807': return <RC98LivingAsyWarRoomViewer initialTab="gesture" />;
      case 'r808': return <RC98LivingAsyWarRoomViewer initialTab="performance" />;
      case 'r809': return <OneHandUXValidator />;
      case 'r810': return <RC98LivingAsyWarRoomViewer />;
      case 'r_rc98_suite': return <RC98LivingAsyWarRoomViewer />;

      // RC99 Asy Central Intelligence & Creator Ecosystem (R811 - R820)
      case 'r811': return <RC99CreatorWarRoomViewer initialTab="INTELLIGENCE" />;
      case 'r812': return <LivingActivityCenter />;
      case 'r813': return <PhotoLabEnhancer />;
      case 'r814': return <PhotoLabEnhancer />;
      case 'r815': return <StoryStudioExpress />;
      case 'r816': return <TemplateIntelligenceHub />;
      case 'r817': return <TrendIntelligenceCenter />;
      case 'r818': return <CreatorDownloadCenter />;
      case 'r819': return <InnovationLabViewer />;
      case 'r820': return <RC99CreatorWarRoomViewer />;
      case 'r_rc99_suite': return <RC99CreatorWarRoomViewer />;
      case 'living_activity': return <LivingActivityCenter />;
      case 'photo_lab': return <PhotoLabEnhancer />;
      case 'story_studio': return <StoryStudioExpress />;
      case 'creator_war_room': return <RC99CreatorWarRoomViewer />;

      // RC100 Living Digital School (R821 - R830)
      case 'r821': return <DigitalTownHallViewer />;
      case 'r822': return <DigitalTownHallViewer />;
      case 'r823': return <AsyCabinetViewer />;
      case 'r824': return <GuardianCabinetViewer />;
      case 'r825': return <HermesCabinetViewer />;
      case 'r826': return <AsyVoiceStudioViewer />;
      case 'r827': return <LivingCharacterViewer />;
      case 'r828': return <SituationalAwarenessViewer />;
      case 'r829': return <IntelligenceCouncilViewer />;
      case 'r830': return <RC100LivingSchoolWarRoomViewer />;
      case 'r_rc100_suite': return <RC100LivingSchoolWarRoomViewer />;
      case 'living_school': return <RC100LivingSchoolWarRoomViewer />;
      case 'townhall': return <DigitalTownHallViewer />;
      case 'voice_studio': return <AsyVoiceStudioViewer />;

      // RC101 Operational Excellence (R831 - R840)
      case 'r831': return <MasterCharacterViewer />;
      case 'r832': return <SchoolActivityCenterPro />;
      case 'r833': return <PhotoLabProPlus />;
      case 'r834': return <StoryStudioViral />;
      case 'r835': return <SmartTeachingLibrary />;
      case 'r836': return <HermesDigitalVaultViewer />;
      case 'r837': return <ParentEngagementDashboard />;
      case 'r838': return <LivingSchoolModeViewer />;
      case 'r839': return <EvolutionIntelligenceViewer />;
      case 'r840': return <RC101OperationalWarRoomViewer />;
      case 'r_rc101_suite': return <RC101OperationalWarRoomViewer />;
      case 'kegiatan_tk': return <SchoolActivityCenterPro />;
      case 'photolab_pro': return <PhotoLabProPlus />;
      case 'parent_dashboard': return <ParentEngagementDashboard />;

      // RC102 Autonomous Reliability & Production Readiness (R841 - R850)
      case 'r841': return <NationalTaskOrchestratorViewer />;
      case 'r842': return <SmartQueueDashboard />;
      case 'r843': return <AutomationCenterViewer />;
      case 'r844': return <DailyHealthInspectorViewer />;
      case 'r845': return <AutonomousDigitalVaultViewer />;
      case 'r846': return <PhotoLabBatchViewer />;
      case 'r847': return <StoryStudioBatchViewer />;
      case 'r848': return <PrincipalExecutiveDashboard />;
      case 'r849': return <GuardianStressTestViewer />;
      case 'r850': return <RC102ReliabilityWarRoomViewer />;
      case 'r_rc102_suite': return <RC102ReliabilityWarRoomViewer />;
      case 'orchestrator': return <NationalTaskOrchestratorViewer />;
      case 'health_inspector': return <DailyHealthInspectorViewer />;
      case 'reliability_war_room': return <RC102ReliabilityWarRoomViewer />;

      // RC103 Go-Live Governance & Operational Trust (R851 - R860)
      case 'r851': return <GuardianPolicyCenterViewer />;
      case 'r852': return <AuditTimelineExplorerViewer />;
      case 'r853': return <SchoolCommandCenterViewer />;
      case 'r854': return <OperationalKPIEngineViewer />;
      case 'r855': return <SmartIncidentManagerViewer />;
      case 'r856': return <FounderGovernanceConsoleViewer />;
      case 'r857': return <ComplianceReadinessCenterViewer />;
      case 'r858': return <OfflineSyncAssuranceViewer />;
      case 'r859': return <LivingPerformanceProfilerViewer />;
      case 'r860': return <RC103GovernanceWarRoomViewer onSelectModule={handleTabChange} />;
      case 'r_rc103_suite': return <RC103GovernanceWarRoomViewer onSelectModule={handleTabChange} />;
      case 'governance_war_room': return <RC103GovernanceWarRoomViewer onSelectModule={handleTabChange} />;
      case 'policy_center': return <GuardianPolicyCenterViewer />;

      // RC104 Business Continuity & Operational Intelligence (R861 - R870)
      case 'r861': return <ContinuityCommandEngineViewer />;
      case 'r862': return <PredictiveHealthIntelligenceViewer />;
      case 'r863': return <GuardianRiskObservatoryViewer />;
      case 'r864': return <SmartRecoveryCoordinatorViewer />;
      case 'r865': return <SchoolOperationsTimelineViewer />;
      case 'r866': return <ExecutiveDecisionCenterViewer />;
      case 'r867': return <CapacityForecastEngineViewer />;
      case 'r868': return <OfflineMissionControlViewer />;
      case 'r869': return <FounderIntelligenceBriefingViewer />;
      case 'r870': return <RC104ContinuityWarRoomViewer onSelectModule={handleTabChange} />;
      case 'r_rc104_suite': return <RC104ContinuityWarRoomViewer onSelectModule={handleTabChange} />;
      case 'continuity_war_room': return <RC104ContinuityWarRoomViewer onSelectModule={handleTabChange} />;

      // GLC-1 Production Certification & Go-Live Candidate (G901 - G910)
      case 'g901': return <FunctionalValidationViewer />;
      case 'g902': return <GuardianSecurityValidationViewer />;
      case 'g903': return <PerformanceCertificationViewer />;
      case 'g904': return <OfflineSyncCertificationViewer />;
      case 'g905': return <HermesRecoveryCertificationViewer />;
      case 'g906': return <MobileProductionCertificationViewer />;
      case 'g907': return <FounderAcceptanceSuiteViewer />;
      case 'g908': return <DocumentationSopViewer />;
      case 'g909': return <ProductionDeploymentPackageViewer />;
      case 'g910': return <GoLiveControlTowerViewer onSelectModule={handleTabChange} />;
      case 'r_glc1_suite': return <GoLiveControlTowerViewer onSelectModule={handleTabChange} />;
      case 'golive_control_tower': return <GoLiveControlTowerViewer onSelectModule={handleTabChange} />;

      // MCA-1 Master Character Code Integration (R911 - R920)
      case 'mca1': return <MasterCharacterCanonViewer />;
      case 'r_mca1_suite': return <MasterCharacterCanonViewer />;
      case 'master_character_canon': return <MasterCharacterCanonViewer />;
      case 'r911': return <MasterCharacterCanonViewer />;
      case 'r912': return <MasterCharacterCanonViewer />;
      case 'r913': return <MasterCharacterCanonViewer />;
      case 'r914': return <MasterCharacterCanonViewer />;
      case 'r915': return <MasterCharacterCanonViewer />;
      case 'r916': return <MasterCharacterCanonViewer />;
      case 'r917': return <MasterCharacterCanonViewer />;
      case 'r918': return <MasterCharacterCanonViewer />;
      case 'r919': return <MasterCharacterCanonViewer />;
      case 'r920': return <MasterCharacterCanonViewer />;

      // MCA-2 Living Character Runtime (R921 - R930)
      case 'mca2': return <FounderAnimationPreview />;
      case 'r_mca2_suite': return <FounderAnimationPreview />;
      case 'founder_animation_preview': return <FounderAnimationPreview />;
      case 'living_character_runtime': return <FounderAnimationPreview />;
      case 'r921': return <FounderAnimationPreview />;
      case 'r922': return <FounderAnimationPreview />;
      case 'r923': return <FounderAnimationPreview />;
      case 'r924': return <FounderAnimationPreview />;
      case 'r925': return <FounderAnimationPreview />;
      case 'r926': return <FounderAnimationPreview />;
      case 'r927': return <FounderAnimationPreview />;
      case 'r928': return <FounderAnimationPreview />;
      case 'r929': return <FounderAnimationPreview />;
      case 'r930': return <FounderAnimationPreview />;

      // MCA-3 Official Character Production Pipeline (R931 - R940)
      case 'mca3': return <LivingCharacterPreview />;
      case 'r_mca3_suite': return <LivingCharacterPreview />;
      case 'living_character_preview': return <LivingCharacterPreview />;
      case 'character_production_pipeline': return <LivingCharacterPreview />;
      case 'r931': return <LivingCharacterPreview />;
      case 'r932': return <LivingCharacterPreview />;
      case 'r933': return <LivingCharacterPreview />;
      case 'r934': return <LivingCharacterPreview />;
      case 'r935': return <LivingCharacterPreview />;
      case 'r936': return <LivingCharacterPreview />;
      case 'r937': return <LivingCharacterPreview />;
      case 'r938': return <LivingCharacterPreview />;
      case 'r939': return <LivingCharacterPreview />;
      case 'r940': return <LivingCharacterPreview />;

      // Sprint G2 Parent Adoption & Operational Intelligence Console (G206)
      case 'r941': return <FounderAdoptionConsole onSelectTab={handleTabChange} />;
      case 'r_adoption': return <FounderAdoptionConsole onSelectTab={handleTabChange} />;
      case 'founder_adoption_console': return <FounderAdoptionConsole onSelectTab={handleTabChange} />;

      // Sprint G3: Founder Office Phase-1, Media Commander, Creative Studio & TIB
      case 'r_founder_office': return <FounderOfficeDashboard onSelectModule={handleTabChange} />;
      case 'founder_office': return <FounderOfficeDashboard onSelectModule={handleTabChange} />;
      case 'r950': return <FounderOfficeDashboard onSelectModule={handleTabChange} />;
      case 'r_media_commander': return <SmartUploadCommander />;
      case 'smart_upload_commander': return <SmartUploadCommander />;
      case 'r951': return <SmartUploadCommander />;
      case 'r_creative_studio': return <CreativeStudioFactory />;
      case 'creative_studio': return <CreativeStudioFactory />;
      case 'r_tib_labs': return <TIBFoundation />;
      case 'tib_labs': return <TIBFoundation />;
      case 'r952': return <TIBFoundation />;
      case 'r_cabinet_tracker': return <CabinetResolutionTracker />;
      case 'cabinet_resolution_tracker': return <CabinetResolutionTracker />;
      case 'r953': return <CabinetResolutionTracker />;
      case 'r_command_recorder': return <FounderCommandRecorderViewer />;
      case 'founder_command_recorder': return <FounderCommandRecorderViewer />;
      case 'r954': return <FounderCommandRecorderViewer />;

      // Sprint G10: Alumni Universe & Taman Kenangan
      case 'r_alumni_universe':
      case 'alumni_universe':
      case 'alumni_garden':
      case 'r960':
        return <AlumniGarden onNavigateToPPDB={() => handleTabChange('w4')} onNavigateToHome={() => handleTabChange('w1')} />;

      // Sprint G13: Pusat Aset TADE (Tempat Poster, Sertifikat, Animasi, Ikon, Suara)
      case 'r_asset_center':
      case 'r_asset_posters':
      case 'r_asset_certs':
      case 'r_asset_toys':
      case 'r_asset_sounds':
      case 'pusat_aset':
      case 'asset_center':
      case 'r970':
        return <PusatAsetTADE onSelectModule={handleTabChange} />;

      // Sprint G20: Pusat DNA Animasi & Suara Asy Syifa
      case 'r_dna_center':
      case 'dna_center':
      case 'g20_dna':
      case 'pusat_dna':
      case 'r980':
        return <PusatDnaAsySyifaHub onSelectModule={handleTabChange} />;

      // Sprint G21: Studio Kamera Ajaib Asy & Syifa
      case 'r_camera_studio':
      case 'camera_studio':
      case 'studio_kamera':
      case 'g21_camera':
      case 'g21_cam':
      case 'r981':
        return <StudioKameraAjaibHub onSelectModule={handleTabChange} />;

      // Sprint G22: Sutradara Ajaib Asy & Syifa
      case 'r_director_hub':
      case 'director_hub':
      case 'sutradara_ajaib':
      case 'g22_director':
      case 'g22_dir':
      case 'r982':
        return <SutradaraAjaibHub onSelectModule={handleTabChange} />;

      // Sprint G23: Kota Mini Profesi Asy
      case 'r_city_hub':
      case 'city_hub':
      case 'kota_mini':
      case 'kota_mini_profesi':
      case 'g23_kota':
      case 'g23_city':
      case 'r983':
        return <KotaMiniProfesiHub onSelectModule={handleTabChange} />;

      // Sprint G24: Rumah Kreatif Asy
      case 'r_creative_house':
      case 'creative_house':
      case 'rumah_kreatif':
      case 'rumah_kreatif_asy':
      case 'g24_creative':
      case 'g24_rka':
      case 'r984':
        return <RumahKreatifAsyHub onSelectModule={handleTabChange} />;

      // Sprint G25: Hari Besar Otomatis & Langit Hidup
      case 'r_auto_events':
      case 'auto_events':
      case 'hari_besar':
      case 'hari_besar_otomatis':
      case 'g25_hari':
      case 'g25_events':
      case 'r985':
        return <HariBesarOtomatisHub />;

      // Sprint G26: Bioskop Langit Asy & Syifa
      case 'r_bioskop_langit':
      case 'bioskop_langit':
      case 'bioskop':
      case 'g26_bioskop':
      case 'g26_cinema':
      case 'r986':
        return <BioskopLangitHub />;

      // Sprint G27: Kapal Awan & Pulau Petualangan
      case 'r_kapal_awan':
      case 'kapal_awan':
      case 'kapal':
      case 'g27_kapal':
      case 'g27_adventure':
      case 'r987':
        return <KapalAwanHub />;

      // Sprint G28: Peta Dunia TADE
      case 'r_peta_dunia':
      case 'peta_dunia':
      case 'peta':
      case 'world_map':
      case 'world':
      case 'g28_peta':
      case 'g28_world':
      case 'r988':
        return <PetaDuniaHub onNavigateToModule={handleTabChange} />;

      // Sprint G29: Sekolah Bernapas
      case 'r_sekolah_bernapas':
      case 'sekolah_bernapas':
      case 'sekolah':
      case 'sekolah_hidup':
      case 'g29_sekolah':
      case 'g29_living_school':
      case 'r989':
        return <SekolahBernapasHub onNavigateToWorldMap={() => handleTabChange('g28_peta')} />;

      // Sprint G30: Lorong Kenangan Asy & Syifa
      case 'r_lorong_kenangan':
      case 'lorong_kenangan':
      case 'kenangan':
      case 'hall_of_memories':
      case 'g30_kenangan':
      case 'g30_lorong_kenangan':
      case 'r990':
        return (
          <LorongKenanganHub
            onNavigateToWorldMap={() => handleTabChange('g28_peta')}
            onNavigateToSchool={() => handleTabChange('g29_sekolah')}
          />
        );

      // Sprint G31: Keluarga Sahabat Asy & Syifa
      case 'r_keluarga_sahabat':
      case 'keluarga_sahabat':
      case 'sahabat':
      case 'keluarga':
      case 'g31_sahabat':
      case 'g31_keluarga_sahabat':
      case 'r991':
        return (
          <KeluargaSahabatHub
            onNavigateToWorldMap={() => handleTabChange('g28_peta')}
            onNavigateToSchool={() => handleTabChange('g29_sekolah')}
            onNavigateToMemoryHall={() => handleTabChange('g30_kenangan')}
          />
        );

      // Sprint G31: Makan Bergizi Gratis (MBG) Ceria
      case 'r_mbg':
      case 'mbg':
      case 'mbg_ceria':
      case 'g31_mbg':
      case 'g31_mbg_ceria':
      case 'r992':
        return (
          <MbgCeriaHub
            onNavigateToSchool={() => handleTabChange('g29_sekolah')}
            onNavigateToWorldMap={() => handleTabChange('g28_peta')}
            onNavigateToMemoryHall={() => handleTabChange('g30_kenangan')}
            onNavigateToKeluargaSahabat={() => handleTabChange('g31_sahabat')}
            onNavigateToPagiCeria={() => handleTabChange('g32_pagi')}
          />
        );

      // Sprint G32: Pagi Ceria di TK Asy Syifa
      case 'r_pagi':
      case 'pagi':
      case 'pagi_ceria':
      case 'g32_pagi':
      case 'g32_pagi_ceria':
      case 'r993':
        return (
          <PagiCeriaHub
            onNavigateToSchool={() => handleTabChange('g29_sekolah')}
            onNavigateToMbg={() => handleTabChange('g31_mbg')}
            onNavigateToWorldMap={() => handleTabChange('g28_peta')}
            onNavigateToMemoryHall={() => handleTabChange('g30_kenangan')}
            onNavigateToKelasHidup={() => handleTabChange('g33_kelas')}
          />
        );

      // Sprint G33: Kelas Hidup & Sentra Ceria PAUD
      case 'r_kelas':
      case 'kelas':
      case 'kelas_hidup':
      case 'sentra':
      case 'sentra_ceria':
      case 'g33_kelas':
      case 'g33_kelas_hidup':
      case 'g33_sentra':
      case 'r994':
        return (
          <KelasHidupHub
            onNavigateToSchool={() => handleTabChange('g29_sekolah')}
            onNavigateToPagiCeria={() => handleTabChange('g32_pagi')}
            onNavigateToMbg={() => handleTabChange('g31_mbg')}
            onNavigateToKotaMini={() => handleTabChange('g23_kota')}
            onNavigateToRumahKreatif={() => handleTabChange('g24_rumah')}
            onNavigateToTamanPetualangan={() => handleTabChange('g34_taman')}
            onNavigateToPulangCeria={() => handleTabChange('g35_pulang')}
          />
        );

      // Sprint G34: Jam Bermain Ceria & Taman Petualangan
      case 'r_taman':
      case 'taman':
      case 'taman_petualangan':
      case 'jam_bermain':
      case 'bermain':
      case 'g34_taman':
      case 'g34_bermain':
      case 'g34_playground':
      case 'r994b':
        return (
          <TamanPetualanganHub
            onNavigateToKelasHidup={() => handleTabChange('g33_kelas')}
            onNavigateToMbg={() => handleTabChange('g31_mbg')}
            onNavigateToSchool={() => handleTabChange('g29_sekolah')}
            onNavigateToPagiCeria={() => handleTabChange('g32_pagi')}
            onNavigateToKampungCeria={() => handleTabChange('g17_kampung')}
            onNavigateToPulangCeria={() => handleTabChange('g35_pulang')}
          />
        );

      // Sprint G35: Pulang Ceria & Gerbang Perpisahan
      case 'r_pulang':
      case 'pulang':
      case 'pulang_ceria':
      case 'gerbang_perpisahan':
      case 'senja':
      case 'g35_pulang':
      case 'g35_senja':
      case 'g35_dismissal':
      case 'r994c':
        return (
          <PulangCeriaHub
            onNavigateToSchool={() => handleTabChange('g29_sekolah')}
            onNavigateToPagiCeria={() => handleTabChange('g32_pagi')}
            onNavigateToMbg={() => handleTabChange('g31_mbg')}
            onNavigateToMemoryHall={() => handleTabChange('g30_lorong')}
            onNavigateToKelasHidup={() => handleTabChange('g33_kelas')}
            onNavigateToTamanPetualangan={() => handleTabChange('g34_taman')}
            onNavigateToPerpustakaan={() => handleTabChange('g36_library')}
          />
        );

      // Sprint G36: Perpustakaan Ajaib & Kereta Buku
      case 'r_library':
      case 'library':
      case 'perpustakaan':
      case 'perpustakaan_ajaib':
      case 'kereta_buku':
      case 'g36_library':
      case 'g36_perpustakaan':
      case 'r995':
        return (
          <PerpustakaanAjaibHub
            onNavigateToTvAsy={() => handleTabChange('g15_tv')}
            onNavigateToBioskopLangit={() => handleTabChange('g16_bioskop')}
            onNavigateToRumahKreatif={() => handleTabChange('g24_rumah')}
            onNavigateToLorongKenangan={() => handleTabChange('g30_lorong')}
            onNavigateToKelasHidup={() => handleTabChange('g33_kelas')}
            onNavigateToPulangCeria={() => handleTabChange('g35_pulang')}
            onNavigateToAulaImpian={() => handleTabChange('g37_aula')}
          />
        );

      // Sprint G37: Aula Impian & Panggung Serbaguna
      case 'r_aula':
      case 'aula':
      case 'aula_impian':
      case 'panggung':
      case 'panggung_serbaguna':
      case 'g37_aula':
      case 'g37_panggung':
      case 'r996':
        return (
          <AulaImpianHub
            onNavigateToTvAsy={() => handleTabChange('g15_tv')}
            onNavigateToFestival={() => handleTabChange('w18')}
            onNavigateToSutradara={() => handleTabChange('w22')}
            onNavigateToKamera={() => handleTabChange('w21')}
            onNavigateToLorongKenangan={() => handleTabChange('g30_lorong')}
            onNavigateToPerpustakaan={() => handleTabChange('g36_library')}
            onNavigateToPawaiNusantara={() => handleTabChange('g38_pawai')}
          />
        );

      // Sprint G38: Pawai Nusantara & Kampung Indonesia
      case 'r_pawai':
      case 'pawai':
      case 'pawai_nusantara':
      case 'kampung_indonesia':
      case 'g38_pawai':
      case 'g38_nusantara':
      case 'r995b':
        return (
          <PawaiNusantaraHub
            onNavigateToFestival={() => handleTabChange('w18')}
            onNavigateToAula={() => handleTabChange('g37_aula')}
            onNavigateToTvAsy={() => handleTabChange('g15_tv')}
            onNavigateToKamera={() => handleTabChange('w21')}
            onNavigateToPetaDunia={() => handleTabChange('w28')}
            onNavigateToDNA={() => handleTabChange('w20')}
            onNavigateToLorongKenangan={() => handleTabChange('g30_lorong')}
            onNavigateToPerpustakaan={() => handleTabChange('g36_library')}
            onNavigateToHariPasar={() => handleTabChange('g39_pasar')}
          />
        );

      // Sprint G39: Hari Pasar Ceria & Koperasi Mini
      case 'r_pasar':
      case 'pasar':
      case 'pasar_ceria':
      case 'koperasi_mini':
      case 'g39_pasar':
      case 'g39_koperasi':
      case 'r994d':
        return (
          <HariPasarHub
            onNavigateToMbg={() => handleTabChange('g31_mbg')}
            onNavigateToKotaMini={() => handleTabChange('w23')}
            onNavigateToFestival={() => handleTabChange('w18')}
            onNavigateToDNA={() => handleTabChange('w20')}
            onNavigateToKamera={() => handleTabChange('w21')}
            onNavigateToPetaDunia={() => handleTabChange('w28')}
            onNavigateToPawaiNusantara={() => handleTabChange('g38_pawai')}
            onNavigateToAula={() => handleTabChange('g37_aula')}
            onNavigateToKebunAjaib={() => handleTabChange('g40_kebun')}
          />
        );

      // Sprint G40: Kebun Ajaib & Panen Berkah
      case 'r_kebun':
      case 'kebun':
      case 'kebun_ajaib':
      case 'panen_berkah':
      case 'g40_kebun':
      case 'g40_panen':
      case 'r995c':
        return (
          <KebunAjaibHub
            onNavigateToMbg={() => handleTabChange('g31_mbg')}
            onNavigateToKotaMini={() => handleTabChange('w23')}
            onNavigateToPasarCeria={() => handleTabChange('g39_pasar')}
            onNavigateToSekolahBernapas={() => handleTabChange('g29_breath')}
            onNavigateToDNA={() => handleTabChange('w20')}
            onNavigateToKamera={() => handleTabChange('w21')}
            onNavigateToPawaiNusantara={() => handleTabChange('g38_pawai')}
            onNavigateToAula={() => handleTabChange('g37_aula')}
          />
        );

      // Sprint G41: Masjid Al-Barakah Hidup & Kampung Shalih
      case 'r_masjid':
      case 'r_masjid_barakah':
      case 'masjid':
      case 'masjid_barakah':
      case 'masjid_al_barakah':
      case 'kampung_shalih':
      case 'g41_masjid':
      case 'g41_barakah':
      case 'r996b':
        return (
          <MasjidAlBarakahHub
            onNavigateToMbg={() => handleTabChange('g31_mbg')}
            onNavigateToKotaMini={() => handleTabChange('w23')}
            onNavigateToPasarCeria={() => handleTabChange('g39_pasar')}
            onNavigateToKebunAjaib={() => handleTabChange('g40_kebun')}
            onNavigateToSekolahBernapas={() => handleTabChange('g29_breath')}
            onNavigateToDNA={() => handleTabChange('w20')}
            onNavigateToKamera={() => handleTabChange('w21')}
            onNavigateToPetaDunia={() => handleTabChange('w28')}
            onNavigateToPawaiNusantara={() => handleTabChange('g38_pawai')}
            onNavigateToAula={() => handleTabChange('g37_aula')}
          />
        );

      // Sprint G42: Kampung Gotong Royong & Hari Bakti Ceria
      case 'r_gotong_royong':
      case 'gotong_royong':
      case 'kampung_gotong_royong':
      case 'hari_bakti':
      case 'g42_gotong_royong':
      case 'g42_bakti':
      case 'r995d':
        return (
          <KampungGotongRoyongHub
            onNavigateToMbg={() => handleTabChange('g31_mbg')}
            onNavigateToKotaMini={() => handleTabChange('w23')}
            onNavigateToPasarCeria={() => handleTabChange('g39_pasar')}
            onNavigateToKebunAjaib={() => handleTabChange('g40_kebun')}
            onNavigateToMasjid={() => handleTabChange('g41_masjid')}
            onNavigateToSekolahBernapas={() => handleTabChange('g29_breath')}
            onNavigateToDNA={() => handleTabChange('w20')}
            onNavigateToKamera={() => handleTabChange('w21')}
            onNavigateToPetaDunia={() => handleTabChange('w28')}
            onNavigateToPawaiNusantara={() => handleTabChange('g38_pawai')}
            onNavigateToAula={() => handleTabChange('g37_aula')}
          />
        );

      default: return <R1Dashboard onSelectModule={handleTabChange} />;
    }
  };

  const isSIMModule = isSimPath(currentPath) || (activeTab || '').startsWith('r') || (activeTab || '').startsWith('g') || (activeTab || '').startsWith('mca') || activeTab === 'policy_center' || activeTab === 'governance_war_room' || activeTab === 'continuity_war_room' || activeTab === 'golive_control_tower' || activeTab === 'master_character_canon';

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* TADE Splash Screen (Go-Live) */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Top Progress Indicator during Navigation */}
      <ProgressIndicator isLoading={isNavigating} />

      {/* Executive Intelligence Briefing Popup (R668) */}
      <ExecutiveIntelligencePopup 
        onOpenFeed={() => handleTabChange('r667')} 
        onExplainMore={() => handleTabChange('r667')} 
      />

      {/* Opening Experience Portal Scene */}
      {!isSIMModule && showOpeningExperience && (
        <OpeningExperience onEnterWorld={handleEnterWorld} />
      )}

      {/* Route Journey Transition Overlay */}
      <JourneyTransition
        currentTab={activeTab}
        previousTab={previousTab}
        isNavigating={isNavigating}
        onTransitionComplete={() => setIsNavigating(false)}
      />

      {/* Cinematic Intro Loader */}
      {!isSIMModule && !showOpeningExperience && <CinematicIntroLoader />}

      {/* Header Navigation Bar */}
      {!isSIMModule && <HeaderNavbar activeTab={activeTab} onTabChange={handleTabChange} />}

      {/* Living Season & Parent Journey Bar for Public Website */}
      {!isSIMModule && (
        <>
          <LivingSeasonBanner />
          <ParentJourneyBar activeTab={activeTab} onTabChange={handleTabChange} />
          <LivingWidgetsBar />
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1">
        {isSIMModule ? (
          <SIMLayout activeModule={activeTab} onSelectModule={handleTabChange}>
            {renderSIMModule(activeTab)}
          </SIMLayout>
        ) : (
          <main>
            {activeTab === 'w1' && <W1Beranda onTabChange={handleTabChange} />}
            {activeTab === 'w2' && <W2ProfilProgram />}
            {activeTab === 'w3' && <W3BeritaInformasi />}
            {activeTab === 'w4' && <W4PortalPPDB />}
            {activeTab === 'w5' && <W5KontakSekolah onTabChange={handleTabChange} />}
            {activeTab === 'w_alumni' && <AlumniGarden onNavigateToPPDB={() => handleTabChange('w4')} onNavigateToHome={() => handleTabChange('w1')} />}
          </main>
        )}
      </div>

      {/* Smart Dock Manager */}
      {!isSIMModule && <SmartDockManager />}

      {/* WhatsApp Guardian Assistant Floating Button */}
      {!isSIMModule && <WhatsAppGuardianButton />}

      {/* Living Garden Interactive Popups */}
      {!isSIMModule && <LivingGardenPopups onTabChange={handleTabChange} />}

      {/* AI Asy - Digital School Companion Mascot */}
      <AIAsy activeTab={activeTab} onSelectTab={handleTabChange} />

      {/* R916 / R919: Master Character Living Vector Overlay (Asy & Syifa) */}
      <MascotOverlay activeTab={activeTab} isSimContext={isSIMModule} />

      {/* PWA Smart Install Banner */}
      <InstallBanner />

      {/* Push Notification Permission Dialog (FCM Go-Live) */}
      <NotificationPermissionDialog onSelectTab={handleTabChange} />

      {/* G202: Smart Parent Welcome Experience */}
      <SmartParentWelcomeModal onSelectTab={handleTabChange} />

      {/* G3: Founder Office Sovereign Overlay (Visible for Founder Andika) */}
      <FounderOfficeOverlay onNavigateTab={handleTabChange} activeTab={activeTab} />

      {/* G20: Rainbow Gate Entry & Farewell Modals */}
      <RainbowGateModal />
      <FarewellToastModal />

      {/* Footer */}
      {!isSIMModule && <Footer onTabChange={handleTabChange} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LivingGardenProvider>
        <AIAsyCharacterProvider>
          <AppContent />
        </AIAsyCharacterProvider>
      </LivingGardenProvider>
    </AuthProvider>
  );
}
