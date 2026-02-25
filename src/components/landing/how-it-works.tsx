"use client";

import { motion } from "framer-motion";
import { UserPlus, Sparkles, MessageCircle, Heart } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Create Your Profile",
    description: "Answer creative prompts, record a voice note, upload photos. Your AI avatar is built automatically.",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "AI Finds Your Matches",
    description: "Our AI matchmaker learns what you truly want and actively searches for compatible people.",
  },
  {
    icon: MessageCircle,
    number: "03",
    title: "Chat with AI Avatars",
    description: "Test chemistry by talking to their AI twin first. No wasted time, no awkward ghosting.",
  },
  {
    icon: Heart,
    number: "04",
    title: "Connect for Real",
    description: "When the vibe is right, match and meet. AI coaches you through the entire journey.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 px-4" id="how-it-works">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white sm:text-5xl">
            How{" "}
            <span className="gradient-text">
              PULSE
            </span>{" "}
            works
          </h2>
          <p className="mt-4 text-lg text-white/50">
            From signup to your perfect date — in 4 simple steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative flex gap-4 p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold bg-gradient-to-b from-white/20 to-transparent bg-clip-text text-transparent">
                  {step.number}
                </span>
                <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF3B5C]/20 to-[#FF5E9C]/20 border border-white/10">
                  <step.icon className="h-6 w-6 text-[#FF3B5C]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
