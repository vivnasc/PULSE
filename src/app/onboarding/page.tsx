"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowRight, ArrowLeft, Mic, MapPin,
  Heart, Sparkles,
} from "lucide-react";
import { CREATIVE_PROMPTS } from "@/lib/constants";
import { PhotoUpload } from "@/components/ui/photo-upload";

type Step = "gender" | "preference" | "photos" | "prompts" | "voice" | "location" | "interests" | "complete";

const STEPS: Step[] = ["gender", "preference", "photos", "prompts", "voice", "location", "interests", "complete"];

const GENDER_OPTIONS = [
  { value: "male", label: "Homem", emoji: "👨" },
  { value: "female", label: "Mulher", emoji: "👩" },
  { value: "non_binary", label: "Não-binário", emoji: "🧑" },
  { value: "other", label: "Outro", emoji: "✨" },
];

const INTEREST_OPTIONS = [
  "Photography", "Travel", "Music", "Cooking", "Fitness", "Reading",
  "Gaming", "Art", "Dance", "Hiking", "Yoga", "Movies",
  "Coffee", "Wine", "Surfing", "Meditation", "Fashion", "Tech",
  "Animals", "Volunteering", "Writing", "Comedy", "Podcasts", "Cycling",
];

const RELATIONSHIP_TYPES = [
  { value: "serious", label: "Relação séria", emoji: "💍" },
  { value: "casual", label: "Algo casual", emoji: "✌️" },
  { value: "friendship", label: "Novos amigos", emoji: "🤝" },
  { value: "open", label: "Aberto a tudo", emoji: "🌈" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gender: "" as string,
    gender_preference: [] as string[],
    relationship_type: "" as string,
    photos: [] as string[],
    prompts: [] as { prompt_id: string; question: string; answer: string }[],
    interests: [] as string[],
    location_city: "",
    location_country: "",
    age_range_min: 18,
    age_range_max: 50,
    max_distance_km: 50,
  });

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const canProceed = () => {
    switch (step) {
      case "gender": return !!formData.gender;
      case "preference": return formData.gender_preference.length > 0;
      case "photos": return true; // Photos optional during onboarding
      case "prompts": return formData.prompts.length >= 1;
      case "voice": return true; // Voice optional initially
      case "location": return !!formData.location_city;
      case "interests": return formData.interests.length >= 3;
      case "complete": return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email!,
        display_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "User",
        birth_date: user.user_metadata?.birth_date || "2000-01-01",
        gender: formData.gender as "male" | "female" | "non_binary" | "other",
        gender_preference: formData.gender_preference as ("male" | "female" | "non_binary" | "other")[],
        relationship_type: formData.relationship_type as "serious" | "casual" | "friendship" | "open",
        photos: formData.photos,
        prompts: formData.prompts,
        interests: formData.interests,
        location_city: formData.location_city,
        location_country: formData.location_country,
        age_range_min: formData.age_range_min,
        age_range_max: formData.age_range_max,
        max_distance_km: formData.max_distance_km,
        onboarding_completed: true,
        languages: ["pt", "en"],
        is_verified: false,
        verification_level: "none",
        is_premium: false,
        subscription_tier: "free",
        settings: {
          show_distance: true,
          show_age: true,
          incognito_mode: false,
          notifications_enabled: true,
          notification_matches: true,
          notification_messages: true,
          notification_likes: true,
          language: "pt",
          theme: "dark",
          data_saver: false,
        },
      });

      router.push("/discover");
    }
    setLoading(false);
  };

  const toggleArrayItem = (arr: string[], item: string) => {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  };

  const selectedPrompt = CREATIVE_PROMPTS.personality[0]; // Simplified for onboarding

  return (
    <div className="min-h-screen bg-[#0E0F14] flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 h-64 w-64 rounded-full bg-[#FF3B5C]/10 blur-[100px]" />
        <div className="absolute bottom-1/3 -right-32 h-64 w-64 rounded-full bg-[#FF5E9C]/10 blur-[100px]" />
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FF3B5C] via-[#FF5E9C] to-[#FF5E9C]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Gender */}
              {step === "gender" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Eu sou...</h2>
                  <p className="text-white/50 mb-6">Como te identificas?</p>
                  <div className="grid grid-cols-2 gap-3">
                    {GENDER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setFormData({ ...formData, gender: opt.value })}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          formData.gender === opt.value
                            ? "border-[#FF3B5C]/50 bg-[#FF3B5C]/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-2xl">{opt.emoji}</span>
                        <p className="text-white mt-2 font-medium">{opt.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Preference */}
              {step === "preference" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Tenho interesse em...</h2>
                  <p className="text-white/50 mb-4">Seleciona todos os que se aplicam</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {GENDER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            gender_preference: toggleArrayItem(formData.gender_preference, opt.value),
                          })
                        }
                        className={`p-4 rounded-xl border text-left transition-all ${
                          formData.gender_preference.includes(opt.value)
                            ? "border-[#FF3B5C]/50 bg-[#FF3B5C]/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-2xl">{opt.emoji}</span>
                        <p className="text-white mt-2 font-medium">{opt.label}</p>
                      </button>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-3">À procura de...</h3>
                  <div className="space-y-2">
                    {RELATIONSHIP_TYPES.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setFormData({ ...formData, relationship_type: type.value })}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                          formData.relationship_type === type.value
                            ? "border-[#FF3B5C]/50 bg-[#FF3B5C]/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <span>{type.emoji}</span>
                        <span className="text-white">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Photos */}
              {step === "photos" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Adiciona fotos</h2>
                  <p className="text-white/50 mb-6">Mostra o teu melhor. Podes adicionar mais depois.</p>
                  <PhotoUpload
                    photos={formData.photos}
                    onPhotosChange={(newPhotos) =>
                      setFormData({ ...formData, photos: newPhotos })
                    }
                  />
                </div>
              )}

              {/* Prompts */}
              {step === "prompts" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Expressa-te</h2>
                  <p className="text-white/50 mb-6">Responde a pelo menos 1 prompt criativo</p>
                  <div className="space-y-4">
                    {[
                      CREATIVE_PROMPTS.personality[0],
                      CREATIVE_PROMPTS.values[0],
                      CREATIVE_PROMPTS.fun[0],
                    ].map((prompt, i) => (
                      <div key={i}>
                        <label className="text-sm text-[#FF3B5C] font-medium">{prompt}</label>
                        <Textarea
                          placeholder="A tua resposta..."
                          className="mt-1"
                          rows={2}
                          onChange={(e) => {
                            const newPrompts = [...formData.prompts];
                            const existing = newPrompts.findIndex((p) => p.prompt_id === `onboarding_${i}`);
                            const promptObj = {
                              prompt_id: `onboarding_${i}`,
                              question: prompt,
                              answer: e.target.value,
                            };
                            if (existing >= 0) {
                              newPrompts[existing] = promptObj;
                            } else if (e.target.value) {
                              newPrompts.push(promptObj);
                            }
                            setFormData({ ...formData, prompts: newPrompts.filter((p) => p.answer) });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Voice */}
              {step === "voice" && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Grava uma nota de voz</h2>
                  <p className="text-white/50 mb-8">Deixa os teus matches ouvirem a tua voz. 15-30 segundos.</p>
                  <button className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#FF3B5C] to-[#FF5E9C] shadow-lg shadow-[#FF3B5C]/25 hover:shadow-xl transition-all active:scale-95">
                    <Mic className="h-10 w-10 text-white" />
                  </button>
                  <p className="mt-4 text-sm text-white/40">Toca para gravar</p>
                  <p className="mt-2 text-xs text-white/30">
                    Suggested: &quot;Descreve o teu domingo ideal&quot;
                  </p>
                </div>
              )}

              {/* Location */}
              {step === "location" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Onde estás?</h2>
                  <p className="text-white/50 mb-6">Ajuda-nos a encontrar pessoas perto de ti.</p>
                  <div className="space-y-4">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input
                        placeholder="Cidade"
                        className="pl-10"
                        value={formData.location_city}
                        onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
                      />
                    </div>
                    <Input
                      placeholder="País"
                      value={formData.location_country}
                      onChange={(e) => setFormData({ ...formData, location_country: e.target.value })}
                    />

                    <div>
                      <label className="text-sm text-white/60 mb-2 block">
                        Faixa etária: {formData.age_range_min} - {formData.age_range_max}
                      </label>
                      <div className="flex gap-3">
                        <Input
                          type="number"
                          min={18}
                          max={99}
                          value={formData.age_range_min}
                          onChange={(e) => setFormData({ ...formData, age_range_min: parseInt(e.target.value) || 18 })}
                          className="w-24"
                        />
                        <span className="text-white/30 self-center">to</span>
                        <Input
                          type="number"
                          min={18}
                          max={99}
                          value={formData.age_range_max}
                          onChange={(e) => setFormData({ ...formData, age_range_max: parseInt(e.target.value) || 50 })}
                          className="w-24"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-white/60 mb-2 block">
                        Distância máxima: {formData.max_distance_km}km
                      </label>
                      <input
                        type="range"
                        min={5}
                        max={500}
                        value={formData.max_distance_km}
                        onChange={(e) => setFormData({ ...formData, max_distance_km: parseInt(e.target.value) })}
                        className="w-full accent-[#FF3B5C]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Interests */}
              {step === "interests" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Os teus interesses</h2>
                  <p className="text-white/50 mb-6">
                    Escolhe pelo menos 3. Isto ajuda a IA a encontrar melhores matches.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map((interest) => (
                      <button
                        key={interest}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            interests: toggleArrayItem(formData.interests, interest),
                          })
                        }
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                          formData.interests.includes(interest)
                            ? "bg-gradient-to-r from-[#FF3B5C] to-[#FF5E9C] text-white"
                            : "bg-white/5 text-white/50 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-white/30 mt-4">
                    {formData.interests.length}/3 mínimo selecionado
                  </p>
                </div>
              )}

              {/* Complete */}
              {step === "complete" && (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#FF3B5C] via-[#FF5E9C] to-[#FF5E9C]"
                  >
                    <Sparkles className="h-10 w-10 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">Estás pronto!</h2>
                  <p className="text-white/50 mb-8">
                    O teu matchmaker IA está pronto. Vamos encontrar a tua pessoa.
                  </p>
                  <Button size="xl" onClick={handleComplete} disabled={loading}>
                    {loading ? "A preparar..." : "Começar a Descobrir"}
                    <Heart className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      {step !== "complete" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0E0F14]/80 backdrop-blur-xl border-t border-white/5">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            <span className="text-xs text-white/30">
              {currentStep + 1} / {STEPS.length}
            </span>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === STEPS.length - 2 ? "Concluir" : "Seguinte"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
