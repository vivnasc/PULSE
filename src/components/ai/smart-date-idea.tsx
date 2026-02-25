"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Wallet, RefreshCw, Sparkles, Sun, Coffee, Music, Heart } from "lucide-react";

interface DateStop {
  time: string;
  place: string;
  description: string;
  icon: React.ElementType;
  cost: string;
}

interface DateIdea {
  title: string;
  vibe: string;
  duration: string;
  totalBudget: string;
  stops: DateStop[];
  icebreaker: string;
  weatherBackup: string;
}

const DEMO_IDEA: DateIdea = {
  title: "Sunset & Sounds",
  vibe: "Romantic-Relaxed",
  duration: "3-4 hours",
  totalBudget: "~900 MZN",
  stops: [
    {
      time: "17:00",
      place: "Jardim Bot\u00e2nico de Maputo",
      description: "Perfect light for photos. Quiet, relaxed atmosphere.",
      icon: Sun,
      cost: "100 MZN",
    },
    {
      time: "18:30",
      place: "Caf\u00e9 Ac\u00e1cia (Polana)",
      description: "Terrace with a view. Ambient music, not loud. Great menu.",
      icon: Coffee,
      cost: "400 MZN",
    },
    {
      time: "20:00",
      place: "Centro Cultural Franco-Mo\u00e7ambicano",
      description: "Local indie band playing tonight. Intimate venue.",
      icon: Music,
      cost: "400 MZN",
    },
  ],
  icebreaker:
    "I heard the light at the botanical garden is amazing for photos right now. Want to see if the hype is real?",
  weatherBackup: "If it rains: Move to Caf\u00e9 Ac\u00e1cia early, then catch the concert.",
};

export function SmartDateIdea() {
  const [idea] = useState<DateIdea>(DEMO_IDEA);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-rose-400" />
            AI Date Idea
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs">
            <RefreshCw className="h-3 w-3 mr-1" />
            New idea
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title and meta */}
        <div>
          <h3 className="text-lg font-semibold text-white">{idea.title}</h3>
          <div className="flex items-center gap-3 mt-1.5">
            <Badge variant="secondary" className="text-xs">
              <Heart className="h-3 w-3 mr-1" />
              {idea.vibe}
            </Badge>
            <span className="text-xs text-white/40 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {idea.duration}
            </span>
            <span className="text-xs text-white/40 flex items-center gap-1">
              <Wallet className="h-3 w-3" />
              {idea.totalBudget}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-0">
          {idea.stops.map((stop, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative flex gap-3 pb-4"
            >
              {i < idea.stops.length - 1 && (
                <div className="absolute left-[15px] top-8 bottom-0 w-px bg-white/10" />
              )}
              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-white/10">
                <stop.icon className="h-4 w-4 text-rose-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-rose-400">{stop.time}</span>
                  <span className="text-xs text-white/30">{stop.cost}</span>
                </div>
                <p className="text-sm font-medium text-white mt-0.5">{stop.place}</p>
                <p className="text-xs text-white/50 mt-0.5">{stop.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Icebreaker */}
        <div className="rounded-xl bg-rose-500/5 border border-rose-500/10 p-3">
          <p className="text-xs text-rose-400 font-medium mb-1">Suggested icebreaker</p>
          <p className="text-sm text-white/70 italic">&quot;{idea.icebreaker}&quot;</p>
        </div>

        {/* Weather backup */}
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs text-white/40 mb-1">Weather backup plan</p>
          <p className="text-xs text-white/60">{idea.weatherBackup}</p>
        </div>

        {/* CTA */}
        <Button className="w-full">
          <MapPin className="h-4 w-4 mr-2" />
          Plan This Date
        </Button>
      </CardContent>
    </Card>
  );
}
