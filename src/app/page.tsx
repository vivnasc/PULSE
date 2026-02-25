import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Manifesto } from "@/components/landing/manifesto";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "#0E0F14" }}>
      <Navbar />
      <Hero />
      <Manifesto />
      <Features />
      <HowItWorks />
      <Pricing />
      <Footer />
    </main>
  );
}
