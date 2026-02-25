"use client";

import { motion } from "framer-motion";
import {
  Bot, Mic, Video, MessageCircle, Brain, Globe,
  Target, Lightbulb, GraduationCap, Sparkles, Heart, Shield
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Avatar IA",
    description: "Conversa com o gémeo digital de alguém antes de dar match. Testa a química sem desperdiçar o tempo de ninguém.",
    gradient: "from-violet-500 to-purple-500",
    tag: "Revolucionário",
  },
  {
    icon: Mic,
    title: "Clonagem de Voz",
    description: "Cada match recebe uma mensagem de voz NA TUA VOZ, personalizada aos interesses deles. Magia pura.",
    gradient: "from-[#FF3B5C] to-[#FF5E9C]",
    tag: "Único",
  },
  {
    icon: Brain,
    title: "IA Emocional",
    description: "Mapeamento emocional em tempo real das tuas conversas. Vê scores de química e picos de conexão.",
    gradient: "from-orange-500 to-amber-500",
    tag: "Inteligente",
  },
  {
    icon: MessageCircle,
    title: "Coach de Encontros",
    description: "Um wingman 24/7 que analisa as tuas conversas em tempo real com sugestões subtis e úteis.",
    gradient: "from-emerald-500 to-teal-500",
    tag: "Útil",
  },
  {
    icon: Target,
    title: "Compatibilidade Preditiva",
    description: "A IA prevê o potencial da relação: probabilidade de 2º encontro até previsão de 6 meses.",
    gradient: "from-blue-500 to-cyan-500",
    tag: "Preditivo",
  },
  {
    icon: Globe,
    title: "Tradução Instantânea",
    description: "Namora sem barreiras linguísticas. 150+ línguas com tom, humor e personalidade preservados.",
    gradient: "from-[#FF5E9C] to-[#FF3B5C]",
    tag: "Global",
  },
  {
    icon: Lightbulb,
    title: "Ideias de Encontro",
    description: "A IA cria roteiros de encontro únicos baseados nos dois perfis, orçamento, clima e localização.",
    gradient: "from-amber-500 to-yellow-500",
    tag: "Criativo",
  },
  {
    icon: GraduationCap,
    title: "Debrief Pós-Encontro",
    description: "Terapeuta IA após cada encontro. Insights honestos, deteção de red flags, atualizações de compatibilidade.",
    gradient: "from-indigo-500 to-violet-500",
    tag: "Revelador",
  },
  {
    icon: Video,
    title: "Análise de Vídeo",
    description: "A IA lê linguagem corporal, microexpressões e energia nos vídeos. Zero catfishing.",
    gradient: "from-teal-500 to-emerald-500",
    tag: "Seguro",
  },
  {
    icon: Heart,
    title: "Matchmaker IA",
    description: "Não é um algoritmo passivo. É um agente ativo que te conhece profundamente e procura a tua pessoa.",
    gradient: "from-[#FF3B5C] to-red-500",
    tag: "Pessoal",
  },
  {
    icon: Sparkles,
    title: "Simulador de Encontros",
    description: "Pratica antes do encontro real. A IA simula o teu date com base no perfil da outra pessoa.",
    gradient: "from-purple-500 to-[#FF5E9C]",
    tag: "Premium",
  },
  {
    icon: Shield,
    title: "Verificação Multi-Camada",
    description: "Selfie ao vivo, reconhecimento facial, verificação de voz e análise comportamental. 99.9% perfis reais.",
    gradient: "from-sky-500 to-blue-500",
    tag: "Seguro",
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
            12 funcionalidades que{" "}
            <span className="gradient-text">
              mudam tudo
            </span>
          </h2>
          <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
            Inovações com IA que nenhum outro app de dating tem. Isto não é um upgrade — é uma nova categoria.
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
