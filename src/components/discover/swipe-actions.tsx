"use client";

import { motion } from "framer-motion";
import { X, Heart, Star, RotateCcw, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeActionsProps {
  onPass: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onRewind?: () => void;
  onBoost?: () => void;
  canRewind?: boolean;
  canBoost?: boolean;
}

export function SwipeActions({
  onPass,
  onLike,
  onSuperLike,
  onRewind,
  onBoost,
  canRewind = false,
  canBoost = false,
}: SwipeActionsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Rewind */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onRewind}
        disabled={!canRewind}
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition-all",
          canRewind
            ? "bg-white/5 text-amber-400 hover:bg-amber-400/10"
            : "opacity-30 cursor-not-allowed"
        )}
      >
        <RotateCcw className="h-4 w-4" />
      </motion.button>

      {/* Pass */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onPass}
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-400/30 bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-all"
      >
        <X className="h-7 w-7" />
      </motion.button>

      {/* Super Like */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onSuperLike}
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-400/30 bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 transition-all"
      >
        <Star className="h-6 w-6" />
      </motion.button>

      {/* Like */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onLike}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25 hover:shadow-xl transition-all"
      >
        <Heart className="h-7 w-7" />
      </motion.button>

      {/* Boost */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onBoost}
        disabled={!canBoost}
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition-all",
          canBoost
            ? "bg-white/5 text-violet-400 hover:bg-violet-400/10"
            : "opacity-30 cursor-not-allowed"
        )}
      >
        <Zap className="h-4 w-4" />
      </motion.button>
    </div>
  );
}
