"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SlideToConfirm } from "@/components/ui/slide-to-confirm";
import { MagneticSplitButton } from "@/components/ui/magnetic-split-button";
import { TactileOtpInput } from "@/components/ui/tactile-otp-input";
import { PrivacyShutter } from "@/components/ui/privacy-shutter";

/* ─────────────────────────────────────────────────────────────
   Bento Grid — High-Craft Skeleton
   Archetype B / Palette 1: Industrial Precision Monolith

   Card anatomy from the RareUI reference:
   ┌─ Dark frame (#161616) ─────────────────────────┐
   │  ┌─ Stage well (light #e8e8e8 or dark #0c0c0c) │
   │  │                                              │
   │  │          [ Component Display ]               │
   │  │                                              │
   │  └──────────────────────────────────────────────│
   │  Label                                     ↗    │
   └─────────────────────────────────────────────────┘
   ───────────────────────────────────────────────── */

function CardFooter({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between pt-4 px-1">
      <span className="text-sm text-zinc-300 group-hover:text-white transition-colors duration-200">
        {label}
      </span>
      <ArrowUpRight className="size-4 text-[#84ff00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
    </div>
  );
}

export function BentoGrid() {
  return (
    <section
      id="components"
      className="relative z-10 max-w-[1380px] mx-auto px-8 pt-32 pb-24 scroll-mt-28"
    >
      {/* ── Section Header ── */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1 font-mono text-[11px] text-zinc-400 tracking-[0.1em] uppercase mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#84ff00]" />
          <span>Component Registry · 2026</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Crafted for Interaction.
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-md mx-auto mt-2 leading-relaxed">
          Tactile primitives and micro-interactions built with Tailwind CSS and
          Motion.
        </p>
      </div>

      {/* ── Asymmetric 3-Column Bento Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* ━━━ CARD 1 — Hero Anchor (2×2, Light Well) ━━━ */}
        <div className="md:col-span-2 md:row-span-2 min-h-[420px] min-w-0 rounded-3xl bg-[#161616] border border-[#252525] p-3 pb-4 flex flex-col group hover:border-zinc-600/50 transition-colors duration-200">
          <div className="flex-1 rounded-2xl bg-[#e8e8e8] flex items-center justify-center p-6 min-h-[360px] overflow-hidden">
            <SlideToConfirm />
          </div>
          <div className="flex items-center justify-between pt-4 px-1">
            <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase group-hover:text-white transition-colors duration-200">
              Slide to Confirm
            </span>
            <ArrowUpRight className="size-4 text-[#84ff00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </div>
        </div>

        {/* ━━━ CARD 2 — Upper Right (1×1, Dark Well) ━━━ */}
        <div className="col-span-1 min-h-[200px] min-w-0 rounded-3xl bg-[#161616] border border-[#252525] p-3 pb-4 flex flex-col group hover:border-neutral-600/50 transition-colors duration-200 relative z-20">
          <div className="flex-1 rounded-2xl bg-[#080808] border border-[#1c1c1c] flex items-center justify-center p-4 min-h-[150px] relative overflow-visible">
            <MagneticSplitButton />
          </div>
          <div className="flex items-center justify-between pt-4 px-1">
            <span className="text-xs font-mono tracking-wider text-neutral-400 uppercase group-hover:text-white transition-colors duration-200">
              Magnetic Split Button
            </span>
            <ArrowUpRight className="size-4 text-[#84ff00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </div>
        </div>

        {/* ━━━ CARD 3 — Center Right (1×1, Dark Well) ━━━ */}
        <div className="col-span-1 min-h-[200px] min-w-0 rounded-3xl bg-[#161616] border border-[#252525] p-3 pb-4 flex flex-col group hover:border-neutral-600/50 transition-colors duration-200 relative">
          <div className="flex-1 rounded-2xl bg-[#080808] border border-[#1c1c1c] flex items-center justify-center p-4 min-h-[150px] relative overflow-hidden">
            <TactileOtpInput />
          </div>
          <div className="flex items-center justify-between pt-4 px-1">
            <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
              Tactile PIN
            </span>
            <ArrowUpRight className="size-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
          </div>
        </div>

        {/* ━━━ CARD 4 — Bottom Left (2-col, Privacy Shutter) ━━━ */}
        <div className="md:col-span-2 min-h-[220px] min-w-0 rounded-3xl bg-[#161616] border border-[#252525] p-3 pb-4 flex flex-col group hover:border-neutral-600/50 transition-colors duration-200 relative">
          <div className="flex-1 rounded-2xl bg-[#080808] border border-[#1c1c1c] flex items-center justify-center p-6 min-h-[170px] relative overflow-hidden">
            <PrivacyShutter />
          </div>
          <div className="flex items-center justify-between pt-4 px-1">
            <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase group-hover:text-white transition-colors duration-200">
              Privacy Shutter
            </span>
            <ArrowUpRight className="size-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
          </div>
        </div>

        {/* ━━━ CARD 5 — Catalog CTA (1-col, Acid Lime) ━━━ */}
        <Link
          href="/components"
          className="col-span-1 min-w-0 rounded-3xl bg-[#84ff00] p-6 flex flex-col justify-between min-h-[210px] group cursor-pointer relative overflow-hidden block"
        >
          {/* Subtle decorative overlay */}
          <div
            aria-hidden="true"
            className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-black/[0.06] pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-black/[0.04] pointer-events-none"
          />

          {/* Arrow */}
          <div>
            <ArrowUpRight
              className="size-6 text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
              strokeWidth={2.5}
            />
          </div>

          {/* Copy */}
          <div className="relative">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-black leading-tight">
              Explore all 12+ primitives
            </h3>
            <p className="text-xs sm:text-sm text-black/60 mt-1 max-w-[28ch]">
              Free and open source. Drop directly into your project.
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
