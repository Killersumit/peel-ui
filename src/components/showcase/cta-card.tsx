"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function CtaCard() {
  return (
    <Link
      href="https://github.com/killersumit/peel-ui"
      target="_blank"
      rel="noreferrer"
      className="rounded-3xl bg-[#0c0e12] border border-zinc-800 p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-zinc-700 transition-all min-h-[260px]"
    >
      {/* Faint Dual Ambient Glow in Corner */}
      <div
        aria-hidden="true"
        className="absolute -bottom-16 -right-16 w-52 h-52 pointer-events-none"
      >
        <div className="absolute inset-0 rounded-full bg-[#84ff00]/10 blur-3xl" />
        <div className="absolute top-6 left-6 w-32 h-32 rounded-full bg-[#ff553e]/8 blur-3xl" />
      </div>

      {/* Top Left: Arrow in Acid Lime Badge */}
      <div className="flex items-center justify-start z-10">
        <div className="bg-[#84ff00] text-black w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform">
          <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
        </div>
      </div>

      {/* Bottom: Headline & Subtext */}
      <div className="z-10 mt-6">
        <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-[#84ff00] transition-colors leading-tight">
          Explore all 12+ components
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Zero bloat. Pure Motion and Tailwind primitives.
        </p>
      </div>
    </Link>
  );
}
