"use client";

import * as React from "react";
import { DetentTabs, type DetentTabsRange } from "@/registry/primitives/detent-tabs";
import { StageControlBar, type ColorOption } from "@/components/ui/StageControlBar";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark";
type AccentColor = "lime" | "ink" | "coral" | "teal";

const COLOR_OPTIONS: ColorOption<AccentColor>[] = [
  { id: "lime", label: "Acid Lime", swatchHex: "#84FF00" },
  { id: "ink", label: "Ink", swatchHex: "#18181B" },
  { id: "coral", label: "Coral", swatchHex: "#FF553E" },
  { id: "teal", label: "Teal", swatchHex: "#14B8A6" },
];

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
    swatch: "#84FF00",
    light: {
      primary: "#3f6e00",
      foreground: "#ffffff",
      ring: "#3f6e00",
    },
    dark: {
      primary: "#84FF00",
      foreground: "#08090A",
      ring: "#84FF00",
    },
  },
  ink: {
    name: "Ink",
    swatch: "#18181B",
    light: {
      primary: "#0f0f10",
      foreground: "#ffffff",
      ring: "#0f0f10",
    },
    dark: {
      primary: "#f5f5f7",
      foreground: "#08090A",
      ring: "#f5f5f7",
    },
  },
  coral: {
    name: "Coral",
    swatch: "#FF553E",
    light: {
      primary: "#FF553E",
      foreground: "#ffffff",
      ring: "#FF553E",
    },
    dark: {
      primary: "#FF553E",
      foreground: "#ffffff",
      ring: "#FF553E",
    },
  },
  teal: {
    name: "Teal",
    swatch: "#14B8A6",
    light: {
      primary: "#0D9488",
      foreground: "#ffffff",
      ring: "#0D9488",
    },
    dark: {
      primary: "#14B8A6",
      foreground: "#08090A",
      ring: "#14B8A6",
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
    <div className="w-full max-w-5xl mx-auto p-0 sm:p-2 flex flex-col items-center">
      {/* Unified Top Stage Control Bar */}
      <StageControlBar
        theme={mode}
        onThemeChange={setMode}
        colors={COLOR_OPTIONS}
        activeColorId={accent}
        onColorChange={setAccent}
      />

      <div
        id="detent-tabs-preview-container"
        style={themeVars as React.CSSProperties}
        className={cn(
          "relative min-h-[460px] w-full max-w-[420px] sm:max-w-[440px] flex items-center justify-center p-3 sm:p-8 rounded-2xl border border-border bg-background transition-colors duration-200 select-none shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]",
          mode === "dark" && "dark"
        )}
      >
        <div className="w-full">
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

export default DetentTabsDemo;
