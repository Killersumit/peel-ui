"use client";

import * as React from "react";
import { ReleaseNotes, type ReleaseItem } from "@/components/ui/release-notes";
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
    <div className="w-full max-w-[480px] mx-auto p-1.5 sm:p-3 flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-1.5 text-xs w-full shrink-0">
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

      <div
        id="release-notes-preview-container"
        style={themeVars as React.CSSProperties}
        className={cn(
          "relative w-full flex items-center justify-center transition-colors duration-200",
          mode === "dark" && "dark"
        )}
      >
        <div className="w-full max-w-[480px]">
          <ReleaseNotes releases={DEFAULT_RELEASES} height={480} />
        </div>
      </div>
    </div>
  );
}
ReleaseNotesDemo.displayName = "ReleaseNotesDemo";
