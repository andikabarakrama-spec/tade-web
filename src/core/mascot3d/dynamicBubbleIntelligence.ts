/**
 * TADE RC98 — R805: Dynamic Bubble Intelligence
 * Penempatan cerdas speech bubble Asy di layar mobile & desktop
 * Prioritas: 1. Atas, 2. Kiri, 3. Diagonal
 * Menjamin tidak pernah terpotong di tepi layar HP (360–430px)
 */

export type BubbleComputedPosition = 'TOP' | 'LEFT' | 'DIAGONAL_TOP_LEFT' | 'COMPACT_PILL';

export interface DynamicBubblePlacement {
  computedPosition: BubbleComputedPosition;
  bubbleClassNames: string;
  arrowPosition: 'BOTTOM' | 'RIGHT' | 'BOTTOM_RIGHT';
  maxWidthPx: number;
  offsetX: number;
  offsetY: number;
}

export class DynamicBubbleIntelligence {
  private static instance: DynamicBubbleIntelligence;

  private constructor() {}

  public static getInstance(): DynamicBubbleIntelligence {
    if (!DynamicBubbleIntelligence.instance) {
      DynamicBubbleIntelligence.instance = new DynamicBubbleIntelligence();
    }
    return DynamicBubbleIntelligence.instance;
  }

  /**
   * Menghitung posisi optimal bubble berdasarkan posisi dock dan dimensi layar
   */
  public computeOptimalPlacement(
    dockBottomPx: number,
    dockRightPx: number,
    screenWidth: number = typeof window !== 'undefined' ? window.innerWidth : 390,
    screenHeight: number = typeof window !== 'undefined' ? window.innerHeight : 844
  ): DynamicBubblePlacement {
    const isMobile = screenWidth <= 480;
    const maxAllowedWidth = Math.min(280, screenWidth - 40);

    // Cek ketersediaan ruang di atas dock
    const spaceAbove = dockBottomPx + 90 < screenHeight - 60;
    const spaceLeft = dockRightPx + maxAllowedWidth < screenWidth - 20;

    // Prioritas 1: TOP (di atas kepala Asy)
    if (spaceAbove) {
      return {
        computedPosition: 'TOP',
        bubbleClassNames: 'bottom-full mb-3 right-0 origin-bottom-right',
        arrowPosition: 'BOTTOM',
        maxWidthPx: maxAllowedWidth,
        offsetX: 0,
        offsetY: 8
      };
    }

    // Prioritas 2: LEFT (di sisi kiri Asy)
    if (spaceLeft) {
      return {
        computedPosition: 'LEFT',
        bubbleClassNames: 'right-full mr-3 bottom-2 origin-bottom-right',
        arrowPosition: 'RIGHT',
        maxWidthPx: Math.min(220, screenWidth - 100),
        offsetX: 10,
        offsetY: 0
      };
    }

    // Prioritas 3: DIAGONAL_TOP_LEFT
    return {
      computedPosition: isMobile ? 'COMPACT_PILL' : 'DIAGONAL_TOP_LEFT',
      bubbleClassNames: 'bottom-full mb-2 right-4 origin-bottom',
      arrowPosition: 'BOTTOM_RIGHT',
      maxWidthPx: Math.max(200, screenWidth - 60),
      offsetX: 4,
      offsetY: 6
    };
  }
}
