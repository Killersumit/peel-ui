"use client";

import * as React from "react";
import { LayoutScrub, type LayoutScrubItem } from "@/components/ui/layout-scrub";
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
    <div className="w-full max-w-[400px] mx-auto p-2 flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-1.5 text-xs w-full">
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
                  className="size-2.5 sm:size-3 rounded-full border border-black/20 shrink-0"
                  style={{ backgroundColor: sw.swatch }}
                />
                <span className="hidden min-[420px]:inline">{sw.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="layout-scrub-preview-container"
        style={themeVars as React.CSSProperties}
        className={cn(
          "relative min-h-[610px] w-full flex items-start justify-center p-3 sm:p-4 rounded-2xl border border-border bg-background transition-colors duration-200 select-none",
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
