"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, Heart, Zap } from "lucide-react";
import Image from "next/image";

export function Hero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // silently continue
    }
    setSubmitted(true);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #0E0F14, #161822, #0E0F14)" }} />
        <motion.div
          className="absolute top-1/4 -left-32 h-96 w-96 rounded-full blur-[128px]"
          style={{ background: "rgba(225, 6, 0, 0.15)" }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full blur-[128px]"
          style={{ background: "rgba(184, 51, 255, 0.12)" }}
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full blur-[100px]"
          style={{ background: "rgba(255, 94, 156, 0.08)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 text-[#00E5FF]" />
          <span className="text-sm text-white/70">A IA que sente contigo.</span>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-4"
        >
          <Image src="/PULSE.logo.name.png" alt="PULSE" width={280} height={100} className="mx-auto h-20 sm:h-28 w-auto" priority />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Cansado de{" "}
          <span className="line-through text-white/30 decoration-white/20">swipes vazios</span>
          ?
          <br />
          <span className="text-2xl sm:text-3xl lg:text-4xl text-white/70 font-normal mt-2 block">
            A tua próxima conexão real começa aqui.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg text-white/60 sm:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Não é mais um app de dating. É uma{" "}
          <span className="text-white font-semibold">inteligência que te conhece</span>,
          encontra quem combina contigo de verdade, e te ajuda a criar conexões reais.
          <br />
          <span className="text-white/40 text-base">Sem ghosting. Sem superficialidade. Sem perder tempo.</span>
        </motion.p>

        {/* Diferenciadores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm"
        >
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#FF3B5C]" />
            <span className="text-white/50">Matchmaker com IA</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#FF5E9C]" />
            <span className="text-white/50">Conversa antes de dar match</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#00E5FF]" />
            <span className="text-white/50">Coach de encontros 24/7</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="O teu melhor email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12"
                required
              />
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Quero Entrar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 max-w-md mx-auto"
            >
              <p className="text-emerald-400 font-semibold">Estás na lista!</p>
              <p className="text-white/50 text-sm mt-1">
                Vamos avisar-te quando o PULSE lançar. Prepara-te para sentir a conexão.
              </p>
            </motion.div>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 text-xs text-white/30"
        >
          Junta-te a 2.000+ pessoas à espera do lançamento
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="h-10 w-6 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
          <div className="h-2 w-1 rounded-full bg-white/40" />
        </div>
      </motion.div>
    </section>
  );
}
