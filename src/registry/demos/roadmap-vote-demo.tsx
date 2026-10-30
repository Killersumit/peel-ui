"use client";

import * as React from "react";
import { RoadmapVote, type RoadmapVoteItem } from "@/registry/primitives/roadmap-vote";
import { StageControlBar, type ColorOption } from "@/components/ui/StageControlBar";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark";
type AccentColor = "lime" | "ink" | "coral" | "teal";

const DEFAULT_ITEMS: RoadmapVoteItem[] = [
  {
    id: "offline",
    title: "Work offline",
    description: "Write on the train. Everything syncs when you are back.",
    status: "Planned",
    votes: 214,
  },
  {
    id: "share-link",
    title: "Share a note as a link",
    description: "Anyone with the link can read it. Nobody can edit.",
    status: "In progress",
    votes: 213,
  },
  {
    id: "folders",
    title: "Folders. Yes, folders.",
    description: "We held out as long as we could.",
    status: "Under review",
    votes: 187,
  },
  {
    id: "widget",
    title: "A widget for your home screen",
    description: "Your pinned notes, one glance away.",
    status: "Planned",
    votes: 142,
  },
  {
    id: "export-markdown",
    title: "Export everything as Markdown",
    description: "One click, plain files, no lock-in.",
    status: "In progress",
    votes: 96,
  },
  {
    id: "voice-notes",
    title: "Voice notes that transcribe themselves",
    description: "Talk while you walk, read it later.",
    status: "Under review",
    votes: 61,
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

export function RoadmapVoteDemo() {
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
    <div className="w-full max-w-[440px] mx-auto p-0 sm:p-2 flex flex-col items-center">
      {/* Unified Top Stage Control Bar */}
      <StageControlBar
        theme={mode}
        onThemeChange={setMode}
        colors={COLOR_OPTIONS}
        activeColorId={accent}
        onColorChange={setAccent}
      />

      <div
        id="roadmap-vote-preview-container"
        style={themeVars as React.CSSProperties}
        className={cn(
          "relative w-full max-w-[420px] sm:max-w-[440px] max-h-[min(68vh,620px)] overflow-y-auto overscroll-contain flex flex-col p-3 sm:p-6 rounded-2xl border border-border bg-background transition-colors duration-200 select-none shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]",
          mode === "dark" && "dark"
        )}
      >
        <div className="w-full">
          <RoadmapVote
            items={DEFAULT_ITEMS}
            heading="What should we build next?"
            caption="Tap a number to vote. The most-voted goes first."
          />
        </div>
      </div>
    </div>
  );
}

RoadmapVoteDemo.displayName = "RoadmapVoteDemo";

export default RoadmapVoteDemo;
