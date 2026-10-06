"use client";

import * as React from "react";
import { NextUp, type NextUpStep } from "@/components/ui/next-up";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark";

const DEMO_STEPS: NextUpStep[] = [
  {
    id: "1",
    title: "Create your workspace",
    description: "Start by setting up your shared team workspace and organization defaults.",
    actionLabel: "Create workspace",
    duration: "1 min",
  },
  {
    id: "2",
    title: "Connect your domain",
    description: "Point your custom apex or subdomain with standard DNS verification.",
    actionLabel: "Connect domain",
    duration: "2 min",
  },
  {
    id: "3",
    title: "Invite a teammate",
    description: "Sites ship faster with a second pair of eyes. Send one invite and you are set.",
    actionLabel: "Send an invite",
    duration: "1 min",
  },
  {
    id: "4",
    title: "Add your first product",
    description: "Add a name, a price and a photo. You can change all of it later.",
    actionLabel: "Add product",
    duration: "3 min",
  },
  {
    id: "5",
    title: "Publish your site",
    description: "Your site goes live at your domain the moment you publish.",
    actionLabel: "Publish",
    duration: "1 min",
  },
];

export function NextUpDemo() {
  const [mode, setMode] = React.useState<ThemeMode>("light");
  const [remountKey, setRemountKey] = React.useState(0);
  const [statePreset, setStatePreset] = React.useState<"initial" | "4of5" | "allDone">("initial");

  const isLight = mode === "light";

  const themeVars: Record<string, string> = isLight
    ? {
        "--background": "#f6f6f7",
        "--foreground": "#0f0f10",
        "--card": "#ffffff",
        "--card-foreground": "#0f0f10",
        "--muted": "#f1f1f3",
        "--muted-foreground": "#6b6f76",
        "--border": "rgba(15, 15, 16, 0.12)",
        "--primary": "#111113",
        "--primary-foreground": "#ffffff",
        "--ring": "#111113",
      }
    : {
        "--background": "#0b0b0c",
        "--foreground": "#f4f4f5",
        "--card": "#17171a",
        "--card-foreground": "#f4f4f5",
        "--muted": "#202024",
        "--muted-foreground": "#9a9ea6",
        "--border": "rgba(255, 255, 255, 0.12)",
        "--primary": "#f4f4f5",
        "--primary-foreground": "#0b0b0c",
        "--ring": "#f4f4f5",
      };

  const completedForPreset = React.useMemo(() => {
    if (statePreset === "4of5") return ["1", "2", "3", "4"];
    if (statePreset === "allDone") return ["1", "2", "3", "4", "5"];
    return ["1", "2"];
  }, [statePreset]);

  const handleReplay = () => {
    setStatePreset("initial");
    setRemountKey((k) => k + 1);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 flex flex-col gap-4">
      <div
        style={themeVars as React.CSSProperties}
        className={cn(
          "relative min-h-[500px] w-full flex items-center justify-center p-4 sm:p-8 rounded-2xl border border-border bg-background transition-colors duration-200 select-none",
          mode === "dark" && "dark"
        )}
      >
        <div className="w-full max-w-[420px]">
          <NextUp
            key={`${remountKey}-${statePreset}`}
            steps={DEMO_STEPS}
            defaultCompletedIds={completedForPreset}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-2">
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
            aria-label="Preset"
            className="inline-flex items-center rounded-lg border border-white/[0.08] bg-[#0c0c0e] p-1 text-[12px]"
          >
            <button
              type="button"
              onClick={() => setStatePreset("initial")}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-colors",
                statePreset === "initial"
                  ? "bg-white/[0.12] text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              2 of 5
            </button>
            <button
              type="button"
              onClick={() => setStatePreset("4of5")}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-colors",
                statePreset === "4of5"
                  ? "bg-white/[0.12] text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              4 of 5
            </button>
            <button
              type="button"
              onClick={() => setStatePreset("allDone")}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-colors",
                statePreset === "allDone"
                  ? "bg-white/[0.12] text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              All done
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReplay}
          className="rounded-lg border border-white/[0.08] bg-[#0c0c0e] px-3 py-1.5 text-[12px] font-medium text-zinc-300 hover:text-white transition-colors"
        >
          Replay
        </button>
      </div>
    </div>
  );
}
