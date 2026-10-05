"use client";

import * as React from "react";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark";
type AccentColor = "ink" | "lime" | "orange" | "blue";

const ACCENTS: { id: AccentColor; label: string; color: string }[] = [
  { id: "ink", label: "Ink", color: "#111113" },
  { id: "lime", label: "Lime", color: "#7be000" },
  { id: "orange", label: "Orange", color: "#ff5a1f" },
  { id: "blue", label: "Blue", color: "#2563eb" },
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
    themeVars["--primary"] = "#7be000";
    themeVars["--primary-foreground"] = "#0b0b0c";
    themeVars["--ring"] = "#7be000";
  } else if (accent === "orange") {
    themeVars["--primary"] = "#ff5a1f";
    themeVars["--primary-foreground"] = "#ffffff";
    themeVars["--ring"] = "#ff5a1f";
  } else if (accent === "blue") {
    themeVars["--primary"] = "#2563eb";
    themeVars["--primary-foreground"] = "#ffffff";
    themeVars["--ring"] = "#2563eb";
  }

  const handleReplay = () => {
    setRemountKey((k) => k + 1);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 flex flex-col gap-4">
      <div
        style={themeVars as React.CSSProperties}
        className={cn(
          "relative h-[560px] max-[560px]:h-[600px] w-full overflow-hidden rounded-2xl border border-border bg-background transition-colors duration-200 select-none",
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

      <div className="flex flex-wrap items-center justify-between gap-4 px-1">
        <div
          role="group"
          aria-label="Theme"
          className="inline-flex items-center rounded-lg border border-white/[0.08] bg-[#0c0c0e] p-1 text-[12px]"
        >
          <button
            type="button"
            aria-pressed={mode === "light"}
            onClick={() => setMode("light")}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium transition-colors",
              mode === "light"
                ? "bg-white/[0.12] text-white"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            Light
          </button>
          <button
            type="button"
            aria-pressed={mode === "dark"}
            onClick={() => setMode("dark")}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium transition-colors",
              mode === "dark"
                ? "bg-white/[0.12] text-white"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            Dark
          </button>
        </div>

        <div
          role="group"
          aria-label="Accent colour"
          className="inline-flex items-center gap-2.5"
        >
          {ACCENTS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-pressed={accent === item.id}
              onClick={() => setAccent(item.id)}
              className={cn(
                "h-[22px] w-[22px] rounded-full transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090a]",
                accent === item.id
                  ? "scale-110 ring-2 ring-white/60 ring-offset-2 ring-offset-[#08090a]"
                  : "opacity-80 hover:opacity-100 hover:scale-105"
              )}
              style={{
                backgroundColor:
                  item.id === "ink"
                    ? isLight
                      ? "#111113"
                      : "#f4f4f5"
                    : item.color,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleReplay}
          className="rounded px-2 py-1 text-[12px] font-medium text-zinc-400 transition-colors hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Replay
        </button>
      </div>
    </div>
  );
}

export default CookieConsentDemo;
