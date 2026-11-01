import { Link } from "react-router-dom";
import { usePageMeta } from "@/lib/usePageMeta";

export default function NotFoundPage() {
  usePageMeta({
    title: "Page Not Found — Peel UI",
    description: "The requested route does not exist in the Peel UI registry.",
  });

  return (
    <div className="relative min-h-[100dvh] w-full bg-[var(--peel-base)] text-[var(--peel-text-primary)] selection:bg-[var(--peel-lime)] selection:text-[var(--peel-lime-foreground)] flex flex-col items-center justify-center select-none">
      {/* Background Dot Matrix (Fixed & Composited) */}
      <div
        className="pointer-events-none fixed inset-0 -z-20 [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_20%,transparent_100%)] transform-gpu"
        aria-hidden="true"
      />

      <main id="main-content" className="max-w-[1040px] mx-auto w-full px-5 sm:px-6 flex flex-col items-center justify-center text-center">
        {/* 1. Monumental Quiet 404 Numeral */}
        <span className="font-mono text-[12px] text-[#555961] tabular-nums">
          404
        </span>

        {/* 2. Two-Tone Display Headline */}
        <h1 className="mt-3 font-sans font-medium tracking-[-0.038em] leading-[1.06] text-[clamp(2rem,4vw,3.25rem)] text-balance">
          <span className="text-[#F5F5F7] block">Page not found.</span>
          <span className="text-[#F5F5F7]/44 block">This route doesn&apos;t exist.</span>
        </h1>

        {/* 3. Single-Line Subcopy */}
        <p className="mt-4 text-[15px] leading-[1.6] tracking-[-0.012em] text-[#8E9299] max-w-[44ch] text-pretty">
          The link you followed may be broken, or the page may have been removed.
        </p>

        {/* 4. Two Clean Navigation Buttons */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="h-10 px-4 rounded-[10px] bg-[#F5F5F7] hover:bg-white text-[#08090A] text-[13px] font-medium tracking-[-0.015em] inline-flex items-center justify-center whitespace-nowrap shrink-0 transition-colors duration-150"
          >
            Back to Home
          </Link>
          <Link
            to="/components"
            className="h-10 px-4 rounded-[10px] bg-[#16181E] hover:bg-[#1E2129] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-[13px] font-medium tracking-[-0.015em] inline-flex items-center justify-center whitespace-nowrap shrink-0 transition-colors duration-150"
          >
            Browse Components
          </Link>
        </div>
      </main>
    </div>
  );
}
