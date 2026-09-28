"use client";

import { Navbar } from "@/components/navigation/navbar";
import { Hero } from "@/components/showcase/hero";
import { BentoGrid } from "@/components/showcase/bento-grid";
import { Footer } from "@/components/navigation/footer";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#08090a] text-[#f5f5f7] flex flex-col selection:bg-[#84ff00]/15 selection:text-[#f5f5f7]">
      {/* Floating Navigation */}
      <Navbar />

      <main className="flex-1 flex flex-col items-center">
        <Hero />
        <BentoGrid />
      </main>

      {/* Machined Baseplate Footer Dock */}
      <Footer />
    </div>
  );
}
