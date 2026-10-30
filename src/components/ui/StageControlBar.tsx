import * as React from "react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface ColorOption<T extends string = string> {
  id: T;
  label: string;
  swatchHex: string;
}

export interface StageControlBarProps<T extends string = string> {
  theme?: "light" | "dark";
  onThemeChange?: (theme: "light" | "dark") => void;
  colors?: ColorOption<T>[];
  activeColorId?: T;
  onColorChange?: (id: T) => void;
  onReplay?: () => void;
  replayLabel?: string;
  children?: React.ReactNode;
  className?: string;
}

function isDarkColor(hex: string): boolean {
  const clean = hex.replace("#", "");
  let r = 0;
  let g = 0;
  let b = 0;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.slice(0, 2), 16);
    g = parseInt(clean.slice(2, 4), 16);
    b = parseInt(clean.slice(4, 6), 16);
  }
  return 0.299 * r + 0.587 * g + 0.114 * b < 100;
}

export function StageControlBar<T extends string = string>({
  theme,
  onThemeChange,
  colors,
  activeColorId,
  onColorChange,
  onReplay,
  replayLabel = "Replay",
  children,
  className,
}: StageControlBarProps<T>) {
  return (
    <div
      className={cn(
        "w-full max-w-[420px] mx-auto mb-5 flex flex-wrap items-center justify-between gap-2 select-none",
        className
      )}
    >
      <div className="w-full p-1 rounded-[14px] bg-[#0B0C0F] shadow-[inset_0_1px_3px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.06)] flex items-center justify-between gap-1.5">
        {/* Left Pod — Tactile Light | Dark Theme Switch */}
        {onThemeChange && (
          <div
            role="group"
            aria-label="Theme mode"
            className="inline-flex items-center bg-[#060709] p-0.5 rounded-[10px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
          >
            <button
              type="button"
              aria-pressed={theme === "light"}
              onClick={() => onThemeChange("light")}
              className={cn(
                "h-7 px-2.5 rounded-[8px] text-[11.5px] font-medium tracking-[-0.01em] inline-flex items-center gap-1.5 transition-all duration-150 cursor-pointer whitespace-nowrap",
                theme === "light"
                  ? "bg-[#F5F5F7] text-[#08090A] shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
                  : "text-[#8E9299] hover:text-[#F5F5F7]"
              )}
            >
              Light
            </button>
            <button
              type="button"
              aria-pressed={theme === "dark"}
              onClick={() => onThemeChange("dark")}
              className={cn(
                "h-7 px-2.5 rounded-[8px] text-[11.5px] font-medium tracking-[-0.01em] inline-flex items-center gap-1.5 transition-all duration-150 cursor-pointer whitespace-nowrap",
                theme === "dark"
                  ? "bg-[#F5F5F7] text-[#08090A] shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
                  : "text-[#8E9299] hover:text-[#F5F5F7]"
              )}
            >
              Dark
            </button>
          </div>
        )}

        {/* Right Pod — Expanding Color Variable Swatch Keycaps & Actions */}
        <div className="inline-flex items-center gap-1.5 ml-auto">
          {colors && colors.length > 0 && onColorChange && (
            <div
              role="group"
              aria-label="Color accent"
              className="inline-flex items-center gap-1 bg-[#060709] p-0.5 rounded-[10px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
            >
              {colors.map((opt) => {
                const isActive = activeColorId === opt.id;
                const isDark = opt.id === "ink" || isDarkColor(opt.swatchHex);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onColorChange(opt.id)}
                    className={cn(
                      "h-7 rounded-[8px] inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[-0.01em] transition-all duration-150 cursor-pointer whitespace-nowrap",
                      isActive
                        ? "bg-[#1B1E25] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.4)] px-2.5"
                        : "text-[#8E9299] hover:text-[#F5F5F7] px-2"
                    )}
                    title={opt.label}
                  >
                    <span
                      className={cn(
                        "size-2.5 rounded-full shrink-0",
                        isDark ? "ring-1 ring-white/30" : "ring-1 ring-white/15"
                      )}
                      style={{ backgroundColor: opt.swatchHex }}
                    />
                    <span
                      className={cn(
                        isActive ? "inline" : "hidden sm:inline text-[#8E9299]"
                      )}
                    >
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {children}

          {onReplay && (
            <button
              type="button"
              onClick={onReplay}
              className="h-7 px-2.5 rounded-[8px] bg-[#16181E] hover:bg-[#1E2129] text-[11px] font-medium text-[#8E9299] hover:text-[#F5F5F7] inline-flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
              <ArrowCounterClockwise size={12} weight="bold" />
              <span>{replayLabel}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StageControlBar;
