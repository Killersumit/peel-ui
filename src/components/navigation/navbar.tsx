"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const FAST_EASE = [0.16, 1, 0.3, 1] as const;

export function Navbar() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 0, y: -6, filter: "blur(4px)" }
      }
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.35, ease: FAST_EASE }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-2xl px-0 pointer-events-none"
    >
      <nav
        aria-label="Primary Navigation"
        className="pointer-events-auto rounded-full border border-zinc-800/80 bg-zinc-950/75 backdrop-blur-md w-full px-4 py-2 sm:px-5 sm:py-2.5 shadow-xl flex items-center justify-between gap-3 sm:gap-6"
      >
        {/* Left: Brand Identity */}
        <Link
          href="/"
          className="shrink-0 flex items-center gap-2 group transition-opacity hover:opacity-90"
        >
          <div className="relative w-6 h-6 rounded-md overflow-hidden flex items-center justify-center bg-zinc-900 border border-zinc-800 shrink-0">
            <Image
              src="/peeluiicon.svg"
              alt="Peel UI Icon"
              width={24}
              height={24}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <span className="whitespace-nowrap font-semibold text-sm sm:text-base tracking-tight text-white font-sans">
            Peel UI
          </span>
        </Link>

        {/* Center: Clean Nav Links (Hidden on mobile to prevent crowding) */}
        <div className="hidden md:flex items-center gap-5 text-xs sm:text-sm text-zinc-400">
          <Link
            href="/"
            className="text-zinc-300 font-medium hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="#components"
            className="hover:text-white transition-colors"
          >
            Components
          </Link>
          <Link
            href="#showcase"
            className="hover:text-white transition-colors"
          >
            Showcase
          </Link>
        </div>

        {/* Right: GitHub Star Button (Compact on mobile) */}
        <Link
          href="https://github.com/killersumit/peel-ui"
          target="_blank"
          rel="noreferrer"
          className="shrink-0 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-1 sm:px-3 text-xs text-zinc-300 hover:border-zinc-700 hover:text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          {/* GitHub SVG Monogram */}
          <svg
            className="w-3.5 h-3.5 fill-current shrink-0"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span className="hidden sm:inline font-medium">GitHub</span>
          <span className="text-zinc-600 sm:inline hidden">•</span>
          <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
            <Star className="w-3 h-3 text-peel-lime fill-peel-lime/20 shrink-0" />
            <span className="hidden xs:inline">Star</span>
          </span>
        </Link>
      </nav>
    </motion.header>
  );
}
