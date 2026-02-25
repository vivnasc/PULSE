"use client";

import { motion } from "framer-motion";

const journey = [
  {
    emoji: "🎭",
    title: "Sê tu.",
    text: "Criamos o teu perfil com prompts que te fazem pensar, não com frases feitas. A tua voz, as tuas respostas, o teu jeito — tudo alimenta a IA que te representa.",
  },
  {
    emoji: "🤖",
    title: "Conhece antes de conhecer.",
    text: "Antes de dar match, conversa com o avatar IA da outra pessoa. Percebe se há química de verdade — sem investir tempo emocional em quem não combina.",
  },
  {
    emoji: "⚡",
    title: "A IA trabalha por ti.",
    text: "Enquanto vives a tua vida, o teu matchmaker pessoal analisa milhares de perfis e encontra as pessoas que realmente fazem sentido. Sem scrolling infinito.",
  },
  {
    emoji: "💬",
    title: "Conecta com confiança.",
    text: "Quando dás match, já sabes que há potencial. O coach IA acompanha-te em tempo real — nunca mais ficas sem saber o que dizer.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-28 px-4" id="how-it-works">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-sm text-white/30 uppercase tracking-widest mb-3">A jornada</p>
          <h2 className="text-3xl font-bold text-white sm:text-5xl leading-tight">
            De estranhos a
            <br />
            <span className="gradient-text">&ldquo;conta-me mais.&rdquo;</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />

          <div className="space-y-16">
            {journey.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex gap-8 items-start"
              >
                {/* Dot on timeline */}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#0E0F14]" />
                  <span className="relative text-2xl">{step.emoji}</span>
                </div>

                <div className="pt-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-base text-white/40 leading-relaxed max-w-lg">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
