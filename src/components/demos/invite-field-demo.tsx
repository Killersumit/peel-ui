"use client";

import * as React from "react";
import { InviteField } from "@/components/ui/invite-field";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark";
type AccentColor = "lime" | "ink" | "coral" | "teal";

const DEFAULT_EMAILS = [
  "maya@acme.co",
  "dev@startup.io",
  "sam@northwind.com",
  "jo@acme",
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

export function InviteFieldDemo() {
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
        "--destructive": "#dc2626",
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
        "--destructive": "#ff453a",
      };

  const handleSend = async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
  };

  return (
    <div className="w-full max-w-[440px] mx-auto p-2 sm:p-4 flex flex-col gap-3">
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
        id="invite-field-preview-container"
        style={themeVars as React.CSSProperties}
        className={cn(
          "relative min-h-[380px] w-full flex items-center justify-center p-6 sm:p-8 rounded-2xl border border-border bg-background transition-colors duration-200 select-none",
          mode === "dark" && "dark"
        )}
      >
        <div className="w-full max-w-[420px]">
          <InviteField
            defaultValue={DEFAULT_EMAILS}
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
}
InviteFieldDemo.displayName = "InviteFieldDemo";
