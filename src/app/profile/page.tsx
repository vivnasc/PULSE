"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Settings, Edit3, Shield, Crown, Camera, Mic, Heart, MapPin, ChevronRight, Sparkles, BarChart3, Eye } from "lucide-react";

export default function ProfilePage() {
  const profile = {
    displayName: "Carlos",
    age: 29,
    location: "Maputo, Mozambique",
    verified: true,
    tier: "free" as const,
    interests: ["Photography", "Travel", "Cooking", "Hiking", "Music"],
    prompts: [
      { question: "My secret superpower is...", answer: "Making anyone feel comfortable in the first 5 minutes of meeting them." },
      { question: "Green flag that wins me over:", answer: "Someone who can laugh at themselves and doesn't take life too seriously." },
    ],
    stats: { likes: 23, matches: 8, conversations: 5 },
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-md px-4 pt-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Perfil</h1>
          <Link href="/settings"><Button variant="ghost" size="icon" className="h-9 w-9"><Settings className="h-4 w-4" /></Button></Link>
        </div>

        <div className="text-center mb-6">
          <div className="relative inline-block">
            <Avatar src={null} fallback={profile.displayName[0]} size="xl" verified={profile.verified} />
            <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-gradient-to-r from-[#FF3B5C] to-[#FF5E9C] flex items-center justify-center border-2 border-[#0E0F14]">
              <Camera className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
          <h2 className="mt-3 text-xl font-bold text-white">{profile.displayName}, {profile.age}</h2>
          <div className="flex items-center justify-center gap-1 text-white/50 text-sm">
            <MapPin className="h-3 w-3" /><span>{profile.location}</span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <Badge variant="secondary">Spark (Grátis)</Badge>
            {profile.verified && <Badge variant="success"><Shield className="h-3 w-3 mr-1" />Verified</Badge>}
          </div>
          <div className="flex items-center justify-center gap-3 mt-4">
            <Link href="/profile/edit"><Button variant="outline" size="sm"><Edit3 className="h-3.5 w-3.5 mr-1.5" />Editar Perfil</Button></Link>
            <Button variant="outline" size="sm"><Eye className="h-3.5 w-3.5 mr-1.5" />Pré-visualizar</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[{ label: "Likes", value: profile.stats.likes, icon: Heart }, { label: "Matches", value: profile.stats.matches, icon: Sparkles }, { label: "Conversas", value: profile.stats.conversations, icon: BarChart3 }].map((stat) => (
            <Card key={stat.label}><CardContent className="p-3 text-center">
              <stat.icon className="h-4 w-4 mx-auto text-[#FF3B5C] mb-1" />
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/40">{stat.label}</p>
            </CardContent></Card>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-white/60 mb-3">Fotos</h3>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <button key={i} className="aspect-[3/4] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Camera className="h-5 w-5 text-white/20" />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-white/60 mb-3">Nota de Voz</h3>
          <button className="w-full p-4 rounded-xl border border-white/10 bg-white/5 flex items-center gap-3 hover:bg-white/10 transition-colors">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#FF3B5C] to-[#FF5E9C] flex items-center justify-center">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-white">Grava a tua nota de voz</p>
              <p className="text-xs text-white/40">15-30 seg. Deixa os matches ouvirem-te.</p>
            </div>
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-white/60 mb-3">Prompts</h3>
          <div className="space-y-3">
            {profile.prompts.map((prompt, i) => (
              <Card key={i}><CardContent className="p-4">
                <p className="text-xs text-[#FF3B5C] font-medium mb-1">{prompt.question}</p>
                <p className="text-sm text-white/80">{prompt.answer}</p>
              </CardContent></Card>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-white/60 mb-3">Interesses</h3>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (<Badge key={interest} variant="secondary">{interest}</Badge>))}
          </div>
        </div>

        {profile.tier === "free" && (
          <Card className="border-[#FF3B5C]/20 bg-gradient-to-r from-[#FF3B5C]/5 to-[#FF5E9C]/5">
            <CardContent className="p-4 text-center">
              <Crown className="h-8 w-8 text-amber-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Desbloqueia Funcionalidades Premium</h3>
              <p className="text-xs text-white/50 mt-1 mb-3">Coach IA, Clonagem de Voz, Matches Ilimitados e mais</p>
              <Button size="sm">Upgrade para Flame<ChevronRight className="h-4 w-4 ml-1" /></Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
