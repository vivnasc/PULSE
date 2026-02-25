"use client";

import { motion } from "framer-motion";

const beliefs = [
  { wrong: "Swipes são o futuro.", right: "Conexão é o futuro." },
  { wrong: "Mais opções = melhores escolhas.", right: "Melhores filtros = melhores pessoas." },
  { wrong: "A primeira mensagem define tudo.", right: "A personalidade define tudo." },
  { wrong: "Precisas de ser perfeito.", right: "Precisas de ser verdadeiro." },
];

export function Manifesto() {
  return (
    <section className="relative py-28 px-4">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-white/30 uppercase tracking-widest mb-3">Manifesto</p>
          <h2 className="text-3xl font-bold text-white sm:text-5xl leading-tight mb-6">
            O dating está partido.
            <br />
            <span className="text-white/30">Nós sabemos porquê.</span>
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto mb-16">
            Construímos o PULSE porque estávamos fartos. Fartos de apps que tratam pessoas como produtos, conversas como transações, e matches como métricas.
          </p>
        </motion.div>

        <div className="space-y-6">
          {beliefs.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-6 text-left"
            >
              <div className="flex-1 text-right">
                <p className="text-base text-white/20 line-through decoration-white/10">{b.wrong}</p>
              </div>
              <div className="shrink-0 h-8 w-px bg-gradient-to-b from-[#FF3B5C]/40 to-[#B833FF]/40" />
              <div className="flex-1">
                <p className="text-base text-white/70 font-medium">{b.right}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-xl font-light text-white/50 italic"
        >
          &ldquo;E se a tecnologia servisse para nos aproximar
          <br />
          <span className="text-white font-normal not-italic">em vez de nos distrair?</span>&rdquo;
        </motion.p>
      </div>
    </section>
  );
}
