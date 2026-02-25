"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Zap } from "lucide-react";

type BillingPeriod = "monthly" | "quarterly" | "annual";

const tiers = [
  {
    name: "Spark",
    icon: Zap,
    description: "Começa a tua jornada",
    price: { monthly: 0, quarterly: 0, annual: 0 },
    features: [
      "10 swipes por dia",
      "3 matches ativos",
      "Chat básico (só texto)",
      "1 conversa IA por semana",
      "Verificação básica",
      "Prompts criativos",
      "Nota de voz no perfil",
    ],
    cta: "Começar Grátis",
    gradient: "from-gray-500 to-gray-600",
    popular: false,
  },
  {
    name: "Flame",
    icon: Sparkles,
    description: "Para quem leva a sério",
    price: { monthly: 14.99, quarterly: 38.99, annual: 143.88 },
    features: [
      "Swipes e matches ilimitados",
      "Chat avançado (voz, fotos, GIFs)",
      "Conversas IA ilimitadas",
      "Mensagens com clonagem de voz",
      "Coach de encontros (tempo real)",
      "Tracking emocional com IA",
      "Compatibilidade preditiva",
      "Matchmaker IA pessoal",
      "Ver quem te deu like",
      "5 boosts/mês",
      "Ideias de encontro inteligentes",
      "Debrief pós-encontro",
      "Zero anúncios",
    ],
    cta: "Upgrade para Flame",
    gradient: "from-[#E10600] via-[#FF3B5C] to-[#FF5E9C]",
    popular: true,
  },
  {
    name: "Blaze",
    icon: Crown,
    description: "A experiência máxima",
    price: { monthly: 34.99, quarterly: 89.99, annual: 335.88 },
    features: [
      "Tudo do Flame",
      "Concierge IA 24/7",
      "Matching hiper-personalizado",
      "Análise avançada de vídeo",
      "Previsão de relação (6-12 meses)",
      "Simulador de encontros ilimitado",
      "Dashboard de analytics premium",
      "Proteção anti-ghosting",
      "Modo incógnito",
      "10 super boosts/mês",
      "Badge VIP e suporte prioritário",
      "Filtros avançados (50+ critérios)",
    ],
    cta: "Ir de Blaze",
    gradient: "from-amber-400 via-yellow-500 to-orange-500",
    popular: false,
  },
];

export function Pricing() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  const getSavings = (period: BillingPeriod) => {
    if (period === "quarterly") return "-10%";
    if (period === "annual") return "-20%";
    return null;
  };

  const periodLabels: Record<BillingPeriod, string> = {
    monthly: "Mensal",
    quarterly: "Trimestral",
    annual: "Anual",
  };

  return (
    <section className="relative py-24 px-4" id="pricing">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white sm:text-5xl">
            Preços{" "}
            <span className="gradient-text">
              simples e transparentes
            </span>
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Começa grátis. Faz upgrade quando quiseres mais.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {(["monthly", "quarterly", "annual"] as BillingPeriod[]).map((period) => (
            <button
              key={period}
              onClick={() => setBilling(period)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all ${
                billing === period
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {periodLabels[period]}
              {getSavings(period) && (
                <span className="ml-1.5 text-xs text-emerald-400">{getSavings(period)}</span>
              )}
            </button>
          ))}
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-6 ${
                tier.popular
                  ? "border-[#FF3B5C]/30 bg-white/[0.05] scale-105"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Mais Popular
                </Badge>
              )}

              <div className="mb-4">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tier.gradient}`}>
                  <tier.icon className="h-5 w-5 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white">{tier.name}</h3>
              <p className="text-sm text-white/50">{tier.description}</p>

              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-white">
                  {tier.price[billing] === 0 ? "Grátis" : `$${tier.price[billing]}`}
                </span>
                {tier.price[billing] > 0 && (
                  <span className="text-white/40 text-sm">
                    /{billing === "monthly" ? "mês" : billing === "quarterly" ? "3 meses" : "ano"}
                  </span>
                )}
              </div>

              <Button
                variant={tier.popular ? "default" : "outline"}
                className="w-full mb-6"
              >
                {tier.cta}
              </Button>

              <ul className="space-y-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-white/60">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
