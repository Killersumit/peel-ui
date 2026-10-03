"use client";

import * as React from "react";
import { MoireIntro } from "@/components/ui/moire-intro";

export function MoireIntroDemo() {
  const [pitch, setPitch] = React.useState(9);
  const [thickness, setThickness] = React.useState(40);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [controlledProgress, setControlledProgress] = React.useState<number | undefined>(undefined);
  const cardRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const p = sp.get("progress");
      if (p !== null) {
        setControlledProgress(Number(p));
        setIsOpen(true);
        return;
      }
    }
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6) {
          setIsOpen(true);
          observer.disconnect();
        }
      },
      { threshold: [0, 0.6, 1.0] }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const handleComplete = React.useCallback(() => {
    setIsCompleted(true);
  }, []);

  const handleReplay = React.useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setIsCompleted(false);
      setIsOpen(true);
    }, 50);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
      <div
        ref={cardRef}
        className="relative min-h-[560px] w-full overflow-hidden rounded-2xl border border-[var(--peel-border,#232730)] bg-[var(--peel-surface,#12141a)]"
      >
        <div className="relative flex min-h-[560px] flex-col justify-between p-6 sm:p-12">
          <div className="max-w-md pt-4 sm:pt-8">
            <span className="text-xs font-medium text-zinc-400 sm:text-sm">
              Northfield
            </span>
            <h1 className="mt-3 text-[clamp(2.75rem,6vw,5.25rem)] font-semibold leading-[1.05] tracking-tight text-[#f5f5f7]">
              Plan the week once.
            </h1>
            <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-zinc-400 sm:text-base">
              Northfield turns scattered calendars into one calm schedule.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className="h-[44px] w-full rounded-[10px] bg-[#84ff00] px-6 text-sm font-medium text-[#08090a] transition-opacity hover:opacity-90 active:scale-[0.98] sm:w-auto"
              >
                Start free
              </button>
              <button
                type="button"
                className="h-[44px] w-full rounded-[10px] border border-zinc-700 px-6 text-sm font-medium text-[#f5f5f7] transition-colors hover:border-zinc-500 active:scale-[0.98] sm:w-auto"
              >
                See how it works
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <MoireIntro
            position="absolute"
            label="Northfield"
            open={isOpen}
            progress={controlledProgress}
            pitch={pitch}
            thickness={thickness / 100}
            onComplete={handleComplete}
          />
        )}

        {isCompleted && (
          <button
            type="button"
            onClick={handleReplay}
            className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-10 rounded-lg border border-zinc-700 bg-[var(--peel-surface,#12141a)] px-3 py-1.5 text-xs font-medium text-[#f5f5f7] transition-colors hover:border-zinc-500 active:scale-95"
          >
            Replay
          </button>
        )}
      </div>

      <div className="mt-4 flex w-full flex-col gap-3 rounded-xl border border-[var(--peel-border,#232730)] bg-[var(--peel-surface,#12141a)] p-3 sm:w-fit sm:flex-row sm:items-center sm:gap-4 sm:p-2 sm:px-3">
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start sm:gap-4">
          <div className="flex flex-1 items-center gap-2 sm:flex-initial">
            <label
              htmlFor="intro-size"
              className="text-xs font-sans text-zinc-400 select-none"
            >
              Size
            </label>
            <input
              id="intro-size"
              type="range"
              min={6}
              max={32}
              step={1}
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              aria-label="Size"
              className="h-5 w-full sm:w-20 cursor-pointer appearance-none bg-transparent outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#84ff00] focus-visible:ring-offset-1 focus-visible:ring-offset-[#12141a] rounded [&::-webkit-slider-runnable-track]:h-[2px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[#232730] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[14px] [&::-webkit-slider-thumb]:w-[14px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#84ff00] [&::-webkit-slider-thumb]:-mt-[6px] [&::-moz-range-track]:h-[2px] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[#232730] [&::-moz-range-thumb]:h-[14px] [&::-moz-range-thumb]:w-[14px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#84ff00]"
            />
            <span className="w-5 text-right font-sans text-xs tabular-nums text-zinc-300 select-none">
              {pitch}
            </span>
          </div>

          <div className="flex flex-1 items-center gap-2 sm:flex-initial">
            <label
              htmlFor="intro-thickness"
              className="text-xs font-sans text-zinc-400 select-none"
            >
              Thickness
            </label>
            <input
              id="intro-thickness"
              type="range"
              min={0}
              max={100}
              step={1}
              value={thickness}
              onChange={(e) => setThickness(Number(e.target.value))}
              aria-label="Thickness"
              className="h-5 w-full sm:w-20 cursor-pointer appearance-none bg-transparent outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#84ff00] focus-visible:ring-offset-1 focus-visible:ring-offset-[#12141a] rounded [&::-webkit-slider-runnable-track]:h-[2px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[#232730] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[14px] [&::-webkit-slider-thumb]:w-[14px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#84ff00] [&::-webkit-slider-thumb]:-mt-[6px] [&::-moz-range-track]:h-[2px] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[#232730] [&::-moz-range-thumb]:h-[14px] [&::-moz-range-thumb]:w-[14px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#84ff00]"
            />
            <span className="w-6 text-right font-sans text-xs tabular-nums text-zinc-300 select-none">
              {thickness}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
