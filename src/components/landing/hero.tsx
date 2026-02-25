"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const frustrations = [
  "Deste match. Conversaram 3 dias. Ghosting.",
  "\"O que procuras aqui?\" pela milésima vez.",
  "Perfis falsos. Bots. Fotos de 2019.",
  "Swipe, swipe, swipe... vazio.",
  "\"Não estou muito aqui, DM no Insta.\"",
];

export function Hero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [frustrationIndex, setFrustrationIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrustrationIndex((prev) => (prev + 1) % frustrations.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
      // continue
    }
    setSubmitted(true);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #0E0F14, #161822, #0E0F14)" }} />
        <motion.div
          className="absolute top-1/4 -left-32 h-96 w-96 rounded-full blur-[128px]"
          style={{ background: "rgba(225, 6, 0, 0.12)" }}
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full blur-[128px]"
          style={{ background: "rgba(184, 51, 255, 0.1)" }}
          animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Rotating frustration — the hook */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-10 h-8"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={frustrationIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-white/40 text-sm sm:text-base italic"
            >
              &ldquo;{frustrations[frustrationIndex]}&rdquo;
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <Image
            src="/PULSE.logo.name.png"
            alt="PULSE"
            width={320}
            height={120}
            className="mx-auto h-24 sm:h-32 w-auto"
            priority
          />
        </motion.div>

        {/* The promise — one line, clear */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 text-2xl sm:text-3xl lg:text-4xl font-light text-white leading-snug"
        >
          A primeira app de dating que
          <br />
          <span className="font-semibold text-white">entende o que sentes.</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-4 text-base sm:text-lg text-white/45 max-w-xl mx-auto"
        >
          Conversa com o avatar IA de alguém antes de dar match.
          <br className="hidden sm:block" />
          Sente a química antes de trocar uma palavra.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-10"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-sm mx-auto">
              <Input
                type="email"
                placeholder="O teu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 bg-white/[0.06] border-white/[0.08]"
                required
              />
              <Button type="submit" size="lg" className="w-full sm:w-auto whitespace-nowrap">
                Quero Entrar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-6 max-w-sm mx-auto"
            >
              <p className="text-emerald-400 font-semibold">Estás na lista.</p>
              <p className="text-white/45 text-sm mt-1">
                Avisamos quando lançarmos. Vai valer a pena esperar.
              </p>
            </motion.div>
          )}

          <p className="mt-4 text-xs text-white/20">
            2.000+ pessoas já estão à espera
          </p>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <div className="h-9 w-5 rounded-full border border-white/15 flex items-start justify-center pt-1.5">
          <div className="h-1.5 w-0.5 rounded-full bg-white/30" />
        </div>
      </motion.div>
    </section>
  );
}
