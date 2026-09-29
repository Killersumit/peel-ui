"use client";

import * as React from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import {
  CATEGORIES,
  getComponentsByCategory,
  REGISTRY_COMPONENTS,
} from "@/components/registry/registry-data";
import { CategorySection } from "@/components/registry/category-section";

export default function ComponentsDirectoryPage() {
  return (
    <div className="relative min-h-screen bg-[#000000] text-[#f5f5f7] flex flex-col selection:bg-lime-400/15 selection:text-white">
      {/* Floating Navigation Header */}
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-36 pb-20 relative z-10">
        {/* Directory Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#0c0c0e] px-3 py-1 font-mono text-[11px] text-lime-400 tracking-wider uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
            <span>TACTILE REGISTRY [{REGISTRY_COMPONENTS.length}]</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.08]">
            Tactile UI Primitives.
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-3 max-w-2xl leading-relaxed">
            Engineered micro-interactions, spring mechanics, and physics-driven
            inputs. Each component is self-contained and copy-paste ready with
            shadcn CLI.
          </p>
        </div>

        {/* Category Sections (Actions [2], Inputs [2], Security [1]) */}
        {CATEGORIES.map((category) => {
          const components = getComponentsByCategory(category);
          return (
            <CategorySection
              key={category}
              category={category}
              components={components}
            />
          );
        })}
      </main>

      {/* Shared Machined Baseplate Footer Dock (same as page.tsx) */}
      <Footer />
    </div>
  );
}
