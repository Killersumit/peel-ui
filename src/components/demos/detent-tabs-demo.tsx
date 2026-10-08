"use client";

import * as React from "react";
import { DetentTabs, type DetentTabsRange } from "@/components/ui/detent-tabs";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark";
type AccentColor = "lime" | "ink" | "coral" | "teal";

const DEMO_RANGES: DetentTabsRange[] = [
  {
    id: "7d",
    label: "7 days",
    value: 9420,
    delta: "+3.1%",
    points: [4, 5, 4, 7, 6, 8, 7, 9, 11, 10, 12, 14],
    axis: ["Mon", "Wed", "Fri"],
  },
  {
    id: "30d",
    label: "30 days",
    value: 48210,
    delta: "+12.4%",
    points: [20, 22, 21, 25, 24, 23, 28, 30, 29, 34, 33, 38],
    axis: ["Sep 8", "Sep 18", "Sep 28"],
  },
  {
    id: "90d",
    label: "90 days",
    value: 131860,
    delta: "+27.8%",
    points: [10, 12, 11, 16, 15, 22, 20, 28, 36, 34, 45, 52],
    axis: ["Jul", "Aug", "Sep"],
  },
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
      primary: "#84ff00",
      foreground: "#08090a",
      ring: "#84ff00",
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
    swatch: "#14b8a6",
    light: {
      primary: "#0d9488",
      foreground: "#ffffff",
      ring: "#0d9488",
    },
    dark: {
      primary: "#14b8a6",
      foreground: "#08090a",
      ring: "#14b8a6",
    },
  },
};

export function DetentTabsDemo() {
  const [mode, setMode] = React.useState<ThemeMode>("dark");
  const [accent, setAccent] = React.useState<AccentColor>("lime");
  const [selectedIndex, setSelectedIndex] = React.useState<number>(1);

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
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-1">
          <button
            type="button"
            onClick={() => setMode("light")}
            className={cn(
              "px-2.5 py-1 rounded-md font-medium transition-colors",
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
              "px-2.5 py-1 rounded-md font-medium transition-colors",
              mode === "dark"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Dark
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1">
          {(Object.keys(ACCENTS) as AccentColor[]).map((key) => {
            const sw = ACCENTS[key];
            const isActive = accent === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setAccent(key)}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors",
                  isActive
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title={sw.name}
              >
                <span
                  className="size-3 rounded-full border border-black/20"
                  style={{ backgroundColor: sw.swatch }}
                />
                <span className="hidden sm:inline">{sw.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="detent-tabs-preview-container"
        style={themeVars as React.CSSProperties}
        className={cn(
          "relative min-h-[460px] w-full flex items-center justify-center p-6 sm:p-12 rounded-2xl border border-border bg-background transition-colors duration-200 select-none",
          mode === "dark" && "dark"
        )}
      >
        <div className="w-full max-w-[420px]">
          <DetentTabs
            ranges={DEMO_RANGES}
            title="Revenue"
            formatValue={(n) => `$${n.toLocaleString("en-US")}`}
            index={selectedIndex}
            onIndexChange={setSelectedIndex}
          />
        </div>
      </div>
    </div>
  );
}
