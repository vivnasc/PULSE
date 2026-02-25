"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Bell,
  Globe,
  Shield,
  Eye,
  Moon,
  LogOut,
  Trash2,
  ChevronRight,
  Heart,
  Crown,
  Smartphone,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { LucideIcon } from "lucide-react";

interface SettingItem {
  icon: LucideIcon;
  label: string;
  description?: string;
  href?: string;
  action?: () => void;
  toggle?: boolean;
  value?: boolean;
  badge?: string;
  destructive?: boolean;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const sections: SettingSection[] = [
    {
      title: "Conta",
      items: [
        {
          icon: Crown,
          label: "Subscrição",
          description: "Spark (Grátis)",
          href: "#",
          badge: "Upgrade",
        },
        {
          icon: Shield,
          label: "Verificação",
          description: "Verificado por selfie",
          href: "#",
        },
        { icon: Heart, label: "Preferências de relação", href: "#" },
      ],
    },
    {
      title: "Definições da App",
      items: [
        {
          icon: Bell,
          label: "Notificações",
          toggle: true,
          value: notifications,
          action: () => setNotifications(!notifications),
        },
        {
          icon: Moon,
          label: "Modo Escuro",
          toggle: true,
          value: darkMode,
          action: () => setDarkMode(!darkMode),
        },
        {
          icon: Smartphone,
          label: "Economia de Dados",
          toggle: true,
          value: dataSaver,
          action: () => setDataSaver(!dataSaver),
        },
        { icon: Globe, label: "Idioma", description: "Português" },
        {
          icon: Eye,
          label: "Privacidade",
          description: "Visível para todos",
          href: "#",
        },
      ],
    },
    {
      title: "Suporte",
      items: [
        { icon: HelpCircle, label: "Ajuda e FAQ", href: "#" },
        { icon: Shield, label: "Dicas de segurança", href: "#" },
        { icon: Globe, label: "Diretrizes da comunidade", href: "#" },
      ],
    },
    {
      title: "Zona de Perigo",
      items: [
        { icon: LogOut, label: "Terminar sessão", action: handleLogout },
        { icon: Trash2, label: "Apagar conta", href: "#", destructive: true },
      ],
    },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-md px-4 pt-4 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">Definições</h1>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2 px-1">
                {section.title}
              </h3>
              <Card>
                <CardContent className="p-0 divide-y divide-white/5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const inner = (
                      <div
                        className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/5 ${
                          item.destructive ? "text-red-400" : ""
                        }`}
                        onClick={
                          item.action && !item.toggle
                            ? item.action
                            : undefined
                        }
                        role={item.action ? "button" : undefined}
                      >
                        <Icon
                          className={`h-4 w-4 ${
                            item.destructive
                              ? "text-red-400"
                              : "text-white/40"
                          }`}
                        />
                        <div className="flex-1">
                          <p
                            className={`text-sm ${
                              item.destructive
                                ? "text-red-400"
                                : "text-white"
                            }`}
                          >
                            {item.label}
                          </p>
                          {item.description && (
                            <p className="text-xs text-white/40">
                              {item.description}
                            </p>
                          )}
                        </div>
                        {item.toggle ? (
                          <button
                            onClick={item.action}
                            className={`relative h-6 w-11 rounded-full transition-colors ${
                              item.value
                                ? "bg-[#FF3B5C]"
                                : "bg-white/20"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                item.value
                                  ? "translate-x-5"
                                  : "translate-x-0.5"
                              }`}
                            />
                          </button>
                        ) : item.badge ? (
                          <span className="text-xs font-medium text-[#FF3B5C] bg-[#FF3B5C]/10 rounded-full px-2 py-0.5">
                            {item.badge}
                          </span>
                        ) : !item.destructive && !item.action ? (
                          <ChevronRight className="h-4 w-4 text-white/20" />
                        ) : null}
                      </div>
                    );

                    if (item.href) {
                      return (
                        <Link key={item.label} href={item.href}>
                          {inner}
                        </Link>
                      );
                    }
                    return <div key={item.label}>{inner}</div>;
                  })}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-white/20 mt-8">
          PULSE v0.1.0 (MVP)
        </p>
      </div>
    </AppLayout>
  );
}
