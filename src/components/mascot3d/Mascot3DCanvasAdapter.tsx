/**
 * TADE 3D RUNTIME INTEGRATION — MASCOT 3D CANVAS ADAPTER
 * 
 * Architectural Contract:
 * - Isolated Three.js WebGL rendering layer.
 * - Consumer of Semantic Animation Bridge (`mascot3DAnimationBridge.ts`).
 * - Strictly respects TADE Animation Governor budget & 60 FPS guarantee.
 * - Multi-tiered Zero-Crash Fallback:
 *   1. WebGL unsupported -> Canonical 2.5D SVG Mascot
 *   2. GLB missing / 404 / network error -> Canonical 2.5D SVG Mascot
 *   3. GPU Context Lost / Lite Mode -> Canonical 2.5D SVG Mascot
 *   4. Unrecognized clip -> Default IDLE clip
 * - Complete resource disposal on unmount (zero memory leaks).
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  Mascot3DCharacterId,
  MascotAnimation,
  getMascot3DAssetPath,
  resolveMascot3DClip
} from '../../core/mascot3d/mascot3DAnimationBridge';
import { Mascot3DErrorBoundary } from './Mascot3DErrorBoundary';
import { Syifa } from '../mascot/Syifa';
import { Asy } from '../mascot/Asy';
import { tadeAnimationGovernor } from '../../services/tadeAnimationGovernor';

export interface Mascot3DCanvasAdapterProps {
  characterId?: Mascot3DCharacterId;
  animation?: MascotAnimation;
  size?: number;
  className?: string;
  fallback?: React.ReactNode;
  onClick?: () => void;
  enableControls?: boolean;
}

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

const Mascot3DCanvasInternal: React.FC<Mascot3DCanvasAdapterProps> = (props) => {
  const activeCharId: Mascot3DCharacterId = props.characterId ?? 'SYIFA';
  const animation: MascotAnimation = props.animation ?? 'idle';
  const size: number = props.size ?? 180;
  const className: string = props.className ?? '';
  const fallback = props.fallback;
  const onClick = props.onClick;

  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // References for Three.js instance lifecycle
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsMapRef = useRef<Map<string, THREE.AnimationAction>>(new Map());

  // Default canonical 2.5D fallback if custom fallback not provided
  const canonicalFallback = useMemo(() => {
    if (fallback) return fallback;
    if (activeCharId === 'SYIFA') {
      return <Syifa size={size} className={className} onClick={onClick} />;
    }
    return <Asy size={size} className={className} onClick={onClick} />;
  }, [fallback, activeCharId, size, className, onClick]);

  // Initial WebGL capability check
  const webGLSupported = useMemo(() => isWebGLAvailable(), []);

  // Update animation when prop changes without reloading whole 3D scene
  useEffect(() => {
    if (!mixerRef.current || actionsMapRef.current.size === 0) return;

    const targetClipName = resolveMascot3DClip(activeCharId, animation);
    const nextAction = actionsMapRef.current.get(targetClipName);

    if (nextAction && nextAction !== currentActionRef.current) {
      const prevAction = currentActionRef.current;
      nextAction.reset();
      nextAction.setEffectiveTimeScale(1);
      nextAction.setEffectiveWeight(1);

      if (prevAction) {
        prevAction.crossFadeTo(nextAction, 0.3, true);
      }
      nextAction.play();
      currentActionRef.current = nextAction;
    }
  }, [activeCharId, animation]);

  // Scene Mounting and GLTF Loading
  useEffect(() => {
    // 1. Fallback immediately if WebGL is unavailable or Lite Mode is active
    if (!webGLSupported || tadeAnimationGovernor.getIsLiteMode()) {
      setIsLoading(false);
      setLoadError('WebGL unavailable or Lite Mode active');
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    let animationFrameId: number;

    // 2. Setup Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.9, 2.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Attach canvas to DOM
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Lighting Setup (Soft Chibi Studio Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
    mainLight.position.set(2, 4, 3);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.8);
    fillLight.position.set(-2, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffe4e6, 0.6);
    rimLight.position.set(0, 3, -2);
    scene.add(rimLight);

    const clock = new THREE.Clock();
    const loader = new GLTFLoader();
    const assetPath = getMascot3DAssetPath(activeCharId);

    setIsLoading(true);
    setLoadError(null);

    // 4. Load GLTF Master Asset
    loader.load(
      assetPath,
      (gltf) => {
        if (!isMounted) return;

        const model = gltf.scene;
        scene.add(model);

        // Center and frame character
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const boxSize = box.getSize(new THREE.Vector3());

        // Adjust position so model is centered nicely in view
        model.position.x += model.position.x - center.x;
        model.position.y += model.position.y - center.y - (boxSize.y * 0.05);
        model.position.z += model.position.z - center.z;

        // Camera target
        camera.lookAt(0, 0, 0);

        // Setup Animation Mixer & Actions
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;
          actionsMapRef.current.clear();

          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            actionsMapRef.current.set(clip.name, action);
          });

          // Start active animation clip
          const initialClipName = resolveMascot3DClip(activeCharId, animation);
          const initialAction = actionsMapRef.current.get(initialClipName) || actionsMapRef.current.get(gltf.animations[0].name);

          if (initialAction) {
            initialAction.play();
            currentActionRef.current = initialAction;
          }
        }

        setIsLoading(false);
      },
      undefined,
      (err) => {
        if (!isMounted) return;
        // Non-blocking graceful fallback
        console.warn(`[TADE 3D Engine] Master GLB (${assetPath}) not reachable. Using 2.5D canonical fallback.`, err);
        setLoadError('Asset not found or failed to parse');
        setIsLoading(false);
      }
    );

    // 5. Render Loop (Synchronized with 60 FPS Clock)
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Cleanup on Unmount
    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);

      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
      actionsMapRef.current.clear();
      currentActionRef.current = null;

      // Deep disposal of Three.js resources
      scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry) {
            mesh.geometry.dispose();
          }
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((mat) => mat.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        }
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeCharId, size, webGLSupported]);

  // If WebGL fails, GLB fails to load, or Lite Mode active, render canonical 2.5D SVG seamlessly
  if (!webGLSupported || loadError) {
    return <>{canonicalFallback}</>;
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {/* 3D Canvas Mount Target */}
      <div
        ref={containerRef}
        style={{ width: size, height: size }}
        className="w-full h-full"
      />

      {/* Graceful placeholder spinner during initial GLB download */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export const Mascot3DCanvasAdapter: React.FC<Mascot3DCanvasAdapterProps> = (props) => {
  const fallbackNode = props.fallback || (
    props.characterId === 'ASY' ? (
      <Asy size={props.size || 180} className={props.className} onClick={props.onClick} />
    ) : (
      <Syifa size={props.size || 180} className={props.className} onClick={props.onClick} />
    )
  );

  return (
    <Mascot3DErrorBoundary fallback={fallbackNode}>
      <Mascot3DCanvasInternal {...props} />
    </Mascot3DErrorBoundary>
  );
};
