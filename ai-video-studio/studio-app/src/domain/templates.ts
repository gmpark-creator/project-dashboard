import type { Aspect, Intent, Tier } from "./types";

export type IntentTemplate = {
  intent: Intent;
  label: string;
  defaults: {
    aspect: Aspect;
    durationSec: number;
    tier: Tier;
    shotCount: { min: number; max: number };
  };
};

export const INTENT_TEMPLATES: Record<Intent, IntentTemplate> = {
  shorts: {
    intent: "shorts",
    label: "쇼츠",
    defaults: { aspect: "9:16", durationSec: 15, tier: "fast", shotCount: { min: 4, max: 10 } }
  },
  product_ad: {
    intent: "product_ad",
    label: "제품 광고",
    defaults: { aspect: "9:16", durationSec: 30, tier: "fast", shotCount: { min: 6, max: 12 } }
  },
  app_intro: {
    intent: "app_intro",
    label: "앱 소개",
    defaults: { aspect: "16:9", durationSec: 60, tier: "fast", shotCount: { min: 8, max: 15 } }
  },
  real_estate: {
    intent: "real_estate",
    label: "공간 소개",
    defaults: { aspect: "16:9", durationSec: 90, tier: "fast", shotCount: { min: 15, max: 30 } }
  },
  education: {
    intent: "education",
    label: "교육",
    defaults: { aspect: "16:9", durationSec: 60, tier: "fast", shotCount: { min: 3, max: 8 } }
  },
  brand: {
    intent: "brand",
    label: "브랜드 캠페인",
    defaults: { aspect: "16:9", durationSec: 60, tier: "fast", shotCount: { min: 15, max: 30 } }
  }
};
