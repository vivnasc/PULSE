"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, X, Sparkles, Heart } from "lucide-react";

interface AvatarMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIAvatarChatProps {
  profileName: string;
  profilePhoto?: string | null;
  onClose: () => void;
  onMatch: () => void;
}

export function AIAvatarChat({ profileName, profilePhoto, onClose, onMatch }: AIAvatarChatProps) {
  const [messages, setMessages] = useState<AvatarMessage[]>([
    {
      id: "intro",
      content: `Hey! I'm ${profileName}'s AI avatar. I've been trained on their personality, interests, and communication style. Chat with me to see if we'd vibe! Ask me anything.`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chemistryScore, setChemistryScore] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const simulateResponse = () => {
    setIsTyping(true);
    const responses = [
      `That's a great question! Based on what I know about ${profileName}, they'd probably say something like... they're really passionate about authentic connections. Not the superficial kind.`,
      `Oh, ${profileName} would love that topic! They're the type who can talk about this for hours. Their take is usually pretty thoughtful and sometimes surprising.`,
      `Hmm, interesting! ${profileName} values honesty a lot. They'd probably give you a really direct answer to that.`,
      `You know what, ${profileName} mentioned something similar in their profile. They believe in quality over quantity when it comes to relationships.`,
      `Great observation! ${profileName} is definitely someone who notices the small things. They'd appreciate that you brought this up.`,
    ];

    setTimeout(() => {
      const response = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: `avatar-${Date.now()}`,
          content: response,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
      setChemistryScore((prev) => Math.min(100, prev + Math.floor(Math.random() * 15) + 5));
    }, 1500 + Math.random() * 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        content: input,
        isUser: true,
        timestamp: new Date(),
      },
    ]);
    setInput("");
    simulateResponse();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      className="fixed inset-0 z-50 flex flex-col bg-[#0E0F14]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        <button onClick={onClose} className="text-white/60 hover:text-white">
          <X className="h-5 w-5" />
        </button>
        <div className="relative">
          <Avatar src={profilePhoto} fallback={profileName[0]} size="sm" />
          <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-violet-500 border-2 border-[#0E0F14] flex items-center justify-center">
            <Bot className="h-2.5 w-2.5 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{profileName}&apos;s AI</span>
            <Badge variant="secondary" className="text-[10px]">
              <Bot className="h-2.5 w-2.5 mr-0.5" />
              Avatar
            </Badge>
          </div>
          <p className="text-xs text-violet-400">AI-powered personality simulation</p>
        </div>
        {chemistryScore > 0 && (
          <Badge variant={chemistryScore > 70 ? "default" : "secondary"}>
            <Sparkles className="h-3 w-3 mr-1" />
            {chemistryScore}%
          </Badge>
        )}
      </div>

      {/* Chemistry bar */}
      {chemistryScore > 0 && (
        <div className="px-4 py-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Chemistry</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#FF3B5C] to-[#FF5E9C]"
                animate={{ width: `${chemistryScore}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs text-white/60">{chemistryScore}%</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                msg.isUser
                  ? "bg-gradient-to-r from-[#FF3B5C]/90 to-[#FF5E9C]/90 text-white rounded-br-md"
                  : "bg-violet-500/10 border border-violet-500/20 text-white/90 rounded-bl-md"
              }`}
            >
              {!msg.isUser && (
                <div className="flex items-center gap-1 mb-1">
                  <Bot className="h-3 w-3 text-violet-400" />
                  <span className="text-[10px] text-violet-400 font-medium">AI Avatar</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-2 w-2 rounded-full bg-violet-400 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Match CTA */}
      {chemistryScore >= 60 && (
        <div className="px-4 py-2 border-t border-white/5">
          <Button onClick={onMatch} className="w-full" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            Chemistry looks great! Match with {profileName}
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={`Ask ${profileName}'s AI anything...`}
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/30"
          />
          <Button size="icon" className="h-9 w-9 rounded-full" onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
