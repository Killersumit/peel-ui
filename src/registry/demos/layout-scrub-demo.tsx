"use client";

import * as React from "react";
import { LayoutScrub, type LayoutScrubItem } from "@/registry/primitives/layout-scrub";
import { StageControlBar, type ColorOption } from "@/components/ui/StageControlBar";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark";
type AccentColor = "lime" | "ink" | "coral" | "teal";

interface ShapeDef {
  l: number;
  t: number;
  w: number;
  h: number;
  bg: string;
  pill?: boolean;
}

function ThumbnailPreview({
  bg,
  shapes,
}: {
  bg: string;
  shapes: ShapeDef[];
}) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden", bg)}>
      {shapes.map((s, idx) => (
        <div
          key={idx}
          className={cn(
            "absolute",
            s.bg,
            s.pill ? "rounded-full" : "rounded-[2px]"
          )}
          style={{
            left: `${s.l}%`,
            top: `${s.t}%`,
            width: `${s.w}%`,
            height: `${s.h}%`,
          }}
        />
      ))}
    </div>
  );
}

const DEMO_ITEMS: LayoutScrubItem[] = [
  {
    id: "studio",
    title: "Studio",
    meta: "Portfolio",
    trailing: "Free",
    thumbnail: (
      <ThumbnailPreview
        bg="bg-background"
        shapes={[
          { l: 8, t: 26, w: 50, h: 14, bg: "bg-foreground" },
          { l: 8, t: 46, w: 38, h: 14, bg: "bg-foreground" },
          { l: 8, t: 72, w: 20, h: 12, bg: "bg-primary", pill: true },
          { l: 64, t: 22, w: 28, h: 56, bg: "bg-muted" },
        ]}
      />
    ),
  },
  {
    id: "atlas",
    title: "Atlas",
    meta: "Dashboard",
    trailing: "$29",
    thumbnail: (
      <ThumbnailPreview
        bg="bg-foreground"
        shapes={[
          { l: 8, t: 26, w: 56, h: 14, bg: "bg-background" },
          { l: 8, t: 46, w: 44, h: 14, bg: "bg-background" },
          { l: 8, t: 72, w: 20, h: 12, bg: "bg-primary", pill: true },
        ]}
      />
    ),
  },
  {
    id: "northwind",
    title: "Northwind",
    meta: "Store",
    trailing: "$49",
    thumbnail: (
      <ThumbnailPreview
        bg="bg-primary"
        shapes={[
          { l: 8, t: 26, w: 50, h: 14, bg: "bg-primary-foreground" },
          { l: 8, t: 46, w: 36, h: 14, bg: "bg-primary-foreground" },
          { l: 8, t: 72, w: 20, h: 12, bg: "bg-primary-foreground", pill: true },
        ]}
      />
    ),
  },
  {
    id: "pebble",
    title: "Pebble",
    meta: "Landing page",
    trailing: "Free",
    thumbnail: (
      <ThumbnailPreview
        bg="bg-background"
        shapes={[
          { l: 8, t: 22, w: 26, h: 56, bg: "bg-muted" },
          { l: 38, t: 22, w: 26, h: 56, bg: "bg-muted" },
          { l: 68, t: 22, w: 24, h: 56, bg: "bg-primary" },
        ]}
      />
    ),
  },
  {
    id: "orbit",
    title: "Orbit",
    meta: "SaaS",
    trailing: "$39",
    thumbnail: (
      <ThumbnailPreview
        bg="bg-foreground"
        shapes={[
          { l: 0, t: 0, w: 42, h: 100, bg: "bg-primary" },
          { l: 54, t: 30, w: 36, h: 14, bg: "bg-background" },
          { l: 54, t: 52, w: 26, h: 14, bg: "bg-background" },
        ]}
      />
    ),
  },
  {
    id: "fieldnotes",
    title: "Fieldnotes",
    meta: "Blog",
    trailing: "$19",
    thumbnail: (
      <ThumbnailPreview
        bg="bg-muted"
        shapes={[
          { l: 24, t: 28, w: 52, h: 14, bg: "bg-foreground" },
          { l: 32, t: 48, w: 36, h: 14, bg: "bg-foreground" },
          { l: 40, t: 72, w: 20, h: 12, bg: "bg-primary", pill: true },
        ]}
      />
    ),
  },
];

const COLOR_OPTIONS: ColorOption<AccentColor>[] = [
  { id: "lime", label: "Acid Lime", swatchHex: "#84FF00" },
  { id: "ink", label: "Ink", swatchHex: "#18181B" },
  { id: "coral", label: "Coral", swatchHex: "#FF553E" },
  { id: "teal", label: "Teal", swatchHex: "#14B8A6" },
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

export function LayoutScrubDemo() {
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
    <div className="w-full max-w-[420px] mx-auto p-0 sm:p-2 flex flex-col items-center">
      {/* Unified Top Stage Control Bar */}
      <StageControlBar
        theme={mode}
        onThemeChange={setMode}
        colors={COLOR_OPTIONS}
        activeColorId={accent}
        onColorChange={setAccent}
      />

      <div
        id="layout-scrub-preview-container"
        style={themeVars as React.CSSProperties}
        className={cn(
          "relative min-h-[610px] w-full max-w-[400px] flex items-start justify-center p-3 sm:p-4 rounded-2xl border border-border bg-background transition-colors duration-200 select-none shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]",
          mode === "dark" && "dark"
        )}
      >
        <div className="w-full max-w-[380px]">
          <LayoutScrub
            items={DEMO_ITEMS}
            heading="Templates"
            caption="6 templates"
            columns={2}
            defaultView="list"
          />
        </div>
      </div>
    </div>
  );
}

LayoutScrubDemo.displayName = "LayoutScrubDemo";

export default LayoutScrubDemo;
