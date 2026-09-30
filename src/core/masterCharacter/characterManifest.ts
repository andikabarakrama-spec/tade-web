/**
 * TADE v9.3.0-MCA3 — R933
 * MASTER CHARACTER PRODUCTION MANIFEST
 * 
 * SSoT Manifest for versioning, canonical metadata, asset hashes/checksums,
 * 3D budget specifications, and asset health status.
 */

import { CharacterId } from './masterCharacterRegistry';

export interface AssetFormatSpec {
  format: 'GLB' | 'RIVE' | 'SVG' | 'WEBP' | 'PROCEDURAL';
  priority: number;
  expectedPath: string;
  expectedChecksum: string;
  mimeType: string;
  maxSizeBytes: number;
}

export interface Character3DSpecification {
  targetFormat: 'GLB_BINARY';
  maxTriangles: number;
  maxDrawCalls: number;
  maxTextureResolution: number;
  supportedCompressions: string[];
  rigBoneCount: number;
  canonicalHeightUnits: number;
}

export interface CharacterProductionMetadata {
  characterId: CharacterId;
  canonicalName: string;
  arabicName: string;
  role: string;
  version: string;
  proportions: string;
  primaryColorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    skin: string;
    hair: string;
  };
  supportedFormats: AssetFormatSpec[];
  threeDSpec: Character3DSpecification;
  clipCount: number;
  rigNodeCount: number;
  checksumAuditDate: string;
}

export interface CharacterManifestDefinition {
  manifestVersion: string;
  releaseTag: string;
  sprintCode: string;
  lastUpdated: string;
  author: string;
  governanceStatus: 'CANON_LOCKED';
  characters: Record<CharacterId, CharacterProductionMetadata>;
}

export const OFFICIAL_CHARACTER_MANIFEST: CharacterManifestDefinition = {
  manifestVersion: 'v9.3.0-MCA3',
  releaseTag: 'v9.3.0-MCA3-PROD-PIPELINE',
  sprintCode: 'MCA3',
  lastUpdated: '2026-08-20T06:50:00Z',
  author: 'Chief Master Character Pipeline Architect & Founder',
  governanceStatus: 'CANON_LOCKED',
  characters: {
    ASY: {
      characterId: 'ASY',
      canonicalName: 'Asy (Sahabat Santri Teladan)',
      arabicName: 'عَاصِي',
      role: 'Maskot Utama Santri Putra TK & SD Islam',
      version: '9.3.0-MCA3',
      proportions: '2.5 Heads Chibi (Golden Ratio Islamic Proportions)',
      primaryColorPalette: {
        primary: '#FFFFFF', // Koko Putih Bersih
        secondary: '#1A1A1A', // Peci Hitam Beludru
        accent: '#2E7D32', // Hijau Daun Al-Qur'an
        skin: '#FDDEC7', // Kulit Cerah Alami
        hair: '#2C1D11' // Rambut Cokelat Gelap Santun
      },
      supportedFormats: [
        {
          format: 'GLB',
          priority: 1,
          expectedPath: '/src/assets/master-characters/asy/glb/asy_master.glb',
          expectedChecksum: 'sha256-asy-glb-v930-mca3-canon-rigged',
          mimeType: 'model/gltf-binary',
          maxSizeBytes: 4 * 1024 * 1024 // 4 MB limit
        },
        {
          format: 'RIVE',
          priority: 2,
          expectedPath: '/src/assets/master-characters/asy/master.riv',
          expectedChecksum: 'sha256-asy-riv-v930-mca3-60fps',
          mimeType: 'application/octet-stream',
          maxSizeBytes: 1024 * 1024 // 1 MB limit
        },
        {
          format: 'SVG',
          priority: 3,
          expectedPath: '/src/assets/master-characters/asy/master.svg',
          expectedChecksum: 'sha256-asy-svg-v930-mca3-canon-vector',
          mimeType: 'image/svg+xml',
          maxSizeBytes: 256 * 1024 // 256 KB limit
        },
        {
          format: 'PROCEDURAL',
          priority: 4,
          expectedPath: 'PROCEDURAL_REACT_VECTOR',
          expectedChecksum: 'sha256-asy-procedural-canon-r912',
          mimeType: 'application/javascript',
          maxSizeBytes: 64 * 1024
        }
      ],
      threeDSpec: {
        targetFormat: 'GLB_BINARY',
        maxTriangles: 15000,
        maxDrawCalls: 6,
        maxTextureResolution: 1024,
        supportedCompressions: ['KHR_draco_mesh_compression', 'KHR_texture_basisu'],
        rigBoneCount: 18,
        canonicalHeightUnits: 1.0
      },
      clipCount: 8,
      rigNodeCount: 8,
      checksumAuditDate: '2026-08-20T06:50:00Z'
    },
    SYIFA: {
      characterId: 'SYIFA',
      canonicalName: 'Syifa (Sahabat Santriwati Ceria)',
      arabicName: 'شِفَاء',
      role: 'Maskot Utama Santriwati Putri TK & SD Islam',
      version: '9.3.0-MCA3',
      proportions: '2.5 Heads Chibi (Golden Ratio Islamic Proportions)',
      primaryColorPalette: {
        primary: '#48BB78', // Hijau Mint Syar'i (Hijab)
        secondary: '#F687B3', // Pink Pastel Lembut (Gamis)
        accent: '#9AE6B4', // Hijau Pastel (Pita)
        skin: '#FDDEC7', // Kulit Cerah Alami
        hair: '#FFFFFF' // Ciput Putih Bersih
      },
      supportedFormats: [
        {
          format: 'GLB',
          priority: 1,
          expectedPath: '/src/assets/master-characters/syifa/glb/syifa_master.glb',
          expectedChecksum: 'sha256-syifa-glb-v930-mca3-canon-rigged',
          mimeType: 'model/gltf-binary',
          maxSizeBytes: 4 * 1024 * 1024
        },
        {
          format: 'RIVE',
          priority: 2,
          expectedPath: '/src/assets/master-characters/syifa/master.riv',
          expectedChecksum: 'sha256-syifa-riv-v930-mca3-60fps',
          mimeType: 'application/octet-stream',
          maxSizeBytes: 1024 * 1024
        },
        {
          format: 'SVG',
          priority: 3,
          expectedPath: '/src/assets/master-characters/syifa/master.svg',
          expectedChecksum: 'sha256-syifa-svg-v930-mca3-canon-vector',
          mimeType: 'image/svg+xml',
          maxSizeBytes: 256 * 1024
        },
        {
          format: 'PROCEDURAL',
          priority: 4,
          expectedPath: 'PROCEDURAL_REACT_VECTOR',
          expectedChecksum: 'sha256-syifa-procedural-canon-r912',
          mimeType: 'application/javascript',
          maxSizeBytes: 64 * 1024
        }
      ],
      threeDSpec: {
        targetFormat: 'GLB_BINARY',
        maxTriangles: 15000,
        maxDrawCalls: 6,
        maxTextureResolution: 1024,
        supportedCompressions: ['KHR_draco_mesh_compression', 'KHR_texture_basisu'],
        rigBoneCount: 22, // Extra bones for hijab sway
        canonicalHeightUnits: 0.96
      },
      clipCount: 8,
      rigNodeCount: 10,
      checksumAuditDate: '2026-08-20T06:50:00Z'
    }
  }
};
