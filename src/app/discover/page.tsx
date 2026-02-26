"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppLayout } from "@/components/layout/app-layout";
import { SwipeCard } from "@/components/discover/swipe-card";
import { SwipeActions } from "@/components/discover/swipe-actions";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Sparkles, Heart, Loader2 } from "lucide-react";
import Image from "next/image";
import type { Profile } from "@/types/database";

// Fallback demo profiles for when DB is empty or not connected
const DEMO_PROFILES: Partial<Profile>[] = [
  {
    id: "demo-1",
    display_name: "Sofia",
    birth_date: "1998-03-15",
    gender: "female",
    photos: [],
    location_city: "Maputo",
    location_country: "Mozambique",
    is_verified: true,
    interests: ["Photography", "Travel", "Coffee", "Yoga", "Reading", "Music"],
    prompts: [
      {
        prompt_id: "p1",
        question: "O meu superpoder secreto é...",
        answer: "Encontrar os melhores cafés escondidos em qualquer cidade. Tenho um sexto sentido para bom café e vibes acolhedoras.",
      },
      {
        prompt_id: "p2",
        question: "Green flag que me conquista:",
        answer: "Quando alguém tem aquela energia calma mas confiante. Não precisa de gritar para ser ouvido.",
      },
    ],
    bio: "Fotógrafa de coração, viajante de alma. Acredito que as melhores conexões acontecem em cafés com boa luz.",
    verification_level: "selfie",
    subscription_tier: "flame",
  },
  {
    id: "demo-2",
    display_name: "Carlos",
    birth_date: "1996-07-22",
    gender: "male",
    photos: [],
    location_city: "Maputo",
    location_country: "Mozambique",
    is_verified: true,
    interests: ["Hiking", "Music", "Cooking", "Surfing", "Tech", "Comedy"],
    prompts: [
      {
        prompt_id: "p1",
        question: "Vou ter discussões apaixonadas sobre...",
        answer: "Que a melhor forma de explorar uma cidade é a pé. Sem GPS, sem plano. Só andar e descobrir.",
      },
      {
        prompt_id: "p2",
        question: "Ensina-me algo em 30 segundos:",
        answer: "O ingrediente secreto de qualquer prato é o tempo. Cozinhar devagar com atenção muda tudo.",
      },
    ],
    bio: "Chef amador, surfista de fim de semana. Prometo cozinhar melhor do que danço (o que não é difícil).",
    verification_level: "selfie",
    subscription_tier: "free",
  },
  {
    id: "demo-3",
    display_name: "Aisha",
    birth_date: "1999-11-08",
    gender: "female",
    photos: [],
    location_city: "Beira",
    location_country: "Mozambique",
    is_verified: false,
    interests: ["Dance", "Art", "Fashion", "Movies", "Meditation", "Writing"],
    prompts: [
      {
        prompt_id: "p1",
        question: "Green flag que me conquista:",
        answer: "Alguém que se lembra de pequenos detalhes do que lhe contei. É assim que sabes que realmente ouvem.",
      },
      {
        prompt_id: "p2",
        question: "Minha vibe é...",
        answer: "Playlist chill a tocar, velas acesas, e uma conversa profunda sobre o universo. Low-key mas intensa.",
      },
    ],
    bio: "Artista e sonhadora. Acho beleza nos detalhes que a maioria ignora.",
    verification_level: "none",
    subscription_tier: "free",
  },
  {
    id: "demo-4",
    display_name: "Mateo",
    birth_date: "1997-04-19",
    gender: "male",
    photos: [],
    location_city: "Maputo",
    location_country: "Mozambique",
    is_verified: true,
    interests: ["Fitness", "Podcasts", "Cycling", "Gaming", "Animals", "Travel"],
    prompts: [
      {
        prompt_id: "p1",
        question: "A coisa mais aleatória que me faz rir...",
        answer: "Vídeos de gatos a falharem saltos. Não importa o dia que estou a ter — funciona sempre.",
      },
      {
        prompt_id: "p2",
        question: "Nunca vou mudar de opinião sobre...",
        answer: "Pizza fria ao pequeno-almoço é superior a qualquer cereal. Esta é a colina onde escolho morrer.",
      },
    ],
    bio: "Engenheiro de dia, gamer de noite. O meu golden retriever tem mais seguidores no Instagram que eu.",
    verification_level: "selfie",
    subscription_tier: "free",
  },
  {
    id: "demo-5",
    display_name: "Luna",
    birth_date: "2000-08-03",
    gender: "female",
    photos: [],
    location_city: "Nampula",
    location_country: "Mozambique",
    is_verified: false,
    interests: ["Music", "Yoga", "Volunteering", "Coffee", "Hiking", "Art"],
    prompts: [
      {
        prompt_id: "p1",
        question: "Pequena coisa que me faz apaixonar:",
        answer: "Quando manda uma música a dizer 'isto fez-me pensar em ti'. Pronto, ganhou.",
      },
      {
        prompt_id: "p2",
        question: "O meu superpoder secreto é...",
        answer: "Fazer qualquer pessoa introvertida sentir-se confortável. Tenho um dom para silêncios que não são awkward.",
      },
    ],
    bio: "Professora de yoga, amante de nascer do sol. Acredito que vulnerabilidade é a maior forma de coragem.",
    verification_level: "none",
    subscription_tier: "free",
  },
];

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Partial<Profile>[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchAnimation, setMatchAnimation] = useState<string | null>(null);

  // Fetch profiles from API
  useEffect(() => {
    async function fetchProfiles() {
      try {
        const res = await fetch("/api/discover");
        if (res.ok) {
          const data = await res.json();
          setProfiles(data.length > 0 ? data : DEMO_PROFILES);
        } else {
          setProfiles(DEMO_PROFILES);
        }
      } catch {
        setProfiles(DEMO_PROFILES);
      } finally {
        setLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  const handleSwipe = useCallback(
    async (direction: "left" | "right" | "up") => {
      const profile = profiles[currentIndex];
      if (!profile?.id) return;

      const actionMap = { left: "pass", right: "like", up: "super_like" } as const;
      const action = actionMap[direction];

      // Optimistic update — move to next card immediately
      setCurrentIndex((prev) => prev + 1);

      // Skip API call for demo profiles
      if (profile.id.startsWith("demo-")) return;

      try {
        const res = await fetch("/api/swipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ swipedId: profile.id, action }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.matched) {
            setMatchAnimation(profile.display_name || "");
            setTimeout(() => setMatchAnimation(null), 3000);
          }
        }
      } catch {
        // Swipe failed silently — profile already moved
      }
    },
    [currentIndex, profiles]
  );

  const visibleProfiles = profiles.slice(currentIndex, currentIndex + 2);
  const noMoreProfiles = currentIndex >= profiles.length;

  return (
    <AppLayout>
      <div className="relative mx-auto max-w-md px-4 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Image src="/PULSE.logo.name.png" alt="PULSE" width={100} height={36} className="h-7 w-auto" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Sparkles className="h-4 w-4 text-[#FF3B5C]" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="aspect-[3/4] w-full flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02]">
            <Loader2 className="h-8 w-8 text-[#FF3B5C] animate-spin" />
          </div>
        )}

        {/* Card stack */}
        {!loading && (
          <div className="relative aspect-[3/4] w-full">
            {noMoreProfiles ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02]">
                <Sparkles className="h-12 w-12 text-white/20 mb-4" />
                <p className="text-white/40 text-center px-8">
                  Sem mais perfis por agora. Volta mais tarde ou expande a tua pesquisa.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setCurrentIndex(0);
                    setLoading(true);
                    fetch("/api/discover")
                      .then((r) => r.json())
                      .then((data) => setProfiles(data.length > 0 ? data : DEMO_PROFILES))
                      .catch(() => setProfiles(DEMO_PROFILES))
                      .finally(() => setLoading(false));
                  }}
                >
                  Recomeçar
                </Button>
              </div>
            ) : (
              <AnimatePresence>
                {visibleProfiles
                  .slice()
                  .reverse()
                  .map((profile, i, arr) => (
                    <SwipeCard
                      key={profile.id}
                      profile={profile as Profile}
                      onSwipe={handleSwipe}
                      isTop={i === arr.length - 1}
                    />
                  ))}
              </AnimatePresence>
            )}
          </div>
        )}

        {/* Actions */}
        {!loading && !noMoreProfiles && (
          <div className="mt-6">
            <SwipeActions
              onPass={() => handleSwipe("left")}
              onLike={() => handleSwipe("right")}
              onSuperLike={() => handleSwipe("up")}
              canRewind={false}
              canBoost={false}
            />
          </div>
        )}

        {/* Match animation overlay */}
        <AnimatePresence>
          {matchAnimation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />

              {/* Radial glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 2.5, opacity: 0.15 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-48 w-48 rounded-full bg-gradient-to-r from-[#FF3B5C] to-[#FF5E9C] blur-3xl"
                />
              </div>

              <div className="relative text-center z-10">
                {/* Heart icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.15 }}
                  className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#FF3B5C] to-[#FF5E9C] shadow-2xl shadow-[#FF3B5C]/40"
                >
                  <Heart className="h-14 w-14 text-white drop-shadow-lg" fill="white" />
                </motion.div>

                {/* Text */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-black text-white mb-2 tracking-tight"
                >
                  É um Match!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/60 text-lg"
                >
                  Tu e <span className="text-[#FF5E9C] font-semibold">{matchAnimation}</span> gostaram um do outro
                </motion.p>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 flex flex-col gap-3 items-center"
                >
                  <Button size="lg" className="min-w-[200px]" onClick={() => setMatchAnimation(null)}>
                    Enviar Mensagem
                    <Heart className="ml-2 h-4 w-4" />
                  </Button>
                  <button
                    onClick={() => setMatchAnimation(null)}
                    className="text-sm text-white/40 hover:text-white/60 transition-colors"
                  >
                    Continuar a descobrir
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
