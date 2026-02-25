export const APP_NAME = "PULSE";
export const APP_DESCRIPTION = "AI-Powered Dating. Smart connections, real chemistry.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pulsedating.app";

export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Spark",
    icon: "⚡",
    swipes_per_day: 10,
    max_active_matches: 3,
    ai_avatar_per_week: 1,
    boosts_per_month: 0,
    features: [
      "10 swipes per day",
      "3 active matches",
      "Basic chat (text only)",
      "1 AI avatar conversation/week",
      "Basic verification",
    ],
  },
  flame: {
    name: "Flame",
    icon: "⭐",
    swipes_per_day: -1, // unlimited
    max_active_matches: -1,
    ai_avatar_per_week: -1,
    boosts_per_month: 5,
    features: [
      "Unlimited swipes",
      "Unlimited matches",
      "Advanced chat (voice, photos, GIFs)",
      "Unlimited AI avatar conversations",
      "Voice cloning messages",
      "AI Date Coach",
      "Emotion AI tracking",
      "Predictive compatibility",
      "Personal AI Matchmaker",
      "See who liked you",
      "5 boosts/month",
      "Zero ads",
    ],
  },
  blaze: {
    name: "Blaze",
    icon: "👑",
    swipes_per_day: -1,
    max_active_matches: -1,
    ai_avatar_per_week: -1,
    boosts_per_month: 10,
    features: [
      "Everything in Flame",
      "AI Concierge 24/7",
      "Hyper-targeted matching",
      "Advanced video analysis",
      "Relationship forecast (6-12 months)",
      "Unlimited Dream Date Simulator",
      "Premium analytics dashboard",
      "Ghost protection",
      "Incognito mode",
      "10 super boosts/month",
      "VIP badge",
      "Priority support",
    ],
  },
} as const;

export const PRICING = {
  MZN: {
    flame: { monthly: 500, quarterly: 1350, annual: 4800 },
    blaze: { monthly: 1200, quarterly: 3200, annual: 10800 },
    currency: "MZN",
    symbol: "MZN",
  },
  USD: {
    flame: { monthly: 14.99, quarterly: 38.99, annual: 143.88 },
    blaze: { monthly: 34.99, quarterly: 89.99, annual: 335.88 },
    currency: "USD",
    symbol: "$",
  },
  EUR: {
    flame: { monthly: 9.99, quarterly: 25.99, annual: 89.99 },
    blaze: { monthly: 24.99, quarterly: 64.99, annual: 224.99 },
    currency: "EUR",
    symbol: "€",
  },
  BRL: {
    flame: { monthly: 39.90, quarterly: 99.90, annual: 359.90 },
    blaze: { monthly: 99.90, quarterly: 269.90, annual: 899.90 },
    currency: "BRL",
    symbol: "R$",
  },
} as const;

export const CREATIVE_PROMPTS = {
  personality: [
    "O meu superpoder secreto é...",
    "Vou ter discussões apaixonadas sobre...",
    "Quando ninguém está a ver, eu...",
    "Minha vibe é...",
    "A coisa mais aleatória que me faz rir...",
  ],
  values: [
    "Para mim, relacionamento de sucesso tem...",
    "Eu acredito fortemente que...",
    "Nunca vou mudar de opinião sobre...",
    "Cresci a pensar X, agora acho Y...",
    "O que me mantém acordado à noite...",
  ],
  flags: [
    "Red flag instantânea para mim:",
    "Green flag que me conquista:",
    "Deal breaker absoluto:",
    "Pequena coisa que me faz apaixonar:",
  ],
  fun: [
    "Conta uma piada (boa ou má):",
    "Ensina-me algo em 30 segundos:",
    "Teoria da conspiração em que acreditas:",
    "Guilty pleasure indefensável:",
    "A minha hot take mais controversa:",
  ],
} as const;

export const SUPPORTED_LANGUAGES = [
  { code: "pt", name: "Português" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "sw", name: "Kiswahili" },
  { code: "zu", name: "isiZulu" },
  { code: "xh", name: "isiXhosa" },
] as const;
