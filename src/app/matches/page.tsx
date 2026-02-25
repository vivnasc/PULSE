"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/app-layout";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, MessageCircle } from "lucide-react";

interface DemoMatch {
  id: string;
  name: string;
  age: number;
  photo: string | null;
  lastMessage?: string;
  isNew: boolean;
  compatibility: number;
}

const DEMO_MATCHES: DemoMatch[] = [
  {
    id: "m1",
    name: "Sofia",
    age: 27,
    photo: null,
    lastMessage: "Looking forward to our coffee date!",
    isNew: false,
    compatibility: 89,
  },
  {
    id: "m2",
    name: "Aisha",
    age: 26,
    photo: null,
    isNew: true,
    compatibility: 94,
  },
  {
    id: "m3",
    name: "Luna",
    age: 25,
    photo: null,
    lastMessage: "That's such a great perspective!",
    isNew: false,
    compatibility: 76,
  },
];

const DEMO_LIKES: { id: string; name: string; blurred: boolean }[] = [
  { id: "l1", name: "???", blurred: true },
  { id: "l2", name: "???", blurred: true },
  { id: "l3", name: "???", blurred: true },
];

export default function MatchesPage() {
  const [tab, setTab] = useState<"matches" | "likes">("matches");

  return (
    <AppLayout>
      <div className="mx-auto max-w-md px-4 pt-4">
        <h1 className="text-2xl font-bold text-white mb-4">Matches</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("matches")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === "matches"
                ? "bg-gradient-to-r from-[#FF3B5C] to-[#FF5E9C] text-white"
                : "bg-white/5 text-white/50"
            }`}
          >
            <Heart className="inline h-4 w-4 mr-1" />
            Matches ({DEMO_MATCHES.length})
          </button>
          <button
            onClick={() => setTab("likes")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === "likes"
                ? "bg-gradient-to-r from-[#FF3B5C] to-[#FF5E9C] text-white"
                : "bg-white/5 text-white/50"
            }`}
          >
            <Sparkles className="inline h-4 w-4 mr-1" />
            Likes ({DEMO_LIKES.length})
          </button>
        </div>

        {/* New matches horizontal */}
        {tab === "matches" && (
          <>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white/50 mb-3">New Matches</h3>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {DEMO_MATCHES.filter((m) => m.isNew).map((match) => (
                  <Link key={match.id} href={`/chat/${match.id}`}>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="relative">
                        <div className="rounded-full p-0.5 bg-gradient-to-r from-[#FF3B5C] via-[#FF5E9C] to-[#FF5E9C]">
                          <Avatar
                            src={match.photo}
                            fallback={match.name[0]}
                            size="lg"
                            className="border-2 border-[#0E0F14]"
                          />
                        </div>
                        <Badge className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] px-1.5">
                          {match.compatibility}%
                        </Badge>
                      </div>
                      <span className="text-xs text-white/70">{match.name}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Conversations */}
            <div>
              <h3 className="text-sm font-medium text-white/50 mb-3">Conversations</h3>
              <div className="space-y-2">
                {DEMO_MATCHES.filter((m) => m.lastMessage).map((match) => (
                  <Link key={match.id} href={`/chat/${match.id}`}>
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <Avatar
                        src={match.photo}
                        fallback={match.name[0]}
                        size="md"
                        online
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">{match.name}, {match.age}</span>
                          <span className="text-xs text-white/30">2h</span>
                        </div>
                        <p className="text-sm text-white/40 truncate">{match.lastMessage}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Likes (blurred for free users) */}
        {tab === "likes" && (
          <div>
            <div className="grid grid-cols-2 gap-3">
              {DEMO_LIKES.map((like) => (
                <div
                  key={like.id}
                  className="relative aspect-[3/4] rounded-2xl bg-white/5 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B5C]/20 to-[#FF5E9C]/20 backdrop-blur-xl flex items-center justify-center">
                    <Heart className="h-8 w-8 text-white/20" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white/40 text-sm">Upgrade to see</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-white/40 mt-4">
              Upgrade to Flame to see who liked you
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
