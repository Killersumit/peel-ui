"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const FAST_EASE = [0.16, 1, 0.3, 1] as const;
const CLI_COMMAND =
  "npx shadcn@latest add Killersumit/peel-ui/slide-to-confirm";

export function Hero() {
  const [copied, setCopied] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CLI_COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="relative w-full min-w-0 min-h-[min(70svh,36rem)] sm:min-h-[85vh] flex flex-col items-center justify-center text-center border-x border-zinc-900/80 max-w-5xl mx-auto px-4 sm:px-8 pt-24 pb-12 sm:pt-36 sm:pb-28 overflow-hidden">
      {/* Corner Crosshair Registration Marks */}
      <span
        className="absolute top-2 left-2 text-zinc-700 font-mono text-xs select-none pointer-events-none"
        aria-hidden="true"
      >
        +
      </span>
      <span
        className="absolute top-2 right-2 text-zinc-700 font-mono text-xs select-none pointer-events-none"
        aria-hidden="true"
      >
        +
      </span>
      <span
        className="absolute bottom-2 left-2 text-zinc-700 font-mono text-xs select-none pointer-events-none"
        aria-hidden="true"
      >
        +
      </span>
      <span
        className="absolute bottom-2 right-2 text-zinc-700 font-mono text-xs select-none pointer-events-none"
        aria-hidden="true"
      >
        +
      </span>

      {/* Background Watermark: Subtle Peel UI Folded Ribbon */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[480px] h-[280px] sm:h-[480px] pointer-events-none select-none opacity-[0.04] -z-10"
      >
        <Image
          src="/peeluiicon.png"
          alt=""
          width={480}
          height={480}
          className="w-full h-full object-contain filter grayscale"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      <div className="w-full flex flex-col items-center">
        {/* Top Badge: Rapid blur-dissolve */}
        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { scale: 0.98, opacity: 0 }
          }
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: FAST_EASE }}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1 font-mono text-[11px] text-zinc-400 tracking-wider uppercase mb-5 sm:mb-6 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#84ff00] animate-pulse" />
          <span>Public Registry · 2026</span>
        </motion.div>

        {/* Headline: Responsive Text with Overflow-Hidden Line Mask Reveal */}
        <h1 className="text-[clamp(1.875rem,9vw,2.25rem)] sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={
                shouldReduceMotion ? { opacity: 1 } : { y: "100%", opacity: 0 }
              }
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.4, ease: FAST_EASE, delay: 0.06 }}
            >
              Tactile React Components.
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={
                shouldReduceMotion ? { opacity: 1 } : { y: "100%", opacity: 0 }
              }
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.4, ease: FAST_EASE, delay: 0.12 }}
            >
              Peel &amp; Drop.
            </motion.span>
          </span>
        </h1>

        {/* Subhead: Mobile Safe Margins & Clean Line-Height */}
        <motion.p
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0 }
          }
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: FAST_EASE, delay: 0.18 }}
          className="mt-4 sm:mt-5 text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed px-2"
        >
          An open-source registry of tactile animations, physics interactions,
          and copy-paste components. Built for Next.js and Tailwind CSS.
        </motion.p>

        {/* Responsive Command Capsule: Stacked on Mobile, Pill on Desktop */}
        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { scale: 0.98, opacity: 0 }
          }
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: FAST_EASE, delay: 0.22 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 rounded-2xl sm:rounded-full border border-zinc-800 bg-zinc-900/90 p-2 sm:p-1.5 sm:pl-4 w-full max-w-md sm:max-w-xl mx-auto shadow-2xl backdrop-blur-md relative z-10"
        >
          {/* Code Area (Full width on mobile with distinct container, borderless on desktop) */}
          <div className="flex items-center justify-between gap-2 rounded-xl bg-zinc-950/60 px-3 py-2 border border-zinc-800/60 sm:border-none sm:bg-transparent sm:p-0 flex-1 min-w-0">
            <button
              type="button"
              onClick={handleCopy}
              title="Click to copy command"
              aria-label="Copy install command to clipboard"
              className="flex items-center justify-between gap-2 w-full text-left cursor-pointer group focus-visible:outline-none"
            >
              <div className="flex items-center gap-2 overflow-hidden truncate">
                <span className="text-zinc-500 font-mono text-xs select-none shrink-0">
                  $
                </span>
                <span className="font-mono text-xs sm:text-sm text-zinc-300 group-hover:text-white transition-colors truncate">
                  {CLI_COMMAND}
                </span>
              </div>
              <span className="p-1 rounded-md text-zinc-400 group-hover:text-zinc-200 transition-colors shrink-0">
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#84ff00]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </span>
            </button>
          </div>

          {/* Action Button: Full width on mobile, inline on desktop */}
          <Link
            href="/components"
            className="whitespace-nowrap rounded-full bg-[#84ff00] px-5 py-2 text-xs font-semibold text-black hover:bg-[#96ff26] active:scale-95 transition-all w-full sm:w-auto text-center flex items-center justify-center shadow-sm shrink-0"
          >
            Explore Components ↗
          </Link>
        </motion.div>

        {/* Micro Status Hint */}
        <div className="h-4 mt-2">
          {copied && (
            <span className="font-mono text-[11px] text-[#84ff00]">
              Copied to clipboard
            </span>
          )}
        </div>
      </div>

      {/* Ambient Brand Underglow (Soft Bloom behind command area) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl h-44 -z-10 flex justify-center items-center opacity-70"
      >
        <div className="w-64 h-32 rounded-full bg-[#84ff00]/10 blur-[80px] -mr-12" />
        <div className="w-64 h-32 rounded-full bg-[#ff553e]/10 blur-[80px] -ml-12" />
      </div>
    </section>
  );
}
