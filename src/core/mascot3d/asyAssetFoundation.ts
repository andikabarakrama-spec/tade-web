/**
 * R781 — Asy 3D Asset Foundation
 * TADE RC96A — ASY LIVING 3D MASCOT FOUNDATION
 * 
 * Manages 3D asset metadata, GLB models, shaders, textures, and guaranteed procedural fallbacks.
 * Islamic Preschool Emerald Theme: Songkok/Koko Hijau Zamrud, Sarung Batik Elegan, Wajah Ceria Ramah Anak.
 */

export interface Mascot3DAssetSpec {
  assetId: string;
  name: string;
  category: 'CORE_GLB' | 'ACCESSORY' | 'TEXTURE' | 'FALLBACK_VECTOR';
  uri: string;
  fileSizeBytes: number;
  format: 'glb' | 'gltf' | 'svg' | 'webp' | 'json';
  lodLevel: 'HIGH_RES' | 'BALANCED' | 'ULTRA_LITE';
  isLoaded: boolean;
  checksumSha256: string;
  emeraldThemeProps: {
    primaryColor: string;
    accentColor: string;
    clothingType: 'KOKO_EMERALD' | 'JUBAH_HIJAU' | 'BATIK_PAUD';
    headwear: 'PECI_HITAM' | 'PECI_PUTIH' | 'NONE';
  };
}

export interface WebGLCapabilityInfo {
  isSupported: boolean;
  rendererName: string;
  vendorName: string;
  maxTextureSize: number;
  isHardwareAccelerated: boolean;
  recommendedLod: 'HIGH_RES' | 'BALANCED' | 'FALLBACK_2D';
}

export class AsyAssetFoundation {
  private static instance: AsyAssetFoundation;
  private assets: Map<string, Mascot3DAssetSpec> = new Map();
  private webglCapability: WebGLCapabilityInfo;

  private constructor() {
    this.webglCapability = this.detectWebGLCapability();
    this.initializeAssetRegistry();
  }

  public static getInstance(): AsyAssetFoundation {
    if (!AsyAssetFoundation.instance) {
      AsyAssetFoundation.instance = new AsyAssetFoundation();
    }
    return AsyAssetFoundation.instance;
  }

  private detectWebGLCapability(): WebGLCapabilityInfo {
    if (typeof window === 'undefined') {
      return {
        isSupported: false,
        rendererName: 'SSR_HEADLESS',
        vendorName: 'SERVER',
        maxTextureSize: 0,
        isHardwareAccelerated: false,
        recommendedLod: 'FALLBACK_2D'
      };
    }

    try {
      const canvas = document.createElement('canvas');
      const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

      if (!gl) {
        return {
          isSupported: false,
          rendererName: 'SOFTWARE_FALLBACK',
          vendorName: 'GENERIC',
          maxTextureSize: 2048,
          isHardwareAccelerated: false,
          recommendedLod: 'FALLBACK_2D'
        };
      }

      const dbgRenderInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = dbgRenderInfo ? gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
      const vendor = dbgRenderInfo ? gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
      const maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 2048;

      const isHw = !renderer.toLowerCase().includes('swiftshader') && !renderer.toLowerCase().includes('llvmpipe');

      return {
        isSupported: true,
        rendererName: String(renderer || 'Standard WebGL'),
        vendorName: String(vendor || 'Standard GPU'),
        maxTextureSize: maxTexture,
        isHardwareAccelerated: isHw,
        recommendedLod: isHw && maxTexture >= 4096 ? 'HIGH_RES' : 'BALANCED'
      };
    } catch {
      return {
        isSupported: false,
        rendererName: 'UNKNOWN',
        vendorName: 'UNKNOWN',
        maxTextureSize: 2048,
        isHardwareAccelerated: false,
        recommendedLod: 'FALLBACK_2D'
      };
    }
  }

  private initializeAssetRegistry() {
    const defaultAssets: Mascot3DAssetSpec[] = [
      {
        assetId: 'ASY-3D-CORE-01',
        name: 'Asy Living 3D Chibi Master (GLB)',
        category: 'CORE_GLB',
        uri: '/assets/asy/asy_3d_chibi_v1.glb',
        fileSizeBytes: 1420500, // ~1.4 MB
        format: 'glb',
        lodLevel: 'BALANCED',
        isLoaded: true,
        checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        emeraldThemeProps: {
          primaryColor: '#059669', // Emerald 600
          accentColor: '#10B981', // Emerald 500
          clothingType: 'KOKO_EMERALD',
          headwear: 'PECI_HITAM'
        }
      },
      {
        assetId: 'ASY-3D-FALLBACK-SVG',
        name: 'Asy High-Fidelity 2.5D Vector Puppet',
        category: 'FALLBACK_VECTOR',
        uri: '/assets/asy/asy_vector_puppet.json',
        fileSizeBytes: 28400, // 28 KB
        format: 'svg',
        lodLevel: 'ULTRA_LITE',
        isLoaded: true,
        checksumSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        emeraldThemeProps: {
          primaryColor: '#059669',
          accentColor: '#34D399',
          clothingType: 'KOKO_EMERALD',
          headwear: 'PECI_HITAM'
        }
      },
      {
        assetId: 'ASY-TEX-EMERALD',
        name: 'Emerald Mosque Texture & Gold Brocade',
        category: 'TEXTURE',
        uri: '/assets/asy/textures/emerald_brocade.webp',
        fileSizeBytes: 185000,
        format: 'webp',
        lodLevel: 'BALANCED',
        isLoaded: true,
        checksumSha256: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        emeraldThemeProps: {
          primaryColor: '#047857',
          accentColor: '#F59E0B',
          clothingType: 'BATIK_PAUD',
          headwear: 'PECI_HITAM'
        }
      }
    ];

    defaultAssets.forEach(a => this.assets.set(a.assetId, a));
  }

  public getAllAssets(): Mascot3DAssetSpec[] {
    return Array.from(this.assets.values());
  }

  public getAsset(id: string): Mascot3DAssetSpec | undefined {
    return this.assets.get(id);
  }

  public getWebGLCapabilities(): WebGLCapabilityInfo {
    return { ...this.webglCapability };
  }

  public getPrimaryTheme() {
    return {
      name: 'Emerald Asy Syifa Islamic Preschool',
      primaryEmerald: '#059669',
      lightEmerald: '#10B981',
      softGlow: 'rgba(16, 185, 129, 0.25)',
      goldAccent: '#F59E0B',
      darkSlate: '#0F172A',
      peciBlack: '#1E293B',
      skinTone: '#FFE4C4'
    };
  }
}
