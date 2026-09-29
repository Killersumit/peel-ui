"use client";

import * as React from "react";
import { Menu, PanelLeft, X } from "lucide-react";
import {
  ALL_COMPONENTS,
  ComponentRecord,
  getComponentBySlug,
} from "@/config/components-data";
import { Inspector } from "@/components/detail/inspector";
import { Sidebar } from "@/components/detail/sidebar";
import { Stage, SurfaceTheme } from "@/components/detail/stage";

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
  const [inspectorOpen, setInspectorOpen] = React.useState(true);
  const [zenMode, setZenMode] = React.useState(false);
  const [sourceOpen, setSourceOpen] = React.useState(false);
  const [surfaceTheme, setSurfaceTheme] =
    React.useState<SurfaceTheme>("obsidian");

  const toggleSource = React.useCallback(() => {
    const next = !sourceOpen;
    setSourceOpen(next);
    if (next) setInspectorOpen(true);
    if (next && window.matchMedia("(max-width: 767px)").matches) {
      window.setTimeout(() => {
        document.getElementById("mobile-inspector")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    }
  }, [sourceOpen]);

  React.useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileSidebarOpen(false);
        setZenMode(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <main className="relative flex min-h-svh flex-col overflow-x-hidden bg-black text-zinc-100 selection:bg-lime-400/20 selection:text-white md:h-svh md:min-h-0 md:overflow-hidden">
      <button
        type="button"
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
            onClose={() => {
              setMobileSidebarOpen(false);
            }}
          />
        )}

        <Stage
          componentRecord={componentRecord}
          zenMode={zenMode}
          inspectorOpen={inspectorOpen && !zenMode}
          surfaceTheme={surfaceTheme}
          onToggleZen={() => setZenMode((active) => !active)}
          onToggleCode={toggleSource}
          onToggleInspector={() => setInspectorOpen((open) => !open)}
          onChangeSurfaceTheme={setSurfaceTheme}
        />

        {!zenMode && inspectorOpen && (
          <aside
            aria-label={`${componentRecord.name} details`}
            className="hidden h-full w-[min(36vw,28rem)] min-w-[22rem] shrink-0 flex-col overflow-hidden border-l border-white/[0.06] bg-black md:flex"
          >
            <Inspector
              key={componentRecord.slug}
              componentRecord={componentRecord}
              sourceOpen={sourceOpen}
              onToggleSource={() => setSourceOpen((open) => !open)}
              onClose={() => setInspectorOpen(false)}
            />
          </aside>
        )}
      </div>

      <div id="mobile-inspector" className="md:hidden">
        <Inspector
          key={componentRecord.slug}
          componentRecord={componentRecord}
          sourceOpen={sourceOpen}
          onToggleSource={() => setSourceOpen((open) => !open)}
        />
      </div>
    </main>
  );
}
