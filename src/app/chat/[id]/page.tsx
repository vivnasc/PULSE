"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Mic, ImageIcon, Sparkles, Heart, MoreVertical, Phone, Video, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  type: "text" | "voice" | "image" | "system";
  ai_coaching_tip?: string | null;
  emotion_data?: { emotion?: string } | null;
}

interface MatchInfo {
  id: string;
  name: string;
  photo: string | null;
  compatibility: number;
  online: boolean;
}

const DEMO_MESSAGES: Message[] = [
  { id: "msg1", content: "Hey! Reparei que também adoramos fotografia. Que tipo de fotos costumas tirar?", sender_id: "other", created_at: new Date(Date.now() - 7200000).toISOString(), type: "text" },
  { id: "msg2", content: "Olá! Maioritariamente fotografia de rua e paisagens. Há algo mágico em capturar momentos do dia a dia. E tu?", sender_id: "me", created_at: new Date(Date.now() - 7000000).toISOString(), type: "text" },
  { id: "msg3", content: "Adoro retratos! Há tanta história nos rostos das pessoas. Talvez pudéssemos fazer um passeio fotográfico juntos?", sender_id: "other", created_at: new Date(Date.now() - 3600000).toISOString(), type: "text" },
  { id: "msg4", content: "Isso seria incrível! Conheço uns sítios ótimos em Maputo para fotos. O Mercado Central tem uma luz incrível de manhã.", sender_id: "me", created_at: new Date(Date.now() - 3500000).toISOString(), type: "text" },
  { id: "msg5", content: "Mal posso esperar pelo nosso café! ☕", sender_id: "other", created_at: new Date(Date.now() - 3400000).toISOString(), type: "text" },
];

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const matchId = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showCoachTip, setShowCoachTip] = useState(true);
  const [coachTip, setCoachTip] = useState("A carregar dicas...");
  const [matchInfo, setMatchInfo] = useState<MatchInfo>({ id: "", name: "...", photo: null, compatibility: 0, online: false });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch match info and messages
  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Demo mode
        setCurrentUserId("me");
        setMessages(DEMO_MESSAGES);
        setMatchInfo({ id: matchId, name: "Sofia", photo: null, compatibility: 89, online: true });
        setCoachTip("Ela sugeriu um passeio fotográfico — ótimo sinal! Sugere um dia e hora específicos para mostrar interesse genuíno.");
        setLoading(false);
        return;
      }

      setCurrentUserId(user.id);

      // Fetch match details
      const { data: match } = await supabase
        .from("matches")
        .select(`
          id,
          compatibility_score,
          user_a_id,
          user_b_id,
          user_a:profiles!matches_user_a_id_fkey(id, display_name, photos, last_active),
          user_b:profiles!matches_user_b_id_fkey(id, display_name, photos, last_active)
        `)
        .eq("id", matchId)
        .single();

      if (match) {
        type JoinedProfile = { id: string; display_name: string; photos: string[]; last_active: string | null };
        const rawOther = match.user_a_id === user.id ? match.user_b : match.user_a;
        const other = (Array.isArray(rawOther) ? rawOther[0] : rawOther) as JoinedProfile | null;
        if (other) {
          setMatchInfo({
            id: other.id,
            name: other.display_name,
            photo: other.photos?.length > 0 ? other.photos[0] : null,
            compatibility: (match.compatibility_score as number) || 85,
            online: other.last_active
              ? new Date().getTime() - new Date(other.last_active).getTime() < 300000
              : false,
          });
        }
      }

      // Fetch messages
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true })
        .limit(100);

      if (msgs && msgs.length > 0) {
        setMessages(msgs as Message[]);
      } else {
        setMessages(DEMO_MESSAGES.map((m) => ({
          ...m,
          sender_id: m.sender_id === "me" ? user.id : "other",
        })));
      }

      // Mark messages as read
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("match_id", matchId)
        .neq("sender_id", user.id)
        .eq("is_read", false);

      // Get AI coaching tip
      try {
        const coachRes = await fetch("/api/ai/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: (msgs || []).slice(-5),
            matchProfile: match?.user_a_id === user.id ? match?.user_b : match?.user_a,
          }),
        });
        if (coachRes.ok) {
          const coachData = await coachRes.json();
          if (coachData.tips?.length > 0) {
            setCoachTip(coachData.tips[0]);
          } else {
            setCoachTip("Sê genuíno e faz perguntas abertas para aprofundar a conexão!");
          }
        }
      } catch {
        setCoachTip("Sê genuíno e faz perguntas abertas para aprofundar a conexão!");
      }

      setLoading(false);
    }

    init();
  }, [matchId]);

  // Real-time message subscription
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`chat-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          // Mark as read if it's from the other person
          if (currentUserId && newMsg.sender_id !== currentUserId) {
            supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", newMsg.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, currentUserId]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!newMessage.trim() || sending) return;

    const content = newMessage.trim();
    setNewMessage("");
    setSending(true);

    // Optimistic message
    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticMsg: Message = {
      id: optimisticId,
      content,
      sender_id: currentUserId || "me",
      created_at: new Date().toISOString(),
      type: "text",
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, content, type: "text" }),
      });

      if (res.ok) {
        const savedMsg = await res.json();
        // Replace optimistic message with real one
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticId ? { ...savedMsg } : m))
        );
      }
    } catch {
      // Keep optimistic message on failure
    } finally {
      setSending(false);
    }
  }, [newMessage, sending, currentUserId, matchId]);

  const isMe = (senderId: string) => {
    if (!currentUserId) return senderId === "me";
    return senderId === currentUserId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0E0F14]">
        <Loader2 className="h-8 w-8 text-[#FF3B5C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0E0F14]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#0E0F14]/90 backdrop-blur-xl">
        <button onClick={() => router.back()} className="text-white/60 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar src={matchInfo.photo} fallback={matchInfo.name[0]} size="sm" online={matchInfo.online} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{matchInfo.name}</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{matchInfo.compatibility}% match</Badge>
          </div>
          <p className={`text-xs ${matchInfo.online ? "text-emerald-400" : "text-white/30"}`}>
            {matchInfo.online ? "Online" : "Offline"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="h-4 w-4 text-white/50" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Video className="h-4 w-4 text-white/50" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4 text-white/50" /></Button>
        </div>
      </div>

      {/* AI Coach tip */}
      <AnimatePresence>
        {showCoachTip && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-b border-white/5 overflow-hidden">
            <div className="px-4 py-2 bg-[#FF3B5C]/5 flex items-start gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#FF3B5C] mt-0.5 shrink-0" />
              <p className="text-xs text-white/60 flex-1">{coachTip}</p>
              <button onClick={() => setShowCoachTip(false)} className="text-white/30 hover:text-white/50"><X className="h-3 w-3" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <div className="text-center mb-4">
          <Badge variant="secondary" className="text-xs">
            <Heart className="h-3 w-3 mr-1 text-[#FF3B5C]" />
            Química: {matchInfo.compatibility > 80 ? "Alta" : "A crescer"} — {messages.length > 10 ? "Conversa a fluir naturalmente" : "Vamos conhecer-nos!"}
          </Badge>
        </div>

        {messages.map((msg) => {
          const mine = isMe(msg.sender_id);
          return (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${mine ? "bg-gradient-to-r from-[#FF3B5C]/90 to-[#FF5E9C]/90 text-white rounded-br-md" : "bg-white/10 text-white/90 rounded-bl-md"}`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${mine ? "text-white/50" : "text-white/30"}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/5 bg-[#0E0F14]/90 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0"><ImageIcon className="h-4 w-4 text-white/40" /></Button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Escreve uma mensagem..."
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF3B5C]/30"
          />
          {newMessage ? (
            <Button size="icon" className="h-9 w-9 shrink-0 rounded-full" onClick={handleSend} disabled={sending}>
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0"><Mic className="h-4 w-4 text-white/40" /></Button>
          )}
        </div>
      </div>
    </div>
  );
}
