/**
 * TADE v9.2.0-MCA2 — R928
 * MASTER CHARACTER ASSET LOADER
 * 
 * Safe, fault-tolerant asset loader:
 * 1. Checks priority for Rive animation files (`master.riv`)
 * 2. Falls back smoothly to master SVG (`master.svg`)
 * 3. Falls back seamlessly to procedural React Vector SVG components
 * 
 * Guarantees zero crashes and immediate rendering even before external assets arrive.
 */

import { CharacterId, MASTER_CHARACTER_REGISTRY } from './masterCharacterRegistry';

export type CharacterAssetFormat = 'RIVE' | 'SVG' | 'WEBP' | 'PROCEDURAL';

export type CharacterLoadStatus = 'IDLE' | 'LOADING' | 'READY' | 'FALLBACK_READY' | 'ERROR';

export interface LoadedCharacterAsset {
  characterId: CharacterId;
  format: CharacterAssetFormat;
  status: CharacterLoadStatus;
  primaryUri: string;
  fallbackUri: string;
  isFallback: boolean;
  loadDurationMs: number;
  errorMessage?: string;
  contentData?: string | ArrayBuffer;
}

export class CharacterAssetLoader {
  private cache: Map<string, LoadedCharacterAsset> = new Map();
  private pendingLoads: Map<string, Promise<LoadedCharacterAsset>> = new Map();

  /**
   * Load character asset with automatic priority & graceful fallback
   */
  public async loadCharacter(characterId: CharacterId): Promise<LoadedCharacterAsset> {
    const cacheKey = `char_${characterId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    if (this.pendingLoads.has(cacheKey)) {
      return this.pendingLoads.get(cacheKey)!;
    }

    const loadPromise = this.performLoad(characterId);
    this.pendingLoads.set(cacheKey, loadPromise);

    try {
      const result = await loadPromise;
      this.cache.set(cacheKey, result);
      return result;
    } finally {
      this.pendingLoads.delete(cacheKey);
    }
  }

  private async performLoad(characterId: CharacterId): Promise<LoadedCharacterAsset> {
    const startTime = performance.now();
    const basePath = `/src/assets/master-characters/${characterId.toLowerCase()}`;
    const rivePath = `${basePath}/master.riv`;
    const svgPath = `${basePath}/master.svg`;

    // 1. Try loading Rive file if in browser environment
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      try {
        const riveRes = await fetch(rivePath, { method: 'HEAD' });
        if (riveRes.ok && riveRes.headers.get('content-type')?.includes('application/octet-stream')) {
          const loadDurationMs = performance.now() - startTime;
          return {
            characterId,
            format: 'RIVE',
            status: 'READY',
            primaryUri: rivePath,
            fallbackUri: svgPath,
            isFallback: false,
            loadDurationMs
          };
        }
      } catch {
        // Fallthrough to SVG
      }

      // 2. Try loading master SVG
      try {
        const svgRes = await fetch(svgPath, { method: 'HEAD' });
        if (svgRes.ok) {
          const loadDurationMs = performance.now() - startTime;
          return {
            characterId,
            format: 'SVG',
            status: 'READY',
            primaryUri: svgPath,
            fallbackUri: 'PROCEDURAL_VECTOR',
            isFallback: false,
            loadDurationMs
          };
        }
      } catch {
        // Fallthrough to Procedural
      }
    }

    // 3. Guaranteed zero-crash fallback: Procedural Canon Vector
    const loadDurationMs = performance.now() - startTime;
    return {
      characterId,
      format: 'PROCEDURAL',
      status: 'FALLBACK_READY',
      primaryUri: 'PROCEDURAL_VECTOR',
      fallbackUri: 'PROCEDURAL_VECTOR',
      isFallback: true,
      loadDurationMs
    };
  }

  public getCachedAsset(characterId: CharacterId): LoadedCharacterAsset | undefined {
    return this.cache.get(`char_${characterId}`);
  }

  public clearCache(): void {
    this.cache.clear();
    this.pendingLoads.clear();
  }
}

export const defaultAssetLoader = new CharacterAssetLoader();
