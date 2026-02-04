import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { BlueprintPreview } from "@/components/landing/BlueprintPreview";
import { AntiPitch } from "@/components/landing/AntiPitch";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Hero />
        <BlueprintPreview />
        <AntiPitch />
        <HowItWorks />

        <section className="px-4 py-16 text-center">
          <Link href="/analyze">
            <Button variant="primary" className="text-base px-8 py-3">
              Analyze a Video →
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}