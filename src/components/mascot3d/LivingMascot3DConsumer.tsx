/**
 * TADE 3D LIVING BEHAVIOR INTEGRATION — PASSIVE 3D CONSUMER
 * 
 * Architectural Contract:
 * - Pure passive consumer of `CharacterBehaviorOrchestrator` (Global Behavior Authority).
 * - Zero business logic mutation, zero state arbitration duplication.
 * - Bridges Orchestrator Behavior State -> Semantic 3D Animation ('idle' | 'happy' | 'nod' | 'wave').
 * - Renders GLB in Mascot3DCanvasAdapter with isolated error boundary.
 * - Multi-tiered Zero-Crash Fallback to canonical 2.5D (<Asy /> / <Syifa />) on WebGL / load / GPU issues.
 * - Governed by TADE Animation Governor and Lite Mode.
 */

import React, { useMemo } from 'react';
import { 
  characterBehaviorOrchestrator, 
  useCharacterBehavior,
  CharacterId 
} from '../../services/characterBehaviorOrchestrator';
import { 
  Mascot3DCharacterId, 
  MascotAnimation, 
  mapBehaviorToMascotAnimation 
} from '../../core/mascot3d/mascot3DAnimationBridge';
import { Mascot3DCanvasAdapter } from './Mascot3DCanvasAdapter';
import { Mascot3DErrorBoundary } from './Mascot3DErrorBoundary';
import { Syifa } from '../mascot/Syifa';
import { Asy } from '../mascot/Asy';

export interface LivingMascot3DConsumerProps {
  characterId: Mascot3DCharacterId;
  size?: number;
  className?: string;
  overrideAnimation?: MascotAnimation;
  fallback?: React.ReactNode;
  onClick?: () => void;
}

export const LivingMascot3DConsumer: React.FC<LivingMascot3DConsumerProps> = ({
  characterId,
  size = 180,
  className = '',
  overrideAnimation,
  fallback,
  onClick
}) => {
  // 1. Passively observe CharacterBehaviorOrchestrator state for this character
  const { state } = useCharacterBehavior(characterId as CharacterId);

  // 2. Derive semantic 3D animation from the active behavior state
  const semanticAnimation: MascotAnimation = useMemo(() => {
    if (overrideAnimation) return overrideAnimation;
    if (!state) return 'idle';
    return mapBehaviorToMascotAnimation(
      state.currentBehavior,
      state.movementStyle,
      state.expression
    );
  }, [overrideAnimation, state?.currentBehavior, state?.movementStyle, state?.expression]);

  // 3. Canonical 2.5D fallback if 3D fails
  const defaultFallback = useMemo(() => {
    if (fallback) return fallback;
    if (characterId === 'SYIFA') {
      return (
        <Syifa 
          size={size} 
          className={className} 
          onClick={onClick}
          expression={state?.expression === 'TERTAWA' || state?.expression === 'ANTUSIAS' ? 'happy' : 'idle'}
          pose={semanticAnimation === 'wave' ? 'wave' : semanticAnimation === 'happy' ? 'butterfly' : 'idle-stand'}
        />
      );
    }
    return (
      <Asy 
        size={size} 
        className={className} 
        onClick={onClick}
        expression={state?.expression === 'TERTAWA' || state?.expression === 'ANTUSIAS' ? 'happy' : 'idle'}
        pose={semanticAnimation === 'wave' ? 'wave' : semanticAnimation === 'happy' ? 'peek' : 'idle-stand'}
      />
    );
  }, [fallback, characterId, size, className, onClick, state?.expression, semanticAnimation]);

  return (
    <Mascot3DErrorBoundary fallback={defaultFallback}>
      <Mascot3DCanvasAdapter
        characterId={characterId}
        animation={semanticAnimation}
        size={size}
        className={className}
        fallback={defaultFallback}
        onClick={onClick}
      />
    </Mascot3DErrorBoundary>
  );
};
