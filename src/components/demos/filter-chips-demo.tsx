"use client";

import * as React from "react";
import { ArrowLeftRight } from "lucide-react";
import {
  FilterChips,
  type FilterChipOption,
} from "@/components/ui/filter-chips";

const ISSUE_FILTERS: FilterChipOption[] = [
  { id: "all", label: "All Issues" },
  { id: "open", label: "Open", count: 14 },
  { id: "pull-requests", label: "Pull Requests", count: 6 },
  { id: "discussions", label: "Discussions", count: 2 },
  { id: "archived", label: "Archived" },
];

export function FilterChipsDemo() {
  const [mode, setMode] = React.useState<"single" | "multiple">("single");
  const [selection, setSelection] = React.useState<string | string[]>("all");
  const nextMode = mode === "single" ? "multiple" : "single";

  const changeMode = () => {
    setSelection((current) => {
      if (nextMode === "multiple") {
        return Array.isArray(current) ? current : current ? [current] : [];
      }
      return Array.isArray(current) ? current[0] ?? "" : current;
    });
    setMode(nextMode);
  };

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-5">
      <div className="flex w-full items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
        <div>
          <p className="text-sm font-medium text-zinc-200">Issue queue</p>
          <p className="mt-1 text-xs text-zinc-500">
            Filter by status or conversation type
          </p>
        </div>
        <button
          type="button"
          aria-label={`Switch to ${nextMode} selection`}
          aria-pressed={mode === "multiple"}
          onClick={changeMode}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 text-[11px] font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
        >
          <ArrowLeftRight aria-hidden="true" className="size-3" />
          {mode === "single" ? "Single" : "Multiple"}
        </button>
      </div>

      <FilterChips
        options={ISSUE_FILTERS}
        mode={mode}
        value={selection}
        onChange={setSelection}
        showClear
        className="w-full justify-center"
      />

      <div className="w-full border-t border-white/[0.08] pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[11px] text-zinc-500">Current selection</span>
          <span className="font-mono text-[10px] tabular-nums text-zinc-600">
            {mode === "single" ? "RADIO" : "MULTI"}
          </span>
        </div>
        <output
          aria-live="polite"
          className="mt-2 block overflow-x-auto rounded-lg border border-zinc-900 bg-black/50 px-3 py-2 font-mono text-xs text-zinc-300"
        >
          {JSON.stringify({ mode, value: selection })}
        </output>
      </div>
    </div>
  );
}
