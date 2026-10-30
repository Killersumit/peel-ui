import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";

export interface FooterProps {
  minimal?: boolean;
}

export default function Footer({ minimal }: FooterProps = {}) {
  const location = useLocation();
  const isMinimal =
    minimal ??
    (location.pathname === "/privacy" ||
      location.pathname === "/terms" ||
      location.pathname === "/refund");

  const footerRef = React.useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 55, damping: 24, mass: 1.1 });
  const leftRibbonX = useTransform(
    smoothMouseX,
    [-300, 300],
    shouldReduceMotion ? [0, 0] : [-12, 12]
  );
  const rightRibbonX = useTransform(
    smoothMouseX,
    [-300, 300],
    shouldReduceMotion ? [0, 0] : [12, -12]
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    mouseX.set(relX);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
  };

  return (
    <footer
      ref={footerRef}
      className={`max-w-[1040px] mx-auto w-full px-5 sm:px-6 relative overflow-hidden select-none ${
        isMinimal ? "pt-6 pb-12" : "pt-28 pb-12"
      }`}
    >
      {!isMinimal && (
        <>
          {/* ── 1. Top Editorial Anchor ── */}
          <div className="flex flex-col items-center text-center relative z-20">
            <h2 className="text-center font-sans font-medium tracking-[-0.038em] leading-[1.06] text-[clamp(1.75rem,3.4vw,2.75rem)] text-[#F5F5F7] text-balance">
              Become a Peel UI
              <br />
              founding sponsor.
            </h2>
          </div>

          {/* ── 2. Centerpiece — Concept B Anodized Carbon Ribbons + Interactive Portal Seal ── */}
          <div
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="mt-12 relative h-[240px] sm:h-[290px] flex items-center justify-center overflow-hidden rounded-[28px]"
          >
            {/* Architectural Macro Studio Photography (Blended Screen Mask) */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <img
                src="/sponsors/carbon-ribbons.webp"
                alt="Peel UI architectural carbon ribbon visual"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover mix-blend-screen [mask-image:radial-gradient(ellipse_80%_65%_at_50%_50%,#000_35%,transparent_100%)] opacity-80"
              />
            </div>

            {/* Left Sweeping Carbon Ribbon (120fps Compositor Parallax) */}
            <motion.div
              style={{ x: leftRibbonX }}
              className="absolute left-0 inset-y-0 w-1/2 pointer-events-none z-10 flex items-center justify-start overflow-hidden will-change-transform"
            >
              <svg
                viewBox="0 0 500 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full opacity-70"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="carbon-left-grad" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#08090A" stopOpacity="0.9" />
                    <stop offset="60%" stopColor="#16181E" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#08090A" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path
                  d="M-50,0 C120,40 260,80 340,140 C280,190 140,240 -50,280 Z"
                  fill="url(#carbon-left-grad)"
                />
                <path
                  d="M-50,0 C120,40 260,80 340,140 C280,190 140,240 -50,280"
                  stroke="rgba(245,245,247,0.22)"
                  strokeWidth="1.2"
                  fill="none"
                />
              </svg>
            </motion.div>

            {/* Right Sweeping Carbon Ribbon (120fps Compositor Parallax) */}
            <motion.div
              style={{ x: rightRibbonX }}
              className="absolute right-0 inset-y-0 w-1/2 pointer-events-none z-10 flex items-center justify-end overflow-hidden will-change-transform"
            >
              <svg
                viewBox="0 0 500 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full opacity-70"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="carbon-right-grad" x1="100%" y1="50%" x2="0%" y2="50%">
                    <stop offset="0%" stopColor="#08090A" stopOpacity="0.9" />
                    <stop offset="60%" stopColor="#16181E" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#08090A" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path
                  d="M550,0 C380,40 240,80 160,140 C220,190 360,240 550,280 Z"
                  fill="url(#carbon-right-grad)"
                />
                <path
                  d="M550,0 C380,40 240,80 160,140 C220,190 360,240 550,280"
                  stroke="rgba(245,245,247,0.22)"
                  strokeWidth="1.2"
                  fill="none"
                />
              </svg>
            </motion.div>

            {/* Center Circular Gap & Scalloped Peel Seal (Redirects to /sponsors) */}
            <div className="flex flex-col items-center justify-center relative z-20">
              <Link
                to="/sponsors"
                aria-label="View Peel UI Sponsor Tiers"
                className="group relative flex flex-col items-center focus:outline-none"
              >
                {/* 132px Tactile Scalloped Rosette & Rotating Round Ring */}
                <div className="relative size-[132px] flex items-center justify-center">
                  {/* Outer Scalloped Rosette SVG (16-lobe precision machined seal) */}
                  <svg
                    viewBox="0 0 132 132"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 size-full transition-transform duration-300 group-hover:scale-[1.03]"
                  >
                    <path
                      d="M 121.00 66.00 Q 127.79 78.29 116.81 87.05 Q 118.38 101.00 104.89 104.89 Q 101.00 118.38 87.05 116.81 Q 78.29 127.79 66.00 121.00 Q 53.71 127.79 44.95 116.81 Q 31.00 118.38 27.11 104.89 Q 13.62 101.00 15.19 87.05 Q 4.21 78.29 11.00 66.00 Q 4.21 53.71 15.19 44.95 Q 13.62 31.00 27.11 27.11 Q 31.00 13.62 44.95 15.19 Q 53.71 4.21 66.00 11.00 Q 78.29 4.21 87.05 15.19 Q 101.00 13.62 104.89 27.11 Q 118.38 31.00 116.81 44.95 Q 127.79 53.71 121.00 66.00 Z"
                      fill="#0B0C0F"
                      stroke="rgba(255,255,255,0.16)"
                      strokeWidth="1.2"
                      className="transition-colors duration-200 group-hover:stroke-white/30"
                    />
                  </svg>

                  {/* Rotating Engraved Round Ring (36s linear infinite) */}
                  <motion.div
                    animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 36, ease: "linear" }}
                    className="absolute inset-0 size-full pointer-events-none"
                  >
                    <svg viewBox="0 0 132 132" className="size-full">
                      <path
                        id="portal-text-ring"
                        d="M 66,66 m -42.5,0 a 42.5,42.5 0 1,1 85,0 a 42.5,42.5 0 1,1 -85,0"
                        fill="none"
                      />
                      <text
                        fontSize="6.5"
                        fontFamily="monospace"
                        letterSpacing="0.14em"
                        fill="rgba(245,245,247,0.32)"
                        className="uppercase"
                      >
                        <textPath href="#portal-text-ring" startOffset="0%">
                          SPONSOR PEEL UI • OPEN SOURCE • MONTHLY TIERS • 
                        </textPath>
                      </text>
                    </svg>
                  </motion.div>

                  {/* Core Orb with Peel Monogram */}
                  <div className="size-14 rounded-full bg-[#13151A] group-hover:bg-[#191C22] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_0_28px_rgba(94,158,90,0.24)] flex items-center justify-center transition-all duration-300 group-hover:scale-105 relative z-10 border border-white/[0.08]">
                    <svg
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-6 shrink-0"
                      aria-hidden="true"
                    >
                      <path
                        d="M24 22C24 15.3726 29.3726 10 36 10H46C63.6731 10 78 24.3269 78 42C78 59.6731 63.6731 74 46 74H44V82C44 87.5228 39.5228 92 34 92C28.4772 92 24 87.5228 24 82V22Z"
                        fill="#F5F5F7"
                      />
                      <rect
                        x="50"
                        y="70"
                        width="22"
                        height="22"
                        rx="6.5"
                        fill="#5E9E5A"
                        className="transition-colors duration-200 group-hover:fill-[var(--peel-lime)]"
                      />
                    </svg>
                  </div>
                </div>

                {/* Quiet Hover Label */}
                <div className="mt-4 font-mono text-[11px] font-medium tracking-[0.08em] text-[var(--peel-text-tertiary)] group-hover:text-[#F5F5F7] transition-colors inline-flex items-center gap-1 whitespace-nowrap">
                  <span>Explore tiers</span>
                  <ArrowUpRight size={12} weight="bold" />
                </div>
              </Link>
            </div>
          </div>
        </>
      )}

      {/* ── 3. Bottom Signature Row ── */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[var(--peel-text-tertiary)] border-t border-white/[0.04] ${
          isMinimal ? "pt-4" : "mt-10 pt-6"
        }`}
      >
        <div className="flex items-center whitespace-nowrap">
          <span>Designed and Developed by </span>
          <a
            href="https://github.com/killersumit"
            target="_blank"
            rel="noreferrer"
            className="ml-1 text-[var(--peel-text-secondary)] hover:text-[#F5F5F7] transition-colors whitespace-nowrap"
          >
            @killersumit
          </a>
        </div>
        <nav aria-label="Legal and license links" className="flex items-center gap-5 whitespace-nowrap">
          <Link
            to="/privacy"
            className="text-[var(--peel-text-tertiary)] hover:text-[#F5F5F7] transition-colors"
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="text-[var(--peel-text-tertiary)] hover:text-[#F5F5F7] transition-colors"
          >
            Terms
          </Link>
          <Link
            to="/refund"
            className="text-[var(--peel-text-tertiary)] hover:text-[#F5F5F7] transition-colors"
          >
            Refund Policy
          </Link>
          <a
            href="https://github.com/killersumit/peel-ui/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] text-[var(--peel-text-tertiary)] hover:text-[#F5F5F7] transition-colors"
          >
            MIT License
          </a>
        </nav>
      </div>
    </footer>
  );
}
