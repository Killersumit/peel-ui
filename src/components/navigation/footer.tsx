"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full border-t border-zinc-900 bg-[#08090a] py-10 relative select-none">
      <div className="max-w-4xl mx-auto px-6 flex flex-col gap-6">
        {/* ── Row 1: Consolidated Action Bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Brand Cluster */}
          <div className="inline-flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <div className="relative w-5 h-5 rounded overflow-hidden flex items-center justify-center bg-zinc-900 border border-zinc-800 shrink-0">
                <Image
                  src="/peeluiicon.svg"
                  alt="Peel UI"
                  width={20}
                  height={20}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-baseline">
                <span className="text-white font-semibold text-sm tracking-tight">
                  Peel
                </span>
                <span className="text-[#84ff00] font-semibold text-sm tracking-tight ml-0.5">
                  UI
                </span>
              </div>
            </Link>

            {/* Subtle Vertical Divider */}
            <div className="w-px h-3.5 bg-zinc-800" aria-hidden="true" />

            {/* Status Indicator */}
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-[#84ff00]" />
              <span>v0.1.0</span>
            </span>
          </div>

          {/* Right: Links Cluster */}
          <div className="flex items-center gap-3">
            {/* Creator Pill */}
            <a
              href="https://github.com/killersumit"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800/80 bg-zinc-900/30 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700/60 shrink-0">
                <Image
                  src="/avatar.png"
                  alt="Creator"
                  width={24}
                  height={24}
                  className="h-5 w-5 rounded-full object-cover"
                />
              </div>
              <span>Crafted by Killersumit</span>
              <ArrowUpRight className="size-3 text-zinc-600 shrink-0" />
            </a>

            {/* GitHub Link */}
            <a
              href="https://github.com/killersumit/peel-ui"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-800/80 bg-zinc-900/30 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
            >
              <span>GitHub</span>
              <ArrowUpRight className="size-3 text-zinc-600 shrink-0" />
            </a>
          </div>
        </div>

        <nav
          aria-label="Legal"
          className="flex items-center gap-4 border-t border-zinc-900 pt-4 font-mono text-[10px] text-zinc-400"
        >
          <Link href="/privacy" className="transition-colors hover:text-white">
            Privacy
          </Link>
          <a
            href="https://github.com/Killersumit/peel-ui/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-white"
          >
            License
          </a>
        </nav>

        {/* ── Row 2: Sub-Floor Metadata ── */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-900 font-mono text-[10px] text-zinc-400">
          <span>Peel UI · Tactile Primitives</span>
          <span>MIT License · 2026</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 rounded px-1"
          >
            [ ↑ TOP ]
          </button>
        </div>
      </div>
    </footer>
  );
}
