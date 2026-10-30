"use client";

import * as React from "react";
import { NextUp, type NextUpStep } from "@/registry/primitives/next-up";
import { StageControlBar } from "@/components/ui/StageControlBar";
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
    <div className="w-full max-w-[440px] mx-auto p-0 sm:p-2 flex flex-col items-center">
      {/* Unified Top Stage Control Bar */}
      <StageControlBar
        theme={mode}
        onThemeChange={setMode}
        onReplay={handleReplay}
      >
        <div
          role="group"
          aria-label="Preset"
          className="inline-flex items-center gap-1 bg-[#060709] p-0.5 rounded-[10px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
        >
          {(["initial", "4of5", "allDone"] as const).map((preset) => {
            const labels = { initial: "2 of 5", "4of5": "4 of 5", allDone: "All done" };
            const isActive = statePreset === preset;
            return (
              <button
                key={preset}
                type="button"
                aria-pressed={isActive}
                onClick={() => setStatePreset(preset)}
                className={cn(
                  "h-7 px-2 rounded-[8px] text-[11px] font-medium tracking-[-0.01em] transition-all duration-150 cursor-pointer whitespace-nowrap",
                  isActive
                    ? "bg-[#1B1E25] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.4)]"
                    : "text-[#8E9299] hover:text-[#F5F5F7]"
                )}
              >
                {labels[preset]}
              </button>
            );
          })}
        </div>
      </StageControlBar>

      <div
        style={themeVars as React.CSSProperties}
        className={cn(
          "relative min-h-[500px] w-full max-w-[420px] sm:max-w-[440px] flex items-center justify-center p-3 sm:p-6 rounded-2xl border border-border bg-background transition-colors duration-200 select-none shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]",
          mode === "dark" && "dark"
        )}
      >
        <div className="w-full">
          <NextUp
            key={`${remountKey}-${statePreset}`}
            steps={DEMO_STEPS}
            defaultCompletedIds={completedForPreset}
          />
        </div>
      </div>
    </div>
  );
}

export default NextUpDemo;
