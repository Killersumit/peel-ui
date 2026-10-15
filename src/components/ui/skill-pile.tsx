"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkillItem {
  label: string;
  tone?: "accent" | "ink" | "outline";
}

export interface SkillPileProps {
  skills: SkillItem[];
  height?: number | string;
  hint?: string;
  resetLabel?: string;
  className?: string;
}

export function SkillPile({
  skills,
  height = "min(400px, 64vh)",
  hint = "Grab one. Throw it.",
  resetLabel = "Drop again",
  className,
}: SkillPileProps) {
  // Static fallback renders settled pills wrapped at bottom-left before physics starts.
  return (
    <div className={cn("relative w-full", className)}>
      <ul aria-label="Skills" className="sr-only">
        {skills.map((skill, index) => (
          <li key={index}>{skill.label}</li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        style={{ minHeight: height }}
        className="relative w-full overflow-hidden border border-foreground bg-transparent rounded-none flex flex-col justify-end p-3 sm:p-4"
      >
        <div className="flex flex-wrap content-end items-end justify-start gap-2">
          {skills.map((skill, index) => {
            const tone = skill.tone ?? "outline";

            return (
              <span
                key={index}
                className={cn(
                  "h-[50px] px-6 rounded-full whitespace-nowrap font-serif text-[25px] leading-none tracking-[-0.01em] select-none cursor-grab inline-flex items-center justify-center",
                  tone === "accent" && "bg-primary text-primary-foreground",
                  tone === "ink" && "bg-foreground text-background",
                  tone === "outline" &&
                    "bg-background text-foreground [box-shadow:inset_0_0_0_2px_currentColor]"
                )}
              >
                {skill.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between gap-4 w-full">
        <span className="font-mono text-[12px] uppercase tracking-[0.09em] text-muted-foreground">
          {hint}
        </span>
        {resetLabel ? (
          <button
            type="button"
            disabled
            className="font-mono text-[12px] uppercase tracking-[0.09em] text-foreground underline underline-offset-4 decoration-1 decoration-foreground bg-transparent border-0 cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {resetLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
SkillPile.displayName = "SkillPile";
