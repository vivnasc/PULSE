"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/app-layout";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { calculateAge } from "@/lib/utils";

interface MatchData {
  id: string;
  created_at: string;
  user_a_id: string;
  user_b_id: string;
  status: string;
  compatibility_score: number | null;
  user_a: {
    id: string;
    display_name: string;
    photos: string[];
    location_city: string | null;
    is_verified: boolean;
    last_active: string | null;
    birth_date: string;
  } | null;
  user_b: {
    id: string;
    display_name: string;
    photos: string[];
    location_city: string | null;
    is_verified: boolean;
    last_active: string | null;
    birth_date: string;
  } | null;
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  } | null;
}

interface DemoMatch {
  id: string;
  name: string;
  age: number;
  photo: string | null;
  lastMessage?: string;
  isNew: boolean;
  compatibility: number;
  time?: string;
}

const DEMO_MATCHES: DemoMatch[] = [
  { id: "m1", name: "Sofia", age: 27, photo: null, lastMessage: "Mal posso esperar pelo nosso café!", isNew: false, compatibility: 89, time: "2h" },
  { id: "m2", name: "Aisha", age: 26, photo: null, isNew: true, compatibility: 94 },
  { id: "m3", name: "Luna", age: 25, photo: null, lastMessage: "Que perspetiva tão boa!", isNew: false, compatibility: 76, time: "5h" },
];

const DEMO_LIKES = [
  { id: "l1", name: "???", blurred: true },
  { id: "l2", name: "???", blurred: true },
  { id: "l3", name: "???", blurred: true },
];

export default function MatchesPage() {
  const [tab, setTab] = useState<"matches" | "likes">("matches");
  const [matches, setMatches] = useState<DemoMatch[]>([]);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setMatches(DEMO_MATCHES);
          setLikesCount(DEMO_LIKES.length);
          setLoading(false);
          return;
        }

        // Fetch matches
        const res = await fetch("/api/matches");
        if (!res.ok) throw new Error("Failed to fetch");

        const matchData: MatchData[] = await res.json();

        if (matchData.length === 0) {
          setMatches(DEMO_MATCHES);
          setLikesCount(DEMO_LIKES.length);
          setLoading(false);
          return;
        }

        // Get last messages for each match
        const processedMatches = await Promise.all(
          matchData.map(async (match) => {
            const otherUser = match.user_a_id === user.id ? match.user_b : match.user_a;
            if (!otherUser) return null;

            // Fetch last message for this match
            const { data: msgs } = await supabase
              .from("messages")
              .select("content, created_at, sender_id")
              .eq("match_id", match.id)
              .order("created_at", { ascending: false })
              .limit(1);

            const lastMsg = msgs?.[0];
            const isNew = !lastMsg;
            const timeDiff = lastMsg
              ? getTimeAgo(new Date(lastMsg.created_at))
              : undefined;

            return {
              id: match.id,
              name: otherUser.display_name,
              age: calculateAge(new Date(otherUser.birth_date)),
              photo: otherUser.photos?.[0] || null,
              lastMessage: lastMsg?.content,
              isNew,
              compatibility: match.compatibility_score || Math.floor(Math.random() * 20 + 75),
              time: timeDiff,
            };
          })
        );

        const validMatches = processedMatches.filter((m) => m !== null) as DemoMatch[];
        setMatches(validMatches.length > 0 ? validMatches : DEMO_MATCHES);

        // Count pending likes (people who liked me but I haven't swiped)
        const { count } = await supabase
          .from("swipes")
          .select("id", { count: "exact", head: true })
          .eq("swiped_id", user.id)
          .in("action", ["like", "super_like"]);

        setLikesCount(count || DEMO_LIKES.length);
      } catch {
        setMatches(DEMO_MATCHES);
        setLikesCount(DEMO_LIKES.length);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, []);

  // Subscribe to new matches in real-time
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("matches-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "matches" },
        () => {
          // Refetch when new match appears
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
            Matches ({matches.length})
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
            Likes ({likesCount})
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 text-[#FF3B5C] animate-spin" />
          </div>
        )}

        {/* Matches tab */}
        {!loading && tab === "matches" && (
          <>
            {/* New matches horizontal */}
            {matches.filter((m) => m.isNew).length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white/50 mb-3">Novos Matches</h3>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {matches.filter((m) => m.isNew).map((match) => (
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
            )}

            {/* Conversations */}
            <div>
              <h3 className="text-sm font-medium text-white/50 mb-3">Conversas</h3>
              {matches.filter((m) => m.lastMessage).length > 0 ? (
                <div className="space-y-2">
                  {matches.filter((m) => m.lastMessage).map((match) => (
                    <Link key={match.id} href={`/chat/${match.id}`}>
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                      >
                        <Avatar src={match.photo} fallback={match.name[0]} size="md" online />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-white">{match.name}, {match.age}</span>
                            <span className="text-xs text-white/30">{match.time}</span>
                          </div>
                          <p className="text-sm text-white/40 truncate">{match.lastMessage}</p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/40 text-sm">Envia a primeira mensagem aos teus matches!</p>
                </div>
              )}
            </div>

            {matches.length === 0 && (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/40">Sem matches ainda</p>
                <p className="text-sm text-white/30 mt-1">Continua a explorar para encontrar a tua pessoa</p>
              </div>
            )}
          </>
        )}

        {/* Likes tab (blurred for free users) */}
        {!loading && tab === "likes" && (
          <div>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: Math.min(likesCount, 6) }).map((_, i) => (
                <div
                  key={i}
                  className="relative aspect-[3/4] rounded-2xl bg-white/5 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B5C]/20 to-[#FF5E9C]/20 backdrop-blur-xl flex items-center justify-center">
                    <Heart className="h-8 w-8 text-white/20" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white/40 text-sm">Faz upgrade para ver</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-white/40 mt-4">
              Faz upgrade para Flame para ver quem te deu like
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}
