"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, Zap, ArrowRight } from "lucide-react";

type Region = "MZN" | "BRL" | "EUR" | "USD";

const REGIONAL_PRICING: Record<Region, { flame: string; blaze: string; symbol: string }> = {
  MZN: { flame: "500 MT", blaze: "1.200 MT", symbol: "MT" },
  BRL: { flame: "R$39,90", blaze: "R$99,90", symbol: "R$" },
  EUR: { flame: "9,99€", blaze: "24,99€", symbol: "€" },
  USD: { flame: "$14.99", blaze: "$34.99", symbol: "$" },
};

function detectRegion(): Region {
  if (typeof window === "undefined") return "USD";

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const lang = navigator.language || "";

  // Mozambique
  if (tz.includes("Maputo") || lang.startsWith("pt-MZ")) return "MZN";
  // Brazil
  if (tz.includes("Sao_Paulo") || tz.includes("Brasilia") || tz.includes("Fortaleza") || tz.includes("Manaus") || lang === "pt-BR") return "BRL";
  // Europe / Portugal
  if (tz.includes("Lisbon") || tz.includes("Europe/") || lang.startsWith("pt-PT")) return "EUR";

  return "USD";
}

function getTiers(region: Region) {
  const prices = REGIONAL_PRICING[region];

  return [
    {
      name: "Spark",
      icon: Zap,
      vibe: "Para experimentar",
      price: "Grátis",
      period: "",
      features: [
        "10 swipes por dia",
        "Chat básico",
        "1 conversa com avatar IA por semana",
        "Verificação básica",
      ],
      cta: "Começar Grátis",
      variant: "outline" as const,
      accent: "#6B7280",
    },
    {
      name: "Flame",
      icon: Sparkles,
      vibe: "Para quem quer encontrar",
      price: prices.flame,
      period: "/mês",
      features: [
        "Tudo ilimitado — swipes, matches, chat",
        "Avatar IA e clonagem de voz",
        "Coach de encontros em tempo real",
        "IA emocional + compatibilidade preditiva",
        "Matchmaker pessoal com IA",
        "Ver quem te deu like",
        "Zero anúncios",
      ],
      cta: "Começar a Sentir",
      variant: "default" as const,
      accent: "#FF3B5C",
      popular: true,
    },
    {
      name: "Blaze",
      icon: Crown,
      vibe: "A experiência completa",
      price: prices.blaze,
      period: "/mês",
      features: [
        "Tudo do Flame",
        "Concierge IA 24/7",
        "Simulador de encontros ilimitado",
        "Previsão de relação (6-12 meses)",
        "Modo incógnito + proteção anti-ghosting",
        "Badge VIP + suporte prioritário",
      ],
      cta: "Ir de Blaze",
      variant: "outline" as const,
      accent: "#FFB547",
    },
  ];
}

export function Pricing() {
  const [region, setRegion] = useState<Region>("USD");

  useEffect(() => {
    setRegion(detectRegion());
  }, []);

  const tiers = getTiers(region);

  return (
    <section className="relative py-28 px-4" id="pricing">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-white/30 uppercase tracking-widest mb-3">Planos</p>
          <h2 className="text-3xl font-bold text-white sm:text-5xl leading-tight">
            Investe em quem importa.
            <br />
            <span className="text-white/30">Tu.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-6 transition-all ${
                tier.popular
                  ? "bg-white/[0.04] border border-white/10 md:scale-105"
                  : "bg-white/[0.02] border border-white/5"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-medium text-white"
                  style={{ background: "linear-gradient(135deg, #FF3B5C, #FF5E9C)" }}
                >
                  Recomendado
                </div>
              )}

              <div className="mb-5">
                <tier.icon className="h-5 w-5 mb-3" style={{ color: tier.accent }} />
                <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                <p className="text-xs text-white/40">{tier.vibe}</p>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-white">{tier.price}</span>
                {tier.period && <span className="text-white/30 text-sm">{tier.period}</span>}
              </div>

              <Button variant={tier.variant} className="w-full mb-6" size="sm">
                {tier.cta}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>

              <ul className="space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: `${tier.accent}99` }} />
                    <span className="text-[13px] text-white/50">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 space-y-2"
        >
          <p className="text-xs text-white/20">
            Cancela quando quiseres. Sem compromisso. Sem truques.
          </p>
          {region !== "USD" && (
            <p className="text-[10px] text-white/15">
              Preços em {REGIONAL_PRICING[region].symbol} para a tua região.{" "}
              <button
                onClick={() => setRegion("USD")}
                className="text-white/25 underline hover:text-white/40 transition-colors"
              >
                Ver em USD
              </button>
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
