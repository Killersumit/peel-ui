"use client";

import * as React from "react";
import { ReleaseNotes, type ReleaseItem } from "@/registry/primitives/release-notes";
import { StageControlBar, type ColorOption } from "@/components/ui/StageControlBar";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark";
type AccentColor = "lime" | "ink" | "coral" | "teal";

export const DEFAULT_RELEASES: ReleaseItem[] = [
  {
    version: "2.4",
    date: "Oct 6, 2026",
    title: "Work offline",
    changes: [
      {
        tag: "New",
        lead: "Write on the train.",
        detail: "Everything syncs when you are back.",
      },
      {
        tag: "Improved",
        lead: "Search is twice as fast",
        detail: "on long notes.",
      },
      {
        tag: "Fixed",
        lead: "Pasted images",
        detail: "no longer lose their size.",
      },
    ],
  },
  {
    version: "2.3",
    date: "Sep 15, 2026",
    title: "Share a note as a link",
    changes: [
      {
        tag: "New",
        lead: "Anyone with the link can read.",
        detail: "Nobody can edit.",
      },
      {
        tag: "Improved",
        lead: "The note list",
        detail: "remembers where you scrolled.",
      },
    ],
  },
  {
    version: "2.2",
    date: "Aug 28, 2026",
    title: "Folders. Yes, folders.",
    changes: [
      {
        tag: "New",
        lead: "Drag a note onto a folder",
        detail: "and it goes in.",
      },
      {
        tag: "Fixed",
        lead: "Deleting a tag",
        detail: "no longer clears the search.",
      },
    ],
  },
  {
    version: "2.1",
    date: "Aug 4, 2026",
    title: "A widget for your home screen",
    changes: [
      {
        tag: "New",
        lead: "Pin up to six notes",
        detail: "and open one with a tap.",
      },
      {
        tag: "Improved",
        lead: "Dark mode",
        detail: "now follows sunset.",
      },
    ],
  },
  {
    version: "2.0",
    date: "Jul 9, 2026",
    title: "A new editor",
    changes: [
      {
        tag: "New",
        lead: "Rebuilt from scratch.",
        detail: "Faster, quieter, and it keeps your cursor.",
      },
      {
        tag: "Fixed",
        lead: "About forty small things",
        detail: "we got tired of seeing.",
      },
    ],
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

export function ReleaseNotesDemo() {
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
    <div className="w-full max-w-[480px] mx-auto p-0 sm:p-2 flex flex-col items-center">
      {/* Unified Top Stage Control Bar */}
      <StageControlBar
        theme={mode}
        onThemeChange={setMode}
        colors={COLOR_OPTIONS}
        activeColorId={accent}
        onColorChange={setAccent}
      />

      <div
        id="release-notes-preview-container"
        style={themeVars as React.CSSProperties}
        className={cn(
          "relative w-full max-w-[440px] sm:max-w-[480px] flex items-center justify-center rounded-2xl border border-border bg-background transition-colors duration-200 select-none shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] overflow-hidden",
          mode === "dark" && "dark"
        )}
      >
        <div className="w-full">
          <ReleaseNotes releases={DEFAULT_RELEASES} height={480} />
        </div>
      </div>
    </div>
  );
}

ReleaseNotesDemo.displayName = "ReleaseNotesDemo";

export default ReleaseNotesDemo;
