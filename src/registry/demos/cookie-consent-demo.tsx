"use client";

import * as React from "react";
import { CookieConsent } from "@/registry/primitives/cookie-consent";
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

export function CookieConsentDemo() {
  const [mode, setMode] = React.useState<ThemeMode>("light");
  const [accent, setAccent] = React.useState<AccentColor>("ink");
  const [remountKey, setRemountKey] = React.useState(0);

  const isLight = mode === "light";

  const themeVars: Record<string, string> = isLight
    ? {
        "--background": "#f6f6f7",
        "--foreground": "#0f0f10",
        "--card": "#ffffff",
        "--card-foreground": "#0f0f10",
        "--muted-foreground": "#6b6f76",
        "--border": "rgba(15, 15, 16, 0.10)",
        "--primary": "#111113",
        "--primary-foreground": "#ffffff",
        "--ring": "#111113",
      }
    : {
        "--background": "#0b0b0c",
        "--foreground": "#f4f4f5",
        "--card": "#17171a",
        "--card-foreground": "#f4f4f5",
        "--muted-foreground": "#9a9ea6",
        "--border": "rgba(255, 255, 255, 0.11)",
        "--primary": "#f4f4f5",
        "--primary-foreground": "#0b0b0c",
        "--ring": "#f4f4f5",
      };

  if (accent === "lime") {
    themeVars["--primary"] = isLight ? "#3f6e00" : "#84FF00";
    themeVars["--primary-foreground"] = isLight ? "#ffffff" : "#08090A";
    themeVars["--ring"] = isLight ? "#3f6e00" : "#84FF00";
  } else if (accent === "coral") {
    themeVars["--primary"] = "#FF553E";
    themeVars["--primary-foreground"] = "#ffffff";
    themeVars["--ring"] = "#FF553E";
  } else if (accent === "teal") {
    themeVars["--primary"] = isLight ? "#0D9488" : "#14B8A6";
    themeVars["--primary-foreground"] = isLight ? "#ffffff" : "#08090A";
    themeVars["--ring"] = isLight ? "#0D9488" : "#14B8A6";
  }

  const handleReplay = () => {
    setRemountKey((k) => k + 1);
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
        onReplay={handleReplay}
      />

      <div
        style={themeVars as React.CSSProperties}
        className={cn(
          "relative h-[560px] max-[560px]:h-[600px] w-full max-w-[540px] overflow-hidden rounded-2xl border border-border bg-background transition-colors duration-200 select-none shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]",
          mode === "dark" && "dark"
        )}
      >
        <header className="flex h-16 w-full items-center justify-between px-6">
          <span className="text-[16px] font-semibold text-foreground">
            Northfield
          </span>
          <nav className="hidden min-[560px]:flex items-center gap-6 text-[14px] text-muted-foreground">
            <span>Product</span>
            <span>Pricing</span>
            <span>Docs</span>
          </nav>
        </header>

        <main className="flex flex-col items-center justify-center pt-14 text-center px-4">
          <h1 className="max-w-[18ch] text-[clamp(34px,5vw,52px)] font-semibold leading-[1.04] tracking-[-0.035em] text-foreground">
            Plan the week once.
          </h1>
          <p className="mt-4 max-w-[36ch] text-[17px] leading-relaxed text-muted-foreground">
            Northfield turns scattered calendars into one calm schedule.
          </p>
          <div className="mt-6 flex h-[44px] items-center justify-center rounded-xl bg-foreground px-5 text-[14px] font-medium text-background">
            Start free
          </div>
        </main>

        <CookieConsent
          key={remountKey}
          fixed={false}
          placement="bottom-left"
          policyHref="#"
          onSave={() => {}}
        />
      </div>
    </div>
  );
}

export default CookieConsentDemo;
