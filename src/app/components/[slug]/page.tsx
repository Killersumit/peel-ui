"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { getComponentBySlug } from "@/components/registry/registry-data";

interface ComponentDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ComponentDetailPage({
  params,
}: ComponentDetailPageProps) {
  const resolvedParams = React.use(params);
  const comp = getComponentBySlug(resolvedParams.slug);

  if (!comp) {
    notFound();
  }

  const InteractiveComponent = comp.component;

  return (
    <div className="relative min-h-screen bg-[#000000] text-[#f5f5f7] flex flex-col selection:bg-[#84ff00]/15 selection:text-white">
      {/* Floating Navigation Header */}
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-36 pb-24 relative z-10">
        {/* Navigation Breadcrumb */}
        <Link
          href="/components"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-[#84ff00] transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>All components</span>
        </Link>

        {/* Title & Technical Metadata Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs text-[#84ff00] uppercase tracking-wider mb-2">
            <span>{comp.category}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400">Primitive</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {comp.name}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-xl leading-relaxed">
            {comp.description}
          </p>
        </div>

        {/* Live Interactive Playground Well */}
        <div className="w-full rounded-2xl bg-[#0c0c0e] border border-white/[0.08] p-6 sm:p-12 mb-8 relative overflow-hidden shadow-2xl flex items-center justify-center min-h-[380px]">
          {/* Subtle Grid */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.10] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"
          />
          <div className="relative z-10 w-full flex items-center justify-center">
            <InteractiveComponent />
          </div>
        </div>

        {/* Installation CLI Command Block */}
        <div className="w-full rounded-xl bg-[#0c0c0e] border border-white/[0.08] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden truncate font-mono text-xs text-zinc-300">
            <Terminal size={14} className="text-[#84ff00] shrink-0" />
            <span className="truncate select-all">{comp.cliCommand}</span>
          </div>
          <span className="text-xs text-zinc-500 self-end sm:self-center">
            shadcn CLI
          </span>
        </div>
      </main>

      {/* Atmospheric Underglow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 -z-0 opacity-40 blur-[120px] bg-gradient-to-t from-[#84ff00]/10 via-transparent to-transparent"
      />

      {/* Machined Baseplate Footer Dock */}
      <Footer />
    </div>
  );
}
