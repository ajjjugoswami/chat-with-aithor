export interface ModelVariant {
  id: string;
  name: string;
  displayName: string;
  tier: 'free' | 'premium';
  icon?: string;
  color?: string;
  isDefault?: boolean;
}

export interface ModelWithVariants {
  baseModelId: string;
  variants: ModelVariant[];
}

// Define available variants for each base model
export const MODEL_VARIANTS: ModelWithVariants[] = [
  {
    baseModelId: "gpt-4o-mini",
    variants: [
      {
        id: "gpt-4o-mini",
        name: "gpt-4o-mini",
        displayName: "GPT-4o mini",
        tier: "free",
        color: "#10a37f",
        isDefault: true,
      },
      {
        id: "gpt-4",
        name: "gpt-4",
        displayName: "GPT-4",
        tier: "premium",
        color: "#10a37f",
      },
      {
        id: "gpt-3.5-turbo",
        name: "gpt-3.5-turbo",
        displayName: "GPT-3.5",
        tier: "free",
        color: "#10a37f",
      },
    ],
  },
  {
    baseModelId: "gemini-2.5-pro",
    variants: [
      {
        id: "gemini-2.5-lite",
        name: "gemini-2.5-lite",
        displayName: "Gemini 2.5 Lite",
        tier: "free",
        color: "#4285f4",
        isDefault: true,
      },
      {
        id: "gemini-2.5-flash",
        name: "gemini-2.5-flash",
        displayName: "Gemini 2.5 Flash",
        tier: "premium",
        color: "#4285f4",
      },
      {
        id: "gemini-1.5-pro",
        name: "gemini-1.5-pro",
        displayName: "Gemini 1.5 Pro",
        tier: "premium",
        color: "#4285f4",
      },
      {
        id: "gemini-2.5-pro",
        name: "gemini-2.5-pro",
        displayName: "Gemini 2.5 Pro",
        tier: "premium",
        color: "#4285f4",
      },
    ],
  },
  {
    baseModelId: "perplexity-sonar",
    variants: [
      {
        id: "perplexity-sonar",
        name: "perplexity-sonar",
        displayName: "Sonar",
        tier: "free",
        color: "#9c27b0",
        isDefault: true,
      },
      {
        id: "perplexity-sonar-pro",
        name: "perplexity-sonar-pro",
        displayName: "Sonar Pro",
        tier: "premium",
        color: "#9c27b0",
      },
    ],
  },
  {
    baseModelId: "deepseek-chat",
    variants: [
      {
        id: "deepseek-chat",
        name: "deepseek-chat",
        displayName: "DeepSeek Chat",
        tier: "free",
        color: "#1976d2",
        isDefault: true,
      },
      {
        id: "deepseek-coder",
        name: "deepseek-coder",
        displayName: "DeepSeek Coder",
        tier: "premium",
        color: "#1976d2",
      },
    ],
  },
  {
    baseModelId: "claude-3-haiku",
    variants: [
      {
        id: "claude-3-haiku",
        name: "claude-3-haiku",
        displayName: "Claude 3 Haiku",
        tier: "free",
        color: "#ff6b35",
        isDefault: true,
      },
      {
        id: "claude-3-sonnet",
        name: "claude-3-sonnet",
        displayName: "Claude 3 Sonnet",
        tier: "premium",
        color: "#ff6b35",
      },
      {
        id: "claude-3-opus",
        name: "claude-3-opus",
        displayName: "Claude 3 Opus",
        tier: "premium",
        color: "#ff6b35",
      },
    ],
  },
];

// Helper functions
export function getVariantsForModel(baseModelId: string): ModelVariant[] {
  const modelWithVariants = MODEL_VARIANTS.find(m => m.baseModelId === baseModelId);
  return modelWithVariants?.variants || [];
}

export function getDefaultVariantForModel(baseModelId: string): ModelVariant | null {
  const variants = getVariantsForModel(baseModelId);
  return variants.find(v => v.isDefault) || variants[0] || null;
}

export function getVariantById(variantId: string): ModelVariant | null {
  for (const modelWithVariants of MODEL_VARIANTS) {
    const variant = modelWithVariants.variants.find(v => v.id === variantId);
    if (variant) return variant;
  }
  return null;
}
