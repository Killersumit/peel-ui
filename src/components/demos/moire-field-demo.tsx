"use client";

import * as React from "react";
import { MoireField } from "@/components/ui/moire-field";
import { cn } from "@/lib/utils";

type VariantType = "lines" | "rings" | "dots";

export function MoireFieldDemo() {
  const [variant, setVariant] = React.useState<VariantType>("lines");
  const [pitch, setPitch] = React.useState(9);
  const [thickness, setThickness] = React.useState(50);
  const isMobile = React.useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia("(max-width: 640px)");
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia("(max-width: 640px)").matches,
    () => false
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
      <div className="relative min-h-[560px] w-full overflow-hidden rounded-2xl border border-[var(--peel-border,#232730)] bg-[#08090a]">
        <MoireField
          variant={variant}
          pitch={pitch}
          thickness={thickness / 100}
          calm={isMobile ? "bottom" : "left"}
          calmAmount={0.75}
          className="absolute inset-0 size-full"
        >
          <div className="relative z-10 flex min-h-[560px] flex-col justify-between p-6 sm:p-12">
            <div className="max-w-md pt-4 sm:pt-8">
              <span className="text-xs font-medium text-zinc-400 sm:text-sm">
                Northfield
              </span>
              <h1 className="mt-3 text-[clamp(2.75rem,6vw,5.25rem)] font-semibold leading-[1.05] tracking-tight text-[#f5f5f7]">
                Plan the week once.
              </h1>
              <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-zinc-400 sm:text-base">
                Northfield turns scattered calendars into one calm schedule.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  className="h-[44px] w-full rounded-[10px] bg-[#84ff00] px-6 text-sm font-medium text-[#08090a] transition-opacity hover:opacity-90 active:scale-[0.98] sm:w-auto"
                >
                  Start free
                </button>
                <button
                  type="button"
                  className="h-[44px] w-full rounded-[10px] border border-zinc-700 px-6 text-sm font-medium text-[#f5f5f7] transition-colors hover:border-zinc-500 active:scale-[0.98] sm:w-auto"
                >
                  See how it works
                </button>
              </div>
            </div>

            <div className="mt-6 flex w-full flex-col gap-3 rounded-xl border border-[var(--peel-border,#232730)] bg-[var(--peel-surface,#12141a)] p-2.5 sm:mt-0 sm:w-fit sm:flex-row sm:items-center sm:gap-4 sm:p-1.5 sm:px-3">
              <div
                role="group"
                aria-label="Select pattern variant"
                className="flex items-center gap-1"
              >
                {(["lines", "rings", "dots"] as const).map((v) => {
                  const labels: Record<VariantType, string> = {
                    lines: "Lines",
                    rings: "Rings",
                    dots: "Dots",
                  };
                  const isActive = variant === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setVariant(v)}
                      className={cn(
                        "flex-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors sm:flex-initial",
                        isActive
                          ? "bg-white/[0.12] text-white"
                          : "text-zinc-400 hover:text-zinc-200"
                      )}
                    >
                      {labels[v]}
                    </button>
                  );
                })}
              </div>

              <div className="hidden h-4 w-px bg-[var(--peel-border,#232730)] sm:block" />

              <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start sm:gap-4">
                <div className="flex flex-1 items-center gap-2 sm:flex-initial">
                  <label
                    htmlFor="moire-size"
                    className="text-xs font-sans text-zinc-400 select-none"
                  >
                    Size
                  </label>
                  <input
                    id="moire-size"
                    type="range"
                    min={6}
                    max={32}
                    step={1}
                    value={pitch}
                    onChange={(e) => setPitch(Number(e.target.value))}
                    aria-label="Size"
                    className="h-5 w-full sm:w-20 cursor-pointer appearance-none bg-transparent outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#84ff00] focus-visible:ring-offset-1 focus-visible:ring-offset-[#12141a] rounded [&::-webkit-slider-runnable-track]:h-[2px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[#232730] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[14px] [&::-webkit-slider-thumb]:w-[14px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#84ff00] [&::-webkit-slider-thumb]:-mt-[6px] [&::-moz-range-track]:h-[2px] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[#232730] [&::-moz-range-thumb]:h-[14px] [&::-moz-range-thumb]:w-[14px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#84ff00]"
                  />
                  <span className="w-5 text-right font-sans text-xs tabular-nums text-zinc-300 select-none">
                    {pitch}
                  </span>
                </div>

                <div className="flex flex-1 items-center gap-2 sm:flex-initial">
                  <label
                    htmlFor="moire-thickness"
                    className="text-xs font-sans text-zinc-400 select-none"
                  >
                    Thickness
                  </label>
                  <input
                    id="moire-thickness"
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={thickness}
                    onChange={(e) => setThickness(Number(e.target.value))}
                    aria-label="Thickness"
                    className="h-5 w-full sm:w-20 cursor-pointer appearance-none bg-transparent outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#84ff00] focus-visible:ring-offset-1 focus-visible:ring-offset-[#12141a] rounded [&::-webkit-slider-runnable-track]:h-[2px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[#232730] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[14px] [&::-webkit-slider-thumb]:w-[14px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#84ff00] [&::-webkit-slider-thumb]:-mt-[6px] [&::-moz-range-track]:h-[2px] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[#232730] [&::-moz-range-thumb]:h-[14px] [&::-moz-range-thumb]:w-[14px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#84ff00]"
                  />
                  <span className="w-6 text-right font-sans text-xs tabular-nums text-zinc-300 select-none">
                    {thickness}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </MoireField>
      </div>
    </div>
  );
}

export function MoireFieldPreview() {
  return (
    <div
      aria-hidden="true"
      className="relative size-full min-h-[160px] overflow-hidden rounded-lg bg-[#08090a]"
    >
      <div
        className="pointer-events-none absolute inset-0 size-full"
        style={{
          backgroundImage: `
            repeating-linear-gradient(-22deg, rgba(245, 245, 247, 0.40) 0px, rgba(245, 245, 247, 0.40) 4px, transparent 4px, transparent 9px),
            repeating-linear-gradient(-24deg, rgba(132, 255, 0, 0.90) 0px, rgba(132, 255, 0, 0.90) 4px, transparent 4px, transparent 9px)
          `,
          opacity: 1,
          maskImage: "radial-gradient(ellipse at center, black 65%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 65%, transparent 95%)",
        }}
      />
    </div>
  );
}
