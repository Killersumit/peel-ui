import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Copy, Check } from "@phosphor-icons/react";
import { REGISTRY_ITEMS, getFeaturedHeroItems } from "@/registry";
import { ComponentPreviewCard } from "@/components/catalog/ComponentPreviewCard";
import { BackedBySection } from "@/components/layout/BackedBySection";
import Footer from "@/components/layout/Footer";
import { EASE_SLIT_MASK } from "@/lib/motion";
import { usePageMeta } from "@/lib/usePageMeta";

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const featuredItems = getFeaturedHeroItems();
  const totalCount = REGISTRY_ITEMS.length;

  usePageMeta({
    title: "Peel UI — Tactile React & Tailwind Primitives",
    description:
      "Open-source registry of 120fps tactile React primitives crafted with Motion, GSAP, and Tailwind CSS. Copy-paste or install via shadcn CLI.",
  });

  const handleCopyCli = async () => {
    try {
      await navigator.clipboard.writeText(
        "npx shadcn@latest add @peel-ui/core"
      );
    } catch {
      // Fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative min-h-screen w-full bg-[var(--peel-base)] text-[var(--peel-text-primary)] overflow-x-hidden selection:bg-[var(--peel-lime)] selection:text-[var(--peel-lime-foreground)]">
      {/* Background Horizon Bloom — Precision Dot Matrix */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none fixed inset-0 -z-20 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_40%,#000_20%,transparent_100%)] transform-gpu"
        aria-hidden="true"
      />

      {/* Background Soft Ambient Glow: Strictly Cool Titanium White + Whisper of Sage-Emerald */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute top-28 left-1/2 -translate-x-1/2 -z-10 h-[480px] w-[800px] rounded-full [background:radial-gradient(ellipse_at_center,rgba(245,245,247,0.045)_0%,rgba(94,158,90,0.025)_40%,transparent_70%)] blur-3xl transform-gpu"
        aria-hidden="true"
      />

      {/* Hero Container: Viewport Vertical Centering & Optical Balance (Rail-locked at max-w-[1040px]) */}
      <main id="main-content" className="min-h-[100dvh] max-w-[1040px] mx-auto w-full px-5 sm:px-6 pt-16 pb-10 flex flex-col justify-center">
        <div className="-translate-y-[2%] flex flex-col items-start">
          {/* Slit-Mask Headline Reveal */}
          <h1 className="font-sans font-medium tracking-[-0.045em] leading-[0.97] text-[clamp(2.65rem,5.6vw,4.9rem)]">
            <span className="block overflow-hidden pb-2 -mb-2">
              <motion.span
                className="block will-change-transform text-[#F5F5F7]"
                initial={shouldReduceMotion ? { opacity: 0 } : { y: "108%" }}
                animate={shouldReduceMotion ? { opacity: 1 } : { y: "0%" }}
                transition={{
                  duration: 0.78,
                  ease: EASE_SLIT_MASK,
                  delay: 0,
                }}
              >
                Tactile primitives
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2 -mb-2">
              <motion.span
                className="block will-change-transform text-[#F5F5F7]/44"
                initial={shouldReduceMotion ? { opacity: 0 } : { y: "108%" }}
                animate={shouldReduceMotion ? { opacity: 1 } : { y: "0%" }}
                transition={{
                  duration: 0.78,
                  ease: EASE_SLIT_MASK,
                  delay: 0.08,
                }}
              >
                crafted for human touch.
              </motion.span>
            </span>
          </h1>

          {/* Two-Tone Subcopy */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: EASE_SLIT_MASK,
              delay: 0.22,
            }}
            className="mt-6 max-w-[48ch] text-[15px] sm:text-[16px] leading-[1.6] tracking-[-0.012em] text-pretty"
          >
            <span className="font-medium text-[#F5F5F7]">
              Physics-driven React components, free and open source.
            </span>
            <span className="font-normal text-[#8E9299]">
              {" "}
              Engineered with concentric squircles, machined surfaces, and 120fps
              compositor springs that drop straight into any shadcn/ui project.
            </span>
          </motion.p>

          {/* Action Row: Flat Matte Surfaces */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: EASE_SLIT_MASK,
              delay: 0.28,
            }}
            className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
          >
            {/* Primary Button */}
            <Link
              to="/components"
              className="h-11 px-5 rounded-[12px] bg-[#F5F5F7] hover:bg-white text-[#08090A] text-[13.5px] font-medium tracking-[-0.015em] inline-flex items-center justify-center gap-2 transition-colors duration-150 group whitespace-nowrap shrink-0"
            >
              <span>Browse components</span>
              <span className="transition-transform duration-200 ease-out group-hover:translate-x-1 inline-flex items-center">
                <ArrowRight size={14} weight="bold" />
              </span>
            </Link>

            {/* CLI Copy Button */}
            <button
              type="button"
              onClick={handleCopyCli}
              className="h-11 px-4 rounded-[12px] bg-[#16181E] hover:bg-[#1B1E25] shadow-[inset_0_1px_0_rgba(255,255,255,0.085)] font-mono text-[12px] text-[var(--peel-text-mono)] hover:text-[#F5F5F7] inline-flex items-center justify-between sm:justify-center gap-3 transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:ring-1 focus-visible:ring-[#F5F5F7]/40 focus-visible:outline-none"
            >
              <span className="truncate">npx shadcn@latest add @peel-ui/core</span>
              {copied ? (
                <span className="text-[var(--peel-lime)] shrink-0 inline-flex items-center">
                  <Check size={14} weight="bold" />
                </span>
              ) : (
                <span className="opacity-70 shrink-0 inline-flex items-center">
                  <Copy size={14} />
                </span>
              )}
            </button>
          </motion.div>
        </div>
      </main>

      {/* Curated 6-Primitive Showcase Grid (Rail-locked at max-w-[1040px], No Outer Box-in-Box) */}
      <section className="max-w-[1040px] mx-auto w-full px-5 sm:px-6 pb-28 relative z-10">
        {/* Clean, borderless Swiss section header row */}
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-[14px] font-medium tracking-[-0.015em] leading-[1.3] text-[#F5F5F7]">
            Selected Primitives
          </h2>
          <Link
            to="/components"
            className="text-[13px] text-[var(--peel-text-secondary)] hover:text-[#F5F5F7] transition-colors inline-flex items-center gap-1.5 font-medium whitespace-nowrap shrink-0"
          >
            <span>
              View all <span className="tabular-nums">{totalCount}</span> components
            </span>
            <ArrowRight size={13} weight="bold" />
          </Link>
        </div>

        {/* 6 Cards Directly on Canvas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredItems.map((item) => (
            <ComponentPreviewCard key={item.slug} item={item} />
          ))}
        </div>

        {/* Directory Row directly on canvas */}
        <div className="mt-6 flex items-center justify-between text-[13px] text-[var(--peel-text-secondary)]">
          <span className="font-mono text-[12px] text-[var(--peel-text-tertiary)]">
            Showing <span className="tabular-nums">6</span> of{" "}
            <span className="tabular-nums">{totalCount}</span> primitives
          </span>
          <Link
            to="/components"
            className="text-[#F5F5F7] hover:opacity-80 inline-flex items-center gap-1.5 font-medium transition-opacity whitespace-nowrap shrink-0"
          >
            <span>Explore full directory</span>
            <ArrowRight size={13} weight="bold" />
          </Link>
        </div>
      </section>

      {/* Landing Page Sponsor Wall */}
      <BackedBySection />

      {/* Concept B Anodized Carbon Ribbon Finale Portal */}
      <Footer />
    </div>
  );
}
