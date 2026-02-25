"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Brain, MessageCircle, ChevronRight } from "lucide-react";

const showcases = [
  {
    id: "avatar",
    icon: Bot,
    label: "Avatar IA",
    headline: "Conversa antes de dar match.",
    description:
      "Imagina conversar com a personalidade de alguém — os interesses, o humor, a forma de pensar — antes de sequer trocar uma palavra real. Sem máscaras. Sem surpresas.",
    accentColor: "#B833FF",
    demo: {
      messages: [
        { from: "ai", text: "O Carlos adora cozinhar e perde-se em podcasts de história. Pergunta-lhe qualquer coisa!" },
        { from: "user", text: "Qual é o prato que mais orgulho tens?" },
        { from: "ai", text: "Risoto de cogumelos. Levei 6 tentativas até acertar. Agora é o meu \"move\" para impressionar." },
        { from: "user", text: "Haha adorei a honestidade" },
      ],
      chemistry: 78,
    },
  },
  {
    id: "emotion",
    icon: Brain,
    label: "IA Emocional",
    headline: "Vê a química acontecer.",
    description:
      "A IA mapeia a emoção das tuas conversas em tempo real. Vê quando a ligação cresce, quando há picos de conexão, quando algo não bate certo — antes que te apercebas.",
    accentColor: "#00E5FF",
    demo: {
      moments: [
        { time: "2min", score: 35, label: "A aquecer" },
        { time: "8min", score: 62, label: "Interesse mútuo" },
        { time: "15min", score: 84, label: "Pico de conexão" },
        { time: "22min", score: 91, label: "Química real" },
      ],
    },
  },
  {
    id: "coach",
    icon: MessageCircle,
    label: "Coach 24/7",
    headline: "Um wingman que nunca falha.",
    description:
      "A meio da conversa, a IA percebe que estás a perder terreno. Sussurra-te: \"Ela mencionou Bali há 3 mensagens. Pergunta sobre isso.\" Subtil. Eficaz. Teu.",
    accentColor: "#FF3B5C",
    demo: {
      chat: [
        { from: "match", text: "Sim, adoro viajar! Estive em Bali o ano passado" },
        { from: "user", text: "Nice! Eu quero ir à Ásia" },
      ],
      tip: "Ela mencionou Bali — pergunta o que mais gostou. Mostra interesse genuíno.",
    },
  },
];

function AvatarDemo({ data }: { data: typeof showcases[0]["demo"] }) {
  const d = data as { messages: { from: string; text: string }[]; chemistry: number };
  return (
    <div className="space-y-3">
      {d.messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
        >
          <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
            msg.from === "user"
              ? "bg-white/10 text-white/90 rounded-br-md"
              : "bg-[#B833FF]/10 border border-[#B833FF]/15 text-white/80 rounded-bl-md"
          }`}>
            {msg.from === "ai" && <span className="text-[10px] text-[#B833FF]/70 block mb-0.5">Avatar IA do Carlos</span>}
            {msg.text}
          </div>
        </motion.div>
      ))}
      <div className="flex items-center gap-2 pt-1">
        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #B833FF, #FF5E9C)" }}
            initial={{ width: 0 }}
            animate={{ width: `${d.chemistry}%` }}
            transition={{ duration: 1.5, delay: 0.6 }}
          />
        </div>
        <span className="text-[11px] text-white/40">{d.chemistry}% química</span>
      </div>
    </div>
  );
}

function EmotionDemo({ data }: { data: typeof showcases[1]["demo"] }) {
  const d = data as { moments: { time: string; score: number; label: string }[] };
  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2 h-24">
        {d.moments.map((m, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              className="w-full rounded-t-md"
              style={{ background: `rgba(0, 229, 255, ${0.15 + m.score / 200})` }}
              initial={{ height: 0 }}
              animate={{ height: `${m.score}%` }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            />
            <span className="text-[9px] text-white/30">{m.time}</span>
          </div>
        ))}
      </div>
      {d.moments.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + i * 0.1 }}
          className="flex items-center gap-2"
        >
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: `rgba(0, 229, 255, ${0.3 + m.score / 150})` }} />
          <span className="text-[11px] text-white/50">{m.time} — {m.label}</span>
          <span className="text-[11px] text-[#00E5FF]/60 ml-auto">{m.score}%</span>
        </motion.div>
      ))}
    </div>
  );
}

function CoachDemo({ data }: { data: typeof showcases[2]["demo"] }) {
  const d = data as { chat: { from: string; text: string }[]; tip: string };
  return (
    <div className="space-y-3">
      {d.chat.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
          className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
        >
          <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
            msg.from === "user"
              ? "bg-white/10 text-white/90 rounded-br-md"
              : "bg-white/[0.03] border border-white/5 text-white/80 rounded-bl-md"
          }`}>
            {msg.text}
          </div>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl bg-[#FF3B5C]/[0.06] border border-[#FF3B5C]/10 p-3"
      >
        <span className="text-[10px] text-[#FF3B5C]/70 font-medium block mb-1">Coach IA — só tu vês isto</span>
        <span className="text-[12px] text-white/60 leading-relaxed">{d.tip}</span>
      </motion.div>
    </div>
  );
}

