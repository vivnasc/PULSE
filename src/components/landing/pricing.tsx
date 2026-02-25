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
    description: "Start your journey",
    price: { monthly: 0, quarterly: 0, annual: 0 },
    features: [
      "10 swipes per day",
      "3 active matches",
      "Basic chat (text only)",
      "1 AI avatar conversation/week",
      "Basic verification",
      "Creative prompts",
      "Voice note profile",
    ],
    cta: "Get Started Free",
    gradient: "from-gray-500 to-gray-600",
    popular: false,
  },
  {
    name: "Flame",
    icon: Sparkles,
    description: "For serious daters",
    price: { monthly: 14.99, quarterly: 38.99, annual: 143.88 },
    features: [
      "Unlimited swipes & matches",
      "Advanced chat (voice, photos, GIFs)",
      "Unlimited AI avatar conversations",
      "Voice cloning messages",
      "AI Date Coach (real-time)",
      "Emotion AI tracking",
      "Predictive compatibility",
      "Personal AI Matchmaker",
      "See who liked you",
      "5 boosts/month",
      "Smart date ideas",
      "Post-date AI debrief",
      "Zero ads",
    ],
    cta: "Upgrade to Flame",
    gradient: "from-rose-500 via-orange-500 to-pink-500",
    popular: true,
  },
  {
    name: "Blaze",
    icon: Crown,
    description: "The ultimate experience",
    price: { monthly: 34.99, quarterly: 89.99, annual: 335.88 },
    features: [
      "Everything in Flame",
      "AI Concierge 24/7",
      "Hyper-targeted matching",
      "Advanced video analysis",
      "Relationship forecast (6-12mo)",
      "Unlimited Dream Date Simulator",
      "Premium analytics dashboard",
      "Ghost protection",
      "Incognito mode",
      "10 super boosts/month",
      "VIP badge & priority support",
      "Advanced filters (50+ criteria)",
    ],
    cta: "Go Blaze",
    gradient: "from-amber-400 via-yellow-500 to-orange-500",
    popular: false,
  },
];

export function Pricing() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  const getSavings = (period: BillingPeriod) => {
    if (period === "quarterly") return "10% OFF";
    if (period === "annual") return "20% OFF";
    return null;
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
            Simple,{" "}
            <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
              transparent
            </span>{" "}
            pricing
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Start free. Upgrade when you&apos;re ready for more.
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
              {period.charAt(0).toUpperCase() + period.slice(1)}
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
                  ? "border-rose-500/30 bg-white/[0.05] scale-105"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
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
                  {tier.price[billing] === 0 ? "Free" : `$${tier.price[billing]}`}
                </span>
                {tier.price[billing] > 0 && (
                  <span className="text-white/40 text-sm">
                    /{billing === "monthly" ? "mo" : billing === "quarterly" ? "3mo" : "yr"}
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
