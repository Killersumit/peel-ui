import { useEffect, useRef, lazy, Suspense } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import { ReactLenis, type LenisRef } from "lenis/react";
import { frame, cancelFrame } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/layout/Navbar";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import HomePage from "@/pages/HomePage";

// Route-level code splitting for non-homepage routes (preserves instant LCP on /)
const CatalogPage = lazy(() => import("@/pages/CatalogPage"));
const ComponentWorkspacePage = lazy(() => import("@/pages/ComponentWorkspacePage"));
const SponsorsPage = lazy(() => import("@/pages/SponsorsPage"));
const LegalPage = lazy(() => import("@/pages/LegalPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function App() {
  const location = useLocation();
  const lenisRef = useRef<LenisRef>(null);

  // Sync Lenis into motion/react's master frame loop for unified 120fps rAF tick and ScrollTrigger sync
  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }
    frame.update(update, true);

    const lenis = lenisRef.current?.lenis;
    const onScroll = () => {
      if (ScrollTrigger.getAll().length > 0) {
        ScrollTrigger.update();
      }
    };
    lenis?.on("scroll", onScroll);
    gsap.ticker.lagSmoothing(0);

    return () => {
      cancelFrame(update);
      lenis?.off("scroll", onScroll);
    };
  }, []);

  // Clean scroll reset and document title update on route changes
  useEffect(() => {
    lenisRef.current?.lenis?.scrollTo(0, { immediate: true });

    const path = location.pathname;
    if (path === "/") {
      document.title = "Peel UI — Tactile React & Tailwind Primitives";
    } else if (path === "/components") {
      document.title = "Components — Peel UI";
    } else if (path === "/sponsors") {
      document.title = "Sponsors — Peel UI";
    } else if (path === "/privacy") {
      document.title = "Privacy Policy — Peel UI";
    } else if (path === "/terms") {
      document.title = "Terms of Service — Peel UI";
    } else if (path === "/refund") {
      document.title = "Refund & Sponsorship — Peel UI";
    }
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <ReactLenis
        ref={lenisRef}
        root
        autoRaf={false}
        options={{
          lerp: 0.115,
          wheelMultiplier: 0.95,
          touchMultiplier: 1,
          syncTouch: false,
        }}
      >
        <div className="min-h-screen bg-[var(--peel-base)] text-[var(--peel-text-primary)] font-sans antialiased selection:bg-[var(--peel-lime)] selection:text-[var(--peel-lime-foreground)]">
          <Navbar />
          <Suspense fallback={<div className="min-h-[100dvh] bg-[#08090A]" />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/components" element={<CatalogPage />} />
              <Route path="/components/:slug" element={<ComponentWorkspacePage />} />
              <Route path="/sponsors" element={<SponsorsPage />} />
              <Route path="/privacy" element={<LegalPage />} />
              <Route path="/terms" element={<LegalPage />} />
              <Route path="/refund" element={<LegalPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </ReactLenis>
    </ErrorBoundary>
  );
}
