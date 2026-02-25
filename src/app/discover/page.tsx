"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/layout/app-layout";
import { SwipeCard } from "@/components/discover/swipe-card";
import { SwipeActions } from "@/components/discover/swipe-actions";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import type { Profile } from "@/types/database";

// Demo profiles for development
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
        question: "My secret superpower is...",
        answer: "Finding the best hidden cafés in any city I visit. I have a sixth sense for good coffee and cozy vibes.",
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
        question: "I'll passionately argue about...",
        answer: "That the best way to explore a city is on foot. No GPS, no plan. Just walk and discover.",
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
        question: "Green flag that wins me over:",
        answer: "Someone who remembers small details about what I've told them. That's how you know they actually listen.",
      },
    ],
    bio: null,
    verification_level: "none",
    subscription_tier: "free",
  },
];

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Partial<Profile>[]>(DEMO_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = useCallback(
    (direction: "left" | "right" | "up") => {
      const profile = profiles[currentIndex];
      // TODO: Send swipe to backend
      console.log(`Swiped ${direction} on ${profile?.display_name}`);

      setCurrentIndex((prev) => prev + 1);
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
          <h1 className="text-xl font-bold pulse-gradient-text">
            PULSE
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Sparkles className="h-4 w-4 text-[#FF3B5C]" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Card stack */}
        <div className="relative aspect-[3/4] w-full">
          {noMoreProfiles ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02]">
              <Sparkles className="h-12 w-12 text-white/20 mb-4" />
              <p className="text-white/40 text-center px-8">
                No more profiles for now. Check back later or expand your search.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setCurrentIndex(0)}>
                Start Over
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

        {/* Actions */}
        {!noMoreProfiles && (
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
      </div>
    </AppLayout>
  );
}
