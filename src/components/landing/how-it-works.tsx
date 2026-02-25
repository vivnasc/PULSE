"use client";

import { motion } from "framer-motion";
import { UserPlus, Sparkles, MessageCircle, Heart } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Cria o teu Perfil",
    description: "Responde a prompts criativos, grava uma nota de voz, carrega fotos. O teu avatar IA é criado automaticamente.",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "A IA Encontra os teus Matches",
    description: "O nosso matchmaker IA aprende o que realmente queres e procura ativamente pessoas compatíveis.",
  },
  {
    icon: MessageCircle,
    number: "03",
    title: "Conversa com Avatares IA",
    description: "Testa a química conversando com o gémeo digital primeiro. Sem tempo perdido, sem ghosting constrangedor.",
  },
  {
    icon: Heart,
    number: "04",
    title: "Conecta de Verdade",
    description: "Quando a vibe estiver certa, dá match e encontra-te. A IA acompanha-te em toda a jornada.",
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
            Como o{" "}
            <span className="gradient-text">
              PULSE
            </span>{" "}
            funciona
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Do registo ao encontro perfeito — em 4 passos simples.
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
