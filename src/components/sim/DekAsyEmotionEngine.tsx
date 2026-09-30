import React from 'react';
import { MascotEmotion, MascotState } from './DekAsyStateMachine';

export interface FacialGeometry {
  eyeLidHeight: number; // 0 (closed) to 1 (wide open)
  eyeBlinkProgress: number; // 0 to 1
  pupilOffsetX: number; // -1 to 1
  pupilOffsetY: number; // -1 to 1
  eyebrowAngle: number; // -15 (sad/curious) to +15 (cheerful/excited)
  mouthCurve: number; // -1 (sad) to 1 (wide smile)
  mouthOpen: number; // 0 to 1 (speaking/laughing)
  blushOpacity: number; // 0 to 1
  headTilt: number; // -10 to +10 degrees
  breathingScaleY: number; // 0.98 to 1.02
}

export function computeFacialGeometry(
  emotion: MascotEmotion,
  state: MascotState,
  timeMs: number,
  targetPoint?: { x: number; y: number }
): FacialGeometry {
  // Breathing wave at ~12 breaths per minute (5s cycle)
  const breathingScaleY = 1 + 0.02 * Math.sin((timeMs / 5000) * 2 * Math.PI);

  // Automatic blink wave every 3.5s with 150ms blink duration
  const blinkCycle = timeMs % 3500;
  let eyeBlinkProgress = 0;
  if (blinkCycle < 150) {
    eyeBlinkProgress = Math.sin((blinkCycle / 150) * Math.PI);
  }

  // Base values per emotion
  let baseEyeLid = 0.9;
  let baseEyebrow = 5;
  let baseMouthCurve = 0.8;
  let baseMouthOpen = 0.1;
  let baseBlush = 0.4;
  let baseHeadTilt = 0;

  switch (emotion) {
    case 'CERIA':
      baseEyeLid = 0.95;
      baseEyebrow = 8;
      baseMouthCurve = 0.9;
      baseMouthOpen = 0.2;
      baseBlush = 0.5;
      baseHeadTilt = 2 * Math.sin(timeMs / 1000);
      break;

    case 'ANTUSIAS':
      baseEyeLid = 1.0;
      baseEyebrow = 14;
      baseMouthCurve = 1.0;
      baseMouthOpen = 0.4;
      baseBlush = 0.6;
      baseHeadTilt = 4 * Math.sin(timeMs / 800);
      break;

    case 'KHUSYUK':
      baseEyeLid = 0.3; // almost closed in prayer
      baseEyebrow = 0;
      baseMouthCurve = 0.4;
      baseMouthOpen = 0.05;
      baseBlush = 0.2;
      baseHeadTilt = 5; // bowed head
      break;

    case 'BANGGA':
      baseEyeLid = 0.9;
      baseEyebrow = 10;
      baseMouthCurve = 0.85;
      baseMouthOpen = 0.15;
      baseBlush = 0.6;
      baseHeadTilt = -3;
      break;

    case 'PEDULI':
      baseEyeLid = 0.8;
      baseEyebrow = -5; // gentle tilt
      baseMouthCurve = 0.5;
      baseMouthOpen = 0.1;
      baseBlush = 0.4;
      baseHeadTilt = 6;
      break;

    case 'HORMAT':
      baseEyeLid = 0.7;
      baseEyebrow = 2;
      baseMouthCurve = 0.6;
      baseMouthOpen = 0.05;
      baseBlush = 0.3;
      baseHeadTilt = 4;
      break;

    case 'FOKUS':
      baseEyeLid = 0.95;
      baseEyebrow = 6;
      baseMouthCurve = 0.3;
      baseMouthOpen = 0.0;
      baseBlush = 0.2;
      baseHeadTilt = 0;
      break;
  }

  // Override by state
  if (state === 'PRAYING') {
    baseEyeLid = 0.15;
    baseHeadTilt = 6;
    baseMouthCurve = 0.3;
  } else if (state === 'SLEEPING') {
    eyeBlinkProgress = 1;
    baseHeadTilt = 10;
    baseMouthCurve = 0.2;
  } else if (state === 'APPLAUDING' || state === 'CELEBRATING') {
    baseMouthOpen = 0.45;
    baseEyeLid = 0.85;
    baseHeadTilt = 3 * Math.sin(timeMs / 400);
  }

  // Pupil offsets
  let pupilOffsetX = 0;
  let pupilOffsetY = 0;
  if (targetPoint) {
    pupilOffsetX = Math.max(-0.8, Math.min(0.8, targetPoint.x));
    pupilOffsetY = Math.max(-0.6, Math.min(0.6, targetPoint.y));
  }

  return {
    eyeLidHeight: baseEyeLid * (1 - eyeBlinkProgress),
    eyeBlinkProgress,
    pupilOffsetX,
    pupilOffsetY,
    eyebrowAngle: baseEyebrow,
    mouthCurve: baseMouthCurve,
    mouthOpen: baseMouthOpen,
    blushOpacity: baseBlush,
    headTilt: baseHeadTilt,
    breathingScaleY
  };
}
