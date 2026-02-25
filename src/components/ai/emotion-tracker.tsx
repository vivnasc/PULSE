"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, Clock, Sparkles } from "lucide-react";

interface EmotionPoint {
  time: string;
  score: number;
  label: string;
  emoji: string;
}

const DEFAULT_POINTS: EmotionPoint[] = [
  { time: "0min", score: 40, label: "Warming up", emoji: "\u{1F60A}" },
  { time: "5min", score: 55, label: "Getting comfortable", emoji: "\u{1F604}" },
  { time: "10min", score: 72, label: "Found shared interest", emoji: "\u{1F929}" },
  { time: "15min", score: 65, label: "Slight dip", emoji: "\u{1F914}" },
  { time: "20min", score: 85, label: "Deep connection", emoji: "\u{2764}\u{FE0F}" },
  { time: "25min", score: 88, label: "Peak chemistry!", emoji: "\u{1F525}" },
  { time: "30min", score: 80, label: "Sustaining", emoji: "\u{1F495}" },
];

export function EmotionTracker({
  points = DEFAULT_POINTS,
  peakMoment = "When you both talked about travel dreams",
  overallChemistry = 82,
  connectionPeaks = 3,
}: {
  points?: EmotionPoint[];
  peakMoment?: string;
  overallChemistry?: number;
  connectionPeaks?: number;
}) {
  const maxScore = Math.max(...points.map((p) => p.score));

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#FF3B5C]" />
            Emotion Tracking
          </CardTitle>
          <Badge variant={overallChemistry > 70 ? "default" : "secondary"}>
            {overallChemistry}% Chemistry
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Emotion chart */}
        <div className="relative h-32 flex items-end gap-1">
          {points.map((point, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-sm">{point.emoji}</span>
              <motion.div
                className={`w-full rounded-t-md ${
                  point.score === maxScore
                    ? "bg-gradient-to-t from-[#FF3B5C] to-[#FF5E9C]"
                    : "bg-white/10"
                }`}
                initial={{ height: 0 }}
                animate={{ height: `${(point.score / 100) * 80}%` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
              <span className="text-[9px] text-white/30">{point.time}</span>
            </div>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/5 p-3">
            <TrendingUp className="h-4 w-4 text-emerald-400 mb-1" />
            <p className="text-sm font-semibold text-white">{connectionPeaks} peaks</p>
            <p className="text-[10px] text-white/40">Connection peaks</p>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <Clock className="h-4 w-4 text-blue-400 mb-1" />
            <p className="text-sm font-semibold text-white">25min</p>
            <p className="text-[10px] text-white/40">Best moment at</p>
          </div>
        </div>

        {/* Peak moment */}
        <div className="rounded-xl bg-[#FF3B5C]/5 border border-[#FF3B5C]/10 p-3">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-[#FF3B5C] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-[#FF3B5C] font-medium">Peak connection moment</p>
              <p className="text-sm text-white/70 mt-0.5">{peakMoment}</p>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-white/50">Highlights</h4>
          {points
            .filter((p) => p.score >= 70)
            .map((point, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span>{point.emoji}</span>
                <span className="text-white/60">{point.time}</span>
                <span className="text-white/40">&mdash;</span>
                <span className="text-white/70">{point.label}</span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
