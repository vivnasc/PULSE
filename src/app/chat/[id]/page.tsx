"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Mic, Image, Sparkles, Heart, MoreVertical, Phone, Video, X } from "lucide-react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  type: "text" | "voice" | "image" | "system";
  aiTip?: string;
  emotion?: string;
}

const DEMO_MESSAGES: Message[] = [
  { id: "msg1", content: "Hey! I noticed we both love photography. What kind of photos do you usually take?", senderId: "other", timestamp: new Date(Date.now() - 7200000), type: "text" },
  { id: "msg2", content: "Hi! Mostly street photography and landscapes. There's something magical about capturing everyday moments. What about you?", senderId: "me", timestamp: new Date(Date.now() - 7000000), type: "text", emotion: "excited" },
  { id: "msg3", content: "I love portraits! There's so much story in people's faces. Maybe we could do a photo walk together sometime?", senderId: "other", timestamp: new Date(Date.now() - 3600000), type: "text" },
  { id: "msg4", content: "That sounds amazing! I know some great spots in Maputo for photos. The Mercado Central has incredible light in the morning.", senderId: "me", timestamp: new Date(Date.now() - 3500000), type: "text", emotion: "enthusiastic" },
  { id: "msg5", content: "Looking forward to our coffee date! ☕", senderId: "other", timestamp: new Date(Date.now() - 3400000), type: "text" },
];

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [showCoachTip, setShowCoachTip] = useState(true);
  const [coachTip] = useState("She suggested a photo walk — this is a great sign! Suggest a specific day and time to show genuine interest.");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const matchName = "Sofia";
  const matchCompatibility = 89;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = { id: `msg-${Date.now()}`, content: newMessage, senderId: "me", timestamp: new Date(), type: "text" };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-gray-950/90 backdrop-blur-xl">
        <button onClick={() => router.back()} className="text-white/60 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar src={null} fallback={matchName[0]} size="sm" online />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{matchName}</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{matchCompatibility}% match</Badge>
          </div>
          <p className="text-xs text-emerald-400">Online</p>
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
            <div className="px-4 py-2 bg-rose-500/5 flex items-start gap-2">
              <Sparkles className="h-3.5 w-3.5 text-rose-400 mt-0.5 shrink-0" />
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
            <Heart className="h-3 w-3 mr-1 text-rose-400" />
            Chemistry: High — Conversation flowing naturally
          </Badge>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === "me";
          return (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${isMe ? "bg-gradient-to-r from-rose-500/90 to-pink-500/90 text-white rounded-br-md" : "bg-white/10 text-white/90 rounded-bl-md"}`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isMe ? "text-white/50" : "text-white/30"}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {msg.emotion && <span className="ml-1.5">{msg.emotion === "excited" ? "😊" : "🔥"}</span>}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/5 bg-gray-950/90 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0"><Image className="h-4 w-4 text-white/40" /></Button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/30"
          />
          {newMessage ? (
            <Button size="icon" className="h-9 w-9 shrink-0 rounded-full" onClick={handleSend}><Send className="h-4 w-4" /></Button>
          ) : (
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0"><Mic className="h-4 w-4 text-white/40" /></Button>
          )}
        </div>
      </div>
    </div>
  );
}
