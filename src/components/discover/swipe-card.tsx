"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, GraduationCap, CheckCircle2 } from "lucide-react";
import { calculateAge } from "@/lib/utils";
import type { Profile } from "@/types/database";

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: "left" | "right" | "up") => void;
  isTop: boolean;
}

export function SwipeCard({ profile, onSwipe, isTop }: SwipeCardProps) {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-20, 0, 20]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const superLikeOpacity = useTransform(y, [-100, 0], [1, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 100;

    if (info.offset.x > threshold) {
      onSwipe("right"); // Like
    } else if (info.offset.x < -threshold) {
      onSwipe("left"); // Pass
    } else if (info.offset.y < -threshold) {
      onSwipe("up"); // Super like
    }
  };

  const photos = profile.photos.length > 0 ? profile.photos : ["/placeholder-profile.jpg"];
  const age = calculateAge(new Date(profile.birth_date));

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, y, rotate, zIndex: isTop ? 10 : 0 }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.5 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7 }}
      exit={{ x: 300, opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl bg-gray-900 shadow-2xl">
        {/* Photo */}
        <div className="absolute inset-0">
          <img
            src={photos[currentPhoto] || "/placeholder-profile.jpg"}
            alt={profile.display_name}
            className="h-full w-full object-cover"
          />
          {/* Photo navigation indicators */}
          {photos.length > 1 && (
            <div className="absolute top-3 left-3 right-3 flex gap-1">
              {photos.map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 flex-1 rounded-full ${
                    i === currentPhoto ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}
          {/* Photo tap zones */}
          <div className="absolute inset-0 flex">
            <button
              className="flex-1"
              onClick={() => setCurrentPhoto(Math.max(0, currentPhoto - 1))}
            />
            <button
              className="flex-1"
              onClick={() => setCurrentPhoto(Math.min(photos.length - 1, currentPhoto + 1))}
            />
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* LIKE/NOPE/SUPER overlays */}
        <motion.div
          className="absolute top-20 left-6 rounded-xl border-4 border-emerald-400 px-4 py-2 -rotate-12"
          style={{ opacity: likeOpacity }}
        >
          <span className="text-3xl font-black text-emerald-400">LIKE</span>
        </motion.div>
        <motion.div
          className="absolute top-20 right-6 rounded-xl border-4 border-red-400 px-4 py-2 rotate-12"
          style={{ opacity: nopeOpacity }}
        >
          <span className="text-3xl font-black text-red-400">NOPE</span>
        </motion.div>
        <motion.div
          className="absolute top-20 left-1/2 -translate-x-1/2 rounded-xl border-4 border-blue-400 px-4 py-2"
          style={{ opacity: superLikeOpacity }}
        >
          <span className="text-3xl font-black text-blue-400">SUPER</span>
        </motion.div>

        {/* Profile info */}
        <div
          className="absolute bottom-0 left-0 right-0 p-6"
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-white">{profile.display_name}</h2>
            <span className="text-xl text-white/80">{age}</span>
            {profile.is_verified && (
              <CheckCircle2 className="h-5 w-5 text-blue-400 fill-blue-400" />
            )}
          </div>

          {profile.location_city && (
            <div className="flex items-center gap-1 text-white/60 text-sm mb-2">
              <MapPin className="h-3 w-3" />
              <span>{profile.location_city}</span>
            </div>
          )}

          {profile.prompts?.[0] && (
            <div className="mt-2 rounded-xl bg-white/10 backdrop-blur-sm p-3">
              <p className="text-xs text-[#FF5E9C] font-medium mb-1">{profile.prompts[0].question}</p>
              <p className="text-sm text-white/90">{profile.prompts[0].answer}</p>
            </div>
          )}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {profile.interests.slice(0, 5).map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
