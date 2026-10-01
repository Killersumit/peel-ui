"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Transition } from "motion/react";
import { Menu, PanelLeft, X } from "lucide-react";
import {
  ALL_COMPONENTS,
  ComponentRecord,
  getComponentBySlug,
} from "@/config/components-data";
import { Inspector } from "@/components/detail/inspector";
import { Sidebar } from "@/components/detail/sidebar";
import {
  DetailPanelView,
  Stage,
  SurfaceTheme,
} from "@/components/detail/stage";
import { microTransition, springMechanical } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CodeView = React.lazy(() => import("@/components/detail/code-view"));

export interface ComponentWorkstationProps {
  slug?: string;
  componentRecord?: ComponentRecord;
}

export function ComponentWorkstation({
  slug,
  componentRecord: suppliedRecord,
}: ComponentWorkstationProps) {
  const componentRecord =
    suppliedRecord ??
    (slug ? getComponentBySlug(slug) : undefined) ??
    ALL_COMPONENTS[0];
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [activePanel, setActivePanel] = React.useState<DetailPanelView>("info");
  const [zenMode, setZenMode] = React.useState(false);
  const [surfaceTheme, setSurfaceTheme] =
    React.useState<SurfaceTheme>("obsidian");
  const infoButtonRef = React.useRef<HTMLButtonElement>(null);
  const codeButtonRef = React.useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = React.useRef<HTMLButtonElement>(null);
  const detailPanelRef = React.useRef<HTMLElement>(null);
  const mobileSidebarRef = React.useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isPanelVisible = !zenMode && activePanel !== null;

  const togglePanel = (view: Exclude<DetailPanelView, null>) => {
    setActivePanel((current) => (current === view ? null : view));
    if (view === "code" && window.matchMedia("(max-width: 767px)").matches) {
      window.setTimeout(() => {
        document.getElementById("mobile-component-details")?.scrollIntoView({
          behavior: shouldReduceMotion ? "auto" : "smooth",
          block: "start",
        });
      }, 50);
    }
  };

  React.useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const focusedElement = document.activeElement;
      const focusIsInDetailPanel =
        detailPanelRef.current?.contains(focusedElement) ||
        infoButtonRef.current === focusedElement ||
        codeButtonRef.current === focusedElement;

      if (activePanel && focusIsInDetailPanel) {
        setActivePanel(null);
        const trigger =
          activePanel === "code" ? codeButtonRef.current : infoButtonRef.current;
        window.requestAnimationFrame(() => trigger?.focus());
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const focusIsInMobileSidebar =
        mobileSidebarRef.current?.contains(focusedElement) ||
        mobileMenuButtonRef.current === focusedElement;
      if (mobileSidebarOpen && focusIsInMobileSidebar) {
        setMobileSidebarOpen(false);
        window.requestAnimationFrame(() => mobileMenuButtonRef.current?.focus());
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activePanel, mobileSidebarOpen]);

  const closePanel = () => {
    setActivePanel(null);
    const trigger =
      activePanel === "code" ? codeButtonRef.current : infoButtonRef.current;
    window.requestAnimationFrame(() => trigger?.focus());
  };

  const panelTransition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : {
        x: springMechanical,
        opacity: { duration: 0.2, ease: microTransition.ease },
      };

  return (
    <main className="relative flex min-h-svh flex-col overflow-x-hidden bg-black text-zinc-100 selection:bg-lime-400/20 selection:text-white md:h-svh md:min-h-0 md:overflow-hidden">
      <button
        type="button"
        ref={mobileMenuButtonRef}
        onClick={() => setMobileSidebarOpen((open) => !open)}
        aria-label={mobileSidebarOpen ? "Close component index" : "Open component index"}
        aria-expanded={mobileSidebarOpen}
        className="absolute left-4 top-4 z-50 inline-flex size-8 items-center justify-center rounded-lg bg-[#1b1b1d] text-zinc-300 transition-colors hover:bg-[#242426] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-400 md:hidden"
      >
        {mobileSidebarOpen ? <X size={15} /> : <Menu size={15} />}
      </button>
      <button
        type="button"
        onClick={() => {
          if (zenMode) {
            setZenMode(false);
            setSidebarOpen(true);
          } else {
            setSidebarOpen((open) => !open);
          }
        }}
        aria-label={
          sidebarOpen && !zenMode
            ? "Close component index"
            : "Open component index"
        }
        aria-expanded={sidebarOpen && !zenMode}
        className="absolute left-4 top-4 z-50 hidden size-8 items-center justify-center rounded-lg bg-[#1b1b1d] text-zinc-300 transition-colors hover:bg-[#242426] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-400 md:inline-flex"
      >
        {sidebarOpen && !zenMode ? <PanelLeft size={15} /> : <Menu size={15} />}
      </button>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row md:overflow-hidden">
        {!zenMode && (
          <Sidebar
            currentSlug={componentRecord.slug}
            isOpen={sidebarOpen}
            isMobileOpen={mobileSidebarOpen}
            mobileDrawerRef={mobileSidebarRef}
            onClose={() => {
              setMobileSidebarOpen(false);
            }}
          />
        )}

        <Stage
          componentRecord={componentRecord}
          zenMode={zenMode}
          activePanel={zenMode ? null : activePanel}
          infoButtonRef={infoButtonRef}
          codeButtonRef={codeButtonRef}
          surfaceTheme={surfaceTheme}
          onToggleZen={() => setZenMode((active) => !active)}
          onToggleCode={() => togglePanel("code")}
          onToggleInspector={() => togglePanel("info")}
          onChangeSurfaceTheme={setSurfaceTheme}
        />

        <motion.aside
          id="component-detail-panel"
          ref={detailPanelRef}
          aria-label={`${componentRecord.name} ${activePanel ?? "info"} panel`}
          aria-hidden={!isPanelVisible}
          inert={!isPanelVisible}
          initial={false}
          animate={{
            x: isPanelVisible ? 0 : 24,
            opacity: isPanelVisible ? 1 : 0,
          }}
          transition={panelTransition}
          className={cn(
            "hidden h-full shrink-0 flex-col overflow-hidden border-l border-white/[0.06] bg-black transition-[width,min-width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none md:flex",
            isPanelVisible
              ? "w-[min(36vw,28rem)] min-w-[22rem]"
              : "pointer-events-none w-0 min-w-0 border-l-0"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isPanelVisible && activePanel === "info" ? (
              <motion.div
                key="info"
                initial={{ x: shouldReduceMotion ? 0 : 12, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: shouldReduceMotion ? 0 : -12, opacity: 0 }}
                transition={panelTransition}
                className="h-full min-h-0"
              >
                <Inspector
                  componentRecord={componentRecord}
                  onClose={closePanel}
                />
              </motion.div>
            ) : isPanelVisible && activePanel === "code" ? (
              <motion.div
                key="code"
                initial={{ x: shouldReduceMotion ? 0 : 12, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: shouldReduceMotion ? 0 : -12, opacity: 0 }}
                transition={panelTransition}
                className="h-full min-h-0"
              >
                <React.Suspense
                  fallback={
                    <div className="p-8 font-mono text-[10px] text-peel-text-mono">
                      Loading code view
                    </div>
                  }
                >
                  <CodeView
                    componentRecord={componentRecord}
                    onClose={closePanel}
                  />
                </React.Suspense>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.aside>
      </div>

      <div id="mobile-component-details" className="md:hidden">
        <AnimatePresence mode="wait" initial={false}>
          {activePanel === "code" ? (
            <motion.div
              key="code"
              initial={{ x: shouldReduceMotion ? 0 : 12, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: shouldReduceMotion ? 0 : -12, opacity: 0 }}
              transition={panelTransition}
              className="min-h-[50vh]"
            >
              <React.Suspense
                fallback={
                  <div className="p-8 font-mono text-[10px] text-peel-text-mono">
                    Loading code view
                  </div>
                }
              >
                <CodeView
                  componentRecord={componentRecord}
                  onClose={closePanel}
                />
              </React.Suspense>
            </motion.div>
          ) : (
            <motion.div
              key="info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.12 }}
            >
              <Inspector componentRecord={componentRecord} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
