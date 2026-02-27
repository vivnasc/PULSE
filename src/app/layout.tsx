import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegister } from "@/components/pwa/sw-register";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PULSE — Dating Inteligente com IA",
    template: "%s | PULSE",
  },
  description:
    "Não é mais um app de dating. É uma inteligência que te conhece, encontra quem combina contigo de verdade, e te ajuda a criar conexões reais. Sem ghosting. Sem superficialidade.",
  keywords: [
    "dating app",
    "app de encontros",
    "AI dating",
    "dating inteligente",
    "matchmaking IA",
    "namoro online",
    "PULSE",
    "encontros Moçambique",
    "dating Africa",
    "app namoro",
    "inteligência artificial",
    "conexões reais",
  ],
  authors: [{ name: "PULSE" }],
  creator: "PULSE",
  publisher: "PULSE",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-384x384.png", sizes: "384x384", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PULSE",
  },
  openGraph: {
    title: "PULSE — Dating Inteligente com IA",
    description:
      "A IA que sente contigo. Encontra quem combina contigo de verdade, com matchmaking inteligente, coach de encontros, e conversas que importam.",
    type: "website",
    siteName: "PULSE",
    locale: "pt_PT",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PULSE — Dating Inteligente com IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PULSE — Dating Inteligente com IA",
    description:
      "Não é mais um app de dating. É uma inteligência que te conhece e te ajuda a criar conexões reais.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0E0F14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="dark">
      <body
        className="antialiased"
        style={{
          background: "#0E0F14",
          color: "#f0f0f5",
          fontFamily:
            "Inter, 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
