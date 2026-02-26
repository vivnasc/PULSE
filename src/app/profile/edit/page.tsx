"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Mic,
  Save,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { CREATIVE_PROMPTS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { PhotoUpload } from "@/components/ui/photo-upload";
import type { Profile, PromptAnswer } from "@/types/database";

const ALL_INTERESTS = [
  "Photography", "Travel", "Music", "Cooking", "Fitness", "Reading",
  "Gaming", "Art", "Dance", "Hiking", "Yoga", "Movies",
  "Coffee", "Wine", "Surfing", "Meditation", "Fashion", "Tech",
  "Animals", "Volunteering", "Writing", "Comedy", "Podcasts", "Cycling",
];

export default function EditProfilePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<{ question: string; answer: string }[]>([]);
  const [ageRangeMin, setAgeRangeMin] = useState(18);
  const [ageRangeMax, setAgeRangeMax] = useState(50);
  const [maxDistance, setMaxDistance] = useState(50);
  const [photos, setPhotos] = useState<string[]>([]);

  // Load profile data
  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          const profile = data as Profile;
          setDisplayName(profile.display_name);
          setBio(profile.bio || "");
          setInterests(profile.interests || []);
          setPrompts(
            (profile.prompts || []).map((p: PromptAnswer) => ({
              question: p.question,
              answer: p.answer,
            }))
          );
          setAgeRangeMin(profile.age_range_min);
          setAgeRangeMax(profile.age_range_max);
          setMaxDistance(profile.max_distance_km);
          setPhotos(profile.photos || []);
        }
      } catch {
        // Keep defaults
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName,
          bio: bio || null,
          interests,
          prompts: prompts
            .filter((p) => p.answer)
            .map((p, i) => ({
              prompt_id: `prompt_${i}`,
              question: p.question,
              answer: p.answer,
            })),
          age_range_min: ageRangeMin,
          age_range_max: ageRangeMax,
          max_distance_km: maxDistance,
          photos,
        }),
      });

      if (res.ok) {
        router.back();
      }
    } catch {
      // Handle error
    } finally {
      setSaving(false);
    }
  };

  const allPrompts = [
    ...CREATIVE_PROMPTS.personality,
    ...CREATIVE_PROMPTS.values,
    ...CREATIVE_PROMPTS.flags,
    ...CREATIVE_PROMPTS.fun,
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0F14] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#FF3B5C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0F14]">
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0E0F14]/90 backdrop-blur-xl">
        <button onClick={() => router.back()} className="text-white/60 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-white">Editar Perfil</h1>
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? (
            "A guardar..."
          ) : (
            <>
              <Save className="h-3.5 w-3.5 mr-1" />
              Guardar
            </>
          )}
        </Button>
      </div>

      <div className="mx-auto max-w-md px-4 py-6 space-y-8">
        {/* Photos */}
        <section>
          <h3 className="text-sm font-medium text-white/60 mb-3">Fotos</h3>
          <PhotoUpload
            photos={photos}
            onPhotosChange={setPhotos}
          />
        </section>

        {/* Display name */}
        <section>
          <label className="text-sm font-medium text-white/60 mb-2 block">Nome</label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="O teu nome"
            maxLength={30}
          />
        </section>

        {/* Bio */}
        <section>
          <label className="text-sm font-medium text-white/60 mb-2 block">
            Bio <span className="text-white/30">(opcional, máx. 300 caracteres)</span>
          </label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Fala sobre ti..."
            maxLength={300}
            rows={3}
          />
          <p className="text-xs text-white/30 mt-1 text-right">{bio.length}/300</p>
        </section>

        {/* Voice note */}
        <section>
          <h3 className="text-sm font-medium text-white/60 mb-3">Nota de Voz</h3>
          <button className="w-full p-4 rounded-xl border border-white/10 bg-white/5 flex items-center gap-3 hover:bg-white/10 transition-colors">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#FF3B5C] to-[#FF5E9C] flex items-center justify-center shadow-lg shadow-[#FF3B5C]/20">
              <Mic className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-white font-medium">Gravar nota de voz</p>
              <p className="text-xs text-white/40">15-30 seg. Deixa os matches ouvirem a tua voz.</p>
            </div>
          </button>
        </section>

        {/* Prompts */}
        <section>
          <h3 className="text-sm font-medium text-white/60 mb-3">
            Prompts
            <span className="text-white/30 ml-1">(responde a pelo menos 2)</span>
          </h3>
          <div className="space-y-3">
            {prompts.map((prompt, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-xs text-[#FF3B5C] font-medium flex-1">{prompt.question}</p>
                    <button
                      onClick={() => setPrompts(prompts.filter((_, idx) => idx !== i))}
                      className="text-white/30 hover:text-white/50 ml-2"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <Textarea
                    value={prompt.answer}
                    onChange={(e) => {
                      const newPrompts = [...prompts];
                      newPrompts[i] = { ...newPrompts[i], answer: e.target.value };
                      setPrompts(newPrompts);
                    }}
                    placeholder="A tua resposta..."
                    rows={2}
                  />
                </CardContent>
              </Card>
            ))}

            {prompts.length < 5 && (
              <div>
                <p className="text-xs text-white/40 mb-2">Adicionar prompt:</p>
                <div className="flex flex-wrap gap-1.5">
                  {allPrompts
                    .filter((p) => !prompts.some((existing) => existing.question === p))
                    .slice(0, 6)
                    .map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => setPrompts([...prompts, { question: prompt, answer: "" }])}
                        className="text-xs rounded-full px-3 py-1.5 border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 transition-colors flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        {prompt.length > 30 ? prompt.slice(0, 30) + "..." : prompt}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Interests */}
        <section>
          <h3 className="text-sm font-medium text-white/60 mb-3">
            Interesses
            <span className="text-white/30 ml-1">({interests.length} selecionado(s))</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {ALL_INTERESTS.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                  interests.includes(interest)
                    ? "bg-gradient-to-r from-[#FF3B5C] to-[#FF5E9C] text-white shadow-sm"
                    : "bg-white/5 text-white/50 hover:bg-white/10 border border-white/10"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h3 className="text-sm font-medium text-white/60 mb-3">Preferências de Descoberta</h3>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-2 block">
                  Faixa etária: {ageRangeMin} - {ageRangeMax}
                </label>
                <div className="flex gap-3 items-center">
                  <Input
                    type="number"
                    min={18}
                    max={99}
                    value={ageRangeMin}
                    onChange={(e) => setAgeRangeMin(parseInt(e.target.value) || 18)}
                    className="w-20"
                  />
                  <span className="text-white/30">a</span>
                  <Input
                    type="number"
                    min={18}
                    max={99}
                    value={ageRangeMax}
                    onChange={(e) => setAgeRangeMax(parseInt(e.target.value) || 50)}
                    className="w-20"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-2 block">
                  Distância máxima: {maxDistance}km
                </label>
                <input
                  type="range"
                  min={5}
                  max={500}
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full accent-[#FF3B5C]"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Save button (bottom) */}
        <Button className="w-full" size="lg" onClick={handleSave} disabled={saving}>
          {saving ? "A guardar alterações..." : "Guardar Alterações"}
        </Button>
      </div>
    </div>
  );
}
