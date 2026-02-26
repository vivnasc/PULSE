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
    interests: ["Photography", "Travel", "Coffee", "Yoga", "Reading"],
    prompts: [
      {
        prompt_id: "p1",
        question: "O meu superpoder secreto é...",
        answer: "Encontrar os melhores cafés escondidos em qualquer cidade. Tenho um sexto sentido para bom café e vibes acolhedoras.",
      },
    ],
    bio: null,
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
    interests: ["Hiking", "Music", "Cooking", "Surfing", "Tech"],
    prompts: [
      {
        prompt_id: "p1",
        question: "Vou ter discussões apaixonadas sobre...",
        answer: "Que a melhor forma de explorar uma cidade é a pé. Sem GPS, sem plano. Só andar e descobrir.",
      },
    ],
    bio: null,
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
    interests: ["Dance", "Art", "Fashion", "Movies", "Meditation"],
    prompts: [
      {
        prompt_id: "p1",
        question: "Green flag que me conquista:",
        answer: "Alguém que se lembra de pequenos detalhes do que lhe contei. É assim que sabes que realmente ouvem.",
      },
    ],
    bio: null,
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
                {visibleProfiles.map((profile, i) => (
                  <SwipeCard
                    key={profile.id}
                    profile={profile as Profile}
                    onSwipe={handleSwipe}
                    isTop={i === 0}
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-[#FF3B5C] to-[#FF5E9C]"
                >
                  <Heart className="h-12 w-12 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">É um Match!</h2>
                <p className="text-white/60">Tu e {matchAnimation} gostaram um do outro</p>
                <Button className="mt-6" onClick={() => setMatchAnimation(null)}>
                  Enviar Mensagem
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
