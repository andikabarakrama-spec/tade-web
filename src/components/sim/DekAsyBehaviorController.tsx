import React, { useEffect, useState } from 'react';
import { MascotStateMachine, MascotState, MascotEmotion, MascotCostume } from './DekAsyStateMachine';

export interface TimeContextSchedule {
  periodName: 'PAGI_CERIA' | 'SIANG_SENTRA' | 'SORE_PENJEMPUTAN' | 'MALAM_ISTIRAHAT';
  recommendedGreeting: string;
  recommendedState: MascotState;
  recommendedEmotion: MascotEmotion;
}

export function getTimeContext(): TimeContextSchedule {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) {
    return {
      periodName: 'PAGI_CERIA',
      recommendedGreeting: 'Selamat pagi teman-teman Asy-Syifatan! Semangat belajar dan tahfidz ya!',
      recommendedState: 'GREETING',
      recommendedEmotion: 'CERIA'
    };
  } else if (hour >= 11 && hour < 14) {
    return {
      periodName: 'SIANG_SENTRA',
      recommendedGreeting: 'Waktunya makan siang bergizi & istirahat sejenak setelah bermain di sentra!',
      recommendedState: 'STUDYING',
      recommendedEmotion: 'FOKUS'
    };
  } else if (hour >= 14 && hour < 18) {
    return {
      periodName: 'SORE_PENJEMPUTAN',
      recommendedGreeting: 'Waktu penjemputan tiba! Jangan lupa cek barcode QR Ayah/Bunda ya!',
      recommendedState: 'GREETING',
      recommendedEmotion: 'PEDULI'
    };
  } else {
    return {
      periodName: 'MALAM_ISTIRAHAT',
      recommendedGreeting: 'Selamat beristirahat. Semoga esok hari semakin bersemangat & berakhlak mulia!',
      recommendedState: 'PRAYING',
      recommendedEmotion: 'KHUSYUK'
    };
  }
}

export interface UseDekAsyBehaviorProps {
  stateMachine: MascotStateMachine;
  autoGreeting?: boolean;
}

export function useDekAsyBehavior({ stateMachine, autoGreeting = true }: UseDekAsyBehaviorProps) {
  const [currentGreeting, setCurrentGreeting] = useState<string>('');
  const [timeContext, setTimeContext] = useState<TimeContextSchedule>(getTimeContext());

  useEffect(() => {
    const ctx = getTimeContext();
    setTimeContext(ctx);
    if (autoGreeting) {
      setCurrentGreeting(ctx.recommendedGreeting);
    }

    // Interval to refresh time of day context
    const timer = setInterval(() => {
      setTimeContext(getTimeContext());
    }, 60000);

    return () => clearInterval(timer);
  }, [autoGreeting]);

  const triggerGesture = (state: MascotState, customSpeech?: string, emotion?: MascotEmotion) => {
    stateMachine.transitionTo(state, 'USER_CLICK', emotion);
    if (customSpeech) {
      setCurrentGreeting(customSpeech);
    }
  };

  const triggerPrayer = () => {
    triggerGesture('PRAYING', 'Bismillahi tawakkaltu ‘alallah, laa hawla wa laa quwwata illaa billaah.', 'KHUSYUK');
  };

  const triggerApplause = () => {
    triggerGesture('APPLAUDING', 'Maa Syaa Allah! Luar biasa sekali pencapaian ananda hari ini!', 'BANGGA');
  };

  const triggerPointing = (targetName: string) => {
    triggerGesture('POINTING', `Silakan klik tombol ${targetName} di sini ya!`, 'ANTUSIAS');
  };

  return {
    timeContext,
    currentGreeting,
    setCurrentGreeting,
    triggerGesture,
    triggerPrayer,
    triggerApplause,
    triggerPointing
  };
}
