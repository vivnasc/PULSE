"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Settings, Edit3, Shield, Crown, Camera, Mic, Heart, MapPin, ChevronRight, Sparkles, BarChart3, Eye, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { calculateAge } from "@/lib/utils";
import type { Profile } from "@/types/database";

const TIER_LABELS = {
  free: "Spark (Grátis)",
  flame: "Flame",
  blaze: "Blaze",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({ likes: 0, matches: 0, conversations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        // Fetch profile
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile(data as Profile);
        }

        // Fetch stats
        const [likesRes, matchesRes, msgsRes] = await Promise.all([
          supabase
            .from("swipes")
            .select("id", { count: "exact", head: true })
            .eq("swiped_id", user.id)
            .in("action", ["like", "super_like"]),
          supabase
            .from("matches")
            .select("id", { count: "exact", head: true })
            .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
            .eq("status", "matched"),
          supabase
            .from("messages")
            .select("match_id", { count: "exact", head: true })
            .eq("sender_id", user.id),
        ]);

        setStats({
          likes: likesRes.count || 0,
          matches: matchesRes.count || 0,
          conversations: msgsRes.count || 0,
        });
      } catch {
        // Use demo fallback
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 text-[#FF3B5C] animate-spin" />
        </div>
      </AppLayout>
    );
  }

  // Demo fallback
  const displayName = profile?.display_name || "Utilizador";
  const age = profile ? calculateAge(new Date(profile.birth_date)) : 25;
  const location = profile?.location_city
    ? `${profile.location_city}${profile.location_country ? `, ${profile.location_country}` : ""}`
    : "Localização não definida";
  const verified = profile?.is_verified || false;
  const tier = profile?.subscription_tier || "free";
  const interests = profile?.interests || [];
  const prompts = profile?.prompts || [];
  const photos = profile?.photos || [];

  return (
    <AppLayout>
      <div className="mx-auto max-w-md px-4 pt-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Perfil</h1>
          <Link href="/settings"><Button variant="ghost" size="icon" className="h-9 w-9"><Settings className="h-4 w-4" /></Button></Link>
        </div>

        <div className="text-center mb-6">
          <div className="relative inline-block">
            <Avatar
              src={photos[0] || null}
              fallback={displayName[0]}
              size="xl"
              verified={verified}
            />
            <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-gradient-to-r from-[#FF3B5C] to-[#FF5E9C] flex items-center justify-center border-2 border-[#0E0F14]">
              <Camera className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
          <h2 className="mt-3 text-xl font-bold text-white">{displayName}, {age}</h2>
          <div className="flex items-center justify-center gap-1 text-white/50 text-sm">
            <MapPin className="h-3 w-3" /><span>{location}</span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <Badge variant="secondary">{TIER_LABELS[tier as keyof typeof TIER_LABELS]}</Badge>
            {verified && <Badge variant="success"><Shield className="h-3 w-3 mr-1" />Verificado</Badge>}
          </div>
          <div className="flex items-center justify-center gap-3 mt-4">
            <Link href="/profile/edit"><Button variant="outline" size="sm"><Edit3 className="h-3.5 w-3.5 mr-1.5" />Editar Perfil</Button></Link>
            <Button variant="outline" size="sm"><Eye className="h-3.5 w-3.5 mr-1.5" />Pré-visualizar</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Likes", value: stats.likes, icon: Heart },
            { label: "Matches", value: stats.matches, icon: Sparkles },
            { label: "Conversas", value: stats.conversations, icon: BarChart3 },
          ].map((stat) => (
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
            {Array.from({ length: 6 }).map((_, i) => (
              <button key={i} className="aspect-[3/4] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors overflow-hidden">
                {photos[i] ? (
                  <img src={photos[i]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Camera className="h-5 w-5 text-white/20" />
                )}
              </button>
            ))}
          </div>
        </div>

        {profile?.voice_note_url ? (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white/60 mb-3">Nota de Voz</h3>
            <div className="w-full p-4 rounded-xl border border-white/10 bg-white/5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#FF3B5C] to-[#FF5E9C] flex items-center justify-center">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <p className="text-sm text-white/60">Nota de voz gravada</p>
            </div>
          </div>
        ) : (
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
        )}

        {prompts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white/60 mb-3">Prompts</h3>
            <div className="space-y-3">
              {prompts.map((prompt, i) => (
                <Card key={i}><CardContent className="p-4">
                  <p className="text-xs text-[#FF3B5C] font-medium mb-1">{prompt.question}</p>
                  <p className="text-sm text-white/80">{prompt.answer}</p>
                </CardContent></Card>
              ))}
            </div>
          </div>
        )}

        {interests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white/60 mb-3">Interesses</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (<Badge key={interest} variant="secondary">{interest}</Badge>))}
            </div>
          </div>
        )}

        {tier === "free" && (
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
