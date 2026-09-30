export type DiscoveryStatus =
  | 'DRAFT'
  | 'IN_DEVELOPMENT'
  | 'TESTING'
  | 'VERIFIED'
  | 'LOCK'
  | 'PROPOSED'
  | 'DEPRECATED';

export type DiscoveryCategory =
  | 'ARCHITECTURE'
  | 'SECURITY'
  | 'AI_ORCHESTRATION'
  | 'EXPERIENCE'
  | 'GOVERNANCE'
  | 'PERFORMANCE'
  | 'MEDIA'
  | 'OPERATIONS';

export interface DiscoveryEntry {
  id: string; // e.g. DISC-001
  name: string;
  category: DiscoveryCategory;
  sprintOrigin: string; // e.g. RC1, RC10, RC13
  status: DiscoveryStatus;
  reason: string; // Alasan dipilih
  risk: string; // Risiko yang diantisipasi
  rejectedAlternatives: string[]; // Alternatif yang ditolak & alasannya
  compatibility: string; // Kompatibilitas dengan modul & locked foundations
  implementationNotes: string; // Catatan implementasi teknis
  author: string;
  timestamp: string;
  moduleCodes: string[]; // e.g. ['R63', 'R70', 'R80', 'R94']
  tags: string[];
}

export interface DiscoveryRegistryManifest {
  registryVersion: string;
  lastUpdated: string;
  totalDiscoveries: number;
  lockedCount: number;
  entries: DiscoveryEntry[];
}
