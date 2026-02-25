"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

interface DateCoachTipProps {
  tip: string;
  category: "conversation" | "warning" | "suggestion" | "milestone";
  detail?: string;
}

export function DateCoachTip({ tip, category, detail }: DateCoachTipProps) {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const styles = {
    conversation: {
      icon: Sparkles,
      color: "text-rose-400",
      bg: "bg-rose-500/5 border-rose-500/10",
    },
    warning: {
      icon: Lightbulb,
      color: "text-amber-400",
      bg: "bg-amber-500/5 border-amber-500/10",
    },
    suggestion: {
      icon: Lightbulb,
      color: "text-blue-400",
      bg: "bg-blue-500/5 border-blue-500/10",
    },
    milestone: {
      icon: Sparkles,
      color: "text-emerald-400",
      bg: "bg-emerald-500/5 border-emerald-500/10",
    },
  };

  const style = styles[category];
  const Icon = style.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className={`rounded-xl border ${style.bg} p-3 mx-4 my-1`}
      >
        <div className="flex items-start gap-2">
          <Icon className={`h-3.5 w-3.5 ${style.color} mt-0.5 shrink-0`} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/70">{tip}</p>
            {detail && expanded && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-white/40 mt-1"
              >
                {detail}
              </motion.p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {detail && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-white/30 hover:text-white/50"
              >
                {expanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
            )}
            <button
              onClick={() => setDismissed(true)}
              className="text-white/30 hover:text-white/50"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
