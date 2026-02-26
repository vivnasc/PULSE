"use client";

import { useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  PanInfo,
} from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Heart,
  Shield,
} from "lucide-react";
import { calculateAge, cn } from "@/lib/utils";
import type { Profile } from "@/types/database";

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: "left" | "right" | "up") => void;
  isTop: boolean;
}

// Generate a consistent gradient from a string (name/id)
function nameToGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradients = [
    "from-rose-500 via-pink-600 to-fuchsia-700",
    "from-violet-500 via-purple-600 to-indigo-700",
    "from-cyan-500 via-teal-600 to-emerald-700",
    "from-amber-500 via-orange-600 to-red-700",
    "from-pink-500 via-rose-600 to-red-700",
    "from-blue-500 via-indigo-600 to-violet-700",
    "from-emerald-500 via-teal-600 to-cyan-700",
    "from-fuchsia-500 via-pink-600 to-rose-700",
  ];
  return gradients[Math.abs(hash) % gradients.length];
}

export function SwipeCard({ profile, onSwipe, isTop }: SwipeCardProps) {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Rotation follows horizontal drag
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);

  // Overlay opacities with smooth ramp
  const likeOpacity = useTransform(x, [0, 50, 150], [0, 0.3, 1]);
  const nopeOpacity = useTransform(x, [-150, -50, 0], [1, 0.3, 0]);
  const superLikeOpacity = useTransform(y, [-150, -50, 0], [1, 0.3, 0]);

  // Background glow based on drag direction
  const likeGlow = useTransform(x, [0, 150], [0, 0.3]);
  const nopeGlow = useTransform(x, [-150, 0], [0.3, 0]);
  const superGlow = useTransform(y, [-150, 0], [0.3, 0]);

  // Scale slightly on drag
  const scale = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    [0.97, 0.99, 1, 0.99, 0.97]
  );

  const handleDragEnd = useCallback(
    async (_: unknown, info: PanInfo) => {
      const threshold = 120;
      const velocity = 0.5;

      if (
        info.offset.x > threshold ||
        info.velocity.x > velocity * 1000
      ) {
        // Like — fly right
        await controls.start({
          x: 500,
          y: info.offset.y,
          rotate: 25,
          opacity: 0,
          transition: { duration: 0.35, ease: "easeOut" },
        });
        onSwipe("right");
      } else if (
        info.offset.x < -threshold ||
        info.velocity.x < -velocity * 1000
      ) {
        // Pass — fly left
        await controls.start({
          x: -500,
          y: info.offset.y,
          rotate: -25,
          opacity: 0,
          transition: { duration: 0.35, ease: "easeOut" },
        });
        onSwipe("left");
      } else if (
        info.offset.y < -threshold ||
        info.velocity.y < -velocity * 1000
      ) {
        // Super like — fly up
        await controls.start({
          x: info.offset.x,
          y: -600,
          opacity: 0,
          transition: { duration: 0.4, ease: "easeOut" },
        });
        onSwipe("up");
      } else {
        // Spring back
        controls.start({
          x: 0,
          y: 0,
          rotate: 0,
          transition: { type: "spring", stiffness: 400, damping: 30 },
        });
      }
    },
    [controls, onSwipe]
  );

  const photos = profile.photos?.length > 0 ? profile.photos : [];
  const hasPhotos = photos.length > 0;
  const age = calculateAge(new Date(profile.birth_date));
  const gradient = nameToGradient(profile.display_name || "User");

  // Compatibility score (mock for now — will come from AI)
  const compatScore = Math.floor(
    70 + ((profile.display_name?.charCodeAt(0) || 80) % 25)
  );

  return (
    <motion.div
      className={cn(
        "absolute inset-0",
        isTop ? "cursor-grab active:cursor-grabbing z-10" : "z-0"
      )}
      style={{ x, y, rotate, scale }}
      drag={isTop && !expanded}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.6 }}
      transition={{ scale: { duration: 0.2 }, opacity: { duration: 0.2 } }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl bg-[#1A1B23] shadow-2xl shadow-black/50 border border-white/[0.06]">
        {/* Photo / Gradient Avatar */}
        <div className="absolute inset-0">
          {hasPhotos ? (
            <img
              src={photos[currentPhoto] || photos[0]}
              alt={profile.display_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className={cn(
                "h-full w-full bg-gradient-to-br flex items-center justify-center",
                gradient
              )}
            >
              <span className="text-[120px] font-bold text-white/20 select-none">
                {(profile.display_name || "?")[0].toUpperCase()}
              </span>
            </div>
          )}

          {/* Photo navigation dots */}
          {photos.length > 1 && (
            <div className="absolute top-3 left-4 right-4 flex gap-1 z-20">
              {photos.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-[3px] flex-1 rounded-full transition-all duration-200",
                    i === currentPhoto
                      ? "bg-white shadow-sm shadow-white/50"
                      : "bg-white/30"
                  )}
                />
              ))}
            </div>
          )}

          {/* Photo tap zones */}
          {photos.length > 1 && (
            <div className="absolute inset-0 flex z-10">
              <button
                className="w-1/3 h-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPhoto(Math.max(0, currentPhoto - 1));
                }}
              />
              <div className="flex-1" />
              <button
                className="w-1/3 h-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPhoto(
                    Math.min(photos.length - 1, currentPhoto + 1)
                  );
                }}
              />
            </div>
          )}
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 pointer-events-none" />

        {/* LIKE stamp */}
        <motion.div
          className="absolute top-16 left-6 z-30 pointer-events-none"
          style={{ opacity: likeOpacity }}
        >
          <div className="rounded-lg border-[3px] border-emerald-400 px-5 py-2 -rotate-12 shadow-lg shadow-emerald-400/20">
            <span className="text-3xl font-black text-emerald-400 tracking-wider">
              LIKE
            </span>
          </div>
        </motion.div>

        {/* NOPE stamp */}
        <motion.div
          className="absolute top-16 right-6 z-30 pointer-events-none"
          style={{ opacity: nopeOpacity }}
        >
          <div className="rounded-lg border-[3px] border-red-400 px-5 py-2 rotate-12 shadow-lg shadow-red-400/20">
            <span className="text-3xl font-black text-red-400 tracking-wider">
              NOPE
            </span>
          </div>
        </motion.div>

        {/* SUPER LIKE stamp */}
        <motion.div
          className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          style={{ opacity: superLikeOpacity }}
        >
          <div className="rounded-lg border-[3px] border-blue-400 px-5 py-2 shadow-lg shadow-blue-400/20">
            <span className="text-3xl font-black text-blue-400 tracking-wider">
              SUPER
            </span>
          </div>
        </motion.div>

        {/* Edge glow effects */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          style={{
            boxShadow: useTransform(
              likeGlow,
              (v) => `inset -4px 0 40px rgba(52, 211, 153, ${v})`
            ),
          }}
        />
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          style={{
            boxShadow: useTransform(
              nopeGlow,
              (v) => `inset 4px 0 40px rgba(248, 113, 113, ${v})`
            ),
          }}
        />
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          style={{
            boxShadow: useTransform(
              superGlow,
              (v) => `inset 0 4px 40px rgba(96, 165, 250, ${v})`
            ),
          }}
        />

        {/* Compatibility badge (top right) */}
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-2.5 py-1">
            <Sparkles className="h-3 w-3 text-[#FF3B5C]" />
            <span className="text-xs font-semibold text-white">
              {compatScore}%
            </span>
          </div>
        </div>

        {/* Profile info */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          {/* Expand handle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="w-full flex justify-center py-1"
          >
            {expanded ? (
              <ChevronDown className="h-5 w-5 text-white/40 animate-bounce" />
            ) : (
              <ChevronUp className="h-5 w-5 text-white/40" />
            )}
          </button>

          <div className="px-5 pb-5">
            {/* Name + age + verified */}
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[26px] font-bold text-white leading-tight">
                {profile.display_name}
              </h2>
              <span className="text-[22px] text-white/70 font-light">
                {age}
              </span>
              {profile.is_verified && (
                <div className="flex items-center gap-0.5 bg-blue-500/20 rounded-full px-1.5 py-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 fill-blue-400" />
                  <span className="text-[10px] text-blue-400 font-medium">
                    Verificado
                  </span>
                </div>
              )}
            </div>

            {/* Location */}
            {profile.location_city && (
              <div className="flex items-center gap-1.5 text-white/50 text-sm mb-3">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {profile.location_city}
                  {profile.location_country
                    ? `, ${profile.location_country}`
                    : ""}
                </span>
              </div>
            )}

            {/* First prompt (always visible) */}
            {profile.prompts?.[0] && (
              <div className="rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/[0.06] p-3.5 mb-3">
                <p className="text-[11px] text-[#FF5E9C] font-semibold uppercase tracking-wide mb-1">
                  {profile.prompts[0].question}
                </p>
                <p className="text-[14px] text-white/90 leading-relaxed">
                  {profile.prompts[0].answer}
                </p>
              </div>
            )}

            {/* Interests (compact) */}
            {profile.interests && profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-1">
                {profile.interests.slice(0, 4).map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-white/[0.08] border border-white/[0.06] px-2.5 py-1 text-[11px] text-white/70 font-medium"
                  >
                    {interest}
                  </span>
                ))}
                {profile.interests.length > 4 && (
                  <span className="rounded-full bg-white/[0.08] border border-white/[0.06] px-2.5 py-1 text-[11px] text-white/50">
                    +{profile.interests.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Expanded profile details */}
            <motion.div
              initial={false}
              animate={{
                height: expanded ? "auto" : 0,
                opacity: expanded ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* AI Compatibility */}
                <div className="rounded-2xl bg-gradient-to-r from-[#FF3B5C]/10 to-[#FF5E9C]/10 border border-[#FF3B5C]/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-[#FF3B5C]" />
                    <span className="text-sm font-semibold text-white">
                      Compatibilidade IA
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16">
                      <svg className="h-16 w-16 -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-white/10"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          strokeWidth="3"
                          strokeLinecap="round"
                          className="text-[#FF3B5C]"
                          stroke="currentColor"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${
                            2 * Math.PI * 28 * (1 - compatScore / 100)
                          }`}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                        {compatScore}%
                      </span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Heart className="h-3 w-3 text-[#FF3B5C]" />
                        <span className="text-xs text-white/60">
                          Potencial:{" "}
                          <span className="text-white/90 font-medium">
                            {compatScore > 80 ? "Alto" : "Moderado"}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Shield className="h-3 w-3 text-emerald-400" />
                        <span className="text-xs text-white/60">
                          Valores partilhados:{" "}
                          <span className="text-white/90 font-medium">
                            {Math.min(
                              (profile.interests?.length || 0),
                              4
                            )}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* More prompts */}
                {profile.prompts &&
                  profile.prompts.slice(1).map((prompt, i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/[0.06] p-3.5"
                    >
                      <p className="text-[11px] text-[#FF5E9C] font-semibold uppercase tracking-wide mb-1">
                        {prompt.question}
                      </p>
                      <p className="text-[14px] text-white/90 leading-relaxed">
                        {prompt.answer}
                      </p>
                    </div>
                  ))}

                {/* All interests */}
                {profile.interests && profile.interests.length > 4 && (
                  <div>
                    <p className="text-xs text-white/40 mb-2 font-medium">
                      Todos os interesses
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.interests.map((interest) => (
                        <span
                          key={interest}
                          className="rounded-full bg-white/[0.08] border border-white/[0.06] px-2.5 py-1 text-[11px] text-white/70 font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {profile.bio && (
                  <div>
                    <p className="text-xs text-white/40 mb-1 font-medium">
                      Sobre
                    </p>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}

                {/* Quick actions when expanded */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(false);
                    }}
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
