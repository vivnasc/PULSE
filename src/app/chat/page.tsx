"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/app-layout";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";

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
    lastMessage: "Looking forward to our coffee date!",
    lastMessageTime: "2h", unread: 2, online: true, compatibility: 89, typing: false,
  },
  {
    id: "c2", matchId: "m3", name: "Luna", photo: null,
    lastMessage: "That's such a great perspective on life!",
    lastMessageTime: "5h", unread: 0, online: false, compatibility: 76, typing: false,
  },
  {
    id: "c3", matchId: "m4", name: "Maria", photo: null,
    lastMessage: "Have you been to that new restaurant in Polana?",
    lastMessageTime: "1d", unread: 0, online: true, compatibility: 82, typing: true,
  },
];

export default function ChatListPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-md px-4 pt-4">
        <h1 className="text-2xl font-bold text-white mb-4">Messages</h1>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input placeholder="Search conversations..." className="pl-10" />
        </div>

        <div className="mb-4 rounded-xl border border-[#FF3B5C]/20 bg-[#FF3B5C]/5 p-3 flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-[#FF3B5C] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-[#FF5E9C] font-medium">AI Coach Tip</p>
            <p className="text-xs text-white/50 mt-0.5">
              Sofia mentioned she loves photography. Ask about her latest photos to deepen the connection!
            </p>
          </div>
        </div>

        <div className="space-y-1">
          {DEMO_CHATS.map((chat, i) => (
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
                      {chat.typing ? <span className="text-[#FF3B5C] italic">typing...</span> : chat.lastMessage}
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

        {DEMO_CHATS.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40">No conversations yet</p>
            <p className="text-sm text-white/30 mt-1">Match with someone to start chatting</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
