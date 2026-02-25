"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Heart, AlertTriangle, Sparkles, Calendar } from "lucide-react";

interface CompatibilityData {
  overallScore: number;
  secondDateProbability: number;
  longTermPotential: "high" | "medium" | "low";
  sixMonthForecast: number;
  bestFor: string;
  strengths: string[];
  challenges: string[];
  sharedValues: string[];
}

const DEFAULT_DATA: CompatibilityData = {
  overallScore: 87,
  secondDateProbability: 89,
  longTermPotential: "high",
  sixMonthForecast: 76,
  bestFor: "Serious relationship",
  strengths: [
    "Strong communication compatibility",
    "Aligned life goals",
    "Similar sense of humor",
    "Complementary personalities",
  ],
  challenges: [
    "Different approaches to conflict resolution",
    "Varying social energy levels",
  ],
  sharedValues: ["Authenticity", "Adventure", "Family", "Growth"],
};

export function CompatibilityCard({ data = DEFAULT_DATA }: { data?: CompatibilityData }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-rose-400" />
            AI Compatibility
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Predictive
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall score ring */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center">
            <svg className="h-24 w-24 -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-white/10"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                className="stroke-emerald-400"
                strokeDasharray={`${2 * Math.PI * 40}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - data.overallScore / 100) }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <span className={`absolute text-2xl font-bold ${getScoreColor(data.overallScore)}`}>
              {data.overallScore}%
            </span>
          </div>
          <p className="text-sm text-white/50 mt-1">Overall Compatibility</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/5 p-3 text-center">
            <Calendar className="h-4 w-4 text-rose-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{data.secondDateProbability}%</p>
            <p className="text-[10px] text-white/40">2nd date probability</p>
          </div>
          <div className="rounded-xl bg-white/5 p-3 text-center">
            <TrendingUp className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{data.sixMonthForecast}%</p>
            <p className="text-[10px] text-white/40">6-month forecast</p>
          </div>
        </div>

        {/* Best for */}
        <div className="rounded-xl bg-rose-500/5 border border-rose-500/10 p-3">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-400" />
            <span className="text-sm text-white">
              Best for: <span className="font-medium">{data.bestFor}</span>
            </span>
          </div>
        </div>

        {/* Strengths */}
        <div>
          <h4 className="text-xs font-medium text-white/50 mb-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            Strengths
          </h4>
          <div className="space-y-1.5">
            {data.strengths.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div>
          <h4 className="text-xs font-medium text-white/50 mb-2 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            Potential Challenges
          </h4>
          <div className="space-y-1.5">
            {data.challenges.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* Shared values */}
        <div>
          <h4 className="text-xs font-medium text-white/50 mb-2">Shared Values</h4>
          <div className="flex flex-wrap gap-1.5">
            {data.sharedValues.map((v) => (
              <Badge key={v} variant="secondary" className="text-xs">
                {v}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
