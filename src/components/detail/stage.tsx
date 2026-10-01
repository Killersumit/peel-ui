"use client";

import * as React from "react";
import {
  Check,
  Code2,
  Copy,
  Maximize2,
  Minimize2,
  RotateCcw,
  Terminal,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { ComponentRecord } from "@/config/components-data";
import { cn } from "@/lib/utils";
import { microTransition } from "@/lib/motion";

export type SurfaceTheme = "obsidian" | "dark" | "ceramic";
type PackageManager = keyof ComponentRecord["install"];

export interface StageProps {
  componentRecord: ComponentRecord;
  zenMode: boolean;
  inspectorOpen: boolean;
  surfaceTheme: SurfaceTheme;
  onToggleZen: () => void;
  onToggleCode: () => void;
  onToggleInspector: () => void;
  onChangeSurfaceTheme: (theme: SurfaceTheme) => void;
}

const surfaces: {
  id: SurfaceTheme;
  label: string;
  color: string;
}[] = [
  { id: "obsidian", label: "Obsidian", color: "#000000" },
  { id: "dark", label: "Dark Zinc", color: "#18181b" },
  { id: "ceramic", label: "Light Ceramic", color: "#f4f4f5" },
];

export function Stage({
  componentRecord,
  zenMode,
  inspectorOpen,
  surfaceTheme,
  onToggleZen,
  onToggleCode,
  onToggleInspector,
  onChangeSurfaceTheme,
}: StageProps) {
  const [installOpen, setInstallOpen] = React.useState(false);
  const [packageManager, setPackageManager] =
    React.useState<PackageManager>("npm");
  const [copyStatus, setCopyStatus] = React.useState<
    "idle" | "copied" | "error"
  >("idle");
  const [demoKey, setDemoKey] = React.useState(0);
  const installRef = React.useRef<HTMLDivElement>(null);
  const Demo = componentRecord.component;

  React.useEffect(() => {
    if (!installOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!installRef.current?.contains(event.target as Node)) {
        setInstallOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setInstallOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [installOpen]);

  const copyInstallCommand = async () => {
    try {
      await navigator.clipboard.writeText(componentRecord.install[packageManager]);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  const shouldReduceMotion = useReducedMotion();
  const surfaceColor = surfaces.find((surface) => surface.id === surfaceTheme)?.color
    ?? surfaces[0].color;

  return (
    <motion.section
      aria-label={`${componentRecord.name} interactive preview`}
      animate={{ backgroundColor: surfaceColor }}
      transition={shouldReduceMotion ? { duration: 0 } : microTransition}
      className="sticky top-0 z-20 flex h-[42vh] min-h-64 w-full shrink-0 flex-col md:static md:h-full md:min-h-0 md:min-w-0 md:flex-1"
    >
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <div className="absolute right-4 top-4 z-30 flex items-center gap-1 rounded-full border border-white/[0.08] bg-[#111113] p-1">
          <div className="relative" ref={installRef}>
            <button
              type="button"
              onClick={() => {
                setCopyStatus("idle");
                setInstallOpen((open) => !open);
              }}
              aria-expanded={installOpen}
              aria-haspopup="dialog"
              aria-label={installOpen ? "Close install command" : "Open install command"}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-400",
                installOpen
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-300 hover:bg-white/[0.08] hover:text-white"
              )}
            >
              {installOpen ? <X size={13} /> : <Terminal size={13} />}
              <span>Install</span>
            </button>

            {installOpen && (
              <div
                role="dialog"
                aria-label="Install component"
                className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-white/[0.1] bg-[#111113] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs text-zinc-400">Package manager</span>
                  <div className="flex gap-1" aria-label="Package manager">
                    {(["npm", "pnpm", "yarn", "bun"] as PackageManager[]).map(
                      (manager) => (
                        <button
                          key={manager}
                          type="button"
                          onClick={() => {
                            setPackageManager(manager);
                            setCopyStatus("idle");
                          }}
                          aria-pressed={manager === packageManager}
                          className={cn(
                            "rounded-md px-2 py-1 text-[11px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-400",
                            manager === packageManager
                              ? "bg-zinc-700 text-white"
                              : "text-zinc-400 hover:text-white"
                          )}
                        >
                          {manager}
                        </button>
                      )
                    )}
                  </div>
                </div>
                <code className="block select-text break-all rounded-lg bg-black/60 p-3 font-mono text-[11px] leading-relaxed text-zinc-200">
                  {componentRecord.install[packageManager]}
                </code>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span
                    role="status"
                    className={cn(
                      "text-[11px]",
                      copyStatus === "error" ? "text-red-300" : "text-zinc-500"
                    )}
                  >
                    {copyStatus === "copied"
                      ? "Command copied"
                      : copyStatus === "error"
                        ? "Clipboard unavailable. Select the command to copy."
                        : ""}
                  </span>
                  <button
                    type="button"
                    onClick={copyInstallCommand}
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-300 hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-400"
                  >
                    {copyStatus === "copied" ? <Check size={13} /> : <Copy size={13} />}
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleZen}
            aria-label={zenMode ? "Exit fullscreen" : "Enter fullscreen"}
            aria-pressed={zenMode}
            className="inline-flex size-8 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-400"
          >
            {zenMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            type="button"
            onClick={onToggleCode}
            aria-label="Toggle source code"
            className="inline-flex size-8 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-400"
          >
            <Code2 size={15} />
          </button>
          <button
            type="button"
            onClick={onToggleInspector}
            aria-label={inspectorOpen ? "Close details panel" : "Open details panel"}
            aria-expanded={inspectorOpen}
            className="hidden size-8 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-400 md:inline-flex"
          >
            <span className="text-[11px]">i</span>
          </button>
        </div>

        <div
          key={`${componentRecord.slug}-${demoKey}`}
          className="relative z-10 flex min-h-0 w-full flex-1 items-center justify-center"
        >
          <Demo />
        </div>

        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#111113] px-3 py-2">
          <button
            type="button"
            onClick={() => setDemoKey((key) => key + 1)}
            aria-label="Reset preview"
            title="Reset preview"
            className="inline-flex size-6 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-400"
          >
            <RotateCcw size={12} />
          </button>
          <span aria-hidden="true" className="h-4 w-px bg-white/[0.1]" />
          <div className="flex items-center gap-2" role="radiogroup" aria-label="Preview surface">
            {surfaces.map((surface) => (
              <button
                key={surface.id}
                type="button"
                role="radio"
                aria-checked={surface.id === surfaceTheme}
                aria-label={`${surface.label} preview background`}
                title={surface.label}
                onClick={() => onChangeSurfaceTheme(surface.id)}
                className={cn(
                  "size-3.5 rounded-full border border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400",
                  surfaceTheme === surface.id && "ring-2 ring-lime-400 ring-offset-1 ring-offset-[#111113]"
                )}
                style={{ backgroundColor: surface.color }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
