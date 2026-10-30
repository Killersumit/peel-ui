"use client";

import * as React from "react";
import {
  FilterChips,
  type FilterChipOption,
} from "@/registry/primitives/filter-chips";

const ISSUE_FILTERS: FilterChipOption[] = [
  { id: "all", label: "All", count: 12 },
  { id: "pull-requests", label: "Pull Requests", count: 6 },
  { id: "discussions", label: "Discussions", count: 2 },
];

export function FilterChipsDemo() {
  const [selection, setSelection] = React.useState<string | string[]>("all");

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-1 overflow-hidden">
      <FilterChips
        options={ISSUE_FILTERS}
        mode="single"
        value={selection}
        onChange={setSelection}
        className="justify-center"
      />
    </div>
  );
}
