"use client";

import * as React from "react";
import { SkillPile, type SkillItem } from "@/components/ui/skill-pile";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark";
type AccentColor = "lime" | "ink" | "coral" | "teal";

export const DEFAULT_SKILLS: SkillItem[] = [
  { label: "Brand identity", tone: "accent" },
  { label: "Web design", tone: "ink" },
  { label: "Motion", tone: "outline" },
  { label: "React", tone: "ink" },
  { label: "Next.js", tone: "outline" },
  { label: "Figma", tone: "accent" },
  { label: "Copywriting", tone: "outline" },
  { label: "Icons", tone: "ink" },
  { label: "GSAP", tone: "outline" },
  { label: "Tailwind", tone: "accent" },
  { label: "Prototyping", tone: "outline" },
  { label: "Illustration", tone: "ink" },
  { label: "SEO", tone: "outline" },
  { label: "Art direction", tone: "ink" },
];

const ACCENTS: Record<
  AccentColor,
  {
    name: string;
    swatch: string;
    light: { primary: string; foreground: string; ring: string };
    dark: { primary: string; foreground: string; ring: string };
  }
> = {
  lime: {
    name: "Acid Lime",
    swatch: "#84ff00",
    light: {
      primary: "#3f6e00",
      foreground: "#ffffff",
      ring: "#3f6e00",
    },
    dark: {
      primary: "#84ff00",
      foreground: "#08090a",
      ring: "#84ff00",
    },
  },
  ink: {
    name: "Ink",
    swatch: "#111113",
    light: {
      primary: "#0f0f10",
      foreground: "#ffffff",
      ring: "#0f0f10",
    },
    dark: {
      primary: "#f5f5f7",
      foreground: "#08090a",
      ring: "#f5f5f7",
    },
  },
  coral: {
    name: "Coral",
    swatch: "#ff553e",
    light: {
      primary: "#ff553e",
      foreground: "#ffffff",
      ring: "#ff553e",
    },
    dark: {
      primary: "#ff553e",
      foreground: "#ffffff",
      ring: "#ff553e",
    },
  },
  teal: {
    name: "Teal",
    swatch: "#2dd4bf",
    light: {
      primary: "#0f766e",
      foreground: "#ffffff",
      ring: "#0f766e",
    },
    dark: {
      primary: "#2dd4bf",
      foreground: "#08090a",
      ring: "#2dd4bf",
    },
  },
};

export function SkillPileDemo() {
  const [mode, setMode] = React.useState<ThemeMode>("dark");
  const [accent, setAccent] = React.useState<AccentColor>("lime");

  const isLight = mode === "light";
  const activeAccent = ACCENTS[accent];
  const accentTokens = isLight ? activeAccent.light : activeAccent.dark;

  const themeVars: Record<string, string> = isLight
    ? {
        "--background": "#f6f6f7",
        "--foreground": "#0f0f10",
        "--card": "#ffffff",
        "--card-foreground": "#0f0f10",
        "--muted": "#f1f1f3",
        "--muted-foreground": "#6b6f76",
        "--border": "rgba(15, 15, 16, 0.12)",
        "--input": "#e4e4e7",
        "--primary": accentTokens.primary,
        "--primary-foreground": accentTokens.foreground,
        "--ring": accentTokens.ring,
      }
    : {
        "--background": "#0b0b0c",
        "--foreground": "#f4f4f5",
        "--card": "#17171a",
        "--card-foreground": "#f4f4f5",
        "--muted": "#202024",
        "--muted-foreground": "#9a9ea6",
        "--border": "rgba(255, 255, 255, 0.12)",
        "--input": "#2c2f38",
        "--primary": accentTokens.primary,
        "--primary-foreground": accentTokens.foreground,
        "--ring": accentTokens.ring,
      };

  return (
    <div
      id="skill-pile-preview-container"
      style={themeVars as React.CSSProperties}
      className={cn(
        "w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-start gap-8 bg-background text-foreground transition-colors duration-200",
        mode === "dark" && "dark"
      )}
    >
      <div className="flex items-center justify-between gap-2 text-xs w-full max-w-[700px] shrink-0">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5 sm:p-1">
          <button
            type="button"
            onClick={() => setMode("light")}
            className={cn(
              "px-2 py-1 rounded-md font-medium transition-colors text-[11px] sm:text-xs",
              mode === "light"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Light
          </button>
          <button
            type="button"
            onClick={() => setMode("dark")}
            className={cn(
              "px-2 py-1 rounded-md font-medium transition-colors text-[11px] sm:text-xs",
              mode === "dark"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Dark
          </button>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5 sm:p-1">
          {(Object.keys(ACCENTS) as AccentColor[]).map((key) => {
            const sw = ACCENTS[key];
            const isActive = accent === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setAccent(key)}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors text-[11px] sm:text-xs",
                  isActive
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title={sw.name}
              >
                <span
                  className={cn(
                    "size-2.5 sm:size-3 rounded-full shrink-0",
                    key === "ink"
                      ? "border border-zinc-400 dark:border-zinc-500"
                      : "border border-black/20"
                  )}
                  style={{ backgroundColor: sw.swatch }}
                />
                <span className="hidden min-[420px]:inline">{sw.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 w-full max-w-[700px]">
        <span className="font-mono text-xs uppercase tracking-[0.09em] text-muted-foreground">
          Services, as a pile
        </span>
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-[88px] leading-[0.98] tracking-[-0.04em] text-foreground">
          Skills, <em className="italic font-normal">loosely</em> stacked.
        </h1>
      </div>

      <div className="w-full max-w-[700px]">
        <SkillPile skills={DEFAULT_SKILLS} />
      </div>
    </div>
  );
}
SkillPileDemo.displayName = "SkillPileDemo";