export function Features() {
  const [active, setActive] = useState(0);
  const current = showcases[active];

  return (
    <section className="relative py-24 px-4" id="features">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm text-white/30 uppercase tracking-widest mb-3">O que muda tudo</p>
          <h2 className="text-3xl font-bold text-white sm:text-5xl leading-tight">
            Não é o que o app <span className="italic text-white/40">faz</span>.
            <br />
            É o que tu <span className="gradient-text">sentes</span>.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left: Feature selector */}
          <div className="space-y-3">
            {showcases.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === active;
              return (
                <motion.button
                  key={s.id}
                  onClick={() => setActive(i)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-full text-left rounded-2xl p-5 transition-all duration-300 ${
                    isActive
                      ? "bg-white/[0.05] border border-white/10"
                      : "bg-transparent border border-transparent hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
                      style={{
                        background: isActive ? `${s.accentColor}20` : "rgba(255,255,255,0.03)",
                      }}
                    >
                      <Icon className="h-5 w-5" style={{ color: isActive ? s.accentColor : "rgba(255,255,255,0.3)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold transition-colors ${isActive ? "text-white" : "text-white/50"}`}>
                          {s.headline}
                        </h3>
                        <ChevronRight className={`h-4 w-4 transition-all ${isActive ? "text-white/40 rotate-90" : "text-white/15"}`} />
                      </div>
                      <AnimatePresence>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-white/40 mt-2 leading-relaxed"
                          >
                            {s.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.button>
              );
            })}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="pt-4 px-5"
            >
              <p className="text-xs text-white/20">
                + Clonagem de voz · Tradução instantânea · Análise de vídeo · Ideias de encontro · Verificação multi-camada · e mais
              </p>
            </motion.div>
          </div>

          {/* Right: Phone mockup with demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center lg:sticky lg:top-24"
          >
            <div className="relative w-72 sm:w-80">
              <div className="rounded-[2.5rem] border border-white/[0.08] bg-[#0E0F14] p-3 shadow-2xl shadow-black/50">
                <div className="flex justify-center mb-2">
                  <div className="h-5 w-24 rounded-full bg-black/80" />
                </div>
                <div className="rounded-[2rem] bg-[#161822] p-4 min-h-[380px]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] text-white/30 font-medium">{current.label}</span>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ background: current.accentColor }} />
                      <span className="text-[9px]" style={{ color: `${current.accentColor}99` }}>ao vivo</span>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.3 }}
                    >
                      {current.id === "avatar" && <AvatarDemo data={current.demo} />}
                      {current.id === "emotion" && <EmotionDemo data={current.demo} />}
                      {current.id === "coach" && <CoachDemo data={current.demo} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-2xl opacity-20"
                style={{ background: current.accentColor }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
