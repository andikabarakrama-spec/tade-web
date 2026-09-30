/**
 * TADE BRAND DNA ENGINE — SPRINT G4
 * Pure Brand Constitution & Official Visual Identity Enforcement
 * 100% TK Islam Asy Syifa Sovereign Identity.
 * Zero third-party watermarks, zero external SaaS dependencies.
 */

export interface BrandColorPalette {
  primary: string;       // Emerald 900: #064e3b
  primaryMedium: string; // Emerald 700: #047857
  primaryLight: string;  // Emerald 500: #10b981
  accentGold: string;    // Amber 500: #f59e0b
  accentGoldLight: string;// Amber 300: #fcd34d
  darkSlate: string;     // Slate 900: #0f172a
  darkBase: string;      // Slate 950: #020617
  white: string;         // #ffffff
  lightBg: string;       // Slate 50: #f8fafc
}

export const OFFICIAL_BRAND_PALETTE: BrandColorPalette = {
  primary: '#064e3b',
  primaryMedium: '#047857',
  primaryLight: '#10b981',
  accentGold: '#f59e0b',
  accentGoldLight: '#fcd34d',
  darkSlate: '#0f172a',
  darkBase: '#020617',
  white: '#ffffff',
  lightBg: '#f8fafc'
};

export interface BrandValidationResult {
  isCompliant: boolean;
  score: number; // 0 - 100
  passedChecks: string[];
  warnings: string[];
  violations: string[];
  safeMarginPx: number;
  level?: string;
  summary?: string;
}

export class BrandDnaEngine {
  private static instance: BrandDnaEngine | null = null;

  public static getInstance(): BrandDnaEngine {
    if (!BrandDnaEngine.instance) {
      BrandDnaEngine.instance = new BrandDnaEngine();
    }
    return BrandDnaEngine.instance;
  }

  // Forbidden third-party/AI slop terms according to Pure Brand Constitution
  private forbiddenTerms: string[] = [
    'ai',
    'chatgpt',
    'gemini',
    'openai',
    'firebase',
    'react',
    'vite',
    'powered by',
    'made with',
    'canva',
    'figma',
    'template by'
  ];

  /**
   * Draw Official TK Islam Asy Syifa Islamic Star / Octagram Emblem Seal on Canvas
   */
  public drawOfficialSeal(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    color: string = OFFICIAL_BRAND_PALETTE.accentGold
  ): void {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = Math.max(2, radius * 0.08);

    // 1. Draw outer circle
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Draw Islamic Octagram (Rub el Hizb - 2 overlapping rotated squares)
    const squareSize = radius * 0.75;
    ctx.save();
    ctx.translate(cx, cy);
    
    // First square
    ctx.strokeRect(-squareSize / 2, -squareSize / 2, squareSize, squareSize);
    
    // Second square rotated 45 degrees
    ctx.rotate(Math.PI / 4);
    ctx.strokeRect(-squareSize / 2, -squareSize / 2, squareSize, squareSize);
    ctx.restore();

    // 3. Central Dot / Crescent Accent
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draw Safe Print & Bleed Margins Guide Overlay on Canvas
   */
  public drawSafePrintMargins(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    showGuides: boolean = true
  ): void {
    if (!showGuides) return;

    ctx.save();
    const bleedPx = Math.round(Math.min(width, height) * 0.03); // 3% Bleed
    const safeMarginPx = Math.round(Math.min(width, height) * 0.06); // 6% Safe Zone

    // Outer Bleed line (Dashed cyan)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(bleedPx, bleedPx, width - bleedPx * 2, height - bleedPx * 2);

    // Inner Safe Print Zone (Dashed emerald)
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.9)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(safeMarginPx, safeMarginPx, width - safeMarginPx * 2, height - safeMarginPx * 2);

    // Label indicators
    ctx.fillStyle = 'rgba(52, 211, 153, 0.95)';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('SAFE PRINT ZONE', safeMarginPx + 6, safeMarginPx + 16);

    ctx.fillStyle = 'rgba(56, 189, 248, 0.95)';
    ctx.fillText('TRIM & BLEED LINE (3%)', bleedPx + 6, bleedPx + 16);

    ctx.restore();
  }

  /**
   * Validate content against Pure Brand Constitution rules
   */
  public validateBrandCompliance(
    texts: string[],
    themeColor: string,
    width: number,
    height: number
  ): BrandValidationResult {
    const passedChecks: string[] = [];
    const warnings: string[] = [];
    const violations: string[] = [];

    // 1. Check for forbidden third-party & AI slop words
    let hasForbidden = false;
    for (const text of texts) {
      const lower = text.toLowerCase();
      for (const term of this.forbiddenTerms) {
        // Regex word boundary match
        const regex = new RegExp(`\\b${term}\\b`, 'i');
        if (regex.test(lower)) {
          violations.push(`Pelanggaran Konstitusi Brand: Ditemukan kata terlarang "${term}" pada teks "${text.slice(0, 30)}..."`);
          hasForbidden = true;
        }
      }
    }

    if (!hasForbidden) {
      passedChecks.push('100% Bersih dari watermark & istilah pihak ketiga / AI slop.');
    }

    // 2. Ratio Check
    const ratio = width / height;
    const isStandardFeed = Math.abs(ratio - 0.8) < 0.05; // 4:5
    const isStandardStory = Math.abs(ratio - 0.5625) < 0.05; // 9:16
    const isStandardBanner = Math.abs(ratio - 3.0) < 0.1; // 3:1
    const isStandardSquare = Math.abs(ratio - 1.0) < 0.05; // 1:1

    if (isStandardFeed || isStandardStory || isStandardBanner || isStandardSquare) {
      passedChecks.push(`Rasio kanvas memenuhi standar proporsi resmi TADE (${width}x${height}px).`);
    } else {
      warnings.push(`Rasio kanvas (${ratio.toFixed(2)}) di luar standar resmi TADE (4:5, 9:16, 3:1).`);
    }

    // 3. Official Palette Check
    const lowerColor = themeColor.toLowerCase();
    const isOfficialColor = Object.values(OFFICIAL_BRAND_PALETTE).some(c => c.toLowerCase() === lowerColor) ||
      lowerColor.startsWith('#0') || lowerColor.startsWith('#1'); // Dark/emerald shades

    if (isOfficialColor) {
      passedChecks.push('Skema warna selaras dengan palet institusi Emerald & Gold Asy Syifa.');
    } else {
      warnings.push('Warna tema utama di luar palet resmi Emerald/Teal/Slate TK Islam Asy Syifa.');
    }

    // 4. Calculate Final Score
    let score = 100;
    score -= violations.length * 40;
    score -= warnings.length * 10;
    score = Math.max(0, Math.min(100, score));

    return {
      isCompliant: violations.length === 0,
      score,
      passedChecks,
      warnings,
      violations,
      safeMarginPx: Math.round(Math.min(width, height) * 0.06)
    };
  }
}

export const brandDnaEngine = BrandDnaEngine.getInstance();
