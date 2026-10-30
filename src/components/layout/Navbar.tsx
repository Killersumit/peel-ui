import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { GithubLogo, Copy, Check } from "@phosphor-icons/react";
import { springTactile } from "@/lib/motion";

const morphSpring = { stiffness: 95, damping: 20, mass: 1.05 };

export default function Navbar() {
  const location = useLocation();
  const { scrollY } = useScroll();
  const splitProgress = useSpring(scrollY.get() > 40 ? 1 : 0, morphSpring);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Lock body scroll when mobile overlay is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const [splitDistance, setSplitDistance] = useState(260);

  // Maintain flush alignment with the 1040px grid rails across viewport sizes
  useEffect(() => {
    const updateDistance = () => {
      // 1040px rail with px-6 (24px) padding has inner half-width min(window.innerWidth - 48, 1040 - 48) / 2
      const availableHalfWidth = Math.min(window.innerWidth - 48, 992) / 2;
      // Brand island merged left edge is ~222px from center; desired left edge is -availableHalfWidth
      const targetDistance = Math.max(0, Math.min(274, availableHalfWidth - 222));
      setSplitDistance(targetDistance);
    };
    updateDistance();
    window.addEventListener("resize", updateDistance, { passive: true });
    return () => window.removeEventListener("resize", updateDistance);
  }, []);

  const shouldReduceMotion = useReducedMotion();

  // Drive desktop splitProgress smoothly between 0 (merged) and 1 (detached)
  useMotionValueEvent(scrollY, "change", (y) => {
    splitProgress.set(y > 40 ? 1 : 0);
  });

  const leftX = useTransform(splitProgress, [0, 1], [0, shouldReduceMotion ? 0 : -splitDistance]);
  const rightX = useTransform(splitProgress, [0, 1], [0, shouldReduceMotion ? 0 : splitDistance]);
  const unifiedOpacity = useTransform(splitProgress, [0, 0.55], [1, 0]);
  const unifiedScaleX = useTransform(splitProgress, [0, 1], [1, 1.08]);
  const islandBgOpacity = useTransform(splitProgress, [0.25, 1], [0, 1]);

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
    <>
      {/* Top Viewport Soft Horizon Mask (Prevents scrolling content text collision) */}
      <div
        className="fixed top-0 inset-x-0 h-24 bg-gradient-to-b from-[#08090A] via-[#08090A]/85 to-transparent pointer-events-none z-40"
        aria-hidden="true"
      />

      {/* =========================================================================
          1. DESKTOP NAVBAR (>= 768px): 1-to-3 Scroll-Morphing Island Header
          ========================================================================= */}
      <header className="hidden md:flex fixed top-5 inset-x-0 z-50 justify-center pointer-events-none px-5 sm:px-6">
        <div className="relative inline-flex items-center gap-2 p-1.5 pointer-events-auto">
          {/* Unified Bar Shell Background */}
          <motion.div
            style={{ opacity: unifiedOpacity, scaleX: unifiedScaleX }}
            className="absolute inset-0 rounded-[16px] bevel-machined pointer-events-none"
          />

          {/* Island 1 (Left — Brand P. SVG + "Peel UI") */}
          <motion.div
            style={{ x: leftX }}
            className="will-change-transform relative px-3.5 py-1.5 inline-flex items-center gap-2.5 whitespace-nowrap shrink-0"
          >
            <motion.div
              style={{ opacity: islandBgOpacity }}
              className="absolute inset-0 rounded-[14px] bevel-machined -z-10 pointer-events-none"
            />
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 group focus:outline-none whitespace-nowrap shrink-0"
            >
              <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-[18px] shrink-0"
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
                  className="transition-colors duration-150 group-hover:fill-[var(--peel-lime)]"
                />
              </svg>
              <span className="text-[13px] font-medium tracking-[-0.02em] text-[#F5F5F7] whitespace-nowrap">
                Peel UI
              </span>
            </Link>
          </motion.div>

          {/* Island 2 (Center — Navigation Links) */}
          <motion.nav
            aria-label="Primary Navigation"
            className="relative px-2 py-1 inline-flex items-center gap-1 shrink-0"
          >
            <motion.div
              style={{ opacity: islandBgOpacity }}
              className="absolute inset-0 rounded-[14px] bevel-machined -z-10 pointer-events-none"
            />

            <Link
              to="/"
              className={`px-2.5 py-1 rounded-[10px] text-[12.5px] font-medium tracking-[-0.01em] transition-colors relative whitespace-nowrap shrink-0 ${
                location.pathname === "/"
                  ? "text-[var(--peel-text-primary)]"
                  : "text-[var(--peel-text-secondary)] hover:text-[var(--peel-text-primary)]"
              }`}
            >
              {location.pathname === "/" && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-[10px] bg-[#1B1E25] -z-10"
                  transition={springTactile}
                />
              )}
              Home
            </Link>

            <Link
              to="/components"
              className={`px-2.5 py-1 rounded-[10px] text-[12.5px] font-medium tracking-[-0.01em] transition-colors relative whitespace-nowrap shrink-0 ${
                location.pathname.startsWith("/components")
                  ? "text-[var(--peel-text-primary)]"
                  : "text-[var(--peel-text-secondary)] hover:text-[var(--peel-text-primary)]"
              }`}
            >
              {location.pathname.startsWith("/components") && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-[10px] bg-[#1B1E25] -z-10"
                  transition={springTactile}
                />
              )}
              Components
            </Link>

            <Link
              to="/sponsors"
              className={`px-2.5 py-1 rounded-[10px] text-[12.5px] font-medium tracking-[-0.01em] transition-colors relative whitespace-nowrap shrink-0 ${
                location.pathname.startsWith("/sponsors")
                  ? "text-[var(--peel-text-primary)]"
                  : "text-[var(--peel-text-secondary)] hover:text-[var(--peel-text-primary)]"
              }`}
            >
              {location.pathname.startsWith("/sponsors") && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-[10px] bg-[#1B1E25] -z-10"
                  transition={springTactile}
                />
              )}
              Sponsors
            </Link>
          </motion.nav>

          {/* Island 3 (Right — Accessible GitHub Pill) */}
          <motion.a
            href="https://github.com/killersumit/peel-ui"
            target="_blank"
            rel="noreferrer"
            aria-label="Peel UI on GitHub"
            style={{ x: rightX }}
            className="will-change-transform relative px-3.5 py-1.5 inline-flex items-center gap-2 text-[12.5px] font-medium text-[var(--peel-text-secondary)] hover:text-[var(--peel-text-primary)] active:bg-[#1B1E25] rounded-[14px] cursor-pointer whitespace-nowrap shrink-0 group transition-colors duration-150"
          >
            <motion.div
              style={{ opacity: islandBgOpacity }}
              className="absolute inset-0 rounded-[14px] bevel-machined -z-10 pointer-events-none"
            />
            <span className="transition-transform duration-200 ease-out group-hover:-translate-y-0.5 inline-flex items-center">
              <GithubLogo size={15} weight="fill" aria-hidden="true" />
            </span>
            <span className="whitespace-nowrap">GitHub</span>
          </motion.a>
        </div>
      </header>

      {/* =========================================================================
          2. MOBILE TOP BAR (< 768px): TWO Medium Tactile Pills Only
          ========================================================================= */}
      <div className="flex md:hidden fixed top-4 inset-x-4 z-50 items-center justify-between pointer-events-none">
        {/* Left Pill (Brand) */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="pointer-events-auto h-11 px-4 rounded-[14px] bevel-machined inline-flex items-center gap-2.5 whitespace-nowrap shrink-0"
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-5 shrink-0"
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
            />
          </svg>
          <span className="text-[14px] font-medium tracking-[-0.02em] text-[#F5F5F7] whitespace-nowrap">
            Peel UI
          </span>
        </Link>

        {/* Right Pill (Full-Screen Menu Trigger) */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          className="pointer-events-auto h-11 px-4 rounded-[14px] bevel-machined active:bg-[#1B1E25] inline-flex items-center gap-2.5 text-[13.5px] font-medium text-[#F5F5F7] cursor-pointer whitespace-nowrap shrink-0"
        >
          <span className="whitespace-nowrap shrink-0">{mobileMenuOpen ? "Close" : "Menu"}</span>
          <div className="relative w-3.5 h-3 flex items-center justify-center">
            <motion.span
              animate={mobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -3.5 }}
              transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
              className="absolute w-3.5 h-[1.5px] bg-[#F5F5F7] rounded-full"
            />
            <motion.span
              animate={mobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 3.5 }}
              transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
              className="absolute w-3.5 h-[1.5px] bg-[#F5F5F7] rounded-full"
            />
          </div>
        </button>
      </div>

      {/* =========================================================================
          3. MOBILE FULL-SCREEN NAVIGATION OVERLAY (AnimatePresence)
          ========================================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[#08090A] flex flex-col justify-between px-6 pt-28 pb-10 md:hidden overflow-y-auto"
          >
            {/* Large Clean Primary Navigation Links */}
            <div className="flex flex-col gap-2">
              {[
                { label: "Home", href: "/", isExternal: false },
                { label: "Components", href: "/components", isExternal: false },
                { label: "Sponsors", href: "/sponsors", isExternal: false },
                {
                  label: "GitHub",
                  href: "https://github.com/killersumit/peel-ui",
                  isExternal: true,
                },
              ].map((link, index) => (
                <div key={link.label} className="overflow-hidden py-1">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%" }}
                    transition={{
                      duration: 0.48,
                      ease: [0.19, 1, 0.22, 1],
                      delay: 0.06 + index * 0.05,
                    }}
                  >
                    {link.isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-[32px] font-medium tracking-[-0.035em] text-[#F5F5F7] hover:text-white flex items-center justify-between py-2 group"
                      >
                        <span>{link.label}</span>
                        <span className="text-[var(--peel-text-tertiary)] group-hover:text-[#F5F5F7] text-[18px] transition-colors">
                          ↗
                        </span>
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-[32px] font-medium tracking-[-0.035em] text-[#F5F5F7] hover:text-white flex items-center justify-between py-2 group"
                      >
                        <span>{link.label}</span>
                        <span className="text-[var(--peel-text-tertiary)] group-hover:text-[#F5F5F7] text-[18px] transition-colors">
                          →
                        </span>
                      </Link>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Bottom Drawer Footer */}
            <div>
              <span className="block font-sans text-[12px] font-medium tracking-[-0.01em] text-[var(--peel-text-tertiary)] mb-2 whitespace-nowrap">
                Quick install
              </span>
              <button
                type="button"
                onClick={handleCopyCli}
                className="w-full h-11 px-4 rounded-[12px] bg-[#16181E] active:bg-[#1B1E25] shadow-[inset_0_1px_0_rgba(255,255,255,0.085)] font-mono text-[12px] text-[var(--peel-text-mono)] flex items-center justify-between cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                <span className="truncate">
                  npx shadcn@latest add @peel-ui/core
                </span>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
