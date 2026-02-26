"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/app-layout";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ChatPreview {
  id: string;
  matchId: string;
  name: string;
  photo: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  online: boolean;
  compatibility: number;
  typing: boolean;
}

const DEMO_CHATS: ChatPreview[] = [
  {
    id: "c1", matchId: "m1", name: "Sofia", photo: null,
    lastMessage: "Mal posso esperar pelo nosso café!",
    lastMessageTime: "2h", unread: 2, online: true, compatibility: 89, typing: false,
  },
  {
    id: "c2", matchId: "m3", name: "Luna", photo: null,
    lastMessage: "Que perspetiva tão boa sobre a vida!",
    lastMessageTime: "5h", unread: 0, online: false, compatibility: 76, typing: false,
  },
  {
    id: "c3", matchId: "m4", name: "Maria", photo: null,
    lastMessage: "Já foste àquele restaurante novo na Polana?",
    lastMessageTime: "1d", unread: 0, online: true, compatibility: 82, typing: true,
  },
];

export default function ChatListPage() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChats() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setChats(DEMO_CHATS);
          setLoading(false);
          return;
        }

        // Fetch matches with profiles
        const { data: matches, error } = await supabase
          .from("matches")
          .select(`
            id,
            compatibility_score,
            user_a_id,
            user_b_id,
            user_a:profiles!matches_user_a_id_fkey(id, display_name, photos, is_verified, last_active),
            user_b:profiles!matches_user_b_id_fkey(id, display_name, photos, is_verified, last_active)
          `)
          .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
          .eq("status", "matched")
          .order("created_at", { ascending: false });

        if (error || !matches || matches.length === 0) {
          setChats(DEMO_CHATS);
          setLoading(false);
          return;
        }

        type JoinedProfile = { id: string; display_name: string; photos: string[]; is_verified: boolean; last_active: string | null };

        const chatPreviews: (ChatPreview | null)[] = await Promise.all(
          matches.map(async (match) => {
            const rawOther = match.user_a_id === user.id ? match.user_b : match.user_a;
            const other = (Array.isArray(rawOther) ? rawOther[0] : rawOther) as JoinedProfile | null;
            if (!other) return null;

            // Get last message
            const { data: msgs } = await supabase
              .from("messages")
              .select("content, created_at, sender_id, is_read")
              .eq("match_id", match.id)
              .order("created_at", { ascending: false })
              .limit(1);

            const lastMsg = msgs?.[0];

            // Count unread
            const { count: unreadCount } = await supabase
              .from("messages")
              .select("id", { count: "exact", head: true })
              .eq("match_id", match.id)
              .neq("sender_id", user.id)
              .eq("is_read", false);

            const isOnline = other.last_active
              ? new Date().getTime() - new Date(other.last_active).getTime() < 300000
              : false;

            return {
              id: match.id,
              matchId: match.id,
              name: other.display_name,
              photo: other.photos?.length > 0 ? other.photos[0] : null,
              lastMessage: lastMsg?.content || "Diz olá! 👋",
              lastMessageTime: lastMsg ? getTimeAgo(new Date(lastMsg.created_at)) : "novo",
              unread: unreadCount || 0,
              online: isOnline,
              compatibility: (match.compatibility_score as number) || Math.floor(Math.random() * 20 + 75),
              typing: false,
            } as ChatPreview;
          })
        );

        const validChats = chatPreviews.filter((c): c is ChatPreview => c !== null);
        setChats(validChats.length > 0 ? validChats : DEMO_CHATS);
      } catch {
        setChats(DEMO_CHATS);
      } finally {
        setLoading(false);
      }
    }

    fetchChats();
  }, []);

  // Real-time: listen for new messages
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("chat-list-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new as { match_id: string; content: string; created_at: string; sender_id: string };
          setChats((prev) =>
            prev.map((chat) =>
              chat.matchId === newMsg.match_id
                ? {
                    ...chat,
                    lastMessage: newMsg.content,
                    lastMessageTime: "agora",
                    unread: chat.unread + 1,
                  }
                : chat
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredChats = search
    ? chats.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : chats;

  return (
    <AppLayout>
      <div className="mx-auto max-w-md px-4 pt-4">
        <h1 className="text-2xl font-bold text-white mb-4">Mensagens</h1>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input
            placeholder="Pesquisar conversas..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {chats.length > 0 && !search && (
          <div className="mb-4 rounded-xl border border-[#FF3B5C]/20 bg-[#FF3B5C]/5 p-3 flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-[#FF3B5C] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-[#FF5E9C] font-medium">Dica do Coach IA</p>
              <p className="text-xs text-white/50 mt-0.5">
                {chats[0]?.name
                  ? `${chats[0].name} está ativa. Responde para manter a conversa fluir!`
                  : "Envia a primeira mensagem para começar a conhecer alguém!"}
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 text-[#FF3B5C] animate-spin" />
          </div>
        )}

        {!loading && (
          <div className="space-y-1">
            {filteredChats.map((chat, i) => (
              <Link key={chat.id} href={`/chat/${chat.matchId}`}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Avatar src={chat.photo} fallback={chat.name[0]} size="md" online={chat.online} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{chat.name}</span>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{chat.compatibility}%</Badge>
                      </div>
                      <span className="text-xs text-white/30">{chat.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white/40 truncate">
                        {chat.typing ? <span className="text-[#FF3B5C] italic">a escrever...</span> : chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <span className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#FF3B5C] to-[#FF5E9C] text-[10px] font-bold text-white">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredChats.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40">Sem conversas ainda</p>
            <p className="text-sm text-white/30 mt-1">Dá match com alguém para começar a conversar</p>
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
