"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Star, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const FAST_EASE = [0.16, 1, 0.3, 1] as const;

export function Navbar() {
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navContainerRef = React.useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const isComponents = pathname.startsWith("/components");

  const navItems = [
    { label: "Home", href: "/", index: "01", active: isHome },
    { label: "Components", href: "/components", index: "02", active: isComponents },
    { label: "Showcase", href: "/#components", index: "03", active: false },
  ];

  // Automatically close mobile menu on route change
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on click outside or Escape key
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <motion.header
      ref={navContainerRef}
      initial={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 0, y: -6 }
      }
      animate={{ opacity: 1, y: 0 }}
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
            />
          </div>
          <span className="whitespace-nowrap font-semibold text-sm sm:text-base tracking-tight text-white font-sans">
            Peel UI
          </span>
        </Link>

        {/* Center: Desktop Nav Links (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-5 text-xs sm:text-sm">
          <Link
            href="/"
            className={`transition-colors ${
              isHome
                ? "text-white font-medium"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            href="/components"
            prefetch={false}
            className={`transition-colors ${
              isComponents
                ? "text-white font-medium"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Components
          </Link>
          <Link
            href="/#components"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Showcase
          </Link>
        </div>

        {/* Right Cluster: GitHub Star Button + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="https://github.com/killersumit/peel-ui"
            target="_blank"
            rel="noreferrer"
            aria-label="Star Peel UI on GitHub"
            className="shrink-0 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-1 sm:px-3 text-xs text-zinc-300 hover:border-zinc-700 hover:text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
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

          {/* Tactile Hardware Mobile Trigger */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            className="md:hidden relative flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 active:scale-90 transition-all cursor-pointer shadow-sm focus-visible:outline-none"
          >
            <div className="w-3.5 h-2.5 flex flex-col justify-between items-center pointer-events-none">
              <span
                className={`h-[1.5px] w-full bg-current rounded-full transition-transform duration-200 origin-center ${
                  isMenuOpen ? "rotate-45 translate-y-[4.25px]" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-full bg-current rounded-full transition-transform duration-200 origin-center ${
                  isMenuOpen ? "-rotate-45 -translate-y-[4.25px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Bespoke Tactile Mobile Navigation Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -6, scale: 0.99 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -6, scale: 0.99 }
            }
            transition={{ duration: 0.18, ease: FAST_EASE }}
            className="pointer-events-auto mt-2 w-full rounded-2xl border border-white/[0.08] bg-[#0c0d10]/95 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden md:hidden"
          >
            {/* Structural Telemetry Rows */}
            <div className="divide-y divide-white/[0.06]">
              {navItems.map((item) => {
                const isActive = item.active;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={item.href !== "/components"}
                    onClick={() => setIsMenuOpen(false)}
                    className={`group flex items-center justify-between px-4 py-3 text-xs transition-colors duration-150 ${
                      isActive
                        ? "bg-white/[0.04] text-white"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-[10px] tracking-widest ${
                          isActive
                            ? "text-[#84ff00]"
                            : "text-zinc-600 group-hover:text-zinc-400"
                        }`}
                      >
                        {item.index}
                      </span>
                      <span className="font-medium tracking-tight text-sm">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 bg-[#84ff00]/10 border border-[#84ff00]/25 text-[10px] font-mono text-[#84ff00]">
                          <span className="w-1 h-1 rounded-full bg-[#84ff00]" />
                          ACTIVE
                        </span>
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Hardware Telemetry Strip */}
            <div className="px-4 py-2.5 bg-black/40 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span className="tracking-widest uppercase">Peel UI Registry</span>
              <span className="text-zinc-600">2026</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
