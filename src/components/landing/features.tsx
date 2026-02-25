"use client";

import { motion } from "framer-motion";
import {
  Bot, Mic, Video, MessageCircle, Brain, Globe,
  Target, Lightbulb, GraduationCap, Sparkles, Heart, Shield
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Avatar",
    description: "Chat with someone's AI twin before matching. Test chemistry without wasting anyone's time.",
    gradient: "from-violet-500 to-purple-500",
    tag: "Revolutionary",
  },
  {
    icon: Mic,
    title: "Voice Cloning",
    description: "Each match gets a unique voice message in YOUR voice, personalized to their interests.",
    gradient: "from-[#FF3B5C] to-[#FF5E9C]",
    tag: "Unique",
  },
  {
    icon: Brain,
    title: "Emotion AI",
    description: "Real-time emotional mapping of your conversations. See chemistry scores and connection peaks.",
    gradient: "from-[#FF5E9C] to-amber-500",
    tag: "Smart",
  },
  {
    icon: MessageCircle,
    title: "AI Date Coach",
    description: "24/7 wingman analyzing your chats in real-time with subtle, helpful suggestions.",
    gradient: "from-emerald-500 to-teal-500",
    tag: "Helpful",
  },
  {
    icon: Target,
    title: "Predictive Compatibility",
    description: "AI forecasts your relationship potential: from 2nd date probability to 6-month outlook.",
    gradient: "from-blue-500 to-cyan-500",
    tag: "Predictive",
  },
  {
    icon: Globe,
    title: "Seamless Translation",
    description: "Date across languages. 150+ languages with tone, humor, and personality preserved.",
    gradient: "from-[#FF5E9C] to-[#FF3B5C]",
    tag: "Global",
  },
  {
    icon: Lightbulb,
    title: "Smart Date Ideas",
    description: "AI generates unique date itineraries based on both profiles, budget, weather, and location.",
    gradient: "from-amber-500 to-yellow-500",
    tag: "Creative",
  },
  {
    icon: GraduationCap,
    title: "Post-Date Debrief",
    description: "AI therapist after every date. Honest insights, red flag detection, compatibility updates.",
    gradient: "from-indigo-500 to-violet-500",
    tag: "Insightful",
  },
  {
    icon: Video,
    title: "Video Analysis",
    description: "AI reads body language, microexpressions, and energy from video prompts. Zero catfishing.",
    gradient: "from-teal-500 to-emerald-500",
    tag: "Secure",
  },
  {
    icon: Heart,
    title: "AI Matchmaker",
    description: "Not a passive algorithm. An active agent that learns you deeply and hunts for your person.",
    gradient: "from-[#FF3B5C] to-red-500",
    tag: "Personal",
  },
  {
    icon: Sparkles,
    title: "Dream Date Simulator",
    description: "Practice before the real thing. AI simulates your date based on their profile.",
    gradient: "from-purple-500 to-[#FF5E9C]",
    tag: "Premium",
  },
  {
    icon: Shield,
    title: "Multi-Layer Verification",
    description: "Selfie liveness, facial recognition, voice verification, and behavioral analysis. 99.9% real profiles.",
    gradient: "from-sky-500 to-blue-500",
    tag: "Safe",
  },
];

export function Features() {
  return (
    <section className="relative py-24 px-4" id="features">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white sm:text-5xl">
            Features that{" "}
            <span className="gradient-text">
              change everything
            </span>
          </h2>
          <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
            12 AI-powered innovations that no other dating app has. This is not an upgrade — it&apos;s a new category.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                      {feature.tag}
                    </span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
