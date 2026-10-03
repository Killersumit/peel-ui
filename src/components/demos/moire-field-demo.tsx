"use client";

import * as React from "react";
import { MoireField } from "@/components/ui/moire-field";
import { cn } from "@/lib/utils";

type VariantType = "lines" | "rings" | "dots";

export function MoireFieldDemo() {
  const [variant, setVariant] = React.useState<VariantType>("lines");
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
    <div className="relative min-h-[560px] w-full overflow-hidden rounded-xl border border-zinc-800 bg-[#08090a]">
      <MoireField
        variant={variant}
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

          <div
            role="group"
            aria-label="Select pattern variant"
            className="mt-8 inline-flex w-fit items-center gap-1 rounded-lg border border-white/[0.08] bg-[#0c0c0e]/90 p-1 sm:mt-0"
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
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
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
        </div>
      </MoireField>
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
            repeating-linear-gradient(-22deg, rgba(245, 245, 247, 0.35) 0px, rgba(245, 245, 247, 0.35) 4px, transparent 4px, transparent 9px),
            repeating-linear-gradient(-24deg, rgba(132, 255, 0, 0.25) 0px, rgba(132, 255, 0, 0.25) 4px, transparent 4px, transparent 9px)
          `,
          opacity: 0.85,
          maskImage: "radial-gradient(ellipse at center, black 65%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 65%, transparent 95%)",
        }}
      />
    </div>
  );
}
