import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PULSE — Smart Dating. Real Chemistry.",
  description:
    "Not fast dating. Not slow dating. Smart dating. AI that learns you, finds your person, and coaches you to connection. Powered by Intelligence.",
  keywords: [
    "dating app",
    "AI dating",
    "smart dating",
    "matchmaking",
    "AI matchmaker",
    "dating",
    "relationships",
    "PULSE",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PULSE",
  },
  openGraph: {
    title: "PULSE — Smart Dating. Real Chemistry.",
    description:
      "AI-powered dating that learns you, finds your person, and coaches you to connection.",
    type: "website",
    siteName: "PULSE",
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
      </body>
    </html>
  );
}
