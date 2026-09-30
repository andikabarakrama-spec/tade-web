export interface AIAsyCMSConfig {
  active: boolean;
  characterVariant: 'ASY' | 'ASYAH';
  outfit: 'PECI_GREEN' | 'HIJAB_GREEN' | 'UNIFORM_SCOUT' | 'SPORTS_BLUE';
  greetingText: string;
  homePosition: 'GARDEN_PORCH' | 'GATE_WELCOME' | 'CLASSROOM_READING';
  animationPreset: 'GENTLE_STORYBOOK' | 'ACTIVE_PLAYFUL' | 'CALM_PRAYER';
  lightingTheme: 'AUTO_REALTIME' | 'MORNING_GLOW' | 'GOLDEN_HOUR' | 'MOON_LIGHT';
  speechBubbleDelayMs: number;
  autoDismissMs: number;
  expressionPreset: string;
}

export const DEFAULT_AI_ASY_CMS_CONFIG: AIAsyCMSConfig = {
  active: true,
  characterVariant: 'ASY',
  outfit: 'PECI_GREEN',
  greetingText: "Assalamu'alaikum Ayah & Bunda 👋\nSelamat datang di TK Islam Asy Syifa!",
  homePosition: 'GARDEN_PORCH',
  animationPreset: 'GENTLE_STORYBOOK',
  lightingTheme: 'AUTO_REALTIME',
  speechBubbleDelayMs: 3500,
  autoDismissMs: 5000,
  expressionPreset: 'idle',
};

const CMS_CONFIG_KEY = 'tade_ai_asy_cms_config';

export const getAIAsyCMSConfig = (): AIAsyCMSConfig => {
  try {
    const raw = localStorage.getItem(CMS_CONFIG_KEY);
    if (!raw) return DEFAULT_AI_ASY_CMS_CONFIG;
    return { ...DEFAULT_AI_ASY_CMS_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_AI_ASY_CMS_CONFIG;
  }
};

export const saveAIAsyCMSConfig = (config: Partial<AIAsyCMSConfig>): AIAsyCMSConfig => {
  const current = getAIAsyCMSConfig();
  const updated = { ...current, ...config };
  localStorage.setItem(CMS_CONFIG_KEY, JSON.stringify(updated));
  return updated;
};
